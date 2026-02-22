/**
 * Media Page — /media
 *
 * Press mentions, podcast appearances, video features, and broadcasts.
 * Redirects from /its-not-over land here.
 *
 * Content is fetched from Sanity at build time, grouped by type.
 * Falls back to hardcoded defaults if Sanity has no data.
 *
 * JSON-LD: CollectionPage
 */
import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import {
  mediaAppearancesQuery,
  type MediaAppearanceData,
} from "@/lib/sanity/queries";
import { CTAButton } from "@/components/cta-button";
import { Section } from "@/components/section";
import { FinalCta } from "@/components/final-cta";
import { JsonLd } from "@/components/json-ld";
import { tilt } from "@/lib/tilt";
import { collectionPageJsonLd } from "@/lib/metadata";

/* ---------- Data fetching ---------- */

async function getMediaAppearances(): Promise<MediaAppearanceData[] | null> {
  try {
    const data = await client.fetch<MediaAppearanceData[]>(mediaAppearancesQuery);
    return data && data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

/* ---------- Metadata ---------- */

export const metadata: Metadata = {
  title: "Media",
  description:
    "Nic Haralambous in the media, including press features, podcast appearances, TV/radio broadcasts, and video interviews.",
  alternates: { canonical: "https://nicharalambous.com/media" },
  openGraph: {
    title: "Media | Nic Haralambous",
    description:
      "Press features, podcast appearances, and media coverage of Nic Haralambous.",
    url: "https://nicharalambous.com/media",
  },
};

/* ---------- Page ---------- */

export default async function MediaPage() {
  const cmsAppearances = await getMediaAppearances();
  const appearances = cmsAppearances || FALLBACK_APPEARANCES;

  // Group appearances by type
  const grouped = groupByType(appearances);

  return (
    <>
      {/* Structured data */}
      <JsonLd
        data={collectionPageJsonLd({
          name: "Media Appearances | Nic Haralambous",
          description:
            "Press features, podcast appearances, TV/radio broadcasts, and video interviews.",
          url: "https://nicharalambous.com/media",
        })}
      />

      <Section width="content" className="text-center">
        <h1 className="heading-display-stroke-sm text-5xl text-brand-900 sm:text-6xl">
          Media &amp; Press
        </h1>
        <p className="mt-4 text-lg text-brand-600">
          Podcasts, press features, TV appearances, and video interviews.
        </p>
      </Section>

      {/* Media logos */}
      <Section width="wide" className="bg-brand-50">
        <div className="flex flex-wrap items-center justify-center gap-8 text-brand-400">
          {MEDIA_OUTLETS.map((name) => (
            <span
              key={name}
              className="heading-display text-2xl text-accent-600"
            >
              {name}
            </span>
          ))}
        </div>
      </Section>

      {/* Grouped appearances */}
      {APPEARANCE_TYPES.map(({ key, label }) => {
        const items = grouped[key];
        if (!items || items.length === 0) return null;

        return (
          <Section key={key} width="wide">
            <h2 className="heading-display text-3xl text-brand-900 sm:text-4xl">
              {label}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, i) => (
                <article
                  key={item._id}
                  className="card-brutalist flex flex-col p-6 transition-colors hover:bg-accent-50"
                  style={{ transform: `rotate(${tilt(i, 130)}deg)` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="heading-display text-lg text-brand-900">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-accent-600"
                          >
                            {item.title}
                          </a>
                        ) : (
                          item.title
                        )}
                      </h3>
                      {item.publication && (
                        <p className="mt-1 text-sm font-medium text-accent-600">
                          {item.publication}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 bg-brand-100 px-3 py-1 text-xs font-medium text-brand-600">
                      {formatType(item.type)}
                    </span>
                  </div>

                  {item.description && (
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-600">
                      {item.description}
                    </p>
                  )}

                  <div className="mt-4 flex items-center gap-3">
                    {item.date && (
                      <time
                        dateTime={item.date}
                        className="text-xs text-brand-400"
                      >
                        {new Date(item.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })}
                      </time>
                    )}
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-accent-600 hover:underline"
                      >
                        View &rarr;
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </Section>
        );
      })}

      {/* CTA */}
      <FinalCta
        heading="Book Nic for Your Event"
        description="Virtual keynotes for conferences, corporate events, and webinars. Worldwide delivery."
        primaryHref="/contact"
        primaryLabel="Enquire Now"
        secondaryHref="/speaker"
        secondaryLabel="About Nic as a Speaker"
      />
    </>
  );
}

/* ---------- Utilities ---------- */

const APPEARANCE_TYPES = [
  { key: "podcast" as const, label: "Podcasts" },
  { key: "video" as const, label: "Video" },
  { key: "press" as const, label: "Press" },
  { key: "broadcast" as const, label: "TV & Radio" },
];

function groupByType(
  items: MediaAppearanceData[]
): Record<string, MediaAppearanceData[]> {
  const groups: Record<string, MediaAppearanceData[]> = {};
  for (const item of items) {
    const key = item.type || "press";
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  return groups;
}

function formatType(type: string): string {
  switch (type) {
    case "podcast":
      return "Podcast";
    case "video":
      return "Video";
    case "press":
      return "Press";
    case "broadcast":
      return "TV/Radio";
    default:
      return type;
  }
}

const MEDIA_OUTLETS = [
  "BBC",
  "Fast Company",
  "CNBC Africa",
  "SXSW",
  "Forbes",
];

/* ---------- Fallback data ---------- */

const FALLBACK_APPEARANCES: MediaAppearanceData[] = [
  {
    _id: "fm-1",
    title: "The Future of Work and Curiosity",
    type: "podcast",
    publication: "Tech Leadership Podcast",
    date: "2025-06-15",
    url: null,
    embedUrl: null,
    description:
      "Nic discusses why curiosity is the god particle of innovation and how teams can break free from stagnation.",
    logo: null,
  },
  {
    _id: "fm-2",
    title: "South African Entrepreneur on Building with AI",
    type: "press",
    publication: "Fast Company",
    date: "2025-03-10",
    url: null,
    embedUrl: null,
    description:
      "Feature article on Nic's journey from music tech startup to AI product builder and keynote speaker.",
    logo: null,
  },
  {
    _id: "fm-3",
    title: "Entrepreneurship in Africa",
    type: "broadcast",
    publication: "CNBC Africa",
    date: "2024-11-20",
    url: null,
    embedUrl: null,
    description:
      "Live interview discussing the state of entrepreneurship in Africa and the role of AI in building businesses.",
    logo: null,
  },
];
