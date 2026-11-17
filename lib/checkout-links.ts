/**
 * Stripe Payment Links for the five public buy buttons.
 *
 * Every value stays empty until Nic creates the live link. Do not invent a
 * URL. Do not reuse a No Bull Ship price or payment link. Accountability
 * business coaching is a different product.
 *
 * When a value is empty, the buy button is still a real link to #checkout.
 * Do not print a placeholder on the page.
 *
 * Tax on every link, once created: exclusive of VAT.
 *
 * Links to create later:
 * - lunch-and-learn: €999, one payment, 20-minute virtual lunch and learn.
 * - executive-workflow-upgrade: €1,499, one payment, one person.
 * - accountability-coaching: €399 every month, a recurring price. Not the
 *   No Bull Ship Private Accountabull Coach.
 * - team-workflow-upgrade and my-week-with-grok-bot: no Stripe link. These
 *   are sold by enquiry (see ENQUIRY_OFFERS below). Keep their values empty.
 */

export const CHECKOUT_LINKS = {
  "lunch-and-learn": "",
  "team-workflow-upgrade": "",
  "executive-workflow-upgrade": "",
  "my-week-with-grok-bot": "",
  "accountability-coaching": "",
} as const;

export type CheckoutOffer = keyof typeof CHECKOUT_LINKS;

/**
 * Offers sold by enquiry, not Stripe (Nic, 17 Nov 2026: "Stripe for coaching
 * and Exec, enquiry form for Team and My Week"). Their buttons open the
 * session request form, which emails Nic through the same FormSubmit
 * endpoint as /contact. The value is the short code sent as the hidden
 * `offer` field.
 */
export const ENQUIRY_OFFERS = {
  "team-workflow-upgrade": "team",
  "my-week-with-grok-bot": "my-week",
} as const satisfies Partial<Record<CheckoutOffer, string>>;

export type EnquiryOffer = keyof typeof ENQUIRY_OFFERS;

export const SESSION_REQUEST_PATH = "/workshops/request-a-session";

export const SESSION_REQUEST_LABEL = "Request a session";

export function isEnquiryOffer(offer: CheckoutOffer): offer is EnquiryOffer {
  return offer in ENQUIRY_OFFERS;
}

export function sessionRequestHref(offer: EnquiryOffer): string {
  return `${SESSION_REQUEST_PATH}?offer=${ENQUIRY_OFFERS[offer]}`;
}

/**
 * Where a buy button goes. Enquiry offers go to the request form.
 * Stripe offers return their Payment Link, or "" until it exists.
 */
export function checkoutHref(offer: CheckoutOffer): string {
  if (isEnquiryOffer(offer)) return sessionRequestHref(offer);
  return CHECKOUT_LINKS[offer].trim();
}
