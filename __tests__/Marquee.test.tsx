import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Marquee } from "@/components/Marquee";

vi.mock("@/lib/i18n", () => ({
  useLocale: () => ({
    locale: "en",
    t: (k: string) => k,
  }),
}));

describe("Marquee Component", () => {
  it("renders architectural enterprise brand names", () => {
    render(<Marquee />);
    expect(screen.getAllByText("Valu").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Starbucks").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Hugo Boss").length).toBeGreaterThan(0);
  });
});
