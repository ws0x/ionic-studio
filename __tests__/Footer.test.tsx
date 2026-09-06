import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/Footer";
import { LocaleProvider } from "@/lib/i18n";

describe("Footer Component", () => {
  it("renders brand info, navigation links, sectors, and executive HQ address", () => {
    render(
      <LocaleProvider>
        <Footer />
      </LocaleProvider>
    );

    // Verify Brand
    expect(screen.getByText(/General Contracting & Fit-Out/i)).toBeInTheDocument();

    // Verify Navigation & Sectors
    expect(screen.getByText(/Leadership Team/i)).toBeInTheDocument();
    expect(screen.getByText(/Administration & Offices/i)).toBeInTheDocument();
    expect(screen.getByText(/High-End F&B & Cafes/i)).toBeInTheDocument();

    // Verify Executive HQ
    expect(screen.getByText(/Mindhaus Campus/i)).toBeInTheDocument();
    expect(screen.getByText(/info@ionicdesignhouse.com/i)).toBeInTheDocument();

    // Verify Developer Credit
    expect(screen.getByText(/binhakim.dev/i)).toBeInTheDocument();
  });
});
