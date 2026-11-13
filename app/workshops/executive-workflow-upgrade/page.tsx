import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { CheckoutButton, IntroCallLink } from "@/components/site/checkout-cta";
import { StickyBookBar } from "@/components/site/sticky-book";
import { breadcrumbJsonLd } from "@/lib/metadata";
import { executiveWorkshopJsonLd, PATHS } from "@/lib/offers";

const PATH = PATHS.executive;
const URL = `https://www.nicharalambous.com${PATH}`;

export const metadata: Metadata = {
  title: "Executive Workflow Upgrade Session",
  description:
    "Two hours, one to one, for the CEO. A Grok Bot introduction, a review of your workflow and an upgrade. €1,499, ex VAT. Virtual by default.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Executive Workflow Upgrade Session | Nic Haralambous",
    description: "Two hours with me, on your own week. €1,499, ex VAT. Virtual by default.",
    url: URL,
  },
};

export default function ExecutiveWorkshopPage() {
  return (
    <div className="v3 has-sticky" data-no-orphan-opt-out="true">
      <JsonLd data={executiveWorkshopJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Workshops", path: PATHS.workshops },
          { name: "Executive Workflow Upgrade Session", path: PATH },
        ])}
      />
      <section className="hero op pd-spotlight">
        <div className="glow" aria-hidden="true" />
        <div className="wrap">
          <div className="copy">
            <h1 className="long">
              Two hours, one to one, to <em>upgrade</em> how you run your week
            </h1>
            <p className="say">
              For CEOs. A Grok Bot introduction, a review of your workflow and an upgrade, in one 2-hour session. €1,499, ex VAT. Virtual by default.
            </p>
            <div className="book" id="book">
              <div className="row">
                <div>
                  <h2>Executive Workflow Upgrade Session</h2>
                  <p>2 hours, one to one with me, virtual by default. In person is possible, with travel extra.</p>
                </div>
                <div className="price">
                  €1,499
                  <small>one to one, ex VAT</small>
                </div>
              </div>
              <div className="acts">
                <CheckoutButton id="buy-executive-workflow-upgrade" offer="executive-workflow-upgrade" label="Buy your executive session" />
                <IntroCallLink />
              </div>
            </div>
            <div className="meter">
              <div>
                <b>2 hours</b>one to one
              </div>
              <div>
                <b>For the CEO</b>your own workflow
              </div>
              <div>
                <b>Virtual</b>by default
              </div>
            </div>
          </div>
          <div className="photo">
            <img className="ph-exec" src="/v3/new/hero-exec-03.webp" alt="Nic Haralambous" />
          </div>
        </div>
      </section>
      <div className="ip pd-calendar">
        <div className="wrap">
          <span>
            <b>Team Workflow Upgrade Session.</b> 2 hours, up to 8 senior leaders, €4,999 per session, ex VAT.
          </span>
          <a className="link" href="/workshops/team-workflow-upgrade" style={{ color: "#fff" }}>
            See the team session
          </a>
        </div>
      </div>
      <section className="p-pen">
        <div className="wrap body-copy">
          <p className="lead">
            If you run the company, you don&apos;t have time to sit in a group workshop while everyone else catches up, and you shouldn&apos;t have to. This is two hours with just you and me.
          </p>
          <p className="body">
            I start with a proper introduction to Grok Bot, so you know what it can do for the way you work. Then we go through your week as it actually runs: where your time goes, what you&apos;re still doing by hand, and what keeps landing back on your desk. Then we upgrade it together, on your real work, so you leave with the changes set up and running.
          </p>
          <p className="body">
            Before we meet, I work with you to set things up, so the two hours go on your week. Ideally I show you, on my own Grok Bot, how it all comes together on your Grok Bot. If you use Claude or ChatGPT, I can adapt to those, so you don&apos;t need to switch tools to attend.
          </p>
          <p className="body">
            I&apos;ve built and sold four companies and spent more than 20 years building technology businesses. I&apos;ll tell you what I think about how you work, and we&apos;ll build the changes while we talk.
          </p>
        </div>
      </section>
      <section className="p-lightbulb" style={{ background: "var(--paper2)", borderTop: "1px solid #D8D1C2" }}>
        <div className="wrap">
          <h2 style={{ margin: "20px 0 0" }}>What&apos;s included</h2>
          <div className="incl">
            <div>
              <span className="mono">01</span>
              <p>2 hours, one to one with me, virtual by default. In person is possible, with travel extra.</p>
            </div>
            <div>
              <span className="mono">02</span>
              <p>Setup before the session, so you&apos;re ready on the day</p>
            </div>
            <div>
              <span className="mono">03</span>
              <p>A Grok Bot introduction</p>
            </div>
            <div>
              <span className="mono">04</span>
              <p>A review of your current workflow</p>
            </div>
            <div>
              <span className="mono">05</span>
              <p>An upgrade, built during the session on your own work</p>
            </div>
          </div>
        </div>
      </section>
      <section className="p-pen">
        <div className="wrap">
          <h2 style={{ margin: "20px 0 22px" }}>Who it&apos;s for</h2>
          <p className="body">
            CEOs, and founders running a company, who want the work done on their own week. It&apos;s one person per session.
          </p>
          <p className="body">If you want your leadership team in the room as well, that&apos;s the Team Workflow Upgrade Session.</p>
        </div>
      </section>
      <section className="p-pen" style={{ background: "var(--paper2)", borderTop: "1px solid #D8D1C2" }}>
        <div className="wrap">
          <h2 style={{ margin: "20px 0 0" }}>FAQ</h2>
          <div className="faq">
            <details>
              <summary>Do I need to know Grok Bot already?</summary>
              <p>No. The session starts with an introduction, and I work with you before the session to set things up.</p>
            </details>
            <details>
              <summary>We use Claude or ChatGPT. Do I need to switch?</summary>
              <p>No. I can adapt to those. Ideally I show you, on my own Grok Bot, how it all comes together on your Grok Bot.</p>
            </details>
            <details>
              <summary>Can I bring someone from my team?</summary>
              <p>This session is for one person. For up to 8 of your senior leaders (10 with extra seats), book the Team Workflow Upgrade Session.</p>
            </details>
            <details>
              <summary>Is it virtual or in person?</summary>
              <p>Virtual by default. In person is possible, with travel extra.</p>
            </details>
          </div>
        </div>
      </section>
      <section className="dark pd-calendar" id="formats">
        <div className="wrap">
          <h2 style={{ margin: "20px 0 18px" }}>Three ways to work with Grok Bot</h2>
          <div className="formats">
            <div className="fmt">
              <h3>My week with Grok Bot</h3>
              <p>A show-and-tell of my own setup, for up to 20 people.</p>
              <div className="price">
                €2,999<span>per session, ex VAT</span>
              </div>
              <CheckoutButton id="buy-my-week-on-exec" offer="my-week-with-grok-bot" label="Buy My week with Grok Bot" />
              <a className="quiet-link fmt-see" href="/workshops/my-week-with-grok-bot">
                See the session
              </a>
            </div>
            <div className="fmt">
              <h3>Team Workflow Upgrade Session</h3>
              <p>Up to 8 senior leaders build their own workflows.</p>
              <div className="price">
                €4,999<span>per session, up to 8 people, ex VAT</span>
              </div>
              <CheckoutButton id="buy-team-on-exec" offer="team-workflow-upgrade" label="Buy the team session" />
              <a className="quiet-link fmt-see" href="/workshops/team-workflow-upgrade">
                See the session
              </a>
            </div>
            <div className="fmt lead1">
              <h3>Executive Workflow Upgrade Session</h3>
              <p>For the CEO: introduction, review and an upgrade.</p>
              <div className="price">
                €1,499<span>one to one, ex VAT</span>
              </div>
              <CheckoutButton id="buy-exec-on-exec" offer="executive-workflow-upgrade" label="Buy your executive session" />
            </div>
          </div>
        </div>
      </section>
      <section className="p-person" style={{ background: "var(--paper2)", borderTop: "1px solid #D8D1C2" }}>
        <div className="wrap bio">
          <div className="pic">
            <img src="/v3/new/bio-exec-07.jpg" alt="Nic Haralambous, portrait" width={1000} height={1250} />
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
            <h2>Executive Workflow Upgrade Session</h2>
            <p className="final-sub">2 hours, one to one, €1,499, ex VAT.</p>
            <div className="acts" style={{ justifyContent: "center", marginTop: 32 }}>
              <CheckoutButton id="buy-exec-final" offer="executive-workflow-upgrade" label="Buy your executive session" />
              <IntroCallLink />
            </div>
          </div>
        </div>
      </section>
      <StickyBookBar
        title="Executive Workflow Upgrade"
        detail="€1,499, ex VAT"
        offer="executive-workflow-upgrade"
        label="Buy"
        id="buy-exec-sticky"
      />
    </div>
  );
}
