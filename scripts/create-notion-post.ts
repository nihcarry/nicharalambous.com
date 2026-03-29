/**
 * Create a single post in Sanity from a Notion-exported HTML file.
 *
 * Usage: npx tsx scripts/create-notion-post.ts
 *
 * Requires SANITY_WRITE_TOKEN (Editor) in `.env` or `.env.local`.
 * HTML path and post payload are defined below for the current import.
 */

import "./load-env";

import * as fs from "fs";
import * as path from "path";

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "lsivhm7f";
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-14";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

/** Prefer explicit write token; some setups use alternate names. */
const SANITY_WRITE_TOKEN =
  process.env.SANITY_WRITE_TOKEN ||
  process.env.SANITY_API_WRITE_TOKEN;

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
    console.error(
      "❌ No Sanity write token found. Add SANITY_WRITE_TOKEN (Editor role) to `.env` or `.env.local`.\n" +
      "   See https://www.sanity.io/manage → API → Tokens"
    );
    process.exit(1);
  }

  const htmlPath = path.resolve(__dirname, "output/notion-import-be-the-change.html");
  const rawHtmlBody = fs.readFileSync(htmlPath, "utf-8");

  const slug = "be-the-change-you-want-to-see-in-young-men";
  const docId = `imported-notion-${slug}`;

  const enrichment = {
    excerpt:
      "From a noisy cinema to Louis Theroux’s Manosphere: male role models, algorithms, and choosing to model respect in public instead of only whispering from your seat.",
    seoTitle: "Be the change you want to see in young men",
    seoDescription:
      "A night at the movies, Netflix’s Manosphere, and a call for adults to model considerate, honest behaviour for the next generation.",
    topics: ["agency", "focus", "curiosity"] as string[],
    relatedKeynote: "reclaiming-focus",
    targetKeywords: [
      "Louis Theroux Manosphere",
      "male role models young men",
      "manosphere social media algorithms",
      "considerate public spaces",
      "misogyny young men online",
    ],
    estimatedReadTime: 3,
    faq: [
      {
        question: "Is this article about Project Hail Mary?",
        answer:
          "No. The film sets the scene; the piece is about behaviour in the cinema and how online culture shapes young men.",
      },
      {
        question: "What happened in the cinema?",
        answer:
          "Groups of young men talked through the film; the author asked one group to stop, then reflected after watching Louis Theroux’s Manosphere.",
      },
      {
        question: "What is Manosphere about?",
        answer:
          "The documentary explores how misogyny and toxic online content reach young men through algorithms and influencers.",
      },
      {
        question: "What does “be the change” mean here?",
        answer:
          "Modeling calm, respectful behaviour in public—showing teens what consideration looks like instead of only whisper-yelling from your seat.",
      },
      {
        question: "What should adults do?",
        answer:
          "Call out misogynistic rhetoric when you see it and show alternatives; don’t expect empty online “logic” to debate fairly.",
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
    title: "Be the change you want to see in young men",
    slug: { _type: "slug", current: slug },
    publishedAt: "2026-03-29T13:00:50.566Z",
    excerpt: enrichment.excerpt,
    rawHtmlBody,
    estimatedReadTime: enrichment.estimatedReadTime,
    contentStatus: "published",
    originalUrl: "https://www.notion.so/332401646a3e8058865dd2ac7a3db8e9",
    optimizationNotes:
      "Imported from Notion. Grammar: added missing \"and\" in \"watch it and decide\". Inline image uses Notion S3 presigned URL (short-lived); re-upload to Sanity for stable hosting.",
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
  console.log(`   contentStatus: published (visible on /blog in prod after deploy)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
