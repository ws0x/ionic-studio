import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CareersSection } from "@/components/CareersSection";
import AboutPage from "@/app/about/page";
import TeamPage from "@/app/team/page";

vi.mock("@/lib/i18n", () => ({
  LocaleProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useLocale: () => ({
    locale: "en",
    t: (k: string) => k,
  }),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/about",
}));

describe("CareersSection Component", () => {
  it("renders recruitment title and submits application", () => {
    render(<CareersSection />);
    expect(screen.getByText("Wanna Join our Team?")).toBeInTheDocument();
    
    const nameInput = screen.getByPlaceholderText("Arch. Jane Doe");
    const phoneInput = screen.getByPlaceholderText("+20 100 000 0000");
    const submitBtn = screen.getByText("Submit Application");

    fireEvent.change(nameInput, { target: { value: "Eng. Mostafa" } });
    fireEvent.change(phoneInput, { target: { value: "+201011112222" } });
    fireEvent.submit(submitBtn.closest("form")!);

    expect(screen.getByText("Application Received")).toBeInTheDocument();
  });
});

describe("Corporate Pages", () => {
  it("renders About page with 15+ years experience and mission", () => {
    render(<AboutPage />);
    expect(screen.getByText("More than 15 Years of Experience")).toBeInTheDocument();
    expect(screen.getByText("Our Vision")).toBeInTheDocument();
    expect(screen.getByText("Our Mission")).toBeInTheDocument();
  });

  it("renders Team page with executive leadership", () => {
    render(<TeamPage />);
    expect(screen.getByText("Eng. Omar Khaled")).toBeInTheDocument();
    expect(screen.getByText("Founder & CEO")).toBeInTheDocument();
    expect(screen.getByText("Eng. Mahmoud Bassiouny")).toBeInTheDocument();
  });
});
