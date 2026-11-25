"use client";

import { useEffect, useState } from "react";
import { CheckoutButton } from "@/components/site/checkout-cta";
import { isEnquiryOffer } from "@/lib/checkout-links";
import { LUNCH_AND_LEARN_FACTS, LUNCH_AND_LEARN_PATH } from "@/lib/lunch-and-learn";

/** Mobile bar. Hidden until the hero has left the viewport. */
export function StickyBookBar({
  title = "Lunch and learn",
  detail = LUNCH_AND_LEARN_FACTS.priceLine,
  offer = "lunch-and-learn" as const,
  label = "Book",
  id = "book-lunch-and-learn-sticky",
  href = LUNCH_AND_LEARN_PATH,
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
    const checkout = document.getElementById("checkout");
    const mobile = window.matchMedia("(max-width: 600px)");
    let heroGone = false;
    let checkoutOnScreen = false;
    function paint() {
      setVisible(mobile.matches && heroGone && !checkoutOnScreen);
    }
    const heroObserver = new IntersectionObserver(([entry]) => {
      heroGone = !entry.isIntersecting;
      paint();
    }, { threshold: 0 });
    heroObserver.observe(hero);
    const checkoutObserver = checkout
      ? new IntersectionObserver(([entry]) => {
          checkoutOnScreen = entry.isIntersecting;
          paint();
        }, { threshold: 0 })
      : null;
    checkoutObserver?.observe(checkout as Element);
    function onChange() {
      if (!mobile.matches) setVisible(false);
      else paint();
    }
    mobile.addEventListener("change", onChange);
    return () => {
      heroObserver.disconnect();
      checkoutObserver?.disconnect();
      mobile.removeEventListener("change", onChange);
    };
  }, []);

  const enquiryBar = Boolean(href?.includes("request-a-session")) || (!href && isEnquiryOffer(offer));

  return (
    <div className={enquiryBar ? "sticky-book sticky-request" : "sticky-book"} hidden={!visible}>
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
