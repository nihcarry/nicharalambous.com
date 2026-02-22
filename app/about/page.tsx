/**
 * About Page — /about
 *
 * Personal bio page merging the warm first-person tone from the old
 * Squarespace site with LinkedIn-verified career data. Career is
 * organized around identity pillars (Entrepreneur, Speaker & Coach,
 * Product Builder, Writer) rather than a chronological timeline.
 *
 * Sections:
 * 1. Hero — identity-first heading, photo, bio, inline stats
 * 2. Story — personal narrative + famous quote pullquote
 * 3. Career pillars — 4 thematic blocks with LinkedIn-verified positions
 * 4. Media logos — "As Featured In"
 * 5. Books teaser
 * 6. Final CTA with quote
 *
 * JSON-LD: AboutPage + Person (sitewide)
 */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CTAButton } from "@/components/cta-button";
import { Section } from "@/components/section";
import { FinalCta } from "@/components/final-cta";
import { JsonLd } from "@/components/json-ld";
import { aboutPageJsonLd } from "@/lib/metadata";
import { tilt } from "@/lib/tilt";

/* ---------- Metadata ---------- */

export const metadata: Metadata = {
  title: "About",
  description:
    "Nic Haralambous is an entrepreneur, product builder, keynote speaker, and author with 3 business exits, 3 books, and 20+ years building technology businesses.",
  alternates: { canonical: "https://nicharalambous.com/about" },
  openGraph: {
    title: "About Nic Haralambous",
    description:
      "Entrepreneur, product builder, keynote speaker, and author. 3 business exits, 3 books, 20+ years building tech businesses.",
    url: "https://nicharalambous.com/about",
  },
};

/* ---------- Page ---------- */

