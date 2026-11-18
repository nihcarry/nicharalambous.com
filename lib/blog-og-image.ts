/**
 * Open Graph / Twitter image for a blog post.
 *
 * The article template renders featuredImage as the hero. Some posts also
 * store the same asset on mainImage. Share cards use mainImage when it has
 * an asset, then featuredImage, then the site default at /og/home.png.
 */
import type { BlogHeroImage } from "./sanity/queries";
import { urlFor } from "./sanity/image";
import { SITE_URL } from "./site";

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/** Same default the root layout already emits for pages without their own image. */
export const DEFAULT_OG_IMAGE_PATH = "/og/home.png";

export interface ShareImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

function assetRef(image: BlogHeroImage | null | undefined): string | null {
  const id = image?.asset?._id;
  if (id && id.startsWith("image-")) return id;

  const url = image?.asset?.url;
  if (!url) return null;
  const file = url.split("?")[0]?.split("/").pop();
  if (!file || !file.includes(".")) return null;
  return `image-${file}`.replace(/\.([a-z0-9]+)$/i, "-$1");
}

function heroImage(
  post: {
    mainImage?: BlogHeroImage | null;
    featuredImage?: BlogHeroImage | null;
  }
): BlogHeroImage | null {
  if (assetRef(post.mainImage)) return post.mainImage ?? null;
  if (assetRef(post.featuredImage)) return post.featuredImage ?? null;
  return null;
}

/** 1200×630 share image for a post, or the site default when it has no hero. */
export function blogShareImage(post: {
  title: string;
  mainImage?: BlogHeroImage | null;
  featuredImage?: BlogHeroImage | null;
}): ShareImage {
  const hero = heroImage(post);
  const alt = hero?.alt?.trim() || post.title.trim() || "Nic Haralambous";

  const ref = assetRef(hero);
  if (!hero || !ref) {
    return {
      url: `${SITE_URL}${DEFAULT_OG_IMAGE_PATH}`,
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      alt,
    };
  }

  const url = urlFor({
    asset: { _ref: ref },
    ...(hero.crop ? { crop: hero.crop } : {}),
    ...(hero.hotspot ? { hotspot: hero.hotspot } : {}),
  })
    .width(OG_IMAGE_WIDTH)
    .height(OG_IMAGE_HEIGHT)
    .fit("crop")
    .url();

  return {
    url,
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    alt,
  };
}
