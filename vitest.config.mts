import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // JSX support for component tests.
  plugins: [react()],
  // Lets tests import with the same "@/…" paths as the app (read from tsconfig.json).
  resolve: { tsconfigPaths: true },
  test: {
    // Plain Node by default; component tests opt into a simulated browser with
    // a `// @vitest-environment jsdom` comment at the top of the file.
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    // Tests live next to the code they check: lib/i18n.ts → lib/i18n.test.ts.
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next", "out"],
  },
});
