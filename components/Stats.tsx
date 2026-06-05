"use client";

import { useLocale } from "@/lib/i18n";
import { stats } from "@/lib/content";
import { Reveal } from "./Reveal";

export function Stats() {
  const { locale } = useLocale();
  return (
    <section className="border-y border-line bg-off-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-line rtl:divide-x-reverse md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal
            key={i}
            delay={i * 70}
            className="flex flex-col items-center justify-center px-4 py-12 text-center md:py-16"
          >
            <span className="font-display text-5xl font-bold tracking-tight text-ink md:text-6xl">
              {s.value}
            </span>
            <span className="mt-3 text-xs font-medium uppercase tracking-[0.15em] text-platinum">
              {s.label[locale]}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
