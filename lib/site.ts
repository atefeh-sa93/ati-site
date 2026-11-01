/** Site-wide settings. */
export const site = {
  // Canonical URLs and OG. Set NEXT_PUBLIC_SITE_URL when a custom domain is connected.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://atefeh-sa93.github.io/ati-site",
  email: "ati.atashi1993@gmail.com",
  github: { user: "atefeh-sa93", url: "https://github.com/atefeh-sa93" },
  linkedin: "https://www.linkedin.com/in/atefeh-atashi/",
  medium: "https://medium.com/@atefeh_sa93",
  // Served from public/cv.pdf; plain <a> links need the base path added by hand.
  cv: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/cv.pdf`,
  stack: [
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "Shadcn UI",
    "TanStack Query",
    "Zustand",
    "React Hook Form + Zod",
    "Vitest",
    "Sentry",
    "Node.js",
    "Claude Code",
  ],
} as const;
