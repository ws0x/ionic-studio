"use client";

import Image from "next/image";
import { LocaleProvider, useLocale } from "@/lib/i18n";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CareersSection } from "@/components/CareersSection";

interface TeamMember {
  name: { ar: string; en: string };
  role: { ar: string; en: string };
  bio: { ar: string; en: string };
  credentials: string;
  image: string;
}

const leaders: TeamMember[] = [
  {
    name: { ar: "م. عمر خالد", en: "Eng. Omar Khaled" },
    role: { ar: "الرئيس التنفيذي والشريك المؤسس", en: "Founder & CEO" },
    bio: {
      ar: "أكثر من 18 عاماً من الخبرة في إدارة المقاولات الكبرى والتجهيزات التجارية والشركات الدولية في مصر والخليج.",
      en: "Over 18 years driving enterprise contracting, commercial rollouts, and institutional architecture across Egypt and the MENA region.",
    },
    credentials: "B.Sc. Civil Engineering, Cairo University | PMP Certified",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: { ar: "م. محمود بسيوني", en: "Eng. Mahmoud Bassiouny" },
    role: { ar: "مدير مكتب إدارة المشاريع (PMO)", en: "PMO & Operations Director" },
    bio: {
      ar: "يقود استراتيجيات تنفيذ المشاريع وضبط الجودة والالتزام بالجدول الزمني لأكثر من 150 موقع عمل متزامن.",
      en: "Directs project governance, QA/QC standards, procurement, and on-time site deliveries across commercial and luxury portfolios.",
    },
    credentials: "M.Sc. Project Management | PMI-RMP",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: { ar: "معمارية/ ليلى نور", en: "Arch. Laila Nour" },
    role: { ar: "كبير المعماريين ورئيس التصميم", en: "Principal Design Architect" },
    bio: {
      ar: "متخصصة في العمارة المعاصرة والتصميم الداخلي الفاخر للفيلات المستقلة وسلاسل المطاعم والمتاجر العالمية.",
      en: "Specializing in high-concept contemporary spaces, spatial branding for international retailers, and signature private estates.",
    },
    credentials: "B.Arch Architecture & Urban Design | LEED AP",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: { ar: "م. طارق القاضي", en: "Eng. Tarek El-Kady" },
    role: { ar: "مدير الأنظمة الكهروميكانيكية (MEP)", en: "Chief MEP Systems Director" },
    bio: {
      ar: "يشرف على الأنظمة المعقدة للتكييف المركزي، مكافحة الحريق، وشبكات الجهد المنخفض وغرف الخوادم الحيوية.",
      en: "Oversees complex HVAC, fire suppression, low-voltage IoT, and mission-critical electromechanical infrastructure.",
    },
    credentials: "B.Sc. Mechanical Engineering | NFPA Certified",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: { ar: "م. كريم سليمان", en: "Arch. Karim Soliman" },
    role: { ar: "مهندس تشطيبات معمارية أول", en: "Senior Fit-Out Architect" },
    bio: {
      ar: "خبير في تفاصيل الرخام، التكسيات الصوتية الخشبية، والواجهات الزجاجية المعمارية وتنسيق الموقع.",
      en: "Expert in Italian stone fabrication, acoustic millwork detailing, and frameless architectural glazing systems.",
    },
    credentials: "B.Arch Architecture | 11+ Years Specialization",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: { ar: "م. أحمد الشريف", en: "Eng. Ahmed El-Sherif" },
    role: { ar: "رئيس مهندسي الموقع والتنفيذ", en: "Lead Site Operations Engineer" },
    bio: {
      ar: "المسؤول عن الإشراف الميداني اليومي، مطابقة المواصفات القياسية، وتسجيل مراحل الإنجاز عبر نظام التتبع الذكي.",
      en: "Directs on-site execution teams, quality compliance, and real-time milestone telemetry in client tracking portals.",
    },
    credentials: "B.Sc. Civil Engineering | Certified Safety Officer",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
  },
];

function TeamContent() {
  const { locale } = useLocale();

  return (
    <main className="bg-black text-white min-h-screen pt-24">
      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-white/10 py-24 sm:py-32">
        <div className="pointer-events-none absolute -top-10 inset-x-0 select-none overflow-hidden text-center opacity-5">
          <span className="text-stroke-light font-bold uppercase tracking-tighter text-[16vw] leading-none whitespace-nowrap">
            TEAM LEADERSHIP
          </span>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-2 w-2 bg-bronze" />
              <span className="text-xs font-bold uppercase tracking-widest text-bronze-light">
                {locale === "ar" ? "فريق العمل والقيادة" : "Leadership & Team"}
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-white leading-tight">
              {locale === "ar" ? "نخبة الكفاءات المعمارية والهندسية" : "Engineering Minds Behind the Vision"}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/70 leading-relaxed font-light">
              {locale === "ar"
                ? "في أيونيك، يُعد فريقنا الاستثنائي حجر الزاوية في نجاحنا في قطاعات البناء، والتشطيبات الفاخرة، والتجهيزات المتكاملة."
                : "At Ionic Egypt, our exceptional team is the cornerstone of our success in the construction and interior fit-out sectors, exceeding expectations on every project."}
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Grid */}
      <section className="py-24 sm:py-32 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 sm:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leaders.map((m) => (
              <div
                key={m.name.en}
                className="group border border-white/15 bg-white/[0.02] p-6 transition-all hover:border-bronze hover:bg-white/[0.05]"
              >
                <div className="relative aspect-square w-full overflow-hidden mb-6 border border-white/10">
                  <Image
                    src={m.image}
                    alt={m.name.en}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                </div>

                <span className="text-xs font-bold uppercase tracking-widest text-bronze-light block mb-1">
                  {m.role[locale]}
                </span>
                <h3 className="text-xl font-bold uppercase tracking-wide text-white mb-2 group-hover:text-bronze-light transition-colors">
                  {m.name[locale]}
                </h3>
                <p className="text-xs text-white/40 font-mono mb-4">
                  {m.credentials}
                </p>
                <p className="text-sm text-white/70 leading-relaxed border-t border-white/10 pt-4">
                  {m.bio[locale]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Embedded Careers Section */}
      <CareersSection />
    </main>
  );
}

export default function TeamPage() {
  return (
    <LocaleProvider>
      <Nav />
      <TeamContent />
      <Footer />
    </LocaleProvider>
  );
}
