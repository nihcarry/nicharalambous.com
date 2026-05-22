/**
 * Individual Topic Hub Page — /topics/{slug}
 *
 * Cluster pages that bridge blog content to keynotes. 7 topic hubs:
 * curiosity, innovation, entrepreneurship, focus, ai, agency, failure.
 *
 * Each hub links to related keynotes and to /speaker per the
 * internal linking strategy. Featured posts shown when available.
 *
 * Content is fetched from Sanity at build time.
 *
 * JSON-LD: CollectionPage (topic-specific)
 * Static params generated at build time — one page per topic.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import { ArrowRight, Crosshair } from "lucide-react";

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
  const data = await client.fetch<{ slug: string }[]>(topicHubSlugListQuery);
  return data && data.length > 0 ? data : [{ slug: "_placeholder" }];
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
  const topic = await getTopicHub(slug);
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
      type: "website",
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
  const topic = await getTopicHub(slug);

  if (!topic) {
    notFound();
  }

  const recentPosts = await getPostsByTopic(topic._id);

  const hasDefinition =
    topic.definition && topic.definition.length > 0;
  const hasWhyItMatters =
    topic.whyItMatters && topic.whyItMatters.length > 0;

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
      {hasDefinition && (
        <Section width="content" className="bg-brand-50">
          <h2 className="heading-display text-3xl text-brand-900 sm:text-4xl">
            What Is {topic.title}?
          </h2>
          <PortableText value={topic.definition} className="mt-4" />
        </Section>
      )}

      {/* Why it matters */}
      {hasWhyItMatters && (
        <Section width="content">
          <h2 className="heading-display text-3xl text-brand-900 sm:text-4xl">
            Why {topic.title} Matters
          </h2>
          <PortableText value={topic.whyItMatters} className="mt-4" />
        </Section>
      )}

      {/* Related keynotes — links to keynote pages */}
      {topic.relatedKeynotes && topic.relatedKeynotes.length > 0 && (
        <Section width="wide" className="bg-brand-50">
          <h2 className="heading-display text-3xl text-brand-900 sm:text-4xl">
            Explore This Topic as a Virtual Keynote
          </h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {topic.relatedKeynotes.map((keynote, i) => (
              <a
                key={keynote._id}
                href={`/keynotes/${keynote.slug}`}
                className="group flex flex-col border border-brand-900 bg-white p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs tracking-widest text-accent-600">
                    KEYNOTE_{String(i + 1).padStart(2, "0")}
                  </span>
                  <Crosshair className="h-4 w-4 text-accent-600" aria-hidden="true" />
                </div>
                <div className="my-3 border-t border-brand-200" />
                <h3 className="text-lg font-extrabold uppercase leading-tight tracking-tight text-brand-900 transition-colors group-hover:text-accent-600">
                  {keynote.title}
                </h3>
                {"tagline" in keynote && keynote.tagline && (
                  <p className="mt-3 font-mono text-sm leading-relaxed text-brand-600">
                    {keynote.tagline}
                  </p>
                )}
                <div className="mt-auto pt-4 flex justify-end">
                  <ArrowRight className="h-4 w-4 text-accent-600 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </a>
            ))}
          </div>
          <div className="mt-6 text-center">
            <CTAButton href="/speaker" variant="secondary">
              About Nic as a Speaker
            </CTAButton>
          </div>
        </Section>
      )}

      {/* Featured posts */}
      {topic.featuredPosts && topic.featuredPosts.length > 0 && (
        <Section width="wide">
          <h2 className="heading-display text-3xl text-brand-900 sm:text-4xl">
            Featured Articles on {topic.title}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topic.featuredPosts.map((post, i) => (
              <a
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col border border-brand-900 bg-white p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs tracking-widest text-accent-600">
                    FEATURED_{String(i + 1).padStart(2, "0")}
                  </span>
                  <Crosshair className="h-4 w-4 text-accent-600" aria-hidden="true" />
                </div>
                <div className="my-3 border-t border-brand-200" />
                <h3 className="text-lg font-extrabold uppercase leading-tight tracking-tight text-brand-900 transition-colors group-hover:text-accent-600">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-3 flex-1 font-mono text-sm leading-relaxed text-brand-600">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-auto pt-6">
                  <div className="border-t border-brand-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs tracking-widest text-brand-500">
                        {post.publishedAt && new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        {post.estimatedReadTime && ` · ${post.estimatedReadTime} min`}
                      </span>
                      <ArrowRight className="h-4 w-4 text-accent-600 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </a>
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
            {recentPosts.map((post, i) => (
              <a
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col border border-brand-900 bg-white p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs tracking-widest text-accent-600">
                    RECENT_{String(i + 1).padStart(2, "0")}
                  </span>
                  <Crosshair className="h-4 w-4 text-accent-600" aria-hidden="true" />
                </div>
                <div className="my-3 border-t border-brand-200" />
                <h3 className="text-lg font-extrabold uppercase leading-tight tracking-tight text-brand-900 transition-colors group-hover:text-accent-600">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-3 flex-1 font-mono text-sm leading-relaxed text-brand-600">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-auto pt-6">
                  <div className="border-t border-brand-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs tracking-widest text-brand-500">
                        {post.publishedAt && new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        {post.estimatedReadTime && ` · ${post.estimatedReadTime} min`}
                      </span>
                      <ArrowRight className="h-4 w-4 text-accent-600 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </a>
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
            <a
              key={t.slug}
              href={`/topics/${t.slug}`}
              className="bg-brand-100 px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-700 hover:text-white"
            >
              {t.title}
            </a>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <FinalCta
        heading={`Book a Keynote on ${topic.title}`}
        description="Virtual delivery worldwide. Customized for your audience."
        primaryHref="/contact"
        primaryLabel="Enquire Now"
        secondaryHref="/speaker"
        secondaryLabel="About Nic as a Speaker"
      />
    </>
  );
}

const ALL_TOPIC_SLUGS = [
  { slug: "curiosity", title: "Curiosity" },
  { slug: "innovation", title: "Innovation" },
  { slug: "entrepreneurship", title: "Entrepreneurship" },
  { slug: "focus", title: "Focus" },
  { slug: "ai", title: "AI" },
  { slug: "agency", title: "Agency" },
  { slug: "failure", title: "Failure" },
];

