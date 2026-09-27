// Vitest config for unit and component tests (jsdom by default).
import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: [...configDefaults.exclude, "src/tests/e2e/**"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
