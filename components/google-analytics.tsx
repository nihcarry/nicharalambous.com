"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const GA_MEASUREMENT_ID = "G-BDW5JXFX8Y";

/**
 * Google Analytics 4 (gtag.js) component.
 * Loads on every page via the root layout. Uses next/script for optimal
 * loading without blocking page rendering. Excludes /studio (Sanity CMS) from tracking.
 */
export function GoogleAnalytics() {
  const pathname = usePathname();

  if (pathname?.startsWith("/studio")) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onError={(e) => {
          // Script load failures (e.g. ad blocker) pass an Event; swallowing here
          // prevents "[object Event]" from bubbling to Next.js error overlay.
          if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
            console.warn("Google Analytics script failed to load (may be blocked)", e instanceof Error ? e.message : "script load error");
          }
        }}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');

          document.addEventListener('click', function(e) {
            var link = e.target.closest('a[href*="/contact"], a[href*="/speaker"]');
            if (!link) return;
            var href = link.getAttribute('href');
            var text = link.textContent.trim().substring(0, 50);
            gtag('event', 'cta_click', {
              event_category: 'engagement',
              event_label: text + ' \\u2192 ' + href
            });
          });
        `}
      </Script>
    </>
  );
}
