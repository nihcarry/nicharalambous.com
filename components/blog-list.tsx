/**
 * Blog listing with client-side pagination and topic filtering.
 *
 * All post data is embedded at build time (static export). The component
 * handles pagination and filtering entirely client-side. Shows 12 posts
 * per page with numbered pagination and topic filter chips.
 *
 * Uses the lightest card treatment (border-2) per design system spec —
 * appropriate for high-density listing. Sharp corners throughout.
 */
"use client";

import { useState, useMemo } from "react";
import { ArrowRight, Crosshair } from "lucide-react";

interface TopicFilter {
  _id: string;
  title: string;
  slug: string;
}

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string;
  estimatedReadTime: number | null;
  featuredImage: { asset: { url: string }; alt: string } | null;
  topics: TopicFilter[];
}

interface BlogListProps {
  posts: BlogPost[];
  topics: TopicFilter[];
}

const POSTS_PER_PAGE = 12;

/**
 * Returns a compact page range like [1, "ellipsis", 4, 5, 6, "ellipsis", 14]
 * so pagination fits on mobile screens.
 */
function getPageRange(
  current: number,
  total: number
): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [];
  const siblings = 1;
  const rangeStart = Math.max(2, current - siblings);
  const rangeEnd = Math.min(total - 1, current + siblings);

  pages.push(1);
  if (rangeStart > 2) pages.push("ellipsis");
  for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
  if (rangeEnd < total - 1) pages.push("ellipsis");
  pages.push(total);

  return pages;
}

export function BlogList({ posts, topics }: BlogListProps) {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  /* Filter posts by selected topic */
  const filteredPosts = useMemo(() => {
    if (!activeTopic) return posts;
    return posts.filter((post) =>
      post.topics?.some((t) => t.slug === activeTopic)
    );
  }, [posts, activeTopic]);

  /* Paginate */
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  /* Reset to page 1 when filter changes */
  const handleTopicFilter = (slug: string | null) => {
    setActiveTopic(slug);
    setCurrentPage(1);
  };

  return (
    <>
      {/* Topic filter chips */}
      {topics.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleTopicFilter(null)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTopic === null
                ? "bg-accent-600 text-white"
                : "bg-brand-100 text-brand-700 hover:bg-brand-200"
            }`}
          >
            All
          </button>
          {topics.map((topic) => (
            <button
              key={topic._id}
              type="button"
              onClick={() => handleTopicFilter(topic.slug)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTopic === topic.slug
                  ? "bg-accent-600 text-white"
                  : "bg-brand-100 text-brand-700 hover:bg-brand-200"
              }`}
            >
              {topic.title}
            </button>
          ))}
        </div>
      )}

      {/* Post grid */}
      {paginatedPosts.length > 0 ? (
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedPosts.map((post, i) => (
            <a
              key={post._id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col border border-brand-900 bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs tracking-widest text-accent-600">
                  POST_{String(((currentPage - 1) * POSTS_PER_PAGE) + i + 1).padStart(2, "0")}
                </span>
                <Crosshair className="h-4 w-4 text-accent-600" aria-hidden="true" />
              </div>
              <div className="my-3 border-t border-brand-200" />

              {post.featuredImage?.asset?.url && (
                <div className="mb-4 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.featuredImage.asset.url}
                    alt={post.featuredImage.alt || post.title}
                    className="aspect-[16/9] w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              <h2 className="text-lg font-extrabold uppercase leading-tight tracking-tight text-brand-900 transition-colors group-hover:text-accent-600">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="mt-3 flex-1 font-mono text-sm leading-relaxed text-brand-600">
                  {post.excerpt}
                </p>
              )}

              {post.topics && post.topics.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {post.topics.map((topic) => (
                    <span
                      key={topic._id}
                      className="bg-brand-100 px-2.5 py-0.5 font-mono text-xs text-brand-600"
                    >
                      {topic.title}
                    </span>
                  ))}
                </div>
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
      ) : (
        <p className="mt-8 text-center text-brand-500">
          No posts found for this topic yet.
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          className="mt-12 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
          aria-label="Blog pagination"
        >
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="border border-brand-200 px-3 py-2 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Prev
          </button>
          {getPageRange(currentPage, totalPages).map((item, i) =>
            item === "ellipsis" ? (
              <span
                key={`ellipsis-${i}`}
                className="px-1.5 py-2 text-sm text-brand-400"
              >
                &hellip;
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => setCurrentPage(item)}
                className={`min-w-[2.25rem] px-2 py-2 text-sm font-medium transition-colors ${
                  item === currentPage
                    ? "bg-accent-600 text-white"
                    : "border border-brand-200 text-brand-600 hover:bg-brand-50"
                }`}
              >
                {item}
              </button>
            )
          )}
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="border border-brand-200 px-3 py-2 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </nav>
      )}

      {/* Post count */}
      <p className="mt-4 text-center text-sm text-brand-400">
        {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
        {activeTopic && " in this topic"}
      </p>
    </>
  );
}
