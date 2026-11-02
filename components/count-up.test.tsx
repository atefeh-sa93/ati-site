// @vitest-environment jsdom
import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CountUp } from "./count-up";

/*
 * CountUp relies on three browser features jsdom doesn't have:
 * - matchMedia, to respect "reduce motion",
 * - IntersectionObserver, to start when the number scrolls into view,
 * - requestAnimationFrame, to draw each frame of the count.
 * The first two get small fakes; for the third, Vitest's fake timers let the test
 * move the clock forward by hand, so the animation runs instantly and the same way every time.
 */

let scrollIntoView: (visible: boolean) => void;
const disconnect = vi.fn();
const observerCreated = vi.fn();

class FakeIntersectionObserver {
  constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
    observerCreated();
    scrollIntoView = (visible) => callback([{ isIntersecting: visible }]);
  }
  observe() {}
  disconnect = disconnect;
}

function setUpBrowser({ reducedMotion = false } = {}) {
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: reducedMotion && query.includes("reduce") }));
  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
}

function renderCount(props: Partial<React.ComponentProps<typeof CountUp>> = {}) {
  const { container, unmount } = render(<CountUp value={7} suffix="+ yrs" locale="en" {...props} />);
  return {
    unmount,
    // What sighted visitors see (animated) and what screen readers read (always final).
    visible: () => container.querySelector('[aria-hidden="true"]')?.textContent,
    spoken: () => container.querySelector(".sr-only")?.textContent,
  };
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"] });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("CountUp", () => {
  it("shows the final number before any animation (for search engines and no-JS)", () => {
    setUpBrowser();
    const count = renderCount();

    expect(count.visible()).toBe("7+ yrs");
    expect(count.spoken()).toBe("7+ yrs");
  });

  it("uses Persian digits for the Persian page", () => {
    setUpBrowser();
    const count = renderCount({ value: 40, prefix: "+", suffix: "", locale: "fa" });

    expect(count.visible()).toBe("+۴۰");
  });

  it("counts up from zero once it scrolls into view", () => {
    setUpBrowser();
    const count = renderCount();

    act(() => scrollIntoView(true));
    expect(count.visible()).toBe("0+ yrs");

    act(() => vi.advanceTimersByTime(500)); // part-way through the 1.4s animation
    const midway = Number.parseInt(count.visible()!, 10);
    expect(midway).toBeGreaterThan(0);
    expect(midway).toBeLessThan(7);

    act(() => vi.advanceTimersByTime(1500)); // past the end
    expect(count.visible()).toBe("7+ yrs");
  });

  it("keeps the screen-reader text at the final value during the animation", () => {
    setUpBrowser();
    const count = renderCount();

    act(() => scrollIntoView(true));
    act(() => vi.advanceTimersByTime(500));

    expect(count.spoken()).toBe("7+ yrs");
  });

  it("waits while the number is still off screen", () => {
    setUpBrowser();
    const count = renderCount();

    act(() => scrollIntoView(false));

    expect(count.visible()).toBe("7+ yrs");
  });

  it("counts small values like 1M in tenths so the animation is visible", () => {
    setUpBrowser();
    const count = renderCount({ value: 1, suffix: "M+" });

    act(() => scrollIntoView(true));
    act(() => vi.advanceTimersByTime(500));

    expect(count.visible()).toMatch(/^0\.\dM\+$/);
  });

  it("does not animate at all when the visitor prefers reduced motion", () => {
    setUpBrowser({ reducedMotion: true });
    const count = renderCount();

    expect(observerCreated).not.toHaveBeenCalled();
    expect(count.visible()).toBe("7+ yrs");
  });

  it("stops watching when it leaves the page", () => {
    setUpBrowser();
    const count = renderCount();

    count.unmount();

    expect(disconnect).toHaveBeenCalled();
  });
});
