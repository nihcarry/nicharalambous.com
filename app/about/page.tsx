/**
 * About Page — /about
 *
 * Consolidated bio, businesses/exits timeline, and media logos.
 * Redirects from /meet-nic-haralambous and /businesses land here.
 *
 * Sections:
 * 1. Hero with bio
 * 2. Businesses/exits timeline (CMS-driven)
 * 3. Key facts / numbers
 * 4. Media logos
 * 5. CTA → /speaker
 *
 * JSON-LD: AboutPage + Person (sitewide)
 */
import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import {
  businessesQuery,
  type BusinessData,
} from "@/lib/sanity/queries";
import { CTAButton } from "@/components/cta-button";
import { Section } from "@/components/section";
import { JsonLd } from "@/components/json-ld";
import { aboutPageJsonLd } from "@/lib/metadata";

/* ---------- Data fetching ---------- */

async function getBusinesses(): Promise<BusinessData[] | null> {
  try {
    const data = await client.fetch<BusinessData[]>(businessesQuery);
    return data && data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

/* ---------- Metadata ---------- */

export const metadata: Metadata = {
  title: "About",
  description:
    "Nic Haralambous is an entrepreneur, AI product builder, and virtual keynote speaker with 4 startup exits, 3 books, and 20+ years building technology businesses.",
  alternates: { canonical: "https://nicharalambous.com/about" },
  openGraph: {
    title: "About Nic Haralambous",
    description:
      "Entrepreneur, AI product builder, and virtual keynote speaker. 4 startup exits, 3 books, 20+ years building tech businesses.",
    url: "https://nicharalambous.com/about",
  },
};

/* ---------- Page ---------- */

export default async function AboutPage() {
  const businesses = await getBusinesses();
  const displayBusinesses = businesses || FALLBACK_BUSINESSES;

  return (
    <>
      {/* Structured data */}
      <JsonLd data={aboutPageJsonLd()} />

      {/* Hero / Bio */}
      <Section width="content">
        <h1 className="text-4xl font-bold tracking-tight text-brand-900 sm:text-5xl">
          About Nic Haralambous
        </h1>
        <div className="mt-8 space-y-4 text-base leading-relaxed text-brand-700">
          <p>
            Nic Haralambous is an entrepreneur, AI product builder, and{" "}
            <Link href="/speaker" className="text-accent-600 hover:underline">
              virtual keynote speaker
            </Link>
            . With 4 startup exits, 3 published books, and more than 20 years building
            technology businesses, he helps modern teams unlock curiosity, build with
            AI, and turn innovation into profit.
          </p>
          <p>
            Nic started his first business at 21 — a music tech startup that became one
            of South Africa&rsquo;s first commercial blogs. Since then, he&rsquo;s co-founded and
            exited four companies, written three books, and spoken at events worldwide
            including SXSW, Standard Bank, and Vodacom.
          </p>
          <p>
            Today, Nic focuses on two things: building AI-powered products and delivering{" "}
            <Link href="/keynotes" className="text-accent-600 hover:underline">
              virtual keynotes
            </Link>{" "}
            that help teams think differently about curiosity, innovation, focus, and
            failure.
          </p>
        </div>
      </Section>

      {/* Key facts */}
      <Section width="wide" className="bg-brand-50">
        <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
          {KEY_FACTS.map((fact) => (
            <div key={fact.label}>
              <p className="text-4xl font-bold text-accent-600">{fact.value}</p>
              <p className="mt-2 text-sm font-medium text-brand-600">{fact.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Businesses / exits timeline */}
      <Section width="content">
        <h2 className="text-2xl font-bold text-brand-900 sm:text-3xl">
          Businesses &amp; Exits
        </h2>
        <div className="mt-10 space-y-0">
          {displayBusinesses.map((biz, i) => (
            <div
              key={biz._id || `biz-${i}`}
              className="relative border-l-2 border-brand-200 py-6 pl-8 last:pb-0"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[9px] top-7 h-4 w-4 rounded-full border-2 border-accent-500 bg-surface" />

              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-lg font-semibold text-brand-900">
                  {biz.url ? (
                    <a
                      href={biz.url}
                      className="hover:text-accent-600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {biz.name}
                    </a>
                  ) : (
                    biz.name
                  )}
                </h3>
                {biz.role && (
                  <span className="text-sm text-brand-500">{biz.role}</span>
                )}
              </div>

              <div className="mt-1 flex items-center gap-3 text-xs text-brand-400">
                {biz.startYear && (
                  <span>
                    {biz.startYear}
                    {biz.endYear ? `–${biz.endYear}` : "–present"}
                  </span>
                )}
                {biz.outcome && (
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    biz.outcome.startsWith("exit")
                      ? "bg-green-100 text-green-700"
                      : biz.outcome === "active"
                        ? "bg-accent-100 text-accent-600"
                        : "bg-brand-100 text-brand-600"
                  }`}>
                    {formatOutcome(biz.outcome)}
                  </span>
                )}
              </div>

              {biz.description && (
                <p className="mt-2 text-sm leading-relaxed text-brand-600">
                  {biz.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Media logos / "As featured in" */}
      <Section width="wide" className="bg-brand-50">
        <h2 className="text-center text-2xl font-bold text-brand-900 sm:text-3xl">
          As Featured In
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-brand-400">
          {MEDIA_LOGOS.map((name) => (
            <span
              key={name}
              className="text-lg font-semibold tracking-wide"
            >
              {name}
            </span>
          ))}
        </div>
      </Section>

      {/* Books teaser */}
      <Section width="content">
        <h2 className="text-2xl font-bold text-brand-900 sm:text-3xl">
          Books
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {BOOK_TEASERS.map((book) => (
            <Link
              key={book.slug}
              href={`/books/${book.slug}`}
              className="group rounded-xl border border-brand-200 p-6 transition-all hover:border-accent-400 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-brand-900 group-hover:text-accent-600">
                {book.title}
              </h3>
              <p className="mt-1 text-sm text-brand-500">{book.subtitle}</p>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <CTAButton href="/books" variant="secondary">
            View All Books
          </CTAButton>
        </div>
      </Section>

      {/* Final CTA */}
      <Section
        width="content"
        className="bg-accent-600 text-center text-white rounded-none"
      >
        <h2 className="text-2xl font-bold sm:text-3xl">
          Want Nic at Your Next Event?
        </h2>
        <p className="mt-4 text-lg text-accent-100">
          Virtual keynotes for conferences, corporate events, team offsites, and
          webinars. Worldwide delivery.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <CTAButton
            href="/speaker"
            className="bg-white !text-accent-600 hover:bg-accent-100"
          >
            About Nic as a Speaker
          </CTAButton>
          <CTAButton
            href="/contact"
            className="border-white !text-white hover:bg-white/10"
            variant="secondary"
          >
            Book Nic
          </CTAButton>
        </div>
      </Section>
    </>
  );
}

/* ---------- Utilities ---------- */

function formatOutcome(outcome: string): string {
  switch (outcome) {
    case "exit-acquired":
      return "Acquired";
    case "exit-sold":
      return "Sold";
    case "active":
      return "Active";
    case "closed":
      return "Closed";
    default:
      return outcome;
  }
}

/* ---------- Fallback data ---------- */

const KEY_FACTS = [
  { value: "4", label: "Startup Exits" },
  { value: "3", label: "Books Published" },
  { value: "20+", label: "Years in Tech" },
  { value: "100+", label: "Keynotes Delivered" },
];

const MEDIA_LOGOS = [
  "BBC",
  "Fast Company",
  "CNBC Africa",
  "SXSW",
  "Forbes",
  "TechCrunch",
];

const BOOK_TEASERS = [
  {
    title: "Do. Fail. Learn. Repeat.",
    subtitle: "The entrepreneurship memoir",
    slug: "do-fail-learn-repeat",
  },
  {
    title: "How to Start a Side Hustle",
    subtitle: "The practical business-building guide",
    slug: "how-to-start-a-side-hustle",
  },
];

const FALLBACK_BUSINESSES: BusinessData[] = [
  {
    _id: "fb-1",
    name: "Nic Haralambous — Keynote Speaking",
    role: "Founder",
    description: "Virtual keynote speaker helping teams unlock curiosity, build with AI, and turn innovation into profit.",
    startYear: 2020,
    endYear: null,
    outcome: "active",
    url: null,
    logo: null,
    order: 1,
  },
  {
    _id: "fb-2",
    name: "Niceboard",
    role: "Co-founder & CEO",
    description: "Job board software platform. Built, scaled, and successfully exited.",
    startYear: 2016,
    endYear: 2020,
    outcome: "exit-sold",
    url: null,
    logo: null,
    order: 2,
  },
  {
    _id: "fb-3",
    name: "Nic Harry",
    role: "Founder & CEO",
    description: "South Africa's leading online sock brand. Built from scratch to national retail distribution.",
    startYear: 2013,
    endYear: 2019,
    outcome: "exit-sold",
    url: null,
    logo: null,
    order: 3,
  },
  {
    _id: "fb-4",
    name: "Motribe",
    role: "Co-founder",
    description: "Mobile social networking platform. Acquired by Mxit, South Africa's largest mobile messaging app.",
    startYear: 2009,
    endYear: 2012,
    outcome: "exit-acquired",
    url: null,
    logo: null,
    order: 4,
  },
];
