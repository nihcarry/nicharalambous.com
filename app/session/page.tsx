import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accountability business coaching",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://www.nicharalambous.com/coaching" },
};

/** Static-export stand-in for the CloudFront redirect. The live 301 is set at deploy. */
export default function SessionRedirect() {
  return (
    <div className="v3 p-person">
      <meta httpEquiv="refresh" content="0;url=/coaching" />
      <link rel="canonical" href="https://www.nicharalambous.com/coaching" />
      <section className="top">
        <div className="wrap">
          <h1>This page has moved</h1>
          <p className="lead">
            <a href="/coaching">Accountability business coaching</a>
          </p>
        </div>
      </section>
    </div>
  );
}
