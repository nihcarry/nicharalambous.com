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
 * - my-week-with-grok-bot: €2,999, one payment, one session, up to 20 people.
 * - accountability-coaching: €399 every month, a recurring price. Not the
 *   No Bull Ship Private Accountabull Coach.
 * - team-workflow-upgrade: no URL yet. Do not create this link in code.
 *   When it is created: a €4,999 base (up to 8 people) plus an optional
 *   €499 extra-seat line with quantity 0 to 2, so the room can reach 10.
 *   Tax exclusive. One company per booking. No discount or promo code.
 */

export const CHECKOUT_LINKS = {
  "lunch-and-learn": "",
  "team-workflow-upgrade": "",
  "executive-workflow-upgrade": "",
  "my-week-with-grok-bot": "",
  "accountability-coaching": "",
} as const;

export type CheckoutOffer = keyof typeof CHECKOUT_LINKS;

/** Empty string until the matching Payment Link exists. */
export function checkoutHref(offer: CheckoutOffer): string {
  return CHECKOUT_LINKS[offer].trim();
}
