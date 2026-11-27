/* eslint-disable @next/next/no-img-element -- static export uses plain img, same as the other v3 pages */
"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import "./info-bar.css";

export type InfoBarLogo = {
  src: string;
  alt: string;
  /** Optical height in pixels so logos match in visual weight. */
  height?: number;
  /** Optional max-width in pixels. */
  maxWidth?: number;
};

export type InfoBarProps = {
  responseText: string;
  trustedByLabel?: string;
  logos: readonly InfoBarLogo[];
  deliveryText: string;
  ctaLabel: string;
  ctaHref: string;
  focusTargetId?: string;
  className?: string;
};

export function InfoBar({
  responseText,
  trustedByLabel = "Trusted by",
  logos,
  deliveryText,
  ctaLabel,
  ctaHref,
  focusTargetId,
  className,
}: InfoBarProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setStuck(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  function onCtaClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!ctaHref.startsWith("#")) return;
    const target = document.getElementById(ctaHref.slice(1));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (window.location.hash !== ctaHref) {
      window.history.replaceState(null, "", ctaHref);
    }
    if (focusTargetId) {
      window.setTimeout(() => {
        const field = document.getElementById(focusTargetId);
        if (field && !field.closest("[hidden]")) {
          field.focus({ preventScroll: true });
        }
      }, 700);
    }
  }

  const barClass = ["info-bar", stuck ? "is-stuck" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div className="info-bar-sentinel" ref={sentinelRef} aria-hidden="true" />
      <div className={barClass} data-component="info-bar">
        <div className="wrap">
          <p className="ib-item">
            <svg className="ib-ico" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M12 8v4.4l3 1.6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <span>{responseText}</span>
          </p>

          {logos.length > 0 ? (
            <p className="ib-trust">
              <span className="ib-k">{trustedByLabel}</span>
              <span className="ib-logos">
                {logos.map((logo) => {
                  const style: CSSProperties & Record<string, string> = {};
                  if (logo.height) style["--ib-logo-h"] = `${logo.height}px`;
                  if (logo.maxWidth) style["--ib-logo-max-w"] = `${logo.maxWidth}px`;
                  return (
                    <img
                      key={logo.alt}
                      src={logo.src}
                      alt={logo.alt}
                      style={style}
                    />
                  );
                })}
              </span>
            </p>
          ) : null}

          <p className="ib-item ib-live">
            <svg className="ib-ico" viewBox="0 0 24 24" aria-hidden="true">
              <rect
                x="3.5"
                y="6.5"
                width="17"
                height="11"
                rx="1.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M8 17.5v2h8v-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <circle cx="12" cy="12" r="1.6" fill="currentColor" />
            </svg>
            <span>{deliveryText}</span>
          </p>

          <a
            className="btn ib-btn"
            href={ctaHref}
            data-enquire=""
            onClick={onCtaClick}
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </>
  );
}
