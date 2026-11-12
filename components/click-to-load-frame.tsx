"use client";

import { useState, type CSSProperties } from "react";

export function ClickToLoadFrame({
  src,
  title,
  label,
  style,
}: {
  src: string;
  title: string;
  label: string;
  style?: CSSProperties;
}) {
  const [play, setPlay] = useState(false);
  return (
    <div className="tt-facade" style={play ? style : undefined}>
      {play ? (
        <iframe src={src} title={title} scrolling="no" />
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
