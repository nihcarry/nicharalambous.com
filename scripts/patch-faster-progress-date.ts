/**
 * Set publishedAt to publish date (May 20, 2026).
 * Usage: npx tsx scripts/patch-faster-progress-date.ts
 */
import "./load-env";

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "lsivhm7f";
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-14";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN =
  process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
const DOC_ID = "imported-notion-the-faster-you-go-the-slower-the-progress";
const publishedAt = "2026-05-20T12:00:00.000Z";

async function main(): Promise<void> {
  if (!TOKEN) {
    console.error("❌ SANITY_WRITE_TOKEN not set");
    process.exit(1);
  }
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      mutations: [{ patch: { id: DOC_ID, set: { publishedAt } } }],
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  console.log(`✅ publishedAt → ${publishedAt} (May 20, 2026)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
