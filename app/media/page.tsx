/**
 * Media — /media
 * Existing appearances, grouped as before, in the v3 layout.
 */
import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { mediaAppearancesQuery, type MediaAppearanceData } from "@/lib/sanity/queries";
import { JsonLd } from "@/components/json-ld";
import { collectionPageJsonLd } from "@/lib/metadata";
import { ClosingCta } from "@/components/site/closing-cta";
import { OUTPUT_PARADOX_PATH } from "@/lib/site";

/**
 * Unverified appearances. They stay in Sanity and in the fallback below.
 * Remove an entry here to show that item again.
 */
const HIDDEN_MEDIA: { id: string; title: string }[] = [
  { id: "fm-1", title: "The Future of Work and Curiosity" },
  { id: "fm-2", title: "South African Entrepreneur on Building with AI" },
  { id: "fm-3", title: "Entrepreneurship in Africa" },
];

const HOLDING_COPY = "Press and podcast appearances are coming soon.";

function isHiddenMedia(item: MediaAppearanceData): boolean {
  return HIDDEN_MEDIA.some((hidden) => hidden.id === item._id || hidden.title === item.title);
}

async function getMediaAppearances(): Promise<MediaAppearanceData[]> {
  try {
    const data = await client.fetch<MediaAppearanceData[]>(mediaAppearancesQuery, {
      hiddenTitles: HIDDEN_MEDIA.map((item) => item.title),
    });
    const items = data && data.length > 0 ? data : FALLBACK_APPEARANCES;
    return items.filter((item) => !isHiddenMedia(item));
  } catch {
    return FALLBACK_APPEARANCES.filter((item) => !isHiddenMedia(item));
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const appearances = await getMediaAppearances();
  const description =
    appearances.length === 0
      ? HOLDING_COPY
      : "Nic Haralambous in the media, including press features, podcast appearances, TV/radio broadcasts, and video interviews.";
  return {
    title: "Media",
    description,
    alternates: { canonical: "https://www.nicharalambous.com/media" },
    openGraph: {
      type: "website",
      title: "Media | Nic Haralambous",
      description,
      url: "https://www.nicharalambous.com/media",
    },
  };
}

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export default async function MediaPage() {
  const appearances = await getMediaAppearances();
  const grouped = groupByType(appearances);

  return (
    <div className="v3 p-broadcast">
      <JsonLd
        data={collectionPageJsonLd({
          name: "Media Appearances | Nic Haralambous",
          description: appearances.length === 0 ? HOLDING_COPY : "Press features, podcast appearances, TV/radio broadcasts, and video interviews.",
          url: "https://www.nicharalambous.com/media",
        })}
      />
      <section>
        <div className="wrap">
          <h1>Media &amp; Press</h1>
          {appearances.length === 0 ? (
            <p className="lead">{HOLDING_COPY}</p>
          ) : (
            <p className="lead">Podcasts, press features, TV appearances, and video interviews.</p>
          )}
        </div>
      </section>
      {APPEARANCE_TYPES.map(({ key, label }) => {
        const items = grouped[key];
        if (!items || items.length === 0) return null;
        return (
          <section key={key}>
            <div className="wrap">
              <h2>{label}</h2>
              <div className="offer-grid" style={{ marginTop: 24 }}>
                {items.map((item) => {
                  const meta = [item.publication, formatDate(item.date)].filter(Boolean).join(" · ");
                  return (
                    <article className="plain-card" key={item._id}>
                      {meta ? <span className="meta">{meta}</span> : null}
                      <h3>
                        {item.url ? (
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            {item.title}
                          </a>
                        ) : (
                          item.title
                        )}
                      </h3>
                      {item.description ? <p>{item.description}</p> : null}
                      {item.url ? (
                        <p style={{ marginTop: 16 }}>
                          <a className="link" href={item.url} target="_blank" rel="noopener noreferrer">
                            View
                          </a>
                        </p>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}
      <ClosingCta
        className="pd-broadcast"
        heading="Book Nic for your event"
        copy="Keynotes for conferences, corporate events, and webinars, in person or virtually. Worldwide."
        primaryHref="/contact"
        primaryLabel="Enquire now"
        secondaryHref={OUTPUT_PARADOX_PATH}
        secondaryLabel="See the keynote"
      />
    </div>
  );
}

const APPEARANCE_TYPES = [
  { key: "podcast" as const, label: "Podcasts" },
  { key: "video" as const, label: "Video" },
  { key: "press" as const, label: "Press" },
  { key: "broadcast" as const, label: "TV & Radio" },
];

function groupByType(items: MediaAppearanceData[]): Record<string, MediaAppearanceData[]> {
  const groups: Record<string, MediaAppearanceData[]> = {};
  for (const item of items) {
    const key = item.type || "press";
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  return groups;
}

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
