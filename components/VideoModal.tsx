"use client";

import { useEffect } from "react";
import { useLocale } from "@/lib/i18n";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
}

export function VideoModal({
  isOpen,
  onClose,
  videoUrl = "https://www.youtube-nocookie.com/embed/ScMzIvxBSi4?autoplay=1",
  title = "Ionic Architecture Showreel",
}: VideoModalProps) {
  const { locale } = useLocale();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-none border border-white/20 bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 bg-bronze animate-pulse" />
            <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
              {locale === "ar" ? "العرض المعماري الخاص — أيونيك" : "Architectural Showreel — Ionic Studio"}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label={locale === "ar" ? "إغلاق الفيديو" : "Close video"}
            className="group flex h-8 w-8 items-center justify-center rounded-none border border-white/20 text-white/70 transition-colors hover:border-white hover:bg-white hover:text-black"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Video Frame */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={videoUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>

        {/* Footer caption */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/10 px-6 py-3 text-[11px] uppercase tracking-wider text-white/50">
          <span>{locale === "ar" ? "هندسة معمارية • مقاولات عامة • تشطيبات راقية" : "Architecture • General Contracting • Fine Fit-Outs"}</span>
          <span>B11 Mindhaus Campus • District 5 • New Cairo</span>
        </div>
      </div>
    </div>
  );
}
