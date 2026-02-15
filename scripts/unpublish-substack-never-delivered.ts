/**
 * Set the 8 Substack "never delivered" posts to archived in Sanity.
 * They will no longer appear on /blog and will only be at /archive/{slug}.
 *
 * Requires SANITY_WRITE_TOKEN in .env.local.
 *
 * Usage: npx tsx scripts/unpublish-substack-never-delivered.ts
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
const SANITY_WRITE_TOKEN = process.env.SANITY_WRITE_TOKEN;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

const SUBSTACK_NEVER_DELIVERED_SLUGS = [
  "everyone-can-build-their-own-apps",
  "how-chatgpt-saved-my-dogs-life",
  "i-happen-to-life-life-doesnt-happen",
  "its-too-easy-to-build-products",
  "new-new-new",
  "this-is-how-i-build-apps-with-ai",
  "why-ai-isnt-ready-for-anyone",
  "you-dont-understand-success",
];

async function sanityMutate(
  mutations: Record<string, unknown>[],
  ds: string
): Promise<{ transactionId: string; documentIds: string[] }> {
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${ds}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SANITY_WRITE_TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Sanity mutate failed: ${response.status} ${err}`);
  }
  const json = await response.json();
  return {
    transactionId: json.transactionId || "",
    documentIds: (json.results || []).map((r: { id: string }) => r.id),
  };
}

async function main(): Promise<void> {
  console.log("📤 Unpublishing Substack never-delivered posts (set contentStatus → archived)\n");

  if (!SANITY_WRITE_TOKEN) {
    console.error("❌ SANITY_WRITE_TOKEN required in .env.local");
    process.exit(1);
  }

  const documentIds = SUBSTACK_NEVER_DELIVERED_SLUGS.map((slug) => `imported-substack-${slug}`);
  const mutations = documentIds.map((id) => ({
    patch: {
      id,
      set: { contentStatus: "archived" },
    },
  }));

  console.log(`  Dataset: ${dataset}`);
  console.log(`  Patching ${documentIds.length} posts...\n`);

  const result = await sanityMutate(mutations, dataset);

  console.log("✅ Done.");
  console.log(`   Transaction: ${result.transactionId}`);
  console.log(`   Updated: ${result.documentIds.length} documents`);
  console.log("\n   These posts no longer appear on /blog and are only at /archive/{slug}.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
