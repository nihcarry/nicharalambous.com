/**
 * Homepage body copy for the Letter A layout.
 * Strings are Nic's words, verbatim. Do not edit, reword, or trim them.
 * The lunch booking URL is the live lunch-and-learn flow. Its charged price
 * is still the amount in lib/lunch-and-learn.ts.
 */
import { LUNCH_AND_LEARN_PATH } from "@/lib/lunch-and-learn";

export const HOME_LINKS = {
  /** Existing Calendly checkout on the Output Paradox page. */
  book: LUNCH_AND_LEARN_PATH,
  workshop: "/workshops",
  /** In-page jump to the lunch and share section. */
  start: "#lunch",
  about: "/about",
  contact: "/contact",
  /** Talk page. Its "From the people who booked it" section has the longer set. */
  more: "/keynotes/output-paradox-reengage-teams",
} as const;

export const HOME_PHOTOS = {
  hero: "/v3/nic-hero-4-hd.webp",
  heroWidth: 682,
  heroHeight: 1024,
  heroAlt: "Nic Haralambous speaking, one hand held out",
  /** Same file as the approved mock's face crop. */
  face: "/v3/new/nic-1722-chip.jpg",
  faceAlt: "Nic Haralambous",
  /** Arms-crossed portrait already used on the site. */
  bio: "/v3/new/bio-exec-07.jpg",
  bioAlt: "Nic Haralambous with his arms crossed",
  seal: "/favicon.svg",
} as const;

export const HERO_COPY = {
  titleBefore: "Everyone's working faster now.",
  titleEm: "How do we make people strive for excellence too?",
  lead1:
    "AI has every team in the world optimising for speed. The new advantage is optimising for depth of knowledge, human opinion, taste, ownership and responsibility. ",
  lead2:
    "The risk is not that AI replaces your people. The opportunity is that they use AI to own their work more deeply than ever and ship quality work. ",
  start:
    "Start with a lunch and share for your team. Go deeper with a workshop for CEOs and leadership teams.",
  book: "Book a lunch and share",
  workshop: "Go deeper with a workshop",
  fine: "€399 ex VAT. 20 minutes + Q&A. Live on Zoom, Teams or Meet.",
} as const;

export const LETTER_COPY = {
  greet: "Hello,",
  subjectBefore: "Output and confidence are up.",
  subjectEm: "Understanding and ownership are lagging behind.",
  paragraphs: [
    "Your team is producing more than it ever has. More documents, more decks, more drafts, messages, and more emails, and nearly all of them read well. The opportunity is to put that same energy into the actual work, not only the ticking boxes, alignment tasks and the work around the work.",
    "The people producing this increased output feel good about it, because AI is incredible at making work look finished and whoever prompted it feel smart.",
    "Great, now everyone (including your competitors) can go faster. In a world of speed, the qualities worth growing next are harder to see on a dashboard.",
    "Ownership and excellence grow when people are incentivised to close a knowledge gap. To be curious. To experiment. To fail. To learn on their own. Not to tick a box and move an item into the \u201cDone\u201d column. ",
    "Depth grows when the first answer is a starting point, and we are incentivised to go further.",
  ],
  ahead:
    "This is how your business pulls ahead. ",
  highlight: "High trust, low process teams incentivised to do their best work.",
  closing:
    "Everyone is indexing on speed because speed is easy to measure. The real move is to update our incentives and focus on the harder things: depth, knowledge, creativity, taste, and outcomes that actually serve your customers.",
  seeHow: "See how to start",
  signature: "Nic",
  name: "Nic Haralambous",
} as const;

export const ABOUT_COPY = {
  title:
    "I've built and sold four companies, written three books (two best-sellers) and shipped products and apps to millions of users around the world.",
  p1: "I've been building businesses since I was 16. I've sold four of them, written three books and spent more than 20 years building technology businesses and learning through failure and success. I use AI tools to run multiple businesses every day, and help leaders rethink business processes for the new landscape we're all walking.",
  p2: "My professional speaking career began over 15 years ago and since then I have spoken at conferences and events around the world, including SXSW and for teams at Standard Bank, Vodafone, Sage, Old Mutual, Nedbank and many more.",
  link: "Read the full story",
} as const;

export const LUNCH_COPY = {
  title: "Start with a lunch and share",
  body: "A 20-minute talk plus Q&A, live on Zoom, Teams or Meet, for any team size. ",
  price: "€399 ex VAT.",
  book: "Book a lunch and share",
  talk: "Planning something bigger? Talk to me first",
} as const;

export const ROOM_COPY = {
  title: "What happened in the room",
  quotes: [
    {
      quote:
        "\u201cNic's talk was really well received by the team. Nic has the ability to deliver relateable, lasting lessons. The feedback across our business was super positive, and he left our team inspired.\u201d",
      who: "Sean Riley, CEO, Ad Dynamo",
    },
    {
      quote:
        "\u201cThank you for bringing such important insights, energy, and engagement to a topic that truly matters to our team.\u201d",
      who: "Outsystems",
    },
  ],
  more: "More from the people who booked it",
} as const;

export const FINAL_COPY = {
  title: "If your team is moving fast and needs to go deep, let's talk",
  book: "Book a lunch and share",
  price: "€399 ex VAT.",
  workshop: "Or go deeper with a workshop",
} as const;

export const NEWS_COPY = {
  title: "I write to you every week",
  body: "Every week I'll send you my three favourite things from the week and at least one idea that I can't stop thinking about.",
  button: "Send it to me",
  placeholder: "Email address",
  sending: "Sending",
  thanks: "Thanks, you are in.",
} as const;
