/**
 * Topics Listing Page — /topics
 *
 * Index of all 7 topic hubs. Each links to /topics/{slug}.
 * Topic hubs bridge blog content to keynotes — they're the
 * core of the internal linking strategy.
 *
 * Content is fetched from Sanity at build time with hardcoded fallbacks.
 *
 * JSON-LD: CollectionPage
 */
import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import {
  topicHubsListQuery,
  type TopicHubListItem,
} from "@/lib/sanity/queries";
import { CTAButton } from "@/components/cta-button";
import { Section } from "@/components/section";
import { JsonLd } from "@/components/json-ld";
import { collectionPageJsonLd } from "@/lib/metadata";

/* ---------- Data fetching ---------- */

async function getTopicHubs(): Promise<TopicHubListItem[] | null> {
  try {
    const data = await client.fetch<TopicHubListItem[]>(topicHubsListQuery);
    return data && data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

/* ---------- Metadata ---------- */

export const metadata: Metadata = {
  title: "Topics",
  description:
    "Explore Nic Haralambous's core topics: curiosity, innovation, entrepreneurship, focus, AI, agency, and failure. Each topic bridges blog content to keynotes.",
  alternates: { canonical: "https://nicharalambous.com/topics" },
  openGraph: {
    title: "Topics | Nic Haralambous",
    description:
      "Explore core topics: curiosity, innovation, AI, entrepreneurship, focus, agency, and failure.",
    url: "https://nicharalambous.com/topics",
  },
};

/* ---------- Page ---------- */

export default async function TopicsPage() {
  const cmsTopics = await getTopicHubs();
  const topics = cmsTopics || FALLBACK_TOPICS;

  return (
    <>
      {/* Structured data */}
      <JsonLd
        data={collectionPageJsonLd({
          name: "Topics — Nic Haralambous",
          description:
            "Explore core topics: curiosity, innovation, AI, entrepreneurship, focus, agency, and failure.",
          url: "https://nicharalambous.com/topics",
        })}
      />

      <Section width="content" className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-brand-900 sm:text-5xl">
          Topics
        </h1>
        <p className="mt-4 text-lg text-brand-600">
          The themes that run through Nic&rsquo;s keynotes, books, and 20+ years
          of building businesses. Dive into any topic to explore related
          articles and keynotes.
        </p>
      </Section>

      <Section width="wide">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              className="group flex flex-col rounded-xl border border-brand-200 p-6 transition-all hover:border-accent-400 hover:shadow-md"
            >
              <h2 className="text-xl font-bold text-brand-900 group-hover:text-accent-600">
                {topic.title}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-600">
                {topic.oneSentenceSummary}
              </p>
              {topic.relatedKeynotes && topic.relatedKeynotes.length > 0 && (
                <div className="mt-4 border-t border-brand-100 pt-4">
                  <p className="text-xs font-medium text-brand-400">
                    Related keynotes:
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {topic.relatedKeynotes.map((keynote) => (
                      <span
                        key={keynote._id}
                        className="rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-accent-600"
                      >
                        {keynote.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section width="content" className="text-center">
        <h2 className="text-2xl font-bold text-brand-900 sm:text-3xl">
          Explore These Topics as a Keynote
        </h2>
        <p className="mt-4 text-lg text-brand-600">
          Every topic above comes alive in Nic&rsquo;s virtual keynotes. Real
          stories, actionable frameworks, tailored to your team.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <CTAButton href="/speaker">About Nic as a Speaker</CTAButton>
          <CTAButton href="/keynotes" variant="secondary">
            View All Keynotes
          </CTAButton>
        </div>
      </Section>
    </>
  );
}

/* ---------- Fallback data ---------- */

const FALLBACK_TOPICS: TopicHubListItem[] = [
  {
    _id: "ft-1",
    title: "Curiosity",
    slug: "curiosity",
    oneSentenceSummary:
      "Curiosity is the god particle of innovation — the fundamental force that drives experimentation, learning, and breakthrough thinking.",
    relatedKeynotes: [
      { _id: "k1", title: "The Curiosity Catalyst", slug: "curiosity-catalyst" },
      { _id: "k2", title: "Breakthrough Product Teams", slug: "breakthrough-product-teams" },
    ],
    seo: null,
  },
  {
    _id: "ft-2",
    title: "Innovation",
    slug: "innovation",
    oneSentenceSummary:
      "Innovation is an outcome, not an action. It requires curiosity, experimentation, and the courage to act on incomplete information.",
    relatedKeynotes: [
      { _id: "k2", title: "Breakthrough Product Teams", slug: "breakthrough-product-teams" },
      { _id: "k1", title: "The Curiosity Catalyst", slug: "curiosity-catalyst" },
    ],
    seo: null,
  },
  {
    _id: "ft-3",
    title: "Entrepreneurship",
    slug: "entrepreneurship",
    oneSentenceSummary:
      "Building businesses from scratch — the Do/Fail/Learn/Repeat cycle, resilience, and why 'just avoid dying' is sometimes the best strategy.",
    relatedKeynotes: [],
    seo: null,
  },
  {
    _id: "ft-4",
    title: "Focus",
    slug: "focus",
    oneSentenceSummary:
      "In an attention economy, focus is your most valuable resource. The DIAL framework helps teams reclaim deep work.",
    relatedKeynotes: [
      { _id: "k3", title: "Reclaiming Focus", slug: "reclaiming-focus" },
    ],
    seo: null,
  },
  {
    _id: "ft-5",
    title: "AI",
    slug: "ai",
    oneSentenceSummary:
      "AI as a tool, not a replacement. How to integrate AI into your product workflow without losing your team's creative edge.",
    relatedKeynotes: [
      { _id: "k2", title: "Breakthrough Product Teams", slug: "breakthrough-product-teams" },
    ],
    seo: null,
  },
  {
    _id: "ft-6",
    title: "Agency",
    slug: "agency",
    oneSentenceSummary:
      "High agency — the belief that you can influence outcomes — separates breakthrough teams from stagnant ones.",
    relatedKeynotes: [
      { _id: "k3", title: "Reclaiming Focus", slug: "reclaiming-focus" },
      { _id: "k2", title: "Breakthrough Product Teams", slug: "breakthrough-product-teams" },
    ],
    seo: null,
  },
  {
    _id: "ft-7",
    title: "Failure",
    slug: "failure",
    oneSentenceSummary:
      "Failure is data, not destiny. Blameless postmortems and post-traumatic growth build stronger, more resilient teams.",
    relatedKeynotes: [],
    seo: null,
  },
];
