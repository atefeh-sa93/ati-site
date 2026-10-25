import type { Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeading } from "./decor";

type Project = Dictionary["work"]["projects"][number];

const TONES: Record<string, { card: string; visual: string }> = {
  coral: { card: "bg-coral-soft", visual: "bg-coral" },
  teal: { card: "bg-teal-soft", visual: "bg-teal" },
  sun: { card: "bg-sun-soft", visual: "bg-sun" },
};

function Visual({ kind }: { kind: string }) {
  const common = "wiggle absolute -top-6 -end-6";
  if (kind === "grid")
    return (
      <svg aria-hidden="true" width="150" height="150" viewBox="0 0 150 150" className={`${common} opacity-45`}>
        <rect x="10" y="10" width="56" height="56" rx="14" fill="#FFC93C" />
        <rect x="76" y="10" width="56" height="56" rx="14" fill="#fff" />
        <rect x="10" y="76" width="56" height="56" rx="14" fill="#fff" />
        <rect x="76" y="76" width="56" height="56" rx="28" fill="#FFC93C" />
      </svg>
    );
  if (kind === "bag")
    return (
      <svg aria-hidden="true" width="170" height="130" viewBox="0 0 170 130" className={`${common} opacity-50`}>
        <path d="M40 40h90l-10 60H50z" fill="#fff" />
        <path d="M60 40c0-20 50-20 50 0" fill="none" stroke="#2A1B3D" strokeWidth={5} strokeLinecap="round" />
        <circle cx="120" cy="30" r="14" fill="#6C4DF5" />
      </svg>
    );
  return (
    <svg aria-hidden="true" width="170" height="120" viewBox="0 0 170 120" className={`${common} opacity-55`}>
      <circle cx="30" cy="40" r="14" fill="#fff" />
      <circle cx="80" cy="40" r="14" fill="#fff" />
      <circle cx="130" cy="40" r="14" fill="#6C4DF5" />
      <path d="M44 40h22M94 40h22" stroke="#2A1B3D" strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const tone = TONES[project.tone] ?? TONES.coral;
  return (
    <article className={`lift reveal flex min-w-0 flex-[1_1_300px] flex-col gap-3 rounded-[32px] p-5 pb-7 ${tone.card}`}>
      <div className={`relative flex aspect-video flex-col justify-end overflow-hidden rounded-[22px] p-5 text-plum ${tone.visual}`}>
        <Visual kind={project.visual} />
        <span dir="ltr" className="relative self-start rounded-full bg-white px-2.5 py-0.5 font-mono text-[13px]">
          {project.badge}
        </span>
      </div>
      <span className="text-sm text-muted">{project.meta}</span>
      <h3 className="m-0 font-heading text-[21px] leading-snug font-extrabold">{project.title}</h3>
      <p className="m-0 text-sub">{project.body}</p>
      <ul dir="ltr" className="m-0 flex list-none flex-wrap gap-2 p-0 pt-1 font-mono text-xs">
        {project.tags.map((tag) => (
          <li key={tag} className="rounded-full bg-chip px-3 py-1">{tag}</li>
        ))}
      </ul>
    </article>
  );
}

export function Work({ t }: { t: Dictionary }) {
  return (
    <section id="work" className="flex flex-col gap-5 pt-10">
      <div className="reveal flex flex-wrap items-end justify-between gap-3">
        <SectionHeading label={t.work.label} title={t.work.title} wave="#FF7A59" />
        <span className="text-[15px] text-muted">{t.work.note}</span>
      </div>
      <div className="flex flex-wrap gap-5">
        {t.work.projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
