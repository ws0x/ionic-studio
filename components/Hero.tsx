"use client";

import Image from "next/image";
import { useLocale } from "@/lib/i18n";
import { waLink } from "@/lib/site";

export function Hero() {
  const { t } = useLocale();

  return (
    <section
      id="top"
      className="grain relative flex min-h-screen items-end overflow-hidden bg-ink pb-20 pt-32"
    >
      {/* Background */}
      <Image
        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80"
        alt="Luxury interior design project by Ionic Design House"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-45 grayscale"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/60 to-ink/20" />

      {/* Vertical guides */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-y-0 start-5 w-px bg-paper/8 sm:start-8" />
        <div className="absolute inset-y-0 end-5 w-px bg-paper/8 sm:end-8" />
      </div>

      {/* Horizontal top accent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-paper/20 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <div className="eyebrow mb-8 text-paper/50" style={{ "--color-platinum": "rgba(255,255,255,0.4)" } as React.CSSProperties}>
            {t("hero.eyebrow")}
          </div>

          {/* Title */}
          <h1 className="font-display text-balance text-5xl font-bold leading-[1.02] text-paper sm:text-7xl md:text-8xl">
            {t("hero.title")}
          </h1>

          {/* Subtitle */}
          <p className="mt-7 max-w-2xl text-base leading-loose text-paper/65 sm:text-lg">
            {t("hero.subtitle")}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={waLink(t("cta.whatsappDefault"))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[3.25rem] cursor-pointer items-center gap-2 rounded-full bg-paper px-8 text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-ink transition-all hover:-translate-y-px hover:shadow-xl"
            >
              {t("hero.ctaPrimary")}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="rtl:rotate-180">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="/projects" className="btn-ghost cursor-pointer">
              {t("hero.ctaSecondary")}
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-0 end-8 flex flex-col items-center gap-3 pb-8 opacity-40">
          <span className="text-[10px] uppercase tracking-[0.25em] text-paper" style={{ writingMode: "vertical-rl" }}>
            Scroll
          </span>
          <span className="h-12 w-px bg-paper/60" />
        </div>
      </div>
    </section>
  );
}
