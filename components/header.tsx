/**
 * Site header with navigation.
 *
 * Desktop: Zoom-style sticky bar at top — dark pill-shaped container, two rows
 * (main nav with icon+label, status/CTA row with theme switcher).
 *
 * Mobile: Zoom-style bottom nav bar with Home, Speaker, Keynotes, More. Top-left
 * "Nic Haralambous" pill. More opens bottom sheet with secondary links and
 * status bar content.
 */
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";

const navLinks = [
  { href: "/", label: "Home", icon: "home", showChevron: false },
  { href: "/speaker", label: "Speaker", icon: "mic", showChevron: true },
  { href: "/keynotes", label: "Keynotes", icon: "play", showChevron: true },
  { href: "/topics", label: "Topics", icon: "tag", showChevron: true },
  { href: "/businesses", label: "Building", icon: "rocket", showChevron: true },
  { href: "/blog", label: "Blog", icon: "document", showChevron: true },
  { href: "/books", label: "Books", icon: "book", showChevron: true },
];

const iconClass = "h-4 w-4 shrink-0 text-nav-text";

function ChevronUp({ className }: { className?: string } = {}) {
  return (
    <svg className={className ?? "h-3 w-3 shrink-0 text-nav-text"} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
    </svg>
  );
}

function ChevronDown({ className }: { className?: string } = {}) {
  return (
    <svg className={className ?? "h-3 w-3 shrink-0 text-nav-text"} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function NavIcon({ name }: { name: string }) {
  switch (name) {
    case "home":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955a1.126 1.126 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      );
    case "mic":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
        </svg>
      );
    case "play":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
        </svg>
      );
    case "tag":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
        </svg>
      );
    case "document":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      );
    case "book":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
      );
    case "rocket":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
        </svg>
      );
    case "person":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      );
    case "search":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      );
    case "more":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
      );
    default:
      return null;
  }
}

function NavItem({
  href,
  label,
  icon,
  showChevron,
  isActive,
  onClick,
}: {
  href: string;
  label: string;
  icon: string;
  showChevron?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}) {
  const iconEl = <NavIcon name={icon} />;
  const className =
    "flex min-h-[34px] min-w-[34px] flex-col items-center justify-center gap-0.5 rounded px-1.5 py-2 text-nav-text transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-nav-bg";
  return (
    <a
      href={href}
      onClick={onClick}
      className={className}
    >
      <div className="flex items-center gap-0.5">
        {isActive ? (
          <span
            className="flex items-center justify-center rounded p-0.5 [&_svg]:text-white"
            style={{ backgroundColor: "var(--color-nav-green)" }}
          >
            {iconEl}
          </span>
        ) : (
          iconEl
        )}
        {showChevron && (isActive ? <ChevronDown /> : <ChevronUp />)}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </a>
  );
}

/** Check if a nav link is active for the current path. */
function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/** Routes that live inside the More overflow menu. Used to highlight More when active. */
const moreMenuRoutes = ["/businesses", "/topics", "/blog", "/books", "/contact", "/about", "/search"];

function isMoreMenuActive(pathname: string): boolean {
  return moreMenuRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

/** Mobile bottom nav — 4 items: Home, Speaker, Keynotes, More. Zoom-style: icon above label. */
const mobileNavLinks = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/speaker", label: "Speaker", icon: "mic" },
  { href: "/keynotes", label: "Keynotes", icon: "play" },
  { href: "more", label: "More", icon: "more", isButton: true },
];

