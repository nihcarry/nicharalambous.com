import type { NextConfig } from "next";
import path from "path";

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

  // Use project root so Next.js doesn't infer parent dir (multiple lockfiles warning / broken dev)
  outputFileTracingRoot: path.resolve(process.cwd()),


  // Generate clean URLs without trailing slashes
  trailingSlash: false,

  // Optimize images for static export using Sanity's image CDN
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
