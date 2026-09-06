"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import type { Project } from "@/lib/content";
import { PanoramaViewer } from "@/components/viewer/PanoramaViewer";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { locale, tx } = useLocale();
  const [show360Tour, setShow360Tour] = useState(false);


  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-ink/80 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Container */}
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-line-dark bg-paper shadow-2xl transition-all duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label={tx({ ar: "إغلاق النافذة", en: "Close modal" })}
          className="absolute end-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-ink/60 text-paper backdrop-blur-md transition-colors hover:bg-ink cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="overflow-y-auto">
          {/* Hero Image */}
          <div className="relative aspect-[16/9] w-full bg-ink sm:aspect-[21/9]">
            <Image
              src={project.image}
              alt={project.title[locale]}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/20 to-transparent" />
          </div>

          {/* Modal Content */}
          <div className="px-6 pb-8 pt-4 sm:px-10 sm:pb-10">
            {/* Category & Location Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-ink px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-paper">
                {project.category[locale]}
              </span>
              <span className="rounded-full border border-line bg-mist px-3 py-1 text-[11px] font-medium text-ink">
                {project.location[locale]}
              </span>
              {project.area && (
                <span className="rounded-full border border-line bg-mist px-3 py-1 text-[11px] font-medium text-ink">
                  {project.area}
                </span>
              )}
              {project.year && (
                <span className="rounded-full border border-line bg-mist px-3 py-1 text-[11px] font-medium text-platinum">
                  {project.year}
                </span>
              )}
            </div>

            {/* Title */}
            <h2
              id="modal-project-title"
              className="mt-4 font-display text-3xl font-bold text-ink sm:text-4xl"
            >
              {project.title[locale]}
            </h2>

            {/* Description */}
            <p className="mt-4 text-base leading-relaxed text-platinum">
              {project.desc[locale]}
            </p>

            {/* Scope of work */}
            {project.scope && (
              <div className="mt-6 rounded-2xl border border-line bg-mist/60 p-4 sm:p-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-platinum">
                  {tx({ ar: "نطاق العمل والتنفيذ", en: "Scope of Work" })}
                </span>
                <p className="mt-1 text-sm font-semibold text-ink">
                  {project.scope[locale]}
                </p>
              </div>
            )}

            {/* Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <div className="mt-6">
                <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-platinum">
                  {tx({ ar: "أبرز المواصفات الهندسية", en: "Engineering & Finishing Highlights" })}
                </h4>
                <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {project.highlights.map((h, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs font-medium text-ink">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </span>
                      <span>{h[locale]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => setShow360Tour(true)}
                className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 px-4 py-3 text-xs font-bold transition shadow-md cursor-pointer"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3.6 9h16.8M3.6 15h16.8" />
                  <path d="M11.5 3a17 17 0 000 18M12.5 3a17 17 0 010 18" />
                </svg>
                <span>{tx({ ar: "جولة 360° تفاعلية", en: "360° Virtual Tour" })}</span>
              </button>

              <Link
                href={
                  project.title.en.includes("Villa")
                    ? "/simulate?project=villa-reception"
                    : project.title.en.includes("Penthouse")
                    ? "/simulate?project=penthouse-master"
                    : project.categoryKey === "office"
                    ? "/simulate?project=corporate-office"
                    : "/simulate"
                }
                onClick={onClose}
                className="btn-primary flex-1 justify-center gap-2 cursor-pointer text-xs"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                  <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
                </svg>
                {tx({ ar: "المحاكاة 3D", en: "3D Simulator" })}
              </Link>

              <a
                href="#quote"
                onClick={onClose}
                className="btn-secondary flex-1 justify-center cursor-pointer text-xs"
              >
                {tx({ ar: "طلب استشارة", en: "Request Consultation" })}
              </a>
            </div>
          </div>
        </div>

        {/* 360 Tour Modal Overlay inside Project Modal */}
        {show360Tour && (
          <div className="absolute inset-0 z-40 bg-stone-950 flex flex-col animate-in fade-in duration-200">
            <PanoramaViewer onClose={() => setShow360Tour(false)} />
          </div>
        )}

      </div>
    </div>
  );
}
