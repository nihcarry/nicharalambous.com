/**
 * Media — /media
 * Existing appearances, grouped as before, in the v3 layout.
 */
import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { mediaAppearancesQuery, type MediaAppearanceData } from "@/lib/sanity/queries";
import { JsonLd } from "@/components/json-ld";
import { collectionPageJsonLd } from "@/lib/metadata";
import { OUTPUT_PARADOX_PATH } from "@/lib/site";

async function getMediaAppearances(): Promise<MediaAppearanceData[] | null> {
  try {
    const data = await client.fetch<MediaAppearanceData[]>(mediaAppearancesQuery);
    return data && data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

export const metadata: Metadata = {
  title: "Media",
  description:
    "Nic Haralambous in the media, including press features, podcast appearances, TV/radio broadcasts, and video interviews.",
  alternates: { canonical: "https://www.nicharalambous.com/media" },
  openGraph: {
    type: "website",
    title: "Media | Nic Haralambous",
    description: "Press features, podcast appearances, and media coverage of Nic Haralambous.",
    url: "https://www.nicharalambous.com/media",
  },
};

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export default async function MediaPage() {
  const appearances = (await getMediaAppearances()) || FALLBACK_APPEARANCES;
  const grouped = groupByType(appearances);

  return (
    <div className="v3">
      <JsonLd
        data={collectionPageJsonLd({
          name: "Media Appearances | Nic Haralambous",
          description: "Press features, podcast appearances, TV/radio broadcasts, and video interviews.",
          url: "https://www.nicharalambous.com/media",
        })}
      />
      <section>
        <div className="wrap">
          <h1>Media &amp; Press</h1>
          <p className="lead">Podcasts, press features, TV appearances, and video interviews.</p>
          <p className="meta" style={{ marginTop: 28 }}>
            {MEDIA_OUTLETS.join(" · ")}
          </p>
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
      <section className="dark">
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2>Book Nic for your event</h2>
          <p className="lead" style={{ margin: "16px auto 0" }}>
            Keynotes for conferences, corporate events, and webinars, in person or virtually. Worldwide.
          </p>
          <div className="acts" style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
            <a className="btn" href="/contact">
              Enquire now
            </a>
            <a className="quiet-link" href={OUTPUT_PARADOX_PATH}>
              See the keynote
            </a>
          </div>
        </div>
      </section>
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

const MEDIA_OUTLETS = ["BBC", "Fast Company", "CNBC Africa", "SXSW", "Forbes"];

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
