/**
 * Individual Blog Post Page — /blog/{slug}
 *
 * Full article template for published blog posts. Supports two content
 * rendering modes:
 *   1. Portable Text (`body`) — for manually written or AI-optimized posts
 *   2. Raw HTML (`rawHtmlBody`) — for as-is Medium/Substack imports
 *
 * Sections (per SEO strategy):
 *   1. TL;DR / excerpt (when present)
 *   2. Main content (Portable Text or raw HTML)
 *   3. FAQ section (when present) — targets "People Also Ask"
 *   4. Topic hub links
 *   5. Related posts (same topic hub)
 *   6. Contextual CTA (related keynote or generic /speaker)
 *
 * JSON-LD: Article + FAQPage (when FAQs present)
 * Static params generated at build time — one page per published post.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import {
  blogPostBySlugQuery,
  blogPostSlugListQuery,
  relatedPostsQuery,
  type BlogPostData,
  type RelatedPostItem,
} from "@/lib/sanity/queries";
import { Section } from "@/components/section";
import { FinalCta } from "@/components/final-cta";
import { JsonLd } from "@/components/json-ld";
import { PortableText } from "@/components/portable-text";
import { FaqSection } from "@/components/faq-section";
import { RelatedPosts } from "@/components/related-posts";
import { ContextualCta } from "@/components/contextual-cta";
import { VideoReadAlong } from "@/components/video-read-along";
import { articleJsonLd, faqJsonLd } from "@/lib/metadata";

/* ---------- Data fetching ---------- */

async function getPost(slug: string): Promise<BlogPostData | null> {
  try {
    const data = await client.fetch<BlogPostData | null>(blogPostBySlugQuery, {
      slug,
    });
    return data;
  } catch {
    return null;
  }
}

async function getPostSlugs(): Promise<{ slug: string }[]> {
  try {
    const data = await client.fetch<{ slug: string }[]>(blogPostSlugListQuery);
    return data && data.length > 0 ? data : FALLBACK_SLUGS;
  } catch {
    return FALLBACK_SLUGS;
  }
}

async function getRelatedPosts(
  currentId: string,
  topicIds: string[]
): Promise<RelatedPostItem[]> {
  if (topicIds.length === 0) return [];
  try {
    const data = await client.fetch<RelatedPostItem[]>(relatedPostsQuery, {
      currentId,
      topicIds,
    });
    return data || [];
  } catch {
    return [];
  }
}

/* ---------- Static params ---------- */

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

