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
import { JsonLd } from "@/components/json-ld";
import { collectionPageJsonLd } from "@/lib/metadata";

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
    "Every business Nic Haralambous has started, sold, or shut down — from his first startup at 16 to AI-powered products today. 20+ ventures across two decades.",
  alternates: { canonical: "https://nicharalambous.com/businesses" },
  openGraph: {
    title: "Businesses | Nic Haralambous",
    description:
      "Every business Nic Haralambous has started, sold, or shut down. 20+ ventures across two decades of building.",
    url: "https://nicharalambous.com/businesses",
  },
};

/* ---------- Page ---------- */

export default async function BusinessesPage() {
  const cmsBusinesses = await getBusinesses();
  const all = cmsBusinesses || FALLBACK_BUSINESSES;
  const { active, exits, deadpool } = partitionBusinesses(all);

  return (
    <>
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
        <h1 className="text-4xl font-bold tracking-tight text-brand-900 sm:text-5xl">
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
          <h2 className="text-center text-2xl font-bold text-brand-900 sm:text-3xl">
            What I&rsquo;m Building Now
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((biz, i) => (
              <div
                key={biz._id || `active-${i}`}
                className="group flex flex-col rounded-xl border border-brand-200 bg-surface p-6 transition-all hover:border-accent-400 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-brand-900">
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
                  <span className="shrink-0 rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-medium text-accent-600">
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
        <Section width="wide" className="bg-brand-50">
          <h2 className="text-center text-2xl font-bold text-brand-900 sm:text-3xl">
            Past Startups
          </h2>
          <p className="mt-2 text-center text-base text-brand-500">
            Businesses I co-founded and have exited.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {exits.map((biz, i) => (
              <div
                key={biz._id || `exit-${i}`}
                className="flex flex-col rounded-xl border border-brand-200 bg-surface p-6"
              >
                <div className="flex items-start justify-between gap-3">
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
                  <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
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
          <h2 className="text-center text-2xl font-bold text-brand-900 sm:text-3xl">
            Deadpool
          </h2>
          <p className="mt-2 text-center text-base text-brand-500">
            Businesses that didn&rsquo;t make it.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {deadpool.map((biz, i) => (
              <div
                key={biz._id || `dead-${i}`}
                className="rounded-xl border border-brand-200 bg-surface p-5"
              >
                <h3 className="text-base font-semibold text-brand-900">
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
      <Section
        width="content"
        className="bg-accent-600 text-center text-white rounded-none"
      >
        <blockquote className="text-xl font-medium italic leading-relaxed sm:text-2xl">
          &ldquo;Plan in decades. Think in years. Work in months. Live in
          days.&rdquo;
        </blockquote>
        <p className="mt-4 text-accent-100">&mdash; Nic Haralambous</p>
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

/* ---------- Fallback data ---------- */

const FALLBACK_BUSINESSES: BusinessData[] = [
  /* ===== ACTIVE ===== */
  {
    _id: "fb-active-1",
    name: "No Bull Ship Academy",
    role: "Founder",
    description:
      "An 8-week intensive programme that helps experienced professionals ship their first real product. Focused on product sense — deciding what to build, for whom, and why.",
    startYear: 2025,
    endYear: null,
    outcome: "active",
    url: "https://nobullship.co",
    logo: null,
    order: 1,
  },
  {
    _id: "fb-active-2",
    name: "The Reducer",
    role: "Creator",
    description:
      "A custom Gem/GPT that helps you refine your ideas (business, feature, talks, projects) into the single core outcome and single core user value. Cheeky, pushy, and won't let up until you have total clarity.",
    startYear: 2024,
    endYear: null,
    outcome: "active",
    url: null,
    logo: null,
    order: 2,
  },
  {
    _id: "fb-active-3",
    name: "Buy Home Helper",
    role: "Founder",
    description:
      "A digital guide for expats navigating the Dutch home-buying process. Tracks deadlines, viewings, and bids across multiple properties so you never miss a critical step or pay a €45,000 penalty.",
    startYear: 2024,
    endYear: null,
    outcome: "active",
    url: "https://buyhomehelper.com",
    logo: null,
    order: 3,
  },
  {
    _id: "fb-active-4",
    name: "Savistash",
    role: "Founder",
    description:
      "Turn saved links into your favourite newsletter. Save links from anywhere and get them back in a scheduled email digest — daily, weekly, or whenever you choose. Stop hoarding bookmarks, start actually reading them.",
    startYear: 2024,
    endYear: null,
    outcome: "active",
    url: "https://savistash.com",
    logo: null,
    order: 4,
  },
  {
    _id: "fb-active-5",
    name: "YOCO",
    role: "Product",
    description:
      "Making it simple for entrepreneurs to get paid and grow their businesses — and the African economy. A place where entrepreneurs build products at scale and serve fellow entrepreneurs.",
    startYear: 2021,
    endYear: null,
    outcome: "active",
    url: "https://www.yoco.com",
    logo: null,
    order: 5,
  },
  {
    _id: "fb-active-6",
    name: "Professional Speaker",
    role: "Keynote Speaker",
    description:
      "Virtual keynote speaker helping teams think and act more like startups. Talks on curiosity, innovation, AI, focus, and building breakthrough teams.",
    startYear: 2010,
    endYear: null,
    outcome: "active",
    url: "/speaker",
    logo: null,
    order: 6,
  },
  {
    _id: "fb-active-7",
    name: "It's Not Over — Podcast",
    role: "Host",
    description:
      "A vulnerable, honest, and frank podcast with people who have survived near-death business experiences.",
    startYear: 2020,
    endYear: null,
    outcome: "active",
    url: null,
    logo: null,
    order: 7,
  },

  /* ===== EXITS ===== */
  {
    _id: "fb-exit-1",
    name: "The Slow Fund",
    role: "Co-founder",
    description:
      "A non-profit that helped people start side hustles every day. Over one year the Slow Fund invested in over 300 young entrepreneurs and distributed R1,000,000.",
    startYear: 2019,
    endYear: 2020,
    outcome: "exit-sold",
    url: null,
    logo: null,
    order: 10,
  },
  {
    _id: "fb-exit-2",
    name: "Nic Harry",
    role: "Founder & CEO",
    description:
      "A style company that sells unique bamboo socks. Built from scratch to national retail distribution. Sold in 2019.",
    startYear: 2013,
    endYear: 2019,
    outcome: "exit-sold",
    url: null,
    logo: null,
    order: 11,
  },
  {
    _id: "fb-exit-3",
    name: "ForeFront Africa",
    role: "Co-founder",
    description:
      "A consultancy helping foreign businesses enter the African continent. Sold to Imperial Holdings in 2014.",
    startYear: 2012,
    endYear: 2014,
    outcome: "exit-sold",
    url: null,
    logo: null,
    order: 12,
  },
  {
    _id: "fb-exit-4",
    name: "Motribe",
    role: "Co-founder",
    description:
      "A mobile social network builder enabling anyone with a mobile device to build their own private social network. Acquired by Mxit in 2012.",
    startYear: 2009,
    endYear: 2012,
    outcome: "exit-acquired",
    url: null,
    logo: null,
    order: 13,
  },
  {
    _id: "fb-exit-5",
    name: "Nudjit",
    role: "Founder",
    description:
      "A gadget and technology review site. Sold to Avusa in 2008.",
    startYear: 2005,
    endYear: 2008,
    outcome: "exit-sold",
    url: null,
    logo: null,
    order: 14,
  },

  /* ===== DEADPOOL ===== */
  {
    _id: "fb-dead-1",
    name: "BookSum.co",
    role: "Founder",
    description:
      "A service helping authors promote their books on social media platforms.",
    startYear: 2021,
    endYear: 2022,
    outcome: "closed",
    url: null,
    logo: null,
    order: 20,
  },
  {
    _id: "fb-dead-2",
    name: "Slow Hustle",
    role: "Founder",
    description:
      "An online community helping people start side hustles. Included an online course, live coaching sessions, books, and content.",
    startYear: 2019,
    endYear: 2021,
    outcome: "closed",
    url: null,
    logo: null,
    order: 21,
  },
  {
    _id: "fb-dead-3",
    name: "The Curious Cult Podcast",
    role: "Host",
    description:
      "A COVID lockdown podcast featuring conversations with the most interesting people in the world — co-founder of Starbucks, founder of Electronic Arts, founder of Moz.com, and many more.",
    startYear: 2020,
    endYear: 2021,
    outcome: "closed",
    url: null,
    logo: null,
    order: 22,
  },
  {
    _id: "fb-dead-4",
    name: "Remote Keynote",
    role: "Co-founder",
    description:
      "A digital platform for keynote speakers and remote teams to connect. Launched within 3 weeks of lockdown. The world moved faster than we did.",
    startYear: 2020,
    endYear: 2020,
    outcome: "closed",
    url: null,
    logo: null,
    order: 23,
  },
  {
    _id: "fb-dead-5",
    name: "SA Rocks",
    role: "Founder",
    description:
      "A popular blog that posted content every day for 6 years promoting South Africa.",
    startYear: 2008,
    endYear: 2014,
    outcome: "closed",
    url: null,
    logo: null,
    order: 24,
  },
  {
    _id: "fb-dead-6",
    name: "Digspot",
    role: "Co-founder",
    description:
      "A social network built in 2006 for students around the world who lived in digs.",
    startYear: 2006,
    endYear: 2007,
    outcome: "closed",
    url: null,
    logo: null,
    order: 25,
  },
  {
    _id: "fb-dead-7",
    name: "Studentwire",
    role: "Founder",
    description:
      "A news website launched in 2004 that gathered news from university campuses across South Africa. One fundamental failing: misunderstanding what students in 2004 cared about. It was not news.",
    startYear: 2004,
    endYear: 2005,
    outcome: "closed",
    url: null,
    logo: null,
    order: 26,
  },
  {
    _id: "fb-dead-8",
    name: "Thus Far",
    role: "Member",
    description:
      "A pop-rock band founded in 2003 and ended in 2005 after the band decided to settle into their \"professional\" careers.",
    startYear: 2003,
    endYear: 2005,
    outcome: "closed",
    url: null,
    logo: null,
    order: 27,
  },
];
