/**
 * Import Notion article "Do Not Start a Side Business" into Sanity.
 *
 * Usage: npx tsx scripts/create-four-questions-post.ts
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

const SLUG = "do-not-start-a-side-business";
/** Stable Sanity _id from original import — slug/title can change without migrating _id */
const DOC_ID = "imported-notion-four-important-questions-and-an-announcement";

const IMAGES_DIR = path.resolve(__dirname, "output/four-questions-images");

/** Source URLs from Substack CDN (stable direct S3 paths) */
const IMAGE_SOURCES: Record<string, string> = {
  q1: "https://substack-post-media.s3.amazonaws.com/public/images/65868782-94ab-4348-a716-993a2f4d4860_1280x720.png",
  buyhome: "https://substack-post-media.s3.amazonaws.com/public/images/07b7cb55-252d-468f-8254-f83be0db7471_1222x1288.png",
  q2: "https://substack-post-media.s3.amazonaws.com/public/images/18b5a50e-dd67-4710-a8ea-fb232e848a6e_1280x720.png",
  q3: "https://substack-post-media.s3.amazonaws.com/public/images/df0444ce-073c-4a86-8d06-14cf748fc6e8_1280x720.png",
  q4: "https://substack-post-media.s3.amazonaws.com/public/images/3e757812-dd43-4157-a591-7bc37c99e0a8_1280x720.png",
  nobullship: "https://substack-post-media.s3.amazonaws.com/public/images/3cc65807-bf26-4e82-b70c-504dc1357201_1280x720.png",
};

/** Hero image — Notion presigned URL (expires ~1h; re-fetch from Notion if import fails) */
const NOTION_HERO_URL =
  "https://prod-files-secure.s3.us-west-2.amazonaws.com/628f9256-2b9b-4160-b513-8353a0fb5a6e/216d5809-2f95-4a37-84fe-ae27f966e73c/four_Answers.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U5QCVALI%2F20260611%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260611T141842Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDQaCXVzLXdlc3QtMiJHMEUCIQDnyatSuckTybdGbZcCXN0V%2Fn4mRH8MMJYjtyr3PXu%2F9AIgLZjgd%2FtKI6bJB%2BdWC4sb9es9J8B1u5rSKoRynvYmmksqiAQI%2Ff%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAhqiM7H31n%2BOwbkOyrcAw0%2Bk2g0AsLNfPYNBJtzZ5u%2BShWuvHd1apSXAzPSqsnmmI3H7D5f2dA0quqR8uEkCzptktIxAuU%2BGfdF5MspSmYwOTMC4hw%2BCGMinIkPmaXLDE4npcY8UhHm%2FAPnDi3m4HA8HzYNOgO9v2Rrz%2F5OQfOjiEpzYZI7VDh7v7zRk%2FPnX8cp0w7E3MZKoCfjkzFMY3LY7lwjZyD8lpPDkqJ6oG845kAWH2qfEsz3v%2FgDmhIcEqh2B8ORwecxb45SqF2cQITrJpopYaPPcJdEkX1QXyjh4j2ZDQIu6hzSFLiSMiBw%2BvUxxYcSi9EpTelruSEoCkHA0zHDXpfr6XWPzDxirrSCZPgVEdTGJ9Jk2WlxS2xHB3CqIpymrt0j9KKGPHRSlolSLmxxSlJOWsIOLjbPzTRENo3lxE4dnGS3X0Uz9pxGe%2FclpvCkGb%2F5qi%2Bj7hwoCnljO4jttK9KYRnpK0G%2BHGS2cqjm%2FojhT0ymtMzzvJlJmflQLPzPyNDUSTs9qPOYuVOi89wTx1VAgDnvvveh%2Bd0SPlnUEhjynsgmiuCloNgYU5GdBmP1321IgPOeXzQK7lxjQLSENn1SFm2pSAIX7xK7dTAfFj4kKpDeBGIN7DvEjH5b6j7k7M7I36RzMKu%2BqtEGOqUBsfSFGmXJvcgp8dupFLTwcjVKPrXKwr8t31neJqB45iYMKd269IzbZlHLea%2FySzoJ28OL%2BMQofJeuBXocj3i0fIiebnkpfORr6OZa1gRJ2Zz6OICTaSXgjBbveBiCsnNOWhYzwprMYZBNBjF18TxfiYtz6m6O5BDdB2t4ZZugXhdlJpGETNT1kNEN0eiM3ACkQr0qOnfkQvLJHKKasnUSSrDP36fT&X-Amz-Signature=4e6117dfd8d525d3088b4c7dc108615c7ca3578b60153e109e518dc3b0b7e70d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject";

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

