import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Portfolio } from "@/components/Portfolio";

vi.mock("@/lib/i18n", () => ({
  useLocale: () => ({
    locale: "en",
    t: (k: string) => k,
  }),
}));

describe("Portfolio Component", () => {
  it("renders architectural sector filters (All, Administration, F&B, Retail, Residential)", () => {
    render(<Portfolio showFilters />);
    expect(screen.getByRole("button", { name: "All Projects" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Administration" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "F&B" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retail" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Residential" })).toBeInTheDocument();
  });

  it("filters project cards when a sector tab is clicked", () => {
    render(<Portfolio showFilters />);
    const fbBtn = screen.getByRole("button", { name: "F&B" });
    fireEvent.click(fbBtn);
    expect(screen.getByText(/PAUL French Bakery/i)).toBeInTheDocument();
  });
});
