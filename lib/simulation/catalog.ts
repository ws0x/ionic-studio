// ── MVP static catalogue ─────────────────────────────────────────────────────
// PLACEHOLDER DATA — this is the seam where a future CMS (Payload) plugs in.
// The /api/simulation/[id] route serves this today; swap the source in V2 and
// the frontend contract stays unchanged.

import type {
  FurnitureDef,
  MaterialDef,
  SimulationProject,
  SimulationPayload,
} from "./types";

export const materials: MaterialDef[] = [
  // Floors
  { id: "floor-oak", name: { ar: "خشب بلوط", en: "Oak Wood" }, category: "floor", color: "#b08a5e", roughness: 0.7, metalness: 0, costTier: 2 },
  { id: "floor-marble", name: { ar: "رخام إيطالي", en: "Italian Marble" }, category: "floor", color: "#ece9e2", roughness: 0.15, metalness: 0.1, costTier: 3 },
  { id: "floor-concrete", name: { ar: "خرسانة ملمّعة", en: "Polished Concrete" }, category: "floor", color: "#9c9a96", roughness: 0.5, metalness: 0, costTier: 1 },
  { id: "floor-walnut", name: { ar: "خشب جوز", en: "Walnut Wood" }, category: "floor", color: "#5c4433", roughness: 0.65, metalness: 0, costTier: 3 },
  // Walls
  { id: "wall-white", name: { ar: "أبيض مطفي", en: "Matte White" }, category: "wall", color: "#f5f4f1", roughness: 0.9, metalness: 0, costTier: 1 },
  { id: "wall-greige", name: { ar: "بيج رمادي", en: "Greige" }, category: "wall", color: "#cfc8ba", roughness: 0.9, metalness: 0, costTier: 1 },
  { id: "wall-charcoal", name: { ar: "فحمي", en: "Charcoal" }, category: "wall", color: "#3a3a38", roughness: 0.85, metalness: 0, costTier: 2 },
  { id: "wall-sage", name: { ar: "أخضر مريمية", en: "Sage Green" }, category: "wall", color: "#9aa890", roughness: 0.9, metalness: 0, costTier: 2 },
];

export const furniture: FurnitureDef[] = [
  { id: "sofa-3seat", name: { ar: "كنبة ٣ مقاعد", en: "3-Seat Sofa" }, category: "sofa", size: { w: 2.2, d: 0.95, h: 0.85 }, color: "#6b7280" },
  { id: "armchair", name: { ar: "كرسي مفرد", en: "Armchair" }, category: "chair", size: { w: 0.8, d: 0.85, h: 0.95 }, color: "#8b7d6b" },
  { id: "coffee-table", name: { ar: "طاولة قهوة", en: "Coffee Table" }, category: "table", size: { w: 1.1, d: 0.6, h: 0.4 }, color: "#5c4433" },
  { id: "dining-table", name: { ar: "طاولة طعام", en: "Dining Table" }, category: "table", size: { w: 1.6, d: 0.9, h: 0.75 }, color: "#6b4f3a" },
  { id: "bed-queen", name: { ar: "سرير كوين", en: "Queen Bed" }, category: "bed", size: { w: 1.6, d: 2.1, h: 0.5 }, color: "#9ca3af" },
  { id: "tv-unit", name: { ar: "وحدة تلفاز", en: "TV Unit" }, category: "storage", size: { w: 1.8, d: 0.45, h: 0.5 }, color: "#3f3f46" },
  { id: "bookshelf", name: { ar: "مكتبة كتب", en: "Bookshelf" }, category: "storage", size: { w: 0.9, d: 0.35, h: 1.8 }, color: "#7c5e44" },
  { id: "rug", name: { ar: "سجادة", en: "Area Rug" }, category: "rug", size: { w: 2.4, d: 1.6, h: 0.02 }, color: "#a8836b" },
];

// Default demo project — a living room. Future: one record per client unit.
export const demoProject: SimulationProject = {
  id: "demo",
  name: { ar: "غرفة معيشة نموذجية", en: "Demo Living Room" },
  room: {
    id: "living",
    name: { ar: "غرفة المعيشة", en: "Living Room" },
    size: { w: 6, d: 5, h: 3 },
    floorMaterialId: "floor-oak",
    wallMaterialId: "wall-white",
  },
  availableMaterials: materials.map((m) => m.id),
  availableFurniture: furniture.map((f) => f.id),
};

/** Look up helpers — used by both the API stub and the scene. */
export function getMaterial(id: string): MaterialDef | undefined {
  return materials.find((m) => m.id === id);
}

export function getFurniture(id: string): FurnitureDef | undefined {
  return furniture.find((f) => f.id === id);
}

/** Assemble the full payload for a project id (MVP: only "demo"). */
export function getSimulationPayload(id: string): SimulationPayload | null {
  if (id !== demoProject.id) return null;
  return { project: demoProject, materials, furniture };
}
