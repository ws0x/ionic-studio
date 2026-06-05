"use client";

import { useLocale } from "@/lib/i18n";
import { site, waLink } from "@/lib/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

export function Contact() {
  const { t, locale } = useLocale();

  return (
    <section id="contact" className="bg-paper py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">

          {/* Left */}
          <div>
            <SectionHeading eyebrow={t("contact.eyebrow")} title={t("contact.title")} />

            <div className="mt-10 space-y-5">
              <InfoRow label={t("contact.phone")} href={`tel:${site.phone1.replace(/\s/g, "")}`} icon="M3 5a2 2 0 012-2h2l2 5-2 1a11 11 0 005 5l1-2 5 2v2a2 2 0 01-2 2A16 16 0 013 5z">
                <span dir="ltr" className="font-semibold">{site.phone1}</span>
              </InfoRow>
              <InfoRow label={`${t("contact.phone")} 2`} href={`tel:${site.phone2.replace(/\s/g, "")}`} icon="M3 5a2 2 0 012-2h2l2 5-2 1a11 11 0 005 5l1-2 5 2v2a2 2 0 01-2 2A16 16 0 013 5z">
                <span dir="ltr" className="font-semibold">{site.phone2}</span>
              </InfoRow>
              <InfoRow label={t("contact.email")} href={`mailto:${site.email}`} icon="M3 7l9 6 9-6M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7a2 2 0 012-2h14a2 2 0 012 2">
                <span className="font-semibold">{site.email}</span>
              </InfoRow>
              <InfoRow label={t("contact.address")} icon="M12 21s7-6.4 7-11a7 7 0 10-14 0c0 4.6 7 11 7 11z">
                <span className="font-semibold">{site.address[locale]}</span>
              </InfoRow>
              <InfoRow label={t("contact.hours")} icon="M12 8v4l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                <span className="font-semibold">{site.hours[locale]}</span>
              </InfoRow>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={waLink(t("cta.whatsappDefault"))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary btn-mobile-lg flex-1 justify-center cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 00-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1012 2z" />
                </svg>
                {t("contact.whatsapp")}
              </a>
              <a
                href={`tel:${site.phone1.replace(/\s/g, "")}`}
                className="btn-secondary btn-mobile-lg flex-1 justify-center cursor-pointer"
              >
                {t("contact.call")}
              </a>
            </div>
          </div>

          {/* Right — decorative panel */}
          <Reveal className="relative min-h-80 overflow-hidden rounded-3xl bg-ink">
            <img
              src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=900&q=80"
              alt="Ionic Design House studio"
              loading="lazy"
              className="h-full w-full object-cover opacity-40 grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-ink/70 to-ink/30" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-paper">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-paper/20 bg-paper/5 backdrop-blur-sm">
                <span className="font-display text-2xl font-bold text-paper">I</span>
              </span>
              <p className="mt-5 font-display text-2xl font-bold">{site.name[locale]}</p>
              <p className="mt-2 text-sm text-paper/60">{site.tagline[locale]}</p>
              <div className="mt-6 flex gap-4">
                <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 text-paper/70 transition-colors hover:bg-paper/10 cursor-pointer">
                  <InstagramIcon />
                </a>
                <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 text-paper/70 transition-colors hover:bg-paper/10 cursor-pointer">
                  <FacebookIcon />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ label, href, icon, children }: {
  label: string;
  href?: string;
  icon: string;
  children: React.ReactNode;
}) {
  const inner = (
    <div className="flex items-start gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-platinum">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d={icon} />
        </svg>
      </span>
      <div>
        <div className="text-[11px] uppercase tracking-[0.12em] text-platinum mb-1">{label}</div>
        <div className="text-sm text-ink">{children}</div>
      </div>
    </div>
  );
  return href
    ? <a href={href} className="block transition-opacity hover:opacity-70 cursor-pointer">{inner}</a>
    : <div>{inner}</div>;
}
