import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "3D Space Simulator | Ionic Design House",
  description:
    "Visualize your apartment or villa in 3D before construction. Swap finishes, place furniture, and explore lighting with Ionic Design House.",
  robots: { index: false, follow: true }, // tool page — keep out of search index
};

export default function SimulateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
