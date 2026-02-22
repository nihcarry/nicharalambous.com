/**
 * What Clients Say — reusable testimonials slide content.
 * Displays the Testimonial.to embed with the 16bit character image.
 * Used on both homepage and speaker page for consistent social proof.
 */

interface WhatClientsSayProps {
  /** Heading alignment. Default "left" matches homepage. */
  headingAlign?: "left" | "center";
}

export function WhatClientsSay({ headingAlign = "left" }: WhatClientsSayProps) {
  return (
    <div className="relative">
      <h2
        className={`heading-stroke font-extrabold tracking-tight pt-2 text-4xl uppercase text-brand-900 sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl ${
          headingAlign === "center" ? "text-center" : "text-left"
        }`}
      >
        What Clients Say
      </h2>
      {/* Testimonial box — in normal flow; leaves room for 16bit on right (md+) */}
      <div className="mt-6 overflow-hidden px-2 md:max-w-[calc(100%-440px)]">
        <iframe
          id="testimonialto-5b8610ee-6b4a-4779-9503-cddbd8c5ac26"
          src="https://embed-v2.testimonial.to/w/nic-haralambous---speaker?id=5b8610ee-6b4a-4779-9503-cddbd8c5ac26"
          frameBorder="0"
          scrolling="no"
          width="100%"
          height="800px"
        />
      </div>
      {/* 16bit desktop — absolute, out of flow, no empty space */}
      <div
        className="absolute right-4 top-1/2 hidden -translate-y-1/2 overflow-hidden rounded-full md:block"
        style={{
          width: "clamp(280px, 36vw, 400px)",
          height: "clamp(400px, 76vh, 640px)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/slides/Nic_Ancient_greece_16bit.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none h-full w-full select-none object-contain object-bottom"
        />
      </div>
      {/* 16bit mobile — below box */}
      <div className="mx-auto mt-6 flex max-w-[200px] justify-center overflow-hidden rounded-full md:hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/slides/Nic_Ancient_greece_16bit.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none h-auto w-full select-none object-contain"
        />
      </div>
    </div>
  );
}
