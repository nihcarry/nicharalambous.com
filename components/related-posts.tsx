/**
 * Related Posts component.
 *
 * Displays up to 3 related blog posts from the same topic hub.
 * Used at the bottom of /blog/[slug] pages to keep readers engaged
 * and strengthen internal linking within topic clusters.
 */

import { ArrowRight, Crosshair } from "lucide-react";

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
        {posts.map((post, i) => (
          <a
            key={post._id}
            href={`/blog/${post.slug}`}
            className="group flex flex-col border border-brand-900 bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs tracking-widest text-accent-600">
                RELATED_{String(i + 1).padStart(2, "0")}
              </span>
              <Crosshair className="h-4 w-4 text-accent-600" aria-hidden="true" />
            </div>
            <div className="my-3 border-t border-brand-200" />
            <h3 className="text-lg font-extrabold uppercase leading-tight tracking-tight text-brand-900 transition-colors group-hover:text-accent-600">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="mt-3 flex-1 font-mono text-sm leading-relaxed text-brand-600">
                {post.excerpt}
              </p>
            )}
            <div className="mt-auto pt-6">
              <div className="border-t border-brand-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs tracking-widest text-brand-500">
                    {post.publishedAt && new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    {post.estimatedReadTime && ` · ${post.estimatedReadTime} min`}
                  </span>
                  <ArrowRight className="h-4 w-4 text-accent-600 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
