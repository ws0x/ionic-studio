"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useSimStore } from "@/lib/simulation/store";
import { getMaterial } from "@/lib/simulation/catalog";
import type { RoomDef } from "@/lib/simulation/types";

/**
 * Procedurally generated room: floor + ceiling + 4 walls.
 * Walls are single-sided (BackSide) so the camera can see in from outside
 * in orbit mode and from inside in walkthrough mode.
 */
export function Room({ room }: { room: RoomDef }) {
  const floorMaterialId = useSimStore((s) => s.floorMaterialId);
  const wallMaterialId = useSimStore((s) => s.wallMaterialId);
  const cameraMode = useSimStore((s) => s.cameraMode);
  const select = useSimStore((s) => s.select);

  const floorMat = getMaterial(floorMaterialId);
  const wallMat = getMaterial(wallMaterialId);

  const { w, d, h } = room.size;

  const floorColor = floorMat?.color ?? "#b08a5e";
  const wallColor = wallMat?.color ?? "#f5f4f1";

  // Memoise wall transforms
  const walls = useMemo(
    () => [
      { pos: [0, h / 2, -d / 2] as const, rotY: 0, width: w }, // back
      { pos: [0, h / 2, d / 2] as const, rotY: Math.PI, width: w }, // front
      { pos: [-w / 2, h / 2, 0] as const, rotY: Math.PI / 2, width: d }, // left
      { pos: [w / 2, h / 2, 0] as const, rotY: -Math.PI / 2, width: d }, // right
    ],
    [w, d, h]
  );

  return (
    <group
      onPointerMissed={() => select(null)}
    >
      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        name="floor"
      >
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial
          color={floorColor}
          roughness={floorMat?.roughness ?? 0.7}
          metalness={floorMat?.metalness ?? 0}
        />
      </mesh>

      {/* Ceiling — only in walkthrough mode (dollhouse view keeps it open) */}
      {cameraMode === "walk" && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, h, 0]}>
          <planeGeometry args={[w, d]} />
          <meshStandardMaterial color="#fbfbf9" roughness={1} side={THREE.BackSide} />
        </mesh>
      )}

      {/* Walls — interior faces only (FrontSide). Each wall's normal points
          toward the room centre, so the wall nearest the camera culls away,
          giving an open "dollhouse" view from orbit/top while still enclosing
          the space from inside during walkthrough. */}
      {walls.map((wall, i) => (
        <mesh
          key={i}
          position={wall.pos}
          rotation={[0, wall.rotY, 0]}
          receiveShadow
        >
          <planeGeometry args={[wall.width, h]} />
          <meshStandardMaterial
            color={wallColor}
            roughness={wallMat?.roughness ?? 0.9}
            metalness={wallMat?.metalness ?? 0}
            side={THREE.FrontSide}
          />
        </mesh>
      ))}
    </group>
  );
}
