"use client";

import { useState, type CSSProperties } from "react";
import { readConsent } from "@/lib/consent";

export function ClickToLoadFrame({
  src,
  title,
  label,
  style,
  centered = false,
  onPlay,
}: {
  src: string;
  title: string;
  label: string;
  style?: CSSProperties;
  centered?: boolean;
  onPlay?: () => void;
}) {
  const [play, setPlay] = useState(false);
  return (
    <div className={centered ? "tt-facade is-center" : "tt-facade"} style={play ? style : undefined}>
      {play ? (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          scrolling="auto"
          style={{ height: "100%", background: "transparent" }}
        />
      ) : (
        <>
          <p className="tt-note">These load from Testimonial.to when you open them.</p>
          <button
            type="button"
            className="btn"
            onClick={() => {
              if (readConsent() !== "accepted") {
                window.dispatchEvent(new Event("nh-consent-open"));
                return;
              }
              setPlay(true);
              onPlay?.();
            }}
          >
            {label}
          </button>
        </>
      )}
    </div>
  );
}
