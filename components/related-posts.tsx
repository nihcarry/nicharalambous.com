/**
 * Related posts on an article. Titles and excerpts only.
 */

interface RelatedPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string | null;
  estimatedReadTime: number | null;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
  className?: string;
}

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function RelatedPosts({ posts, className = "" }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className={className}>
      <h2>Related articles</h2>
      <div className="related" style={{ marginTop: 24 }}>
        {posts.map((post) => {
          const date = formatDate(post.publishedAt);
          const meta = [date, post.estimatedReadTime ? `${post.estimatedReadTime} min` : null]
            .filter(Boolean)
            .join(" · ");
          return (
            <a key={post._id} href={`/blog/${post.slug}`}>
              {meta ? <span className="meta">{meta}</span> : null}
              <h3>{post.title}</h3>
              {post.excerpt ? <p>{post.excerpt}</p> : null}
            </a>
          );
        })}
      </div>
    </div>
  );
}
