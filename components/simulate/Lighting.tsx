"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useSimStore } from "@/lib/simulation/store";

/**
 * Sun + ambient light driven by timeOfDay (0..24).
 * The sun arcs overhead and shifts colour temperature: warm at dawn/dusk,
 * neutral at midday, dim blue at night.
 */
export function Lighting({ roomSize }: { roomSize: { w: number; d: number; h: number } }) {
  const timeOfDay = useSimStore((s) => s.timeOfDay);

  const { sunPos, sunColor, sunIntensity, ambient } = useMemo(() => {
    // Map 6:00..18:00 to an arc; outside that it's night.
    const t = timeOfDay;
    const dayProgress = (t - 6) / 12; // 0 at 6am, 1 at 6pm
    const isDay = t >= 6 && t <= 18;

    const angle = Math.PI * Math.min(1, Math.max(0, dayProgress));
    const radius = Math.max(roomSize.w, roomSize.d) * 1.5;
    const height = roomSize.h * 2.5;

    const x = Math.cos(angle) * radius;
    const y = isDay ? Math.sin(angle) * height + 1 : 0.5;
    const z = radius * 0.4;

    // Colour temperature: warm (#ffd9a0) at edges, white (#fff8ee) midday
    const warmth = 1 - Math.sin(angle); // 0 at noon, 1 at dawn/dusk
    const color = new THREE.Color().lerpColors(
      new THREE.Color("#fff6e8"),
      new THREE.Color("#ffb066"),
      isDay ? warmth : 1
    );

    return {
      sunPos: [x, y, z] as [number, number, number],
      sunColor: color,
      sunIntensity: isDay ? 1.2 + Math.sin(angle) * 1.3 : 0.3,
      // Keep a soft interior glow at night so the space stays readable
      // (simulates artificial lighting) rather than going pitch black.
      ambient: isDay ? 0.5 + Math.sin(angle) * 0.3 : 0.4,
    };
  }, [timeOfDay, roomSize]);

  return (
    <>
      <ambientLight intensity={ambient} />
      <hemisphereLight intensity={ambient * 0.6} color="#ffffff" groundColor="#b0a89a" />
      <directionalLight
        position={sunPos}
        intensity={sunIntensity}
        color={sunColor}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
    </>
  );
}
