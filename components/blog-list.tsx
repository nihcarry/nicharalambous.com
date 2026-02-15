/**
 * Blog listing with client-side pagination and topic filtering.
 *
 * All post data is embedded at build time (static export). The component
 * handles pagination and filtering entirely client-side. Shows 12 posts
 * per page with numbered pagination and topic filter chips.
 */
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

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
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
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
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
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
          {paginatedPosts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-xl border border-brand-200 p-6 transition-all hover:border-accent-400 hover:shadow-md"
            >
              {/* Featured image */}
              {post.featuredImage?.asset?.url && (
                <div className="mb-4 overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.featuredImage.asset.url}
                    alt={post.featuredImage.alt || post.title}
                    className="aspect-[16/9] w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              <h2 className="text-lg font-semibold text-brand-900 group-hover:text-accent-600">
                {post.title}
              </h2>
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

              {/* Topic tags */}
              {post.topics && post.topics.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {post.topics.map((topic) => (
                    <span
                      key={topic._id}
                      className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-600"
                    >
                      {topic.title}
                    </span>
                  ))}
                </div>
              )}
            </Link>
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
          className="mt-12 flex items-center justify-center gap-2"
          aria-label="Blog pagination"
        >
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-brand-200 px-3 py-2 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                page === currentPage
                  ? "bg-accent-600 text-white"
                  : "border border-brand-200 text-brand-600 hover:bg-brand-50"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-brand-200 px-3 py-2 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40"
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
