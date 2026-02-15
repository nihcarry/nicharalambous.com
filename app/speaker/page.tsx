/**
 * Speaker Page — /speaker
 *
 * THE money page. Primary target: "virtual keynote speaker" keyword.
 * This page must be the most internally-linked page on the site.
 *
 * Content is fetched from the Sanity "speaker" singleton at build time.
 * Falls back to hardcoded defaults if Sanity data is not yet published.
 *
 * Sections per SEO strategy:
 * 1. Hero with H1 containing "virtual keynote speaker"
 * 2. Why book Nic (differentiators)
 * 3. Keynote topics (links to individual keynote pages)
 * 4. How virtual delivery works
 * 5. Client logos / "As seen at"
 * 6. Testimonials (attributed)
 * 7. FAQ (structured for AI readability and featured snippets)
 * 8. Booking CTA → /contact
 *
 * JSON-LD: Person + Service + FAQPage
 */
import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import {
  speakerPageQuery,
  keynotesListQuery,
  type SpeakerPageData,
  type KeynoteListItem,
} from "@/lib/sanity/queries";
import { CTAButton } from "@/components/cta-button";
import { Section } from "@/components/section";
import { JsonLd } from "@/components/json-ld";
import { PortableText } from "@/components/portable-text";
import {
  serviceJsonLd,
  faqJsonLd,
  personJsonLd,
} from "@/lib/metadata";

/* ---------- Default / fallback data ---------- */

const DEFAULT_HEADLINE = "Virtual keynote speaker for curious, modern teams";
const DEFAULT_SUBHEADLINE =
  "Nic Haralambous is an entrepreneur, AI product builder, and virtual keynote speaker with 4 startup exits, 3 books, and 20+ years building technology businesses. He helps distributed teams build cultures of experimentation and growth.";

const DEFAULT_FAQS = [
  {
    question: "What topics does Nic speak about?",
    answer:
      "Nic delivers virtual keynotes on curiosity and innovation, AI and product building, entrepreneurship and resilience, focus and agency, and building breakthrough teams. Each keynote draws from 20+ years of real entrepreneurial experience.",
  },
  {
    question: "How does a virtual keynote work?",
    answer:
      "Nic delivers high-energy keynotes via Zoom, Teams, or any video platform your team uses. Sessions are typically 45-60 minutes with optional Q&A. He uses professional studio equipment for broadcast-quality audio and video, with interactive elements to keep remote audiences engaged.",
  },
  {
    question: "What makes Nic different from other keynote speakers?",
    answer:
      "Nic doesn't just theorize — he builds. With 4 startup exits, 3 published books, and active AI product work, his keynotes are grounded in real experience. He brings proprietary frameworks like the DIAL method for focus, the Innovation Flywheel, and the Do/Fail/Learn/Repeat cycle.",
  },
  {
    question: "Can keynotes be customized for our team or event?",
    answer:
      "Yes. Every keynote is tailored to your audience, industry, and objectives. Nic works with event organizers beforehand to understand the audience and adapt stories, frameworks, and takeaways accordingly.",
  },
  {
    question: "What is Nic's speaking experience?",
    answer:
      "Nic has spoken at events worldwide including SXSW, corporate events for Standard Bank, Vodacom, and many others. He has 20+ years of experience as an entrepreneur and has been featured on BBC, Fast Company, and CNBC Africa.",
  },
];

const DEFAULT_AS_SEEN_AT = [
  "SXSW",
  "Standard Bank",
  "Vodacom",
  "BBC",
  "Fast Company",
  "CNBC Africa",
];

const DEFAULT_WHY_BOOK = [
  {
    title: "Builds, Doesn't Just Theorize",
    description:
      "4 startup exits and active AI product work. Nic speaks from lived experience, not textbooks.",
  },
  {
    title: "Proprietary Frameworks",
    description:
      "The DIAL method for focus, the Innovation Flywheel, the Do/Fail/Learn/Repeat cycle — actionable tools your team can use Monday morning.",
  },
  {
    title: "Virtual-Native Delivery",
    description:
      "Professional studio setup, broadcast-quality audio/video, and interactive elements designed for remote audiences.",
  },
  {
    title: "20+ Years of Stories",
    description:
      "From launching South Africa's first commercial blog to AI product building — real stories that resonate.",
  },
  {
    title: "Tailored to Your Audience",
    description:
      "Every keynote is customized. Nic works with organizers to adapt frameworks, stories, and takeaways to your team.",
  },
  {
    title: "Global Reach, Zero Travel",
    description:
      "Virtual delivery means no flights, no scheduling conflicts, and worldwide availability for your event.",
  },
];