export default function AboutPage() {
  return (
    <div className="page-bg bg-person-pattern">
      <JsonLd data={aboutPageJsonLd()} />

      {/* Hero — identity-first heading with photo */}
      <Section width="wide">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h1 className="heading-stroke font-extrabold tracking-tight text-5xl uppercase leading-[0.95] text-accent-600 sm:text-6xl md:text-7xl">
              I Am Nic Haralambous
            </h1>
            <div className="mt-8 space-y-4 text-base leading-relaxed text-brand-700">
              <p>
                I am an obsessive entrepreneur,{" "}
                <Link href="/speaker" className="text-accent-600 hover:underline">
                  keynote speaker
                </Link>
                , product builder, and published author. I&rsquo;ve been building
                businesses since I was 16, sold three of them, and spent more than
                20 years learning tough lessons through failure and success.
              </p>
              <p>
                Today I build products at{" "}
                <a
                  href="https://www.yoco.com"
                  className="text-accent-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Yoco
                </a>{" "}
                and deliver{" "}
                <Link href="/keynotes" className="text-accent-600 hover:underline">
                  virtual keynotes
                </Link>{" "}
                that help teams think differently about curiosity, innovation,
                and failure.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {KEY_STATS.map((stat) => (
                <span
                  key={stat.label}
                  className="border-2 border-accent-600 px-3 py-1.5"
                >
                  <span className="heading-display text-lg text-accent-600">
                    {stat.value}
                  </span>
                  <span className="ml-1.5 text-xs font-medium text-brand-600">
                    {stat.label}
                  </span>
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <Image
                src="/slides/Nic_About_new_16bit.png"
                alt="Nic Haralambous"
                width={480}
                height={800}
                className="relative z-10 h-auto w-full max-w-[16rem] md:max-w-[18.75rem]"
                priority
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Personal story + famous quote */}
      <Section width="content">
        <div className="space-y-4 text-base leading-relaxed text-brand-700">
          <p>
            I built my first website when I was 11 years old, my first business
            at 16, and a band that didn&rsquo;t go as far as I wanted.
          </p>
          <p>
            My career has taken me from student journalism to mobile product
            management at Vodacom, to co-founding and selling Motribe to Mxit,
            launching a sock brand with R5,000 that grew into five retail stores,
            and eventually to keynote stages around the world, including SXSW, Standard
            Bank, Vodacom, Old Mutual, and Nedbank.
          </p>
          <p>
            Through it all, I&rsquo;ve learned that above all else, culture
            creates change. My work today focuses on helping businesses build
            more curious, entrepreneurial cultures, whether through{" "}
            <Link href="/keynotes" className="text-accent-600 hover:underline">
              keynotes
            </Link>
            , coaching, or building products.
          </p>
        </div>

        <blockquote className="my-16 border-l-[6px] border-accent-600 py-4 pl-8">
          <p className="heading-display-stroke-sm text-2xl leading-snug text-brand-900 sm:text-3xl md:text-4xl">
            &ldquo;Plan in decades. Think in years. Work in months. Live in
            days.&rdquo;
          </p>
          <cite className="mt-4 block text-sm font-medium not-italic text-brand-500">
            - Nic Haralambous
          </cite>
        </blockquote>
      </Section>

      {/* Career pillars — LinkedIn-verified positions grouped by identity */}
      <Section width="wide">
        <h2 className="heading-stroke font-extrabold tracking-tight text-center text-4xl uppercase text-brand-900 sm:text-5xl md:text-6xl">
          Career
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {CAREER_PILLARS.map((pillar, i) => (
            <div
              key={pillar.title}
              className="card-brutalist p-6 md:p-8"
              style={{ transform: `rotate(${tilt(i, 50)}deg)` }}
            >
              <h3 className="heading-display text-2xl text-accent-600">
                {pillar.title}
              </h3>
              <div className="mt-6 space-y-4">
                {pillar.items.map((item) => (
                  <div
                    key={`${item.company}-${item.role}`}
                    className="border-b border-brand-100 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold text-brand-900">
                        {item.company}
                      </span>
                      {item.outcome && (
                        <span className="shrink-0 bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          {item.outcome}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 text-sm">
                      <span className="text-brand-600">{item.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Businesses preview */}
      <Section width="wide">
        <h2 className="heading-stroke font-extrabold tracking-tight text-4xl uppercase text-brand-900 sm:text-5xl md:text-6xl">
          Businesses
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-brand-600 md:text-lg">
          What I&apos;m building now.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {CURRENT_BUILDS_PREVIEW.map((business) => (
            <a
              key={business.name}
              href={business.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-brutalist block p-5 transition-colors hover:bg-accent-50"
            >
              <p className="text-lg font-extrabold uppercase tracking-tight text-brand-900">
                {business.name}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-brand-600">
                {business.summary}
              </p>
            </a>
          ))}
        </div>
        <div className="mt-6 text-center">
          <CTAButton href="/businesses" variant="secondary">
            View All Businesses
          </CTAButton>
        </div>
      </Section>

      {/* Books teaser */}
      <Section width="content">
        <h2 className="heading-stroke font-extrabold tracking-tight text-4xl uppercase text-brand-900 sm:text-5xl md:text-6xl">
          Books
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {BOOK_COVER_IMAGES.map((book) => (
            <div key={book.src} className="mx-auto w-full max-w-[13rem]">
              <Image
                src={book.src}
                alt={book.alt}
                width={320}
                height={480}
                className="h-auto w-full object-contain"
              />
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <CTAButton href="/books" variant="secondary">
            View All Books
          </CTAButton>
        </div>
      </Section>

      {/* Final CTA with famous quote */}
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

/* ---------- Static data ---------- */

const KEY_STATS = [
  { value: "3", label: "Business Exits" },
  { value: "3", label: "Books Published" },
  { value: "20+", label: "Years Building" },
  { value: "16+", label: "Years Speaking" },
];

const BOOK_COVER_IMAGES = [
  {
    src: "/slides/Do_Fail_Learn_repeate.jpg",
    alt: "Do. Fail. Learn. Repeat. book cover",
  },
  {
    src: "/slides/How_to_start_a_side_Hustle.jpg",
    alt: "How to Start a Side Hustle book cover",
  },
  {
    src: "/slides/Business_Builders_Toolkit.jpg",
    alt: "The Business Builder's Toolkit book cover",
  },
];

const CURRENT_BUILDS_PREVIEW = [
  {
    name: "No Bull Ship Academy",
    url: "https://www.nobullship.co",
    summary:
      "An 8-week build sprint helping experienced professionals ship their first real product with ruthless scope, clarity, and weekly delivery.",
  },
  {
    name: "BuyHomeHelper",
    url: "https://buyhomehelper.com",
    summary:
      "A deadline-tracking assistant for Dutch home buyers to manage viewings, bids, and critical purchase milestones.",
  },
  {
    name: "Savistash",
    url: "https://savistash.com",
    summary:
      "A save-for-later tool that resurfaces links through scheduled digests, so useful content returns when you can use it.",
  },
  {
    name: "GoodGoodWeeds",
    url: "https://goodgoodweeds.com",
    summary:
      "A simple strain memory app that helps users track and remember cannabis experiences, effects, and favorites over time.",
  },
];

interface CareerItem {
  company: string;
  role: string;
  dates: string;
  outcome?: string;
}

interface CareerPillar {
  title: string;
  items: CareerItem[];
}

const CAREER_PILLARS: CareerPillar[] = [
  {
    title: "The Entrepreneur",
    items: [
      { company: "Nic Harry", role: "CEO & Founder", dates: "Nov 2012 – Nov 2019", outcome: "Sold" },
      { company: "Resolve Mobile", role: "Director & Co-Founder", dates: "2013 – 2014", outcome: "Sold" },
      { company: "Motribe", role: "CEO & Co-Founder", dates: "Aug 2010 – Sep 2012", outcome: "Sold" },
      { company: "The Slow Fund", role: "Founder", dates: "Jan 2021 – Dec 2022" },
      { company: "Slow Hustle", role: "Founder", dates: "2020 – 2022" },
      { company: "Coindirect", role: "COO", dates: "May 2018 – Apr 2020" },
      { company: "Studentwire", role: "Founder", dates: "Aug 2005 – Jan 2008" },
    ],
  },
  {
    title: "The Speaker & Coach",
    items: [
      { company: "Professional Speaker", role: "Keynote Speaker", dates: "Jan 2010 – Present" },
      { company: "Business Coach & Consultant", role: "Coach", dates: "Mar 2019 – Dec 2022" },
      { company: "Story to Stage", role: "Speaker Coach", dates: "Nov 2020 – Dec 2022" },
    ],
  },
  {
    title: "The Product Builder",
    items: [
      { company: "Yoco", role: "Senior Product Manager", dates: "Jan 2023 – Present" },
      { company: "Vodacom", role: "Product Manager: Social Networking", dates: "Jun 2009 – Jul 2010" },
    ],
  },
  {
    title: "The Writer",
    items: [
      { company: "Daily Maverick", role: "Columnist", dates: "Dec 2019 – Jan 2024" },
      { company: "Courier", role: "Columnist", dates: "Jun 2021 – May 2023" },
      { company: "Entrepreneur Magazine SA", role: "Columnist", dates: "2012 – 2015" },
      { company: "Mail & Guardian Online", role: "Mobile Manager", dates: "Apr 2008 – Aug 2008" },
      { company: "Financial Mail", role: "Campus Editor", dates: "Jun 2007 – May 2008" },
      { company: "702 Talk Radio", role: "Junior Journalist/Intern", dates: "May 2003 – Jul 2003" },
    ],
  },
];
