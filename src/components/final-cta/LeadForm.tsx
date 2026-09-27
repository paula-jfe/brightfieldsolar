"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Loader } from "@/components/ui/Loader";
import {
  EMAIL_MAX,
  NAME_MAX,
  formatPhone,
  suggestEmail,
  validateLead,
  type LeadErrors as Errors,
  type LeadField as Field,
  type LeadValues as Values,
} from "@/lib/lead-form";

type Status = "idle" | "submitting" | "success";

const EMPTY: Values = { name: "", email: "", phone: "", consent: false };
// No backend (the brief allows the CTA to go nowhere): a short delay stands
// in for the request, then the confirmation shows for a while and resets.
const FAKE_REQUEST_MS = 1200;
const CONFIRMATION_MS = 7000;
const FIELD_ORDER: Field[] = ["name", "email", "phone", "consent"];


const inputBase =
  "mt-1.5 h-12 w-full rounded-[var(--radius-inner)] bg-bg-card px-4 text-base font-normal text-text-on-light ring-inset placeholder:text-text-on-light-muted/85 transition-[box-shadow] focus:outline-none lg:h-10";
const inputOk = "ring-1 ring-border-control focus:ring-2 focus:ring-accent-sky";
const inputErr = "ring-[1.5px] ring-text-accent-on-light focus:ring-2";

/**
 * Figma "Lead form" with its three states:
 * - Validation errors ("Final CTA – Validation errors"): rules live in
 *   lib/lead-form.ts (unit tested). A field is checked when the person leaves
 *   it, then live while they fix it; submitting checks everything and focuses
 *   the first invalid field. Messages are tied to inputs via aria-describedby.
 *   The phone formats itself as (602) 555-0100 and likely email domain typos
 *   get a one-tap "Did you mean …?" fix.
 * - Loading: the button swaps to the Sun loader + "Sending…".
 * - Submitted ("Final CTA – Submitted"): the confirmation replaces the form
 *   in the same card (both are stacked in one grid cell, so the card keeps
 *   its height and nothing below jumps), then it times out and resets.
 */
