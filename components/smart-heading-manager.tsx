"use client";

/**
 * Smart heading manager for sitewide H1/H2 orphan control.
 *
 * Applies a bounded font-size step-down when the final heading line is too short
 * (single-word / punctuation-like orphan). Navigation headings are excluded.
 */
import { useEffect } from "react";

const MANAGED_SELECTOR = "h1, h2";
const ORIGINAL_SIZE_KEY = "data-smart-heading-original-size";
const ORIGINAL_TEXT_KEY = "data-smart-heading-original-text";

function isInNav(el: Element): boolean {
  return Boolean(el.closest("nav") || el.closest("header"));
}

function getLineRects(el: HTMLElement): DOMRect[] {
  const range = document.createRange();
  range.selectNodeContents(el);
  const raw = Array.from(range.getClientRects());

  // Collapse fragment rects into one representative rect per visual line.
  const grouped: DOMRect[] = [];
  for (const rect of raw) {
    const last = grouped[grouped.length - 1];
    if (!last || Math.abs(last.top - rect.top) > 1) {
      grouped.push(rect);
    } else if (rect.width > last.width) {
      grouped[grouped.length - 1] = rect;
    }
  }
  return grouped;
}

function shouldShrink(el: HTMLElement): boolean {
  const lines = getLineRects(el);
  if (lines.length < 2) return false;

  const style = window.getComputedStyle(el);
  const fontSize = Number.parseFloat(style.fontSize || "0");
  const containerWidth = el.clientWidth || lines[0]?.width || 0;
  const lastLineWidth = lines[lines.length - 1]?.width ?? 0;
  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  // Mobile policy is softer: only shrink clearly orphaned final lines.
  const widthRatioThreshold = isMobile ? 0.12 : 0.2;
  const pxThreshold = isMobile ? fontSize * 2.25 : fontSize * 3;
  const threshold = Math.max(pxThreshold, containerWidth * widthRatioThreshold);
  return lastLineWidth > 0 && lastLineWidth <= threshold;
}

function fitHeading(el: HTMLElement): void {
  if (isInNav(el)) return;
  if (el.dataset.noOrphanOptOut === "true") return;

  const computed = window.getComputedStyle(el);

  // Keep last two words together for plain-text headings.
  if (el.children.length === 0) {
    const originalText = el.getAttribute(ORIGINAL_TEXT_KEY) ?? el.textContent ?? "";
    if (!el.getAttribute(ORIGINAL_TEXT_KEY)) {
      el.setAttribute(ORIGINAL_TEXT_KEY, originalText);
    }
    const tightened = originalText.replace(/\s+([^\s]+)\s+([^\s]+)\s*$/, " $1\u00A0$2");
    if (tightened !== originalText) {
      el.textContent = tightened;
    }
  }

  const originalSize = Number.parseFloat(
    el.getAttribute(ORIGINAL_SIZE_KEY) ?? computed.fontSize ?? "0",
  );
  if (!Number.isFinite(originalSize) || originalSize <= 0) return;

  el.setAttribute(ORIGINAL_SIZE_KEY, String(originalSize));
  el.style.fontSize = `${originalSize}px`;

  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const minRatio = isMobile ? 0.92 : 0.88;
  const step = isMobile ? 0.5 : 1;
  const minSize = originalSize * minRatio;

  let size = originalSize;
  while (size > minSize && shouldShrink(el)) {
    size -= step;
    el.style.fontSize = `${size}px`;
  }
}

function applySmartHeadingSizing(): void {
  const headings = Array.from(document.querySelectorAll<HTMLElement>(MANAGED_SELECTOR));
  headings.forEach(fitHeading);
}

export function SmartHeadingManager() {
  useEffect(() => {
    let frameId = 0;
    const schedule = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(applySmartHeadingSizing);
    };

    schedule();
    window.addEventListener("resize", schedule);

    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(document.body);

    const mutationObserver = new MutationObserver(schedule);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", schedule);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
