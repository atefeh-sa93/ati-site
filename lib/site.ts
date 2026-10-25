/** Site-wide settings. Update the TODOs before launch. */
export const site = {
  // TODO: replace with your real domain once it's connected (used for canonical URLs, sitemap and OG).
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ati-atashi.vercel.app",
  email: "ati.atashi1993@gmail.com",
  github: { user: "atefeh-sa93", url: "https://github.com/atefeh-sa93" },
  linkedin: "https://linkedin.com/in/atefeh-atashi",
  // TODO: add your Medium profile URL.
  medium: "https://medium.com/",
  // TODO: put your CV at public/cv.pdf (consider removing your phone number from the public copy).
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