export function LeadForm({ city }: { city: string }) {
  const uid = useId();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const refs = useRef<Partial<Record<Field, HTMLInputElement | null>>>({});
  const successHeading = useRef<HTMLHeadingElement>(null);
  // Set when the confirmation (which holds focus) is about to disappear, so
  // focus can move to the first field instead of being lost (WCAG 2.4.3).
  const refocusForm = useRef(false);

  useEffect(() => {
    if (status === "submitting") {
      const t = setTimeout(() => setStatus("success"), FAKE_REQUEST_MS);
      return () => clearTimeout(t);
    }
    if (status === "idle" && refocusForm.current) {
      refocusForm.current = false;
      refs.current.name?.focus();
    }
    if (status === "success") {
      successHeading.current?.focus();
      const t = setTimeout(() => {
        refocusForm.current = successHeading.current?.contains(document.activeElement) ?? false;
        setValues(EMPTY);
        setErrors({});
        setTouched({});
        setStatus("idle");
      }, CONFIRMATION_MS);
      return () => clearTimeout(t);
    }
  }, [status]);

  // Only show a text field's error once it has been touched (left with
  // something typed in it, or submitted), then keep it in sync as the
  // person types. Consent is only "touched" by a submit attempt, so toggling
  // the box on its own never shows an error.
  function visibleErrors(next: Values, touchedNow: Partial<Record<Field, boolean>>): Errors {
    const all = validateLead(next);
    return Object.fromEntries(Object.entries(all).filter(([field]) => touchedNow[field as Field])) as Errors;
  }

  function update<K extends Field>(field: K, value: Values[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    setErrors(visibleErrors(next, touched));
  }

  function blur(field: Field) {
    // Leaving a field empty isn't a mistake yet (the person may just be
    // tabbing through): empty fields are only flagged on submit.
    const value = values[field];
    if (!touched[field] && typeof value === "string" && value.trim() === "") return;
    const touchedNow = { ...touched, [field]: true };
    setTouched(touchedNow);
    setErrors(visibleErrors(values, touchedNow));
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (status !== "idle") return;
    const allTouched = { name: true, email: true, phone: true, consent: true };
    const shown = visibleErrors(values, allTouched);
    setTouched(allTouched);
    setErrors(shown);
    if (Object.keys(validateLead(values)).length > 0) {
      const first = FIELD_ORDER.find((field) => shown[field]);
      refs.current[first ?? "name"]?.focus();
      return;
    }
    setStatus("submitting");
  }

  const describedBy = (field: Field) => (errors[field] ? `${uid}-${field}-error` : undefined);
  const errorText = (field: Field) =>
    errors[field] ? (
      <span id={`${uid}-${field}-error`} className="mt-1.5 block text-sm font-normal leading-5 text-text-accent-on-light">
        {errors[field]}
      </span>
    ) : null;

  const emailSuggestion = !errors.email && touched.email ? suggestEmail(values.email) : null;

  const textField = (
    field: "name" | "email" | "phone",
    label: string,
    type: string,
    autoComplete: string,
    placeholder: string,
    extra: { maxLength?: number; inputMode?: "text" | "email" | "tel" } = {}
  ) => (
    <label className="block text-sm font-bold leading-5">
      {label}
      <input
        ref={(el) => {
          refs.current[field] = el;
        }}
        type={type}
        name={field}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={values[field]}
        maxLength={extra.maxLength}
        inputMode={extra.inputMode}
        spellCheck={false}
        onChange={(event) => update(field, field === "phone" ? formatPhone(event.target.value) : event.target.value)}
        onBlur={() => blur(field)}
        required
        aria-invalid={Boolean(errors[field])}
        aria-describedby={describedBy(field)}
        className={`${inputBase} ${errors[field] ? inputErr : inputOk}`}
      />
      {errorText(field)}
    </label>
  );

  const showSuccess = status === "success";

  return (
    <div className="grid rounded-[var(--radius-card)] bg-bg-light ring-1 ring-border-light [&>*]:col-start-1 [&>*]:row-start-1">
      <form
        noValidate
        onSubmit={onSubmit}
        aria-label="Talk to a solar expert"
        inert={showSuccess}
        className={`flex flex-col gap-4 p-6 transition-opacity md:p-8 ${showSuccess ? "invisible opacity-0" : "opacity-100"}`}
      >
        {textField("name", "Name", "text", "name", "Jane Smith", { maxLength: NAME_MAX })}
        <div>
          {textField("email", "Email", "email", "email", "jane@example.com", { maxLength: EMAIL_MAX, inputMode: "email" })}
          {emailSuggestion && (
            <p className="mt-1.5 text-sm leading-5 text-text-on-light-muted">
              Did you mean{" "}
              <button
                type="button"
                onClick={() => update("email", emailSuggestion)}
                className="font-semibold text-text-on-light underline underline-offset-2"
              >
                {emailSuggestion}
              </button>
              ?
            </p>
          )}
        </div>
        {textField("phone", "Phone", "tel", "tel", "(602) 555-0100", { maxLength: 16, inputMode: "tel" })}

        <div>
          <label className="flex items-start gap-2.5 text-sm leading-5 text-text-on-light-muted">
            {/* Figma "Consent Checkbox": checked = brand yellow + dark check. */}
            <span className="relative mt-px h-5 w-5 shrink-0">
              <input
                ref={(el) => {
                  refs.current.consent = el;
                }}
                type="checkbox"
                name="consent"
                checked={values.consent}
                onChange={(event) => update("consent", event.target.checked)}
                aria-invalid={Boolean(errors.consent)}
                aria-describedby={describedBy("consent")}
                className={`peer h-5 w-5 cursor-pointer appearance-none rounded-[6px] bg-bg-card ring-inset transition-colors checked:bg-action-primary checked:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-sky ${
                  errors.consent ? "ring-[1.5px] ring-text-accent-on-light" : "ring-[1.5px] ring-border-control"
                }`}
              />
              <svg
                aria-hidden="true"
                viewBox="0 0 12 9"
                className="pointer-events-none absolute left-1 top-[5.5px] h-[9px] w-3 text-action-primary-text opacity-0 transition-opacity peer-checked:opacity-100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 4.5L4.3 7.8L11 1" />
              </svg>
            </span>
            I agree to be contacted by Brightfield Solar about my estimate.
          </label>
          {errorText("consent")}
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          aria-busy={status === "submitting"}
          className="mt-1 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-action-primary px-7 py-4 text-base font-semibold leading-6 text-action-primary-text transition-[filter,transform] hover:brightness-95 active:scale-[0.98] active:brightness-90 disabled:cursor-progress disabled:hover:brightness-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-sky"
        >
          {status === "submitting" ? (
            <>
              <Loader size="sm" tone="dark" decorative />
              Sending…
            </>
          ) : (
            "Talk to a solar expert"
          )}
        </button>
      </form>

      {/* Screen readers don't reliably announce a button's text changing, so
          the sending state is also spoken from a visually hidden live region. */}
      <p role="status" className="sr-only">
        {status === "submitting" ? "Sending your request…" : ""}
      </p>

      {/* Confirmation (Figma "Final CTA – Submitted"). Centred on every
          screen size: it stands in for the whole form as one self-contained
          message, unlike the left-aligned reading content around it. Always in
          the DOM so the live region is registered before it fills in. */}
      <div
        aria-live="polite"
        className={`flex flex-col items-center justify-center gap-4 p-6 text-center transition-opacity md:p-8 ${
          showSuccess ? "opacity-100" : "pointer-events-none invisible opacity-0"
        }`}
      >
        {showSuccess && (
          <>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-action-primary md:h-14 md:w-14">
              <svg viewBox="0 0 24 19" className="h-4 w-5 md:h-[18px] md:w-6" fill="none" stroke="var(--color-action-primary-text)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1.5 9.5L8.5 16.5L22.5 2" />
              </svg>
            </span>
            <h3
              ref={successHeading}
              tabIndex={-1}
              className="font-display text-2xl font-extrabold leading-[30px] text-text-on-light outline-none md:text-[28px] md:leading-[34px]"
            >
              Thank you. We have received your request.
            </h3>
            <p className="text-balance leading-6 text-text-on-light-muted md:text-lg md:leading-7">
              A Brightfield Solar specialist in {city} will contact you within one business day to review your estimate
              and answer any questions you may have.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
