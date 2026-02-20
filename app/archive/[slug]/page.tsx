/**
 * Archive Post Page — /archive/{slug}
 *
 * Minimal template for unoptimized legacy content imported from
 * Squarespace, Medium, or Substack. Renders raw HTML with a
 * "From the archive" banner and link back to /blog.
 *
 * Per SEO strategy: no structured data beyond basic WebPage.
 * noIndex by default — these are reference copies, not primary content.
 *
 * Static params generated at build time — one page per archived post.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import {
  archivePostBySlugQuery,
  archivePostSlugListQuery,
  type ArchivePostData,
} from "@/lib/sanity/queries";
import { Section } from "@/components/section";
import { CTAButton } from "@/components/cta-button";

/* ---------- Data fetching ---------- */

async function getArchivePost(slug: string): Promise<ArchivePostData | null> {
  try {
    const data = await client.fetch<ArchivePostData | null>(
      archivePostBySlugQuery,
      { slug }
    );
    return data;
  } catch {
    return null;
  }
}

async function getArchiveSlugs(): Promise<{ slug: string }[]> {
  try {
    const data = await client.fetch<{ slug: string }[]>(
      archivePostSlugListQuery
    );
    return data && data.length > 0 ? data : FALLBACK_SLUGS;
  } catch {
    return FALLBACK_SLUGS;
  }
}

/* ---------- Static params ---------- */

export async function generateStaticParams() {
  const slugs = await getArchiveSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

/* ---------- Metadata ---------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getArchivePost(slug)) || FALLBACK_ARCHIVE_POSTS[slug];
  if (!post) return { title: "Archive Post Not Found" };

  return {
    title: `${post.title} (Archive)`,
    description: `Archived post: ${post.title} by Nic Haralambous`,
    robots: { index: false, follow: true },
    alternates: {
      canonical: `https://nicharalambous.com/archive/${slug}`,
    },
  };
}

/* ---------- Page ---------- */

export default async function ArchivePostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cmsPost = await getArchivePost(slug);
  const fallback = FALLBACK_ARCHIVE_POSTS[slug];
  const post = cmsPost || fallback;

  if (!post) {
    notFound();
  }

  return (
    <>
      {/* Archive banner */}
      <Section width="content">
        <div className="border-2 border-brand-300 bg-brand-50 p-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-500">
            From the Archive
          </p>
          <p className="mt-2 text-base text-brand-600">
            This post is from the archive and may not reflect Nic&rsquo;s
            current thinking. For the latest articles and insights, visit the{" "}
            <Link
              href="/blog"
              className="font-semibold text-accent-600 underline hover:text-accent-500"
            >
              blog
            </Link>
            .
          </p>
        </div>
      </Section>

      {/* Article header */}
      <Section width="content" as="article">
        <header>
          <h1 className="heading-display-stroke-sm text-4xl text-brand-900 sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-brand-500">
            <span>By Nic Haralambous</span>
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                Originally published{" "}
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
          </div>

          {/* Topic tags */}
          {post.topics && post.topics.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.topics.map((topic) => (
                <Link
                  key={topic._id}
                  href={`/topics/${topic.slug}`}
                  className="bg-brand-100 px-3 py-1 text-xs font-medium text-brand-600 transition-colors hover:bg-brand-200"
                >
                  {topic.title}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Raw HTML body */}
        {post.rawHtmlBody ? (
          <div
            className="mt-8 [&>p]:mt-4 [&>p]:text-base [&>p]:leading-relaxed [&>p]:text-brand-700 [&>h2]:mt-10 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-brand-900 [&>h3]:mt-8 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-brand-900 [&>ul]:mt-4 [&>ul]:space-y-2 [&>ul]:pl-5 [&>ul]:list-disc [&>ul]:text-brand-700 [&>ol]:mt-4 [&>ol]:space-y-2 [&>ol]:pl-5 [&>ol]:list-decimal [&>ol]:text-brand-700 [&>blockquote]:mt-6 [&>blockquote]:border-l-4 [&>blockquote]:border-brand-300 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-brand-600 [&>img]:my-6 [&>img]:w-full [&>img]:rounded-lg [&_a]:text-accent-600 [&_a]:underline [&_a:hover]:text-accent-500"
            dangerouslySetInnerHTML={{ __html: post.rawHtmlBody }}
          />
        ) : (
          <p className="mt-8 text-brand-500 italic">
            Archive content is not available for this post.
          </p>
        )}
      </Section>

      {/* Original URL reference */}
      {post.originalUrl && (
        <Section width="content">
          <p className="text-sm text-brand-400">
            Originally published at:{" "}
            <a
              href={post.originalUrl}
              className="text-accent-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {post.originalUrl}
            </a>
          </p>
        </Section>
      )}

      {/* CTA to blog */}
      <Section width="content" className="text-center">
        <h2 className="heading-display text-3xl text-brand-900 sm:text-4xl">
          Read the Latest
        </h2>
        <p className="mt-4 text-lg text-brand-600">
          For Nic&rsquo;s current thinking on curiosity, innovation, AI, and
          building businesses, visit the blog.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <CTAButton href="/blog">Visit the Blog</CTAButton>
          <CTAButton href="/speaker" variant="secondary">
            About Nic as a Speaker
          </CTAButton>
        </div>
      </Section>
    </>
  );
}

/* ---------- Fallback data ---------- */

/**
 * Fallback slugs — ensures generateStaticParams always returns at
 * least one entry (required by Next.js static export).
 */
const FALLBACK_SLUGS = [{ slug: "placeholder" }];

const FALLBACK_ARCHIVE_POSTS: Record<string, ArchivePostData> = {
  placeholder: {
    _id: "fa-placeholder",
    title: "Archive",
    slug: "placeholder",
    publishedAt: null,
    rawHtmlBody:
      "<p>This is a placeholder for archived content. Archived posts from Medium, Substack, and Squarespace will appear here once imported.</p>",
    originalUrl: null,
    topics: [],
  },
};
