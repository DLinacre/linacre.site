# linacre-site-repo — Agent Instructions

## Current operational guidance (2026-11-04)

Use the repository checkout and the user's branch instructions; do not assume a
Windows filesystem or deploy directly to production. Preserve local changes,
review any generated files, never add secrets, and confirm deployment health on
an accessible preview before promotion. The production API has returned 404 and
current security fixes are not verified live. Read `AUDIT.md` and
`docs/2026-11-04-hardening.md` before changing integrations or authentication.

`npm ci`, `npm run verify`, `npm run build`, then run the documented browser
smoke test against the built server. `games:build` updates source files; regular
builds generate games only in `dist`. External game links, actual email delivery,
and accessibility conformance require separate verification.

## Historical context (review against the current repository)

## What This Is

The developer portal, private browser toolbox, and app launcher for the **Linacre** ecosystem, deployed to www.linacre.site.

## Structure

```
api/
  server.ts            (Express API backend)
src/
  App.tsx              (Vite React frontend & routing)
  components/          (Header, StartPage, Toolkit, Lab, Projects, DevPlayground, AgentsHub, IdentityHub, MobileBottomNav)
  lib/                 (design-system.ts, audioEngine.ts, emblemRenderer.ts)
public/
  favicon.svg          (Lucide cat favicon)
  manifest.json        (PWA manifest)
vercel.json            (API rewrites and CSP security headers)
```

## Rules & Workflows

- **Build Command:** `npm run build` (Compiles Vite React app + Node server and prerenders the configured static routes).
- **Local Dev Command:** `npm run dev` (Starts the configured local development workflow).
- **Deployment:** Verify an authorized preview and configuration before using the existing production deployment workflow.
- **Auto-deploy:** `.github/workflows/deploy.yml` deploys to Vercel on every push to `main` (and via manual dispatch) once `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` are set as GitHub repo secrets.
- **Verification:** Run `npm run build` and test `http://localhost:3000/`.
- **Secrets Workflow:** Centralized secrets via Windows Environment Variables & `.env` files. Every project includes `.env` protected by strict `.gitignore` rules (`.env`, `.env*`, `*.key`) so secrets are never pushed to Git/GitHub.

## Design System & Architecture

- **Navigation Architecture**: primary links for Projects, Tools, Games, Music Videos, Orbit, About and Contact and secondary pages grouped under **More** dropdown.
- **Mobile Usability**: Includes `MobileBottomNav` for responsive touch navigation on mobile viewports.
- **Flexible Visual Themes**: Supports dynamic HSL custom themes (e.g., CyberBlue-Green, Midnight Slate, Obsidian Dark, Neon Cyberpunk, or Light Mode). Themes are user-customizable and never set in stone.
