# Project inventory

Audit date: **2026-11-25 UTC**. Source baseline: `DLinacre/linacre.site` at `d9b98a0084eff3a11a750f604cb658e54b95aaeb`; additional read-only research of `LIN4CRE/linacre.site` main `c92645cdc3e2e16b69731fa53c1ff095d111727a` and public repositories on both accounts. See WEBSITE_AUDIT.md for deployment/source divergence and limitations.

**Evidence rules:** “Page retrieved” means publicly reachable HTML/UI text, not working gameplay/application logic. “Asset exists” means GitHub release metadata lists that exact file, not that the download was installed, signature-checked or malware-scanned. “Source exists” is not “finished”. Platform labels derive from source paths and require real-device verification. Screenshots and artwork are separate: filename matches are candidates, not authenticated captures. Completion/maintenance cannot be inferred from repository freshness. Dates and links are a point-in-time record.

Repository coverage: all **54 LIN4CRE + 58 DLinacre = 112 public repositories** were enumerated via authenticated GitHub API, with recursive trees, README contents (where supplied) and up to 10 releases per repository. Forks are retained as separate records to avoid assuming identical source/deployments. Private, deleted, inaccessible and local-only work cannot be exhaustively discovered. No private account material was inventoried.

## Current implementation update — 2026-11-25

The reconciliation below is a historical baseline, not a description of the newly mounted site. The current application mounts the studio homepage and dedicated `/projects` experience. Canonical content preserves 58 project records; 15 explicitly source-reviewed records appear in the curated portfolio. Unreviewed historical detail records remain accessible but are excluded from indexing. Source review does not certify deployment, installation or all claimed functionality.

Current portfolio evidence (exact SHAs, release URLs, and provenance are maintained in `src/content/projects/records.json`):

| Project | Recorded status | Platforms | Local interface capture |
|---|---|---|---|
| CubeLab | Unspecified |  | Yes; source attribution in record |
| HELIX | Unspecified |  | No; artwork/fallback only |
| Linacre Uninstaller | Released | Android | No; artwork/fallback only |
| APKHub | Unspecified |  | No; artwork/fallback only |
| PokeGuru | Released |  | No; artwork/fallback only |
| PokéFlip AI | Unspecified |  | No; artwork/fallback only |
| OmniRoute LLM Engine | Unspecified |  | No; artwork/fallback only |
| Linacre LLM Hub & Benchmarks | Unspecified |  | No; artwork/fallback only |
| OSINT HUD | Unspecified |  | No; artwork/fallback only |
| easy-audiobook-player | Unspecified |  | Yes; source attribution in record |
| Fire TV Setup Kit | Unspecified |  | No; artwork/fallback only |
| Dual Audio Synchronizer | Released | Windows | Yes; source attribution in record |
| Karaoke Pulse | Unspecified |  | No; artwork/fallback only |
| SpeedRead | Unspecified |  | Yes; source attribution in record |
| Orbit & Earth Observatory | Unspecified |  | No; artwork/fallback only |

Captures document UI only, not solver accuracy, installation or a public deployment. Android debug APKs are labelled as such; Windows download links are only exposed for actual official Windows release assets.

## Catalogue reconciliation

There is no single authoritative presentation:

| Surface | Current evidence |
|---|---|
| Running checkout | `App.tsx → ProjectRadar → src/config/projects.json`: **8** default cards; visitors can edit localStorage copies |
| Local legacy catalogue | `src/data/siteProjects.ts`: **69 rows**, **68 unique names**, including 14 Game rows and 5 Private rows; CubeLab duplicated |
| Local selected/featured code | `FeaturedSpotlight`, `ProjectGrid`, `GameShowcase`, `StartPage` remain in source but are not mounted by current App |
| LIN4CRE latest main | `siteProjects.ts`: **25** rows; `curatedWork.ts`: **5 selected projects + 4 selected games** |
| Production live home | **25** listed projects and **77 instant games** claimed; older than LIN4CRE main |
| Prior “23-entry catalogue” | Not the current count in either inspected main; preserve as historical observation, not current fact |

The 8 active cards are OmniRoute-LLM, Deasy, Linacre Mission Control, Whole-Home Adblocker, DKMA Monster, cubelab 3D, Bonny Bakes and Dragon Rush Heroes. OmniRoute-LLM incorrectly points to `Linacre-LLM-Benchmarks` rather than the separate `OmniRoute-LLM` repository. The Benchmarks repository describes a public leaderboard dashboard, not proof of the gateway claimed by that card. All eight are assessed below or in GAME_INVENTORY.md.

## Local catalogue crosswalk (all 69 rows)

This preserves original entries including private placeholders; it is not a recommended public selection. URL/repository equality means **source link**, not runnable app. Current catalogue has no populated `downloadUrl` fields; some generic `url` values point to release pages.

| Name | Current kind | Repository | Recorded use/download destination |
|---|---|---|---|

| linacre.site | App | https://github.com/DLinacre/linacre.site | https://www.linacre.site |
| Bonny Bakes | App | https://github.com/DLinacre/bonny-bakes | https://dlinacre.github.io/bonny-bakes/ |
| CubeLab | App | https://github.com/DLinacre/cubelab | https://dlinacre.github.io/cubelab/ |
| HELIX | App | https://github.com/DLinacre/helix | /helix |
| Whole-Home Ad Blocker | Tool | https://github.com/DLinacre/whole-home-adblocker | None |
| Smart Mail AI | AI | https://github.com/DLinacre/smart-mail | https://smart-mail-gamma.vercel.app |
| CubeLab | App | https://github.com/DLinacre/cubelab | https://dlinacre.github.io/cubelab/ |
| Linacre Uninstaller | App | https://github.com/DLinacre/LinacreUninstaller | https://github.com/DLinacre/LinacreUninstaller/releases/latest |
| APKHub | App | https://github.com/DLinacre/APKHub | https://apkhub-alpha.vercel.app |
| Nic's Food Decider | App | https://github.com/DLinacre/nic-food-decider | https://nic-food-decider.vercel.app |
| Fleatment | App | https://github.com/DLinacre/Fleatment | https://dlinacre.github.io/Fleatment/ |
| Life Hacks | App | https://github.com/DLinacre/life-hacks | https://dlinacre.github.io/life-hacks/ |
| MyDIY | App | https://github.com/DLinacre/MyDIY | None |
| String & Band | App | https://github.com/DLinacre/string-and-band | https://dlinacre.github.io/string-and-band/ |
| Mob Deals | Tool | https://github.com/DLinacre/mob-deals | /mob-deals |
| PokeGuru | Tool | https://github.com/DLinacre/PokeGuru | /pokeguru |
| Prism | Source | https://github.com/DLinacre/prism | None |
| Linacre Global Monitor | App | https://github.com/DLinacre/linacre-global-monitor | https://dlinacre.github.io/linacre-global-monitor/ |
| PayHip Scraper | Tool | https://github.com/DLinacre/PayHip-Scraper | None |
| Arena Audit Prompt Builder | Tool | https://github.com/DLinacre/a-audit | /tools/arena-audit.html |
| Grumpy Guy AI | AI | https://github.com/DLinacre/grumpy-guy-ai | https://dlinacre.github.io/grumpy-guy-ai/ |
| PokéFlip AI | AI | https://github.com/DLinacre/Pok-Flip-AI | https://pok-flip-ai.vercel.app |
| FaceRater AI | AI | Not supplied | https://ai-face-rater-next.vercel.app |
| Apex POS | App | https://github.com/DLinacre/Apex-POS | https://dlinacre.github.io/Apex-POS/ |
| Personal OP Agent | Tool | Not supplied | /tools/opagent.html |
| Bonny Bats | App | https://github.com/DLinacre/bonny-bats | https://dlinacre.github.io/bonny-bats/ |
| OmniRoute LLM Engine | DevOps | https://github.com/DLinacre/OmniRoute-LLM | None |
| Linacre LLM Hub & Benchmarks | AI | https://github.com/DLinacre/Linacre-LLM-Benchmarks | https://dlinacre.github.io/Linacre-LLM-Benchmarks/ |
| OSINT HUD | Tool | https://github.com/DLinacre/linacre-osint-hud | https://dlinacre.github.io/linacre-osint-hud/ |
| 1Files | Source | https://github.com/DLinacre/1files | https://dlinacre.github.io/1files/ |
| GhostMail | App | https://github.com/DLinacre/GhostMail | None |
| EV Backend | DevOps | https://github.com/DLinacre/ev-backend | None |
| EV Bot Companion | DevOps | https://github.com/DLinacre/ev-bot-companion | None |
| MyHub Dev Pipeline | DevOps | https://github.com/DLinacre/myhub-pipeline | None |
| SideHustles | DevOps | https://github.com/DLinacre/SideHustles | None |
| SIM://ROOT | Tool | https://github.com/DLinacre/sim-root | https://dlinacre.github.io/sim-root/ |
| DKMA Monster | Tool | https://github.com/DLinacre/dkma-monster | None |
| Deasy | Source | https://github.com/DLinacre/Deasy | None |
| GlitchArt Engine | Tool | https://github.com/DLinacre/GlitchArt | https://dlinacre.github.io/GlitchArt/ |
| linacre-wallpaper | Source | https://github.com/DLinacre/linacre-wallpaper | None |
| EV | Private | Not supplied | None |
| knowledge-vault | Private | Not supplied | None |
| linacre-toolkit | Private | Not supplied | None |
| linacre-devops-hub | Private | Not supplied | None |
| NixLabs | Private | Not supplied | None |
| Tiles | Game | https://github.com/DLinacre/linacre.site | /games/tiles.html |
| Mines | Game | https://github.com/DLinacre/linacre.site | /games/mines.html |
| Circuit | Game | https://github.com/DLinacre/linacre.site | /games/circuit |
| Decrypt | Game | https://github.com/DLinacre/linacre.site | /games/decrypt |
| Pulse | Game | https://github.com/DLinacre/linacre.site | /games/pulse |
| Trigger | Game | https://github.com/DLinacre/linacre.site | /games/trigger |
| Gridlock | Game | https://github.com/DLinacre/linacre.site | /games/gridlock |
| Tap & Slap | Game | https://github.com/DLinacre/tap-and-slap | https://tap-and-slap.vercel.app |
| KushCloud | Game | https://github.com/DLinacre/KushCloud | https://dlinacre.github.io/KushCloud/ |
| AeroFlap | Game | https://github.com/LIN4CRE/AeroFlap | https://LIN4CRE.github.io/AeroFlap/ |
| AFTERGLOW | Game | https://github.com/DLinacre/afterglow | https://dlinacre.github.io/afterglow/ |
| Pixel Heist | Game | https://github.com/DLinacre/pixel-heist | https://dlinacre.github.io/pixel-heist/ |
| Dragon Rush Heroes | Game | https://github.com/DLinacre/dragon-rush-heroes | https://dlinacre.github.io/dragon-rush-heroes/ |
| PixelPoke Arena | Game | https://github.com/DLinacre/PixelPokeArena | https://github.com/DLinacre/PixelPokeArena/releases/latest |
| Slime Factory Tycoon | Source | https://github.com/DLinacre/slime-factory-tycoon | None |
| BloxCapital | Source | https://github.com/DLinacre/BloxCapital | None |
| Blox-Capital | Source | https://github.com/DLinacre/Blox-Capital | None |
| MDT-kit | Tool | https://github.com/DLinacre/MDT-kit | https://github.com/DLinacre/MDT-kit |
| circuit-guide | Tool | https://github.com/DLinacre/circuit-guide | https://github.com/DLinacre/circuit-guide |
| easy-audiobook-player | App | https://github.com/DLinacre/easy-audiobook-player | https://github.com/DLinacre/easy-audiobook-player |
| jessica-gcse-maths-exam | App | https://github.com/DLinacre/jessica-gcse-maths-exam | https://github.com/DLinacre/jessica-gcse-maths-exam |
| KidsVids | App | https://github.com/DLinacre/KidsVids | https://github.com/DLinacre/KidsVids |
| GuruAi-project | AI | https://github.com/DLinacre/GuruAi-project | https://github.com/DLinacre/GuruAi-project |
| azaroth-installer | DevOps | https://github.com/DLinacre/azaroth-installer | https://github.com/DLinacre/azaroth-installer |

