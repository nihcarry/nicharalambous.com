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
import { ArrowRight, Crosshair } from "lucide-react";

const STRIPE_PAYMENT_LINK = "https://book.stripe.com/28E3cv3B00to8KS41Q2wU00";

export const metadata: Metadata = {
  title: "Pick Nic's Brain",
  description:
    "Book a 1-on-1 consulting session with Nic Haralambous. Get expert guidance on startups, product strategy, AI integration, and scaling your business.",
  alternates: { canonical: "https://nicharalambous.com/session" },
  openGraph: {
    type: "website",
    title: "Pick Nic's Brain | Nic Haralambous",
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
              Pick Nic's Brain
            </h1>
            <p className="mt-4 text-lg text-brand-600">
              A focused 1-on-1 session with Nic to tackle your biggest
              challenges — startups, product strategy, AI integration, team
              building, or scaling your business.
            </p>
          </div>

          <div className="mt-12 flex flex-col border border-brand-900 bg-white p-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs tracking-widest text-accent-600">
                SESSION_01
              </span>
              <Crosshair className="h-4 w-4 text-accent-600" aria-hidden="true" />
            </div>
            <div className="my-3 border-t border-brand-200" />

            <h2 className="text-2xl font-extrabold uppercase leading-tight tracking-tight text-brand-900">
              What you get
            </h2>
            <p className="mt-1 font-mono text-sm text-accent-600">
              €250 per session
            </p>

            <ul className="mt-4 space-y-3">
              {[
                "60-minute video call with Nic",
                "Tailored advice from 20+ years of building tech businesses",
                "Actionable takeaways you can implement immediately",
                "Follow-up summary with notes and resources",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-[7px] block h-2 w-2 shrink-0 bg-accent-600" />
                  <span className="font-mono text-sm leading-relaxed text-brand-700">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6">
              <div className="border-t border-brand-200 pt-4 text-center">
                <CTAButton
                  href={STRIPE_PAYMENT_LINK}
                  external
                  icon={<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />}
                >
                  Book Your Session — €250
                </CTAButton>
                <p className="mt-3 font-mono text-xs text-brand-400">
                  Secure checkout via Stripe. You&apos;ll receive booking
                  confirmation and scheduling details by email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
