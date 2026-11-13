import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { CompareTable } from "@/components/site/compare-table";
import { CheckoutButton, IntroCallLink } from "@/components/site/checkout-cta";
import { StickyBookBar } from "@/components/site/sticky-book";
import { breadcrumbJsonLd } from "@/lib/metadata";
import { PATHS } from "@/lib/offers";

const PATH = PATHS.workshops;
const URL = `https://www.nicharalambous.com${PATH}`;

export const metadata: Metadata = {
  title: "Grok Bot workshops",
  description:
    "Three virtual Grok Bot sessions: My week with Grok Bot at €2,999, the Team Workflow Upgrade Session from €4,999, and the Executive Workflow Upgrade Session at €1,499. All ex VAT.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Grok Bot workshops | Nic Haralambous",
    description: "Watch, build, or upgrade. Virtual by default.",
    url: URL,
  },
};

export default function WorkshopsPage() {
  return (
    <div className="v3 has-sticky" data-no-orphan-opt-out="true">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Workshops", path: PATH },
        ])}
      />
      <section className="hero hub pd-spotlight" style={{ ["--hub" as string]: "url(/v3/new/hub-15.jpg)" }}>
        <div className="hub-bg" aria-hidden="true" />
        <div className="glow" aria-hidden="true" />
        <div className="wrap">
          <div className="copy">
            <h1>Grok Bot workshops</h1>
            <p className="say">
              Three sessions. My week with Grok Bot, the Team Workflow Upgrade Session and the Executive Workflow Upgrade Session. Virtual by default. In person is possible, with travel extra.
            </p>
            <div className="acts" style={{ marginTop: 8 }}>
              <a className="btn btn-wrap" href="#formats">
                Pick a session
              </a>
              <IntroCallLink />
            </div>
          </div>
        </div>
      </section>
      <section className="dark pd-calendar" id="formats">
        <div className="wrap">
          <h2 style={{ margin: "20px 0 18px" }}>Pick the session that fits</h2>
          <div className="formats">
            <div className="fmt has-fstk">
              <img className="fmt-stk" src="/v3/new/sticker-thumbs.png" alt="" />
              <h3>My week with Grok Bot</h3>
              <p>A show-and-tell: I take your team through my own Grok Bot setup, how I work with it and what&apos;s out there to do.</p>
              <ul>
                <li>90 minutes</li>
                <li>Up to 20 people</li>
                <li>Virtual by default</li>
              </ul>
              <div className="price">
                €2,999<span>per session, ex VAT</span>
              </div>
              <CheckoutButton id="buy-my-week-hub" offer="my-week-with-grok-bot" label="Buy My week with Grok Bot" />
              <a className="quiet-link fmt-see" href="/workshops/my-week-with-grok-bot">
                See the session
              </a>
            </div>
            <div className="fmt">
              <h3>Team Workflow Upgrade Session</h3>
              <p>A hands-on workshop. Each person builds their own workflow in Grok Bot.</p>
              <ul>
                <li>2 hours</li>
                <li>Up to 8 senior leaders from one company</li>
                <li>€499 per extra seat, up to 10</li>
              </ul>
              <div className="price">
                €4,999<span>per session, up to 8 people, ex VAT</span>
              </div>
              <CheckoutButton id="buy-team-hub" offer="team-workflow-upgrade" label="Buy the team session" />
              <a className="quiet-link fmt-see" href="/workshops/team-workflow-upgrade">
                See the session
              </a>
            </div>
            <div className="fmt">
              <h3>Executive Workflow Upgrade Session</h3>
              <p>For the CEO: a Grok Bot introduction, a review of your workflow and an upgrade.</p>
              <ul>
                <li>2 hours</li>
                <li>One to one</li>
                <li>Virtual by default</li>
              </ul>
              <div className="price">
                €1,499<span>one to one, ex VAT</span>
              </div>
              <CheckoutButton id="buy-exec-hub" offer="executive-workflow-upgrade" label="Buy your session" />
              <a className="quiet-link fmt-see" href="/workshops/executive-workflow-upgrade">
                See the session
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="p-pen" style={{ background: "var(--paper2)" }}>
        <div className="wrap">
          <h2 style={{ margin: "20px 0 22px" }}>How the sessions compare</h2>
          <CompareTable />
        </div>
      </section>
      <div className="ip pd-calendar">
        <div className="wrap">
          <span>
            <b>Accountability business coaching.</b> €399 a month, ex VAT. Two calls a month, plus chat in between.
          </span>
          <a className="link" href="/coaching" style={{ color: "#fff" }}>
            See coaching
          </a>
        </div>
      </div>
      <section className="dark pd-cta">
        <div className="wrap">
          <div className="final op">
            <h2>Not sure which one?</h2>
            <p className="final-sub">Book a free 20-minute intro call and we&apos;ll pick the session that fits.</p>
            <div className="acts" style={{ justifyContent: "center", marginTop: 32 }}>
              <IntroCallLink />
            </div>
          </div>
        </div>
      </section>
      <StickyBookBar title="Grok Bot workshops" detail="From €1,499, ex VAT" href="#formats" label="See sessions" id="hub-sticky" />
    </div>
  );
}
