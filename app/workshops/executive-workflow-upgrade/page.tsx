import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { CheckoutButton, IntroCallLink } from "@/components/site/checkout-cta";
import { breadcrumbJsonLd } from "@/lib/metadata";
import { PATHS, executiveWorkshopJsonLd } from "@/lib/offers";

const PATH = PATHS.executive;
const URL = `https://www.nicharalambous.com${PATH}`;

export const metadata: Metadata = {
  title: "Executive Workflow Upgrade Session",
  description:
    "For CEOs. A Grok Bot introduction, a review of your workflow and an upgrade, in one 2-hour session. €1,499, ex VAT. Virtual by default.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Executive Workflow Upgrade Session | Nic Haralambous",
    description:
      "Two hours, one to one, to upgrade how you run your week. €1,499, ex VAT. Virtual by default.",
    url: URL,
  },
};

export default function ExecutiveWorkshopPage() {
  return (
    <div className="v3 p-person">
      <JsonLd data={executiveWorkshopJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Workshops", path: PATHS.workshops },
          { name: "Executive Workflow Upgrade Session", path: PATH },
        ])}
      />
      <section>
        <div className="wrap story">
          <p>[TBC: URL, for example /workshops/executive-workflow-upgrade]</p>
          <h1>Two hours, one to one, to upgrade how you run your week</h1>
          <p className="lead">
            For CEOs. A Grok Bot introduction, a review of your workflow and an upgrade, in one 2-hour session. €1,499, ex VAT. Virtual by default.
          </p>
          <p>
            If you run the company, you don&apos;t have time to sit in a group workshop while everyone else catches up, and you shouldn&apos;t have to. This is two hours with just you and me.
          </p>
          <p>
            I start with a proper introduction to Grok Bot, so you know what it can do for the way you work. Then we go through your week as it actually runs: where your time goes, what you&apos;re still doing by hand, and what keeps landing back on your desk. Then we upgrade it together, on your real work, so you leave with the changes set up and running.
          </p>
          <p>
            Before we meet, I work with you to set things up, so the two hours go on your week. Ideally I show you, on my own Grok Bot, how it all comes together on your Grok Bot. If you use Claude or ChatGPT, I can adapt to those, so you don&apos;t need to switch tools to attend.
          </p>
          <p>
            I&apos;ve built and sold four companies and spent more than 20 years building technology businesses. I&apos;ll tell you what I think about how you work, and we&apos;ll build the changes while we talk.
          </p>

          <h2>What&apos;s included</h2>
          <ul>
            <li>2 hours, one to one with me, virtual by default. In person is possible, with travel extra.</li>
            <li>Setup before the session, so you&apos;re ready on the day</li>
            <li>A Grok Bot introduction</li>
            <li>A review of your current workflow</li>
            <li>An upgrade, built during the session on your own work</li>
            <li>[TBC: anything after the session, for example a written recap or a check-in call]</li>
          </ul>

          <h2>Who it&apos;s for</h2>
          <p>
            CEOs, and founders running a company, who want the work done on their own week. It&apos;s one person per session.
          </p>
          <p>
            If you want your leadership team in the room as well, that&apos;s the Team Workflow Upgrade Session.
          </p>

          <h2>FAQ</h2>
          <div className="faq">
            <h3>Do I need to know Grok Bot already?</h3>
            <p>No. The session starts with an introduction, and I work with you before the session to set things up.</p>
            <h3>We use Claude or ChatGPT. Do I need to switch?</h3>
            <p>
              No. I can adapt to those. Ideally I show you, on my own Grok Bot, how it all comes together on your Grok Bot.
            </p>
            <h3>Can I bring someone from my team?</h3>
            <p>
              This session is for one person. For up to 8 of your senior leaders (10 with extra seats), book the Team Workflow Upgrade Session.
            </p>
            <h3>What about confidential work?</h3>
            <p>[TBC: how Nic handles sensitive company data in the session]</p>
            <h3>Is it virtual or in person?</h3>
            <p>Virtual by default. In person is possible, with travel extra.</p>
            <h3>How do I pay, and can I get an invoice?</h3>
            <p>You buy the session directly on this page. [TBC: whether an invoice is available for company buyers]</p>
          </div>

          <div className="offer-ctas">
            <CheckoutButton
              id="buy-executive-workflow-upgrade"
              offer="executive-workflow-upgrade"
              label="Buy your session"
            />
            <IntroCallLink />
          </div>
        </div>
      </section>
    </div>
  );
}
