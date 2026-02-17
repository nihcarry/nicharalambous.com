/**
 * Most Read Hero — featured post highlight for the /blog page.
 *
 * Displays a single featured post (or the first of multiple) in a
 * prominent hero layout with badge, excerpt, and CTA. Designed to
 * draw attention to the site's highest-performing content.
 */
import Link from "next/link";
import { CTAButton } from "@/components/cta-button";

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

export function MostReadHero({ posts, className = "" }: MostReadHeroProps) {
  if (!posts || posts.length === 0) return null;

  const primary = posts[0];
  const secondary = posts.slice(1, 3);

  return (
    <div className={className}>
      {/* Section heading */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
          <svg
            className="h-4 w-4 text-amber-600"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M10 1l2.39 4.843 5.346.777-3.868 3.77.913 5.326L10 13.208l-4.781 2.508.913-5.326L2.264 6.62l5.346-.777L10 1z" />
          </svg>
        </div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-brand-500">
          Most Read
        </h2>
      </div>

      {/* Primary featured post */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white shadow-sm transition-shadow hover:shadow-lg">
        <div className="grid gap-0 lg:grid-cols-2">
          {/* Left: content */}
          <div className="flex flex-col justify-center p-8 lg:p-12">
            {/* Badge */}
            {primary.featuredLabel && (
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                <svg
                  className="h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                    clipRule="evenodd"
                  />
                </svg>
                {primary.featuredLabel}
              </span>
            )}

            {/* Topic tags */}
            {primary.topics && primary.topics.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {primary.topics.map((topic) => (
                  <Link
                    key={topic._id}
                    href={`/topics/${topic.slug}`}
                    className="rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-medium text-accent-600 transition-colors hover:bg-accent-600 hover:text-white"
                  >
                    {topic.title}
                  </Link>
                ))}
              </div>
            )}

            <h3 className="mt-4 text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl lg:text-4xl">
              {primary.title}
            </h3>

            {primary.excerpt && (
              <p className="mt-4 text-base leading-relaxed text-brand-600 lg:text-lg">
                {primary.excerpt}
              </p>
            )}

            {/* Meta */}
            <div className="mt-4 flex items-center gap-3 text-sm text-brand-400">
              {primary.publishedAt && (
                <time dateTime={primary.publishedAt}>
                  {new Date(primary.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
              {primary.estimatedReadTime && (
                <span>{primary.estimatedReadTime} min read</span>
              )}
              {primary.videoEmbed && (
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
                  Video available
                </span>
              )}
            </div>

            <div className="mt-6">
              <CTAButton href={`/blog/${primary.slug}`}>
                Read the Article
              </CTAButton>
            </div>
          </div>

          {/* Right: featured image or decorative */}
          <div className="relative hidden lg:block">
            {primary.featuredImage?.asset?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={primary.featuredImage.asset.url}
                alt={primary.featuredImage.alt || primary.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-50 to-accent-100">
                <div className="text-center p-8">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent-200">
                    <svg
                      className="h-10 w-10 text-accent-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                      />
                    </svg>
                  </div>
                  <p className="mt-4 text-lg font-semibold text-accent-600">
                    500K+ Reads
                  </p>
                  <p className="mt-1 text-sm text-accent-500">on Medium</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary featured posts (if any) */}
      {secondary.length > 0 && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {secondary.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="group flex items-start gap-4 rounded-xl border border-brand-200 bg-white p-5 transition-all hover:border-accent-400 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                <svg
                  className="h-5 w-5 text-amber-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-brand-900 group-hover:text-accent-600">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-1 text-sm text-brand-500 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                {post.featuredLabel && (
                  <span className="mt-2 inline-block text-xs font-medium text-amber-600">
                    {post.featuredLabel}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
