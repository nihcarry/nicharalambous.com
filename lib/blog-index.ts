import { client } from "@/lib/sanity/client";
import { blogPostsListQuery, type BlogPostListItem } from "@/lib/sanity/queries";

export const BLOG_PAGE_SIZE = 12;

export const BLOG_TOPICS = [
  { slug: "curiosity", title: "Curiosity" },
  { slug: "innovation", title: "Innovation" },
  { slug: "entrepreneurship", title: "Entrepreneurship" },
  { slug: "focus", title: "Focus" },
  { slug: "ai", title: "AI" },
  { slug: "agency", title: "Agency" },
  { slug: "failure", title: "Failure" },
] as const;

export function blogPagePath(page: number): string {
  return page <= 1 ? "/blog" : `/blog/page/${page}`;
}

export async function getBlogPosts(): Promise<BlogPostListItem[]> {
  try {
    const data = await client.fetch<BlogPostListItem[]>(blogPostsListQuery);
    return Array.isArray(data) ? data.filter((post) => post?.slug) : [];
  } catch {
    return [];
  }
}

/** Pages of the compact grid. The newest post is the feature card, not a grid card. */
export function blogPageCount(totalPosts: number): number {
  const gridPosts = Math.max(0, totalPosts - 1);
  return Math.max(1, Math.ceil(gridPosts / BLOG_PAGE_SIZE));
}
