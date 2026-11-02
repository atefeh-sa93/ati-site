import { defineConfig } from "vitest/config";

export default defineConfig({
  // Lets tests import with the same "@/…" paths as the app (read from tsconfig.json).
  resolve: { tsconfigPaths: true },
  test: {
    // Plain Node for now; components that need a browser DOM switch to jsdom later.
    environment: "node",
    // Tests live next to the code they check: lib/i18n.ts → lib/i18n.test.ts.
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next", "out"],
  },
});
