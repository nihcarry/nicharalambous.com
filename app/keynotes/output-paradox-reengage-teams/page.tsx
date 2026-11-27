/* eslint-disable @next/next/no-img-element -- static export uses plain img, same as the other v3 pages */
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { DetailsBlock } from "@/components/site/details-block";
import { InfoBar } from "@/components/site/info-bar";
import {
  EnquireScrollButton,
  KeynoteEnquiryForm,
} from "@/components/site/keynote-enquiry-form";
import { LogoStrip } from "@/components/site/logo-strip";
import {
  HUMAN_EDGE_ABOUT,
  HUMAN_EDGE_COVERS,
  HUMAN_EDGE_DETAILS,
  HUMAN_EDGE_ENQUIRE_COPY,
  HUMAN_EDGE_HERO,
  HUMAN_EDGE_INFO_BAR,
  HUMAN_EDGE_PROBLEM,
  HUMAN_EDGE_QUOTES,
  HUMAN_EDGE_TESTIMONIALS,
} from "@/lib/human-edge";
import { LUNCH_AND_LEARN_FACTS } from "@/lib/lunch-and-learn";
import { breadcrumbJsonLd, outputParadoxServiceJsonLd } from "@/lib/metadata";
import { followOnSessionsJsonLd } from "@/lib/offers";
import "./human-edge.css";

const PATH = "/keynotes/output-paradox-reengage-teams";
const URL = `https://www.nicharalambous.com${PATH}`;

