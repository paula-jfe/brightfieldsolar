// Mobile menu tests.
import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "@/components/layout/Header";
import { getCityBySlug } from "@/data/cities";

const phoenix = getCityBySlug("phoenix-az")!;

describe("Header mobile menu", () => {
  test("opens and closes with the menu button, exposing its state", async () => {
    const user = userEvent.setup();
    render(<Header city={phoenix} />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("mobile-menu")).toHaveAttribute("inert");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAccessibleName("Close menu");
    expect(document.getElementById("mobile-menu")).not.toHaveAttribute("inert");
  });

  test("Escape from inside the menu closes it and returns focus to the button", async () => {
    const user = userEvent.setup();
    render(<Header city={phoenix} />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    await user.click(toggle);

    const menu = screen.getByRole("navigation", { name: "Menu" });
    menu.querySelector("a")!.focus();
    await user.keyboard("{Escape}");

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });
});
