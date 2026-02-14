/**
 * Site header with navigation.
 *
 * Persistent across all pages. Links follow the internal linking strategy:
 * /speaker is the primary CTA, prominently placed. Navigation includes
 * all key page types per the site architecture.
 */
"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/speaker", label: "Speaker" },
  { href: "/keynotes", label: "Keynotes" },
  { href: "/topics", label: "Topics" },
  { href: "/blog", label: "Blog" },
  { href: "/books", label: "Books" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-200 bg-surface/95 backdrop-blur-sm">
      <nav className="container-wide flex items-center justify-between py-4">
        {/* Logo / site name */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-brand-900"
        >
          Nic Haralambous
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-900"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-500"
          >
            Book Nic
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden p-2 text-brand-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-brand-200 bg-surface md:hidden">
          <div className="container-wide flex flex-col gap-4 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base font-medium text-brand-600 transition-colors hover:text-brand-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-2 rounded-lg bg-accent-600 px-4 py-3 text-center text-base font-semibold text-white transition-colors hover:bg-accent-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              Book Nic
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
