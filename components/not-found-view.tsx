import Link from "next/link";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/lib/i18n";
import { Star } from "./decor";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Shows the address the visitor actually asked for in the terminal line (without the base path).
const pathScript = `document.querySelectorAll("[data-requested-path]").forEach(function(el){el.textContent=location.pathname.slice(${JSON.stringify(BASE_PATH)}.length)||"/"})`;

const FLOATING = [
  { cls: "top-10 inset-s-[8%] size-5 bg-coral", delay: "0s" },
  { cls: "bottom-16 inset-s-[14%] size-3 bg-teal", delay: "-1.5s" },
  { cls: "top-20 inset-e-[10%] size-4 bg-sun", delay: "-3s" },
  { cls: "bottom-10 inset-e-[18%] size-6 bg-violet-soft", delay: "-2s" },
];

/** The 404 page: a terminal "error", a 4-⭐-4 with spinning rings for the zero, and the way back. */
export function NotFoundView({ t, locale }: { t: Dictionary["notFound"]; locale: Locale }) {
  const digit = <span className="font-heading leading-none font-extrabold text-primary">{t.digit}</span>;

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-12">
      {FLOATING.map((dot) => (
        <span
          key={dot.cls}
          aria-hidden="true"
          className={`anim-bob absolute rounded-full ${dot.cls}`}
          style={{ "--delay": dot.delay } as React.CSSProperties}
        />
      ))}

      <div className="anim-rise relative flex w-full max-w-2xl flex-col items-center gap-6 rounded-[40px] border border-line bg-surface px-10 py-14 text-center shadow-soft max-sm:px-6">
        <div dir="ltr" className="max-w-full rounded-xl bg-plum px-4 py-2.5 text-start font-mono text-sm text-lavender">
          <div className="truncate">
            <span className="text-teal">❯</span> cd{" "}
            <span data-requested-path suppressHydrationWarning>
              /page-you-wanted
            </span>
          </div>
          <div>
            <span className="text-coral">{t.error}</span>{" "}
            <span aria-hidden="true" className="anim-blink inline-block h-4 w-2 bg-lavender align-[-3px]" />
          </div>
        </div>

        <p
          dir="ltr"
          aria-label="404"
          className="m-0 flex items-center gap-1 text-[clamp(88px,16vw,152px)]"
        >
          {digit}
          <span aria-hidden="true" className="relative inline-flex size-[0.82em] items-center justify-center">
            <svg viewBox="0 0 220 220" className="anim-spin absolute inset-0 size-full text-primary">
              <circle cx="110" cy="110" r="100" fill="none" stroke="currentColor" strokeWidth={10} strokeDasharray="18 22" strokeLinecap="round" />
              <circle cx="110" cy="110" r="62" fill="none" stroke="currentColor" strokeOpacity={0.35} strokeWidth={8} />
            </svg>
            <Star className="anim-bob relative size-[0.42em]" />
          </span>
          {digit}
        </p>

        <div className="flex flex-col gap-2">
          <h1 className="m-0 font-heading text-[clamp(26px,4vw,36px)] leading-snug font-extrabold">{t.title}</h1>
          <p className="m-0 max-w-[44ch] text-sub">{t.body}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link href={`/${locale}`} className="lift inline-flex min-h-13 items-center rounded-full bg-primary px-7 font-bold text-white no-underline">
            {t.back}
          </Link>
          <Link
            href={`/${locale}#contact`}
            className="lift inline-flex min-h-13 items-center rounded-full border-2 border-primary px-7 font-bold text-accent-text no-underline"
          >
            {t.contact}
          </Link>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: pathScript }} />
    </main>
  );
}
