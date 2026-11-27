import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  ABOUT_COPY,
  FINAL_COPY,
  HERO_COPY,
  HOME_LINKS,
  LETTER_COPY,
  LUNCH_COPY,
  NEWS_COPY,
  ROOM_COPY,
} from "../lib/home-letter";
import { LUNCH_AND_LEARN_PATH } from "../lib/lunch-and-learn";

test("homepage letter copy keeps Nic's spelling and the €399 lines", () => {
  assert.match(ROOM_COPY.quotes[0].quote, /relateable/);
  assert.equal(HERO_COPY.fine, "€399 ex VAT. 20 minutes + Q&A. Live on Zoom, Teams or Meet.");
  assert.equal(LUNCH_COPY.price, "€399 ex VAT.");
  assert.equal(FINAL_COPY.price, "€399 ex VAT.");
  assert.match(LETTER_COPY.paragraphs[3], /“Done”/);
  assert.equal(HERO_COPY.book, "Book a lunch and share");
  assert.equal(NEWS_COPY.button, "Send it to me");
  assert.match(NEWS_COPY.body, /favourite/);
  assert.match(ABOUT_COPY.title, /two best-sellers/);
  assert.equal(FINAL_COPY.title, "If your team is moving fast and needs to go deep, let's talk");
});

test("homepage buttons use the live lunch booking path and existing pages", () => {
  assert.equal(HOME_LINKS.book, LUNCH_AND_LEARN_PATH);
  assert.equal(HOME_LINKS.book, "/keynotes/output-paradox-reengage-teams#checkout");
  assert.equal(HOME_LINKS.workshop, "/workshops");
  assert.equal(HOME_LINKS.about, "/about");
  assert.equal(HOME_LINKS.contact, "/contact");
  assert.equal(HOME_LINKS.start, "#lunch");
  assert.equal(HOME_LINKS.more, "/keynotes/output-paradox-reengage-teams");
});

test("homepage newsletter posts through the existing Kit helper", () => {
  const source = readFileSync("components/site/home-letter-newsletter.tsx", "utf8");
  assert.match(source, /subscribeToKit/);
  assert.doesNotMatch(source, /substack/i);
  assert.doesNotMatch(source, /fetch\(/);
});
