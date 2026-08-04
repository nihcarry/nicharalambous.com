/**
 * Import Notion article "The faster you go, the slower the progress" into Sanity.
 *
 * Usage: npx tsx scripts/create-faster-progress-post.ts
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

const SLUG = "the-faster-you-go-the-slower-the-progress";
const DOC_ID = `imported-notion-${SLUG}`;
const VIDEO_URL = "https://www.youtube.com/watch?v=Y8OY1rlmKOA";

const IMAGES_DIR = path.resolve(__dirname, "output/faster-progress-images");

const IMAGES = {
  hero: path.join(IMAGES_DIR, "hero-factory.png"),
  jasonFried: path.join(IMAGES_DIR, "jason-fried-tweet.png"),
  ctoVsEngineer: path.join(IMAGES_DIR, "cto-vs-engineer.png"),
  apathyArch: path.join(IMAGES_DIR, "apathy-arch.png"),
};

async function sanityQuery<T>(query: string, params?: Record<string, string>): Promise<T> {
  const search = new URLSearchParams({ query });
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      search.set(`$${k}`, JSON.stringify(v));
    }
  }
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?${search}`;
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

function injectImages(
  html: string,
  images: { jasonFried: string; ctoVsEngineer: string; apathyArch: string }
): string {
  const jasonBlock = imgTag(
    images.jasonFried,
    "Jason Fried on X: bragging about how much software you ship with AI is like holding down the shutter and bragging about how many photos you took."
  );
  const ctoBlock = imgTag(
    images.ctoVsEngineer,
    "Illustration contrasting a CTO with agency and budget versus a junior engineer blocked by approvals, limited budget, and no prod access."
  );
  const apathyBlock = imgTag(
    images.apathyArch,
    "The Apathy Arch: five stages from curiosity through boredom, apathy, and indifference to exit."
  );

  let out = html;

  const jasonMarker = "leave this here for you to consider";
  const jasonIdx = out.indexOf(jasonMarker);
  if (jasonIdx === -1) throw new Error("Could not find Jason Fried anchor");
  const jasonParaEnd = out.indexOf("</p>", jasonIdx);
  if (jasonParaEnd === -1) throw new Error("Could not find end of Jason Fried anchor paragraph");
  out = out.slice(0, jasonParaEnd + 4) + jasonBlock + out.slice(jasonParaEnd + 4);

  const ctoMarker = "deal with the fallout of the speed you";
  const ctoIdx = out.indexOf(ctoMarker);
  if (ctoIdx === -1) throw new Error("Could not find CTO vs engineer anchor");
  const ctoParaEnd = out.indexOf("</p>", ctoIdx);
  if (ctoParaEnd === -1) throw new Error("Could not find end of CTO anchor paragraph");
  out = out.slice(0, ctoParaEnd + 4) + ctoBlock + out.slice(ctoParaEnd + 4);

  const apathyMarker = "Apathy Arch laid out";
  const apathyIdx = out.indexOf(apathyMarker);
  if (apathyIdx === -1) throw new Error("Could not find Apathy Arch anchor");
  const apathyParaEnd = out.indexOf("</p>", apathyIdx);
  if (apathyParaEnd === -1) throw new Error("Could not find end of Apathy Arch anchor paragraph");
  out = out.slice(0, apathyParaEnd + 4) + apathyBlock + out.slice(apathyParaEnd + 4);

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
  const [hero, jasonFried, ctoVsEngineer, apathyArch] = await Promise.all([
    uploadImage(IMAGES.hero, "faster-progress-hero-factory.png"),
    uploadImage(IMAGES.jasonFried, "faster-progress-jason-fried-tweet.png"),
    uploadImage(IMAGES.ctoVsEngineer, "faster-progress-cto-vs-engineer.png"),
    uploadImage(IMAGES.apathyArch, "faster-progress-apathy-arch.png"),
  ]);

  const mdPath = path.resolve(__dirname, "output/notion-faster-progress.md");
  const md = fs.readFileSync(mdPath, "utf-8");
  const { marked } = await import("marked");
  let rawHtmlBody = await marked.parse(md);
  if (typeof rawHtmlBody !== "string") rawHtmlBody = String(rawHtmlBody);
  rawHtmlBody = injectImages(rawHtmlBody, {
    jasonFried: jasonFried.cdnUrl,
    ctoVsEngineer: ctoVsEngineer.cdnUrl,
    apathyArch: apathyArch.cdnUrl,
  });

  const enrichment = {
    excerpt:
      "AI promises speed, but organisations mistake output for progress. Slow down, fix the basics, and escape the Apathy Arch before your best people check out.",
    seoTitle: "The faster you go, the slower the progress",
    seoDescription:
      "Why AI speed theatre, move-fast experiments, and vanity metrics slow real progress — and how to slow down to speed up.",
    topics: ["ai", "agency", "focus"] as string[],
    relatedKeynote: "output-paradox-reengage-teams",
    relatedKeynoteFallback: "reclaiming-focus",
    targetKeywords: [
      "move fast and break things",
      "AI adoption vanity metric",
      "slow down to speed up",
      "employee apathy arch",
      "organisational speed theatre",
    ],
    estimatedReadTime: 9,
    faq: [
      {
        question: "Why does moving faster slow progress?",
        answer:
          "One-off speed experiments ship without removing bottlenecks; friction grows, reviews lag, and teams drown in iteration while basics stay broken.",
      },
      {
        question: "What is the access gap in organisations?",
        answer:
          "Leaders demand speed but keep approvals, limited budgets, and no prod access for the people actually doing the work.",
      },
      {
        question: "What is the Apathy Arch?",
        answer:
          "A cascade from curiosity to boredom, apathy, indifference, and exit when spare capacity from AI is not turned into meaningful work.",
      },
      {
        question: "Is AI adoption a good metric?",
        answer:
          "Nic argues it has become vanity performance theatre — activity up while curiosity, experimentation, and customer focus decline.",
      },
      {
        question: "What is the fix?",
        answer:
          "Slow down, get HR, data access, fewer processes, customer conversations, and incentives right before building on quicksand.",
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

  const keynoteId =
    keynoteMap.get(enrichment.relatedKeynote) ??
    keynoteMap.get(enrichment.relatedKeynoteFallback);
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
    title: "The faster you go, the slower the progress",
    slug: { _type: "slug", current: SLUG },
    publishedAt: "2026-05-20T12:00:00.000Z",
    excerpt: enrichment.excerpt,
    rawHtmlBody,
    estimatedReadTime: enrichment.estimatedReadTime,
    contentStatus: "published",
    videoEmbed: VIDEO_URL,
    originalUrl:
      "https://www.notion.so/The-faster-you-go-the-slower-the-progress-35f401646a3e8079b270e165290b2933",
    optimizationNotes:
      "Imported from Notion. Images uploaded to Sanity CDN. YouTube read-along: Y8OY1rlmKOA.",
    topics: topicRefs.length > 0 ? topicRefs : undefined,
    relatedKeynote: relatedKeynote ?? undefined,
    faq: faq.length > 0 ? faq : undefined,
    targetKeywords: enrichment.targetKeywords,
    featuredImage: {
      _type: "image",
      asset: { _type: "reference", _ref: hero.assetId },
      alt: "Satirical factory of helmeted workers typing at speed while an artisan carves a wooden bird below — speed versus craft.",
    },
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
  console.log(`   videoEmbed: ${VIDEO_URL}`);
  console.log(`   contentStatus: published`);
  if (relatedKeynote) {
    console.log(`   relatedKeynote: ${keynoteMap.get(enrichment.relatedKeynote) ? enrichment.relatedKeynote : enrichment.relatedKeynoteFallback}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
