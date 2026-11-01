# Ati Atashi — personal site

[![Deploy](https://github.com/atefeh-sa93/ati-site/actions/workflows/deploy.yml/badge.svg)](https://github.com/atefeh-sa93/ati-site/actions/workflows/deploy.yml)

### 🌐 [atefeh-sa93.github.io/ati-site](https://atefeh-sa93.github.io/ati-site/)

[English](https://atefeh-sa93.github.io/ati-site/en/) · [فارسی](https://atefeh-sa93.github.io/ati-site/fa/) · [CV (PDF)](https://atefeh-sa93.github.io/ati-site/cv.pdf) · [LinkedIn](https://www.linkedin.com/in/atefeh-atashi/)

[![Ati Atashi — Senior Front-End Engineer](https://atefeh-sa93.github.io/ati-site/en/og.png)](https://atefeh-sa93.github.io/ati-site/)

Bilingual (Persian / English) portfolio built with **Next.js 16**, **React 19**, **TypeScript** and **Tailwind CSS v4**, exported as a static site to **GitHub Pages**.
Light and dark themes, RTL-first layout, and motion that respects `prefers-reduced-motion`.

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

## How it works

- **i18n without a library.** Every route lives under `app/[lang]`. Static hosting has no server, so `public/index.html` redirects `/` to `en/`, or to `fa/` when the visitor picked Persian before (saved `lang` cookie). Strings live in `app/[lang]/dictionaries/*.json` and are read on the server via `next/root-params`, so translations never reach the client bundle.
- **Fully static.** `output: "export"` writes plain HTML to `out/`; both locales are prerendered with `generateStaticParams`. `basePath` comes from `NEXT_PUBLIC_BASE_PATH` so the same code runs at `/` locally and at `/ati-site` on GitHub Pages.
- **No theme flash.** An inline script in the root layout sets `data-theme` on `<html>` before first paint (saved cookie, else OS preference). The toggle just flips the attribute; icons switch with CSS, so there's no hydration mismatch.
- **Design tokens.** Colours are CSS variables in `app/globals.css`, switched by `[data-theme="dark"]` and exposed to Tailwind via `@theme` (`bg-surface`, `text-sub`, `bg-coral-soft`…). A custom `dark:` variant follows `data-theme`.
- **RTL-first.** Logical utilities (`ps-*`, `inset-e-*`, `inset-s-*`) everywhere; arrows flip with `rtl:`; code and tags are forced `dir="ltr"`.
- **GitHub card.** `lib/github.ts` fetches the last 28 days of contributions through the GraphQL API at build time; the deploy workflow rebuilds daily to keep it fresh. Without `GITHUB_TOKEN` it shows sample data (and logs a warning in the build).
- **Motion.** Entrance animations, a scroll-driven reveal (`animation-timeline: view()`, progressive enhancement), count-up stats (`components/count-up.tsx`) and hover details — all disabled under reduced motion.
- **SEO.** Per-locale metadata with canonical URLs, `hreflang` alternates and Open Graph.
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
    not-found.tsx
    dictionaries.ts   getLocale() / getDictionary()
    dictionaries/     fa.json, en.json
    og.png/route.tsx  social preview image
  globals.css         tokens, Tailwind theme, animations
  icon.svg
components/           header, hero, work, activity, writing, contact, client widgets
lib/                  i18n config, site settings, GitHub data, cookie helper
public/
  index.html          locale redirect for /
  cv.pdf
.github/workflows/    ci.yml (checks), deploy.yml (GitHub Pages)
```

## Deploy

Every push to `main` (and a daily schedule) runs `.github/workflows/deploy.yml`, which builds the static export and publishes `out/` to GitHub Pages. One-time setup: **Settings → Pages → Source: GitHub Actions**.

Build-time environment variables (see `.env.example`); the workflow sets the first two from the Pages config:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_BASE_PATH` | Path prefix, e.g. `/ati-site`. Empty locally. |
| `NEXT_PUBLIC_SITE_URL` | Public URL for canonical links and Open Graph. Defaults to `https://atefeh-sa93.github.io/ati-site`. |
| `GITHUB_TOKEN` | Shows the real contribution graph. The workflow uses the `CONTRIBUTIONS_TOKEN` secret if set, else its own token. |

To preview the production build locally, serve `out/` with any static server, e.g. `npx serve out`.
