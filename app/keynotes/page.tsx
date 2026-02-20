/**
 * Keynotes Listing Page — /keynotes
 *
 * Slide deck layout matching homepage/speaker. Each keynote topic is a
 * full-viewport slide; hero matches the "Virtual Keynote Topics" style.
 *
 * Keynote slides use curated copy for maximum impact.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { CTAButton } from "@/components/cta-button";
import { Slide } from "@/components/slide";
import { SlideDeck } from "@/components/slide-deck";
import { SlideContent } from "@/components/slide-animations";
import { FooterContent } from "@/components/footer-content";
import { NextSlideIndicator } from "@/components/next-slide-indicator";

/* ---------- Types ---------- */

interface KeynoteSlide {
  slug: string;
  title: string;
  tagline: string;
  description: string | string[];
  keyTakeaways: string[];
  keyTakeawaysLabel?: string; // default "Key Takeaways"
  closingLine?: string;
  deliveryFormat: "virtual" | "hybrid" | "in-person";
  duration: string;
  audiences: string[];
}

/* ---------- Metadata ---------- */

export const metadata: Metadata = {
  title: "Keynote Topics",
  description:
    "Explore Nic Haralambous's virtual keynote topics: curiosity, innovation, AI, entrepreneurship, focus, and building breakthrough teams.",
  alternates: { canonical: "https://nicharalambous.com/keynotes" },
};

/* ---------- Helpers ---------- */

function formatLabel(keynote: KeynoteSlide): string {
  if (keynote.deliveryFormat === "virtual") return "Virtual";
  if (keynote.deliveryFormat === "hybrid") return "Hybrid";
  if (keynote.deliveryFormat === "in-person") return "In-Person";
  return "Virtual";
}

/* ---------- Page ---------- */

