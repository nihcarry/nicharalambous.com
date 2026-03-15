/**
 * One-off: create a single post in Sanity from Notion article data.
 * Used by the notion-article-to-blog skill. Loads .env.local for tokens.
 *
 * Usage: npx tsx scripts/create-notion-post.ts
 * (Reads scripts/output/notion-therapy-article.html and creates the post.)
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
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

async function sanityQuery<T>(query: string): Promise<T> {
  const params = new URLSearchParams({ query });
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?${params}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${SANITY_WRITE_TOKEN}` },
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
      Authorization: `Bearer ${SANITY_WRITE_TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) throw new Error(`Mutate failed: ${res.status} ${await res.text()}`);
}

async function main(): Promise<void> {
  if (!SANITY_WRITE_TOKEN) {
    console.error("❌ SANITY_WRITE_TOKEN not set in .env.local");
    process.exit(1);
  }

  const htmlPath = path.resolve(__dirname, "output/notion-therapy-article.html");
  const rawHtmlBody = fs.readFileSync(htmlPath, "utf-8");

  const slug = "this-is-how-i-do-therapy";
  const docId = `imported-notion-${slug}`;

  const enrichment = {
    excerpt:
      "I've been going to therapy for over ten years now. I resisted therapy aggressively when I was in my 20s — here's how I frame it as mental coaching and what I do each month.",
    seoTitle: "This is How I Do Therapy",
    seoDescription:
      "How I frame therapy as mental coaching, find a therapist, and use sessions to build mental models. A practical guide from ten years in therapy.",
    topics: ["focus", "agency", "curiosity"] as string[],
    relatedKeynote: "reclaiming-focus",
    targetKeywords: [
      "how I do therapy",
      "mental coaching",
      "finding a therapist",
      "therapy process",
      "mental models therapy",
    ],
    estimatedReadTime: 12,
    faq: [
      {
        question: "Is therapy a sign of weakness?",
        answer:
          "No. Seeing a psychologist is a sign of strength — that you take your mental health and relationships seriously. Top athletes and CEOs use mental coaches; therapy is the same idea.",
      },
      {
        question: "How do I find a therapist?",
        answer:
          "Ask trusted friends for recommendations, your GP, or use online directories like It's Complicated. Try both in-person and online options; EU in-person can be expensive and oversubscribed.",
      },
      {
        question: "How should I prepare for therapy sessions?",
        answer:
          "Keep a therapy notebook (e.g. in Notion), take notes between sessions on actions and struggles, and build an agenda before each session so you use the time well.",
      },
      {
        question: "Why record therapy sessions?",
        answer:
          "Recording lets you review the conversation, extract mental models and key points, and with AI you can uncover patterns you might miss in the moment.",
      },
      {
        question: "What are mental models in therapy?",
        answer:
          "Frameworks you build with your therapist after a breakthrough — for example awareness of the real size of an irritation, choosing a different response, and changing your mind — that you then test in daily life.",
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
    _id: docId,
    _type: "post",
    title: "This is How I Do Therapy",
    slug: { _type: "slug", current: slug },
    publishedAt: "2026-03-15T14:30:03.566Z",
    excerpt: enrichment.excerpt,
    rawHtmlBody,
    estimatedReadTime: enrichment.estimatedReadTime,
    contentStatus: "in-review",
    originalUrl: "https://www.notion.so/324401646a3e802c86bed352e497a8e0",
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
  console.log(`   _id: ${docId}`);
  console.log(`   slug: ${slug}`);
  console.log(`   URL: /blog/${slug}`);
  console.log(`   contentStatus: in-review (set to Published in Studio to go live)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
