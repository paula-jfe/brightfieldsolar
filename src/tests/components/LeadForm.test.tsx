import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LeadForm } from "@/components/final-cta/LeadForm";

// The validation rules themselves are covered in lib/lead-form.test.ts.
// These tests cover how the form applies them: when errors appear, where
// focus goes, and the submit → sending → confirmation → reset cycle.

// Inputs are found by the start of their accessible name, because a label
// also wraps its error message once one is shown.
const nameInput = () => screen.getByRole("textbox", { name: /^name/i });
const emailInput = () => screen.getByRole("textbox", { name: /^email/i });
const phoneInput = () => screen.getByRole("textbox", { name: /^phone/i });
const consentBox = () => screen.getByRole("checkbox", { name: /agree to be contacted/i });
const submitButton = () => screen.getByRole("button", { name: /talk to a solar expert|sending/i });

const CONSENT_ERROR = "Please agree to be contacted so we can follow up.";

function setup() {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  render(<LeadForm city="Phoenix" />);
  return user;
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("LeadForm", () => {
  test("flags a field only when it is left with something invalid, then updates as the person types", async () => {
    const user = setup();
    expect(screen.queryByText("Enter your name.")).not.toBeInTheDocument();

    // Clicking in and out of an empty field is not an error.
    await user.click(nameInput());
    await user.tab();
    expect(screen.queryByText("Enter your name.")).not.toBeInTheDocument();
    expect(nameInput()).toHaveAttribute("aria-invalid", "false");

    // Leaving it with something invalid typed in is.
    await user.type(nameInput(), "J");
    await user.tab();
    expect(screen.getByText("Enter your full name.")).toBeInTheDocument();
    expect(nameInput()).toHaveAttribute("aria-invalid", "true");
    expect(nameInput()).toHaveAccessibleDescription("Enter your full name.");

    // From then on the message follows what is typed.
    await user.clear(nameInput());
    expect(screen.getByText("Enter your name.")).toBeInTheDocument();
    await user.type(nameInput(), "J");
    expect(screen.getByText("Enter your full name.")).toBeInTheDocument();
    await user.type(nameInput(), "ane Smith");
    expect(screen.queryByText("Enter your full name.")).not.toBeInTheDocument();
    expect(nameInput()).toHaveAttribute("aria-invalid", "false");

    // Email was tabbed through while empty: still no error there.
    expect(screen.queryByText("Enter your email address.")).not.toBeInTheDocument();
  });

  test("submitting an empty form shows every error and focuses the first invalid field", async () => {
    const user = setup();
    await user.click(submitButton());

    expect(screen.getByText("Enter your name.")).toBeInTheDocument();
    expect(screen.getByText("Enter your email address.")).toBeInTheDocument();
    expect(screen.getByText("Enter your phone number.")).toBeInTheDocument();
    expect(screen.getByText(CONSENT_ERROR)).toBeInTheDocument();
    expect(nameInput()).toHaveFocus();

    // With name fixed, focus moves on to the next invalid field.
    await user.type(nameInput(), "Jane Smith");
    await user.click(submitButton());
    expect(emailInput()).toHaveFocus();
  });

  test("asks for consent only on submit, never for just toggling the box", async () => {
    const user = setup();

    // Ticking and unticking the box before submitting shows nothing.
    await user.click(consentBox());
    await user.click(consentBox());
    expect(screen.queryByText(CONSENT_ERROR)).not.toBeInTheDocument();

    await user.type(nameInput(), "Jane Smith");
    await user.type(emailInput(), "jane@example.com");
    await user.type(phoneInput(), "6025550100");
    await user.click(submitButton());
    expect(screen.getByText(CONSENT_ERROR)).toBeInTheDocument();
    expect(consentBox()).toHaveFocus();
    expect(consentBox()).toHaveAccessibleDescription(CONSENT_ERROR);

    await user.click(consentBox());
    expect(screen.queryByText(CONSENT_ERROR)).not.toBeInTheDocument();
  });

  test("formats the phone number as it is typed", async () => {
    const user = setup();
    await user.type(phoneInput(), "6025550100");
    expect(phoneInput()).toHaveValue("(602) 555-0100");
  });

  test("offers a one-tap fix for a likely email typo", async () => {
    const user = setup();
    await user.type(emailInput(), "jane@gmial.com");
    await user.tab();

    await user.click(screen.getByRole("button", { name: "jane@gmail.com" }));
    expect(emailInput()).toHaveValue("jane@gmail.com");
    expect(screen.queryByText(/did you mean/i)).not.toBeInTheDocument();
  });

  test("sends, confirms, and then resets to an empty form", async () => {
    const user = setup();
    await user.type(nameInput(), "Jane Smith");
    await user.type(emailInput(), "jane@example.com");
    await user.type(phoneInput(), "6025550100");
    await user.click(consentBox());
    await user.click(submitButton());

    // Loading: the button is busy and can't be pressed twice.
    expect(submitButton()).toHaveTextContent("Sending…");
    expect(submitButton()).toBeDisabled();
    expect(submitButton()).toHaveAttribute("aria-busy", "true");

    // Confirmation replaces the form and takes focus, naming the city.
    await act(() => vi.advanceTimersByTimeAsync(1200));
    const heading = screen.getByRole("heading", { name: "Thank you. We have received your request." });
    expect(heading).toHaveFocus();
    expect(screen.getByText(/a brightfield solar specialist in phoenix will contact you/i)).toBeInTheDocument();

    // After a while the form comes back, empty and without errors.
    await act(() => vi.advanceTimersByTimeAsync(7000));
    expect(screen.queryByRole("heading", { name: /thank you/i })).not.toBeInTheDocument();
    expect(nameInput()).toHaveValue("");
    expect(phoneInput()).toHaveValue("");
    expect(consentBox()).not.toBeChecked();
    expect(submitButton()).toHaveTextContent("Talk to a solar expert");
    expect(screen.queryByText("Enter your name.")).not.toBeInTheDocument();
    // Focus was on the confirmation, which is gone: it moves to the first field.
    expect(nameInput()).toHaveFocus();
  });

  test("announces the sending state to screen readers", async () => {
    const user = setup();
    await user.type(nameInput(), "Jane Smith");
    await user.type(emailInput(), "jane@example.com");
    await user.type(phoneInput(), "6025550100");
    await user.click(consentBox());
    await user.click(submitButton());
    expect(screen.getByRole("status")).toHaveTextContent("Sending your request…");
  });
});
