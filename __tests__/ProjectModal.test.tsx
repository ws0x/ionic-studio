import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectModal } from "@/components/ProjectModal";
import { LocaleProvider } from "@/lib/i18n";
import type { Project } from "@/lib/content";

const mockProject: Project = {
  title: { ar: "مشروع تجريبي", en: "Demo Project" },
  desc: { ar: "وصف تجريبي", en: "Demo description" },
  category: { ar: "سكني", en: "Residential" },
  categoryKey: "residential",
  location: { ar: "التجمع الخامس", en: "New Cairo" },
  image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  area: "500 m²",
  year: "2025",
  scope: { ar: "تشطيب كامل", en: "Full Turnkey" },
  highlights: [{ ar: "رخام إيطالي", en: "Italian Marble" }],
};

describe("ProjectModal component", () => {
  it("renders nothing when project is null", () => {
    const { container } = render(
      <LocaleProvider>
        <ProjectModal project={null} onClose={vi.fn()} />
      </LocaleProvider>
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders project details when project is passed", () => {
    render(
      <LocaleProvider>
        <ProjectModal project={mockProject} onClose={vi.fn()} />
      </LocaleProvider>
    );

    expect(screen.getByText("Demo Project")).toBeDefined();
    expect(screen.getByText("Residential")).toBeDefined();
    expect(screen.getByText("500 m²")).toBeDefined();
    expect(screen.getByText("Full Turnkey")).toBeDefined();
    expect(screen.getByText("Italian Marble")).toBeDefined();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <LocaleProvider>
        <ProjectModal project={mockProject} onClose={onClose} />
      </LocaleProvider>
    );

    const closeBtn = screen.getByLabelText("Close modal");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    const onClose = vi.fn();
    render(
      <LocaleProvider>
        <ProjectModal project={mockProject} onClose={onClose} />
      </LocaleProvider>
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
