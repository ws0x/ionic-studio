import { describe, it, expect } from "vitest";
import {
  encodeScene,
  decodeScene,
  buildShareUrl,
  buildWhatsAppShare,
  type ShareableScene,
} from "@/lib/simulation/share";

const scene: ShareableScene = {
  floorMaterialId: "floor-oak",
  wallMaterialId: "wall-charcoal",
  timeOfDay: 18,
  placements: [
    { id: "sofa-3seat-1", defId: "sofa-3seat", position: [1, 0, -1], rotationY: 0 },
    { id: "rug-2", defId: "rug", position: [0, 0, 0], rotationY: 1.57 },
  ],
};

describe("share: encode/decode round-trip", () => {
  it("decodes back to the original scene", () => {
    const encoded = encodeScene(scene);
    const decoded = decodeScene(encoded);
    expect(decoded).toEqual(scene);
  });

  it("produces a URL-safe string (no + / =)", () => {
    const encoded = encodeScene(scene);
    expect(encoded).not.toMatch(/[+/=]/);
  });

  it("returns null on malformed input", () => {
    expect(decodeScene("not-valid-base64!!!")).toBeNull();
    expect(decodeScene("")).toBeNull();
  });

  it("returns null on a version mismatch", () => {
    // hand-craft a payload with wrong version
    const bad = Buffer.from(JSON.stringify({ v: 999, ...scene }), "utf-8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    expect(decodeScene(bad)).toBeNull();
  });

  it("rejects payloads missing required fields", () => {
    const partial = Buffer.from(JSON.stringify({ v: 1, floorMaterialId: "x" }), "utf-8")
      .toString("base64url");
    expect(decodeScene(partial)).toBeNull();
  });
});

describe("share: URL builders", () => {
  it("buildShareUrl embeds project id and scene", () => {
    const url = buildShareUrl("https://ionicdesignhouse.com", "demo", scene);
    expect(url).toContain("https://ionicdesignhouse.com/simulate?p=demo&s=");
    // the scene portion should decode back
    const s = new URL(url).searchParams.get("s")!;
    expect(decodeScene(s)).toEqual(scene);
  });

  it("buildWhatsAppShare wraps the link in a wa.me deep link", () => {
    const wa = buildWhatsAppShare("201060965845", "https://x.com/s", "en");
    expect(wa).toContain("https://wa.me/201060965845?text=");
    expect(decodeURIComponent(wa)).toContain("https://x.com/s");
  });

  it("buildWhatsAppShare localises the message", () => {
    const ar = buildWhatsAppShare("201060965845", "https://x.com/s", "ar");
    expect(decodeURIComponent(ar)).toContain("مرحباً");
  });
});
