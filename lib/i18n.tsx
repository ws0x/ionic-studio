"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";

// Fires synchronously before first paint on the client, safely falls back on server
const useClientLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type Locale = "ar" | "en";

type Dict = Record<string, { ar: string; en: string }>;

export const dict = {
  // Navigation
  "nav.home":         { ar: "الرئيسية",      en: "Home" },
  "nav.projects":     { ar: "أعمالنا",       en: "Projects" },
  "nav.founders":     { ar: "فريقنا",        en: "Our Team" },
  "nav.testimonials": { ar: "آراء العملاء",   en: "Testimonials" },
  "nav.contact":      { ar: "تواصل معنا",    en: "Contact" },
  "nav.simulate":     { ar: "محاكاة ثلاثي الأبعاد", en: "3D Simulate" },
  "nav.track":        { ar: "تتبع مشروعك",   en: "Track Project" },
  "nav.quote":        { ar: "ابدأ مشروعك",   en: "Start Your Project" },

  // Hero
  "hero.eyebrow":    { ar: "تصميم · تشطيب · إنشاء", en: "Design · Finishing · Construction" },
  "hero.title":      { ar: "نحوّل المساحات إلى تحف معمارية", en: "We turn spaces into masterpieces" },
  "hero.subtitle":   {
    ar: "استوديو تشطيبات وتصميم داخلي راقٍ في مصر، من الرؤية حتى التسليم بمفتاح اليد، بدقة هندسية لا تقبل المساومة.",
    en: "A premium finishing and interior design studio in Egypt, from concept to turnkey delivery, with engineering precision that never compromises.",
  },
  "hero.ctaPrimary":   { ar: "ابدأ مشروعك", en: "Start your project" },
  "hero.ctaSecondary": { ar: "استعرض أعمالنا", en: "Explore our work" },

  // Stats
  "stats.projects": { ar: "مشروع منجز",   en: "Projects delivered" },
  "stats.years":    { ar: "سنة خبرة",     en: "Years of expertise" },
  "stats.clients":  { ar: "عميل راضٍ",    en: "Client satisfaction" },
  "stats.team":     { ar: "خبير ومهندس",  en: "Experts & engineers" },

  // Services section
  "services.eyebrow":  { ar: "ماذا نقدّم",             en: "What we do" },
  "services.title":    { ar: "خدمات تشطيب متكاملة",   en: "End-to-end finishing services" },
  "services.subtitle": {
    ar: "فريق واحد يتولّى كل مرحلة، فلا تتنقّل بين مقاولين.",
    en: "One team owns every stage, no juggling contractors.",
  },

  // Portfolio / Work
  "work.eyebrow":  { ar: "أعمالنا",                      en: "Selected work" },
  "work.title":    { ar: "مشاريع تتحدّث عن نفسها",      en: "Projects that speak for themselves" },
  "work.subtitle": { ar: "اختر النوع للتصفية",           en: "Filter by category" },
  "work.all":      { ar: "الكل",                         en: "All" },
  "work.viewAll":  { ar: "استعرض جميع المشاريع",         en: "View all projects" },
  "work.area":     { ar: "المساحة",                      en: "Area" },
  "work.simulateCTA": { ar: "جرّب في 3D",                en: "Simulate in 3D" },

  // Locations / Developments (inspired by reference benchmark)
  "locations.eyebrow":  { ar: "نطاق العمل",                          en: "Where we build" },
  "locations.title":    { ar: "مشاريعنا في أرقى الوجهات بمصر",       en: "Delivering across Egypt's premier destinations" },
  "locations.subtitle": {
    ar: "من المجمعات السكنية الراقية بالقاهرة الجديدة والشيخ زايد إلى مقرات العاصمة الإدارية وشاليهات الساحل.",
    en: "From premier residential compounds in New Cairo and Zayed to corporate offices in the New Capital and coastal retreats.",
  },

  // About
  "about.eyebrow": { ar: "من نحن",                          en: "Who we are" },
  "about.title":   { ar: "هندسة الأناقة، تشطيب الثقة",     en: "Engineering elegance, finishing trust" },
  "about.body1": {
    ar: "دار أيونيك ديزاين شركة تشطيبات وتصميم داخلي مصرية تجمع بين الحس الجمالي والانضباط الهندسي. نؤمن أن المساحة الراقية تُبنى على التفاصيل الدقيقة، والمواعيد المحترمة، والشفافية الكاملة.",
    en: "Ionic Design House is an Egyptian finishing and interior design company that blends aesthetic sensibility with engineering discipline. We believe refined spaces are built on fine detail, respected deadlines, and full transparency.",
  },
  "about.body2": {
    ar: "من الشقق السكنية إلى المكاتب والمحلات التجارية، نسلّم مشاريع بمفتاح اليد جاهزة للحياة، لا مفاجآت ولا تجاوزات.",
    en: "From residential apartments to offices and retail, we deliver turnkey projects ready for life, no surprises, no overruns.",
  },
  "about.f1": { ar: "أسعار شفافة وعقود واضحة",           en: "Transparent pricing & clear contracts" },
  "about.f2": { ar: "التزام صارم بالمواعيد",              en: "Strict deadline commitment" },
  "about.f3": { ar: "إشراف هندسي على كل مرحلة",          en: "Engineering supervision at every stage" },
  "about.f4": { ar: "ضمان على أعمال التشطيب",             en: "Warranty on all finishing work" },

  // Testimonials
  "testimonials.eyebrow": { ar: "آراء العملاء",                    en: "Client voices" },
  "testimonials.title":   { ar: "ثقة تُبنى مشروعاً تلو الآخر",   en: "Trust built project by project" },
  "testimonials.viewAll": { ar: "جميع الشهادات",                   en: "Read all testimonials" },

  // Founders
  "founders.eyebrow":   { ar: "الفريق المؤسس",           en: "The founding team" },
  "founders.title":     { ar: "الرؤية وراء الأعمال",     en: "The vision behind the work" },
  "founders.subtitle":  {
    ar: "قوة دار أيونيك ديزاين تكمن في مزيج نادر: رؤية معمارية إبداعية تلتقي بإتقان هندسي صارم.",
    en: "Ionic Design House's strength lies in a rare combination: creative architectural vision meeting rigorous engineering mastery.",
  },
  "founders.viewAll":   { ar: "تعرّف على المؤسسَين",     en: "Meet the founders" },
  "founders.credentials": { ar: "المؤهلات والخبرات",     en: "Credentials & experience" },

  // Quote form
  "quote.eyebrow":    { ar: "ابدأ الآن",                  en: "Start now" },
  "quote.title":      { ar: "احصل على عرض سعر مجاني",    en: "Get a free consultation" },
  "quote.subtitle": {
    ar: "أخبرنا عن مشروعك وسنرسل لك عرضاً مفصّلاً عبر واتساب خلال ساعات.",
    en: "Tell us about your project and we'll send a detailed proposal via WhatsApp within hours.",
  },
  "quote.name":       { ar: "الاسم الكامل",   en: "Full name" },
  "quote.namePh":     { ar: "اسمك الكامل",    en: "Your full name" },
  "quote.phone":      { ar: "رقم الهاتف",     en: "Phone number" },
  "quote.phonePh":    { ar: "01xxxxxxxxx",     en: "01xxxxxxxxx" },
  "quote.type":       { ar: "نوع المشروع",    en: "Project type" },
  "quote.area":       { ar: "المساحة (م²)",   en: "Area (m²)" },
  "quote.areaPh":     { ar: "مثال: 150",      en: "e.g. 150" },
  "quote.city":       { ar: "المدينة / المنطقة", en: "City / District" },
  "quote.cityPh":     { ar: "مثال: التجمع الخامس", en: "e.g. New Cairo" },
  "quote.details":    { ar: "تفاصيل إضافية",  en: "Additional details" },
  "quote.detailsPh":  { ar: "احكِ لنا عن مشروعك…", en: "Tell us about your project…" },
  "quote.submit":     { ar: "أرسل عبر واتساب",  en: "Send via WhatsApp" },
  "quote.required":   { ar: "الرجاء إدخال الاسم ورقم الهاتف.", en: "Please enter your name and phone." },
  "quote.selectType": { ar: "اختر النوع",     en: "Select type" },
  "quote.stage":       { ar: "مرحلة الوحدة", en: "Current unit stage" },
  "quote.stagePh":     { ar: "اختر مرحلة التشطيب", en: "Select stage" },
  "quote.submitting":  { ar: "جارٍ الإرسال والتسجيل…", en: "Submitting & registering…" },
  "quote.successTitle": { ar: "تم تسجيل طلبك بنجاح!", en: "Request Registered Successfully!" },
  "quote.successRef":  { ar: "رقم المرجع", en: "Reference ID" },
  "quote.successCta":  { ar: "متابعة المحادثة في واتساب", en: "Continue in WhatsApp" },

  // Cost Estimator
  "estimator.eyebrow":     { ar: "حاسبة التشطيب الشفافة",                  en: "Transparent Finishing Calculator" },
  "estimator.title":       { ar: "احسب تكلفة تشطيب وحدتك بدقة",           en: "Estimate Your Turnkey Finishing Cost" },
  "estimator.subtitle":    {
    ar: "حدد مساحة وحدتك والباقة المناسبة للاطلاع على ميزانية التنفيذ التقديرية بالجنيه المصري وجدول التسليم.",
    en: "Select your unit area and preferred package to preview the estimated turnkey budget in EGP and delivery timeframe.",
  },
  "estimator.areaLabel":   { ar: "مساحة الوحدة الإجمالية",                 en: "Total Unit Area" },
  "estimator.areaUnit":    { ar: "م²",                                    en: "m²" },
  "estimator.packageLabel":{ ar: "اختر باقة التشطيب",                     en: "Select Finishing Package" },
  "estimator.rateUnit":    { ar: "ج.م / م²",                              en: "EGP / m²" },
  "estimator.estBudget":   { ar: "الميزانية التقديرية الإجمالية",           en: "Estimated Total Budget" },
  "estimator.turnaround":  { ar: "مدة التنفيذ المتوقعة",                  en: "Estimated Turnaround" },
  "estimator.months":      { ar: "أشهر",                                  en: "Months" },
  "estimator.included":    { ar: "المواصفات وما تشمله الباقة",            en: "What's Included in This Tier" },
  "estimator.bookSurvey":  { ar: "احجز معاينة وجدول كميات مفصل (BOQ)",     en: "Book Site Survey & Detailed BOQ" },
  "estimator.simulateCta": { ar: "خصّص الخامات في محاكي 3D",              en: "Customize Materials in 3D Simulator" },
  "estimator.disclaimer":  {
    ar: "* التكلفة تقديرية استرشادية بناءً على خامات 2026. تعتمد التكلفة النهائية على المعاينة الهندسية للموقع وجدول الكميات (BOQ) التعاقدي.",
    en: "* Estimated budget based on 2026 premium market rates. Final pricing is confirmed following physical site inspection and contract BOQ.",
  },

  // Before & After Transformations
  "beforeAfter.eyebrow":     { ar: "رحلة التحول المعماري",             en: "Architectural Transformation" },
  "beforeAfter.title":       { ar: "من المحارة إلى تسليم مفتاح راقٍ",   en: "From Core & Shell to Turnkey Luxury" },
  "beforeAfter.subtitle":    {
    ar: "اسحب المؤشر التفاعلي لمشاهدة الفارق الاستثنائي بين مرحلة الإنشاء الأولية والنتيجة المعمارية النهائية.",
    en: "Drag the interactive slider to experience the dramatic transformation between raw construction and turnkey elegance.",
  },
  "beforeAfter.beforeLabel": { ar: "على المحارة / مرحلة أولى",         en: "Before: Core & Shell" },
  "beforeAfter.afterLabel":  { ar: "تسليم مفتاح / النتيجة",            en: "After: Turnkey Handover" },
  "beforeAfter.duration":    { ar: "المدة التعاقدية",                  en: "Contract Timeline" },
  "beforeAfter.compound":    { ar: "الكمبوند والموقع",                 en: "Compound & Location" },

  // Contact
  "contact.eyebrow":  { ar: "تواصل",              en: "Get in touch" },
  "contact.title":    { ar: "لنبدأ مشروعك",       en: "Let's start your project" },
  "contact.whatsapp": { ar: "راسلنا على واتساب",  en: "Chat on WhatsApp" },
  "contact.call":     { ar: "اتصل بنا",           en: "Call us" },
  "contact.phone":    { ar: "الهاتف",             en: "Phone" },
  "contact.email":    { ar: "البريد الإلكتروني",  en: "Email" },
  "contact.address":  { ar: "العنوان",            en: "Address" },
  "contact.hours":    { ar: "ساعات العمل",        en: "Working hours" },

  // Footer
  "footer.rights": { ar: "جميع الحقوق محفوظة",    en: "All rights reserved" },
  "footer.tagline": { ar: "صُمّم بأناقة في مصر",  en: "Crafted with elegance in Egypt" },

  // WhatsApp default message
  "cta.whatsappDefault": {
    ar: "مرحباً أيونيك ديزاين هاوس، أرغب في الاستفسار عن خدمات التصميم والتشطيب.",
    en: "Hello Ionic Design House, I'd like to inquire about your design and finishing services.",
  },
} satisfies Dict;

