"use client";

import { useLocale } from "@/lib/i18n";
import { useSimStore, type CameraMode } from "@/lib/simulation/store";

/** Bottom bar: camera-mode switch + reset, screenshot, copy-link, WhatsApp. */
export function CameraBar({
  onScreenshot,
  onCopyLink,
  onWhatsApp,
}: {
  onScreenshot: () => void;
  onCopyLink: () => void;
  onWhatsApp: () => void;
}) {
  const { tx } = useLocale();
  const cameraMode = useSimStore((s) => s.cameraMode);
  const setCameraMode = useSimStore((s) => s.setCameraMode);
  const reset = useSimStore((s) => s.reset);

  const modes: { key: CameraMode; label: { ar: string; en: string }; icon: string }[] = [
    { key: "orbit", label: { ar: "تدوير", en: "Orbit" }, icon: "M12 3a9 9 0 109 9 M12 3v4 M3 12h4" },
    { key: "walk", label: { ar: "تجوّل", en: "Walk" }, icon: "M13 4a1 1 0 11-2 0 1 1 0 012 0z M9 21l2-6 2 2 1 4 M11 9l-2 2 M13 9l3 1" },
    { key: "top", label: { ar: "مخطط", en: "Top" }, icon: "M3 3h18v18H3z M3 9h18 M9 3v18" },
  ];

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 p-4">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-paper/95 p-1 shadow-xl backdrop-blur-md">
        {/* Camera modes */}
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => setCameraMode(m.key)}
            aria-pressed={cameraMode === m.key}
            className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-semibold transition cursor-pointer sm:px-4 ${
              cameraMode === m.key ? "bg-ink text-paper" : "text-ink hover:bg-mist"
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d={m.icon} />
            </svg>
            <span className="hidden sm:inline">{tx(m.label)}</span>
          </button>
        ))}

        <span className="mx-1 h-6 w-px bg-line" />

        {/* Reset */}
        <IconButton label={tx({ ar: "إعادة", en: "Reset" })} onClick={reset} icon="M3 12a9 9 0 109-9 M3 12v-4 M3 12h4" />
        {/* Screenshot */}
        <IconButton label={tx({ ar: "لقطة", en: "Photo" })} onClick={onScreenshot} icon="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z M12 17a4 4 0 100-8 4 4 0 000 8z" />
        {/* Copy link */}
        <IconButton label={tx({ ar: "رابط", en: "Link" })} onClick={onCopyLink} icon="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1 M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1" />
        {/* WhatsApp */}
        <button
          onClick={onWhatsApp}
          aria-label={tx({ ar: "مشاركة عبر واتساب", en: "Share on WhatsApp" })}
          className="flex items-center justify-center rounded-full bg-ink px-3 py-2 text-paper transition hover:opacity-90 cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 00-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1012 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function IconButton({ label, onClick, icon }: { label: string; onClick: () => void; icon: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex items-center justify-center rounded-full px-3 py-2 text-ink transition hover:bg-mist cursor-pointer"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d={icon} />
      </svg>
    </button>
  );
}
