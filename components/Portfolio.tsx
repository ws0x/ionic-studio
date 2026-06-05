"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { projects, projectFilters, type Project } from "@/lib/content";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

type Filter = Project["categoryKey"] | "all";

export function Portfolio({
  limit,
  showFilters = true,
  showViewAll = false,
}: {
  limit?: number;
  showFilters?: boolean;
  showViewAll?: boolean;
}) {
  const { t, locale } = useLocale();
  const [filter, setFilter] = useState<Filter>("all");

  const shown = useMemo(() => {
    const filtered =
      filter === "all" ? projects : projects.filter((p) => p.categoryKey === filter);
    return limit ? filtered.slice(0, limit) : filtered;
  }, [filter, limit]);

  return (
    <section id="work" className="bg-mist py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow={t("work.eyebrow")}
            title={t("work.title")}
          />

          {showFilters && (
            <Reveal className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {projectFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`cursor-pointer whitespace-nowrap rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                    filter === f.key
                      ? "border-ink bg-ink text-paper"
                      : "border-line bg-paper text-platinum hover:border-ink/30 hover:text-ink"
                  }`}
                >
                  {f.label[locale]}
                </button>
              ))}
            </Reveal>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => (
            <Reveal
              key={p.title.en}
              delay={(i % 3) * 60}
              as="article"
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink cursor-default"
            >
              <img
                src={p.image}
                alt={`${p.title.en}, luxury ${p.category.en.toLowerCase()} project by Ionic Design House`}
                loading="lazy"
                className="h-full w-full object-cover grayscale transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6 translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                <span className="inline-block rounded-full border border-paper/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-paper backdrop-blur-sm">
                  {p.category[locale]}
                </span>
                <h3 className="mt-3 text-xl font-bold text-paper">
                  {p.title[locale]}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-paper/65 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 21s7-6.4 7-11a7 7 0 10-14 0c0 4.6 7 11 7 11z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  {p.location[locale]}
                  {p.area && <span className="ms-2 border-s border-paper/30 ps-2">{p.area}</span>}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {showViewAll && (
          <Reveal className="mt-12 flex justify-center">
            <Link href="/projects" className="btn-secondary cursor-pointer">
              {t("work.viewAll")}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rtl:rotate-180">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
