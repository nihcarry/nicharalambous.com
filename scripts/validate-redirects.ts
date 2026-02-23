#!/usr/bin/env tsx
/**
 * Validates that CloudFront redirects do NOT overwrite existing app routes.
 *
 * Rule: Redirect sources (the FROM path) must be OLD/LEGACY URLs only.
 * If we have app/businesses/page.tsx, we must NOT redirect /businesses.
 *
 * Run before deploy: npx tsx scripts/validate-redirects.ts
 */
import { readFileSync } from "fs";
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

function extractRedirectSources(content: string): string[] {
  const match = content.match(/var redirects = \{([^}]+)\}/s);
  if (!match) return [];
  const body = match[1];
  const sources: string[] = [];
  for (const line of body.split("\n")) {
    const m = line.match(/^\s*'([^']+)':/);
    if (m) sources.push(m[1]);
  }
  return sources;
}

function main() {
  const content = readFileSync(INFRA_PATH, "utf-8");
  const sources = extractRedirectSources(content);
  const collisions = sources.filter((s) => LIVE_ROUTES.includes(s as (typeof LIVE_ROUTES)[number]));

  if (collisions.length > 0) {
    console.error(
      "ERROR: Redirect sources conflict with live app routes. These paths have page.tsx and must NOT be redirected:"
    );
    collisions.forEach((c) => console.error(`  - ${c}`));
    console.error("\nRemove these from infra/cloudfront-url-rewrite.js");
    process.exit(1);
  }

  console.log("OK: No redirect conflicts with live routes.");
}

main();
