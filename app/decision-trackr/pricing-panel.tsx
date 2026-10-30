"use client";

/**
 * PLACEHOLDER COPY is imported from ./copy.
 * Prices come from ./pricing (hypothesis constants, env overrides).
 */

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { CTAButton } from "@/components/cta-button";
import { dtCopy } from "./copy";
import {
  DT_MIN_SEATS,
  FIGMA_PLUGIN_URL,
  type BillingInterval,
  buildCheckoutPayload,
  formatEur,
  isCheckoutEmailValid,
  parseSeatCount,
  periodLabel,
  totalEur,
} from "./pricing";

const inputStyles =
  "mt-1 block w-full border border-brand-300 bg-white px-4 py-3 text-sm text-brand-900 placeholder:text-brand-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20";

type PricingPanelProps = {
  monthlyPriceEur: number | null;
  yearlyPriceEur: number | null;
  apiBase: string | null;
};

function FeatureList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-[7px] block h-2 w-2 shrink-0 bg-accent-600" />
          <span className="text-sm leading-relaxed text-brand-700">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function PricingPanel({
  monthlyPriceEur,
  yearlyPriceEur,
  apiBase,
}: PricingPanelProps) {
  const [interval, setInterval] = useState<BillingInterval>("month");
  const [seatsInput, setSeatsInput] = useState(String(DT_MIN_SEATS));
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unitPrice = interval === "month" ? monthlyPriceEur : yearlyPriceEur;
  const seats = parseSeatCount(seatsInput);
  const priceReady = unitPrice != null;
  const checkoutReady = apiBase != null && priceReady && seats != null;
  const period = periodLabel(interval);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!apiBase || unitPrice == null) return;

    const seatCount = parseSeatCount(seatsInput);
    if (seatCount == null) {
      setError(dtCopy.seatsError);
      return;
    }
    if (!isCheckoutEmailValid(email)) {
      setError(dtCopy.emailError);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${apiBase}/checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(buildCheckoutPayload(seatCount, interval, email)),
      });

      const data = (await response.json().catch(() => null)) as
        | { url?: unknown }
        | null;
      const url = data && typeof data.url === "string" ? data.url : "";
      if (!response.ok || !/^https?:\/\//i.test(url)) {
        setError(dtCopy.checkoutError);
        setSubmitting(false);
        return;
      }

      window.location.assign(url);
    } catch {
      setError(dtCopy.checkoutError);
      setSubmitting(false);
    }
  }

  const fromAmount =
    unitPrice == null ? null : totalEur(unitPrice, DT_MIN_SEATS);
  const liveTotal = unitPrice != null && seats != null ? totalEur(unitPrice, seats) : null;

  return (
    <div>
      <div
        role="group"
        aria-label="Billing period"
        className="inline-flex border border-brand-900"
      >
        {(
          [
            ["month", "Monthly"],
            ["year", "Yearly"],
          ] as const
        ).map(([value, label]) => {
          const selected = interval === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={selected}
              onClick={() => setInterval(value)}
              className={`px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 ${
                selected
                  ? "bg-accent-600 text-white"
                  : "bg-white text-brand-800 hover:bg-brand-100"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <article className="flex flex-col border border-brand-900 bg-white p-6">
          <p className="font-mono text-xs text-accent-600">{dtCopy.freeEyebrow}</p>
          <div className="my-3 border-t border-brand-200" />
          <h3 className="text-2xl font-bold tracking-tight text-brand-900">
            {dtCopy.freeName}
          </h3>
          <p className="mt-1 font-mono text-sm text-accent-600">Free</p>
          <FeatureList items={dtCopy.freeFeatures} />
          <div className="mt-auto pt-6">
            <div className="border-t border-brand-200 pt-4">
              <CTAButton
                href={FIGMA_PLUGIN_URL}
                external
                variant="secondary"
                className="w-full sm:w-auto"
                icon={<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />}
              >
                {dtCopy.useFree}
              </CTAButton>
            </div>
          </div>
        </article>

        <article className="flex flex-col border border-brand-900 bg-white p-6">
          <p className="font-mono text-xs text-accent-600">{dtCopy.teamEyebrow}</p>
          <div className="my-3 border-t border-brand-200" />
          <h3 className="text-2xl font-bold tracking-tight text-brand-900">
            {dtCopy.teamName}
          </h3>
          {unitPrice == null || fromAmount == null ? (
            <p className="mt-1 text-sm font-semibold text-brand-900">
              {dtCopy.priceComingSoon}
            </p>
          ) : (
            <>
              <p className="mt-1 font-mono text-sm text-accent-600">
                {formatEur(unitPrice)} per seat per {interval === "month" ? "month" : "year"}
              </p>
              <p className="mt-1 text-sm text-brand-700">
                From {formatEur(fromAmount)} {period} per team
              </p>
            </>
          )}
          <FeatureList items={dtCopy.teamFeatures} />
        </article>
      </div>

      <form
        id="buy"
        onSubmit={handleSubmit}
        className="mt-6 border border-brand-900 bg-white p-6 sm:p-8"
      >
        <h3 className="text-2xl font-bold tracking-tight text-brand-900">
          {dtCopy.buyTitle}
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-700">
          {dtCopy.outsideFigma}
        </p>

        <div className="mt-6 max-w-xs">
          <label htmlFor="dt-seats" className="block text-sm font-medium text-brand-700">
            Seats
          </label>
          <input
            id="dt-seats"
            name="seats"
            type="number"
            inputMode="numeric"
            min={DT_MIN_SEATS}
            step={1}
            required
            value={seatsInput}
            aria-invalid={seats == null}
            aria-describedby="dt-seats-hint"
            onChange={(event) => setSeatsInput(event.target.value)}
            className={inputStyles}
          />
          <p id="dt-seats-hint" className="mt-2 text-sm text-brand-600">
            {seats == null ? dtCopy.seatsError : dtCopy.minSeatsNote}
          </p>
        </div>

        <div className="mt-6" aria-live="polite">
          {unitPrice == null || seats == null || liveTotal == null ? (
            <p className="text-2xl font-bold tracking-tight text-brand-900">
              {unitPrice == null ? dtCopy.priceComingSoon : dtCopy.seatsError}
            </p>
          ) : (
            <>
              <p className="font-mono text-3xl font-bold tracking-tight text-brand-900">
                {formatEur(liveTotal)}
              </p>
              <p className="mt-1 text-sm text-brand-700">
                {period} for {seats} seats, at {formatEur(unitPrice)} per seat
              </p>
              <p className="mt-2 text-xs text-brand-500">{dtCopy.vatNote}</p>
            </>
          )}
        </div>

        <div className="mt-6 max-w-md">
          <label htmlFor="dt-email" className="block text-sm font-medium text-brand-700">
            {dtCopy.emailLabel}
          </label>
          <input
            id="dt-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputStyles}
          />
          <p className="mt-2 text-sm text-brand-600">{dtCopy.emailHint}</p>
        </div>

        {error ? (
          <p role="alert" className="mt-4 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="mt-6">
          <button
            type="submit"
            disabled={!checkoutReady || submitting}
            aria-busy={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-none bg-accent-600 px-6 py-3 text-base font-semibold text-white shadow-[var(--shadow-cta)] transition-colors duration-200 hover:bg-accent-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 disabled:cursor-not-allowed disabled:bg-brand-300 disabled:shadow-none sm:w-auto"
          >
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            {submitting ? dtCopy.buyPending : dtCopy.buyLabel}
          </button>
          {apiBase == null ? (
            <p className="mt-3 text-sm text-brand-600">{dtCopy.checkoutUnavailable}</p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
