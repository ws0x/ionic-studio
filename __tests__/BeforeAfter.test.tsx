import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BeforeAfter from "@/components/BeforeAfter";
import { LocaleProvider } from "@/lib/i18n";
import React from "react";

function renderBeforeAfter(initialLocale: "ar" | "en" = "en") {
  return render(
    <LocaleProvider initialLocale={initialLocale}>
      <BeforeAfter />
    </LocaleProvider>
  );
}

describe("BeforeAfter Component", () => {
  it("renders the headline and all case study switcher buttons", () => {
    renderBeforeAfter("en");
    expect(screen.getByText("From Core & Shell to Turnkey Luxury")).toBeDefined();
    expect(screen.getByRole("button", { name: /Mivida Grand Villa Reception/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Allegria Penthouse Residence/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Katameya Dunes Royal Suite/i })).toBeDefined();
  });

  it("switches active case study when button is clicked", () => {
    renderBeforeAfter("en");
    const allegriaBtn = screen.getByRole("button", { name: /Allegria Penthouse Residence/i });
    fireEvent.click(allegriaBtn);

    expect(allegriaBtn.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByText(/Allegria · SODIC West/)).toBeDefined();
  });

  it("supports keyboard navigation for slider position", () => {
    renderBeforeAfter("en");
    const slider = screen.getByRole("slider");
    expect(slider.getAttribute("aria-valuenow")).toBe("50");

    // ArrowRight -> increases by 5
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(slider.getAttribute("aria-valuenow")).toBe("55");

    // ArrowLeft -> decreases by 5
    fireEvent.keyDown(slider, { key: "ArrowLeft" });
    expect(slider.getAttribute("aria-valuenow")).toBe("50");

    // Home -> 0
    fireEvent.keyDown(slider, { key: "Home" });
    expect(slider.getAttribute("aria-valuenow")).toBe("0");

    // End -> 100
    fireEvent.keyDown(slider, { key: "End" });
    expect(slider.getAttribute("aria-valuenow")).toBe("100");
  });
});
