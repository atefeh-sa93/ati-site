import type { Dictionary } from "@/app/[lang]/dictionaries";
import { site } from "@/lib/site";

const FLOATING = [
  { cls: "top-7 end-[8%] bg-coral", rot: "-8deg", delay: "0s" },
  { cls: "bottom-8 start-[8%] bg-teal", rot: "6deg", delay: "-1.5s" },
  { cls: "top-9 start-[14%] bg-sun", rot: "10deg", delay: "-3s" },
];

export function Contact({ t }: { t: Dictionary }) {
  return (
    <section
      id="contact"
      className="reveal relative mt-10 flex flex-col items-center gap-5 overflow-hidden rounded-[40px] border border-line bg-contact px-10 py-16 text-center text-white max-sm:px-6"
    >
      {t.contact.floating.map((label, i) => (
        <span
          key={label}
          dir="ltr"
          aria-hidden="true"
          className={`anim-bob absolute rounded-full px-4 py-1.5 font-display font-semibold text-plum max-md:hidden ${FLOATING[i].cls}`}
          style={{ rotate: FLOATING[i].rot, "--delay": FLOATING[i].delay } as React.CSSProperties}
        >
          {label}
        </span>
      ))}

      <div dir="ltr" className="relative rounded-xl bg-black/25 px-4 py-2 font-mono text-sm text-lavender">
        <span className="text-teal">❯</span> {t.contact.cmd}{" "}
        <span aria-hidden="true" className="anim-blink inline-block h-4 w-2 bg-lavender align-[-3px]" />
      </div>
      <h2 className="relative m-0 max-w-[22ch] font-heading text-[clamp(28px,3.4vw,40px)] leading-snug font-extrabold">
        {t.contact.title}
      </h2>
      <p className="relative m-0 max-w-[52ch] text-lavender">{t.contact.body}</p>
      <a
        href={`mailto:${site.email}`}
        dir="ltr"
        className="lift relative inline-flex min-h-14 items-center rounded-full bg-sun px-[30px] font-display text-lg font-semibold text-plum no-underline"
      >
        {site.email}
      </a>
      <div className="relative flex flex-wrap justify-center gap-x-6 gap-y-2 pt-2">
        <a href={site.linkedin} className="text-white">{t.contact.linkedin}</a>
        <a href={site.github.url} className="text-white">{t.contact.github}</a>
        <a href={site.medium} className="text-white">{t.contact.medium}</a>
        <a href={site.cv} className="text-white">{t.contact.cv}</a>
      </div>
    </section>
  );
}

export function Footer({ t }: { t: Dictionary }) {
  return (
    <footer className="flex flex-wrap justify-between gap-3 px-2 pt-4 text-sm text-muted">
      <span>{t.footer.copyright}</span>
      <span dir="ltr" className="font-mono text-[13px]">{t.footer.built}</span>
    </footer>
  );
}
