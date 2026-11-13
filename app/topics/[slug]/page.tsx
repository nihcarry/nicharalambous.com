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
import { TopicChips } from "@/components/site/topic-chips";
import { Section } from "@/components/section";
import { ClosingCta } from "@/components/site/closing-cta";
import { JsonLd } from "@/components/json-ld";
import { PortableText } from "@/components/portable-text";
import { collectionPageJsonLd } from "@/lib/metadata";
import { isRetiredKeynote } from "@/lib/site";

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

function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function ArticleCard({ post }: { post: TopicHubPost }) {
  const meta = [formatDate(post.publishedAt), post.estimatedReadTime ? `${post.estimatedReadTime} min` : null]
    .filter(Boolean)
    .join(" · ");
  return (
    <a className="post-card" href={`/blog/${post.slug}`}>
      <h3>{post.title}</h3>
      {post.excerpt ? <p>{post.excerpt}</p> : null}
      {meta ? <span className="meta">{meta}</span> : null}
    </a>
  );
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

  const title = topic.title;
  const description = topic.oneSentenceSummary;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.nicharalambous.com/topics/${slug}`,
    },
    openGraph: {
      type: "website",
      title: `${topic.title} | Topics | Nic Haralambous`,
      description,
      url: `https://www.nicharalambous.com/topics/${slug}`,
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
  const keynotes = (topic.relatedKeynotes || []).filter((keynote) => !isRetiredKeynote(keynote.slug));

  const hasDefinition =
    topic.definition && topic.definition.length > 0;
  const hasWhyItMatters =
    topic.whyItMatters && topic.whyItMatters.length > 0;

  return (
    <div className="v3 p-compass">
      {/* Structured data */}
      <JsonLd
        data={collectionPageJsonLd({
          name: `${topic.title} | Nic Haralambous`,
          description: topic.oneSentenceSummary,
          url: `https://www.nicharalambous.com/topics/${slug}`,
        })}
      />

      {/* Hero */}
      <section>
        <div className="wrap">
          <h1 className="heading-display-stroke-sm text-4xl text-brand-900 sm:text-5xl md:text-6xl">
            {topic.title}
          </h1>
          <TopicChips active={slug} />
          <p className="prose-col mt-4 text-lg leading-relaxed text-brand-600">
            {topic.oneSentenceSummary}
          </p>
        </div>
      </section>

      {/* Definition / What it is */}
      {hasDefinition && (
        <section>
          <div className="wrap">
            <h2 className="heading-display text-3xl text-brand-900 sm:text-4xl">
              What Is {topic.title}?
            </h2>
            <PortableText value={topic.definition} className="prose-col mt-4" />
          </div>
        </section>
      )}

      {/* Why it matters */}
      {hasWhyItMatters && (
        <section>
          <div className="wrap">
            <h2 className="heading-display text-3xl text-brand-900 sm:text-4xl">
              Why {topic.title} Matters
            </h2>
            <PortableText value={topic.whyItMatters} className="prose-col mt-4" />
          </div>
        </section>
      )}

      {/* Related keynotes — links to keynote pages */}
      {keynotes.length > 0 && (
        <Section width="wide">
          <h2 className="heading-display text-3xl text-brand-900 sm:text-4xl">
            Explore this topic as a keynote
          </h2>
          <div className="post-grid mt-8">
            {keynotes.map((keynote) => (
              <a className="post-card" href={`/keynotes/${keynote.slug}`} key={keynote._id}>
                <h3>{keynote.title}</h3>
                {"tagline" in keynote && keynote.tagline ? <p>{keynote.tagline}</p> : null}
              </a>
            ))}
          </div>
          <div className="mt-6">
            <a className="btn" href="/keynotes/output-paradox-reengage-teams">
              See the keynote
            </a>
          </div>
        </Section>
      )}

      {/* Featured posts */}
      {topic.featuredPosts && topic.featuredPosts.length > 0 && (
        <Section width="wide">
          <h2 className="heading-display text-3xl text-brand-900 sm:text-4xl">
            Featured articles on {topic.title}
          </h2>
          <div className="post-grid mt-8">
            {topic.featuredPosts.map((post) => (
              <ArticleCard key={post._id} post={post} />
            ))}
          </div>
          <div className="mt-6">
            <a className="btn" href="/blog">
              Read more on the blog
            </a>
          </div>
        </Section>
      )}

      {/* Recent posts in this topic (dynamic, from topic references) */}
      {recentPosts.length > 0 && (
        <Section width="wide">
          <h2 className="heading-display text-3xl text-brand-900 sm:text-4xl">
            Recent articles on {topic.title}
          </h2>
          <div className="post-grid mt-8">
            {recentPosts.map((post) => (
              <ArticleCard key={post._id} post={post} />
            ))}
          </div>
          <div className="mt-6">
            <a className="btn" href="/blog">
              Read more on the blog
            </a>
          </div>
        </Section>
      )}

      {/* All topics link */}
      <section>
        <div className="wrap">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-brand-500">
            All topics:
          </span>
          {ALL_TOPIC_SLUGS.filter((t) => t.slug !== slug).map((t) => (
            <a
              key={t.slug}
              href={`/topics/${t.slug}`}
              className="tag"
            >
              {t.title}
            </a>
          ))}
        </div>
        </div>
      </section>

      {/* CTA */}
      <ClosingCta
        className="pd-compass"
        heading={`Book a keynote on ${topic.title}`}
        copy="Available in person or virtually. Customised for your audience."
        primaryHref="/contact"
        primaryLabel="Enquire now"
        secondaryHref="/keynotes/output-paradox-reengage-teams"
        secondaryLabel="See the keynote"
      />
    </div>
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

