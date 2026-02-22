/**
 * Books Listing Page — /books
 *
 * Keynote-style slide deck showcasing Nic's three published books.
 * Hero slide + one full-viewport slide per book + footer slide.
 * Content is fetched from Sanity at build time with hardcoded fallbacks.
 *
 * JSON-LD: CollectionPage
 */
import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import {
  booksListQuery,
  type BookListItem,
} from "@/lib/sanity/queries";
import { CTAButton } from "@/components/cta-button";
import { Slide } from "@/components/slide";
import { SlideDeck } from "@/components/slide-deck";
import { SlideContent } from "@/components/slide-animations";
import { FooterContent } from "@/components/footer-content";
import { NextSlideIndicator } from "@/components/next-slide-indicator";
import { JsonLd } from "@/components/json-ld";
import { collectionPageJsonLd } from "@/lib/metadata";

/* ---------- 16-bit placeholder config per slide ---------- */

const HERO_PLACEHOLDERS = [
  {
    src: "/slides/Nic_Book_6.png",
    className:
      "pointer-events-none absolute bottom-0 right-0 z-[1] hidden h-[55vh] w-auto select-none object-contain object-bottom md:block",
  },
];

const BOOK_PLACEHOLDERS: Record<number, { src: string; className: string }[]> = {
  0: [],
  1: [],
  2: [],
};

/* ---------- Inline 16-bit images rendered above the book title ---------- */

const BOOK_INLINE_IMAGES: Record<number, { src: string; className: string }> = {};

/* ---------- Inline 16-bit images rendered below the CTAs ---------- */

const BOOK_BELOW_CTA_IMAGES: Record<number, { src: string; className: string }> = {
  0: {
    src: "/slides/Nic_book_1.png",
    className: "mx-auto mt-6 h-64 w-auto md:h-72",
  },
  1: {
    src: "/slides/Nic_book_4.png",
    className: "mx-auto mt-6 h-56 w-auto md:h-64",
  },
  2: {
    src: "/slides/Nic_book_3.png",
    className: "mx-auto mt-6 h-56 w-auto md:h-64",
  },
};

/* ---------- Static cover images (used when CMS has no coverImage) ---------- */

const STATIC_COVERS: Record<string, string> = {
  "do-fail-learn-repeat": "/slides/Do_Fail_Learn_repeate.jpg",
  "how-to-start-a-side-hustle": "/slides/How_to_start_a_side_Hustle.jpg",
  "the-business-builders-toolkit": "/slides/Business_Builders_Toolkit.jpg",
};

/* ---------- Data fetching ---------- */

