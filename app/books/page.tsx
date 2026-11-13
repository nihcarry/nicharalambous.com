/**
 * Books — /books
 * Existing titles, summaries and buy links, in the v3 layout.
 */
import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { booksListQuery, type BookListItem } from "@/lib/sanity/queries";
import { FALLBACK_BOOKS, getPrimaryBuyUrl } from "@/lib/books-data";
import { JsonLd } from "@/components/json-ld";
import { NewsletterBlock } from "@/components/site/newsletter-block";
import { collectionPageJsonLd } from "@/lib/metadata";
import { OUTPUT_PARADOX_PATH } from "@/lib/site";

const STATIC_COVERS: Record<string, string> = {
  "do-fail-learn-repeat": "/slides/Do_Fail_Learn_repeate.jpg",
  "how-to-start-a-side-hustle": "/slides/How_to_start_a_side_Hustle.jpg",
  "the-business-builders-toolkit": "/slides/Business_Builders_Toolkit.jpg",
};

async function getBooks(): Promise<BookListItem[] | null> {
  try {
    const data = await client.fetch<BookListItem[]>(booksListQuery);
    return data && data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

export const metadata: Metadata = {
  title: "Books",
  description:
    "Books by Nic Haralambous on entrepreneurship, resilience, side hustles, and building businesses. 3 published books from 20+ years of real experience.",
  alternates: { canonical: "https://www.nicharalambous.com/books" },
  openGraph: {
    type: "website",
    title: "Books by Nic Haralambous",
    description: "3 published books on entrepreneurship, resilience, and building businesses.",
    url: "https://www.nicharalambous.com/books",
  },
};

export default async function BooksPage() {
  const cmsBooks = await getBooks();
  const books = cmsBooks || FALLBACK_BOOKS;

  return (
    <div className="v3">
      <JsonLd
        data={collectionPageJsonLd({
          name: "Books by Nic Haralambous",
          description: "Books on entrepreneurship, resilience, side hustles, and building businesses.",
          url: "https://www.nicharalambous.com/books",
        })}
      />
      <section className="p-envelope">
        <div className="wrap">
          <h1>My books</h1>
          <p className="lead">
            Three books, two bestsellers from twenty years of building, failing and learning about business and life.
          </p>
        </div>
      </section>
      <section>
        <div className="wrap book-grid">
          {books.map((book) => {
            const coverUrl = book.coverImage?.asset
              ? urlFor(book.coverImage).width(480).auto("format").url()
              : STATIC_COVERS[book.slug];
            const buyUrl = getPrimaryBuyUrl(book.slug, book.buyLinks);
            const summary = book.shortSummary || book.subtitle;
            return (
              <article className="book-row" key={book.slug}>
                {coverUrl ? (
                  <img src={coverUrl} alt={`${book.title} cover`} width={200} height={300} />
                ) : (
                  <div />
                )}
                <div>
                  <h2>{book.title}</h2>
                  {book.subtitle ? <p>{book.subtitle}</p> : null}
                  {summary && summary !== book.subtitle ? <p>{summary}</p> : null}
                  {buyUrl ? (
                    <p style={{ marginTop: 18 }}>
                      <a className="btn" href={buyUrl} target="_blank" rel="noopener noreferrer">
                        Buy now
                      </a>
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <section className="dark pd-spotlight">
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2>Want Nic at your next event?</h2>
          <p className="lead" style={{ margin: "16px auto 0", color: "#c9cdd6" }}>
            Keynotes for conferences, corporate events, team offsites, and webinars, in person or virtually. Worldwide.
          </p>
          <div className="acts" style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
            <a className="btn" href={OUTPUT_PARADOX_PATH}>
              See the keynote
            </a>
            <a className="quiet-link" href="/contact">
              Book Nic
            </a>
          </div>
        </div>
      </section>
      <NewsletterBlock />
    </div>
  );
}
