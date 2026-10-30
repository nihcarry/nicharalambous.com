/**
 * Decision Trackr checkout cancelled at /decision-trackr/cancelled
 *
 * PLACEHOLDER COPY lives in ../copy.ts.
 * Static route. next-sitemap includes it from the build output.
 */
import type { Metadata } from "next";
import { Section } from "@/components/section";
import { dtCopy } from "../copy";

export const metadata: Metadata = {
  title: "Checkout cancelled",
  description: "No Decision Trackr payment was taken. You can return to Team pricing.",
  alternates: {
    canonical: "https://nicharalambous.com/decision-trackr/cancelled",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    type: "website",
    title: "Checkout cancelled | Nic Haralambous",
    description: "No Decision Trackr payment was taken. You can return to Team pricing.",
    url: "https://nicharalambous.com/decision-trackr/cancelled",
  },
};

export default function DecisionTrackrCancelledPage() {
  return (
    <div className="page-bg">
      <Section as="article" width="content">
        <h1 className="text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">
          {dtCopy.cancelledTitle}
        </h1>
        <p className="mt-6 text-base leading-relaxed text-brand-700">
          {dtCopy.cancelledBody}
        </p>
        <p className="mt-8 flex flex-col items-start gap-3 text-sm font-semibold sm:flex-row sm:gap-6">
          <a href="/decision-trackr#buy" className="text-accent-600 hover:underline">
            {dtCopy.cancelledBack}
          </a>
          <a
            href="/decision-trackr/privacy"
            className="text-accent-600 hover:underline"
          >
            {dtCopy.privacy}
          </a>
        </p>
      </Section>
    </div>
  );
}
