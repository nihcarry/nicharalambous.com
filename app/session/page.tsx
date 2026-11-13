import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { CheckoutButton, IntroCallLink } from "@/components/site/checkout-cta";
import { breadcrumbJsonLd } from "@/lib/metadata";
import { PATHS, coachingJsonLd } from "@/lib/offers";
import { PwycaForm } from "./pwyca-form";

const URL = "https://www.nicharalambous.com/session";

export const metadata: Metadata = {
  title: "Accountability business coaching",
  description:
    "Two 60-minute calls a month with me, plus ongoing accountability and chat support in between. €399 a month, ex VAT. Pay-what-you-can-afford coaching stays open as an application.",
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    title: "Accountability business coaching | Nic Haralambous",
    description:
      "Business coaching that holds you to what you said you'd do. €399 a month, ex VAT.",
    url: URL,
  },
};

export default function SessionPage() {
  return (
    <div className="v3 p-person">
      <JsonLd data={coachingJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Accountability business coaching", path: PATHS.coaching },
        ])}
      />
      <section>
        <div className="wrap story">
          <h1>Business coaching that holds you to what you said you&apos;d do</h1>
          <p className="lead">
            Two 60-minute calls a month with me, plus ongoing accountability and chat support in between. €399 a month, ex VAT.
          </p>
          <p>
            I think the hard part of running a business is rarely knowing what to do next. It&apos;s doing it, week after week, when nobody is checking and the urgent stuff keeps pushing the important stuff to next month.
          </p>
          <p>
            Twice a month we get on a call for an hour and I&apos;m your sounding board. We look at the business you&apos;re building, the decisions in front of you and how it all fits with the life you want to live. You leave each call with the things you&apos;ve committed to. Between calls I hold you to them, and when something comes up you can message me instead of sitting on it for two weeks.
          </p>
          <p>
            I&apos;ve been building businesses since I was 16. I&apos;ve sold four of them, written three books and spent more than 20 years learning through failure and success. I&apos;ll tell you what I think, and I&apos;ll ask whether you did what you said you would.
          </p>
          <p>
            If €399 a month isn&apos;t possible right now, you can apply for pay-what-you-can-afford coaching instead. I keep that to 5 clients a month, and paying €0 is totally fine.
          </p>

          <h2>What&apos;s included</h2>
          <ul>
            <li>Two 60-minute calls a month with me [TBC: video platform and how calls are booked]</li>
            <li>Ongoing accountability between calls [TBC: what this looks like in practice, for example a weekly check-in]</li>
            <li>Chat support [TBC: which app it runs on, and expected reply times]</li>
            <li>€399 a month, ex VAT [TBC: minimum term or cancel any time]</li>
          </ul>

          <h2>Who it&apos;s for</h2>
          <p>
            Founders, CEOs and entrepreneurs who want a sounding board and accountability from an experienced business builder. You make the decisions in your business, and you want someone outside it to think them through with you and hold you to what you decide.
          </p>

          <h2>FAQ</h2>
          <div className="faq">
            <h3>What do we talk about on the calls?</h3>
            <p>
              Your business, the decisions you&apos;re stuck on, what you said you&apos;d do last time and whether you did it. Business and life overlap, so we can talk about both.
            </p>
            <h3>Is there a minimum commitment?</h3>
            <p>[TBC]</p>
            <h3>What happens if I miss a call?</h3>
            <p>[TBC]</p>
            <h3>Can I just book one session?</h3>
            <p>
              [TBC: the single €200 session and five-pack are being removed. Confirm whether there is any one-off option, or only the monthly coaching and the free intro call]
            </p>
            <h3>What if I can&apos;t afford €399 a month?</h3>
            <p>Apply for pay-what-you-can-afford coaching. I take up to 5 people a month, and paying €0 is fine.</p>
          </div>

          <div className="offer-ctas">
            <CheckoutButton
              id="buy-accountability-coaching"
              offer="accountability-coaching"
              label="Start coaching, €399 a month"
            />
            <IntroCallLink />
            <p>
              <a className="link" href="#pwyca">
                Apply for pay-what-you-can-afford coaching
              </a>
            </p>
          </div>
        </div>
      </section>
      <section id="pwyca">
        <div className="wrap">
          <article className="plain-card">
            <h2>Apply for pay-what-you-can-afford coaching</h2>
            <PwycaForm />
          </article>
        </div>
      </section>
    </div>
  );
}
