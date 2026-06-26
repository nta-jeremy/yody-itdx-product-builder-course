import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    environment: "node",
    environmentMatchGlobs: [
      ["src/components/**/__tests__/**", "jsdom"],
      ["src/app/**/__tests__/**", "jsdom"],
    ],
    include: ["src/**/__tests__/**/*.test.{ts,tsx}", "scripts/**/__tests__/**/*.test.{ts,tsx}"],
    globals: false,
    setupFiles: ["./src/test-setup.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
