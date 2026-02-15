/**
 * Individual Blog Post Page — /blog/{slug}
 *
 * Full article template for published blog posts. Supports two content
 * rendering modes:
 *   1. Portable Text (`body`) — for manually written or AI-optimized posts
 *   2. Raw HTML (`rawHtmlBody`) — for as-is Medium/Substack imports
 *
 * Sections (per SEO strategy):
 *   1. TL;DR / excerpt (when present)
 *   2. Main content (Portable Text or raw HTML)
 *   3. FAQ section (when present) — targets "People Also Ask"
 *   4. Topic hub links
 *   5. Related posts (same topic hub)
 *   6. Contextual CTA (related keynote or generic /speaker)
 *
 * JSON-LD: Article + FAQPage (when FAQs present)
 * Static params generated at build time — one page per published post.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import {
  blogPostBySlugQuery,
  blogPostSlugListQuery,
  relatedPostsQuery,
  type BlogPostData,
  type RelatedPostItem,
} from "@/lib/sanity/queries";
import { Section } from "@/components/section";
import { JsonLd } from "@/components/json-ld";
import { PortableText } from "@/components/portable-text";
import { FaqSection } from "@/components/faq-section";
import { RelatedPosts } from "@/components/related-posts";
import { ContextualCta } from "@/components/contextual-cta";
import { articleJsonLd, faqJsonLd } from "@/lib/metadata";

/* ---------- Data fetching ---------- */

async function getPost(slug: string): Promise<BlogPostData | null> {
  try {
    const data = await client.fetch<BlogPostData | null>(blogPostBySlugQuery, {
      slug,
    });
    return data;
  } catch {
    return null;
  }
}

async function getPostSlugs(): Promise<{ slug: string }[]> {
  try {
    const data = await client.fetch<{ slug: string }[]>(blogPostSlugListQuery);
    return data && data.length > 0 ? data : FALLBACK_SLUGS;
  } catch {
    return FALLBACK_SLUGS;
  }
}

async function getRelatedPosts(
  currentId: string,
  topicIds: string[]
): Promise<RelatedPostItem[]> {
  if (topicIds.length === 0) return [];
  try {
    const data = await client.fetch<RelatedPostItem[]>(relatedPostsQuery, {
      currentId,
      topicIds,
    });
    return data || [];
  } catch {
    return [];
  }
}

/* ---------- Static params ---------- */

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

