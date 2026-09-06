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
  void locale; // used by parent via tx()

  return (
    <section className="grain relative flex min-h-[55vh] items-end overflow-hidden bg-ink pb-16 pt-36">
      <Image
        src={image}
        alt={title}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-35 grayscale"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/50 to-transparent" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-paper/20 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <p
          className="eyebrow mb-6 text-paper/50"
          style={{ "--color-platinum": "rgba(255,255,255,0.4)" } as React.CSSProperties}
        >
          {eyebrow}
        </p>
        <h1 className="font-display text-balance text-4xl font-bold leading-tight text-paper sm:text-6xl md:text-7xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-xl text-base leading-relaxed text-paper/65">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
