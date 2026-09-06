"use client";

import { useLocale } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";
import type { ClientProject, ProjectMilestone } from "@/lib/db";

interface ProjectTrackerViewProps {
  project: ClientProject;
  onResetSearch?: () => void;
}

export function ProjectTrackerView({ project, onResetSearch }: ProjectTrackerViewProps) {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  // Pure derivation from project timestamps (no Date.now in render, zero cascading renders)
  const targetTime = new Date(project.targetHandoverDate).getTime();
  const refTime = new Date(project.updatedAt || project.contractDate).getTime();
  const diffDays = Math.ceil((targetTime - refTime) / (1000 * 60 * 60 * 24));
  const daysLeft = diffDays > 0 ? diffDays : 0;

  const getStatusBadge = (milestone: ProjectMilestone) => {
    if (milestone.status === "completed" || milestone.progress === 100) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          {locale === "ar" ? "مكتمل ١٠٠٪" : "Completed 100%"}
        </span>
      );
    }
    if (milestone.status === "in_progress" || milestone.progress > 0) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-400/30 animate-pulse">
          {locale === "ar" ? `قيد التنفيذ (${milestone.progress}٪)` : `In Progress (${milestone.progress}%)`}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-800 text-stone-400 border border-stone-700">
        {locale === "ar" ? "مجدول لاحقاً" : "Scheduled"}
      </span>
    );
  };

  const waEngineerMessage = isAr
    ? `مرحباً مهندس ${project.siteEngineer.name}، بخصوص مشروعي كود (${project.referenceId}) في ${project.compound.ar}، أود الاستفسار عن تطورات الموقع.`
    : `Hello ${project.siteEngineer.name}, regarding my project (${project.referenceId}) at ${project.compound.en}, I have an inquiry regarding recent site progress.`;

  const waHref = `https://wa.me/${project.siteEngineer.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    waEngineerMessage
  )}`;

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Top Banner & Client Identification */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-6 sm:p-10 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 end-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold tracking-wider">
                {project.referenceId}
              </span>
              <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                {project.unitType} · {project.area}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-light text-stone-100 tracking-tight">
              {project.compound[locale]} · {project.city[locale]}
            </h1>

            <p className="text-stone-400 text-xs sm:text-sm">
              <span className="text-stone-200 font-medium">{locale === "ar" ? "العميل: " : "Client: "}</span>
              {project.clientName}
            </p>
          </div>

          {/* Overall Progress Gauge Card */}
          <div className="flex items-center gap-5 p-4 sm:p-5 bg-stone-950/70 border border-stone-800 rounded-2xl shrink-0">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-stone-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-400 transition-all duration-1000 ease-out"
                  strokeDasharray={`${project.overallProgress}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                <span className="text-lg font-bold text-stone-100 leading-none">{project.overallProgress}%</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">
                {locale === "ar" ? "الإنجاز الكلي للمشروع" : "Overall Completion"}
              </span>
              <div className="text-xs text-amber-300 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                {daysLeft > 0
                  ? locale === "ar"
                    ? `متبقي ${daysLeft} يوم حتى موعد التسليم`
                    : `${daysLeft} days until turnkey handover`
                  : locale === "ar"
                  ? "المشروع في مرحلة التسليم النهائي"
                  : "Final handover in progress"}
              </div>
              <p className="text-[10px] text-stone-500 font-mono">
                {locale === "ar" ? "التسليم المستهدف: " : "Target Handover: "}
                {project.targetHandoverDate}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Toolbar */}
        <div className="mt-8 pt-6 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4 text-stone-400">
            <span>
              {locale === "ar" ? "تاريخ التعاقد: " : "Contract Date: "}
              <strong className="text-stone-200 font-mono">{project.contractDate}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/quote/${project.referenceId}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-950 border border-stone-700 hover:border-amber-400/50 text-stone-200 rounded-xl text-xs font-medium transition cursor-pointer"
            >
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {locale === "ar" ? "تحميل كراسة المواصفات الرسمية" : "Download Official Spec Sheet"}
            </Link>

            {onResetSearch && (
              <button
                type="button"
                onClick={onResetSearch}
                className="px-3.5 py-2 text-stone-400 hover:text-stone-100 transition cursor-pointer"
              >
                {locale === "ar" ? "بحث عن مشروع آخر" : "Search Another Project"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 5-Stage Engineering Milestones Stepper */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold block mb-1">
            {locale === "ar" ? "المخطط الزمني الهندسي" : "Engineering Execution Timeline"}
          </span>
          <h2 className="text-2xl font-light text-stone-100 tracking-tight">
            {locale === "ar" ? "مراحل التنفيذ ومؤشرات الإنجاز" : "Project Milestones & Verification"}
          </h2>
        </div>

        <div className="space-y-4">
          {project.milestones.map((m, index) => {
            const isDone = m.status === "completed" || m.progress === 100;
            const isCurrent = m.status === "in_progress" || (m.progress > 0 && m.progress < 100);

            return (
              <div
                key={m.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCurrent
                    ? "bg-amber-500/5 border-amber-400/40 shadow-lg shadow-amber-500/5 ring-1 ring-amber-400/20"
                    : isDone
                    ? "bg-stone-950/40 border-stone-800"
                    : "bg-stone-950/20 border-stone-900 opacity-60"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 ${
                        isDone
                          ? "bg-emerald-500 text-stone-950"
                          : isCurrent
                          ? "bg-amber-400 text-stone-950"
                          : "bg-stone-800 text-stone-400"
                      }`}
                    >
                      {isDone ? "✓" : index + 1}
                    </div>

                    <h3 className="text-sm sm:text-base font-medium text-stone-100">
                      {m.title[locale]}
                    </h3>
                  </div>

                  <div>{getStatusBadge(m)}</div>
                </div>

                <p className="text-xs text-stone-400 mb-3 ms-10 leading-relaxed">
                  {m.description[locale]}
                </p>

                {/* Progress Bar */}
                <div className="ms-10 flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-stone-950 overflow-hidden border border-stone-800">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isDone ? "bg-emerald-400" : isCurrent ? "bg-amber-400" : "bg-stone-700"
                      }`}
                      style={{ width: `${m.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-stone-400 min-w-[36px] text-end">
                    {m.progress}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Site Photo Feed (2/3) & Supervising Engineer Card (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Site Inspection Photo Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold block mb-1">
                {locale === "ar" ? "التوثيق الميداني المباشر" : "Live Field Documentation"}
              </span>
              <h2 className="text-2xl font-light text-stone-100 tracking-tight">
                {locale === "ar" ? "سجل صور الموقع الهندسي" : "Site Inspection Photo Feed"}
              </h2>
            </div>
            <span className="px-3 py-1 bg-stone-900 border border-stone-800 rounded-xl text-xs font-mono text-stone-300">
              {project.siteUpdates.length} {locale === "ar" ? "تقارير موثقة" : "Updates"}
            </span>
          </div>

          {project.siteUpdates.length === 0 ? (
            <div className="p-12 text-center bg-stone-900/40 border border-dashed border-stone-800 rounded-3xl text-stone-400 text-xs">
              {locale === "ar"
                ? "سيتم رفع أول تقرير مصور من موقع العمل فور بدء الأعمال الميدانية."
                : "The site engineer will upload verified photo documentation as works commence."}
            </div>
          ) : (
            <div className="space-y-6">
              {project.siteUpdates.map((update) => (
                <div
                  key={update.id}
                  className="bg-stone-900/60 border border-stone-800 rounded-2xl overflow-hidden shadow-xl group hover:border-stone-700 transition"
                >
                  {update.imageUrl && (
                    <div className="relative aspect-video w-full bg-stone-950 overflow-hidden">
                      <Image
                        src={update.imageUrl}
                        alt={update.title[locale]}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 1024px) 100vw, 800px"
                      />
                      <div className="absolute top-3 end-3 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur border border-stone-700 text-amber-300 text-[11px] font-mono font-medium">
                        ⏱ {update.date}
                      </div>
                    </div>
                  )}

                  <div className="p-6 space-y-2">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span className="text-amber-400 font-semibold uppercase tracking-wider text-[10px]">
                        {update.engineerName}
                      </span>
                      <span className="font-mono text-[11px] text-stone-500">{update.date}</span>
                    </div>

                    <h3 className="text-base font-medium text-stone-100">
                      {update.title[locale]}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                      {update.notes[locale]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assigned Site Engineer Card */}
        <div className="space-y-6">
          <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 sticky top-28 shadow-xl">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold block mb-1">
                {locale === "ar" ? "فريق الإشراف الهندسي" : "Dedicated Supervision Team"}
              </span>
              <h3 className="text-lg font-medium text-stone-100">
                {locale === "ar" ? "مهندس الموقع المسؤول" : "Your Assigned Lead Engineer"}
              </h3>
            </div>

            <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold text-lg shrink-0">
                {project.siteEngineer.name.split(" ")[1]?.charAt(0) || "E"}
              </div>

              <div>
                <h4 className="text-sm font-medium text-stone-100">{project.siteEngineer.name}</h4>
                <p className="text-xs text-stone-400">{project.siteEngineer.title[locale]}</p>
                <p className="text-[11px] font-mono text-stone-500 mt-0.5">{project.siteEngineer.phone}</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.77.814 2.796.815 3.179 0 5.767-2.587 5.768-5.766.002-3.181-2.585-5.768-5.768-5.768zm0 10.455c-.868 0-1.716-.234-2.456-.677l-.176-.105-1.823.478.487-1.777-.115-.183c-.482-.767-.737-1.66-.737-2.585 0-2.628 2.139-4.767 4.769-4.767 2.629 0 4.768 2.139 4.768 4.768 0 2.629-2.139 4.768-4.768 4.768z" />
                </svg>
                {locale === "ar" ? "تواصل مع مهندس الموقع عبر واتساب" : "WhatsApp Site Engineer"}
              </a>

              <a
                href={`tel:${project.siteEngineer.phone}`}
                className="w-full py-3 px-4 bg-stone-950 border border-stone-700 hover:border-stone-500 text-stone-200 text-xs font-medium rounded-xl flex items-center justify-center gap-2 transition"
              >
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {locale === "ar" ? "اتصال هاتفي مباشر" : "Direct Phone Call"}
              </a>
            </div>

            <div className="p-4 bg-stone-950/40 border border-stone-800/80 rounded-2xl space-y-1.5 text-xs text-stone-400">
              <strong className="text-stone-300 block">
                {locale === "ar" ? "ضمان الجودة والتنفيذ الإنشائي" : "Engineering Quality Guarantee"}
              </strong>
              <p className="text-[11px] leading-relaxed">
                {locale === "ar"
                  ? "جميع الأعمال تخضع للمطابقة مع الكود المصري وتُسلَم باختبارات كهروميكانيكية موثقة بمحاضر استلام رسمية."
                  : "All structural and MEP execution adheres strictly to Egyptian Building Codes with certified pressure testing logs."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
