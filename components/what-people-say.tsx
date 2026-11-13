"use client";

import { useEffect, useState } from "react";
import { CONSENT_EVENT, readConsent, type ConsentChoice } from "@/lib/consent";
import testimonials from "@/data/testimonials.json";

/** Wall of Love id from the embed that was on the site before the v3 redesign. */
export const TESTIMONIAL_WALL_ID = "5b8610ee-6b4a-4779-9503-cddbd8c5ac26";

export const TESTIMONIAL_IFRAME_ID = `testimonialto-${TESTIMONIAL_WALL_ID}`;

/**
 * The wall document's own background is already transparent, so the cream
 * section shows through. theme and background query params do not change it.
 */
export const TESTIMONIAL_EMBED_SRC =
  "https://embed-v2.testimonial.to/w/nic-haralambous---speaker?id=5b8610ee-6b4a-4779-9503-cddbd8c5ac26";

/**
 * Testimonial.to wall. The embed loads Simple Analytics, so the iframe stays
 * out of the page until the visitor accepts cookies.
 */
export function WhatPeopleSay() {
  const [choice, setChoice] = useState<ConsentChoice | null>(null);

  useEffect(() => {
    setChoice(readConsent());
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<ConsentChoice>).detail;
      setChoice(detail === "accepted" || detail === "rejected" ? detail : readConsent());
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  return (
    <section className="p-speaker what-people-say" id="what-people-say">
      <div className="wrap">
        <h2>What people say</h2>
        <ul className="say-cards">
          {testimonials.map((item) => (
            <li className="say-card" key={item.name}>
              <p>&ldquo;{item.quote}&rdquo;</p>
              <p className="who">
                <b>{item.name}</b>
                <span>{item.role}</span>
              </p>
            </li>
          ))}
        </ul>
        {choice === "accepted" ? (
          <div className="tt-wall">
            <iframe
              id={TESTIMONIAL_IFRAME_ID}
              src={TESTIMONIAL_EMBED_SRC}
              title="What people say about Nic Haralambous"
              loading="lazy"
              scrolling="auto"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        ) : (
          <div className="tt-more">
            <p>See more reviews</p>
            <button
              type="button"
              className="btn"
              onClick={() => window.dispatchEvent(new Event("nh-consent-open"))}
            >
              Cookie settings
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
