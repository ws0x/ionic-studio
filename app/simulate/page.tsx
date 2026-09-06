"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { LocaleProvider, useLocale } from "@/lib/i18n";
import { useSimStore } from "@/lib/simulation/store";
import { demoProject, simulationPresets, materials, furniture } from "@/lib/simulation/catalog";
import { decodeScene } from "@/lib/simulation/share";
import { Hud } from "@/components/simulate/Hud";
import { WebGLBoundary } from "@/components/simulate/WebGLBoundary";
import type { CaptureFn } from "@/components/simulate/SimulationCanvas";

// WebGL must run in the browser only — no SSR.
const SimulationCanvas = dynamic(
  () => import("@/components/simulate/SimulationCanvas").then((m) => m.SimulationCanvas),
  { ssr: false, loading: () => <LoadingScene /> }
);

function LoadingScene() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-mist">
      <div className="flex flex-col items-center gap-4">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-ink border-t-transparent" />
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-platinum">
          Loading 3D scene…
        </span>
      </div>
    </div>
  );
}

function SimulatorInner() {
  const { tx } = useLocale();
  const project = useSimStore((s) => s.project);
  const init = useSimStore((s) => s.init);
  const hydrate = useSimStore((s) => s.hydrate);
  const captureRef = useRef<CaptureFn | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projId = params.get("project");
    const targetProject = (projId && simulationPresets[projId]) || demoProject;
    init(targetProject);

    // Hydrate from a shared URL (?s=<encoded scene>)
    const encoded = params.get("s");
    if (encoded) {
      const scene = decodeScene(encoded);
      if (scene) hydrate(scene);
    }
  }, [init, hydrate]);

  if (!project) return <LoadingScene />;

  return (
    <div className="fixed inset-0 overflow-hidden bg-mist">
      <WebGLBoundary
        fallback={
          <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
            <div className="max-w-sm">
              <p className="font-display text-2xl font-bold text-ink">
                {tx({ ar: "المتصفح لا يدعم العرض ثلاثي الأبعاد", en: "3D not supported" })}
              </p>
              <p className="mt-3 text-sm text-platinum">
                {tx({
                  ar: "يرجى فتح الصفحة على متصفح حديث يدعم WebGL لتجربة المحاكاة.",
                  en: "Please open this page in a modern browser that supports WebGL to use the simulator.",
                })}
              </p>
            </div>
          </div>
        }
      >
        <SimulationCanvas project={demoProject} captureRef={captureRef} />
        <Hud
          project={demoProject}
          materials={materials}
          furniture={furniture}
          captureRef={captureRef}
        />
      </WebGLBoundary>
    </div>
  );
}

export default function SimulatePage() {
  return (
    <LocaleProvider>
      <SimulatorInner />
    </LocaleProvider>
  );
}
