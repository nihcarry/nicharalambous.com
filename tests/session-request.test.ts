import assert from "node:assert/strict";
import test from "node:test";
import { checkoutHref, isEnquiryOffer } from "../lib/checkout-links";
import { sessionRequestPayload, validateSessionRequest } from "../lib/session-request";

const valid = {
  offer: "team",
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "Example Ltd",
  teamSize: "8",
  preferredDates: "Any Tuesday in February",
  message: "Hello",
  honey: "",
};

test("workshop, exec and coaching buttons go to the request form", () => {
  assert.equal(checkoutHref("team-workflow-upgrade"), "/workshops/request-a-session?offer=team");
  assert.equal(checkoutHref("my-week-with-grok-bot"), "/workshops/request-a-session?offer=my-week");
  assert.equal(checkoutHref("executive-workflow-upgrade"), "/workshops/request-a-session?offer=exec");
  assert.equal(checkoutHref("accountability-coaching"), "/workshops/request-a-session?offer=coaching");
  assert.equal(checkoutHref("lunch-and-learn"), "/keynotes/output-paradox-reengage-teams#checkout");
  assert.equal(isEnquiryOffer("accountability-coaching"), true);
  assert.equal(isEnquiryOffer("executive-workflow-upgrade"), true);
  assert.equal(checkoutHref("accountability-coaching").includes("buy.stripe.com"), false);
  assert.equal(checkoutHref("executive-workflow-upgrade").includes("buy.stripe.com"), false);
});

test("valid request passes and carries the offer", () => {
  assert.deepEqual(validateSessionRequest(valid), {});
  const payload = sessionRequestPayload(valid);
  assert.equal(payload.offer, "team");
  assert.equal(payload.session, "Senior Leaders AI Lab");
  assert.equal(payload.team_size, "8");
  assert.equal(payload.preferred_dates, "Any Tuesday in February");
  assert.equal(payload._replyto, "ada@example.com");
  assert.match(payload._subject, /^Session request: Senior Leaders AI Lab/);
});

test("the CEO session is an enquiry offer", () => {
  const payload = sessionRequestPayload({ ...valid, offer: "exec" });
  assert.equal(validateSessionRequest({ ...valid, offer: "exec" }).offer, undefined);
  assert.equal(payload.session, "The CEO AI Session");
  assert.equal(payload.offer, "exec");
});

test("required fields and offer are checked", () => {
  const errors = validateSessionRequest({ ...valid, offer: "lunch", name: " ", email: "x", company: "", teamSize: "eight" });
  assert.deepEqual(Object.keys(errors).sort(), ["company", "email", "name", "offer", "teamSize"]);
});
