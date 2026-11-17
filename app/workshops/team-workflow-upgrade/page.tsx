import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { CheckoutButton, IntroCallLink } from "@/components/site/checkout-cta";
import { StickyBookBar } from "@/components/site/sticky-book";
import { breadcrumbJsonLd } from "@/lib/metadata";
import { PATHS, teamWorkshopJsonLd } from "@/lib/offers";

const PATH = PATHS.team;
const URL = `https://www.nicharalambous.com${PATH}`;

export const metadata: Metadata = {
  title: "Team Workflow Upgrade Session",
  description:
    "A hands-on workshop for up to 8 senior leaders from one company. 2 hours, €4,999 per session, ex VAT, plus €499 per extra seat up to 10. Virtual by default.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Team Workflow Upgrade Session | Nic Haralambous",
    description:
      "Your senior leaders build their own workflows in Grok Bot, in one two-hour session. Virtual by default.",
    url: URL,
  },
};

export default function TeamWorkshopPage() {
  return (
    <div className="v3 has-sticky" data-no-orphan-opt-out="true">
      <JsonLd data={teamWorkshopJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Workshops", path: PATHS.workshops },
          { name: "Team Workflow Upgrade Session", path: PATH },
        ])}
      />
      <section className="hero op pd-spotlight">
        <div className="glow" aria-hidden="true" />
        <div className="wrap">
          <div className="copy">
            <h1 className="long">
              Your senior leaders build their own <em>workflows</em> in Grok Bot, in one two-hour session
            </h1>
            <p className="say">
              A hands-on workshop for up to 8 senior leaders from one company. 2 hours, €4,999 per session, ex VAT, plus €499 per extra seat up to 10. Virtual by default.
            </p>
            <div className="book" id="book">
              <div className="row">
                <div>
                  <h2>Team Workflow Upgrade Session</h2>
                  <p>Up to 8 people from one company. Extra seats at €499 each, ex VAT, up to 10 people.</p>
                </div>
                <div className="price">
                  €4,999
                  <small>per session, up to 8 people, ex VAT</small>
                </div>
              </div>
              <div className="acts">
                <CheckoutButton id="buy-team-workflow-upgrade" offer="team-workflow-upgrade" label="Buy the team session" />
                <IntroCallLink />
              </div>
            </div>
            <div className="meter">
              <div>
                <b>2 hours</b>hands-on
              </div>
              <div>
                <b>Up to 8 people</b>10 with extra seats
              </div>
              <div>
                <b>Senior leaders</b>usually 35 and older
              </div>
            </div>
          </div>
          <div className="photo">
            <img className="ph-team" src="/v3/new/hero-team-05.webp" alt="Nic Haralambous" />
          </div>
        </div>
      </section>
      <div className="ip pd-calendar">
        <div className="wrap">
          <span>
            <b>My week with Grok Bot.</b> 90 minutes, up to 20 people, €2,999 per session, ex VAT.
          </span>
          <a className="link" href="/workshops/my-week-with-grok-bot" style={{ color: "#fff" }}>
            See My week with Grok Bot
          </a>
        </div>
      </div>
      <section className="p-pen">
        <div className="wrap body-copy">
          <p className="lead">
            I think a lot of senior leaders have been handed AI tools, told to get on with it, and are still running their week exactly the way they did two years ago. Nobody sat down with them and showed them how to take a real piece of their own work, hand it to a tool and get it back done properly.
          </p>
          <p className="body">
            That is what this session is for. You bring up to 8 senior leaders (or 10, with extra seats), and each of them brings a piece of work they do every week (the report, the follow-ups, the meeting prep, whatever keeps eating their hours). Over two hours I take them through building their own workflow for it in Grok Bot. I&apos;m not presenting at them. They&apos;re working, I&apos;m there helping, and they leave with something running on their own work.
          </p>
          <p className="body">
            Before the session I work with your organisation to set things up. Ideally I show your people, on my own Grok Bot, how it all comes together on your Grok Bot. If you use Claude or ChatGPT, I can adapt to those, so nobody needs to switch tools to attend.
          </p>
          <p className="body">
            The lunch and learn is a 20-minute talk I give to your whole team for €999; the Team Workflow Upgrade Session is two hours of up to 8 of your senior leaders building their own workflows with me, for €4,999 a session, with room for 2 more at €499 each (all ex VAT).
          </p>
          <p className="body">
            I&apos;ve built and sold four companies, written three books and spent more than 20 years building technology businesses. I&apos;d rather your leaders leave with one workflow they actually use than ten ideas they never get to.
          </p>
        </div>
      </section>
      <section className="p-lightbulb" style={{ background: "var(--paper2)", borderTop: "1px solid #D8D1C2" }}>
        <div className="wrap">
          <h2 style={{ margin: "20px 0 0" }}>What&apos;s included</h2>
          <div className="incl">
            <div>
              <span className="mono">01</span>
              <p>A 2-hour hands-on session with me, virtual by default. In person is possible, with travel extra.</p>
            </div>
            <div>
              <span className="mono">02</span>
              <p>Up to 8 people from one company, €4,999 per session, ex VAT</p>
            </div>
            <div>
              <span className="mono">03</span>
              <p>Extra seats at €499 each, ex VAT, up to 10 people (a maximum of €5,997, ex VAT)</p>
            </div>
            <div>
              <span className="mono">04</span>
              <p>Each person builds their own workflow in Grok Bot, on a piece of their own real work</p>
            </div>
            <div>
              <span className="mono">05</span>
              <p>
                Setup before the session: I work with your organisation to get things ready, ideally on your Grok Bot, or on Claude or ChatGPT if that&apos;s what you use
              </p>
            </div>
          </div>
          <div className="seat-strip">
            <p>€4,999 per session for up to 8 people, plus €499 per extra seat up to 10. All ex VAT.</p>
            <div className="seats">
              <div>
                <b>8 people</b>
                <span>€4,999 ex VAT</span>
              </div>
              <div>
                <b>9 people</b>
                <span>€5,498 ex VAT</span>
              </div>
              <div>
                <b>10 people</b>
                <span>€5,997 ex VAT</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="p-pen">
        <div className="wrap">
          <h2 style={{ margin: "20px 0 22px" }}>Who it&apos;s for</h2>
          <p className="body">
            Senior leaders, usually 35 and older, who need to get properly hands-on with workflow automation and want to do it on their own work, not a demo. You book it for up to 8 people from your company, or up to 10 with extra seats. It&apos;s one company per session.
          </p>
          <p className="body">
            It isn&apos;t for a whole department or an all-hands. For a bigger room, the lunch and learn or a keynote is the better fit.
          </p>
        </div>
      </section>
      <section className="dark pd-calendar" id="formats">
        <div className="wrap">
          <h2 style={{ margin: "20px 0 18px" }}>Three ways to work with Grok Bot</h2>
          <div className="formats">
            <div className="fmt">
              <h3>My week with Grok Bot</h3>
              <p>A show-and-tell: I take your team through my own Grok Bot setup, how I work with it and what&apos;s out there to do.</p>
              <ul>
                <li>90 minutes</li>
                <li>Up to 20 people, one organisation</li>
                <li>Virtual by default</li>
              </ul>
              <div className="price">
                €2,999<span>per session, ex VAT</span>
              </div>
              <CheckoutButton id="buy-my-week-on-team" offer="my-week-with-grok-bot" label="Buy My week with Grok Bot" />
              <a className="quiet-link fmt-see" href="/workshops/my-week-with-grok-bot">
                See the session
              </a>
            </div>
            <div className="fmt lead1">
              <h3>Team Workflow Upgrade Session</h3>
              <p>Each person builds their own workflow in Grok Bot.</p>
              <ul>
                <li>2 hours, hands-on</li>
                <li>Up to 8 senior leaders from one company</li>
                <li>€499 per extra seat, up to 10</li>
              </ul>
              <div className="price">
                €4,999<span>per session, up to 8 people, ex VAT</span>
              </div>
              <CheckoutButton id="buy-team-on-team" offer="team-workflow-upgrade" label="Buy the team session" />
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
              <CheckoutButton id="buy-exec-on-team" offer="executive-workflow-upgrade" label="Buy your executive session" />
              <a className="quiet-link fmt-see" href="/workshops/executive-workflow-upgrade">
                See the session
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="p-pen">
        <div className="wrap">
          <h2 style={{ margin: "20px 0 0" }}>FAQ</h2>
          <div className="faq">
            <details>
              <summary>How is this different from the lunch and learn?</summary>
              <p>
                The lunch and learn is a 20-minute talk on the Output Paradox for any team size, €999 for the session, ex VAT. This is a 2-hour workshop for up to 8 senior leaders (10 with extra seats), €4,999 per session, ex VAT, where each person builds their own workflow in Grok Bot.
              </p>
            </details>
            <details>
              <summary>Do we need Grok Bot set up before the session?</summary>
              <p>
                No. I work with your organisation before the session to set things up. Ideally I show your people, on my own Grok Bot, how it all comes together on your Grok Bot.
              </p>
            </details>
            <details>
              <summary>What if our company uses Claude or ChatGPT, or limits which AI tools we can use?</summary>
              <p>You don&apos;t need to switch tools to attend. If you use Claude or ChatGPT, I can adapt to those.</p>
            </details>
            <details>
              <summary>Can we bring more than 8 people?</summary>
              <p>Yes, up to 10. Each extra seat is €499, ex VAT, so 10 people is €5,997, ex VAT. Everyone comes from one company.</p>
            </details>
            <details>
              <summary>Is it virtual or in person?</summary>
              <p>Virtual by default. In person is possible, with travel extra.</p>
            </details>
          </div>
        </div>
      </section>
      <section className="p-person" style={{ background: "var(--paper2)", borderTop: "1px solid #D8D1C2" }}>
        <div className="wrap bio">
          <div className="pic">
            <img src="/v3/new/bio-team-10.jpg" alt="Nic Haralambous, portrait" width={1000} height={1250} />
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
            <img className="px pxf op" src="/v3/px/Nic_Hunting_Pickaxe.png" alt="" width={170} height={288} />
            <h2>Team Workflow Upgrade Session</h2>
            <p className="final-sub">2 hours, up to 8 senior leaders, €4,999 per session, ex VAT. Extra seats €499, up to 10.</p>
            <div className="acts" style={{ justifyContent: "center", marginTop: 32 }}>
              <CheckoutButton id="buy-team-final" offer="team-workflow-upgrade" label="Buy the team session" />
              <IntroCallLink />
            </div>
          </div>
        </div>
      </section>
      <StickyBookBar
        title="Team Workflow Upgrade Session"
        detail="Up to 8 people, €4,999"
        offer="team-workflow-upgrade"
        label="Buy"
        id="buy-team-sticky"
      />
    </div>
  );
}
