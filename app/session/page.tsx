/**
 * Sessions Page (/session)
 *
 * Three offers: Coaching, Brain Picking, and Pay What You Can Afford.
 * Paid offers link out to Stripe Payment Links. PWYCA uses an application form.
 *
 * JSON-LD: Product offers for paid sessions
 */
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Section } from "@/components/section";
import { JsonLd } from "@/components/json-ld";
import { CTAButton } from "@/components/cta-button";
import { ArrowRight, Crosshair, Heart } from "lucide-react";
import { PwycaForm } from "./pwyca-form";

const STRIPE_BRAIN_PICK =
  "https://buy.stripe.com/9B64gzfjI2Bwd187e22wU05";
const STRIPE_COACHING_ONE =
  "https://book.stripe.com/4gM7sL9Zocc6aT02XM2wU06";
const STRIPE_COACHING_FIVE =
  "https://book.stripe.com/eVq28r8Vk4JE6CKbui2wU07";
const INTRO_CALL_LINK = "https://calendar.app.google/EC4CkCZMFhh83b6z6";

export const metadata: Metadata = {
  title: "Book a Session",
  description:
    "Book coaching or a one-off Brain Picking session with Nic Haralambous, or apply for pay-what-you-can-afford coaching.",
  alternates: { canonical: "https://nicharalambous.com/session" },
  openGraph: {
    type: "website",
    title: "Book a Session | Nic Haralambous",
    description:
      "Coaching, Brain Picking, or pay-what-you-can-afford work with Nic Haralambous.",
    url: "https://nicharalambous.com/session",
  },
};

function sessionOffersJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Sessions with Nic Haralambous",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Product",
          name: "Coaching with Nic Haralambous",
          description:
            "Longer-term coaching partnership covering definition of success, business model, life design, mental models, and mental fitness.",
          url: "https://nicharalambous.com/session",
          brand: {
            "@type": "Person",
            name: "Nic Haralambous",
            url: "https://nicharalambous.com",
          },
          offers: [
            {
              "@type": "Offer",
              name: "One coaching session",
              url: STRIPE_COACHING_ONE,
              price: "200",
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
            },
            {
              "@type": "Offer",
              name: "Five coaching sessions",
              url: STRIPE_COACHING_FIVE,
              price: "900",
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
            },
          ],
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Product",
          name: "Pick Nic's Brain",
          description:
            "A one-off session for a short-term fix, perspective shift, or jarring help with a specific problem.",
          url: "https://nicharalambous.com/session",
          brand: {
            "@type": "Person",
            name: "Nic Haralambous",
            url: "https://nicharalambous.com",
          },
          offers: {
            "@type": "Offer",
            url: STRIPE_BRAIN_PICK,
            price: "99",
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
          },
        },
      },
    ],
  };
}

