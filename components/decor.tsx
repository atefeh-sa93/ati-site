/** Small presentational pieces shared by the sections. */

export function Wave({ color }: { color: string }) {
  return (
    <svg aria-hidden="true" width="110" height="14" viewBox="0 0 110 14" className="wave">
      <path d="M2 9c12-8 22 6 34 0s22-8 34 0 22 6 38-2" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
}

export function SectionHeading({ label, title, wave }: { label: string; title: string; wave: string }) {
  return (
    <div className="flex flex-col">
      <span dir="ltr" className="self-start font-mono text-[13px] text-accent-text">
        {label}
      </span>
      <h2 className="m-0 font-heading text-[32px] leading-snug font-extrabold">{title}</h2>
      <Wave color={wave} />
    </div>
  );
}

/** "→" in English, "←" in Persian. */
export function Arrow() {
  return (
    <span aria-hidden="true" className="inline-block rtl:-scale-x-100">
      →
    </span>
  );
}

export function Star({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" width="64" height="64" viewBox="0 0 64 64" className={className}>
      <path
        d="M32 4l6 20 20 2-16 12 6 20-16-12-16 12 6-20L6 26l20-2z"
        fill="#FFC93C"
        stroke="#2A1B3D"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DashedRings({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" width="220" height="220" viewBox="0 0 220 220" className={className}>
      <circle cx="110" cy="110" r="100" fill="none" stroke="#fff" strokeWidth={3} strokeDasharray="6 12" />
      <circle cx="110" cy="110" r="60" fill="none" stroke="#fff" strokeWidth={3} />
    </svg>
  );
}
