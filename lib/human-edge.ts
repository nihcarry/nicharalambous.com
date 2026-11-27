/**
 * Copy and enquiry payload helpers for "The Human Edge" keynote page.
 * Copy is verbatim from the approved design mock. Do not rewrite or add em dashes.
 */
import type { DetailsBlockItem } from "@/components/site/details-block";
import type { InfoBarLogo } from "@/components/site/info-bar";

export const HUMAN_EDGE_HERO = {
  titleBefore: "The Human",
  titleEm: "Edge",
  subtitle: "The future of work has someone's name on it.",
  talkLine:
    "A highly relevant keynote on why AI is making your team faster but feel less responsible for the work they deliver.",
  forLine: "For C-suite and leadership teams.",
  cta: "Enquire to book",
  photoSrc: "/v3/nic-hero-3.webp",
  photoAlt: "Nic Haralambous on stage, clicker in hand, mid talk",
  photoWidth: 560,
  photoHeight: 841,
} as const;

export const HUMAN_EDGE_INFO_BAR = {
  responseText: "Replies within 1 business day",
  trustedByLabel: "Trusted by",
  /**
   * Optical heights balance visual weight across the three marks:
   * - Vodafone (4.03:1) has a circular mark plus lighter lowercase letters.
   * - Johnson & Johnson (10.71:1) is wide script; avoid clamping at 92px.
   * - SXSW (4.29:1) is heavy all-caps block type filling 100% of its height.
   */
  logos: [
    { src: "/v3/mono/vodafone.svg", alt: "Vodafone", height: 20, maxWidth: 96 },
    { src: "/v3/mono/johnson-johnson-ink.png", alt: "Johnson & Johnson", height: 14, maxWidth: 156 },
    { src: "/v3/mono/sxsw-ink.png", alt: "SXSW", height: 13, maxWidth: 80 },
  ] satisfies readonly InfoBarLogo[],
  deliveryText: "Live, in person, or on demand",
  ctaLabel: "Enquire to book",
  ctaHref: "#enquire",
} as const;

export const HUMAN_EDGE_DETAILS: readonly DetailsBlockItem[] = [
  {
    label: "Length",
    value: "Up to 90 minutes (inclusive of Q&A)",
    icon: "clock",
  },
  {
    label: "Price",
    value: "From €4,500",
    icon: "price",
  },
  {
    label: "Recording",
    value: "Recording available as an optional service, licensing included",
    icon: "recording",
  },
  {
    label: "Preparation",
    value: "A pre-engagement alignment call ahead of time",
    icon: "preparation",
  },
  {
    label: "Q&A",
    value: "Optional Q&A",
    icon: "qa",
  },
  {
    label: "White glove service",
    value: "Customised to your needs. Available in person, virtual or hybrid.",
    icon: "service",
  },
];

export const HUMAN_EDGE_QUOTES = {
  lead: "AI has every team in the world optimising for speed. The new advantage is optimising for depth of knowledge, human opinion, taste, ownership and responsibility.",
  secondary: [
    "Ownership and excellence grow when people are incentivised to close a knowledge gap. To be curious. To experiment. To fail. To learn on their own. Not to tick a box and move an item into the \u201cDone\u201d column.",
    "Everyone is indexing on speed because speed is easy to measure. The real move is to update our incentives and focus on the harder things: depth, knowledge, creativity, taste, and outcomes that actually serve your customers.",
  ],
} as const;

export const HUMAN_EDGE_PROBLEM = {
  stat: "1 in 4",
  heading: "Nearly one in four of your employees is disengaged right now",
  lead: "You can't see it clearly because AI is masking the signal. More documents, bigger roadmaps and more meetings about work nobody reads. Everything looks busy, and something still feels off.",
  source: "Source: ActivTrak State of the Workplace",
  pullBefore:
    "Artificial Intelligence won't kill your business. The other AI you should be worried about is",
  pullEm: "Apathy and Indifference.",
} as const;

export const HUMAN_EDGE_COVERS = {
  heading: "What the talk covers",
  outputParadox: {
    number: "01",
    heading: "The Output Paradox",
    paragraphs: [
      "People are creating more output and doing more work, but their engagement, ownership and responsibility for that work is down.",
      "They are creating more but owning less, because they aren't doing the work. It is being outsourced to AI.",
    ],
  },
  apathyTrap: {
    number: "02",
    heading: "The Apathy Trap",
    paragraphs: [
      "Curiosity doesn't vanish overnight. It erodes because it gets ignored.",
      "By the time your best people check out, you're already too late. AI often speeds up the slide, because easy work replaces hard thinking.",
    ],
    arch: [
      { file: "arch-01-curiosity.png", step: "01", label: "Curiosity", highlight: false },
      { file: "arch-02-boredom.png", step: "02", label: "Boredom", highlight: false },
      { file: "arch-03-apathy.png", step: "03", label: "Apathy", highlight: false },
      { file: "arch-04-indifference.png", step: "04", label: "Indifference", highlight: false },
      { file: "arch-05-exit.png", step: "05", label: "Exit", highlight: true },
    ],
  },
  threeShifts: {
    number: "03",
    heading: "Three shifts. Not eight action items.",
    shifts: [
      {
        number: "01",
        heading: "Rewire what you reward",
        body: "Stop rewarding speed and calling it culture.",
      },
      {
        number: "02",
        heading: "Fix placement, not performance",
        body: "Most disengagement isn't a person problem. It's a seat problem.",
      },
      {
        number: "03",
        heading: "Make curiosity a practice, not a poster",
        body: "Small bets, short cycles and permission to be wrong.",
      },
    ],
  },
  leavesWith: {
    number: "04",
    heading: "What your team leaves with",
    items: [
      {
        number: "01",
        text: "A clear read on what your organisation actually rewards, versus what it says it values",
      },
      {
        number: "02",
        text: "A map of where your people sit on the Apathy Arch, and why that's a structure problem",
      },
      {
        number: "03",
        text: "A working model for turning curiosity into action, without waiting for permission",
      },
      {
        number: "04",
        text: "One change your team can make in the room, before the applause stops",
      },
    ],
  },
} as const;

