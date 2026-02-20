/**
 * Individual Book Page — /books/{slug}
 *
 * Dynamic page for each of Nic's books. Content fetched from Sanity at
 * build time. Falls back to hardcoded defaults if Sanity has no data.
 *
 * Sections:
 * 1. Hero with title, subtitle, cover image
 * 2. Description (Portable Text from CMS)
 * 3. Buy links
 * 4. Related topics
 * 5. CTA → /speaker
 *
 * JSON-LD: Book
 * Static params generated at build time — one page per book.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import {
  bookBySlugQuery,
  bookSlugListQuery,
  type BookData,
} from "@/lib/sanity/queries";
import { CTAButton } from "@/components/cta-button";
import { Section } from "@/components/section";
import { FinalCta } from "@/components/final-cta";
import { JsonLd } from "@/components/json-ld";
import { PortableText } from "@/components/portable-text";
import { bookJsonLd } from "@/lib/metadata";

/* ---------- Data fetching ---------- */

async function getBook(slug: string): Promise<BookData | null> {
  try {
    const data = await client.fetch<BookData | null>(bookBySlugQuery, { slug });
    return data;
  } catch {
    return null;
  }
}

async function getBookSlugs(): Promise<{ slug: string }[]> {
  try {
    const data = await client.fetch<{ slug: string }[]>(bookSlugListQuery);
    return data && data.length > 0 ? data : FALLBACK_SLUGS;
  } catch {
    return FALLBACK_SLUGS;
  }
}

/* ---------- Static params ---------- */

export async function generateStaticParams() {
  const slugs = await getBookSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

/* ---------- Metadata ---------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = (await getBook(slug)) || FALLBACK_BOOKS[slug];
  if (!book) return { title: "Book Not Found" };

  const title = `${book.title} | Books by Nic Haralambous`;
  const description = book.subtitle || `${book.title} by Nic Haralambous`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://nicharalambous.com/books/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://nicharalambous.com/books/${slug}`,
    },
  };
}

/* ---------- Page ---------- */

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cmsBook = await getBook(slug);
  const fallback = FALLBACK_BOOKS[slug];
  const book = cmsBook || fallback;

  if (!book) {
    notFound();
  }

  const hasCmsDescription =
    cmsBook?.description && cmsBook.description.length > 0;

  const coverUrl = book.coverImage?.asset
    ? urlFor(book.coverImage).width(600).auto("format").url()
    : undefined;

  return (
    <div className="page-bg bg-bookmark-pattern">
      {/* Structured data */}
      <JsonLd
        data={bookJsonLd({
          title: book.title,
          description: book.subtitle || `${book.title} by Nic Haralambous`,
          url: `https://nicharalambous.com/books/${slug}`,
          isbn: book.isbn || undefined,
          image: coverUrl,
          publishedYear: book.publishedYear || undefined,
        })}
      />

      {/* Hero */}
      <Section width="content">
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          {/* Cover image */}
          {coverUrl && (
            <div className="shrink-0 overflow-hidden md:w-56">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverUrl}
                alt={`${book.title} cover`}
                className="w-full"
              />
            </div>
          )}

          <div className="flex-1">
            <p className="heading-display text-accent-600">
              Book
            </p>
            <h1 className="mt-2 heading-display-stroke-sm text-4xl text-brand-900 sm:text-5xl">
              {book.title}
            </h1>
            {book.subtitle && (
              <p className="mt-2 text-lg text-brand-500">{book.subtitle}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-brand-400">
              <span>By Nic Haralambous</span>
              {book.publishedYear && <span>Published {book.publishedYear}</span>}
              {book.isbn && <span>ISBN: {book.isbn}</span>}
            </div>

            {/* Buy links */}
            {book.buyLinks && book.buyLinks.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {book.buyLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center border-2 border-accent-600 px-4 py-2 font-bebas text-sm uppercase text-accent-600 transition-colors hover:bg-accent-600 hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Description — Portable Text from CMS or fallback */}
      <Section width="content">
        <h2 className="heading-display text-3xl text-brand-900 sm:text-4xl">About This Book</h2>
        {hasCmsDescription ? (
          <PortableText value={cmsBook!.description} className="mt-6" />
        ) : (
          fallback?.descriptionText?.map((paragraph: string, i: number) => (
            <p
              key={i}
              className="mt-4 first:mt-6 text-base leading-relaxed text-brand-700"
            >
              {paragraph}
            </p>
          ))
        )}
      </Section>

      {/* Related topics */}
      {book.relatedTopics && book.relatedTopics.length > 0 && (
        <Section width="content">
          <h2 className="heading-display text-3xl text-brand-900 sm:text-4xl">Related Topics</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {book.relatedTopics.map((topic) => (
              <Link
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                className="bg-brand-100 px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-700 hover:text-white"
              >
                {topic.title}
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* CTA */}
      <FinalCta
        heading="Want the Keynote Version?"
        description="The ideas in this book come alive in Nic's virtual keynotes. Real stories, actionable frameworks, tailored to your team."
        primaryHref="/speaker"
        primaryLabel="About Nic as a Speaker"
        secondaryHref="/books"
        secondaryLabel="View All Books"
      />
    </div>
  );
}

/* ---------- Fallback data ---------- */

interface FallbackBook extends BookData {
  descriptionText: string[];
}

const FALLBACK_SLUGS = [
  { slug: "do-fail-learn-repeat" },
  { slug: "how-to-start-a-side-hustle" },
];

const FALLBACK_BOOKS: Record<string, FallbackBook> = {
  "do-fail-learn-repeat": {
    _id: "fb-1",
    title: "Do. Fail. Learn. Repeat.",
    slug: "do-fail-learn-repeat",
    subtitle: "The Entrepreneurship Memoir",
    coverImage: null,
    description: null,
    descriptionText: [
      "Do. Fail. Learn. Repeat. is Nic Haralambous's personal memoir of entrepreneurship — the real version, not the highlight reel. It covers the failures, the impostor phenomenon, the near-death experiences of startups, and the resilience required to keep going.",
      "This book introduces the Do/Fail/Learn/Repeat cycle — a framework for turning failure into data and data into progress. Nic shares stories from his 20+ years of building companies, including the painful ones that teach the most.",
      "If you're building something and feeling stuck, scared, or unsure — this book is for you. It won't give you a formula for success. It'll give you permission to fail forward.",
    ],
    publishedYear: 2020,
    isbn: null,
    buyLinks: null,
    relatedTopics: [
      { _id: "t1", title: "Entrepreneurship", slug: "entrepreneurship" },
      { _id: "t2", title: "Failure", slug: "failure" },
      { _id: "t3", title: "Agency", slug: "agency" },
    ],
    seo: null,
  },
  "how-to-start-a-side-hustle": {
    _id: "fb-2",
    title: "How to Start a Side Hustle",
    slug: "how-to-start-a-side-hustle",
    subtitle: "The Business Builder's Toolkit",
    coverImage: null,
    description: null,
    descriptionText: [
      "How to Start a Side Hustle is Nic Haralambous's comprehensive guide to building a business alongside your day job. It covers everything from ideation and planning to culture, leadership, and finding your first customers.",
      "This book is practical and actionable. No motivational fluff — just the tools, frameworks, and hard-earned lessons from someone who's built multiple businesses from scratch.",
      "Whether you're thinking about your first venture or already juggling a side project, this book gives you the toolkit to do it right.",
    ],
    publishedYear: 2019,
    isbn: null,
    buyLinks: null,
    relatedTopics: [
      { _id: "t1", title: "Entrepreneurship", slug: "entrepreneurship" },
    ],
    seo: null,
  },
};
