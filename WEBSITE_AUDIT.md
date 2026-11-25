# LIN4CRE website audit

**Audit date:** 25 November 2026 (UTC)  
**Mode:** research and reporting only; no application, configuration or historical-content edits, deployments, commits or deletions.  
**Workspace:** `DLinacre/linacre.site`, branch `arena/9fcad369-linacre-site`, baseline `d9b98a0084eff3a11a750f604cb658e54b95aaeb`.

## Executive finding

LIN4CRE has substantial actual work, including self-contained browser games, browser applications, Windows utilities and Android releases. The principal problem is **not a lack of projects**. It is incompatible source/deployment generations, unreliable product claims, and a public presentation dominated by directories and personal dashboards.

**Do not simply deploy this checkout.** It is not the source currently presented at www.linacre.site, nor the latest source on the LIN4CRE fork. Its JavaScript replaces route-specific static pages with the same personal mission-control dashboard. It also retains serious source-level authentication defects. The latest LIN4CRE main contains a subsequent editorial curation and hardening pass, but that main is not the production deployment either.

Recommended destination: a studio site with two genuine first-class sections, **Games** and **Projects**, backed by one evidence-bearing catalogue. Preserve historical material in repositories, but stop presenting third-party games as the studio's original releases. A small verified public selection can coexist with a larger accurately labelled inventory; downloads and unfinished work should not be excluded merely because they are not browser apps.

Companion reports:
- [GAME_INVENTORY.md](GAME_INVENTORY.md): seven local games, 20 associated game/game-development repositories and all 77 legacy external directory entries.
- [PROJECT_INVENTORY.md](PROJECT_INVENTORY.md): 69-row local catalogue crosswalk, 92 other public repositories, local subprojects, release assets and missing information.
- [REBUILD_PLAN.md](REBUILD_PLAN.md): evidence-led stages and approval/release gates; no redevelopment started.

## 1. Method, coverage and limits

### Inspected

- Live homepage, `/projects` redirect destination, `/games` directory, selected individual game routes and `/helix`; public external application/game pages listed in section 8.
- Entire tracked source tree by path, active React import graph, route/metadata registries, manifests, project/game data, local static games, image directories, package/lock/configuration files, scripts, GitHub/GitLab workflows, API, README, AUDIT.md, REFACTOR_REPORT.md and MCP package.
- Both accounts' complete **public** repository listings: **54 LIN4CRE + 58 DLinacre = 112**. Retrieved recursive trees, README content where available and up to 10 releases each. The recursive tree responses were not truncated. This is comprehensive discovery, **not a line-by-line code review of 112 codebases**.
- Read-only current LIN4CRE website source, including `curatedWork.ts`, live-library data, Games/StartPage/App, Vercel config and November historical curation/hardening documents. No branch switch or source import into the working tree.
- Vercel project/domain/deployment metadata and DNS configuration using the connected Vercel account. No secret values were decrypted or copied into these reports; no configuration changed.
- Local dependency installation, typecheck, lint, tests, production build, separate MCP build/harness and dependency advisory checks.
- Local production-build Chromium smoke tests at 1440px and 390px widths; `/`, `/games`, `/about`, `/tools`; seven standalone game HTML boot checks. Temporary browser tooling, screenshots and research data stayed outside tracked files.

### Verification language

“Retrieved” is an HTML/UI-text availability observation, not proof that a game can be completed or an application performs its advertised function. A release asset listed by GitHub is not an installation test. A repository's self-description is not certification. “Unknown” means unestablished, not abandoned or broken.

Live browser pixel captures and interaction testing were **not** performed: outbound sandbox network policy limits arbitrary website access. Live observations used page retrieval; local browser screenshots informed the local visual review. No Windows/Android binaries were executed, no user accounts created, no paid AI calls or contact emails sent, no remote authentication exploitation attempted. No Lighthouse/axe conformance measurements were newly established. Private/deleted/inaccessible/local Windows work and releases beyond the first 10 per repository may be missing.

## 2. Three distinct generations, not one stale copy

