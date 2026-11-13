import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { CheckoutButton, IntroCallLink } from "@/components/site/checkout-cta";
import { breadcrumbJsonLd } from "@/lib/metadata";
import { PATHS, executiveWorkshopJsonLd, grokWeekJsonLd, teamWorkshopJsonLd } from "@/lib/offers";

const URL = `https://www.nicharalambous.com${PATHS.workshops}`;

export const metadata: Metadata = {
  title: "Workshops",
  description:
    "My week with Grok Bot, the Team Workflow Upgrade Session, and the Executive Workflow Upgrade Session. Virtual by default.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Workshops | Nic Haralambous",
    description: "Three sessions. Virtual by default. In person is possible, with travel extra.",
    url: URL,
  },
};

const SESSIONS = [
  {
    href: PATHS.grokWeek,
    title: "90 minutes inside how I actually work with Grok Bot",
    detail:
      "A show-and-tell for your team or organisation. I go through my own setup, how I work with Grok Bot and what's out there to do. 90 minutes, up to 20 people, €2,999 per session, ex VAT. Virtual by default.",
    id: "buy-my-week-with-grok-bot-index",
    offer: "my-week-with-grok-bot" as const,
    label: "Buy My week with Grok Bot",
  },
  {
    href: PATHS.team,
    title: "Your senior leaders build their own workflows in Grok Bot, in one two-hour session",
    detail:
      "A hands-on workshop for up to 8 senior leaders from one company. 2 hours, €4,999 per session, ex VAT, plus €499 per extra seat up to 10. Virtual by default.",
    id: "buy-team-workflow-upgrade-index",
    offer: "team-workflow-upgrade" as const,
    label: "Buy the team session",
  },
  {
    href: PATHS.executive,
    title: "Two hours, one to one, to upgrade how you run your week",
    detail:
      "For CEOs. A Grok Bot introduction, a review of your workflow and an upgrade, in one 2-hour session. €1,499, ex VAT. Virtual by default.",
    id: "buy-executive-workflow-upgrade-index",
    offer: "executive-workflow-upgrade" as const,
    label: "Buy your session",
  },
];

export default function WorkshopsPage() {
  return (
    <div className="v3 p-person">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Workshops",
          itemListElement: [
            { "@type": "ListItem", position: 1, item: grokWeekJsonLd() },
            { "@type": "ListItem", position: 2, item: teamWorkshopJsonLd() },
            { "@type": "ListItem", position: 3, item: executiveWorkshopJsonLd() },
          ],
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Workshops", path: PATHS.workshops },
        ])}
      />
      <section>
        <div className="wrap story">
          <h1>Workshops</h1>
          <div className="offer-grid">
            {SESSIONS.map((session) => (
              <article className="plain-card" key={session.href}>
                <h2>
                  <a href={session.href}>{session.title}</a>
                </h2>
                <p>{session.detail}</p>
                <CheckoutButton id={session.id} offer={session.offer} label={session.label} />
                <p>
                  <IntroCallLink />
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
