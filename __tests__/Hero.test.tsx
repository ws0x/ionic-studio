import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Hero } from "@/components/Hero";

vi.mock("@/lib/i18n", () => ({
  useLocale: () => ({
    locale: "en",
    t: (k: string) => k,
  }),
}));

describe("Hero Component", () => {
  it("renders architectural headline and play video button", () => {
    render(<Hero />);
    expect(screen.getByText("hero.title")).toBeInTheDocument();
    expect(screen.getByText("hero.playVideo")).toBeInTheDocument();
  });

  it("opens VideoModal when play showreel button is clicked", () => {
    render(<Hero />);
    const playBtn = screen.getByText("hero.playVideo");
    fireEvent.click(playBtn);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
