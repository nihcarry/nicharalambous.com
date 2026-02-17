/**
 * Verify that the Sanity API returns published Speaker page content.
 *
 * Use in CI to fail the build if NEXT_PUBLIC_SANITY_* env vars are missing
 * or wrong (e.g. wrong dataset), so we don't deploy a site that falls back
 * to hardcoded defaults.
 *
 * Run: npx tsx scripts/verify-sanity-speaker.ts
 * Or:  npm run verify:sanity
 */

import * as fs from "fs";
import * as path from "path";

// Load .env.local when run locally (CI provides env via workflow)
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

const speakerPageQuery = `*[_type == "speaker"][0]{ headline, subheadline }`;

function main(): void {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-14";

  if (!projectId) {
    console.error("❌ NEXT_PUBLIC_SANITY_PROJECT_ID is not set.");
    console.error("   In CI, add it as a GitHub Actions secret.");
    process.exit(1);
  }

  const url = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?${new URLSearchParams({ query: speakerPageQuery }).toString()}`;

  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Sanity API returned ${res.status}`);
      }
      return res.json();
    })
    .then((json) => {
      const result = json.result as { headline?: string } | null;
      if (!result || typeof result.headline !== "string") {
        console.error("❌ Speaker page document not found or not published.");
        console.error("   Publish the Speaker Page in Sanity Studio, or check that NEXT_PUBLIC_SANITY_DATASET matches your dataset.");
        process.exit(1);
      }
      console.log("✅ Sanity Speaker page OK:", result.headline.slice(0, 50) + (result.headline.length > 50 ? "…" : ""));
    })
    .catch((err) => {
      console.error("❌ Sanity fetch failed:", err.message);
      if (err.message.includes("undefined")) {
        console.error("   Check that NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET are set in CI secrets.");
      }
      process.exit(1);
    });
}

main();
