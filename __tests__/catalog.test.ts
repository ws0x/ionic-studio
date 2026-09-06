import { describe, it, expect } from "vitest";
import {
  materials,
  furniture,
  simulationPresets,
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

  it("all simulation presets have valid dimensions and existing materials", () => {
    const presetKeys = Object.keys(simulationPresets);
    expect(presetKeys).toContain("demo");
    expect(presetKeys).toContain("villa-reception");
    expect(presetKeys).toContain("penthouse-master");
    expect(presetKeys).toContain("corporate-office");

    for (const key of presetKeys) {
      const proj = simulationPresets[key];
      expect(proj.room.size.w).toBeGreaterThan(0);
      expect(proj.room.size.d).toBeGreaterThan(0);
      expect(proj.room.size.h).toBeGreaterThan(0);
      expect(getMaterial(proj.room.floorMaterialId)).toBeDefined();
      expect(getMaterial(proj.room.wallMaterialId)).toBeDefined();
    }
  });
});

describe("catalog: lookups", () => {
  it("getMaterial / getFurniture return undefined for unknown ids", () => {
    expect(getMaterial("nope")).toBeUndefined();
    expect(getFurniture("nope")).toBeUndefined();
  });
});

describe("catalog: API payload (route logic)", () => {
  it("returns full payload for all registered simulation presets", () => {
    for (const id of ["demo", "villa-reception", "penthouse-master", "corporate-office"]) {
      const payload = getSimulationPayload(id);
      expect(payload).not.toBeNull();
      expect(payload!.project.id).toBe(id);
      expect(payload!.materials.length).toBe(materials.length);
      expect(payload!.furniture.length).toBe(furniture.length);
    }
  });

  it("returns null for an unknown project id", () => {
    expect(getSimulationPayload("ghost")).toBeNull();
  });
});

