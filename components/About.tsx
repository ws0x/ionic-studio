"use client";

import Image from "next/image";
import { useLocale, type DictKey } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const features: DictKey[] = ["about.f1", "about.f2", "about.f3", "about.f4"];

export function About() {
  const { t } = useLocale();

  return (
    <section id="about" className="bg-paper py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-2">
        {/* Image */}
        <Reveal className="relative">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80"
              alt="Ionic Design House architecture studio interior"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover grayscale transition-transform duration-700 hover:scale-[1.02]"
            />
          </div>
          {/* Floating stat badge */}
          <div className="absolute -bottom-6 -end-0 rounded-2xl bg-ink px-6 py-5 text-paper lg:-end-8">
            <span className="font-display text-4xl font-bold leading-none">12+</span>
            <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-paper/60">{t("stats.years")}</p>
          </div>
          {/* Floating inset image */}
          <div className="absolute -top-6 -start-0 hidden h-36 w-36 overflow-hidden rounded-2xl border-4 border-paper shadow-2xl lg:-start-8 lg:block">
            <Image
              src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400&q=80"
              alt="Ionic Design House project detail"
              fill
              sizes="144px"
              className="object-cover grayscale"
            />
          </div>
        </Reveal>

        {/* Text */}
        <div>
          <SectionHeading
            eyebrow={t("about.eyebrow")}
            title={t("about.title")}
          />
          <Reveal className="mt-6 space-y-4">
            <p className="text-base leading-loose text-platinum">{t("about.body1")}</p>
            <p className="text-base leading-loose text-platinum">{t("about.body2")}</p>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features.map((f, i) => (
              <Reveal key={f} delay={i * 60} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span className="text-sm font-medium text-ink">{t(f)}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
