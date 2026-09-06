export const site = {
  name: { ar: "أيونيك ديزاين هاوس", en: "Ionic Design House" },
  tagline: {
    ar: "استوديو معماري راقٍ · تصميم داخلي وتشطيبات وإنشاءات",
    en: "Premium Architectural Studio · Interior Design, Finishing & Construction",
  },
  domain: "https://ionicdesignhouse.com",
  // Primary contact — WhatsApp format: intl no spaces no +
  whatsapp: "201060965845",
  phone1: "+20 106 096 5845",
  phone2: "+20 106 048 3860",
  email: "info@ionicdesignhouse.com",
  address: {
    ar: "كامبس مايند هاوس B11، ديستريكت 5، مراكز، طريق السخنة، القطامية الجديدة، القاهرة",
    en: "B11 Mindhaus Campus, District 5, Marakez, New Kattameya, Cairo, Egypt",
  },
  secondaryAddress: {
    ar: "استوديو التصميم وورش التنفيذ: دمياط، مصر",
    en: "Design Studio & Fabrication: Damietta, Egypt",
  },
  social: {
    instagram: "https://www.instagram.com/ionicdesignhouse",
    facebook: "https://www.facebook.com/777050945491036",
  },
  hours: {
    ar: "السبت – الخميس · 10 ص – 8 م",
    en: "Sat – Thu · 10 AM – 8 PM",
  },
  founders: {
    founder: { ar: "شريف المغالاوي", en: "Sherif El-Maghalawy" },
    coFounder: { ar: "محمد أشرف", en: "Mohamed Ashraf" },
  },
} as const;

export function waLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
