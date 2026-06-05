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
      ar: "فيلا سكنية فاخرة بتصميم داخلي معاصر وتشطيبات بمواد إيطالية.",
      en: "Luxury residential villa with contemporary interiors and Italian finishing materials.",
    },
    category: { ar: "سكني", en: "Residential" },
    categoryKey: "residential",
    location: { ar: "القاهرة الجديدة", en: "New Cairo" },
    area: "650 m²",
    image: U("1600585154340-be6161a56a0c"),
  },
  {
    title: { ar: "شقة الشيخ زايد", en: "Sheikh Zayed Penthouse" },
    desc: {
      ar: "بنتهاوس حديث بمساحات مفتوحة وأسقف مزدوجة الارتفاع.",
      en: "Modern penthouse with open-plan living and double-height ceilings.",
    },
    category: { ar: "سكني", en: "Residential" },
    categoryKey: "residential",
    location: { ar: "الشيخ زايد", en: "Sheikh Zayed" },
    area: "420 m²",
    image: U("1586023492125-27b2c045efd7"),
  },
  {
    title: { ar: "مكاتب العاصمة الإدارية", en: "New Capital Corporate HQ" },
    desc: {
      ar: "مقر شركة بتصميم مؤسسي راقٍ يعكس هوية العلامة التجارية.",
      en: "Corporate headquarters with premium institutional design reflecting brand identity.",
    },
    category: { ar: "مكاتب", en: "Office" },
    categoryKey: "office",
    location: { ar: "العاصمة الإدارية", en: "New Capital" },
    area: "1,200 m²",
    image: U("1497366811353-6870744d04b2"),
  },
  {
    title: { ar: "بوتيك المعادي", en: "Maadi Luxury Boutique" },
    desc: {
      ar: "محل بيع بالتجزئة بتصميم يُحوّل تجربة التسوق إلى فن.",
      en: "Retail boutique that transforms the shopping experience into an art form.",
    },
    category: { ar: "تجاري", en: "Commercial" },
    categoryKey: "commercial",
    location: { ar: "المعادي", en: "Maadi" },
    area: "280 m²",
    image: U("1441986300917-64674bd600d8"),
  },
  {
    title: { ar: "منتجع الساحل الشمالي", en: "North Coast Resort Villa" },
    desc: {
      ar: "فيلا ساحلية بأسلوب معماري متوسطي مع لمسات معاصرة راقية.",
      en: "Coastal villa with Mediterranean architecture and refined contemporary touches.",
    },
    category: { ar: "سكني", en: "Residential" },
    categoryKey: "residential",
    location: { ar: "الساحل الشمالي", en: "North Coast" },
    area: "480 m²",
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

// ─── Quote form options ────────────────────────────────────────────────────────
export const projectTypeOptions: { value: string; label: Bi }[] = [
  { value: "full-finishing", label: { ar: "تشطيب كامل", en: "Full finishing" } },
  { value: "interior-design", label: { ar: "تصميم داخلي", en: "Interior design" } },
  { value: "renovation", label: { ar: "تجديد / ترميم", en: "Renovation" } },
  { value: "commercial", label: { ar: "محل / تجاري", en: "Retail / commercial" } },
  { value: "office", label: { ar: "مكتب", en: "Office" } },
  { value: "hospitality", label: { ar: "ضيافة / مطعم", en: "Hospitality / restaurant" } },
  { value: "other", label: { ar: "أخرى", en: "Other" } },
];
