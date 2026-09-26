import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Unmount whatever the previous test rendered, so tests never share DOM.
afterEach(() => {
  cleanup();
});
