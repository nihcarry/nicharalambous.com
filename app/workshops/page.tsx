import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { CompareTable } from "@/components/site/compare-table";
import { EnquireButton, IntroCallLink } from "@/components/site/checkout-cta";
import { WorkflowMap } from "@/components/site/workflow-map";
import { StickyBookBar } from "@/components/site/sticky-book";
import { breadcrumbJsonLd } from "@/lib/metadata";
import { PATHS, executiveWorkshopJsonLd, teamWorkshopJsonLd } from "@/lib/offers";
import { SITE_URL } from "@/lib/site";

const PATH = PATHS.workshops;
const URL = `https://www.nicharalambous.com${PATH}`;
const DESCRIPTION =
  "Three sessions: My week with AI, the Senior Leaders AI Lab and The CEO AI Session. 3 hours for the CEO, half a day for senior leaders. Virtual by default.";
const SOCIAL_TITLE = "AI workshops | Nic Haralambous";

export const metadata: Metadata = {
  title: "AI workshops",
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: SOCIAL_TITLE,
    description: DESCRIPTION,
    url: URL,
  },
  twitter: {
    card: "summary_large_image",
    title: SOCIAL_TITLE,
    description: DESCRIPTION,
  },
};

function hubWorkshopsJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AI workshops",
    itemListElement: [
      { "@type": "ListItem", position: 1, item: executiveWorkshopJsonLd() },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Service",
          name: "My week with AI",
          serviceType: "Workshop",
          description: "A 90-minute show-and-tell for up to 20 people. Virtual by default.",
          url: `${SITE_URL}${PATHS.grokWeek}`,
          provider: { "@type": "Person", name: "Nic Haralambous", url: `${SITE_URL}/` },
        },
      },
      { "@type": "ListItem", position: 3, item: teamWorkshopJsonLd() },
    ],
  };
}

export default function WorkshopsPage() {
  return (
    <div className="v3 has-sticky workshop-v4" data-no-orphan-opt-out="true">
      <JsonLd data={hubWorkshopsJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Workshops", path: PATH },
        ])}
      />
      <section className="hero hub wf pd-spotlight">
        <div className="hub-grid" aria-hidden="true" />
        <WorkflowMap />
        <div className="hub-fade" aria-hidden="true" />
        <div className="wrap">
          <div className="copy">
            <h1>
              <em>AI</em> workshops
            </h1>
            <p className="say">
              Three sessions. My week with AI, the Senior Leaders AI Lab and The CEO AI Session. Virtual by default. In person is possible, with travel extra.
            </p>
            <div className="acts" style={{ marginTop: 8 }}>
              <a className="btn btn-wrap" href="#formats">
                Pick a session
              </a>
              <IntroCallLink />
            </div>
          </div>
        </div>
      </section>
      <section className="dark pd-calendar" id="formats">
        <div className="wrap">
          <h2 style={{ margin: "20px 0 18px" }}>Pick the session that{"\u00A0"}fits</h2>
          <div className="formats">
            <div className="fmt">
              <h3>The CEO AI{"\u00A0"}Session</h3>
              <p>
                For the CEO: a briefing call, then a custom session built for you. If the leader doesn&apos;t get AI, nobody else in the organisation will.
              </p>
              <ul>
                <li>3 hours</li>
                <li>One to one, plus one exec free</li>
                <li>Virtual by default</li>
              </ul>
              <EnquireButton id="buy-exec-hub" offer="exec" />
              <a className="quiet-link fmt-see" href="/workshops/executive-workflow-upgrade">
                See the session
              </a>
            </div>
            <div className="fmt has-fstk">
              <img className="fmt-stk" src="/v3/new/sticker-thumbs.png" alt="" />
              <h3>My week with{"\u00A0"}AI</h3>
              <p>A show-and-tell: I take your team through my own AI setup, how I work with it and what&apos;s out there to do.</p>
              <ul>
                <li>90 minutes</li>
                <li>Up to 20 people</li>
                <li>Virtual by default</li>
              </ul>
              <EnquireButton id="buy-my-week-hub" offer="my-week" />
              <a className="quiet-link fmt-see" href="/workshops/my-week-with-ai">
                See the session
              </a>
            </div>
            <div className="fmt">
              <h3>Senior Leaders AI{"\u00A0"}Lab</h3>
              <p>A hands-on workshop. Each person builds their own workflows and keeps ownership of the thinking.</p>
              <ul>
                <li>Half day, hands-on</li>
                <li>Up to 10 senior leaders from one company</li>
                <li>Virtual by default</li>
              </ul>
              <EnquireButton id="buy-team-hub" offer="team" />
              <a className="quiet-link fmt-see" href="/workshops/team-workflow-upgrade">
                See the session
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="p-pen" style={{ background: "var(--paper2)" }}>
        <div className="wrap">
          <h2 style={{ margin: "20px 0 22px" }}>How the sessions{"\u00A0"}compare</h2>
          <div className="cmp-panel">
            <CompareTable />
          </div>
        </div>
      </section>
      <div className="ip pd-calendar">
        <div className="wrap">
          <span>
            <b>Accountability business coaching.</b> Two calls a month, plus chat in between.
          </span>
          <a className="link" href="/coaching" style={{ color: "#fff" }}>
            See coaching
          </a>
        </div>
      </div>
      <section className="dark pd-cta">
        <div className="wrap">
          <div className="final op">
            <h2>Not sure which{"\u00A0"}one?</h2>
            <p className="final-sub">Book a free 20-minute intro call and we&apos;ll pick the session that fits.</p>
            <div className="acts" style={{ justifyContent: "center", marginTop: 32 }}>
              <IntroCallLink />
            </div>
          </div>
        </div>
      </section>
      <StickyBookBar title="AI workshops" detail="Three sessions. Virtual by default." href="#formats" label="See sessions" id="hub-sticky" />
    </div>
  );
}
