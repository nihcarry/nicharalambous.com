import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { SessionRequestForm } from "@/components/site/session-request-form";
import { breadcrumbJsonLd } from "@/lib/metadata";
import { PATHS } from "@/lib/offers";

const PATH = "/workshops/request-a-session";
const URL = `https://www.nicharalambous.com${PATH}`;

export const metadata: Metadata = {
  title: { absolute: "Request a session | Nic Haralambous" },
  description:
    "Request a Team Workflow Upgrade Session (€4,999, up to 8 people) or My week with Grok Bot (€2,999, up to 20 people). Prices ex VAT. Nic replies by email within two working days.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Request a session | Nic Haralambous",
    description: "Tell Nic about your team, your dates and the session you want.",
    url: URL,
  },
};

export default function RequestSessionPage() {
  return (
    <div className="v3" data-no-orphan-opt-out="true">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Workshops", path: PATHS.workshops },
          { name: "Request a session", path: PATH },
        ])}
      />
      <section className="top pd-envelope">
        <div className="wrap">
          <h1>
            Request a <em>session</em>
          </h1>
          <p className="lead">
            Tell me about your team and when you would like to run it. I reply by email with dates and next steps.
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
                  I read your request and reply by email within two working days.
                </li>
                <li>
                  <span className="mono">02</span>
                  We agree a date and who is in the room.
                </li>
                <li>
                  <span className="mono">03</span>
                  I send an invoice to confirm the booking.
                </li>
              </ol>
            </div>
            <div className="card">
              <h2 className="side-title">Prices, so there are no surprises</h2>
              <ul className="next">
                <li>
                  <span className="mono">€</span>
                  Team Workflow Upgrade Session: €4,999 per session for up to 8 people, ex VAT. Extra seats €499, up to 10.
                </li>
                <li>
                  <span className="mono">€</span>
                  My week with Grok Bot: €2,999 per session for up to 20 people, ex VAT.
                </li>
              </ul>
            </div>
          </aside>
          <SessionRequestForm />
        </div>
      </section>
    </div>
  );
}
