/**
 * Blog index pages 2 and onward. /blog/page/1 is not generated.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { BlogFeed } from "@/components/site/blog-feed";
import { ClosingCta } from "@/components/site/closing-cta";
import { blogPageCount, blogPagePath, getBlogPosts } from "@/lib/blog-index";
import { collectionPageJsonLd } from "@/lib/metadata";
import { OUTPUT_PARADOX_PATH } from "@/lib/site";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  const pageCount = blogPageCount(posts.length);
  return Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) => ({
    page: String(index + 2),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page: raw } = await params;
  const page = Number(raw);
  const posts = await getBlogPosts();
  const pageCount = blogPageCount(posts.length);
  if (!Number.isInteger(page) || page < 2 || page > pageCount) {
    return { title: "Blog" };
  }
  const path = blogPagePath(page);
  const url = `https://www.nicharalambous.com${path}`;
  return {
    title: `Blog, page ${page}`,
    description:
      "Articles on curiosity, innovation, AI, entrepreneurship, focus, and failure by Nic Haralambous.",
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: `Blog, page ${page} | Nic Haralambous`,
      url,
    },
  };
}

export default async function BlogPaged({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page: raw } = await params;
  const page = Number(raw);
  const posts = await getBlogPosts();
  const pageCount = blogPageCount(posts.length);
  if (!Number.isInteger(page) || page < 2 || page > pageCount) notFound();

  const path = blogPagePath(page);
  const url = `https://www.nicharalambous.com${path}`;

  return (
    <div className="v3 p-quill">
      <JsonLd
        data={collectionPageJsonLd({
          name: `Blog, page ${page} | Nic Haralambous`,
          description: "Articles on curiosity, innovation, AI, entrepreneurship, focus, and failure.",
          url,
        })}
      />
      <BlogFeed posts={posts} page={page} pageCount={pageCount} />
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
