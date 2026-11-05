# Project: linacre.site Enhancements, Developer Tools, Tabulous Games & Verification

> **2026-11-04 status note:** The following is historical planning, not a verified
> current inventory, delivery commitment, playability guarantee, or instruction
> to push directly to `main`. Revalidate links, project status and ownership
> before presenting them as facts. See [AUDIT.md](AUDIT.md) and [README.md](README.md)
> for current verification, build and deployment guidance.

## Architecture
- **Framework**: React 19 + TypeScript 5.8 + Vite 6
- **Styling**: Tailwind CSS 4.1 + modern glassmorphism design tokens
- **Prerender & SEO**: Node.js static HTML prerenderer (`scripts/prerender.mjs`) emitting 15 static route snapshots with Schema.org JSON-LD graphs and sitemap validation
- **Backend API**: Node.js / Express 4.21 server with esbuild bundling (`api/server.ts` -> `dist/server.js`) and Vercel serverless adapter
- **Tabulous Games**: Standalone zero-latency portal (`dist/games/index.html`) featuring 77 instant-play browser games + 7 built-in Linacre original games + new Neon Dodger arcade game
- **Developer Tools**: Modular zero-telemetry client-side utilities (`QuickTools.tsx`, `EverydayTools.tsx`, `DevPlayground.tsx`, `Toolkit.tsx`) + MCP server (`mcp/`)
- **Automated Verification**: Vitest test runner, TypeScript typecheck (`tsc --noEmit`), ESLint, and production prerender validation

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Restore Missing Route Hydration in App.tsx | Mount `Lab`, `IdentityHub`, `OpsHUD`, `MobDealsSwitcher`, and `PokeGuruExplorer` via `React.lazy` to eliminate blank hydration screens | M1 | explorer_survey_arch |
| 2 | Dynamic Route Title & SEO Sync | Mount `RouteHead.tsx` in `App.tsx` to update document.title, canonical URL, and meta tags across SPA tab changes | M1 | explorer_survey_arch |
| 3 | WCAG Accessibility & Landmark Fixes | Restore skip-to-content link `<a href="#main-content" ...>` and `<main id="main-content">` landmark | M1 | explorer_survey_arch |
| 4 | Express Server Route Consistency | Add `/ops` to `VALID_ROUTES` in `api/server.ts` and serve `dist/games/index.html` on `/games` | M1 | explorer_survey_arch / explorer_survey_pipeline_tests |
| 5 | Deduplicate Server Icon Generator Route | Consolidate duplicate `POST /api/generate-icon` handlers in `api/server.ts`, integrating procedural SVG fallback into guarded endpoint | M1 | explorer_survey_pipeline_tests |
| 6 | Copy & Showcase Metric Harmonization | Align `siteProjects.ts` and `route-meta.json` with verified 77 instant games (+ built-in originals) | M1 | explorer_survey_arch |
| 7 | Expand Navigation & Footer Links | Ensure all prerendered sub-applications (`/lab`, `/identity`, `/ops`, `/privacy`, `/accessibility`) are discoverable in nav/footer | M1 | explorer_survey_arch |
| 8 | Index 7 Built-In Games in Tabulous Games Portal | Add `circuit`, `decrypt`, `gridlock`, `mines`, `pulse`, `tiles`, `trigger` to `games.json` with `LINACRE ORIGINAL · BUILT-IN` badge and local routing | M2 | explorer_survey_games_tools |
| 9 | New Retro Arcade Game: Neon Dodger | Fast-paced Canvas 2D + Web Audio arcade dodge-and-dash game with particles, screen shake, touch/keyboard, and high-score persistence | M2 | explorer_survey_games_tools |
| 10 | Unify Audio Preferences Across Games | Use shared `linacre_audio_enabled` localStorage key across all built-in games and portal | M2 | explorer_survey_games_tools |
| 11 | Fix Legacy Gamepage Game Count | Correct hardcoded `Total games: 2` count in `gamepage.html` | M2 | explorer_survey_games_tools |
| 12 | cURL to Code Converter Tool | Add interactive converter supporting cURL -> Fetch / Axios / Python requests in developer tools | M3 | explorer_survey_games_tools |
| 13 | SQL Beautifier & Formatter Tool | Add client-side SQL syntax formatter with keyword indentation and minification in developer tools | M3 | explorer_survey_games_tools |
| 14 | Visual Code Diff Inspector Tool | Add side-by-side / unified text and code diff comparison tool with insertion/deletion highlights | M3 | explorer_survey_games_tools |
| 15 | Unit Tests for Pure Utility Modules | Author comprehensive Vitest suites for `colorTools.ts` and `markdown.ts` | M4 | explorer_survey_pipeline_tests |
| 16 | Unit Tests for React Custom Hooks | Author comprehensive Vitest suites for `useOnlineStatus`, `useIdleFlag`, `useKonamiUnlock`, and `useCommandPaletteShortcut` | M4 | explorer_survey_pipeline_tests |
| 17 | Unit Tests for Developer Tools | Author comprehensive Vitest suites for `QuickTools.tsx` and `EverydayTools.tsx` covering all converters, hashers, and generators | M4 | explorer_survey_pipeline_tests / explorer_survey_games_tools |
| 18 | Full E2E Test Suite Validation & Adversarial Audit | Validate 100% passing E2E test suite, TypeScript typecheck, production build & prerender validation, and Forensic Integrity Audit | M5 | orchestrator |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Core Navigation, Routing & Server Integrity | Fix App.tsx route hydration, RouteHead, skip link, server routes (/ops, /games, icon dedup), copy harmonization | none | IN_PROGRESS |
| M2 | Tabulous Games Enhancements & Neon Dodger | Feature 7 built-in games in portal, build Neon Dodger canvas game, unify audio persistence, rebuild catalog | M1 | PLANNED |
| M3 | Advanced Developer Tools Suite Expansion | Build cURL converter, SQL formatter, and Visual Diff tools in developer workstations | M1 | PLANNED |
| M4 | Automated Unit & Tool Test Suite Hardening | Comprehensive Vitest tests for colorTools, markdown, custom hooks, and QuickTools/EverydayTools | M2, M3 | PLANNED |
| M5 | Final E2E Verification & Forensic Integrity Audit | 100% E2E test suite pass, zero TypeScript diagnostics, clean production prerender build, forensic audit pass | M4 | PLANNED |

