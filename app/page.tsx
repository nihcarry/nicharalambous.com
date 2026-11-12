import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { LogoStrip } from "@/components/site/logo-strip";
import { NewsletterBlock } from "@/components/site/newsletter-block";
import { HOME_URL, organizationJsonLd } from "@/lib/metadata";
import { bookOfferHref } from "@/lib/site";
import { latestYouTubeVideo, v3ContentSettings, youtubePosterSrc } from "@/lib/v3-content";

export const metadata: Metadata = {
  title: { absolute: "Nic Haralambous | Keynote speaker" },
  description:
    "Nic Haralambous speaks to teams about the Output Paradox, in person or on Zoom, Teams or Meet. Virtual lunch and learn €999 ex VAT. Virtual keynotes from €1,500 ex VAT. In-person keynotes from €4,500, excluding travel and VAT.",
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
  const offer = bookOfferHref();
  const poster = video ? youtubePosterSrc(video.id) : null;

  return (
    <div className="v3" data-no-orphan-opt-out="true">
      <link rel="preload" as="image" href="/v3/nic-hero-4.webp" fetchPriority="high" />
      <JsonLd data={organizationJsonLd()} />
      <section className="hero home pd-beard">
        <div className="glow" aria-hidden="true" />
        <div className="wrap">
          <div className="copy">
            <div className="eyebrow">Keynote speaker · Virtual and in-person</div>
            <h1>
              Your teams are shipping more, and <em>checking out</em> faster
            </h1>
            <p className="say">
              I&apos;m Nic Haralambous. I&apos;ve built and sold four companies and written three books, and these days I speak to teams about <b>the Output Paradox</b>: why AI makes everyone busier and less engaged, and what leaders can do about it. I deliver it live on Zoom, Teams or Meet, or in your room.
            </p>
            <div className="acts">
              <a className="btn" href={offer}>
                Book a lunch and learn <span className="p">€999</span>
              </a>
              <a className="quiet-link" href="/keynotes/output-paradox-reengage-teams">
                See the keynote
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
            <b>In-person keynotes from €4,500</b>, excluding travel and VAT.
          </span>
          <a className="link" href="/contact?format=in-person" style={{ color: "#fff" }}>
            Enquire about a date
          </a>
        </div>
      </div>

      <div className="proof p-broadcast">
        <div className="wrap">
          <span className="mono">Teams and stages I have spoken to</span>
          <LogoStrip />
        </div>
      </div>

      <section className="p-mic">
        <div className="wrap">
          <div className="eyebrow">Three ways I can help</div>
          <h2 className="h-pillars">
            I speak, I coach and I write. Pick the one you <br className="h-break" />
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
              <span className="mono">01 · Keynotes</span>
              <h3>For your team or your stage</h3>
              <p>
                For People, L&amp;D and Talent leads at remote and hybrid companies, and for the organisers of conferences and leadership events.
              </p>
              <ul>
                <li>20-minute virtual lunch and learn, €999</li>
                <li>Virtual keynotes from €1,500 ex VAT</li>
                <li>In-person keynotes from €4,500</li>
              </ul>
              <div className="card-links">
              <a className="go" href="/keynotes/output-paradox-reengage-teams">
                See the Output Paradox <span>→</span>
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
              <span className="mono">02 · Coaching</span>
              <h3>No Bull Ship</h3>
              <p>
                An 8-week build sprint for people 40 and older who want to ship their first real product, with ruthless scope, clarity and weekly delivery.
              </p>
              <ul>
                <li>8 weeks, one real product shipped</li>
                <li>Ruthless scope and weekly delivery</li>
                <li>Built for experienced professionals</li>
              </ul>
              <span className="nbs">
                <i />
                No Bull Ship Academy · nobullship.co
              </span>
              <div className="card-links">
              <a className="go" href="https://nobullship.co">
                Go to nobullship.co <span>↗</span>
              </a>
              <a className="session-link" href="/session">
                Or book a 1:1 session
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
              <span className="mono">03 · Content</span>
              <h3>Read, watch, subscribe</h3>
              <p>
                I write to you every Thursday, I make videos on YouTube and I&apos;ve been writing on this site since 2013.
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
        </div>
      </section>

      <section className="dark pd-speech">
        <div className={settings.stageClipUrl ? "wrap talk" : "wrap talk solo"}>
          <div>
            <div className="eyebrow">The keynote</div>
            <h2 style={{ margin: "20px 0 22px" }}>
              Artificial Intelligence won&apos;t kill your business. <em>Apathy and Indifference</em> might.
            </h2>
            <p className="lead">
              Nearly one in four of your employees is disengaged right now, and AI is masking the signal. The Output Paradox gives your leaders three shifts and gives your team one change they can make before they leave the room.
            </p>
            <div className="acts2">
              <a className="btn" href={offer}>
                Book a lunch and learn <span className="p">€999</span>
              </a>
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

      <NewsletterBlock />

      <section className="p-quill">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Latest thinking</div>
              <h2 style={{ margin: "20px 0 0" }}>From the blog</h2>
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
                <span className="mono section-kicker">On YouTube</span>
                <a className="yt-card" href={`https://www.youtube.com/watch?v=${video.id}`}>
                  {poster ? (
                    <img src={poster} alt="" width={640} height={360} loading="lazy" />
                  ) : (
                    <span className="yt-still" />
                  )}
                  <span>{video.title}</span>
                </a>
              </div>
            ) : null}
            <div>
              <span className="mono section-kicker">The books</span>
              <div className="books">
                {BOOKS.map((book) => (
                  <a href={book.href} key={book.href}>
                    <img src={book.src} alt={book.alt} width={book.width} height={book.height} loading="lazy" />
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
            <a className="btn" href={offer}>
              Book a lunch and learn <span className="p">€999</span>
            </a>
            <a className="quiet-link" href="/contact">
              Talk to me first
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
