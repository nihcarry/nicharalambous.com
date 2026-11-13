/**
 * Media and press. Coverage comes from data/media-coverage.json.
 * The Sanity mediaAppearance query does not feed this page.
 */
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { ClosingCta } from "@/components/site/closing-cta";
import { MediaBrowser } from "@/components/site/media-browser";
import { featuredMedia, loadMediaCoverage, mediaStatLine, outletNames } from "@/lib/media-coverage";
import { OUTPUT_PARADOX_PATH } from "@/lib/site";

const INTRO = "Press, podcasts, television, radio, video and talks.";

export async function generateMetadata(): Promise<Metadata> {
  const items = loadMediaCoverage();
  const description = `${mediaStatLine(items)}. ${INTRO}`;
  return {
    title: "Media and press",
    description,
    alternates: { canonical: "https://www.nicharalambous.com/media" },
    openGraph: {
      type: "website",
      title: "Media and press | Nic Haralambous",
      description,
      url: "https://www.nicharalambous.com/media",
    },
  };
}

export default function MediaPage() {
  const items = loadMediaCoverage();
  const featured = featuredMedia(items);
  const outlets = outletNames(items);
  const stat = mediaStatLine(items);
  const description = `${stat}. ${INTRO}`;

  return (
    <div className="v3 p-broadcast">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Media and press",
          description,
          numberOfItems: items.length,
          itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.title,
            url: item.href,
            description: item.summary || undefined,
          })),
        }}
      />
      <section>
        <div className="wrap">
          <h1>Media and press</h1>
          <p className="lead">{INTRO}</p>
          <p className="outlet-row">{outlets.join("  ·  ")}</p>
          <p className="stat">{stat}</p>
        </div>
      </section>
      <MediaBrowser items={items} featured={featured} />
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
