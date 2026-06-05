import { describe, it, expect } from "vitest";
import {
  materials,
  furniture,
  demoProject,
  getMaterial,
  getFurniture,
  getSimulationPayload,
} from "@/lib/simulation/catalog";

describe("catalog: integrity", () => {
  it("has unique material ids", () => {
    const ids = materials.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has unique furniture ids", () => {
    const ids = furniture.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every material has bilingual names and valid cost tier", () => {
    for (const m of materials) {
      expect(m.name.ar.length).toBeGreaterThan(0);
      expect(m.name.en.length).toBeGreaterThan(0);
      expect([1, 2, 3]).toContain(m.costTier);
      expect(m.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it("every furniture item has positive dimensions and bilingual names", () => {
    for (const f of furniture) {
      expect(f.name.ar.length).toBeGreaterThan(0);
      expect(f.name.en.length).toBeGreaterThan(0);
      expect(f.size.w).toBeGreaterThan(0);
      expect(f.size.d).toBeGreaterThan(0);
      expect(f.size.h).toBeGreaterThan(0);
    }
  });

  it("demo project references existing materials", () => {
    expect(getMaterial(demoProject.room.floorMaterialId)).toBeDefined();
    expect(getMaterial(demoProject.room.wallMaterialId)).toBeDefined();
  });

  it("default floor material is a floor, wall is a wall", () => {
    expect(getMaterial(demoProject.room.floorMaterialId)?.category).toBe("floor");
    expect(getMaterial(demoProject.room.wallMaterialId)?.category).toBe("wall");
  });
});

describe("catalog: lookups", () => {
  it("getMaterial / getFurniture return undefined for unknown ids", () => {
    expect(getMaterial("nope")).toBeUndefined();
    expect(getFurniture("nope")).toBeUndefined();
  });
});

describe("catalog: API payload (route logic)", () => {
  it("returns the full payload for the demo id", () => {
    const payload = getSimulationPayload("demo");
    expect(payload).not.toBeNull();
    expect(payload!.project.id).toBe("demo");
    expect(payload!.materials.length).toBe(materials.length);
    expect(payload!.furniture.length).toBe(furniture.length);
  });

  it("returns null for an unknown project id", () => {
    expect(getSimulationPayload("ghost")).toBeNull();
  });
});
