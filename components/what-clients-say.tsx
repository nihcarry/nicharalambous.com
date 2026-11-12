"use client";

/**
 * What Clients Say — reusable testimonials slide content.
 * Displays the Testimonial.to embed with the 16bit character image.
 * Used on the speaker page for consistent social proof.
 */

import { useState } from "react";
import { ClickToLoadFrame } from "@/components/click-to-load-frame";
import { DecorativePicture } from "@/components/decorative-picture";
import { LoadWhenNear } from "@/components/load-when-near";

const TESTIMONIAL_EMBED_SRC =
  "https://embed-v2.testimonial.to/w/nic-haralambous---speaker?id=5b8610ee-6b4a-4779-9503-cddbd8c5ac26";

interface WhatClientsSayProps {
  /** Heading alignment. Default "left" matches homepage. */
  headingAlign?: "left" | "center";
}

export function WhatClientsSay({ headingAlign = "left" }: WhatClientsSayProps) {
  const centered = headingAlign === "center";
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <h2
        className={`heading-stroke font-extrabold tracking-tight pt-2 text-4xl uppercase text-brand-900 sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl ${
          centered ? "text-center" : "text-left"
        }`}
      >
        What Clients Say
      </h2>
      {/* Closed prompt spans the page container. The embed, once open, stays left of the character. */}
      <div
        className={
          centered && !open
            ? "mt-6 px-2"
            : "mt-6 overflow-hidden px-2 md:max-w-[calc(100%-440px)]"
        }
      >
        <LoadWhenNear minHeight={centered && !open ? 140 : 800}>
          <ClickToLoadFrame
            src={TESTIMONIAL_EMBED_SRC}
            title="What clients say about Nic Haralambous"
            label="Show testimonials"
            style={{ height: 800 }}
            centered={centered && !open}
            onPlay={() => setOpen(true)}
          />
        </LoadWhenNear>
      </div>
      {/* 16bit desktop — absolute, out of flow, no empty space */}
      <div
        className="absolute right-4 top-1/2 hidden -translate-y-1/2 overflow-hidden rounded-full md:block"
        style={{
          width: "clamp(280px, 36vw, 400px)",
          height: "clamp(400px, 76vh, 640px)",
        }}
      >
        <DecorativePicture
          className="block h-full w-full"
          width={303}
          height={381}
          loading="lazy"
          imgClassName="pointer-events-none h-full w-full select-none object-contain object-bottom"
          sources={[
            {
              media: "(min-width: 768px)",
              srcSet: "/slides/Nic_Ancient_greece_16bit.png",
            },
          ]}
        />
      </div>
      {/* 16bit mobile — below box */}
      <div className="mx-auto mt-6 flex max-w-[200px] justify-center overflow-hidden rounded-full md:hidden">
        <DecorativePicture
          className="block w-full"
          width={303}
          height={381}
          loading="lazy"
          imgClassName="pointer-events-none h-auto w-full select-none object-contain"
          sources={[
            {
              media: "(max-width: 767px)",
              srcSet: "/slides/Nic_Ancient_greece_16bit.png",
            },
          ]}
        />
      </div>
    </div>
  );
}
