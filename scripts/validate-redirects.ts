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

const INFRA_PATH = join(process.cwd(), "infra", "cloudfront-url-rewrite.js");

// Top-level app routes that have page.tsx (paths that MUST NOT be redirect sources)
const LIVE_ROUTES = [
  "/",
  "/about",
  "/archive",
  "/blog",
  "/books",
  "/businesses",
  "/contact",
  "/keynotes",
  "/media",
  "/search",
  "/speaker",
  "/studio",
  "/topics",
] as const;

const DECISION_TRACKR_PRIVACY = "https://decisiontrackr.com/privacy/";
const DECISION_TRACKR_SOURCES = ["/decision-trackr/privacy", "/decision-trackr/privacy/"] as const;
const REDIRECT_HTML = join(process.cwd(), "public", "decision-trackr", "privacy.html");
const RETIRED_PAGE = join(process.cwd(), "app", "decision-trackr", "privacy", "page.tsx");

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

  if (errors.length > 0) {
    console.error("ERROR:");
    errors.forEach((error) => console.error(error));
    process.exit(1);
  }

  console.log("OK: No redirect conflicts with live routes.");
  console.log(`OK: /decision-trackr/privacy redirects to ${DECISION_TRACKR_PRIVACY}`);
}

main();
