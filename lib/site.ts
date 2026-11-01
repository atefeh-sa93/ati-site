/** Site-wide settings. */
export const site = {
  // Canonical URLs, sitemap and OG. Set NEXT_PUBLIC_SITE_URL when a custom domain is connected.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ati-atashi.vercel.app",
  email: "ati.atashi1993@gmail.com",
  github: { user: "atefeh-sa93", url: "https://github.com/atefeh-sa93" },
  linkedin: "https://www.linkedin.com/in/atefeh-atashi/",
  medium: "https://medium.com/@atefeh_sa93",
  // Served from public/cv.pdf.
  cv: "/cv.pdf",
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
