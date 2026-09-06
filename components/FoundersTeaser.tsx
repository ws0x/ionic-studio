"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { founders } from "@/lib/content";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

export function FoundersTeaser() {
  const { t, locale } = useLocale();

  return (
    <section className="bg-paper py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow={t("founders.eyebrow")}
            title={t("founders.title")}
          />
          <Reveal>
            <Link href="/founders" className="btn-secondary whitespace-nowrap cursor-pointer">
              {t("founders.viewAll")}
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {founders.map((f, i) => (
            <Reveal
              key={i}
              delay={i * 100}
              as="article"
              className="group relative overflow-hidden rounded-2xl bg-mist cursor-default"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Portrait */}
                <div className="relative aspect-[3/4] w-full overflow-hidden sm:aspect-auto sm:h-auto sm:min-h-[240px] sm:w-48 shrink-0">
                  <Image
                    src={f.image}
                    alt={`${f.name.en}, ${f.title.en}, Ionic Design House`}
                    fill
                    sizes="(max-width: 640px) 100vw, 192px"
                    className="object-cover object-top grayscale transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                {/* Info */}
                <div className="flex flex-col justify-center p-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-platinum">
                    {f.title[locale]}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
                    {f.name[locale]}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-platinum line-clamp-3">
                    {f.bio1[locale]}
                  </p>
                  <blockquote className="mt-4 border-s-2 border-silver ps-4 text-sm italic text-ink/70">
                    {f.quote[locale]}
                  </blockquote>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
