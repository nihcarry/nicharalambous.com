import type { NextConfig } from "next";

/**
 * Next.js configuration for nicharalambous.com
 *
 * Static export mode — generates fully static HTML at build time.
 * No Node.js runtime, no ISR, no server. Deployed to S3 + CloudFront.
 *
 * Sanity Studio is excluded from static export and runs client-side only.
 */
const nextConfig: NextConfig = {
  output: "export",

  // Generate clean URLs without trailing slashes
  trailingSlash: false,

  // Optimize images for static export using Sanity's image CDN
  images: {
    unoptimized: true,
  },

  // Suppress lockfile warning — project lockfile is the correct one
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
