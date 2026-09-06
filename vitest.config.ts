import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Node-environment unit/integration tests for the chat agent. No browser,
// no network — the mock LLM provider keeps everything deterministic and
// cost-free. React component tests are out of scope for this first suite.

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    globals: false,
    clearMocks: true,
    restoreMocks: true,
  },
});
