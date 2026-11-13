import type { BlogPostListItem } from "@/lib/sanity/queries";
import { BLOG_PAGE_SIZE, blogPagePath } from "@/lib/blog-index";
import { NewsletterBlock } from "@/components/site/newsletter-block";
import { TopicChips } from "@/components/site/topic-chips";
import { SearchUI } from "@/app/search/search-ui";

function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function metaLine(post: BlogPostListItem): string {
  return [formatDate(post.publishedAt), post.estimatedReadTime ? `${post.estimatedReadTime} min` : null]
    .filter(Boolean)
    .join(" · ");
}

export function BlogFeed({
  posts,
  page,
  pageCount,
}: {
  posts: BlogPostListItem[];
  page: number;
  pageCount: number;
}) {
  const latest = page === 1 ? posts[0] : null;
  const grid = posts.slice(1);
  const start = (page - 1) * BLOG_PAGE_SIZE;
  const cards = grid.slice(start, start + BLOG_PAGE_SIZE);
  const first = cards.slice(0, 6);
  const second = cards.slice(6);
  const prev = page > 1 ? blogPagePath(page - 1) : null;
  const next = page < pageCount ? blogPagePath(page + 1) : null;

  return (
    <>
      {prev ? <link rel="prev" href={prev} /> : null}
      {next ? <link rel="next" href={next} /> : null}
      <section>
        <div className="wrap">
          <h1>Blog</h1>
          <p className="lead">
            Real stories and actionable frameworks from 20+ years of building, failing, and learning.
          </p>
          <TopicChips />
          <div style={{ marginTop: 28, maxWidth: 520 }}>
            <SearchUI blogOnly placeholder="Search blog posts..." />
          </div>
        </div>
      </section>
      {latest ? (
        <section>
          <div className="wrap">
            <h2>Latest</h2>
            <a className="feature-card" href={`/blog/${latest.slug}`}>
              {latest.featuredImage?.asset?.url ? (
                <img
                  src={latest.featuredImage.asset.url}
                  alt={latest.featuredImage.alt || ""}
                  width={latest.featuredImage.asset.width || 1200}
                  height={latest.featuredImage.asset.height || 675}
                />
              ) : (
                <span className="feature-fallback" aria-hidden="true" />
              )}
              <span>
                {metaLine(latest) ? <span className="meta">{metaLine(latest)}</span> : null}
                <h3>{latest.title}</h3>
                {latest.excerpt ? <p>{latest.excerpt}</p> : null}
              </span>
            </a>
          </div>
        </section>
      ) : null}
      <section>
        <div className="wrap">
          {cards.length > 0 ? (
            <div className="post-grid">
              {first.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : page === 1 && !latest ? (
            <p>New articles are on the way. In the meantime, explore the topics that Nic writes and speaks about.</p>
          ) : null}
        </div>
      </section>
      {cards.length > 0 ? <NewsletterBlock /> : null}
      <section>
        <div className="wrap">
          {second.length > 0 ? (
            <div className="post-grid">
              {second.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : null}
          {pageCount > 1 ? (
            <nav className="pager" aria-label="Blog pages">
              {prev ? <a href={prev}>Previous</a> : <span>Previous</span>}
              {Array.from({ length: pageCount }, (_, index) => {
                const number = index + 1;
                const href = blogPagePath(number);
                return number === page ? (
                  <a key={number} href={href} aria-current="page" className="is-on">
                    {number}
                  </a>
                ) : (
                  <a key={number} href={href}>
                    {number}
                  </a>
                );
              })}
              {next ? <a href={next}>Next</a> : <span>Next</span>}
            </nav>
          ) : null}
        </div>
      </section>
    </>
  );
}

function PostCard({ post }: { post: BlogPostListItem }) {
  const topic = post.topics?.[0];
  return (
    <a className="post-card" href={`/blog/${post.slug}`}>
      <h3>{post.title}</h3>
      {post.excerpt ? <p>{post.excerpt}</p> : null}
      <span className="meta">
        {topic ? topic.title : "Blog"}
        {metaLine(post) ? ` · ${metaLine(post)}` : ""}
      </span>
    </a>
  );
}
