"use client";

import { useRef } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useSimStore } from "@/lib/simulation/store";
import { getFurniture } from "@/lib/simulation/catalog";
import { formatFootprint } from "@/lib/simulation/dimensions";
import { useLocale } from "@/lib/i18n";
import type { Placement } from "@/lib/simulation/types";

/**
 * One placed furniture item rendered as a simple box matching its real
 * dimensions. Selecting it shows a dimension label and an outline.
 * Dragging on the floor moves it (orbit/top modes).
 */
export function FurnitureModel({ placement }: { placement: Placement }) {
  const def = getFurniture(placement.defId);
  const selectedId = useSimStore((s) => s.selectedId);
  const select = useSimStore((s) => s.select);
  const moveSelected = useSimStore((s) => s.moveSelected);
  const cameraMode = useSimStore((s) => s.cameraMode);
  const { locale } = useLocale();
  const dragging = useRef(false);

  if (!def) return null;

  const isSelected = selectedId === placement.id;
  const { w, d, h } = def.size;

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    select(placement.id);
    if (cameraMode !== "walk") {
      dragging.current = true;
      (e.target as Element).setPointerCapture?.(e.pointerId);
    }
  };

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging.current || !isSelected) return;
    e.stopPropagation();
    // project pointer onto the floor plane (y = 0)
    moveSelected([e.point.x, 0, e.point.z]);
  };

  const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
    dragging.current = false;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  };

  return (
    <group
      position={[placement.position[0], 0, placement.position[2]]}
      rotation={[0, placement.rotationY, 0]}
    >
      <mesh
        position={[0, h / 2, 0]}
        castShadow
        receiveShadow
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={def.color}
          roughness={0.6}
          metalness={0.05}
          emissive={isSelected ? new THREE.Color("#222") : new THREE.Color("#000")}
        />
      </mesh>

      {/* Selection outline */}
      {isSelected && (
        <lineSegments position={[0, h / 2, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(w * 1.02, h * 1.02, d * 1.02)]} />
          <lineBasicMaterial color="#0a0a0a" />
        </lineSegments>
      )}

      {/* Dimension label */}
      {isSelected && (
        <Html position={[0, h + 0.25, 0]} center distanceFactor={8} zIndexRange={[10, 0]}>
          <div className="pointer-events-none select-none whitespace-nowrap rounded-full bg-ink px-3 py-1 text-[11px] font-semibold text-paper shadow-lg">
            {def.name[locale]} · {formatFootprint(def, locale)}
          </div>
        </Html>
      )}
    </group>
  );
}
