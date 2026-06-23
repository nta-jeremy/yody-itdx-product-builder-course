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
  app/            # Next.js App Router
    globals.css   # YODY theme entry (imports colors_and_type.css + tailwindcss + tw-animate-css)
    layout.tsx    # data-surface="app" + Be Vietnam Pro font variable
    page.tsx      # demo: Button / Card / Badge (YODY-branded)
  components/
    ui/           # 47 shadcn components, YODY-branded via tokens — DO NOT lint
  hooks/
    use-mobile.ts # shadcn hook — DO NOT lint
  lib/
    fonts.ts      # next/font/local Be Vietnam Pro (weights 400/500/600/700 + italic 400)
    utils.ts      # cn() — clsx + tailwind-merge
  styles/
    colors_and_type.css  # YODY foundation tokens (brand, accents, surfaces, type, motion) — source of truth
public/
  fonts/          # Be Vietnam Pro .ttf (self-hosted)
components.json   # shadcn config (style: new-york, css: src/app/globals.css, aliases @/*)
```

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