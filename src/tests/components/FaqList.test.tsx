// FAQ accordion tests.
import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FaqList } from "@/components/faq/FaqList";
import { getCityBySlug } from "@/data/cities";

const { faq } = getCityBySlug("phoenix-az")!;

describe("FaqList", () => {
  test("renders every question from the data file, with the first one open", () => {
    render(<FaqList entries={faq} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(faq.length);
    expect(buttons.map((button) => button.getAttribute("aria-expanded"))).toEqual(
      faq.map((_, index) => String(index === 0))
    );
  });

  test("answers stay in the HTML (for search engines) but closed ones are inert", () => {
    render(<FaqList entries={faq} />);
    for (const entry of faq) expect(screen.getByText(entry.a)).toBeInTheDocument();
    expect(screen.getByText(faq[1].a).closest("[role=region]")).toHaveAttribute("inert");
  });

  test("questions open and close independently", async () => {
    const user = userEvent.setup();
    render(<FaqList entries={faq} />);
    const [first, second] = screen.getAllByRole("button");

    await user.click(second);
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(second).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region", { name: faq[1].q })).not.toHaveAttribute("inert");

    await user.click(first);
    expect(first).toHaveAttribute("aria-expanded", "false");
  });
});
