"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { savePreference } from "@/lib/prefs";

type Props = { current: Locale; label: string };

const LABELS: Record<Locale, string> = { fa: "فا", en: "EN" };
const ORDER: Locale[] = ["en", "fa"];

export function LangSwitch({ current, label }: Props) {
  const pathname = usePathname();

  // Swap only the first segment, so /fa/anything ↔ /en/anything.
  const hrefFor = (target: Locale) => pathname.replace(/^\/(fa|en)(?=\/|$)/, `/${target}`);
  const remember = (target: Locale) => savePreference("lang", target);

  return (
    <nav aria-label={label} dir="ltr" className="flex rounded-full bg-pill p-1 text-[15px] font-semibold">
      {ORDER.map((locale) =>
        locale === current ? (
          <span
            key={locale}
            aria-current="true"
            className={`flex min-h-9 min-w-12 items-center justify-center rounded-full bg-primary text-white ${locale === "fa" ? "font-fa font-bold" : "font-display"}`}
          >
            {LABELS[locale]}
          </span>
        ) : (
          <Link
            key={locale}
            href={hrefFor(locale)}
            hrefLang={locale}
            lang={locale}
            onClick={() => remember(locale)}
            className={`flex min-h-9 min-w-12 items-center justify-center rounded-full ${locale === "fa" ? "font-fa font-bold" : "font-display"}`}
          >
            {LABELS[locale]}
          </Link>
        ),
      )}
    </nav>
  );
}
