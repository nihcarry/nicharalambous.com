"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { OUTPUT_PARADOX_PATH, SOCIAL, bookOfferHref } from "@/lib/site";

const KEYNOTE_LINKS = [
  { href: OUTPUT_PARADOX_PATH, label: "The Output Paradox" },
  { href: `${OUTPUT_PARADOX_PATH}#formats`, label: "Virtual lunch and learn" },
  { href: `${OUTPUT_PARADOX_PATH}#formats`, label: "In-person keynotes" },
  { href: "/workshops", label: "Workshops" },
  { href: "/contact", label: "Enquire" },
];

const COACHING_LINKS = [
  { href: SOCIAL.nobullship, label: "No Bull Ship (8 weeks)", external: true },
  { href: "/coaching", label: "Accountability business coaching" },
];

const CONTENT_LINKS = [
  { href: "/#newsletter", label: "Newsletter" },
  { href: SOCIAL.youtube, label: "YouTube", external: true },
  { href: "/blog", label: "Blog" },
  { href: "/books", label: "Books" },
];

const ABOUT_LINKS = [
  { href: "/about", label: "About" },
  { href: "/media", label: "Media and press" },
];

type DropName = "keynotes" | "coaching" | "content" | "about";

function isKeynotes(pathname: string) {
  return pathname.startsWith("/keynotes") || pathname.startsWith("/workshops") || pathname === "/contact";
}

function isContent(pathname: string) {
  return pathname === "/blog" || pathname.startsWith("/blog/") || pathname === "/books" || pathname.startsWith("/books/");
}

function isCoaching(pathname: string) {
  return pathname === "/session" || pathname === "/coaching";
}

function isAbout(pathname: string) {
  return pathname === "/about" || pathname === "/media" || pathname.startsWith("/media/");
}

