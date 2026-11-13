#!/usr/bin/env tsx
/**
 * Validates that CloudFront redirects do NOT overwrite existing app routes.
 *
 * Rule: Redirect sources (the FROM path) must be OLD/LEGACY URLs only.
 * If we have app/businesses/page.tsx, we must NOT redirect /businesses.
 *
 * Run before deploy: npx tsx scripts/validate-redirects.ts
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { Script } from "node:vm";

const INFRA_PATH = join(process.cwd(), "infra", "cloudfront-url-rewrite.js");

// Top-level app routes that have page.tsx (paths that MUST NOT be redirect sources)
const LIVE_ROUTES = [
  "/",
  "/about",
  "/archive",
  "/blog",
  "/books",
  "/building",
  "/contact",
  "/media",
  "/search",
  "/studio",
  "/topics",
] as const;

const RETIRED_SPEAKER = join(process.cwd(), "app", "speaker", "page.tsx");
const RETIRED_KEYNOTES = join(process.cwd(), "app", "keynotes", "page.tsx");
const RETIRED_BUSINESSES = join(process.cwd(), "app", "businesses", "page.tsx");

const DECISION_TRACKR_PRIVACY = "https://decisiontrackr.com/privacy/";
const DECISION_TRACKR_SOURCES = ["/decision-trackr/privacy", "/decision-trackr/privacy/"] as const;
const REDIRECT_HTML = join(process.cwd(), "public", "decision-trackr", "privacy.html");
const RETIRED_PAGE = join(process.cwd(), "app", "decision-trackr", "privacy", "page.tsx");

// /decision-trackr and /decision-trackr/ are rewritten to /decision-trackr.html by the
// CloudFront function. /decision-trackr/index.html is served as is. Both static files
// send visitors to the pricing page and keep the query string so UTMs survive.
const DECISION_TRACKR_PRICING = "https://decisiontrackr.com/pricing/";
const PRICING_REDIRECT_HTML = [
  join(process.cwd(), "public", "decision-trackr.html"),
  join(process.cwd(), "public", "decision-trackr", "index.html"),
] as const;
const RETIRED_LANDING_PAGE = join(process.cwd(), "app", "decision-trackr", "page.tsx");

function extractRedirects(content: string): Map<string, string> {
  const match = content.match(/var redirects = \{([^}]+)\}/s);
  const redirects = new Map<string, string>();
  if (!match) return redirects;
  for (const line of match[1].split("\n")) {
    const m = line.match(/^\s*'([^']+)':\s*'([^']*)'/);
    if (m) redirects.set(m[1], m[2]);
  }
  return redirects;
}

const FUNCTION_BYTE_LIMIT = 10 * 1024;

type CfHeaders = { location?: { value?: string } };
type CfResult = { statusCode?: number; headers?: CfHeaders; uri?: string };
type Handler = (event: {
  request: {
    uri: string;
    querystring: Record<string, { value: string }>;
    headers: Record<string, { value: string }>;
  };
}) => CfResult;

function loadHandler(source: string): Handler {
  const script = new Script(`${source}\n;handler`, {
    filename: "infra/cloudfront-url-rewrite.js",
  });
  const handler = script.runInNewContext({});
  if (typeof handler !== "function") {
    throw new Error("cloudfront-url-rewrite.js does not define handler");
  }
  return handler as Handler;
}

function runHandler(handler: Handler, uri: string, host = "www.nicharalambous.com", accept = "text/html"): CfResult {
  return handler({
    request: {
      uri,
      querystring: {},
      headers: {
        host: { value: host },
        accept: { value: accept },
      },
    },
  });
}

/**
 * Executes the function the way CloudFront would, in a plain JS sandbox.
 * This does not publish anything. It catches a bad map before an operator runs
 * infra/publish-cloudfront-function.sh.
 */
