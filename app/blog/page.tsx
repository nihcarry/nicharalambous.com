/**
 * Blog Listing Page — /blog
 *
 * Displays all published blog posts with client-side pagination and
 * topic filtering. Content fetched from Sanity at build time.
 *
 * The listing is interactive (filter + paginate) so post data is passed
 * to a client component. All data is embedded in the static HTML —
 * no runtime API calls.
 *
 * JSON-LD: CollectionPage
 */
import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import {
  blogPostsListQuery,
  blogTopicFiltersQuery,
  mostPopularPostsQuery,
  type BlogPostListItem,
  type TopicReference,
  type FeaturedPostItem,
} from "@/lib/sanity/queries";
import { CTAButton } from "@/components/cta-button";
import { Section } from "@/components/section";
import { FinalCta } from "@/components/final-cta";
import { JsonLd } from "@/components/json-ld";
import { BlogList } from "@/components/blog-list";
import { MostPopularHero } from "@/components/most-popular-hero";
import { collectionPageJsonLd } from "@/lib/metadata";

/* ---------- Data fetching ---------- */

async function getBlogPosts(): Promise<BlogPostListItem[] | null> {
  try {
    const data = await client.fetch<BlogPostListItem[]>(blogPostsListQuery);
    return data && data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

async function getBlogTopics(): Promise<TopicReference[] | null> {
  try {
    const data = await client.fetch<TopicReference[]>(blogTopicFiltersQuery);
    return data && data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

/** Fetches curated Most Popular posts (tagged in Sanity, max 5). */
async function getMostPopularPosts(): Promise<FeaturedPostItem[]> {
  try {
    const data = await client.fetch<FeaturedPostItem[] | null>(
      mostPopularPostsQuery
    );
    return Array.isArray(data) ? data.filter(Boolean) : [];
  } catch {
    return [];
  }
}

/* ---------- Metadata ---------- */

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on curiosity, innovation, AI, entrepreneurship, focus, and failure by Nic Haralambous. Real stories and actionable frameworks from 20+ years of building businesses.",
  alternates: { canonical: "https://nicharalambous.com/blog" },
  openGraph: {
    title: "Blog | Nic Haralambous",
    description:
      "Articles on curiosity, innovation, AI, entrepreneurship, and building businesses.",
    url: "https://nicharalambous.com/blog",
  },
};

/* ---------- Page ---------- */

export default async function BlogPage() {
  const [cmsPosts, cmsTopics, mostPopularPosts] = await Promise.all([
    getBlogPosts(),
    getBlogTopics(),
    getMostPopularPosts(),
  ]);

  const posts = cmsPosts || [];
  const topics = cmsTopics || FALLBACK_TOPICS;

  return (
    <div className="page-bg bg-quill-pattern">
      {/* Structured data */}
      <JsonLd
        data={collectionPageJsonLd({
          name: "Blog — Nic Haralambous",
          description:
            "Articles on curiosity, innovation, AI, entrepreneurship, focus, and failure.",
          url: "https://nicharalambous.com/blog",
        })}
      />

      <Section width="content" className="text-center">
        <h1 className="heading-stroke font-extrabold tracking-tight text-center text-5xl uppercase leading-[0.95] text-accent-600 sm:text-7xl md:text-7xl lg:text-8xl 2xl:text-9xl">
          Blog
        </h1>
        <p className="mt-4 text-lg text-brand-600">
          Real stories and actionable frameworks from 20+ years of building,
          failing, and learning. Explore by topic or start with the latest.
        </p>
      </Section>

      {/* Most Popular — up to 5 (curated via post field "Most Popular" in Sanity) */}
      {mostPopularPosts.length > 0 && (
        <Section width="wide">
          <MostPopularHero posts={mostPopularPosts} />
        </Section>
      )}

      <Section width="wide">
        {posts.length > 0 ? (
          <BlogList posts={posts} topics={topics} />
        ) : (
          /* Empty state when no posts are published yet */
          <div className="text-center">
            <p className="text-lg text-brand-500">
              New articles are on the way. In the meantime, explore the topics
              that Nic writes and speaks about.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <CTAButton href="/topics" variant="secondary">
                Explore Topics
              </CTAButton>
              <CTAButton href="/keynotes" variant="secondary">
                Explore Keynotes
              </CTAButton>
            </div>
          </div>
        )}
      </Section>

      {/* CTA */}
      <FinalCta
        heading="Want These Ideas as a Keynote?"
        description="The ideas on this blog come alive in Nic's virtual keynotes. Real stories, actionable frameworks, tailored to your team."
        primaryHref="/speaker"
        primaryLabel="About Nic as a Speaker"
        secondaryHref="/topics"
        secondaryLabel="Explore Topics"
      />
    </div>
  );
}

/* ---------- Fallback data ---------- */

const FALLBACK_TOPICS: TopicReference[] = [
  { _id: "t1", title: "Curiosity", slug: "curiosity" },
  { _id: "t2", title: "Innovation", slug: "innovation" },
  { _id: "t3", title: "Entrepreneurship", slug: "entrepreneurship" },
  { _id: "t4", title: "Focus", slug: "focus" },
  { _id: "t5", title: "AI", slug: "ai" },
  { _id: "t6", title: "Agency", slug: "agency" },
  { _id: "t7", title: "Failure", slug: "failure" },
];
