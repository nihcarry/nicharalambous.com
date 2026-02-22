/**
 * Businesses Page — /businesses
 *
 * Slide-based entrepreneurial history organised into:
 * 1. Hero narrative
 * 2. What I'm Building Now (active)
 * 3. Past Startups (exits)
 * 4. Deadpool (non-clickable archive)
 *
 * Content is fetched from Sanity at build time and falls back to hardcoded
 * records when CMS content is unavailable.
 *
 * JSON-LD: CollectionPage
 */
import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import {
  businessesQuery,
  type BusinessData,
} from "@/lib/sanity/queries";
import { Slide } from "@/components/slide";
import { SlideDeck } from "@/components/slide-deck";
import { SlideContent } from "@/components/slide-animations";
import { NextSlideIndicator } from "@/components/next-slide-indicator";
import { FooterContent } from "@/components/footer-content";
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

function chunkBusinesses<T>(items: T[], chunkSize: number): T[][] {
  if (items.length === 0) return [];
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  return chunks;
}

function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./i, "");
  } catch {
    return url;
  }
}

function formatYears(startYear: number | null, endYear: number | null, active: boolean): string | null {
  if (!startYear) return null;
  if (active) return `${startYear}\u2013present`;
  return endYear ? `${startYear}\u2013${endYear}` : `${startYear}`;
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

function getBusinessVisualUrl(business: BusinessData): string | null {
  if (business.screenshot?.asset) {
    return urlFor(business.screenshot).width(1200).height(700).fit("crop").auto("format").url();
  }
  if (business.logo?.asset) {
    return urlFor(business.logo).width(900).height(700).fit("max").auto("format").url();
  }
  return null;
}

/* ---------- Metadata ---------- */

export const metadata: Metadata = {
  title: "Businesses",
  description:
    "Every business Nic Haralambous has started, sold, or shut down, from his first venture at 16 to building products today. Two decades of entrepreneurship.",
  alternates: { canonical: "https://nicharalambous.com/businesses" },
  openGraph: {
    type: "website",
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
  const { exits, deadpool } = partitionBusinesses(all);
  const currentBuildSlides = chunkBusinesses(CURRENT_BUILDS, 2);
  const exitSlides = chunkBusinesses(exits, 6);
  const deadpoolFirstSlide = deadpool.slice(0, 4);
  const deadpoolSecondSlide = deadpool.slice(4, 9);
  const deadpoolRemainingSlides = chunkBusinesses(deadpool.slice(9), 3);

  return (
    <SlideDeck>
      <NextSlideIndicator />

      {/* Structured data */}
      <JsonLd
        data={collectionPageJsonLd({
          name: "Businesses by Nic Haralambous",
          description:
            "Every business Nic Haralambous has started, sold, or shut down: 20+ ventures across two decades.",
          url: "https://nicharalambous.com/businesses",
        })}
      />

      <Slide
        variant="grid-3"
        background="bg-gear-pattern"
        id="hero"
        className="md:justify-start"
        image={
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src="/slides/Nic_Building_1.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute right-0 bottom-0 z-[1] hidden h-[40vh] w-auto select-none object-contain object-bottom md:block"
          />
        }
      >
        <SlideContent>
          <h1 className="heading-stroke text-center font-extrabold tracking-tight text-5xl uppercase leading-[0.95] text-accent-600 sm:text-6xl md:text-7xl lg:text-8xl">
            Building
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-center text-lg font-medium leading-relaxed text-brand-700 md:text-xl">
            I started my first business at school at the age of 16. Since then
            I haven&apos;t gone a year in my life without a business being
            built.
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-center text-base leading-relaxed text-brand-600 md:text-lg">
            Below you&apos;ll find my current projects, past exits, and a list
            of dead startups that I tried to get off the ground but didn&apos;t
            work for one reason or another.
          </p>
        </SlideContent>
      </Slide>

      {currentBuildSlides.map((slideBuilds, slideIndex) => (
        <Slide
          key={`active-slide-${slideIndex}`}
          variant="grid-3"
          background="bg-gear-pattern"
          id={slideIndex === 0 ? "active" : `active-${slideIndex + 1}`}
          className={
            slideIndex === 0
              ? "md:justify-start"
              : "md:justify-start"
          }
        >
          <SlideContent>
            {slideIndex === 0 ? (
              <div className="mb-8 md:mb-10">
                <h2 className="heading-stroke mt-2 text-center text-4xl font-extrabold tracking-tight uppercase leading-[0.95] text-brand-900 sm:text-5xl md:text-6xl">
                  What I&apos;m Building Now
                </h2>
                <p className="mx-auto mt-3 max-w-3xl text-center text-base leading-relaxed text-brand-600 md:text-lg">
                  Live products I&apos;m actively shipping right now.
                </p>
              </div>
            ) : (
              <div className="mb-6 text-center" />
            )}
            <div className="mx-auto grid w-full max-w-4xl gap-4 md:grid-cols-2 md:gap-4">
              {slideBuilds.map((build, cardIndex) => (
                <a
                  key={build.url}
                  href={build.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group card-brutalist flex h-full flex-col overflow-hidden bg-white transition-colors hover:bg-accent-50"
                  style={{ transform: `rotate(${tilt(cardIndex, 180 + slideIndex)}deg)` }}
                >
                  <div className="relative aspect-[16/8] border-b-4 border-brand-200 bg-brand-100 md:aspect-[16/6]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={build.screenshotSrc}
                      alt={`${build.name} screenshot`}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base font-extrabold tracking-tight uppercase text-brand-900 md:text-lg">
                        {build.name}
                      </h3>
                      <span className="shrink-0 bg-accent-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent-700">
                        Live
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-brand-500">
                      {getHostname(build.url)}
                    </p>
                    <p className="mt-2 flex-1 text-xs leading-snug text-brand-600">
                      {build.summary}
                    </p>
                    <p className="mt-3 text-sm font-semibold text-accent-600">
                      Open project <span aria-hidden>&rarr;</span>
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </SlideContent>
        </Slide>
      ))}

      {exitSlides.map((slideBusinesses, slideIndex) => (
        <Slide
          key={`exits-slide-${slideIndex}`}
          variant="grid-3"
          background="bg-gear-pattern"
          id={slideIndex === 0 ? "past-startups" : `past-startups-${slideIndex + 1}`}
        >
          <SlideContent>
            <div className="mb-8 text-center">
              <h2 className="heading-stroke mt-2 text-4xl font-extrabold tracking-tight uppercase leading-[0.95] text-brand-900 sm:text-5xl md:text-6xl">
                Past Startups
              </h2>
              <p className="mt-2 text-base text-brand-500">
                Businesses I co-founded and have exited.
              </p>
              {slideIndex > 0 && (
                <p className="text-sm text-brand-500">
                  Continuation
                </p>
              )}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {slideBusinesses.map((business, cardIndex) => (
                <BusinessCard
                  key={business._id || `exit-${slideIndex}-${cardIndex}`}
                  business={business}
                  cardIndex={cardIndex}
                  seed={120 + slideIndex}
                  variant="exit"
                />
              ))}
            </div>
          </SlideContent>
        </Slide>
      ))}

      {deadpoolFirstSlide.length > 0 && (
        <Slide
          variant="grid-3"
          background="bg-gear-pattern"
          id="deadpool"
          className="md:justify-start"
        >
          <SlideContent>
            <div className="mb-8 text-center">
              <h2 className="heading-stroke mt-2 text-4xl font-extrabold tracking-tight uppercase leading-[0.95] text-brand-900 sm:text-5xl md:text-6xl">
                Deadpool
              </h2>
              <p className="mt-2 text-base text-brand-500">
                Businesses that didn&apos;t make it.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {deadpoolFirstSlide.map((business, cardIndex) => (
                <BusinessCard
                  key={business._id || `dead-top-${cardIndex}`}
                  business={business}
                  cardIndex={cardIndex}
                  seed={130}
                  variant="deadpool"
                />
              ))}
            </div>
          </SlideContent>
        </Slide>
      )}

      {deadpoolSecondSlide.length > 0 && (
        <Slide
          variant="grid-3"
          background="bg-gear-pattern"
          id="deadpool-2"
          className="md:justify-start"
        >
          <SlideContent>
            <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
              {deadpoolSecondSlide.slice(0, 3).map((business, cardIndex) => (
                <BusinessCard
                  key={business._id || `dead-second-top-${cardIndex}`}
                  business={business}
                  cardIndex={cardIndex}
                  seed={132}
                  variant="deadpool"
                />
              ))}
            </div>
            {deadpoolSecondSlide.length > 3 && (
              <div className="mx-auto mt-4 grid max-w-4xl gap-4 md:grid-cols-2">
                {deadpoolSecondSlide.slice(3, 5).map((business, cardIndex) => (
                  <BusinessCard
                    key={business._id || `dead-second-bottom-${cardIndex}`}
                    business={business}
                    cardIndex={cardIndex + 3}
                    seed={133}
                    variant="deadpool"
                  />
                ))}
              </div>
            )}
          </SlideContent>
        </Slide>
      )}

      {deadpoolRemainingSlides.map((slideBusinesses, slideIndex) => (
        <Slide
          key={`deadpool-remaining-slide-${slideIndex}`}
          variant="grid-3"
          background="bg-gear-pattern"
          id={`deadpool-${slideIndex + 3}`}
        >
          <SlideContent>
            <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
              {slideBusinesses.map((business, cardIndex) => (
                <BusinessCard
                  key={business._id || `dead-remaining-${slideIndex}-${cardIndex}`}
                  business={business}
                  cardIndex={cardIndex}
                  seed={140 + slideIndex}
                  variant="deadpool"
                />
              ))}
            </div>
          </SlideContent>
        </Slide>
      ))}

      <Slide variant="footer" background="bg-foot-pattern" id="footer">
        <FooterContent />
      </Slide>
    </SlideDeck>
  );
}

interface BusinessCardProps {
  business: BusinessData;
  cardIndex: number;
  seed: number;
  variant: "active" | "exit" | "deadpool";
}

interface CurrentBuild {
  name: string;
  url: string;
  summary: string;
  screenshotSrc: string;
}

function BusinessCard({ business, cardIndex, seed, variant }: BusinessCardProps) {
  const visualUrl = getBusinessVisualUrl(business);
  const active = variant === "active";
  const deadpool = variant === "deadpool";
  const exit = variant === "exit";
  const canLink = !deadpool && Boolean(business.url);
  const dateLabel = formatYears(business.startYear, business.endYear, active);
  const titleClassName = deadpool
    ? "text-base font-extrabold tracking-tight uppercase text-brand-700"
    : "text-lg font-extrabold tracking-tight uppercase text-brand-900";
  const cardClassName = deadpool
    ? "border-[12px] border-black bg-brand-100/40 p-4 opacity-90 md:border-[20px]"
    : "card-brutalist flex h-full flex-col overflow-hidden bg-white";

  const content = (
    <>
      {active && (
        <div className="relative aspect-[16/9] border-b-4 border-brand-200 bg-brand-100">
          {visualUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={visualUrl}
              alt={business.name}
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-brand-100 text-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
                  Visual Coming Soon
                </p>
                <p className="mt-1 text-sm text-brand-500">
                  Screenshot or logo placeholder
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={deadpool ? "pt-4" : "flex flex-1 flex-col p-5"}>
        <div className="flex items-start justify-between gap-3">
          <h3 className={titleClassName}>
            {business.name}
            {canLink && <span className="ml-1 text-brand-400">&rarr;</span>}
          </h3>
          {active && (
            <span className="shrink-0 bg-accent-100 px-2.5 py-0.5 text-xs font-semibold text-accent-600">
              Active
            </span>
          )}
          {exit && (
            <span className="shrink-0 bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
              {formatOutcome(business.outcome || "exit-sold")}
            </span>
          )}
          {deadpool && (
            <span className="shrink-0 bg-brand-200 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-brand-600">
              Archived
            </span>
          )}
        </div>

        {business.role && (
          <p className="mt-1 text-sm text-brand-500">{business.role}</p>
        )}
        {business.description && (
          <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-600">
            {business.description}
          </p>
        )}
        {dateLabel && (
          <p className="mt-4 text-xs font-medium text-brand-400">{dateLabel}</p>
        )}
      </div>
    </>
  );

  if (!canLink) {
    return (
      <article
        className={cardClassName}
        style={{ transform: `rotate(${tilt(cardIndex, seed)}deg)` }}
      >
        {content}
      </article>
    );
  }

  return (
    <a
      href={business.url || "#"}
      target={business.url && isExternalUrl(business.url) ? "_blank" : undefined}
      rel={business.url && isExternalUrl(business.url) ? "noopener noreferrer" : undefined}
      className={`${cardClassName} transition-colors hover:bg-accent-50`}
      style={{ transform: `rotate(${tilt(cardIndex, seed)}deg)` }}
    >
      {content}
    </a>
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
    screenshot: null,
    order: 1,
  },

  /* ===== EXITS ===== */
  {
    _id: "fb-exit-1",
    name: "Nic Harry Socks",
    role: "CEO & Founder",
    description:
      "With R5,000 and a 6-week deadline to launch, I started a sock brand that grew into a fashion business with five retail stores and an online presence shipping worldwide. Successfully sold in 2018.",
    startYear: 2012,
    endYear: 2019,
    outcome: "exit-sold",
    url: null,
    logo: null,
    screenshot: null,
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
    screenshot: null,
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
    outcome: "exit-sold",
    url: null,
    logo: null,
    screenshot: null,
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
    screenshot: null,
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
    screenshot: null,
    order: 21,
  },
  {
    _id: "fb-closed-4",
    name: "BookSum.co",
    role: "Founder",
    description:
      "BookSum was a service helping authors promote their books on social media platforms.",
    startYear: null,
    endYear: null,
    outcome: "closed",
    url: null,
    logo: null,
    screenshot: null,
    order: 22,
  },
  {
    _id: "fb-closed-5",
    name: "The Curious Cult Podcast",
    role: "Host",
    description:
      "A COVID lockdown podcast with founders, authors, and leaders about curiosity, entrepreneurship, and how they choose to live and build.",
    startYear: 2020,
    endYear: 2021,
    outcome: "closed",
    url: null,
    logo: null,
    screenshot: null,
    order: 23,
  },
  {
    _id: "fb-closed-6",
    name: "Remote Keynote",
    role: "Founder",
    description:
      "A platform launched during lockdown to connect keynote speakers with remote teams for virtual speaking gigs.",
    startYear: 2020,
    endYear: 2021,
    outcome: "closed",
    url: null,
    logo: null,
    screenshot: null,
    order: 24,
  },
  {
    _id: "fb-closed-7",
    name: "SA Rocks",
    role: "Founder",
    description:
      "A South African blog that published content daily for six years to promote local stories and culture.",
    startYear: null,
    endYear: null,
    outcome: "closed",
    url: null,
    logo: null,
    screenshot: null,
    order: 25,
  },
  {
    _id: "fb-closed-8",
    name: "Digspot",
    role: "Founder",
    description:
      "A social network built for students living in digs around the world.",
    startYear: 2006,
    endYear: null,
    outcome: "closed",
    url: null,
    logo: null,
    screenshot: null,
    order: 26,
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
    screenshot: null,
    order: 27,
  },
  {
    _id: "fb-closed-9",
    name: "Thus Far",
    role: "Co-Founder",
    description:
      "A pop-rock band founded in 2003 and wrapped in 2005 when members moved into their professional careers.",
    startYear: 2003,
    endYear: 2005,
    outcome: "closed",
    url: null,
    logo: null,
    screenshot: null,
    order: 28,
  },
];

const CURRENT_BUILDS: CurrentBuild[] = [
  {
    name: "No Bull Ship Academy",
    url: "https://www.nobullship.co",
    summary:
      "An 8-week build sprint helping experienced professionals ship their first real product with ruthless scope, clarity, and weekly delivery.",
    screenshotSrc: "/slides/business-cards/nobullship.png",
  },
  {
    name: "BuyHomeHelper",
    url: "https://buyhomehelper.com",
    summary:
      "A deadline-tracking assistant for Dutch home buyers to manage viewings, bids, and critical purchase milestones across multiple homes.",
    screenshotSrc: "/slides/business-cards/buyhomehelper-no-www.png",
  },
  {
    name: "Savistash",
    url: "https://savistash.com",
    summary:
      "A save-for-later tool that resurfaces links through scheduled digests, so useful content returns when you can actually use it.",
    screenshotSrc: "/slides/business-cards/savistash.png",
  },
  {
    name: "GoodGoodWeeds",
    url: "https://goodgoodweeds.com",
    summary:
      "A simple strain memory app that helps users track and remember cannabis experiences, effects, and favorites over time.",
    screenshotSrc: "/slides/business-cards/goodgoodweeds-no-www.png",
  },
];
