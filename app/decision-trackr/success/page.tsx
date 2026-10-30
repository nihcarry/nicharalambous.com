/**
 * Decision Trackr checkout success at /decision-trackr/success
 *
 * PLACEHOLDER COPY lives in ../copy.ts.
 * Static route. next-sitemap includes it from the build output.
 */
import type { Metadata } from "next";
import { Section } from "@/components/section";
import { dtCopy } from "../copy";
import { FIGMA_PLUGIN_URL } from "../pricing";

export const metadata: Metadata = {
  title: "Payment received",
  description:
    "Your Decision Trackr licence key arrives by email. Paste it into the plugin in Figma.",
  alternates: {
    canonical: "https://nicharalambous.com/decision-trackr/success",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    type: "website",
    title: "Payment received | Nic Haralambous",
    description:
      "Your Decision Trackr licence key arrives by email. Paste it into the plugin in Figma.",
    url: "https://nicharalambous.com/decision-trackr/success",
  },
};

export default function DecisionTrackrSuccessPage() {
  return (
    <div className="page-bg">
      <Section as="article" width="content">
        <h1 className="text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">
          {dtCopy.successTitle}
        </h1>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-700">
          {dtCopy.successBody.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <p className="mt-8 flex flex-col items-start gap-3 text-sm font-semibold sm:flex-row sm:gap-6">
          <a href="/decision-trackr" className="text-accent-600 hover:underline">
            {dtCopy.successBack}
          </a>
          <a
            href={FIGMA_PLUGIN_URL}
            className="text-accent-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {dtCopy.getPlugin}
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
