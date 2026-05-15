/**
 * Incredible Clients — reusable client logos / "As seen at" section.
 * Renders supplied marks as logo images when a static asset exists in
 * /public/logos/clients, otherwise falls back to bold uppercase text.
 * Used on both homepage and speaker page.
 */

import Image from "next/image";
import { filterVisibleClientMarks, getClientLogoSrc } from "@/lib/client-logos";

interface IncredibleClientsProps {
  /** List of client/media names to display */
  names: string[];
  /**
   * `slide` — full slide-deck scale (homepage / speaker).
   * `section` — matches interior page section headings (e.g. keynote landers).
   */
  headingSize?: "slide" | "section";
}

export function IncredibleClients({
  names,
  headingSize = "slide",
}: IncredibleClientsProps) {
  const visibleNames = filterVisibleClientMarks(names);
  const headingClassName =
    headingSize === "section"
      ? "heading-display-stroke-sm text-center text-3xl text-brand-900 sm:text-4xl md:text-5xl"
      : "heading-stroke text-center text-4xl font-extrabold uppercase tracking-tight text-brand-900 sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl";

  return (
    <>
      <h2 className={headingClassName}>Incredible Clients</h2>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-8">
        {visibleNames.map((name) => {
          const src = getClientLogoSrc(name);
          if (src) {
            return (
              <div
                key={name}
                className="flex h-12 shrink-0 items-center justify-center sm:h-14"
              >
                <Image
                  src={src}
                  alt={`${name} logo`}
                  width={220}
                  height={64}
                  className="max-h-12 w-auto max-w-[min(100vw-2rem,11rem)] object-contain object-center sm:max-h-14 sm:max-w-[13rem]"
                />
              </div>
            );
          }
          return (
            <span
              key={name}
              className="font-extrabold tracking-tight text-2xl uppercase text-accent-600 sm:text-3xl"
            >
              {name}
            </span>
          );
        })}
      </div>
    </>
  );
}
