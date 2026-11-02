// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemeToggle } from "./theme-toggle";

/*
 * Component tests follow the user, not the implementation:
 * render the component, find the button by its role (as a screen reader would),
 * click it, then check what changed on the page.
 */

const html = document.documentElement;

function renderToggle() {
  render(<ThemeToggle toLight="Switch to light mode" toDark="Switch to dark mode" />);
  return screen.getByRole("button");
}

beforeEach(() => {
  // Each test starts in light mode with no saved preference.
  html.setAttribute("data-theme", "light");
  document.cookie = "theme=; path=/; max-age=0";
});

describe("ThemeToggle", () => {
  it("is a real button, so it works with the keyboard", () => {
    const button = renderToggle();

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "button");
  });

  it("gives screen readers a label for both directions", () => {
    renderToggle();

    // Both are rendered; CSS (dark:hidden) shows the one that matches the current theme.
    expect(screen.getByText("Switch to dark mode")).toBeInTheDocument();
    expect(screen.getByText("Switch to light mode")).toBeInTheDocument();
  });

  it("switches light → dark → light on each click", async () => {
    const user = userEvent.setup();
    const button = renderToggle();

    await user.click(button);
    expect(html).toHaveAttribute("data-theme", "dark");

    await user.click(button);
    expect(html).toHaveAttribute("data-theme", "light");
  });

  it("remembers the choice in a cookie for the next visit", async () => {
    const user = userEvent.setup();
    const button = renderToggle();

    await user.click(button);

    expect(document.cookie).toContain("theme=dark");
  });

  it("starts from dark when the page is already dark", async () => {
    html.setAttribute("data-theme", "dark");
    const user = userEvent.setup();
    const button = renderToggle();

    await user.click(button);

    expect(html).toHaveAttribute("data-theme", "light");
    expect(document.cookie).toContain("theme=light");
  });
});
