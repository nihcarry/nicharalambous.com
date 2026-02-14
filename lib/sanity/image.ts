/**
 * Sanity image URL builder.
 *
 * Generates optimized image URLs via Sanity's image CDN.
 * Supports on-the-fly transforms: resize, crop, format (WebP/AVIF).
 */
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "./client";

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
