"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { testimonials } from "@/lib/content";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < count ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" className="text-silver">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials({
  limit,
  showViewAll = false,
}: {
  limit?: number;
  showViewAll?: boolean;
}) {
  const { t, locale } = useLocale();
  const shown = limit ? testimonials.slice(0, limit) : testimonials;

  return (
    <section id="testimonials" className="bg-ink py-24 text-paper md:py-36">
      {/* Top platinum rule */}
      <div className="mx-auto mb-16 max-w-7xl px-5 sm:px-8">
        <div className="rule-h-full opacity-20" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={t("testimonials.eyebrow")}
          title={t("testimonials.title")}
          light
          align="center"
        />

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((tm, i) => (
            <Reveal
              key={i}
              delay={(i % 3) * 80}
              as="figure"
              className="flex flex-col rounded-2xl border border-paper/10 bg-charcoal p-8 transition-shadow duration-500 hover:shadow-2xl hover:shadow-ink/50 cursor-default"
            >
              <Stars count={tm.stars} />

              <blockquote className="mt-5 flex-1 text-base leading-relaxed text-paper/85 font-light">
                "{tm.quote[locale]}"
              </blockquote>

              <figcaption className="mt-6 border-t border-paper/10 pt-5">
                <div className="text-sm font-semibold text-paper">{tm.name[locale]}</div>
                <div className="mt-0.5 text-xs uppercase tracking-[0.12em] text-platinum">{tm.role[locale]}</div>
              </figcaption>
            </Reveal>
          ))}
        </div>

        {showViewAll && (
          <Reveal className="mt-12 flex justify-center">
            <Link href="/testimonials" className="btn-ghost cursor-pointer">
              {t("testimonials.viewAll")}
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
