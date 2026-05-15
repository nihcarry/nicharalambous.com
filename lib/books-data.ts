/**
 * Single source of truth for book content.
 *
 * Both the books listing page (/books) and individual book pages
 * (/books/[slug]) pull from this file. Sanity data is overlaid on top
 * when available — this file is the guaranteed fallback so pages never
 * 404 just because a book hasn't been published in the CMS yet.
 */

import type { BookListItem, BookData } from "@/lib/sanity/queries";

/**
 * Canonical Amazon short links for each book slug.
 * Takes precedence over CMS `buyLinks` so Buy Now stays correct site-wide.
 */
export const BOOK_PRIMARY_BUY_URLS: Record<string, string> = {
  "do-fail-learn-repeat": "https://a.co/d/01ZaW3zL",
  "how-to-start-a-side-hustle": "https://a.co/d/07ABEMWd",
  "the-business-builders-toolkit": "https://a.co/d/0h5tz98c",
};

/** Primary store URL for a book: hardcoded Amazon link if known, else first CMS link. */
export function getPrimaryBuyUrl(
  slug: string,
  buyLinks: BookListItem["buyLinks"] | null | undefined,
): string | undefined {
  const hardcoded = BOOK_PRIMARY_BUY_URLS[slug];
  if (hardcoded) return hardcoded;
  return buyLinks?.[0]?.url;
}

export const FALLBACK_BOOKS: BookListItem[] = [
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
      { label: "Amazon", url: "https://a.co/d/01ZaW3zL" },
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
      { label: "Amazon", url: "https://a.co/d/07ABEMWd" },
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
      { label: "Amazon", url: "https://a.co/d/0h5tz98c" },
    ],
    relatedTopics: [
      { _id: "t1", title: "Entrepreneurship", slug: "entrepreneurship" },
    ],
    seo: null,
  },
];

/** Quick lookup by slug */
export function getFallbackBookBySlug(
  slug: string,
): BookListItem | undefined {
  return FALLBACK_BOOKS.find((b) => b.slug === slug);
}

/** Convert a BookListItem fallback to the full BookData shape */
export function fallbackBookToBookData(book: BookListItem): BookData {
  const descriptionText = book.shortSummary || `${book.title} by Nic Haralambous`;
  return {
    _id: book._id,
    title: book.title,
    slug: book.slug,
    subtitle: book.subtitle,
    coverImage: book.coverImage,
    description: [
      {
        _type: "block",
        _key: "p0",
        style: "normal",
        children: [{ _type: "span", _key: "s0", text: descriptionText }],
        markDefs: [],
      },
    ],
    publishedYear: book.publishedYear,
    isbn: null,
    buyLinks: book.buyLinks,
    relatedTopics: book.relatedTopics,
    seo: book.seo,
  };
}
