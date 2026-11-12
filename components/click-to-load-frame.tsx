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
    <div className="tt-facade" style={style}>
      {play ? (
        <iframe src={src} title={title} scrolling="no" />
      ) : (
        <button type="button" onClick={() => setPlay(true)} aria-label={label}>
          {label}
        </button>
      )}
    </div>
  );
}
