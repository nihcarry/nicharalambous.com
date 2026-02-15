/**
 * Sanity Studio client component.
 *
 * Runs entirely in the browser. Connects directly to Sanity API.
 */
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity/sanity.config";

export default function StudioClient() {
  return (
    <NextStudio
      config={config}
      history="hash"
    />
  );
}
