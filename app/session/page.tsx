/**
 * Consulting Session Page — /session
 *
 * Minimal product page for booking a 1-on-1 consulting session with Nic.
 * Links out to a Stripe Payment Link for checkout.
 *
 * JSON-LD: Product
 */
import type { Metadata } from "next";
import { Section } from "@/components/section";
import { JsonLd } from "@/components/json-ld";
import { CTAButton } from "@/components/cta-button";
import { ArrowRight } from "lucide-react";

const STRIPE_PAYMENT_LINK = "https://book.stripe.com/28E3cv3B00to8KS41Q2wU00";

export const metadata: Metadata = {
  title: "Book a Consulting Session",
  description:
    "Book a 1-on-1 consulting session with Nic Haralambous. Get expert guidance on startups, product strategy, AI integration, and scaling your business.",
  alternates: { canonical: "https://nicharalambous.com/session" },
  openGraph: {
    type: "website",
    title: "Book a Consulting Session | Nic Haralambous",
    description:
      "1-on-1 consulting with a 4x exited entrepreneur. Startups, product, AI, and growth.",
    url: "https://nicharalambous.com/session",
  },
};

function sessionProductJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "1-on-1 Consulting Session with Nic Haralambous",
    description:
      "A focused consulting session covering startups, product strategy, AI integration, team building, or scaling your business.",
    url: "https://nicharalambous.com/session",
    brand: {
      "@type": "Person",
      name: "Nic Haralambous",
      url: "https://nicharalambous.com",
    },
    offers: {
      "@type": "Offer",
      url: STRIPE_PAYMENT_LINK,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };
}

export default function SessionPage() {
  return (
    <div className="page-bg">
      <JsonLd data={sessionProductJsonLd()} />

      <Section width="content">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <h1 className="heading-display-stroke-sm text-5xl text-brand-900 sm:text-6xl">
              Book a Consulting Session
            </h1>
            <p className="mt-4 text-lg text-brand-600">
              A focused 1-on-1 session with Nic to tackle your biggest
              challenges — startups, product strategy, AI integration, team
              building, or scaling your business.
            </p>
          </div>

          <div className="mt-12 rounded-2xl border border-brand-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-brand-900">
              What you get
            </h2>
            <ul className="mt-4 space-y-3 text-brand-700">
              <li className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-600">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                </span>
                <span>60-minute video call with Nic</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-600">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                </span>
                <span>Tailored advice from 20+ years of building tech businesses</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-600">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                </span>
                <span>Actionable takeaways you can implement immediately</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-600">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                </span>
                <span>Follow-up summary with notes and resources</span>
              </li>
            </ul>

            <div className="mt-8 border-t border-brand-100 pt-8 text-center">
              <CTAButton
                href={STRIPE_PAYMENT_LINK}
                external
                icon={<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />}
              >
                Book Your Session
              </CTAButton>
              <p className="mt-3 text-sm text-brand-400">
                Secure checkout via Stripe. You&apos;ll receive booking
                confirmation and scheduling details by email.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
