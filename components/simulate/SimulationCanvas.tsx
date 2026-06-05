"use client";

import { Suspense, useEffect, type MutableRefObject } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useSimStore } from "@/lib/simulation/store";
import type { SimulationProject } from "@/lib/simulation/types";
import { Room } from "./Room";
import { FurnitureModel } from "./FurnitureModel";
import { Lighting } from "./Lighting";
import { CameraRig } from "./CameraRig";

export type CaptureFn = () => string | null;

/** Bridges the WebGL renderer out so the HUD can take a screenshot. */
function CaptureBridge({ captureRef }: { captureRef: MutableRefObject<CaptureFn | null> }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    captureRef.current = () => {
      gl.render(scene, camera);
      return gl.domElement.toDataURL("image/png");
    };
    return () => {
      captureRef.current = null;
    };
  }, [gl, scene, camera, captureRef]);
  return null;
}

export function SimulationCanvas({
  project,
  captureRef,
}: {
  project: SimulationProject;
  captureRef: MutableRefObject<CaptureFn | null>;
}) {
  const placements = useSimStore((s) => s.placements);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      camera={{ fov: 55, near: 0.1, far: 100, position: [5, 4, 5] }}
      className="touch-none"
    >
      <color attach="background" args={["#e9e7e2"]} />
      <fog attach="fog" args={["#e9e7e2", 20, 45]} />

      <Suspense fallback={null}>
        <Lighting roomSize={project.room.size} />
        <Room room={project.room} />
        {placements.map((p) => (
          <FurnitureModel key={p.id} placement={p} />
        ))}
        <CameraRig room={project.room} />
        <CaptureBridge captureRef={captureRef} />
      </Suspense>
    </Canvas>
  );
}
