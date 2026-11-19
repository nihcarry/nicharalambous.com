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
    "Request The CEO AI Session, the Senior Leaders AI Lab or My week with AI. Nic replies by email within two working days.",
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
              <h2 className="side-title">The sessions</h2>
              <ul className="next">
                <li>
                  <span className="mono">01</span>
                  The CEO AI Session: 3 hours, with a free seat for one exec. Virtual by default.
                </li>
                <li>
                  <span className="mono">02</span>
                  Senior Leaders AI Lab: half a day, up to 10 senior leaders from one company. Virtual by default.
                </li>
                <li>
                  <span className="mono">03</span>
                  My week with AI: 90 minutes, up to 20 people.
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
