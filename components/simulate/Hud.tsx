"use client";

import { useState, type MutableRefObject } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { useSimStore } from "@/lib/simulation/store";
import type { MaterialDef, FurnitureDef, SimulationProject } from "@/lib/simulation/types";
import { buildShareUrl, buildWhatsAppShare } from "@/lib/simulation/share";
import type { CaptureFn } from "./SimulationCanvas";
import { CameraBar } from "./panels/CameraBar";
import { MaterialsPanel } from "./panels/MaterialsPanel";
import { FurniturePanel } from "./panels/FurniturePanel";
import { LightingPanel } from "./panels/LightingPanel";
import { SelectedToolbar } from "./panels/SelectedToolbar";

type Tab = "materials" | "furniture" | "lighting";

export function Hud({
  project,
  materials,
  furniture,
  captureRef,
}: {
  project: SimulationProject;
  materials: MaterialDef[];
  furniture: FurnitureDef[];
  captureRef: MutableRefObject<CaptureFn | null>;
}) {
  const { tx, locale, toggle } = useLocale();
  const [tab, setTab] = useState<Tab>("materials");
  // Collapse the panel by default on phones so the 3D scene is visible first;
  // open by default on tablet/desktop where there's room beside it.
  const [panelOpen, setPanelOpen] = useState(
    () => typeof window === "undefined" || window.innerWidth >= 640
  );
  const [toast, setToast] = useState<string | null>(null);

  const floorMaterialId = useSimStore((s) => s.floorMaterialId);
  const wallMaterialId = useSimStore((s) => s.wallMaterialId);
  const timeOfDay = useSimStore((s) => s.timeOfDay);
  const placements = useSimStore((s) => s.placements);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const currentScene = () => ({
    floorMaterialId,
    wallMaterialId,
    timeOfDay,
    placements,
  });

  const onScreenshot = () => {
    const data = captureRef.current?.();
    if (!data) return;
    const a = document.createElement("a");
    a.href = data;
    a.download = `ionic-design-${Date.now()}.png`;
    a.click();
    showToast(tx({ ar: "تم حفظ الصورة", en: "Screenshot saved" }));
  };

  const onCopyLink = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = buildShareUrl(origin, project.id, currentScene());
    try {
      await navigator.clipboard.writeText(url);
      showToast(tx({ ar: "تم نسخ الرابط", en: "Link copied" }));
    } catch {
      showToast(url);
    }
  };

  const onWhatsApp = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = buildShareUrl(origin, project.id, currentScene());
    window.open(buildWhatsAppShare(site.whatsapp, url, locale), "_blank", "noopener");
  };

  const tabs: { key: Tab; label: { ar: string; en: string }; icon: string }[] = [
    { key: "materials", label: { ar: "الخامات", en: "Materials" }, icon: "M3 3h18v18H3z M3 9h18 M9 3v18" },
    { key: "furniture", label: { ar: "الأثاث", en: "Furniture" }, icon: "M4 11V7a2 2 0 012-2h12a2 2 0 012 2v4 M3 11h18v6H3z M6 17v2 M18 17v2" },
    { key: "lighting", label: { ar: "الإضاءة", en: "Lighting" }, icon: "M12 3v2 M12 19v2 M5 12H3 M21 12h-2 M12 8a4 4 0 100 8 4 4 0 000-8z" },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4">
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2 rounded-full bg-paper/90 px-4 py-2 text-xs font-semibold text-ink shadow-md backdrop-blur-sm transition hover:bg-paper cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="rtl:rotate-180">
            <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {tx({ ar: "العودة", en: "Back" })}
        </Link>

        <div className="pointer-events-auto rounded-full bg-paper/90 px-4 py-2 text-center shadow-md backdrop-blur-sm">
          <p className="text-xs font-bold text-ink">{project.name[locale]}</p>
        </div>

        <button
          onClick={toggle}
          aria-label="Switch language"
          className="pointer-events-auto flex h-9 items-center rounded-full bg-paper/90 px-4 text-[11px] font-bold tracking-widest text-ink shadow-md backdrop-blur-sm transition hover:bg-paper cursor-pointer"
        >
          {locale === "ar" ? "EN" : "ع"}
        </button>
      </div>

      {/* Selected-item floating toolbar */}
      <SelectedToolbar furniture={furniture} />

      {/* Bottom camera + actions bar */}
      <CameraBar
        onScreenshot={onScreenshot}
        onCopyLink={onCopyLink}
        onWhatsApp={onWhatsApp}
      />

      {/* Right (LTR) / Left (RTL) side panel */}
      <div className="pointer-events-none absolute inset-y-0 end-0 z-20 flex max-h-screen items-stretch">
        <div
          className={`pointer-events-auto m-3 mt-20 mb-24 flex w-[19rem] max-w-[85vw] flex-col overflow-hidden rounded-2xl bg-paper/95 shadow-xl backdrop-blur-md transition-transform duration-300 ${
            panelOpen ? "translate-x-0" : "translate-x-[120%] rtl:-translate-x-[120%]"
          }`}
        >
          {/* Tabs */}
          <div className="flex border-b border-line">
            {tabs.map((tb) => (
              <button
                key={tb.key}
                onClick={() => setTab(tb.key)}
                className={`flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-semibold transition cursor-pointer ${
                  tab === tb.key ? "bg-ink text-paper" : "text-platinum hover:text-ink"
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d={tb.icon} />
                </svg>
                {tx(tb.label)}
              </button>
            ))}
          </div>

          {/* Panel body */}
          <div className="no-scrollbar flex-1 overflow-y-auto p-4">
            {tab === "materials" && <MaterialsPanel materials={materials} />}
            {tab === "furniture" && <FurniturePanel furniture={furniture} />}
            {tab === "lighting" && <LightingPanel />}
          </div>
        </div>

        {/* Panel collapse toggle */}
        <button
          onClick={() => setPanelOpen((v) => !v)}
          aria-label={panelOpen ? "Collapse panel" : "Expand panel"}
          className="pointer-events-auto absolute top-1/2 -translate-y-1/2 start-[-2.5rem] flex h-12 w-10 items-center justify-center rounded-s-xl bg-paper/95 shadow-md backdrop-blur-md cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-ink transition-transform ${panelOpen ? "" : "rotate-180"} rtl:rotate-180 rtl:${panelOpen ? "" : "rotate-0"}`}>
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="pointer-events-none absolute bottom-28 left-1/2 z-30 -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-xs font-semibold text-paper shadow-xl">
          {toast}
        </div>
      )}
    </>
  );
}
