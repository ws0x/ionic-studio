"use client";

import Image from "next/image";
import { LocaleProvider, useLocale } from "@/lib/i18n";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CareersSection } from "@/components/CareersSection";
import { waLink } from "@/lib/site";

function AboutContent() {
  const { locale } = useLocale();

  return (
    <main className="bg-black text-white min-h-screen pt-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10 py-24 sm:py-32">
        <div className="pointer-events-none absolute -top-10 inset-x-0 select-none overflow-hidden text-center opacity-5">
          <span className="text-stroke-light font-bold uppercase tracking-tighter text-[16vw] leading-none whitespace-nowrap">
            OVERVIEW ABOUT
          </span>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-2 w-2 bg-bronze" />
              <span className="text-xs font-bold uppercase tracking-widest text-bronze-light">
                {locale === "ar" ? "نبذة عن الشركة" : "Company Overview"}
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-white leading-tight">
              {locale === "ar" ? "أيونيك للمقاولات والتشطيبات المعمارية" : "Ionic Architecture & Fine Finishing"}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/70 leading-relaxed font-light">
              {locale === "ar"
                ? "شركة رائدة في مجال الإنشاءات، والتشطيبات الفاخرة، والتجهيزات المتكاملة (Fit-Outs) والأعمال الكهروميكانيكية (MEP) في جمهورية مصر العربية."
                : "A premier Egyptian contracting firm renowned for excellence in turnkey construction, fine architectural finishing, and electro-mechanical engineering."}
            </p>
          </div>
        </div>
      </section>

      {/* 15+ Years Section */}
      <section className="py-24 sm:py-32 border-b border-white/10 relative">
        <div className="mx-auto max-w-7xl px-6 sm:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 relative aspect-[4/5] overflow-hidden border border-white/15">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Ionic Architecture Heritage"
                fill
                className="object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                <span className="font-mono text-4xl font-bold text-white block">15+</span>
                <span className="text-xs uppercase tracking-widest text-bronze-light">
                  {locale === "ar" ? "عاماً من الريادة والتميز الهندسي" : "Years of Experience in Turnkey Fit-Outs"}
                </span>
              </div>
            </div>

            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-widest text-bronze-light block mb-3">
                {locale === "ar" ? "أكثر من 15 عاماً من الخبرة" : "More than 15 Years of Experience"}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold uppercase text-white mb-6 leading-tight">
                {locale === "ar"
                  ? "إتقان هندسي ومشاريع مستدامة ذات موثوقية لا تقبل المساومة"
                  : "Engineering Mastery & Sustainable Architecture"}
              </h2>
              <div className="space-y-4 text-white/75 text-base leading-relaxed">
                <p>
                  {locale === "ar"
                    ? "تعتبر أيونيك للمقاولات والتشطيبات المعمارية مقاولاً رئيسياً رائداً في تنفيذ المشاريع المعقدة بجودة وموثوقية استثنائية. من خلال التزامنا الراسخ بالنزاهة والكفاءة الهندسية، رسخنا مكانتنا كأحد أبرز مقاولي التشطيبات في مصر."
                    : "Ionic Building and Finishing is a leading contractor renowned for excellence in construction, fine finishing, and fit-outs, including electro-mechanical work. Our expertise lies in delivering sustainable projects of varied complexity, marked by unparalleled quality and reliability."}
                </p>
                <p>
                  {locale === "ar"
                    ? "يمتد سجل أعمالنا عبر قطاعات حيوية تشمل المقرات الإدارية للشركات، كبرى سلاسل المطاعم والكافيهات (F&B)، المتاجر العالمية الراقية (Retail)، والفيلات والقصور السكنية الفاخرة في كبرى المجمعات العمرانية."
                    : "With a steadfast commitment to integrity and efficiency, we have emerged as one of Egypt's premier contractors, excelling across sectors such as corporate offices, hospitality, retail flagship stores, and ultra-luxury residential villas."}
                </p>
              </div>

              {/* Statistics Counter */}
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-6 border-t border-white/10 pt-8">
                <div>
                  <div className="text-3xl font-mono font-bold text-white">+30</div>
                  <div className="text-xs text-white/50 uppercase tracking-wider mt-1">
                    {locale === "ar" ? "علامة تجارية دولية" : "International Brands"}
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-mono font-bold text-white">180+</div>
                  <div className="text-xs text-white/50 uppercase tracking-wider mt-1">
                    {locale === "ar" ? "مشروع تم تسليمه" : "Turnkey Handed Over"}
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-mono font-bold text-bronze-light">100%</div>
                  <div className="text-xs text-white/50 uppercase tracking-wider mt-1">
                    {locale === "ar" ? "التزام بالجدول الزمني" : "On-Time Handover"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-24 sm:py-32 border-b border-white/10 bg-neutral-950">
        <div className="mx-auto max-w-7xl px-6 sm:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-bronze-light block mb-2">
              {locale === "ar" ? "رؤيتنا ورسالتنا" : "Our Mission & Vision"}
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white">
              {locale === "ar" ? "بناء معايير جديدة لصناعة المقاولات" : "Redefining Architectural Benchmarks"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-white/15 bg-white/[0.02] p-8 sm:p-12">
              <div className="h-2 w-12 bg-bronze mb-6" />
              <h3 className="text-2xl font-bold uppercase tracking-wide text-white mb-4">
                {locale === "ar" ? "رؤيتنا (Our Vision)" : "Our Vision"}
              </h3>
              <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                {locale === "ar"
                  ? "أن نقود صناعة المقاولات والتشطيبات المعمارية في الشرق الأوسط من خلال الابتكار والتميز الهندسي. نسعى لإعادة صياغة المعايير ووضع أسس جديدة للجودة والاستدامة والموثوقية، لنخلق مساحات تُلهم المجتمعات وتدوم عبر الأجيال."
                  : "At Ionic Studio, our vision is to lead the construction and fit-out industry through innovation and excellence. We aim to redefine standards, setting new benchmarks for quality, sustainability, and reliability, creating enduring spaces that inspire."}
              </p>
            </div>

            <div className="border border-white/15 bg-white/[0.02] p-8 sm:p-12">
              <div className="h-2 w-12 bg-white mb-6" />
              <h3 className="text-2xl font-bold uppercase tracking-wide text-white mb-4">
                {locale === "ar" ? "رسالتنا (Our Mission)" : "Our Mission"}
              </h3>
              <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                {locale === "ar"
                  ? "تجاوز توقعات عملائنا ومصممينا عبر تقديم مشاريع إنشائية وتشطيبات فائقة الدقة في المواعيد المحددة بدقة متناهية. نلتزم ببناء مكاتب، مقرات، متاجر، مطاعم، وفيلات تضيف قيمة استثنائية طويلة المدى وتبني شراكات دائمة."
                  : "Our mission is to surpass the expectations of our clients and designers by consistently delivering exceptional turnkey construction projects. We are committed to engineering spaces that add significant long-term value and foster enduring client relationships."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Careers Section */}
      <CareersSection />

      {/* Bottom CTA Banner */}
      <section className="py-20 border-t border-white/10 text-center bg-black">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold uppercase tracking-tight text-white mb-4">
            {locale === "ar" ? "هل لديك مشروع ترغب في تنفيذه؟" : "Have a Project in Mind?"}
          </h2>
          <p className="text-sm text-white/60 mb-8 uppercase tracking-wider">
            {locale === "ar" ? "استشارات معمارية متخصصة وتسليم بمفتاح اليد" : "Specialized architectural consultation & turnkey delivery"}
          </p>
          <a
            href={waLink("طلب استشارة معمارية من صفحة عن الشركة")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center border border-white bg-white px-8 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-transparent hover:text-white"
          >
            {locale === "ar" ? "طلب استشارة معمارية" : "Request a Consultation"}
          </a>
        </div>
      </section>
    </main>
  );
}

export default function AboutPage() {
  return (
    <LocaleProvider>
      <Nav />
      <AboutContent />
      <Footer />
    </LocaleProvider>
  );
}
