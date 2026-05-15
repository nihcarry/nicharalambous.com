/**
 * Import Substack post "The obvious value of stating the obvious" into Sanity.
 *
 * Usage: npx tsx scripts/create-stating-the-obvious-post.ts
 */

import "./load-env";

import * as fs from "fs";
import * as path from "path";
import { urlFor } from "../lib/sanity/image";

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "lsivhm7f";
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-14";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN =
  process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_WRITE_TOKEN;

const SLUG = "the-obvious-value-of-stating-the-obvious";
const DOC_ID = `imported-substack-${SLUG}`;

const IMAGES_DIR = path.resolve(__dirname, "output/stating-the-obvious-images");

const IMAGES = {
  emperor: path.join(IMAGES_DIR, "image-c1089131-aeb8-4959-8137-bdd7401007d5.png"),
  boardroom: path.join(IMAGES_DIR, "image-5bf31a8f-509d-4202-b641-7c67af9766e0.png"),
  mirror: path.join(IMAGES_DIR, "image-9a7fcca3-d5f7-4f7b-8fd5-c9654bc87520.png"),
};

async function sanityQuery<T>(query: string): Promise<T> {
  const params = new URLSearchParams({ query });
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?${params}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) throw new Error(`Query failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  return json.result as T;
}

async function sanityMutate(mutations: Record<string, unknown>[]): Promise<void> {
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) throw new Error(`Mutate failed: ${res.status} ${await res.text()}`);
}

async function uploadImage(
  filePath: string,
  filename: string
): Promise<{ assetId: string; cdnUrl: string }> {
  const data = fs.readFileSync(filePath);
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/assets/images/${DATASET}?filename=${encodeURIComponent(filename)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "image/png",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: data,
  });
  if (!res.ok) {
    throw new Error(`Upload failed for ${filename}: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { document?: { _id: string; url?: string } };
  const assetId = json.document?._id;
  if (!assetId) throw new Error(`No asset id for ${filename}`);
  const cdnUrl = json.document?.url ?? urlFor({ _ref: assetId }).url();
  return { assetId, cdnUrl };
}

function imgTag(src: string, alt: string): string {
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  return `<figure><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" /><figcaption>${esc(alt)}</figcaption></figure>`;
}

/** Match Substack image order: emperor (featured), boardroom mid, mirror at end. */
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

  // 2nd image on Substack (boardroom) — after fraudulent-transaction paragraph
  const boardroomIdx = out.indexOf(boardroomMarker);
  if (boardroomIdx === -1) {
    throw new Error("Could not find boardroom anchor after Say something");
  }
  const boardroomParaEnd = out.indexOf("</p>", boardroomIdx);
  if (boardroomParaEnd === -1) throw new Error("Could not find end of boardroom anchor paragraph");
  out =
    out.slice(0, boardroomParaEnd + 4) + boardroomBlock + out.slice(boardroomParaEnd + 4);

  // 3rd image on Substack (mirror) — after closing paragraph
  const closingIdx = out.lastIndexOf(closingMarker);
  if (closingIdx === -1) throw new Error("Could not find closing paragraph anchor");
  const closingParaEnd = out.indexOf("</p>", closingIdx);
  if (closingParaEnd === -1) throw new Error("Could not find end of closing paragraph");
  out = out.slice(0, closingParaEnd + 4) + mirrorBlock + out.slice(closingParaEnd + 4);

  return out;
}