| Surface | Evidence | Meaning |
|---|---|---|
| This checkout / DLinacre main | `d9b98a0…`, main commit date 2026-09-25; GitHub main SHA matches workspace baseline | Personal operating portal: ProjectRadar, audio, daily tools and rig tabs; 8 default cards |
| Latest LIN4CRE main | `c92645cdc3e2e16b69731fa53c1ff095d111727a`, 2026-11-05; GitHub identifies this repo as a fork of DLinacre/linacre.site | Later editorial studio curation, 5 selected projects, 4 selected games; broader 25-row legacy catalogue still preserved |
| Vercel production | `434be2a441bd46538b331a1b7ae21d4a0a4fa0b5`, LIN4CRE main metadata, deployed 2026-11-01 | Live 25-project library, interactive hub/observatory promotions and 77 third-party games |

These SHAs are different. Production does **not** represent the latest LIN4CRE main or this checkout. The latest preview is another older LIN4CRE feature-branch build, not either latest main. Do not describe DLinacre's older portal as simply a newer unreleased improvement to production.

### Verification of the previously reported problems

| Previously reported | Current finding |
|---|---|
| Two overlapping project catalogues | Confirmed and more extensive: local `siteProjects.ts` has 69 rows; active App uses separate 8-row `config/projects.json`; LIN4CRE main also has `curatedWork.ts` and a 25-row legacy catalogue |
| Legacy 77 third-party games | Confirmed live and in LIN4CRE `public/games/games.json`; **not present in this checkout's public/games** |
| Smaller curated original-games collection | Confirmed in LIN4CRE `curatedWork.ts`: Afterglow, Circuit, Decrypt, Gridlock. Local legacy catalogue instead has 14 Game rows, including a third-party wrapper |
| 23-entry project catalogue | **Not current**: 25 rows in LIN4CRE main and 25 on live home; local legacy catalogue 69; running local default cards 8 |
| `/projects` redirects home | Confirmed in local `vercel.json`; live retrieval of `/projects` resolves to homepage |
| Separate selected-work components | Confirmed in LIN4CRE main. This checkout instead retains unmounted FeaturedSpotlight/GameShowcase/ProjectGrid/StartPage components; no local `curatedWork.ts` |

## 3. Runtime and route audit — highest-impact technical defect

`src/main.tsx` calls `createRoot(...).render(<App />)`. Current App imports CyberHUD, ProjectRadar, CardManagerModal, CyberTerminal, CyberAudioPlayer, QuickToolsDeck and LocalRigDeck. It does **not** consume `src/config/routes.ts` or mount Games, StartPage, ProjectGrid, GameShowcase, About, Contact or the old shared Header/Footer.

Its state defaults to `projects` regardless of pathname. Tabs are local component state rather than shareable routes. All four tab panels remain mounted and are hidden with CSS. Therefore even hidden panel side effects run, including LocalRigDeck's visitor-localhost probes.

The build still prerenders **15 routes / 14 sitemap URLs** using `route-meta.json` and `SITE_PROJECTS`. Those semantic HTML pages do not represent the running application. Local browser tests confirm `/`, `/games`, `/about` and `/tools` all end up with **“ENGINEERED FOR EXCELLENCE”** and the same dashboard after JS loads. This is a functional navigation and content-integrity defect, not just SEO wording.

### Local route surfaces

| Paths | Source/configured handling | Actual caveat |
|---|---|---|
| `/` | Prerender + index app | Static project library is replaced with 8-card portal |
| `/tools`, `/games`, `/lab`, `/identity`, `/about`, `/contact`, `/contact/thanks`, `/privacy`, `/cookie-policy`, `/terms`, `/accessibility`, `/mob-deals`, `/pokeguru`, `/ops` | Metadata/prerender; most explicit Vercel rewrites; route registry | Registry not consumed by App; route UI not mounted. Four sampled routes independently reproduced, remaining same-App consequence established by source |
| `/games/{circuit,decrypt,pulse,trigger,tiles,mines,gridlock}` | Explicit rewrites to standalone HTML + JS | Can work independently of React. All seven `.html` builds boot locally without script errors; public Circuit/Decrypt/Gridlock HTML retrieved |
| `/helix`, `/helix/` | Rewrites to `public/helix/index.html` output | Independent static app; public UI retrieved |
| `/tools/*.html` | Standalone utility files | Separate from App; individually revalidate CSP/dependencies |
| `/projects`, `/projects/:path*` | Permanent redirect `/` | Directly conflicts with requested first-class Projects section; also discards detail-path intent |
| `/toolkit`, `/playground`, `/learn` | Redirect `/tools` | Preserve compatibility deliberately when restructuring |
| `/blog`, `/blog/:path*`, `/status`, `/dashboard`, `/low-stakes`, `/dkma` | Redirect `/` | Historical content not a current implemented destination |
| `/now` | Redirect `/about` | Current client UI does not implement About |
| `/agents` | Redirect `/lab` | Not evidence of a working public agent product |
| `/work`, `/book` | Redirect `/contact` | Must validate contact route/delivery before retaining calls to action |
| Unknown extensionless paths | Broad Vercel SPA fallback to index; route helper also defaults to home | Risk of soft 404s. A live unknown-route fetch failed without status detail, so live 404 semantics remain unverified |
| `/api/:path*` | Rewrite to `api/server.ts` | Vercel Node API, unavailable on static GitHub Pages |

