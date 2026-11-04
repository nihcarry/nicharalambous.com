"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Keeps heavy, below-the-fold markup out of the first load.
 *
 * Chrome still fetches loading=lazy iframes and images that sit a few
 * screens down when the lab connection is fast. Lighthouse then bills that
 * work against the hero. This renders `children` only once the box is close
 * to the viewport. `hold` stays on screen the whole time, so cards do not pop
 * in.
 */
export function LoadWhenNear({
  children,
  hold,
  className,
  minHeight,
  rootMargin = "600px 0px",
}: {
  children: ReactNode;
  hold?: ReactNode;
  className?: string;
  minHeight?: number;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setReady(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={ref}
      className={className}
      style={minHeight != null ? { minHeight } : undefined}
    >
      {hold}
      {ready ? children : null}
    </div>
  );
}
