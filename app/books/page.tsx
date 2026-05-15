/**
 * Books Listing Page — /books
 *
 * Single-page layout showcasing Nic's three published books.
 * Hero section + compact book cards with Buy Now CTAs.
 * Content is fetched from Sanity at build time with hardcoded fallbacks.
 *
 * JSON-LD: CollectionPage
 */
import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import {
  booksListQuery,
  type BookListItem,
} from "@/lib/sanity/queries";
import { FALLBACK_BOOKS, getPrimaryBuyUrl } from "@/lib/books-data";
import { CTAButton } from "@/components/cta-button";
import { Section } from "@/components/section";
import { FinalCta } from "@/components/final-cta";
import { JsonLd } from "@/components/json-ld";
import { collectionPageJsonLd } from "@/lib/metadata";

/* ---------- Hero decorative image ---------- */

const HERO_IMAGE = {
  src: "/slides/Nic_Book_6.png",
  className:
    "pointer-events-none fixed bottom-0 right-0 z-[1] hidden h-[41vh] w-auto select-none object-contain object-bottom md:block",
};

/* ---------- Decorative 16-bit images rendered below each book's CTA ---------- */

const BOOK_BELOW_CTA_IMAGES: Record<number, { src: string; className: string }> = {
  0: {
    src: "/slides/Nic_book_1.png",
    className: "mx-auto mt-4 h-48 w-auto md:h-56",
  },
  1: {
    src: "/slides/Nic_book_4.png",
    className: "mx-auto mt-4 h-44 w-auto md:h-52",
  },
  2: {
    src: "/slides/Nic_book_3.png",
    className: "mx-auto mt-4 h-44 w-auto md:h-52",
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
    type: "website",
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
    <div className="page-bg bg-openbook-pattern">
      <JsonLd
        data={collectionPageJsonLd({
          name: "Books by Nic Haralambous",
          description:
            "Books on entrepreneurship, resilience, side hustles, and building businesses.",
          url: "https://nicharalambous.com/books",
        })}
      />

      {/* Fixed decorative image — bottom-right, content scrolls over it */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_IMAGE.src}
        alt=""
        aria-hidden="true"
        className={HERO_IMAGE.className}
      />

      {/* Hero */}
      <Section width="wide" className="relative z-10 pb-0 md:pb-0 text-center">
        <h1 className="heading-stroke font-extrabold tracking-tight text-5xl uppercase leading-[0.95] text-accent-600 sm:text-6xl md:text-7xl lg:text-8xl">
          My Books
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-xl font-semibold leading-relaxed text-brand-700 sm:text-2xl">
          Three books, two bestsellers from twenty years of building, failing and learning about business and life.
        </p>
      </Section>

      {/* Book cards */}
      {books.map((book, index) => {
        const coverUrl = book.coverImage?.asset
          ? urlFor(book.coverImage).width(480).auto("format").url()
          : STATIC_COVERS[book.slug];
        const buyUrl = getPrimaryBuyUrl(book.slug, book.buyLinks);
        const summary = book.shortSummary || book.subtitle;
        const belowCtaImage = BOOK_BELOW_CTA_IMAGES[index];

        return (
          <Section key={book.slug} width="content" className="relative z-10 py-8 md:py-12">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-10">
              {/* Cover image */}
              <div className="shrink-0 w-44 md:w-52">
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
                <h2 className="heading-stroke font-extrabold tracking-tight text-3xl uppercase text-brand-900 sm:text-4xl md:text-5xl lg:text-6xl">
                  {book.title}
                </h2>
                {book.subtitle && (
                  <p className="mt-2 text-lg font-medium text-brand-500">
                    {book.subtitle}
                  </p>
                )}
                {summary && (
                  <p className="mt-3 max-w-xl text-base leading-relaxed text-brand-700">
                    {summary}
                  </p>
                )}

                {/* CTA */}
                {buyUrl && (
                  <div className="mt-5">
                    <CTAButton
                      href={buyUrl}
                      external
                      className="!rounded-none font-bold tracking-[0.02em] text-xl uppercase"
                    >
                      Buy Now
                    </CTAButton>
                  </div>
                )}
              </div>
            </div>

            {belowCtaImage && (
              <div className="mt-4 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={belowCtaImage.src}
                  alt=""
                  aria-hidden="true"
                  className={belowCtaImage.className}
                />
              </div>
            )}
          </Section>
        );
      })}

      {/* Final CTA */}
      <FinalCta
        heading="Want Nic at Your Next Event?"
        description="Virtual keynotes for conferences, corporate events, team offsites, and webinars. Worldwide delivery."
        primaryHref="/speaker"
        primaryLabel="About Nic as a Speaker"
        secondaryHref="/contact"
        secondaryLabel="Book Nic"
      />
    </div>
  );
}