`gamepage.html` and old static shell/error files are also retained at repository root/public. Keep them during audit, then map old inbound URLs before deciding public exposure. PWA shortcuts still target routes the App does not render; a manifest alone does not establish installation/offline quality.

## 4. Content/model audit

### Active local cards

`src/config/projects.json` supplies eight records with a separate ProjectCard schema, title/category/status strings and links. Examples needing correction:

- **OmniRoute-LLM** links to **Linacre-LLM-Benchmarks**, although a separate OmniRoute repository exists. The current Benchmarks README describes a public benchmark dashboard, not evidence of the card's gateway capabilities.
- “PRODUCTION”, “STABLE”, “0 Leaks”, “60 FPS”, version badges and “Poco F7 Tested” are assertions, not linked test results. Deasy card says v2.4 while inspected release metadata's latest listed tag is v1.5.0 containing a v1.1.0-named EXE.
- App says **“zero technical debt”**, HUD **“SYSTEM OPTIMAL”**, footer **“ALL SYSTEMS NOMINAL”** with no operational evidence. These should not be public reliability claims.
- “Manage Cards”, Edit and Delete change only the visitor's localStorage, not the published project catalogue. This is a personal start-page feature, not studio content management. Stored cards are only checked for nonempty-array shape, not schema validity.

### Legacy local catalogue

`siteProjects.ts`: **69 rows** = 19 App, 14 Game, 12 Tool, 7 Source, 6 AI, 6 DevOps, 5 Private. CubeLab repeats, so 68 unique names. Most entries have no explicit release stage or verification evidence. Years such as 2023/2024 are not established by the repository pushed timestamps and need owner confirmation.

`projectLibrary.ts` is a useful reusable separation: validates HTTP(S)/relative destinations, distinguishes source/release/artifact links, suppresses private actions, and supports category/access/text filtering. But release-URL detection cannot establish that a build file exists, nor whether it runs. `ProjectGrid` uses names as keys, causing real duplicate-key test warnings for CubeLab.

Five Private placeholders have no public build or source. FaceRater has no recorded repo, GuruAi-project returns API 404, MDT-kit returns access restriction. Mark unresolved; do not call private/inaccessible projects nonexistent.

### Game manifest and presentation drift

- Seven standalone local games contain genuine HTML/JS, not just external links.
- Slime Factory Tycoon manifest says **In development / not published to Roblox**, while other copy promises “production-ready”. Its `.rbxlx` is a real release asset, but a Studio template is not a published consumer game.
- GameShowcase comments incorrectly say screenshots empty and play URL null; JSON contains five screenshot paths and a Pages play URL. The component's own claim that copied manifests “can never drift” is false without pinned source SHA/schema/sync enforcement.
- Relative `assets/screenshot-*.webp` paths do not match local `/assets/...` copies when resolved from a Games page. Component currently unmounted; do not confuse latent path defects with observed production errors.
- PixelPokeArena's repo explicitly identifies an unofficial third-party Web3-game WebView wrapper. Catalogue copy makes it sound like an original arena game.

### Historical claims are not new evidence

