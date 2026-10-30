/**
 * Decision Trackr Team prices.
 *
 * HYPOTHESIS: these amounts are a working guess, not a confirmed price.
 * Change them here. Env vars override a constant when set to a positive number:
 *   NEXT_PUBLIC_DT_PRICE_MONTHLY  EUR per seat per month
 *   NEXT_PUBLIC_DT_PRICE_YEARLY   EUR per seat per year
 * A blank env var keeps the constant. A non-numeric or non-positive value
 * resolves to null so the page can show "Price coming soon".
 *
 * NEXT_PUBLIC_DT_API_BASE is the licensing API origin, with no path.
 * Checkout stays disabled while it is unset.
 */

export const DT_PRICE_MONTHLY_EUR = 9;
export const DT_PRICE_YEARLY_EUR = 90;
export const DT_MIN_SEATS = 3;

export const FIGMA_PLUGIN_URL =
  "https://www.figma.com/community/plugin/1432332696794120370";

export type BillingInterval = "month" | "year";

export type CheckoutPayload = {
  seats: number;
  interval: BillingInterval;
  email?: string;
};

/** Blank means "use the hypothesis". Invalid text means "price unknown". */
export function parsePriceOverride(
  raw: string | undefined,
  fallback: number,
): number | null {
  if (raw == null || raw.trim() === "") return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
}

export function resolveMonthlyPriceEur(): number | null {
  return parsePriceOverride(
    process.env.NEXT_PUBLIC_DT_PRICE_MONTHLY,
    DT_PRICE_MONTHLY_EUR,
  );
}

export function resolveYearlyPriceEur(): number | null {
  return parsePriceOverride(
    process.env.NEXT_PUBLIC_DT_PRICE_YEARLY,
    DT_PRICE_YEARLY_EUR,
  );
}

/** Licensing API origin, or null when checkout must stay disabled. */
export function resolveApiBase(): string | null {
  const raw = process.env.NEXT_PUBLIC_DT_API_BASE;
  if (raw == null || raw.trim() === "") return null;
  return raw.trim().replace(/\/$/, "");
}

export function totalEur(unitPrice: number, seats: number): number {
  return Math.round(unitPrice * seats * 100) / 100;
}

export function formatEur(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function periodLabel(interval: BillingInterval): string {
  return interval === "month" ? "a month" : "a year";
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseSeatCount(raw: string): number | null {
  if (!/^\d+$/.test(raw.trim())) return null;
  const seats = Number(raw);
  if (!Number.isInteger(seats) || seats < DT_MIN_SEATS) return null;
  return seats;
}

/** Body for POST /checkout-session. Omits email when blank. */
export function buildCheckoutPayload(
  seats: number,
  interval: BillingInterval,
  email: string,
): CheckoutPayload {
  const trimmed = email.trim();
  const payload: CheckoutPayload = { seats, interval };
  if (trimmed) payload.email = trimmed;
  return payload;
}

export function isCheckoutEmailValid(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed) return true;
  return EMAIL_PATTERN.test(trimmed);
}