## Important corrections and missing records

- **MDT-kit:** GitHub API returned “Resource not accessible by integration”; absent from public account listing. Do not label nonexistent or finished. Owner clarification/access needed.
- **GuruAi-project:** API returned 404; absent from public listing. Could be private, removed or renamed; no public application verified.
- **FaceRater AI:** no source repository recorded; listed endpoint failed retrieval. Ownership, code, privacy and working service unresolved. Do not solicit face uploads from a portfolio link until reviewed.
- **Personal OP Agent:** local `public/tools/opagent.html` exists; no external repo recorded. It is a subproject of this website, not a separately proven commercial agent service. Existing unit tests cover source contracts, not remote autonomy.
- **EV, knowledge-vault, linacre-toolkit, linacre-devops-hub, NixLabs:** explicit Private placeholders, no recorded public repo/build. Do not imply public launchability or enumerate these as shipped products.
- **CubeLab:** duplicate local catalogue entry; tests emit duplicate React keys. Reconcile by stable ID, not display name.
- **Easy Audiobook Player and Jessica GCSE Maths:** static source contradicts richer catalogue framework/feature claims. KidsVids also lacks substantiation for its advertised React application/parental locks.
- **Selected-work upstream:** Dual Audio Synchronizer, CubeLab, HELIX, Orbit and SpeedRead are useful candidates, not automatically approved. Orbit is a site subproject (`LIN4CRE/linacre.site/src/components/OrbitObservatory.tsx`), not a separate discovered repository. Public production advertises it; live telemetry/network correctness not tested.
- All game-specific repositories are itemised in GAME_INVENTORY.md, including source-only and wrapper projects. They are not duplicated as finished software here.

## Public software/tooling/content repositories

Items that are directories, educational content, personal configuration, account profiles or media are deliberately included so they can be excluded from a studio release count on evidence rather than silently lost. A fork is not necessarily third-party work: many LIN4CRE forks have DLinacre parents, but per-fork authorship and deployment must still be reconciled.

### DLinacre/1files

