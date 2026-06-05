import { describe, it, expect, beforeEach } from "vitest";
import { useSimStore } from "@/lib/simulation/store";
import { demoProject } from "@/lib/simulation/catalog";

// The Zustand store is a singleton; reset to a known project before each test.
beforeEach(() => {
  useSimStore.getState().init(demoProject);
});

const s = () => useSimStore.getState();

describe("store: init", () => {
  it("seeds materials from the project room", () => {
    expect(s().floorMaterialId).toBe(demoProject.room.floorMaterialId);
    expect(s().wallMaterialId).toBe(demoProject.room.wallMaterialId);
    expect(s().placements).toEqual([]);
    expect(s().cameraMode).toBe("orbit");
  });
});

describe("store: camera & lighting", () => {
  it("switches camera mode", () => {
    s().setCameraMode("walk");
    expect(s().cameraMode).toBe("walk");
  });

  it("clamps time of day to 0..24", () => {
    s().setTimeOfDay(30);
    expect(s().timeOfDay).toBe(24);
    s().setTimeOfDay(-5);
    expect(s().timeOfDay).toBe(0);
    s().setTimeOfDay(13.5);
    expect(s().timeOfDay).toBe(13.5);
  });
});

describe("store: materials", () => {
  it("sets floor and wall materials independently", () => {
    s().setMaterial("floor", "floor-marble");
    s().setMaterial("wall", "wall-charcoal");
    expect(s().floorMaterialId).toBe("floor-marble");
    expect(s().wallMaterialId).toBe("wall-charcoal");
  });
});

describe("store: furniture lifecycle", () => {
  it("adds an item and auto-selects it", () => {
    s().addFurniture("sofa-3seat");
    expect(s().placements.length).toBe(1);
    expect(s().placements[0].defId).toBe("sofa-3seat");
    expect(s().selectedId).toBe(s().placements[0].id);
  });

  it("staggers multiple items so they do not perfectly overlap", () => {
    s().addFurniture("armchair");
    s().addFurniture("armchair");
    const [a, b] = s().placements;
    expect(a.position).not.toEqual(b.position);
  });

  it("moves the selected item and clamps it to the room", () => {
    s().addFurniture("coffee-table"); // 1.1 x 0.6
    s().moveSelected([100, 0, 100]); // far outside
    const p = s().placements[0];
    // room 6x5 → x bound 3-0.55=2.45, z bound 2.5-0.3=2.2
    expect(p.position[0]).toBeLessThanOrEqual(2.45);
    expect(p.position[2]).toBeLessThanOrEqual(2.2);
  });

  it("rotates the selected item", () => {
    s().addFurniture("armchair");
    s().rotateSelected(Math.PI / 2);
    expect(s().placements[0].rotationY).toBeCloseTo(Math.PI / 2);
  });

  it("removes the selected item and clears selection", () => {
    s().addFurniture("armchair");
    s().removeSelected();
    expect(s().placements.length).toBe(0);
    expect(s().selectedId).toBeNull();
  });

  it("does nothing when moving with no selection", () => {
    s().select(null);
    s().moveSelected([1, 0, 1]);
    expect(s().placements.length).toBe(0);
  });
});

describe("store: hydrate (shared link) & reset", () => {
  it("hydrates a subset of state from a decoded scene", () => {
    s().hydrate({
      floorMaterialId: "floor-walnut",
      timeOfDay: 20,
      placements: [{ id: "rug-9", defId: "rug", position: [0, 0, 0], rotationY: 0 }],
    });
    expect(s().floorMaterialId).toBe("floor-walnut");
    expect(s().timeOfDay).toBe(20);
    expect(s().placements.length).toBe(1);
    // unspecified field stays unchanged
    expect(s().wallMaterialId).toBe(demoProject.room.wallMaterialId);
  });

  it("reset restores room defaults and clears furniture", () => {
    s().setMaterial("floor", "floor-marble");
    s().addFurniture("armchair");
    s().setTimeOfDay(2);
    s().reset();
    expect(s().floorMaterialId).toBe(demoProject.room.floorMaterialId);
    expect(s().placements).toEqual([]);
    expect(s().timeOfDay).toBe(13);
  });
});
