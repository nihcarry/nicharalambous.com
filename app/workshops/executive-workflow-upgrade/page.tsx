import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { EnquireButton, IntroCallLink, enquireHref } from "@/components/site/checkout-cta";
import { StickyBookBar } from "@/components/site/sticky-book";
import { breadcrumbJsonLd } from "@/lib/metadata";
import { executiveWorkshopJsonLd, PATHS } from "@/lib/offers";

const PATH = PATHS.executive;
const URL = `https://www.nicharalambous.com${PATH}`;
const DESCRIPTION =
  "Three hours, custom built for the CEO, with a briefing call first and a free seat for one exec. Virtual by default.";
const SOCIAL_TITLE = "The CEO AI Session | Nic Haralambous";

export const metadata: Metadata = {
  title: "The CEO AI Session",
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

export default function ExecutiveWorkshopPage() {
  return (
    <div className="v3 has-sticky workshop-v4" data-no-orphan-opt-out="true">
      <JsonLd data={executiveWorkshopJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Workshops", path: PATHS.workshops },
          { name: "The CEO AI Session", path: PATH },
        ])}
      />
      <section className="hero op pd-spotlight">
        <div className="glow" aria-hidden="true" />
        <div className="wrap">
          <div className="copy">
            <h1 className="session-name">
              The CEO AI
              <br />
              Session
            </h1>
            <div className="say">
              <p>Three hours, built for you, to upgrade how you run your week</p>
              <p>
                For CEOs. A briefing call first, then three hands-on hours built around how you work. Bring one exec for free. Virtual by default.
              </p>
            </div>
            <div className="book" id="book">
              <div className="row">
                <div>
                  <h2>The CEO AI Session</h2>
                  <p>3 hours, hands-on with me and tailored to you after a briefing call. Virtual by default. In person is possible, with travel extra.</p>
                </div>
                <div className="price">
                  3 hours
                  <small>exec seat free</small>
                </div>
              </div>
              <div className="acts side">
                <EnquireButton id="buy-executive-workflow-upgrade" offer="exec" />
                <IntroCallLink />
              </div>
            </div>
            <div className="meter">
              <div>
                <b>3 hours</b>hands-on, built for you
              </div>
              <div>
                <b>CEOs</b>and founders running a company
              </div>
              <div>
                <b>Bring an exec</b>one free seat for your COO or a senior leader
              </div>
            </div>
          </div>
          <div className="photo photo-card">
            <picture>
              <source srcSet="/v3/new/exec-hero-C.webp" type="image/webp" />
              <img
                className="ph-exec"
                src="/v3/new/exec-hero-C.jpg"
                alt="Nic smiling in a grey blazer on a city street"
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
            <b>Senior Leaders AI Lab.</b> Half a day, hands-on, up to 10 senior leaders from one company.
          </span>
          <a className="link" href="/workshops/team-workflow-upgrade" style={{ color: "#fff" }}>
            See the Senior Leaders AI Lab
          </a>
        </div>
      </div>
      <section className="p-pen">
        <div className="wrap body-copy">
          <p className="lead">
            Most CEOs I speak to feel the same way about how AI is changing business. It&apos;s moving faster than anyone can keep up with, while they&apos;re trying to hold on to the business they already run. That&apos;s a totally normal place to be, but it&apos;s better to be prepared and excited about the tech than fearful and avoidant. In my experience, once a CEO sees a new workflow free up time for them, they can&apos;t stop working with AI.
          </p>
          <p className="body">
            In this three-hour session, you&apos;ll unlock real time back in your week by learning how to hand off the work around the work. We&apos;ll lay the foundations to upgrade your weekly routines and your understanding of how AI can change your business and your teams. I&apos;ll show you how I use AI every day and which practices actually hold up, and we&apos;ll work through the things you&apos;re most curious to explore. You&apos;ll leave motivated to build, and ready to swap the old ways of working for bolder, better ones.
          </p>
          <p className="body">
            Before we meet, I work with you to set things up, so the three hours go on your week. We work in the AI tools your business already uses, so you don&apos;t need to switch tools to attend.
          </p>
          <p className="body">
            Bring one exec along for free, usually your COO or another senior leader. They see the work happen on your week, in the room with you, so you don&apos;t have to go back afterwards and translate the value for them.
          </p>
          <p className="body">
            I&apos;ve built and sold four companies and spent more than 20 years building technology businesses. I&apos;ll tell you what I think about how you work, and we&apos;ll build the changes while we talk.
          </p>
        </div>
      </section>
      <section className="p-lightbulb" style={{ background: "var(--paper2)", borderTop: "1px solid #D8D1C2" }}>
        <div className="wrap">
          <h2 style={{ margin: "20px 0 0" }}>What&apos;s{"\u00A0"}included</h2>
          <div className="incl">
            <div>
              <span className="mono">01</span>
              <p>3 hours, hands-on with me, virtual by default. In person is possible, with travel extra.</p>
            </div>
            <div>
              <span className="mono">02</span>
              <p>A briefing call and setup before the session: your setup, your level with AI and where we&apos;ll focus</p>
            </div>
            <div>
              <span className="mono">03</span>
              <p>A custom session, purpose built around your needs and the AI tools your business already uses</p>
            </div>
            <div>
              <span className="mono">04</span>
              <p>A review of your current workflow</p>
            </div>
            <div>
              <span className="mono">05</span>
              <p>An upgrade, built during the session on your own work</p>
            </div>
            <div>
              <span className="mono">06</span>
              <p>A free seat for one of your execs, such as your COO or another senior leader</p>
            </div>
          </div>
        </div>
      </section>
      <section className="p-pen">
        <div className="wrap">
          <h2 style={{ margin: "20px 0 22px" }}>Who it&apos;s{"\u00A0"}for</h2>
          <p className="body">
            CEOs, and founders running a company, who want the work done on their own week. It&apos;s built for one leader per session, and you can bring one exec along for free.
          </p>
          <p className="body">If you want more of your senior leaders in the room, that&apos;s the Senior Leaders AI Lab.</p>
        </div>
      </section>
      <section className="p-pen" style={{ background: "var(--paper2)", borderTop: "1px solid #D8D1C2" }}>
        <div className="wrap">
          <h2 style={{ margin: "20px 0 0" }}>FAQ</h2>
          <div className="faq">
            <details>
              <summary>Do I need to know AI tools{"\u00A0"}already?</summary>
              <p>No. The briefing call tells me where you are today, and I build the session around that.</p>
            </details>
            <details>
              <summary>We use Claude or ChatGPT. Do I need to switch?</summary>
              <p>No. We work in the AI tools your business already uses.</p>
            </details>
            <details>
              <summary>Can I bring someone from my{"\u00A0"}team?</summary>
              <p>Yes. You can bring one exec for free, usually your COO or another senior leader. For a bigger group, book the Senior Leaders AI Lab (up to 10 senior leaders).</p>
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
          <h2 style={{ margin: "20px 0 18px" }}>Three ways to work with{"\u00A0"}me</h2>
          <div className="formats">
            <div className="fmt">
              <h3>My week with{"\u00A0"}AI</h3>
              <p>A show-and-tell of my own setup, for up to 20 people.</p>
              <ul>
                <li>90 minutes</li>
                <li>Up to 20 people, one organisation</li>
                <li>Virtual by default</li>
              </ul>
              <EnquireButton id="buy-my-week-on-exec" offer="my-week" />
              <a className="quiet-link fmt-see" href="/workshops/my-week-with-ai">
                See the session
              </a>
            </div>
            <div className="fmt">
              <h3>Senior Leaders AI{"\u00A0"}Lab</h3>
              <p>Up to 10 senior leaders build their own workflows and keep ownership of the thinking.</p>
              <ul>
                <li>Half day, hands-on</li>
                <li>Up to 10 senior leaders from one company</li>
                <li>Virtual by default</li>
              </ul>
              <EnquireButton id="buy-team-on-exec" offer="team" />
              <a className="quiet-link fmt-see" href="/workshops/team-workflow-upgrade">
                See the session
              </a>
            </div>
            <div className="fmt lead1">
              <h3>The CEO AI{"\u00A0"}Session</h3>
              <p>For the CEO: a briefing call, then a custom session built for you.</p>
              <ul>
                <li>3 hours</li>
                <li>One to one, plus one exec free</li>
                <li>Virtual by default</li>
              </ul>
              <EnquireButton id="buy-exec-on-exec" offer="exec" />
            </div>
          </div>
        </div>
      </section>
      <section className="p-person" style={{ background: "var(--paper2)", borderTop: "1px solid #D8D1C2" }}>
        <div className="wrap bio">
          <div className="pic">
            <img src="/v3/new/bio-exec-07.jpg" alt="Nic Haralambous, portrait" width={1000} height={1250} />
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
              <span>The CEO AI</span> <span>Session</span>
            </h2>
            <p className="final-sub">3 hours, custom built for you, with a free seat for one exec.</p>
            <div className="acts" style={{ justifyContent: "center", marginTop: 32 }}>
              <EnquireButton id="buy-exec-final" offer="exec" />
              <IntroCallLink />
            </div>
          </div>
        </div>
      </section>
      <StickyBookBar
        title="The CEO AI Session"
        detail="3 hours, plus one exec free"
        href={enquireHref("exec")}
        label="Enquire to book"
        id="buy-exec-sticky"
      />
    </div>
  );
}
