<div align="center">

<a href="https://atefeh-sa93.github.io/ati-site/"><img src="https://atefeh-sa93.github.io/ati-site/en/og.png" alt="Ati Atashi — Senior Front-End Engineer" width="760"></a>

# Ati Atashi — personal site

Bilingual (English / فارسی) portfolio · RTL-first · light & dark themes · static on GitHub Pages

[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vitest](https://img.shields.io/badge/tested_with-Vitest-6E9F18?logo=vitest&logoColor=white)](#testing)
[![CI](https://github.com/atefeh-sa93/ati-site/actions/workflows/ci.yml/badge.svg)](https://github.com/atefeh-sa93/ati-site/actions/workflows/ci.yml)
[![Deploy](https://github.com/atefeh-sa93/ati-site/actions/workflows/deploy.yml/badge.svg)](https://github.com/atefeh-sa93/ati-site/actions/workflows/deploy.yml)

### [🌐 Live site](https://atefeh-sa93.github.io/ati-site/)

[English](https://atefeh-sa93.github.io/ati-site/en/) · [فارسی](https://atefeh-sa93.github.io/ati-site/fa/) · [CV (PDF)](https://atefeh-sa93.github.io/ati-site/cv.pdf) · [LinkedIn](https://www.linkedin.com/in/atefeh-atashi/)

</div>

<br>

Built with **Next.js 16**, **React 19**, **TypeScript** and **Tailwind CSS v4**, exported as a static site to **GitHub Pages**. Motion respects `prefers-reduced-motion`.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional
npm run dev                  # http://localhost:3000/en/ or /fa/
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Static export to `out/` |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generates route types, then `tsc --noEmit` |
| `npm test` | Unit and component tests (Vitest), once |
| `npm run test:watch` | Same, re-running on every save |

## Testing

Unit and component tests use **Vitest** and **React Testing Library**. They live next to the code they cover (`lib/i18n.ts` → `lib/i18n.test.ts`) and run on every push and pull request in CI; the deploy workflow won't publish if they fail.

| File | What it covers | Technique |
| --- | --- | --- |
| `lib/i18n.test.ts` | Supported locales, English default, text direction | Plain assertions |
| `lib/rtl-runs.test.ts` | Persian word splitting for the preview image: ZWNJ words, Latin phrases, leading `+`, extra spaces | Edge cases |
| `lib/github.test.ts` | GitHub contributions: no token, request shape, level mapping, 28-day window, HTTP/network errors | `fetch` and env mocked |
| `components/theme-toggle.test.tsx` | Real `<button>`, labels, light/dark toggle, saved cookie | Queries by role, `user-event` |
| `components/lang-switch.test.tsx` | Labelled nav, `aria-current`, other-language link, saved cookie | `next/navigation` and `next/link` mocked |
| `components/count-up.test.tsx` | Final value without JS, Persian digits, count-up on scroll, reduced motion, cleanup | Fake `matchMedia` / `IntersectionObserver`, fake timers |

Components are found the way a screen reader finds them (`getByRole`), so a control that isn't accessible fails its tests. Async Server Components (the page itself, the GitHub card) aren't supported by Vitest and are left for end-to-end tests.

## How it works

- **i18n without a library.** Every route lives under `app/[lang]`. Static hosting has no server, so `public/index.html` redirects `/` to `en/`, or to `fa/` when the visitor picked Persian before (saved `lang` cookie). Strings live in `app/[lang]/dictionaries/*.json` and are read on the server via `next/root-params`, so translations never reach the client bundle.
- **Fully static.** `output: "export"` writes plain HTML to `out/`; both locales are prerendered with `generateStaticParams`. `basePath` comes from `NEXT_PUBLIC_BASE_PATH` so the same code runs at `/` locally and at `/ati-site` on GitHub Pages.
- **No theme flash.** An inline script in the root layout sets `data-theme` on `<html>` before first paint (saved cookie, else OS preference). The toggle just flips the attribute; icons switch with CSS, so there's no hydration mismatch.
- **Design tokens.** Colours are CSS variables in `app/globals.css`, switched by `[data-theme="dark"]` and exposed to Tailwind via `@theme` (`bg-surface`, `text-sub`, `bg-coral-soft`…). A custom `dark:` variant follows `data-theme`.
- **RTL-first.** Logical utilities (`ps-*`, `inset-e-*`, `inset-s-*`) everywhere; arrows flip with `rtl:`; code and tags are forced `dir="ltr"`.
- **GitHub card.** `lib/github.ts` fetches the last 28 days of contributions through the GraphQL API at build time; the deploy workflow rebuilds daily to keep it fresh. Without `GITHUB_TOKEN` it shows sample data (and logs a warning in the build).
- **Motion.** Entrance animations, a scroll-driven reveal (`animation-timeline: view()`, progressive enhancement), count-up stats (`components/count-up.tsx`) and hover details — all disabled under reduced motion.
- **SEO.** Per-locale metadata with canonical URLs, `hreflang` alternates and Open Graph.
- **404 page.** `app/global-not-found.tsx` (experimental `globalNotFound`) is exported as `404.html`, which GitHub Pages serves for every unknown URL. It renders both languages and an inline script shows Persian for `/fa/…` URLs or a saved choice; the terminal line shows the address that was requested.
- **Social preview.** `app/[lang]/og.png/route.tsx` renders a 1200×630 card per locale at build time with `next/og`. Satori has no RTL support, so Persian is laid out word by word (row-reverse, ZWNJ words kept whole) with widths measured by `fontkit`.
- **Fonts** are self-hosted with `@fontsource-variable` (Vazirmatn, Nunito, Fredoka, Geist Mono).

### Modern platform features used

**Next.js 16**
- Static export (`output: "export"`) with `basePath` and `trailingSlash`
- `next/root-params` to read the locale anywhere on the server without prop drilling
- Typed route helpers (`LayoutProps<"/[lang]">`) and `next typegen`
- Turbopack (default bundler for dev and build)
- Metadata API with `hreflang` alternates and a file-based `icon.svg`

**Tailwind CSS v4**
- CSS-first config: `@theme inline`, `@custom-variant`, `@utility` — no `tailwind.config.js`
- Logical utilities for RTL (`ps-*`, `pe-*`, `inset-s-*`, `inset-e-*`) and the `rtl:` variant

**Modern CSS**
- Scroll-driven animations: `animation-timeline: view()` + `animation-range`, behind `@supports`
- Individual transform properties (`translate`, `rotate`, `scale`) so entrance, hover and float animations compose
- Logical properties (`padding-inline-start`, `inset-inline-end`) instead of left/right
- `dvh` viewport units, `aspect-ratio`, `clamp()` for fluid type
- `color-scheme`, `:focus-visible`, `prefers-reduced-motion`, `prefers-color-scheme`

```
app/
  [lang]/
    layout.tsx        root layout: <html lang dir>, theme script, metadata
    page.tsx          home page
    not-found.tsx     in-app 404 (same view as the global one)
    dictionaries.ts   getLocale() / getDictionary()
    dictionaries/     fa.json, en.json
    og.png/route.tsx  social preview image
  global-not-found.tsx  404.html for GitHub Pages
  globals.css         tokens, Tailwind theme, animations
  icon.svg
components/           header, hero, work, activity, writing, contact, client widgets
lib/                  i18n config, site settings, GitHub data, cookie helper
public/
  index.html          locale redirect for /
  cv.pdf
.github/workflows/    ci.yml (lint, types, tests, build), deploy.yml (tests, then GitHub Pages)
vitest.config.mts     test runner config (+ vitest.setup.ts)
```

## Deploy

Every push to `main` (and a daily schedule) runs `.github/workflows/deploy.yml`, which runs the tests, builds the static export and publishes `out/` to GitHub Pages. One-time setup: **Settings → Pages → Source: GitHub Actions**.

Build-time environment variables (see `.env.example`); the workflow sets the first two from the Pages config:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_BASE_PATH` | Path prefix, e.g. `/ati-site`. Empty locally. |
| `NEXT_PUBLIC_SITE_URL` | Public URL for canonical links and Open Graph. Defaults to `https://atefeh-sa93.github.io/ati-site`. |
| `GITHUB_TOKEN` | Shows the real contribution graph. The workflow uses the `CONTRIBUTIONS_TOKEN` secret if set, else its own token. |

To preview the production build locally, serve `out/` with any static server, e.g. `npx serve out`.
