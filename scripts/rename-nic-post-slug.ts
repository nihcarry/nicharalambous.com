/**
 * Renames the main article title + slug, updates the companion post's
 * back-link, and adds a 301 redirect from the old URL.
 *
 * Usage: npx tsx scripts/rename-nic-post-slug.ts
 */

import * as fs from "fs";
import * as path from "path";

const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.substring(0, eqIndex).trim();
    const value = trimmed.substring(eqIndex + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "lsivhm7f";
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-14";
const DATASET = "production";
const TOKEN = process.env.SANITY_WRITE_TOKEN;
if (!TOKEN) { console.error("❌ SANITY_WRITE_TOKEN not found"); process.exit(1); }

const OLD_SLUG = "i-rebuilt-my-entire-personal-website-using-ai-so-you-never-have-to";
const NEW_SLUG = "the-gap-between-what-ai-promises-and-what-it-delivers-is-exactly-the-size-of-your-experience";
const NEW_TITLE = "The gap between what AI promises and what it delivers is exactly the size of your experience.";

const NIC_POST_ID       = `post-${OLD_SLUG}`;
const COMPANION_POST_ID = "post-what-it-was-like-building-nicharalambous-com-from-scratch";

async function sanityMutate(mutations: Record<string, unknown>[]) {
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) { const t = await res.text(); throw new Error(`Mutate failed ${res.status}: ${t}`); }
  return res.json();
}

async function main() {
  console.log("1️⃣   Updating main post title and slug...");
  await sanityMutate([{
    patch: {
      id: NIC_POST_ID,
      set: {
        title: NEW_TITLE,
        "slug.current": NEW_SLUG,
        "seo.seoTitle": NEW_TITLE,
        "seo.seoDescription":
          "AI tools are only as good as the person directing them. I rebuilt my entire website for under $250 — vs a $20,000 agency quote. Here's what that actually took, and why you probably shouldn't try it.",
      },
    },
  }]);
  console.log("   ✅ Done.");

  console.log("2️⃣   Updating companion post back-link to new slug...");
  // The italic note is always body[0] with one markDef pointing to the old slug.
  await sanityMutate([{
    patch: {
      id: COMPANION_POST_ID,
      set: {
        "body[0].markDefs[0].href": `/blog/${NEW_SLUG}`,
      },
    },
  }]);
  console.log("   ✅ Done.");

  console.log("3️⃣   Creating 301 redirect from old URL to new URL...");
  await sanityMutate([{
    createOrReplace: {
      _id: `redirect-${OLD_SLUG}`,
      _type: "redirect",
      source: `/blog/${OLD_SLUG}`,
      destination: `/blog/${NEW_SLUG}`,
      statusCode: 301,
      notes: "Title/slug rename — March 2026",
    },
  }]);
  console.log("   ✅ Done.");

  console.log("");
  console.log(`🔗  New URL: /blog/${NEW_SLUG}`);
  console.log(`↩️   Redirect: /blog/${OLD_SLUG}  →  /blog/${NEW_SLUG}`);
  console.log("");
  console.log("Next: run /build-deploy to push the new slug and redirect live.");
}

main().catch((err) => { console.error("❌", err.message); process.exit(1); });
