import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/lib/i18n";
import { LangSwitch } from "./lang-switch";
import { ThemeToggle } from "./theme-toggle";

export function Header({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    <header className="anim-drop flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-line sm:rounded-full bg-surface py-2.5 ps-5 pe-3 shadow-soft">
      <a href="#top" className="flex items-center gap-2.5 no-underline">
        <span className="blob flex size-11 items-center justify-center bg-primary font-heading text-xl font-extrabold text-white">
          {t.person.initial}
        </span>
        <span className="flex flex-col leading-tight">
          <span className="font-heading text-lg font-extrabold">{t.person.name}</span>
          <span className="text-[13px] text-muted">{t.person.role}</span>
        </span>
      </a>

      <div className="flex flex-wrap items-center gap-x-4.5 gap-y-1.5">
        <nav aria-label={t.nav.label} className="flex flex-wrap gap-x-4.5 font-semibold">
          <a href="#work" className="no-underline">{t.nav.work}</a>
          <a href="#writing" className="no-underline">{t.nav.writing}</a>
          <a href="#contact" className="no-underline">{t.nav.contact}</a>
        </nav>
        <ThemeToggle toLight={t.nav.toLight} toDark={t.nav.toDark} />
        <LangSwitch current={locale} label={t.nav.language} />
      </div>
    </header>
  );
}
