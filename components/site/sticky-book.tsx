"use client";

import { useEffect, useState } from "react";
import { bookNowHref } from "@/lib/site";

/** Mobile bar on the Output Paradox page. Hidden until the hero has left the viewport. */
export function StickyBookBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".hero.op");
    if (!hero) return;
    const mobile = window.matchMedia("(max-width: 600px)");
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(mobile.matches && !entry.isIntersecting);
      },
      { threshold: 0 },
    );
    observer.observe(hero);
    function onChange() {
      if (!mobile.matches) setVisible(false);
    }
    mobile.addEventListener("change", onChange);
    return () => {
      observer.disconnect();
      mobile.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <div className="sticky-book" hidden={!visible}>
      <span className="t">
        <b>Lunch and learn</b>
        20 minutes, live, ex VAT
      </span>
      <a className="btn" href={bookNowHref()}>
        Book now, €999
      </a>
    </div>
  );
}
