"use client";

import { useState } from "react";

export function ClickToLoadYouTube({
  videoId,
  title,
  poster,
}: {
  videoId: string;
  title: string;
  poster?: string | null;
}) {
  const [play, setPlay] = useState(false);
  return (
    <div className="yt-facade">
      {play ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          aria-label={`Play video: ${title}`}
          onClick={() => setPlay(true)}
        >
          {poster ? <img src={poster} alt="" width={640} height={360} /> : null}
          <span className="yt-play" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export function youtubeIdFromUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]+)/,
  );
  return match?.[1] ?? null;
}
