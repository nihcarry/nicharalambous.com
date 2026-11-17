import type { Metadata } from "next";
import { PwycaForm } from "../../session/pwyca-form";

export const metadata: Metadata = {
  title: "Apply for pay-what-you-can-afford coaching",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://www.nicharalambous.com/coaching/apply" },
};

export default function CoachingApplyPage() {
  return (
    <div className="v3 p-person">
      <section className="top">
        <div className="wrap">
          <h1>Apply for pay-what-you-can-afford coaching</h1>
          <p className="lead">
            Same coaching intent, at a price you can actually afford. Paying €0 is totally fine. I limit this to 5 clients per month, which is why there&apos;s an application.
          </p>
        </div>
      </section>
      <section className="p-pen">
        <div className="wrap">
          <article className="plain-card">
            <PwycaForm />
            <p style={{ marginTop: 24 }}>
              <a className="link" href="/coaching">
                Back to accountability business coaching
              </a>
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
