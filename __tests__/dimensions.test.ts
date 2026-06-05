import { describe, it, expect } from "vitest";
import {
  distance3,
  floorArea,
  round,
  formatLength,
  formatFootprint,
  clamp,
  clampToRoom,
} from "@/lib/simulation/dimensions";
import type { FurnitureDef } from "@/lib/simulation/types";

describe("dimensions: math", () => {
  it("distance3 computes Euclidean distance", () => {
    expect(distance3([0, 0, 0], [3, 0, 4])).toBe(5);
    expect(distance3([1, 1, 1], [1, 1, 1])).toBe(0);
  });

  it("floorArea multiplies width by depth", () => {
    expect(floorArea({ w: 6, d: 5 })).toBe(30);
    expect(floorArea({ w: 2.5, d: 2 })).toBe(5);
  });

  it("round avoids floating-point noise", () => {
    expect(round(0.1 + 0.2, 2)).toBe(0.3);
    expect(round(1.23456, 3)).toBe(1.235);
  });

  it("clamp constrains to range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(99, 0, 10)).toBe(10);
  });
});

describe("dimensions: formatting", () => {
  it("formats sub-metre lengths in centimetres", () => {
    expect(formatLength(0.4, "en")).toBe("40 cm");
    expect(formatLength(0.95, "en")).toBe("95 cm");
    expect(formatLength(0.4, "ar")).toBe("40 سم");
  });

  it("formats metre lengths with locale unit", () => {
    expect(formatLength(2.2, "en")).toBe("2.2 m");
    expect(formatLength(6, "en")).toBe("6 m");
    expect(formatLength(6, "ar")).toBe("6 م");
  });

  it("formats a furniture footprint as W x D x H", () => {
    const sofa: FurnitureDef = {
      id: "s",
      name: { ar: "كنبة", en: "Sofa" },
      category: "sofa",
      size: { w: 2.2, d: 0.95, h: 0.85 },
      color: "#000",
    };
    expect(formatFootprint(sofa, "en")).toBe("2.2 m × 95 cm × 85 cm");
  });
});

describe("dimensions: clampToRoom", () => {
  const room = { w: 6, d: 5 };
  const item = { w: 2, d: 1 };

  it("keeps an item inside the room footprint accounting for its size", () => {
    // room half extents: x ±3, z ±2.5 ; item half: x 1, z 0.5
    // so allowed centre range: x ±2, z ±2
    expect(clampToRoom([10, 0, 10], item, room)).toEqual([2, 0, 2]);
    expect(clampToRoom([-10, 0, -10], item, room)).toEqual([-2, 0, -2]);
  });

  it("leaves an in-bounds position unchanged", () => {
    expect(clampToRoom([1, 0, 1], item, room)).toEqual([1, 0, 1]);
  });

  it("preserves the y coordinate", () => {
    expect(clampToRoom([0, 3.7, 0], item, room)[1]).toBe(3.7);
  });
});
