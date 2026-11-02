import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;

// End-to-end tests run in a real browser against the production build,
// served the way GitHub Pages serves it (under /ati-site/, with 404.html).
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}/ati-site/`,
    // Turns the site's animations off (see the reduced-motion rules in globals.css), so checks
    // like colour contrast see the final colours instead of a half-faded frame.
    reducedMotion: "reduce",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run build && node scripts/serve-pages.mjs ${PORT}`,
    url: `http://localhost:${PORT}/ati-site/en/`,
    env: {
      NEXT_PUBLIC_BASE_PATH: "/ati-site",
      NEXT_PUBLIC_SITE_URL: "https://atefeh-sa93.github.io/ati-site",
    },
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
