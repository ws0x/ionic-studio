"use client";

import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light = false,
  align = "start",
  large = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  light?: boolean;
  align?: "start" | "center";
  large?: boolean;
}) {
  const mutedColor = light ? "text-paper/50" : "text-platinum";
  const titleColor = light ? "text-paper" : "text-ink";
  const subtitleColor = light ? "text-paper/65" : "text-platinum";

  return (
    <Reveal className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <p
        className={`eyebrow mb-5 ${mutedColor} ${align === "center" ? "justify-center" : ""}`}
        style={{ "--color-platinum": light ? "rgba(255,255,255,0.4)" : undefined } as React.CSSProperties}
      >
        {eyebrow}
      </p>
      <h2
        className={`font-display text-balance font-bold leading-[1.05] ${titleColor} ${
          large ? "text-4xl sm:text-5xl md:text-6xl lg:text-7xl" : "text-3xl sm:text-4xl md:text-5xl"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-5 text-base leading-relaxed ${subtitleColor}`}>{subtitle}</p>
      )}
    </Reveal>
  );
}
