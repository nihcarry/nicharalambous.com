/**
 * Where each public offer button goes.
 *
 * The lunch and learn is booked on its own Calendly scheduling page.
 * Every other offer is "Enquire to book". None of them use a Stripe
 * Payment Link on the site.
 *
 * Stripe itself is unchanged. These Payment Links still exist and are
 * not called from the site:
 * - executive-workflow-upgrade: prod_Ve6VIACchTYnVv, plink_1UcoIyF8qci2BYDcM5NS5Ntm
 * - accountability-coaching: prod_Ve6VOLIs9VrG2e, plink_1UcoIrF8qci2BYDcfhjoLIM1
 *
 * Do not put those URLs back on a button.
 */

import { LUNCH_AND_LEARN_PATH } from "@/lib/lunch-and-learn";

export const CHECKOUT_LINKS = {
  "lunch-and-learn": "",
  "team-workflow-upgrade": "",
  "executive-workflow-upgrade": "",
  "my-week-with-grok-bot": "",
  "accountability-coaching": "",
} as const;

export type CheckoutOffer = keyof typeof CHECKOUT_LINKS;

/**
 * Offers sold by enquiry. The value is the short code sent as ?offer=
 * on the session request form.
 */
export const ENQUIRY_OFFERS = {
  "team-workflow-upgrade": "team",
  "my-week-with-grok-bot": "my-week",
  "executive-workflow-upgrade": "exec",
  "accountability-coaching": "coaching",
} as const satisfies Partial<Record<CheckoutOffer, string>>;

export type EnquiryOffer = keyof typeof ENQUIRY_OFFERS;

export const SESSION_REQUEST_PATH = "/workshops/request-a-session";

export const SESSION_REQUEST_LABEL = "Enquire to book";

/** Keynotes are enquired on the contact form, not the workshop form. */
export const KEYNOTE_ENQUIRY_PATH = "/contact";

export function isEnquiryOffer(offer: CheckoutOffer): offer is EnquiryOffer {
  return offer in ENQUIRY_OFFERS;
}

export function sessionRequestHref(offer: EnquiryOffer): string {
  return `${SESSION_REQUEST_PATH}?offer=${ENQUIRY_OFFERS[offer]}`;
}

/**
 * Where a buy button goes.
 * The lunch and learn goes to its booking section.
 * Every other offer goes to the enquiry form.
 */
export function checkoutHref(offer: CheckoutOffer): string {
  if (offer === "lunch-and-learn") return LUNCH_AND_LEARN_PATH;
  if (isEnquiryOffer(offer)) return sessionRequestHref(offer);
  return "";
}
