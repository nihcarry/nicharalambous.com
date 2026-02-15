/**
 * Site header with navigation.
 *
 * Zoom-style sticky bar: dark pill-shaped container, two rows (main nav with
 * icon+label, status/CTA row). Mobile: hamburger opens drawer with same layout.
 */
"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/speaker", label: "Speaker", icon: "mic", showChevron: true, isActive: true },
  { href: "/keynotes", label: "Keynotes", icon: "play", showChevron: true },
  { href: "/businesses", label: "Building", icon: "rocket", showChevron: true },
  { href: "/topics", label: "Topics", icon: "tag", showChevron: true },
  { href: "/blog", label: "Blog", icon: "document", showChevron: true },
  { href: "/books", label: "Books", icon: "book", showChevron: true },
  { href: "/about", label: "About", icon: "person", showChevron: true },
];

const iconClass = "h-4 w-4 shrink-0 text-nav-text";

function ChevronDown({ className }: { className?: string } = {}) {
  return (
    <svg className={className ?? "h-3 w-3 shrink-0 text-nav-text"} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function NavIcon({ name }: { name: string }) {
  switch (name) {
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
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex min-h-[34px] min-w-[34px] flex-col items-center justify-center gap-0.5 rounded px-1.5 py-2 text-nav-text transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-nav-bg"
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
        {showChevron && <ChevronDown />}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
}

/** Main nav row only — icon+label links with chevrons. Edit this separately from the status bar. */
function MainNav({ onNavClick }: { onNavClick?: () => void }) {
  return (
    <ul className="flex flex-nowrap items-center justify-evenly gap-2.5" style={{ padding: "5px" }} role="list">
      {navLinks.map((link) => (
        <li key={link.href}>
          <NavItem
            href={link.href}
            label={link.label}
            icon={link.icon}
            showChevron={link.showChevron}
            isActive={link.isActive}
            onClick={onNavClick}
          />
        </li>
      ))}
    </ul>
  );
}

/** Bottom status/CTA row — green left section, red right section. overflow-hidden clips to the pill shape. */
function NavStatusBar({ onNavClick }: { onNavClick?: () => void }) {
  return (
    <div className="flex w-fit flex-nowrap items-stretch overflow-hidden rounded-b-2xl">
      {/* Green section: caret, Book Nic, shield, Available */}
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
        {/* 2. Blue "Book Nic" */}
        <Link
          href="/contact"
          onClick={onNavClick}
          className="rounded-lg px-3 py-1.5 text-xs font-semibold leading-tight text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-nav-bg"
          style={{ backgroundColor: "var(--color-nav-blue)" }}
        >
          Book Nic
        </Link>
        {/* 3. Shield */}
        <span className="flex shrink-0 items-center justify-center text-[#374151]" aria-hidden>
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
          </svg>
        </span>
        {/* 4. Dark "Available" capsule */}
        <span className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-nav-bg px-2.5 py-1 text-xs font-medium leading-tight text-nav-text shadow-sm">
          <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span>Available</span>
          <ChevronDown className="h-3 w-3 shrink-0 text-nav-text" />
        </span>
      </div>
      {/* Red section: Contact */}
      <Link
        href="/contact"
        onClick={onNavClick}
        className="flex items-center gap-1.5 px-3 pt-0.5 pb-px text-xs font-semibold leading-tight text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-nav-bg"
        style={{ backgroundColor: "var(--color-nav-red)" }}
      >
        <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <rect width="10" height="10" x="7" y="7" rx="1" />
        </svg>
        Contact
      </Link>
    </div>
  );
}

function NavBarContent({ onNavClick }: { onNavClick?: () => void }) {
  return (
    <>
      <MainNav onNavClick={onNavClick} />
      <div className="flex justify-center border-t border-white/10">
        <NavStatusBar onNavClick={onNavClick} />
      </div>
    </>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex flex-col items-center px-3 pt-3">
      {/* Dark bar: width fits content only */}
      <div
        className="w-fit min-w-[480px] overflow-hidden rounded-2xl bg-nav-bg"
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}
      >
        {/* Desktop: main nav only */}
        <nav className="hidden md:block" aria-label="Main navigation">
          <MainNav />
        </nav>

        {/* Mobile: logo + hamburger row only */}
        <div className="flex items-center justify-between px-3 py-2 md:hidden">
          <Link
            href="/"
            className="text-base font-bold tracking-tight text-nav-text transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-nav-bg rounded-lg"
          >
            Nic Haralambous
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-nav-text transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-nav-bg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Status bar row: below dark bar, desktop only */}
      <div className="hidden md:flex justify-center border-t border-white/10">
        <NavStatusBar />
      </div>

      {/* Mobile drawer — Zoom-style layout */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-hidden
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <div
        className={`fixed inset-x-3 top-16 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto rounded-2xl bg-nav-bg transition-opacity md:hidden ${
          mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
      >
        {mobileMenuOpen && (
          <nav aria-label="Mobile navigation">
            <NavBarContent onNavClick={() => setMobileMenuOpen(false)} />
          </nav>
        )}
      </div>
    </header>
  );
}
