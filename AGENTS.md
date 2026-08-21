# linacre-site-repo — Agent Instructions

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

- **No Artificial Limits** — Use any free tool, any format, any license. Constraints: hardware specs (RTX 3070 Ti, 64GB RAM, D: canonical storage at `D:\DLinacre`) and free/open-source tools.
- **Single Source of Truth** — All active repositories live under `D:\DLinacre\`. Desktop app shortcuts are populated at `C:\Users\KingL\Desktop` for 1-by-1 execution and testing.
- **Build Command:** `npm run build` (Compiles Vite React app + Node server and prerenders 22 static routes).
- **Local Dev Command:** `npm run dev` (Runs Vite dev server on port 3000).
- **Deploy Command:** `vercel deploy --prod --yes --project linacre-site-repo --force`
- **Auto-deploy:** `.github/workflows/deploy.yml` deploys to Vercel on every push to `main` (and via manual dispatch) once `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` are set as GitHub repo secrets.
- **Verification:** Run `npm run build` and test `http://localhost:3000/`.
- **Secrets Workflow:** Centralized secrets via Windows Environment Variables & `.env` files. Every project includes `.env` protected by strict `.gitignore` rules (`.env`, `.env*`, `*.key`) so secrets are never pushed to Git/GitHub.

## Design System & Architecture

- **Navigation Architecture**: 6 primary items (**Start**, **Tools**, **Projects**, **Playground**, **About**, **Contact**) and secondary pages grouped under **More** dropdown.
- **Mobile Usability**: Includes `MobileBottomNav` for responsive touch navigation on mobile viewports.
- **Flexible Visual Themes**: Supports dynamic HSL custom themes (e.g., CyberBlue-Green, Midnight Slate, Obsidian Dark, Neon Cyberpunk, or Light Mode). Themes are user-customizable and never set in stone.
