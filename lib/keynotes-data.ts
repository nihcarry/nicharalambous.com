/**
 * Single source of truth for keynote content.
 *
 * Both the keynotes listing page (/keynotes) and individual keynote
 * pages (/keynotes/[slug]) pull from this file. Sanity data is overlaid
 * on top when available — this file is the guaranteed fallback so pages
 * never 404 just because a keynote hasn't been published in the CMS yet.
 */

export interface KeynoteSlideData {
  slug: string;
  title: string;
  tagline: string;
  description: string | string[];
  keyTakeaways: string[];
  keyTakeawaysLabel?: string;
  closingLine?: string;
  deliveryFormat: "virtual" | "hybrid" | "in-person";
  duration: string;
  audiences: string[];
}

export const KEYNOTE_SLIDES: KeynoteSlideData[] = [
  {
    slug: "escaping-the-apathy-trap",
    title: "Escaping the Apathy Trap",
    tagline: "What happens when powerful technology meets passive culture",
    description: [
      "AI is changing how we work, think, build, and compete. But while technology accelerates, many organisations are unintentionally creating cultures where people stop questioning, stop experimenting, and stop taking initiative.",
      "Escaping the Apathy Trap is a keynote about curiosity, complacency, and what happens when powerful technology meets passive culture. It explores why people stop taking initiative, how cultures unintentionally reward passivity, and what structurally needs to change to reverse it.",
      "This is not a motivational talk. It is a strategic exploration designed to create recognition first, then movement — shaped by two decades of building companies, leading teams, and watching how people behave inside systems.",
    ],
    keyTakeaways: [
      "Why people stop taking initiative — and what triggers the drift",
      "How cultures unintentionally reward passivity over contribution",
      "What happens when process replaces movement and meetings replace momentum",
      "Why curiosity matters more than ever in the age of AI",
      "How incentives shape behaviour — and what organisations may be teaching people without realising it",
      "What structurally needs to change to rebuild cultures where action feels possible",
    ],
    keyTakeawaysLabel: "Audiences leave understanding:",
    closingLine:
      "The keynote is designed to create recognition first, then movement.",
    deliveryFormat: "virtual",
    duration: "45-60 minutes",
    audiences: [
      "HR leaders and executive teams",
      "Innovation and transformation leaders",
      "Conference organisers and leadership summits",
      "Organisations navigating AI adoption and engagement challenges",
    ],
  },
  {
    slug: "connected-not-consumed",
    title: "Connected, Not Consumed",
    tagline: "Balancing Digital Life and Mental Health at Work",
    description: [
      "Modern work rewards constant availability, fast replies, and full calendars while quietly destroying focus, decision quality, and health. Most teams aren't failing from lack of effort. They're drowning in reaction — jumping between Slack, email, and meetings without ever doing the work that actually matters.",
      "In this keynote, Nic draws on his own experience with corporate burnout and two decades of building companies to show how high-performing teams protect their attention without disconnecting from the work. He introduces practical frameworks for deciding what matters, filtering noise, and creating team norms that reward deep work over performative busyness.",
      "This isn't about going offline or abandoning technology. It's about building intentional habits that let your team stay connected to what matters and disconnected from what doesn't. Your team will leave with tools they can use Monday morning to reclaim their focus and their energy.",
    ],
    keyTakeaways: [
      "A clear way to decide what actually matters each day",
      "A practical system to protect focus inside noisy organisations",
      "A shared language for agency, ownership, and meaningful work",
      "The DIAL framework: Decide, Intend, Act, Loop back",
      "How to build team norms that protect deep work time",
    ],
    deliveryFormat: "virtual",
    duration: "45-60 minutes",
    audiences: [
      "Corporate teams struggling with digital overload",
      "Leadership groups building remote/hybrid work culture",
      "Conferences focused on wellbeing and performance",
      "Teams experiencing burnout or attention fragmentation",
    ],
  },
  {
    slug: "innovation-starts-at-home",
    title: "Innovation Starts at Home",
    tagline: "How to build teams that produce breakthroughs",
    description: [
      "Most organisations want innovation but run systems built for caution: approvals, meetings, process drag, and fear of failure. Talented people become passive. Ideas die in committee. And the business mistakes motion for progress.",
      "In this keynote, Nic shows leaders how to build entrepreneurial teams inside existing organisations — teams that learn fast, act with agency, and turn failure into progress. Drawing from 20+ years of building startups and the patterns he's seen across hundreds of teams, he breaks down why innovation stalls and what practically restarts it.",
      "This talk is especially relevant in the AI era, where the gap between companies that experiment and companies that wait is widening every quarter. Your team will leave with a clear understanding of what's slowing them down and a practical playbook for building momentum.",
    ],
    keyTakeaways: [
      "How to identify and reduce 'progress tax': meetings, process, work-around-work",
      "A framework for building agency and initiative without chaos",
      "How to create psychological safety alongside high standards",
      "The innovation flywheel: Curiosity, Action, Information, Loop",
      "Why the best teams treat failure as data, not disaster",
    ],
    deliveryFormat: "virtual",
    duration: "45-60 minutes",
    audiences: [
      "Product and engineering teams seeking faster iteration",
      "Leadership groups driving organisational transformation",
      "Innovation departments stuck in 'innovation theatre'",
      "Companies navigating AI adoption and digital change",
    ],
  },
  {
    slug: "creating-a-curious-company",
    title: "Creating a Curious Company",
    tagline: "Why innovation stalls and how curiosity restarts it",
    description: [
      "Most organisations don't have an innovation problem. They have a curiosity problem. When people stop asking questions, stop experimenting, and stop challenging assumptions, progress stalls — no matter how many hackathons or brainstorms you run.",
      "In this keynote, Nic challenges the myths of \"innovation theatre\" and reactive change, and shows why real progress doesn't come from buzzwords or panic-driven ideas but from deliberately designing curiosity into how teams think, work, and experiment.",
      "Through powerful stories, research-backed insights, and live audience interaction, this talk helps leaders and teams break out of stagnation by replacing fear, efficiency obsession, and short-term thinking with curiosity, experimentation, and long-term perspective.",
      "This is a highly interactive session designed for virtual delivery. Audiences don't just listen — they participate, reflect, and leave with frameworks they can apply immediately.",
    ],
    keyTakeaways: [
      "A clear understanding of why innovation stalls inside successful companies",
      "Practical ways to turn curiosity into a daily leadership and team practice",
      "Tools to move beyond \"innovation theatre\" into real, meaningful progress",
      "A simple framework to help teams experiment, learn, and adapt without fear",
      "How to create a culture where asking questions is rewarded, not punished",
    ],
    keyTakeawaysLabel: "Audiences leave with:",
    closingLine:
      "Designed for remote teams. Highly interactive. Built to spark action, not just ideas.",
    deliveryFormat: "virtual",
    duration: "45-60 minutes",
    audiences: [
      "Conferences and leadership summits",
      "C-suite retreats and strategy sessions",
      "Innovation teams and R&D departments",
      "Organisations navigating disruption or stagnation",
    ],
  },
];

/** Quick lookup by slug */
export function getKeynoteBySlug(
  slug: string,
): KeynoteSlideData | undefined {
  return KEYNOTE_SLIDES.find((k) => k.slug === slug);
}

/** Keynote titles for the contact form dropdown (plus a catch-all). */
export const KEYNOTE_BOOKING_OPTIONS = [
  ...KEYNOTE_SLIDES.map((k) => k.title),
  "Custom / Not Sure Yet",
] as const;

/** Contact page URL with the keynote pre-selected via ?keynote=slug */
export function getKeynoteBookingUrl(slug: string): string {
  return `/contact?keynote=${encodeURIComponent(slug)}`;
}
