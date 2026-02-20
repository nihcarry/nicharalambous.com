/**
 * Individual Keynote Page — /keynotes/{slug}
 *
 * Dynamic page for each keynote. Content fetched from Sanity at build time.
 * Falls back to hardcoded defaults if Sanity data is not yet published.
 *
 * Per SEO strategy:
 * - H1: keynote title
 * - Title tag: "{Keynote Title} | Virtual Keynote by Nic Haralambous"
 * - Sections: tagline, description, outcomes, audiences, testimonials, CTA
 * - Every keynote page links to /speaker and related topic hub
 *
 * JSON-LD: Service + VideoObject (if video embed)
 *
 * Static params generated at build time — one page per keynote.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/lib/sanity/client";
import {
  keynoteBySlugQuery,
  keynoteSlugListQuery,
  type KeynoteData,
} from "@/lib/sanity/queries";
import { CTAButton } from "@/components/cta-button";
import { Section } from "@/components/section";
import { FinalCta } from "@/components/final-cta";
import { JsonLd } from "@/components/json-ld";
import { PortableText } from "@/components/portable-text";
import { serviceJsonLd } from "@/lib/metadata";
import { tilt } from "@/lib/tilt";

/* ---------- Data fetching ---------- */

async function getKeynote(slug: string): Promise<KeynoteData | null> {
  try {
    const data = await client.fetch<KeynoteData | null>(keynoteBySlugQuery, {
      slug,
    });
    return data;
  } catch {
    return null;
  }
}

async function getKeynotesSlugs(): Promise<{ slug: string }[]> {
  try {
    const data = await client.fetch<{ slug: string }[]>(keynoteSlugListQuery);
    return data && data.length > 0 ? data : FALLBACK_SLUGS;
  } catch {
    return FALLBACK_SLUGS;
  }
}

/* ---------- Static params ---------- */

