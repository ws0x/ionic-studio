"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { site, waLink } from "@/lib/site";

const corporateNav = [
  { href: "/",             key: "nav.home",        en: "Home",             ar: "الرئيسية" },
  { href: "/about",        key: "nav.about",       en: "About",            ar: "عن الشركة" },
  { href: "/team",         key: "nav.team",        en: "Leadership Team",  ar: "فريق القيادة" },
  { href: "/projects",     key: "nav.projects",    en: "Projects",         ar: "المشاريع" },
  { href: "/testimonials", key: "nav.testimonials",en: "Clients & Reviews",ar: "العملاء والآراء" },
  { href: "/track",        key: "nav.track",       en: "Track Project",    ar: "متابعة المشروع" },
  { href: "/#contact",     key: "nav.contact",     en: "Contact",          ar: "اتصل بنا" },
] as const;

const sectors = [
  { href: "/projects?sector=administration", en: "Administration & Offices", ar: "المقرات الإدارية والشركات" },
  { href: "/projects?sector=fb",             en: "High-End F&B & Cafes",     ar: "المطاعم والمقاهي الراقية" },
  { href: "/projects?sector=retail",         en: "Flagship Retail & Malls",  ar: "المتاجر والمعارض التجارية" },
  { href: "/projects?sector=residential",    en: "Luxury Villas & Estates",  ar: "الفيلات والقصور الفاخرة" },
] as const;

function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

export function Footer() {
  const { locale } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-white border-t border-white/10 font-sans">
      {/* Upper Grid Area */}
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-12 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          
          {/* Col 1: Corporate Identity (5 cols on lg) */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="group inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center border border-white/30 bg-white/5 font-mono text-sm font-bold text-white transition-colors group-hover:border-bronze group-hover:text-bronze">
                I
              </span>
              <div>
                <span className="font-bold uppercase tracking-wider text-base block text-white">
                  {site.name[locale]}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-bronze-light block">
                  {locale === "ar" ? "مقاولات عامة وتشطيبات متكاملة" : "General Contracting & Fit-Out"}
                </span>
              </div>
            </Link>

            <p className="text-xs text-white/60 leading-relaxed max-w-sm">
              {locale === "ar"
                ? "شركة متخصصة في التشطيبات المعمارية والمقاولات المتكاملة لكبرى المشروعات الإدارية، التجارية، والمطاعم الفاخرة في مصر والشرق الأوسط."
                : "Full-scope turnkey general contracting and interior architecture studio executing flagship corporate, retail, and hospitality destinations across Egypt."}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center border border-white/20 text-white/70 transition-colors hover:border-bronze hover:text-bronze"
              >
                <InstagramIcon />
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center border border-white/20 text-white/70 transition-colors hover:border-bronze hover:text-bronze"
              >
                <FacebookIcon />
              </a>
              <a
                href={waLink("Inquiry from Website Footer")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center border border-emerald-500/40 text-emerald-400 transition-colors hover:border-emerald-500 hover:bg-emerald-500/10"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 00-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1012 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-bronze-light mb-5">
              {locale === "ar" ? "التنقل السريع" : "Navigation"}
            </h4>
            <ul className="space-y-3">
              {corporateNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-xs text-white/60 hover:text-white transition-colors uppercase tracking-wider block"
                  >
                    {locale === "ar" ? item.ar : item.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Sectors (3 cols on lg) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-bronze-light mb-5">
              {locale === "ar" ? "قطاعات الأعمال" : "Core Sectors"}
            </h4>
            <ul className="space-y-3">
              {sectors.map((sector) => (
                <li key={sector.href}>
                  <Link
                    href={sector.href}
                    className="text-xs text-white/60 hover:text-white transition-colors uppercase tracking-wider block"
                  >
                    {locale === "ar" ? sector.ar : sector.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Cairo Executive Hub (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-bronze-light mb-5">
              {locale === "ar" ? "المقر الرئيسي" : "Cairo Executive HQ"}
            </h4>
            
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1">
                {locale === "ar" ? "العنوان" : "Location"}
              </span>
              <p className="text-xs text-white/80 leading-relaxed">
                B11 Mindhaus Campus, District 5, Marakez, New Kattameya, Cairo, Egypt
              </p>
            </div>

            <div className="pt-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1">
                {locale === "ar" ? "الاتصال المباشر" : "Direct Lines"}
              </span>
              <div className="space-y-1 font-mono text-xs text-white/80">
                <a href="tel:+201060965845" dir="ltr" className="block hover:text-bronze transition-colors">
                  +20 106 096 5845
                </a>
                <a href="tel:+201060483860" dir="ltr" className="block hover:text-bronze transition-colors">
                  +20 106 048 3860
                </a>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1">
                {locale === "ar" ? "البريد الإلكتروني" : "Email"}
              </span>
              <a href="mailto:info@ionicdesignhouse.com" className="font-mono text-xs text-bronze-light hover:underline">
                info@ionicdesignhouse.com
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-4 text-xs sm:flex-row sm:items-center sm:justify-between text-white/50">
            <span>
              © {year} {site.name[locale]}. {locale === "ar" ? "جميع الحقوق محفوظة." : "All Rights Reserved."}
            </span>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
              <span className="text-[11px] uppercase tracking-wider text-white/40">
                {locale === "ar" ? "أعلى معايير الجودة الإنشائية والهندسية" : "Engineering Quality & Execution"}
              </span>
              <a
                href="https://www.binhakim.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-white/60 transition-colors hover:text-white"
              >
                <span className="text-white/40">
                  {locale === "ar" ? "صُمّم وطُوِّر بواسطة" : "Built by"}
                </span>
                <span className="font-semibold tracking-wide text-white">binhakim.dev</span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-50 transition-opacity group-hover:opacity-100 rtl:rotate-[270deg]"
                >
                  <path d="M7 17L17 7M7 7h10v10" />
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
