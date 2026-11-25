import { LunchLearnEmbed, PickSlotLink } from "@/components/site/lunch-learn-embed";
import { LUNCH_AND_LEARN_FACTS, LUNCH_AND_LEARN_LABEL, lunchLearnEmbedUrl } from "@/lib/lunch-and-learn";
import { INTRO_CALL_URL } from "@/lib/offers";

/**
 * Lunch and learn booking section. Copy is the 25 Nov 2026 design spec.
 * Non-breaking spaces are intentional so the headline does not leave one word on a line.
 */
export function LunchLearnCheckout() {
  return (
    <section className="checkout" id="checkout" aria-labelledby="checkout-h">
      <div className="wrap">
        <div className="co-grid">
          <div className="co-head">
            <h2 id="checkout-h">
              Book your team’s lunch and learn in&nbsp;one&nbsp;go
            </h2>
            <p className="lead">
              Pick a slot, pay online and it’s in your diary. I’ll take it from&nbsp;there.
            </p>
          </div>

          <ol className="steps" aria-label="How booking works">
            <li className="step">
              <span className="n">01</span>
              <div>
                <h3>Pick a slot</h3>
                <p>Choose a Wednesday or Friday. 45 minutes, starting 11:00, 12:00 or 13:00 Amsterdam time, shown in your time zone. Book at least 7 calendar days ahead.</p>
              </div>
            </li>
            <li className="step">
              <span className="n">02</span>
              <div>
                <h3>Confirm</h3>
                <p>Add your details and a line about your team, so I can tailor the talk.</p>
              </div>
            </li>
            <li className="step">
              <span className="n">03</span>
              <div>
                <h3>Pay</h3>
                <p>
                  Pay by card in the same window, securely through Stripe. You’re booked as soon as it goes&nbsp;through.
                </p>
              </div>
            </li>
          </ol>

          <div className="pricecard">
            <h3>{LUNCH_AND_LEARN_LABEL}</h3>
            <p className="sub">Pay when you book. No proposal and no back and&nbsp;forth.</p>
            <div className="row">
              <div className="price">
                {LUNCH_AND_LEARN_FACTS.priceAmount}
                <small>{LUNCH_AND_LEARN_FACTS.priceCaption}</small>
              </div>
            </div>
            <p className="when">
              Wednesday or Friday. 45-minute sessions starting 11:00, 12:00 or 13:00 Amsterdam time, shown in your time zone. Book at least 7 calendar days&nbsp;ahead.
            </p>
            <PickSlotLink />
            <div className="links">
              <a className="tlink" href={INTRO_CALL_URL} target="_blank" rel="noopener noreferrer">
                Not sure yet? Book a free 20-minute intro call
              </a>
              <a className="tlink" href="/contact">
                Planning something bigger? Talk to me first
              </a>
            </div>
          </div>

          <div className={`widget${lunchLearnEmbedUrl() ? "" : " is-fallback"}`} id="calendly" tabIndex={-1}>
            <LunchLearnEmbed />
          </div>

          <div className="side">
            <div className="get">
              <h3>What you get</h3>
              <ul>
                <li>
                  <span className="mono">01</span>
                  <div>
                    <b>The talk.</b> 20 minutes on the Output Paradox, tailored to your people.
                  </div>
                </li>
                <li>
                  <span className="mono">02</span>
                  <div>
                    <b>Q&amp;A.</b> Time for a few questions.
                  </div>
                </li>
                <li>
                  <span className="mono">03</span>
                  <div>
                    <b>45 minutes.</b> A 20-minute talk, then Q&amp;A, in one slot.
                  </div>
                </li>
                <li>
                  <span className="mono">04</span>
                  <div>
                    <b>Online only.</b> You send the Zoom, Teams or Meet link. It works across time zones.
                  </div>
                </li>
                <li>
                  <span className="mono">05</span>
                  <div>
                    <b>Lunchtime.</b> Wednesdays and Fridays.
                  </div>
                </li>
              </ul>
            </div>
            <div className="after">
              <h3>What happens after you pay</h3>
              <ol>
                <li>You’re booked straight away. Stripe sends a receipt, and Moneybird sends the invoice. EU reverse charge is on the invoice where it applies.</li>
                <li>You send your Zoom, Teams or Meet link, and a line about your team, so I can tailor the talk.</li>
                <li>I join your call at the time you picked.</li>
                <li>Reschedule for free up to 48 hours before the session.</li>
                <li>Cancel 5 working days ahead for a full refund. After that, you can reschedule only. There is no refund.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