Local AUDIT.md (2026-08-21) says every visible issue is stale deployment and no code changes are needed, all 70 links were 200, and code is healthy. That is not a current conclusion. README claims 18 tests, Vite 7/ESLint 9, 22 prerendered routes and measured accessibility/performance figures; current run has 72 tests, Vite 6.4.3, ESLint 10 dependency, 15 prerendered routes. `npm run verify` does not reproduce browser performance or axe measurements.

LIN4CRE's 4 November curation record explicitly says external links/platforms were not independently tested and declines fake scoring. The 5 November record supplies highly precise scores and stronger verification claims. Preserve history, but **do not inherit those scores or claims as present-day independent evidence**. Narrow Android scope or being downloadable is not, by itself, a reason to omit good original studio work.

## 5. Visual and usability audit

### Live presentation (retrieved content, not pixel-level certification)

Strengths: clear studio/location introductory line, searchable/category-based project library, source links and distinction between use/download/source, real individual game pages. The structure gives multiple ways to find work.

Problems: homepage competes with “77 Instant Games”, “1,310 OSINT nodes”, music masters, observatories, AI sandbox and identity tools before the visitor understands the studio's original releases. “Six self-contained applications running natively” conflates a link directory, API dashboards and other experiences. External ports advertised as “verified” are not supported by this audit. Counts are a weaker studio introduction than a few actual products with screenshots and clear actions.

### Local rendered dashboard (visually inspected at 1440px and 390px)

- Consistent dark cyan/purple treatment, responsive cards and clear grouping are reusable strengths. No horizontal overflow or page-script exceptions in the four sampled routes at those widths.
- Large anime scene, animated particles, a dominant clock and systems HUD establish a personal workstation aesthetic, not a product studio. The headline is generic; featured product screenshots and obvious Games/Projects links are absent.
- Desktop cards have relatively small text, clipped descriptions and tiny icon-only bottom actions. Mobile is a long stack with the HUD consuming substantial initial space. No measured contrast/WCAG verdict is asserted.
- Public editing controls and the terminal are distracting; a hardware/DNS chip is more prominent than useful release information.
- Some clickable status-chip `div`s are not keyboard buttons. Current App lacks the old Header's skip link and old routed accessibility/legal shell. Dynamic sound defaults to enabled, despite legacy Games copy promising no automatic audio; current music playback was not tested for autoplay.
- A good focus-trapping ProjectDetailModal and reduced-motion-aware legacy components exist, but they do not automatically benefit the newly mounted portal.

### Images and screenshot credibility

Local public directory: **145 files, about 85 MB**, primarily ten MP3 tracks of roughly 5–10 MB each. Bundling these into every website deployment is unnecessary for a games/software-first landing page; defer/isolate rather than delete source during audit.

`public/banners/` and `public/projects/` contain extensive branded/project art. `generate-project-art.py` explicitly generates decorative SVG artwork; this is not a runtime screenshot pipeline. Visually inspected Pixel Heist banner is illustrative pixel art, not independently established gameplay. Slime's screenshot-labelled image looks like a polished game UI, but no capture version/provenance was established. Do not claim fabrication, and do not certify authenticity based on filenames.

All `artwork` paths referenced by the local catalogue exist on disk. That does not prove they are accurate/current. LIN4CRE main has separate `/showcase/` media references absent from this checkout. Inventory records list screenshot/preview filename candidates per repo. Need capture date, running build SHA, platform and explicit concept-art labels before using these as proof of shipped work. Never invent “outdated screenshot” findings without a version comparison.

## 6. Security, privacy and correctness findings

### P0: do not promote the audited local API unchanged

**Source-confirmed**, not exploited remotely:

- `api/server.ts` around 1440–1470 accepts hard-coded master credentials in addition to a configured password and contains fallback session-signing material. Do not repeat these credentials; treat historically public values as compromised and rotate related configuration.
- `/api/auth/google` around 1492 issues a signed privileged session without verifying a Google identity. If deployed with the matching session secret, it undermines owner-gated services.
- `checkAuth` includes a non-production Host/localhost bypass; deployment environment and proxy trust must be made explicit and tested.
- Multiple AI/provider and local-proxy endpoints warrant owner authentication, robust input validation, distributed rate limiting and spending caps, regardless of whether the UI is hidden.

