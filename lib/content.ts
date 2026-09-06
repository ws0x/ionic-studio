export type Bi = { ar: string; en: string };

// ─── Stats ───────────────────────────────────────────────────────────────────
export const stats: { value: string; label: Bi }[] = [
  { value: "15+", label: { ar: "عاماً من الخبرة المعمارية", en: "Years Construction Excellence" } },
  { value: "+30", label: { ar: "علامة تجارية دولية ومؤسسية", en: "International & Enterprise Brands" } },
  { value: "180+", label: { ar: "مشروع تسليم مفتاح منجز", en: "Turnkey Projects Delivered" } },
  { value: "99.4%", label: { ar: "نسبة الالتزام بالجدول الزمني", en: "On-Time Handover Compliance" } },
];

// ─── Services ─────────────────────────────────────────────────────────────────
export type Service = { icon: string; title: Bi; desc: Bi };
export const services: Service[] = [
  {
    icon: "M3 21h18M5 21V7l8-4 8 4v14M9 21v-6h6v6",
    title: { ar: "مقاولات عامة وإنشاءات كبرى", en: "General Contracting & Civil Works" },
    desc: {
      ar: "تنفيذ المشاريع الإنشائية والتوسعات الهيكلية والخرسانات بأعلى اشتراطات الجودة والسلامة المهنية.",
      en: "Full-scale structural execution, building works, and structural modifications compliant with rigorous engineering standards.",
    },
  },
  {
    icon: "M4 7h16M4 12h16M4 17h10",
    title: { ar: "تشطيبات وتجهيزات معمارية متكاملة", en: "Turnkey Fine Finishing & Fit-Outs" },
    desc: {
      ar: "إدارة متكاملة للتجهيزات الداخلية من العظم والمحارة حتى التسليم النهائي بالمفتاح بأدق المواصفات العالمية.",
      en: "Comprehensive interior fit-out management from core & shell to turnkey handover with world-class craftsmanship.",
    },
  },
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: { ar: "أنظمة كهروميكانيكية متطورة (MEP)", en: "Electro-Mechanical & MEP Systems" },
    desc: {
      ar: "تصميم وتنفيذ أنظمة التكييف المركزي HVAC، شبكات مكافحة الحريق المعتمدة، غرف الخوادم، والأنظمة الذكية.",
      en: "Design and installation of central HVAC, certified fire fighting, BMS automation, and mission-critical electrical networks.",
    },
  },
  {
    icon: "M3 10h18M7 10V6a5 5 0 0110 0v4M5 10v11h14V10",
    title: { ar: "تجهيز المقرات وسلاسل المطاعم والمتاجر", en: "Commercial F&B & Retail Rollouts" },
    desc: {
      ar: "تنفيذ فروع كبرى العلامات العالمية (سلاسل الكافيهات، المطاعم، والمتاجر الفاخرة) بجداول زمنية قياسية.",
      en: "Rapid, high-precision deployment for global luxury retailers, corporate headquarters, and F&B culinary venues.",
    },
  },
  {
    icon: "M12 3l9 6-9 6-9-6 9-6zM3 15l9 6 9-6",
    title: { ar: "أعمال النجارة والتكسيات والرخام المعماري", en: "Bespoke Millwork & Architectural Stone" },
    desc: {
      ar: "تصنيع أرقى التكسيات الخشبية العازلة للصوت، الرخام الإيطالي المعالج، والواجهات الزجاجية المعمارية.",
      en: "Custom acoustic wall paneling, precision Italian marble fabrication, and architectural extra-clear glazing.",
    },
  },
  {
    icon: "M6 3h12l3 7-9 11L3 10z",
    title: { ar: "الفيلات والقصور السكنية المستقلة", en: "Ultra-Luxury Residential Estates" },
    desc: {
      ar: "تحويل القصور والفيلات في كبرى المجمعات السكنية إلى تحف معمارية بخصوصية استثنائية وأنظمة ذكية.",
      en: "Bespoke architectural architecture for private villas and estates with KNX home automation and infinity terraces.",
    },
  },
];

// ─── Projects ─────────────────────────────────────────────────────────────────
export type ProjectSector =
  | "residential"
  | "commercial"
  | "office"
  | "hospitality"
  | "administration"
  | "fb"
  | "retail";

