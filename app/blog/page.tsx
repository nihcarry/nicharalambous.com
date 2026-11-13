/**
 * Blog — /blog
 * A reading list of published posts, plus the newsletter.
 */
import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { blogPostsListQuery, type BlogPostListItem } from "@/lib/sanity/queries";
import { JsonLd } from "@/components/json-ld";
import { NewsletterBlock } from "@/components/site/newsletter-block";
import { SearchUI } from "@/app/search/search-ui";
import { collectionPageJsonLd } from "@/lib/metadata";
import { OUTPUT_PARADOX_PATH } from "@/lib/site";

async function getBlogPosts(): Promise<BlogPostListItem[] | null> {
  try {
    const data = await client.fetch<BlogPostListItem[]>(blogPostsListQuery);
    return data && data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on curiosity, innovation, AI, entrepreneurship, focus, and failure by Nic Haralambous. Real stories and actionable frameworks from 20+ years of building businesses.",
  alternates: { canonical: "https://www.nicharalambous.com/blog" },
  openGraph: {
    type: "website",
    title: "Blog | Nic Haralambous",
    description: "Articles on curiosity, innovation, AI, entrepreneurship, and building businesses.",
    url: "https://www.nicharalambous.com/blog",
  },
};

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function BlogPage() {
  const posts = (await getBlogPosts()) || [];

  return (
    <div className="v3">
      <JsonLd
        data={collectionPageJsonLd({
          name: "Blog | Nic Haralambous",
          description: "Articles on curiosity, innovation, AI, entrepreneurship, focus, and failure.",
          url: "https://www.nicharalambous.com/blog",
        })}
      />
      <section className="p-quill">
        <div className="wrap">
          <h1>Blog</h1>
          <p className="lead">
            Real stories and actionable frameworks from 20+ years of building, failing, and learning.
          </p>
          <div style={{ marginTop: 28, maxWidth: 520 }}>
            <SearchUI blogOnly placeholder="Search blog posts..." />
          </div>
        </div>
      </section>
      <section>
        <div className="wrap">
          {posts.length > 0 ? (
            <div className="read-list">
              {posts.map((post) => {
                const meta = [
                  formatDate(post.publishedAt),
                  post.estimatedReadTime ? `${post.estimatedReadTime} min` : null,
                ]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <a className="row" href={`/blog/${post.slug}`} key={post._id}>
                    {meta ? <span className="meta">{meta}</span> : null}
                    <h2>{post.title}</h2>
                    {post.excerpt ? <p>{post.excerpt}</p> : null}
                  </a>
                );
              })}
            </div>
          ) : (
            <div>
              <p>New articles are on the way. In the meantime, explore the topics that Nic writes and speaks about.</p>
              <div className="acts" style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
                <a className="btn" href="/topics">
                  Explore topics
                </a>
                <a className="link" href={OUTPUT_PARADOX_PATH}>
                  See the keynote
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="dark">
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2>Want these ideas as a keynote?</h2>
          <p className="lead" style={{ margin: "16px auto 0", color: "#c9cdd6" }}>
            The ideas on this blog come alive in Nic&apos;s keynotes, in person or virtually. Real stories, actionable frameworks, tailored to your team.
          </p>
          <div className="acts" style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
            <a className="btn" href={OUTPUT_PARADOX_PATH}>
              See the keynote
            </a>
            <a className="quiet-link" href="/#newsletter">
              Subscribe to the newsletter
            </a>
          </div>
        </div>
      </section>
      <NewsletterBlock />
    </div>
  );
}
