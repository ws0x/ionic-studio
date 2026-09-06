"use client";

import { useLocale } from "@/lib/i18n";
import { services } from "@/lib/content";
import { Reveal } from "./Reveal";

export function Services() {
  const { locale } = useLocale();

  return (
    <section id="services" className="relative overflow-hidden bg-black py-24 md:py-36 text-white border-t border-white/10">
      {/* Background Architectural Watermark */}
      <div className="pointer-events-none absolute -top-10 inset-x-0 select-none overflow-hidden text-center opacity-5">
        <span className="text-stroke-light font-bold uppercase tracking-tighter text-[15vw] leading-none whitespace-nowrap">
          SERVICES DISCIPLINES
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between border-b border-white/10 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-2 w-2 bg-bronze" />
              <span className="text-xs font-bold uppercase tracking-widest text-bronze-light">
                {locale === "ar" ? "— مجالات الاختصاص الهندسي" : "— Engineering Disciplines"}
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white leading-tight">
              {locale === "ar" ? "خدمات المقاولات العامة والتشطيبات الفاخرة" : "Turnkey Contracting & Fine Fit-Outs"}
            </h2>
          </div>
          <Reveal className="max-w-md">
            <p className="text-sm leading-relaxed text-white/60">
              <span className="font-serif italic text-bronze-light block mb-1">
                {locale === "ar" ? "مسؤولية متكاملة تحت إشراف هندسي موحد" : "Single-source engineering accountability"}
              </span>
              {locale === "ar"
                ? "فريق هندسي متخصص يتولى كل مرحلة بدقة واحترافية متناهية تضمن الالتزام بالجدول الزمني والمواصفات القياسية."
                : "A unified engineering command overseeing core structure, MEP systems, millwork, and final turnkey handover without subcontractor friction."}
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal
              key={i}
              delay={(i % 3) * 80}
              as="article"
              className="group relative flex flex-col bg-black p-8 sm:p-10 transition-all duration-500 hover:bg-neutral-900 cursor-default"
            >
              {/* Header row: Index & Icon */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold tracking-widest text-bronze-light">
                  {"0" + (i + 1) + " //"}
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-none border border-white/15 text-white/80 transition-all duration-500 group-hover:border-bronze group-hover:bg-bronze group-hover:text-black">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={s.icon} />
                  </svg>
                </span>
              </div>

              <h3 className="mt-8 text-lg font-bold uppercase tracking-wide text-white transition-colors group-hover:text-bronze-light">
                {s.title[locale]}
              </h3>

              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-white/60 transition-colors group-hover:text-white/80">
                {s.desc[locale]}
              </p>

              {/* Architectural accent corner */}
              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-[11px] uppercase tracking-wider text-white/40 group-hover:text-bronze-light transition-colors">
                <span>{locale === "ar" ? "معايير هندسية معتمدة" : "Certified Standards"}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="rtl:rotate-180 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

