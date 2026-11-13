import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { LogoStrip } from "@/components/site/logo-strip";
import { StickyBookBar } from "@/components/site/sticky-book";
import { WhatPeopleSay } from "@/components/what-people-say";
import { breadcrumbJsonLd, outputParadoxServiceJsonLd } from "@/lib/metadata";
import { CheckoutButton, IntroCallLink } from "@/components/site/checkout-cta";
import { checkoutIsLive } from "@/lib/site";
import { followOnSessionsJsonLd } from "@/lib/offers";
import { v3ContentSettings } from "@/lib/v3-content";

const PATH = "/keynotes/output-paradox-reengage-teams";
const URL = `https://www.nicharalambous.com${PATH}`;

export const metadata: Metadata = {
  title: { absolute: "The Output Paradox | Nic Haralambous" },
  description:
    "The Output Paradox is Nic Haralambous's keynote on why teams ship more and check out faster. 45 minutes, in person or on Zoom, Teams or Meet. Lunch and learn is 20 minutes, €999, ex VAT. Virtual keynotes from €2,000, ex VAT. In-person keynotes from €4,500, ex VAT, 45 minutes. Travel is extra, and the price can be bundled with Q&A, podcasts and other extras.",
  alternates: { canonical: URL },
  openGraph: {
    title: "The Output Paradox | Nic Haralambous",
    description:
      "I help leaders reengage teams in the age of AI. Virtual lunch and learn €999 ex VAT, or an in-person keynote from €4,500.",
    url: URL,
    images: [{ url: "/og/output-paradox.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Output Paradox | Nic Haralambous",
    description: "A keynote on reengaging teams in the age of AI. From €999 ex VAT.",
    images: ["/og/output-paradox.png"],
  },
};

const QUOTES = [
  {
    quote:
      "Thank you for bringing such important insights, energy, and engagement to a topic that truly matters to our team.",
    who: "Outsystems",
  },
  {
    quote:
      "What a brilliant speaker. Engaging, professional and incredibly knowledgeable about the innovation space.",
    who: "Motus",
  },
];

export default async function OutputParadoxPage() {
  const settings = await v3ContentSettings();
  const paidOnline = checkoutIsLive();

  return (
    <div className="v3 has-sticky" data-no-orphan-opt-out="true">
      <link rel="preload" as="image" href="/v3/nic-hero-3.webp" fetchPriority="high" />
      <JsonLd data={outputParadoxServiceJsonLd()} />
      <JsonLd data={followOnSessionsJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Keynotes", path: "/keynotes/output-paradox-reengage-teams" },
          { name: "The Output Paradox", path: PATH },
        ])}
      />

      <section className="hero op pd-spotlight">
        <div className="glow" aria-hidden="true" />
        <div className="wrap">
          <div className="copy">
            <h1>
              The Output <em>Paradox</em>
            </h1>
            <p className="say">
              I help leaders reengage teams in the age of AI. <b>Your people are shipping more, and checking out faster.</b> That is the Output Paradox.
            </p>
            <div className="book" id="book">
              <div className="row">
                <div>
                  <h2>20-minute virtual lunch and learn</h2>
                  <p>
                    A short, live version of the talk for your team on Zoom, Teams or Meet. You pick the date, I tailor it to your people.
                  </p>
                </div>
                <div className="price">
                  €999
                  <small>per session, ex VAT</small>
                </div>
              </div>
              <div className="acts">
                <CheckoutButton id="buy-lunch-and-learn" offer="lunch-and-learn" label="Buy now" />
                <IntroCallLink />
                <a className="quiet-link" href="/contact">
                  Planning something bigger? Talk to me first
                </a>
              </div>
            </div>
            <div className="meter">
              <div>
                <b>Productivity up</b>
                more shipped
              </div>
              <div>
                <b>Activity up</b>
                more meetings, more messages
              </div>
              <div className="dn">
                <b>Engagement down</b>
                people checking out
              </div>
            </div>
          </div>
          <div className="photo">
            <img
              src="/v3/nic-hero-3.webp"
              alt="Nic Haralambous on stage, clicker in hand, mid talk"
              width={560}
              height={841}
              fetchPriority="high"
              decoding="sync"
            />
          </div>
        </div>
      </section>

      <div className="ip pd-calendar">
        <div className="wrap">
          <span>
            <b>In-person keynotes from €4,500, ex VAT, 45 minutes.</b> Travel is extra, and the price can be bundled with Q&A, podcasts and other extras.
          </span>
          <a className="link" href="/contact?format=in-person" style={{ color: "#fff" }}>
            Enquire about a date
          </a>
        </div>
      </div>

      <div className="proof p-broadcast">
        <div className="wrap">
          <LogoStrip />
        </div>
      </div>

      {settings.stageClipUrl ? (
        <section className="p-mic">
          <div className="wrap clip">
            <div>
              <h2 style={{ margin: "20px 0" }}>Ninety seconds of the real thing</h2>
              <p className="lead">
                Watch how I open the talk and how a room responds when you name the thing everyone can feel but nobody has said out loud.
              </p>
            </div>
            <a className="clip-frame" href={settings.stageClipUrl}>
              Watch the stage clip
            </a>
          </div>
        </section>
      ) : null}

      <section className="dark pd-bookmark">
        <div className="wrap">
          <div className="stat">
            <div className="big">1 in 4</div>
            <div>
              <h2 style={{ margin: "20px 0 22px" }}>
                Nearly one in four of your employees is disengaged right now
              </h2>
              <p className="lead">
                You can&apos;t see it clearly because AI is masking the signal. More documents, bigger roadmaps and more meetings about work nobody reads. Everything looks busy, and something still feels off.
              </p>
              <p className="mono" style={{ color: "#737a89", marginTop: 18 }}>
                Source: ActivTrak State of the Workplace
              </p>
            </div>
          </div>
          <div className="signals">
            <div>
              <h3>In what gets rewarded</h3>
              <ul>
                <li>Speed rewarded over thinking</li>
                <li>Curiosity punished instead of rewarded</li>
              </ul>
            </div>
            <div>
              <h3>In how people show up</h3>
              <ul>
                <li>&ldquo;Stay in my lane&rdquo; as the internal motto</li>
                <li>Teams waiting instead of initiating</li>
                <li>Top talent underperforming after being put in their place</li>
              </ul>
            </div>
            <div>
              <h3>In how leaders respond</h3>
              <ul>
                <li>Endless alignment meetings with no ownership of outcomes</li>
                <li>Leadership talking innovation while changing nothing</li>
                <li>Managers protecting comfort over momentum</li>
              </ul>
            </div>
          </div>
          <p className="pull">
            Artificial Intelligence won&apos;t kill your business. The other AI you should be worried about is <em>Apathy and Indifference.</em>
          </p>
        </div>
      </section>

      <section className="p-pen">
        <div className="wrap">
          <h2 style={{ margin: "20px 0", maxWidth: 860 }}>
            Curiosity doesn&apos;t vanish overnight. It erodes because it gets ignored.
          </h2>
          <p className="lead">
            By the time your best people check out, you&apos;re already too late. AI often speeds up the slide, because easy work replaces hard thinking.
          </p>
          <div className="arch">
            {[
              ["arch-01-curiosity.png", "Curiosity", false],
              ["arch-02-boredom.png", "Boredom", false],
              ["arch-03-apathy.png", "Apathy", false],
              ["arch-04-indifference.png", "Indifference", false],
              ["arch-05-exit.png", "Exit", true],
            ].map(([file, label, last], index) => (
              <figure key={String(label)}>
                <img
                  src={`/v3/${file}`}
                  alt={`${label}, step ${index + 1} of the Apathy Arch`}
                  loading="lazy"
                />
                <span className="mono" style={last ? { color: "var(--blue)" } : undefined}>
                  0{index + 1}
                </span>
                <h3>{label}</h3>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="p-lightbulb" style={{ background: "var(--paper2)", borderTop: "1px solid #D8D1C2" }}>
        <div className="wrap">
          <h2 style={{ margin: "20px 0 0" }}>Three shifts. Not eight action items.</h2>
          <div className="shifts">
            <article>
              <span className="n">01</span>
              <h3>Rewire what you reward</h3>
              <p>Stop rewarding speed and calling it culture.</p>
            </article>
            <article>
              <span className="n">02</span>
              <h3>Fix placement, not performance</h3>
              <p>Most disengagement isn&apos;t a person problem. It&apos;s a seat problem.</p>
            </article>
            <article>
              <span className="n">03</span>
              <h3>Make curiosity a practice, not a poster</h3>
              <p>Small bets, short cycles and permission to be wrong.</p>
            </article>
          </div>
          <h3 className="h-sub">What your team leaves with</h3>
          <div className="leaves">
            <div>
              <span className="mono">01</span>
              A clear read on what your organisation actually rewards, versus what it says it values
            </div>
            <div>
              <span className="mono">02</span>
              A map of where your people sit on the Apathy Arch, and why that&apos;s a structure problem
            </div>
            <div>
              <span className="mono">03</span>
              A working model for turning curiosity into action, without waiting for permission
            </div>
            <div>
              <span className="mono">04</span>
              One change your team can make in the room, before the applause stops
            </div>
          </div>
        </div>
      </section>

      <section className="dark pd-calendar" id="formats">
        <div className="wrap">
          <h2 style={{ margin: "20px 0 18px" }}>Pick the format that fits your team</h2>
          <p className="lead">
            Most teams start with the lunch and learn. If you want the full keynote for an all-hands, an offsite or a conference, talk to me first and I&apos;ll shape it around your event.
          </p>
          <div className="formats">
            <div className="fmt lead1">
              <h3>Lunch and learn</h3>
              <p>
                20 minutes, live on Zoom, Teams or Meet. The core of the Output Paradox, tailored to your people, with time for a few questions.
              </p>
              <ul>
                <li>{paidOnline ? "Booked and paid online" : "You pick the date"}</li>
                <li>Any team size</li>
                <li>Works across time zones</li>
              </ul>
              <div className="price">
                €999<span>ex VAT</span>
              </div>
              <CheckoutButton id="buy-lunch-and-learn-formats" offer="lunch-and-learn" label="Buy now" />
              <IntroCallLink />
            </div>
            <div className="fmt">
              <h3>Virtual keynote</h3>
              <p>
                The full 45 minute talk, built for remote and hybrid teams, with audience participation instead of a Q&amp;A tacked on at the end.
              </p>
              <ul>
                <li>All-hands, offsites, webinars</li>
                <li>Tailored stories and examples</li>
                <li>Frameworks your team keeps</li>
              </ul>
              <div className="price">
                <small className="from">from</small>€2,000<span>ex VAT</span>
              </div>
              <a className="btn ghost" href="/contact?format=virtual">
                Talk to me first
              </a>
            </div>
            <div className="fmt">
              <h3>In-person keynote</h3>
              <p>
                For conferences and leadership events. I come to you, anywhere from the UK and Europe to South Africa and the US East Coast. In-person keynotes from €4,500, ex VAT, 45 minutes. Travel is extra, and the price can be bundled with Q&amp;A, podcasts and other extras.
              </p>
              <ul>
                <li>45 minutes</li>
                <li>Extended Q&amp;A available</li>
                <li>Full day with delegates available</li>
              </ul>
              <div className="price">
                <small className="from">from</small>€4,500<span>ex VAT</span>
              </div>
              <a className="btn ghost" href="/contact?format=in-person">
                Enquire about a date
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="p-mic op-next" id="after-the-talk">
        <div className="wrap">
          <div className="next-band">
            <div>
              <h2>Your team heard why they&apos;re busy and checking out. This is where you fix the work.</h2>
              <p className="body">
                The talk explains the Output Paradox to the whole room. If you want your people to see what working with Grok Bot looks like, or your senior people to go back to their desks with their own work running differently, I run three sessions, after the talk or on their own. All three are virtual by default, and in person is possible, with travel extra.
              </p>
              <div className="op-photo">
                <img src="/v3/new/op-14.jpg" alt="Nic Haralambous on stage, arms open" width={1200} height={800} />
              </div>
            </div>
            <div className="next-list buy">
              <div>
                <p>
                  <b>My week with Grok Bot.</b> 90 minutes, up to 20 people, €2,999 per session, ex VAT. A show-and-tell: I take your team through my own Grok Bot setup, how I work with it and what&apos;s out there to do.
                </p>
                <CheckoutButton id="buy-my-week-with-grok-bot-op" offer="my-week-with-grok-bot" label="Buy My week with Grok Bot" />
              </div>
              <div>
                <p>
                  <b>Team Workflow Upgrade Session.</b> 2 hours, up to 8 senior leaders from one company, €4,999 per session, ex VAT, plus €499 per extra seat up to 10. Each person builds their own workflow in Grok Bot. The lunch and learn is a 20-minute talk for everyone; this is two hours of building for your senior team.
                </p>
                <CheckoutButton id="buy-team-workflow-upgrade-op" offer="team-workflow-upgrade" label="Buy the team session" />
              </div>
              <div>
                <p>
                  <b>Executive Workflow Upgrade Session.</b> 2 hours, one to one, €1,499, ex VAT. For the CEO: a Grok Bot introduction, a review of your workflow and an upgrade.
                </p>
                <CheckoutButton id="buy-executive-workflow-upgrade-op" offer="executive-workflow-upgrade" label="Buy your executive session" />
              </div>
              <p className="coach-line">
                Prefer ongoing support for yourself? Accountability business coaching is €399 a month, ex VAT.
              </p>
              <IntroCallLink />
            </div>
          </div>
        </div>
      </section>

      <section className="p-speech">
        <div className="wrap">
          <div className="quote-head">
            <img
              className="px pxq"
              src="/v3/px/Nic_Ancient_greece_16bit.png"
              alt="Pixel drawing of Nic as a Greek orator"
              width={226}
              height={280}
              loading="lazy"
            />
            <h2 style={{ margin: "20px 0 0" }}>From the people who booked it</h2>
          </div>
          <div className={QUOTES.length + (settings.testimonial ? 1 : 0) === 2 ? "quotes quotes-2" : "quotes"}>
            {QUOTES.map((quote) => (
              <blockquote className="q" key={quote.who}>
                <p>&ldquo;{quote.quote}&rdquo;</p>
                <span className="who">{quote.who}</span>
              </blockquote>
            ))}
            {settings.testimonial ? (
              <blockquote className="q">
                <p>&ldquo;{settings.testimonial.quote}&rdquo;</p>
                <span className="who">
                  <img
                    src={settings.testimonial.photo}
                    alt=""
                    width={48}
                    height={48}
                    style={{ width: 48, height: 48, objectFit: "cover", marginBottom: 8 }}
                  />
                  {settings.testimonial.name}, {settings.testimonial.role}, {settings.testimonial.company}
                </span>
              </blockquote>
            ) : null}
          </div>
        </div>
      </section>

      <WhatPeopleSay />

      <section className="p-person" style={{ background: "var(--paper2)", borderTop: "1px solid #D8D1C2" }}>
        <div className="wrap bio">
          <div className="pic">
            <img src="/v3/speaker.jpg" alt="Nic Haralambous, portrait" width={682} height={1024} loading="lazy" />
            <img
              className="px pxb"
              src="/v3/px/Nic_archeo_16bit.png"
              alt="Pixel drawing of Nic digging, overlapping the portrait"
              width={182}
              height={220}
              loading="lazy"
            />
          </div>
          <div>
            <h2 style={{ margin: "20px 0 22px" }}>I&apos;ve been building businesses since I was 16</h2>
            <p className="lead" style={{ color: "#4b4f5a" }}>
              I&apos;ve sold four of them, written three books and spent more than 20 years learning through failure and success. I&apos;ve spoken at SXSW and for teams at Standard Bank, Vodacom, Old Mutual and Nedbank. Everything I&apos;ve seen comes back to one thing: culture creates change.
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
          <h2 style={{ margin: "20px 0 0" }}>From booking to the room in three steps</h2>
          <div className="steps">
            <div>
              <span className="mono">01</span>
              <h3>Book or enquire</h3>
              <p>Book the lunch and learn online, or send me the details of a bigger event.</p>
            </div>
            <div>
              <span className="mono">02</span>
              <h3>We tailor it</h3>
              <p>A short call about your team, your audience and what you want them to change.</p>
            </div>
            <div>
              <span className="mono">03</span>
              <h3>I deliver it</h3>
              <p>Live on your platform or in your room, with frameworks your team keeps afterwards.</p>
            </div>
          </div>
          <div className="final op final-rule">
            <img
              className="px pxf op"
              src="/v3/px/Nic_Hunting_Pickaxe.png"
              alt="Pixel drawing of Nic with a pickaxe"
              width={170}
              height={288}
              loading="lazy"
            />
            <h2>If your team is doing more and feeling less, this is the conversation they need next</h2>
            <div className="acts" style={{ justifyContent: "center", marginTop: 36 }}>
              <CheckoutButton id="buy-lunch-and-learn-close" offer="lunch-and-learn" label="Buy now" />
              <span>€999, ex VAT</span>
              <IntroCallLink />
              <a className="quiet-link" href="/contact">
                Talk to me first
              </a>
            </div>
          </div>
        </div>
      </section>
      <StickyBookBar />
    </div>
  );
}
