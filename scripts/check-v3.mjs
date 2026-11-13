/**
 * Scans the static export for leftovers of the old design.
 * Hits on /blog and /archive articles are reported as Sanity content
 * and do not fail the build. Hits on pages we own fail the build.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const CODE_PATTERNS = [
  ["offset shadow", /shadow-cta|4px 4px 0/],
  ["asterisk pattern", /bg-cta-pattern|bg-mic-pattern|bg-openbook-pattern|bg-quill-pattern|bg-gear-pattern/],
  ["pale box", /bg-brand-50\b|bg-accent-50\b/],
  ["mono eyebrow", /\beyebrow\b|RELATED_\d|FEATURED_\d|RECENT_\d|PILLAR_\d|BUILD_\d/],
  ["centred CTA", /bg-cta-pattern/],
  ["60 minutes", /60 minutes|45 to 60|45-60 minutes/i],
  ["US spelling", /\bcustomized\b|\borganization\b|\bfavorite\b/i],
  ["topic hub eyebrow", /\bTopic Hub\b/],
];

const RETIRED_KEYNOTE =
  /\/keynotes\/(?:curiosity-catalyst|breakthrough-product-teams|breakthrough-teams|reclaiming-focus)\b|The Curiosity Catalyst|How to Build Breakthrough Product Teams|Reclaiming Focus in a World That Profits From Your Distraction/;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      if (name === "studio" || name === "_next") continue;
      walk(path, out);
    } else if (name.endsWith(".html")) out.push(path);
  }
  return out;
}

function routeOf(file) {
  const rel = file.slice(OUT.length).replace(/\\/g, "/").replace(/\.html$/, "");
  if (rel.endsWith("/index") || rel === "/index") return "/";
  return rel || "/";
}

function markup(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");
}

function visible(html) {
  return markup(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ");
}

const sanityRoute = (route) =>
  route.startsWith("/blog/") && !route.startsWith("/blog/page") || route.startsWith("/archive/");

const codeHits = [];
const contentHits = [];

if (!statSync(OUT, { throwIfNoEntry: false })) {
  console.error("No out/ directory. Build first.");
  process.exit(1);
}

for (const file of walk(OUT)) {
  const route = routeOf(file);
  const html = readFileSync(file, "utf8");
  const text = visible(html);
  const body = markup(html);
  const bucket = sanityRoute(route) ? contentHits : codeHits;
  for (const [name, pattern] of CODE_PATTERNS) {
    if (name === "topic hub eyebrow") {
      if (pattern.test(text)) codeHits.push(`${route}: ${name}`);
      continue;
    }
    const source = name === "US spelling" || name === "60 minutes" ? text : html;
    if (pattern.test(source)) bucket.push(`${route}: ${name}`);
  }
  const promo = body.match(/class="plain-card closing-card"[\s\S]{0,900}/);
  if (promo && RETIRED_KEYNOTE.test(promo[0])) codeHits.push(`${route}: retired keynote promo`);
  if (/href="\/keynotes\/(?:curiosity-catalyst|breakthrough-product-teams|breakthrough-teams|reclaiming-focus)"/.test(body)) {
    codeHits.push(`${route}: retired keynote link`);
  }
  if (RETIRED_KEYNOTE.test(text)) bucket.push(`${route}: retired keynote`);
  if (!sanityRoute(route) && html.includes('class="v3') && !/class="v3[^"]*\sp-/.test(html) && !html.includes("pd-")) {
    codeHits.push(`${route}: cream page missing a wallpaper class`);
  }
}

const cssFiles = ["app/v3.css", "app/globals.css"].filter((file) => {
  try {
    statSync(file);
    return true;
  } catch {
    return false;
  }
});
for (const file of cssFiles) {
  const css = readFileSync(file, "utf8");
  if (/shadow-cta|bg-cta-pattern/.test(css)) codeHits.push(`${file}: old CTA class still defined`);
}

function print(title, hits) {
  console.log(`\n${title} (${hits.length})`);
  for (const hit of hits) console.log(`  ${hit}`);
}

print("Code hits", codeHits);
print("Sanity content hits", contentHits);

if (codeHits.length) process.exit(1);
console.log("\nOK: no old-design hits in code-owned pages.");
