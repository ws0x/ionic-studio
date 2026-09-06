export type Bi = { ar: string; en: string };

// ─── Stats ───────────────────────────────────────────────────────────────────
export const stats: { value: string; label: Bi }[] = [
  { value: "250+", label: { ar: "مشروع منجز", en: "Projects delivered" } },
  { value: "12", label: { ar: "سنة خبرة", en: "Years of expertise" } },
  { value: "98%", label: { ar: "نسبة رضا العملاء", en: "Client satisfaction" } },
  { value: "40+", label: { ar: "خبير ومهندس", en: "Experts & engineers" } },
];

// ─── Services ─────────────────────────────────────────────────────────────────
export type Service = { icon: string; title: Bi; desc: Bi };
export const services: Service[] = [
  {
    icon: "M3 21h18M5 21V7l8-4 8 4v14M9 21v-6h6v6",
    title: { ar: "تشطيبات متكاملة", en: "Full Finishing" },
    desc: {
      ar: "تشطيب الوحدة بالكامل من المحارة حتى التسليم بمفتاح اليد بمواد راقية.",
      en: "Complete unit finishing from plaster to turnkey handover with premium materials.",
    },
  },
  {
    icon: "M4 7h16M4 12h16M4 17h10",
    title: { ar: "تصميم داخلي", en: "Interior Design" },
    desc: {
      ar: "تصاميم ثلاثية الأبعاد تترجم ذوقك إلى واقع قبل البدء في التنفيذ.",
      en: "3D concepts that translate your vision into reality before a single wall is touched.",
    },
  },
  {
    icon: "M12 3l9 6-9 6-9-6 9-6zM3 15l9 6 9-6",
    title: { ar: "ديكورات جبس وأسقف", en: "Gypsum & Ceilings" },
    desc: {
      ar: "أسقف معلقة وبارتيشن وكرانيش بتفاصيل حِرفية وإضاءة مخفية.",
      en: "Suspended ceilings, partitions and cornices with artisanal detail and hidden lighting.",
    },
  },
  {
    icon: "M3 10h18M7 10V6a5 5 0 0110 0v4M5 10v11h14V10",
    title: { ar: "مطابخ ودريسنج", en: "Kitchens & Dressing" },
    desc: {
      ar: "مطابخ ودريسنج بتصميم عملي وخامات تدوم لسنوات.",
      en: "Kitchens and dressing rooms with functional layouts and enduring materials.",
    },
  },
  {
    icon: "M9 21V9h6v12M4 21V3h16v18",
    title: { ar: "دهانات وحوائط فاخرة", en: "Paint & Wall Finishes" },
    desc: {
      ar: "دهانات بجودة معمارية، ورق جدران، وتشطيبات حوائط استثنائية.",
      en: "Architectural-grade paints, designer wallpaper, and exceptional wall treatments.",
    },
  },
  {
    icon: "M6 3h12l3 7-9 11L3 10z",
    title: { ar: "أعمال إنشائية", en: "Construction Works" },
    desc: {
      ar: "بناء وتعديل وترميم بإشراف هندسي معتمد وضمان على الأعمال.",
      en: "Building, modification and renovation under certified engineering supervision.",
    },
  },
];

// ─── Projects ─────────────────────────────────────────────────────────────────
export type Project = {
  title: Bi;
  desc: Bi;
  category: Bi;
  categoryKey: "residential" | "commercial" | "office" | "hospitality";
  location: Bi;
  image: string;
  area?: string;
  year?: string;
  scope?: Bi;
  highlights?: Bi[];
};

const U = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const projectFilters: { key: Project["categoryKey"] | "all"; label: Bi }[] = [
  { key: "all", label: { ar: "الكل", en: "All" } },
  { key: "residential", label: { ar: "سكني", en: "Residential" } },
  { key: "commercial", label: { ar: "تجاري", en: "Commercial" } },
  { key: "office", label: { ar: "مكاتب", en: "Office" } },
  { key: "hospitality", label: { ar: "ضيافة", en: "Hospitality" } },
];