async function getBooks(): Promise<BookListItem[] | null> {
  try {
    const data = await client.fetch<BookListItem[]>(booksListQuery);
    return data && data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

/* ---------- Metadata ---------- */

export const metadata: Metadata = {
  title: "Books",
  description:
    "Books by Nic Haralambous on entrepreneurship, resilience, side hustles, and building businesses. 3 published books from 20+ years of real experience.",
  alternates: { canonical: "https://nicharalambous.com/books" },
  openGraph: {
    title: "Books by Nic Haralambous",
    description:
      "3 published books on entrepreneurship, resilience, and building businesses.",
    url: "https://nicharalambous.com/books",
  },
};

/* ---------- Page ---------- */

export default async function BooksPage() {
  const cmsBooks = await getBooks();
  const books = cmsBooks || FALLBACK_BOOKS;

  return (
    <SlideDeck>
      {/* Structured data */}
      <JsonLd
        data={collectionPageJsonLd({
          name: "Books by Nic Haralambous",
          description:
            "Books on entrepreneurship, resilience, side hustles, and building businesses.",
          url: "https://nicharalambous.com/books",
        })}
      />

      <NextSlideIndicator />

      {/* Slide 1: Hero */}
      <Slide
        variant="hero"
        id="hero"
        background="bg-openbook-pattern"
        className="text-center md:justify-start md:pt-[calc(var(--header-height-desktop)+1rem)]"
        image={
          <>
            {HERO_PLACEHOLDERS.map((ph) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={ph.src}
                src={ph.src}
                alt=""
                aria-hidden="true"
                className={ph.className}
              />
            ))}
          </>
        }
      >
        <div className="pt-[var(--top-branding-height-mobile)] md:pt-0">
          <h1 className="heading-stroke font-extrabold tracking-tight text-7xl uppercase leading-[0.95] text-brand-900 sm:text-8xl md:text-9xl lg:text-[10rem] 2xl:text-[12rem]">
            <span className="text-accent-600">My </span>Books
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl font-semibold leading-relaxed text-brand-700 sm:text-2xl">
            Three books, two bestsellers from twenty years of building, failing and learning about business and life.
          </p>
        </div>
      </Slide>

      {/* Book slides — one per book */}
      {books.map((book, index) => {
        const placeholders = BOOK_PLACEHOLDERS[index] || [];
        const coverUrl = book.coverImage?.asset
          ? urlFor(book.coverImage).width(480).auto("format").url()
          : STATIC_COVERS[book.slug];
        const buyUrl = book.buyLinks?.[0]?.url;
        const summary = book.shortSummary || book.subtitle;
        const inlineImage = BOOK_INLINE_IMAGES[index];
        const belowCtaImage = BOOK_BELOW_CTA_IMAGES[index];

        return (
          <Slide
            key={book.slug}
            id={book.slug}
            variant="centered"
            background="bg-openbook-pattern"
            className="md:justify-start md:pt-[calc(var(--header-height-desktop)+0.75rem)]"
            image={
              placeholders.length > 0 ? (
                <>
                  {placeholders.map((ph) => (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      key={ph.src}
                      src={ph.src}
                      alt=""
                      aria-hidden="true"
                      className={ph.className}
                    />
                  ))}
                </>
              ) : undefined
            }
          >
            <SlideContent>
              <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
                {/* Cover image or placeholder */}
                <div className="shrink-0 w-48 md:w-56">
                  {coverUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={coverUrl}
                      alt={`${book.title} cover`}
                      className="w-full border-4 border-brand-200"
                    />
                  ) : (
                    <div className="flex aspect-[2/3] w-full items-center justify-center border-4 border-brand-200 bg-brand-100">
                      <svg
                        className="h-16 w-16 text-brand-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1}
                        stroke="currentColor"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Copy */}
                <div className="flex-1 text-center md:text-left">
                  <Link
                    href={`/books/${book.slug}`}
                    className="relative block transition-colors hover:text-accent-500"
                  >
                    {inlineImage && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={inlineImage.src}
                        alt=""
                        aria-hidden="true"
                        className={inlineImage.className}
                      />
                    )}
                    <h2 className="heading-stroke font-extrabold tracking-tight text-3xl uppercase text-brand-900 sm:text-4xl md:text-5xl lg:text-6xl">
                      {book.title}
                    </h2>
                  </Link>
                  {book.subtitle && (
                    <p className="mt-2 text-lg font-medium text-brand-500">
                      {book.subtitle}
                    </p>
                  )}
                  {summary && (
                    <p className="mt-4 max-w-xl text-base leading-relaxed text-brand-700">
                      {summary}
                    </p>
                  )}

                  {/* CTAs */}
                  <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
                    {buyUrl && (
                      <CTAButton
                        href={buyUrl}
                        external
                        className="!rounded-none font-bold tracking-[0.02em] text-xl uppercase"
                      >
                        Buy Now
                      </CTAButton>
                    )}
                    <CTAButton
                      href={`/books/${book.slug}`}
                      variant="secondary"
                      className="!rounded-none font-bold tracking-[0.02em] text-xl uppercase"
                    >
                      Learn More
                    </CTAButton>
                  </div>
                </div>
              </div>
              {belowCtaImage && (
                <div className="mt-6 text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={belowCtaImage.src}
                    alt=""
                    aria-hidden="true"
                    className={belowCtaImage.className}
                  />
                </div>
              )}
            </SlideContent>
          </Slide>
        );
      })}

      {/* Footer slide */}
      <Slide variant="footer" background="bg-foot-pattern" id="footer">
        <FooterContent />
      </Slide>
    </SlideDeck>
  );
}

/* ---------- Fallback data ---------- */

const FALLBACK_BOOKS: BookListItem[] = [
  {
    _id: "fb-1",
    title: "Do. Fail. Learn. Repeat.",
    slug: "do-fail-learn-repeat",
    subtitle: "The Entrepreneurship Memoir",
    shortSummary:
      "Nic's personal memoir of entrepreneurship: the real version, not the highlight reel. Failures, impostor syndrome, near-death startup experiences, and the resilience required to keep going.",
    coverImage: null,
    publishedYear: 2020,
    buyLinks: [
      { label: "Amazon", url: "https://www.amazon.com/dp/B084DHQM3L" },
    ],
    relatedTopics: [
      { _id: "t1", title: "Entrepreneurship", slug: "entrepreneurship" },
      { _id: "t2", title: "Failure", slug: "failure" },
    ],
    seo: null,
  },
  {
    _id: "fb-2",
    title: "How to Start a Side Hustle",
    slug: "how-to-start-a-side-hustle",
    subtitle: "Build a Business Without Quitting Your Day Job",
    shortSummary:
      "A comprehensive, no-fluff guide to building a business alongside your day job. Covers ideation, planning, culture, leadership, and finding your first customers.",
    coverImage: null,
    publishedYear: 2019,
    buyLinks: [
      { label: "Amazon", url: "https://www.amazon.com/dp/1776093380" },
    ],
    relatedTopics: [
      { _id: "t1", title: "Entrepreneurship", slug: "entrepreneurship" },
    ],
    seo: null,
  },
  {
    _id: "fb-3",
    title: "The Business Builder's Toolkit",
    slug: "the-business-builders-toolkit",
    subtitle: "Frameworks for Modern Entrepreneurs",
    shortSummary:
      "Practical frameworks and hard-earned lessons for modern entrepreneurs. The tools you need to build, scale, and survive the journey.",
    coverImage: null,
    publishedYear: 2021,
    buyLinks: [
      { label: "Amazon", url: "https://www.amazon.com/dp/B09EXAMPLE" },
    ],
    relatedTopics: [
      { _id: "t1", title: "Entrepreneurship", slug: "entrepreneurship" },
    ],
    seo: null,
  },
];