export function SiteNav() {
  const pathname = usePathname() || "/";
  const bookHref = bookOfferHref();
  const menuId = useId();
  const keynotesId = useId();
  const coachingId = useId();
  const contentId = useId();
  const aboutId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState<DropName | null>(null);
  const [mobileGroup, setMobileGroup] = useState<DropName | null>(null);

  useEffect(() => {
    setMenuOpen(false);
    setOpenDrop(null);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const panel = panelRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusable = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [],
      );

    focusable()[0]?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        burgerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = focusable();
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      if (!panel?.contains(document.activeElement)) previouslyFocused?.focus();
    };
  }, [menuOpen]);

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      const nav = document.querySelector(".site-nav");
      if (nav && !nav.contains(target)) setOpenDrop(null);
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  function dropPanelId(which: DropName) {
    if (which === "keynotes") return keynotesId;
    if (which === "coaching") return coachingId;
    if (which === "about") return aboutId;
    return contentId;
  }

  function onDropKey(event: React.KeyboardEvent<HTMLButtonElement>, which: DropName) {
    if (event.key === "Escape") {
      setOpenDrop(null);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpenDrop(which);
      document.getElementById(dropPanelId(which))?.querySelector("a")?.focus();
    }
  }

  return (
    <header className={`site-nav${menuOpen ? " is-open" : ""}`}>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <div className="wrap">
        <a className="wm" href="/">
          <img src="/favicon.svg" alt="" width={30} height={30} />
          Nic Haralambous
        </a>
        <ul className="links">
          <li className={`drop${openDrop === "keynotes" ? " is-open" : ""}${isKeynotes(pathname) ? " on" : ""}`}>
            <button
              type="button"
              className="item-btn"
              aria-expanded={openDrop === "keynotes"}
              aria-controls={keynotesId}
              onClick={() => setOpenDrop((current) => (current === "keynotes" ? null : "keynotes"))}
              onKeyDown={(event) => onDropKey(event, "keynotes")}
            >
              Keynotes <small aria-hidden="true">▾</small>
            </button>
            <div className="drop-panel" id={keynotesId} role="group" aria-label="Keynotes">
              {KEYNOTE_LINKS.map((link) => (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          </li>
          <li className={`drop${openDrop === "coaching" ? " is-open" : ""}${isCoaching(pathname) ? " on" : ""}`}>
            <button
              type="button"
              className="item-btn"
              aria-expanded={openDrop === "coaching"}
              aria-controls={coachingId}
              onClick={() => setOpenDrop((current) => (current === "coaching" ? null : "coaching"))}
              onKeyDown={(event) => onDropKey(event, "coaching")}
            >
              Coaching <small aria-hidden="true">▾</small>
            </button>
            <div className="drop-panel" id={coachingId} role="group" aria-label="Coaching">
              {COACHING_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...("external" in link && link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </li>
          <li className={`drop${openDrop === "content" ? " is-open" : ""}${isContent(pathname) ? " on" : ""}`}>
            <button
              type="button"
              className="item-btn"
              aria-expanded={openDrop === "content"}
              aria-controls={contentId}
              onClick={() => setOpenDrop((current) => (current === "content" ? null : "content"))}
              onKeyDown={(event) => onDropKey(event, "content")}
            >
              Content <small aria-hidden="true">▾</small>
            </button>
            <div className="drop-panel" id={contentId} role="group" aria-label="Content">
              {CONTENT_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...("external" in link && link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </li>
          <li className={`drop${openDrop === "about" ? " is-open" : ""}${isAbout(pathname) ? " on" : ""}`}>
            <button
              type="button"
              className="item-btn"
              aria-expanded={openDrop === "about"}
              aria-controls={aboutId}
              onClick={() => setOpenDrop((current) => (current === "about" ? null : "about"))}
              onKeyDown={(event) => onDropKey(event, "about")}
            >
              About <small aria-hidden="true">▾</small>
            </button>
            <div className="drop-panel" id={aboutId} role="group" aria-label="About">
              {ABOUT_LINKS.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          </li>
        </ul>
        <a className="btn" href={bookHref}>
          <span className="dt">Book a lunch and learn</span>
          <span className="mb">Book</span>
        </a>
        <button
          ref={burgerRef}
          type="button"
          className="burger"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
        </button>
      </div>
      <div
        ref={panelRef}
        id={menuId}
        className="menu-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <button
          type="button"
          className="acc"
          aria-expanded={mobileGroup === "keynotes"}
          onClick={() => setMobileGroup((current) => (current === "keynotes" ? null : "keynotes"))}
        >
          Keynotes
          <span className="caret" aria-hidden="true">{mobileGroup === "keynotes" ? "▴" : "▾"}</span>
        </button>
        {mobileGroup === "keynotes" ? (
          <div className="sub">
            {KEYNOTE_LINKS.map((link) => (
              <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
        <button
          type="button"
          className="acc"
          aria-expanded={mobileGroup === "coaching"}
          onClick={() => setMobileGroup((current) => (current === "coaching" ? null : "coaching"))}
        >
          Coaching
          <span className="caret" aria-hidden="true">{mobileGroup === "coaching" ? "▴" : "▾"}</span>
        </button>
        {mobileGroup === "coaching" ? (
          <div className="sub">
            {COACHING_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                {...("external" in link && link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
        <button
          type="button"
          className="acc"
          aria-expanded={mobileGroup === "content"}
          onClick={() => setMobileGroup((current) => (current === "content" ? null : "content"))}
        >
          Content
          <span className="caret" aria-hidden="true">{mobileGroup === "content" ? "▴" : "▾"}</span>
        </button>
        {mobileGroup === "content" ? (
          <div className="sub">
            {CONTENT_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                {...("external" in link && link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
        <button
          type="button"
          className="acc"
          aria-expanded={mobileGroup === "about"}
          onClick={() => setMobileGroup((current) => (current === "about" ? null : "about"))}
        >
          About
          <span className="caret" aria-hidden="true">{mobileGroup === "about" ? "▴" : "▾"}</span>
        </button>
        {mobileGroup === "about" ? (
          <div className="sub">
            {ABOUT_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
        <a href="/contact" onClick={() => setMenuOpen(false)}>
          Enquire
        </a>
      </div>
    </header>
  );
}
