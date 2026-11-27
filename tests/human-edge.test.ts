import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  HUMAN_EDGE_ABOUT,
  HUMAN_EDGE_COVERS,
  HUMAN_EDGE_DETAILS,
  HUMAN_EDGE_ENQUIRE_COPY,
  HUMAN_EDGE_HERO,
  HUMAN_EDGE_INFO_BAR,
  HUMAN_EDGE_PROBLEM,
  HUMAN_EDGE_QUOTES,
  HUMAN_EDGE_TESTIMONIALS,
  KEYNOTE_ENQUIRY_FORMATS,
  formatIsoToDmy,
  keynoteEnquiryPayload,
  validateKeynoteEnquiry,
} from "../lib/human-edge";
import { enquiryMailto, postEnquiry } from "../lib/enquiry-submit";
import { ENQUIRY_ENDPOINT } from "../lib/site";

const validInput = {
  format: "lunch-and-learn",
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines Ltd",
  date: "2027-04-16",
  message: "Leadership offsite in Amsterdam",
  honey: "",
};

test("The Human Edge copy is verbatim from the mock and contains no em dashes", () => {
  const allStrings = JSON.stringify({
    HUMAN_EDGE_HERO,
    HUMAN_EDGE_INFO_BAR,
    HUMAN_EDGE_DETAILS,
    HUMAN_EDGE_QUOTES,
    HUMAN_EDGE_PROBLEM,
    HUMAN_EDGE_COVERS,
    HUMAN_EDGE_TESTIMONIALS,
    HUMAN_EDGE_ABOUT,
    HUMAN_EDGE_ENQUIRE_COPY,
    KEYNOTE_ENQUIRY_FORMATS,
  });
  assert.equal(allStrings.includes("\u2014"), false);
  assert.equal(`${HUMAN_EDGE_HERO.titleBefore} ${HUMAN_EDGE_HERO.titleEm}`, "The Human Edge");
  assert.equal(HUMAN_EDGE_HERO.subtitle, "The future of work has someone's name on it.");
  assert.equal(HUMAN_EDGE_HERO.forLine, "For C-suite and leadership teams.");
  assert.equal(HUMAN_EDGE_INFO_BAR.responseText, "Replies within 1 business day");
  assert.equal(HUMAN_EDGE_INFO_BAR.deliveryText, "Live, in person, or on demand");
  assert.equal(HUMAN_EDGE_DETAILS.length, 6);
  assert.equal(HUMAN_EDGE_DETAILS[1].value, "From €4,500");
  assert.equal(HUMAN_EDGE_ENQUIRE_COPY.successMessage, "Thanks, I'll be in touch by email to confirm.");
  assert.match(HUMAN_EDGE_TESTIMONIALS[1].quote, /relateable/);
  assert.deepEqual(
    KEYNOTE_ENQUIRY_FORMATS.map((item) => item.label),
    ["Lunch and share €399", "Virtual keynote", "In-person keynote"],
  );
});

test("validates required inline enquiry fields", () => {
  assert.deepEqual(validateKeynoteEnquiry(validInput), {});
  const errors = validateKeynoteEnquiry({
    ...validInput,
    format: "unknown",
    name: " ",
    email: "not-an-email",
    company: "",
  });
  assert.deepEqual(Object.keys(errors).sort(), ["company", "email", "format", "name"]);
});

test("maps inline enquiry fields to the existing FormSubmit payload and mailto fallback", async () => {
  assert.equal(formatIsoToDmy("2027-04-16"), "16/04/2027");
  const payload = keynoteEnquiryPayload(validInput);
  assert.equal(payload.keynote, "The Human Edge");
  assert.equal(payload.format, "lunch-and-learn");
  assert.equal(payload.organisation, "Analytical Engines Ltd");
  assert.equal(payload.date_from, "2027-04-16");
  assert.equal(payload.date_from_display, "16/04/2027");
  assert.equal(payload.name, "Ada Lovelace");
  assert.equal(payload.email, "ada@example.com");
  assert.equal(payload._replyto, "ada@example.com");
  assert.equal(payload._template, "table");
  assert.equal(payload._captcha, "false");
  assert.equal("_honey" in payload, false);

  let postedUrl = "";
  let postedInit: RequestInit | undefined;
  const mockFetch: typeof fetch = async (input, init) => {
    postedUrl = String(input);
    postedInit = init;
    return new Response("{}", { status: 200 });
  };

  const response = await postEnquiry(ENQUIRY_ENDPOINT, payload, mockFetch);
  assert.equal(response.ok, true);
  assert.equal(postedUrl, ENQUIRY_ENDPOINT);
  const postedBody = postedInit?.body;
  assert.ok(postedBody instanceof FormData);
  assert.equal(postedBody.get("format"), "lunch-and-learn");
  assert.equal(postedBody.get("organisation"), "Analytical Engines Ltd");

  const mailto = enquiryMailto(payload, "nic@nharry.com");
  const decoded = decodeURIComponent(mailto.split("body=")[1]);
  assert.match(decoded, /Format: Virtual lunch and learn.*\(€399 ex VAT\)/);
  assert.match(decoded, /Organisation: Analytical Engines Ltd/);
  assert.match(decoded, /Date from: 16\/04\/2027/);
});

test("inline keynote enquiry form reuses the existing enquiry handler", () => {
  const source = readFileSync("components/site/keynote-enquiry-form.tsx", "utf8");
  assert.match(source, /ENQUIRY_ENDPOINT/);
  assert.match(source, /postEnquiry/);
  assert.match(source, /finishEnquiry/);
  assert.match(source, /enquiryMailto/);
});

test("LogoStrip renders Trusted by label by default", () => {
  const source = readFileSync("components/site/logo-strip.tsx", "utf8");
  assert.match(source, /label = "Trusted by"/);
});
