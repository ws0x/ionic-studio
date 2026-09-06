"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "@/lib/i18n";
import { waLink } from "@/lib/site";
import { VideoModal } from "@/components/VideoModal";

export function Hero() {
  const { t, locale } = useLocale();
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section
      id="top"
      className="relative flex min-h-[92vh] sm:min-h-screen items-center overflow-hidden bg-black pb-16 pt-28 sm:pt-32"
    >
      {/* Background Architectural Image */}
      <Image
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
        alt="Ionic Luxury Architecture and Fine Fit-Outs"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-25 grayscale brightness-75"
      />
      
      {/* Dark Architectural Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
      <div className="absolute inset-0 architectural-grid opacity-60 pointer-events-none" />

      {/* Wireframe Architectural Guidelines */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-y-0 start-6 w-px bg-white/[0.07] sm:start-12" />
        <div className="absolute inset-y-0 end-6 w-px bg-white/[0.07] sm:end-12" />
      </div>

      {/* Watermark Outline Typography in Background */}
      <div className="pointer-events-none absolute -bottom-10 inset-x-0 select-none overflow-hidden text-center opacity-10">
        <span className="text-stroke-light font-bold uppercase tracking-tighter text-[14vw] leading-none">
          IONIC ARCHITECTURE
        </span>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-12">
        <div className="max-w-4xl">
          {/* Eyebrow & Badge */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 border border-bronze/40 bg-bronze/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-bronze-light">
              <span className="h-1.5 w-1.5 rounded-full bg-bronze animate-pulse" />
              {t("hero.badge")}
            </span>
            <span className="text-xs uppercase tracking-widest text-white/40">
              {locale === "ar" ? "القاهرة الجديدة • الشيخ زايد • العاصمة الإدارية" : "New Cairo • Zayed • New Capital"}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-balance text-4xl font-bold uppercase tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05]">
            {t("hero.title")}
          </h1>

          {/* Subtitle & Editorial Accent */}
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            <span className="font-serif italic text-bronze-light block mb-2 text-lg sm:text-xl">
              {locale === "ar" ? "— أعمال معمارية وتشطيبات متكاملة بمواصفات عالمية" : "— Turnkey General Contracting & Fine Fit-Outs in Egypt"}
            </span>
            {t("hero.subtitle")}
          </p>

          {/* Action Row & Showreel Trigger */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={waLink(t("cta.whatsappDefault"))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-3 border border-white bg-white px-8 text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-transparent hover:text-white"
            >
              {t("hero.ctaPrimary")}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="rtl:rotate-180">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            {/* Reference-style "Play Video" button */}
            <button
              onClick={() => setIsVideoOpen(true)}
              className="group inline-flex h-12 items-center justify-center gap-3 border border-white/30 bg-white/5 px-6 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-all hover:border-bronze hover:bg-bronze hover:text-black"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black transition-transform group-hover:scale-110">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              {t("hero.playVideo")}
            </button>

            <a
              href="/projects"
              className="inline-flex h-12 items-center justify-center px-6 text-xs font-bold uppercase tracking-wider text-white/70 hover:text-white transition-colors"
            >
              {t("hero.ctaSecondary")}
            </a>
          </div>

          {/* Credentials Counter Bar */}
          <div className="mt-14 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono">15+</div>
              <div className="text-[11px] uppercase tracking-wider text-white/50 mt-1">
                {locale === "ar" ? "سنوات خبرة معمارية" : "Years Experience"}
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono">+30</div>
              <div className="text-[11px] uppercase tracking-wider text-white/50 mt-1">
                {locale === "ar" ? "علامة تجارية كبرى" : "Enterprise Brands"}
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono">180+</div>
              <div className="text-[11px] uppercase tracking-wider text-white/50 mt-1">
                {locale === "ar" ? "مشروع تم تسليمه" : "Delivered Projects"}
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-bronze-light font-mono">100%</div>
              <div className="text-[11px] uppercase tracking-wider text-white/50 mt-1">
                {locale === "ar" ? "تسليم بمفتاح اليد" : "Turnkey Guarantee"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        title="Ionic Architecture Showreel"
      />
    </section>
  );
}