export const metadata: Metadata = {
  title: { absolute: "The Human Edge | Nic Haralambous" },
  description: `The Human Edge is Nic Haralambous's keynote on why AI is making your team faster but feel less responsible for the work they deliver. Lunch and share at ${LUNCH_AND_LEARN_FACTS.priceLine}. Keynotes from €4,500.`,
  alternates: { canonical: URL },
  openGraph: {
    title: "The Human Edge | Nic Haralambous",
    description:
      "The future of work has someone's name on it. A keynote for C-suite and leadership teams on why AI is making your team faster but feel less responsible for the work they deliver.",
    url: URL,
    images: [{ url: "/og/output-paradox.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Human Edge | Nic Haralambous",
    description:
      "The future of work has someone's name on it. Keynote for C-suite and leadership teams.",
    images: ["/og/output-paradox.png"],
  },
};

export default function OutputParadoxPage() {
  return (
    <div className="v3 human-edge" data-no-orphan-opt-out="true">
      <link rel="preload" as="image" href={HUMAN_EDGE_HERO.photoSrc} fetchPriority="high" />
      <JsonLd data={outputParadoxServiceJsonLd()} />
      <JsonLd data={followOnSessionsJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Keynotes", path: PATH },
          { name: "The Human Edge", path: PATH },
        ])}
      />

      {/* 1. Hero */}
      <section className="hero op pd-spotlight" id="top">
        <div className="glow" aria-hidden="true" />
        <div className="wrap">
          <div className="copy">
            <h1>
              {HUMAN_EDGE_HERO.titleBefore} <em>{HUMAN_EDGE_HERO.titleEm}</em>
            </h1>
            <p className="sub">{HUMAN_EDGE_HERO.subtitle}</p>
            <p className="talk-line">{HUMAN_EDGE_HERO.talkLine}</p>
            <p className="hero-for">{HUMAN_EDGE_HERO.forLine}</p>
            <div className="acts">
              <EnquireScrollButton>{HUMAN_EDGE_HERO.cta}</EnquireScrollButton>
            </div>
          </div>
          <div className="photo">
            <img
              src={HUMAN_EDGE_HERO.photoSrc}
              alt={HUMAN_EDGE_HERO.photoAlt}
              width={HUMAN_EDGE_HERO.photoWidth}
              height={HUMAN_EDGE_HERO.photoHeight}
              fetchPriority="high"
              decoding="sync"
            />
          </div>
        </div>
      </section>

      {/* 2. Sticky info bar */}
      <InfoBar
        responseText={HUMAN_EDGE_INFO_BAR.responseText}
        trustedByLabel={HUMAN_EDGE_INFO_BAR.trustedByLabel}
        logos={HUMAN_EDGE_INFO_BAR.logos}
        deliveryText={HUMAN_EDGE_INFO_BAR.deliveryText}
        ctaLabel={HUMAN_EDGE_INFO_BAR.ctaLabel}
        ctaHref={HUMAN_EDGE_INFO_BAR.ctaHref}
        focusTargetId="f-name"
      />

      {/* 3. Keynote details six-item grid */}
      <DetailsBlock heading="Keynote details" items={HUMAN_EDGE_DETAILS} />

      {/* 4. Trusted by logo strip */}
      <div className="proof p-broadcast">
        <div className="wrap">
          <LogoStrip />
        </div>
      </div>

      {/* 5. Pull quotes */}
      <section className="edge p-speech" aria-label="The human edge">
        <div className="wrap">
          <blockquote className="edge-q edge-lead">
            <p>{HUMAN_EDGE_QUOTES.lead}</p>
          </blockquote>
          <div className="edge-more">
            {HUMAN_EDGE_QUOTES.secondary.map((quote) => (
              <blockquote className="edge-q" key={quote}>
                <p>{quote}</p>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* 6. The problem section */}
      <section className="dark pd-bookmark">
        <div className="wrap">
          <div className="stat">
            <div className="big">{HUMAN_EDGE_PROBLEM.stat}</div>
            <div>
              <h2 style={{ margin: "20px 0 22px" }}>{HUMAN_EDGE_PROBLEM.heading}</h2>
              <p className="lead">{HUMAN_EDGE_PROBLEM.lead}</p>
              <p className="mono" style={{ color: "#737a89", marginTop: 18 }}>
                {HUMAN_EDGE_PROBLEM.source}
              </p>
            </div>
          </div>
          <p className="pull">
            {HUMAN_EDGE_PROBLEM.pullBefore} <em>{HUMAN_EDGE_PROBLEM.pullEm}</em>
          </p>
        </div>
      </section>

      {/* 7. What the talk covers */}
      <section className="covers p-pen" id="covers">
        <div className="wrap">
          <h2>{HUMAN_EDGE_COVERS.heading}</h2>
          <ol className="covers-list">
            <li className="cover">
              <span className="cover-n" aria-hidden="true">
                {HUMAN_EDGE_COVERS.outputParadox.number}
              </span>
              <div className="cover-body">
                <h3>{HUMAN_EDGE_COVERS.outputParadox.heading}</h3>
                {HUMAN_EDGE_COVERS.outputParadox.paragraphs.map((text) => (
                  <p className="lead" key={text}>
                    {text}
                  </p>
                ))}
              </div>
            </li>

            <li className="cover">
              <span className="cover-n" aria-hidden="true">
                {HUMAN_EDGE_COVERS.apathyTrap.number}
              </span>
              <div className="cover-body">
                <h3>{HUMAN_EDGE_COVERS.apathyTrap.heading}</h3>
                {HUMAN_EDGE_COVERS.apathyTrap.paragraphs.map((text) => (
                  <p className="lead" key={text}>
                    {text}
                  </p>
                ))}
                <div className="arch">
                  {HUMAN_EDGE_COVERS.apathyTrap.arch.map((step, index) => (
                    <figure key={step.label}>
                      <img
                        src={`/v3/${step.file}`}
                        alt={`${step.label}, step ${index + 1} of the Apathy Arch`}
                        loading="lazy"
                      />
                      <span
                        className="mono"
                        style={step.highlight ? { color: "var(--blue)" } : undefined}
                      >
                        {step.step}
                      </span>
                      <h3>{step.label}</h3>
                    </figure>
                  ))}
                </div>
              </div>
            </li>

            <li className="cover">
              <span className="cover-n" aria-hidden="true">
                {HUMAN_EDGE_COVERS.threeShifts.number}
              </span>
              <div className="cover-body">
                <h3>{HUMAN_EDGE_COVERS.threeShifts.heading}</h3>
                <div className="shifts">
                  {HUMAN_EDGE_COVERS.threeShifts.shifts.map((shift) => (
                    <article key={shift.number}>
                      <span className="n">{shift.number}</span>
                      <h3>{shift.heading}</h3>
                      <p>{shift.body}</p>
                    </article>
                  ))}
                </div>
              </div>
            </li>

            <li className="cover">
              <span className="cover-n" aria-hidden="true">
                {HUMAN_EDGE_COVERS.leavesWith.number}
              </span>
              <div className="cover-body">
                <h3>{HUMAN_EDGE_COVERS.leavesWith.heading}</h3>
                <div className="leaves">
                  {HUMAN_EDGE_COVERS.leavesWith.items.map((item) => (
                    <div key={item.number}>
                      <span className="mono">{item.number}</span>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* 8. What people say */}
      <section className="p-speaker what-people-say" id="what-people-say">
        <div className="wrap">
          <h2>What people say</h2>
          <ul className="say-cards">
            {HUMAN_EDGE_TESTIMONIALS.map((item) => (
              <li className="say-card" key={item.name}>
                <p>{item.quote}</p>
                <p className="who">
                  <span className="initial" aria-hidden="true">
                    {item.initial}
                  </span>
                  <span className="who-txt">
                    <b>{item.name}</b>
                    <span>{item.role}</span>
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 9. About */}
      <section
        className="p-person about-nic"
        style={{ background: "var(--paper2)", borderTop: "1px solid #D8D1C2" }}
      >
        <div className="wrap bio">
          <div className="pic">
            <img
              src={HUMAN_EDGE_ABOUT.photoSrc}
              alt={HUMAN_EDGE_ABOUT.photoAlt}
              width={420}
              height={525}
              loading="lazy"
            />
          </div>
          <div>
            <h2 style={{ margin: "20px 0 22px" }}>{HUMAN_EDGE_ABOUT.heading}</h2>
            <p className="lead" style={{ color: "#4b4f5a" }}>
              {HUMAN_EDGE_ABOUT.lead}
            </p>
            <div className="nums">
              {HUMAN_EDGE_ABOUT.stats.map((stat) => (
                <div key={stat.label}>
                  <b>{stat.value}</b>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. Inline enquiry form */}
      <section className="dark pd-cta enquire" id="enquire" aria-labelledby="enq-h">
        <div className="wrap">
          <div className="enq-head">
            <h2 id="enq-h">{HUMAN_EDGE_ENQUIRE_COPY.heading}</h2>
            <p>{HUMAN_EDGE_ENQUIRE_COPY.lead}</p>
          </div>
          <KeynoteEnquiryForm />
          <div className="enq-after">
            <a className="quiet-link" href={HUMAN_EDGE_ENQUIRE_COPY.afterLinkHref}>
              {HUMAN_EDGE_ENQUIRE_COPY.afterLinkLabel}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
