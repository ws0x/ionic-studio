"use client";

import { useLocale } from "@/lib/i18n";
import { stats } from "@/lib/content";
import { Reveal } from "./Reveal";

export function Stats() {
  const { locale } = useLocale();
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-black text-white py-4">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 rtl:divide-x-reverse md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal
            key={i}
            delay={i * 70}
            className="flex flex-col items-center justify-center px-6 py-10 text-center sm:py-14 group transition-colors hover:bg-white/[0.02]"
          >
            <span className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white group-hover:text-bronze-light transition-colors">
              {s.value}
            </span>
            <span className="mt-3 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-white/50">
              {s.label[locale]}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

