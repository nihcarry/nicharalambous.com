/** True when the asset is taller than it is wide. Missing dimensions stay on the landscape path. */
export function featuredImageIsPortrait(
  image:
    | {
        asset?: { width?: number | null; height?: number | null } | null;
      }
    | null
    | undefined
): boolean {
  const width = image?.asset?.width;
  const height = image?.asset?.height;
  return typeof width === "number" && typeof height === "number" && height > width;
}
