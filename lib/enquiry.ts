/**
 * Qualifying enquiry validation. Dates are entered as DD/MM/YYYY and stored as ISO.
 */

export const TEAM_SIZES = [
  "Under 50",
  "50 to 200",
  "200 to 1,000",
  "1,000 to 5,000",
  "5,000+",
] as const;

export const BUDGET_BANDS = [
  "Under €1,000",
  "€1,000 to €2,500",
  "€2,500 to €4,500",
  "€4,500 to €8,000",
  "€8,000+",
  "Not set yet",
] as const;

export const FORMATS = [
  { value: "virtual", title: "Virtual keynote", detail: "Zoom, Teams or Meet" },
  { value: "in-person", title: "In-person keynote", detail: "At your venue" },
  { value: "unsure", title: "Not sure yet", detail: "Help me choose" },
] as const;

export const DECISION_MAKERS = [
  "Yes, I sign it off",
  "I'll bring them in",
  "Someone else decides",
] as const;

export type EnquiryInput = {
  format: string;
  organisation: string;
  teamSize: string;
  audience: string;
  dateFrom: string;
  dateTo: string;
  budget: string;
  decisionMaker: string;
  decisionRole: string;
  name: string;
  email: string;
  message: string;
  honey: string;
};

export type EnquiryErrors = Partial<Record<keyof EnquiryInput, string>>;

const DMY = /^(\d{2})\/(\d{2})\/(\d{4})$/;

/** Parse a DD/MM/YYYY string into YYYY-MM-DD, or null when it is not a real date. */
export function parseDmy(value: string): string | null {
  const match = DMY.exec(value.trim());
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (year < 2024 || year > 2040) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date.toISOString().slice(0, 10);
}

export function formatFromQuery(value: string | null | undefined): string {
  if (!value) return "";
  const normalised = value.toLowerCase().replace(/[_\s]+/g, "-");
  if (normalised === "virtual" || normalised === "online") return "virtual";
  if (normalised === "in-person" || normalised === "inperson") return "in-person";
  if (normalised === "unsure" || normalised === "not-sure" || normalised === "not-sure-yet") {
    return "unsure";
  }
  return "";
}

export function validateEnquiry(input: EnquiryInput): EnquiryErrors {
  const errors: EnquiryErrors = {};

  if (!FORMATS.some((item) => item.value === input.format)) {
    errors.format = "Choose a format.";
  }
  if (!input.organisation.trim()) {
    errors.organisation = "Add your organisation.";
  }
  if (!input.name.trim()) {
    errors.name = "Add your name.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    errors.email = "Add a work email address.";
  }

  const from = input.dateFrom.trim();
  const to = input.dateTo.trim();
  const fromIso = from ? parseDmy(from) : "";
  const toIso = to ? parseDmy(to) : "";
  if (from && !fromIso) errors.dateFrom = "Use DD/MM/YYYY.";
  if (to && !toIso) errors.dateTo = "Use DD/MM/YYYY.";
  if (fromIso && toIso && fromIso > toIso) {
    errors.dateTo = "The end date needs to be on or after the start date.";
  }

  return errors;
}

export function enquiryPayload(input: EnquiryInput): Record<string, string> {
  return {
    format: input.format,
    organisation: input.organisation.trim(),
    team_size: input.teamSize,
    audience: input.audience.trim(),
    date_from: input.dateFrom.trim() ? parseDmy(input.dateFrom) || "" : "",
    date_to: input.dateTo.trim() ? parseDmy(input.dateTo) || "" : "",
    date_from_display: input.dateFrom.trim(),
    date_to_display: input.dateTo.trim(),
    budget_eur_ex_vat: input.budget,
    decision_maker: input.decisionMaker,
    decision_maker_role: input.decisionRole.trim(),
    name: input.name.trim(),
    email: input.email.trim(),
    message: input.message.trim(),
    _subject: "Keynote enquiry from nicharalambous.com",
    _template: "table",
    _captcha: "false",
    _replyto: input.email.trim(),
  };
}