/* ---------- Metadata ---------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getPost(slug)) || FALLBACK_POSTS[slug];
  if (!post) return { title: "Post Not Found" };

  const title = post.seo?.seoTitle || post.title;
  const description =
    post.seo?.seoDescription ||
    post.excerpt ||
    `${post.title} by Nic Haralambous`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://nicharalambous.com/blog/${slug}`,
    },
    openGraph: {
      title: `${title} | Nic Haralambous`,
      description,
      url: `https://nicharalambous.com/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      ...(post.updatedAt && { modifiedTime: post.updatedAt }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/* ---------- Page ---------- */

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cmsPost = await getPost(slug);
  const fallback = FALLBACK_POSTS[slug];
  const post = cmsPost || fallback;

  if (!post) {
    notFound();
  }

  /* Fetch related posts based on topic hub references */
  const topicIds = post.topics?.map((t) => t._id) || [];
  const relatedPosts = await getRelatedPosts(post._id, topicIds);

  const hasPortableTextBody = post.body && post.body.length > 0;
  const hasRawHtmlBody =
    post.rawHtmlBody && post.rawHtmlBody.trim().length > 0;
  const hasFaq = post.faq && post.faq.length > 0;
  const hasTopics = post.topics && post.topics.length > 0;

  return (
    <>
      {/* Article JSON-LD */}
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.excerpt || `${post.title} by Nic Haralambous`,
          url: `https://nicharalambous.com/blog/${slug}`,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt || undefined,
          image: post.featuredImage?.asset?.url,
        })}
      />

      {/* FAQ JSON-LD (when FAQs present) */}
      {hasFaq && <JsonLd data={faqJsonLd(post.faq!)} />}

      {/* Article header */}
      <Section width="content" as="article">
        <header>
          {/* Topic tags */}
          {hasTopics && (
            <div className="flex flex-wrap gap-2">
              {post.topics.map((topic) => (
                <Link
                  key={topic._id}
                  href={`/topics/${topic.slug}`}
                  className="rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-accent-600 transition-colors hover:bg-accent-600 hover:text-white"
                >
                  {topic.title}
                </Link>
              ))}
            </div>
          )}

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl md:text-5xl">
            {post.title}
          </h1>

          {/* Meta: date + read time */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-brand-500">
            <span>By Nic Haralambous</span>
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
            {post.updatedAt && (
              <span className="text-brand-400">
                Updated{" "}
                {new Date(post.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            {post.estimatedReadTime && (
              <span>{post.estimatedReadTime} min read</span>
            )}
          </div>
        </header>

        {/* Featured image */}
        {post.featuredImage?.asset?.url && (
          <figure className="mt-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featuredImage.asset.url}
              alt={post.featuredImage.alt || post.title}
              className="w-full rounded-lg"
            />
          </figure>
        )}

        {/* TL;DR / Excerpt block */}
        {post.excerpt && (
          <aside className="mt-8 rounded-xl border-l-4 border-accent-400 bg-brand-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent-600">
              TL;DR
            </p>
            <p className="mt-2 text-base leading-relaxed text-brand-700">
              {post.excerpt}
            </p>
          </aside>
        )}

        {/* Main content — Portable Text or raw HTML */}
        {hasPortableTextBody ? (
          <PortableText value={post.body} className="mt-8" />
        ) : hasRawHtmlBody ? (
          <div
            className="mt-8 [&>p]:mt-4 [&>p]:text-base [&>p]:leading-relaxed [&>p]:text-brand-700 [&>h2]:mt-10 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-brand-900 [&>h3]:mt-8 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-brand-900 [&>ul]:mt-4 [&>ul]:space-y-2 [&>ul]:pl-5 [&>ul]:list-disc [&>ul]:text-brand-700 [&>ol]:mt-4 [&>ol]:space-y-2 [&>ol]:pl-5 [&>ol]:list-decimal [&>ol]:text-brand-700 [&>blockquote]:mt-6 [&>blockquote]:border-l-4 [&>blockquote]:border-accent-400 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-brand-600 [&>img]:my-6 [&>img]:w-full [&>img]:rounded-lg [&_a]:text-accent-600 [&_a]:underline [&_a:hover]:text-accent-500"
            dangerouslySetInnerHTML={{ __html: post.rawHtmlBody! }}
          />
        ) : (
          /* Fallback: render description text for placeholder posts */
          ("descriptionText" in post &&
            (post as FallbackBlogPost).descriptionText?.map(
              (paragraph: string, i: number) => (
                <p
                  key={i}
                  className="mt-4 first:mt-8 text-base leading-relaxed text-brand-700"
                >
                  {paragraph}
                </p>
              )
            )) || (
            <p className="mt-8 text-brand-500 italic">
              Content is being prepared. Check back soon.
            </p>
          )
        )}
      </Section>

      {/* FAQ section */}
      {hasFaq && (
        <Section width="content" className="bg-brand-50">
          <FaqSection faqs={post.faq!} />
        </Section>
      )}

      {/* Topic hub links */}
      {hasTopics && (
        <Section width="content">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-brand-500">
              Filed under:
            </span>
            {post.topics.map((topic) => (
              <Link
                key={topic._id}
                href={`/topics/${topic.slug}`}
                className="rounded-full bg-brand-100 px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-700 hover:text-white"
              >
                {topic.title}
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <Section width="wide" className="bg-brand-50">
          <RelatedPosts posts={relatedPosts} />
        </Section>
      )}

      {/* Contextual CTA — related keynote or generic */}
      <Section width="content">
        <ContextualCta relatedKeynote={post.relatedKeynote} />
      </Section>

      {/* Final soft CTA → /speaker (always present per SEO strategy) */}
      <Section
        width="content"
        className="bg-accent-600 text-center text-white rounded-none"
      >
        <h2 className="text-2xl font-bold sm:text-3xl">
          Want Nic at Your Next Event?
        </h2>
        <p className="mt-4 text-lg text-accent-100">
          Virtual keynotes for conferences, corporate events, team offsites,
          and webinars. Worldwide delivery.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-accent-600 transition-colors hover:bg-accent-100"
          >
            Book Nic for Your Event
          </Link>
          <Link
            href="/speaker"
            className="inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            About Nic as a Speaker
          </Link>
        </div>
      </Section>
    </>
  );
}

/* ---------- Fallback data ---------- */

interface FallbackBlogPost extends BlogPostData {
  descriptionText: string[];
}

/**
 * Fallback slugs — used when Sanity has no published posts.
 * Ensures generateStaticParams always returns at least one entry
 * (required by Next.js static export).
 */
const FALLBACK_SLUGS = [{ slug: "placeholder" }];

const FALLBACK_POSTS: Record<string, FallbackBlogPost> = {
  placeholder: {
    _id: "fp-placeholder",
    title: "New Content Coming Soon",
    slug: "placeholder",
    excerpt:
      "Nic is publishing new articles on curiosity, innovation, AI, and building businesses. Subscribe to be the first to read them.",
    publishedAt: new Date().toISOString(),
    updatedAt: null,
    estimatedReadTime: 2,
    body: null,
    rawHtmlBody: null,
    featuredImage: null,
    faq: null,
    topics: [
      { _id: "t1", title: "Curiosity", slug: "curiosity" },
      { _id: "t2", title: "Innovation", slug: "innovation" },
    ],
    relatedKeynote: null,
    seo: null,
    descriptionText: [
      "New articles are on the way. Nic writes about curiosity, innovation, AI, entrepreneurship, focus, agency, and failure — drawing from 20+ years of building businesses and 4 startup exits.",
      "In the meantime, explore the topic hubs or check out Nic's virtual keynotes for a deeper dive into these ideas.",
    ],
  },
};
