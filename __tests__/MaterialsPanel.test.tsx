import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach } from "vitest";
import { LocaleProvider } from "@/lib/i18n";
import { useSimStore } from "@/lib/simulation/store";
import { demoProject, materials } from "@/lib/simulation/catalog";
import { MaterialsPanel } from "@/components/simulate/panels/MaterialsPanel";

beforeEach(() => {
  useSimStore.getState().init(demoProject);
  // Default locale is "en"; LocaleProvider also reads localStorage which jsdom
  // provides empty, so "en" stands.
});
afterEach(cleanup);

function renderPanel() {
  return render(
    <LocaleProvider>
      <MaterialsPanel materials={materials} />
    </LocaleProvider>
  );
}

describe("MaterialsPanel (component + store integration)", () => {
  it("renders flooring and wall groups with material names", () => {
    renderPanel();
    expect(screen.getByText("Flooring")).toBeInTheDocument();
    expect(screen.getByText("Walls")).toBeInTheDocument();
    expect(screen.getByText("Oak Wood")).toBeInTheDocument();
    expect(screen.getByText("Italian Marble")).toBeInTheDocument();
    expect(screen.getByText("Charcoal")).toBeInTheDocument();
  });

  it("marks the active floor material as pressed", () => {
    renderPanel();
    const oak = screen.getByText("Oak Wood").closest("button")!;
    expect(oak).toHaveAttribute("aria-pressed", "true");
  });

  it("clicking a material dispatches to the store", async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByText("Italian Marble"));
    expect(useSimStore.getState().floorMaterialId).toBe("floor-marble");

    await user.click(screen.getByText("Charcoal"));
    expect(useSimStore.getState().wallMaterialId).toBe("wall-charcoal");
  });

  it("shows a cost-tier indicator for each material", () => {
    renderPanel();
    // Italian Marble is tier 3 → three filled dots
    const marble = screen.getByText("Italian Marble").closest("button")!;
    expect(marble.textContent).toContain("●●●");
  });
});
