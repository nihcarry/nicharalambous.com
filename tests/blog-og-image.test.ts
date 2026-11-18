import assert from "node:assert/strict";
import test from "node:test";

process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??= "lsivhm7f";
process.env.NEXT_PUBLIC_SANITY_DATASET ??= "production";

const HERO_REF =
  "image-c3829af18a36f1002243e3ac66d14699ecf3ea12-1280x720-jpg";
const HERO_URL =
  "https://cdn.sanity.io/images/lsivhm7f/production/c3829af18a36f1002243e3ac66d14699ecf3ea12-1280x720.jpg?rect=0,24,1280,672&w=1200&h=630&fit=crop";
const OTHER_REF = "image-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-800x600-png";

const heroAlt =
  "Illustration: a row of people stamp boxes on a conveyor belt while one woman kneels to inspect a box with a magnifying glass, watched by an owl";

function image(ref: string, alt: string) {
  return {
    alt,
    asset: {
      _id: ref,
      url: `https://cdn.sanity.io/images/lsivhm7f/production/${ref.replace(/^image-/, "").replace(/-([a-z0-9]+)$/i, ".$1")}`,
    },
    hotspot: null,
    crop: null,
  };
}

test("builds a 1200x630 crop URL from the hero", async () => {
  const { blogShareImage } = await import("../lib/blog-og-image.ts");
  const imageMeta = blogShareImage({
    title: "Lazy, useless people are hiding behind AI",
    mainImage: image(HERO_REF, heroAlt),
    featuredImage: null,
  });

  assert.equal(imageMeta.url, HERO_URL);
  assert.equal(imageMeta.width, 1200);
  assert.equal(imageMeta.height, 630);
  assert.equal(imageMeta.alt, heroAlt);
  assert.match(imageMeta.url, /^https:\/\/cdn\.sanity\.io\/images\/lsivhm7f\/production\//);
  assert.match(imageMeta.url, /(?:\?|&)w=1200(?:&|$)/);
  assert.match(imageMeta.url, /(?:\?|&)h=630(?:&|$)/);
  assert.match(imageMeta.url, /(?:\?|&)fit=crop(?:&|$)/);
});

test("prefers mainImage and falls back to featuredImage, then the post title", async () => {
  const { blogShareImage } = await import("../lib/blog-og-image.ts");

  const preferred = blogShareImage({
    title: "Post title",
    mainImage: image(HERO_REF, "Main alt"),
    featuredImage: image(OTHER_REF, "Featured alt"),
  });
  assert.equal(preferred.url, HERO_URL);
  assert.equal(preferred.alt, "Main alt");

  const featured = blogShareImage({
    title: "Post title",
    mainImage: null,
    featuredImage: image(HERO_REF, "   "),
  });
  assert.equal(featured.url, HERO_URL);
  assert.equal(featured.alt, "Post title");
});

test("uses the site default OG image when a post has no hero", async () => {
  const { blogShareImage, DEFAULT_OG_IMAGE_PATH } = await import(
    "../lib/blog-og-image.ts"
  );
  const imageMeta = blogShareImage({
    title: "10 Things I Learned From Casey Neistat's Daily Vlog",
    mainImage: null,
    featuredImage: null,
  });

  assert.equal(
    imageMeta.url,
    `https://www.nicharalambous.com${DEFAULT_OG_IMAGE_PATH}`
  );
  assert.equal(imageMeta.url, "https://www.nicharalambous.com/og/home.png");
  assert.equal(imageMeta.width, 1200);
  assert.equal(imageMeta.height, 630);
  assert.equal(imageMeta.alt, "10 Things I Learned From Casey Neistat's Daily Vlog");
});