/* ---------- Metadata ---------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getPost(slug)) || FALLBACK_POSTS[slug];
  if (!post) return { title: "Post Not Found" };

  const title = post.seo?.seoTitle || post.title;
  const description =
    post.seo?.seoDescription ||
    post.excerpt ||
    `${post.title} by Nic Haralambous`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://nicharalambous.com/blog/${slug}`,
    },
    openGraph: {
      title: `${title} | Nic Haralambous`,
      description,
      url: `https://nicharalambous.com/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      ...(post.updatedAt && { modifiedTime: post.updatedAt }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/* ---------- Page ---------- */

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cmsPost = await getPost(slug);
  const fallback = FALLBACK_POSTS[slug];
  const post = cmsPost || fallback;

  if (!post) {
    notFound();
  }

  /* Fetch related posts based on topic hub references */
  const topicIds = post.topics?.map((t) => t._id) || [];
  const relatedPosts = await getRelatedPosts(post._id, topicIds);

  const hasPortableTextBody = post.body && post.body.length > 0;
  const hasRawHtmlBody =
    post.rawHtmlBody && post.rawHtmlBody.trim().length > 0;
  const hasFaq = post.faq && post.faq.length > 0;
  const hasTopics = post.topics && post.topics.length > 0;
  const hasVideo = post.videoEmbed && post.videoEmbed.trim().length > 0;

  return (
    <>
      {/* Article JSON-LD */}
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.excerpt || `${post.title} by Nic Haralambous`,
          url: `https://nicharalambous.com/blog/${slug}`,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt || undefined,
          image: post.featuredImage?.asset?.url,
        })}
      />

      {/* FAQ JSON-LD (when FAQs present) */}
      {hasFaq && <JsonLd data={faqJsonLd(post.faq!)} />}

      {/* Article header */}
      <Section width="content" as="article">
        <header>
          {/* Topic tags */}
          {hasTopics && (
            <div className="flex flex-wrap gap-2">
              {post.topics.map((topic) => (
                <Link
                  key={topic._id}
                  href={`/topics/${topic.slug}`}
                  className="bg-accent-100 px-3 py-1 text-xs font-medium text-accent-600 transition-colors hover:bg-accent-600 hover:text-white"
                >
                  {topic.title}
                </Link>
              ))}
            </div>
          )}

          <h1 className="mt-4 heading-display-stroke-sm text-4xl text-brand-900 sm:text-5xl md:text-6xl">
            {post.title}
          </h1>

          {/* Meta: date + read time */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-brand-500">
            <span>By Nic Haralambous</span>
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
            {post.updatedAt && (
              <span className="text-brand-400">
                Updated{" "}
                {new Date(post.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            {post.estimatedReadTime && (
              <span>{post.estimatedReadTime} min read</span>
            )}
          </div>
        </header>

        {/* Featured image */}
        {post.featuredImage?.asset?.url && (
          <figure className="mt-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featuredImage.asset.url}
              alt={post.featuredImage.alt || post.title}
              className="w-full"
            />
          </figure>
        )}

        {/* TL;DR / Excerpt block */}
        {post.excerpt && (
          <aside className="mt-8 border-l-[8px] border-accent-600 bg-brand-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent-600">
              TL;DR
            </p>
            <p className="mt-2 text-base leading-relaxed text-brand-700">
              {post.excerpt}
            </p>
          </aside>
        )}

        {/* Video Read-Along (when video is available) */}
        {hasVideo && (
          <VideoReadAlong
            videoUrl={post.videoEmbed!}
            title={post.title}
            featuredLabel={post.featuredLabel}
          />
        )}

        {/* Main content — Portable Text or raw HTML */}
        {hasPortableTextBody ? (
          <PortableText value={post.body} className="mt-8" />
        ) : hasRawHtmlBody ? (
          <div
            className={[
              "prose-imported mt-8",
              /* Paragraphs */
              "[&>p]:mt-4 [&>p]:text-base [&>p]:leading-relaxed [&>p]:text-brand-700",
              /* Headings */
              "[&>h2]:mt-10 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-brand-900",
              "[&>h3]:mt-8 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-brand-900",
              "[&>h4]:mt-6 [&>h4]:text-lg [&>h4]:font-semibold [&>h4]:text-brand-800",
              /* Lists */
              "[&>ul]:mt-4 [&>ul]:space-y-2 [&>ul]:pl-5 [&>ul]:list-disc [&>ul]:text-brand-700",
              "[&>ol]:mt-4 [&>ol]:space-y-2 [&>ol]:pl-5 [&>ol]:list-decimal [&>ol]:text-brand-700",
              "[&_li]:text-base [&_li]:leading-relaxed",
              /* Blockquotes */
              "[&>blockquote]:mt-6 [&>blockquote]:border-l-4 [&>blockquote]:border-accent-400 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-brand-600",
              /* Images — standalone and inside figures */
              "[&>img]:my-6 [&>img]:w-full [&>img]:rounded-lg",
              "[&>figure]:my-6 [&_figure_img]:w-full [&_figure_img]:rounded-lg",
              "[&_figcaption]:mt-2 [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:italic [&_figcaption]:text-brand-500",
              /* Horizontal rules */
              "[&>hr]:my-8 [&>hr]:border-brand-200",
              /* Iframes (embedded video etc.) */
              "[&>iframe]:my-6 [&>iframe]:aspect-video [&>iframe]:w-full [&>iframe]:rounded-lg",
              /* Links (any depth) */
              "[&_a]:text-accent-600 [&_a]:underline [&_a:hover]:text-accent-500",
              /* Strikethrough */
              "[&_s]:text-brand-400",
            ].join(" ")}
            dangerouslySetInnerHTML={{ __html: post.rawHtmlBody! }}
          />
        ) : (
          /* Fallback: render description text for placeholder posts */
          ("descriptionText" in post &&
            (post as FallbackBlogPost).descriptionText?.map(
              (paragraph: string, i: number) => (
                <p
                  key={i}
                  className="mt-4 first:mt-8 text-base leading-relaxed text-brand-700"
                >
                  {paragraph}
                </p>
              )
            )) || (
            <p className="mt-8 text-brand-500 italic">
              Content is being prepared. Check back soon.
            </p>
          )
        )}
      </Section>

      {/* FAQ section */}
      {hasFaq && (
        <Section width="content" className="bg-brand-50">
          <FaqSection faqs={post.faq!} />
        </Section>
      )}

      {/* Topic hub links */}
      {hasTopics && (
        <Section width="content">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-brand-500">
              Filed under:
            </span>
            {post.topics.map((topic) => (
              <Link
                key={topic._id}
                href={`/topics/${topic.slug}`}
                className="bg-brand-100 px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-700 hover:text-white"
              >
                {topic.title}
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <Section width="wide" className="bg-brand-50">
          <RelatedPosts posts={relatedPosts} />
        </Section>
      )}

      {/* Contextual CTA — related keynote or generic */}
      <Section width="content">
        <ContextualCta relatedKeynote={post.relatedKeynote} />
      </Section>

      {/* Final soft CTA → /speaker (always present per SEO strategy) */}
      <FinalCta
        heading="Want Nic at Your Next Event?"
        description="Virtual keynotes for conferences, corporate events, team offsites, and webinars. Worldwide delivery."
        primaryHref="/speaker"
        primaryLabel="About Nic as a Speaker"
        secondaryHref="/contact"
        secondaryLabel="Book Nic for Your Event"
      />
    </>
  );
}

/* ---------- Fallback data ---------- */

interface FallbackBlogPost extends BlogPostData {
  descriptionText: string[];
}

/**
 * Fallback slugs — used when Sanity has no published posts.
 * Ensures generateStaticParams always returns at least one entry
 * (required by Next.js static export).
 */
const FALLBACK_SLUGS = [
  { slug: "placeholder" },
  { slug: "advice-from-30-year-old-me-to-20-year-old-me" },
];

const FALLBACK_POSTS: Record<string, FallbackBlogPost> = {
  placeholder: {
    _id: "fp-placeholder",
    title: "New Content Coming Soon",
    slug: "placeholder",
    excerpt:
      "Nic is publishing new articles on curiosity, innovation, AI, and building businesses. Subscribe to be the first to read them.",
    publishedAt: new Date().toISOString(),
    updatedAt: null,
    estimatedReadTime: 2,
    body: null,
    rawHtmlBody: null,
    videoEmbed: null,
    featured: null,
    featuredLabel: null,
    featuredImage: null,
    faq: null,
    topics: [
      { _id: "t1", title: "Curiosity", slug: "curiosity" },
      { _id: "t2", title: "Innovation", slug: "innovation" },
    ],
    relatedKeynote: null,
    seo: null,
    descriptionText: [
      "New articles are on the way. Nic writes about curiosity, innovation, AI, entrepreneurship, focus, agency, and failure, drawing from 20+ years of building businesses and 4 startup exits.",
      "In the meantime, explore the topic hubs or check out Nic's virtual keynotes for a deeper dive into these ideas.",
    ],
  },
  "advice-from-30-year-old-me-to-20-year-old-me": {
    _id: "fp-advice-30",
    title: "Advice from 30 Year Old Me to 20 Year Old Me",
    slug: "advice-from-30-year-old-me-to-20-year-old-me",
    excerpt:
      "11 things that I wish I knew when I was 20. Travel, build things, read, fail, trust, and be patient: lessons from a decade of living.",
    publishedAt: "2014-05-06T12:45:39.161Z",
    updatedAt: null,
    estimatedReadTime: 5,
    body: null,
    rawHtmlBody: `<p>I recently turned 30. For some very odd reason I've not warmed to the idea of it just yet. However as I began to evaluate my 20s I realised how many mistakes I've made and things I've learned in a decade of life.</p>
<p>I took some time to write myself some advice.</p>
<h3>1) Travel</h3>
<p>You have very little responsibility so go and travel. When you get to 30, you're going to want to travel slightly differently, spend a little more, do slightly more expensive things, eat at slightly better restaurants. So work for a year and save enough money to experience the world on the cheap.</p>
<blockquote>How do you know what you want to do if you don't know what's out there <strong>to do</strong>?</blockquote>
<p>Don't just travel to the obvious places.</p>
<p>Travel to the tough places.</p>
<p>Travel to learn.</p>
<p>Travel to discover.</p>
<p><em>Travel to the places that will challenge who you think you want to be.</em></p>
<h3>2) Build things</h3>
<p>Don't spend too much time working on other people's visions or in other people's meetings. Spend time figuring out what your own world view is (<strong>see point 1</strong>) and where you want to take your own life.</p>
<blockquote><strong>Meetings are where ideas go to die.</strong></blockquote>
<p>If you find yourself in a corporate job that you wish you could leave then do it. Leave. If you don't have a corporate job yet <strong>see point 5</strong>.</p>
<h3>3) Read</h3>
<p>Read every day. Read everything you can. Don't just read about things you know about. Read about people. Read people.</p>
<h3>4) Stop Watching Television</h3>
<p>Right now. Stop it. It's not helping you get better at anything.</p>
<h3>5) Career</h3>
<p>Do not take that corporate job. Just don't do it (<strong>see point 2</strong>).</p>
<h3>6) Trust</h3>
<p>Even if it kills your relationships. Even if it destroys your ideas. Even if you lose your friends. Even if it means you end up getting hurt.</p>
<blockquote><strong>Trust people until they give you a reason not to.</strong></blockquote>
<p>But don't be na\u00efve. Some people are out to fuck you.</p>
<h3>7) People</h3>
<p>People are the best and worst thing that will happen to you. Some will help you go further, faster. Others will pull you down to their level and help you lose. Most are OK. Many are average. Some are excellent.</p>
<blockquote><strong>A few people will change your life forever. Find them.</strong></blockquote>
<p>You don't need a lot of friends or people around you. You need amazing people who do for you as you do for them.</p>
<p>It's simple really, a lot of average friends will leave you feeling alone when you need to feel surrounded by people who care.</p>
<h3>8) Value Time</h3>
<p>Don't waste time on people who you don't trust. Don't waste time with lovers who cheat on you. Don't waste time with friends who don't treat you the way you treat them (<strong>see point 7</strong>).</p>
<blockquote><strong>Do not be late.</strong></blockquote>
<p>Value other people's time. That means that if you're late, you don't give a shit about them or their time and that you think you're worth more and therefore can keep them waiting.</p>
<p>Some people will tell you that it's OK to be late. It's not. Some people will tell you that it's just the way they are. Then you need to reevaluate them (see point 7 above).</p>
<h3>9) Fail</h3>
<p>Fail a lot. Fail often. Fail at love. Fail at sex. Fail at socialising. Fail at making friends. Fail at work. Fail at business. Fail with family. Fail with existing friends.</p>
<blockquote><strong>Fail. But do it quickly and learn a lesson.</strong></blockquote>
<p>If you don't learn something every time you fail then all you've done is failed. If you learn something, then you've grown. Every time you grow and learn and fail, you get better at figuring out how the hell to succeed.</p>
<h3>10) Success</h3>
<p>There is no point at which you will have succeeded. Not in your twenties. Not ever.</p>
<p>Get over that fact and start building things (<strong>see point 2 and combine with point 9</strong>).</p>
<h3>11) Patience</h3>
<p>Be patient. Nothing worth doing is worth doing quickly. Nothing worth building is worth building in a rush. Nothing of value is formed in a minute.</p>
<blockquote><strong>Plan in decades. Think in years. Work in months. Live in days.</strong></blockquote>`,
    videoEmbed: "https://youtu.be/iykmgFqsfK8",
    featured: true,
    featuredLabel: "500K+ Reads on Medium",
    featuredImage: null,
    faq: null,
    topics: [
      { _id: "t1", title: "Curiosity", slug: "curiosity" },
      { _id: "t7", title: "Failure", slug: "failure" },
    ],
    relatedKeynote: null,
    seo: null,
    descriptionText: [],
  },
};