async function downloadImage(url: string, dest: string): Promise<void> {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    throw new Error(`Download failed (${res.status}): ${url}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

async function uploadImage(
  filePath: string,
  filename: string
): Promise<{ assetId: string; cdnUrl: string }> {
  const data = fs.readFileSync(filePath);
  const ext = path.extname(filename).toLowerCase();
  const contentType =
    ext === ".jpg" || ext === ".jpeg"
      ? "image/jpeg"
      : ext === ".webp"
        ? "image/webp"
        : "image/png";

  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/assets/images/${DATASET}?filename=${encodeURIComponent(filename)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": contentType,
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

async function main(): Promise<void> {
  if (!TOKEN) {
    console.error("❌ SANITY_WRITE_TOKEN not set in .env.local");
    process.exit(1);
  }

  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  console.log("Downloading images…");
  const files: Record<string, string> = {
    hero: path.join(IMAGES_DIR, "hero-four-answers.png"),
    q1: path.join(IMAGES_DIR, "question-1-success.png"),
    buyhome: path.join(IMAGES_DIR, "buyhomehelper-screenshot.png"),
    q2: path.join(IMAGES_DIR, "question-2-time.png"),
    q3: path.join(IMAGES_DIR, "question-3-problem.png"),
    q4: path.join(IMAGES_DIR, "question-4-customer.png"),
    nobullship: path.join(IMAGES_DIR, "no-bull-ship-announcement.png"),
  };

  // Hero from Notion; fall back to substack Q1 graphic if presigned URL expired
  try {
    await downloadImage(NOTION_HERO_URL, files.hero);
  } catch {
    console.warn("  ⚠ Notion hero URL unavailable, using Q1 graphic as fallback");
    await downloadImage(IMAGE_SOURCES.q1, files.hero);
  }

  await Promise.all([
    downloadImage(IMAGE_SOURCES.q1, files.q1),
    downloadImage(IMAGE_SOURCES.buyhome, files.buyhome),
    downloadImage(IMAGE_SOURCES.q2, files.q2),
    downloadImage(IMAGE_SOURCES.q3, files.q3),
    downloadImage(IMAGE_SOURCES.q4, files.q4),
    downloadImage(IMAGE_SOURCES.nobullship, files.nobullship),
  ]);

  console.log("Uploading images to Sanity…");
  const [hero, q1, buyhome, q2, q3, q4, nobullship] = await Promise.all([
    uploadImage(files.hero, "four-questions-hero.png"),
    uploadImage(files.q1, "four-questions-q1-success.png"),
    uploadImage(files.buyhome, "four-questions-buyhomehelper.png"),
    uploadImage(files.q2, "four-questions-q2-time.png"),
    uploadImage(files.q3, "four-questions-q3-problem.png"),
    uploadImage(files.q4, "four-questions-q4-customer.png"),
    uploadImage(files.nobullship, "four-questions-no-bull-ship.png"),
  ]);

  let md = fs.readFileSync(
    path.resolve(__dirname, "output/notion-four-questions.md"),
    "utf-8"
  );

  md = md
    .replace("IMAGE_Q1", q1.cdnUrl)
    .replace("IMAGE_BUYHOME", buyhome.cdnUrl)
    .replace("IMAGE_Q2", q2.cdnUrl)
    .replace("IMAGE_Q3", q3.cdnUrl)
    .replace("IMAGE_Q4", q4.cdnUrl)
    .replace("IMAGE_NOBULLSHIP", nobullship.cdnUrl);

  const { marked } = await import("marked");
  let rawHtmlBody = await marked.parse(md);
  if (typeof rawHtmlBody !== "string") rawHtmlBody = String(rawHtmlBody);

  const enrichment = {
    excerpt:
      "Before you sketch mockups or one-shot an app, answer four questions: what success looks like, how much time you have, the single problem, and the exact customer.",
    seoTitle: "Do Not Start a Side Business",
    seoDescription:
      "Four questions every side business needs before you build — plus an announcement about No Bull Ship, an 8-week build sprint starting 8 July.",
    topics: ["entrepreneurship", "focus", "innovation"] as string[],
    relatedKeynote: "breakthrough-product-teams",
    targetKeywords: [
      "side business questions",
      "start a side hustle",
      "define success for your business",
      "ideal customer profile niche",
      "No Bull Ship build sprint",
    ],
    estimatedReadTime: 8,
    faq: [
      {
        question: "What does success look like for a side business?",
        answer:
          "Be specific: replace your job, passive income, retirement savings, or learning a skill. Your answer sets how much time and effort Question 2 must justify.",
      },
      {
        question: "How much time should you allocate to a side business?",
        answer:
          "Audit your week hour by hour — sleep, hobbies, family, exercise — and be honest about spare hours before enthusiasm outruns reality.",
      },
      {
        question: "What problem should a side business solve?",
        answer:
          "One problem, end to end. If your answer includes \"and\", reduce further until you solve a single clear problem for one user type.",
      },
      {
        question: "Who exactly is your customer?",
        answer:
          "Niche beats wide. Paul Graham wrote you build something big by first building something small — define one specific ICP, not a broad demographic range.",
      },
      {
        question: "What is No Bull Ship?",
        answer:
          "An 8-week build sprint starting 8 July for people with a clear idea who are ready to stop making excuses — one problem, one user, one solution to validate with real users.",
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
    title: "Do Not Start a Side Business",
    slug: { _type: "slug", current: SLUG },
    publishedAt: "2026-06-11T12:00:00.000Z",
    excerpt: enrichment.excerpt,
    rawHtmlBody,
    estimatedReadTime: enrichment.estimatedReadTime,
    contentStatus: "published",
    originalUrl:
      "https://www.notion.so/Four-important-questions-and-an-announcement-37b401646a3e8067b7a9d921b51aaa24",
    optimizationNotes:
      "Imported from Notion. Images uploaded to Sanity CDN. Grammar fixes: very, the first question, retrofit, your answer.",
    topics: topicRefs.length > 0 ? topicRefs : undefined,
    relatedKeynote: relatedKeynote ?? undefined,
    faq: faq.length > 0 ? faq : undefined,
    targetKeywords: enrichment.targetKeywords,
    featuredImage: {
      _type: "image",
      asset: { _type: "reference", _ref: hero.assetId },
      alt: "Four questions before you build a side business: success, time, problem, and customer.",
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
  console.log(`   contentStatus: published`);
  console.log(`   images: 7 uploaded to Sanity CDN`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
