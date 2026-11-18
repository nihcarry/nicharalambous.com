import { SESSION_REQUEST_LABEL, SESSION_REQUEST_PATH, checkoutHref, isEnquiryOffer, type CheckoutOffer } from "@/lib/checkout-links";
import { INTRO_CALL_LABEL, INTRO_CALL_URL } from "@/lib/offers";

export type EnquireCode = "exec" | "team" | "my-week";

/** Enquiry form for a workshop. Executive checkout stays on Stripe elsewhere. */
export function enquireHref(offer: EnquireCode): string {
  return `${SESSION_REQUEST_PATH}?offer=${offer}`;
}

export function EnquireButton({ id, offer }: { id: string; offer: EnquireCode }) {
  return (
    <a id={id} className="btn btn-wrap" data-offer={offer} href={enquireHref(offer)}>
      Enquire to book
    </a>
  );
}

export function CheckoutButton({
  id,
  offer,
  label,
  variant = "button",
}: {
  id: string;
  offer: CheckoutOffer;
  label: string;
  variant?: "button" | "link";
}) {
  const href = checkoutHref(offer) || "#checkout";
  // Team and My week are sold by enquiry: one label everywhere.
  if (isEnquiryOffer(offer)) label = SESSION_REQUEST_LABEL;
  if (variant === "link") {
    return (
      <a id={id} className="go buy" data-offer={offer} href={href}>
        {label} <span>→</span>
      </a>
    );
  }
  return (
    <a id={id} className="btn btn-wrap" data-offer={offer} href={href}>
      {label}
    </a>
  );
}

export function IntroCallLink() {
  return (
    <a className="quiet-link" href={INTRO_CALL_URL} target="_blank" rel="noopener noreferrer">
      {INTRO_CALL_LABEL}
    </a>
  );
}
