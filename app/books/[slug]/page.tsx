/**
 * Individual Book Page — /books/{slug}
 *
 * Single-scroll content page with the site's visual identity (patterns,
 * bold typography) but no slide-deck snapping. Content fetched from
 * Sanity at build time with hardcoded fallback from lib/books-data.ts.
 *
 * JSON-LD: Book
 * Static params generated at build time — one page per book.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import {
  bookBySlugQuery,
  bookSlugListQuery,
  type BookData,
} from "@/lib/sanity/queries";
import {
  FALLBACK_BOOKS,
  getFallbackBookBySlug,
  fallbackBookToBookData,
} from "@/lib/books-data";
import { CTAButton } from "@/components/cta-button";
import { Section } from "@/components/section";
import { FinalCta } from "@/components/final-cta";
import { JsonLd } from "@/components/json-ld";
import { PortableText } from "@/components/portable-text";
import { bookJsonLd } from "@/lib/metadata";

/* ---------- Static cover images (used when CMS has no coverImage) ---------- */

const STATIC_COVERS: Record<string, string> = {
  "do-fail-learn-repeat": "/slides/Do_Fail_Learn_repeate.jpg",
  "how-to-start-a-side-hustle": "/slides/How_to_start_a_side_Hustle.jpg",
  "the-business-builders-toolkit": "/slides/Business_Builders_Toolkit.jpg",
};

/* ---------- Data fetching ---------- */

async function getBook(slug: string): Promise<BookData | null> {
  try {
    const data = await client.fetch<BookData | null>(bookBySlugQuery, { slug });
    if (data) return data;
  } catch {
    // fall through to hardcoded fallback
  }

  const fallback = getFallbackBookBySlug(slug);
  if (!fallback) return null;
  return fallbackBookToBookData(fallback);
}

async function getBookSlugs(): Promise<{ slug: string }[]> {
  let sanitySlugs: { slug: string }[] = [];
  try {
    const data = await client.fetch<{ slug: string }[]>(bookSlugListQuery);
    if (data && data.length > 0) sanitySlugs = data;
  } catch {
    // Sanity unavailable — hardcoded slugs will cover us
  }

  const hardcodedSlugs = FALLBACK_BOOKS.map((b) => ({ slug: b.slug }));
  const seen = new Set<string>();
  const merged: { slug: string }[] = [];
  for (const entry of [...hardcodedSlugs, ...sanitySlugs]) {
    if (!seen.has(entry.slug)) {
      seen.add(entry.slug);
      merged.push(entry);
    }
  }
  return merged;
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
  const book = await getBook(slug);
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
      type: "website",
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
  const book = await getBook(slug);

  if (!book) {
    notFound();
  }

  const hasDescription = book.description && book.description.length > 0;

  const coverUrl = book.coverImage?.asset
    ? urlFor(book.coverImage).width(600).auto("format").url()
    : STATIC_COVERS[slug];

  const buyUrl = book.buyLinks?.[0]?.url;

  return (
    <div className="page-bg bg-openbook-pattern">
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
                className="w-full border-4 border-brand-200"
              />
            </div>
          )}

          <div className="flex-1">
            <p className="text-sm font-bold uppercase tracking-widest text-accent-600">
              Book
            </p>
            <h1 className="heading-display-stroke-sm mt-2 text-4xl text-brand-900 sm:text-5xl">
              {book.title}
            </h1>
            {book.subtitle && (
              <p className="mt-2 text-lg text-brand-500">{book.subtitle}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-brand-400">
              <span>By Nic Haralambous</span>
              {book.publishedYear && (
                <span>Published {book.publishedYear}</span>
              )}
              {book.isbn && <span>ISBN: {book.isbn}</span>}
            </div>

            {/* Buy links */}
            {buyUrl && (
              <div className="mt-6">
                <CTAButton
                  href={buyUrl}
                  external
                >
                  Buy Now
                </CTAButton>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Description */}
      {hasDescription && (
        <Section width="content">
          <h2 className="heading-display text-2xl text-brand-900 sm:text-3xl">
            About This Book
          </h2>
          <PortableText value={book.description} className="mt-4" />
        </Section>
      )}

      {/* Related topics */}
      {book.relatedTopics && book.relatedTopics.length > 0 && (
        <Section width="content">
          <h2 className="heading-display text-2xl text-brand-900 sm:text-3xl">
            Related Topics
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {book.relatedTopics.map((topic) => (
              <a
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                className="bg-brand-100 px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-700 hover:text-white"
              >
                {topic.title}
              </a>
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
