import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { CompareTable } from "@/components/site/compare-table";
import { CheckoutButton, IntroCallLink } from "@/components/site/checkout-cta";
import { StickyBookBar } from "@/components/site/sticky-book";
import { breadcrumbJsonLd } from "@/lib/metadata";
import { grokWeekJsonLd, PATHS } from "@/lib/offers";

const PATH = PATHS.grokWeek;
const URL = `https://www.nicharalambous.com${PATH}`;

export const metadata: Metadata = {
  title: "My week with Grok Bot",
  description:
    "A 90-minute show-and-tell for up to 20 people. I take your team through my own Grok Bot setup. €2,999 per session, ex VAT. Virtual by default.",
  alternates: { canonical: URL },
  openGraph: {
    title: "My week with Grok Bot | Nic Haralambous",
    description: "Watch how I actually work with Grok Bot, then ask me anything. Virtual by default.",
    url: URL,
  },
};

export default function MyWeekPage() {
  return (
    <div className="v3 has-sticky" data-no-orphan-opt-out="true">
      <JsonLd data={grokWeekJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Workshops", path: PATHS.workshops },
          { name: "My week with Grok Bot", path: PATH },
        ])}
      />
      <section className="hero op pd-spotlight">
        <div className="glow" aria-hidden="true" />
        <div className="wrap">
          <div className="copy">
            <h1 className="long">
              90 minutes inside how I actually work with <em>Grok Bot</em>
            </h1>
            <p className="say">
              A show-and-tell for your team or organisation. I go through my own setup, how I work with Grok Bot and what&apos;s out there to do. 90 minutes, up to 20 people, €2,999 per session, ex VAT. Virtual by default.
            </p>
            <div className="book" id="book">
              <div className="row">
                <div>
                  <h2>My week with Grok Bot</h2>
                  <p>A walk-through of my own setup, how I work with Grok Bot and what&apos;s out there to do.</p>
                </div>
                <div className="price">
                  €2,999
                  <small>per session, ex VAT</small>
                </div>
              </div>
              <div className="acts">
                <CheckoutButton id="buy-my-week-with-grok-bot" offer="my-week-with-grok-bot" label="Buy My week with Grok Bot" />
                <IntroCallLink />
              </div>
            </div>
            <div className="meter">
              <div>
                <b>90 minutes</b>show-and-tell
              </div>
              <div>
                <b>Up to 20 people</b>one organisation
              </div>
              <div>
                <b>Virtual</b>by default
              </div>
            </div>
          </div>
          <div className="photo">
            <img
              className="emoji-hero"
              src="/v3/new/hero-mywk-emoji.webp"
              alt="Illustrated, emoji-style Nic pointing at floating calendar, mail, chat and checklist icons"
            />
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
            I think the quickest way for a team to understand what Grok Bot can do is to watch someone use it on their real work, with nothing staged. So that&apos;s what this session is: my week with Grok Bot, shown to your people.
          </p>
          <p className="body">
            For 90 minutes I take your team through my own setup. I show them how I work with Grok Bot day to day and what&apos;s out there for them to do with it. Your people watch, ask questions and see it working, before anyone has to commit to building something of their own.
          </p>
          <p className="body">
            The lunch and learn is a 20-minute talk about why AI is making teams busier and less engaged. My week with Grok Bot is 90 minutes of me showing up to 20 of your people how I work with Grok Bot, for €2,999 a session, ex VAT. The Team Workflow Upgrade Session is where up to 8 of your senior leaders build their own workflows with me, for €4,999 a session, ex VAT.
          </p>
        </div>
      </section>
      <section className="p-lightbulb" style={{ background: "var(--paper2)", borderTop: "1px solid #D8D1C2" }}>
        <div className="wrap">
          <h2 style={{ margin: "20px 0 0" }}>What&apos;s included</h2>
          <div className="incl">
            <div className="has-stk">
              <img className="stk" src="/v3/new/sticker-clipboard.png" alt="" />
              <p>90 minutes with me, virtual by default. In person is possible, with travel extra.</p>
            </div>
            <div className="has-stk">
              <img className="stk" src="/v3/new/sticker-laptop.png" alt="" />
              <p>A walk-through of my own Grok Bot setup and how I work with it</p>
            </div>
            <div className="has-stk">
              <img className="stk" src="/v3/new/sticker-surprised.png" alt="" />
              <p>What&apos;s out there for your team to do with Grok Bot</p>
            </div>
            <div className="has-stk">
              <img className="stk" src="/v3/new/sticker-thumbs.png" alt="" />
              <p>Up to 20 people, €2,999 per session, ex VAT</p>
            </div>
          </div>
        </div>
      </section>
      <section className="p-pen">
        <div className="wrap">
          <h2 style={{ margin: "20px 0 22px" }}>Who it&apos;s for</h2>
          <p className="body">
            Teams and organisations that want to see what working with Grok Bot looks like, from someone who uses it, before anyone builds anything. Up to 20 people in the session.
          </p>
          <p className="body">
            It isn&apos;t for a group that wants to leave with their own workflows built. That&apos;s the Team Workflow Upgrade Session.
          </p>
        </div>
      </section>
      <section className="dark pd-calendar" id="formats">
        <div className="wrap">
          <h2 style={{ margin: "20px 0 28px" }}>Talk, show-and-tell or hands-on workshop</h2>
          <CompareTable />
        </div>
      </section>
      <section className="p-pen">
        <div className="wrap">
          <h2 style={{ margin: "20px 0 0" }}>FAQ</h2>
          <div className="faq">
            <details>
              <summary>Will my team build anything in the session?</summary>
              <p>
                No. This is a show-and-tell: I show, they watch and ask questions. If you want people building their own workflows, book the Team Workflow Upgrade Session.
              </p>
            </details>
            <details>
              <summary>How is this different from the lunch and learn?</summary>
              <p>
                The lunch and learn is a 20-minute talk on the Output Paradox, for any team size. This is 90 minutes on how I work with Grok Bot, for up to 20 people.
              </p>
            </details>
            <details>
              <summary>Do my team need Grok Bot to attend?</summary>
              <p>No. I show it all on my own Grok Bot, so nobody needs to switch tools to attend.</p>
            </details>
          </div>
        </div>
      </section>
      <section className="p-lightbulb after-band" style={{ background: "var(--paper2)", borderTop: "1px solid #D8D1C2" }}>
        <div className="wrap after">
          <img className="stk-big" src="/v3/new/sticker-thumbs.png" alt="" />
          <div>
            <h2 style={{ margin: "0 0 18px" }}>After the session</h2>
            <p className="lead">
              If your senior people want to go from watching to building, the next step is the Team Workflow Upgrade Session: two hands-on hours where up to 8 of them build their own workflows with me. It&apos;s €4,999 for up to 8 people, ex VAT, with extra seats at €499 each up to 10.
            </p>
            <p style={{ marginTop: 22 }}>
              <a className="btn ghost" href="/workshops/team-workflow-upgrade">
                See the team session
              </a>
            </p>
          </div>
        </div>
      </section>
      <section className="p-person" style={{ background: "var(--paper2)", borderTop: "1px solid #D8D1C2" }}>
        <div className="wrap bio">
          <div className="pic">
            <img src="/v3/new/bio-week-09.jpg" alt="Nic Haralambous, portrait" width={1000} height={1250} />
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
            <h2>My week with Grok Bot</h2>
            <p className="final-sub">90 minutes, up to 20 people, €2,999 per session, ex VAT. Virtual by default.</p>
            <div className="acts" style={{ justifyContent: "center", marginTop: 32 }}>
              <CheckoutButton id="buy-my-week-final" offer="my-week-with-grok-bot" label="Buy My week with Grok Bot" />
              <IntroCallLink />
            </div>
          </div>
        </div>
      </section>
      <StickyBookBar
        title="My week with Grok Bot"
        detail="€2,999, ex VAT"
        offer="my-week-with-grok-bot"
        label="Buy"
        id="buy-my-week-sticky"
      />
    </div>
  );
}
