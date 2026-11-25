"use client";

import { useEffect } from "react";
import { LUNCH_AND_LEARN_FALLBACK_HREF, lunchLearnEmbedUrl } from "@/lib/lunch-and-learn";

const WIDGET_SRC = "https://assets.calendly.com/assets/external/widget.js";
const IFRAME_TITLE = "Book the lunch and learn";

/** Scrolls to the embed and moves focus there. The href still works without JS. */
export function PickSlotLink() {
  return (
    <a
      className="btn-book"
      href="#calendly"
      onClick={(event) => {
        const target = document.getElementById("calendly");
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        target.focus({ preventScroll: true });
      }}
    >
      <span className="ic" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
          <path d="M3.5 10h17M8 3v4M16 3v4" />
          <path d="M9 14.5l2.2 2.2L15.5 13" />
        </svg>
      </span>
      <span className="lbl">Pick your slot</span>
      <span className="dn" aria-hidden="true">
        ↓
      </span>
    </a>
  );
}

/**
 * Calendly inline widget. The URL defaults to the live lunch and learn event.
 * An empty URL still shows the enquire link instead of a calendar.
 */
export function LunchLearnEmbed() {
  const url = lunchLearnEmbedUrl();

  useEffect(() => {
    if (!url) return;
    const root = document.getElementById("calendly");
    function labelFrame() {
      root?.querySelector("iframe")?.setAttribute("title", IFRAME_TITLE);
    }
    const observer = new MutationObserver(labelFrame);
    if (root) observer.observe(root, { childList: true, subtree: true });

    function onLoad() {
      labelFrame();
    }
    const existing = document.querySelector(`script[src="${WIDGET_SRC}"]`);
    if (existing) {
      labelFrame();
    } else {
      const script = document.createElement("script");
      script.src = WIDGET_SRC;
      script.async = true;
      script.addEventListener("load", onLoad);
      document.body.appendChild(script);
    }
    return () => observer.disconnect();
  }, [url]);

  if (!url) {
    return (
      <div className="widget-fallback">
        <p>The booking calendar is not connected yet.</p>
        <a className="btn btn-wrap" href={LUNCH_AND_LEARN_FALLBACK_HREF}>
          Enquire to book
        </a>
      </div>
    );
  }

  return (
    <div
      className="calendly-inline-widget"
      data-url={url}
      // Calendly's widget.js copies this attribute onto the iframe parent.
      // An absent style becomes the literal "null", and a missing height
      // leaves the booking calendar on its loading animation.
      style={{ minWidth: "320px", height: "860px" }}
    />
  );
}
