/**
 * Update display title only (slug unchanged).
 * Usage: npx tsx scripts/patch-faster-progress-title.ts
 */
import "./load-env";

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "lsivhm7f";
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-14";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN =
  process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
const DOC_ID = "imported-notion-the-faster-you-go-the-slower-the-progress";
const title = "Move Slow and Fix Things";

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
      mutations: [
        {
          patch: {
            id: DOC_ID,
            set: { title, "seo.seoTitle": title },
          },
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  console.log(`✅ title → "${title}"`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
