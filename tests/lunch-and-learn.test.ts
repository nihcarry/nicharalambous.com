import assert from "node:assert/strict";
import test from "node:test";
import {
  LUNCH_AND_LEARN_CALENDLY_DEFAULT,
  LUNCH_AND_LEARN_CALENDLY_URL,
  LUNCH_AND_LEARN_FACTS,
  lunchLearnEmbedUrl,
} from "../lib/lunch-and-learn";
import { coachingJsonLd, grokWeekJsonLd } from "../lib/offers";
import { outputParadoxServiceJsonLd } from "../lib/metadata";

test("lunch and learn price is a literal euro string", () => {
  assert.equal(LUNCH_AND_LEARN_FACTS.priceLine, "€999 ex VAT");
  assert.equal(LUNCH_AND_LEARN_FACTS.priceCaption, "ex VAT");
  assert.equal(LUNCH_AND_LEARN_FACTS.priceCurrency, "EUR");
  assert.equal(LUNCH_AND_LEARN_FACTS.priceEuros, 999);
});

test("unset env uses the live lunch and learn event", () => {
  assert.equal(
    LUNCH_AND_LEARN_CALENDLY_DEFAULT,
    "https://calendly.com/nharry/output-paradox-lunch-and-learn",
  );
  assert.equal(LUNCH_AND_LEARN_CALENDLY_URL, LUNCH_AND_LEARN_CALENDLY_DEFAULT);
  const embedded = new URL(lunchLearnEmbedUrl());
  assert.equal(embedded.origin, "https://calendly.com");
  assert.equal(embedded.pathname, "/nharry/output-paradox-lunch-and-learn");
});

test("embed url adds display params and stays empty without a base url", () => {
  assert.equal(lunchLearnEmbedUrl(""), "");
  assert.equal(lunchLearnEmbedUrl("   "), "");
  const url = new URL(lunchLearnEmbedUrl("https://calendly.com/nharry/output-paradox-lunch-and-learn"));
  assert.equal(url.searchParams.get("hide_event_type_details"), "1");
  assert.equal(url.searchParams.get("background_color"), "fbf9f4");
  assert.equal(url.searchParams.get("text_color"), "16181d");
  assert.equal(url.searchParams.get("primary_color"), "2563eb");
  assert.equal(url.searchParams.get("hide_gdpr_banner"), null);
});

test("only the lunch and learn offer carries a price in structured data", () => {
  const service = outputParadoxServiceJsonLd();
  assert.equal(service.offers.length, 1);
  assert.equal(service.offers[0].price, "999");
  assert.equal(service.offers[0].priceCurrency, "EUR");
  assert.equal(service.offers[0].valueAddedTaxIncluded, false);
  assert.match(service.offers[0].description, /€999 ex VAT/);
  assert.match(service.offers[0].description, /7 calendar days/);

  const week = JSON.stringify(grokWeekJsonLd());
  const coaching = JSON.stringify(coachingJsonLd());
  assert.equal(week.includes("price"), false);
  assert.equal(week.includes("2999"), false);
  assert.equal(coaching.includes("price"), false);
  assert.equal(coaching.includes("399"), false);
});
