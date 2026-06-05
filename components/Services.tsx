"use client";

import { useLocale } from "@/lib/i18n";
import { services } from "@/lib/content";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

export function Services() {
  const { t, locale } = useLocale();

  return (
    <section id="services" className="bg-paper py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow={t("services.eyebrow")}
            title={t("services.title")}
          />
          <Reveal className="max-w-xs">
            <p className="text-sm leading-relaxed text-platinum">{t("services.subtitle")}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal
              key={i}
              delay={(i % 3) * 80}
              as="article"
              className="group relative flex flex-col bg-paper p-8 transition-colors duration-500 hover:bg-ink cursor-default"
            >
              {/* Icon */}
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-all duration-500 group-hover:border-paper/20 group-hover:text-paper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={s.icon} />
                </svg>
              </span>

              {/* Index */}
              <span className="mt-6 text-[10px] font-semibold tracking-[0.2em] text-silver transition-colors duration-500 group-hover:text-paper/30">
                0{i + 1}
              </span>

              <h3 className="mt-2 text-base font-semibold text-ink transition-colors duration-500 group-hover:text-paper">
                {s.title[locale]}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-platinum transition-colors duration-500 group-hover:text-paper/65">
                {s.desc[locale]}
              </p>

              {/* Arrow on hover */}
              <span className="mt-6 flex items-center gap-1.5 text-xs font-medium text-silver opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:text-paper/50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rtl:rotate-180">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
