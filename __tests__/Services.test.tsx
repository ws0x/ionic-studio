import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Services } from "@/components/Services";

vi.mock("@/lib/i18n", () => ({
  useLocale: () => ({
    locale: "en",
    t: (k: string) => k,
  }),
}));

describe("Services Component", () => {
  it("renders architectural contracting disciplines", () => {
    render(<Services />);
    expect(screen.getByText("General Contracting & Civil Works")).toBeInTheDocument();
    expect(screen.getByText("Turnkey Fine Finishing & Fit-Outs")).toBeInTheDocument();
    expect(screen.getByText("Electro-Mechanical & MEP Systems")).toBeInTheDocument();
    expect(screen.getByText("Commercial F&B & Retail Rollouts")).toBeInTheDocument();
  });
});
