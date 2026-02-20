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
import { Slide } from "@/components/slide";
import { SlideDeck } from "@/components/slide-deck";
import { FooterContent } from "@/components/footer-content";
import { SlideContent } from "@/components/slide-animations";
import { WhatClientsSay } from "@/components/what-clients-say";
import { IncredibleClients } from "@/components/incredible-clients";
import { NextSlideIndicator } from "@/components/next-slide-indicator";
import { FinalCta } from "@/components/final-cta";
import { JsonLd } from "@/components/json-ld";
import { PortableText } from "@/components/portable-text";
import { FaqSection } from "@/components/faq-section";
import {
  serviceJsonLd,
  faqJsonLd,
  personJsonLd,
} from "@/lib/metadata";

/* ---------- Default / fallback data ---------- */

const DEFAULT_HEADLINE = "Unforgettable Keynote Speaker";
const DEFAULT_SUBHEADLINE =
  "High‑energy, impactful keynotes designed for remote teams, not repurposed for them.";

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

  /* Hero copy: always use this copy; do not override from CMS */
  const headline = DEFAULT_HEADLINE;
  const subheadline = DEFAULT_SUBHEADLINE;
  const faqs = speakerData?.faq?.length ? speakerData.faq : DEFAULT_FAQS;
  const asSeenAt = speakerData?.asSeenAt?.length
    ? speakerData.asSeenAt
    : DEFAULT_AS_SEEN_AT;
  const ctaText = speakerData?.ctaText || "Book Nic for Your Next Virtual Event";

  return (
    <SlideDeck>
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

      <NextSlideIndicator />

      {/* Slide 1: Hero — H1 must include "virtual keynote speaker" per SEO strategy. Full-width slide so headline can use wide container and wrap to 2 lines only. */}
      <Slide
        id="hero"
        variant="full"
        background="bg-speaker-pattern"
        className="text-center"
      >
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <h1 className="heading-stroke font-bebas mx-auto max-w-6xl text-center text-5xl uppercase leading-[0.95] text-brand-900 sm:text-7xl md:text-7xl lg:text-8xl 2xl:text-9xl">
            {(() => {
              const words = headline.split(" ");
              if (words.length >= 2) {
                return (
                  <>
                    <span className="block text-accent-600">
                      {words.slice(0, 1).join(" ")}
                    </span>
                    <span className="block">{words.slice(1).join(" ")}</span>
                  </>
                );
              }
              return headline;
            })()}
          </h1>
          <p className="mt-6 text-xl font-semibold leading-relaxed text-brand-700 sm:text-2xl">
            {subheadline}
          </p>
          <div className="mt-8 aspect-video w-full max-w-2xl mx-auto">
            <iframe
              src="https://www.youtube.com/embed/yxg_qMH-s-Y"
              title="Virtual keynote speaker video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full rounded border-0"
            />
          </div>
          <div className="mt-8">
            <CTAButton href="/contact">{ctaText}</CTAButton>
          </div>
        </div>
      </Slide>

      {/* Slide 2: Why Book Nic — video floats right, copy wraps around it */}
      <Slide
        id="why-book"
        variant="grid-3"
        background="bg-speaker-pattern"
      >
        <Section width="wide">
        <h2 className="heading-stroke font-bebas text-center text-4xl uppercase text-brand-900 sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl">
          Why My Virtual Audiences Stay Engaged
        </h2>
        <p className="mt-4 text-center text-lg font-medium leading-relaxed text-brand-700">
          Remote teams can be distracted, over&#x2011;scheduled, and exhausted by back&#x2011;to&#x2011;back calls. Attention is fragile. Energy leaks fast and keynotes are often not a team priority. So I design talks that earn attention, not assume it.
        </p>
        <div className="mt-8">
          <div className="float-right ml-8 mb-6 flex min-h-[50vh] w-full max-w-md shrink-0 items-start md:min-h-[55vh] md:max-w-lg">
            <div className="aspect-video w-full overflow-hidden rounded border-4 border-accent-600 bg-brand-100">
              <iframe
                src="https://www.youtube.com/embed/XBFqWl2Rv1I"
                title="Why book Nic — virtual keynote speaker"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          </div>
          <div className="space-y-4 text-lg leading-relaxed text-brand-700">
            <p className="font-semibold text-brand-900">
              What makes these keynotes different:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong>Built for the medium</strong> — every talk is designed for live delivery on Zoom, Teams, or Meet</li>
              <li><strong>Audience participation</strong> — not just a Q&amp;A at the end</li>
              <li><strong>Fast&#x2011;paced, visual, and interactive</strong> — people don&apos;t just watch, they take part</li>
              <li><strong>Designed for distributed teams</strong> — remote, hybrid, and global by default</li>
            </ul>
            <p>
              The result? People stay present. Ideas land. And teams are still talking about it long after the call ends.
            </p>
          </div>
          <div className="clear-both" />
        </div>
        </Section>
      </Slide>

      {/* Slide 3: Keynote Topics — CMS-driven if available */}
      <Slide
        id="keynotes"
        variant="grid-3"
        background="bg-speaker-pattern"
      >
        <Section width="wide">
        <h2 className="heading-stroke font-bebas text-center text-4xl uppercase text-accent-600 sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl">
          What I speak about
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-center text-[22px] font-semibold leading-relaxed text-brand-700">
          My keynotes focus on the challenges modern teams are actually facing, and give them practical ways forward.
        </p>
        <div className="mt-8 grid gap-8 text-left text-lg leading-relaxed text-brand-700 md:grid-cols-3">
          <div>
            <h3 className="mb-2 font-semibold text-brand-900">Activating human agency at work</h3>
            <p>
              AI tools are only as good as the human using them (for now). I help people and teams move from passive compliance to ownership, initiative, and meaningful contribution, even inside large, complex organisations. The future belongs to teams who take action and don&apos;t wait for permission.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-brand-900">Staying connected without becoming consumed</h3>
            <p className="mb-4">
              After experiencing my own corporate burnout, I deeply understand how leaders quietly burn out while nobody notices. I help teams protect focus, energy, and mental health while working digitally, without disconnecting from what matters.
            </p>
            <p>
              These aren&apos;t abstract ideas. They&apos;re delivered through stories, research, case studies, and shared moments that translate powerfully in virtual rooms.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-brand-900">Curiosity, Action and Failure</h3>
            <p className="mb-4">
              Most organisations want innovation but run systems built for caution: approvals, meetings, process drag, and fear of failure.
            </p>
            <p className="mb-4">
              In that environment, even talented people become passive.
            </p>
            <p>
              I help organisations learn how to build entrepreneurial teams: teams that learn fast, act with agency, and turn failure into progress, especially in the AI era.
            </p>
          </div>
        </div>
        <div className="mt-8 aspect-video mx-auto w-full max-w-2xl">
          <iframe
            src="https://www.youtube.com/embed/Yv1k_db7uwc"
            title="Keynote topics — virtual keynote speaker"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full rounded border-0"
          />
        </div>
        <div className="mt-8 text-center">
          <CTAButton href="/keynotes" variant="secondary">
            View All Keynotes
          </CTAButton>
        </div>
        </Section>
      </Slide>

      {/* Slide 4: How Virtual Delivery Works */}
      <Slide
        id="how-virtual"
        variant="centered"
        background="bg-speaker-pattern"
      >
        <Section width="content">
        <h2 className="heading-stroke font-bebas text-center text-4xl uppercase text-brand-900 sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl">
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
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-accent-600 font-bebas text-lg text-white">
                  {item.step}
                </div>
                <div>
                  <h3 className="heading-display text-brand-900">
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
      </Slide>

      {/* Slide 5: Incredible Clients — same component as homepage */}
      <Slide
        id="incredible-clients"
        variant="logos"
        background="bg-speaker-pattern"
      >
        <SlideContent>
          <IncredibleClients names={asSeenAt} />
        </SlideContent>
      </Slide>

      {/* Slide 6: Testimonials — same component as homepage */}
      <Slide
        id="testimonials"
        variant="full"
        background="bg-speaker-pattern"
      >
        <SlideContent className="relative">
          <WhatClientsSay headingAlign="center" />
        </SlideContent>
      </Slide>

      {/* Slide 7: FAQ — accordion style */}
      <Slide
        id="faq"
        variant="centered"
        background="bg-speaker-pattern"
      >
        <Section width="content">
        <FaqSection
          faqs={faqs}
          heading="Frequently Asked Questions"
          headingClassName="heading-stroke font-bebas text-4xl uppercase text-brand-900 sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl"
          headingAlign="center"
          className="[&_dl]:mt-12"
        />
        </Section>
      </Slide>

      {/* Slide 8: Final CTA */}
      <Slide
        id="cta"
        variant="cta"
        background="bg-cta-pattern"
      >
        <FinalCta
          heading="Ready to Inspire Your Team?"
          description="Book Nic for your next conference, corporate event, team offsite, or webinar. Virtual delivery worldwide."
          primaryHref="/contact"
          primaryLabel="Book Nic for Your Event"
          headingClassName="heading-stroke font-bebas text-center text-4xl uppercase text-accent-600 sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl"
        />
      </Slide>

      {/* Slide 9: Footer — inside SlideDeck so it scrolls with content */}
      <Slide variant="footer" background="bg-foot-pattern" id="footer">
        <FooterContent />
      </Slide>
    </SlideDeck>
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
