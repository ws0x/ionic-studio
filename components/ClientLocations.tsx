"use client";

import { useLocale } from "@/lib/i18n";
import { primeLocations } from "@/lib/content";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

export function ClientLocations() {
  const { t, locale } = useLocale();

  return (
    <section className="border-b border-line bg-mist/60 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={t("locations.eyebrow")}
          title={t("locations.title")}
          subtitle={t("locations.subtitle")}
          align="center"
        />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {primeLocations.map((loc, i) => (
            <Reveal
              key={loc.name.en}
              delay={i * 80}
              as="div"
              className="group relative flex flex-col justify-between rounded-2xl border border-line bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:border-ink hover:shadow-xl hover:shadow-ink/5"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-platinum">
                  0{i + 1}
                </span>
                <h3 className="mt-3 font-display text-xl font-bold text-ink transition-colors group-hover:text-ink">
                  {loc.name[locale]}
                </h3>
                <p className="mt-1 text-xs font-medium text-platinum">
                  {loc.district[locale]}
                </p>
              </div>

              <div className="mt-6 border-t border-line/60 pt-4">
                <p className="text-[11px] leading-relaxed text-ink/70">
                  {loc.compounds[locale]}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
