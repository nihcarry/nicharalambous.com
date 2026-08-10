/**
 * Builds the raw-HTML body for an imported YouTube post: the video embed at the
 * top, then either the transcript (under a "Video Transcript" heading) or the
 * cleaned description as a fallback. Shared by the importer and any backfill so
 * every post is built identically.
 */

import { decodeHtmlEntities } from "./transcript";

export const TRANSCRIPT_HEADING = "<h2>Video Transcript</h2>";

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** True when a stored rawHtmlBody already contains a full transcript section. */
export function hasTranscriptHeading(rawHtmlBody?: string | null): boolean {
  return Boolean(rawHtmlBody && rawHtmlBody.includes(TRANSCRIPT_HEADING));
}

/**
 * Recover plain-text transcript from a previously imported rawHtmlBody so we
 * can write TL;DRs without re-hitting Supadata / YouTube.
 */
export function extractTranscriptFromRawHtml(
  rawHtmlBody?: string | null
): string | null {
  if (!rawHtmlBody || !hasTranscriptHeading(rawHtmlBody)) return null;
  const idx = rawHtmlBody.indexOf(TRANSCRIPT_HEADING);
  const after = rawHtmlBody.slice(idx + TRANSCRIPT_HEADING.length);
  const text = decodeHtmlEntities(
    after
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
  return text.length > 0 ? text : null;
}

/** Group a block of prose into readable paragraphs (~4 sentences each). */
export function groupIntoParagraphs(text: string): string[] {
  const sentences = text
    .replace(/([.!?])\s+/g, "$1|")
    .split("|")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const paragraphs: string[] = [];
  let current: string[] = [];
  for (const sentence of sentences) {
    current.push(sentence);
    if (current.length >= 4) {
      paragraphs.push(current.join(" "));
      current = [];
    }
  }
  if (current.length > 0) paragraphs.push(current.join(" "));
  return paragraphs;
}

/** Trim promotional boilerplate that follows the first "---" in a description. */
export function cleanDescription(description: string): string {
  const cut = description.split(/\n-{2,}\n/)[0] ?? description;
  return cut.trim();
}

/**
 * Build the post body as raw HTML.
 *
 * The video embed is ALWAYS included at the top so a post is never empty, even
 * when the transcript can't be fetched. The transcript (when available) provides
 * the body copy; otherwise we fall back to the cleaned YouTube description.
 */
export function buildRawHtmlBody(
  videoId: string,
  title: string,
  transcript: string | null,
  description: string
): string {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;

  const embed = `
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin-bottom: 2rem;">
  <iframe 
    src="${embedUrl}" 
    title="${title.replace(/"/g, "&quot;")}"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 8px;"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    allowfullscreen>
  </iframe>
</div>`.trim();

  let copy: string;
  if (transcript && transcript.trim().length > 0) {
    const paragraphs = groupIntoParagraphs(transcript)
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join("\n\n");
    copy = `${TRANSCRIPT_HEADING}\n\n${paragraphs}`;
  } else {
    const desc = cleanDescription(description);
    copy = desc
      ? desc
          .split(/\n{2,}/)
          .map((p) => p.trim())
          .filter(Boolean)
          .map((p) => `<p>${escapeHtml(p)}</p>`)
          .join("\n\n")
      : `<p>Watch the video above.</p>`;
  }

  return `${embed}\n\n${copy}`.trim();
}
