import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Stats } from "@/components/Stats";

vi.mock("@/lib/i18n", () => ({
  useLocale: () => ({
    locale: "en",
    t: (k: string) => k,
  }),
}));

describe("Stats Component", () => {
  it("renders architectural metrics matching reference credentials", () => {
    render(<Stats />);
    expect(screen.getByText("15+")).toBeInTheDocument();
    expect(screen.getByText("+30")).toBeInTheDocument();
    expect(screen.getByText("180+")).toBeInTheDocument();
    expect(screen.getByText("99.4%")).toBeInTheDocument();
  });
});
