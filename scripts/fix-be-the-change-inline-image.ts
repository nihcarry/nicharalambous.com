/**
 * Replace expired Notion presigned image URL in rawHtmlBody with a Sanity CDN asset.
 *
 * Usage:
 *   NOTION_IMAGE_URL="https://prod-files-secure.s3.../image.png?..." npx tsx scripts/fix-be-the-change-inline-image.ts
 *   npx tsx scripts/fix-be-the-change-inline-image.ts "https://..."
 */

import "./load-env";

import { urlFor } from "../lib/sanity/image";

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "lsivhm7f";
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-14";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_WRITE_TOKEN;

const POST_ID = "imported-notion-be-the-change-you-want-to-see-in-young-men";

async function sanityQuery<T>(query: string, params: Record<string, unknown>): Promise<T> {
  const sp = new URLSearchParams({ query });
  for (const [k, v] of Object.entries(params)) {
    sp.set(`$${k}`, JSON.stringify(v));
  }
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?${sp}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
  if (!res.ok) throw new Error(`Query failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  return json.result as T;
}

async function uploadPng(buffer: Buffer, filename: string): Promise<{ assetId: string; cdnUrl: string }> {
  const uploadUrl = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/assets/images/${DATASET}?filename=${encodeURIComponent(filename)}`;
  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "Content-Type": "image/png",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: buffer,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as {
    document?: { _id: string; url?: string };
  };
  const doc = json.document;
  if (!doc?._id) throw new Error("No asset in upload response");
  const assetId = doc._id;
  const cdnUrl = doc.url ?? urlFor({ _ref: assetId }).url();
  return { assetId, cdnUrl };
}

async function patchRawHtml(rawHtmlBody: string): Promise<void> {
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
              rawHtmlBody,
              optimizationNotes:
                "Imported from Notion. Inline theatre photo hosted on Sanity CDN (replaced expired Notion presigned URL).",
            },
          },
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Patch failed: ${res.status} ${await res.text()}`);
}

function replaceNotionImgSrc(html: string, newSrc: string): string {
  if (newSrc.includes('"')) throw new Error("CDN URL contains double quote");
  const out = html.replace(
    /src="https:\/\/[^"]*(?:amazonaws\.com|notion\.so)[^"]*"/,
    `src="${newSrc}"`
  );
  if (out === html) {
    throw new Error(
      "Could not find Notion/AWS img src to replace. Check rawHtmlBody still contains presigned URL."
    );
  }
  return out;
}

async function main(): Promise<void> {
  if (!TOKEN) {
    console.error("Missing SANITY_WRITE_TOKEN");
    process.exit(1);
  }

  const notionUrl = process.env.NOTION_IMAGE_URL || process.argv[2];
  if (!notionUrl?.startsWith("http")) {
    console.error(
      "Set NOTION_IMAGE_URL or pass the Notion image URL as first argument (fresh link from Notion export)."
    );
    process.exit(1);
  }

  console.log("Downloading image from Notion…");
  const imgRes = await fetch(notionUrl);
  if (!imgRes.ok) throw new Error(`Download failed: ${imgRes.status}`);
  const buf = Buffer.from(await imgRes.arrayBuffer());

  console.log("Uploading to Sanity…");
  const { cdnUrl } = await uploadPng(buf, "be-the-change-tuschinski-theater.png");
  console.log("CDN URL:", cdnUrl);

  const row = await sanityQuery<{ rawHtmlBody: string | null }>(
    `*[_id == $id][0]{ rawHtmlBody }`,
    { id: POST_ID }
  );
  if (!row?.rawHtmlBody) throw new Error("Post not found or empty rawHtmlBody");

  const updated = replaceNotionImgSrc(row.rawHtmlBody, cdnUrl);
  await patchRawHtml(updated);
  console.log("✅ Patched post", POST_ID);
  console.log("   Rebuild and deploy for production.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
