import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Contact } from "@/components/Contact";
import { LocaleProvider } from "@/lib/i18n";

global.fetch = vi.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  })
);

describe("Contact Component", () => {
  it("renders the Request a Call Back form and enterprise HQ info", () => {
    render(
      <LocaleProvider>
        <Contact />
      </LocaleProvider>
    );

    expect(screen.getAllByText(/Request a Call Back/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Mindhaus Campus/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Your name/i)).toBeInTheDocument();
  });

  it("submits callback request form successfully", async () => {
    render(
      <LocaleProvider>
        <Contact />
      </LocaleProvider>
    );

    const nameInput = screen.getByPlaceholderText(/Your name/i);
    const phoneInput = screen.getByPlaceholderText(/\+20 100 000 0000/i);
    const submitBtn = screen.getByRole("button", { name: /Request a Call Back/i });

    fireEvent.change(nameInput, { target: { value: "Eng. Ahmed Tarek" } });
    fireEvent.change(phoneInput, { target: { value: "+20 100 123 4567" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Callback Request Received/i)).toBeInTheDocument();
    });
  });
});
