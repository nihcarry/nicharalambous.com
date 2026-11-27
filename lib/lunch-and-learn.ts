/**
 * The Output Paradox lunch and learn.
 *
 * The booking page is public. The default is Nic's paid Calendly event, so a
 * deploy picks it up with no env setup. NEXT_PUBLIC_LUNCH_AND_LEARN_CALENDLY_URL
 * overrides that default when it is set to another URL. An empty value keeps
 * the enquire fallback. Do not create Calendly events or Stripe products here.
 *
 * Nic, 27 Nov 2026. The price shown on the site is €399 ex VAT.
 * The amount charged is set on the Calendly event, not in this file.
 * - €399 ex VAT, euros only, charged at booking. Moneybird sends the invoice.
 *   EU reverse charge is on that invoice where it applies. No VAT logic here.
 * - Wednesdays and Fridays, 45-minute sessions starting 11:00, 12:00 or 13:00
 *   Amsterdam time. Calendly shows the visitor their own time zone.
 * - Minimum notice: 7 calendar days.
 * - Online only. The client sends the Zoom, Teams or Meet link.
 * - Free reschedule up to 48 hours before. Cancel 5 working days ahead
 *   for a full refund. After that, reschedule only, no refund.
 * - Confirmation is a Stripe receipt plus a Moneybird invoice.
 */

/** Live paid event. Used when the env var is unset. */
export const LUNCH_AND_LEARN_CALENDLY_DEFAULT =
  "https://calendly.com/nharry/output-paradox-lunch-and-learn";

const calendlyFromEnv = process.env.NEXT_PUBLIC_LUNCH_AND_LEARN_CALENDLY_URL;

/** Booking URL. Unset env uses the default. An empty env keeps the fallback. */
export const LUNCH_AND_LEARN_CALENDLY_URL = (
  calendlyFromEnv === undefined ? LUNCH_AND_LEARN_CALENDLY_DEFAULT : calendlyFromEnv
).trim();

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
  priceAmount: "€399",
  priceCaption: "ex VAT",
  /** Literal euro string. Never localised. */
  priceLine: "€399 ex VAT",
  priceEuros: 399,
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
