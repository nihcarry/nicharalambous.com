/**
 * Wall-clock timings for the contact form.
 * External email is a sleep, not a live FormSubmit POST.
 *
 *   npx tsx scripts/measure-enquiry-submit.ts
 */
import { finishEnquiry, waitForEnquiryResponse } from "../lib/enquiry-submit";

const delays = (process.argv.slice(2).map(Number).filter((n) => n > 0).length
  ? process.argv.slice(2).map(Number).filter((n) => n > 0)
  : [30000, 45000, 60000]);

function delayed(ms: number, status = 200): Promise<Response> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(new Response("{}", { status })), ms);
  });
}

async function measureCurrent(emailDelayMs: number) {
  const started = performance.now();
  const result = await waitForEnquiryResponse(delayed(emailDelayMs));
  return {
    path: "current",
    emailDelayMs,
    ok: result.ok,
    timeToSuccessMs: Math.round(performance.now() - started),
    timeToRequestEndMs: Math.round(performance.now() - started),
  };
}

async function measureFixed(emailDelayMs: number) {
  const started = performance.now();
  let timeToSuccessMs = 0;
  const result = await finishEnquiry(delayed(emailDelayMs), {
    onPending: () => {
      timeToSuccessMs = Math.round(performance.now() - started);
    },
  });
  return {
    path: "fixed",
    emailDelayMs,
    ok: result.ok,
    pending: result.pending,
    timeToSuccessMs,
    timeToRequestEndMs: Math.round(performance.now() - started),
  };
}

async function measureFastFailure() {
  const started = performance.now();
  let showedSuccess = false;
  const result = await finishEnquiry(delayed(400, 422), {
    onPending: () => {
      showedSuccess = true;
    },
  });
  return {
    path: "fixed-fast-failure",
    emailDelayMs: 400,
    status: result.status,
    showedSuccess,
    pending: result.pending,
    timeToResultMs: Math.round(performance.now() - started),
  };
}

async function main() {
  const [pairs, failure] = await Promise.all([
    Promise.all(delays.map(async (delay) => Promise.all([measureCurrent(delay), measureFixed(delay)]))),
    measureFastFailure(),
  ]);
  console.log(JSON.stringify({ pairs, failure }, null, 2));
}

main();
