import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VideoModal } from "@/components/VideoModal";

vi.mock("@/lib/i18n", () => ({
  useLocale: () => ({
    locale: "en",
    t: (k: string) => k,
  }),
}));

describe("VideoModal Component", () => {
  it("renders nothing when isOpen is false", () => {
    const { container } = render(<VideoModal isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders modal dialog and iframe when isOpen is true", () => {
    render(<VideoModal isOpen={true} onClose={vi.fn()} title="Test Showreel" />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByTitle("Test Showreel")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(<VideoModal isOpen={true} onClose={handleClose} />);
    const closeBtn = screen.getByLabelText("Close video");
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose on Escape key press", () => {
    const handleClose = vi.fn();
    render(<VideoModal isOpen={true} onClose={handleClose} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
