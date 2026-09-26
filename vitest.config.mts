import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Unit + component tests (Vitest + React Testing Library), set up as in the
// Next.js testing guide. jsdom is the default environment for component
// tests; pure logic and data tests opt into "node" with a file comment.
// E2E specs live in /e2e and run with Playwright instead.
export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
