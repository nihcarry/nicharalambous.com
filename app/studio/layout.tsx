/**
 * Studio layout — overrides the site chrome for /studio routes.
 *
 * The root layout always renders (Header, Footer, etc.) because
 * Next.js App Router doesn't allow skipping it. This layout positions
 * the Studio in a full-viewport fixed overlay so the site header/footer
 * are hidden behind it. The Studio then has full control.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sanity Studio",
  description: "Content management studio for nicharalambous.com",
  robots: { index: false, follow: false },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        backgroundColor: "#fff",
      }}
    >
      {children}
    </div>
  );
}
