"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { projects as fallbackProjects, projectFilters, type Project } from "@/lib/content";
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
      filter === "all"
        ? projectList
        : projectList.filter((p) => {
            if (p.categoryKey === filter) return true;
            if (filter === "administration" && (p.categoryKey === "office" || p.categoryKey === "administration")) return true;
            if (filter === "fb" && (p.categoryKey === "hospitality" || p.categoryKey === "fb")) return true;
            if (filter === "retail" && (p.categoryKey === "commercial" || p.categoryKey === "retail")) return true;
            return false;
          });
    return limit ? filtered.slice(0, limit) : filtered;
  }, [filter, limit, projectList]);

  return (
    <section id="work" className="relative overflow-hidden bg-neutral-950 py-24 md:py-36 text-white">
      {/* Massive Architectural Watermark Backdrop */}
      <div className="pointer-events-none absolute -top-12 inset-x-0 select-none overflow-hidden text-center opacity-5">
        <span className="text-stroke-light font-bold uppercase tracking-tighter text-[15vw] leading-none whitespace-nowrap">
          PORTFOLIO PORTFOLIO
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between border-b border-white/10 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-2 w-2 bg-bronze" />
              <span className="text-xs font-bold uppercase tracking-widest text-bronze-light">
                {locale === "ar" ? "— أحدث مشاريعنا" : "— Latest projects"}
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white">
              {locale === "ar" ? "دراسات جدوى ومشاريع معمارية مختارة" : "Selected Case Studies"}
            </h2>
          </div>

          {showFilters && (
            <Reveal className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {projectFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`cursor-pointer whitespace-nowrap rounded-none border px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all ${
                    filter === f.key
                      ? "border-bronze bg-bronze text-black"
                      : "border-white/15 bg-white/[0.04] text-white/70 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {f.label[locale]}
                </button>
              ))}
            </Reveal>
          )}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => (
            <Reveal
              key={p.title.en}
              delay={(i % 3) * 60}
              as="article"
              onClick={() => setSelectedProject(p)}
              className="group relative aspect-[4/5] overflow-hidden rounded-none border border-white/10 bg-black cursor-pointer"
            >
              <Image
                src={p.image}
                alt={`${p.title.en}, luxury ${p.category.en.toLowerCase()} project by Ionic Studio`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover grayscale transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity group-hover:opacity-80" />

              <div className="absolute inset-x-0 bottom-0 p-7 translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                <span className="inline-block rounded-none border border-bronze/40 bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-bronze-light backdrop-blur-sm">
                  {p.category[locale]}
                </span>
                <h3 className="mt-3 text-xl font-bold uppercase tracking-wide text-white group-hover:text-bronze-light transition-colors">
                  {p.title[locale]}
                </h3>
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
                  <p className="flex items-center gap-1.5 text-xs text-white/70">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 21s7-6.4 7-11a7 7 0 10-14 0c0 4.6 7 11 7 11z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    {p.location[locale]}
                    {p.area && <span className="ms-2 border-s border-white/20 ps-2 font-mono">{p.area}</span>}
                  </p>

                  <Link
                    href={
                      p.title.en.includes("Villa")
                        ? "/simulate?project=villa-reception"
                        : p.title.en.includes("Penthouse")
                        ? "/simulate?project=penthouse-master"
                        : "/simulate?project=open-plan-kitchen"
                    }
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 rounded-none border border-white/20 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:border-bronze hover:bg-bronze hover:text-black"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-bronze animate-pulse" />
                    3D
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {showViewAll && (
          <div className="mt-16 text-center">
            <Link
              href="/projects"
              className="inline-flex h-12 items-center justify-center border border-white bg-transparent px-8 text-xs font-bold uppercase tracking-widest text-white transition-all hover:border-bronze hover:bg-bronze hover:text-black"
            >
              {t("work.viewAll")}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="ms-2 rtl:rotate-180">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        )}
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
