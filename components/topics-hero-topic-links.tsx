"use client";

import { useCallback, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useSlideDeck } from "@/components/slide-deck";

export interface TopicsHeroTopicLink {
  slug: string;
  title: string;
  slideId: string;
}

interface TopicsHeroTopicLinksProps {
  items: TopicsHeroTopicLink[];
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollSectionIntoView(section: HTMLElement, container: HTMLDivElement | null) {
  const behavior = prefersReducedMotion() ? "auto" : "smooth";

  if (container && window.matchMedia("(min-width: 768px)").matches) {
    container.scrollTo({ top: section.offsetTop, behavior });
    return;
  }

  section.scrollIntoView({ behavior, block: "start" });
}

/**
 * Hero topic index for /topics — styled as mini card chips that scroll to
 * the storyboard slide each topic belongs to. Matches the bordered card
 * vocabulary used on the topic slides below.
 */
export function TopicsHeroTopicLinks({ items }: TopicsHeroTopicLinksProps) {
  const { containerRef } = useSlideDeck();

  const scrollToSlide = useCallback(
    (slideId: string) => {
      const section = document.getElementById(slideId);
      if (!section) return;
      scrollSectionIntoView(section, containerRef.current);
    },
    [containerRef],
  );

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash || hash === "hero") return;
    const section = document.getElementById(hash);
    if (!section) return;
    scrollSectionIntoView(section, containerRef.current);
  }, [containerRef]);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Topics on this page"
      className="mx-auto mt-8 mb-4 max-w-3xl"
    >
      <ul className="grid grid-cols-2 gap-3 py-[60px] sm:grid-cols-3">
        {items.map((item, index) => (
          <li key={item.slug}>
            <a
              href={`#${item.slideId}`}
              onClick={(event) => {
                event.preventDefault();
                scrollToSlide(item.slideId);
                window.history.replaceState(null, "", `#${item.slideId}`);
              }}
              className="group flex items-center justify-between border border-brand-900 bg-white px-4 py-3 transition-colors hover:bg-brand-50"
            >
              <div>
                <span className="block font-mono text-[10px] tracking-widest text-accent-600">
                  TOPIC_{String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-0.5 block text-sm font-extrabold uppercase leading-tight tracking-tight text-brand-900 transition-colors group-hover:text-accent-600 sm:text-base">
                  {item.title}
                </span>
              </div>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-accent-600 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
