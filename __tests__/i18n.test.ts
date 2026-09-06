import { describe, it, expect } from "vitest";
import { dict, type DictKey } from "@/lib/i18n";

describe("i18n Dictionary Parity and Completeness", () => {
  const keys = Object.keys(dict) as DictKey[];

  it("has non-empty dictionary entries", () => {
    expect(keys.length).toBeGreaterThan(30);
  });

  it("every dictionary entry has valid, non-empty Arabic and English translations", () => {
    for (const key of keys) {
      const entry = dict[key];
      expect(entry, `Entry for key "${key}" must exist`).toBeDefined();
      expect(typeof entry.ar, `Arabic translation for "${key}" must be a string`).toBe("string");
      expect(typeof entry.en, `English translation for "${key}" must be a string`).toBe("string");
      expect(entry.ar.trim().length, `Arabic text for "${key}" must not be empty`).toBeGreaterThan(0);
      expect(entry.en.trim().length, `English text for "${key}" must not be empty`).toBeGreaterThan(0);
    }
  });

  it("contains all critical conversion and navigation keys", () => {
    const requiredKeys: DictKey[] = [
      "nav.home",
      "nav.projects",
      "nav.simulate",
      "nav.quote",
      "hero.title",
      "hero.ctaPrimary",
      "quote.name",
      "quote.phone",
      "quote.submit",
      "quote.stage",
      "quote.successTitle",
      "work.simulateCTA",
    ];

    for (const req of requiredKeys) {
      expect(dict[req], `Required key "${req}" must be present in dictionary`).toBeDefined();
    }
  });
});
