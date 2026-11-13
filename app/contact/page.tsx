import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { breadcrumbJsonLd } from "@/lib/metadata";

const URL = "https://www.nicharalambous.com/contact";

export const metadata: Metadata = {
  title: { absolute: "Enquire | Nic Haralambous" },
  description:
    "Tell Nic about your team and your event. Keynotes in person or on Zoom, Teams or Meet. Lunch and learn €999 ex VAT. Virtual keynotes from €1,500. In-person from €4,500, excluding travel and VAT.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Enquire | Nic Haralambous",
    description:
      "A two-minute enquiry for a virtual or in-person keynote. Fees in euros, excluding VAT.",
    url: URL,
    images: [{ url: "/og/contact.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Enquire | Nic Haralambous",
    description: "Book a keynote, in person or virtually. Fees in euros.",
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
              <h2 className="side-title">Fees, so there are no surprises</h2>
              <ul className="next">
                <li>
                  <span className="mono">€</span>
                  Virtual lunch and learn, 20 minutes: €999
                </li>
                <li>
                  <span className="mono">€</span>
                  Virtual keynotes, 45 minutes: from €1,500 ex VAT
                </li>
                <li>
                  <span className="mono">€</span>
                  In-person keynotes from €4,500, excluding travel and VAT
                </li>
              </ul>
            </div>
          </aside>
          <EnquiryForm />
        </div>
      </section>
    </div>
  );
}