async function main(): Promise<void> {
  if (!TOKEN) {
    console.error("❌ SANITY_WRITE_TOKEN not set in .env.local");
    process.exit(1);
  }

  for (const [key, p] of Object.entries(IMAGES)) {
    if (!fs.existsSync(p)) {
      console.error(`❌ Missing image (${key}): ${p}`);
      process.exit(1);
    }
  }

  console.log("Uploading images to Sanity…");
  const [mirror, boardroom, emperor] = await Promise.all([
    uploadImage(IMAGES.mirror, "stating-the-obvious-mirror-magritte.png"),
    uploadImage(IMAGES.boardroom, "stating-the-obvious-boardroom-candles.png"),
    uploadImage(IMAGES.emperor, "stating-the-obvious-emperors-new-clothes.png"),
  ]);

  const mdPath = path.resolve(__dirname, "output/substack-stating-the-obvious.md");
  const md = fs.readFileSync(mdPath, "utf-8");
  const { marked } = await import("marked");
  let rawHtmlBody = await marked.parse(md);
  if (typeof rawHtmlBody !== "string") rawHtmlBody = String(rawHtmlBody);
  rawHtmlBody = injectImages(rawHtmlBody, {
    boardroom: boardroom.cdnUrl,
    mirror: mirror.cdnUrl,
  });

  const enrichment = {
    excerpt:
      "From MSISDN jargon at Vodacom to AI hype today: why stating the obvious is a superpower when everyone else stays quiet.",
    seoTitle: "The obvious value of stating the obvious",
    seoDescription:
      "Corporate jargon, AI bamboozle, and the uncanny valley of obviousness — why asking dumb questions saves you (and everyone else).",
    topics: ["agency", "focus", "ai"] as string[],
    relatedKeynote: "reclaiming-focus",
    targetKeywords: [
      "state the obvious at work",
      "corporate jargon MSISDN",
      "AI tool switching workflow",
      "uncanny valley of obviousness",
      "emperor has no clothes leadership",
    ],
    estimatedReadTime: 7,
    faq: [
      {
        question: "What is MSISDN in plain English?",
        answer:
          "A mobile subscriber number — in other words, a customer's cellphone number, often hidden behind telecom jargon.",
      },
      {
        question: "Why is stating the obvious valuable?",
        answer:
          "When people stop saying what everyone can see, the obvious becomes obscure; naming it helps others who were afraid to ask.",
      },
      {
        question: "What is the uncanny valley of obviousness?",
        answer:
          "The uneasy feeling when something is almost believable but slightly off — like hype, politics, or AI claims that don't pass a sniff test.",
      },
      {
        question: "Should you switch AI tools every week?",
        answer:
          "Obviously not — constant tool churn wrecks workflow; it's OK to skip updates or ignore noise when it doesn't serve you.",
      },
      {
        question: "What does DYOR mean in this context?",
        answer:
          "Do your own research — check facts yourself, then state what's obviously true instead of repeating jargon or hype.",
      },
    ],
  };

  const hubs = await sanityQuery<{ _id: string; slug: string }[]>(
    `*[_type == "topicHub"]{ _id, "slug": slug.current }`
  );
  const keynotes = await sanityQuery<{ _id: string; slug: string }[]>(
    `*[_type == "keynote"]{ _id, "slug": slug.current }`
  );

  const topicMap = new Map(hubs.map((h) => [h.slug, h._id]));
  const keynoteMap = new Map(keynotes.map((k) => [k.slug, k._id]));

  const topicRefs = enrichment.topics
    .map((s) => topicMap.get(s))
    .filter((id): id is string => !!id)
    .map((id) => ({ _type: "reference" as const, _ref: id, _key: id }));

  const keynoteId = keynoteMap.get(enrichment.relatedKeynote);
  const relatedKeynote = keynoteId
    ? { _type: "reference" as const, _ref: keynoteId }
    : undefined;

  const faq = enrichment.faq.map((item, i) => ({
    _type: "object",
    _key: `faq-${i}`,
    question: item.question,
    answer: item.answer,
  }));

  const doc = {
    _id: DOC_ID,
    _type: "post",
    title: "The obvious value of stating the obvious",
    slug: { _type: "slug", current: SLUG },
    publishedAt: "2026-05-15T12:00:00.000Z",
    excerpt: enrichment.excerpt,
    rawHtmlBody,
    estimatedReadTime: enrichment.estimatedReadTime,
    contentStatus: "published",
    originalUrl:
      "https://nicharry.substack.com/p/the-obvious-value-of-stating-the",
    optimizationNotes:
      "Imported from Substack (May 2026). Typos: Steve Jobs (was Steven Jobs), an asshole (was as asshole). Inline + featured images on Sanity CDN.",
    featuredImage: {
      _type: "image",
      asset: { _type: "reference", _ref: emperor.assetId },
      alt: "Satirical illustration of tech leaders as naked emperors, with a child pointing out what everyone else ignores.",
    },
    topics: topicRefs.length > 0 ? topicRefs : undefined,
    relatedKeynote: relatedKeynote ?? undefined,
    faq: faq.length > 0 ? faq : undefined,
    targetKeywords: enrichment.targetKeywords,
    seo: {
      _type: "seoFields",
      seoTitle: enrichment.seoTitle,
      seoDescription: enrichment.seoDescription,
    },
  };

  await sanityMutate([{ createOrReplace: doc }]);

  console.log("✅ Post created in Sanity:");
  console.log(`   _id: ${DOC_ID}`);
  console.log(`   slug: ${SLUG}`);
  console.log(`   URL: /blog/${SLUG}`);
  console.log(`   contentStatus: published`);
  console.log("   Deploy for production (webhook or push to main).");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
