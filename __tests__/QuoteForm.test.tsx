import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Quote } from "@/components/Quote";
import { LocaleProvider } from "@/lib/i18n";

describe("Quote Form Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders form fields cleanly", () => {
    render(
      <LocaleProvider>
        <Quote />
      </LocaleProvider>
    );

    expect(screen.getByPlaceholderText("Your full name")).toBeDefined();
    expect(screen.getByPlaceholderText("01xxxxxxxxx")).toBeDefined();
  });

  it("displays validation warning if required fields are missing", () => {
    render(
      <LocaleProvider>
        <Quote />
      </LocaleProvider>
    );

    const submitBtn = screen.getByRole("button", { name: /Send via WhatsApp/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText("Please enter your name and phone.")).toBeDefined();
  });

  it("submits form payload to /api/quote and displays lead ID", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: async () => ({
        success: true,
        leadId: "IONIC-TEST-123",
        whatsappUrl: "https://wa.me/201060965845?text=test",
      }),
    });
    global.fetch = mockFetch;
    window.open = vi.fn();

    render(
      <LocaleProvider>
        <Quote />
      </LocaleProvider>
    );

    const nameInput = screen.getByPlaceholderText("Your full name");
    const phoneInput = screen.getByPlaceholderText("01xxxxxxxxx");
    const submitBtn = screen.getByRole("button", { name: /Send via WhatsApp/i });

    fireEvent.change(nameInput, { target: { value: "Ahmed Mansour" } });
    fireEvent.change(phoneInput, { target: { value: "01099887766" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/quote",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText("#IONIC-TEST-123")).toBeDefined();
    });
  });
});
