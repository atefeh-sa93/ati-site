# Ati Atashi — personal site

Bilingual (Persian / English) portfolio built with **Next.js 16**, **React 19**, **TypeScript** and **Tailwind CSS v4**.
Light and dark themes, RTL-first layout, and motion that respects `prefers-reduced-motion`.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional
npm run dev                  # http://localhost:3000 → redirects to /fa or /en
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generates route types, then `tsc --noEmit` |

## How it works

- **i18n without a library.** Every route lives under `app/[lang]`. `proxy.ts` (Next 16's replacement for middleware) redirects `/` to `/fa` or `/en` from a saved `lang` cookie or the browser's `Accept-Language`. Strings live in `app/[lang]/dictionaries/*.json` and are read on the server via `next/root-params`, so translations never reach the client bundle.
- **Static by default.** Cache Components is on; both locales are prerendered with `generateStaticParams`.
- **No theme flash.** An inline script in the root layout sets `data-theme` on `<html>` before first paint (saved cookie, else OS preference). The toggle just flips the attribute; icons switch with CSS, so there's no hydration mismatch.
- **Design tokens.** Colours are CSS variables in `app/globals.css`, switched by `[data-theme="dark"]` and exposed to Tailwind via `@theme` (`bg-surface`, `text-sub`, `bg-coral-soft`…). A custom `dark:` variant follows `data-theme`.
- **RTL-first.** Logical utilities (`ps-*`, `inset-e-*`, `inset-s-*`) everywhere; arrows flip with `rtl:`; code and tags are forced `dir="ltr"`.
- **GitHub card.** `lib/github.ts` fetches the last 28 days of contributions through the GraphQL API inside a `"use cache"` function (`cacheLife("hours")`). Without `GITHUB_TOKEN` it shows sample data.
- **Motion.** Entrance animations, a scroll-driven reveal (`animation-timeline: view()`, progressive enhancement), count-up stats (`components/count-up.tsx`) and hover details — all disabled under reduced motion.
- **SEO.** Per-locale metadata with `hreflang` alternates, Open Graph, `sitemap.xml` and `robots.txt`.
- **Fonts** are self-hosted with `@fontsource-variable` (Vazirmatn, Nunito, Fredoka, Geist Mono).

### Modern platform features used

**Next.js 16**
- `proxy.ts` — the new name for middleware
- Cache Components (`cacheComponents: true`) with Partial Prerendering
- `"use cache"` + `cacheLife()` for the GitHub data
- `next/root-params` to read the locale anywhere on the server without prop drilling
- Typed route helpers (`LayoutProps<"/[lang]">`) and `next typegen`
- Turbopack (default bundler for dev and build)
- Metadata API with `hreflang` alternates, file-based `sitemap.ts`, `robots.ts`, `icon.svg`

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
  globals.css         tokens, Tailwind theme, animations
  sitemap.ts, robots.ts, icon.svg
components/           header, hero, work, activity, writing, contact, client widgets
lib/                  i18n config, site settings, GitHub data, cookie helper
proxy.ts              locale redirect
```

## Before launch

- [ ] Set `NEXT_PUBLIC_SITE_URL` (and `GITHUB_TOKEN`) in Vercel
- [x] Add your CV as `public/cv.pdf`
- [x] Add your Medium URL in `lib/site.ts`
- [ ] Replace the "soon" posts once the first article is written

## Deploy

Push to GitHub and import the repo in [Vercel](https://vercel.com/new). No extra configuration needed.
