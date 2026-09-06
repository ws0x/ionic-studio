"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { Reveal } from "./Reveal";

export function About() {
  const { locale } = useLocale();

  return (
    <section id="about" className="relative overflow-hidden bg-neutral-950 py-24 md:py-36 text-white border-t border-white/10">
      {/* Background Architectural Watermark */}
      <div className="pointer-events-none absolute -top-12 inset-x-0 select-none overflow-hidden text-center opacity-5">
        <span className="text-stroke-light font-bold uppercase tracking-tighter text-[16vw] leading-none whitespace-nowrap">
          EXPERIENCE OVERVIEW
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-16">
          {/* Architectural Image Presentation */}
          <Reveal className="relative lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-none border border-white/15 bg-black">
              <Image
                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80"
                alt="Ionic Studio Architecture & Contracting"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover grayscale transition-transform duration-700 hover:scale-[1.03] brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              
              {/* Overlay Stat Counter */}
              <div className="absolute bottom-0 inset-x-0 p-8 border-t border-white/10 bg-black/80 backdrop-blur-sm">
                <span className="font-mono text-4xl sm:text-5xl font-bold text-white block">15+</span>
                <span className="text-xs uppercase tracking-widest text-bronze-light block mt-1">
                  {locale === "ar" ? "عاماً من الريادة في المقاولات والتشطيبات" : "Years of Turnkey Contracting Excellence"}
                </span>
              </div>
            </div>
          </Reveal>

          {/* Architectural Text & Credentials */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-2 w-2 bg-bronze" />
              <span className="text-xs font-bold uppercase tracking-widest text-bronze-light">
                {locale === "ar" ? "— أكثر من 15 عاماً من الخبرة" : "— More Than 15 Years of Experience"}
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white leading-tight">
              {locale === "ar" ? "مقاولون معتمدون للمشاريع المعمارية الكبرى" : "Premier Contractor for Landmark Architecture"}
            </h2>

            <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-white/70">
              <p>
                {locale === "ar"
                  ? "تعد أيونيك للمقاولات والتشطيبات الفاخرة شريكاً موثوقاً لكبرى الشركات العالمية والمحلية في مصر. نجمع بين المقاولات الإنشائية، التجهيزات المعمارية الدقيقة (Fit-Outs)، والأعمال الكهروميكانيكية المتطورة (MEP) لتسليم مشاريع مستدامة لا تقبل المساومة على الجودة."
                  : "Ionic Building and Finishing is a leading contractor renowned for excellence in construction, fine finishing, and turnkey fit-outs. Our expertise lies in delivering sustainable commercial, institutional, and luxury residential projects marked by engineering precision and on-time delivery."}
              </p>
              <p>
                {locale === "ar"
                  ? "يمتد سجل إنجازاتنا عبر قطاعات البنوك، المقرات الإدارية، سلاسل المطاعم والمقاهي الراقية، المتاجر العالمية، والفيلات السكنية الفاخرة في القاهرة الجديدة والشيخ زايد والعاصمة الإدارية."
                  : "Our multidisciplinary portfolio spans corporate headquarters, international F&B chains, haute couture fashion boutiques, and ultra-luxury private residences across Egypt's prime master-planned compounds."}
              </p>
            </div>

            {/* Credentials Badges */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 border-y border-white/10 py-6">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 bg-bronze" />
                <span className="text-xs uppercase tracking-wider font-semibold text-white/90">
                  {locale === "ar" ? "تسليم بمفتاح اليد دون وسطاء" : "Turnkey Direct Handover"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 bg-bronze" />
                <span className="text-xs uppercase tracking-wider font-semibold text-white/90">
                  {locale === "ar" ? "أنظمة MEP وهندسة كهروميكانيكية متطورة" : "Certified MEP & Electromechanical"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 bg-bronze" />
                <span className="text-xs uppercase tracking-wider font-semibold text-white/90">
                  {locale === "ar" ? "+30 علامة تجارية ومؤسسة دولية" : "+30 Enterprise & Global Brands"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 bg-bronze" />
                <span className="text-xs uppercase tracking-wider font-semibold text-white/90">
                  {locale === "ar" ? "ضمان هندسي موثق ومعتمد" : "Comprehensive Engineering Warranty"}
                </span>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-6">
              <Link
                href="/about"
                className="inline-flex h-12 items-center justify-center border border-white bg-white px-8 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-transparent hover:text-white"
              >
                {locale === "ar" ? "نبذة كاملة عن الشركة" : "Explore Full Profile"}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="ms-2 rtl:rotate-180">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/team"
                className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-bronze-light transition-colors"
              >
                {locale === "ar" ? "الهيكل الإداري وفريق العمل ←" : "Leadership & PMO Team →"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

