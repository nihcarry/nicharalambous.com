/**
 * Related Posts component.
 *
 * Displays up to 3 related blog posts from the same topic hub.
 * Used at the bottom of /blog/[slug] pages to keep readers engaged
 * and strengthen internal linking within topic clusters.
 */
import Link from "next/link";

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

export function RelatedPosts({ posts, className = "" }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className={className}>
      <h2 className="heading-display text-3xl text-brand-900 sm:text-4xl">Related Articles</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/blog/${post.slug}`}
            className="group flex flex-col border-2 border-accent-600 p-6 transition-colors hover:bg-accent-50"
          >
            <h3 className="heading-display text-lg text-brand-900 group-hover:text-accent-600">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-600">
                {post.excerpt}
              </p>
            )}
            <div className="mt-4 flex items-center gap-3 text-xs text-brand-400">
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              )}
              {post.estimatedReadTime && (
                <span>{post.estimatedReadTime} min read</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
