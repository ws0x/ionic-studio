"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { beforeAfterCases as fallbackCases, type BeforeAfterShowcase } from "@/lib/content";
import { Reveal } from "@/components/Reveal";

export default function BeforeAfter() {
  const { t, locale, isAr } = useI18n();
  const [cases, setCases] = useState<BeforeAfterShowcase[]>(fallbackCases);
  const [selectedCase, setSelectedCase] = useState<BeforeAfterShowcase>(fallbackCases[0]);
  const [sliderPos, setSliderPos] = useState<number>(50);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef<boolean>(false);

  useEffect(() => {
    let active = true;
    fetch("/api/content")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.beforeAfter && Array.isArray(data.beforeAfter) && data.beforeAfter.length > 0) {
          setCases(data.beforeAfter);
          setSelectedCase((prev) => {
            const found = data.beforeAfter.find((c: BeforeAfterShowcase) => c.id === prev?.id);
            return found || data.beforeAfter[0];
          });
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percent = (x / rect.width) * 100;
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;
    setSliderPos(Math.round(percent));
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    handleMove(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSliderPos((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setSliderPos((prev) => Math.min(100, prev + 5));
    } else if (e.key === "Home") {
      e.preventDefault();
      setSliderPos(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setSliderPos(100);
    }
  };

  return (
    <section id="transformations" className="py-24 bg-stone-950 relative border-t border-stone-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block text-amber-400/90 text-xs font-semibold tracking-widest uppercase mb-3 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
              {t("beforeAfter.eyebrow")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-light text-stone-100 mb-4 tracking-tight">
              {t("beforeAfter.title")}
            </h2>
            <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
              {t("beforeAfter.subtitle")}
            </p>
          </div>
        </Reveal>

        {/* Case Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {cases.map((c) => {
            const isSelected = c.id === selectedCase.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCase(c)}
                aria-pressed={isSelected}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer border ${
                  isSelected
                    ? "bg-amber-500 text-stone-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    : "bg-stone-900/60 text-stone-300 border-stone-800 hover:border-stone-700 hover:bg-stone-800/50"
                }`}
              >
                {c.title[locale]}
              </button>
            );
          })}
        </div>

        {/* Interactive Comparison Canvas */}
        <Reveal>
          <div
            ref={containerRef}
            tabIndex={0}
            role="slider"
            aria-label={t("beforeAfter.title")}
            aria-valuenow={sliderPos}
            aria-valuemin={0}
            aria-valuemax={100}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown}
            className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[600px] overflow-hidden rounded-2xl border border-stone-800 shadow-2xl select-none cursor-ew-resize touch-none focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          >
            {/* After Image (Background Layer) */}
            <div className="absolute inset-0">
              <Image
                src={selectedCase.afterImage}
                alt={`${selectedCase.title[locale]} - After`}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover"
                loading="lazy"
              />
              <span className="absolute bottom-4 end-4 z-10 px-3 py-1.5 rounded-lg bg-stone-950/80 backdrop-blur-md border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wide shadow-lg">
                {t("beforeAfter.afterLabel")}
              </span>
            </div>

            {/* Before Image (Clipped Overlay Layer) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: isAr
                  ? `inset(0 0 0 ${100 - sliderPos}%)`
                  : `inset(0 ${100 - sliderPos}% 0 0)`,
              }}
            >
              <Image
                src={selectedCase.beforeImage}
                alt={`${selectedCase.title[locale]} - Before`}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover"
                loading="lazy"
              />
              <span className="absolute bottom-4 start-4 z-10 px-3 py-1.5 rounded-lg bg-stone-950/80 backdrop-blur-md border border-stone-700 text-stone-300 text-xs font-bold tracking-wide shadow-lg">
                {t("beforeAfter.beforeLabel")}
              </span>
            </div>

            {/* Divider Line & Drag Handle */}
            <div
              className="absolute top-0 bottom-0 z-20 pointer-events-none"
              style={{
                [isAr ? "right" : "left"]: `${sliderPos}%`,
                transform: "translateX(-50%)",
              }}
            >
              <div className="w-0.5 h-full bg-amber-400/90 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 start-1/2 w-9 h-9 rounded-full bg-stone-950 border-2 border-amber-400 shadow-xl flex items-center justify-center text-amber-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Case Study Architectural Metadata Card */}
        <div className="mt-8 bg-stone-900/60 backdrop-blur-md rounded-xl border border-stone-800/80 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold block">
              {selectedCase.compound[locale]} · {selectedCase.location[locale]}
            </span>
            <h3 className="text-xl font-light text-stone-100">
              {selectedCase.title[locale]}
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 max-w-2xl leading-relaxed">
              {selectedCase.scope[locale]}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3 bg-stone-950/70 border border-stone-800 px-5 py-3 rounded-xl">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span className="text-[10px] uppercase text-stone-400 block tracking-wider font-semibold">
                {t("beforeAfter.duration")}
              </span>
              <strong className="text-stone-100 font-mono text-sm">
                {selectedCase.duration[locale]}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