const DEFAULT_VIRTUAL_STEPS = [
  {
    step: "1",
    title: "Discovery Call",
    description:
      "We discuss your event, audience, and objectives. Nic tailors the keynote to your specific needs.",
  },
  {
    step: "2",
    title: "Content Customization",
    description:
      "Nic adapts frameworks, stories, and takeaways for your industry and team challenges.",
  },
  {
    step: "3",
    title: "Live Virtual Delivery",
    description:
      "45-60 minute keynote via Zoom, Teams, or your preferred platform. Professional studio quality with interactive elements.",
  },
  {
    step: "4",
    title: "Post-Event Resources",
    description:
      "Attendees receive key frameworks and takeaways they can apply immediately.",
  },
];

const DEFAULT_TESTIMONIALS = [
  {
    quote:
      "Nic's keynote on curiosity was the highlight of our conference. Our team is still referencing his frameworks months later.",
    name: "Placeholder Name",
    title: "Head of Innovation",
    company: "Company Name",
  },
  {
    quote:
      "The virtual delivery was flawless. Nic kept 500+ remote attendees fully engaged for the entire session.",
    name: "Placeholder Name",
    title: "Events Director",
    company: "Company Name",
  },
  {
    quote:
      "Real stories from real experience. No fluff, no generic advice — just frameworks we could use immediately.",
    name: "Placeholder Name",
    title: "CEO",
    company: "Company Name",
  },
];

/* ---------- Data fetching ---------- */

async function getSpeakerData() {
  try {
    const data = await client.fetch<SpeakerPageData | null>(speakerPageQuery);
    return data;
  } catch {
    return null;
  }
}

