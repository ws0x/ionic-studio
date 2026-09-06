"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n";
import { site, waLink } from "@/lib/site";

const links = [
  { href: "/",             key: "nav.home" },
  { href: "/projects",     key: "nav.projects" },
  { href: "/founders",     key: "nav.founders" },
  { href: "/testimonials", key: "nav.testimonials" },
  { href: "/#contact",     key: "nav.contact" },
  { href: "/simulate",     key: "nav.simulate" },
  { href: "/track",        key: "nav.track" },
] as const;

export function Nav() {
  const { t, locale, toggle } = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) => {
    if (href.includes("#")) return false; // scroll anchors are never page-active
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-light border-b border-line" : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 md:h-20">

        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3 cursor-pointer" onClick={() => setOpen(false)}>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink sm:h-12 sm:w-12">
            <span className="font-display text-base font-bold text-paper sm:text-lg">I</span>
          </span>
          <span className={`text-base font-semibold tracking-wide transition-colors sm:text-lg ${scrolled ? "text-ink" : "text-paper"}`}>
            {site.name[locale]}
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            l.href === "/simulate" ? (
              <Link
                key={l.href}
                href={l.href}
                className={`relative flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.12em] transition-colors cursor-pointer ${
                  scrolled ? "text-ink" : "text-paper/80"
                } hover:opacity-100 ${isActive(l.href) ? "opacity-100" : "opacity-60"}`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                </svg>
                {t(l.key)}
                {isActive(l.href) && (
                  <span className={`absolute -bottom-1 inset-x-0 h-px ${scrolled ? "bg-ink" : "bg-paper"}`} />
                )}
              </Link>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                className={`relative text-xs font-medium uppercase tracking-[0.12em] transition-colors cursor-pointer ${
                  scrolled ? "text-ink" : "text-paper/80"
                } hover:opacity-100 ${isActive(l.href) ? "opacity-100" : "opacity-60"}`}
              >
                {t(l.key)}
                {isActive(l.href) && (
                  <span className={`absolute -bottom-1 inset-x-0 h-px ${scrolled ? "bg-ink" : "bg-paper"}`} />
                )}
              </Link>
            )
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={toggle}
            aria-label="Switch language"
            className={`flex h-8 items-center rounded-full border px-3 text-[11px] font-semibold tracking-widest transition-colors cursor-pointer ${
              scrolled
                ? "border-line text-ink hover:bg-ink hover:text-paper hover:border-ink"
                : "border-paper/30 text-paper hover:bg-paper hover:text-ink"
            }`}
          >
            {locale === "ar" ? "EN" : "ع"}
          </button>

          {/* CTA */}
          <a
            href={waLink(t("cta.whatsappDefault"))}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden h-9 items-center rounded-full px-5 text-[11px] font-semibold tracking-widest uppercase transition-all cursor-pointer sm:flex ${
              scrolled
                ? "bg-ink text-paper hover:shadow-lg hover:shadow-ink/20 hover:-translate-y-px"
                : "bg-paper text-ink hover:shadow-lg hover:-translate-y-px"
            }`}
          >
            {t("nav.quote")}
          </a>

          {/* Burger */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 lg:hidden cursor-pointer"
          >
            <span className={`block h-px w-5 transition-all duration-300 ${open ? "translate-y-[5px] rotate-45" : ""} ${scrolled ? "bg-ink" : "bg-paper"}`} />
            <span className={`block h-px w-5 transition-all duration-300 ${open ? "opacity-0" : ""} ${scrolled ? "bg-ink" : "bg-paper"}`} />
            <span className={`block h-px w-5 transition-all duration-300 ${open ? "-translate-y-[5px] -rotate-45" : ""} ${scrolled ? "bg-ink" : "bg-paper"}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-nav-menu"
        role="region"
        aria-label="Mobile Navigation Menu"
        className={`overflow-hidden bg-paper transition-[max-height] duration-500 lg:hidden ${open ? "max-h-screen border-b border-line" : "max-h-0"}`}
      >
        <div className="flex flex-col px-5 py-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`border-b border-line/50 py-4 text-sm uppercase tracking-[0.12em] font-medium cursor-pointer ${isActive(l.href) ? "text-ink" : "text-platinum"}`}
            >
              {t(l.key)}
            </Link>
          ))}
          <a
            href={waLink(t("cta.whatsappDefault"))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-5 justify-center cursor-pointer"
          >
            {t("nav.quote")}
          </a>
        </div>
      </div>
    </header>
  );
}
