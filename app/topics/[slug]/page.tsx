/**
 * Individual Topic Hub Page — /topics/{slug}
 *
 * Cluster pages that bridge blog content to keynotes. 7 topic hubs:
 * curiosity, innovation, entrepreneurship, focus, ai, agency, failure.
 *
 * Each hub links to related keynotes and to /speaker per the
 * internal linking strategy. Featured posts shown when available.
 *
 * Content is fetched from Sanity at build time with hardcoded fallbacks.
 *
 * JSON-LD: CollectionPage (topic-specific)
 * Static params generated at build time — one page per topic.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import {
  topicHubBySlugQuery,
  topicHubSlugListQuery,
  postsByTopicQuery,
  type TopicHubData,
  type TopicHubPost,
} from "@/lib/sanity/queries";
import { CTAButton } from "@/components/cta-button";
import { Section } from "@/components/section";
import { FinalCta } from "@/components/final-cta";
import { JsonLd } from "@/components/json-ld";
import { PortableText } from "@/components/portable-text";
import { collectionPageJsonLd } from "@/lib/metadata";
import { tilt } from "@/lib/tilt";

/* ---------- Data fetching ---------- */

async function getTopicHub(slug: string): Promise<TopicHubData | null> {
  try {
    const data = await client.fetch<TopicHubData | null>(topicHubBySlugQuery, {
      slug,
    });
    return data;
  } catch {
    return null;
  }
}

async function getPostsByTopic(topicId: string): Promise<TopicHubPost[]> {
  try {
    const data = await client.fetch<TopicHubPost[]>(postsByTopicQuery, {
      topicId,
    });
    return data || [];
  } catch {
    return [];
  }
}

async function getTopicHubSlugs(): Promise<{ slug: string }[]> {
  try {
    const data = await client.fetch<{ slug: string }[]>(topicHubSlugListQuery);
    return data && data.length > 0 ? data : FALLBACK_SLUGS;
  } catch {
    return FALLBACK_SLUGS;
  }
}

/* ---------- Static params ---------- */

