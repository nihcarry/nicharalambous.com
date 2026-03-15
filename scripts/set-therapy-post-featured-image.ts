/**
 * One-off: upload an image to Sanity and set it as the featured image
 * for the "This is How I Do Therapy" blog post.
 *
 * Usage: npx tsx scripts/set-therapy-post-featured-image.ts <path-to-image.png>
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
const TOKEN = process.env.SANITY_WRITE_TOKEN;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const POST_ID = "imported-notion-this-is-how-i-do-therapy";

async function uploadImage(filePath: string, mimeType: string, filename: string): Promise<string> {
  const data = fs.readFileSync(filePath);
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/assets/images/${DATASET}?filename=${encodeURIComponent(filename)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": mimeType,
      Authorization: `Bearer ${TOKEN}`,
    },
    body: data,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Image upload failed: ${res.status} ${text}`);
  }
  const json = (await res.json()) as { document?: { _id: string }; _id?: string };
  const id = json.document?._id ?? json._id;
  if (!id) throw new Error("No asset _id in response");
  return id;
}

async function patchPost(assetId: string, alt: string): Promise<void> {
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
            id: POST_ID,
            set: {
              featuredImage: {
                _type: "image",
                asset: { _type: "reference", _ref: assetId },
                alt,
              },
            },
          },
        },
      ],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Patch failed: ${res.status} ${text}`);
  }
}

async function main(): Promise<void> {
  if (!TOKEN) {
    console.error("❌ SANITY_WRITE_TOKEN not set in .env.local");
    process.exit(1);
  }

  const imagePath = process.argv[2];
  if (!imagePath || !fs.existsSync(imagePath)) {
    console.error("Usage: npx tsx scripts/set-therapy-post-featured-image.ts <path-to-image.png>");
    process.exit(1);
  }

  const filename = path.basename(imagePath);
  const ext = path.extname(imagePath).toLowerCase();
  const mime = ext === ".png" ? "image/png" : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";

  console.log("Uploading image to Sanity...");
  const assetId = await uploadImage(imagePath, mime, filename);
  console.log("  Asset ID:", assetId);

  const alt =
    "Stylized collage representing mental fortitude: figure with arrow through head and fragmented heart on magenta background.";
  console.log("Patching post with featured image...");
  await patchPost(assetId, alt);
  console.log("✅ Featured image set for post:", POST_ID);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
