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
  const data = await client.fetch<{ slug: string }[]>(keynoteSlugListQuery);
  if (!data || data.length === 0) {
    throw new Error("No keynote slugs returned from Sanity");
  }
  return data;
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

  return (
    <>
      {/* Structured data */}
      <JsonLd
        data={serviceJsonLd({
          name: `${keynote.title}: Virtual Keynote`,
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

      {/* Description — Portable Text from CMS */}
      {hasDescription && (
        <Section width="content" className="bg-brand-50">
          <PortableText value={keynote.description} />
        </Section>
      )}

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

      {/* Testimonials */}
      {keynote.testimonials && keynote.testimonials.length > 0 && (
        <Section width="wide">
          <h2 className="heading-display text-3xl text-brand-900 sm:text-4xl">
            What People Say
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {keynote.testimonials.map((t, i) => (
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

