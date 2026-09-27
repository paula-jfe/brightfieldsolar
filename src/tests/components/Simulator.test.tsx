// Simulator tests, including the brief's worked example clicked through the UI.
import { describe, expect, test } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Simulator } from "@/components/simulator/Simulator";
import { getCityBySlug } from "@/data/cities";

const phoenix = getCityBySlug("phoenix-az")!;

const profile = (label: RegExp) => screen.getByRole("button", { name: label });
const billSlider = () => screen.getByRole("slider", { name: "Monthly bill" });
const coverageSlider = () => screen.getByRole("slider", { name: /how much of your usage/i });
const result = () => within(screen.getByRole("heading", { name: "Your solar estimate" }).parentElement!);

function setSlider(slider: HTMLElement, value: number) {
  fireEvent.change(slider, { target: { value: String(value) } });
}

function expectEstimate(expected: { panels: string; cost: string; savings: string; payback: string }) {
  expect(result().getByText(expected.panels)).toBeInTheDocument();
  expect(result().getByText(expected.cost)).toBeInTheDocument();
  expect(result().getByText(expected.savings)).toBeInTheDocument();
  expect(result().getByText(expected.payback)).toBeInTheDocument();
}

const MIN_PANELS_NOTE = /every installation has an 8-panel minimum/i;
const CAPPED_NOTE = /savings are capped at your monthly bill/i;

describe("Simulator", () => {
  test("starts at a $220 bill and 80% coverage, with the matching profile selected", () => {
    render(<Simulator city={phoenix} />);

    expect(billSlider()).toHaveValue("220");
    expect(coverageSlider()).toHaveValue("0.8");
    expect(profile(/three-bedroom house, no pool/i)).toHaveAttribute("aria-pressed", "true");
    expectEstimate({ panels: "17 panels", cost: "$14,726", savings: "$179", payback: "6.9 years" });
    expect(screen.queryByText(MIN_PANELS_NOTE)).not.toBeInTheDocument();
    expect(screen.queryByText(CAPPED_NOTE)).not.toBeInTheDocument();
  });

  test("reproduces the brief's worked example step by step", async () => {
    const user = userEvent.setup();
    render(<Simulator city={phoenix} />);

    await user.click(profile(/pool and an ev/i));
    expect(billSlider()).toHaveValue("430");
    expect(coverageSlider()).toHaveValue("0.8");
    expectEstimate({ panels: "33 panels", cost: "$28,586", savings: "$347", payback: "6.9 years" });

    setSlider(coverageSlider(), 1);
    expect(profile(/pool and an ev/i)).toHaveAttribute("aria-pressed", "true");
    expectEstimate({ panels: "41 panels", cost: "$35,516", savings: "$430", payback: "6.9 years" });
    expect(screen.getByText(CAPPED_NOTE)).toHaveTextContent("The extra $1.73/month becomes a utility credit");

    await user.click(profile(/apartment or small condo/i));
    expect(billSlider()).toHaveValue("90");
    expect(coverageSlider()).toHaveValue("0.8");
    expect(profile(/apartment or small condo/i)).toHaveAttribute("aria-pressed", "true");
    expect(profile(/pool and an ev/i)).toHaveAttribute("aria-pressed", "false");
    expectEstimate({ panels: "8 panels", cost: "$6,930", savings: "$84", payback: "6.9 years" });
    expect(screen.getByText(MIN_PANELS_NOTE)).toBeInTheDocument();
    expect(screen.queryByText(CAPPED_NOTE)).not.toBeInTheDocument();

    setSlider(billSlider(), 60);
    expect(screen.queryAllByRole("button", { pressed: true })).toHaveLength(0);
    expectEstimate({ panels: "8 panels", cost: "$6,930", savings: "$60", payback: "9.6 years" });
    expect(screen.getByText(MIN_PANELS_NOTE)).toBeInTheDocument();
    expect(screen.getByText(CAPPED_NOTE)).toBeInTheDocument();

    setSlider(coverageSlider(), 0.5);
    expectEstimate({ panels: "8 panels", cost: "$6,930", savings: "$60", payback: "9.6 years" });
  });

  test("the savings bar splits the bill into what you still pay and what solar saves", () => {
    render(<Simulator city={phoenix} />);

    const bar = screen.getByRole("img", { name: "$179 of your $220 bill covered by solar" });
    const [withSolar, savings] = Array.from(bar.children) as HTMLElement[];
    expect(parseFloat(savings.style.width)).toBeCloseTo(81.37, 1);
    expect(parseFloat(withSolar.style.width)).toBeCloseTo(18.63, 1);
    expect(result().getByText("$41/mo with solar")).toBeInTheDocument();

    setSlider(billSlider(), 60);
    const capped = screen.getByRole("img", { name: "$60 of your $60 bill covered by solar" });
    expect((capped.children[1] as HTMLElement).style.width).toBe("100%");
    expect(result().getByText("$0/mo with solar")).toBeInTheDocument();
  });
});
