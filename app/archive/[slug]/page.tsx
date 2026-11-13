/**
 * Archive post — /archive/{slug}
 * Legacy articles, noindex, in the v3 reading layout.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/lib/sanity/client";
import {
  archivePostBySlugQuery,
  archivePostSlugListQuery,
  type ArchivePostData,
} from "@/lib/sanity/queries";
import { gateThirdPartyEmbeds } from "@/lib/gate-embeds";
import { ClosingCta } from "@/components/site/closing-cta";
import { OUTPUT_PARADOX_PATH } from "@/lib/site";

async function getArchivePost(slug: string): Promise<ArchivePostData | null> {
  try {
    return await client.fetch<ArchivePostData | null>(archivePostBySlugQuery, { slug });
  } catch {
    return null;
  }
}

async function getArchiveSlugs(): Promise<{ slug: string }[]> {
  const data = await client.fetch<{ slug: string }[]>(archivePostSlugListQuery);
  return data && data.length > 0 ? data : [{ slug: "_placeholder" }];
}

export async function generateStaticParams() {
  const slugs = await getArchiveSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getArchivePost(slug);
  if (!post) return { title: "Archive Post Not Found" };

  return {
    title: `${post.title} (Archive)`,
    description: `Archived post: ${post.title} by Nic Haralambous`,
    robots: { index: false, follow: true },
    alternates: { canonical: `https://www.nicharalambous.com/archive/${slug}` },
    openGraph: { url: `https://www.nicharalambous.com/archive/${slug}` },
  };
}

/** Turn double breaks in legacy HTML into paragraphs. Does not change the stored source. */
function paragraphiseArchiveHtml(html: string): string {
  const withBreaks = html.replace(/(?:<br\s*\/?>\s*){2,}/gi, "</p><p>");
  if (/<p[\s>]/i.test(withBreaks)) return withBreaks;
  const parts = withBreaks
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length < 2) return withBreaks;
  return parts.map((part) => `<p>${part}</p>`).join("");
}

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function ArchivePostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getArchivePost(slug);
  if (!post) notFound();

  const published = formatDate(post.publishedAt);

  return (
    <div className="v3 p-quill">
      <article>
        <section>
          <div className="wrap">
            <header>
              <h1>{post.title}</h1>
              <div className="article-meta">
                <p className="meta">
                  By Nic Haralambous
                  {published ? ` · Originally published ${published}` : ""}
                </p>
                {post.topics && post.topics.length > 0
                  ? post.topics.map((topic) => (
                      <a className="tag" key={topic._id} href={`/topics/${topic.slug}`}>
                        {topic.title}
                      </a>
                    ))
                  : null}
              </div>
            </header>
            <aside className="archive-note prose-col">
              This post is from the archive and may not reflect Nic&apos;s current thinking. For the latest articles and insights, visit the{" "}
              <a className="link" href="/blog">
                blog
              </a>
              .
            </aside>
            {post.rawHtmlBody ? (
              <div
                className="archive-body prose-col"
                data-no-orphan-opt-out="true"
                dangerouslySetInnerHTML={{ __html: gateThirdPartyEmbeds(paragraphiseArchiveHtml(post.rawHtmlBody)) }}
              />
            ) : (
              <p className="prose-col">Archive content is not available for this post.</p>
            )}
            {post.originalUrl ? (
              <p className="meta">
                Originally published at:{" "}
                <a className="link" href={post.originalUrl} target="_blank" rel="noopener noreferrer">
                  {post.originalUrl}
                </a>
              </p>
            ) : null}
          </div>
        </section>
      </article>
      <ClosingCta
        className="pd-quill"
        heading="Read the latest"
        copy="For Nic's current thinking on curiosity, innovation, AI, and building businesses, visit the blog."
        primaryHref="/blog"
        primaryLabel="Visit the blog"
        secondaryHref={OUTPUT_PARADOX_PATH}
        secondaryLabel="See the keynote"
      />
    </div>
  );
}