## Interface Contracts

### Navigation & Routing Contract (`src/App.tsx` ↔ `src/config/routes.ts`)
- All tabs in `ROUTE_TAB_IDS` must have corresponding view representations in `App.tsx` (using `React.lazy` with `<Suspense>` for non-home sub-apps).
- `tabToPath(tab)` must map to matching `route-meta.json` entry for `RouteHead` document.title and metadata synchronization.
- Skip link must point to `#main-content`, and `<main>` landmark must have `id="main-content"`.

### Express Server Contract (`api/server.ts` ↔ Static Assets)
- `VALID_ROUTES` must include `/ops` alongside all indexable routes.
- Request path `/games` and `/games/` must directly serve `dist/games/index.html` without fallback redirect.
- `POST /api/generate-icon` must have input guard and rate limiter, falling back to procedural SVG generation on Gemini failure.

### Tabulous Games Catalog Contract (`public/games/games.json` ↔ `scripts/build-games.mjs`)
- Built-in games must have `url: "/games/<name>"`, `badge: "BUILT-IN"`, and valid metadata.
- `build-games.mjs` must index built-in games at the top of the portal with `LINACRE ORIGINAL · BUILT-IN` pill.
- Built-in games must adhere to shared localStorage audio toggle key `linacre_audio_enabled`.

### Code Layout
- `src/App.tsx`: Main SPA router, layout, header, footer, skip link
- `src/components/`: Reusable UI components, sub-applications (`Lab.tsx`, `IdentityHub.tsx`, `OpsHUD.tsx`, `QuickTools.tsx`, `EverydayTools.tsx`, `DevPlayground.tsx`)
- `src/hooks/`: Custom React hooks (`useOnlineStatus.ts`, `useIdleFlag.ts`, etc.)
- `src/lib/`: Pure utility functions (`colorTools.ts`, `markdown.ts`, `audioEngine.ts`)
- `public/games/`: Standalone games (`circuit.*`, `decrypt.*`, `gridlock.*`, `mines.*`, `pulse.*`, `tiles.*`, `trigger.*`, `dodger.*`, `index.html`, `games.json`)
- `api/server.ts`: Production Express server and Vercel serverless API
- `scripts/`: Build and prerender tooling (`build-games.mjs`, `prerender.mjs`, `write-ops-status.mjs`)
