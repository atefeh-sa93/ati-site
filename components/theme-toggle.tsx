"use client";

import { savePreference } from "@/lib/prefs";

type Props = { toLight: string; toDark: string };

/**
 * Both icons are rendered; CSS shows the right one from <html data-theme>,
 * so server and client markup always match (no hydration mismatch, no flash).
 */
export function ThemeToggle({ toLight, toDark }: Props) {
  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    savePreference("theme", next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-line bg-pill text-ink"
    >
      <span className="sr-only dark:hidden">{toDark}</span>
      <span className="sr-only hidden dark:inline">{toLight}</span>
      <svg aria-hidden="true" className="size-4.5 dark:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
      <svg aria-hidden="true" className="hidden size-4.5 dark:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
