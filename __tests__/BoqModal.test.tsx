import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BoqModal } from "@/components/simulate/panels/BoqModal";
import { LocaleProvider } from "@/lib/i18n";
import type { SimulationProject, MaterialDef, FurnitureDef } from "@/lib/simulation/types";
import { simulationPresets } from "@/lib/simulation/catalog";
import React from "react";

const testProject: SimulationProject = simulationPresets["demo"];

const testMaterials: MaterialDef[] = [
  {
    id: "marble-calacatta",
    name: { ar: "رخام كلكتا إيطالي", en: "Italian Calacatta Marble" },
    category: "floor",
    roughness: 0.1,
    metalness: 0.05,
    color: "#f5f5f5",
  },
  {
    id: "paint-warm-white",
    name: { ar: "دهان أبيض دافئ", en: "Warm White Paint" },
    category: "wall",
    roughness: 0.8,
    metalness: 0.0,
    color: "#faf8f5",
  },
];

const testFurniture: FurnitureDef[] = [];

describe("BoqModal Component", () => {
  it("does not render when isOpen is false", () => {
    render(
      <LocaleProvider initialLocale="en">
        <BoqModal
          project={testProject}
          materials={testMaterials}
          furniture={testFurniture}
          isOpen={false}
          onClose={() => {}}
        />
      </LocaleProvider>
    );

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders computed areas, dimensions, and materials when open", () => {
    render(
      <LocaleProvider initialLocale="en">
        <BoqModal
          project={testProject}
          materials={testMaterials}
          furniture={testFurniture}
          isOpen={true}
          onClose={() => {}}
        />
      </LocaleProvider>
    );

    expect(screen.getByRole("dialog")).toBeDefined();
    // Dimensions 6 x 5m -> Floor Area: 30 m2, Wall Surface: 2 * (6 + 5) * 3 = 66 m2
    expect(screen.getByText("30")).toBeDefined();
    expect(screen.getByText("66")).toBeDefined();
    expect(screen.getByText(/6 × 5 × 3m/)).toBeDefined();
  });

  it("provides WhatsApp export link and triggers onClose when clicked", () => {
    const handleClose = vi.fn();

    render(
      <LocaleProvider initialLocale="en">
        <BoqModal
          project={testProject}
          materials={testMaterials}
          furniture={testFurniture}
          isOpen={true}
          onClose={handleClose}
        />
      </LocaleProvider>
    );

    const waLink = screen.getByRole("link", { name: /Send BOQ to WhatsApp/i });
    expect(waLink.getAttribute("href")).toContain("wa.me");

    const closeBtn = screen.getByRole("button", { name: /Close/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
