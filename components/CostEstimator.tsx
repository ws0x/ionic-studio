"use client";

import { useState, useId, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { finishingPackages as fallbackPackages, type FinishingPackage } from "@/lib/content";
import { Reveal } from "@/components/Reveal";

export default function CostEstimator() {
  const { t, locale, isAr } = useI18n();
  const sliderId = useId();

  const [packages, setPackages] = useState<FinishingPackage[]>(fallbackPackages);
  const [selectedId, setSelectedId] = useState<FinishingPackage["id"]>("prestige");
  const [area, setArea] = useState<number>(180);

  useEffect(() => {
    let active = true;
    fetch("/api/content")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.packages && Array.isArray(data.packages) && data.packages.length > 0) {
          setPackages(data.packages);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const activePkg =
    packages.find((p) => p.id === selectedId) ?? packages[0] ?? fallbackPackages[0];

  const minTotal = area * activePkg.minRate;
  const maxTotal = area * activePkg.maxRate;

  const waMessage = isAr
    ? `مرحباً دار أيونيك للتصميم، أود الاستفسار عن باقة (${activePkg.name.ar}) لمساحة ${area} م² (التكلفة التقديرية: ${minTotal.toLocaleString()} - ${maxTotal.toLocaleString()} ج.م). هل يمكن ترتيب معاينة هندسية؟`
    : `Hello Ionic Design House, I'm inquiring about the ${activePkg.name.en} package for a ${area} m² space (Estimated budget: ${minTotal.toLocaleString()} - ${maxTotal.toLocaleString()} EGP). Can we schedule an engineering site survey?`;

  const waHref = `https://wa.me/201026040854?text=${encodeURIComponent(waMessage)}`;

  return (
    <section id="estimator" className="py-24 bg-stone-950/70 relative border-t border-stone-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-amber-400/90 text-xs font-semibold tracking-widest uppercase mb-3 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
              {t("estimator.eyebrow")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-light text-stone-100 mb-4 tracking-tight">
              {t("estimator.title")}
            </h2>
            <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
              {t("estimator.subtitle")}
            </p>
          </div>
        </Reveal>

        {/* Interactive Estimator Card */}
        <div className="bg-stone-900/60 backdrop-blur-md rounded-2xl border border-stone-800 p-6 sm:p-10 shadow-2xl">
          {/* Step 1: Package Selection */}
          <div className="mb-10">
            <label className="block text-xs uppercase tracking-widest text-stone-400 mb-4 font-semibold">
              1. {t("estimator.packageLabel")}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {packages.map((pkg) => {
                const isSelected = pkg.id === selectedId;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedId(pkg.id)}
                    className={`text-start rounded-xl p-5 transition-all border relative cursor-pointer ${
                      isSelected
                        ? "bg-amber-500/10 border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/40"
                        : "bg-stone-950/40 border-stone-800 hover:border-stone-700 hover:bg-stone-800/30"
                    }`}
                    aria-pressed={isSelected}
                  >
                    {isSelected && (
                      <span className="absolute top-3 end-3 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                      </span>
                    )}
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="text-lg font-medium text-stone-100">
                        {pkg.name[locale]}
                      </h3>
                    </div>
                    <p className="text-xs text-stone-400 mb-4 line-clamp-2">
                      {pkg.tagline[locale]}
                    </p>
                    <div className="pt-3 border-t border-stone-800/80 flex items-baseline justify-between">
                      <span className="text-amber-300 font-semibold text-sm">
                        {pkg.minRate.toLocaleString()} - {pkg.maxRate.toLocaleString()}
                      </span>
                      <span className="text-stone-400 text-xs">{t("estimator.rateUnit")}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Unit Area Slider */}
          <div className="mb-10 bg-stone-950/40 p-6 rounded-xl border border-stone-800/60">
            <div className="flex items-center justify-between mb-4">
              <label
                htmlFor={sliderId}
                className="text-xs uppercase tracking-widest text-stone-400 font-semibold"
              >
                2. {t("estimator.areaLabel")}
              </label>
              <div className="flex items-baseline gap-1 bg-stone-900 border border-stone-700 px-4 py-1.5 rounded-lg shadow-inner">
                <span className="text-2xl font-semibold text-amber-300 tabular-nums">
                  {area}
                </span>
                <span className="text-stone-400 text-xs">{t("estimator.areaUnit")}</span>
              </div>
            </div>

            <input
              id={sliderId}
              type="range"
              min={80}
              max={800}
              step={10}
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              aria-label={t("estimator.areaLabel")}
              className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />

            <div className="flex justify-between text-xs text-stone-400 mt-2 font-mono">
              <span>80 {t("estimator.areaUnit")}</span>
              <span>250 {t("estimator.areaUnit")}</span>
              <span>500 {t("estimator.areaUnit")}</span>
              <span>800 {t("estimator.areaUnit")}</span>
            </div>
          </div>

          {/* Step 3: Estimated Calculation & Turnaround Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-stone-950/70 border border-amber-500/20 rounded-xl p-6 sm:p-8">
            <div className="lg:col-span-7">
              <span className="text-xs uppercase tracking-widest text-stone-400 block mb-1">
                {t("estimator.estBudget")} ({activePkg.name[locale]})
              </span>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-light text-amber-300 font-mono tracking-tight mb-2">
                {minTotal.toLocaleString()} – {maxTotal.toLocaleString()}{" "}
                <span className="text-lg font-normal text-stone-400">ج.م</span>
              </div>
              <div className="flex items-center gap-2 text-stone-400 text-xs">
                <svg
                  className="w-4 h-4 text-amber-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  {t("estimator.turnaround")}:{" "}
                  <strong className="text-stone-200">
                    {activePkg.turnaroundMonths} {t("estimator.months")}
                  </strong>
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-medium rounded-xl transition-all shadow-lg hover:shadow-amber-500/20 text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                </svg>
                <span>{t("estimator.bookSurvey")}</span>
              </a>
              <Link
                href="/simulate"
                className="w-full text-center px-6 py-3 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 font-medium rounded-xl transition-all text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
                <span>{t("estimator.simulateCta")}</span>
              </Link>
              <Link
                href={`/quote/${selectedId}-${area}m2`}
                className="w-full text-center px-6 py-2.5 bg-stone-950 hover:bg-stone-900 text-amber-300 border border-amber-400/30 font-medium rounded-xl transition-all text-xs flex items-center justify-center gap-2"
              >
                <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{locale === "ar" ? "كراسة المواصفات الرسمية (PDF)" : "Official Specification Sheet (PDF)"}</span>
              </Link>
            </div>
          </div>

          {/* Included Features List */}
          <div className="mt-8 pt-8 border-t border-stone-800/80">
            <h4 className="text-xs uppercase tracking-widest text-stone-400 mb-4 font-semibold">
              {t("estimator.included")}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activePkg.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-300"
                >
                  <svg
                    className="w-4 h-4 text-amber-400 shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{feat[locale]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <p className="mt-8 text-stone-400 text-xs leading-relaxed border-t border-stone-800/40 pt-4">
            {t("estimator.disclaimer")}
          </p>
        </div>
      </div>
    </section>
  );
}
