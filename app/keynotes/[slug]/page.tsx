/**
 * Individual Keynote Page — /keynotes/{slug}
 *
 * Single-scroll content page with the site's visual identity (patterns,
 * bold typography) but no slide-deck snapping. Content fetched from
 * Sanity at build time with hardcoded fallback from lib/keynotes-data.ts.
 *
 * JSON-LD: Service
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
import {
  KEYNOTE_SLIDES,
  getKeynoteBySlug,
  getKeynoteBookingUrl,
} from "@/lib/keynotes-data";

/**
 * Keynotes with a dedicated `app/keynotes/{slug}/page.tsx` must be excluded
 * from `generateStaticParams` here. Otherwise `next build` exports the same
 * path twice and the [slug] template can overwrite the bespoke landing in `out/`.
 */
const SLUGS_WITH_DEDICATED_PAGE = new Set(["escaping-the-apathy-trap"]);
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
    if (data) return data;
  } catch {
    // fall through to hardcoded fallback
  }

  const fallback = getKeynoteBySlug(slug);
  if (!fallback) return null;

  const descParagraphs = Array.isArray(fallback.description)
    ? fallback.description
    : [fallback.description];

  return {
    _id: `fallback-${slug}`,
    title: fallback.title,
    slug: fallback.slug,
    tagline: fallback.tagline,
    description: descParagraphs.map((text, i) => ({
      _type: "block",
      _key: `p${i}`,
      style: "normal",
      children: [{ _type: "span", _key: `s${i}`, text }],
      markDefs: [],
    })),
    deliveryFormat: fallback.deliveryFormat,
    duration: fallback.duration,
    audiences: fallback.audiences,
    outcomes: fallback.keyTakeaways,
    videoEmbed: null,
    topics: [],
    testimonials: null,
    seo: null,
  };
}

async function getKeynotesSlugs(): Promise<{ slug: string }[]> {
  let sanitySlugs: { slug: string }[] = [];
  try {
    const data =
      await client.fetch<{ slug: string }[]>(keynoteSlugListQuery);
    if (data && data.length > 0) sanitySlugs = data;
  } catch {
    // Sanity unavailable — hardcoded slugs will cover us
  }

  const hardcodedSlugs = KEYNOTE_SLIDES.map((k) => ({ slug: k.slug }));
  const seen = new Set<string>();
  const merged: { slug: string }[] = [];
  for (const entry of [...hardcodedSlugs, ...sanitySlugs]) {
    if (!seen.has(entry.slug)) {
      seen.add(entry.slug);
      merged.push(entry);
    }
  }
  return merged;
}

/* ---------- Static params ---------- */

export async function generateStaticParams() {
  const slugs = await getKeynotesSlugs();
  return slugs
    .filter(({ slug }) => !SLUGS_WITH_DEDICATED_PAGE.has(slug))
    .map(({ slug }) => ({ slug }));
}

/* ---------- Metadata ---------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const keynote = await getKeynote(slug);
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
      type: "website",
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
  const keynote = await getKeynote(slug);

  if (!keynote) {
    notFound();
  }

  const hasDescription =
    keynote.description && keynote.description.length > 0;
  const hasOutcomes = keynote.outcomes && keynote.outcomes.length > 0;
  const hasAudiences = keynote.audiences && keynote.audiences.length > 0;
  const hasTestimonials =
    keynote.testimonials && keynote.testimonials.length > 0;
  const hasTopics = keynote.topics && keynote.topics.length > 0;
  const hasVideo = !!keynote.videoEmbed;

  return (
    <div className="page-bg bg-spotlight-pattern">
      {/* Structured data */}
      <JsonLd
        data={serviceJsonLd({
          name: `${keynote.title}: Virtual Keynote`,
          description: keynote.tagline,
          url: `https://nicharalambous.com/keynotes/${slug}`,
        })}
      />

      {/* Hero */}
      <Section width="content" className="text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-accent-600">
          Virtual Keynote
        </p>
        <h1 className="heading-display-stroke-sm mt-3 text-4xl text-brand-900 sm:text-5xl md:text-6xl">
          {keynote.title}
        </h1>
        <div className="mx-auto mt-3 h-1 w-16 bg-accent-600" />
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-brand-600">
          {keynote.tagline}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-brand-400">
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
        <div className="mt-6">
          <CTAButton href={getKeynoteBookingUrl(slug)}>
            Book This Keynote
          </CTAButton>
        </div>
      </Section>

      {/* Description */}
      {hasDescription && (
        <Section width="content">
          <PortableText value={keynote.description} />
        </Section>
      )}

      {/* Outcomes + Audiences side by side */}
      {(hasOutcomes || hasAudiences) && (
        <Section width="wide">
          <div className="grid gap-12 md:grid-cols-2">
            {hasOutcomes && (
              <div>
                <h2 className="heading-display text-2xl text-brand-900 sm:text-3xl">
                  What Your Team Will Leave With
                </h2>
                <ul className="mt-6 space-y-4">
                  {keynote.outcomes.map((outcome, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-accent-600 text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="text-brand-700">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {hasAudiences && (
              <div>
                <h2 className="heading-display text-2xl text-brand-900 sm:text-3xl">
                  Who Is This Keynote For?
                </h2>
                <ul className="mt-6 space-y-3">
                  {keynote.audiences.map((audience, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-brand-700"
                    >
                      <span className="mt-1.5 block h-2.5 w-2.5 shrink-0 bg-accent-600" />
                      {audience}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Testimonials */}
      {hasTestimonials && (
        <Section width="wide">
          <h2 className="heading-display text-2xl text-brand-900 sm:text-3xl">
            What People Say
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {keynote.testimonials!.map((t, i) => (
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

      {/* Video embed */}
      {hasVideo && (
        <Section width="content">
          <h2 className="heading-display text-2xl text-brand-900 sm:text-3xl">
            Watch a Preview
          </h2>
          <div className="mt-6 aspect-video overflow-hidden border-4 border-accent-600">
            <iframe
              src={
                getVideoEmbedUrl(keynote.videoEmbed!) || keynote.videoEmbed!
              }
              title={`${keynote.title} preview`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Section>
      )}

      {/* Related Topics */}
      {hasTopics && (
        <Section width="content">
          <h2 className="heading-display text-2xl text-brand-900 sm:text-3xl">
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

      {/* CTA */}
      <FinalCta
        heading="Book This Keynote"
        description="Virtual delivery worldwide. Customized for your audience."
        primaryHref={getKeynoteBookingUrl(slug)}
        primaryLabel="Enquire Now"
        secondaryHref="/speaker"
        secondaryLabel="About Nic as a Speaker"
      />
    </div>
  );
}

/* ---------- Utilities ---------- */

function getVideoEmbedUrl(url: string): string | null {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return null;
}
