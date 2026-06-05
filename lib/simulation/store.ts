// ── Simulation scene state (Zustand) ─────────────────────────────────────────
// Single source of truth shared by the WebGL scene and the HTML HUD.
// Pure state logic — unit-testable via the vanilla store (store.getState()).

import { create } from "zustand";
import type { MaterialCategory, Placement, SimulationProject } from "./types";
import { clampToRoom, getFurnitureSize } from "./store-helpers";

export type CameraMode = "orbit" | "walk" | "top";

let instanceCounter = 0;
function nextId(defId: string): string {
  instanceCounter += 1;
  return `${defId}-${instanceCounter}`;
}

export interface SimState {
  project: SimulationProject | null;
  cameraMode: CameraMode;
  timeOfDay: number; // 0..24
  floorMaterialId: string;
  wallMaterialId: string;
  placements: Placement[];
  selectedId: string | null;

  // lifecycle
  init(project: SimulationProject): void;
  hydrate(partial: {
    floorMaterialId?: string;
    wallMaterialId?: string;
    timeOfDay?: number;
    placements?: Placement[];
  }): void;
  reset(): void;

  // camera + lighting
  setCameraMode(m: CameraMode): void;
  setTimeOfDay(h: number): void;

  // materials
  setMaterial(cat: MaterialCategory, id: string): void;

  // furniture
  addFurniture(defId: string): void;
  moveSelected(pos: [number, number, number]): void;
  rotateSelected(deltaY: number): void;
  removeSelected(): void;
  select(id: string | null): void;
}

export const useSimStore = create<SimState>((set, get) => ({
  project: null,
  cameraMode: "orbit",
  timeOfDay: 13,
  floorMaterialId: "",
  wallMaterialId: "",
  placements: [],
  selectedId: null,

  init(project) {
    set({
      project,
      floorMaterialId: project.room.floorMaterialId,
      wallMaterialId: project.room.wallMaterialId,
      placements: [],
      selectedId: null,
      cameraMode: "orbit",
      timeOfDay: 13,
    });
  },

  hydrate(partial) {
    set((s) => ({
      floorMaterialId: partial.floorMaterialId ?? s.floorMaterialId,
      wallMaterialId: partial.wallMaterialId ?? s.wallMaterialId,
      timeOfDay: partial.timeOfDay ?? s.timeOfDay,
      placements: partial.placements ?? s.placements,
    }));
  },

  reset() {
    const p = get().project;
    if (!p) return;
    set({
      floorMaterialId: p.room.floorMaterialId,
      wallMaterialId: p.room.wallMaterialId,
      placements: [],
      selectedId: null,
      timeOfDay: 13,
    });
  },

  setCameraMode(m) {
    set({ cameraMode: m });
  },

  setTimeOfDay(h) {
    set({ timeOfDay: Math.min(24, Math.max(0, h)) });
  },

  setMaterial(cat, id) {
    if (cat === "floor") set({ floorMaterialId: id });
    else if (cat === "wall") set({ wallMaterialId: id });
  },

  addFurniture(defId) {
    const id = nextId(defId);
    const { placements, project } = get();
    // Stagger new items in a small spiral so they don't stack on the centre.
    const n = placements.length;
    const step = 0.6;
    const offset: [number, number, number] = [
      ((n % 3) - 1) * step,
      0,
      (Math.floor(n / 3) % 3 - 1) * step,
    ];
    const size = getFurnitureSize(defId);
    const pos =
      size && project ? clampToRoom(offset, size, project.room.size) : offset;
    const placement: Placement = { id, defId, position: pos, rotationY: 0 };
    set((s) => ({ placements: [...s.placements, placement], selectedId: id }));
  },

  moveSelected(pos) {
    const { selectedId, project, placements } = get();
    if (!selectedId || !project) return;
    set({
      placements: placements.map((p) => {
        if (p.id !== selectedId) return p;
        const size = getFurnitureSize(p.defId);
        const clamped = size
          ? clampToRoom(pos, size, project.room.size)
          : pos;
        return { ...p, position: clamped };
      }),
    });
  },

  rotateSelected(deltaY) {
    const { selectedId, placements } = get();
    if (!selectedId) return;
    set({
      placements: placements.map((p) =>
        p.id === selectedId ? { ...p, rotationY: p.rotationY + deltaY } : p
      ),
    });
  },

  removeSelected() {
    const { selectedId, placements } = get();
    if (!selectedId) return;
    set({
      placements: placements.filter((p) => p.id !== selectedId),
      selectedId: null,
    });
  },

  select(id) {
    set({ selectedId: id });
  },
}));
