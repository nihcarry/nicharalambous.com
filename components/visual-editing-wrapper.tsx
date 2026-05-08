"use client";

import { enableVisualEditing } from "@sanity/visual-editing";
import { useEffect } from "react";

export function VisualEditingWrapper() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const cleanup = enableVisualEditing();
    return () => cleanup();
  }, []);

  return null;
}
