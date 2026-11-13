/**
 * Blog index, page 1. Later pages live at /blog/page/2 and so on.
 */
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { BlogFeed } from "@/components/site/blog-feed";
import { ClosingCta } from "@/components/site/closing-cta";
import { blogPageCount, getBlogPosts } from "@/lib/blog-index";
import { collectionPageJsonLd } from "@/lib/metadata";
import { OUTPUT_PARADOX_PATH } from "@/lib/site";

const URL = "https://www.nicharalambous.com/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on curiosity, innovation, AI, entrepreneurship, focus, and failure by Nic Haralambous. Real stories and actionable frameworks from 20+ years of building businesses.",
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    title: "Blog | Nic Haralambous",
    description: "Articles on curiosity, innovation, AI, entrepreneurship, and building businesses.",
    url: URL,
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const pageCount = blogPageCount(posts.length);

  return (
    <div className="v3 p-quill">
      <JsonLd
        data={collectionPageJsonLd({
          name: "Blog | Nic Haralambous",
          description: "Articles on curiosity, innovation, AI, entrepreneurship, focus, and failure.",
          url: URL,
        })}
      />
      <BlogFeed posts={posts} page={1} pageCount={pageCount} />
      <ClosingCta
        className="pd-quill"
        heading="Want these ideas as a keynote?"
        copy="The ideas on this blog come alive in Nic's keynotes, in person or virtually. Real stories, actionable frameworks, tailored to your team."
        primaryHref={OUTPUT_PARADOX_PATH}
        primaryLabel="See the keynote"
        secondaryHref="/#newsletter"
        secondaryLabel="Subscribe to the newsletter"
      />
    </div>
  );
}
