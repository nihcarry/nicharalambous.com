import assert from "node:assert/strict";
import test from "node:test";
import { enquiryPayload } from "../lib/enquiry";
import {
  enquiryMailto,
  finishEnquiry,
  postEnquiry,
  waitForEnquiryResponse,
} from "../lib/enquiry-submit";

const payload = enquiryPayload({
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
});

function delayed(ms: number, status: number): Promise<Response> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(new Response("{}", { status })), ms);
  });
}

test("posts the same fields and keeps the request alive if the page closes", async () => {
  let init: RequestInit | undefined;
  const fetchImpl: typeof fetch = async (_input, next) => {
    init = next;
    return new Response("{}", { status: 200 });
  };
  await postEnquiry("https://formsubmit.example/ajax/test", payload, fetchImpl);
  assert.equal(init?.method, "POST");
  assert.equal(init?.keepalive, true);
  assert.equal((init?.headers as Record<string, string>).Accept, "application/json");
  const body = init?.body;
  assert.ok(body instanceof FormData);
  assert.equal(body.get("email"), "ada@example.com");
  assert.equal(body.get("organisation"), "Example Ltd");
  assert.equal(body.get("_captcha"), "false");
  assert.equal(body.get("_honey"), null);
});

test("the current wait holds success until the response, including a slow one", async () => {
  const started = performance.now();
  const result = await waitForEnquiryResponse(delayed(180, 200));
  const elapsed = performance.now() - started;
  assert.equal(result.ok, true);
  assert.equal(result.pending, false);
  assert.ok(elapsed >= 160, `elapsed ${elapsed}`);
});

test("a fast failure is reported before the slow-ack window", async () => {
  let pending = false;
  const started = performance.now();
  const result = await finishEnquiry(delayed(40, 422), {
    slowAckMs: 250,
    onPending: () => {
      pending = true;
    },
  });
  const elapsed = performance.now() - started;
  assert.equal(result.ok, false);
  assert.equal(result.status, 422);
  assert.equal(result.pending, false);
  assert.equal(pending, false);
  assert.ok(elapsed < 200, `elapsed ${elapsed}`);
});

test("a still-open request shows success at the ack and is not cancelled", async () => {
  const started = performance.now();
  let ackedAt = 0;
  const result = await finishEnquiry(delayed(350, 200), {
    slowAckMs: 60,
    onPending: () => {
      ackedAt = performance.now() - started;
    },
  });
  const finished = performance.now() - started;
  assert.equal(result.ok, true);
  assert.equal(result.pending, true);
  assert.ok(ackedAt >= 50 && ackedAt < 180, `acked at ${ackedAt}`);
  assert.ok(finished >= 330, `finished at ${finished}`);
});

test("a late failure still resolves as failed after success was shown", async () => {
  let pending = false;
  const result = await finishEnquiry(delayed(120, 500), {
    slowAckMs: 30,
    onPending: () => {
      pending = true;
    },
  });
  assert.equal(pending, true);
  assert.equal(result.pending, true);
  assert.equal(result.ok, false);
  assert.equal(result.status, 500);
});

test("a network error is a failure and does not hang", async () => {
  const result = await finishEnquiry(Promise.reject(new TypeError("Failed to fetch")), {
    slowAckMs: 500,
  });
  assert.equal(result.ok, false);
  assert.equal(result.pending, false);
});

test("mailto carries the answers and skips empty and transport fields", () => {
  const href = enquiryMailto(payload, "nic@nharry.com");
  assert.ok(href.startsWith("mailto:nic@nharry.com?subject="));
  const body = decodeURIComponent(href.split("body=")[1]);
  assert.match(body, /Format: Virtual keynote \(Zoom, Teams or Meet\)/);
  assert.match(body, /Organisation: Example Ltd/);
  assert.match(body, /Email: ada@example.com/);
  assert.equal(body.includes("_captcha"), false);
  assert.equal(body.includes("_honey"), false);
  assert.equal(body.includes("Decision maker role"), false);
});
