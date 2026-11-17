"use client";

import { useEffect, useState } from "react";
import { CheckoutButton } from "@/components/site/checkout-cta";

/** Mobile bar. Hidden until the hero has left the viewport. */
export function StickyBookBar({
  title = "Lunch and learn",
  detail = "€999, ex VAT",
  offer = "lunch-and-learn" as const,
  label = "Buy",
  id = "buy-lunch-and-learn-sticky",
  href,
}: {
  title?: string;
  detail?: string;
  offer?: "lunch-and-learn" | "team-workflow-upgrade" | "executive-workflow-upgrade" | "my-week-with-grok-bot" | "accountability-coaching";
  label?: string;
  id?: string;
  href?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".hero");
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
        <b>{title}</b>
        {detail}
      </span>
      <span className="sticky-acts">
        {href ? (
          <a id={id} className="btn btn-wrap" href={href}>
            {label}
          </a>
        ) : (
          <CheckoutButton id={id} offer={offer} label={label} />
        )}
      </span>
    </div>
  );
}
