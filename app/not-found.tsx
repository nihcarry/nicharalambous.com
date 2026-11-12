import type { Metadata } from "next";
import { bookOfferHref } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Page not found | Nic Haralambous" },
  description: "That page is not on nicharalambous.com. Go home, read the Output Paradox keynote, or send an enquiry.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="v3" data-no-orphan-opt-out="true">
      <section className="top pd-person not-found" style={{ paddingBottom: 120 }}>
        <div className="wrap">
          <div className="eyebrow">404</div>
          <h1>That page is not here</h1>
          <p className="lead">
            The link may be old, or the page may have moved. Here are the places people usually want.
          </p>
          <div className="acts">
            <a className="btn" href="/">
              Home
            </a>
            <a className="btn ghost" href="/keynotes/output-paradox-reengage-teams">
              The Output Paradox
            </a>
            <a className="btn ghost" href="/contact">
              Enquire
            </a>
            <a className="quiet-link" href={bookOfferHref()}>
              Book a lunch and learn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
