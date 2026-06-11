/**
 * Notion imports often open with a deck-style H1 before the article body.
 * The page template already renders post.title as the document H1, so we
 * lift a leading rawHtmlBody H1 above the featured image as a subheading.
 */
export function splitLeadingRawHtmlH1(html: string): {
  leadHeadingHtml: string | null;
  bodyHtml: string;
} {
  const trimmed = html.trimStart();
  const match = trimmed.match(/^<h1\b[^>]*>[\s\S]*?<\/h1>\s*/i);
  if (!match) {
    return { leadHeadingHtml: null, bodyHtml: html };
  }

  return {
    leadHeadingHtml: match[0].trim(),
    bodyHtml: trimmed.slice(match[0].length),
  };
}

/** Strip tags for accessible subheading text when inner HTML is plain. */
export function rawHtmlToPlainText(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}
