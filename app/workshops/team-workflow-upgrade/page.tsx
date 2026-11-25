import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { EnquireButton, IntroCallLink, enquireHref } from "@/components/site/checkout-cta";
import { StickyBookBar } from "@/components/site/sticky-book";
import { breadcrumbJsonLd } from "@/lib/metadata";
import { PATHS, teamWorkshopJsonLd } from "@/lib/offers";

const PATH = PATHS.team;
const URL = `https://www.nicharalambous.com${PATH}`;
const DESCRIPTION =
  "A hands-on, half-day workshop for up to 10 senior leaders from one company. Senior leaders only. Virtual by default.";
const SOCIAL_TITLE = "Senior Leaders AI Lab | Nic Haralambous";

export const metadata: Metadata = {
  title: "Senior Leaders AI Lab",
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: SOCIAL_TITLE,
    description: DESCRIPTION,
    url: URL,
  },
  twitter: {
    card: "summary_large_image",
    title: SOCIAL_TITLE,
    description: DESCRIPTION,
  },
};

export default function TeamWorkshopPage() {
  return (
    <div className="v3 has-sticky workshop-v4" data-no-orphan-opt-out="true">
      <JsonLd data={teamWorkshopJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Workshops", path: PATHS.workshops },
          { name: "Senior Leaders AI Lab", path: PATH },
        ])}
      />
      <section className="hero op pd-spotlight">
        <div className="glow" aria-hidden="true" />
        <div className="wrap">
          <div className="copy">
            <h1 className="session-name">
              Senior Leaders
              <br />
              AI Lab
            </h1>
            <div className="say">
              <p>Your senior leaders build their own workflows, in half a day</p>
              <p>
                A hands-on workshop for senior leaders only, up to 10 from one company. Half a day, built on their own real work. Virtual by default.
              </p>
            </div>
            <div className="book" id="book">
              <div className="row">
                <div>
                  <h2>Senior Leaders AI Lab</h2>
                  <p>Up to 10 senior leaders from one company, and senior leaders only. Half a day, hands-on with me.</p>
                </div>
                <div className="price">
                  Half day
                  <small>up to 10 people</small>
                </div>
              </div>
              <div className="acts">
                <EnquireButton id="buy-team-workflow-upgrade" offer="team" />
                <IntroCallLink />
              </div>
            </div>
            <div className="meter">
              <div>
                <b>Half day</b>hands-on
              </div>
              <div>
                <b>Up to 10 people</b>one company
              </div>
              <div>
                <b>Senior leaders</b>only
              </div>
            </div>
          </div>
          <div className="photo photo-card">
            <picture>
              <source srcSet="/v3/new/team-hero-C.webp" type="image/webp" />
              <img
                className="ph-team"
                src="/v3/new/team-hero-C.jpg"
                alt="Nic standing in a grey coat, hands in pockets"
                width={1500}
                height={2200}
              />
            </picture>
          </div>
        </div>
      </section>
      <div className="ip pd-calendar">
        <div className="wrap">
          <span>
            <b>My week with AI.</b> 90 minutes, up to 20 people.
          </span>
          <a className="link" href="/workshops/my-week-with-ai" style={{ color: "#fff" }}>
            See My week with AI
          </a>
        </div>
      </div>
      <section className="p-pen">
        <div className="wrap body-copy">
          <p className="lead">
            I think a lot of senior leaders have been handed AI tools, told to get on with it, and are still running their week exactly the way they did two years ago. Nobody sat down with them and showed them how to take a real piece of their own work, hand it to a tool and get it back done properly.
          </p>
          <p className="body">
            That is what this session is for. You bring up to 10 of your senior leaders, and each of them brings real work they do every week (the report, the follow-ups, the meeting prep, whatever keeps eating their hours). Over half a day I take them through the workflows an executive actually cares about: marketing, content, research, development and design, product iterations, opportunity hunting, outreach, customer interviews, video editing, meeting management and outcomes-based engagement with their staff and with AI. I&apos;m not presenting at them. They&apos;re working, I&apos;m there helping, and they leave with something running on their own work.
          </p>
          <p className="body">
            The key is ownership. I want your leaders to keep ownership of their ideas, their critical thinking, their opinions, their taste and their creativity, and to hand AI the work around the work. Before the session I work with your organisation to set things up in the AI tools your business already uses, so nobody needs to switch tools to attend.
          </p>
          <p className="body">
            The lunch and learn is a 45-minute virtual slot (a 20-minute talk plus Q&amp;A) for a wider room; the Senior Leaders AI Lab is half a day of up to 10 of your senior leaders building their own workflows with me.
          </p>
          <p className="body">
            I&apos;ve built and sold four companies, written three books and spent more than 20 years building technology businesses. I&apos;d rather your leaders leave with one workflow they actually use than ten ideas they never get to.
          </p>
        </div>
      </section>
      <section className="p-lightbulb" style={{ background: "var(--paper2)", borderTop: "1px solid #D8D1C2" }}>
        <div className="wrap">
          <h2 style={{ margin: "20px 0 0" }}>What&apos;s{"\u00A0"}included</h2>
          <div className="incl">
            <div>
              <span className="mono">01</span>
              <p>A half-day hands-on session with me, virtual by default. In person is possible, with travel extra.</p>
            </div>
            <div>
              <span className="mono">02</span>
              <p>Up to 10 senior leaders from one company, and senior leaders only</p>
            </div>
            <div>
              <span className="mono">03</span>
              <p>
                Workflows across marketing, content, research, development and design, product iterations, opportunity hunting, outreach, customer interviews, video editing, meeting management and outcomes-based engagement with staff and AI
              </p>
            </div>
            <div>
              <span className="mono">04</span>
              <p>Each person builds their own workflows on their own real work, and keeps ownership of the thinking while AI does the work around the work</p>
            </div>
            <div>
              <span className="mono">05</span>
              <p>
                Setup before the session: I work with your organisation to get things ready in the AI tools your business already uses
              </p>
            </div>
          </div>
          <div className="seat-strip">
            <p>Your leaders keep ownership of the thinking, and AI does the work around the work.</p>
            <div className="seats">
              <div>
                <b>Ideas and opinions</b>
                <span>stay theirs</span>
              </div>
              <div>
                <b>Taste and creativity</b>
                <span>stay theirs</span>
              </div>
              <div>
                <b>The work around the work</b>
                <span>goes to AI</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="p-pen">
        <div className="wrap">
          <h2 style={{ margin: "20px 0 22px" }}>Who it&apos;s{"\u00A0"}for</h2>
          <p className="body">
            Senior leaders, usually 35 and older, who need to get properly hands-on with workflow automation and want to do it on their own work, not a demo. You book it for up to 10 senior leaders from your company, and it&apos;s senior leaders only. It&apos;s one company per session.
          </p>
          <p className="body">
            It isn&apos;t for a whole department or an all-hands. For a bigger room, the lunch and learn or a keynote is the better fit.
          </p>
        </div>
      </section>
      <section className="dark pd-calendar" id="formats">
        <div className="wrap">
          <h2 style={{ margin: "20px 0 18px" }}>Three ways to work with{"\u00A0"}me</h2>
          <div className="formats">
            <div className="fmt">
              <h3>My week with{"\u00A0"}AI</h3>
              <p>A show-and-tell: I take your team through my own AI setup, how I work with it and what&apos;s out there to do.</p>
              <ul>
                <li>90 minutes</li>
                <li>Up to 20 people, one organisation</li>
                <li>Virtual by default</li>
              </ul>
              <EnquireButton id="buy-my-week-on-team" offer="my-week" />
              <a className="quiet-link fmt-see" href="/workshops/my-week-with-ai">
                See the session
              </a>
            </div>
            <div className="fmt lead1">
              <h3>Senior Leaders AI{"\u00A0"}Lab</h3>
              <p>Each person builds their own workflows and keeps ownership of the thinking.</p>
              <ul>
                <li>Half day, hands-on</li>
                <li>Up to 10 senior leaders from one company</li>
                <li>Virtual by default</li>
              </ul>
              <EnquireButton id="buy-team-on-team" offer="team" />
            </div>
            <div className="fmt">
              <h3>The CEO AI{"\u00A0"}Session</h3>
              <p>For the CEO: a briefing call, then a custom session built for you.</p>
              <ul>
                <li>3 hours</li>
                <li>One to one, plus one exec free</li>
                <li>Virtual by default</li>
              </ul>
              <EnquireButton id="buy-exec-on-team" offer="exec" />
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
                The lunch and learn is a 45-minute slot on the Output Paradox for a wider room: a 20-minute talk plus Q&amp;A. This is a half-day workshop for up to 10 senior leaders, where each person builds their own workflows on their own work.
              </p>
            </details>
            <details>
              <summary>Do we need anything set up before the session?</summary>
              <p>No. I work with your organisation before the session to set things up in the AI tools your business already uses.</p>
            </details>
            <details>
              <summary>What if our company uses Claude or ChatGPT, or limits which AI tools we can use?</summary>
              <p>You don&apos;t need to switch tools to attend. If you use Claude or ChatGPT, I can adapt to those.</p>
            </details>
            <details>
              <summary>How many people can we bring?</summary>
              <p>Up to 10 senior leaders, all from one company. For a bigger room, the lunch and learn or a keynote is the better fit.</p>
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
            <h2 className="bio-lines" style={{ margin: "20px 0 22px" }}>
              <span>I&apos;ve been building</span>
              <span>businesses since I</span>
              <span>was 16</span>
            </h2>
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
            <h2 className="closing-title">
              <span>Senior Leaders</span> <span>AI Lab</span>
            </h2>
            <p className="final-sub">Half a day, up to 10 senior leaders from one company.</p>
            <div className="acts" style={{ justifyContent: "center", marginTop: 32 }}>
              <EnquireButton id="buy-team-final" offer="team" />
              <IntroCallLink />
            </div>
          </div>
        </div>
      </section>
      <StickyBookBar
        title="Senior Leaders AI Lab"
        detail="Half day, up to 10 senior leaders"
        href={enquireHref("team")}
        label="Enquire to book"
        id="buy-team-sticky"
      />
    </div>
  );
}
