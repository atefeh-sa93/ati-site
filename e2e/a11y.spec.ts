import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/*
 * axe-core checks a rendered page against accessibility rules: colour contrast,
 * missing labels, heading order, landmark structure, valid ARIA, and more.
 * Here it runs in a real browser on the built site, limited to the WCAG 2.1 A and AA rules,
 * for every combination a visitor can see: both languages × both themes, and the 404 page.
 */
const WCAG_21_AA = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

async function expectNoViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_21_AA).analyze();

  // A short summary per problem, so a failure reads as a to-do list instead of a huge object.
  const summary = violations.map((v) => ({
    rule: v.id,
    impact: v.impact,
    problem: v.help,
    elements: v.nodes.map((n) => n.target.join(" ")),
  }));
  expect(summary).toEqual([]);
}

// The saved-theme cookie is what the site reads before first paint (see lib/theme.ts).
async function useTheme(page: Page, theme: "light" | "dark", baseURL: string | undefined) {
  await page.context().addCookies([{ name: "theme", value: theme, url: new URL(baseURL!).origin }]);
}

for (const lang of ["en", "fa"] as const) {
  for (const theme of ["light", "dark"] as const) {
    test(`home page (${lang}, ${theme}) has no WCAG 2.1 AA violations`, async ({ page, baseURL }) => {
      await useTheme(page, theme, baseURL);
      await page.goto(`${lang}/`);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

      await expectNoViolations(page);
    });
  }

  test(`404 page (${lang}) has no WCAG 2.1 AA violations`, async ({ page }) => {
    const response = await page.goto(`${lang === "fa" ? "fa/" : ""}no-such-page/`);
    expect(response?.status()).toBe(404);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);

    await expectNoViolations(page);
  });
}
