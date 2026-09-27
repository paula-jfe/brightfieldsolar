// Phone link: dials the city's number and records the click-to-call.
import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PhoneLink } from "@/components/final-cta/PhoneLink";
import { track } from "@/lib/analytics";

vi.mock("@/lib/analytics", () => ({ track: vi.fn() }));

describe("PhoneLink", () => {
  test("links to the number in tel: format and records the click", async () => {
    const user = userEvent.setup();
    render(<PhoneLink phone="(602) 555-0147" city="Phoenix" />);

    const link = screen.getByRole("link", { name: "(602) 555-0147" });
    expect(link).toHaveAttribute("href", "tel:6025550147");

    await user.click(link);
    expect(track).toHaveBeenCalledWith("phone_clicked", { city: "Phoenix" });
  });
});
