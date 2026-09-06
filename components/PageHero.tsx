"use client";

import Image from "next/image";
import { useLocale } from "@/lib/i18n";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image: string;
}) {
  const { locale } = useLocale();
  void locale;

  return (
    <section className="relative flex min-h-[50vh] sm:min-h-[58vh] items-end overflow-hidden bg-black pb-16 pt-36 border-b border-white/10">
      {/* Background Image with Architectural Overlay */}
      <Image
        src={image}
        alt={title}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-25 grayscale brightness-75 scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      <div className="absolute inset-0 architectural-grid opacity-10 pointer-events-none" />

      {/* Watermark */}
      <div className="pointer-events-none absolute -bottom-10 inset-x-0 select-none overflow-hidden text-center opacity-5">
        <span className="text-stroke-light font-bold uppercase tracking-tighter text-[15vw] leading-none whitespace-nowrap">
          IONIC STUDIO
        </span>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-2 w-2 bg-bronze" />
          <span className="text-xs font-bold uppercase tracking-widest text-bronze-light">
            {eyebrow}
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-white max-w-4xl leading-[1.15]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-white/70 leading-relaxed uppercase tracking-wider">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
