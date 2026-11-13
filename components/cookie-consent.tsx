"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { GA_MEASUREMENT_ID } from "@/components/google-analytics";
import {
  CONSENT_DENIED,
  CONSENT_EVENT,
  CONSENT_GRANTED,
  clearAnalyticsCookies,
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
  if (choice === "rejected") {
    clearAnalyticsCookies(GA_MEASUREMENT_ID);
    window.setTimeout(() => clearAnalyticsCookies(GA_MEASUREMENT_ID), 400);
  }
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
  if (readConsent() !== "accepted") {
    window.dispatchEvent(new Event("nh-consent-open"));
    return;
  }
  const frame = document.createElement("iframe");
  frame.src = src;
  frame.title = "Client testimonials";
  frame.loading = "lazy";
  frame.setAttribute("scrolling", "auto");
  frame.style.background = "transparent";
  box.replaceChildren(frame);
}

const consentButton: CSSProperties = {
  font: "inherit",
  fontWeight: 600,
  fontSize: 14,
  padding: "8px 10px",
  borderRadius: 2,
  border: "1px solid #8b93a7",
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
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const saved = readConsent();
    if (saved === "accepted") afterFirstPaint(() => loadGtag("accepted"));
    if (saved) setOpen(false);

    const openBanner = () => {
      document.documentElement.removeAttribute("data-nh-consent");
      setClosing(false);
      setOpen(true);
    };
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

  function choose(choice: ConsentChoice) {
    if (closing) return;
    writeConsent(choice);
    loadGtag(choice);
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }));
    setClosing(true);
    window.setTimeout(() => {
      document.documentElement.setAttribute("data-nh-consent", choice);
      setOpen(false);
    }, 150);
  }

  if (!open) return null;

  return (
    <div
      className={closing ? "consent is-closing" : "consent"}
      role="region"
      aria-label="Cookies"
      style={{
        zIndex: 44,
        background: "#12151c",
        color: "#EDEEF2",
        borderTop: "1px solid #8b93a7",
        fontSize: 14,
        lineHeight: 1.35,
      }}
    >
      <div className="wrap">
        <p style={{ margin: 0 }}>
          Analytics off unless you accept.{" "}
          <a href="/privacy" style={{ color: "#c5cad6", textDecoration: "underline", whiteSpace: "nowrap" }}>
            Privacy policy
          </a>
        </p>
        <div className="consent-actions" style={{ display: "flex", gap: 8 }}>
          <button type="button" style={consentButton} onClick={() => choose("rejected")}>
            Reject
          </button>
          <button type="button" style={consentButton} onClick={() => choose("accepted")}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
