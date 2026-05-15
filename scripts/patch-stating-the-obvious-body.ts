/**
 * Rebuild rawHtmlBody + featuredImage to match Substack image order.
 *
 * Substack: 1) emperor (top/featured), 2) boardroom after "Say something.",
 * 3) mirror at end of article.
 *
 * Usage: npx tsx scripts/patch-stating-the-obvious-body.ts
 */

import "./load-env";

import * as fs from "fs";
import * as path from "path";

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "lsivhm7f";
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-14";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN =
  process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_WRITE_TOKEN;

const POST_ID = "imported-substack-the-obvious-value-of-stating-the-obvious";

function imgTag(src: string, alt: string): string {
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  return `<figure><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" /><figcaption>${esc(alt)}</figcaption></figure>`;
}

function injectImages(
  html: string,
  images: { boardroom: string; mirror: string }
): string {
  const boardroomBlock = imgTag(
    images.boardroom,
    "Surrealist boardroom scene: figures with candles for heads, reflecting an obvious truth no one voices aloud."
  );
  const mirrorBlock = imgTag(
    images.mirror,
    "Surrealist painting of a man before a mirror reflecting an empty suit — identity and the obvious truth we avoid naming."
  );

  const boardroomMarker = "then it probably is. Say something.";
  const closingMarker = "There is obvious value in stating the obvious.";

  let out = html;

  const boardroomIdx = out.indexOf(boardroomMarker);
  if (boardroomIdx === -1) throw new Error("Could not find boardroom anchor");
  const boardroomParaEnd = out.indexOf("</p>", boardroomIdx);
  if (boardroomParaEnd === -1) throw new Error("Could not find end of boardroom anchor paragraph");
  out =
    out.slice(0, boardroomParaEnd + 4) + boardroomBlock + out.slice(boardroomParaEnd + 4);

  const closingIdx = out.lastIndexOf(closingMarker);
  if (closingIdx === -1) throw new Error("Could not find closing paragraph anchor");
  const closingParaEnd = out.indexOf("</p>", closingIdx);
  if (closingParaEnd === -1) throw new Error("Could not find end of closing paragraph");
  out = out.slice(0, closingParaEnd + 4) + mirrorBlock + out.slice(closingParaEnd + 4);

  return out;
}

function extractFigureSrc(html: string, altSubstring: string): string | null {
  const altIdx = html.indexOf(altSubstring);
  if (altIdx === -1) return null;
  const chunk = html.slice(Math.max(0, altIdx - 500), altIdx + 200);
  const m = chunk.match(/src="([^"]+)"/);
  return m?.[1] ?? null;
}

async function sanityQuery<T>(
  query: string,
  params: Record<string, string> = {}
): Promise<T> {
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

async function patch(set: Record<string, unknown>): Promise<void> {
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      mutations: [{ patch: { id: POST_ID, set } }],
    }),
  });
  if (!res.ok) throw new Error(`Patch failed: ${res.status} ${await res.text()}`);
}

async function main(): Promise<void> {
  if (!TOKEN) {
    console.error("❌ SANITY_WRITE_TOKEN not set");
    process.exit(1);
  }

  const row = await sanityQuery<{
    rawHtmlBody: string | null;
    featuredImage?: { asset?: { _ref?: string } };
  }>(`*[_id == $id][0]{ rawHtmlBody, featuredImage{ asset } }`, { id: POST_ID });
  if (!row?.rawHtmlBody) throw new Error("Post not found");

  const emperorSrc = extractFigureSrc(
    row.rawHtmlBody,
    "Satirical illustration of tech leaders"
  );
  const boardroomSrc = extractFigureSrc(
    row.rawHtmlBody,
    "Surrealist boardroom scene"
  );
  let mirrorSrc = extractFigureSrc(
    row.rawHtmlBody,
    "Surrealist painting of a man before a mirror"
  );
  if (!mirrorSrc && row.featuredImage?.asset?._ref) {
    const { urlFor } = await import("../lib/sanity/image");
    mirrorSrc = urlFor({ _ref: row.featuredImage.asset._ref }).url();
  }

  if (!emperorSrc || !boardroomSrc || !mirrorSrc) {
    throw new Error("Could not extract all three image URLs from post");
  }

  // Strip any existing inline figures from prior patches
  const cleanHtml = row.rawHtmlBody.replace(/<figure>[\s\S]*?<\/figure>/g, "");

  const mdPath = path.resolve(__dirname, "output/substack-stating-the-obvious.md");
  const md = fs.readFileSync(mdPath, "utf-8");
  const { marked } = await import("marked");
  let html = await marked.parse(md);
  if (typeof html !== "string") html = String(html);

  const rawHtmlBody = injectImages(html, {
    boardroom: boardroomSrc,
    mirror: mirrorSrc,
  });

  const emperorAssets = await sanityQuery<{ _id: string }[]>(
    `*[_type == "sanity.imageAsset" && url == $url]{ _id }`,
    { url: emperorSrc }
  );
  const emperorAssetId = emperorAssets[0]?._id;
  if (!emperorAssetId) throw new Error("Could not resolve emperor asset in Sanity");

  const set: Record<string, unknown> = {
    rawHtmlBody,
    featuredImage: {
      _type: "image",
      asset: { _type: "reference", _ref: emperorAssetId },
      alt: "Satirical illustration of tech leaders as naked emperors, with a child pointing out what everyone else ignores.",
    },
  };

  await patch(set);
  console.log("✅ Patched post to match Substack image order:");
  console.log("   1. Emperor (featured)");
  console.log("   2. Boardroom (after Say something.)");
  console.log("   3. Mirror (end of article)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
