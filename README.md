<div align="center">

# linacre.site

**Developer portal, free browser toolbox, and project showcase.**

[![Live](https://img.shields.io/badge/live-www.linacre.site-22d3ee)](https://www.linacre.site)
[![CI](https://github.com/DLinacre/linacre.site/actions/workflows/ci.yml/badge.svg)](https://github.com/DLinacre/linacre.site/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)](tsconfig.json)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)](https://react.dev)
[![Tests](https://img.shields.io/badge/tests-18%20passing-brightgreen)](src/components/__tests__)
[![WCAG](https://img.shields.io/badge/WCAG_2.2_AA-0%20violations-success)](#accessibility)

**[www.linacre.site](https://www.linacre.site)** · [Tools](https://www.linacre.site/tools) · [Games](https://www.linacre.site/games) · [About](https://www.linacre.site/about)

</div>

---

## Overview

A React 19 single-page application with prerendered static routes, deployed on
Vercel. It serves three purposes:

1. **A free browser toolbox** — JSON, Base64, VAT, hashing, text and URL
   utilities that run entirely client-side. Nothing is uploaded anywhere.
2. **A project showcase** — live builds, downloadable releases, and inspectable
   source.
3. **A games hub** — playable browser games plus
   [Slime Factory Tycoon](https://github.com/DLinacre/slime-factory-tycoon), an
   open-source Roblox idle-tycoon.

---

## Quality bar

Everything below is measured on the live site, not estimated.

| Metric                         |            Value | Threshold |
| ------------------------------ | ---------------: | --------- |
| TypeScript errors (strict)     |            **0** | —         |
| Test suite                     |   **18 passing** | —         |
| axe-core WCAG 2.2 AA — mobile  | **0 violations** | 0         |
| axe-core WCAG 2.2 AA — desktop | **0 violations** | 0         |
| CLS — mobile                   |       **0.0155** | < 0.10    |
| CLS — desktop                  |       **0.0023** | < 0.10    |
| LCP                            |       **~1.0 s** | < 2.5 s   |
| TTFB                           |      **~150 ms** | < 800 ms  |

Reproduce with `npm run verify`, or see [Testing](#testing) for the browser
measurements.

---

## Tech stack

| Layer      | Choice                         | Why                                                                    |
| ---------- | ------------------------------ | ---------------------------------------------------------------------- |
| Framework  | React 19                       | Concurrent rendering, `useReducedMotion`, modern Suspense              |
| Language   | TypeScript 5.8, **strict**     | `strict`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitOverride` |
| Build      | Vite 7                         | Fast HMR, Rollup manual chunking                                       |
| Styling    | Tailwind CSS v4                | Vite plugin, no PostCSS config needed                                  |
| Animation  | Motion                         | Respects `prefers-reduced-motion` throughout                           |
| Testing    | Vitest + React Testing Library | Shares the Vite config; jsdom environment                              |
| Linting    | ESLint 9 flat config           | `typescript-eslint` + `react-hooks`                                    |
| Formatting | Prettier 3                     |                                                                        |
| Backend    | Express (bundled with esbuild) | Small API surface for contact and status                               |
| Hosting    | Vercel                         | Static output plus a Node function                                     |

---

## Getting started

**Requirements:** Node 22+ and npm.

```bash
git clone https://github.com/DLinacre/linacre.site.git
cd linacre.site
npm ci
npm run dev            # http://localhost:3000
```

### Scripts

| Script                  | Does                                                  |
| ----------------------- | ----------------------------------------------------- |
| `npm run dev`           | Vite dev server                                       |
| `npm run build`         | Vite build → prerender 22 routes → bundle the API     |
| `npm run preview`       | Serve the production build locally                    |
| `npm run typecheck`     | `tsc --noEmit` under strict mode                      |
| `npm run lint`          | ESLint                                                |
| `npm run lint:fix`      | ESLint with `--fix`                                   |
| `npm run format`        | Prettier write                                        |
| `npm run format:check`  | Prettier check (CI)                                   |
| `npm test`              | Vitest, single run                                    |
| `npm run test:watch`    | Vitest watch mode                                     |
| `npm run test:coverage` | V8 coverage report                                    |
| **`npm run verify`**    | **typecheck + lint + test — run this before pushing** |

---

## Architecture

```
linacre.site/
├── api/
│   └── server.ts              Express API (contact, status, proxies)
├── scripts/
│   ├── prerender.mjs          Static-renders 22 routes + sitemap.xml + llms-full.txt
│   └── agents/                Maintenance tooling
├── src/
│   ├── App.tsx                Shell: routing, theming, layout
│   ├── main.tsx               Entry point, service worker registration
│   ├── components/            Feature components, lazily loaded
│   │   ├── GameShowcase.tsx   Manifest-driven game showcase
│   │   └── __tests__/         Component tests
│   ├── lib/                   design-system, audioEngine, emblemRenderer
│   ├── data/                  Static content + synced game manifests
│   └── test/setup.ts          jsdom polyfills, per-test cleanup
├── public/                    Fonts, icons, game art
├── route-meta.json            Per-route SEO metadata
├── vercel.json                Headers, redirects, caching
└── vite.config.ts             Build, chunking, and Vitest config
```

### Design decisions worth knowing

**Prerendering over SSR.** `scripts/prerender.mjs` emits static HTML for 22
routes at build time. Crawlers get real content with no JS; users get an SPA
after hydration. No server rendering cost.

**Manual vendor chunks.** React and Motion are split into long-cached chunks, so
shipping app code doesn't invalidate a ~96 KB Motion download.

**Route-level code splitting.** Every page is `React.lazy`. The Suspense
fallback reserves `min-h-[100svh]` — without that reservation the footer paints
high and drops on hydration, which previously caused a **0.42 CLS on every
page**.

**Self-hosted variable fonts.** Three families, `unicode-range` subset into
latin/latin-ext, `font-display: swap`, preloaded, immutable cache headers. No
third-party font requests.

---

## Accessibility

Verified with axe-core against WCAG 2.0/2.1/2.2 A **and** AA at 390 px and
1440 px: **0 violations, 27 passing checks** on both.

- Full ARIA tabs pattern — `tablist` container, `aria-controls` ↔
  `aria-labelledby` wiring, roving `tabindex`, arrow-key navigation
- 44 px minimum touch targets
- `prefers-reduced-motion` honoured throughout
- Opaque surfaces behind text, so contrast is deterministic rather than
  dependent on whatever scrolls underneath
- Semantic landmarks, skip link, visible focus rings

The tabs contract is covered by tests, so the fix can't silently regress.

---

## Testing

```bash
npm test                  # 18 tests
npm run test:coverage     # V8 coverage
```

The `GameShowcase` suite encodes the project's **honesty guarantees as
executable contracts**:

- No fabricated player, visit, download, or rating figures
- Honest empty states — "Coming Soon" rather than placeholder imagery
- The Play CTA stays disabled until the game is genuinely published
- Structured data contains no invented `aggregateRating` or `offers`

If someone later adds a fake metric, CI fails. The rule stops being a
convention and becomes something the build enforces.

Browser-level checks (axe-core, Core Web Vitals) are run with Playwright
against the live deployment — see the audit in the
[game repository](https://github.com/DLinacre/slime-factory-tycoon/tree/main/audit).

---

## Deployment

Auto-deploys from `main` via the Vercel GitHub integration. No manual step.

```bash
# Manual deploy, if ever needed
npx vercel deploy --prod --yes
```

`vercel.json` sets the security headers and caching:

| Header                      | Value                                                                           |
| --------------------------- | ------------------------------------------------------------------------------- |
| `content-security-policy`   | `default-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`             |
| `strict-transport-security` | `max-age=63072000; includeSubDomains; preload`                                  |
| `permissions-policy`        | camera, mic, geolocation, payment, USB, sensors, `interest-cohort` all disabled |
| `x-frame-options`           | `DENY`                                                                          |
| `referrer-policy`           | `strict-origin-when-cross-origin`                                               |

Hashed assets are `immutable, max-age=31536000`; HTML is `must-revalidate`.

### Environment variables

All optional — the site builds and runs without them. Absent keys disable
their feature rather than breaking the build.

| Variable                            | Purpose               |
| ----------------------------------- | --------------------- |
| `GEMINI_API_KEY`                    | AI assistant          |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | API rate limiting     |
| `RESEND_API_KEY`                    | Contact form delivery |

---

## Contributing

```bash
npm run verify     # must pass before opening a PR
```

1. Keep TypeScript strict — no new `any` without a comment explaining why.
2. Any UI change needs a mobile (390 px) check.
3. Accessibility regressions are treated as bugs, not polish.
4. Comments should explain _why_, not _what_.

---

## Troubleshooting

**`npm run dev` fails on a fresh clone** — you need Node 22+. Check with
`node -v`.

**Tests fail with `matchMedia is not a function`** — you're outside the Vitest
environment. Run `npm test`, which loads `src/test/setup.ts`.

**Build succeeds but a route 404s in preview** — routes are prerendered at build
time. Add the path to `scripts/prerender.mjs` and `route-meta.json`.

**Fonts flash on first load** — expected. `font-display: swap` is deliberate;
blocking paint on a font download is worse.

**Playwright can't launch Chromium on Linux** — install system libraries:
`sudo apt-get install -y libnspr4 libnss3 libasound2t64`.

---

## License

MIT — see [LICENSE](LICENSE).
