/**
 * RSS Feed — /rss.xml
 *
 * Generates an RSS 2.0 feed of the 50 most recent published blog posts.
 * Pre-rendered at build time as part of the static export.
 *
 * Feed is discoverable via <link> tag in the root layout and referenced
 * in robots.txt.
 */
import { client } from "@/lib/sanity/client";
import { rssFeedPostsQuery, type RssFeedPost } from "@/lib/sanity/queries";

/** Required for Next.js static export (output: "export") */
export const dynamic = "force-static";

const SITE_URL = "https://nicharalambous.com";
const FEED_TITLE = "Nic Haralambous | Blog";
const FEED_DESCRIPTION =
  "Articles on curiosity, innovation, AI, entrepreneurship, focus, and failure by Nic Haralambous.";

/** Escape special XML characters */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  let posts: RssFeedPost[] = [];

  try {
    const data = await client.fetch<RssFeedPost[]>(rssFeedPostsQuery);
    posts = data || [];
  } catch {
    /* Feed generates empty if Sanity is unavailable */
  }

  const lastBuildDate =
    posts.length > 0
      ? new Date(posts[0].publishedAt).toUTCString()
      : new Date().toUTCString();

  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      ${post.excerpt ? `<description>${escapeXml(post.excerpt)}</description>` : ""}
      ${post.topics?.map((t) => `<category>${escapeXml(t.title)}</category>`).join("\n      ") || ""}
    </item>`
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>nic@nicharalambous.com (Nic Haralambous)</managingEditor>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
