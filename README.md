<div align="center">

<a href="https://atefeh-sa93.github.io/ati-site/"><img src="https://atefeh-sa93.github.io/ati-site/en/og.png" alt="Ati Atashi — Senior Front-End Engineer" width="760"></a>

# Ati Atashi — personal site

Bilingual (English / فارسی) portfolio · RTL-first · light & dark themes · static on GitHub Pages

[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vitest](https://img.shields.io/badge/tested_with-Vitest-6E9F18?logo=vitest&logoColor=white)](#testing)
[![WCAG 2.1 AA](https://img.shields.io/badge/a11y-WCAG_2.1_AA_(axe)-6c4df5)](#accessibility-axe--playwright)
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
| `npm run test:e2e` | Accessibility checks (axe + Playwright) on the production build |

## Testing

Two layers, both run in CI on every push and pull request:

- **39 unit and component tests** (Vitest) in 6 files, running in about a second. The deploy workflow won't publish if any fail.
- **6 accessibility tests** (axe in Playwright) on the production build, in a real browser.

```bash
npm test             # unit and component tests, once
npm run test:watch   # re-run on every save
npm run test:e2e     # build, serve like GitHub Pages, then run axe in Chromium
```

### Unit and component tests

Tests live next to the code they cover (`lib/i18n.ts` → `lib/i18n.test.ts`).

| Tool | Role |
| --- | --- |
| [Vitest](https://vitest.dev) | Test runner and assertions (`describe` / `it` / `expect`), mocks (`vi.fn`, `vi.mock`, `vi.stubGlobal`, `vi.stubEnv`) and fake timers |
| [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) | Renders components and finds elements the way users do (`getByRole`, `getByText`) |
| [user-event](https://testing-library.com/docs/user-event/intro) | Realistic clicks and typing |
| [jest-dom](https://github.com/testing-library/jest-dom) | Readable DOM checks: `toBeInTheDocument()`, `toHaveAttribute()` |
| [jsdom](https://github.com/jsdom/jsdom) | A browser DOM inside Node, enabled per file with `// @vitest-environment jsdom` |

Setup: `vitest.config.mts` (React plugin, `@/` paths from `tsconfig.json`) and `vitest.setup.ts` (jest-dom matchers, cleanup after each test).

### What's covered

| File | Tests | What it covers | Technique |
| --- | --- | --- | --- |
| `lib/i18n.test.ts` | 7 | Supported locales, English default, text direction | Plain assertions |
| `lib/rtl-runs.test.ts` | 7 | Persian word splitting for the preview image: ZWNJ words, Latin phrases, leading `+`, extra spaces | Edge cases |
| `lib/github.test.ts` | 7 | GitHub contributions: no token, request shape, level mapping, 28-day window, HTTP/network errors | `fetch` and env mocked |
| `components/theme-toggle.test.tsx` | 5 | Real `<button>`, labels, light/dark toggle, saved cookie | Queries by role, `user-event` |
| `components/lang-switch.test.tsx` | 5 | Labelled nav, `aria-current`, other-language link, saved cookie | `next/navigation` and `next/link` mocked |
| `components/count-up.test.tsx` | 8 | Final value without JS, Persian digits, count-up on scroll, reduced motion, cleanup | Fake `matchMedia` / `IntersectionObserver`, fake timers |

Components are found the way a screen reader finds them (`getByRole`), so a control that isn't accessible fails its tests. Writing them also caught a real bug: double or trailing spaces in Persian text produced empty words (extra gaps) in the preview image.

### Accessibility (axe + Playwright)

`e2e/a11y.spec.ts` runs [axe-core](https://github.com/dequelabs/axe-core) with the **WCAG 2.1 A and AA** rules — colour contrast, labels, landmarks, headings, ARIA — in Chromium, on every page a visitor can see:

| Page | Light | Dark |
| --- | --- | --- |
| Home, English | ✓ | ✓ |
| Home, Persian (RTL) | ✓ | ✓ |
| 404, English / Persian | ✓ (follows the saved theme) | |

| Tool | Role |
| --- | --- |
| [Playwright](https://playwright.dev) | Drives a real Chromium; builds the site first and starts the server (`playwright.config.ts`) |
| [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright) | Runs axe inside the page and returns the violations |
| `scripts/serve-pages.mjs` | Serves `out/` like GitHub Pages: under `/ati-site/`, with `404.html` and a 404 status for unknown URLs |

Animations are turned off for the checks (`reducedMotion: "reduce"`), so contrast is measured on final colours, not half-faded frames. A failure prints each rule with the elements it hit, and CI keeps the Playwright report for 7 days.

The first run found two contrast failures in the hero card — the badge (3.98:1) and the intro text (4.34:1), both under the 4.5:1 minimum — now fixed at 6.56:1 and 4.63:1.

### Not covered yet

Behaviour in a real browser — the language redirect in `public/index.html`, switching language and theme across reloads, the GitHub card's 28 cells, the generated preview images — is the next set of Playwright tests. axe also can't judge everything: keyboard flow and screen-reader wording still need a manual pass.

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
.github/workflows/    ci.yml (lint, types, tests, build; axe), deploy.yml (tests, then GitHub Pages)
vitest.config.mts     test runner config (+ vitest.setup.ts)
e2e/                  accessibility tests (Playwright + axe), playwright.config.ts
scripts/serve-pages.mjs  serves out/ like GitHub Pages for e2e tests
```

## Decisions and trade-offs

| Decision | Why | What it cost |
| --- | --- | --- |
| **Host on GitHub Pages** | I don't have a hosting plan yet; Pages is free and lives next to the code. | Static files only, so no server features — see the rows below. |
| **Static export** (`output: "export"`) | It's what GitHub Pages can serve. | Next's proxy (middleware), the `sitemap`/`robots` routes and Cache Components don't work in export mode, so they were removed. The `/` → language redirect moved to a small script in `public/index.html`. |
| **GitHub data fetched at build time** | The token stays in CI and never reaches the browser; the page stays fully static. | The contribution card can be up to a day old (the deploy rebuilds daily). |
| **Social preview drawn with `next/og` (Satori)** | One card per language, generated from the same text as the page. | Satori has no right-to-left support, so Persian words are placed by hand (`lib/rtl-runs.ts`) with widths measured by `fontkit`. More code to own than a static image. |
| **Preview served from an `og.png` route** | The built-in `opengraph-image` file came out without a `.png` extension in the static export. | A route handler instead of the file convention. |
| **404 via `global-not-found`** | GitHub Pages serves one `404.html` for every unknown URL, in either language. | The API is still experimental. The page ships both languages and a script shows one. |
| **Hero colours adjusted for contrast** | axe found the badge and intro text below WCAG AA (4.5:1). | The lilac and badge colours moved slightly from the original design. |

## Known limitations

- **The `/` redirect needs JavaScript.** Without it, a `<noscript>` refresh always goes to English, even if Persian was chosen before.
- **No `sitemap.xml` or `robots.txt`** (see above); pages are still linked to each other with `hreflang`.
- **The GitHub card can be up to 24 hours old**, and shows sample data if the build has no token.
- **Project cards don't link anywhere yet**, and the writing section lists posts marked "Soon".
- **Accessibility is checked automatically, not by hand.** axe passes in both languages and themes, but there's been no full keyboard or screen-reader pass.
- **Browser behaviour isn't tested yet** — see [Not covered yet](#not-covered-yet).

## How this was built

I built this site with an AI coding assistant (Claude Code) writing most of the code, and I want to be clear about that.

My part was deciding and checking:

- **Decisions:** hosting on GitHub Pages, English as the default language, keeping my phone number out of the site and CV, a custom-designed 404 page, and which contrast fix to use.
- **Catching problems in the output:** Tailwind class warnings across the codebase, misaligned stats in the hero card.
- **Verification:** nothing was merged without lint, type checks, 39 unit tests and the axe checks passing in CI. When tests were added, each one was checked by breaking the code on purpose and watching it fail.

What I'm doing next on my own: writing the browser tests listed under [Not covered yet](#not-covered-yet), without AI-written code.

## Deploy

Every push to `main` (and a daily schedule) runs `.github/workflows/deploy.yml`, which runs the tests, builds the static export and publishes `out/` to GitHub Pages. One-time setup: **Settings → Pages → Source: GitHub Actions**.

Build-time environment variables (see `.env.example`); the workflow sets the first two from the Pages config:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_BASE_PATH` | Path prefix, e.g. `/ati-site`. Empty locally. |
| `NEXT_PUBLIC_SITE_URL` | Public URL for canonical links and Open Graph. Defaults to `https://atefeh-sa93.github.io/ati-site`. |
| `GITHUB_TOKEN` | Shows the real contribution graph. The workflow uses the `CONTRIBUTIONS_TOKEN` secret if set, else its own token. |

To preview the production build locally, serve `out/` with any static server, e.g. `npx serve out`.
