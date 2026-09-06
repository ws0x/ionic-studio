import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CostEstimator from "@/components/CostEstimator";
import { LocaleProvider } from "@/lib/i18n";
import React from "react";

function renderEstimator(initialLocale: "ar" | "en" = "en") {
  return render(
    <LocaleProvider initialLocale={initialLocale}>
      <CostEstimator />
    </LocaleProvider>
  );
}

describe("CostEstimator Component", () => {
  it("renders all 3 finishing packages", () => {
    renderEstimator("en");
    expect(screen.getByRole("button", { name: /Signature/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Prestige/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Bespoke Royal/i })).toBeDefined();
  });

  it("defaults to Prestige package and 180 m2 with accurate calculations", () => {
    renderEstimator("en");
    // 180m2 * 14000 = 2,520,000 and 180m2 * 18500 = 3,330,000
    expect(screen.getByText(/2,520,000/)).toBeDefined();
    expect(screen.getByText(/3,330,000/)).toBeDefined();
    expect(screen.getByText("180")).toBeDefined();
  });

  it("recalculates when switching to Signature package", () => {
    renderEstimator("en");
    const sigBtn = screen.getByRole("button", { name: /Signature/i });
    fireEvent.click(sigBtn);

    // 180 * 9,500 = 1,710,000 and 180 * 12,500 = 2,250,000
    expect(screen.getByText(/1,710,000/)).toBeDefined();
    expect(screen.getByText(/2,250,000/)).toBeDefined();
  });

  it("updates calculations dynamically when area slider changes", () => {
    renderEstimator("en");
    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "300" } });

    // Prestige rate: 14000 - 18500. For 300m2: 4,200,000 - 5,550,000
    expect(screen.getByText(/4,200,000/)).toBeDefined();
    expect(screen.getByText(/5,550,000/)).toBeDefined();
  });

  it("provides WhatsApp and 3D simulation links", () => {
    renderEstimator("en");
    const waLink = screen.getByRole("link", { name: /Book Site Survey/i });
    expect(waLink.getAttribute("href")).toContain("wa.me/201026040854");
    expect(waLink.getAttribute("href")).toContain("Prestige");

    const simLink = screen.getByRole("link", { name: /Customize Materials in 3D Simulator/i });
    expect(simLink.getAttribute("href")).toBe("/simulate");
  });
});
