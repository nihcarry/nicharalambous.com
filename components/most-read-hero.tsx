/**
 * Most Read — top 5 articles for the /blog page.
 *
 * Displays a curated list of up to 5 posts in a consistent card layout
 * with rank, title, excerpt, topics, and CTA. Same visual language as
 * before (amber accent, borders, star icon).
 */
import Link from "next/link";

interface FeaturedPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string;
  estimatedReadTime: number | null;
  featuredLabel: string | null;
  videoEmbed: string | null;
  featuredImage: { asset: { url: string }; alt: string } | null;
  topics: { _id: string; title: string; slug: string }[];
}

interface MostReadHeroProps {
  posts: FeaturedPost[];
  className?: string;
}

const StarIcon = () => (
  <svg
    className="h-4 w-4 text-amber-600"
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    <path d="M10 1l2.39 4.843 5.346.777-3.868 3.77.913 5.326L10 13.208l-4.781 2.508.913-5.326L2.264 6.62l5.346-.777L10 1z" />
  </svg>
);

export function MostReadHero({ posts, className = "" }: MostReadHeroProps) {
  if (!posts || posts.length === 0) return null;

  const displayPosts = posts.slice(0, 5);

  return (
    <div className={className}>
      {/* Section heading */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
          <StarIcon />
        </div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-brand-500">
          Most Read
        </h2>
      </div>

      {/* Top 5 list */}
      <ul className="mt-6 space-y-4" role="list">
        {displayPosts.map((post, index) => (
          <li key={post._id}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex items-start gap-4 overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6 shadow-sm transition-shadow hover:border-amber-300 hover:shadow-lg sm:gap-6"
            >
              {/* Rank */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                {index + 1}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                {post.featuredLabel && (
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                    <svg
                      className="h-3 w-3 text-amber-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M10 1l2.39 4.843 5.346.777-3.868 3.77.913 5.326L10 13.208l-4.781 2.508.913-5.326L2.264 6.62l5.346-.777L10 1z" />
                    </svg>
                    {post.featuredLabel}
                  </span>
                )}
                {post.topics && post.topics.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {post.topics.map((topic) => (
                      <Link
                        key={topic._id}
                        href={`/topics/${topic.slug}`}
                        className="rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-medium text-accent-600 transition-colors hover:bg-accent-600 hover:text-white"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {topic.title}
                      </Link>
                    ))}
                  </div>
                )}
                <h3 className="mt-2 text-lg font-bold tracking-tight text-brand-900 group-hover:text-amber-700 sm:text-xl">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 text-sm leading-relaxed text-brand-600 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-brand-400">
                  {post.publishedAt && (
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  )}
                  {post.estimatedReadTime != null && (
                    <span>{post.estimatedReadTime} min read</span>
                  )}
                  {post.videoEmbed && (
                    <span className="flex items-center gap-1">
                      <svg
                        className="h-3.5 w-3.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Video
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 group-hover:text-amber-800">
                    Read the Article
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Thumbnail (optional, on larger screens) */}
              {post.featuredImage?.asset?.url && (
                <div className="relative hidden h-24 w-32 shrink-0 overflow-hidden rounded-lg sm:block lg:h-28 lg:w-36">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.featuredImage.asset.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
