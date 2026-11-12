import { client } from "@/lib/sanity/client";

const YOUTUBE_FEED =
  "https://www.youtube.com/feeds/videos.xml?channel_id=UCTMwZmHH1VNLA2viHKwbvoA";

export type YouTubeVideo = { id: string; title: string };

export async function latestYouTubeVideo(): Promise<YouTubeVideo | null> {
  try {
    const response = await fetch(YOUTUBE_FEED, { cache: "force-cache" });
    if (!response.ok) return null;
    const xml = await response.text();
    const id = xml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const title = xml.match(/<entry>[\s\S]*?<title>([^<]+)<\/title>/)?.[1];
    if (!id || !title) return null;
    return {
      id,
      title: title
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'"),
    };
  } catch {
    return null;
  }
}

export type ApprovedTestimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  photo: string;
};

type Settings = {
  stageClipUrl?: string | null;
  approvedTestimonial?: {
    quote?: string | null;
    name?: string | null;
    role?: string | null;
    company?: string | null;
    photo?: string | null;
  } | null;
};

/** Reads optional v3 fields. Missing fields and a failed fetch both mean "hide the slot". */
export async function v3ContentSettings(): Promise<{
  stageClipUrl: string | null;
  testimonial: ApprovedTestimonial | null;
}> {
  try {
    const data = await client.fetch<Settings | null>(
      `*[_id == "siteSettings"][0]{
        stageClipUrl,
        approvedTestimonial{
          quote,
          name,
          role,
          company,
          "photo": photo.asset->url
        }
      }`,
    );
    const clip = data?.stageClipUrl?.trim() || "";
    const item = data?.approvedTestimonial;
    const testimonial =
      item?.quote && item.name && item.role && item.company && item.photo
        ? {
            quote: item.quote,
            name: item.name,
            role: item.role,
            company: item.company,
            photo: item.photo,
          }
        : null;
    return {
      stageClipUrl: /^https?:\/\//.test(clip) ? clip : null,
      testimonial,
    };
  } catch {
    return { stageClipUrl: null, testimonial: null };
  }
}
