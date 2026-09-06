"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { projects as fallbackProjects, projectFilters, type Project } from "@/lib/content";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { ProjectModal } from "./ProjectModal";

type Filter = Project["categoryKey"] | "all";

export function Portfolio({
  limit,
  showFilters = true,
  showViewAll = false,
  initialProjects,
}: {
  limit?: number;
  showFilters?: boolean;
  showViewAll?: boolean;
  initialProjects?: Project[];
}) {
  const { t, locale } = useLocale();
  const [filter, setFilter] = useState<Filter>("all");
  const [projectList, setProjectList] = useState<Project[]>(initialProjects || fallbackProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/content")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.projects && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjectList(data.projects);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const shown = useMemo(() => {
    const filtered =
      filter === "all" ? projectList : projectList.filter((p) => p.categoryKey === filter);
    return limit ? filtered.slice(0, limit) : filtered;
  }, [filter, limit, projectList]);

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
              onClick={() => setSelectedProject(p)}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink cursor-pointer"
            >
              <Image
                src={p.image}
                alt={`${p.title.en}, luxury ${p.category.en.toLowerCase()} project by Ionic Design House`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover grayscale transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6 translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                <span className="inline-block rounded-full border border-paper/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-paper backdrop-blur-sm">
                  {p.category[locale]}
                </span>
                <h3 className="mt-3 text-xl font-bold text-paper">
                  {p.title[locale]}
                </h3>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="flex items-center gap-1.5 text-xs text-paper/75">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 21s7-6.4 7-11a7 7 0 10-14 0c0 4.6 7 11 7 11z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    {p.location[locale]}
                    {p.area && <span className="ms-2 border-s border-paper/30 ps-2">{p.area}</span>}
                  </p>

                  <Link
                    href={
                      p.title.en.includes("Villa")
                        ? "/simulate?project=villa-reception"
                        : p.title.en.includes("Penthouse")
                        ? "/simulate?project=penthouse-master"
                        : p.categoryKey === "office"
                        ? "/simulate?project=corporate-office"
                        : "/simulate"
                    }
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 rounded-full bg-paper/20 px-2.5 py-1 text-[10px] font-semibold text-paper backdrop-blur-md transition-all hover:bg-paper hover:text-ink cursor-pointer"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
                    </svg>
                    <span>{t("work.simulateCTA")}</span>
                  </Link>
                </div>
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

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