export default function KeynotesPage() {
  const keynotes = KEYNOTE_SLIDES;

  return (
    <SlideDeck>
      <NextSlideIndicator />

      {/* Slide 1: Hero — Keynote Topics, audience image at bottom behind next-slide button */}
      <Slide
        variant="grid-3"
        background="bg-spotlight-pattern"
        id="hero"
        image={
          <div className="absolute inset-x-0 bottom-0 hidden h-[45vh] overflow-hidden md:block">
            {/* Audience — centered at bottom */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/slides/16bit_Audience.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain object-bottom"
            />
            {/* Left pillar — absolutely positioned, overlaps audience edge */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/slides/16Bit_Pillar_Keynote.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-[8%] z-[2] h-full w-auto select-none object-contain object-bottom md:left-[12%]"
            />
            {/* Right pillar — absolutely positioned, overlaps audience edge */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/slides/16Bit_Pillar_Keynote.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 right-[8%] z-[2] h-full w-auto select-none object-contain object-bottom md:right-[12%]"
            />
          </div>
        }
      >
        <SlideContent>
          <h1 className="heading-stroke font-bebas text-center text-4xl uppercase text-accent-600 sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl">
            Keynote Topics
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-center text-lg font-medium leading-relaxed text-brand-700 md:text-xl">
            Each keynote is grounded in 20+ years of real entrepreneurial
            experience and tailored to your audience.{" "}
            <Link href="/speaker" className="text-accent-600 hover:underline">
              Learn more about booking Nic &rarr;
            </Link>
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/slides/16Bit_Nic_Keynotes.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none mx-auto mt-6 mb-[10px] hidden h-[min(200px,25vh)] w-auto select-none object-contain md:block"
          />
        </SlideContent>
      </Slide>

      {/* Slides 2..N: One slide per keynote */}
      {keynotes.map((keynote, i) => (
        <Slide
          key={keynote.slug}
          variant="grid-3"
          background="bg-spotlight-pattern"
          id={keynote.slug}
        >
          <SlideContent>
            <Link
              href={`/keynotes/${keynote.slug}`}
              className="group flex w-full flex-col"
            >
              {/* Header: number + title + tagline */}
              <div className="mb-10 md:mb-14">
              <span className="font-bebas text-sm tracking-[0.3em] text-brand-400 md:text-base">
                {String(i + 1).padStart(2, "0")} / {String(keynotes.length).padStart(2, "0")}
              </span>
              <h2 className="heading-stroke font-bebas mt-2 text-5xl uppercase leading-[0.9] text-brand-900 sm:text-6xl md:text-7xl lg:text-8xl 2xl:text-9xl">
                {keynote.title}
              </h2>
              <div className="mt-4 h-1 w-20 bg-accent-600" />
              <p className="mt-4 max-w-2xl text-xl font-semibold leading-snug text-accent-600 md:text-2xl lg:text-3xl">
                {keynote.tagline}
              </p>
            </div>

            {/* Body: description + takeaways side by side */}
            <div className="grid gap-8 md:grid-cols-5 md:gap-12 lg:gap-16">
              <div className="space-y-4 text-base leading-relaxed text-brand-600 md:col-span-3 md:text-lg">
                {Array.isArray(keynote.description)
                  ? keynote.description.map((para, j) => (
                      <p key={j}>{para}</p>
                    ))
                  : <p>{keynote.description}</p>}
              </div>
              <div className="md:col-span-2">
                <h3 className="font-bebas text-lg uppercase tracking-wider text-brand-900 md:text-xl">
                  {keynote.keyTakeawaysLabel ?? "Key Takeaways"}
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-brand-700 md:text-base">
                  {keynote.keyTakeaways.map((item, j) => (
                    <li key={j} className="flex gap-3">
                      <span className="mt-[7px] block h-2 w-2 shrink-0 bg-accent-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {keynote.closingLine && (
                  <p className="mt-6 border-l-2 border-accent-600 pl-4 text-sm italic text-brand-600 md:text-base">
                    {keynote.closingLine}
                  </p>
                )}
              </div>
            </div>

            {/* Footer: metadata strip + CTA */}
            <div className="mt-10 flex flex-col gap-4 border-t border-brand-200 pt-6 sm:flex-row sm:items-center sm:justify-between md:mt-14">
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-brand-500">
                <span>
                  <span className="font-medium text-brand-700">Format:</span>{" "}
                  {formatLabel(keynote)}
                </span>
                <span>
                  <span className="font-medium text-brand-700">Duration:</span>{" "}
                  {keynote.duration}
                </span>
                <span>
                  <span className="font-medium text-brand-700">Best for:</span>{" "}
                  {keynote.audiences.join(", ")}
                </span>
              </div>
              <span className="inline-flex items-center gap-2 font-semibold text-accent-600 transition-transform group-hover:translate-x-1 group-hover:text-accent-500">
                View keynote details
                <span aria-hidden className="text-lg">→</span>
              </span>
            </div>
          </Link>
          </SlideContent>
        </Slide>
      ))}

      {/* Final CTA slide */}
      <Slide
        variant="cta"
        background="bg-cta-pattern"
        className="text-center"
        id="cta"
      >
        <SlideContent>
          <h2 className="heading-stroke font-bebas text-4xl uppercase text-brand-900 sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl">
            Want Nic at Your Event?
          </h2>
          <p className="mt-4 text-lg text-brand-700">
            Every keynote is customized for your audience. Virtual delivery worldwide.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <CTAButton
              href="/contact"
              className="!rounded-none font-bebas text-xl uppercase"
            >
              Book a Keynote
            </CTAButton>
            <CTAButton
              href="/speaker"
              variant="secondary"
              className="!rounded-none font-bebas text-xl uppercase"
            >
              About Nic as a Speaker
            </CTAButton>
          </div>
        </SlideContent>
      </Slide>

      {/* Footer */}
      <Slide variant="footer" background="bg-foot-pattern" id="footer">
        <FooterContent />
      </Slide>
    </SlideDeck>
  );
}

/* ---------- Keynote slides content ---------- */

const KEYNOTE_SLIDES: KeynoteSlide[] = [
  {
    slug: "connected-not-consumed",
    title: "Connected, Not Consumed",
    tagline: "Balancing Digital Life and Mental Health at Work",
    description:
      "Modern work rewards constant availability, fast replies, and full calendars while quietly destroying focus, decision quality, and health. Most teams aren't failing from lack of effort. They're drowning in reaction. This talk helps leaders and teams regain control of their attention without disconnecting from their work or the internet.",
    keyTakeaways: [
      "A clear way to decide what actually matters each day",
      "A practical system to protect focus inside noisy organisations",
      "A shared language for agency, ownership, and meaningful work",
      "The DIAL framework: Decide, Intend, Act, Loop back",
    ],
    deliveryFormat: "virtual",
    duration: "45-60 minutes",
    audiences: ["Corporate teams", "Leadership groups", "Remote/hybrid teams"],
  },
  {
    slug: "innovation-starts-at-home",
    title: "Innovation Starts at Home",
    tagline: "How to build teams that produce breakthroughs",
    description:
      "Most organisations want innovation but run systems built for caution: approvals, meetings, process drag, and fear of failure. This talk shows leaders how to build entrepreneurial teams that learn fast, act with agency, and turn failure into progress especially in the AI era.",
    keyTakeaways: [
      "Reduce 'progress tax': meetings, process, work-around-work",
      "Build agency and initiative without chaos",
      "Create psychological safety with high standards",
      "The innovation flywheel: Curiosity, Action, Information, Loop",
    ],
    deliveryFormat: "virtual",
    duration: "45-60 minutes",
    audiences: [
      "Product teams",
      "Engineering leaders",
      "Innovation departments",
    ],
  },
  {
    slug: "creating-a-curious-company",
    title: "Creating a Curious Company",
    tagline: "Why innovation stalls and how curiosity restarts it",
    description: [
      "Most organisations don't have an innovation problem.",
      "They have a curiosity problem.",
      "In this keynote, Nic challenges the myths of \"innovation theatre\" and reactive change, and shows why real progress doesn't come from hackathons, buzzwords, or panic-driven ideas but from deliberately designing curiosity into how teams think, work, and experiment.",
      "Through powerful stories, research-backed insights, and live audience interaction, this talk helps leaders and teams break out of stagnation by replacing fear, efficiency obsession, and short-term thinking with curiosity, experimentation, and long-term perspective.",
    ],
    keyTakeaways: [
      "A clear understanding of why innovation stalls inside successful companies",
      "Practical ways to turn curiosity into a daily leadership and team practice",
      "Tools to move beyond \"innovation theatre\" into real, meaningful progress",
      "A simple framework to help teams experiment, learn, and adapt without fear",
    ],
    keyTakeawaysLabel: "Audiences leave with:",
    closingLine:
      "Designed for remote teams. Highly interactive. Built to spark action, not just ideas.",
    deliveryFormat: "virtual",
    duration: "45-60 minutes",
    audiences: [
      "Conferences",
      "C-suite retreats",
      "Innovation teams",
    ],
  },
];
