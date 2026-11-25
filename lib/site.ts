/**
 * Shared v3 site facts: routes, booking link, and enquiry delivery.
 * The only public price is the lunch and learn, in lib/lunch-and-learn.ts.
 */

export const SITE_URL = "https://www.nicharalambous.com";

export const OUTPUT_PARADOX_PATH = "/keynotes/output-paradox-reengage-teams";

/** Keynotes that 301 to the Output Paradox page. Never render these as promos. */
const RETIRED_KEYNOTE_SLUGS = new Set([
  "curiosity-catalyst",
  "breakthrough-product-teams",
  "breakthrough-teams",
  "reclaiming-focus",
]);

export function isRetiredKeynote(slug: string | null | undefined): boolean {
  return Boolean(slug && RETIRED_KEYNOTE_SLUGS.has(slug));
}

/**
 * Privacy stays out of the index and the sitemap until Nic supplies the wording.
 * Flip this to false when the page is ready to be indexed.
 */
export const PRIVACY_NOINDEX = true;

export const SOCIAL = {
  linkedin: "https://www.linkedin.com/in/nicharalambous/",
  youtube: "https://www.youtube.com/@nicharrynobull",
  x: "https://x.com/nicharry",
  nobullship: "https://nobullship.co",
} as const;

/** Kit form used by the existing newsletter integration. */
export const KIT_FORM_ID = "10044760";
export const KIT_SUBSCRIBE_URL = `https://app.kit.com/forms/${KIT_FORM_ID}/subscriptions`;

/**
 * Enquiry delivery. The live site posts to FormSubmit from the browser, which
 * emails Nic. There is no Lambda. FormSubmit holds the response until that
 * email is sent. NEXT_PUBLIC_ENQUIRY_EMAIL is the address.
 * NEXT_PUBLIC_ENQUIRY_ENDPOINT overrides the whole URL if the transport changes.
 * Default is nic@nharry.com.
 */
export const ENQUIRY_EMAIL =
  process.env.NEXT_PUBLIC_ENQUIRY_EMAIL?.trim() || "nic@nharry.com";
export const ENQUIRY_ENDPOINT =
  process.env.NEXT_PUBLIC_ENQUIRY_ENDPOINT?.trim() ||
  `https://formsubmit.co/ajax/${ENQUIRY_EMAIL}`;

/**
 * Nav "Book a lunch and learn" stays on the hero card (#book).
 * The booking section itself is #checkout on the same page.
 */
export function bookOfferHref(): string {
  return `${OUTPUT_PARADOX_PATH}#book`;
}

/** Same destination as the nav booking button. */
export function bookNowHref(): string {
  return bookOfferHref();
}

/** Replace em dashes in text that will be rendered. Does not write to Sanity. */
export function withoutEmDash(value: string): string {
  return value
    .replace(/\s*\u2014\s*/g, ", ")
    .replace(/\s+,/g, ",")
    .replace(/,\s*,/g, ",")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}
