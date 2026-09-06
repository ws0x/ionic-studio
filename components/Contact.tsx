"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n";
import { site, waLink } from "@/lib/site";

export function Contact() {
  const { locale } = useLocale();
  const [callbackSent, setCallbackSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    sector: "corporate",
    message: "",
  });

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;

    try {
      await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          type: form.sector,
          details: `Request a Call Back (${form.email}): ${form.message}`,
        }),
      });
    } catch {
      // non-blocking fallback
    }

    setCallbackSent(true);
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-black py-24 md:py-36 text-white border-t border-white/10">
      {/* Background Architectural Watermark */}
      <div className="pointer-events-none absolute -top-12 inset-x-0 select-none overflow-hidden text-center opacity-5">
        <span className="text-stroke-light font-bold uppercase tracking-tighter text-[16vw] leading-none whitespace-nowrap">
          CONTACT HEADQUARTERS
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-16">

          {/* Left Column — Request a Call Back Form */}
          <div className="lg:col-span-7">
            <div className="border border-white/15 bg-white/[0.02] p-8 sm:p-12">
              <div className="flex items-center gap-3 mb-3">
                <span className="h-2 w-2 bg-bronze" />
                <span className="text-xs font-bold uppercase tracking-widest text-bronze-light">
                  {locale === "ar" ? "طلب معاودة اتصال" : "Request a Call Back"}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white mb-2">
                {locale === "ar" ? "هل لديك استفسار أو مشروع؟" : "Have a question in mind?"}
              </h2>
              <p className="text-xs sm:text-sm text-white/60 mb-8 uppercase tracking-wider">
                {locale === "ar" ? "لا تتردد في التواصل معنا. فريقنا الهندسي متاح للرد فوراً." : "Do not hesitate to contact us. Our engineering board is ready."}
              </p>

              {callbackSent ? (
                <div className="border border-bronze bg-bronze/10 p-8 text-center">
                  <span className="text-bronze font-bold text-xl block mb-2">
                    {locale === "ar" ? "تم تسجيل طلب المعاودة بنجاح" : "Callback Request Received"}
                  </span>
                  <p className="text-xs sm:text-sm text-white/70">
                    {locale === "ar"
                      ? "سيقوم مستشار المشاريع الهندسية بالتواصل معك هاتفياً في أقرب وقت."
                      : "An engineering project consultant will reach out to you shortly."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCallbackSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                        {locale === "ar" ? "الاسم *" : "What's your name? *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder={locale === "ar" ? "الاسم الكريم" : "Your name"}
                        className="w-full rounded-none border border-white/20 bg-black px-4 py-3.5 text-sm text-white placeholder-white/30 focus:border-bronze focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                        {locale === "ar" ? "الهاتف *" : "Phone *"}
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+20 100 000 0000"
                        className="w-full rounded-none border border-white/20 bg-black px-4 py-3.5 text-sm text-white placeholder-white/30 focus:border-bronze focus:outline-none"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                        {locale === "ar" ? "البريد الإلكتروني" : "Email address"}
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="client@domain.com"
                        className="w-full rounded-none border border-white/20 bg-black px-4 py-3.5 text-sm text-white placeholder-white/30 focus:border-bronze focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                        {locale === "ar" ? "نوع المشروع" : "Project Sector"}
                      </label>
                      <select
                        value={form.sector}
                        onChange={(e) => setForm({ ...form, sector: e.target.value })}
                        className="w-full rounded-none border border-white/20 bg-black px-4 py-3.5 text-sm text-white focus:border-bronze focus:outline-none appearance-none"
                      >
                        <option value="corporate">{locale === "ar" ? "مقر إداري أو مكاتب (Corporate)" : "Corporate / Administration HQ"}</option>
                        <option value="fb">{locale === "ar" ? "مطعم أو مقهى فاخر (F&B)" : "Luxury F&B Bistro / Cafe"}</option>
                        <option value="retail">{locale === "ar" ? "متجر تجاري أو أزياء (Retail)" : "Commercial Fashion Retail"}</option>
                        <option value="residential">{locale === "ar" ? "فيلا أو قصر سكني (Villa)" : "Stand-Alone Luxury Villa"}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                      {locale === "ar" ? "تفاصيل المشروع أو الاستفسار" : "Project Details / Inquiry"}
                    </label>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={locale === "ar" ? "الموقع، المساحة، الموعد المستهدف للتسليم..." : "Location, area m², target timeline..."}
                      className="w-full rounded-none border border-white/20 bg-black px-4 py-3 text-sm text-white placeholder-white/30 focus:border-bronze focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full cursor-pointer border border-white bg-white py-4 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-bronze hover:border-bronze"
                  >
                    {locale === "ar" ? "إرسال طلب المعاودة" : "Request a Call Back"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column — Official Headquarters & Information */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-bronze-light block mb-2">
                {locale === "ar" ? "— المقرات والمكاتب" : "— Find Us"}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mb-6">
                {locale === "ar" ? "المقر الرئيسي بالقاهرة" : "Cairo Executive Hub"}
              </h3>

              <div className="space-y-6 text-sm text-white/80">
                <div className="border-b border-white/10 pb-5">
                  <span className="text-[11px] uppercase tracking-widest text-white/40 block mb-1">
                    {locale === "ar" ? "العنوان الرئيسي" : "Find us"}
                  </span>
                  <p className="font-semibold text-white leading-relaxed">
                    {site.address[locale]}
                  </p>
                </div>

                <div className="border-b border-white/10 pb-5">
                  <span className="text-[11px] uppercase tracking-widest text-white/40 block mb-1">
                    {locale === "ar" ? "ورش التصنيع والاستوديو" : "Studio & Workshops"}
                  </span>
                  <p className="text-white/70">
                    {site.secondaryAddress[locale]}
                  </p>
                </div>

                <div className="border-b border-white/10 pb-5">
                  <span className="text-[11px] uppercase tracking-widest text-white/40 block mb-1">
                    {locale === "ar" ? "البريد الإلكتروني" : "Email us"}
                  </span>
                  <a href={`mailto:${site.email}`} className="font-mono text-bronze-light hover:underline">
                    {site.email}
                  </a>
                </div>

                <div className="border-b border-white/10 pb-5">
                  <span className="text-[11px] uppercase tracking-widest text-white/40 block mb-1">
                    {locale === "ar" ? "الهواتف والخط الساخن" : "Call us"}
                  </span>
                  <div className="flex flex-col gap-1 font-mono text-white">
                    <a href={`tel:${site.phone1.replace(/\s/g, "")}`} className="hover:text-bronze-light transition-colors" dir="ltr">
                      {site.phone1}
                    </a>
                    <a href={`tel:${site.phone2.replace(/\s/g, "")}`} className="hover:text-bronze-light transition-colors" dir="ltr">
                      {site.phone2}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Call to Action */}
            <div className="border border-white/15 bg-white/[0.03] p-6">
              <span className="text-xs uppercase tracking-wider text-white/60 block mb-2">
                {locale === "ar" ? "محادثة فورية مع المستشار الهندسي" : "Instant Engineering Inquiry"}
              </span>
              <a
                href={waLink("طلب استفسار مباشر من الموقع")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-3 border border-emerald-500 bg-emerald-500/10 py-3.5 text-xs font-bold uppercase tracking-widest text-emerald-400 transition-all hover:bg-emerald-500 hover:text-black"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 00-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1012 2z" />
                </svg>
                {locale === "ar" ? "تواصل عبر واتساب مباشرة" : "Direct WhatsApp Chat"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
