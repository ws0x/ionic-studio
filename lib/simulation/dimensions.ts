// ── Pure dimension math & locale-aware formatting ────────────────────────────
// Framework-free so it can be unit-tested without a browser/WebGL context.

import type { Locale } from "@/lib/i18n";
import type { FurnitureDef } from "./types";

/** Euclidean distance between two 3D points (metres). */
export function distance3(
  a: [number, number, number],
  b: [number, number, number]
): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/** Floor area of a rectangular room (m²). */
export function floorArea(size: { w: number; d: number }): number {
  return round(size.w * size.d, 2);
}

/** Round to n decimal places without floating-point noise. */
export function round(value: number, decimals = 2): number {
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}

/**
 * Format a length in metres for display.
 * < 1 m is shown in centimetres; otherwise metres with the locale unit.
 */
export function formatLength(metres: number, locale: Locale): string {
  const m = round(metres, 2);
  if (m < 1) {
    const cm = Math.round(m * 100);
    return locale === "ar" ? `${cm} سم` : `${cm} cm`;
  }
  const unit = locale === "ar" ? "م" : "m";
  // strip trailing .0
  const num = Number.isInteger(m) ? String(m) : m.toFixed(2).replace(/0$/, "");
  return `${num} ${unit}`;
}

/** Format a furniture item's footprint as "W × D × H". */
export function formatFootprint(def: FurnitureDef, locale: Locale): string {
  const { w, d, h } = def.size;
  return [w, d, h].map((v) => formatLength(v, locale)).join(" × ");
}

/** Clamp a value to [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Keep a furniture item fully inside the room footprint, accounting for its size.
 * Returns a corrected [x, y, z] (y is preserved).
 */
export function clampToRoom(
  position: [number, number, number],
  itemSize: { w: number; d: number },
  roomSize: { w: number; d: number }
): [number, number, number] {
  const halfW = roomSize.w / 2 - itemSize.w / 2;
  const halfD = roomSize.d / 2 - itemSize.d / 2;
  return [
    clamp(position[0], -halfW, halfW),
    position[1],
    clamp(position[2], -halfD, halfD),
  ];
}
