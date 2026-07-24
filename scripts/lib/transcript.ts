/**
 * Transcript fetching, shared by the YouTube import and TL;DR scripts.
 *
 * Two backends, chosen automatically:
 *
 *   1. Hosted API (Supadata) — used when SUPADATA_API_KEY is set. This is what
 *      runs in GitHub Actions / any cloud, because YouTube blocks transcript
 *      requests coming from datacenter IPs. Supadata fetches server-side (with
 *      a Whisper fallback for videos without captions) and returns clean text.
 *      Free tier: 100 requests/month, no credit card. https://supadata.ai
 *
 *   2. Direct library (youtube-transcript-api-js) — used when no key is set.
 *      Free and works from a residential IP (i.e. your laptop), but gets
 *      IP-blocked from cloud servers. Fine for local runs.
 *
 * Env:
 *   SUPADATA_API_KEY   — enables the hosted backend
 *   SUPADATA_BASE_URL  — optional override (defaults to Supadata's API)
 */

import { YouTubeTranscriptApi } from "youtube-transcript-api-js";

const SUPADATA_API_KEY = process.env.SUPADATA_API_KEY;
const SUPADATA_BASE_URL =
  process.env.SUPADATA_BASE_URL || "https://api.supadata.ai/v1";

export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "...")
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));
}

function normalise(text: string): string {
  return decodeHtmlEntities(text).replace(/\s+/g, " ").trim();
}

/** Fetch via Supadata's hosted API (works from cloud IPs). */
async function fetchViaSupadata(videoId: string): Promise<string | null> {
  const url = `${SUPADATA_BASE_URL}/transcript?url=${encodeURIComponent(
    `https://www.youtube.com/watch?v=${videoId}`
  )}&lang=en&text=true&mode=auto`;

  const res = await fetch(url, {
    headers: { "x-api-key": SUPADATA_API_KEY as string },
  });

  if (!res.ok) {
    console.log(`    Supadata transcript failed for ${videoId}: ${res.status} ${await res.text()}`);
    return null;
  }

  const data = (await res.json()) as {
    content?: string | { text: string }[];
  };

  // With text=true the API returns a plain string; otherwise timestamped chunks.
  if (typeof data.content === "string") {
    const text = normalise(data.content);
    return text.length > 0 ? text : null;
  }
  if (Array.isArray(data.content)) {
    const text = normalise(data.content.map((c) => c.text).join(" "));
    return text.length > 0 ? text : null;
  }
  return null;
}

/** Fetch via the direct library (works from residential IPs, e.g. local). */
async function fetchViaLibrary(videoId: string): Promise<string | null> {
  const api = new YouTubeTranscriptApi();
  const transcript = await api.fetch(videoId, ["en"]);
  if (!transcript?.snippets?.length) {
    console.log(`    No transcript available for ${videoId}`);
    return null;
  }
  const text = normalise(
    transcript.snippets.map((s: { text: string }) => s.text).join(" ")
  );
  return text.length > 0 ? text : null;
}

/**
 * Fetch a plain-text transcript for a video, or null if unavailable.
 * Uses Supadata when SUPADATA_API_KEY is set (cloud-safe), else the direct
 * library (local only).
 */
export async function fetchTranscript(videoId: string): Promise<string | null> {
  try {
    return SUPADATA_API_KEY
      ? await fetchViaSupadata(videoId)
      : await fetchViaLibrary(videoId);
  } catch (err) {
    console.log(`    Transcript fetch failed for ${videoId}: ${err}`);
    return null;
  }
}
