# Studio feature QA — 2026-11-25

## Release state

**Not release-approved. No commit, push, Vercel preview deployment or production deployment performed.** Working branch: `arena/9fcad369-linacre-site`. Git origin is `DLinacre/linacre.site`; the requested LIN4CRE destination needs confirmation before push. The local built-site preview is not a Vercel deployment and does not establish Vercel header behavior.

## Executed checks

- `npm ci`: passed using the checked-in lockfile.
- `npm run verify`: passed content validation, TypeScript, lint and **195 tests in 20 files**. Lint retains **160 warnings, zero errors**; warnings are not suppressed globally.
- Content: **79 records, zero errors, 36 warnings**. These warnings remain visible in validation output.
- Final `npm run build`: passed; **103 prerendered routes, 51 sitemap URLs**. Historical unreviewed project pages are intentionally noindex, explaining the smaller sitemap.
- `scripts/test-portfolio.mjs`: passed homepage and Projects at 1440×900, 1024×768, 768×1024, 390×844 and 360×800. No horizontal overflow, page exceptions or automated axe violations on these two routes; empty-state/reset/list controls passed. All 15 curated project details passed direct entry and reload.
- Game browser rerun logged desktop/touch launches, fullscreen/exit for eight originals and catalogue/details at 320/390 widths. The encompassing shell timed out before a final exit status was collected: **partial evidence, not a complete rerun pass**. Earlier complete Games evidence is retained in GAME_VERIFICATION.md.
- Publisher fixture and authentication tests are included in the 195-test total. Native Windows PowerShell is unavailable: wrappers have **not** been run on Windows 11.

Reproduction: `CHROMIUM_PATH=/path/to/chromium PORTFOLIO_BASE_URL=http://localhost:4174 node scripts/test-portfolio.mjs` against `npm run preview -- --host 0.0.0.0 --port 4174`. Restricted-runtime browser libraries were supplied via LD_LIBRARY_PATH locally. Generated screenshots and JSON results remain ignored under `.cache/qa/`.

## Outstanding before preview sign-off

- Confirm intended remote and Vercel Git integration, then deploy only this feature branch and record exact SHA/deployment ID/URL.
- Full deployed-route, asset, security-header and published-game CSP checks, including an actual fixture build on Vercel.
- Finish comprehensive keyboard/manual visual review, all-route accessibility, missing-media/history and external-action checks. Automated checks do not establish WCAG conformance.
- Improve homepage image discovery/delivery and rerun performance checks; current mobile LCP is not acceptable for a performance sign-off.
- Review 13 moderate dependency advisories and 160 lint warnings; no high/critical advisories in the recorded audit.
- Native Windows 11 publisher execution and manual review of overwrite/backup workflows.
- Review all changed files for secrets before committing; no exhaustive secret-scan certification is claimed here.
- Production contact intentionally returns 503 until reliable delivery is configured. Dashboard login requires configured credentials; unverified Google assertions cannot mint sessions.

Production remains gated on explicit approval of an actually deployed, reviewed preview SHA. No production domains, environment settings, billing or deployment protection were changed.
