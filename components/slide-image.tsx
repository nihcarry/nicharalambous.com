/**
 * SlideImage — decorative image layer for keynote-style slides.
 *
 * Renders an optional image within a slide, positioned absolutely to create
 * depth. Supports several positions: top-right, bottom, left, right, and
 * background. Used to add visual interest and a presentation feel.
 *
 * Images are purely decorative (aria-hidden) and should not carry content.
 * On mobile, images are hidden to keep the standard scroll layout clean.
 */

interface SlideImageProps {
  src: string;
  alt?: string;
  /** Where the image sits within the slide. */
  position?: "top-right" | "bottom" | "left" | "right" | "background";
  /** Optional additional classes. */
  className?: string;
}

const positionStyles: Record<NonNullable<SlideImageProps["position"]>, string> = {
  "top-right": "top-4 right-4 w-48 h-48 md:w-64 md:h-64 rounded-2xl object-cover opacity-20",
  bottom: "bottom-0 left-1/2 -translate-x-1/2 w-full h-40 md:h-56 object-cover opacity-15",
  left: "top-1/2 left-4 -translate-y-1/2 w-40 h-40 md:w-56 md:h-56 rounded-2xl object-cover opacity-20",
  right: "top-1/2 right-4 -translate-y-1/2 w-40 h-40 md:w-56 md:h-56 rounded-2xl object-cover opacity-20",
  background: "inset-0 w-full h-full object-cover opacity-10",
};

export function SlideImage({
  src,
  alt = "",
  position = "background",
  className = "",
}: SlideImageProps) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={alt}
      aria-hidden="true"
      className={[
        "pointer-events-none absolute hidden select-none md:block",
        positionStyles[position],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
