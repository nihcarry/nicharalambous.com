import { youtubePosterSrc } from "@/lib/v3-content";

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

/**
 * Replace YouTube and Testimonial.to iframes in imported HTML with a
 * same-size placeholder. The player loads only after a click.
 */
export function gateThirdPartyEmbeds(html: string): string {
  return html.replace(/<iframe\b[\s\S]*?<\/iframe>/gi, (tag) => {
    const src = /src\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1] ?? "";
    const title = /title\s*=\s*["']([^"']*)["']/i.exec(tag)?.[1] ?? "";
    const youtube = src.match(
      /(?:youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9_-]+)/,
    );
    if (youtube) {
      const label = title ? `Play video: ${title}` : "Play video";
      const poster = youtubePosterSrc(youtube[1]);
      const image = poster ? `<img src="${esc(poster)}" alt="" width="640" height="360" />` : "";
      return `<div class="yt-facade">${image}<button type="button" data-yt-play="${youtube[1]}" aria-label="${esc(label)}"><span class="yt-play" aria-hidden="true"></span></button></div>`;
    }
    if (/testimonial\.to/i.test(src)) {
      return `<div class="tt-facade"><p class="tt-note">These testimonials load from Testimonial.to. They stay off until you accept cookies.</p><button type="button" class="btn" data-tt-play="${esc(src)}">Cookie settings</button></div>`;
    }
    return tag;
  });
}
