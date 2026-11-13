import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { LogoStrip } from "@/components/site/logo-strip";
import { NewsletterBlock } from "@/components/site/newsletter-block";
import { WhatPeopleSay } from "@/components/what-people-say";
import { CheckoutButton, IntroCallLink } from "@/components/site/checkout-cta";
import { INTRO_CALL_URL } from "@/lib/offers";
import { HOME_URL, organizationJsonLd } from "@/lib/metadata";
import { latestYouTubeVideo, v3ContentSettings, youtubePosterSrc } from "@/lib/v3-content";

export const metadata: Metadata = {
  title: { absolute: "Nic Haralambous | Keynote speaker" },
  description:
    "Nic Haralambous speaks to teams about the Output Paradox, runs Grok Bot workshops for leadership teams and coaches founders and CEOs. Lunch and learn €999, virtual keynotes from €2,000 and in-person keynotes from €4,500, all ex VAT.",
  alternates: { canonical: HOME_URL },
  openGraph: {
    title: "Nic Haralambous | Keynote speaker",
    description:
      "Your teams are shipping more, and checking out faster. Book a 20-minute virtual lunch and learn for €999 ex VAT, or an in-person keynote from €4,500.",
    url: HOME_URL,
    images: [{ url: "/og/home.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nic Haralambous | Keynote speaker",
    description:
      "Keynotes on the Output Paradox, in person or virtually. Lunch and learn €999 ex VAT.",
    images: ["/og/home.png"],
  },
};

const POSTS = [
  {
    href: "/blog/canva-creates-1271-entrepreneurs",
    meta: "6 Nov 2026 · 4 min",
    title: "Canva creates 1271 entrepreneurs",
    excerpt:
      "Canva's layoff package gives departing staff six months' salary, MacBooks, coaching and a $10,000 grant to start their own business.",
  },
  {
    href: "/blog/building-software-is-a-solved-problem-what-next",
    meta: "14 Oct 2026 · 4 min",
    title: "Building software is a solved problem. What next?",
    excerpt:
      "Anyone can build any software now. But building software is not the same as building a business.",
  },
  {
    href: "/blog/hell-yeah-you-can-be-employed-an-entrepreneur",
    meta: "23 Sep 2026 · 5 min",
    title: "Hell yeah you can be employed and an entrepreneur",
    excerpt:
      "Figure out what success looks like for your business, match it to the time you can realistically spend, and build both.",
  },
];

const BOOKS = [
  {
    href: "/books/do-fail-learn-repeat",
    src: "/v3/books/Do_Fail_Learn_repeate.jpg",
    alt: "Cover of Do. Fail. Learn. Repeat. by Nic Haralambous",
    width: 304,
    height: 466,
  },
  {
    href: "/books/the-business-builders-toolkit",
    src: "/v3/books/Business_Builders_Toolkit.jpg",
    alt: "Cover of The Business Builder's Toolkit by Nic Haralambous",
    width: 326,
    height: 522,
  },
  {
    href: "/books/how-to-start-a-side-hustle",
    src: "/v3/books/How_to_start_a_side_Hustle.jpg",
    alt: "Cover of How to Start a Side Hustle by Nic Haralambous",
    width: 279,
    height: 445,
  },
];

export default async function HomePage() {
  const [video, settings] = await Promise.all([latestYouTubeVideo(), v3ContentSettings()]);
  const poster = video ? youtubePosterSrc(video.id) : null;

  return (
    <div className="v3" data-no-orphan-opt-out="true">
      <link rel="preload" as="image" href="/v3/nic-hero-4.webp" fetchPriority="high" />
      <JsonLd data={organizationJsonLd()} />
      <section className="hero home pd-beard">
        <div className="glow" aria-hidden="true" />
        <div className="wrap">
          <div className="copy">
            <h1>
              Your teams are shipping more, and <em>checking out</em> faster
            </h1>
            <p className="say">
              I&apos;m Nic Haralambous. I&apos;ve built and sold four companies and written three books, and these days I speak to teams about <b>the Output Paradox</b>: why AI makes everyone busier and less engaged, and what leaders can do about it. I deliver it live on Zoom, Teams or Meet, or in your room. I also run hands-on Grok Bot workshops for leadership teams, and I coach founders and CEOs one to one.
            </p>
            <div className="acts">
              <CheckoutButton id="buy-lunch-and-learn-home" offer="lunch-and-learn" label="Buy the lunch and learn" />
              <span>€999, ex VAT</span>
              <IntroCallLink />
              <a className="quiet-link" href="/workshops">
                See the workshops
              </a>
            </div>
          </div>
          <div className="photo">
            <img
              src="/v3/nic-hero-4.webp"
              alt="Nic Haralambous speaking, hands open, in a white shirt"
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

      <section className="p-mic">
        <div className="wrap">
          <h2 className="h-pillars">
            I speak, I run workshops, I coach and I write. Pick the one you <br className="h-break" />
            came for.
          </h2>
          <div className="pillars">
            <div className="pl k">
              <img
                className="px pxi s"
                src="/v3/px/Nic_soap_16bit.png"
                alt="Pixel drawing of Nic with a megaphone"
                width={115}
                height={240}
                loading="lazy"
              />
              <h3>For your team or your stage</h3>
              <p>
                For People, L&amp;D and Talent leads at remote and hybrid companies, and for the organisers of conferences and leadership events.
              </p>
              <ul>
                <li>20-minute virtual lunch and learn, €999, ex VAT</li>
                <li>Virtual keynotes from €2,000, ex VAT</li>
                <li>In-person keynotes from €4,500, ex VAT, travel extra</li>
              </ul>
              <div className="card-links">
              <CheckoutButton id="buy-lunch-and-learn-speak" offer="lunch-and-learn" label="Buy the lunch and learn" />
              <a className="go" href="/keynotes/output-paradox-reengage-teams">
                See the Output Paradox <span>→</span>
              </a>
              </div>
            </div>
            <div className="pl">
              <img
                className="px pxi"
                src="/v3/px/Nic_Ancient_greece_16bit.png"
                alt="Pixel drawing of Nic as a Greek orator"
                width={226}
                height={280}
                loading="lazy"
              />
              <h3>For your leadership team</h3>
              <p>
                Grok Bot workshops, virtual by default. Watch how I work with it, build your own workflows with me as a team, or upgrade your own week one to one.
              </p>
              <ul>
                <li>My week with Grok Bot: a 90-minute show-and-tell for up to 20 people, €2,999, ex VAT</li>
                <li>Team Workflow Upgrade Session: 2 hours, hands-on, up to 8 senior leaders from one company, €4,999, ex VAT (extra seats €499 each, up to 10)</li>
                <li>Executive Workflow Upgrade Session: 2 hours, one to one, for CEOs, €1,499, ex VAT</li>
              </ul>
              <div className="card-links">
                <CheckoutButton id="buy-my-week-with-grok-bot-home" offer="my-week-with-grok-bot" label="Buy now" />
                <CheckoutButton id="buy-team-workflow-upgrade-home" offer="team-workflow-upgrade" label="Buy now" />
                <CheckoutButton id="buy-executive-workflow-upgrade-home" offer="executive-workflow-upgrade" label="Buy now" />
                <a className="go" href="/workshops">
                  See all workshops <span>→</span>
                </a>
              </div>
            </div>
            <div className="pl">
              <img
                className="px pxi"
                src="/v3/px/Nic_Hunting_Pickaxe.png"
                alt="Pixel drawing of Nic with a pickaxe"
                width={170}
                height={288}
                loading="lazy"
              />
              <h3>For founders and CEOs</h3>
              <p>
                Accountability business coaching. Two 60-minute calls a month with me, plus ongoing accountability and chat support in between, from someone who has built and sold four companies.
              </p>
              <ul>
                <li>€399 a month, ex VAT</li>
                <li>A sounding board for the decisions in your business</li>
                <li>Can&apos;t afford it right now? Apply for pay-what-you-can-afford coaching</li>
              </ul>
              <div className="card-links">
                <CheckoutButton
                  id="buy-accountability-coaching-home"
                  offer="accountability-coaching"
                  label="Start coaching, €399 a month"
                />
                <a className="go" href="/session">
                  See coaching <span>→</span>
                </a>
              </div>
            </div>
            <div className="pl">
              <img
                className="px pxi k"
                src="/v3/px/Nic_archeo_16bit.png"
                alt="Pixel drawing of Nic digging"
                width={182}
                height={220}
                loading="lazy"
              />
              <h3>Read, watch, subscribe</h3>
              <p>
                I write to you every week, I make videos on YouTube and I&apos;ve been writing on this site since 2013.
              </p>
              <ul>
                <li>The weekly newsletter</li>
                <li>YouTube</li>
                <li>The blog and three books</li>
              </ul>
              <div className="card-links">
              <a className="go" href="#newsletter">
                Get the newsletter <span>↓</span>
              </a>
              </div>
            </div>
          </div>
          <p className="offer-follow">
            <a className="link" href={INTRO_CALL_URL} target="_blank" rel="noopener noreferrer">
              Not sure which one fits? Book a free 20-minute intro call
            </a>
          </p>
        </div>
      </section>

      <section className="dark pd-speech">
        <div className={settings.stageClipUrl ? "wrap talk" : "wrap talk solo"}>
          <div>
            <h2 style={{ margin: "0 0 22px" }}>
              Artificial Intelligence won&apos;t kill your business. <em>Apathy and Indifference</em> might.
            </h2>
            <p className="lead">
              Nearly one in four of your employees is disengaged right now, and AI is masking the signal. The Output Paradox gives your leaders three shifts and gives your team one change they can make before they leave the room.
            </p>
            <div className="acts2">
              <CheckoutButton id="buy-lunch-and-learn-home-talk" offer="lunch-and-learn" label="Buy now" />
              <span>€999, ex VAT</span>
              <IntroCallLink />
              <a className="quiet-link" href="/keynotes/output-paradox-reengage-teams">
                Read about the talk
              </a>
            </div>
          </div>
          {settings.stageClipUrl ? (
            <a className="clip-frame" href={settings.stageClipUrl}>
              Watch the stage clip
            </a>
          ) : null}
        </div>
      </section>

      <WhatPeopleSay />

      <NewsletterBlock />

      <section className="p-quill">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2 style={{ margin: 0 }}>From the blog</h2>
            </div>
            <a className="link" href="/blog">
              Read the blog
            </a>
          </div>
          <div className="posts">
            {POSTS.map((post) => (
              <a className="post" href={post.href} key={post.href}>
                <span className="mono">{post.meta}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </a>
            ))}
          </div>
          <div className="content-row">
            {video ? (
              <div>
                <a className="yt-card" href={`https://www.youtube.com/watch?v=${video.id}`}>
                  {poster ? (
                    <img src={poster} alt="" width={640} height={360} />
                  ) : (
                    <span className="yt-still" />
                  )}
                  <span>{video.title}</span>
                </a>
              </div>
            ) : null}
            <div>
              <div className="books">
                {BOOKS.map((book) => (
                  <a href={book.href} key={book.href}>
                    <img src={book.src} alt={book.alt} width={book.width} height={book.height} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="dark pd-cta" style={{ position: "relative" }}>
        <img
          className="px pxf"
          src="/v3/px/Nic_Ancient_greece_16bit.png"
          alt="Pixel drawing of Nic as a Greek orator"
          width={226}
          height={280}
          loading="lazy"
        />
        <div className="wrap final">
          <h2>If your team is doing more and feeling less, let&apos;s talk</h2>
          <div className="acts" style={{ justifyContent: "center", marginTop: 36 }}>
            <CheckoutButton id="buy-lunch-and-learn-home-final" offer="lunch-and-learn" label="Buy the lunch and learn" />
            <span>€999, ex VAT</span>
            <a className="quiet-link" href="/contact">
              Talk to me first
            </a>
            <span>
              Or see the <a className="link" href="/workshops">workshops</a> and <a className="link" href="/session">coaching</a>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
