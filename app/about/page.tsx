/**
 * About — /about
 * Existing biography, career and current builds, in the v3 layout.
 */
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { personJsonLd } from "@/lib/metadata";
import { ClosingCta } from "@/components/site/closing-cta";
import { OUTPUT_PARADOX_PATH } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Nic Haralambous is a keynote speaker, entrepreneur, product builder and best-selling author. Four exits, three books and more than 20 years of building businesses.",
  alternates: { canonical: "https://www.nicharalambous.com/about" },
  openGraph: {
    type: "profile",
    title: "About Nic Haralambous",
    description:
      "Keynote speaker, entrepreneur, product builder and best-selling author. Four exits and three books.",
    url: "https://www.nicharalambous.com/about",
  },
};

export default function AboutPage() {
  return (
    <div className="v3 p-person">
      <JsonLd data={personJsonLd()} />
      <section>
        <div className="wrap about-hero">
          <div>
            <h1>I am Nic Haralambous</h1>
            <p className="lead">
              I am a keynote speaker, entrepreneur, product builder, and best-selling author. I have been building businesses since I was 16. I have had 4 exits, and I have spent more than 20 years learning lessons through failure and success.
            </p>
            <p className="meta" style={{ marginTop: 18 }}>
              {KEY_STATS.map((stat) => `${stat.value} ${stat.label}`).join(" · ")}
            </p>
          </div>
          <img
            src="/slides/Nic_Speaker_Photo.jpg"
            alt="Nic Haralambous"
            width={480}
            height={640}
            style={{ width: "min(100%, 320px)", height: "auto" }}
          />
        </div>
      </section>
      <section>
        <div className="wrap story" style={{ maxWidth: 820 }}>
          <p>
            I built my first website when I was 11 years old, my first business at 16, and a band that didn&apos;t go as far as I wanted.
          </p>
          <p>
            My career has taken me from student journalism to mobile product management at Vodacom, to co-founding and selling Motribe to Mxit, launching a sock brand with R5,000 that grew into five retail stores, and eventually to keynote stages around the world, including SXSW, Standard Bank, Vodacom, Old Mutual, and Nedbank.
          </p>
          <p>
            Through it all, I&apos;ve learned that above all else, culture creates change. My work today focuses on helping businesses build more curious, entrepreneurial cultures, whether through{" "}
            <a className="link" href={OUTPUT_PARADOX_PATH}>
              keynotes
            </a>
            , coaching, or building products.
          </p>
          <blockquote style={{ margin: "36px 0", paddingLeft: 18, borderLeft: "4px solid var(--blue)" }}>
            <p style={{ fontFamily: "var(--serif)", fontSize: 32, lineHeight: 1.15, color: "var(--text)" }}>
              &ldquo;Plan in decades. Think in years. Work in months. Live in days.&rdquo;
            </p>
            <p className="meta">Nic Haralambous</p>
          </blockquote>
        </div>
      </section>
      <section className="dark pd-person">
        <div className="wrap">
          <h2>Career</h2>
          <div className="career" style={{ marginTop: 28 }}>
            {CAREER_PILLARS.map((pillar) => (
              <article className="plain-card" key={pillar.title} style={{ background: "#12151c", borderColor: "#2e3442", color: "#edeef2" }}>
                <h3 style={{ color: "#fff" }}>{pillar.title}</h3>
                {pillar.items.map((item) => (
                  <p key={`${item.company}-${item.role}`} style={{ color: "#c9cdd6" }}>
                    <b style={{ color: "#fff" }}>{item.company}</b>
                    {item.outcome ? ` · ${item.outcome}` : ""}
                    <br />
                    {item.role}
                    {item.dates ? ` · ${item.dates}` : ""}
                  </p>
                ))}
              </article>
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="wrap">
          <h2>Businesses</h2>
          <p className="lead">What I&apos;m building now.</p>
          <div className="offer-grid" style={{ marginTop: 24 }}>
            {CURRENT_BUILDS_PREVIEW.map((business) => (
              <a className="plain-card" key={business.name} href={business.url} target="_blank" rel="noopener noreferrer">
                <h3>{business.name}</h3>
                <p>{business.summary}</p>
              </a>
            ))}
          </div>
          <p style={{ marginTop: 24 }}>
            <a className="link" href="/building">
              View all businesses
            </a>
          </p>
        </div>
      </section>
      <section>
        <div className="wrap">
          <h2>Books</h2>
          <div className="offer-grid" style={{ marginTop: 24, gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
            {BOOK_COVER_IMAGES.map((book) => (
              <img key={book.src} src={book.src} alt={book.alt} width={320} height={480} />
            ))}
          </div>
          <p style={{ marginTop: 24 }}>
            <a className="link" href="/books">
              View all books
            </a>
          </p>
        </div>
      </section>
      <ClosingCta
        className="pd-person"
        heading="Want Nic at your next event?"
        copy="Keynotes for conferences, corporate events, team offsites, and webinars, in person or virtually. Worldwide."
        primaryHref={OUTPUT_PARADOX_PATH}
        primaryLabel="See the keynote"
        secondaryHref="/contact"
        secondaryLabel="Book Nic"
      />
    </div>
  );
}

const KEY_STATS = [
  { value: "4", label: "Business Exits" },
  { value: "3", label: "Books Published" },
  { value: "20+", label: "Years Building" },
  { value: "16+", label: "Years Speaking" },
];

const BOOK_COVER_IMAGES = [
  { src: "/slides/Do_Fail_Learn_repeate.jpg", alt: "Do. Fail. Learn. Repeat. book cover" },
  { src: "/slides/How_to_start_a_side_Hustle.jpg", alt: "How to Start a Side Hustle book cover" },
  { src: "/slides/Business_Builders_Toolkit.jpg", alt: "The Business Builder's Toolkit book cover" },
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

const CAREER_PILLARS = [
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
