/**
 * Video Read-Along section for blog posts.
 *
 * Provides three consumption modes for the reader:
 *   1. Watch — listen to Nic read the article via embedded video
 *   2. Read — scroll down to the written article
 *   3. Follow Along — play the video while reading below
 *
 * Placed between the article header and the main content body.
 * Only rendered when a `videoEmbed` URL is set on the post.
 */
"use client";

import { useState, useRef } from "react";

interface VideoReadAlongProps {
  videoUrl: string;
  title: string;
  featuredLabel?: string | null;
  className?: string;
}

export function VideoReadAlong({
  videoUrl,
  title,
  featuredLabel,
  className = "",
}: VideoReadAlongProps) {
  const [mode, setMode] = useState<"watch" | "read" | "follow">("watch");
  const videoRef = useRef<HTMLIFrameElement>(null);

  const embedUrl = getEmbedUrl(videoUrl);
  if (!embedUrl) return null;

  const modes = [
    {
      id: "watch" as const,
      label: "Watch",
      icon: PlayIcon,
      description: "Listen to Nic read the article",
    },
    {
      id: "read" as const,
      label: "Read",
      icon: BookIcon,
      description: "Read the article at your own pace",
    },
    {
      id: "follow" as const,
      label: "Follow Along",
      icon: FollowIcon,
      description: "Watch and read together",
    },
  ];

  return (
    <div className={`mt-8 ${className}`}>
      {/* Badge for featured content */}
      {featuredLabel && (
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            <svg
              className="h-3 w-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                clipRule="evenodd"
              />
            </svg>
            {featuredLabel}
          </span>
        </div>
      )}

      {/* Video container */}
      <div className="overflow-hidden rounded-2xl border border-brand-200 bg-brand-900 shadow-lg">
        {/* Mode switcher */}
        <div className="flex border-b border-brand-700 bg-brand-800/50">
          {modes.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                mode === id
                  ? "border-b-2 border-accent-400 bg-brand-800 text-white"
                  : "text-brand-300 hover:bg-brand-800/80 hover:text-white"
              }`}
              aria-pressed={mode === id}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Mode description */}
        <div className="px-6 py-3 text-center">
          <p className="text-sm text-brand-300">
            {modes.find((m) => m.id === mode)?.description}
          </p>
        </div>

        {/* Video embed */}
        <div
          className={`transition-all duration-300 ${
            mode === "read" ? "h-0 overflow-hidden opacity-0" : "opacity-100"
          }`}
        >
          <div className="relative aspect-video w-full">
            <iframe
              ref={videoRef}
              src={embedUrl}
              title={`${title} — Video Read-Along`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
              loading="lazy"
            />
          </div>
        </div>

        {/* Follow-along prompt */}
        {mode === "follow" && (
          <div className="border-t border-brand-700 px-6 py-4 text-center">
            <p className="text-sm text-accent-400">
              <svg
                className="mr-1.5 inline-block h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
              Scroll down to read along while the video plays
            </p>
          </div>
        )}

        {/* Read mode message */}
        {mode === "read" && (
          <div className="px-6 py-8 text-center">
            <svg
              className="mx-auto h-8 w-8 text-brand-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
            <p className="mt-2 text-sm text-brand-400">
              The article is below — read at your own pace
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */

function getEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);

    // YouTube
    if (
      parsed.hostname.includes("youtube.com") ||
      parsed.hostname.includes("youtu.be")
    ) {
      let videoId = "";
      if (parsed.hostname.includes("youtu.be")) {
        videoId = parsed.pathname.slice(1);
      } else if (parsed.pathname.includes("/embed/")) {
        return url; // already an embed URL
      } else {
        videoId = parsed.searchParams.get("v") || "";
      }
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?rel=0`;
      }
    }

    // Vimeo
    if (parsed.hostname.includes("vimeo.com")) {
      const match = parsed.pathname.match(/\/(\d+)/);
      if (match) {
        return `https://player.vimeo.com/video/${match[1]}`;
      }
    }

    // Already an embed URL (generic)
    if (url.includes("/embed")) {
      return url;
    }

    return null;
  } catch {
    return null;
  }
}

/* ---------- Icon Components ---------- */

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
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
        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
      />
    </svg>
  );
}

function FollowIcon({ className }: { className?: string }) {
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
        d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
      />
    </svg>
  );
}