export async function generateStaticParams() {
  const slugs = await getTopicHubSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

/* ---------- Metadata ---------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = (await getTopicHub(slug)) || FALLBACK_TOPICS[slug];
  if (!topic) return { title: "Topic Not Found" };

  const title = `${topic.title} Topic Hub`;
  const description = topic.oneSentenceSummary;

  return {
    title,
    description,
    alternates: {
      canonical: `https://nicharalambous.com/topics/${slug}`,
    },
    openGraph: {
      title: `${topic.title} | Topics | Nic Haralambous`,
      description,
      url: `https://nicharalambous.com/topics/${slug}`,
    },
  };
}

/* ---------- Page ---------- */

export default async function TopicHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cmsTopic = await getTopicHub(slug);
  const fallback = FALLBACK_TOPICS[slug];
  const topic = cmsTopic || fallback;

  if (!topic) {
    notFound();
  }

  /* Fetch recent posts tagged with this topic (dynamic, not curated) */
  const recentPosts = cmsTopic
    ? await getPostsByTopic(cmsTopic._id)
    : [];

  const hasCmsDefinition =
    cmsTopic?.definition && cmsTopic.definition.length > 0;
  const hasCmsWhyItMatters =
    cmsTopic?.whyItMatters && cmsTopic.whyItMatters.length > 0;

  return (
    <>
      {/* Structured data */}
      <JsonLd
        data={collectionPageJsonLd({
          name: `${topic.title} | Nic Haralambous`,
          description: topic.oneSentenceSummary,
          url: `https://nicharalambous.com/topics/${slug}`,
        })}
      />

      {/* Hero */}
      <Section width="content">
        <p className="heading-display text-accent-600">
          Topic Hub
        </p>
        <h1 className="mt-2 heading-display-stroke-sm text-4xl text-brand-900 sm:text-5xl md:text-6xl">
          {topic.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-brand-600">
          {topic.oneSentenceSummary}
        </p>
      </Section>

      {/* Definition / What it is */}
      <Section width="content" className="bg-brand-50">
        <h2 className="heading-display text-3xl text-brand-900 sm:text-4xl">
          What Is {topic.title}?
        </h2>
        {hasCmsDefinition ? (
          <PortableText value={cmsTopic!.definition} className="mt-4" />
        ) : (
          fallback?.definitionText?.map((paragraph: string, i: number) => (
            <p
              key={i}
              className="mt-4 text-base leading-relaxed text-brand-700"
            >
              {paragraph}
            </p>
          ))
        )}
      </Section>

      {/* Why it matters */}
      <Section width="content">
        <h2 className="heading-display text-3xl text-brand-900 sm:text-4xl">
          Why {topic.title} Matters
        </h2>
        {hasCmsWhyItMatters ? (
          <PortableText value={cmsTopic!.whyItMatters} className="mt-4" />
        ) : (
          fallback?.whyItMattersText?.map((paragraph: string, i: number) => (
            <p
              key={i}
              className="mt-4 text-base leading-relaxed text-brand-700"
            >
              {paragraph}
            </p>
          ))
        )}
      </Section>

      {/* Related keynotes — links to keynote pages */}
      {topic.relatedKeynotes && topic.relatedKeynotes.length > 0 && (
        <Section width="wide" className="bg-brand-50">
          <h2 className="heading-display text-3xl text-brand-900 sm:text-4xl">
            Explore This Topic as a Virtual Keynote
          </h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {topic.relatedKeynotes.map((keynote, i) => (
              <Link
                key={keynote._id}
                href={`/keynotes/${keynote.slug}`}
                className="group flex flex-col card-brutalist p-6 transition-colors hover:bg-accent-50"
                style={{ transform: `rotate(${tilt(i, 90)}deg)` }}
              >
                <h3 className="heading-display text-lg text-brand-900 group-hover:text-accent-600">
                  {keynote.title}
                </h3>
                {"tagline" in keynote && keynote.tagline && (
                  <p className="mt-2 text-sm leading-relaxed text-brand-600">
                    {keynote.tagline}
                  </p>
                )}
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <CTAButton href="/speaker" variant="secondary">
              About Nic as a Speaker
            </CTAButton>
          </div>
        </Section>
      )}

      {/* Featured posts — only shown if CMS has data */}
      {cmsTopic?.featuredPosts && cmsTopic.featuredPosts.length > 0 && (
        <Section width="wide">
          <h2 className="heading-display text-3xl text-brand-900 sm:text-4xl">
            Featured Articles on {topic.title}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cmsTopic.featuredPosts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col border-2 border-accent-600 p-6 transition-colors hover:bg-accent-50"
              >
                <h3 className="heading-display text-lg text-brand-900 group-hover:text-accent-600">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-600">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-3 text-xs text-brand-400">
                  {post.publishedAt && (
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  )}
                  {post.estimatedReadTime && (
                    <span>{post.estimatedReadTime} min read</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <CTAButton href="/blog" variant="secondary">
              Read More on the Blog
            </CTAButton>
          </div>
        </Section>
      )}

      {/* Recent posts in this topic (dynamic, from topic references) */}
      {recentPosts.length > 0 && (
        <Section width="wide">
          <h2 className="heading-display text-3xl text-brand-900 sm:text-4xl">
            Recent Articles on {topic.title}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col border-2 border-accent-600 p-6 transition-colors hover:bg-accent-50"
              >
                <h3 className="heading-display text-lg text-brand-900 group-hover:text-accent-600">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-600">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-3 text-xs text-brand-400">
                  {post.publishedAt && (
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  )}
                  {post.estimatedReadTime && (
                    <span>{post.estimatedReadTime} min read</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <CTAButton href="/blog" variant="secondary">
              Read More on the Blog
            </CTAButton>
          </div>
        </Section>
      )}

      {/* All topics link */}
      <Section width="content">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-brand-500">
            All topics:
          </span>
          {ALL_TOPIC_SLUGS.filter((t) => t.slug !== slug).map((t) => (
            <Link
              key={t.slug}
              href={`/topics/${t.slug}`}
              className="bg-brand-100 px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-700 hover:text-white"
            >
              {t.title}
            </Link>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <FinalCta
        heading={`Book a Keynote on ${topic.title}`}
        description="Virtual delivery worldwide. Customized for your audience."
        primaryHref="/contact"
        primaryLabel="Enquire Now"
        secondaryHref="/keynotes"
        secondaryLabel="View All Keynotes"
      />
    </>
  );
}

/* ---------- Fallback data ---------- */

interface FallbackTopicHub extends TopicHubData {
  definitionText: string[];
  whyItMattersText: string[];
}

const FALLBACK_SLUGS = [
  { slug: "curiosity" },
  { slug: "innovation" },
  { slug: "entrepreneurship" },
  { slug: "focus" },
  { slug: "ai" },
  { slug: "agency" },
  { slug: "failure" },
];

const ALL_TOPIC_SLUGS = [
  { slug: "curiosity", title: "Curiosity" },
  { slug: "innovation", title: "Innovation" },
  { slug: "entrepreneurship", title: "Entrepreneurship" },
  { slug: "focus", title: "Focus" },
  { slug: "ai", title: "AI" },
  { slug: "agency", title: "Agency" },
  { slug: "failure", title: "Failure" },
];

const FALLBACK_TOPICS: Record<string, FallbackTopicHub> = {
  curiosity: {
    _id: "ft-1",
    title: "Curiosity",
    slug: "curiosity",
    oneSentenceSummary:
      "Curiosity is the god particle of innovation: the fundamental force that drives experimentation, learning, and breakthrough thinking.",
    definition: null,
    definitionText: [
      "Curiosity isn't a personality trait; it's a practice. In Nic's framework, there are three types: epistemic (the drive to know), diversive (the drive to explore), and empathetic (the drive to understand others). The most innovative teams cultivate all three.",
      "Nic's work on curiosity draws from his keynote 'The Curiosity Catalyst' and decades of building businesses where curiosity was the differentiator between stagnation and growth.",
    ],
    whyItMatters: null,
    whyItMattersText: [
      "Most organisations say they want innovation but don't invest in what actually drives it. Nic's Stagnation Hypothesis is simple: when teams stop being curious, they start dying. Slowly at first, then all at once.",
      "Building curiosity into hiring, culture, and daily practice is how teams escape the OK Plateau and build breakthrough products.",
    ],
    relatedKeynotes: [
      { _id: "k1", title: "The Curiosity Catalyst", slug: "curiosity-catalyst", tagline: "Why curiosity is the god particle of innovation" },
      { _id: "k2", title: "How to Build Breakthrough Product Teams", slug: "breakthrough-product-teams", tagline: "The Innovation Flywheel: curiosity, experimentation, and high agency" },
    ],
    featuredPosts: [],
    seo: null,
  },
  innovation: {
    _id: "ft-2",
    title: "Innovation",
    slug: "innovation",
    oneSentenceSummary:
      "Innovation is an outcome, not an action. It requires curiosity, experimentation, and the courage to act on incomplete information.",
    definition: null,
    definitionText: [
      "Innovation isn't brainstorming sessions and sticky notes. Nic draws a sharp line between real innovation and what he calls 'wackovation': chaotic activity disguised as progress.",
      "The Innovation Flywheel framework shows how curiosity feeds experimentation, experimentation produces learning, and learning builds the agency to take the next leap. Innovation is what emerges when this cycle runs continuously.",
    ],
    whyItMatters: null,
    whyItMattersText: [
      "Teams that confuse activity with innovation get stuck on the OK Plateau: competent but stagnant. Understanding that innovation is a system, not an event, changes how you hire, how you structure teams, and how you measure success.",
    ],
    relatedKeynotes: [
      { _id: "k2", title: "How to Build Breakthrough Product Teams", slug: "breakthrough-product-teams", tagline: "The Innovation Flywheel: curiosity, experimentation, and high agency" },
      { _id: "k1", title: "The Curiosity Catalyst", slug: "curiosity-catalyst", tagline: "Why curiosity is the god particle of innovation" },
    ],
    featuredPosts: [],
    seo: null,
  },
  entrepreneurship: {
    _id: "ft-3",
    title: "Entrepreneurship",
    slug: "entrepreneurship",
    oneSentenceSummary:
      "Building businesses from scratch: the Do/Fail/Learn/Repeat cycle, resilience, and why 'just avoid dying' is sometimes the best strategy.",
    definition: null,
    definitionText: [
      "Entrepreneurship, in Nic's experience, is not about vision boards and overnight success. It's about the grind: building, failing, extracting data from failure, and iterating. The Do/Fail/Learn/Repeat cycle is the real framework.",
      "With 4 startup exits across music tech, mobile social, e-commerce, and SaaS, Nic has lived the full spectrum, from near-bankruptcy to successful acquisitions.",
    ],
    whyItMatters: null,
    whyItMattersText: [
      "The entrepreneur's mindset (resilience, resourcefulness, bias toward action) is increasingly valued inside large organisations too. Understanding how entrepreneurs think helps teams at every scale move faster and break free from institutional inertia.",
    ],
    relatedKeynotes: [],
    featuredPosts: [],
    seo: null,
  },
  focus: {
    _id: "ft-4",
    title: "Focus",
    slug: "focus",
    oneSentenceSummary:
      "In an attention economy, focus is your most valuable resource. The DIAL framework helps teams reclaim deep work.",
    definition: null,
    definitionText: [
      "We live in a world engineered to steal your attention. The average person checks their phone 96 times a day. Your team's most valuable resource isn't time; it's attention.",
      "Nic's DIAL framework (Decide, Intend, Act, Loop) provides a practical system for reclaiming focus. It's not about going offline; it's about being intentional with where attention goes.",
    ],
    whyItMatters: null,
    whyItMattersText: [
      "Teams that can't focus can't do deep work. And teams that can't do deep work can't innovate. Focus is the prerequisite for everything else: creativity, quality, and meaningful output.",
      "The sacrifice fallacy (the belief that saying no to distractions means missing out) is what keeps most teams stuck in shallow work. Breaking that fallacy is the first step.",
    ],
    relatedKeynotes: [
      { _id: "k3", title: "Reclaiming Focus in a World That Profits From Your Distraction", slug: "reclaiming-focus", tagline: "The DIAL framework for attention management and deep work" },
    ],
    featuredPosts: [],
    seo: null,
  },
  ai: {
    _id: "ft-5",
    title: "AI",
    slug: "ai",
    oneSentenceSummary:
      "AI as a tool, not a replacement. How to integrate AI into your product workflow without losing your team's creative edge.",
    definition: null,
    definitionText: [
      "AI is the most powerful tool in a generation — and the most misunderstood. Nic's approach is practical: AI augments human creativity, it doesn't replace it. The MIT cognitive bankruptcy study showed that teams who outsource all thinking to AI lose their edge.",
      "The question isn't 'will AI take my job?' It's 'how do I use AI to do my job better?' The answer starts with understanding what AI is good at and what it isn't.",
    ],
    whyItMatters: null,
    whyItMattersText: [
      "Teams that integrate AI thoughtfully — as a tool for amplification, not automation — will outperform those who either ignore it or blindly adopt it. The key is selective application: know when to use AI and when to think for yourself.",
    ],
    relatedKeynotes: [
      { _id: "k2", title: "How to Build Breakthrough Product Teams", slug: "breakthrough-product-teams", tagline: "The Innovation Flywheel: curiosity, experimentation, and high agency" },
    ],
    featuredPosts: [],
    seo: null,
  },
  agency: {
    _id: "ft-6",
    title: "Agency",
    slug: "agency",
    oneSentenceSummary:
      "High agency, the belief that you can influence outcomes, separates breakthrough teams from stagnant ones.",
    definition: null,
    definitionText: [
      "Agency is the belief that your actions can change your circumstances. Nic places it on a spectrum: from low agency ('things happen to me') to high agency ('I make things happen'). Breakthrough teams operate at the high end.",
      "Selective agency (knowing when to push and when to conserve energy) is the nuanced version. It's not about relentless hustle. It's about applying force where it matters most.",
    ],
    whyItMatters: null,
    whyItMattersText: [
      "'Action produces information' is the principle that separates stagnant teams from dynamic ones. High-agency teams don't wait for perfect data; they act, learn from the result, and iterate. This bias toward action is what makes companies like startups move faster than enterprises.",
    ],
    relatedKeynotes: [
      { _id: "k3", title: "Reclaiming Focus in a World That Profits From Your Distraction", slug: "reclaiming-focus", tagline: "The DIAL framework for attention management and deep work" },
      { _id: "k2", title: "How to Build Breakthrough Product Teams", slug: "breakthrough-product-teams", tagline: "The Innovation Flywheel: curiosity, experimentation, and high agency" },
    ],
    featuredPosts: [],
    seo: null,
  },
  failure: {
    _id: "ft-7",
    title: "Failure",
    slug: "failure",
    oneSentenceSummary:
      "Failure is data, not destiny. Blameless postmortems and post-traumatic growth build stronger, more resilient teams.",
    definition: null,
    definitionText: [
      "Failure isn't the opposite of success; it's a through-point. Nic reframes failure as data: every failed experiment, product launch, or business gives you information you didn't have before.",
      "The blameless postmortem, borrowed from engineering culture, is the practice of examining failure without assigning fault. It creates psychological safety and turns every setback into a learning opportunity.",
    ],
    whyItMatters: null,
    whyItMattersText: [
      "Teams that fear failure don't innovate. Period. Post-traumatic growth, the phenomenon where people emerge from adversity stronger than before, only happens when organisations create space for honest examination of what went wrong.",
      "Dyson built 5,127 prototypes before getting it right. That's not persistence for its own sake; that's systematic failure as a design methodology.",
    ],
    relatedKeynotes: [],
    featuredPosts: [],
    seo: null,
  },
};
