import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { CountUp } from "./count-up";
import { DashedRings, Star } from "./decor";

export function Hero({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    <section id="top" className="flex flex-wrap gap-5">
      {/* Intro card */}
      <div className="anim-rise relative flex min-w-0 flex-[2_1_520px] flex-col gap-5 overflow-hidden rounded-4xl bg-primary px-10 pt-12 pb-10 text-white max-sm:px-6">
        <DashedRings className="anim-spin absolute -inset-e-10 -bottom-12 opacity-25" />
        <Star className="anim-bob absolute inset-e-9 top-8 max-sm:hidden" />

        <span className="inline-flex items-center gap-2 self-start rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold">
          <span aria-hidden="true" className="size-2 rounded-full bg-teal" />
          {t.hero.badge}
        </span>
        <h1
          className="anim-rise m-0 max-w-[20ch] font-heading text-[clamp(30px,3.6vw,44px)] leading-[1.35] font-extrabold"
          style={{ "--delay": ".2s" } as React.CSSProperties}
        >
          {t.hero.title}
        </h1>
        <p className="anim-rise m-0 max-w-[52ch] text-lilac" style={{ "--delay": ".3s" } as React.CSSProperties}>
          {t.hero.intro}
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a href="#work" className="lift inline-flex min-h-13 items-center rounded-full bg-white px-6.5 font-extrabold text-plum no-underline">
            {t.hero.ctaWork}
          </a>
          <a href={site.cv} className="lift inline-flex min-h-13 items-center gap-2 rounded-full border-2 border-white px-6.5 font-bold text-white no-underline">
            <svg aria-hidden="true" className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
            </svg>
            {t.hero.ctaCv}
          </a>
        </div>
      </div>

      {/* Side cards */}
      <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-5">
        <div className="anim-rise flex flex-auto flex-col gap-3.5 rounded-4xl bg-sun px-7 py-6.5 text-plum" style={{ "--delay": ".2s" } as React.CSSProperties}>
          <span dir="ltr" className="self-start font-mono text-[13px]">{t.impact.label}</span>
          <dl className="m-0 grid grid-cols-2 gap-x-3 gap-y-4">
            {t.impact.items.map((item) => (
              <div key={item.label} className="flex flex-col-reverse justify-end">
                <dt className="text-sm">{item.label}</dt>
                <dd className="m-0 font-heading text-[28px] leading-tight font-extrabold">
                  <CountUp value={item.value} prefix={item.prefix} suffix={item.suffix} locale={locale} />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="anim-rise flex flex-auto flex-col gap-2 rounded-4xl bg-teal px-7 py-6.5 text-plum" style={{ "--delay": ".32s" } as React.CSSProperties}>
          <span dir="ltr" className="self-start font-mono text-[13px]">{t.now.label}</span>
          <p className="m-0 font-heading text-[19px] leading-normal font-extrabold">{t.now.text}</p>
          <span className="text-sm">{t.now.since}</span>
        </div>
      </div>
    </section>
  );
}
