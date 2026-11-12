"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { GA_MEASUREMENT_ID } from "@/components/google-analytics";
import {
  CONSENT_DENIED,
  CONSENT_GRANTED,
  type ConsentChoice,
  readConsent,
  writeConsent,
} from "@/lib/consent";

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

let gtagRequested = false;

function ensureGtagStub() {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      window.dataLayer!.push(arguments);
    };
  }
  window.gtag("consent", "default", CONSENT_DENIED);
}

function loadGtag(choice: ConsentChoice) {
  ensureGtagStub();
  window.gtag!("consent", "update", choice === "accepted" ? CONSENT_GRANTED : CONSENT_DENIED);
  if (choice !== "accepted" || gtagRequested) return;
  gtagRequested = true;
  window.gtag!("js", new Date());
  window.gtag!("config", GA_MEASUREMENT_ID);
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);
}

function afterFirstPaint(run: () => void) {
  let done = false;
  const start = () => {
    if (done) return;
    done = true;
    window.setTimeout(run, 50);
  };
  try {
    const observer = new PerformanceObserver((list) => {
      if (list.getEntries().length) {
        observer.disconnect();
        start();
      }
    });
    observer.observe({ type: "largest-contentful-paint", buffered: true });
  } catch {
    // Older browsers still get the timeout below.
  }
  window.setTimeout(start, 2500);
}

function playYouTube(button: HTMLButtonElement) {
  const id = button.getAttribute("data-yt-play");
  const box = button.closest(".yt-facade");
  if (!id || !box) return;
  const frame = document.createElement("iframe");
  frame.src = `https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1`;
  frame.title = button.getAttribute("aria-label") || "Video";
  frame.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  frame.allowFullscreen = true;
  box.replaceChildren(frame);
}

function playTestimonial(button: HTMLButtonElement) {
  const src = button.getAttribute("data-tt-play");
  const box = button.closest(".tt-facade");
  if (!src || !box) return;
  const frame = document.createElement("iframe");
  frame.src = src;
  frame.title = "Client testimonials";
  frame.setAttribute("scrolling", "no");
  box.replaceChildren(frame);
}

const consentButton: CSSProperties = {
  flex: 1,
  font: "inherit",
  fontWeight: 600,
  fontSize: 14,
  padding: "10px 12px",
  borderRadius: 2,
  border: "1px solid #232733",
  background: "transparent",
  color: "#fff",
  cursor: "pointer",
};

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      className="cookie-settings"
      onClick={() => window.dispatchEvent(new Event("nh-consent-open"))}
    >
      Cookie settings
    </button>
  );
}

export function CookieConsent() {
  const [open, setOpen] = useState(true);
  const [pinTop, setPinTop] = useState(false);

  useEffect(() => {
    const saved = readConsent();
    if (saved === "accepted") afterFirstPaint(() => loadGtag("accepted"));
    if (saved) setOpen(false);

    const openBanner = () => setOpen(true);
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const youtube = target.closest("[data-yt-play]");
      if (youtube instanceof HTMLButtonElement) {
        playYouTube(youtube);
        return;
      }
      const testimonials = target.closest("[data-tt-play]");
      if (testimonials instanceof HTMLButtonElement) playTestimonial(testimonials);
    };
    window.addEventListener("nh-consent-open", openBanner);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("nh-consent-open", openBanner);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const place = () => {
      const bar = document.querySelector(".sticky-book");
      const barBox = bar?.getBoundingClientRect();
      const barVisible =
        !!bar &&
        !bar.hasAttribute("hidden") &&
        getComputedStyle(bar).display !== "none" &&
        !!barBox &&
        barBox.height > 0 &&
        barBox.top < window.innerHeight;
      const lift = barVisible ? Math.round(barBox.height) + 12 : 16;
      const banner = {
        top: window.innerHeight - lift - 132,
        bottom: window.innerHeight - lift,
        left: 16,
        right: Math.min(356, window.innerWidth - 16),
      };
      const hits = (el: Element | null) => {
        if (!el) return false;
        const box = el.getBoundingClientRect();
        if (box.width < 2 || box.height < 2) return false;
        return !(
          box.right < banner.left ||
          box.left > banner.right ||
          box.bottom < banner.top ||
          box.top > banner.bottom
        );
      };
      const blocked =
        hits(document.getElementById("book")) ||
        hits(document.querySelector(".hero .acts")) ||
        hits(document.querySelector(".sticky-book:not([hidden])"));
      setPinTop(blocked);
    };
    place();
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    const timer = window.setInterval(place, 400);
    return () => {
      window.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
      window.clearInterval(timer);
    };
  }, [open]);

  function choose(choice: ConsentChoice) {
    writeConsent(choice);
    loadGtag(choice);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className={pinTop ? "consent is-top" : "consent"}
      role="region"
      aria-label="Cookies"
      style={{
        position: "fixed",
        zIndex: 44,
        background: "#0A0C10",
        color: "#EDEEF2",
        border: "1px solid #232733",
        padding: "14px 16px",
        fontSize: 14,
        lineHeight: 1.4,
      }}
    >
      <p style={{ margin: "0 0 12px" }}>Analytics cookies stay off unless you accept.</p>
      <div className="consent-actions" style={{ display: "flex", gap: 8 }}>
        <button type="button" style={consentButton} onClick={() => choose("rejected")}>
          Reject
        </button>
        <button type="button" style={consentButton} onClick={() => choose("accepted")}>
          Accept
        </button>
      </div>
    </div>
  );
}