- **Name / type:** 1files — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/1files (default `main`; not marked as fork; last pushed 2026-08-29T18:14:31Z).
- **Description (repository-authored, not independently validated):** 1Files — collection of complete apps/tools, each shipped as a SINGLE self-contained HTML file. Zero build, zero deps.
- **Live / launch URLs recorded:** https://dlinacre.github.io/1files/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** None identified in inspected tree.
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/1files/tree/main), [releases](https://github.com/DLinacre/1files/releases) — 10 file paths inspected; tree truncated: False.

### DLinacre/3-am-two-cats-and-an-overdraft

- **Name / type:** 3-am-two-cats-and-an-overdraft — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/3-am-two-cats-and-an-overdraft (default `main`; not marked as fork; last pushed 2026-09-14T20:09:58Z).
- **Description (repository-authored, not independently validated):** David Linacre - 3 AM, Two Cats & An Overdraft (2026) [Deluxe Edition] Official Album & Interactive Web Player
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `Cover.png`, `albums/neon-velvet-nights/Cover.png`, `albums/neon-velvet-nights/banner.png`, `assets/github_banner.png`
- **Documentation:** `README.md`, `audit-3-am-two-cats-and-an-overdraft/AI-Opportunities.md`, `audit-3-am-two-cats-and-an-overdraft/Accessibility.md`, `audit-3-am-two-cats-and-an-overdraft/Architecture-Review.md`, `audit-3-am-two-cats-and-an-overdraft/Assumptions-and-Gaps.md`, `audit-3-am-two-cats-and-an-overdraft/CI/ci.yml`, `audit-3-am-two-cats-and-an-overdraft/Code-Quality.md` (+28 other matching paths).
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/3-am-two-cats-and-an-overdraft/tree/main), [releases](https://github.com/DLinacre/3-am-two-cats-and-an-overdraft/releases) — 143 file paths inspected; tree truncated: False.

### DLinacre/a-audit

- **Name / type:** a-audit — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/a-audit (default `main`; not marked as fork; last pushed 2026-09-12T21:06:21Z).
- **Description (repository-authored, not independently validated):** 🔍 Arena Audit — Automated accessibility, metadata, performance & content audit tool rendered as a static GitHub Pages report.
- **Live / launch URLs recorded:** /tools/arena-audit.html; https://dlinacre.github.io/a-audit/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.png`, `assets/og-preview.png`, `banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/a-audit/tree/main), [releases](https://github.com/DLinacre/a-audit/releases) — 52 file paths inspected; tree truncated: False.

### DLinacre/Apex-POS

- **Name / type:** Apex-POS — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/Apex-POS (default `main`; not marked as fork; last pushed 2026-09-12T21:06:15Z).
- **Description (repository-authored, not independently validated):** Offline-first point of sale — register, inventory, customers, expenses, NFC, receipts & reports. 100% client-side (Vue 3 + Dexie), works fully offline.
- **Live / launch URLs recorded:** https://dlinacre.github.io/Apex-POS/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Android source; Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.png`, `assets/banner.svg`, `assets/og-preview.png`, `banner.png`
- **Documentation:** `.github/profile/README.md`, `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/Apex-POS/tree/main), [releases](https://github.com/DLinacre/Apex-POS/releases) — 95 file paths inspected; tree truncated: False.

### DLinacre/APKHub

- **Name / type:** APKHub — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/APKHub (default `main`; not marked as fork; last pushed 2026-09-19T12:42:47Z).
- **Description (repository-authored, not independently validated):** 📱 APKHub — Curated Android APK intelligence, build artifact manager, and automated inspection toolkit.
- **Live / launch URLs recorded:** https://apkhub-alpha.vercel.app; https://dlinacre.github.io/APKHub/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Android source; Web/JS source; Python/backend tooling.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.svg`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/APKHub/tree/main), [releases](https://github.com/DLinacre/APKHub/releases) — 74 file paths inspected; tree truncated: False.

### DLinacre/azaroth-installer

- **Name / type:** azaroth-installer — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/azaroth-installer (default `main`; not marked as fork; last pushed 2026-09-11T11:56:22Z).
- **Description (repository-authored, not independently validated):** ⚔️ Azaroth Core — One-Click Installer for AzerothCore 3.3.5a + PlayerBots. Single setup.exe, zero manual setup.
- **Live / launch URLs recorded:** https://dlinacre.github.io/azaroth-installer/
- **Download URL(s), newest inspected release carrying assets:** [config.json](https://github.com/DLinacre/azaroth-installer/releases/download/v1.0.0/config.json) (v1.0.0, 2,916 bytes); [setup.exe](https://github.com/DLinacre/azaroth-installer/releases/download/v1.0.0/setup.exe) (v1.0.0, 145,940,105 bytes)
- **Platform (source evidence, not compatibility certification):** Windows/desktop or setup tooling; Web/JS source.
- **Actual status:** Release asset(s) listed by GitHub; installation/functionality/completion NOT verified.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner-art.png`, `assets/banner.png`
- **Documentation:** `README.md`, `audit-github-com/Accessibility/accessibility-checklist.md`, `audit-github-com/Assumptions-and-Gaps.md`, `audit-github-com/CSS/styles.css`, `audit-github-com/Content/readme-rewrite.md`, `audit-github-com/Design/design-tokens.md`, `audit-github-com/Developer-Tasks.md` (+16 other matching paths).
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/azaroth-installer/tree/main), [releases](https://github.com/DLinacre/azaroth-installer/releases) — 68 file paths inspected; tree truncated: False.

### DLinacre/BestSites

- **Name / type:** BestSites — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/BestSites (default `main`; not marked as fork; last pushed 2026-11-24T14:41:18Z).
- **Description (repository-authored, not independently validated):** All the best websites on the web.
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `public/og-image.png`, `public/og-image.svg`
- **Documentation:** `.github/workflows/link-audit-refresh.yml`, `.github/workflows/link-audit.yml`, `LINK_AUDIT.md`, `README.md`, `scripts/render-audit.ts`, `src/data/link-status.json`, `src/lib/link-audit.ts` (+2 other matching paths).
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/BestSites/tree/main), [releases](https://github.com/DLinacre/BestSites/releases) — 89 file paths inspected; tree truncated: False.

### DLinacre/Blox-Capital

- **Name / type:** Blox-Capital — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/Blox-Capital (default `main`; not marked as fork; last pushed 2026-08-29T18:14:23Z).
- **Description (repository-authored, not independently validated):** Roblox extension for money making.
- **Live / launch URLs recorded:** https://dlinacre.github.io/Blox-Capital/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source repository, README absent; no release verified. Separate from BloxCapital; relationship unresolved.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** None identified in inspected tree.
- **Documentation:** None identified in inspected tree.
- **Missing / release gate:** README and current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/Blox-Capital/tree/main), [releases](https://github.com/DLinacre/Blox-Capital/releases) — 35 file paths inspected; tree truncated: False.

### DLinacre/BloxCapital

- **Name / type:** BloxCapital — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/BloxCapital (default `main`; not marked as fork; last pushed 2026-08-29T18:14:43Z).
- **Description (repository-authored, not independently validated):** BloxCapital - Roblox Monetization & Game Performance Suite
- **Live / launch URLs recorded:** https://dlinacre.github.io/BloxCapital/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Small source repository; README describes ambitions; no release or playable game verified.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** None identified in inspected tree.
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/BloxCapital/tree/main), [releases](https://github.com/DLinacre/BloxCapital/releases) — 7 file paths inspected; tree truncated: False.

### DLinacre/bonny-bakes

- **Name / type:** bonny-bakes — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/bonny-bakes (default `main`; not marked as fork; last pushed 2026-09-11T13:57:36Z).
- **Description (repository-authored, not independently validated):** Simple bakes. Happy hearts. A warm, friendly home-baking recipe website with a quantity calculator, favourites, shopping list and print-friendly cards.
- **Live / launch URLs recorded:** https://dlinacre.github.io/bonny-bakes/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** `assets/screenshots/home.png`, `assets/screenshots/recipe.png` Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/bonny-bakes/tree/main), [releases](https://github.com/DLinacre/bonny-bakes/releases) — 31 file paths inspected; tree truncated: False.

### DLinacre/bonny-bats

- **Name / type:** bonny-bats — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/bonny-bats (default `main`; not marked as fork; last pushed 2026-08-29T18:14:51Z).
- **Description (repository-authored, not independently validated):** Bonny Bats — a friendly client-facing guide to bats in buildings: spotting them, staying safe, the law, and humane exclusion. Built for sharing.
- **Live / launch URLs recorded:** https://dlinacre.github.io/bonny-bats/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `banner.webp`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/bonny-bats/tree/main), [releases](https://github.com/DLinacre/bonny-bats/releases) — 8 file paths inspected; tree truncated: False.

### DLinacre/circuit-guide

- **Name / type:** circuit-guide — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/circuit-guide (default `main`; not marked as fork; last pushed 2026-08-29T18:14:19Z).
- **Description (repository-authored, not independently validated):** ⚡ Circuit Boards, Visually — a free, single-file interactive guide for learning circuits & multimeters. Short words, big diagrams.
- **Live / launch URLs recorded:** https://dlinacre.github.io/circuit-guide/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.png`, `assets/banner.svg`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/circuit-guide/tree/main), [releases](https://github.com/DLinacre/circuit-guide/releases) — 16 file paths inspected; tree truncated: False.

### DLinacre/cubelab

- **Name / type:** cubelab — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/cubelab (default `main`; not marked as fork; last pushed 2026-09-11T23:02:47Z).
- **Description (repository-authored, not independently validated):** CubeLab — free offline-first Rubik's Cube solver, trainer, timer and PWA.
- **Live / launch URLs recorded:** https://dlinacre.github.io/cubelab/; https://DLinacre.github.io/cubelab/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Public solver UI retrieved; scramble-to-solve correctness/offline not exercised.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `docs/banner.png`, `docs/banner.svg`, `public/banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/cubelab/tree/main), [releases](https://github.com/DLinacre/cubelab/releases) — 72 file paths inspected; tree truncated: False.

### DLinacre/Deasy

- **Name / type:** Deasy — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/Deasy (default `main`; not marked as fork; last pushed 2026-09-26T06:13:20Z).
- **Description (repository-authored, not independently validated):** Deasy — multi-platform branch orchestrator & Windows desktop suite: serverless pipelines, AES-256-GCM Drive backups, NSIS zero-terminal installers.
- **Live / launch URLs recorded:** https://dlinacre.github.io/Deasy/
- **Download URL(s), newest inspected release carrying assets:** [Arena.apk](https://github.com/DLinacre/Deasy/releases/download/v1.5.0/Arena.apk) (v1.5.0, 5,055,781 bytes); [Deasy.Setup.1.1.0.exe](https://github.com/DLinacre/Deasy/releases/download/v1.5.0/Deasy.Setup.1.1.0.exe) (v1.5.0, 246,367,173 bytes)
- **Platform (source evidence, not compatibility certification):** Windows/desktop or setup tooling; Web/JS source.
- **Actual status:** Binary release exists: latest listed v1.5.0 carries Deasy.Setup.1.1.0.exe and Arena.apk. Version mismatch needs explanation; not executed.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `banner.png`
- **Documentation:** `README-DESKTOP.md`, `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/Deasy/tree/main), [releases](https://github.com/DLinacre/Deasy/releases) — 49 file paths inspected; tree truncated: False.

### DLinacre/dkma-monster

- **Name / type:** dkma-monster — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/dkma-monster (default `main`; not marked as fork; last pushed 2026-09-12T21:05:39Z).
- **Description (repository-authored, not independently validated):** Universal Dont-Kill-My-App toolkit — stop aggressive OEM battery managers from killing your Android apps. CLI, GUI, web guide, root/Magisk, Android + KMP libraries.
- **Live / launch URLs recorded:** https://dlinacre.github.io/dkma-monster/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Android source; Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `.github/banner.png`, `banner.png`
- **Documentation:** `README.md`, `android/README.md`, `docs/ROADMAP.md`, `gui/README.md`, `kmp/README.md`, `tools/README.md`, `web/README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/dkma-monster/tree/main), [releases](https://github.com/DLinacre/dkma-monster/releases) — 79 file paths inspected; tree truncated: False.

### DLinacre/DLinacre

- **Name / type:** DLinacre — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/DLinacre (default `main`; not marked as fork; last pushed 2026-08-29T18:14:33Z).
- **Description (repository-authored, not independently validated):** Profile
- **Live / launch URLs recorded:** https://dlinacre.github.io/DLinacre/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `.github/banner.png`, `assets/banner.png`, `banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/DLinacre/tree/main), [releases](https://github.com/DLinacre/DLinacre/releases) — 14 file paths inspected; tree truncated: False.

### DLinacre/easy-audiobook-player

- **Name / type:** easy-audiobook-player — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/easy-audiobook-player (default `main`; not marked as fork; last pushed 2026-08-29T18:14:30Z).
- **Description (repository-authored, not independently validated):** A static HTML5 audiobook player for legal audio links and local files.
- **Live / launch URLs recorded:** https://dlinacre.github.io/easy-audiobook-player/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.svg`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/easy-audiobook-player/tree/main), [releases](https://github.com/DLinacre/easy-audiobook-player/releases) — 16 file paths inspected; tree truncated: False.

### DLinacre/ev-backend

- **Name / type:** ev-backend — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/ev-backend (default `main`; not marked as fork; last pushed 2026-09-12T21:08:30Z).
- **Description (repository-authored, not independently validated):** FastAPI backend service powering an Alexa voice assistant integration.
- **Live / launch URLs recorded:** https://dlinacre.github.io/ev-backend/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Windows/desktop or setup tooling; Web/JS source; Python/backend tooling.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `.github/banner.png`, `banner.png`
- **Documentation:** `README.md`, `alexa/README.md`, `app/services/audit_service.py`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/ev-backend/tree/main), [releases](https://github.com/DLinacre/ev-backend/releases) — 126 file paths inspected; tree truncated: False.

### DLinacre/ev-bot-companion

- **Name / type:** ev-bot-companion — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/ev-bot-companion (default `main`; not marked as fork; last pushed 2026-08-29T18:14:39Z).
- **Description (repository-authored, not independently validated):** Android/web companion app for EV-Bot — a Gemini-powered AI avatar linking Alexa voice commands to desktop PC macros, with offline-first sync.
- **Live / launch URLs recorded:** https://dlinacre.github.io/ev-bot-companion/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Android source; Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `.github/banner.png`, `banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/ev-bot-companion/tree/main), [releases](https://github.com/DLinacre/ev-bot-companion/releases) — 96 file paths inspected; tree truncated: False.

### DLinacre/Fleatment

- **Name / type:** Fleatment — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/Fleatment (default `main`; not marked as fork; last pushed 2026-08-29T18:14:53Z).
- **Description (repository-authored, not independently validated):** 🐱 Fleatment — UK cat flea & tick treatment finder: live price index, active-ingredient matrix & veterinary safety toolkit.
- **Live / launch URLs recorded:** https://dlinacre.github.io/Fleatment/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.png`, `banner.png`
- **Documentation:** `README.md`, `audit-github-com/Accessibility/README.md`, `audit-github-com/Assumptions-and-Gaps.md`, `audit-github-com/CSS/README.md`, `audit-github-com/Content/README.md`, `audit-github-com/Design/README.md`, `audit-github-com/Developer-Tasks.md` (+12 other matching paths).
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/Fleatment/tree/main), [releases](https://github.com/DLinacre/Fleatment/releases) — 33 file paths inspected; tree truncated: False.

### DLinacre/GhostMail

- **Name / type:** GhostMail — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/GhostMail (default `main`; not marked as fork; last pushed 2026-08-29T18:14:40Z).
- **Description (repository-authored, not independently validated):** GhostMail — privacy-first disposable email + alias toolkit (React/TS). Self-host your own inboxes, kill tracking at the source.
- **Live / launch URLs recorded:** https://dlinacre.github.io/GhostMail/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.png`, `assets/banner.svg`, `banner.png`
- **Documentation:** `README.md`, `src/components/StatusBar.tsx`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/GhostMail/tree/main), [releases](https://github.com/DLinacre/GhostMail/releases) — 50 file paths inspected; tree truncated: False.

### DLinacre/GlitchArt

- **Name / type:** GlitchArt — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/GlitchArt (default `main`; not marked as fork; last pushed 2026-09-12T21:08:24Z).
- **Description (repository-authored, not independently validated):** Artwork 
- **Live / launch URLs recorded:** https://dlinacre.github.io/GlitchArt/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/github_banner.svg`
- **Documentation:** `README.md`, `src/components/ReadmeBuilder.tsx`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/GlitchArt/tree/main), [releases](https://github.com/DLinacre/GlitchArt/releases) — 48 file paths inspected; tree truncated: False.

### DLinacre/grumpy-guy-ai

- **Name / type:** grumpy-guy-ai — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/grumpy-guy-ai (default `main`; not marked as fork; last pushed 2026-09-12T21:07:09Z).
- **Description (repository-authored, not independently validated):** 🤖 Grumpy Guy AI — Opinionated, character-driven LLM assistant with personality-biased prompt engineering.
- **Live / launch URLs recorded:** https://dlinacre.github.io/grumpy-guy-ai/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `docs/banner.png`, `public/banner.png`
- **Documentation:** `README.md`, `docs/06-refactor-audit.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/grumpy-guy-ai/tree/main), [releases](https://github.com/DLinacre/grumpy-guy-ai/releases) — 80 file paths inspected; tree truncated: False.

### DLinacre/helix

- **Name / type:** helix — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/helix (default `main`; not marked as fork; last pushed 2026-08-29T18:14:56Z).
- **Description (repository-authored, not independently validated):** HELIX — living evolution observatory. Watch a population of programs evolve in the browser.
- **Live / launch URLs recorded:** /helix; https://dlinacre.github.io/helix/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Public /helix UI retrieved; simulation behaviour and numerical claims not exercised.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** None identified in inspected tree.
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/helix/tree/main), [releases](https://github.com/DLinacre/helix/releases) — 11 file paths inspected; tree truncated: False.

### DLinacre/jessica-gcse-maths-exam

- **Name / type:** jessica-gcse-maths-exam — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/jessica-gcse-maths-exam (default `main`; not marked as fork; last pushed 2026-09-10T20:10:08Z).
- **Description (repository-authored, not independently validated):** Personalised GCSE Maths practice exam for Jessica Linacre
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Three-file static HTML repository, 28-character README; catalogue React/TypeScript/calculator/score-tracking description needs correction or source evidence.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** None identified in inspected tree.
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/jessica-gcse-maths-exam/tree/main), [releases](https://github.com/DLinacre/jessica-gcse-maths-exam/releases) — 3 file paths inspected; tree truncated: False.

### DLinacre/KidsVids

- **Name / type:** KidsVids — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/KidsVids (default `main`; not marked as fork; last pushed 2026-08-29T18:14:26Z).
- **Description (repository-authored, not independently validated):** .
- **Live / launch URLs recorded:** https://dlinacre.github.io/KidsVids/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Tiny static source repository with docs/index.html and a 14-character README; catalogue React/TypeScript/parental-lock claims not substantiated by manifest/tree review.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** None identified in inspected tree.
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/KidsVids/tree/main), [releases](https://github.com/DLinacre/KidsVids/releases) — 7 file paths inspected; tree truncated: False.

### DLinacre/life-hacks

- **Name / type:** life-hacks — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/life-hacks (default `main`; not marked as fork; last pushed 2026-09-12T21:06:31Z).
- **Description (repository-authored, not independently validated):** 🚀 Life Hacks — a growing PWA of clever, well-explained fixes. First hack: a DIY capacitive stylus for phones & tablets, the perfect pen for the AFTERGLOW game.
- **Live / launch URLs recorded:** https://dlinacre.github.io/life-hacks/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/life-hacks/tree/main), [releases](https://github.com/DLinacre/life-hacks/releases) — 29 file paths inspected; tree truncated: False.

### DLinacre/linacre-global-monitor

- **Name / type:** linacre-global-monitor — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/linacre-global-monitor (default `main`; not marked as fork; last pushed 2026-08-29T18:14:50Z).
- **Description (repository-authored, not independently validated):** 📡 Real-time geopolitical and environmental situational awareness dashboard. Barnsley, South Yorkshire Command Hub. Powered by NASA, USGS & Open-Meteo.
- **Live / launch URLs recorded:** https://dlinacre.github.io/linacre-global-monitor/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/linacre-global-monitor/tree/main), [releases](https://github.com/DLinacre/linacre-global-monitor/releases) — 10 file paths inspected; tree truncated: False.

### DLinacre/Linacre-LLM-Benchmarks

- **Name / type:** Linacre-LLM-Benchmarks — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/Linacre-LLM-Benchmarks (default `main`; not marked as fork; last pushed 2026-11-25T17:46:03Z).
- **Description (repository-authored, not independently validated):** Automated 24h LLM benchmark dashboard scraping the most accurate public sources. Windows EXE + Android APK super-app packaging.
- **Live / launch URLs recorded:** https://dlinacre.github.io/Linacre-LLM-Benchmarks/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Android source; Windows/desktop or setup tooling; Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.png`, `assets/banner.svg`, `banner.png`
- **Documentation:** `README.md`, `audit_report.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/Linacre-LLM-Benchmarks/tree/main), [releases](https://github.com/DLinacre/Linacre-LLM-Benchmarks/releases) — 105 file paths inspected; tree truncated: False.

### DLinacre/linacre-osint-hud

- **Name / type:** linacre-osint-hud — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/linacre-osint-hud (default `main`; not marked as fork; last pushed 2026-08-29T18:14:54Z).
- **Description (repository-authored, not independently validated):** 🛰️ Dark glass OSINT heads-up display — 1,310 curated open-source intelligence tools from the OSINT4ALL collection, in one self-contained HTML console. Part of linacre.site.
- **Live / launch URLs recorded:** https://dlinacre.github.io/linacre-osint-hud/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** `docs/screenshot-hero.png`, `docs/screenshot-panels.png` Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/linacre-osint-hud/tree/main), [releases](https://github.com/DLinacre/linacre-osint-hud/releases) — 17 file paths inspected; tree truncated: False.

### DLinacre/linacre-wallpaper

- **Name / type:** linacre-wallpaper — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/linacre-wallpaper (default `main`; not marked as fork; last pushed 2026-09-12T21:23:47Z).
- **Description (repository-authored, not independently validated):** Linacre System Monitor Wallpaper — real-time CPU/GPU/RAM/network live wallpaper (Lively Wallpaper native), dual-monitor, linacre.site theme, ⌘K command palette.
- **Live / launch URLs recorded:** https://dlinacre.github.io/linacre-wallpaper/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Windows/desktop or setup tooling; Web/JS source; Python/backend tooling.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** None identified in inspected tree.
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/linacre-wallpaper/tree/main), [releases](https://github.com/DLinacre/linacre-wallpaper/releases) — 34 file paths inspected; tree truncated: False.

### DLinacre/linacre.site

- **Name / type:** linacre.site — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/linacre.site (default `main`; not marked as fork; last pushed 2026-09-28T15:45:32Z).
- **Description (repository-authored, not independently validated):** 🌐 linacre.site — David Linacre personal software engineering portfolio, project showcase, and technical blog.
- **Live / launch URLs recorded:** https://www.linacre.site; /games/tiles.html; /games/mines.html; /games/circuit; /games/decrypt; /games/pulse; /games/trigger; /games/gridlock; https://dlinacre.github.io/linacre.site/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** `public/assets/screenshot-gameplay.webp`, `public/assets/screenshot-leaderboard.webp`, `public/assets/screenshot-pets.webp`, `public/assets/screenshot-rebirth.webp`, `public/assets/screenshot-settings.webp` Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `.github/banner.png`, `.github/banner.svg`, `banner.png`, `public/banners/aeroflap.png`
- **Documentation:** `AUDIT.md`, `README.md`, `mcp/README.md`, `public/banners/arena-audit.webp`, `public/projects/a-audit.webp`, `public/tools/arena-audit.html`, `scripts/audit_path.py` (+3 other matching paths).
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/linacre.site/tree/main), [releases](https://github.com/DLinacre/linacre.site/releases) — 300 file paths inspected; tree truncated: False.

### DLinacre/LinacreUninstaller

- **Name / type:** LinacreUninstaller — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/LinacreUninstaller (default `main`; not marked as fork; last pushed 2026-08-29T18:14:41Z).
- **Description (repository-authored, not independently validated):** Android uninstaller and debloat review tool with a fixed launcher entry, polished Material dark UI, safety tiers, and guided uninstall flow.
- **Live / launch URLs recorded:** https://dlinacre.github.io/LinacreUninstaller/
- **Download URL(s), newest inspected release carrying assets:** [LUninstall-v1.3.1-debug.apk](https://github.com/DLinacre/LinacreUninstaller/releases/download/v1.3.1/LUninstall-v1.3.1-debug.apk) (v1.3.1, 5,840,906 bytes)
- **Platform (source evidence, not compatibility certification):** Android source; Web/JS source.
- **Actual status:** Android release assets exist, explicitly debug APKs (latest listed v1.3.1); not evidence of signed production/store distribution.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.png`, `banner.png`
- **Documentation:** `README.md`, `gradle-8.5/README`, `gradle-8.5/init.d/readme.txt`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/LinacreUninstaller/tree/main), [releases](https://github.com/DLinacre/LinacreUninstaller/releases) — 320 file paths inspected; tree truncated: False.

### DLinacre/mob-deals

- **Name / type:** mob-deals — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/mob-deals (default `main`; not marked as fork; last pushed 2026-08-29T18:14:52Z).
- **Description (repository-authored, not independently validated):** 📱 Mob Deals — Transparent, accessibility-first UK SIM-only mobile deal comparison with SEO-ready metadata and responsible pricing methodology.
- **Live / launch URLs recorded:** /mob-deals; https://dlinacre.github.io/mob-deals/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** None identified in inspected tree.
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/mob-deals/tree/main), [releases](https://github.com/DLinacre/mob-deals/releases) — 10 file paths inspected; tree truncated: False.

### DLinacre/MyDIY

- **Name / type:** MyDIY — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/MyDIY (default `main`; not marked as fork; last pushed 2026-09-12T21:07:16Z).
- **Description (repository-authored, not independently validated):** Premium zero-dependency DIY folding stool calculator & build guide. React + Tailwind single-file app.
- **Live / launch URLs recorded:** https://dlinacre.github.io/MyDIY/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/MyDIY/tree/main), [releases](https://github.com/DLinacre/MyDIY/releases) — 12 file paths inspected; tree truncated: False.

### DLinacre/myhub-pipeline

- **Name / type:** myhub-pipeline — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/myhub-pipeline (default `main`; not marked as fork; last pushed 2026-08-29T18:18:16Z).
- **Description (repository-authored, not independently validated):** 49-block automated DevOps pipeline: CI/CD, AI auto-fix, DORA metrics, security scanning, anomaly detection & predictive failure. Portfolio project by David Linacre.
- **Live / launch URLs recorded:** https://dlinacre.github.io/myhub-pipeline/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Python/backend tooling.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `.github/banner.png`, `banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/myhub-pipeline/tree/main), [releases](https://github.com/DLinacre/myhub-pipeline/releases) — 45 file paths inspected; tree truncated: False.

### DLinacre/nic-food-decider

- **Name / type:** nic-food-decider — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/nic-food-decider (default `main`; not marked as fork; last pushed 2026-08-29T18:14:32Z).
- **Description (repository-authored, not independently validated):** 🍽️ nic-food-decider — One-click decision engine for meals: weighted choices, dietary filters, and decision history.
- **Live / launch URLs recorded:** https://nic-food-decider.vercel.app; https://dlinacre.github.io/nic-food-decider/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source; Python/backend tooling.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Catalogue Vercel URL retrieval failed; not proven dead.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.png`, `banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/nic-food-decider/tree/main), [releases](https://github.com/DLinacre/nic-food-decider/releases) — 38 file paths inspected; tree truncated: False.

### DLinacre/OmniRoute-LLM

- **Name / type:** OmniRoute-LLM — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/OmniRoute-LLM (default `main`; not marked as fork; last pushed 2026-09-11T13:57:18Z).
- **Description (repository-authored, not independently validated):** OmniRoute LLM router
- **Live / launch URLs recorded:** https://dlinacre.github.io/OmniRoute-LLM/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Android source; Windows/desktop or setup tooling; Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** `docs/screenshots/01-providers.png`, `docs/screenshots/02-combos.png`, `docs/screenshots/03-analytics.png`, `docs/screenshots/04-health.png`, `docs/screenshots/05-translator.png`, `docs/screenshots/06-settings.png` (+7 more screenshot/preview-named candidates). Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner-llm.png`
- **Documentation:** `@omniroute/opencode-plugin/README.md`, `@omniroute/opencode-provider/README.md`, `README-DLinacre.md`, `README.md`, `bin/cli/README.md`, `bin/cli/commands/audit.mjs`, `bin/cli/commands/status.mjs` (+148 other matching paths).
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/OmniRoute-LLM/tree/main), [releases](https://github.com/DLinacre/OmniRoute-LLM/releases) — 9124 file paths inspected; tree truncated: False.

### DLinacre/OmniRoute-LLM-archive

- **Name / type:** OmniRoute-LLM-archive — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/OmniRoute-LLM-archive (default `main`; not marked as fork; last pushed 2026-07-22T16:19:28Z).
- **Description (repository-authored, not independently validated):** OmniRoute — LLM routing layer for Android builds: model selection, fallback, and cost-aware dispatch.
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Not established from tree; see docs.
- **Actual status:** GitHub marks archived; two files only. Historical reference, not a current product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/OmniRoute-LLM-archive/tree/main), [releases](https://github.com/DLinacre/OmniRoute-LLM-archive/releases) — 2 file paths inspected; tree truncated: False.

### DLinacre/PayHip-Scraper

- **Name / type:** PayHip-Scraper — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/PayHip-Scraper (default `main`; not marked as fork; last pushed 2026-09-12T20:55:15Z).
- **Description (repository-authored, not independently validated):** 🛒 PayHip-Scraper — Digital product intelligence for Payhip: live marketplace scraping, deterministic scoring & AI prompt generation.
- **Live / launch URLs recorded:** https://dlinacre.github.io/PayHip-Scraper/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** None identified in inspected tree.
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/PayHip-Scraper/tree/main), [releases](https://github.com/DLinacre/PayHip-Scraper/releases) — 68 file paths inspected; tree truncated: False.

### DLinacre/Pok-Flip-AI

- **Name / type:** Pok-Flip-AI — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/Pok-Flip-AI (default `main`; not marked as fork; last pushed 2026-09-12T21:08:39Z).
- **Description (repository-authored, not independently validated):** 🃏 PokéFlip AI — Intelligent collectible card pricing index, condition analyzer, and market prediction engine.
- **Live / launch URLs recorded:** https://pok-flip-ai.vercel.app; https://dlinacre.github.io/Pok-Flip-AI/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Android source; Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `public/github-banner.svg`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/Pok-Flip-AI/tree/main), [releases](https://github.com/DLinacre/Pok-Flip-AI/releases) — 44 file paths inspected; tree truncated: False.

### DLinacre/PokeGuru

- **Name / type:** PokeGuru — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/PokeGuru (default `main`; not marked as fork; last pushed 2026-11-22T19:10:18Z).
- **Description (repository-authored, not independently validated):** Pokemon TCG card database with search, pricing, and set browsing
- **Live / launch URLs recorded:** /pokeguru; https://dlinacre.github.io/PokeGuru/
- **Download URL(s), newest inspected release carrying assets:** [pokeguru-build.zip](https://github.com/DLinacre/PokeGuru/releases/download/v1.5.2/pokeguru-build.zip) (v1.5.2, 502,621 bytes)
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Release asset(s) listed by GitHub; installation/functionality/completion NOT verified.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `.github/banner.png`, `assets/brand/banner-1280x640.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/PokeGuru/tree/main), [releases](https://github.com/DLinacre/PokeGuru/releases) — 193 file paths inspected; tree truncated: False.

### DLinacre/prism

- **Name / type:** prism — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/prism (default `main`; not marked as fork; last pushed 2026-09-12T21:04:49Z).
- **Description (repository-authored, not independently validated):** 📊 Prism — Premium project intelligence & team collaboration platform with real-time kanban, analytics & state management.
- **Live / launch URLs recorded:** https://dlinacre.github.io/prism/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `.github/banner.svg`, `assets/banner.png`, `banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/prism/tree/main), [releases](https://github.com/DLinacre/prism/releases) — 83 file paths inspected; tree truncated: False.

### DLinacre/SideHustles

- **Name / type:** SideHustles — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/SideHustles (default `main`; not marked as fork; last pushed 2026-09-12T21:07:43Z).
- **Description (repository-authored, not independently validated):** Deployment mad easy.
- **Live / launch URLs recorded:** https://dlinacre.github.io/SideHustles/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Windows/desktop or setup tooling; Web/JS source; Python/backend tooling.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `FINAL_PRODUCTS_FOR_PAYHIP/ai_resume_kit_cover_1784849276800.png`, `FINAL_PRODUCTS_FOR_PAYHIP/canva_social_media_kit_cover_1784821601480.png`, `FINAL_PRODUCTS_FOR_PAYHIP/chatgpt_coding_cheatsheet_cover_1784821421650.png`, `FINAL_PRODUCTS_FOR_PAYHIP/cold_email_templates_cover_1784849283513.png`
- **Documentation:** `README.md`, `src/components/GrowthRoadmap.tsx`, `src/components/SeoAuditForm.tsx`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/SideHustles/tree/main), [releases](https://github.com/DLinacre/SideHustles/releases) — 146 file paths inspected; tree truncated: False.

### DLinacre/sim-root

- **Name / type:** sim-root — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/sim-root (default `main`; not marked as fork; last pushed 2026-08-29T18:14:27Z).
- **Description (repository-authored, not independently validated):** SIM://ROOT — the hacker's field guide to your SIM card: anatomy, pinout intel, and a 100% client-side digital infiltration lab. Zero dependencies, zero packets leave the page.
- **Live / launch URLs recorded:** https://dlinacre.github.io/sim-root/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/sim-root/tree/main), [releases](https://github.com/DLinacre/sim-root/releases) — 13 file paths inspected; tree truncated: False.

### DLinacre/smart-mail

- **Name / type:** smart-mail — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/smart-mail (default `main`; not marked as fork; last pushed 2026-08-29T18:14:24Z).
- **Description (repository-authored, not independently validated):** AI-powered unified inbox (Google Gemini) — smart categorisation, importance detection & multi-account. React + TypeScript + Capacitor.
- **Live / launch URLs recorded:** https://smart-mail-gamma.vercel.app; https://dlinacre.github.io/smart-mail/
- **Download URL(s), newest inspected release carrying assets:** [app-debug.apk](https://github.com/DLinacre/smart-mail/releases/download/v1.0.0/app-debug.apk) (v1.0.0, 4,053,991 bytes)
- **Platform (source evidence, not compatibility certification):** Android source; Web/JS source.
- **Actual status:** Android app-debug.apk release asset exists; browser endpoint retrieval failed. Neither account integration nor APK exercised.
- **Can launch / independently verified:** Catalogue Vercel URL retrieval failed; not proven dead.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `.github/banner.png`, `banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/smart-mail/tree/main), [releases](https://github.com/DLinacre/smart-mail/releases) — 106 file paths inspected; tree truncated: False.

### DLinacre/sporing

- **Name / type:** sporing — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/sporing (default `main`; not marked as fork; last pushed 2026-09-12T23:43:36Z).
- **Description (repository-authored, not independently validated):** Sporing — a seasonal foraging chance map for England's edible wild fungi (installable PWA). Home base: Barnsley, South Yorkshire.
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `docs/banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/sporing/tree/main), [releases](https://github.com/DLinacre/sporing/releases) — 16 file paths inspected; tree truncated: False.

### DLinacre/string-and-band

- **Name / type:** string-and-band — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/string-and-band (default `main`; not marked as fork; last pushed 2026-09-12T21:07:53Z).
- **Description (repository-authored, not independently validated):** Offline-first educational knowledge base on the history, materials, terminology and craft of archery equipment and slingshots — one self-contained HTML file with zero dependencies.
- **Live / launch URLs recorded:** https://dlinacre.github.io/string-and-band/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/string-and-band/tree/main), [releases](https://github.com/DLinacre/string-and-band/releases) — 16 file paths inspected; tree truncated: False.

### DLinacre/Website-builder

- **Name / type:** Website-builder — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/Website-builder (default `main`; not marked as fork; last pushed 2026-09-15T11:23:19Z).
- **Description (repository-authored, not independently validated):** NEWEST VERSION
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `docs/assets/banner.png`, `public/og-image.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/Website-builder/tree/main), [releases](https://github.com/DLinacre/Website-builder/releases) — 66 file paths inspected; tree truncated: False.

### DLinacre/whole-home-adblocker

- **Name / type:** whole-home-adblocker — project / software, tooling or content repository.
- **Repository:** https://github.com/DLinacre/whole-home-adblocker (default `main`; not marked as fork; last pushed 2026-09-12T21:04:26Z).
- **Description (repository-authored, not independently validated):** One-click whole-home network ad blocker for Windows - AdGuard Home in Docker with a friendly setup wizard, live dashboard and preloaded blocklists
- **Live / launch URLs recorded:** https://dlinacre.github.io/whole-home-adblocker/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Windows/desktop or setup tooling; Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/whole-home-adblocker/tree/main), [releases](https://github.com/DLinacre/whole-home-adblocker/releases) — 26 file paths inspected; tree truncated: False.

### LIN4CRE/1files

- **Name / type:** 1files — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/1files (default `main`; fork; last pushed 2026-11-01T09:44:00Z).
- **Description (repository-authored, not independently validated):** 1Files — collection of complete apps/tools, each shipped as a SINGLE self-contained HTML file. Zero build, zero deps.
- **Live / launch URLs recorded:** https://lin4cre.github.io/1files/; https://dlinacre.github.io/1files/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `banner.jpg`, `banner.png`
- **Documentation:** `README.md`, `tests/helpers/a11y-audit.js`, `tests/helpers/audit-offline.js`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/1files/tree/main), [releases](https://github.com/LIN4CRE/1files/releases) — 67 file paths inspected; tree truncated: False.

### LIN4CRE/APKHub

- **Name / type:** APKHub — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/APKHub (default `main`; fork; last pushed 2026-10-31T20:54:06Z).
- **Description (repository-authored, not independently validated):** 📱 APKHub — Curated Android APK intelligence, build artifact manager, and automated inspection toolkit.
- **Live / launch URLs recorded:** https://lin4cre.github.io/APKHub/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Android source; Web/JS source; Python/backend tooling.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.jpg`, `assets/banner.png`, `assets/banner.svg`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/APKHub/tree/main), [releases](https://github.com/LIN4CRE/APKHub/releases) — 77 file paths inspected; tree truncated: False.

### LIN4CRE/Barnsley-Web-Builder

- **Name / type:** Barnsley-Web-Builder — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/Barnsley-Web-Builder (default `main`; not marked as fork; last pushed 2026-10-01T06:19:10Z).
- **Description (repository-authored, not independently validated):** Http://Paypal.me/dlinacre16. Create website for local businesses.
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `docs/assets/banner.png`, `public/og-image.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/Barnsley-Web-Builder/tree/main), [releases](https://github.com/LIN4CRE/Barnsley-Web-Builder/releases) — 64 file paths inspected; tree truncated: False.

### LIN4CRE/beginner-2x4-bench-plan

- **Name / type:** beginner-2x4-bench-plan — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/beginner-2x4-bench-plan (default `main`; not marked as fork; last pushed 2026-10-04T23:52:52Z).
- **Description (repository-authored, not independently validated):** A responsive beginner woodworking bench build guide with diagrams and an interactive rotatable 3D model.
- **Live / launch URLs recorded:** https://LIN4CRE.github.io/beginner-2x4-bench-plan/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `banner.svg`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/beginner-2x4-bench-plan/tree/main), [releases](https://github.com/LIN4CRE/beginner-2x4-bench-plan/releases) — 9 file paths inspected; tree truncated: False.

### LIN4CRE/Bizintel

- **Name / type:** Bizintel — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/Bizintel (default `main`; not marked as fork; last pushed 2026-09-19T18:40:39Z).
- **Description (repository-authored, not independently validated):** Biz
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Android source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** `app/src/test/screenshots/greeting.png` Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** None identified in inspected tree.
- **Documentation:** None identified in inspected tree.
- **Missing / release gate:** README and current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/Bizintel/tree/main), [releases](https://github.com/LIN4CRE/Bizintel/releases) — 58 file paths inspected; tree truncated: False.

### LIN4CRE/bonny-bakes

- **Name / type:** bonny-bakes — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/bonny-bakes (default `main`; fork; last pushed 2026-10-31T21:19:58Z).
- **Description (repository-authored, not independently validated):** Simple bakes. Happy hearts. A warm, friendly home-baking recipe website with a quantity calculator, favourites, shopping list and print-friendly cards.
- **Live / launch URLs recorded:** https://lin4cre.github.io/bonny-bakes/; https://dlinacre.github.io/bonny-bakes/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** `assets/screenshots/home.png`, `assets/screenshots/recipe.png` Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.jpg`, `assets/banner.png`, `banner.jpg`, `banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/bonny-bakes/tree/main), [releases](https://github.com/LIN4CRE/bonny-bakes/releases) — 36 file paths inspected; tree truncated: False.

### LIN4CRE/bonny-bats

- **Name / type:** bonny-bats — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/bonny-bats (default `main`; fork; last pushed 2026-10-31T21:17:53Z).
- **Description (repository-authored, not independently validated):** Bonny Bats — a friendly client-facing guide to bats in buildings: spotting them, staying safe, the law, and humane exclusion. Built for sharing.
- **Live / launch URLs recorded:** https://lin4cre.github.io/bonny-bats/; https://dlinacre.github.io/bonny-bats/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `banner.jpg`, `banner.png`, `banner.webp`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/bonny-bats/tree/main), [releases](https://github.com/LIN4CRE/bonny-bats/releases) — 10 file paths inspected; tree truncated: False.

### LIN4CRE/BuildingBux

- **Name / type:** BuildingBux — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/BuildingBux (default `main`; not marked as fork; last pushed 2026-10-03T08:34:28Z).
- **Description (repository-authored, not independently validated):** Build Roblox games and make Money 
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `public/github-banner.svg`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/BuildingBux/tree/main), [releases](https://github.com/LIN4CRE/BuildingBux/releases) — 51 file paths inspected; tree truncated: False.

### LIN4CRE/comfyui-wallpaper-pipeline

- **Name / type:** comfyui-wallpaper-pipeline — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/comfyui-wallpaper-pipeline (default `main`; not marked as fork; last pushed 2026-09-15T10:56:36Z).
- **Description (repository-authored, not independently validated):** Not supplied.
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Python/backend tooling.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** None identified in inspected tree.
- **Documentation:** `README.md`, `comfyui_nodes/WallPipe/README.md`, `input/README.md`, `workflows/README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/comfyui-wallpaper-pipeline/tree/main), [releases](https://github.com/LIN4CRE/comfyui-wallpaper-pipeline/releases) — 97 file paths inspected; tree truncated: False.

### LIN4CRE/cubelab

- **Name / type:** cubelab — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/cubelab (default `main`; fork; last pushed 2026-10-31T21:13:37Z).
- **Description (repository-authored, not independently validated):** CubeLab — free offline-first Rubik's Cube solver, trainer, timer and PWA.
- **Live / launch URLs recorded:** https://lin4cre.github.io/cubelab/; https://DLinacre.github.io/cubelab/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Selected-work URL points to DLinacre Pages; solver UI retrieved; not proof this fork is deployed.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `docs/banner.jpg`, `docs/banner.png`, `docs/banner.svg`, `public/banner.jpg`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/cubelab/tree/main), [releases](https://github.com/LIN4CRE/cubelab/releases) — 94 file paths inspected; tree truncated: False.

### LIN4CRE/DBSTEAM

- **Name / type:** DBSTEAM — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/DBSTEAM (default `main`; not marked as fork; last pushed 2026-09-28T14:20:12Z).
- **Description (repository-authored, not independently validated):** Next-Gen Steam & Gaming Account Operations Hub with SteamDB Paid Releases, Cloud Save Vault, Lua Automation Scripting, Gemini AI Intelligence, and Android APK.
- **Live / launch URLs recorded:** https://lin4cre.github.io/DBSTEAM/
- **Download URL(s), newest inspected release carrying assets:** [DBSTEAM-Setup-1.0.0.exe](https://github.com/LIN4CRE/DBSTEAM/releases/download/v1.0.0/DBSTEAM-Setup-1.0.0.exe) (v1.0.0, 140,314,740 bytes); [DBSTEAM-v1.0.0-Portable.exe](https://github.com/LIN4CRE/DBSTEAM/releases/download/v1.0.0/DBSTEAM-v1.0.0-Portable.exe) (v1.0.0, 140,095,835 bytes); [DBSTEAM-v1.0.0.apk](https://github.com/LIN4CRE/DBSTEAM/releases/download/v1.0.0/DBSTEAM-v1.0.0.apk) (v1.0.0, 4,442,494 bytes)
- **Platform (source evidence, not compatibility certification):** Android source; Windows/desktop or setup tooling; Web/JS source.
- **Actual status:** v1.0.0 Windows installer/portable EXE and Android APK assets exist; installation, Steam integration and safety not tested.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.png`, `banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/DBSTEAM/tree/main), [releases](https://github.com/LIN4CRE/DBSTEAM/releases) — 101 file paths inspected; tree truncated: False.

### LIN4CRE/dual-audio-synchronizer

- **Name / type:** dual-audio-synchronizer — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/dual-audio-synchronizer (default `main`; not marked as fork; last pushed 2026-10-24T12:03:07Z).
- **Description (repository-authored, not independently validated):** Studio-grade WASAPI multi-speaker audio synchronizer for Windows with automatic ±1 ms clock-drift phase lock and 2.8 kHz Hearing Clarity DSP.
- **Live / launch URLs recorded:** https://lin4cre.github.io/dual-audio-synchronizer/
- **Download URL(s), newest inspected release carrying assets:** [app.ico](https://github.com/LIN4CRE/dual-audio-synchronizer/releases/download/v2.0.0/app.ico) (v2.0.0, 155,506 bytes); [DualAudioStudio.exe](https://github.com/LIN4CRE/dual-audio-synchronizer/releases/download/v2.0.0/DualAudioStudio.exe) (v2.0.0, 395,264 bytes); [tiktok_promo.mp4](https://github.com/LIN4CRE/dual-audio-synchronizer/releases/download/v2.0.0/tiktok_promo.mp4) (v2.0.0, 7,672,396 bytes)
- **Platform (source evidence, not compatibility certification):** Windows/desktop or setup tooling; Web/JS source.
- **Actual status:** v2.0.0 EXE release asset exists; documentation reachable. Claimed ±1 ms accuracy and Windows compatibility not independently measured.
- **Can launch / independently verified:** Public product page retrieved and EXE release asset listed by GitHub; Windows execution/drift accuracy not tested.
- **Existing screenshots:** `assets/screenshot.png`, `docs/assets/screenshot.png` Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.png`, `docs/assets/banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/dual-audio-synchronizer/tree/main), [releases](https://github.com/LIN4CRE/dual-audio-synchronizer/releases) — 30 file paths inspected; tree truncated: False.

### LIN4CRE/easy-audiobook-player

- **Name / type:** easy-audiobook-player — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/easy-audiobook-player (default `main`; fork; last pushed 2026-10-31T20:49:02Z).
- **Description (repository-authored, not independently validated):** A static HTML5 audiobook player for legal audio links and local files.
- **Live / launch URLs recorded:** https://lin4cre.github.io/easy-audiobook-player/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.jpg`, `assets/banner.png`, `assets/banner.svg`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/easy-audiobook-player/tree/main), [releases](https://github.com/LIN4CRE/easy-audiobook-player/releases) — 18 file paths inspected; tree truncated: False.

### LIN4CRE/EMULATED

- **Name / type:** EMULATED — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/EMULATED (default `main`; not marked as fork; last pushed 2026-08-24T18:12:53Z).
- **Description (repository-authored, not independently validated):** All emulated content 
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** None identified in inspected tree.
- **Documentation:** None identified in inspected tree.
- **Missing / release gate:** README and current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/EMULATED/tree/main), [releases](https://github.com/LIN4CRE/EMULATED/releases) — 37 file paths inspected; tree truncated: False.

### LIN4CRE/firetv-kit

- **Name / type:** firetv-kit — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/firetv-kit (default `main`; not marked as fork; last pushed 2026-11-01T09:55:12Z).
- **Description (repository-authored, not independently validated):** Turnkey Fire TV & Android TV setup kit: Stremio, SmartTube, TiviMate, AdGuard DoT, auto-discovery & ExoPlayer fix.
- **Live / launch URLs recorded:** https://lin4cre.github.io/firetv-kit/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Windows/desktop or setup tooling; Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.jpg`, `assets/banner.png`, `assets/banner.svg`, `docs/assets/banner.jpg`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/firetv-kit/tree/main), [releases](https://github.com/LIN4CRE/firetv-kit/releases) — 37 file paths inspected; tree truncated: False.

### LIN4CRE/Gadget-Guru-

- **Name / type:** Gadget-Guru- — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/Gadget-Guru- (default `main`; not marked as fork; last pushed 2026-08-08T21:32:14Z).
- **Description (repository-authored, not independently validated):** Gadget Building application 
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Android source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** `app/src/test/screenshots/greeting.png` Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** None identified in inspected tree.
- **Documentation:** None identified in inspected tree.
- **Missing / release gate:** README and current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/Gadget-Guru-/tree/main), [releases](https://github.com/LIN4CRE/Gadget-Guru-/releases) — 64 file paths inspected; tree truncated: False.

### LIN4CRE/karaoke-pulse

- **Name / type:** karaoke-pulse — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/karaoke-pulse (default `main`; not marked as fork; last pushed 2026-10-31T20:36:41Z).
- **Description (repository-authored, not independently validated):** 🎤 Full-stack YouTube Karaoke Studio with synced lyrics, dual-stem vocal removal, live mic reverb & pitch detection.
- **Live / launch URLs recorded:** https://lin4cre.github.io/karaoke-pulse/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.png`, `docs/assets/banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/karaoke-pulse/tree/main), [releases](https://github.com/LIN4CRE/karaoke-pulse/releases) — 26 file paths inspected; tree truncated: False.

### LIN4CRE/lad-jokes

- **Name / type:** lad-jokes — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/lad-jokes (default `main`; not marked as fork; last pushed 2026-11-01T07:11:06Z).
- **Description (repository-authored, not independently validated):** Adults-only humour commons prototype: raunchy stories, rigged-nothing polls, anonymous outrage ratings, encrypted chat, staff back room. Zero build step, zero runtime deps, 304 assertions.
- **Live / launch URLs recorded:** https://lin4cre.github.io/lad-jokes/
- **Download URL(s), newest inspected release carrying assets:** [lad-jokes-v1.0.0.tar.gz](https://github.com/LIN4CRE/lad-jokes/releases/download/v1.0.0/lad-jokes-v1.0.0.tar.gz) (v1.0.0, 302,471 bytes)
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Release asset(s) listed by GitHub; installation/functionality/completion NOT verified.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.jpg`, `assets/banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/lad-jokes/tree/main), [releases](https://github.com/LIN4CRE/lad-jokes/releases) — 55 file paths inspected; tree truncated: False.

### LIN4CRE/LadJokes

- **Name / type:** LadJokes — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/LadJokes (default `main`; not marked as fork; last pushed 2026-09-29T12:33:10Z).
- **Description (repository-authored, not independently validated):** Joke's for Blokes
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `public/banner.svg`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/LadJokes/tree/main), [releases](https://github.com/LIN4CRE/LadJokes/releases) — 41 file paths inspected; tree truncated: False.

### LIN4CRE/leadloop-uk

- **Name / type:** leadloop-uk — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/leadloop-uk (default `main`; not marked as fork; last pushed 2026-11-13T00:32:39Z).
- **Description (repository-authored, not independently validated):** Not supplied.
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** None identified in inspected tree.
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/leadloop-uk/tree/main), [releases](https://github.com/LIN4CRE/leadloop-uk/releases) — 35 file paths inspected; tree truncated: False.

### LIN4CRE/LIN4CRE-SENTINEL

- **Name / type:** LIN4CRE-SENTINEL — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/LIN4CRE-SENTINEL (default `main`; not marked as fork; last pushed 2026-11-12T18:36:13Z).
- **Description (repository-authored, not independently validated):** Local-first, evidence-backed vulnerability research operations with explicit human control. React + FastAPI + SQLite + Windows GUI setup manager.
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download URL(s), newest inspected release carrying assets:** [LIN4CRE-SENTINEL-Setup.cmd](https://github.com/LIN4CRE/LIN4CRE-SENTINEL/releases/download/v0.2.4/LIN4CRE-SENTINEL-Setup.cmd) (v0.2.4, 3,272 bytes); [LIN4CRE-SENTINEL-Setup.exe](https://github.com/LIN4CRE/LIN4CRE-SENTINEL/releases/download/v0.2.4/LIN4CRE-SENTINEL-Setup.exe) (v0.2.4, 11,883,456 bytes); [LIN4CRE-SENTINEL-Windows-Setup.zip](https://github.com/LIN4CRE/LIN4CRE-SENTINEL/releases/download/v0.2.4/LIN4CRE-SENTINEL-Windows-Setup.zip) (v0.2.4, 2,646,870 bytes)
- **Platform (source evidence, not compatibility certification):** Android source; Windows/desktop or setup tooling; Web/JS source; Python/backend tooling.
- **Actual status:** v0.2.4 Windows installer/ZIP assets exist; source and setup docs available; vulnerability workflows not executed.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `docs/images/banner.png`, `docs/images/recovery.png`
- **Documentation:** `README.md`, `audit-github-com/Accessibility/Accessibility-Audit.md`, `audit-github-com/Accessibility/fixes.md`, `audit-github-com/Assumptions-and-Gaps.md`, `audit-github-com/CSS/CSS-Audit.md`, `audit-github-com/CSS/fixes.css`, `audit-github-com/Content/Content-Audit.md` (+34 other matching paths).
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/LIN4CRE-SENTINEL/tree/main), [releases](https://github.com/LIN4CRE/LIN4CRE-SENTINEL/releases) — 162 file paths inspected; tree truncated: False.

### LIN4CRE/linacre-global-monitor

- **Name / type:** linacre-global-monitor — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/linacre-global-monitor (default `main`; fork; last pushed 2026-10-31T21:23:49Z).
- **Description (repository-authored, not independently validated):** 📡 Real-time geopolitical and environmental situational awareness dashboard. Barnsley, South Yorkshire Command Hub. Powered by NASA, USGS & Open-Meteo.
- **Live / launch URLs recorded:** https://lin4cre.github.io/linacre-global-monitor/; https://dlinacre.github.io/linacre-global-monitor/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `banner.jpg`, `banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/linacre-global-monitor/tree/main), [releases](https://github.com/LIN4CRE/linacre-global-monitor/releases) — 11 file paths inspected; tree truncated: False.

### LIN4CRE/linacre-music-videos

- **Name / type:** linacre-music-videos — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/linacre-music-videos (default `main`; not marked as fork; last pushed 2026-09-24T09:37:37Z).
- **Description (repository-authored, not independently validated):** Official high-definition master lyric videos and cinema player for Linacre
- **Live / launch URLs recorded:** /music-videos; https://lin4cre.github.io/linacre-music-videos/
- **Download URL(s), newest inspected release carrying assets:** [Barnsley.Town.mp4](https://github.com/LIN4CRE/linacre-music-videos/releases/download/v1.0.0/Barnsley.Town.mp4) (v1.0.0, 37,181,964 bytes); [Crazy.Rap.mp4](https://github.com/LIN4CRE/linacre-music-videos/releases/download/v1.0.0/Crazy.Rap.mp4) (v1.0.0, 25,980,085 bytes); [Dave.from.Barnsley.mp4](https://github.com/LIN4CRE/linacre-music-videos/releases/download/v1.0.0/Dave.from.Barnsley.mp4) (v1.0.0, 49,566,625 bytes); [Penny.You.re.Still.Here.mp4](https://github.com/LIN4CRE/linacre-music-videos/releases/download/v1.0.0/Penny.You.re.Still.Here.mp4) (v1.0.0, 47,337,999 bytes); [Skint.Dave.from.Barnsley.mp4](https://github.com/LIN4CRE/linacre-music-videos/releases/download/v1.0.0/Skint.Dave.from.Barnsley.mp4) (v1.0.0, 47,367,257 bytes); [Statistically.We.re.Fine.mp4](https://github.com/LIN4CRE/linacre-music-videos/releases/download/v1.0.0/Statistically.We.re.Fine.mp4) (v1.0.0, 28,603,367 bytes)
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Release asset(s) listed by GitHub; installation/functionality/completion NOT verified.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `covers/barnsley-town.jpg`, `covers/crazy-rap.jpg`, `covers/dave-barnsley.jpg`, `covers/jessica-hold-your-head-up.jpg`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/linacre-music-videos/tree/main), [releases](https://github.com/LIN4CRE/linacre-music-videos/releases) — 46 file paths inspected; tree truncated: False.

### LIN4CRE/linacre-osint-hud

- **Name / type:** linacre-osint-hud — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/linacre-osint-hud (default `main`; fork; last pushed 2026-10-31T21:21:57Z).
- **Description (repository-authored, not independently validated):** 🛰️ Dark glass OSINT heads-up display — 1,310 curated open-source intelligence tools from the OSINT4ALL collection, in one self-contained HTML console. Part of linacre.site.
- **Live / launch URLs recorded:** /osint; https://dlinacre.github.io/linacre-osint-hud/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** `docs/screenshot-hero.png`, `docs/screenshot-panels.png` Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.jpg`, `assets/banner.png`, `banner.jpg`, `banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/linacre-osint-hud/tree/main), [releases](https://github.com/LIN4CRE/linacre-osint-hud/releases) — 20 file paths inspected; tree truncated: False.

### LIN4CRE/linacre-wallpaper

- **Name / type:** linacre-wallpaper — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/linacre-wallpaper (default `main`; fork; last pushed 2026-10-31T21:10:45Z).
- **Description (repository-authored, not independently validated):** Linacre System Monitor Wallpaper — real-time CPU/GPU/RAM/network live wallpaper (Lively Wallpaper native), dual-monitor, linacre.site theme, ⌘K command palette.
- **Live / launch URLs recorded:** https://lin4cre.github.io/linacre-wallpaper/; https://dlinacre.github.io/linacre-wallpaper/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Windows/desktop or setup tooling; Web/JS source; Python/backend tooling.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.jpg`, `assets/banner.png`, `docs/assets/banner.jpg`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/linacre-wallpaper/tree/main), [releases](https://github.com/LIN4CRE/linacre-wallpaper/releases) — 51 file paths inspected; tree truncated: False.

### LIN4CRE/linacre.site

- **Name / type:** linacre.site — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/linacre.site (default `main`; fork; last pushed 2026-11-05T11:54:34Z).
- **Description (repository-authored, not independently validated):** 🌐 linacre.site — David Linacre personal software engineering portfolio, project showcase, and technical blog.
- **Live / launch URLs recorded:** https://dlinacre.github.io/linacre.site/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** `public/assets/screenshot-gameplay.webp`, `public/assets/screenshot-leaderboard.webp`, `public/assets/screenshot-pets.webp`, `public/assets/screenshot-rebirth.webp`, `public/assets/screenshot-settings.webp`, `public/showcase/cubelab.webp` (+8 more screenshot/preview-named candidates). Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `.github/banner.png`, `.github/banner.svg`, `banner.png`, `public/banners/1files.jpg`
- **Documentation:** `AUDIT.md`, `PROJECT_IMPROVEMENT_ROADMAP.md`, `README.md`, `mcp/README.md`, `public/banners/arena-audit.webp`, `public/games/data/status.json`, `public/projects/a-audit.webp` (+5 other matching paths).
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/linacre.site/tree/main), [releases](https://github.com/LIN4CRE/linacre.site/releases) — 721 file paths inspected; tree truncated: False.

### LIN4CRE/LinacreUninstaller

- **Name / type:** LinacreUninstaller — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/LinacreUninstaller (default `main`; fork; last pushed 2026-10-31T21:04:20Z).
- **Description (repository-authored, not independently validated):** Android uninstaller and debloat review tool with a fixed launcher entry, polished Material dark UI, safety tiers, and guided uninstall flow.
- **Live / launch URLs recorded:** https://lin4cre.github.io/LinacreUninstaller/; https://dlinacre.github.io/LinacreUninstaller/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Android source; Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.jpg`, `assets/banner.png`, `banner.png`
- **Documentation:** `README.md`, `gradle-8.5/README`, `gradle-8.5/init.d/readme.txt`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/LinacreUninstaller/tree/main), [releases](https://github.com/LIN4CRE/LinacreUninstaller/releases) — 321 file paths inspected; tree truncated: False.

### LIN4CRE/N8Ns

- **Name / type:** N8Ns — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/N8Ns (default `main`; not marked as fork; last pushed 2026-10-02T20:32:59Z).
- **Description (repository-authored, not independently validated):** N8Ns workflows for TikTok 
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Windows/desktop or setup tooling; Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** `assets/screenshots/analytics_matrix.png`, `assets/screenshots/api_specs.png`, `assets/screenshots/schedule_queue.png`, `assets/screenshots/simulator_modal.png`, `assets/screenshots/workflow_canvas.png` Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/N8Ns/tree/main), [releases](https://github.com/LIN4CRE/N8Ns/releases) — 60 file paths inspected; tree truncated: False.

### LIN4CRE/NXAndroid

- **Name / type:** NXAndroid — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/NXAndroid (default `main`; not marked as fork; last pushed 2026-10-28T16:20:58Z).
- **Description (repository-authored, not independently validated):** NX
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Android source; Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** None identified in inspected tree.
- **Documentation:** `README.md`, `docs/ARCHITECTURE_AUDIT.md`, `src/components/ReadmeView.tsx`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/NXAndroid/tree/main), [releases](https://github.com/LIN4CRE/NXAndroid/releases) — 90 file paths inspected; tree truncated: False.

### LIN4CRE/OnlyTok

- **Name / type:** OnlyTok — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/OnlyTok (default `main`; not marked as fork; last pushed 2026-11-04T21:56:37Z).
- **Description (repository-authored, not independently validated):** OnlyTokGirls website 
- **Live / launch URLs recorded:** https://onlytok.uk
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `public/images/onlytok_video_dance_cover_1793722898857.jpg`, `public/images/onlytok_video_fashion_cover_1793722898133.jpg`, `public/images/onlytok_video_music_cover_1793722899627.jpg`, `src/assets/images/onlytok_video_dance_cover_1793722898857.jpg`
- **Documentation:** None identified in inspected tree.
- **Missing / release gate:** README and current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/OnlyTok/tree/main), [releases](https://github.com/LIN4CRE/OnlyTok/releases) — 85 file paths inspected; tree truncated: False.

### LIN4CRE/Pok-Flip-AI

- **Name / type:** Pok-Flip-AI — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/Pok-Flip-AI (default `main`; fork; last pushed 2026-10-31T20:58:54Z).
- **Description (repository-authored, not independently validated):** 🃏 PokéFlip AI — Intelligent collectible card pricing index, condition analyzer, and market prediction engine.
- **Live / launch URLs recorded:** https://pok-flip-ai.vercel.app/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Android source; Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.jpg`, `assets/banner.png`, `public/github-banner.svg`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/Pok-Flip-AI/tree/main), [releases](https://github.com/LIN4CRE/Pok-Flip-AI/releases) — 46 file paths inspected; tree truncated: False.

### LIN4CRE/Powerful-websites

- **Name / type:** Powerful-websites — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/Powerful-websites (default `main`; not marked as fork; last pushed 2026-11-13T22:14:52Z).
- **Description (repository-authored, not independently validated):** Powerful websites you should know. No login required.
- **Live / launch URLs recorded:** https://powerful-websites-six.vercel.app
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** None identified in inspected tree.
- **Documentation:** `README.md`, `src/hooks/useOnlineStatus.ts`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/Powerful-websites/tree/main), [releases](https://github.com/LIN4CRE/Powerful-websites/releases) — 151 file paths inspected; tree truncated: False.

### LIN4CRE/Quotes

- **Name / type:** Quotes — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/Quotes (default `main`; not marked as fork; last pushed 2026-11-14T15:49:35Z).
- **Description (repository-authored, not independently validated):** Inspirational quotes 
- **Live / launch URLs recorded:** https://lin4cre-quotes.vercel.app
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** `docs/screenshots/desktop-about.png`, `docs/screenshots/desktop-advice.png`, `docs/screenshots/desktop-category.png`, `docs/screenshots/desktop-collection-detail.png`, `docs/screenshots/desktop-collections.png`, `docs/screenshots/desktop-explore.png` (+12 more screenshot/preview-named candidates). Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `public/og-image.png`
- **Documentation:** `README.md`, `docs/branding/README.md`, `src/components/layout/StatusBanners.tsx`, `src/hooks/useOnlineStatus.ts`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/Quotes/tree/main), [releases](https://github.com/LIN4CRE/Quotes/releases) — 155 file paths inspected; tree truncated: False.

### LIN4CRE/Ramsey-Hunt-Syndrome-Awareness

- **Name / type:** Ramsey-Hunt-Syndrome-Awareness — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/Ramsey-Hunt-Syndrome-Awareness (default `main`; not marked as fork; last pushed 2026-11-01T13:12:44Z).
- **Description (repository-authored, not independently validated):** Help raise awareness for Ramsey Hunt Syndrome.
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** None identified in inspected tree.
- **Documentation:** `ramsay-hunt-awareness/README.md`, `ramsay-hunt-awareness/approved-for-publication/README.md`, `src/components/AuditReportModal.tsx`, `src/components/AutomationStatusBar.tsx`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/Ramsey-Hunt-Syndrome-Awareness/tree/main), [releases](https://github.com/LIN4CRE/Ramsey-Hunt-Syndrome-Awareness/releases) — 82 file paths inspected; tree truncated: False.

### LIN4CRE/Recompa

- **Name / type:** Recompa — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/Recompa (default `main`; not marked as fork; last pushed 2026-11-23T21:09:19Z).
- **Description (repository-authored, not independently validated):** Not supplied.
- **Live / launch URLs recorded:** https://recompa.vercel.app
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/brand/banner.svg`
- **Documentation:** `README.md`, `docs/AUDIT-2026-11-05-followup.md`, `docs/AUDIT-2026-11-05.md`, `docs/TECHNOLOGY-AUDIT.md`, `public/cores/mgba/README.upstream.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/Recompa/tree/main), [releases](https://github.com/LIN4CRE/Recompa/releases) — 153 file paths inspected; tree truncated: False.

### LIN4CRE/Recompstation

- **Name / type:** Recompstation — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/Recompstation (default `main`; not marked as fork; last pushed 2026-11-04T20:38:37Z).
- **Description (repository-authored, not independently validated):** Recomp roms
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Windows/desktop or setup tooling; Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `public/banner.jpg`, `public/github-banner.jpg`, `public/recompstation-banner.jpg`, `release/RecompStation-win-x64/app/banner.jpg`
- **Documentation:** `README.md`, `release/RecompStation-win-x64/README.txt`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/Recompstation/tree/main), [releases](https://github.com/LIN4CRE/Recompstation/releases) — 90 file paths inspected; tree truncated: False.

### LIN4CRE/retro-arcade-vault

- **Name / type:** retro-arcade-vault — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/retro-arcade-vault (default `main`; not marked as fork; last pushed 2026-11-01T09:45:48Z).
- **Description (repository-authored, not independently validated):** 🕹️ Sleek retro gaming vault & web player preloaded with 63+ classic PS1, GBA, NDS, SNES, and Sega Genesis titles, box artwork, and CRT shaders.
- **Live / launch URLs recorded:** https://lin4cre.github.io/retro-arcade-vault/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.svg`, `assets/covers/advance-wars-2.svg`, `assets/covers/advance-wars.svg`, `assets/covers/bo1-zombies.svg`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/retro-arcade-vault/tree/main), [releases](https://github.com/LIN4CRE/retro-arcade-vault/releases) — 37 file paths inspected; tree truncated: False.

### LIN4CRE/skipr

- **Name / type:** skipr — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/skipr (default `main`; not marked as fork; last pushed 2026-11-01T09:48:00Z).
- **Description (repository-authored, not independently validated):** ⚡ Auto-skip intros, outros & recaps seamlessly for Stremio on Android TV, Fire TV, and Desktop.
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `public/assets/banner.jpg`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/skipr/tree/main), [releases](https://github.com/LIN4CRE/skipr/releases) — 36 file paths inspected; tree truncated: False.

### LIN4CRE/SpeedRead

- **Name / type:** SpeedRead — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/SpeedRead (default `main`; not marked as fork; last pushed 2026-11-06T04:56:32Z).
- **Description (repository-authored, not independently validated):** Read faster 
- **Live / launch URLs recorded:** https://lin4cre.github.io/SpeedRead/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Public reader UI retrieved at 600 WPM; reading/import/offline not exercised.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `docs/banner.svg`, `public/banner.svg`
- **Documentation:** `README.md`, `ROADMAP.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/SpeedRead/tree/main), [releases](https://github.com/LIN4CRE/SpeedRead/releases) — 118 file paths inspected; tree truncated: False.

### LIN4CRE/tabulous-games

- **Name / type:** tabulous-games — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/tabulous-games (default `main`; not marked as fork; last pushed 2026-11-02T19:59:54Z).
- **Description (repository-authored, not independently validated):** 🎮 The Curated Browser Gaming Vault — 23 Classic 3D PC ports, shooters, zombies co-op, and WebAssembly games running in your browser.
- **Live / launch URLs recorded:** /games; https://lin4cre.github.io/tabulous-games/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/brand/banner-1600x400.png`, `assets/brand/banner.svg`, `assets/brand/og-image.png`, `assets/covers/ace-combat-6.jpg`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/tabulous-games/tree/main), [releases](https://github.com/LIN4CRE/tabulous-games/releases) — 112 file paths inspected; tree truncated: False.

### LIN4CRE/whole-home-adblocker

- **Name / type:** whole-home-adblocker — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/whole-home-adblocker (default `main`; fork; last pushed 2026-10-31T21:08:29Z).
- **Description (repository-authored, not independently validated):** One-click whole-home network ad blocker for Windows - AdGuard Home in Docker with a friendly setup wizard, live dashboard and preloaded blocklists
- **Live / launch URLs recorded:** https://lin4cre.github.io/whole-home-adblocker/; https://dlinacre.github.io/whole-home-adblocker/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Windows/desktop or setup tooling; Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.jpg`, `assets/banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/whole-home-adblocker/tree/main), [releases](https://github.com/LIN4CRE/whole-home-adblocker/releases) — 27 file paths inspected; tree truncated: False.

### LIN4CRE/Youtube-Lyrics

- **Name / type:** Youtube-Lyrics — project / software, tooling or content repository.
- **Repository:** https://github.com/LIN4CRE/Youtube-Lyrics (default `main`; not marked as fork; last pushed 2026-11-14T16:02:40Z).
- **Description (repository-authored, not independently validated):** Not supplied.
- **Live / launch URLs recorded:** https://youtube-lyrics-seven.vercel.app
- **Download URL(s), newest inspected release carrying assets:** [release.json](https://github.com/LIN4CRE/Youtube-Lyrics/releases/download/v1.4.0/release.json) (v1.4.0, 293 bytes); [YoutubeLyrics.exe](https://github.com/LIN4CRE/Youtube-Lyrics/releases/download/v1.4.0/YoutubeLyrics.exe) (v1.4.0, 875,008 bytes); [YoutubeLyrics.exe.sha256](https://github.com/LIN4CRE/Youtube-Lyrics/releases/download/v1.4.0/YoutubeLyrics.exe.sha256) (v1.4.0, 84 bytes)
- **Platform (source evidence, not compatibility certification):** Windows/desktop or setup tooling; Web/JS source.
- **Actual status:** Release asset(s) listed by GitHub; installation/functionality/completion NOT verified.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `banner.png`, `docs/brand/banner.png`
- **Documentation:** `AUDIT.md`, `README.md`, `src/win/wallpapers/README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/Youtube-Lyrics/tree/main), [releases](https://github.com/LIN4CRE/Youtube-Lyrics/releases) — 86 file paths inspected; tree truncated: False.

## In-repository software not represented by a separate discovered repo

| Name | Type / platform | Repo/source and launch | Status / independent evidence | Images/docs / missing |
|---|---|---|---|---|
| Browser toolbox / QuickToolsDeck | Browser software | This repo; App's Daily Tools tab; static `public/tools/` | Source/UI exists; utilities not individually end-to-end tested | README + component source; capture and input/error tests needed |
| AI Lab / developer playground | Browser + provider/API code | `src/components/Lab.tsx`, `DevPlayground.tsx`, `api/server.ts`; legacy `/lab` metadata | Not mounted by current App; cannot treat route metadata as service availability | `.env.example`, README; auth/security, budgets and privacy review required |
| MCP toolbox | Node stdio software | `mcp/`, source in this repo; no public download verified | Local TypeScript build and supplied stdio harness pass; separate lockfile has 9 advisories | `mcp/README.md`; no GUI screenshot expected; actual client compatibility and secure release needed |
| Identity/emblem tools | Browser software | `IdentityHub.tsx` + renderer modules | Legacy component; not mounted by App | Source/docs; SVG trust boundary and export tests needed |
| Proper Mad player | Browser media application | `CyberAudioPlayer.tsx` + `src/data/musicTracks.ts`; current Music tab | UI code exists, playback not exercised; hidden tabs stay mounted | Media availability, licences, playback/accessibility tests needed |
| Local Rig deck | Personal dashboard | `LocalRigDeck.tsx`, App Local Rig tab | Automatically probes visitor localhost; not a public studio backend; no-cors cannot establish healthy service | Source only; remove from public presentation or isolate explicitly local-only |
| Ops HUD | Browser status UI / generated receipt | `OpsHUD.tsx`, `src/config/operations.ts`, `scripts/write-ops-status.mjs` | Two component tests pass; build receipt correctly does not certify deployment or runtime | Documentation and real source-scoped telemetry needed |

## Download policy recommendation

Show only actual application assets with platform, version, release date, signature/checksum provenance and installation instructions. A releases page with no files is not a working download. Debug APKs need a prominent test-build label; `.rbxlx` needs “Open in Roblox Studio”; source archives need “Source”, not “Install”. Windows and Android binaries were not executed in this Linux audit environment. Keep unfinished applications in an explicitly labelled development section only if there is a useful honest demonstration.
