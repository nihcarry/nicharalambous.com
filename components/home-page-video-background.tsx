"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

/**
 * HomePageVideoBackground
 *
 * Renders a desktop-only fixed video background behind the site shell when the
 * current route is the homepage. Kept pointer-events-none so navigation and
 * content remain fully interactive above it.
 */
export function HomePageVideoBackground() {
  const pathname = usePathname();
  const [isDesktop, setIsDesktop] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const overlayVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const updateMatch = () => setIsDesktop(mediaQuery.matches);

    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      setIsOverlayOpen(false);
    }
  }, [isDesktop]);

  useEffect(() => {
    if (pathname !== "/") {
      setIsOverlayOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    const handleOpen = () => {
      if (pathname === "/" && isDesktop) {
        setIsOverlayOpen(true);
      }
    };

    window.addEventListener("home-video-overlay:open", handleOpen);
    return () => window.removeEventListener("home-video-overlay:open", handleOpen);
  }, [pathname, isDesktop]);

  useEffect(() => {
    if (!isOverlayOpen) return;

    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOverlayOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    overlayVideoRef.current?.play().catch(() => {
      // Playback may still be browser-restricted in some environments.
    });

    return () => {
      document.body.style.overflow = bodyOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOverlayOpen]);

  if (pathname !== "/" || !isDesktop) return null;

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-brand-900"
      >
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/slides/Nic_Landing_Video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {isOverlayOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full-screen hero video"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-6"
          onClick={() => setIsOverlayOpen(false)}
        >
          <button
            type="button"
            aria-label="Close video"
            className="absolute right-6 top-6 z-[71] inline-flex h-10 w-10 items-center justify-center border-2 border-white text-white transition-colors hover:bg-white hover:text-black"
            onClick={() => setIsOverlayOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative w-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
            <video
              ref={overlayVideoRef}
              className="h-auto max-h-[85vh] w-full border-2 border-white bg-black object-contain"
              controls
              playsInline
              preload="metadata"
            >
              <source src="/slides/Nic_Landing_Video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </>
  );
}
