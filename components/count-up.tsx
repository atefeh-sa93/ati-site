"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

type Props = { value: number; locale: Locale; prefix?: string; suffix?: string; duration?: number };

/**
 * Renders the final number on the server (good for SEO and no-JS),
 * then counts up from zero once the number scrolls into view.
 */
export function CountUp({ value, locale, prefix = "", suffix = "", duration = 1400 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const k = Math.min(1, (now - start) / duration);
          setShown(value * (1 - Math.pow(1 - k, 3)));
          if (k < 1) frame = requestAnimationFrame(tick);
        };
        setShown(0);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  // Small values (like "1M") count in tenths so the animation is visible.
  const digits = value <= 1 && shown < value ? 1 : 0;
  const format = (n: number, fraction = 0) =>
    new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", { maximumFractionDigits: fraction }).format(n);
  const formatted = format(digits ? shown : Math.round(shown), digits);

  return (
    <span ref={ref}>
      <span className="sr-only">{`${prefix}${format(value)}${suffix}`}</span>
      <span aria-hidden="true">
        {prefix}
        {formatted}
        {suffix}
      </span>
    </span>
  );
}
