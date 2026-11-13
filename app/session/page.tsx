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
import { JsonLd } from "@/components/json-ld";
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
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.nicharalambous.com/session" },
  openGraph: {
    type: "website",
    title: "Book a Session | Nic Haralambous",
    description:
      "Coaching, Brain Picking, or pay-what-you-can-afford work with Nic Haralambous.",
    url: "https://www.nicharalambous.com/session",
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
          url: "https://www.nicharalambous.com/session",
          brand: {
            "@type": "Person",
            name: "Nic Haralambous",
            url: "https://www.nicharalambous.com/",
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
          url: "https://www.nicharalambous.com/session",
          brand: {
            "@type": "Person",
            name: "Nic Haralambous",
            url: "https://www.nicharalambous.com/",
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
  title,
  price,
  description,
  bullets,
  children,
}: {
  title: string;
  price: string;
  description: string;
  bullets: string[];
  children: ReactNode;
}) {
  return (
    <article className="plain-card">
      <h2>{title}</h2>
      <p>{price}</p>
      <p>{description}</p>
      <ul>
        {bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div style={{ marginTop: 20 }}>{children}</div>
    </article>
  );
}

export default function SessionPage() {
  return (
    <div className="v3">
      <JsonLd data={sessionOffersJsonLd()} />

      <section className="p-person">
        <div className="wrap">
          <h1>Work with Nic</h1>
          <p className="lead">
            Longer-term coaching, a one-off Brain Pick for a specific problem, or apply for pay-what-you-can-afford coaching.
          </p>
          <div className="offer-grid" style={{ marginTop: 36 }}>
            <OfferCard
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
              <div>
                <p>
                  <a className="btn" href={STRIPE_COACHING_ONE} target="_blank" rel="noopener noreferrer">
                    Book Nic Now (€200)
                  </a>
                </p>
                <p style={{ marginTop: 12 }}>
                  <a className="btn ghost" href={STRIPE_COACHING_FIVE} target="_blank" rel="noopener noreferrer">
                    Book 5 sessions (10% off)
                  </a>
                </p>
                <p>
                  Five sessions: €900 total <s>€1,000</s>. Secure checkout via Stripe.
                </p>
                <p>
                  Not sure yet? Book a free 20-minute intro call.{" "}
                  <a className="link" href={INTRO_CALL_LINK} target="_blank" rel="noopener noreferrer">
                    Intro Call (20 min)
                  </a>
                </p>
              </div>
            </OfferCard>

            <OfferCard
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
              <div>
                <p>
                  <a className="btn" href={STRIPE_BRAIN_PICK} target="_blank" rel="noopener noreferrer">
                    Book Your Session (€99)
                  </a>
                </p>
                <p>Secure checkout via Stripe. You&apos;ll receive booking confirmation and scheduling details by email.</p>
              </div>
            </OfferCard>
          </div>
        </div>
      </section>
      <section>
        <div className="wrap">
          <article className="plain-card">
            <h2>Pay What You Can Afford</h2>
            <p>Application-based coaching</p>
            <p>
              Same coaching intent: holistic, longer-term work on the life and business you want, at a price you can actually afford. Paying €0 is totally fine. Nic limits this to <b>5 clients per month</b>, which is why there&apos;s an application.
            </p>
            <PwycaForm />
          </article>
        </div>
      </section>
    </div>
  );
}