export type Project = {
  title: Bi;
  desc: Bi;
  category: Bi;
  categoryKey: ProjectSector;
  location: Bi;
  image: string;
  area?: string;
  year?: string;
  scope?: Bi;
  highlights?: Bi[];
};

const U = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const projectFilters: { key: ProjectSector | "all"; label: Bi }[] = [
  { key: "all", label: { ar: "جميع المشاريع", en: "All Projects" } },
  { key: "administration", label: { ar: "إداري ومقرات", en: "Administration" } },
  { key: "fb", label: { ar: "مطاعم وكافيهات (F&B)", en: "F&B" } },
  { key: "retail", label: { ar: "تجاري ومتاجر", en: "Retail" } },
  { key: "residential", label: { ar: "سكني وفيلات", en: "Residential" } },
];

export const projects: Project[] = [
  {
    title: { ar: "مقر شركة ڤاليو (Valu) — كامبس مايند هاوس", en: "Valu Headquarters — Mindhaus Campus" },
    desc: {
      ar: "تنفيذ المقر الإداري الرئيسي لشركة فاليو بحلول إلكتروميكانيكية متطورة ومساحات عمل ذكية بمجمع ديستريكت 5.",
      en: "Executive headquarters for Valu with advanced electromechanical systems and agile smart workspaces in District 5.",
    },
    category: { ar: "إداري ومقرات", en: "Administration" },
    categoryKey: "administration",
    location: { ar: "ديستريكت 5، القاهرة الجديدة", en: "District 5, New Cairo" },
    area: "2,400 m²",
    year: "2025",
    scope: { ar: "تشطيب مقرات إدارية متكامل + MEP + أوتوميشن", en: "Turnkey Corporate Fit-out + Advanced MEP" },
    highlights: [
      { ar: "قواطع زجاجية معمارية عازلة للصوت 48dB", en: "Acoustic Double-Glazed Partitions (48dB)" },
      { ar: "قاعات مؤتمرات ذكية بنظام تحكم كامل", en: "Integrated IoT Conference Hubs" },
      { ar: "أسقف معدنية ومسارات إضاءة خطية مخصصة", en: "Architectural Baffle Ceilings & Linear LED" },
    ],
    image: U("1497366811353-6870744d04b2"),
  },
  {
    title: { ar: "مطعم ومخبز بول (PAUL) — أوبن إير مول", en: "PAUL French Bakery & Bistro — Open Air Mall" },
    desc: {
      ar: "تنفيذ وتشطيب فرع بول الفرنسي بطابع معماري باريسي فاخر، شاملاً صالة الطعام والتراس والمطبخ التجاري المتكامل.",
      en: "Complete turnkey fit-out of PAUL Bistro blending authentic Parisian heritage with luxury commercial kitchen engineering.",
    },
    category: { ar: "مطاعم وكافيهات", en: "F&B" },
    categoryKey: "fb",
    location: { ar: "مدينتي، أوبن إير مول", en: "Madinaty, Open Air Mall" },
    area: "480 m²",
    year: "2024",
    scope: { ar: "تشطيب مطاعم فاخرة (F&B Fit-out + Kitchen MEP)", en: "Fine F&B Fit-out & Industrial Kitchen MEP" },
    highlights: [
      { ar: "أرضيات موزايكو ورخام فرنسي مستورد", en: "Imported French Marble & Custom Mosaic Tile" },
      { ar: "أعمال نجارة وكورنيش خشبية كلاسيكية معالجة", en: "Artisanal Millwork & Bespoke Moldings" },
      { ar: "أنظمة شفط وتكييف مركزي متوافقة مع اشتراطات المول", en: "Mall-Compliant Heavy-Duty Kitchen HVAC" },
    ],
    image: U("1555396273-367ea4eb4db5"),
  },
  {
    title: { ar: "متجر هوجو بوس (Hugo Boss) — مول مصر", en: "Hugo Boss Flagship Boutique — Mall of Egypt" },
    desc: {
      ar: "تنفيذ المتجر الرئيسي لعلامة هوجو بوس بأحدث أدلة التصميم العالمية، واستخدام خامات ألمانية وإضاءة مسرحية مركزة.",
      en: "Flagship luxury boutique for Hugo Boss executed according to global design directives with precision lighting and German millwork.",
    },
    category: { ar: "تجاري ومتاجر", en: "Retail" },
    categoryKey: "retail",
    location: { ar: "مول مصر، 6 أكتوبر", en: "Mall of Egypt, 6th of October" },
    area: "360 m²",
    year: "2024",
    scope: { ar: "تشطيب تجاري دولي فاخر (Luxury Fashion Retail)", en: "Haute Couture Flagship Fit-out" },
    highlights: [
      { ar: "واجهات زجاجية كريستالية بدون إطار", en: "Frameless Extra-Clear Glass Facades" },
      { ar: "إضاءة بصرية موجهة بدرجة وضوح ألوان CRI>95", en: "High-CRI Architectural Accent Lighting" },
      { ar: "تكسيات جدارية من الجلد الإيطالي والمعادن المصقولة", en: "Italian Leather & Brushed Bronze Wall Panels" },
    ],
    image: U("1441986300917-64674bd600d8"),
  },
  {
    title: { ar: "ستاربكس (Starbucks) — القطامية ريزيدنس", en: "Starbucks Drive-thru & Lounge — Kattameya" },
    desc: {
      ar: "تنفيذ الفرع بأسلوب دافئ يدمج الخشب الطبيعي مع الإسمنت المعماري ومقاعد لاونج خارجية.",
      en: "Iconic coffee lounge fit-out harmonizing warm natural timber, polished architectural concrete, and outdoor pergola.",
    },
    category: { ar: "مطاعم وكافيهات", en: "F&B" },
    categoryKey: "fb",
    location: { ar: "القطامية، القاهرة الجديدة", en: "Kattameya, New Cairo" },
    area: "310 m²",
    year: "2024",
    scope: { ar: "تشطيب F&B متكامل سريع التنفيذ", en: "Rapid Turnkey F&B Execution" },
    highlights: [
      { ar: "أخشاب بلوط طبيعي معالجة ضد الحريق", en: "Fire-Rated Natural White Oak Cladding" },
      { ar: "مسارات خدمة مجهزة بأنظمة تغذية وتصريف متقدمة", en: "High-Capacity Hydraulic & Plumbing System" },
    ],
    image: U("1501339847302-ac426a4a7cbb"),
  },
  {
    title: { ar: "بوتيك فيليب بلين (Philipp Plein)", en: "Philipp Plein Luxury Boutique" },
    desc: {
      ar: "متجر الأزياء الراقية بتصميم جريء يعتمد على الرخام الأسود والمرايا الكريستالية والإضاءة الديناميكية.",
      en: "Haute couture boutique featuring dramatic Nero Marquina marble, custom polished steel, and crystal accents.",
    },
    category: { ar: "تجاري ومتاجر", en: "Retail" },
    categoryKey: "retail",
    location: { ar: "القاهرة الجديدة", en: "New Cairo" },
    area: "275 m²",
    year: "2024",
    scope: { ar: "تشطيب تجاري فائق الفخامة", en: "Luxury High-Street Retail Fit-out" },
    highlights: [
      { ar: "رخام نيرو ماركينا أسود مع عروق بيضاء نقية", en: "Nero Marquina Bookmatched Slabs" },
      { ar: "عناصر ديكورية من الفولاذ المقاوم للصدأ المطلي بالكروم", en: "Mirror-Finish Stainless Steel Displays" },
    ],
    image: U("1512436991641-6745cdb1723f"),
  },
  {
    title: { ar: "فيلا مستقلة — إعمار ميفيدا (Mivida)", en: "Stand-Alone Signature Villa — Emaar Mivida" },
    desc: {
      ar: "فيلا سكنية فاخرة بتصميم معماري حديث وتشطيبات رخام ستاتوريو إيطالي وحمام سباحة إنفينيتي.",
      en: "Ultra-luxury residential villa featuring Italian Statuario marble, floor-to-ceiling panoramic glass, and infinity pool.",
    },
    category: { ar: "سكني وفيلات", en: "Residential" },
    categoryKey: "residential",
    location: { ar: "كمبوند ميفيدا، القاهرة الجديدة", en: "Mivida Compound, New Cairo" },
    area: "720 m²",
    year: "2025",
    scope: { ar: "تشطيب كامل بمفتاح اليد + تصميم معماري داخلي", en: "Turnkey Architecture & Interior Finishing" },
    highlights: [
      { ar: "رخام ستاتوريو إيطالي للأرضيات الرئيسية", en: "Italian Statuario Marble Flooring" },
      { ar: "أنظمة أوتوميشن ومنزل ذكي KNX متكاملة", en: "Full KNX Smart Home Automation" },
      { ar: "أبواب وشبابيك عازلة للصوت والحرارة بأعلى تصنيف", en: "Thermal-Break Acoustic Architectural Windows" },
    ],
    image: U("1600585154340-be6161a56a0c"),
  },
  {
    title: { ar: "فيلا ماونتن فيو آي سيتي (Mountain View)", en: "Mountain View iCity Villa" },
    desc: {
      ar: "فيلا بتشطيبات راقية بتصميم الحد الأدنى الدافئ وأسقف معلقة وإضاءة معمارية مخفية مدروسة.",
      en: "Warm minimalist villa with custom suspended ceilings, continuous architectural cove lighting, and natural stone.",
    },
    category: { ar: "سكني وفيلات", en: "Residential" },
    categoryKey: "residential",
    location: { ar: "ماونتن فيو، القاهرة الجديدة", en: "Mountain View, New Cairo" },
    area: "380 m²",
    year: "2025",
    scope: { ar: "تشطيب سكني راقٍ بمفتاح اليد", en: "Premium Turnkey Finishing" },
    highlights: [
      { ar: "إضاءة مغناطيسية مسارية خافتة التوهج", en: "Magnetic Architectural Track Lighting" },
      { ar: "أرضيات باركيه خشب طبيعي معالج", en: "Engineered European Oak Hardwood" },
    ],
    image: U("1586023492125-27b2c045efd7"),
  },
  {
    title: { ar: "مقر شركة إيديكس الهندسية (EDECS)", en: "EDECS Marine & Engineering Headquarters" },
    desc: {
      ar: "مقر مؤسسي ضخم يجمع بين قاعات الإدارة والمختبرات الفنية ومراكز التخطيط الاستراتيجي للمشاريع القومية.",
      en: "Corporate engineering complex housing executive boardrooms, technical project labs, and mission-critical MEP infrastructure.",
    },
    category: { ar: "إداري ومقرات", en: "Administration" },
    categoryKey: "administration",
    location: { ar: "القاهرة الجديدة", en: "New Cairo" },
    area: "3,100 m²",
    year: "2024",
    scope: { ar: "مقاولات عامة وتشطيب إداري ثقيل", en: "General Contracting & Turnkey Institutional Fit-out" },
    highlights: [
      { ar: "غرف خوادم ومراكز بيانات مجهزة بأنظمة إطفاء FM200", en: "Mission-Critical Tier III Server Suites (FM200)" },
      { ar: "واجهات ستائرية زجاجية معالجة حرارياً", en: "Double-Skin High-Performance Curtain Wall" },
    ],
    image: U("1497215728101-856f4ea42174"),
  },
  {
    title: { ar: "متجر كيكو ميلانو (KIKO Milano) — سيتي ستارز", en: "KIKO Milano Flagship — Citystars" },
    desc: {
      ar: "تنفيذ أحدث هوية تجارية لعلامة مستحضرات التجميل الإيطالية بمحاذاة المعايير الهندسية لمراكز التسوق الكبرى.",
      en: "Italian cosmetics boutique built to international chain specifications with glossy lacquer displays and high-lumen illumination.",
    },
    category: { ar: "تجاري ومتاجر", en: "Retail" },
    categoryKey: "retail",
    location: { ar: "سيتي ستارز، مدينة نصر", en: "Citystars, Nasr City" },
    area: "190 m²",
    year: "2023",
    scope: { ar: "تشطيب تجاري دقيق وسريع", en: "High-Traffic Commercial Retail Execution" },
    highlights: [
      { ar: "أثاث عرض مدهون بطلاء بولي يوريثان لامع عالي التحمل", en: "High-Gloss Polyurethane Custom Product Podiums" },
      { ar: "مرايا إضاءة متوازنة تحاكي ضوء النهار الطبيعي 5000K", en: "5000K Daylight Color-Calibrated Vanity Mirrors" },
    ],
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

