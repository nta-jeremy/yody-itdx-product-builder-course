# Deployment

## Platform: Vercel

Self-contained Next.js 16 project. The entire `app/` directory (including `content/`) deploys as a single Vercel project — no monorepo configuration needed.

## URL

- **Production (aliased):** https://app-plum-three-64.vercel.app
- **Project dashboard:** https://vercel.com/tunganh252s-projects/app
- **Account/team:** `tunganh252` / `tunganh252's projects` (Hobby plan)

## Deploy Command

Run from the `app/` directory (project root for Vercel):

```bash
cd app
vercel deploy --prod --yes
```

First-time flags:
- `--prod` — deploy to production (omit for preview)
- `--yes` — accept all defaults (skip interactive prompts on first deploy)

## Architecture note (why content lives inside `app/`)

The content layer (`src/lib/content/`) reads markdown + JSON from the filesystem **at build time only** (Server Components / SSG, no runtime fs). Originally the content lived at `../docs/idea/` (monorepo root) — this broke single-project Vercel deploys because the build context didn't include the parent directory. The content was moved into `app/content/idea/` so the project is self-contained.

All five reader files (`sessions.ts`, `learner.ts`, `root-docs.ts`, `canonical.ts`, `index.ts`) reference `resolveAppRoot()` (3 hops up from `app/src/lib/content/sessions.ts` → `app/`) — see `app/src/lib/content/`.

## Environment Variables

None. The app is fully static (SSG) and reads only from `app/content/idea/`. No runtime secrets, no API keys, no database.

## Custom Domain

Not configured. To add:
1. Vercel dashboard → Project → Settings → Domains
2. Add domain (e.g. `yody-course.yody.vn`)
3. Configure DNS per Vercel's instructions (A/CNAME records)
4. SSL auto-provisioned by Vercel

## Build Configuration

Vercel auto-detects Next.js 16. Defaults used:
- **Install command:** `npm install` (honors `.npmrc` → `legacy-peer-deps=true`)
- **Build command:** `npm run build` (= `next build`)
- **Output directory:** `.next` (Next.js default)
- **Node version:** 24.x
- **Framework:** nextjs (auto)

### `app/.npmrc`

```
legacy-peer-deps=true
```

Required because the project pins older majors of `react-day-picker`, `recharts`, `react-resizable-panels` (see `app/CLAUDE.md` → "Pinned deps"). Without this, `npm install` fails on React 19 peer-dep conflicts.

## Routes (52 static pages)

All routes are pre-rendered at build time (SSG):

| Route | Type | Source |
|---|---|---|
| `/` | Static | `src/app/page.tsx` |
| `/roadmap` | Static | `src/app/roadmap/page.tsx` |
| `/sessions` | Static | `src/app/sessions/page.tsx` |
| `/sessions/[code]` | SSG (14) | `src/app/sessions/[code]/page.tsx` |
| `/sessions/[code]/print` | SSG (14) | `src/app/sessions/[code]/print/page.tsx` |
| `/learn` | Static | `src/app/learn/page.tsx` |
| `/learn/[code]` | SSG (14) | `src/app/learn/[code]/page.tsx` |
| `/badges` | Static | `src/app/badges/page.tsx` |
| `/mock-showcase` | Static | `src/app/mock-showcase/page.tsx` |

> `/learn` + `/learn/[code]` are the learner-facing routes (reader: `src/lib/content/learner.ts`); `/sessions/*` remains the mentor view.

Verified live (HTTP 200) on production:
- `https://app-plum-three-64.vercel.app/`
- `https://app-plum-three-64.vercel.app/sessions/I1.1`
- `https://app-plum-three-64.vercel.app/roadmap`
- `https://app-plum-three-64.vercel.app/badges`

## Known Build Warnings

**NFT trace warning (Turbopack):**
```
Turbopack build encountered 1 warnings:
./next.config.ts
Encountered unexpected file in NFT list
A file was traced that indicates that the whole project was traced unintentionally.
Import trace:
  Server Component:
    ./next.config.ts
    ./src/lib/content/sessions.ts
    ./src/app/sessions/[code]/page.tsx
```

**Cause:** `sessions.ts` uses `fs.readFile` / `path.resolve` to read markdown from `app/content/idea/` at build time. Turbopack's Node File Tracing (NFT) flags this as a potential "trace the whole project" pattern.

**Impact:** None. Build succeeds, all 36 pages render correctly, content is bundled. The warning is informational.

**Resolution paths (if it ever becomes a problem):**
1. Add `turbopackIgnore` comments to path operations
2. Switch to `import { readFile } from 'next/og'` (not applicable — different use case)
3. Use a build plugin to scope the trace (`path.join(process.cwd(), 'content', bar)`)
4. Migrate to `output: 'export'` for true static export (Phase 2c work — see `sessions.ts` header)

## Rollback

Vercel keeps all deployments. Two ways to roll back:

**Option 1 — Vercel dashboard:**
1. https://vercel.com/tunganh252s-projects/app → Deployments
2. Find a previous successful deployment
3. Click ⋮ menu → "Promote to Production"

**Option 2 — CLI:**
```bash
vercel rollback https://app-plum-three-64.vercel.app
```

## Re-deploy (typical workflow)

After local changes in `app/`:

```bash
cd app
npm run compile          # verify build first (optional but recommended)
vercel deploy --prod --yes
```

Vercel will rebuild + redeploy in ~30-60s.

## Cost

- **Vercel Hobby plan** (free tier): 100 GB bandwidth/month, 6,000 build minutes/month
- Hobby plan: non-commercial / personal use only
- For production/commercial use, upgrade to Pro plan ($20/month)
