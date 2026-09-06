import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, Cairo } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const SITE = "https://ionicdesignhouse.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Ionic Design House | أيونيك ديزاين هاوس — Premium Architecture & Finishing",
    template: "%s | Ionic Design House",
  },
  description:
    "Ionic Design House — Egypt's premium interior design, finishing and construction studio. Turnkey luxury spaces from concept to handover. أيونيك ديزاين هاوس — استوديو تصميم داخلي وتشطيبات راقٍ في مصر.",
  keywords: [
    "luxury architecture studio Egypt",
    "premium home finishing Egypt",
    "interior design Damietta",
    "تشطيبات فاخرة مصر",
    "تصميم داخلي دمياط",
    "Ionic Design House",
    "شركة تشطيبات دمياط",
    "construction company Egypt",
  ],
  authors: [{ name: "Ionic Design House" }],
  creator: "Ionic Design House",
  openGraph: {
    type: "website",
    locale: "ar_EG",
    alternateLocale: "en_US",
    siteName: "Ionic Design House",
    title: "Ionic Design House — Premium Architecture & Finishing Studio",
    description: "Egypt's premier interior design, finishing and construction studio. نحوّل المساحات إلى تحف معمارية.",
    url: SITE,
  },
  twitter: {
    card: "summary_large_image",
    title: "Ionic Design House",
    description: "Premium architecture, interior design & finishing studio in Egypt.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["HomeAndConstructionBusiness", "ProfessionalService"],
      "@id": `${SITE}/#organization`,
      name: "Ionic Design House | دار أيونيك للتصميم والتشطيبات الفاخرة",
      alternateName: "Ionic Studio Egypt",
      url: SITE,
      logo: `${SITE}/favicon.svg`,
      image: `${SITE}/favicon.svg`,
      telephone: "+201026040854",
      priceRange: "$$$$",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Damietta & New Cairo",
        addressLocality: "New Damietta / Cairo",
        addressRegion: "Damietta / Cairo Governorate",
        addressCountry: "EG",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 31.4175,
        longitude: 31.8144,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
          opens: "09:00",
          closes: "20:00",
        },
      ],
      founder: [
        {
          "@type": "Person",
          name: "Eng. Yousef",
          jobTitle: "Founder & Creative Design Director",
        },
        {
          "@type": "Person",
          name: "Eng. Al-Sayed",
          jobTitle: "Co-Founder & Head of Civil Engineering",
        },
      ],
      knowsAbout: [
        "Interior Design",
        "Turnkey Finishing",
        "3D Architectural Simulation",
        "Smart Home Integration",
        "Civil & Structural Engineering",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "Ionic Design House",
      publisher: {
        "@id": `${SITE}/#organization`,
      },
      inLanguage: ["ar", "en"],
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${cormorant.variable} ${dmSans.variable} ${cairo.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
