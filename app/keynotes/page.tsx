/**
 * Keynotes Listing Page — /keynotes
 *
 * Lists all available keynote topics. Each links to /keynotes/{slug}.
 * Every keynote card links back to /speaker per internal linking strategy.
 *
 * Content is fetched from Sanity at build time. Falls back to hardcoded
 * defaults if Sanity data is not yet published.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import {
  keynotesListQuery,
  type KeynoteListItem,
} from "@/lib/sanity/queries";
import { CTAButton } from "@/components/cta-button";
import { Section } from "@/components/section";

/* ---------- Data fetching ---------- */

async function getKeynotes(): Promise<KeynoteListItem[] | null> {
  try {
    const data = await client.fetch<KeynoteListItem[]>(keynotesListQuery);
    return data && data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

/* ---------- Metadata ---------- */

export const metadata: Metadata = {
  title: "Keynote Topics",
  description:
    "Explore Nic Haralambous's virtual keynote topics: curiosity, innovation, AI, entrepreneurship, focus, and building breakthrough teams.",
  alternates: { canonical: "https://nicharalambous.com/keynotes" },
};

/* ---------- Page ---------- */

export default async function KeynotesPage() {
  const cmsKeynotes = await getKeynotes();
  const keynotes = cmsKeynotes || FALLBACK_KEYNOTES;

  return (
    <>
      <Section width="content" className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-brand-900 sm:text-5xl">
          Virtual Keynote Topics
        </h1>
        <p className="mt-4 text-lg text-brand-600">
          Each keynote is grounded in 20+ years of real entrepreneurial
          experience and tailored to your audience.{" "}
          <Link href="/speaker" className="text-accent-600 hover:underline">
            Learn more about booking Nic &rarr;
          </Link>
        </p>
      </Section>

      <Section width="wide">
        <div className="grid gap-8 lg:grid-cols-1">
          {keynotes.map((keynote) => (
            <Link
              key={keynote.slug}
              href={`/keynotes/${keynote.slug}`}
              className="group flex flex-col gap-6 rounded-xl border border-brand-200 p-8 transition-all hover:border-accent-400 hover:shadow-md"
            >
              <div>
                <h2 className="text-2xl font-bold text-brand-900 group-hover:text-accent-600">
                  {keynote.title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-brand-600">
                  {keynote.tagline}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {keynote.topics?.map((topic) => {
                    const label =
                      typeof topic === "string" ? topic : topic.title;
                    const key =
                      typeof topic === "string" ? topic : topic._id;
                    return (
                      <span
                        key={key}
                        className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700"
                      >
                        {label}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2 border-t border-brand-200 pt-6 text-sm text-brand-500">
                <p>
                  <span className="font-medium text-brand-700">Format:</span>{" "}
                  {keynote.deliveryFormat === "virtual"
                    ? "Virtual"
                    : keynote.deliveryFormat === "hybrid"
                      ? "Hybrid"
                      : keynote.deliveryFormat === "in-person"
                        ? "In-Person"
                        : "Virtual"}
                </p>
                <p>
                  <span className="font-medium text-brand-700">Duration:</span>{" "}
                  {keynote.duration || "45-60 minutes"}
                </p>
                <p>
                  <span className="font-medium text-brand-700">Best for:</span>{" "}
                  {keynote.audiences?.join(", ") || "All audiences"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* CTA to speaker page — reinforces internal linking to /speaker */}
      <Section width="content" className="text-center">
        <h2 className="text-2xl font-bold text-brand-900 sm:text-3xl">
          Want Nic at Your Event?
        </h2>
        <p className="mt-4 text-lg text-brand-600">
          Every keynote is customized for your audience. Virtual delivery
          worldwide.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <CTAButton href="/contact">Book a Keynote</CTAButton>
          <CTAButton href="/speaker" variant="secondary">
            About Nic as a Speaker
          </CTAButton>
        </div>
      </Section>
    </>
  );
}

/* ---------- Fallback data (used when Sanity has no content) ---------- */

const FALLBACK_KEYNOTES: KeynoteListItem[] = [
  {
    _id: "fallback-1",
    title: "Reclaiming Focus in a World That Profits From Your Distraction",
    slug: "reclaiming-focus",
    tagline:
      "Learn the DIAL framework for attention management, defeat digital addiction, and reclaim your team's deep work capacity.",
    deliveryFormat: "virtual",
    duration: "45-60 minutes",
    audiences: [
      "Corporate teams",
      "Leadership groups",
      "Remote/hybrid teams",
    ],
    topics: [
      { _id: "t1", title: "Focus", slug: "focus" },
      { _id: "t2", title: "Agency", slug: "agency" },
    ],
    order: 1,
    seo: null,
  },
  {
    _id: "fallback-2",
    title: "How to Build Breakthrough Product Teams",
    slug: "breakthrough-product-teams",
    tagline:
      "The Innovation Flywheel: combining curiosity, experimentation, and high agency to build teams that ship what matters.",
    deliveryFormat: "virtual",
    duration: "45-60 minutes",
    audiences: [
      "Product teams",
      "Engineering leaders",
      "Innovation departments",
    ],
    topics: [
      { _id: "t3", title: "Innovation", slug: "innovation" },
      { _id: "t4", title: "AI", slug: "ai" },
      { _id: "t5", title: "Curiosity", slug: "curiosity" },
    ],
    order: 2,
    seo: null,
  },
  {
    _id: "fallback-3",
    title: "The Curiosity Catalyst",
    slug: "curiosity-catalyst",
    tagline:
      "Why curiosity is the god particle of innovation — and how to diagnose and cure stagnation in your organisation.",
    deliveryFormat: "virtual",
    duration: "45-60 minutes",
    audiences: [
      "Conferences",
      "C-suite retreats",
      "Innovation teams",
    ],
    topics: [
      { _id: "t5", title: "Curiosity", slug: "curiosity" },
      { _id: "t3", title: "Innovation", slug: "innovation" },
    ],
    order: 3,
    seo: null,
  },
];
