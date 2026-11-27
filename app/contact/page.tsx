import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { breadcrumbJsonLd } from "@/lib/metadata";
import { LUNCH_AND_LEARN_FACTS, LUNCH_AND_LEARN_LABEL, LUNCH_AND_LEARN_PATH } from "@/lib/lunch-and-learn";

const URL = "https://www.nicharalambous.com/contact";

export const metadata: Metadata = {
  title: { absolute: "Enquire | Nic Haralambous" },
  description:
    `Tell Nic about your team and your event. Keynotes in person or on Zoom, Teams or Meet. The Output Paradox lunch and learn is a 45-minute slot at ${LUNCH_AND_LEARN_FACTS.priceLine}, booked on its own calendar.`,
  alternates: { canonical: URL },
  openGraph: {
    title: "Enquire | Nic Haralambous",
    description: "A two-minute enquiry for a virtual or in-person keynote.",
    url: URL,
    images: [{ url: "/og/contact.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Enquire | Nic Haralambous",
    description: "Enquire about a keynote, in person or virtually.",
    images: ["/og/contact.png"],
  },
};

export default function ContactPage() {
  return (
    <div className="v3" data-no-orphan-opt-out="true">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Enquire", path: "/contact" },
        ])}
      />
      <section className="top pd-envelope">
        <div className="wrap">
          <h1>
            Tell me about your team and your <em>event</em>
          </h1>
          <p className="lead">
            This takes about two minutes. The more you tell me, the better the first call will be, and the faster we can work out if I&apos;m the right speaker for you.
          </p>
        </div>
      </section>
      <section className="main">
        <div className="wrap">
          <aside className="side">
            <div className="card">
              <h2 className="side-title">What happens next</h2>
              <ol className="next">
                <li>
                  <span className="mono">01</span>
                  I read your enquiry and reply by email.
                </li>
                <li>
                  <span className="mono">02</span>
                  We have a short call about the audience and the goals for our session.
                </li>
                <li>
                  <span className="mono">03</span>
                  I send you a proposal with the format, date and fee.
                </li>
              </ol>
            </div>
            <div className="card">
              <h2 className="side-title">The lunch and learn</h2>
              <ul className="next">
                <li>
                  <span className="mono">€</span>
                  The Output Paradox lunch and learn: {LUNCH_AND_LEARN_LABEL}. {LUNCH_AND_LEARN_FACTS.priceLine}. You send the call link.
                </li>
                <li>
                  <span className="mono">01</span>
                  Keynotes, virtual or in person, are arranged from this form. The fee is in the proposal.
                </li>
              </ul>
              <p style={{ marginTop: 16 }}>
                <a className="btn btn-wrap" href={LUNCH_AND_LEARN_PATH}>
                  Book the lunch and learn
                </a>
              </p>
            </div>
          </aside>
          <EnquiryForm />
        </div>
      </section>
    </div>
  );
}
