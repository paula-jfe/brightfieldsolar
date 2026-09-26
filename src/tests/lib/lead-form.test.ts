// @vitest-environment node
import { test } from "vitest";
import assert from "node:assert/strict";
import {
  formatPhone,
  suggestEmail,
  validateEmail,
  validateLead,
  validateName,
  validatePhone,
} from "@/lib/lead-form";

test("name: accepts real names, rejects junk", () => {
  for (const ok of ["Jane Smith", "Mary-Jane O'Neil Jr.", "José Álvarez", "Li"]) assert.equal(validateName(ok), undefined, ok);
  for (const bad of ["", "   ", "J", "J4ne", "@@@", "<script>", "a".repeat(61)]) assert.ok(validateName(bad), bad);
});

test("email: accepts valid addresses, rejects malformed ones", () => {
  for (const ok of ["jane@example.com", "jane.smith+solar@mail.co.uk", "  j@x.io  "]) assert.equal(validateEmail(ok), undefined, ok);
  for (const bad of [
    "", "jane", "jane@", "@example.com", "jane@example", "jane@example.c", "jane@@example.com",
    "jane..smith@example.com", ".jane@example.com", "jane.@example.com", "jane@-example.com",
    "jane@example..com", "jane smith@example.com", "jane@exa mple.com", "jane@example.123",
  ]) assert.ok(validateEmail(bad), bad);
});

test("phone: US numbers in common formats, rejects invalid ones", () => {
  for (const ok of ["(602) 555-0100", "602-555-0100", "602.555.0100", "6025550100", "+1 602 555 0100", "1 (602) 555-0100"])
    assert.equal(validatePhone(ok), undefined, ok);
  for (const bad of ["", "555-0100", "602555010", "60255501000", "(102) 555-0100", "(602) 155-0100", "2222222222", "602-555-01OO", "call me"])
    assert.ok(validatePhone(bad), bad);
});

test("consent is required, and a fully valid form has no errors", () => {
  const valid = { name: "Jane Smith", email: "jane@example.com", phone: "(602) 555-0100", consent: true };
  assert.deepEqual(validateLead(valid), {});
  assert.ok(validateLead({ ...valid, consent: false }).consent);
});

test("phone formats as the person types", () => {
  assert.equal(formatPhone("602"), "(602");
  assert.equal(formatPhone("602555"), "(602) 555");
  assert.equal(formatPhone("6025550100"), "(602) 555-0100");
  assert.equal(formatPhone("16025550100"), "1 (602) 555-0100");
  assert.equal(formatPhone("602555010099"), "(602) 555-0100");
});

test("suggests fixes for common email domain typos only", () => {
  assert.equal(suggestEmail("jane@gmial.com"), "jane@gmail.com");
  assert.equal(suggestEmail("jane@hotmal.com"), "jane@hotmail.com");
  assert.equal(suggestEmail("jane@gmail.com"), null);
  assert.equal(suggestEmail("jane@brightfieldsolar.com"), null);
});
