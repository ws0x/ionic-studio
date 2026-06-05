// ── 3D Simulation data models ────────────────────────────────────────────────
// These interfaces define the shape a future CMS (Payload) will populate.
// Today they are served from a static catalogue (catalog.ts); the API contract
// at /api/simulation/[id] stays identical when the CMS lands.

export type Bi = { ar: string; en: string };

export type MaterialCategory = "floor" | "wall" | "ceiling";

export interface MaterialDef {
  id: string;
  name: Bi;
  category: MaterialCategory;
  color: string; // hex — MVP uses solid colours
  roughness: number; // 0..1 PBR
  metalness: number; // 0..1 PBR
  costTier: 1 | 2 | 3; // ●○○ budget … ●●● premium
  textureUrl?: string; // future: tileable texture map
}

export type FurnitureCategory =
  | "sofa"
  | "bed"
  | "table"
  | "chair"
  | "storage"
  | "rug";

export interface FurnitureDef {
  id: string;
  name: Bi;
  category: FurnitureCategory;
  size: { w: number; d: number; h: number }; // metres
  color: string;
  modelUrl?: string; // future: per-item GLB
}

export interface Placement {
  id: string; // unique instance id
  defId: string; // → FurnitureDef.id
  position: [number, number, number];
  rotationY: number; // radians
}

export interface RoomDef {
  id: string;
  name: Bi;
  size: { w: number; d: number; h: number }; // metres
  floorMaterialId: string;
  wallMaterialId: string;
}

export interface SimulationProject {
  id: string;
  name: Bi;
  room: RoomDef;
  availableMaterials: string[]; // MaterialDef ids
  availableFurniture: string[]; // FurnitureDef ids
}

export interface SimulationPayload {
  project: SimulationProject;
  materials: MaterialDef[];
  furniture: FurnitureDef[];
}
