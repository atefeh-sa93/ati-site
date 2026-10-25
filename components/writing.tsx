import type { Dictionary } from "@/app/[lang]/dictionaries";
import { site } from "@/lib/site";
import { Arrow, SectionHeading } from "./decor";

const DOT: Record<string, string> = { coral: "bg-coral", sun: "bg-sun", teal: "bg-teal" };
const LANG_LABEL: Record<string, string> = { fa: "فا", en: "EN" };

export function Writing({ t }: { t: Dictionary }) {
  return (
    <section id="writing" className="flex flex-col gap-5 pt-10">
      <div className="reveal flex flex-wrap items-end justify-between gap-3">
        <SectionHeading label={t.writing.label} title={t.writing.title} wave="#3DD6B5" />
        <a href={site.medium} className="font-bold">
          {t.writing.medium} <Arrow />
        </a>
      </div>

      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {t.writing.posts.map((post) => (
          // Posts aren't written yet, so these are plain rows marked "soon" rather than links.
          <li key={post.title} className="reveal flex flex-wrap items-center gap-x-5 gap-y-2 rounded-3xl border border-line bg-surface px-6 py-[18px] shadow-soft">
            <span aria-hidden="true" className={`size-3.5 rounded-full ${DOT[post.dot]}`} />
            <span className="min-w-0 flex-[1_1_260px] text-lg font-bold">{post.title}</span>
            <span className="rounded-full border border-dashed border-muted px-2.5 text-[13px] text-muted">{t.writing.soon}</span>
            <span className="flex gap-1.5 text-[13px] font-bold">
              {post.langs.map((l) => (
                <span key={l} lang={l} className={`rounded-full bg-pill px-2.5 py-0.5 ${l === "fa" ? "font-fa" : "font-display"}`}>
                  {LANG_LABEL[l]}
                </span>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
