import assert from "node:assert/strict";
import test from "node:test";
import { enquiryPayload, parseDmy, validateEnquiry } from "../lib/enquiry";
import { subscribeToKit } from "../lib/kit";
import { KIT_SUBSCRIBE_URL } from "../lib/site";

const valid = {
  format: "virtual",
  organisation: "Example Ltd",
  teamSize: "50 to 200",
  audience: "Leadership team",
  dateFrom: "01/03/2027",
  dateTo: "31/03/2027",
  budget: "€1,000 to €2,500",
  decisionMaker: "Yes, I sign it off",
  decisionRole: "",
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "All-hands",
  honey: "",
};

test("parses British dates and rejects impossible ones", () => {
  assert.equal(parseDmy("01/03/2027"), "2027-03-01");
  assert.equal(parseDmy("31/02/2027"), null);
  assert.equal(parseDmy("2027-03-01"), null);
});

test("requires organisation, name, email and format", () => {
  const errors = validateEnquiry({ ...valid, organisation: " ", email: "not-an-email", format: "" });
  assert.ok(errors.organisation);
  assert.ok(errors.email);
  assert.ok(errors.format);
  assert.equal(validateEnquiry(valid).email, undefined);
});

test("stores dates as ISO and does not include the honeypot", () => {
  const payload = enquiryPayload(valid);
  assert.equal(payload.date_from, "2027-03-01");
  assert.equal(payload.date_to, "2027-03-31");
  assert.equal(payload.email, "ada@example.com");
  assert.equal("_honey" in payload, false);
});

test("kit subscribe uses the form endpoint and a mocked fetch", async () => {
  let called = "";
  const fetchImpl: typeof fetch = async (input, init) => {
    called = String(input);
    assert.equal(init?.method, "POST");
    const body = init?.body;
    assert.ok(body instanceof FormData);
    assert.equal(body.get("email_address"), "ada@example.com");
    assert.equal(body.get("fields[first_name]"), "Ada");
    return new Response("{}", { status: 200 });
  };
  const result = await subscribeToKit(
    { email: "ada@example.com", firstName: "Ada" },
    fetchImpl,
  );
  assert.equal(result.ok, true);
  assert.equal(called, KIT_SUBSCRIBE_URL);
});
