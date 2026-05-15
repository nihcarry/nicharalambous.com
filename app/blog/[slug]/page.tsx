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
import { client } from "@/lib/sanity/client";
import {
  blogPostBySlugQuery,
  blogPostBySlugDevQuery,
  blogPostSlugListQuery,
  blogPostSlugListDevQuery,
  relatedPostsQuery,
  type BlogPostData,
  type RelatedPostItem,
} from "@/lib/sanity/queries";

const postBySlugQuery =
  process.env.NODE_ENV === "development" ? blogPostBySlugDevQuery : blogPostBySlugQuery;
const postSlugListQuery =
  process.env.NODE_ENV === "development" ? blogPostSlugListDevQuery : blogPostSlugListQuery;
import { Section } from "@/components/section";
import { FinalCta } from "@/components/final-cta";
import { JsonLd } from "@/components/json-ld";
import { PortableText } from "@/components/portable-text";
import { FaqSection } from "@/components/faq-section";
import { RelatedPosts } from "@/components/related-posts";
import { ContextualCta } from "@/components/contextual-cta";
import { VideoReadAlong } from "@/components/video-read-along";
import { articleJsonLd, faqJsonLd } from "@/lib/metadata";

/* ---------- Data fetching ---------- */

async function getPost(slug: string): Promise<BlogPostData | null> {
  try {
    const data = await client.fetch<BlogPostData | null>(postBySlugQuery, {
      slug,
    });
    return data;
  } catch {
    return null;
  }
}

async function getPostSlugs(): Promise<{ slug: string }[]> {
  const data = await client.fetch<{ slug: string }[]>(postSlugListQuery);
  if (!data || data.length === 0) {
    throw new Error("No blog post slugs returned from Sanity");
  }
  return data;
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
  const post = await getPost(slug);
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
  const post = await getPost(slug);

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
  const hasVideo = post.videoEmbed && post.videoEmbed.trim().length > 0;

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
                <a
                  key={topic._id}
                  href={`/topics/${topic.slug}`}
                  className="bg-accent-100 px-3 py-1 text-xs font-medium text-accent-600 transition-colors hover:bg-accent-600 hover:text-white"
                >
                  {topic.title}
                </a>
              ))}
            </div>
          )}

          <h1 className="mt-4 heading-display-stroke-sm text-4xl text-brand-900 sm:text-5xl md:text-6xl">
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

        {/* Video Read-Along — above hero image when present */}
        {hasVideo && (
          <VideoReadAlong
            videoUrl={post.videoEmbed!}
            title={post.title}
            featuredLabel={post.featuredLabel}
            className="mt-8"
          />
        )}

        {/* Featured image */}
        {post.featuredImage?.asset?.url && (
          <figure className="mt-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featuredImage.asset.url}
              alt={post.featuredImage.alt || post.title}
              className="w-full"
            />
          </figure>
        )}

        {/* TL;DR / Excerpt block */}
        {post.excerpt && (
          <aside className="mt-8 border-l-[8px] border-accent-600 bg-brand-50 p-6">
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
          <div data-no-orphan-opt-out="true">
            <PortableText value={post.body} className="mt-8" />
          </div>
        ) : hasRawHtmlBody ? (
          <div
            data-no-orphan-opt-out="true"
            className={[
              "prose-imported mt-8",
              /* Paragraphs — clear separation between blocks */
              "[&>p]:mt-5 [&>p]:mb-0 [&>p]:text-base [&>p]:leading-relaxed [&>p]:text-brand-700",
              /* Headings — H1 for section titles (e.g. Notion imports), H2–H4 for hierarchy */
              "[&>h1]:mt-12 [&>h1]:mb-4 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-brand-900 [&>h1]:first:mt-8",
              "[&>h2]:mt-10 [&>h2]:mb-3 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-brand-900",
              "[&>h3]:mt-8 [&>h3]:mb-2 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-brand-900",
              "[&>h4]:mt-6 [&>h4]:mb-2 [&>h4]:text-lg [&>h4]:font-semibold [&>h4]:text-brand-800",
              /* Lists — breathing room above and between items */
              "[&>ul]:mt-5 [&>ul]:mb-5 [&>ul]:space-y-2 [&>ul]:pl-5 [&>ul]:list-disc [&>ul]:text-brand-700",
              "[&>ol]:mt-5 [&>ol]:mb-5 [&>ol]:space-y-2 [&>ol]:pl-5 [&>ol]:list-decimal [&>ol]:text-brand-700",
              "[&_li]:text-base [&_li]:leading-relaxed",
              /* Blockquotes */
              "[&>blockquote]:mt-6 [&>blockquote]:border-l-4 [&>blockquote]:border-accent-400 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-brand-600",
              /* Images — standalone and inside figures */
              "[&>img]:my-6 [&>img]:w-full [&>img]:rounded-lg",
              "[&>figure]:my-6 [&_figure_img]:w-full [&_figure_img]:rounded-lg",
              "[&_figcaption]:mt-2 [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:italic [&_figcaption]:text-brand-500",
              /* Horizontal rules */
              "[&>hr]:my-8 [&>hr]:border-brand-200",
              /* Iframes (embedded video etc.) */
              "[&>iframe]:my-6 [&>iframe]:aspect-video [&>iframe]:w-full [&>iframe]:rounded-lg",
              /* Links (any depth) */
              "[&_a]:text-accent-600 [&_a]:underline [&_a:hover]:text-accent-500",
              /* Strikethrough */
              "[&_s]:text-brand-400",
            ].join(" ")}
            dangerouslySetInnerHTML={{ __html: post.rawHtmlBody! }}
          />
        ) : (
          <p className="mt-8 text-brand-500 italic">
            Content is being prepared. Check back soon.
          </p>
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
              <a
                key={topic._id}
                href={`/topics/${topic.slug}`}
                className="bg-brand-100 px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-700 hover:text-white"
              >
                {topic.title}
              </a>
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
      <FinalCta
        heading="Want Nic at Your Next Event?"
        description="Virtual keynotes for conferences, corporate events, team offsites, and webinars. Worldwide delivery."
        primaryHref="/speaker"
        primaryLabel="About Nic as a Speaker"
        secondaryHref="/contact"
        secondaryLabel="Book Nic for Your Event"
      />
    </>
  );
}