export async function generateStaticParams() {
  const slugs = await getKeynotesSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

/* ---------- Metadata ---------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const keynote = (await getKeynote(slug)) || FALLBACK_KEYNOTES[slug];
  if (!keynote) return { title: "Keynote Not Found" };

  const title = `${keynote.title} | Virtual Keynote by Nic Haralambous`;
  const description = keynote.tagline;

  return {
    title,
    description,
    alternates: {
      canonical: `https://nicharalambous.com/keynotes/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://nicharalambous.com/keynotes/${slug}`,
    },
  };
}

/* ---------- Page ---------- */

export default async function KeynotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Try CMS first, fall back to hardcoded data
  const cmsKeynote = await getKeynote(slug);
  const fallback = FALLBACK_KEYNOTES[slug];
  const keynote = cmsKeynote || fallback;

  if (!keynote) {
    notFound();
  }

  const hasCmsDescription =
    cmsKeynote?.description && cmsKeynote.description.length > 0;

  return (
    <>
      {/* Structured data */}
      <JsonLd
        data={serviceJsonLd({
          name: `${keynote.title} — Virtual Keynote`,
          description: keynote.tagline,
          url: `https://nicharalambous.com/keynotes/${slug}`,
        })}
      />

      {/* Hero */}
      <Section width="content">
        <p className="heading-display text-accent-600">
          Virtual Keynote
        </p>
        <h1 className="mt-2 heading-display-stroke-sm text-4xl text-brand-900 sm:text-5xl md:text-6xl">
          {keynote.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-brand-600">
          {keynote.tagline}
        </p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-brand-500">
          <span>
            Format:{" "}
            {keynote.deliveryFormat === "virtual"
              ? "Virtual"
              : keynote.deliveryFormat === "hybrid"
                ? "Hybrid"
                : keynote.deliveryFormat === "in-person"
                  ? "In-Person"
                  : "Virtual"}
          </span>
          <span>Duration: {keynote.duration || "45-60 minutes"}</span>
        </div>
      </Section>

      {/* Description — Portable Text from CMS or fallback paragraphs */}
      <Section width="content" className="bg-brand-50">
        {hasCmsDescription ? (
          <PortableText value={cmsKeynote!.description} />
        ) : (
          fallback?.descriptionParagraphs?.map(
            (paragraph: string, i: number) => (
              <p
                key={i}
                className="mt-4 first:mt-0 text-base leading-relaxed text-brand-700"
              >
                {paragraph}
              </p>
            )
          )
        )}
      </Section>

      {/* What Attendees Leave With */}
      {keynote.outcomes && keynote.outcomes.length > 0 && (
        <Section width="content">
          <h2 className="heading-display text-3xl text-brand-900 sm:text-4xl">
            What Your Team Will Leave With
          </h2>
          <ul className="mt-6 space-y-3">
            {keynote.outcomes.map((outcome, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center bg-accent-100 text-xs font-bold text-accent-600">
                  {i + 1}
                </span>
                <span className="text-brand-700">{outcome}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Who Is This For */}
      {keynote.audiences && keynote.audiences.length > 0 && (
        <Section width="content" className="bg-brand-50">
          <h2 className="heading-display text-3xl text-brand-900 sm:text-4xl">
            Who Is This Keynote For?
          </h2>
          <ul className="mt-6 space-y-2">
            {keynote.audiences.map((audience, i) => (
              <li
                key={i}
                className="text-brand-700 before:mr-2 before:content-['→']"
              >
                {audience}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Testimonials — only shown if CMS has testimonial data */}
      {cmsKeynote?.testimonials && cmsKeynote.testimonials.length > 0 && (
        <Section width="wide">
          <h2 className="heading-display text-3xl text-brand-900 sm:text-4xl">
            What People Say
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {cmsKeynote.testimonials.map((t, i) => (
              <blockquote
                key={t._id}
                className="flex flex-col card-brutalist p-6"
                style={{ transform: `rotate(${tilt(i, 70)}deg)` }}
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
            ))}
          </div>
        </Section>
      )}

      {/* Related Topics — links to topic hubs per internal linking strategy */}
      {keynote.topics && keynote.topics.length > 0 && (
        <Section width="content">
          <h2 className="heading-display text-3xl text-brand-900 sm:text-4xl">
            Related Topics
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {keynote.topics.map((topic, i) => (
              <a
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  i === 0
                    ? "bg-accent-100 text-accent-600 hover:bg-accent-600 hover:text-white"
                    : "bg-brand-100 text-brand-700 hover:bg-brand-700 hover:text-white"
                }`}
              >
                {topic.title}
              </a>
            ))}
          </div>
        </Section>
      )}

      {/* Video embed if available */}
      {keynote.videoEmbed && (
        <Section width="content">
          <h2 className="heading-display text-3xl text-brand-900 sm:text-4xl">
            Watch a Preview
          </h2>
          <div className="mt-6 aspect-video overflow-hidden">
            <iframe
              src={
                getVideoEmbedUrl(keynote.videoEmbed) || keynote.videoEmbed
              }
              title={`${keynote.title} preview`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Section>
      )}

      {/* CTA — links to /contact and /speaker */}
      <FinalCta
        heading="Book This Keynote"
        description="Virtual delivery worldwide. Customized for your audience."
        primaryHref="/contact"
        primaryLabel="Enquire Now"
        secondaryHref="/speaker"
        secondaryLabel="About Nic as a Speaker"
      />
    </>
  );
}

/* ---------- Utilities ---------- */

/** Convert a YouTube or Vimeo URL to an embeddable URL */
function getVideoEmbedUrl(url: string): string | null {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return null;
}

/* ---------- Fallback data (used when Sanity has no content) ---------- */

interface FallbackKeynote extends KeynoteData {
  descriptionParagraphs: string[];
}

const FALLBACK_SLUGS = [
  { slug: "reclaiming-focus" },
  { slug: "breakthrough-product-teams" },
  { slug: "curiosity-catalyst" },
];

const FALLBACK_KEYNOTES: Record<string, FallbackKeynote> = {
  "reclaiming-focus": {
    _id: "fallback-1",
    title: "Reclaiming Focus in a World That Profits From Your Distraction",
    slug: "reclaiming-focus",
    tagline:
      "The DIAL framework for attention management, defeating digital addiction, and reclaiming deep work.",
    description: null,
    descriptionParagraphs: [
      "We live in an attention economy where every app, notification, and platform is engineered to steal your focus. The average person checks their phone 96 times per day. Your team's most valuable resource isn't time — it's attention.",
      "In this keynote, Nic introduces the DIAL framework (Decide, Intend, Act, Loop) — a practical system for reclaiming focus and building deep work habits. Drawing from his experience building 4 companies and the latest research on digital addiction, he shows how high-agency individuals and teams take control of their attention.",
      "This isn't about going offline. It's about being intentional. Your team will leave with a concrete framework they can apply Monday morning to do their most important work.",
    ],
    deliveryFormat: "virtual",
    duration: "45-60 minutes",
    outcomes: [
      "The DIAL framework for daily attention management",
      "How to identify and eliminate the 'sacrifice fallacy' in your work",
      "Practical strategies for 90-minute deep work blocks",
      "Why boredom is a catalyst for creativity, not a bug",
      "How to build team norms that protect focus time",
    ],
    audiences: [
      "Corporate teams struggling with productivity",
      "Leadership groups building remote/hybrid work culture",
      "Conferences focused on wellbeing and performance",
      "Teams experiencing burnout or attention fragmentation",
    ],
    videoEmbed: null,
    topics: [
      { _id: "t1", title: "Focus", slug: "focus" },
      { _id: "t2", title: "Agency", slug: "agency" },
    ],
    testimonials: null,
    seo: null,
  },
  "breakthrough-product-teams": {
    _id: "fallback-2",
    title: "How to Build Breakthrough Product Teams",
    slug: "breakthrough-product-teams",
    tagline:
      "The Innovation Flywheel: curiosity, experimentation, and high agency.",
    description: null,
    descriptionParagraphs: [
      "Most teams aren't stuck because they lack talent. They're stuck because they've optimised for compliance over curiosity. The Innovation Flywheel — curiosity → experimentation → learning → agency — is how the best product teams consistently ship work that matters.",
      "Nic draws from his experience building 4 companies and working with teams at every scale. He introduces the concept of T-shaped people, selective agency, and why 'action produces information' — a principle that separates breakthrough teams from stagnant ones.",
      "This keynote includes real stories from Nic's entrepreneurial journey, including how AI is reshaping how teams build products, why the Socratic method beats brainstorming, and what a $1.7M-per-person team (Gamma) can teach us about lean innovation.",
    ],
    deliveryFormat: "virtual",
    duration: "45-60 minutes",
    outcomes: [
      "The Innovation Flywheel framework for team culture",
      "How to hire and develop T-shaped people",
      "Why selective agency beats blind autonomy",
      "Practical ways to integrate AI into your product workflow",
      "How to build a culture where action produces information",
    ],
    audiences: [
      "Product and engineering teams",
      "Innovation departments and R&D groups",
      "Leadership teams building a culture of experimentation",
      "Conferences focused on tech, product, or AI",
    ],
    videoEmbed: null,
    topics: [
      { _id: "t3", title: "Innovation", slug: "innovation" },
      { _id: "t4", title: "AI", slug: "ai" },
      { _id: "t5", title: "Curiosity", slug: "curiosity" },
    ],
    testimonials: null,
    seo: null,
  },
  "curiosity-catalyst": {
    _id: "fallback-3",
    title: "The Curiosity Catalyst",
    slug: "curiosity-catalyst",
    tagline:
      "Why curiosity is the god particle of innovation — and how to diagnose and cure stagnation.",
    description: null,
    descriptionParagraphs: [
      "Every organisation says they want innovation. Almost none of them invest in what actually drives it: curiosity. Nic's Stagnation Hypothesis is simple — when teams stop being curious, they start dying. Slowly at first, then all at once.",
      "In this keynote, Nic unpacks the three types of curiosity (epistemic, diversive, and empathetic), explains why most 'innovation programs' are actually wackovation (chaotic activity disguised as progress), and shows how companies like Onfido hired specifically for curiosity to build breakthrough teams.",
      "This is Nic's signature keynote — the one that makes teams uncomfortable in the best possible way. If your organisation is stuck on the OK Plateau, this is the catalyst that gets you moving again.",
    ],
    deliveryFormat: "virtual",
    duration: "45-60 minutes",
    outcomes: [
      "The Stagnation Hypothesis: how to diagnose whether your org is stuck",
      "Three types of curiosity and how to cultivate each",
      "The difference between innovation and wackovation",
      "How to build curiosity into hiring, culture, and daily practice",
      "Why 'curiosity is the god particle of innovation'",
    ],
    audiences: [
      "C-suite and leadership offsites",
      "Conferences and large-format events",
      "Innovation and transformation teams",
      "Any team that feels stuck or stagnant",
    ],
    videoEmbed: null,
    topics: [
      { _id: "t5", title: "Curiosity", slug: "curiosity" },
      { _id: "t3", title: "Innovation", slug: "innovation" },
    ],
    testimonials: null,
    seo: null,
  },
};
