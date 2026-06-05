// ── Scene serialisation & sharing ────────────────────────────────────────────
// Pure functions: encode the scene state into a compact, URL-safe string and
// back. Used for shareable links and the "Send on WhatsApp" lead flow.

import type { Placement } from "./types";

export interface ShareableScene {
  floorMaterialId: string;
  wallMaterialId: string;
  timeOfDay: number;
  placements: Placement[];
}

const VERSION = 1;

/** Encode a scene to a URL-safe base64 string. */
export function encodeScene(scene: ShareableScene): string {
  const payload = { v: VERSION, ...scene };
  const json = JSON.stringify(payload);
  return toBase64Url(json);
}

/** Decode a scene string. Returns null on any malformed/incompatible input. */
export function decodeScene(encoded: string): ShareableScene | null {
  try {
    const json = fromBase64Url(encoded);
    const data = JSON.parse(json);
    if (data.v !== VERSION) return null;
    if (
      typeof data.floorMaterialId !== "string" ||
      typeof data.wallMaterialId !== "string" ||
      typeof data.timeOfDay !== "number" ||
      !Array.isArray(data.placements)
    ) {
      return null;
    }
    return {
      floorMaterialId: data.floorMaterialId,
      wallMaterialId: data.wallMaterialId,
      timeOfDay: data.timeOfDay,
      placements: data.placements,
    };
  } catch {
    return null;
  }
}

/** Build a full shareable URL for a project + scene. */
export function buildShareUrl(
  origin: string,
  projectId: string,
  scene: ShareableScene
): string {
  const s = encodeScene(scene);
  return `${origin}/simulate?p=${encodeURIComponent(projectId)}&s=${s}`;
}

/** Build a WhatsApp deep link carrying the share URL (matches studio lead flow). */
export function buildWhatsAppShare(
  phone: string,
  shareUrl: string,
  locale: "ar" | "en"
): string {
  const msg =
    locale === "ar"
      ? `مرحباً أيونيك ديزاين هاوس، هذه رؤيتي للمساحة: ${shareUrl}`
      : `Hello Ionic Design House, here is my space concept: ${shareUrl}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

// ── base64url helpers (work in both browser and Node/test) ───────────────────
function toBase64Url(str: string): string {
  const b64 =
    typeof btoa !== "undefined"
      ? btoa(unescape(encodeURIComponent(str)))
      : Buffer.from(str, "utf-8").toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(b64url: string): string {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  if (typeof atob !== "undefined") {
    return decodeURIComponent(escape(atob(b64)));
  }
  return Buffer.from(b64, "base64").toString("utf-8");
}
