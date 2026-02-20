/**
 * Books Listing Page — /books
 *
 * Lists all of Nic's published books. Each links to /books/{slug}.
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
import { Section } from "@/components/section";
import { FinalCta } from "@/components/final-cta";
import { JsonLd } from "@/components/json-ld";
import { collectionPageJsonLd } from "@/lib/metadata";
import { tilt } from "@/lib/tilt";

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
    <div className="page-bg bg-openbook-pattern">
      {/* Structured data */}
      <JsonLd
        data={collectionPageJsonLd({
          name: "Books by Nic Haralambous",
          description:
            "Books on entrepreneurship, resilience, side hustles, and building businesses.",
          url: "https://nicharalambous.com/books",
        })}
      />

      <Section width="content" className="text-center">
        <h1 className="heading-display-stroke-sm text-5xl text-brand-900 sm:text-6xl">
          Books
        </h1>
        <p className="mt-4 text-lg text-brand-600">
          Three books from 20+ years of building, failing, and learning.
        </p>
      </Section>

      <Section width="wide">
        <div className="grid gap-10 lg:grid-cols-1">
          {books.map((book, i) => (
            <Link
              key={book.slug}
              href={`/books/${book.slug}`}
              className="group flex flex-col gap-6 card-brutalist p-8 transition-colors hover:bg-accent-50 md:flex-row md:items-start"
              style={{ transform: `rotate(${tilt(i, 100)}deg)` }}
            >
              {/* Cover image */}
              {book.coverImage?.asset && (
                <div className="shrink-0 overflow-hidden md:w-48">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={urlFor(book.coverImage).width(384).auto("format").url()}
                    alt={`${book.title} cover`}
                    className="w-full"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="flex-1">
                <h2 className="heading-display text-2xl text-accent-600">
                  {book.title}
                </h2>
                {book.subtitle && (
                  <p className="mt-1 text-base text-brand-500">
                    {book.subtitle}
                  </p>
                )}
                {book.publishedYear && (
                  <p className="mt-2 text-sm text-brand-400">
                    Published {book.publishedYear}
                  </p>
                )}
                {book.relatedTopics && book.relatedTopics.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {book.relatedTopics.map((topic) => (
                      <span
                        key={topic._id}
                        className="bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700"
                      >
                        {topic.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <FinalCta
        heading="Want the Keynote Version?"
        description="The ideas in these books come alive in Nic's virtual keynotes. Real stories, actionable frameworks, tailored to your team."
        primaryHref="/speaker"
        primaryLabel="About Nic as a Speaker"
        secondaryHref="/keynotes"
        secondaryLabel="Explore Keynotes"
      />
    </div>
  );
}

/* ---------- Fallback data ---------- */

const FALLBACK_BOOKS: BookListItem[] = [
  {
    _id: "fb-1",
    title: "Do. Fail. Learn. Repeat.",
    slug: "do-fail-learn-repeat",
    subtitle: "The Entrepreneurship Memoir",
    coverImage: null,
    publishedYear: 2020,
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
    subtitle: "The Business Builder's Toolkit",
    coverImage: null,
    publishedYear: 2019,
    relatedTopics: [
      { _id: "t1", title: "Entrepreneurship", slug: "entrepreneurship" },
    ],
    seo: null,
  },
];
