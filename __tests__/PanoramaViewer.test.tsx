import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PanoramaViewer, PANORAMA_SCENES } from "@/components/viewer/PanoramaViewer";
import { LocaleProvider } from "@/lib/i18n";
import React from "react";

function renderViewer(props: React.ComponentProps<typeof PanoramaViewer> = {}) {
  return render(
    <LocaleProvider initialLocale="en">
      <PanoramaViewer {...props} />
    </LocaleProvider>
  );
}


// Mock HTMLCanvasElement.getContext to support WebGL in jsdom
beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation((contextId) => {
    if (contextId === "2d") {
      return {
        createLinearGradient: () => ({
          addColorStop: vi.fn(),
        }),
        fillRect: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        stroke: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        strokeRect: vi.fn(),
        fillText: vi.fn(),
      };
    }
    if (contextId === "webgl" || contextId === "webgl2") {
      return {
        getExtension: vi.fn(),
        getParameter: vi.fn(),
        createTexture: vi.fn(),
        bindTexture: vi.fn(),
        texParameteri: vi.fn(),
        viewport: vi.fn(),
        clearColor: vi.fn(),
        clear: vi.fn(),
        enable: vi.fn(),
        disable: vi.fn(),
      };
    }
    return null;
  });
});

describe("PanoramaViewer Component", () => {
  it("renders with default preset scenes and controls", () => {
    renderViewer();

    // Check all scenes are present in selector
    expect(screen.getAllByText("Grand Reception & Dining Salon").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Executive Master Bedroom Suite")).toBeDefined();
    expect(screen.getByText("Minimalist Island Kitchen")).toBeDefined();

    // Check Day/Night toggle is available
    expect(screen.getByText("Daylight")).toBeDefined();

  });

  it("switches scene when room button is clicked", () => {
    renderViewer();

    const kitchenBtn = screen.getByText("Minimalist Island Kitchen");
    fireEvent.click(kitchenBtn);

    // Active room description updates
    expect(
      screen.getByText(
        "Seamless open kitchen featuring antibacterial quartz waterfall island and concealed appliances"
      )
    ).toBeDefined();
  });

  it("toggles between daylight and evening glow ambiance", () => {
    renderViewer();


    const toggleBtn = screen.getByTitle("Toggle Daylight / Evening Mood");
    fireEvent.click(toggleBtn);

    expect(screen.getByText("Evening Glow")).toBeDefined();

    fireEvent.click(toggleBtn);
    expect(screen.getByText("Daylight")).toBeDefined();
  });

  it("defines comprehensive luxury finish hotspots for each scene", () => {
    for (const scene of PANORAMA_SCENES) {
      expect(scene.hotspots.length).toBeGreaterThan(0);
      for (const h of scene.hotspots) {
        expect(h.id).toBeDefined();
        expect(h.titleEn).toBeDefined();
        expect(h.titleAr).toBeDefined();
        expect(h.specEn).toBeDefined();
        expect(h.specAr).toBeDefined();
        expect(h.yaw).toBeGreaterThanOrEqual(-180);
        expect(h.yaw).toBeLessThanOrEqual(180);
        expect(h.pitch).toBeGreaterThanOrEqual(-90);
        expect(h.pitch).toBeLessThanOrEqual(90);
      }
    }
  });

  it("invokes onClose callback when close button is pressed", () => {
    const onCloseMock = vi.fn();
    renderViewer({ onClose: onCloseMock });

    const closeBtn = screen.getByText("✕");
    fireEvent.click(closeBtn);

    expect(onCloseMock).toHaveBeenCalledOnce();
  });
});