LIN4CRE `docs/2026-11-04-hardening.md` records fixes for these classes and states production remains vulnerable until fixes are promoted. Production metadata predates that document. This is a **credible release-blocking risk**, not proof of the exact deployed function contents: no production auth/API probing was performed. Inspect/promote reviewed fixes only through an authorised security release; a blind redeploy from this checkout would reintroduce defects.

### P1: contact can report success without delivery

Local `/api/contact` stores to a file under `process.cwd()` and silently ignores write failures. On serverless storage it can acknowledge a submission that was not persisted or delivered. No configured email send occurs in that path. Do not advertise response guarantees until real delivery and failure reporting are verified. Contact payload retention/privacy also needs review.

### P1/P2: unsafe or misleading local capabilities

- LocalRigDeck automatically fetches visitor `http://localhost:8188`, `:11434`, `:5173` with `mode: no-cors`. This probes the **visitor's** computer, not the owner's rig. CSP/mixed-content/local-network restrictions may block it; opaque-response success is not service health. Remove from public presentation or move to clearly consented local-only tooling.
- Lab/IdentityHub/DevPlayground contain `dangerouslySetInnerHTML` for rich HTML/SVG. Not currently mounted, but sanitize and test before re-enabling; no local DOMPurify dependency establishes sanitisation. This audit does not claim every sink exploitable.
- Service worker activation deletes **all other origin cache names**, not just the site's prefix, and suppresses precache errors. Scope ownership and failed-navigation caching need regression tests.
- Security headers are a useful baseline (HSTS, nosniff, frame restrictions, CSP), but route-level `/tools` CSP overlaps the global policy; multiple policies intersect rather than grant a blanket relaxation. Verify the actual deployed headers and standalone tool inline scripts. Strict policies also complicate Arena/iframe-based testing (`frame-ancestors 'none'`, X-Frame-Options DENY).

### Dependency advisories at audit time

| Lockfile | npm audit result | Interpretation |
|---|---|---|
| Root | **20 affected dependency entries: 1 critical, 6 high, 13 moderate** | Includes critical proxy-addr and high body-parser, undici, source-map-js, brace-expansion, Vite and Zod; distinguish runtime/build-tool paths before prioritising fixes |
| MCP | **9: 1 critical, 5 high, 3 moderate** | Separate dependency tree not covered by root TypeScript/CI; build/harness passing is not a vulnerability clearance |

