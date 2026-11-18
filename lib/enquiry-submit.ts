/**
 * The contact form posts from the browser to FormSubmit. There is no Lambda.
 * FormSubmit holds that POST open until the email has gone out, which is the
 * 30 to 60 second wait. Fast failures (network errors and 4xx) return in
 * well under a second.
 *
 * After ENQUIRY_SLOW_ACK_MS with no response, treat the request as the slow
 * email path: show success and leave the POST running. If it later fails,
 * the caller shows a retry and a mailto link. The request is not aborted.
 */

import { FORMATS } from "@/lib/enquiry";
import { ENQUIRY_EMAIL } from "@/lib/site";

/** Sits above measured fast failures and below FormSubmit's email hold. */
export const ENQUIRY_SLOW_ACK_MS = 2000;

const MAILTO_FIELDS = [
  ["format", "Format"],
  ["organisation", "Organisation"],
  ["session", "Session"],
  ["company", "Company"],
  ["team_size", "Team size"],
  ["audience", "Audience"],
  ["date_from_display", "Date from"],
  ["date_to_display", "Date to"],
  ["budget_eur_ex_vat", "Budget"],
  ["decision_maker", "Decision maker"],
  ["decision_maker_role", "Decision maker role"],
  ["preferred_dates", "Preferred dates"],
  ["name", "Name"],
  ["email", "Email"],
  ["message", "Message"],
] as const;

export type EnquiryResult = {
  ok: boolean;
  /** True when success was shown before this result arrived. */
  pending: boolean;
  status?: number;
};

export function enquiryFormData(payload: Record<string, string>): FormData {
  const body = new FormData();
  for (const [key, value] of Object.entries(payload)) body.set(key, value);
  return body;
}

/** What the live form does today: success waits for the whole response. */
export async function waitForEnquiryResponse(
  response: Promise<Response>,
): Promise<EnquiryResult> {
  try {
    const settled = await response;
    return { ok: settled.ok, pending: false, status: settled.status };
  } catch {
    return { ok: false, pending: false };
  }
}

export function postEnquiry(
  endpoint: string,
  payload: Record<string, string>,
  fetchImpl: typeof fetch = fetch,
): Promise<Response> {
  return fetchImpl(endpoint, {
    method: "POST",
    body: enquiryFormData(payload),
    headers: { Accept: "application/json" },
    keepalive: true,
  });
}

export function finishEnquiry(
  response: Promise<Response>,
  options: {
    slowAckMs?: number;
    onPending?: () => void;
  } = {},
): Promise<EnquiryResult> {
  const slowAckMs = options.slowAckMs ?? ENQUIRY_SLOW_ACK_MS;
  let settled = false;
  let pending = false;

  const timer = setTimeout(() => {
    if (settled) return;
    pending = true;
    options.onPending?.();
  }, slowAckMs);

  return response.then(
    (result) => {
      settled = true;
      clearTimeout(timer);
      return { ok: result.ok, pending, status: result.status };
    },
    () => {
      settled = true;
      clearTimeout(timer);
      return { ok: false, pending };
    },
  );
}

function formatLabel(value: string): string {
  const match = FORMATS.find((item) => item.value === value);
  if (!match) return value;
  return `${match.title} (${match.detail})`;
}

/** A mailto link carrying the same answers, for when the POST fails. */
export function enquiryMailto(payload: Record<string, string>, to = ENQUIRY_EMAIL): string {
  const lines: string[] = [];
  for (const [key, label] of MAILTO_FIELDS) {
    const raw = payload[key]?.trim() ?? "";
    if (!raw) continue;
    lines.push(`${label}: ${key === "format" ? formatLabel(raw) : raw}`);
  }
  const subject = payload._subject?.trim() || "Keynote enquiry from nicharalambous.com";
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}
