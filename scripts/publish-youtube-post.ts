/**
 * One-off: Upload featured image and publish the YouTube-imported post.
 *
 * Usage: npx tsx scripts/publish-youtube-post.ts <post-id> <image-path> "<alt-text>"
 */

import "./load-env";
import * as fs from "fs";
import * as path from "path";

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "lsivhm7f";
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-14";
const TOKEN = process.env.SANITY_WRITE_TOKEN;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

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

async function patchPost(postId: string, assetId: string, alt: string): Promise<void> {
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
            id: postId,
            set: {
              featuredImage: {
                _type: "image",
                asset: { _type: "reference", _ref: assetId },
                alt,
              },
              contentStatus: "published",
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
    console.error("❌ SANITY_WRITE_TOKEN not set");
    process.exit(1);
  }

  const postId = process.argv[2];
  const imagePath = process.argv[3];
  const alt = process.argv[4] || "Featured image";

  if (!postId || !imagePath) {
    console.error("Usage: npx tsx scripts/publish-youtube-post.ts <post-id> <image-path> \"<alt-text>\"");
    process.exit(1);
  }

  if (!fs.existsSync(imagePath)) {
    console.error(`❌ Image not found: ${imagePath}`);
    process.exit(1);
  }

  const filename = path.basename(imagePath);
  const ext = path.extname(imagePath).toLowerCase();
  const mime = ext === ".png" ? "image/png" : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";

  console.log(`📸 Uploading image: ${filename}`);
  const assetId = await uploadImage(imagePath, mime, filename);
  console.log(`   Asset ID: ${assetId}`);

  console.log(`📝 Patching post: ${postId}`);
  await patchPost(postId, assetId, alt);
  
  console.log(`✅ Post published with featured image`);
  console.log(`   Post ID: ${postId}`);
  console.log(`   Status: published`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