These are registry advisory findings, not 20 independent exploitable production flaws. Example: [proxy-addr advisory](https://github.com/advisories/GHSA-jqcg-44mw-7w3h), [body-parser advisory](https://github.com/advisories/GHSA-27r3-jxmh-p828). No `npm audit fix` or dependency updates were run.

## 7. Deployment audit

### Correct Vercel project and domains

- Team: **Linacre's projects** (`team_70Ssag5ByTEef55X9odk7rGb`).
- Project: **linacre-site-repo** (`prj_cSV1pxS65mMKBDdU9A6QLunJPgXc`).
- `www.linacre.site`: verified assignment to that project, no redirect, no branch-specific domain override.
- `linacre.site`: verified assignment to same project, **308 redirect to www.linacre.site**.
- DNS config checks for both: **misconfigured=false**, no conflicts. Apex A value `216.198.79.1`; www CNAME `9dc6d9e289bd4372.vercel-dns-017.com.`; external registrar DNS. Vercel reports `ipStatus=no-change`. Do not change working DNS merely because an alternative recommendation is returned.

### Latest production deployment (Vercel target filter, not an assumption)

- ID: `dpl_EX6WYxdTCcE1hLaS6awyRCJYJqcv`
- Created: **2026-11-01 12:55:41 UTC**; **READY / PROMOTED**.
- URL: https://linacre-site-repo-7lkto80g2-linacres-projects.vercel.app
- Source: **CLI**; metadata repository **LIN4CRE/linacre.site**, ref **main**, SHA `434be2a441bd46538b331a1b7ae21d4a0a4fa0b5`.
- Observed production source branch is main. The project's configured Git production-branch/link/protection fields were in the truncated portion of the large connector project response, so the independent **settings value and current automatic Git linkage are not certified**. Metadata clearly establishes the last production build's ref/repository.

### Latest preview deployment

- ID: `dpl_4d5NZdKCZJ71vsJNmt6j1QMXEJut`
- Created: **2026-11-04 22:45:30 UTC**; **READY / STAGED**, not production.
- URL: https://linacre-site-repo-f9mktn3j8-linacres-projects.vercel.app
- Repository **LIN4CRE/linacre.site**, ref `arena/eac16b69-linacre-site`, SHA `5ab243873a8ef6b88a236533380bad27a04df056`.
- Direct public retrieval redirects to **Vercel login / Protected Deployment**. This is a testing-access barrier, not application failure. No protection bypass was used. Team defaults also specify protection for non-custom domains; project-specific settings were not fully visible.

### Is latest source deployed?

**No match:** latest LIN4CRE main `c92645c…` is neither production `434be2a…` nor latest preview `5ab2438…`. Local/DLinacre main is `d9b98a0…`. Live homepage/directory content corroborates deployment drift. This does not establish that every feature or every security fix from latest main has never appeared in any historic deployment; only the current/latest targets were assessed.

### Workflows and operational risks

- Local CI runs typecheck, lint, tests, advisory formatting, build and artifact upload. Separate deploy workflow triggers on main/manual, skips if required Vercel credentials absent and does not wait for the CI job. A green verification job is not evidence of promotion.
- Local GitHub Pages deployment publishes static `dist` only; Express API cannot work there. Root-relative paths and SPA behaviour need separate Pages testing. The Pages health check only checks HTTP 200/nonempty HTML, not route identity, game playability or contact delivery.
- Latest LIN4CRE main CI run [42022750297](https://github.com/LIN4CRE/linacre.site/actions/runs/42022750297) and production deploy run [42022750050](https://github.com/LIN4CRE/linacre.site/actions/runs/42022750050), both 2026-11-05, report **failure**. Jobs have no recorded steps in the returned metadata. Exact cause was not established: do not call this a source/test failure, missing secrets or billing fault without further evidence.
- Recent LIN4CRE scheduled health checks also fail; recent DLinacre health checks succeed. Those different workflows/repos do not prove the custom production site is healthy/unhealthy. Historical cross-branch CI runs must not be attributed to current main without checking their head ref.
- GitLab CI uses a personal Windows runner; security scan is allowed to fail and Trivy exits 0; deploy job deletes/recreates `public` in runner workspace. Runner availability/pipelines were not tested. This is not an authoritative Vercel production gate.
- Scripts under `scripts/agents/`, autonomous agent/CLI tooling and art generators are operational/development helpers, not shipped app functionality. Inspect each before running: this audit did not run sync, janitor, release, artwork, autonomous-agent or deployment commands.
- `write-ops-status.mjs` is a positive exception: whitelists build metadata and correctly avoids claiming runtime/pipeline/deployment success.

## 8. Link/build evidence ledger

| Target | Audit observation | Conclusion |
|---|---|---|
| www home; `/projects` | Retrieved home, 25 entries; projects resolves home | Redirect confirmed, not a real Projects landing page |
| www `/games` | Retrieved external 77-entry Tabulous directory | Live not curated original-games React page |
| www Circuit/Decrypt/Gridlock | Game-specific HTML/UI retrieved | Public boot surface exists; no live gameplay test |
| www `/helix/` | Retrieved HELIX UI, canonicalised to `/helix` | Reachable independent static app |
| DLinacre Pages KushCloud, Afterglow | Play/painting UI retrieved | Candidate games, functional loops not independently tested |
| DLinacre Pages Pixel Heist | Briefing retrieved with 2026-07-28 date | Investigate daily-data staleness |
| DLinacre Pages Dragon Rush Heroes | Signup / instant-play UI retrieved | Do not certify combat/464 fighters from landing page |
| LIN4CRE Pages DigiPoke | Onboarding retrieved | Candidate game, not tested through battle |
| DLinacre Pages CubeLab | Solver/trainer UI retrieved | Candidate project, algorithm/offline flow not exercised |
| LIN4CRE Pages SpeedRead | Reading controls retrieved | Candidate project, import/offline not exercised |
| LIN4CRE Pages Dual Audio Synchronizer | Documentation and EXE download link retrieved; release asset independently listed | Download exists; Windows/DSP performance untested |
| AeroFlap Pages; Tap & Slap Vercel | Fetch failed without HTTP detail | Unavailable to this test, not established dead |
| Smart Mail, Nic Food Decider, FaceRater Vercel | Fetch failed without HTTP detail | Quarantine public launch claims pending retest |
| GuruAi-project repo | API 404 | Public repo not verified; private/deleted/rename unresolved |
| MDT-kit repo | API access restriction | Not accessible to integration; not proven nonexistent |
| Latest Vercel preview | Redirects to login | Deployment protection blocks anonymous testing |
| Deliberately unknown www route | Fetch failed, status unavailable | Live true-404 handling not certified |

No exhaustive external-host gameplay or malware/rights audit of 77 directory entries was possible. They remain explicitly unverified in GAME_INVENTORY.md. “All external links healthy” would be an unsupported statement.

## 9. Reproducible local checks and gaps

| Check | Result on audited checkout |
|---|---|
| `npm ci --ignore-scripts` | Completed, lockfile unchanged |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass exit code, **163 warnings / 0 errors** |
| `npm test` | **12 files / 72 tests pass**; duplicate CubeLab React-key warnings |
| `npm run build` | Pass; Vite 6.4.3, 15 prerendered routes, 14 sitemap URLs; empty vendor-motion chunk |
| MCP `npm ci --ignore-scripts`, build | Pass |
| `(cd mcp && node test-harness.mjs)` | Pass supplied protocol/tool harness; must run in package cwd |
| Root/MCP npm audit | 20 / 9 findings respectively; not clean |
| Local Chromium 1440/390 route checks | No overflow/script errors in sampled routes; route identity fails after JS as described |
| Seven game `.html` boot checks | HTTP 200 and game controls/title, no page-script errors |

Initial MCP harness invocation from repository root hung because it spawns `dist/server.js` relative to cwd (the website server there); stopped it and reran correctly from `mcp`, which passed. This is a reproducibility/documentation concern, not a failed MCP protocol test.

Build output before prerender: app JS ~345 KB (gzip ~101 KB), vendor-react ~11.7 KB (gzip ~4.2 KB), CSS ~139 KB (gzip ~21 KB), empty motion chunk. These are build sizes, **not measured production transfer or Core Web Vitals**. Media dominates public asset storage; media transfer depends on actual player/network behaviour.

Tests mostly cover legacy components and contracts; they do not establish correctness of the current App/ProjectRadar route behaviour, Vercel rewrites, real gameplay, Windows/Android installs or external APIs. Add actual route-identity and product-smoke tests before treating passing unit tests as a release gate.

## 10. Public presentation decision

### Keep and strengthen

- Genuine original work with real source, release assets and honest platform/status labels.
- Seven local standalone games and candidate original-game repositories, subject to playthrough/device/IP checks.
- Strong project candidates: Dual Audio Synchronizer, CubeLab, HELIX, SpeedRead, selected Windows/Android work after installation checks; Orbit after live/stale-data handling review.
- Source links, accessible controls, purposeful search/filtering, no account requirement for portfolio browsing, useful technical case studies and clear contact information.

### Fix before featuring

- Repository authority and production mapping; route/render mismatch; P0 API risks; build/preview protection and CI/deploy failures.
- Conflicting data models, duplicate CubeLab, wrong OmniRoute link, invented/unsubstantiated stack/version/production claims.
- Download vs source vs demo vs template classification; per-asset verification; genuine dated screenshots; third-party/wrapper attribution.
- Contact delivery and privacy; status labels backed by actual measurements; clear offline/error/stale-data UI.

### Remove from primary public presentation, not source/repositories

- 77 third-party arcade entries as “our games” or release counts; directory projects may be described honestly as directory software if worth a case study.
- Personal rig specifications, localhost controls/probes, visitor card editing/deleting, terminal theatrics, dominant clock and always-green system claims.
- Unsupported “verified”, “production-ready”, “zero technical debt”, leak/performance/security guarantees and inherited fake-precision scores.
- Private placeholders, inaccessible/broken-unconfirmed launch actions, and unfinished games presented as consumer releases.
- Music and generic technology directories as competing primary navigation. Retain direct links/subprojects when useful; do not delete old work in this audit.

**Stop point:** audit reports complete. No redesign/redevelopment or deployment authorised by this report. Resolve the source-of-truth decision and approve the rebuild plan first.
