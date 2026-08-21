# Linacre.site — Site Audit

Date: 2026-08-21
Auditor: Arena.ai agent (on behalf of David Linacre)
Scope: https://www.linacre.site (live) vs. `DLinacre/linacre.site` @ `main`

---

## TL;DR

The site's code is healthy — but the **live deployment is stale**, and that
single fact accounts for every visible problem. There is **no auto-deploy**:
`main` is only type-checked/linted/tested/built by GitHub Actions and is then
deployed **manually** (`vercel deploy --prod`).

> **Fix:** deploy the current `main` (or add the Vercel credentials so pushes
> deploy automatically). No code changes are required to fix the bugs below.

---

## 1. Root cause: stale / manual deployment

- `AGENTS.md` documents the deploy as a **manual command**:
  `vercel deploy --prod --yes --project linacre-site-repo --force`.
- `.github/workflows/ci.yml` runs *Typecheck → Lint → Test → Build* and uploads
  a `dist` artifact. It has **no deploy step**.
- On the latest commit there is exactly **one** check run — GitHub Actions —
  and **no Vercel check**, confirming Vercel is not connected for auto-deploys.

### Evidence of drift (live vs. `main`)

| Item | Live site | `main` branch |
|---|---|---|
| `/tools` | **404** | Correctly defined in `route-meta.json` + `vercel.json` |
| "Low Stakes Guide" card | Still shown | Removed (0 references; `/low-stakes → /` redirect) |
| Games hub (12 games) | Not visible | Added in `31f7b60` |
| Project showcase upgrade | Not visible | Added in `186851a` |

Each discrepancy is resolved by deploying the current `main` — nothing needs to
be re-coded.

---

## 2. What's healthy ✅

- **External links** — all 70 project/repo URLs in `siteProjects.ts` +
  `Games.tsx` return HTTP 200.
- **Sitemap** — `sitemap.xml` has 23 URLs, all 200.
- **SEO head** — title, meta description, canonical, `robots`, 10× Open Graph,
  4× Twitter Card, JSON-LD, hreflang, and `lang="en-GB"` all present.
- **Machine-readable files** — `robots.txt`, `llms.txt`, `llms-full.txt`,
  `skills.txt`, `humans.txt`, `security.txt` (`/.well-known/`), `manifest.json`
  all present and 200.
- **Error handling** — custom 404 page works for unknown routes.
- **Performance** — ~610 KB total JS/CSS (4 hashed bundles), og.png 62 KB,
  icons 11 KB / 4 KB. Reasonable for a React 19 SPA.
- **CI health** — typecheck, lint, tests, and production build all pass on
  `main`.

---

## 3. Prioritised fix list

1. **Deploy current `main`** *(highest impact, no code needed)*
   - Fixes the `/tools` 404.
   - Ships the games hub + project showcase upgrade.
   - Removes the stale "Low Stakes Guide" card.
   - Puts the new PixelPoke Arena project live.

2. **Enable auto-deploy** *(prevents recurrence)*
   - `deploy.yml` has been added (Vercel action, gated on secrets being present).
   - Requires 3 GitHub secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`,
     `VERCEL_PROJECT_ID` (from the Vercel dashboard → project → Settings →
     General, and a token from Settings → Tokens).

3. **Optional hardening** *(no action needed, listed for completeness)*
   - `src/components/Lab.tsx` (3101 lines), `DevPlayground.tsx` (2636),
     `AgentsHub.tsx` (2154), `IdentityHub.tsx` (1453) are large and would
     benefit from splitting — see `REFACTOR_REPORT.md`.
   - Non-failing Vite warning about `audioEngine.ts` dual static/dynamic import.

---

## 4. Actions taken this session

- Added **PixelPoke Arena** to `src/data/siteProjects.ts` (kind `Game`, `NEW`
  badge) linking to the GitHub release.
- Added a 2:1 pixel-art banner `public/banners/pixelpoke-arena.webp`.
- Added `.github/workflows/deploy.yml` (auto-deploy via Vercel, gracefully
  skipped when secrets are absent).
- Updated `AGENTS.md` to document the new deploy path.
- All changes pushed to `main`; CI verified green.