export type DictKey = keyof typeof dict;

type Ctx = {
  locale: Locale;
  dir: "rtl" | "ltr";
  t: (key: DictKey) => string;
  tx: (pair: { ar: string; en: string }) => string;
  toggle: () => void;
  setLocale: (l: Locale) => void;
};

const LocaleContext = createContext<Ctx | null>(null);

export function LocaleProvider({
  children,
  initialLocale = "en",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useClientLayoutEffect(() => {
    const stored = window.localStorage.getItem("locale") as Locale | null;
    if (stored === "ar" || stored === "en") setLocaleState(stored);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    html.dir = locale === "ar" ? "rtl" : "ltr";
    try { window.localStorage.setItem("locale", locale); } catch {}
  }, [locale]);

  const t = useCallback((key: DictKey) => dict[key][locale], [locale]);
  const tx = useCallback((pair: { ar: string; en: string }) => pair[locale], [locale]);
  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);
  const toggle = useCallback(() => setLocaleState((l) => (l === "ar" ? "en" : "ar")), []);

  return (
    <LocaleContext.Provider value={{ locale, dir: locale === "ar" ? "rtl" : "ltr", t, tx, toggle, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

export function useI18n() {
  const ctx = useLocale();
  return {
    ...ctx,
    isAr: ctx.locale === "ar",
  };
}