export const HUMAN_EDGE_TESTIMONIALS = [
  {
    initial: "S",
    quote:
      "\u201cWhat a brilliant speaker. Engaging, professional and incredibly knowledgeable about the innovation space. Nic had our audience hanging on every word and the feedback overall was amazingly positive.\u201d",
    name: "Samantha Fisher",
    role: "Head of Marketing \u2013 Innovation, Motus",
  },
  {
    initial: "S",
    quote:
      "\u201cNic's talk was really well received by the team. Nic has the ability to deliver relateable, lasting lessons. The feedback across our business was super positive, and he left our team inspired.\u201d",
    name: "Sean Riley",
    role: "CEO, Ad Dynamo",
  },
  {
    initial: "D",
    quote:
      "\u201cNic is a successful serial entrepreneur and a great communicator who tells it like it is. His keynotes are always engaging and keep the attendees captivated.\u201d",
    name: "Don Weiss",
    role: "Columbia Business School",
  },
] as const;

export const HUMAN_EDGE_ABOUT = {
  photoSrc: "/v3/speaker.jpg",
  photoAlt: "Nic Haralambous, portrait",
  heading: "I've been building businesses since I was 16",
  lead: "I've sold four of them, written three books and spent more than 20 years learning through failure and success. I've spoken at SXSW and for teams at Standard Bank, Vodacom, Old Mutual and Nedbank. Everything I've seen comes back to one thing: culture creates change.",
  stats: [
    { value: "4", label: "startup exits" },
    { value: "3", label: "books" },
    { value: "20+", label: "years building" },
    { value: "16+", label: "years speaking" },
  ],
} as const;

export const HUMAN_EDGE_ENQUIRE_COPY = {
  heading:
    "If your team is doing more and feeling less, this is the conversation they need next",
  lead: "Send an enquiry and I confirm your slot by email.",
  submitLabel: "Send enquiry",
  sendingLabel: "Sending...",
  successMessage: "Thanks, I'll be in touch by email to confirm.",
  afterLinkLabel: "Go deeper with a workshop",
  afterLinkHref: "/workshops",
} as const;

export type KeynoteEnquiryFormatValue = "lunch-and-learn" | "virtual" | "in-person";

export const KEYNOTE_ENQUIRY_FORMATS: readonly {
  value: KeynoteEnquiryFormatValue;
  label: string;
  note: string;
}[] = [
  {
    value: "lunch-and-learn",
    label: "Lunch and share €399",
    note: "€399 ex VAT. 20 minutes + Q&A, live online, any team size. Live on Zoom, Teams or Meet. Wednesdays or Fridays, starting 11:00, 12:00 or 13:00 Amsterdam time. Book at least 7 days ahead.",
  },
  {
    value: "virtual",
    label: "Virtual keynote",
    note: "Price on request. The full 45-minute talk for an all-hands, offsite or webinar.",
  },
  {
    value: "in-person",
    label: "In-person keynote",
    note: "From €4,500 ex VAT, travel extra. 45 minutes, in your room.",
  },
];

export type KeynoteEnquiryInput = {
  format: string;
  name: string;
  email: string;
  company: string;
  date: string;
  message: string;
  honey: string;
};

export type KeynoteEnquiryErrors = Partial<Record<keyof KeynoteEnquiryInput, string>>;

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function formatIsoToDmy(value: string): string {
  const match = ISO_DATE.exec(value.trim());
  if (!match) return value.trim();
  return `${match[3]}/${match[2]}/${match[1]}`;
}

export function validateKeynoteEnquiry(input: KeynoteEnquiryInput): KeynoteEnquiryErrors {
  const errors: KeynoteEnquiryErrors = {};
  if (!KEYNOTE_ENQUIRY_FORMATS.some((item) => item.value === input.format)) {
    errors.format = "Choose a format.";
  }
  if (!input.name.trim()) {
    errors.name = "Add your name.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    errors.email = "Add a work email address.";
  }
  if (!input.company.trim()) {
    errors.company = "Add your company.";
  }
  return errors;
}

/**
 * Maps the inline keynote enquiry form into the existing FormSubmit handler
 * fields used by components/site/enquiry-form.tsx (lib/enquiry.ts).
 */
export function keynoteEnquiryPayload(input: KeynoteEnquiryInput): Record<string, string> {
  const dateIso = input.date.trim();
  return {
    keynote: "The Human Edge",
    format: input.format,
    organisation: input.company.trim(),
    date_from: dateIso,
    date_from_display: dateIso ? formatIsoToDmy(dateIso) : "",
    name: input.name.trim(),
    email: input.email.trim(),
    message: input.message.trim(),
    _subject: "Keynote enquiry: The Human Edge",
    _template: "table",
    _captcha: "false",
    _replyto: input.email.trim(),
  };
}
