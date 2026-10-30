/**
 * Decision Trackr landing and pricing at /decision-trackr
 *
 * PLACEHOLDER COPY lives in ./copy.ts. Prices live in ./pricing.ts.
 * Static route. next-sitemap includes it from the build output.
 * It is not excluded in next-sitemap.config.js.
 */
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { CTAButton } from "@/components/cta-button";
import { Section } from "@/components/section";
import { dtCopy } from "./copy";
import { PricingPanel } from "./pricing-panel";
import {
  FIGMA_PLUGIN_URL,
  resolveApiBase,
  resolveMonthlyPriceEur,
  resolveYearlyPriceEur,
} from "./pricing";

export const metadata: Metadata = {
  title: "Decision Trackr",
  description: dtCopy.description,
  alternates: {
    canonical: "https://nicharalambous.com/decision-trackr",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    title: "Decision Trackr | Nic Haralambous",
    description: dtCopy.description,
    url: "https://nicharalambous.com/decision-trackr",
  },
};

export default function DecisionTrackrPage() {
  return (
    <div className="page-bg">
      <Section as="article" width="wide">
        <div className="mx-auto max-w-5xl">
          <header>
            <h1 className="heading-display text-4xl text-brand-900 sm:text-5xl">
              {dtCopy.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-brand-700">
              {dtCopy.lead}
            </p>
            <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <CTAButton
                href={FIGMA_PLUGIN_URL}
                external
                icon={<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />}
              >
                {dtCopy.getPlugin}
              </CTAButton>
              <a
                href="/decision-trackr/privacy"
                className="text-sm font-semibold text-accent-600 hover:underline"
              >
                {dtCopy.privacy}
              </a>
            </div>
          </header>

          <h2 className="mt-14 text-2xl font-bold tracking-tight text-brand-900">
            {dtCopy.whatItDoesTitle}
          </h2>
          <div className="mt-4 max-w-2xl space-y-4 text-base leading-relaxed text-brand-700">
            {dtCopy.whatItDoes.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <h2 className="mt-14 text-2xl font-bold tracking-tight text-brand-900">
            {dtCopy.plansTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-700">
            {dtCopy.plansIntro}
          </p>

          <div className="mt-8">
            <PricingPanel
              monthlyPriceEur={resolveMonthlyPriceEur()}
              yearlyPriceEur={resolveYearlyPriceEur()}
              apiBase={resolveApiBase()}
            />
          </div>
        </div>
      </Section>
    </div>
  );
}
