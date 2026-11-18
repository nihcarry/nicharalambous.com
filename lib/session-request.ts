/**
 * Session request form for the two workshops sold by enquiry:
 * Team Workflow Upgrade Session and My week with AI.
 * Posts to the same FormSubmit endpoint as /contact (ENQUIRY_ENDPOINT).
 */

export const SESSION_OFFERS = [
  {
    value: "team",
    title: "Team Workflow Upgrade Session",
    detail: "2 hours, up to 8 senior leaders, €4,999 per session, ex VAT. Extra seats €499, up to 10.",
  },
  {
    value: "my-week",
    title: "My week with AI",
    detail: "90 minutes, up to 20 people, €2,999 per session, ex VAT.",
  },
] as const;

export type SessionOfferCode = (typeof SESSION_OFFERS)[number]["value"];

export function sessionOffer(code: string | null | undefined) {
  return SESSION_OFFERS.find((item) => item.value === code) ?? null;
}

export type SessionRequestInput = {
  offer: string;
  name: string;
  email: string;
  company: string;
  teamSize: string;
  preferredDates: string;
  message: string;
  honey: string;
};

export type SessionRequestErrors = Partial<Record<keyof SessionRequestInput, string>>;

export function validateSessionRequest(input: SessionRequestInput): SessionRequestErrors {
  const errors: SessionRequestErrors = {};
  if (!sessionOffer(input.offer)) errors.offer = "Choose a session.";
  if (!input.name.trim()) errors.name = "Add your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    errors.email = "Add a work email address.";
  }
  if (!input.company.trim()) errors.company = "Add your company.";
  const size = input.teamSize.trim();
  if (!/^\d{1,5}$/.test(size) || Number(size) < 1) {
    errors.teamSize = "Add how many people will join, as a number.";
  }
  return errors;
}

export function sessionRequestPayload(input: SessionRequestInput): Record<string, string> {
  const offer = sessionOffer(input.offer);
  const title = offer ? offer.title : input.offer;
  return {
    offer: input.offer,
    session: title,
    name: input.name.trim(),
    email: input.email.trim(),
    company: input.company.trim(),
    team_size: input.teamSize.trim(),
    preferred_dates: input.preferredDates.trim(),
    message: input.message.trim(),
    _subject: `Session request: ${title} (nicharalambous.com)`,
    _template: "table",
    _captcha: "false",
    _replyto: input.email.trim(),
  };
}
