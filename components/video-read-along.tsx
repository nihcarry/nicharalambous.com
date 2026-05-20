/**
 * Compact video callout card for blog posts.
 *
 * Collapsed by default — shows a play icon, "WATCH" label, and the post title.
 * Clicking expands inline to reveal the 16:9 iframe embed. Clicking again
 * collapses it. Styled as a sibling to the TL;DR aside block.
 */
"use client";

import { useState } from "react";

interface VideoReadAlongProps {
  videoUrl: string;
  title: string;
  className?: string;
}

export function VideoReadAlong({
  videoUrl,
  title,
  className = "",
}: VideoReadAlongProps) {
  const [expanded, setExpanded] = useState(false);
  const embedUrl = getEmbedUrl(videoUrl);
  if (!embedUrl) return null;

  return (
    <aside
      className={`mt-8 border-l-[8px] border-brand-900 bg-brand-50 ${className}`}
    >
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center gap-3 p-6 text-left transition-colors hover:bg-brand-100/60"
        aria-expanded={expanded}
      >
        {expanded ? (
          <CollapseIcon className="h-6 w-6 shrink-0 text-brand-900" />
        ) : (
          <PlayCircleIcon className="h-6 w-6 shrink-0 text-brand-900" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-900">
            {expanded ? "Watching" : "Watch"}
          </p>
          <p className="truncate text-sm text-brand-600">{title}</p>
        </div>
        <ChevronIcon
          className={`h-5 w-5 shrink-0 text-brand-400 transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="relative aspect-video w-full border-t border-brand-200">
            {expanded && (
              <iframe
                src={embedUrl}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ---------- Helpers ---------- */

function getEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);

    if (
      parsed.hostname.includes("youtube.com") ||
      parsed.hostname.includes("youtu.be")
    ) {
      let videoId = "";
      if (parsed.hostname.includes("youtu.be")) {
        videoId = parsed.pathname.slice(1);
      } else if (parsed.pathname.includes("/embed/")) {
        return url;
      } else {
        videoId = parsed.searchParams.get("v") || "";
      }
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?rel=0`;
      }
    }

    if (parsed.hostname.includes("vimeo.com")) {
      const match = parsed.pathname.match(/\/(\d+)/);
      if (match) {
        return `https://player.vimeo.com/video/${match[1]}`;
      }
    }

    if (url.includes("/embed")) {
      return url;
    }

    return null;
  } catch {
    return null;
  }
}

/* ---------- Icons ---------- */

function PlayCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 0 1 1.28.53v4.5a.75.75 0 0 1-1.28.53l-3-3a.75.75 0 0 1 0-1.06l3-3Z"
        clipRule="evenodd"
      />
      <path d="M10.5 8.25l5.25 3.75-5.25 3.75V8.25Z" />
    </svg>
  );
}

function CollapseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 5.25v13.5m-7.5-13.5v13.5"
      />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}
