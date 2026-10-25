import type { Dictionary } from "@/app/[lang]/dictionaries";
import { getContributionLevels } from "@/lib/github";
import { site } from "@/lib/site";

const LEVEL_BG = ["bg-[var(--lv-0)]", "bg-[var(--lv-1)]", "bg-[var(--lv-2)]", "bg-[var(--lv-3)]", "bg-[var(--lv-4)]"];
const CHIP_BG = ["bg-coral-soft", "bg-teal-soft", "bg-sun-soft", "bg-violet-soft dark:bg-pill"];

/** Async Server Component: the contribution data is fetched (and cached) on the server. */
async function GitHubCard({ t }: { t: Dictionary }) {
  const { levels } = await getContributionLevels(site.github.user);

  return (
    <div className="reveal flex min-w-0 flex-[1_1_340px] flex-col gap-3.5 rounded-[28px] border border-line bg-surface p-6 shadow-soft">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="m-0 font-heading text-lg font-extrabold">{t.activity.title}</h3>
        <a href={site.github.url} dir="ltr" className="font-mono text-[13px] text-accent-text">
          @{site.github.user}
        </a>
      </div>
      <div role="img" aria-label={t.activity.chartLabel} dir="ltr" className="grid grid-cols-14 gap-[5px]">
        {levels.map((level, i) => (
          <span
            key={i}
            className={`anim-pop aspect-square rounded-[4px] ${LEVEL_BG[level]}`}
            style={{ "--delay": `${0.3 + i * 0.03}s` } as React.CSSProperties}
          />
        ))}
      </div>
      <p className="m-0 text-sm text-sub">{t.activity.building}</p>
    </div>
  );
}

function StackCard({ t }: { t: Dictionary }) {
  return (
    <div className="reveal flex min-w-0 flex-[1_1_340px] flex-col gap-3.5 rounded-[28px] border border-line bg-surface p-6 shadow-soft">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="m-0 font-heading text-lg font-extrabold">{t.stack.title}</h3>
        <span dir="ltr" className="font-mono text-[13px] text-accent-text">{t.stack.label}</span>
      </div>
      <ul dir="ltr" className="m-0 flex list-none flex-wrap gap-2 p-0 font-mono text-[13px]">
        {site.stack.map((tool, i) => (
          <li key={tool} className={`rounded-full px-3 py-1.5 text-plum dark:text-ink ${CHIP_BG[i % CHIP_BG.length]}`}>
            {tool}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Activity({ t }: { t: Dictionary }) {
  return (
    <section aria-label={`${t.activity.title} · ${t.stack.title}`} className="flex flex-wrap gap-5 pt-5">
      <GitHubCard t={t} />
      <StackCard t={t} />
    </section>
  );
}
