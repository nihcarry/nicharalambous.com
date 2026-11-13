import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { CheckoutButton, IntroCallLink } from "@/components/site/checkout-cta";
import { breadcrumbJsonLd } from "@/lib/metadata";
import { PATHS, teamWorkshopJsonLd } from "@/lib/offers";

const PATH = PATHS.team;
const URL = `https://www.nicharalambous.com${PATH}`;

export const metadata: Metadata = {
  title: "Team Workflow Upgrade Session",
  description:
    "A hands-on workshop for up to 8 senior leaders from one company. 2 hours, €4,999 per session, ex VAT, plus €499 per extra seat up to 10. Virtual by default.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Team Workflow Upgrade Session | Nic Haralambous",
    description:
      "Your senior leaders build their own workflows in Grok Bot, in one two-hour session. Virtual by default.",
    url: URL,
  },
};

export default function TeamWorkshopPage() {
  return (
    <div className="v3 p-person">
      <JsonLd data={teamWorkshopJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Workshops", path: PATHS.workshops },
          { name: "Team Workflow Upgrade Session", path: PATH },
        ])}
      />
      <section>
        <div className="wrap story">
          <h1>Your senior leaders build their own workflows in Grok Bot, in one two-hour session</h1>
          <p className="lead">
            A hands-on workshop for up to 8 senior leaders from one company. 2 hours, €4,999 per session, ex VAT, plus €499 per extra seat up to 10. Virtual by default.
          </p>
          <p>
            I think a lot of senior leaders have been handed AI tools, told to get on with it, and are still running their week exactly the way they did two years ago. Nobody sat down with them and showed them how to take a real piece of their own work, hand it to a tool and get it back done properly.
          </p>
          <p>
            That is what this session is for. You bring up to 8 senior leaders (or 10, with extra seats), and each of them brings a piece of work they do every week (the report, the follow-ups, the meeting prep, whatever keeps eating their hours). Over two hours I take them through building their own workflow for it in Grok Bot. I&apos;m not presenting at them. They&apos;re working, I&apos;m there helping, and they leave with something running on their own work.
          </p>
          <p>
            Before the session I work with your organisation to set things up. Ideally I show your people, on my own Grok Bot, how it all comes together on your Grok Bot. If you use Claude or ChatGPT, I can adapt to those, so nobody needs to switch tools to attend.
          </p>
          <p>
            The lunch and learn is a 20-minute talk I give to your whole team for €999; the Team Workflow Upgrade Session is two hours of up to 8 of your senior leaders building their own workflows with me, for €4,999 a session, with room for 2 more at €499 each (all ex VAT).
          </p>
          <p>
            I&apos;ve built and sold four companies, written three books and spent more than 20 years building technology businesses. I&apos;d rather your leaders leave with one workflow they actually use than ten ideas they never get to.
          </p>

          <h2>What&apos;s included</h2>
          <ul>
            <li>A 2-hour hands-on session with me, virtual by default. In person is possible, with travel extra.</li>
            <li>Up to 8 people from one company, €4,999 per session, ex VAT</li>
            <li>Extra seats at €499 each, ex VAT, up to 10 people (a maximum of €5,997, ex VAT)</li>
            <li>Each person builds their own workflow in Grok Bot, on a piece of their own real work</li>
            <li>
              Setup before the session: I work with your organisation to get things ready, ideally on your Grok Bot, or on Claude or ChatGPT if that&apos;s what you use [TBC: what each person brings to the session]
            </li>
            <li>[TBC: anything after the session, for example a written recap or a follow-up call]</li>
          </ul>

          <h2>Who it&apos;s for</h2>
          <p>
            Senior leaders, usually 35 and older, who need to get properly hands-on with workflow automation and want to do it on their own work, not a demo. You book it for up to 8 people from your company, or up to 10 with extra seats. It&apos;s one company per session.
          </p>
          <p>
            It isn&apos;t for a whole department or an all-hands. For a bigger room, the lunch and learn or a keynote is the better fit.
          </p>

          <h2>FAQ</h2>
          <div className="faq">
            <h3>How is this different from the lunch and learn?</h3>
            <p>
              The lunch and learn is a 20-minute talk on the Output Paradox for any team size, €999 for the session, ex VAT. This is a 2-hour workshop for up to 8 senior leaders (10 with extra seats), €4,999 per session, ex VAT, where each person builds their own workflow in Grok Bot.
            </p>
            <h3>Do we need Grok Bot set up before the session?</h3>
            <p>
              No. I work with your organisation before the session to set things up. Ideally I show your people, on my own Grok Bot, how it all comes together on your Grok Bot. [TBC: who provides the Grok Bot accounts, and who pays for them after the session]
            </p>
            <h3>What if our company uses Claude or ChatGPT, or limits which AI tools we can use?</h3>
            <p>
              You don&apos;t need to switch tools to attend. If you use Claude or ChatGPT, I can adapt to those. [TBC: how Nic handles confidential data in the session]
            </p>
            <h3>Can we bring more than 8 people?</h3>
            <p>
              Yes, up to 10. Each extra seat is €499, ex VAT, so 10 people is €5,997, ex VAT. Everyone comes from one company. [TBC: whether a group bigger than 10 can book a second session]
            </p>
            <h3>Is it virtual or in person?</h3>
            <p>Virtual by default. In person is possible, with travel extra.</p>
          </div>

          <div className="offer-ctas">
            <CheckoutButton
              id="buy-team-workflow-upgrade"
              offer="team-workflow-upgrade"
              label="Buy the team session"
            />
            <IntroCallLink />
          </div>
        </div>
      </section>
    </div>
  );
}