function OfferCard({
  label,
  icon,
  title,
  price,
  description,
  bullets,
  children,
}: {
  label: string;
  icon: ReactNode;
  title: string;
  price: string;
  description: string;
  bullets: string[];
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col border border-brand-900 bg-white p-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs tracking-widest text-accent-600">
          {label}
        </span>
        {icon}
      </div>
      <div className="my-3 border-t border-brand-200" />

      <h2 className="text-2xl font-extrabold uppercase leading-tight tracking-tight text-brand-900">
        {title}
      </h2>
      <p className="mt-1 font-mono text-sm text-accent-600">{price}</p>
      <p className="mt-3 font-mono text-sm leading-relaxed text-brand-700">
        {description}
      </p>

      <ul className="mt-4 space-y-3">
        {bullets.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-[7px] block h-2 w-2 shrink-0 bg-accent-600" />
            <span className="font-mono text-sm leading-relaxed text-brand-700">
              {item}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <div className="border-t border-brand-200 pt-4">{children}</div>
      </div>
    </div>
  );
}

export default function SessionPage() {
  return (
    <div className="page-bg">
      <JsonLd data={sessionOffersJsonLd()} />

      <Section width="wide">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h1 className="heading-display-stroke-sm text-5xl text-brand-900 sm:text-6xl">
              Work with Nic
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-600">
              Longer-term coaching, a one-off Brain Pick for a specific problem,
              or apply for pay-what-you-can-afford coaching.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <OfferCard
              label="COACHING"
              icon={
                <Crosshair
                  className="h-4 w-4 text-accent-600"
                  aria-hidden="true"
                />
              }
              title="Coaching"
              price="€200 per session"
              description="A longer-term partnership. Holistic deep dives into your definition of success, the business you're building, the life you're living, and how they fit together: mental models, mental fitness, lifestyle and business overlap."
              bullets={[
                "One session or five upfront for an ongoing commitment",
                "Business, life and how they come together",
                "Mental models, mental fitness, and how you approach the world",
                "For people who are curious, take action and in the market for a new perspective.",
              ]}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <CTAButton
                  href={STRIPE_COACHING_ONE}
                  external
                  className="w-full sm:w-auto"
                  icon={
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  }
                >
                  Book Nic Now (€200)
                </CTAButton>
                <CTAButton
                  href={STRIPE_COACHING_FIVE}
                  external
                  variant="secondary"
                  className="w-full sm:w-auto"
                  icon={
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  }
                >
                  Book 5 sessions (10% off)
                </CTAButton>
                <p className="font-mono text-xs text-brand-400">
                  Five sessions: €900 total{" "}
                  <span className="line-through">€1,000</span>. Secure checkout
                  via Stripe.
                </p>
                <div className="mt-2 w-full border-t border-brand-200 pt-4">
                  <p className="font-mono text-xs text-brand-500">
                    Not sure yet? Book a free 20-minute intro call.
                  </p>
                  <a
                    href={INTRO_CALL_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center justify-center gap-1.5 font-mono text-sm text-brand-800 underline decoration-brand-300 underline-offset-4 transition-colors hover:text-accent-600 hover:decoration-accent-600"
                  >
                    Intro Call (20 min)
                    <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </OfferCard>

            <OfferCard
              label="BRAIN_PICK"
              icon={
                <Crosshair
                  className="h-4 w-4 text-accent-600"
                  aria-hidden="true"
                />
              }
              title="Brain Picking"
              price="€99 per session"
              description="A one-off session, not meant to repeat. Short-term fix, perspective shift, or oblique/jarring help on a specific problem in business, your startup, or life."
              bullets={[
                "60-minute video call with Nic",
                "One-off: designed for a single sharp intervention",
                "Perspective shift or actionable takeaways you can use immediately",
                "Want more? Continue with one or five coaching sessions",
              ]}
            >
              <div className="text-center">
                <CTAButton
                  href={STRIPE_BRAIN_PICK}
                  external
                  className="w-full sm:w-auto"
                  icon={
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  }
                >
                  Book Your Session (€99)
                </CTAButton>
                <p className="mt-3 font-mono text-xs text-brand-400">
                  Secure checkout via Stripe. You&apos;ll receive booking
                  confirmation and scheduling details by email.
                </p>
              </div>
            </OfferCard>
          </div>

          <div className="mt-6 border border-brand-900 bg-white p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs tracking-widest text-accent-600">
                PWYCA
              </span>
              <Heart
                className="h-4 w-4 text-accent-600"
                aria-hidden="true"
              />
            </div>
            <div className="my-3 border-t border-brand-200" />

            <h2 className="text-2xl font-extrabold uppercase leading-tight tracking-tight text-brand-900">
              Pay What You Can Afford
            </h2>
            <p className="mt-1 font-mono text-sm text-accent-600">
              Application-based coaching
            </p>
            <p className="mt-3 max-w-3xl font-mono text-sm leading-relaxed text-brand-700">
              Same coaching intent: holistic, longer-term work on the life and
              business you want, at a price you can actually afford. Paying €0
              is totally fine. Nic limits this to{" "}
              <strong className="font-bold text-brand-900">
                5 clients per month
              </strong>
              , which is why there&apos;s an application.
            </p>

            <PwycaForm />
          </div>
        </div>
      </Section>
    </div>
  );
}
