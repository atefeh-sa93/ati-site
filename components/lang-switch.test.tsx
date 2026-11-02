// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePathname } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LangSwitch } from "./lang-switch";

/*
 * LangSwitch reads the current URL with Next's usePathname() and renders Next's <Link>.
 * Both need a running Next.js app, so vi.mock swaps the whole module for a stand-in:
 * - usePathname becomes a fake whose return value each test sets,
 * - Link becomes a plain <a> (and the click doesn't navigate, which jsdom can't do).
 * vi.mock calls are moved to the top of the file by Vitest, before the imports run.
 */
vi.mock("next/navigation", () => ({ usePathname: vi.fn() }));
vi.mock("next/link", () => ({
  default: ({ onClick, ...props }: React.ComponentProps<"a">) => (
    <a
      {...props}
      onClick={(event) => {
        onClick?.(event);
        event.preventDefault();
      }}
    />
  ),
}));

function renderSwitch(current: "en" | "fa", pathname: string) {
  vi.mocked(usePathname).mockReturnValue(pathname);
  render(<LangSwitch current={current} label="Language" />);
}

beforeEach(() => {
  document.cookie = "lang=; path=/; max-age=0";
});

describe("LangSwitch", () => {
  it("is a navigation landmark with a label", () => {
    renderSwitch("en", "/en/");

    expect(screen.getByRole("navigation", { name: "Language" })).toBeInTheDocument();
  });

  it("shows the current language as plain text marked as current, not a link", () => {
    renderSwitch("en", "/en/");

    const current = screen.getByText("EN");
    expect(current).toHaveAttribute("aria-current", "true");
    expect(screen.queryByRole("link", { name: "EN" })).not.toBeInTheDocument();
  });

  it("links to the same page in the other language", () => {
    renderSwitch("en", "/en/");

    const link = screen.getByRole("link", { name: "فا" });
    expect(link).toHaveAttribute("href", "/fa/");
    // Tells browsers and search engines which language the link leads to.
    expect(link).toHaveAttribute("hreflang", "fa");
    expect(link).toHaveAttribute("lang", "fa");
  });

  it("swaps only the first part of the path", () => {
    renderSwitch("fa", "/fa/some/page/");

    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute("href", "/en/some/page/");
  });

  it("remembers the chosen language in a cookie when clicked", async () => {
    const user = userEvent.setup();
    renderSwitch("en", "/en/");

    await user.click(screen.getByRole("link", { name: "فا" }));

    expect(document.cookie).toContain("lang=fa");
  });
});
