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
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${cormorant.variable} ${dmSans.variable} ${cairo.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
