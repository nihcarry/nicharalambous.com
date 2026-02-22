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
import Link from "next/link";
import Image from "next/image";
import { client } from "@/lib/sanity/client";
import {
  topicHubsListQuery,
  type TopicHubListItem,
} from "@/lib/sanity/queries";
import { CTAButton } from "@/components/cta-button";
import { Slide } from "@/components/slide";
import { SlideDeck } from "@/components/slide-deck";
import { SlideContent } from "@/components/slide-animations";
import { NextSlideIndicator } from "@/components/next-slide-indicator";
import { FooterContent } from "@/components/footer-content";
import { JsonLd } from "@/components/json-ld";
import { collectionPageJsonLd } from "@/lib/metadata";
import { tilt } from "@/lib/tilt";

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
    type: "website",
    title: "Topics | Nic Haralambous",
    description:
      "Explore core topics: curiosity, innovation, AI, entrepreneurship, focus, agency, and failure.",
    url: "https://nicharalambous.com/topics",
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
    <SlideDeck>
      <NextSlideIndicator />

      {/* Structured data */}
      <JsonLd
        data={collectionPageJsonLd({
          name: "Topics — Nic Haralambous",
          description:
            "Explore core topics: curiosity, innovation, AI, entrepreneurship, focus, agency, and failure.",
          url: "https://nicharalambous.com/topics",
        })}
      />

      <Slide
        variant="grid-3"
        background="bg-compass-pattern"
        id="hero"
        className="md:justify-start md:pt-[calc(var(--header-height-desktop)+1rem)]"
        image={
          <div className="pointer-events-none absolute bottom-0 left-0 z-0 hidden md:block">
            <Image
              src="/slides/%20Nic_Topics_2.png"
              alt=""
              aria-hidden="true"
              width={768}
              height={1024}
              className="h-[38vh] w-auto lg:h-[46vh]"
              priority
            />
          </div>
        }
      >
        <SlideContent>
          <h1 className="heading-stroke font-extrabold tracking-tight text-center text-5xl uppercase leading-[0.95] text-accent-600 sm:text-6xl md:text-7xl lg:text-8xl">
            Topics
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-center text-lg font-medium leading-relaxed text-brand-700 md:text-xl">
            The themes that run through Nic&apos;s keynotes, books, and 20+ years
            of building businesses.
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-center text-base leading-relaxed text-brand-600 md:text-lg">
            Explore each topic hub for related articles and keynote pathways.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CTAButton href="/speaker" className="!rounded-none font-bold tracking-[0.02em] text-xl uppercase">
              About Nic as a Speaker
            </CTAButton>
            <CTAButton href="/keynotes" variant="secondary" className="!rounded-none font-bold tracking-[0.02em] text-xl uppercase">
              View All Keynotes
            </CTAButton>
          </div>
        </SlideContent>
      </Slide>

      {slides.map((slide, slideIndex) => (
        <Slide
          key={slide.id}
          id={slide.id}
          variant="grid-3"
          background={slide.background}
        >
          <SlideContent>
            {slideIndex === 0 && (
              <div className="grid gap-8 md:grid-cols-5 md:gap-14">
                <div className="md:col-span-2">
                  <h2
                    className="heading-stroke-topics mt-2 font-extrabold tracking-tight text-4xl uppercase leading-[0.95] whitespace-pre-line text-brand-900 sm:text-5xl md:text-6xl"
                    data-no-orphan-opt-out="true"
                  >
                    {slide.heading}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-brand-700 md:text-lg">
                    {slide.description}
                  </p>
                </div>
                <div className="mt-3 space-y-6 md:col-span-3 md:mt-8 md:pl-16">
                  {slide.topics.map((topic, i) => (
                    <Link
                      key={topic.slug}
                      href={`/topics/${topic.slug}`}
                      className="group block card-brutalist p-6 transition-colors hover:bg-accent-50"
                      style={{ transform: `rotate(${tilt(i, 4)}deg)` }}
                    >
                      <h3 className="font-extrabold tracking-tight text-3xl uppercase leading-[0.95] text-accent-600 sm:text-4xl">
                        {topic.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-brand-700 md:text-base">
                        {topic.oneSentenceSummary}
                      </p>
                      <p className="mt-4 font-semibold text-accent-600">
                        Explore topic hub →
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {slideIndex === 1 && (
              <div className="grid gap-8 md:grid-cols-5 md:gap-10">
                <div className="order-2 space-y-6 md:order-1 md:col-span-3 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                  {slide.topics.map((topic, i) => (
                    <Link
                      key={topic.slug}
                      href={`/topics/${topic.slug}`}
                      className="group block card-brutalist p-6 transition-colors hover:bg-accent-50"
                      style={{ transform: `rotate(${tilt(i + 2, 4)}deg)` }}
                    >
                      <h3 className="font-extrabold tracking-tight text-3xl uppercase leading-[0.95] text-accent-600 sm:text-4xl">
                        {topic.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-brand-700 md:text-base">
                        {topic.oneSentenceSummary}
                      </p>
                      <p className="mt-4 font-semibold text-accent-600">
                        Explore topic hub →
                      </p>
                    </Link>
                  ))}
                </div>
                <div className="order-1 md:order-2 md:col-span-2 md:text-right">
                  <h2 className="heading-stroke-topics mt-2 font-extrabold tracking-tight text-4xl uppercase leading-[0.95] text-brand-900 sm:text-5xl md:text-6xl">
                    {slide.heading}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-brand-700 md:text-lg">
                    {slide.description}
                  </p>
                </div>
              </div>
            )}

            {slideIndex === 2 && (
              <div>
                <div className="mx-auto max-w-4xl text-center">
                  <h2 className="heading-stroke-topics mt-2 font-extrabold tracking-tight text-4xl uppercase leading-[0.95] text-brand-900 sm:text-5xl md:text-6xl">
                    {slide.heading}
                  </h2>
                  <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-brand-700 md:text-lg">
                    {slide.description}
                  </p>
                </div>
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  {slide.topics.map((topic, i) => (
                    <Link
                      key={topic.slug}
                      href={`/topics/${topic.slug}`}
                      className="group block card-brutalist p-6 transition-colors hover:bg-accent-50"
                      style={{ transform: `rotate(${tilt(i + 4, 4)}deg)` }}
                    >
                      <h3 className="font-extrabold tracking-tight text-3xl uppercase leading-[0.95] text-accent-600 sm:text-4xl">
                        {topic.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-brand-700 md:text-base">
                        {topic.oneSentenceSummary}
                      </p>
                      <p className="mt-4 font-semibold text-accent-600">
                        Explore topic hub →
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </SlideContent>
        </Slide>
      ))}

      <Slide variant="footer" background="bg-foot-pattern" id="footer">
        <FooterContent />
      </Slide>
    </SlideDeck>
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