function assertHandler(source: string, redirects: Map<string, string>, errors: string[]) {
  const bytes = Buffer.byteLength(source);
  if (bytes > FUNCTION_BYTE_LIMIT) {
    errors.push(
      `infra/cloudfront-url-rewrite.js is ${bytes} bytes. CloudFront Functions must stay at or under ${FUNCTION_BYTE_LIMIT} bytes.`
    );
  }
  if (source.includes("?.")) {
    errors.push(
      "infra/cloudfront-url-rewrite.js contains optional chaining. The published runtime rejected that syntax (see commit ee4e5f4)."
    );
  }

  let handler: Handler;
  try {
    handler = loadHandler(source);
  } catch (error) {
    errors.push(`Could not run the CloudFront function locally: ${error instanceof Error ? error.message : String(error)}`);
    return;
  }

  for (const [sourcePath, destination] of redirects) {
    const result = runHandler(handler, sourcePath);
    const location = result.headers?.location?.value;
    if (result.statusCode !== 301 || location !== destination) {
      errors.push(
        `handler ${sourcePath} expected 301 ${destination}, got ${result.statusCode ?? "(no status)"} ${location ?? "(no location)"}`
      );
    }
  }

  const dated = runHandler(handler, "/blog/2020/01/15/the-brutality-of-burnout");
  if (dated.statusCode !== 301 || dated.headers?.location?.value !== "/blog/the-brutality-of-burnout") {
    errors.push("Dated blog URLs must 301 to /blog/<slug>.");
  }

  const apex = runHandler(handler, "/", "nicharalambous.com");
  if (apex.statusCode !== 301 || apex.headers?.location?.value !== "https://www.nicharalambous.com") {
    errors.push(
      `Apex host must 301 to https://www.nicharalambous.com, got ${apex.statusCode} ${apex.headers?.location?.value}`
    );
  }

  const about = runHandler(handler, "/about");
  if (about.statusCode || about.uri !== "/about.html") {
    errors.push(`Expected /about to rewrite to /about.html, got ${JSON.stringify(about)}`);
  }

  const aboutSlash = runHandler(handler, "/about/");
  if (aboutSlash.statusCode || aboutSlash.uri !== "/about.html") {
    errors.push(`Expected /about/ to rewrite to /about.html, got ${JSON.stringify(aboutSlash)}`);
  }

  const asset = runHandler(handler, "/_next/static/chunks/example.js");
  if (asset.statusCode || asset.uri !== "/_next/static/chunks/example.js") {
    errors.push("Paths under /_next must be left unchanged.");
  }

  const pricing = runHandler(handler, "/decision-trackr");
  if (pricing.statusCode || pricing.uri !== "/decision-trackr.html") {
    errors.push(
      "/decision-trackr must stay a rewrite to /decision-trackr.html so the static file can keep the query string. Do not add it to the redirect map."
    );
  }

  // After the trailing slash is stripped, the path is looked up again so
  // /old-slug and /old-slug/ share one map entry.
  const apathySlash = runHandler(handler, "/keynotes/escaping-the-apathy-trap/");
  if (
    apathySlash.statusCode !== 301 ||
    apathySlash.headers?.location?.value !== "/keynotes/output-paradox-reengage-teams"
  ) {
    errors.push(
      "Trailing-slash form of /keynotes/escaping-the-apathy-trap must 301 to the Output Paradox page."
    );
  }

  const oldPost = runHandler(handler, "/despair-or-euphoria/");
  if (oldPost.statusCode !== 301 || oldPost.headers?.location?.value !== "/blog/despair-or-euphoria") {
    errors.push("Trailing-slash WordPress slugs must 301 to the current blog post.");
  }

  const rsc = runHandler(handler, "/about", "www.nicharalambous.com", "text/x-component");
  if (rsc.statusCode || rsc.uri !== "/about.txt") {
    errors.push("Accept: text/x-component must rewrite extensionless paths to .txt.");
  }
}

function main() {
  const content = readFileSync(INFRA_PATH, "utf-8");
  const redirects = extractRedirects(content);
  const collisions = [...redirects.keys()].filter((s) =>
    LIVE_ROUTES.includes(s as (typeof LIVE_ROUTES)[number])
  );

  const errors: string[] = [];

  if (collisions.length > 0) {
    errors.push(
      "Redirect sources conflict with live app routes. These paths have page.tsx and must NOT be redirected:"
    );
    collisions.forEach((c) => errors.push(`  - ${c}`));
    errors.push("Remove these from infra/cloudfront-url-rewrite.js");
  }

  for (const source of DECISION_TRACKR_SOURCES) {
    const destination = redirects.get(source);
    if (destination !== DECISION_TRACKR_PRIVACY) {
      errors.push(
        `Expected ${source} to 301 to ${DECISION_TRACKR_PRIVACY}, got ${destination ?? "(missing)"}`
      );
    }
  }

  if (existsSync(RETIRED_PAGE)) {
    errors.push(
      "app/decision-trackr/privacy/page.tsx must stay deleted so the static export does not overwrite the redirect."
    );
  }

  if (!existsSync(REDIRECT_HTML)) {
    errors.push("Missing public/decision-trackr/privacy.html (the object the site deploy uploads).");
  } else {
    const html = readFileSync(REDIRECT_HTML, "utf-8");
    const required = [
      `<link rel="canonical" href="${DECISION_TRACKR_PRIVACY}"`,
      `<meta http-equiv="refresh" content="0; url=${DECISION_TRACKR_PRIVACY}"`,
      `location.replace("${DECISION_TRACKR_PRIVACY}")`,
    ];
    for (const snippet of required) {
      if (!html.includes(snippet)) {
        errors.push(`public/decision-trackr/privacy.html is missing: ${snippet}`);
      }
    }
  }

  if (existsSync(RETIRED_SPEAKER) || existsSync(RETIRED_KEYNOTES) || existsSync(RETIRED_BUSINESSES)) {
    errors.push(
      "app/speaker/page.tsx, app/keynotes/page.tsx and app/businesses/page.tsx must stay deleted. Those URLs 301 in the CloudFront function."
    );
  }

  if (existsSync(RETIRED_LANDING_PAGE)) {
    errors.push(
      "app/decision-trackr/page.tsx must not exist so the static export does not overwrite the pricing redirect."
    );
  }

  for (const file of PRICING_REDIRECT_HTML) {
    const label = file.slice(process.cwd().length + 1);
    if (!existsSync(file)) {
      errors.push(`Missing ${label} (the object the site deploy uploads for the pricing redirect).`);
      continue;
    }
    const html = readFileSync(file, "utf-8");
    const required = [
      `<link rel="canonical" href="${DECISION_TRACKR_PRICING}"`,
      `<meta http-equiv="refresh" content="0; url=${DECISION_TRACKR_PRICING}"`,
      `location.replace("${DECISION_TRACKR_PRICING}" + location.search)`,
    ];
    for (const snippet of required) {
      if (!html.includes(snippet)) {
        errors.push(`${label} is missing: ${snippet}`);
      }
    }
  }

  assertHandler(content, redirects, errors);

  if (errors.length > 0) {
    console.error("ERROR:");
    errors.forEach((error) => console.error(error));
    process.exit(1);
  }

  console.log("OK: No redirect conflicts with live routes.");
  console.log("OK: Handler simulation matches the redirect map.");
  console.log(`OK: /decision-trackr/privacy redirects to ${DECISION_TRACKR_PRIVACY}`);
  console.log(`OK: /decision-trackr redirects to ${DECISION_TRACKR_PRICING} with the query string`);
}

main();
