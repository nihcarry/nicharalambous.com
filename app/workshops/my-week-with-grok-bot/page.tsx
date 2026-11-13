import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { CheckoutButton, IntroCallLink } from "@/components/site/checkout-cta";
import { breadcrumbJsonLd } from "@/lib/metadata";
import { PATHS, grokWeekJsonLd } from "@/lib/offers";

const PATH = PATHS.grokWeek;
const URL = `https://www.nicharalambous.com${PATH}`;

export const metadata: Metadata = {
  title: "My week with Grok Bot",
  description:
    "A show-and-tell for your team or organisation. 90 minutes, up to 20 people, €2,999 per session, ex VAT. Virtual by default.",
  alternates: { canonical: URL },
  openGraph: {
    title: "My week with Grok Bot | Nic Haralambous",
    description:
      "90 minutes inside how I actually work with Grok Bot. €2,999 per session, ex VAT. Virtual by default.",
    url: URL,
  },
};

export default function GrokWeekPage() {
  return (
    <div className="v3 p-person">
      <JsonLd data={grokWeekJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Workshops", path: PATHS.workshops },
          { name: "My week with Grok Bot", path: PATH },
        ])}
      />
      <section>
        <div className="wrap story">
          <p>[TBC: URL, for example /workshops/my-week-with-grok-bot]</p>
          <h1>90 minutes inside how I actually work with Grok Bot</h1>
          <p className="lead">
            A show-and-tell for your team or organisation. I go through my own setup, how I work with Grok Bot and what&apos;s out there to do. 90 minutes, up to 20 people, €2,999 per session, ex VAT. Virtual by default.
          </p>
          <p>
            I think the quickest way for a team to understand what Grok Bot can do is to watch someone use it on their real work, with nothing staged. So that&apos;s what this session is: my week with Grok Bot, shown to your people.
          </p>
          <p>
            For 90 minutes I take your team through my own setup. I show them how I work with Grok Bot day to day and what&apos;s out there for them to do with it [TBC: which parts of the setup Nic shows, and anything he keeps off screen for confidentiality]. Your people watch, ask questions [TBC: how much of the 90 minutes is Q&amp;A] and see it working, before anyone has to commit to building something of their own.
          </p>
          <p>
            The lunch and learn is a 20-minute talk about why AI is making teams busier and less engaged. My week with Grok Bot is 90 minutes of me showing up to 20 of your people how I work with Grok Bot, for €2,999 a session, ex VAT. The Team Workflow Upgrade Session is where up to 8 of your senior leaders build their own workflows with me, for €4,999 a session, ex VAT.
          </p>

          <h2>Talk, show-and-tell or hands-on workshop</h2>
          <div className="compare-scroll">
            <table className="compare">
              <thead>
                <tr>
                  <th scope="col" />
                  <th scope="col">Lunch and learn</th>
                  <th scope="col">My week with Grok Bot</th>
                  <th scope="col">Team Workflow Upgrade Session</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">What it is</th>
                  <td>A talk</td>
                  <td>A show-and-tell</td>
                  <td>A hands-on workshop</td>
                </tr>
                <tr>
                  <th scope="row">Length</th>
                  <td>20 minutes</td>
                  <td>90 minutes</td>
                  <td>2 hours</td>
                </tr>
                <tr>
                  <th scope="row">Who&apos;s in the room</th>
                  <td>Any team size</td>
                  <td>Up to 20 people</td>
                  <td>Up to 8 senior leaders (10 with extra seats), one company</td>
                </tr>
                <tr>
                  <th scope="row">What it covers</th>
                  <td>The Output Paradox: why AI makes everyone busier and less engaged</td>
                  <td>My own Grok Bot setup, how I work with it and what&apos;s out there to do</td>
                  <td>Workflow automation in Grok Bot, on each person&apos;s own work</td>
                </tr>
                <tr>
                  <th scope="row">What your people do</th>
                  <td>Listen, with time for a few questions</td>
                  <td>Watch me work and ask questions</td>
                  <td>Build their own workflow with me</td>
                </tr>
                <tr>
                  <th scope="row">Price</th>
                  <td>€999 per session, ex VAT</td>
                  <td>€2,999 per session, ex VAT</td>
                  <td>
                    €4,999 per session for up to 8, plus €499 per extra seat up to 10 (maximum €5,997), ex VAT. €1,000 off within 60 days of My week with Grok Bot
                  </td>
                </tr>
                <tr>
                  <th scope="row">Where</th>
                  <td>Live on Zoom, Teams or Meet</td>
                  <td>Virtual by default; in person possible, travel extra</td>
                  <td>Virtual by default; in person possible, travel extra</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>What&apos;s included</h2>
          <ul>
            <li>90 minutes with me, virtual by default. In person is possible, with travel extra.</li>
            <li>A walk-through of my own Grok Bot setup and how I work with it</li>
            <li>
              What&apos;s out there for your team to do with Grok Bot [TBC: whether Nic tailors this part to the team&apos;s own work]
            </li>
            <li>Up to 20 people, €2,999 per session, ex VAT</li>
            <li>[TBC: whether Nic does any setup with the organisation before this session, as he does for the workshops]</li>
            <li>[TBC: Q&amp;A time, a recording, or anything sent afterwards]</li>
          </ul>

          <h2>Who it&apos;s for</h2>
          <p>
            Teams and organisations that want to see what working with Grok Bot looks like, from someone who uses it, before anyone builds anything. Up to 20 people in the session. [TBC: Nic&apos;s buyer for this offer. For example the same People, L&amp;D and Talent leads who book the lunch and learn, or leadership teams]
          </p>
          <p>
            It isn&apos;t for a group that wants to leave with their own workflows built. That&apos;s the Team Workflow Upgrade Session.
          </p>

          <h2>FAQ</h2>
          <div className="faq">
            <h3>Will my team build anything in the session?</h3>
            <p>
              No. This is a show-and-tell: I show, they watch and ask questions. If you want people building their own workflows, book the Team Workflow Upgrade Session.
            </p>
            <h3>How is this different from the lunch and learn?</h3>
            <p>
              The lunch and learn is a 20-minute talk on the Output Paradox, for any team size. This is 90 minutes on how I work with Grok Bot, for up to 20 people.
            </p>
            <h3>What exactly will you show us?</h3>
            <p>[TBC: which parts of Nic&apos;s setup are shown, and any confidentiality limits on what appears on screen]</p>
            <h3>Do my team need Grok Bot to attend?</h3>
            <p>
              No. I show it all on my own Grok Bot, so nobody needs to switch tools to attend. If you use Claude or ChatGPT, I&apos;m happy to talk about how what you see carries over [TBC: Nic to confirm he wants this line in a show-and-tell].
            </p>
            <h3>Can we record it?</h3>
            <p>[TBC]</p>
            <h3>What if we have more than 20 people?</h3>
            <p>[TBC: a second session, a higher price, or point them to the lunch and learn or a keynote]</p>
            <h3>Is it virtual or in person?</h3>
            <p>Virtual by default. In person is possible, with travel extra.</p>
          </div>

          <div className="offer-ctas">
            <CheckoutButton
              id="buy-my-week-with-grok-bot"
              offer="my-week-with-grok-bot"
              label="Buy My week with Grok Bot"
            />
            <IntroCallLink />
          </div>
          <h2>After the session</h2>
          <p>
            If your senior people want to go from watching to building, the next step is the Team Workflow Upgrade Session: two hands-on hours where up to 8 of them build their own workflows with me. Book it within 60 days of your My week with Grok Bot session and you get €1,000 off, so it&apos;s €3,999 for up to 8 people, ex VAT.
          </p>
          <p>
            <span className="btn wrap static">See the team session</span>
          </p>
          <p>[TBC: Team Workflow Upgrade Session page]</p>
        </div>
      </section>
    </div>
  );
}
