/**
 * Topics Listing Page — /topics
 *
 * Slide-based index of topic hubs with a curated narrative flow.
 * Topic hubs bridge blog content to keynotes and link to /topics/{slug}.
 *
 * Content is fetched from Sanity at build time with hardcoded fallbacks.
 *
 * JSON-LD: CollectionPage
 */
import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import {
  topicHubsListQuery,
  type TopicHubListItem,
} from "@/lib/sanity/queries";
import { ClosingCta } from "@/components/site/closing-cta";
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
  alternates: { canonical: "https://www.nicharalambous.com/topics" },
  openGraph: {
    type: "website",
    title: "Topics | Nic Haralambous",
    description:
      "Explore core topics: curiosity, innovation, AI, entrepreneurship, focus, agency, and failure.",
    url: "https://www.nicharalambous.com/topics",
  },
};

const TOPIC_SLUGS_TO_SHOW = new Set([
  "agency",
  "ai",
  "curiosity",
  "entrepreneurship",
  "failure",
  "innovation",
]);

const STORYBOARD_SLIDES = [
  {
    id: "mindset-and-ownership",
    heading: "Mindset and\nOwnership",
    description:
      "Curiosity opens possibility. Agency turns that possibility into action.",
    slugs: ["curiosity", "agency"] as const,
    background: "bg-compass-pattern",
  },
  {
    id: "systems-and-leverage",
    heading: "Systems and Leverage",
    description:
      "Innovation creates momentum. AI multiplies what focused teams can ship.",
    slugs: ["innovation", "ai"] as const,
    background: "bg-lightbulb-pattern",
  },
  {
    id: "execution-and-resilience",
    heading: "Execution and Resilience",
    description:
      "Entrepreneurship rewards builders who can learn quickly from failure.",
    slugs: ["entrepreneurship", "failure"] as const,
    background: "bg-spotlight-pattern",
  },
];

/* ---------- Page ---------- */

export default async function TopicsPage() {
  const cmsTopics = await getTopicHubs();
  const topics = (cmsTopics || FALLBACK_TOPICS).filter((topic) =>
    TOPIC_SLUGS_TO_SHOW.has(topic.slug),
  );
  const topicBySlug = new Map(topics.map((topic) => [topic.slug, topic]));
  const slides = STORYBOARD_SLIDES.map((slide) => ({
    ...slide,
    topics: slide.slugs
      .map((slug) => topicBySlug.get(slug))
      .filter((topic): topic is TopicHubListItem => Boolean(topic)),
  })).filter((slide) => slide.topics.length > 0);

  return (
    <div className="v3 p-compass">
      <JsonLd
        data={collectionPageJsonLd({
          name: "Topics — Nic Haralambous",
          description:
            "Explore core topics: curiosity, innovation, AI, entrepreneurship, focus, agency, and failure.",
          url: "https://www.nicharalambous.com/topics",
        })}
      />
      <section>
        <div className="wrap">
          <h1>Topics</h1>
          <p className="lead">
            The themes that run through Nic&apos;s keynotes, books, and 20+ years of building businesses.
          </p>
          <p className="lead">Explore each topic hub for related articles and keynote pathways.</p>
        </div>
      </section>
      {slides.map((slide) => (
        <section key={slide.id} id={slide.id}>
          <div className="wrap">
            <h2>{slide.heading}</h2>
            <p className="lead">{slide.description}</p>
            <div className="read-list">
              {slide.topics.map((topic) => (
                <a className="row" href={`/topics/${topic.slug}`} key={topic.slug}>
                  <h2>{topic.title}</h2>
                  {topic.oneSentenceSummary ? <p>{topic.oneSentenceSummary}</p> : null}
                </a>
              ))}
            </div>
          </div>
        </section>
      ))}
      <ClosingCta
        className="pd-compass"
        heading="The themes that run through Nic's keynotes"
        copy="Explore each topic hub for related articles and keynote pathways."
        primaryHref="/keynotes/output-paradox-reengage-teams"
        primaryLabel="See the keynote"
      />
    </div>
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
    relatedKeynotes: [],
    seo: null,
  },
  {
    _id: "ft-2",
    title: "Innovation",
    slug: "innovation",
    oneSentenceSummary:
      "Innovation is an outcome, not an action. It requires curiosity, experimentation, and the courage to act on incomplete information.",
    relatedKeynotes: [],
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
    relatedKeynotes: [],
    seo: null,
  },
  {
    _id: "ft-5",
    title: "AI",
    slug: "ai",
    oneSentenceSummary:
      "AI as a tool, not a replacement. How to integrate AI into your product workflow without losing your team's creative edge.",
    relatedKeynotes: [],
    seo: null,
  },
  {
    _id: "ft-6",
    title: "Agency",
    slug: "agency",
    oneSentenceSummary:
      "High agency — the belief that you can influence outcomes — separates breakthrough teams from stagnant ones.",
    relatedKeynotes: [],
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
