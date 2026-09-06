"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n";

export function CareersSection() {
  const { locale } = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "architect",
    portfolioUrl: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setSubmitted(true);
  };

  return (
    <section id="careers" className="relative overflow-hidden bg-black py-24 md:py-32 text-white border-t border-white/10">
      {/* Background Architectural Watermark */}
      <div className="pointer-events-none absolute -top-8 inset-x-0 select-none overflow-hidden text-center opacity-5">
        <span className="text-stroke-light font-bold uppercase tracking-tighter text-[14vw] leading-none whitespace-nowrap">
          CAREERS & TALENT
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          {/* Left Column: Architectural Pitch */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-2 w-2 bg-bronze" />
              <span className="text-xs font-bold uppercase tracking-widest text-bronze-light">
                {locale === "ar" ? "انضم إلى نخبة المعماريين" : "Wanna Join our Team?"}
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white leading-tight">
              {locale === "ar" ? "اكتشف الفرص في أيونيك" : "Discover Opportunities in Ionic Studio"}
            </h2>

            <p className="mt-6 text-base leading-relaxed text-white/70">
              {locale === "ar"
                ? "نبحث دائماً عن الكفاءات الهندسية الاستثنائية والشركاء والمقاولين المتخصصين لمشاريعنا الكبرى في العاصمة الإدارية، القاهرة الجديدة، والشيخ زايد. انضم إلى فريق يُقدّر الدقة الهندسية والابتكار."
                : "We are constantly seeking exceptional architects, structural engineers, MEP directors, and specialist contractors for landmark projects across New Cairo, Zayed, and the New Capital."}
            </p>

            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
              <div>
                <span className="block font-mono text-2xl font-bold text-white">45+</span>
                <span className="text-xs uppercase tracking-wider text-white/50">
                  {locale === "ar" ? "مهندس واستشاري بالموقع" : "Engineers & Consultants"}
                </span>
              </div>
              <div>
                <span className="block font-mono text-2xl font-bold text-bronze-light">0.0%</span>
                <span className="text-xs uppercase tracking-wider text-white/50">
                  {locale === "ar" ? "مساومة على معايير السلامة" : "Safety Tolerance"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Recruitment Form */}
          <div className="lg:col-span-6">
            <div className="rounded-none border border-white/15 bg-white/[0.03] p-8 sm:p-10 backdrop-blur-sm">
              <h3 className="text-xl font-bold uppercase tracking-wide text-white mb-2">
                {locale === "ar" ? "قدم طلبك الآن" : "Join Us Now"}
              </h3>
              <p className="text-xs text-white/50 mb-6 uppercase tracking-wider">
                {locale === "ar" ? "للمهندسين والمصممين وشركاء المقاولات" : "For Architects, Site Engineers & Contractors"}
              </p>

              {submitted ? (
                <div className="border border-bronze bg-bronze/10 p-6 text-center">
                  <span className="text-bronze font-bold text-lg block mb-2">
                    {locale === "ar" ? "تم استلام بياناتك بنجاح" : "Application Received"}
                  </span>
                  <p className="text-xs text-white/70">
                    {locale === "ar"
                      ? "سيتواصل معك فريق الموارد البشرية وإدارة المشاريع قريباً."
                      : "Our PMO and talent acquisition team will review your portfolio and reach out shortly."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-1">
                        {locale === "ar" ? "الاسم بالكامل *" : "Full Name *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder={locale === "ar" ? "م. أحمد محمود" : "Arch. Jane Doe"}
                        className="w-full rounded-none border border-white/20 bg-black px-4 py-3 text-sm text-white focus:border-bronze focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-1">
                        {locale === "ar" ? "رقم الهاتف *" : "Phone *"}
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+20 100 000 0000"
                        className="w-full rounded-none border border-white/20 bg-black px-4 py-3 text-sm text-white focus:border-bronze focus:outline-none"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-1">
                        {locale === "ar" ? "البريد الإلكتروني *" : "Email Address *"}
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="engineer@example.com"
                        className="w-full rounded-none border border-white/20 bg-black px-4 py-3 text-sm text-white focus:border-bronze focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-1">
                        {locale === "ar" ? "التخصص المطلوب" : "Specialization"}
                      </label>
                      <select
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        className="w-full rounded-none border border-white/20 bg-black px-4 py-3 text-sm text-white focus:border-bronze focus:outline-none appearance-none"
                      >
                        <option value="architect">{locale === "ar" ? "مهندس معماري / تصميم داخلي" : "Senior Design Architect"}</option>
                        <option value="site_engineer">{locale === "ar" ? "مهندس موقع وتشطيبات" : "Site Execution Engineer"}</option>
                        <option value="mep">{locale === "ar" ? "مهندس كهروميكانيكال (MEP)" : "MEP Systems Director"}</option>
                        <option value="subcontractor">{locale === "ar" ? "مقاول باطن / شريك توريد" : "Specialist Subcontractor Partner"}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-1">
                      {locale === "ar" ? "رابط البورتفوليو / السيرة الذاتية" : "Portfolio / CV URL"}
                    </label>
                    <input
                      type="url"
                      value={form.portfolioUrl}
                      onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })}
                      placeholder="https://drive.google.com/..."
                      className="w-full rounded-none border border-white/20 bg-black px-4 py-3 text-sm text-white focus:border-bronze focus:outline-none"
                      dir="ltr"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 w-full cursor-pointer border border-bronze bg-bronze py-4 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-white hover:border-white"
                  >
                    {locale === "ar" ? "إرسال طلب الانضمام" : "Submit Application"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
