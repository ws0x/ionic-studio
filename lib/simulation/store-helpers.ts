// ── Store helpers ────────────────────────────────────────────────────────────
// Thin adapters between the Zustand store and catalogue/geometry, kept separate
// so the store's state logic stays focused and the catalogue can be swapped
// (e.g. for a CMS source) without touching store.ts.

import { getFurniture } from "./catalog";
import { clampToRoom as clampToRoomGeom } from "./dimensions";

export function getFurnitureSize(
  defId: string
): { w: number; d: number; h: number } | null {
  return getFurniture(defId)?.size ?? null;
}

export const clampToRoom = clampToRoomGeom;
