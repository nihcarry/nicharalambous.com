"use client";

import { useState, type CSSProperties } from "react";

export function ClickToLoadFrame({
  src,
  title,
  label,
  style,
  centered = false,
}: {
  src: string;
  title: string;
  label: string;
  style?: CSSProperties;
  centered?: boolean;
}) {
  const [play, setPlay] = useState(false);
  return (
    <div className={centered ? "tt-facade is-center" : "tt-facade"} style={play ? style : undefined}>
      {play ? (
        <iframe src={src} title={title} scrolling="no" style={{ height: "100%" }} />
      ) : (
        <>
          <p className="tt-note">These load from Testimonial.to when you open them.</p>
          <button type="button" className="btn" onClick={() => setPlay(true)}>
            {label}
          </button>
        </>
      )}
    </div>
  );
}
