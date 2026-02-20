/**
 * Businesses Page — /businesses
 *
 * Full entrepreneurial history organised into three sections:
 * 1. "What I'm Building Now" — active projects and roles
 * 2. "Past Startups" — exited companies
 * 3. "Deadpool" — ventures that didn't make it
 *
 * Content is fetched from Sanity at build time. Falls back to hardcoded
 * defaults if Sanity data is not yet published.
 *
 * JSON-LD: CollectionPage + Person (sitewide)
 */
import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import {
  businessesQuery,
  type BusinessData,
} from "@/lib/sanity/queries";
import { CTAButton } from "@/components/cta-button";
import { Section } from "@/components/section";
import { FinalCta } from "@/components/final-cta";
import { JsonLd } from "@/components/json-ld";
import { collectionPageJsonLd } from "@/lib/metadata";
import { tilt } from "@/lib/tilt";

/* ---------- Data fetching ---------- */

async function getBusinesses(): Promise<BusinessData[] | null> {
  try {
    const data = await client.fetch<BusinessData[]>(businessesQuery);
    return data && data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

/* ---------- Helpers ---------- */

function partitionBusinesses(businesses: BusinessData[]) {
  const active: BusinessData[] = [];
  const exits: BusinessData[] = [];
  const deadpool: BusinessData[] = [];

  for (const biz of businesses) {
    if (biz.outcome === "active") {
      active.push(biz);
    } else if (
      biz.outcome === "exit-acquired" ||
      biz.outcome === "exit-sold"
    ) {
      exits.push(biz);
    } else {
      deadpool.push(biz);
    }
  }

  return { active, exits, deadpool };
}

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

/* ---------- Metadata ---------- */

export const metadata: Metadata = {
  title: "Businesses",
  description:
    "Every business Nic Haralambous has started, sold, or shut down — from his first venture at 16 to building products today. Two decades of entrepreneurship.",
  alternates: { canonical: "https://nicharalambous.com/businesses" },
  openGraph: {
    title: "Businesses | Nic Haralambous",
    description:
      "Every business Nic Haralambous has started, sold, or shut down. Two decades of building, selling, and learning.",
    url: "https://nicharalambous.com/businesses",
  },
};

/* ---------- Page ---------- */

export default async function BusinessesPage() {
  const cmsBusinesses = await getBusinesses();
  const all = cmsBusinesses || FALLBACK_BUSINESSES;
  const { active, exits, deadpool } = partitionBusinesses(all);

  return (
    <div className="page-bg bg-gear-pattern">
      {/* Structured data */}
      <JsonLd
        data={collectionPageJsonLd({
          name: "Businesses by Nic Haralambous",
          description:
            "Every business Nic Haralambous has started, sold, or shut down — 20+ ventures across two decades.",
          url: "https://nicharalambous.com/businesses",
        })}
      />

      {/* Hero */}
      <Section width="content" className="text-center">
        <h1 className="heading-display-stroke-sm text-5xl text-brand-900 sm:text-6xl">
          Building
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-brand-600">
          I started my first business at school at the age of 16. Since then I
          haven&rsquo;t gone a year in my life without a business being built.
          Below you&rsquo;ll find my current projects, past exits, and a list of
          dead startups that I tried to get off the ground but didn&rsquo;t work
          for one reason or another.
        </p>
      </Section>

      {/* What I'm Building Now */}
      {active.length > 0 && (
        <Section width="wide">
          <h2 className="heading-display text-center text-3xl text-brand-900 sm:text-4xl">
            What I&rsquo;m Building Now
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((biz, i) => (
              <div
                key={biz._id || `active-${i}`}
                className="group card-brutalist flex flex-col p-6 transition-colors hover:bg-accent-50"
                style={{ transform: `rotate(${tilt(i, 110)}deg)` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="heading-display text-lg text-brand-900">
                    {biz.url ? (
                      <a
                        href={biz.url}
                        className="hover:text-accent-600"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {biz.name}
                        <span className="ml-1 text-brand-400">&rarr;</span>
                      </a>
                    ) : (
                      biz.name
                    )}
                  </h3>
                  <span className="shrink-0 bg-accent-100 px-2.5 py-0.5 text-xs font-medium text-accent-600">
                    Active
                  </span>
                </div>
                {biz.role && (
                  <p className="mt-1 text-sm text-brand-500">{biz.role}</p>
                )}
                {biz.description && (
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-600">
                    {biz.description}
                  </p>
                )}
                {biz.startYear && (
                  <p className="mt-4 text-xs text-brand-400">
                    {biz.startYear}&ndash;present
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Past Startups (Exits) */}
      {exits.length > 0 && (
        <Section width="wide">
          <h2 className="heading-display text-center text-3xl text-brand-900 sm:text-4xl">
            Past Startups
          </h2>
          <p className="mt-2 text-center text-base text-brand-500">
            Businesses I co-founded and have exited.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {exits.map((biz, i) => (
              <div
                key={biz._id || `exit-${i}`}
                className="card-brutalist flex flex-col p-6"
                style={{ transform: `rotate(${tilt(i, 120)}deg)` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="heading-display text-lg text-brand-900">
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
                  <span className="shrink-0 bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                    {formatOutcome(biz.outcome || "exit-sold")}
                  </span>
                </div>
                {biz.role && (
                  <p className="mt-1 text-sm text-brand-500">{biz.role}</p>
                )}
                {biz.description && (
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-600">
                    {biz.description}
                  </p>
                )}
                {biz.startYear && (
                  <p className="mt-4 text-xs text-brand-400">
                    {biz.startYear}
                    {biz.endYear ? `–${biz.endYear}` : ""}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Deadpool */}
      {deadpool.length > 0 && (
        <Section width="wide">
          <h2 className="heading-display text-center text-3xl text-brand-900 sm:text-4xl">
            Deadpool
          </h2>
          <p className="mt-2 text-center text-base text-brand-500">
            Businesses that didn&rsquo;t make it.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {deadpool.map((biz, i) => (
              <div
                key={biz._id || `dead-${i}`}
                className="border-4 border-brand-400 p-5"
              >
                <h3 className="heading-display text-base text-brand-900">
                  {biz.name}
                </h3>
                {biz.description && (
                  <p className="mt-2 text-sm leading-relaxed text-brand-600">
                    {biz.description}
                  </p>
                )}
                {biz.startYear && (
                  <p className="mt-3 text-xs text-brand-400">
                    {biz.startYear}
                    {biz.endYear ? `–${biz.endYear}` : ""}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Closing quote + CTA */}
      <FinalCta
        quote="Plan in decades. Think in years. Work in months. Live in days."
        quoteAttribution="Nic Haralambous"
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

/* ---------- Fallback data ---------- */

const FALLBACK_BUSINESSES: BusinessData[] = [
  /* ===== ACTIVE ===== */
  {
    _id: "fb-active-1",
    name: "Professional Speaker",
    role: "Keynote Speaker",
    description:
      "After more than 20 years of building startups and consulting with the biggest brands in the world, I deliver keynotes focused on helping businesses create more curious, entrepreneurial cultures.",
    startYear: 2010,
    endYear: null,
    outcome: "active",
    url: "/speaker",
    logo: null,
    order: 1,
  },

  /* ===== EXITS ===== */
  {
    _id: "fb-exit-1",
    name: "Nic Harry",
    role: "CEO & Founder",
    description:
      "With R5,000 and a 6-week deadline to launch, I started a sock brand that grew into a fashion business with five retail stores and an online presence shipping worldwide. Successfully sold in 2018.",
    startYear: 2012,
    endYear: 2019,
    outcome: "exit-sold",
    url: null,
    logo: null,
    order: 10,
  },
  {
    _id: "fb-exit-2",
    name: "Resolve Mobile",
    role: "Director & Co-Founder",
    description:
      "A mobile consulting firm helping clients enter the African continent. Worked with large telco companies to integrate innovative technology in markets like Kenya, Ghana, and Nigeria. Sold to Imperial Logistics in 2014.",
    startYear: 2013,
    endYear: 2014,
    outcome: "exit-sold",
    url: null,
    logo: null,
    order: 11,
  },
  {
    _id: "fb-exit-3",
    name: "Motribe",
    role: "CEO & Co-Founder",
    description:
      "A platform that allowed users, brands, and businesses to build, manage, and generate revenue from their own mobile social communities. Sold to Mxit in 2011.",
    startYear: 2010,
    endYear: 2012,
    outcome: "exit-acquired",
    url: null,
    logo: null,
    order: 12,
  },

  /* ===== CLOSED ===== */
  {
    _id: "fb-closed-1",
    name: "The Slow Fund",
    role: "Founder",
    description:
      "A non-profit that helped more than 250 entrepreneurs start their own businesses. Received over 20,000 applications in its first year. Personally coached each successful applicant with the help of Nedbank and other partners.",
    startYear: 2021,
    endYear: 2022,
    outcome: "closed",
    url: null,
    logo: null,
    order: 20,
  },
  {
    _id: "fb-closed-2",
    name: "Slow Hustle",
    role: "Founder",
    description:
      "A community helping entrepreneurs, founders, and side-hustlers build things of value slowly, patiently, and consistently. Included eBooks, online courses, masterclasses, and one-on-one coaching.",
    startYear: 2020,
    endYear: 2022,
    outcome: "closed",
    url: null,
    logo: null,
    order: 21,
  },
  {
    _id: "fb-closed-3",
    name: "Studentwire",
    role: "Founder",
    description:
      "A news website gathering content from over 10 university campuses across South Africa. Closely involved in student media production and publishing student journalism online.",
    startYear: 2005,
    endYear: 2008,
    outcome: "closed",
    url: null,
    logo: null,
    order: 22,
  },
];