export const projects: Project[] = [
  {
    title: { ar: "فيلا التجمع الخامس", en: "New Cairo Villa" },
    desc: {
      ar: "فيلا سكنية فاخرة بتصميم داخلي معاصر وتشطيبات بمواد إيطالية رخامية معمارية.",
      en: "Luxury residential villa with contemporary interiors and Italian finishing materials.",
    },
    category: { ar: "سكني", en: "Residential" },
    categoryKey: "residential",
    location: { ar: "القاهرة الجديدة", en: "New Cairo" },
    area: "650 m²",
    year: "2025",
    scope: { ar: "تشطيب كامل بمفتاح اليد + تصميم داخلي", en: "Turnkey Finishing + Interior Architecture" },
    highlights: [
      { ar: "رخام ستاتوريو إيطالي للأرضيات", en: "Italian Statuario Marble Flooring" },
      { ar: "أنظمة إضاءة ذكية مخفية", en: "Architectural Concealed Smart Lighting" },
      { ar: "تكسيات خشبية وتوزيع فراغات مخصص", en: "Bespoke Acoustic Wall Paneling" },
    ],
    image: U("1600585154340-be6161a56a0c"),
  },
  {
    title: { ar: "شقة الشيخ زايد", en: "Sheikh Zayed Penthouse" },
    desc: {
      ar: "بنتهاوس حديث بمساحات مفتوحة وأسقف مزدوجة الارتفاع وتوزيع إضاءة طبيعية مدروس.",
      en: "Modern penthouse with open-plan living and double-height ceilings.",
    },
    category: { ar: "سكني", en: "Residential" },
    categoryKey: "residential",
    location: { ar: "الشيخ زايد", en: "Sheikh Zayed" },
    area: "420 m²",
    year: "2024",
    scope: { ar: "تصميم داخلي + تنفيذ ديكورات متكاملة", en: "Interior Design + Turnkey Execution" },
    highlights: [
      { ar: "أسقف مزدوجة مع جبسوم بورد معلق", en: "Double-Height Ceilings & Custom Gypsum" },
      { ar: "أرضيات باركيه خشب طبيعي معالج", en: "Engineered Hardwood Flooring" },
      { ar: "مطبخ ودريسنج بتفصيل معماري", en: "Custom Minimalist Kitchen & Dressing" },
    ],
    image: U("1586023492125-27b2c045efd7"),
  },
  {
    title: { ar: "مكاتب العاصمة الإدارية", en: "New Capital Corporate HQ" },
    desc: {
      ar: "مقر شركة بتصميم مؤسسي راقٍ يعكس هوية العلامة التجارية ويحقق أعلى معايير بيئة العمل.",
      en: "Corporate headquarters with premium institutional design reflecting brand identity.",
    },
    category: { ar: "مكاتب", en: "Office" },
    categoryKey: "office",
    location: { ar: "العاصمة الإدارية", en: "New Capital" },
    area: "1,200 m²",
    year: "2024",
    scope: { ar: "تشطيب مقرات ومكاتب متكامل (MEP + Fit-out)", en: "Complete Corporate Fit-out & MEP" },
    highlights: [
      { ar: "قواطع زجاجية عازلة للصوت", en: "Acoustic Glass Partitions" },
      { ar: "قاعات اجتماعات ذكية بنظام أوتوميشن", en: "Automated Conference Suites" },
      { ar: "أنظمة تكييف مركزي وكهرباء معتمدة", en: "Engineered Central HVAC & Electromechanical" },
    ],
    image: U("1497366811353-6870744d04b2"),
  },
  {
    title: { ar: "بوتيك المعادي", en: "Maadi Luxury Boutique" },
    desc: {
      ar: "محل بيع بالتجزئة بتصميم يُحوّل تجربة التسوق إلى فن معماري ساحر وجذاب.",
      en: "Retail boutique that transforms the shopping experience into an art form.",
    },
    category: { ar: "تجاري", en: "Commercial" },
    categoryKey: "commercial",
    location: { ar: "المعادي", en: "Maadi" },
    area: "280 m²",
    year: "2023",
    scope: { ar: "تشطيب تجاري سريع بمواصفات عالمية", en: "Commercial Retail Fit-out" },
    highlights: [
      { ar: "واجهات زجاجية وتوزيع إضاءة مسرحي", en: "Custom Display Windows & Focal Lighting" },
      { ar: "تشطيبات أسمنتية ميكروسيمنت فاخرة", en: "Premium Microcement Floor Finishes" },
    ],
    image: U("1441986300917-64674bd600d8"),
  },
  {
    title: { ar: "منتجع الساحل الشمالي", en: "North Coast Resort Villa" },
    desc: {
      ar: "فيلا ساحلية بأسلوب معماري متوسطي مع لمسات معاصرة راقية ومقاومة للعوامل الجوية.",
      en: "Coastal villa with Mediterranean architecture and refined contemporary touches.",
    },
    category: { ar: "سكني", en: "Residential" },
    categoryKey: "residential",
    location: { ar: "الساحل الشمالي", en: "North Coast" },
    area: "480 m²",
    year: "2023",
    scope: { ar: "تشطيب مصيفي متكامل وخامات مقاومة للرطوبة", en: "Coastal Turnkey Villa & Moisture-Proof Finishes" },
    highlights: [
      { ar: "تراسات خارجية بحجر طبيعي معالج", en: "Weatherproof Natural Stone Terraces" },
      { ar: "ألوان شاطئية وأخشاب التيك المقاومة", en: "Teak Accents & Mediterranean Palette" },
    ],
    image: U("1502672260266-1c1ef2d93688"),
  },
  {
    title: { ar: "مجمع ضيافة وسط البلد", en: "Downtown Hospitality Suite" },
    desc: {
      ar: "فضاء ضيافة فاخر يمزج بين التراث المصري والأناقة المعاصرة.",
      en: "Luxury hospitality space blending Egyptian heritage with contemporary elegance.",
    },
    category: { ar: "ضيافة", en: "Hospitality" },
    categoryKey: "hospitality",
    location: { ar: "وسط البلد", en: "Downtown Cairo" },
    area: "340 m²",
    image: U("1631049307264-da0ec9d70304"),
  },
  {
    title: { ar: "مساحة عمل مشتركة", en: "Premium Co-working Space" },
    desc: {
      ar: "مساحة عمل معاصرة تعزز الإنتاجية والإلهام في آنٍ واحد.",
      en: "Contemporary work environment designed to boost productivity and inspire creativity.",
    },
    category: { ar: "مكاتب", en: "Office" },
    categoryKey: "office",
    location: { ar: "أكتوبر", en: "6th of October" },
    area: "560 m²",
    image: U("1497215728101-856f4ea42174"),
  },
  {
    title: { ar: "عيادة طبية متكاملة", en: "Premium Medical Clinic" },
    desc: {
      ar: "عيادة طبية بتصميم يوازن بين الحياد العلمي والدفء الإنساني.",
      en: "Medical clinic balancing clinical neutrality with human warmth.",
    },
    category: { ar: "تجاري", en: "Commercial" },
    categoryKey: "commercial",
    location: { ar: "مدينة نصر", en: "Nasr City" },
    area: "310 m²",
    image: U("1505693416388-ac5ce068fe85"),
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
export type Testimonial = { quote: Bi; name: Bi; role: Bi; stars: number };
export const testimonials: Testimonial[] = [
  {
    stars: 5,
    quote: {
      ar: "سلّموا فيلتي في الموعد بالضبط والتشطيب يفوق ما تخيلت. فريق محترف جداً وشفافية كاملة في كل خطوة. أيونيك ديزاين هاوس هي المعيار.",
      en: "They delivered my villa exactly on time, finished beyond what I imagined. Extremely professional team with full transparency at every step. Ionic Design House is the benchmark.",
    },
    name: { ar: "أحمد سمير", en: "Ahmed Samir" },
    role: { ar: "صاحب فيلا، التجمع الخامس", en: "Villa Owner, New Cairo" },
  },
  {
    stars: 5,
    quote: {
      ar: "حوّلوا مكتبنا إلى مساحة تليق بعملائنا. الاحترافية والذوق في كل تفصيلة. لا أتخيل التعامل مع أحد غيرهم.",
      en: "They turned our office into a space worthy of our clients. Professionalism and refined taste in every detail. I can't imagine working with anyone else.",
    },
    name: { ar: "منى خليل", en: "Mona Khalil" },
    role: { ar: "مديرة تنفيذية", en: "Chief Executive Officer" },
  },
  {
    stars: 5,
    quote: {
      ar: "أفضل قرار اتخذته هو التعامل مع شريف ومحمد. الميزانية محترمة والنتيجة تحفة معمارية حقيقية.",
      en: "The best decision I made was working with Sherif and Mohamed. Budget respected, the result a true architectural masterpiece.",
    },
    name: { ar: "كريم فؤاد", en: "Karim Fouad" },
    role: { ar: "مستثمر عقاري", en: "Real-estate Developer" },
  },
  {
    stars: 5,
    quote: {
      ar: "تعاملت معهم في مشروعين متتاليين وسأتعامل معهم في الثالث. الجودة ثابتة والتواصل سلس والنتائج دائماً مذهلة.",
      en: "Worked with them on two consecutive projects and will on the third. Consistent quality, smooth communication, always breathtaking results.",
    },
    name: { ar: "سارة إبراهيم", en: "Sara Ibrahim" },
    role: { ar: "مصممة أزياء، الزمالك", en: "Fashion Designer, Zamalek" },
  },
  {
    stars: 5,
    quote: {
      ar: "التفاصيل الدقيقة هي ما يميزهم. يلاحظون ما لا تلاحظه أنت وينفّذونه بإتقان. استوديو لا مثيل له في مصر.",
      en: "Fine detail is what sets them apart. They notice what you don't and execute it with mastery. A studio without equal in Egypt.",
    },
    name: { ar: "خالد منصور", en: "Khaled Mansour" },
    role: { ar: "مهندس معماري", en: "Architect" },
  },
  {
    stars: 5,
    quote: {
      ar: "بنوا لي مطعمي من الصفر وكانوا شركاء حقيقيين في الرؤية. العملاء يمدحون المكان بشكل مستمر.",
      en: "They built my restaurant from scratch and were true partners in vision. Clients constantly praise the space.",
    },
    name: { ar: "نادين عمر", en: "Nadine Omar" },
    role: { ar: "صاحبة مطعم، المعادي", en: "Restaurant Owner, Maadi" },
  },
];

// ─── Founders ─────────────────────────────────────────────────────────────────
export type Founder = {
  name: Bi;
  title: Bi;
  bio1: Bi;
  bio2: Bi;
  quote: Bi;
  image: string;
  credentials: Bi[];
};

export const founders: Founder[] = [
  {
    name: { ar: "شريف المغالاوي", en: "Sherif El-Maghalawy" },
    title: { ar: "المؤسس والمدير الإبداعي", en: "Founder & Creative Director" },
    bio1: {
      ar: "أسس شريف المغالاوي دار أيونيك ديزاين بنظرة واحدة راسخة: أن كل مساحة تستحق أن تكون استثنائية. خريج كلية الهندسة بخبرة تمتد لأكثر من 15 عاماً في تحويل الفراغات السكنية والتجارية والفندقية في مصر والعالم العربي.",
      en: "Sherif El-Maghalawy founded Ionic Design House with a singular conviction: that every space deserves to be extraordinary. A graduate of the Faculty of Engineering, Architecture Department, with over 15 years transforming residential, commercial, and hospitality spaces across Egypt and the Arab world.",
    },
    bio2: {
      ar: "تمزج فلسفته التصميمية بين التناسب الكلاسيكي والتكثيف المعاصر، مساحات تتنفس وتدوم وتلهم. يؤمن شريف أن الفخامة ليست مسألة تكلفة، بل مسألة نية في اختيار المواد ودقة التنفيذ وعمق الفهم بين المصمم والعميل.",
      en: "His design philosophy merges classical proportion with contemporary restraint, spaces that breathe, endure, and inspire. Sherif believes that luxury is not a matter of cost, but of intention: in the selection of materials, the precision of execution, and the depth of understanding between designer and client.",
    },
    quote: {
      ar: "\"نحن لا نصمم غرفاً. نصمم حياة.\"",
      en: "\"We do not design rooms. We design lives.\"",
    },
    image: U("1507003211169-0a1dd7228f2d", 800),
    credentials: [
      { ar: "كلية الهندسة، قسم العمارة", en: "Faculty of Engineering, Architecture" },
      { ar: "+15 سنة خبرة", en: "15+ Years Experience" },
      { ar: "مصر والعالم العربي", en: "Egypt & Arab World" },
    ],
  },
  {
    name: { ar: "محمد أشرف", en: "Mohamed Ashraf" },
    title: { ar: "المؤسس المشارك ومدير المشاريع", en: "Co-Founder & Head of Projects" },
    bio1: {
      ar: "شارك محمد أشرف في تأسيس دار أيونيك ديزاين حاملاً معه إتقاناً في علوم الإنشاء وإدارة المشاريع. حيث يحلم شريف بالفراغات والأضواء، يحوّل محمد تلك الأحلام إلى واقع في الموعد المحدد، ضمن الميزانية، وبلا تنازلات.",
      en: "Mohamed Ashraf co-founded Ionic Design House bringing a mastery of construction science and project delivery. Where Sherif dreams in space and light, Mohamed engineers those dreams into reality, on time, within budget, and without compromise.",
    },
    bio2: {
      ar: "بخلفيته في إدارة البناء وشغفه بالفن التقني للتشطيب الراقي، يشرف محمد على كل مشروع من الأساس حتى اللمسة الأخيرة. جنباً إلى جنب مع شريف، أسّسا ستوديو تتلازم فيه الرؤية الإبداعية والدقة الهندسية بشكل لا انفصام فيه.",
      en: "With a background in construction management and a passion for the technical artistry of fine finishing, Mohamed oversees every project from foundation to final touch. Together with Sherif, they built a studio where creative vision and engineering precision are inseparable.",
    },
    quote: {
      ar: "\"التميز في التنفيذ هو ما يحوّل التصميم الجيد إلى فن خالد.\"",
      en: "\"Excellence in execution is what transforms good design into timeless art.\"",
    },
    image: U("1472099645785-5658abf4ff4e", 800),
    credentials: [
      { ar: "إدارة البناء والمشاريع", en: "Construction & Project Management" },
      { ar: "+12 سنة خبرة", en: "12+ Years Experience" },
      { ar: "250+ مشروع منجز", en: "250+ Projects Delivered" },
    ],
  },
];

export const projectTypeOptions: { value: string; label: Bi }[] = [
  { value: "full-finishing", label: { ar: "تشطيب كامل", en: "Full finishing" } },
  { value: "interior-design", label: { ar: "تصميم داخلي", en: "Interior design" } },
  { value: "renovation", label: { ar: "تجديد / ترميم", en: "Renovation" } },
  { value: "commercial", label: { ar: "محل / تجاري", en: "Retail / commercial" } },
  { value: "office", label: { ar: "مكتب", en: "Office" } },
  { value: "hospitality", label: { ar: "ضيافة / مطعم", en: "Hospitality / restaurant" } },
  { value: "other", label: { ar: "أخرى", en: "Other" } },
];

export const projectStageOptions: { value: string; label: Bi }[] = [
  { value: "core_shell", label: { ar: "طوب أحمر / على المحارة (Core & Shell)", en: "Core & Shell / Red Brick" } },
  { value: "semi_finished", label: { ar: "نصف تشطيب (تأسيس كهرباء وسباكة)", en: "Semi-Finished (MEP Rough-in)" } },
  { value: "renovation", label: { ar: "تجديد شامل وإعادة تأهيل", en: "Full Renovation / Remodeling" } },
  { value: "interior_3d", label: { ar: "تصميم داخلي ومحاكاة 3D فقط", en: "Interior Design & 3D Only" } },
];

export type PrimeLocation = {
  name: Bi;
  district: Bi;
  compounds: Bi;
};

export const primeLocations: PrimeLocation[] = [
  {
    name: { ar: "القاهرة الجديدة", en: "New Cairo" },
    district: { ar: "التجمع الخامس والمثلث الذهبي", en: "5th Settlement & Golden Square" },
    compounds: { ar: "ميفيدا · بالم هيلز · قطامية ديونز", en: "Mivida · Palm Hills · Katameya Dunes" },
  },
  {
    name: { ar: "الشيخ زايد وأكتوبر", en: "Sheikh Zayed & October" },
    district: { ar: "غرب القاهرة", en: "West Cairo" },
    compounds: { ar: "اليجريا · سوديك ويست · بيفرلي هيلز", en: "Allegria · SODIC West · Beverly Hills" },
  },
  {
    name: { ar: "العاصمة الإدارية", en: "New Administrative Capital" },
    district: { ar: "الحي المالي والدبلوماسي", en: "Financial & Diplomatic Districts" },
    compounds: { ar: "أبراج ومقرات إدارية فاخرة", en: "Corporate HQs & Prestige Towers" },
  },
  {
    name: { ar: "الساحل الشمالي", en: "North Coast" },
    district: { ar: "الساحل الشرير ورأس الحكمة", en: "Sahel & Ras El Hekma" },
    compounds: { ar: "هاسيندا · مراسي · ألماظة باي", en: "Hacienda · Marassi · Almaza Bay" },
  },
  {
    name: { ar: "دمياط والدلتا", en: "Damietta & Delta" },
    district: { ar: "الواجهة البحرية والمنصورة", en: "Waterfront & Mansoura" },
    compounds: { ar: "فيلات سكنية ومقرات تجارية", en: "Signature Coastal & Commercial Villas" },
  },
];

// ─── Finishing Packages (Cost Estimator) ──────────────────────────────────────
export type FinishingPackage = {
  id: "signature" | "prestige" | "bespoke";
  name: Bi;
  tagline: Bi;
  minRate: number; // EGP / m2
  maxRate: number; // EGP / m2
  turnaroundMonths: number;
  features: Bi[];
};

export const finishingPackages: FinishingPackage[] = [
  {
    id: "signature",
    name: { ar: "سيجنتشر", en: "Signature" },
    tagline: {
      ar: "تشطيب راقٍ متوازن للمساحات السكنية العصرية",
      en: "Refined turnkey finishes for modern living",
    },
    minRate: 9500,
    maxRate: 12500,
    turnaroundMonths: 3,
    features: [
      {
        ar: "تأسيس سباكة وكهرباء معتمد بضمان 10 سنوات (السويدي / الشريف)",
        en: "Certified MEP rough-in with 10-yr warranty (El Sewedy / El Sherif)",
      },
      {
        ar: "أرضيات بورسلين فرز أول وأسقف جبس بورد مستوية",
        en: "1st-choice porcelain tiles & flush gypsum-board ceilings",
      },
      {
        ar: "دهانات جوتن فينوماستيك ومفاتيح شنايدر إلكتريك",
        en: "Jotun Fenomastic luxury paints & Schneider Electric switches",
      },
      {
        ar: "أطقم حمامات ديورافيت / إيديال وخلاطات مستوردة",
        en: "Duravit / Ideal Standard sanitary ware & imported mixers",
      },
      {
        ar: "إشراف هندسي دوري وجدول زمني ملزم بالعقد",
        en: "Periodic engineering supervision & contractually binding schedule",
      },
    ],
  },
  {
    id: "prestige",
    name: { ar: "بريستيج", en: "Prestige" },
    tagline: {
      ar: "فخامة معمارية بمواد مستوردة وأنظمة سمارت",
      en: "Architectural luxury with imported materials & smart tech",
    },
    minRate: 14000,
    maxRate: 18500,
    turnaroundMonths: 4,
    features: [
      {
        ar: "رخام إيطالي أو إسباني مستورد لبهو الاستقبال والمعيشة",
        en: "Imported Italian or Spanish marble for reception & living",
      },
      {
        ar: "تجاليد جدارية خشبية وتنسيق إضاءة مخفية هندسية",
        en: "Wood wall panelling & architectural indirect cove illumination",
      },
      {
        ar: "تأسيس بنية سمارت هوم (تحكم بالإضاءة والتكييف)",
        en: "Smart Home automation infrastructure (lighting & HVAC)",
      },
      {
        ar: "أبواب قشرة أرو طبيعية وقطاعات ألومنيوم جامبو عازلة",
        en: "Natural oak veneer solid doors & acoustic Jumbo aluminum sections",
      },
      {
        ar: "محاكاة 3D كاملة وبث مباشر لمتابعة تقدم الموقع أسبوعياً",
        en: "Full 3D simulation with weekly digital site progress updates",
      },
    ],
  },
  {
    id: "bespoke",
    name: { ar: "بيسبوك رويال", en: "Bespoke Royal" },
    tagline: {
      ar: "تصميم وتنفيذ استثنائي كاستم بلا أي تنازلات",
      en: "Uncompromising haute-couture architectural execution",
    },
    minRate: 22000,
    maxRate: 28000,
    turnaroundMonths: 6,
    features: [
      {
        ar: "رخام ستاتوريو / كلكتا بوكماتش وأرضيات باركيه أرو ماسيف",
        en: "Statuario/Calacatta bookmatch marble & solid oak parquet",
      },
      {
        ar: "نظام سمارت هوم متكامل (KNX/Control4: إضاءة، تكييف، صوتيات، ستائر)",
        en: "Comprehensive Smart Home (KNX/Control4: lighting, HVAC, audio, shades)",
      },
      {
        ar: "مطابخ ودريسنج روم كاستم مع إكسسوارات بلوم النمساوية",
        en: "Custom designer kitchen & walk-in dressing with Austrian Blum fittings",
      },
      {
        ar: "تكييف مركزي مخفي (Concealed / VRV) مع مخارج هواء خطية",
        en: "Concealed / VRV central climate control with linear diffusers",
      },
      {
        ar: "مدير مشروع مخصص لكل عميل مع ضمان شامل 3 سنوات على التشطيب",
        en: "Dedicated senior project director & 3-year comprehensive warranty",
      },
    ],
  },
];

// ─── Before & After Transformations ──────────────────────────────────────────
export type BeforeAfterShowcase = {
  id: string;
  title: Bi;
  compound: Bi;
  location: Bi;
  duration: Bi;
  scope: Bi;
  beforeImage: string;
  afterImage: string;
};

export const beforeAfterCases: BeforeAfterShowcase[] = [
  {
    id: "mivida-reception",
    title: { ar: "بهو استقبال فيلا ميفيدا", en: "Mivida Grand Villa Reception" },
    compound: { ar: "كمبوند ميفيدا · إعمار مصر", en: "Mivida Compound · Emaar Misr" },
    location: { ar: "القاهرة الجديدة", en: "New Cairo" },
    duration: { ar: "4 أشهر", en: "4 Months" },
    scope: {
      ar: "من المحارة إلى تسليم مفتاح مع رخام ستاتوريو إيطالي وجبسوم بورد إضاءة مخفية",
      en: "From raw plaster to turnkey handover with Italian Statuario marble & cove lighting",
    },
    beforeImage: U("1503387762-592deb58ef4e"),
    afterImage: U("1600585154340-be6161a56a0c"),
  },
  {
    id: "allegria-penthouse",
    title: { ar: "بنتهاوس اليجريا بيفرلي هيلز", en: "Allegria Penthouse Residence" },
    compound: { ar: "اليجريا · سوديك ويست", en: "Allegria · SODIC West" },
    location: { ar: "الشيخ زايد", en: "Sheikh Zayed" },
    duration: { ar: "3.5 أشهر", en: "3.5 Months" },
    scope: {
      ar: "تعديل معماري شامل، تكسيات أرو ماسيف، وتأسيس سمارت هوم كامل",
      en: "Full spatial restructuring, natural oak cladding & full Smart Home automation",
    },
    beforeImage: U("1541888946425-d0fbb18086f6"),
    afterImage: U("1586023492125-27b2c045efd7"),
  },
  {
    id: "katameya-suite",
    title: { ar: "جناح رويال قطامية ديونز", en: "Katameya Dunes Royal Suite" },
    compound: { ar: "قطامية ديونز جولف", en: "Katameya Dunes Golf" },
    location: { ar: "التجمع الخامس", en: "5th Settlement" },
    duration: { ar: "5 أشهر", en: "5 Months" },
    scope: {
      ar: "تأسيس بنية تحتية MEP وتكسيات حوائط مخملية مع حمام رخامي ماستر",
      en: "Complete MEP rough-in, acoustic wall paneling & master bookmatch marble bath",
    },
    beforeImage: U("1581094794329-c8112a89af12"),
    afterImage: U("1600210492486-724fe5c67fb0"),
  },
];

