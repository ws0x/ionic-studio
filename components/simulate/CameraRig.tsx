"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useSimStore } from "@/lib/simulation/store";
import type { RoomDef } from "@/lib/simulation/types";

/**
 * Camera controller switching between three modes:
 *  - orbit: rotate around the room from outside, looking at its centre
 *  - top:   straight-down floor-plan view
 *  - walk:  first-person inside the room at eye height
 * Uses OrbitControls in all modes with constraints tuned per mode.
 */
export function CameraRig({ room }: { room: RoomDef }) {
  const cameraMode = useSimStore((s) => s.cameraMode);
  const { camera } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);
  const { w, d, h } = room.size;

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;

    if (cameraMode === "orbit") {
      cam.position.set(w * 0.9, h * 1.4, d * 1.1);
      if (controls.current) {
        controls.current.target.set(0, h / 3, 0);
        controls.current.update();
      }
    } else if (cameraMode === "top") {
      cam.position.set(0, Math.max(w, d) * 1.8, 0.001);
      if (controls.current) {
        controls.current.target.set(0, 0, 0);
        controls.current.update();
      }
    } else if (cameraMode === "walk") {
      cam.position.set(0, h * 0.55, d * 0.35);
      if (controls.current) {
        controls.current.target.set(0, h * 0.5, -d / 2);
        controls.current.update();
      }
    }
  }, [cameraMode, w, d, h, camera]);

  // Per-mode control constraints
  const isTop = cameraMode === "top";
  const isWalk = cameraMode === "walk";

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={!isWalk}
      enableZoom
      minDistance={isWalk ? 0.1 : 1.5}
      maxDistance={isTop ? Math.max(w, d) * 3 : 25}
      // Top view: lock to straight-down. Walk: allow looking around. Orbit: keep above floor.
      minPolarAngle={isTop ? 0 : isWalk ? 0.2 : 0.1}
      maxPolarAngle={isTop ? 0.15 : isWalk ? Math.PI - 0.2 : Math.PI / 2.05}
      enableDamping
      dampingFactor={0.1}
    />
  );
}