/** Main nav row only — icon+label links with chevrons. */
function MainNav({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname();
  return (
    <ul className="flex flex-nowrap items-center justify-evenly gap-5" style={{ paddingTop: "2.5px", paddingBottom: "2.5px", paddingLeft: "12px", paddingRight: "12px" }} role="list">
      {navLinks.map((link) => (
        <li key={link.href}>
          <NavItem
            href={link.href}
            label={link.label}
            icon={link.icon}
            showChevron={link.showChevron}
            isActive={isNavLinkActive(pathname, link.href)}
            onClick={onNavClick}
          />
        </li>
      ))}
    </ul>
  );
}

/** Bottom status/CTA row — green left section, theme switcher right section. */
function NavStatusBar({
  onNavClick,
  variant = "default",
}: {
  onNavClick?: () => void;
  /** "compact" for vertical stack in More sheet on mobile */
  variant?: "default" | "compact";
}) {
  const pathname = usePathname();
  const isContactActive = isNavLinkActive(pathname, "/contact");
  const isAboutActive = isNavLinkActive(pathname, "/about");

  if (variant === "compact") {
    return (
      <div className="flex flex-col gap-2">
        <a
          href="/contact"
          onClick={onNavClick}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-nav-text transition-colors hover:bg-white/10"
          style={{ backgroundColor: "var(--color-nav-blue)" }}
        >
          <span className="text-xs font-semibold text-white">Book Nic</span>
          {isContactActive && <ChevronDown className="h-3 w-3 shrink-0 text-white" />}
        </a>
        <a
          href="/about"
          onClick={onNavClick}
          className="flex items-center gap-2 rounded-lg border border-white/15 bg-nav-bg/80 px-3 py-2 text-nav-text transition-colors hover:bg-white/10"
        >
          <NavIcon name="person" />
          <span className="text-xs font-medium">About Nic</span>
          {isAboutActive && <ChevronDown className="h-3 w-3 shrink-0 text-nav-text" />}
        </a>
        <div className="rounded-lg border border-white/15 px-3 py-2">
          <ThemeSwitcher />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-fit flex-nowrap items-stretch overflow-clip rounded-b-lg">
      {/* Green section: caret, Book Nic, shield, About Nic */}
      <div
        className="flex flex-nowrap items-center gap-2 pt-0.5 pb-px pl-3 pr-2"
        style={{ backgroundColor: "var(--color-nav-green)" }}
      >
        {/* 1. Upward caret */}
        <span className="flex shrink-0 items-center justify-center text-[#374151]" aria-hidden>
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75 12 8.25l7.5 7.5" />
          </svg>
        </span>
        {/* 2. Blue "Book Nic" — links to contact/booking page */}
        <a
          href="/contact"
          onClick={onNavClick}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold leading-tight text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-nav-bg"
          style={{ backgroundColor: "var(--color-nav-blue)" }}
        >
          Book Nic
          {isContactActive ? <ChevronDown className="h-3 w-3 shrink-0" /> : <ChevronUp className="h-3 w-3 shrink-0" />}
        </a>
        {/* 3. Shield */}
        <span className="flex shrink-0 items-center justify-center text-[#374151]" aria-hidden>
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
          </svg>
        </span>
        {/* 4. Dark "About Nic" capsule — clickable */}
        <a
          href="/about"
          onClick={onNavClick}
          className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-nav-bg px-2.5 py-1 text-xs font-medium leading-tight text-nav-text shadow-sm transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-nav-bg"
        >
          <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <span>About Nic</span>
          {isAboutActive ? <ChevronDown className="h-3 w-3 shrink-0 text-nav-text" /> : <ChevronUp className="h-3 w-3 shrink-0 text-nav-text" />}
        </a>
      </div>
      {/* Red section: Theme switcher (replaced Share) */}
      <div
        className="flex items-center px-3 pt-0.5 pb-px"
        style={{ backgroundColor: "var(--color-nav-red)" }}
      >
        <ThemeSwitcher />
      </div>
    </div>
  );
}

function NavBarContent({ onNavClick }: { onNavClick?: () => void }) {
  return (
    <>
      <MainNav onNavClick={onNavClick} />
      <div className="flex justify-center">
        <NavStatusBar onNavClick={onNavClick} />
      </div>
    </>
  );
}

/** Links shown in the More overflow menu. */
const moreMenuLinks = [
  { href: "/topics", label: "Topics", icon: "tag" },
  { href: "/businesses", label: "Building", icon: "rocket" },
  { href: "/blog", label: "Blog", icon: "document" },
  { href: "/books", label: "Books", icon: "book" },
  { href: "/search", label: "Search", icon: "search" },
];

/** More overflow sheet — secondary nav links + status bar (Book Nic, About Nic, theme). */
function MoreSheet({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 md:hidden"
        aria-hidden
        onClick={onClose}
      />
      {/* Sheet panel */}
      <div
        className="pointer-events-auto fixed inset-x-0 bottom-0 z-50 max-h-[70vh] overflow-y-auto rounded-t-2xl bg-nav-bg pb-[env(safe-area-inset-bottom)] md:hidden"
        style={{ boxShadow: "0 -4px 12px rgba(0,0,0,0.4)" }}
        role="dialog"
        aria-label="More menu"
        aria-modal="true"
      >
        <div className="px-4 py-4">
          {/* Secondary nav links */}
          <ul className="flex flex-col gap-1" role="list">
            {moreMenuLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-nav-text transition-colors hover:bg-white/10 ${
                    isNavLinkActive(pathname, link.href) ? "bg-white/10 font-medium" : ""
                  }`}
                >
                  <NavIcon name={link.icon} />
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
          {/* Status bar content (Book Nic, About Nic, theme) — compact vertical layout */}
          <div className="mt-4 border-t border-white/15 pt-4">
            <NavStatusBar onNavClick={onClose} variant="compact" />
          </div>
        </div>
      </div>
    </>
  );
}

export function Header() {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const pathname = usePathname();
  const desktopNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = desktopNavRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = (entry.target as HTMLElement).offsetHeight;
        document.documentElement.style.setProperty(
          "--header-clearance",
          `${height + 12}px`,
        );
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <header className="pointer-events-none fixed inset-0 z-50 flex flex-col bg-transparent">
      {/* Desktop: top bar + status row */}
      <div ref={desktopNavRef} className="pointer-events-auto flex flex-col items-center px-3 pt-3 md:flex">
        <div
          className="hidden w-fit min-w-[480px] overflow-clip rounded-2xl bg-nav-bg md:block"
          style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}
        >
          <nav aria-label="Main navigation">
            <MainNav />
          </nav>
        </div>
        <div className="hidden md:block">
          <NavStatusBar />
        </div>
      </div>

      {/* Mobile: bottom nav bar (Zoom-style, 4 items) */}
      <nav
        className="pointer-events-auto fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-white/10 bg-nav-bg md:hidden"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingTop: "0.75rem",
          minHeight: "var(--bottom-nav-height-mobile)",
        }}
        aria-label="Mobile navigation"
      >
        {mobileNavLinks.map((item) => {
          if (item.isButton) {
            const isActive = isMoreMenuActive(pathname);
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setMoreMenuOpen(true)}
                className={`flex flex-col items-center gap-0.5 rounded px-2 py-1 text-nav-text transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-nav-bg ${
                  isActive ? "text-white" : ""
                }`}
                aria-label="Open more menu"
                aria-expanded={moreMenuOpen}
              >
                <NavIcon name={item.icon} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          }
          const isActive = isNavLinkActive(pathname, item.href);
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 rounded px-2 py-1 text-nav-text transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-nav-bg ${
                isActive ? "text-white" : ""
              }`}
            >
              {isActive ? (
                <span
                  className="flex items-center justify-center rounded p-0.5 [&_svg]:text-white"
                  style={{ backgroundColor: "var(--color-nav-green)" }}
                >
                  <NavIcon name={item.icon} />
                </span>
              ) : (
                <NavIcon name={item.icon} />
              )}
              <span className="text-xs font-medium">{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* More overflow sheet */}
      {moreMenuOpen && <MoreSheet onClose={() => setMoreMenuOpen(false)} />}
    </header>
  );
}
