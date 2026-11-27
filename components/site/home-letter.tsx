/* eslint-disable @next/next/no-img-element -- static export uses plain img, same as the other v3 pages */
import { HomeLetterNewsletter } from "@/components/site/home-letter-newsletter";
import {
  ABOUT_COPY,
  FINAL_COPY,
  HERO_COPY,
  HOME_LINKS,
  HOME_PHOTOS,
  LETTER_COPY,
  LUNCH_COPY,
  NEWS_COPY,
  ROOM_COPY,
} from "@/lib/home-letter";

function TextLink({ href, children }: { href: string; children: string }) {
  return (
    <a className="tlink" href={href}>
      <span>{children}</span>
    </a>
  );
}

export function HomeLetter({ fontClassName }: { fontClassName: string }) {
  return (
    <div id="home-letter" className={`v3 home-letter ${fontClassName}`} data-no-orphan-opt-out="true">
      <section className="hero" id="top">
        <div className="wrap">
          <div className="copy">
            <h1>
              {HERO_COPY.titleBefore} <em>{HERO_COPY.titleEm}</em>
            </h1>
            <p className="lead">{HERO_COPY.lead1}</p>
            <p className="lead">{HERO_COPY.lead2}</p>
            <p className="start">{HERO_COPY.start}</p>
            <div className="cta">
              <a className="btn" id="buy-lunch-and-learn-home" href={HOME_LINKS.book}>
                {HERO_COPY.book}
              </a>
              <TextLink href={HOME_LINKS.workshop}>{HERO_COPY.workshop}</TextLink>
            </div>
            <p className="fine mono">{HERO_COPY.fine}</p>
          </div>
          <div className="photo">
            <img
              src={HOME_PHOTOS.hero}
              width={HOME_PHOTOS.heroWidth}
              height={HOME_PHOTOS.heroHeight}
              alt={HOME_PHOTOS.heroAlt}
              fetchPriority="high"
              decoding="sync"
            />
          </div>
        </div>
      </section>

      <section className="letter letter-a p-envelope" id="letter" aria-labelledby="letter-h">
        <div className="wrap">
          <div className="stack">
            <article className="sheet">
              <img className="seal" src={HOME_PHOTOS.seal} alt="" width={34} height={34} />
              <p className="greet">{LETTER_COPY.greet}</p>
              <h2 className="subj" id="letter-h">
                {LETTER_COPY.subjectBefore} <em>{LETTER_COPY.subjectEm}</em>
              </h2>
              <div className="body">
                {LETTER_COPY.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <p>
                  {LETTER_COPY.ahead}
                  <mark>{LETTER_COPY.highlight}</mark>{" "}
                </p>
                <p>{LETTER_COPY.closing}</p>
              </div>
              <div className="sign">
                <img
                  className="face"
                  src={HOME_PHOTOS.face}
                  alt={HOME_PHOTOS.faceAlt}
                  width={320}
                  height={320}
                />
                <div>
                  <span className="script" aria-hidden="true">
                    {LETTER_COPY.signature}
                  </span>
                  <div className="pname">{LETTER_COPY.name}</div>
                </div>
              </div>
              <div className="ps">
                <TextLink href={HOME_LINKS.start}>{`${LETTER_COPY.seeHow} →`}</TextLink>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="sec cream2 bio p-person" id="about">
        <div className="wrap">
          <div className="grid">
            <img
              src={HOME_PHOTOS.bio}
              alt={HOME_PHOTOS.bioAlt}
              width={1000}
              height={1250}
            />
            <div>
              <h2>{ABOUT_COPY.title}</h2>
              <p>{ABOUT_COPY.p1}</p>
              <p>{ABOUT_COPY.p2}</p>
              <TextLink href={HOME_LINKS.about}>{ABOUT_COPY.link}</TextLink>
            </div>
          </div>
        </div>
      </section>

      <section className="sec dark lunch pd-calendar" id="lunch">
        <div className="wrap">
          <div className="card">
            <div>
              <h2>{LUNCH_COPY.title}</h2>
              <p>
                {LUNCH_COPY.body}
                <span className="price-chip">{LUNCH_COPY.price}</span>
              </p>
            </div>
            <div className="act">
              <a className="btn" id="buy-lunch-and-learn-home-lunch" href={HOME_LINKS.book}>
                {LUNCH_COPY.book}
              </a>
              <TextLink href={HOME_LINKS.contact}>{LUNCH_COPY.talk}</TextLink>
            </div>
          </div>
        </div>
      </section>

      <section className="sec room p-speech">
        <div className="wrap">
          <h2>{ROOM_COPY.title}</h2>
          <div className="qs">
            {ROOM_COPY.quotes.map((item) => (
              <figure key={item.who}>
                <blockquote>{item.quote}</blockquote>
                <figcaption>{item.who}</figcaption>
              </figure>
            ))}
          </div>
          <TextLink href={HOME_LINKS.more}>{ROOM_COPY.more}</TextLink>
        </div>
      </section>

      <section className="sec dark final pd-cta">
        <div className="wrap">
          <h2>{FINAL_COPY.title}</h2>
          <a className="btn" id="buy-lunch-and-learn-home-final" href={HOME_LINKS.book}>
            {FINAL_COPY.book}
          </a>
          <p className="price">{FINAL_COPY.price}</p>
          <TextLink href={HOME_LINKS.workshop}>{FINAL_COPY.workshop}</TextLink>
        </div>
      </section>

      <section className="news pd-envelope" id="newsletter">
        <div className="wrap">
          <div>
            <h2>{NEWS_COPY.title}</h2>
            <p>{NEWS_COPY.body}</p>
          </div>
          <HomeLetterNewsletter />
        </div>
      </section>
    </div>
  );
}
