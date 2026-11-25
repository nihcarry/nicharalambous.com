/**
 * The Output Paradox lunch and learn.
 *
 * NEXT_PUBLIC_LUNCH_AND_LEARN_CALENDLY_URL is the only booking URL.
 * Set it to the paid Calendly event page (Calendly's Stripe integration).
 * Leave it empty until that event exists. Do not invent a slug, and do not
 * create the Calendly event or a Stripe product from this repo.
 *
 * Nic, 25 Nov 2026. The event, when created on nic@nharry.com, is:
 * - €999 ex VAT, euros only, charged at booking. Moneybird sends the invoice.
 *   EU reverse charge is on that invoice where it applies. No VAT logic here.
 * - Wednesdays and Fridays, 45-minute sessions starting 11:00, 12:00 or 13:00
 *   Amsterdam time. Calendly shows the visitor their own time zone.
 * - Minimum notice: 7 calendar days.
 * - Online only. The client sends the Zoom, Teams or Meet link.
 * - Free reschedule up to 48 hours before. Cancel 5 working days ahead
 *   for a full refund. After that, reschedule only, no refund.
 * - Confirmation is a Stripe receipt plus a Moneybird invoice.
 */

export const LUNCH_AND_LEARN_CALENDLY_URL =
  process.env.NEXT_PUBLIC_LUNCH_AND_LEARN_CALENDLY_URL?.trim() || "";

/** The booking section on the Output Paradox page. */
export const LUNCH_AND_LEARN_PATH =
  "/keynotes/output-paradox-reengage-teams#checkout";

/** Used while the Calendly URL is empty. */
export const LUNCH_AND_LEARN_FALLBACK_HREF = "/contact?format=lunch-and-learn";

/** The offer name. Use this everywhere a heading or link names the offer. */
export const LUNCH_AND_LEARN_LABEL =
  "Virtual lunch and learn: a 20-minute talk plus Q&A in a 45-minute slot";

export const LUNCH_AND_LEARN_FACTS = {
  offerName: LUNCH_AND_LEARN_LABEL,
  priceAmount: "€999",
  priceCaption: "ex VAT",
  /** Literal euro string. Never localised. */
  priceLine: "€999 ex VAT",
  priceEuros: 999,
  priceCurrency: "EUR" as const,
} as const;

const DISPLAY_PARAMS: Record<string, string> = {
  hide_event_type_details: "1",
  background_color: "fbf9f4",
  text_color: "16181d",
  primary_color: "2563eb",
};

/**
 * Inline-widget URL. Display params are added when the base URL does not
 * already set them. Empty when no event URL is configured.
 */
export function lunchLearnEmbedUrl(raw = LUNCH_AND_LEARN_CALENDLY_URL): string {
  const value = raw.trim();
  if (!value) return "";
  const url = new URL(value);
  for (const [key, param] of Object.entries(DISPLAY_PARAMS)) {
    if (!url.searchParams.has(key)) url.searchParams.set(key, param);
  }
  return url.toString();
}
