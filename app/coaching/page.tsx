import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { CheckoutButton, IntroCallLink } from "@/components/site/checkout-cta";
import { StickyBookBar } from "@/components/site/sticky-book";
import { breadcrumbJsonLd } from "@/lib/metadata";
import { PATHS, coachingJsonLd } from "@/lib/offers";

const PATH = PATHS.coaching;
const URL = `https://www.nicharalambous.com${PATH}`;

export const metadata: Metadata = {
  title: "Accountability business coaching",
  description:
    "Two 60-minute calls a month with me, plus ongoing accountability and chat support in between. €399 a month, ex VAT. Pay-what-you-can-afford coaching stays open as an application.",
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    title: "Accountability business coaching | Nic Haralambous",
    description: "Business coaching that holds you to what you said you'd do. €399 a month, ex VAT.",
    url: URL,
  },
};

export default function CoachingPage() {
  return (
    <div className="v3 has-sticky" data-no-orphan-opt-out="true">
      <JsonLd data={coachingJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Accountability business coaching", path: PATH },
        ])}
      />
      <section className="hero op pd-spotlight">
        <div className="glow" aria-hidden="true" />
        <div className="wrap">
          <div className="copy">
            <h1 className="long">
              Business <em>coaching</em> that holds you to what you said you&apos;d do
            </h1>
            <p className="say">
              Two 60-minute calls a month with me, plus ongoing accountability and chat support in between. €399 a month, ex VAT.
            </p>
            <div className="book" id="book">
              <div className="row">
                <div>
                  <h2>Accountability business coaching</h2>
                  <p>A sounding board for the decisions in your business, and someone who asks whether you did what you said you would.</p>
                </div>
                <div className="price">
                  €399
                  <small>a month, ex VAT</small>
                </div>
              </div>
              <div className="acts">
                <CheckoutButton id="buy-accountability-coaching" offer="accountability-coaching" label="Start coaching, €399 a month" />
                <IntroCallLink />
              </div>
            </div>
            <div className="meter">
              <div>
                <b>2 calls</b>every month
              </div>
              <div>
                <b>60 minutes</b>each call
              </div>
              <div>
                <b>Chat support</b>between calls
              </div>
            </div>
          </div>
          <div className="photo">
            <img className="ph-coach" src="/v3/new/hero-coach-01.webp" alt="Nic Haralambous" />
          </div>
        </div>
      </section>
      <div className="ip pd-calendar">
        <div className="wrap">
          <span>
            <b>If €399 a month isn&apos;t possible right now,</b> you can apply for pay-what-you-can-afford coaching instead.
          </span>
          <a className="link" href="#pwyca" style={{ color: "#fff" }}>
            Apply for pay-what-you-can-afford coaching
          </a>
        </div>
      </div>
      <section className="p-pen">
        <div className="wrap body-copy">
          <p className="lead">
            I think the hard part of running a business is rarely knowing what to do next. It&apos;s doing it, week after week, when nobody is checking and the urgent stuff keeps pushing the important stuff to next month.
          </p>
          <p className="body">
            Twice a month we get on a call for an hour and I&apos;m your sounding board. We look at the business you&apos;re building, the decisions in front of you and how it all fits with the life you want to live. You leave each call with the things you&apos;ve committed to. Between calls I hold you to them, and when something comes up you can message me instead of sitting on it for two weeks.
          </p>
          <p className="body">
            I&apos;ve been building businesses since I was 16. I&apos;ve sold four of them, written three books and spent more than 20 years learning through failure and success. I&apos;ll tell you what I think, and I&apos;ll ask whether you did what you said you would.
          </p>
          <p className="body">
            If €399 a month isn&apos;t possible right now, you can apply for pay-what-you-can-afford coaching instead. I keep that to 5 clients a month, and paying €0 is totally fine.
          </p>
        </div>
      </section>
      <section className="p-lightbulb" style={{ background: "var(--paper2)", borderTop: "1px solid #D8D1C2" }}>
        <div className="wrap">
          <h2 style={{ margin: "20px 0 0" }}>What&apos;s included</h2>
          <div className="incl">
            <div>
              <span className="mono">01</span>
              <p>Two 60-minute calls a month with me</p>
            </div>
            <div>
              <span className="mono">02</span>
              <p>Ongoing accountability between calls</p>
            </div>
            <div>
              <span className="mono">03</span>
              <p>Chat support when something comes up</p>
            </div>
            <div>
              <span className="mono">04</span>
              <p>€399 a month, ex VAT</p>
            </div>
          </div>
        </div>
      </section>
      <section className="p-pen">
        <div className="wrap">
          <h2 style={{ margin: "20px 0 22px" }}>Who it&apos;s for</h2>
          <p className="body">
            Founders, CEOs and entrepreneurs who want a sounding board and accountability from an experienced business builder. You make the decisions in your business, and you want someone outside it to think them through with you and hold you to what you decide.
          </p>
        </div>
      </section>
      <section className="p-pen" style={{ background: "var(--paper2)", borderTop: "1px solid #D8D1C2" }}>
        <div className="wrap">
          <h2 style={{ margin: "20px 0 0" }}>FAQ</h2>
          <div className="faq">
            <details>
              <summary>What do we talk about on the calls?</summary>
              <p>
                Your business, the decisions you&apos;re stuck on, what you said you&apos;d do last time and whether you did it. Business and life overlap, so we can talk about both.
              </p>
            </details>
            <details>
              <summary>What if I can&apos;t afford €399 a month?</summary>
              <p>Apply for pay-what-you-can-afford coaching. I take up to 5 people a month, and paying €0 is fine.</p>
            </details>
          </div>
        </div>
      </section>
      <section className="p-pen" id="pwyca" style={{ background: "var(--paper2)", borderTop: "1px solid #D8D1C2" }}>
        <div className="wrap">
          <article className="plain-card">
            <h2 style={{ fontSize: 22 }}>Pay What You Can Afford</h2>
            <p>Application-based coaching</p>
            <p>
              Same coaching intent, at a price you can actually afford. Paying €0 is totally fine. I limit this to <b>5 clients per month</b>, which is why there&apos;s an application.
            </p>
            <p style={{ marginTop: 20 }}>
              <a className="btn ghost" href="/coaching/apply">
                Apply for pay-what-you-can-afford coaching
              </a>
            </p>
          </article>
        </div>
      </section>
      <section className="p-person">
        <div className="wrap bio">
          <div className="pic">
            <img src="/v3/new/bio-coach-11.jpg" alt="Nic Haralambous, portrait" width={1000} height={1250} />
            <img className="px pxb" src="/v3/px/Nic_archeo_16bit.png" alt="" width={182} height={220} />
          </div>
          <div>
            <h2 style={{ margin: "20px 0 22px" }}>I&apos;ve been building businesses since I was 16</h2>
            <p className="lead" style={{ color: "#4b4f5a" }}>
              I&apos;ve sold four of them, written three books and spent more than 20 years learning through failure and success.
            </p>
            <div className="nums">
              <div>
                <b>4</b>
                <span>startup exits</span>
              </div>
              <div>
                <b>3</b>
                <span>books</span>
              </div>
              <div>
                <b>20+</b>
                <span>years building</span>
              </div>
              <div>
                <b>16+</b>
                <span>years speaking</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="dark pd-cta">
        <div className="wrap">
          <div className="final op">
            <img className="px pxf op" src="/v3/px/Nic_Ancient_greece_16bit.png" alt="" width={226} height={280} />
            <h2>Accountability business coaching</h2>
            <p className="final-sub">€399 a month, ex VAT.</p>
            <div className="acts" style={{ justifyContent: "center", marginTop: 32 }}>
              <CheckoutButton id="buy-coaching-final" offer="accountability-coaching" label="Start coaching, €399 a month" />
              <IntroCallLink />
            </div>
            <p style={{ marginTop: 18, textAlign: "center" }}>
              <a className="quiet-link" href="/coaching/apply">
                Apply for pay-what-you-can-afford coaching
              </a>
            </p>
          </div>
        </div>
      </section>
      <StickyBookBar
        title="Accountability coaching"
        detail="€399 a month"
        offer="accountability-coaching"
        label="Start"
        id="buy-coaching-sticky"
      />
    </div>
  );
}