async function getKeynotes() {
  try {
    const data = await client.fetch<KeynoteListItem[]>(keynotesListQuery);
    return data && data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

/* ---------- Metadata ---------- */

export const metadata: Metadata = {
  title: "Virtual Keynote Speaker",
  description:
    "Book Nic Haralambous as your virtual keynote speaker. 4 startup exits, 3 books, 20+ years building tech businesses. Keynotes on curiosity, innovation, AI, and entrepreneurship.",
  alternates: { canonical: "https://nicharalambous.com/speaker" },
  openGraph: {
    title: "Virtual Keynote Speaker | Nic Haralambous",
    description:
      "Book Nic Haralambous as your virtual keynote speaker. 4 startup exits, 3 books, 20+ years building tech businesses.",
    url: "https://nicharalambous.com/speaker",
  },
};

/* ---------- Page ---------- */

export default async function SpeakerPage() {
  const [speakerData, keynotes] = await Promise.all([
    getSpeakerData(),
    getKeynotes(),
  ]);

  const headline = speakerData?.headline || DEFAULT_HEADLINE;
  const subheadline = speakerData?.subheadline || DEFAULT_SUBHEADLINE;
  const faqs = speakerData?.faq?.length ? speakerData.faq : DEFAULT_FAQS;
  const asSeenAt = speakerData?.asSeenAt?.length
    ? speakerData.asSeenAt
    : DEFAULT_AS_SEEN_AT;
  const ctaText = speakerData?.ctaText || "Book Nic for Your Next Virtual Event";
  const cmsTestimonials = speakerData?.testimonials;

  return (
    <>
      {/* Structured data */}
      <JsonLd data={personJsonLd()} />
      <JsonLd
        data={serviceJsonLd({
          name: "Virtual Keynote Speaking by Nic Haralambous",
          description:
            "Book Nic Haralambous as your virtual keynote speaker. Keynotes on curiosity, innovation, AI, entrepreneurship, and building breakthrough teams.",
          url: "https://nicharalambous.com/speaker",
        })}
      />
      <JsonLd data={faqJsonLd(faqs)} />

      {/* Hero — H1 must include "virtual keynote speaker" per SEO strategy */}
      <Section width="content" className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-brand-900 sm:text-5xl md:text-6xl">
          {headline}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-brand-600">
          {subheadline}
        </p>
        <div className="mt-8">
          <CTAButton href="/contact">{ctaText}</CTAButton>
        </div>
      </Section>

      {/* Why Book Nic */}
      <Section width="wide" className="bg-brand-50">
        <h2 className="text-center text-2xl font-bold text-brand-900 sm:text-3xl">
          Why Book Nic
        </h2>
        {speakerData?.whyBookNic ? (
          <PortableText
            value={speakerData.whyBookNic}
            className="mt-8 prose-lg"
          />
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {DEFAULT_WHY_BOOK.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-brand-200 bg-surface p-6"
              >
                <h3 className="text-lg font-semibold text-brand-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Keynote Topics — CMS-driven if available */}
      <Section width="wide">
        <h2 className="text-center text-2xl font-bold text-brand-900 sm:text-3xl">
          Keynote Topics
        </h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {(keynotes || FALLBACK_KEYNOTES).map((keynote) => (
            <Link
              key={keynote.slug}
              href={`/keynotes/${keynote.slug}`}
              className="group flex flex-col rounded-xl border border-brand-200 p-6 transition-all hover:border-accent-400 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-brand-900 group-hover:text-accent-600">
                {keynote.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-600">
                {keynote.tagline}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {"topics" in keynote &&
                  Array.isArray(keynote.topics) &&
                  keynote.topics.map((topic) => {
                    const label =
                      typeof topic === "string" ? topic : topic.title;
                    return (
                      <span
                        key={label}
                        className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700"
                      >
                        {label}
                      </span>
                    );
                  })}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <CTAButton href="/keynotes" variant="secondary">
            View All Keynotes
          </CTAButton>
        </div>
      </Section>

      {/* How Virtual Delivery Works */}
      <Section width="content" className="bg-brand-50">
        <h2 className="text-center text-2xl font-bold text-brand-900 sm:text-3xl">
          How Virtual Delivery Works
        </h2>
        {speakerData?.howVirtualWorks ? (
          <PortableText
            value={speakerData.howVirtualWorks}
            className="mt-8"
          />
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {DEFAULT_VIRTUAL_STEPS.map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-600 text-sm font-bold text-white">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-brand-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-brand-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* As Seen At / Social Proof */}
      <Section width="wide">
        <h2 className="text-center text-2xl font-bold text-brand-900 sm:text-3xl">
          As Seen At
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-brand-400">
          {asSeenAt.map((name) => (
            <span
              key={name}
              className="text-lg font-semibold tracking-wide"
            >
              {name}
            </span>
          ))}
        </div>
      </Section>

      {/* Testimonials — CMS-driven if available */}
      <Section width="wide" className="bg-brand-50">
        <h2 className="text-center text-2xl font-bold text-brand-900 sm:text-3xl">
          What Clients Say
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cmsTestimonials && cmsTestimonials.length > 0
            ? cmsTestimonials.map((t) => (
                <blockquote
                  key={t._id}
                  className="flex flex-col rounded-xl border border-brand-200 bg-surface p-6"
                >
                  <p className="flex-1 text-sm italic leading-relaxed text-brand-700">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <footer className="mt-4 border-t border-brand-100 pt-4">
                    <p className="text-sm font-semibold text-brand-900">
                      {t.authorName}
                    </p>
                    <p className="text-xs text-brand-500">
                      {t.authorTitle}
                      {t.company && `, ${t.company}`}
                    </p>
                  </footer>
                </blockquote>
              ))
            : DEFAULT_TESTIMONIALS.map((testimonial, i) => (
                <blockquote
                  key={i}
                  className="flex flex-col rounded-xl border border-brand-200 bg-surface p-6"
                >
                  <p className="flex-1 text-sm italic leading-relaxed text-brand-700">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <footer className="mt-4 border-t border-brand-100 pt-4">
                    <p className="text-sm font-semibold text-brand-900">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-brand-500">
                      {testimonial.title}, {testimonial.company}
                    </p>
                  </footer>
                </blockquote>
              ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section width="content">
        <h2 className="text-center text-2xl font-bold text-brand-900 sm:text-3xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-12 space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-brand-200 pb-6">
              <h3 className="text-lg font-semibold text-brand-900">
                {faq.question}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-600">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <Section
        width="content"
        className="bg-accent-600 text-center text-white rounded-none"
      >
        <h2 className="text-2xl font-bold sm:text-3xl">
          Ready to Inspire Your Team?
        </h2>
        <p className="mt-4 text-lg text-accent-100">
          Book Nic for your next conference, corporate event, team offsite, or
          webinar. Virtual delivery worldwide.
        </p>
        <div className="mt-8">
          <CTAButton
            href="/contact"
            className="bg-white !text-accent-600 hover:bg-accent-100"
          >
            Book Nic for Your Event
          </CTAButton>
        </div>
      </Section>
    </>
  );
}

/* ---------- Fallback keynote data (used when Sanity has no content) ---------- */

const FALLBACK_KEYNOTES = [
  {
    title: "Reclaiming Focus in a World That Profits From Your Distraction",
    slug: "reclaiming-focus",
    tagline: "The DIAL framework for attention management and deep work",
    topics: ["Focus", "Agency", "Productivity"],
  },
  {
    title: "How to Build Breakthrough Product Teams",
    slug: "breakthrough-product-teams",
    tagline:
      "The Innovation Flywheel: curiosity, experimentation, and high agency",
    topics: ["Innovation", "Teams", "AI"],
  },
  {
    title: "The Curiosity Catalyst",
    slug: "curiosity-catalyst",
    tagline: "Why curiosity is the god particle of innovation",
    topics: ["Curiosity", "Innovation", "Culture"],
  },
];
