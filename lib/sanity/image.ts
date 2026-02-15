/**
 * Sanity image URL builder.
 *
 * Generates optimized image URLs via Sanity's image CDN.
 * Supports on-the-fly transforms: resize, crop, format (WebP/AVIF).
 *
 * Uses @sanity/image-url directly with project config to avoid
 * importing next-sanity's createClient, which registers server actions
 * incompatible with Next.js static export.
 */
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { projectId, dataset } from "./client";

const builder = imageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
