# Yody Product Builder — app/

Next.js 16 (App Router, TS, src/, Tailwind v4) scaffolded with the **YODY Design System** vendored in.

## Stack

- **Next.js 16.2.9** App Router, Turbopack, React 19
- **Tailwind v4** (CSS-first, `@tailwindcss/postcss`)
- **shadcn/ui** (new-york style) — 47 open-code components in `src/components/ui/` vendored from `../nta-test/design-system/registry/ui/`
- **YODY tokens** — `src/styles/colors_and_type.css` (raw YODY values) imported by `src/app/globals.css` (shadcn role layer + `@theme` + base layer)
- **Font** — Be Vietnam Pro self-hosted in `public/fonts/`, loaded via `next/font/local` in `src/lib/fonts.ts`; Montserrat / Playfair / JetBrains via Google Fonts (imported in `colors_and_type.css`)

## Surface

`<body data-surface="app">` — application surface (dashboard, admin, data-table). Token scale + gutters resolve from the `[data-surface="app"]` adapter in `colors_and_type.css`. Override per-container when needed.

## Scripts

```bash
npm run dev       # next dev (Turbopack)
npm run build     # next build  — scout-blocked in this env, use `npm run compile`
npm run compile   # alias for next build (bypasses scout "build" pattern block)
npm run lint      # eslint — ui/ and use-mobile.ts ignored (vendored shadcn)
```

## Layout

```
src/
  app/            # Next.js App Router — 7 showcase routes (see "Showcase app" below)
    globals.css   # YODY theme entry (imports colors_and_type.css + tailwindcss + tw-animate-css)
    layout.tsx    # data-surface="app" + Be Vietnam Pro font variable
    page.tsx      # / — Intern program cover (hero + stats + CTA → /sessions)
    error.tsx / loading.tsx / not-found.tsx
    roadmap/        page.tsx          # /roadmap
    sessions/       page.tsx          # /sessions (14-session index)
      [code]/       page.tsx          # /sessions/[code] (session detail + TOC)
        print/      page.tsx          # /sessions/[code]/print (print layout)
    badges/         page.tsx          # /badges
    mock-showcase/  page.tsx          # /mock-showcase (learners / gates / scorecards)
  components/
    ui/           # 47 shadcn components, YODY-branded via tokens — DO NOT lint
    shell/        # App shell (Server Components): site-header, sidebar, footer, print-layout, print-toolbar, index
    markdown/     # Markdown renderer: markdown.tsx (react-markdown + remark-gfm + rehype-slug/autolink), toc.tsx, prose.css
  hooks/
    use-mobile.ts # shadcn hook — DO NOT lint
  lib/
    fonts.ts      # next/font/local Be Vietnam Pro (weights 400/500/600/700 + italic 400)
    utils.ts      # cn() — clsx + tailwind-merge
    content/      # Content layer (build-time only): sessions.ts, root-docs.ts, canonical.ts, index.ts
  styles/
    colors_and_type.css  # YODY foundation tokens (brand, accents, surfaces, type, motion) — source of truth
public/
  fonts/          # Be Vietnam Pro .ttf (self-hosted)
components.json   # shadcn config (style: new-york, css: src/app/globals.css, aliases @/*)
```

## Showcase app (Intern Product Builder)

The `app/` is the live showcase for the **YODY Intern Product Builder Course**. Content lives outside the Next.js app, at the monorepo root `../docs/idea/`, and is read **at build time only** (Server Components / SSG — no runtime fs).

### Content layer — `src/lib/content/`

Single import surface for routes. Barrel `index.ts` exports 5 typed, `cache`-memoised readers (+`listScorecards`):

- `getContent(kind, id)` — generic resolver for `"session" | "root-doc" | "canonical"`
- `listSessions()` — 14 sessions from `docs/idea/Intern-Product-Builder/`
- `listBadges()` / `listLearners()` / `listGateEvidence()` / `listScorecards()` — read `docs/idea/_mock-data/*.json` (Phase 1c owns those files; this lib only READS them)

FK contract: `sessionCode` (`^I[1-5]\.[1-3]$`, validated before any fs touch — path-traversal guarded) is the only stable id exposed; underlying file paths are never leaked. Read-only module.

### Markdown renderer — `src/components/markdown/`

`<MarkdownView source=…>` — Server Component, RSC-safe (synchronous `react-markdown@10`, no async plugins). Pipeline: `remark-gfm` (tables, task lists) → `rehype-slug` (heading ids) → `rehype-autolink-headings` (anchor links for TOC). Styled via the `yody-prose` class in `prose.css` (token colors only). `<Toc>` builds a sidebar TOC from the same heading ids.

### Routes (7, all static-prerendered)

`/` · `/roadmap` · `/sessions` · `/sessions/[code]` · `/sessions/[code]/print` · `/badges` · `/mock-showcase` — 36 static pages at build. `params` is a `Promise` in Next 15+/16; route handlers `await params`.

### Markdown deps (added Phase 2a)

`react-markdown@10`, `remark-gfm@4`, `remark-parse@11`, `unified@11`, `rehype-slug@6`, `rehype-autolink-headings@7`, `github-slugger@2`, `@types/mdast@4` (see Pinned deps below for the `--legacy-peer-deps` rule).

## Non-negotiable rules (YODY DS)

- **Use tokens, never raw hex.** `bg-primary` / `bg-brand`, `text-foreground` / `text-muted-foreground` / `text-fg-2`. Accents from `--brand · --iris · --gold · --mint · --rose · --gap` (+ tint/deep).
- **Type scale is tokenized** — `text-h1 / text-body / text-eyebrow / text-label`, never arbitrary `text-[Npx]`.
- **Gold is decoration only** (logo, one climax moment / page). Never gold text or buttons.
- **No emoji.** Status = tag pills (`LIVE / BUILD / GAP / PLAN`) via `<Badge variant="live">`.
- **A11y floor:** visible focus ring, tap target ≥ 44px, honor `prefers-reduced-motion`.
- **Light is default;** dark mode opt-in via `.dark`.

## Pinned deps (DS compatibility)

Vendored DS components target older majors; pinned with `--legacy-peer-deps`:

- `react-day-picker@8.10.1` (v9+ removed `caption` / `IconLeft` classNames)
- `recharts@2.15.0` (v3 changed `Tooltip` payload typing)
- `react-resizable-panels@2.1.7` (v4 removed `PanelGroup` namespace export)

Keep `--legacy-peer-deps` when adding packages that peer-react < 19.

## Source

DS vendored from `../nta-test/design-system/` (gitignored at repo root). To refresh, re-copy `registry/ui/*.tsx`, `registry/lib/utils.ts`, `registry/hooks/use-mobile.ts`, `colors_and_type.css`, `tailwind/globals.css`.