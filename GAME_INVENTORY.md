# Game inventory

**Follow-up:** The Games rebuild and scoped functional testing are documented in [GAME_VERIFICATION.md](GAME_VERIFICATION.md). Eight local browser builds now have real input tests and gameplay captures; seven additional source prototypes are explicitly unpublished. The findings below remain the original audit snapshot, not a claim that those earlier missing checks are still all missing.

Audit date: **2026-11-25 UTC**. Source baseline: `DLinacre/linacre.site` at `d9b98a0084eff3a11a750f604cb658e54b95aaeb`; additional read-only research of `LIN4CRE/linacre.site` main `c92645cdc3e2e16b69731fa53c1ff095d111727a` and public repositories on both accounts. See WEBSITE_AUDIT.md for deployment/source divergence and limitations.

**Evidence rules:** “Page retrieved” means publicly reachable HTML/UI text, not working gameplay/application logic. “Asset exists” means GitHub release metadata lists that exact file, not that the download was installed, signature-checked or malware-scanned. “Source exists” is not “finished”. Platform labels derive from source paths and require real-device verification. Screenshots and artwork are separate: filename matches are candidates, not authenticated captures. Completion/maintenance cannot be inferred from repository freshness. Dates and links are a point-in-time record.

Repository coverage: all **54 LIN4CRE + 58 DLinacre = 112 public repositories** were enumerated via authenticated GitHub API, with recursive trees, README contents (where supplied) and up to 10 releases per repository. Forks are retained as separate records to avoid assuming identical source/deployments. Private, deleted, inaccessible and local-only work cannot be exhaustively discovered. No private account material was inventoried.

## Classification and recommended presentation

- Original-code browser candidates: the seven local games below, AFTERGLOW, KushCloud, AeroFlap, Pixel Heist, Dragon Rush Heroes and DigiPoke. “Original code” still requires asset/IP review; especially do not assume licensed anime/creature content.
- Unreleased/source candidates: Frostpine, Gyroll, Daves-Dash-, MmoSnake, PulseRider and LineRider. Do not turn repository descriptions into Play buttons.
- Template: Slime Factory Tycoon is a Roblox Studio download, not a published Roblox experience.
- Wrapper/port: PixelPokeArena is an unofficial WebView host; Android-all-stars and Digimon repositories depend on third-party games/platforms. Do not present the underlying games as LIN4CRE originals.
- Directories/platforms: Tabulous Games, Retro Arcade Vault, EMULATED, Recompa/Recompstation and BuildingBux belong to project/tooling assessment, not an original-games release count (see PROJECT_INVENTORY.md).

## Seven self-hosted browser games

All seven have real `public/games/<slug>.html` + `.js` files in this checkout. A local Chromium smoke test against the production build retrieved each `.html` URL with HTTP 200, a game-specific title and controls, with **no page-script errors**. This is independent **boot verification only**, not win/loss, saves, touch, audio or accessibility verification. Clean `/games/<slug>` rewrites are in `vercel.json`; Vite preview does not emulate Vercel rewrites.

| Name | Repository / live URL | Platform / status | Download | Images / documentation | Verification / missing |
| ---- | --------------------- | ----------------- | -------- | ---------------------- | ---------------------- |

| Circuit | [site source](https://github.com/DLinacre/linacre.site/blob/main/public/games/circuit.js); https://www.linacre.site/games/circuit | Browser JS; locally bootable implementation | None offered; HTML/JS are source/runtime, not packaged release | `public/banners/circuit.webp`; in-game controls/instructions and source; no authenticated gameplay capture established | Local boot verified; public UI retrieved too; completion/saves/touch/audio/offline and dated capture missing |
| Decrypt | [site source](https://github.com/DLinacre/linacre.site/blob/main/public/games/decrypt.js); https://www.linacre.site/games/decrypt | Browser JS; locally bootable implementation | None offered; HTML/JS are source/runtime, not packaged release | `public/banners/decrypt.webp`; in-game controls/instructions and source; no authenticated gameplay capture established | Local boot verified; public UI retrieved too; completion/saves/touch/audio/offline and dated capture missing |
| Gridlock | [site source](https://github.com/DLinacre/linacre.site/blob/main/public/games/gridlock.js); https://www.linacre.site/games/gridlock | Browser JS; locally bootable implementation | None offered; HTML/JS are source/runtime, not packaged release | `public/banners/gridlock.webp`; in-game controls/instructions and source; no authenticated gameplay capture established | Local boot verified; public UI retrieved too; completion/saves/touch/audio/offline and dated capture missing |
| Pulse | [site source](https://github.com/DLinacre/linacre.site/blob/main/public/games/pulse.js); https://www.linacre.site/games/pulse | Browser JS; locally bootable implementation | None offered; HTML/JS are source/runtime, not packaged release | `public/banners/pulse.webp`; in-game controls/instructions and source; no authenticated gameplay capture established | Local boot verified; live endpoint not rechecked; completion/saves/touch/audio/offline and dated capture missing |
| Trigger | [site source](https://github.com/DLinacre/linacre.site/blob/main/public/games/trigger.js); https://www.linacre.site/games/trigger | Browser JS; locally bootable implementation | None offered; HTML/JS are source/runtime, not packaged release | `public/banners/trigger.webp`; in-game controls/instructions and source; no authenticated gameplay capture established | Local boot verified; live endpoint not rechecked; completion/saves/touch/audio/offline and dated capture missing |
| Tiles | [site source](https://github.com/DLinacre/linacre.site/blob/main/public/games/tiles.js); https://www.linacre.site/games/tiles | Browser JS; locally bootable implementation | None offered; HTML/JS are source/runtime, not packaged release | `public/banners/tiles.webp`; in-game controls/instructions and source; no authenticated gameplay capture established | Local boot verified; live endpoint not rechecked; completion/saves/touch/audio/offline and dated capture missing |
| Mines | [site source](https://github.com/DLinacre/linacre.site/blob/main/public/games/mines.js); https://www.linacre.site/games/mines | Browser JS; locally bootable implementation | None offered; HTML/JS are source/runtime, not packaged release | `public/banners/mines.webp`; in-game controls/instructions and source; no authenticated gameplay capture established | Local boot verified; live endpoint not rechecked; completion/saves/touch/audio/offline and dated capture missing |

## Associated game repositories

### DLinacre/afterglow

- **Name / type:** afterglow — game / game-related development.
- **Repository:** https://github.com/DLinacre/afterglow (default `main`; not marked as fork; last pushed 2026-09-12T21:07:50Z).
- **Description (repository-authored, not independently validated):** Paint with long-exposure light — a novel, endless HTML5 light-painting game. Steer glowing lights to burn shimmering trails onto a night sky.
- **Live / launch URLs recorded:** https://dlinacre.github.io/afterglow/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Public canvas UI controls retrieved; painting, saving and progression not exercised.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/afterglow/tree/main), [releases](https://github.com/DLinacre/afterglow/releases) — 12 file paths inspected; tree truncated: False.

### DLinacre/dragon-rush-heroes

- **Name / type:** dragon-rush-heroes — game / game-related development.
- **Repository:** https://github.com/DLinacre/dragon-rush-heroes (default `main`; not marked as fork; last pushed 2026-09-19T13:12:37Z).
- **Description (repository-authored, not independently validated):** 🚀 An original anime action-RPG card battler — 464 fighters, real-time Arts combat, provably-fair summons. 100% free forever: no purchases, no ads, no energy gates. Zero runtime dependencies.
- **Live / launch URLs recorded:** https://dlinacre.github.io/dragon-rush-heroes/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Public signup/instant-play UI retrieved; combat, fighter count and sync not exercised.
- **Existing screenshots:** `docs/screenshots/combat.webp`, `docs/screenshots/dashboard.webp`, `docs/screenshots/roster.webp`, `docs/screenshots/summon-reveal.webp` Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `docs/banner.webp`, `public/og-image.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/dragon-rush-heroes/tree/main), [releases](https://github.com/DLinacre/dragon-rush-heroes/releases) — 73 file paths inspected; tree truncated: False.

### DLinacre/kush-flap

- **Name / type:** kush-flap — game / game-related development.
- **Repository:** https://github.com/DLinacre/kush-flap (default `main`; not marked as fork; last pushed 2026-09-29T15:55:01Z).
- **Description (repository-authored, not independently validated):** Float the leaf. Dodge the stalks. High-FPS chill arcade runner with responsive calibration, stages, and dynamic audio.
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.png`, `banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/kush-flap/tree/main), [releases](https://github.com/DLinacre/kush-flap/releases) — 12 file paths inspected; tree truncated: False.

### DLinacre/KushCloud

- **Name / type:** KushCloud — game / game-related development.
- **Repository:** https://github.com/DLinacre/KushCloud (default `main`; not marked as fork; last pushed 2026-10-09T09:54:57Z).
- **Description (repository-authored, not independently validated):** KushCloud 🌿 — A chill one-tap arcade flyer. Flappy Bird-style game with synthesised audio, unlockable cosmetics & power-ups. Built with React, TypeScript & Vite.
- **Live / launch URLs recorded:** https://dlinacre.github.io/KushCloud/
- **Download URL(s), newest inspected release carrying assets:** [app-debug.apk](https://github.com/DLinacre/KushCloud/releases/download/v3.3.0/app-debug.apk) (v3.3.0, 4,343,265 bytes); [app-release-unsigned.apk](https://github.com/DLinacre/KushCloud/releases/download/v3.3.0/app-release-unsigned.apk) (v3.3.0, 3,297,079 bytes)
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Release asset(s) listed by GitHub; installation/functionality/completion NOT verified.
- **Can launch / independently verified:** Public page retrieved: Play control and instructions present; gameplay/cloud leaderboard not exercised.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `.github/banner.png`, `banner.png`, `public/banner.png`
- **Documentation:** `AUDIT_REPORT.md`, `README.md`, `docs/ROADMAP.md`, `src/hooks/useOnlineStatus.ts`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/KushCloud/tree/main), [releases](https://github.com/DLinacre/KushCloud/releases) — 101 file paths inspected; tree truncated: False.

### DLinacre/pixel-heist

- **Name / type:** pixel-heist — game / game-related development.
- **Repository:** https://github.com/DLinacre/pixel-heist (default `main`; not marked as fork; last pushed 2026-09-12T21:07:26Z).
- **Description (repository-authored, not independently validated):** 🚀 Pixel Heist - Tactical Stealth Infiltration Puzzle Web Game & Modular Monolith (Next.js 15 + Phaser 3 + TypeScript)
- **Live / launch URLs recorded:** https://dlinacre.github.io/pixel-heist/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Public briefing UI retrieved; date shown is 2026-07-28, stale relative to audit date; gameplay not exercised.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** None identified in inspected tree.
- **Documentation:** `README.md`, `docs/audit-github-com/Accessibility/skip-link-snippet.tsx`, `docs/audit-github-com/Assumptions-and-Gaps.md`, `docs/audit-github-com/CSS/globals-cyber-theme.css`, `docs/audit-github-com/Content/store-listing-rewrites.md`, `docs/audit-github-com/Design/tailwind-theme-tokens.ts`, `docs/audit-github-com/Developer-Tasks.md` (+12 other matching paths).
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/pixel-heist/tree/main), [releases](https://github.com/DLinacre/pixel-heist/releases) — 63 file paths inspected; tree truncated: False.

### DLinacre/PixelPokeArena

- **Name / type:** PixelPokeArena — game / game-related development.
- **Repository:** https://github.com/DLinacre/PixelPokeArena (default `main`; not marked as fork; last pushed 2026-09-12T21:06:35Z).
- **Description (repository-authored, not independently validated):** PixelPoke Arena - a native Android app (WebView wrapper) for the PixelPoke Arena web battle-royale, packaged as an installable APK.
- **Live / launch URLs recorded:** https://dlinacre.github.io/PixelPokeArena/
- **Download URL(s), newest inspected release carrying assets:** [PixelPokeArena.apk](https://github.com/DLinacre/PixelPokeArena/releases/download/v1.0.0/PixelPokeArena.apk) (v1.0.0, 282,364 bytes)
- **Platform (source evidence, not compatibility certification):** Android source; Web/JS source.
- **Actual status:** Released unofficial Android WebView wrapper, NOT an original battle-royale engine. v1.0.0 APK asset exists; underlying third-party service not verified.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `artwork/banner.png`, `artwork/icon.png`, `artwork/logo.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/PixelPokeArena/tree/main), [releases](https://github.com/DLinacre/PixelPokeArena/releases) — 27 file paths inspected; tree truncated: False.

### DLinacre/slime-factory-tycoon

- **Name / type:** slime-factory-tycoon — game / game-related development.
- **Repository:** https://github.com/DLinacre/slime-factory-tycoon (default `main`; not marked as fork; last pushed 2026-10-01T19:30:43Z).
- **Description (repository-authored, not independently validated):** 🟢 Production-ready open-source Roblox idle-tycoon template. Server-authoritative Luau, session-locked DataStores, idempotent receipts, mobile-first UI built in code, and a CI balance simulator.
- **Live / launch URLs recorded:** https://dlinacre.github.io/slime-factory-tycoon/
- **Download URL(s), newest inspected release carrying assets:** [SlimeFactoryTycoon-v0.3.0.rbxlx](https://github.com/DLinacre/slime-factory-tycoon/releases/download/v0.3.0/SlimeFactoryTycoon-v0.3.0.rbxlx) (v0.3.0, 130,025 bytes)
- **Platform (source evidence, not compatibility certification):** Web/JS source; Roblox/Studio.
- **Actual status:** Roblox development/template distribution: v0.3.0 .rbxlx asset exists. Local manifest says not published to Roblox; no public Roblox experience verified.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** `assets/screenshot-gameplay.png`, `assets/screenshot-gameplay.webp`, `assets/screenshot-leaderboard.png`, `assets/screenshot-leaderboard.webp`, `assets/screenshot-pets.png`, `assets/screenshot-pets.webp` (+4 more screenshot/preview-named candidates). Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `assets/banner.png`, `assets/banner.webp`
- **Documentation:** `QUICKSTART.md`, `README.md`, `audit/Accessibility/axe-report.md`, `audit/Assumptions-and-Gaps.md`, `audit/Content/copy-rewrites.md`, `audit/Content/release-notes-v0.3.0.md`, `audit/Design/ui-recommendations.md` (+17 other matching paths).
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/slime-factory-tycoon/tree/main), [releases](https://github.com/DLinacre/slime-factory-tycoon/releases) — 114 file paths inspected; tree truncated: False.

### DLinacre/tap-and-slap

- **Name / type:** tap-and-slap — game / game-related development.
- **Repository:** https://github.com/DLinacre/tap-and-slap (default `main`; not marked as fork; last pushed 2026-09-12T21:12:06Z).
- **Description (repository-authored, not independently validated):** Dance-mat beat 'em up — tap to kill enemies on the beat. Next.js 15 + Phaser 3 + TypeScript monolith with procedural synthwave fight music.
- **Live / launch URLs recorded:** https://tap-and-slap.vercel.app; https://dlinacre.github.io/tap-and-slap/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Catalogue Vercel URL retrieval failed; not proven dead. Repository Pages URL not tested.
- **Existing screenshots:** `screenshots/gameplay.png`, `screenshots/menu.png`, `screenshots/mobile-menu.png`, `screenshots/pause.png`, `screenshots/results.png`, `screenshots/v1.2-gameplay.png` (+2 more screenshot/preview-named candidates). Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `banner.jpg`, `public/images/og-cover.jpg`
- **Documentation:** `README.md`, `audit/Accessibility/readme.md`, `audit/Assumptions-and-Gaps.md`, `audit/CSS/accessibility.css`, `audit/Content/readme.md`, `audit/DEPLOYMENT-STATUS.md`, `audit/Design/readme.md` (+16 other matching paths).
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/DLinacre/tap-and-slap/tree/main), [releases](https://github.com/DLinacre/tap-and-slap/releases) — 166 file paths inspected; tree truncated: False.

### LIN4CRE/AeroFlap

- **Name / type:** AeroFlap — game / game-related development.
- **Repository:** https://github.com/LIN4CRE/AeroFlap (default `main`; not marked as fork; last pushed 2026-09-24T19:23:08Z).
- **Description (repository-authored, not independently validated):** Flappy birds game
- **Live / launch URLs recorded:** https://LIN4CRE.github.io/AeroFlap/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Substantial React game/profile/settings source and README exist; App.tsx inspected. Listed Pages endpoint retrieval failed; launchability unconfirmed.
- **Can launch / independently verified:** Catalogue URL retrieval failed; HTTP status/root cause not supplied by fetch tool. Not proven dead.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `banner.png`, `public/banner.png`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/AeroFlap/tree/main), [releases](https://github.com/LIN4CRE/AeroFlap/releases) — 41 file paths inspected; tree truncated: False.

### LIN4CRE/Android-all-stars

- **Name / type:** Android-all-stars — game / game-related development.
- **Repository:** https://github.com/LIN4CRE/Android-all-stars (default `main`; not marked as fork; last pushed 2026-11-12T20:13:00Z).
- **Description (repository-authored, not independently validated):** Mario All Stars (my favourite game for the Super Nintendo) for Android
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Android source; Windows/desktop or setup tooling.
- **Actual status:** Explicit WIP: README says no app to install, Android project does not build and has not run on a phone. Desktop test claims not rerun.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** `docs/preview/hub.png`, `docs/preview/pause-menu.png`, `docs/preview/play-touch.png` Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** None identified in inspected tree.
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/Android-all-stars/tree/main), [releases](https://github.com/LIN4CRE/Android-all-stars/releases) — 130 file paths inspected; tree truncated: False.

### LIN4CRE/Daves-Dash-

- **Name / type:** Daves-Dash- — game / game-related development.
- **Repository:** https://github.com/LIN4CRE/Daves-Dash- (default `main`; not marked as fork; last pushed 2026-11-01T19:27:59Z).
- **Description (repository-authored, not independently validated):** Geometry Dash Game
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** GameCanvas, physics, renderer, levels/editor and physics test source exist; no README/release/homepage. Source prototype; completion unknown.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** None identified in inspected tree.
- **Documentation:** None identified in inspected tree.
- **Missing / release gate:** README and current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/Daves-Dash-/tree/main), [releases](https://github.com/LIN4CRE/Daves-Dash-/releases) — 28 file paths inspected; tree truncated: False.

### LIN4CRE/Digimon-World-3

- **Name / type:** Digimon-World-3 — game / game-related development.
- **Repository:** https://github.com/LIN4CRE/Digimon-World-3 (default `main`; not marked as fork; last pushed 2026-11-02T17:39:41Z).
- **Description (repository-authored, not independently validated):** Instant FREE playable game.
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Repository is now documented as PSXpress: emulator/disc-analysis platform requiring user-owned disc input, not an independently released original Digimon game.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** None identified in inspected tree.
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/Digimon-World-3/tree/main), [releases](https://github.com/LIN4CRE/Digimon-World-3/releases) — 43 file paths inspected; tree truncated: False.

### LIN4CRE/Digimon-World-4

- **Name / type:** Digimon-World-4 — game / game-related development.
- **Repository:** https://github.com/LIN4CRE/Digimon-World-4 (default `main`; not marked as fork; last pushed 2026-11-01T02:29:14Z).
- **Description (repository-authored, not independently validated):** Android friendly
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source-only assessment; README absent; no listed release/homepage. Do not present as finished/playable.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** `public/screenshots/jogo.jpg`, `public/screenshots/jogo2.jpg`, `public/screenshots/titulo.jpg` Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** None identified in inspected tree.
- **Documentation:** None identified in inspected tree.
- **Missing / release gate:** README and current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/Digimon-World-4/tree/main), [releases](https://github.com/LIN4CRE/Digimon-World-4/releases) — 67 file paths inspected; tree truncated: False.

### LIN4CRE/DigimonWorld1Web

- **Name / type:** DigimonWorld1Web — game / game-related development.
- **Repository:** https://github.com/LIN4CRE/DigimonWorld1Web (default `main`; not marked as fork; last pushed 2026-11-05T16:23:27Z).
- **Description (repository-authored, not independently validated):** 🦖 Playable 2x Neon HD Web Edition of Digimon World 1 (SLES-02914) with all 127 Digimon (including 66 Overworld, Boss & Cut Digimon) unlocked via binary PS1 ROM & MMD patches
- **Live / launch URLs recorded:** https://digimon-world-1-web.vercel.app/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Third-party-IP web port/mod described in README; no release asset inspected. Homepage exists in metadata but not tested here; rights and gameplay unresolved.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `public/assets/github-banner.svg`
- **Documentation:** `README.md`, `public/bios/README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/DigimonWorld1Web/tree/main), [releases](https://github.com/LIN4CRE/DigimonWorld1Web/releases) — 158 file paths inspected; tree truncated: False.

### LIN4CRE/digipoke

- **Name / type:** digipoke — game / game-related development.
- **Repository:** https://github.com/LIN4CRE/digipoke (default `main`; not marked as fork; last pushed 2026-09-08T09:25:39Z).
- **Description (repository-authored, not independently validated):** DigiPoke — a local-first creature-collecting battler PWA with optional end-to-end encrypted sync.
- **Live / launch URLs recorded:** https://lin4cre.github.io/digipoke/
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Source exists; no downloadable release asset in the latest up-to-10 releases inspected. Completion unknown, not a verified finished product.
- **Can launch / independently verified:** Public onboarding retrieved, redirected to #/onboarding; battle/offline/sync not exercised.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `.github/assets/banner.png`, `.github/assets/banner.svg`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/digipoke/tree/main), [releases](https://github.com/LIN4CRE/digipoke/releases) — 71 file paths inspected; tree truncated: False.

### LIN4CRE/Frostpine

- **Name / type:** Frostpine — game / game-related development.
- **Repository:** https://github.com/LIN4CRE/Frostpine (default `main`; not marked as fork; last pushed 2026-10-25T08:40:09Z).
- **Description (repository-authored, not independently validated):** Snow Plough Game
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Substantial React/Three.js game source exists (App.tsx inspected); no README, release asset or recorded public URL. Completion unknown.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** None identified in inspected tree.
- **Documentation:** None identified in inspected tree.
- **Missing / release gate:** README and current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/Frostpine/tree/main), [releases](https://github.com/LIN4CRE/Frostpine/releases) — 57 file paths inspected; tree truncated: False.

### LIN4CRE/Gyroll

- **Name / type:** Gyroll — game / game-related development.
- **Repository:** https://github.com/LIN4CRE/Gyroll (default `main`; not marked as fork; last pushed 2026-10-27T09:43:05Z).
- **Description (repository-authored, not independently validated):** Ball game
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Rolling-game source and controls/physics documentation exist; physics.ts inspected; no release/homepage recorded. Completion and device motion unverified.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** `public/banner.svg`
- **Documentation:** `README.md`
- **Missing / release gate:** current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/Gyroll/tree/main), [releases](https://github.com/LIN4CRE/Gyroll/releases) — 58 file paths inspected; tree truncated: False.

### LIN4CRE/LineRider

- **Name / type:** LineRider — game / game-related development.
- **Repository:** https://github.com/LIN4CRE/LineRider (default `main`; not marked as fork; last pushed 2026-09-30T16:40:38Z).
- **Description (repository-authored, not independently validated):** Line rider game.
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Android source.
- **Actual status:** Android Kotlin physics, drawing, Room storage and Compose UI source exist; no README/release/homepage. Build/install/gameplay unknown; derivative-name rights need review.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** None identified in inspected tree.
- **Documentation:** None identified in inspected tree.
- **Missing / release gate:** README and current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/LineRider/tree/main), [releases](https://github.com/LIN4CRE/LineRider/releases) — 57 file paths inspected; tree truncated: False.

### LIN4CRE/MmoSnake

- **Name / type:** MmoSnake — game / game-related development.
- **Repository:** https://github.com/LIN4CRE/MmoSnake (default `main`; not marked as fork; last pushed 2026-09-19T19:16:49Z).
- **Description (repository-authored, not independently validated):** Snake
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** React Three Fiber game scene and server source exist; scene inspected; no README/release/homepage. Multiplayer operation unknown.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** None identified in inspected tree.
- **Documentation:** None identified in inspected tree.
- **Missing / release gate:** README and current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/MmoSnake/tree/main), [releases](https://github.com/LIN4CRE/MmoSnake/releases) — 27 file paths inspected; tree truncated: False.

### LIN4CRE/PulseRider

- **Name / type:** PulseRider — game / game-related development.
- **Repository:** https://github.com/LIN4CRE/PulseRider (default `main`; not marked as fork; last pushed 2026-09-19T18:38:32Z).
- **Description (repository-authored, not independently validated):** Game
- **Live / launch URLs recorded:** None recorded in inspected catalogues or repository homepage metadata. README may contain additional setup links.
- **Download:** No binary/build release asset identified in inspected releases. GitHub-generated source ZIPs are not applications.
- **Platform (source evidence, not compatibility certification):** Web/JS source.
- **Actual status:** Solo/local-duel game components and server source exist; SoloGame inspected; no README/release/homepage. Completion/network operation unknown.
- **Can launch / independently verified:** Not launched in this audit. GitHub metadata, tree, README availability and release listing independently inspected; no functional verification.
- **Existing screenshots:** None identified in inspected tree. Filename candidates only: capture date/build/provenance unverified.
- **Other image assets (not proof of gameplay):** None identified in inspected tree.
- **Documentation:** `src/hooks/useOnlineStatus.ts`
- **Missing / release gate:** README and current owner-confirmed development state; tested build SHA/version; genuine dated screenshots; clean-device smoke test; platform requirements; licence/asset attribution review; support/privacy policy where data is handled. No public launch claim until those gates pass.
- **Evidence:** [tree](https://github.com/LIN4CRE/PulseRider/tree/main), [releases](https://github.com/LIN4CRE/PulseRider/releases) — 38 file paths inspected; tree truncated: False.

## Legacy 77-game external directory — preserved, not studio releases

Verified in **live `/games`** and `LIN4CRE/linacre.site:public/games/games.json`; absent from this DLinacre checkout's `public/games/`. Every row below is **a third-party directory entry, NOT a verified LIN4CRE game**. Common fields: repository unspecified by the directory; download URL not established; platform/browser engine and status are publisher claims only; no launch or gameplay independently verified in this audit; documentation is directory blurb/controls; cover images are promotional artwork, not authenticated screenshots. Missing: rights/attribution, host safety, real-device gameplay, precise build and minimum requirements. Recommended public action: stop counting/featuring these as studio games, preserve data in source. No files removed.

| Name | External live link (unverified) | Claimed engine | Existing cover path in LIN4CRE repository |
| ---- | ------------------------------- | -------------- | ----------------------------------------- |

| Need for Speed: Most Wanted — Web Port | https://dezm0n.itch.io/nfs-most-wanted-web-port | PC Recompilation / WebAssembly / WebGPU | `public/games/assets/covers/nfs-most-wanted-web.jpg` |
| Super Mario 64 (PC Port WebGL) | https://notan127.github.io/SM64-PC-Port-WebGL/ | sm64pc / WebAssembly / WebGL | `public/games/assets/covers/sm64-web.png` |
| Townscaper (Web Edition) | https://oskarstalberg.com/Townscaper/ | Unity WebGL / WebAssembly | `public/games/assets/covers/townscaper.jpg` |
| Celeste Classic (PICO-8) | https://maddymakesgamesinc.itch.io/celesteclassic | PICO-8 / WebAssembly | `public/games/assets/covers/celeste-classic.jpg` |
| Legend of Legaia (Web Recompilation) | https://andrewaltimit.github.io/legend-of-legaia-re/ | PS1 Recompilation / WebGL / WebAssembly | `public/games/assets/covers/legend-of-legaia.png` |
| After Burner II (HTML5 Arcade Port) | https://melonjs.itch.io/after-burner | melonJS / HTML5 Canvas / WebGL | `public/games/assets/covers/re-after-burner.png` |
| Web Dashers (Geometry Rhythm Platformer) | https://web-dashers.github.io/ | HTML5 Canvas / WebGL | `public/games/assets/covers/web-dashers.jpg` |
| Pokémon Mystery Dungeon: Web Engine | https://frequentgamer.itch.io/pmdweb | HTML5 Canvas / WebAudio | `public/games/assets/covers/web-mystery-dungeon.png` |
| Hege Mania (Browser Bullet Heaven) | https://hegemania.com/ | HTML5 Canvas / WebGL | `public/games/assets/covers/hege-mania.jpg` |
| APEX GP 26 (3D Formula Racer) | https://kfplay.itch.io/apex-gp-26 | WebGPU / WebGL / Three.js | `public/games/assets/covers/apex-gp-26.png` |
| CrossCode (HTML5 Action-RPG) | https://www.cross-code.com/en/start | ImpactJS / HTML5 Canvas | `public/games/assets/covers/crosscode-web.jpg` |
| Venge.io (Tactical 3D Hero Shooter) | https://venge.io/ | PlayCanvas / WebGL Engine | `public/games/assets/covers/venge-io.jpg` |
| Shell Shockers (3D Egg Battle FPS) | https://shellshock.io/ | Babylon.js / WebGL | `public/games/assets/covers/shell-shockers.webp` |
| Smash Karts (3D Kart Battle Arena) | https://smashkarts.io/ | Unity WebGL / 3D Engine | `public/games/assets/covers/smash-karts.png` |
| Krunker.io (3D Multiplayer FPS) | https://krunker.io/ | WebGL / Custom 3D Engine | `public/games/assets/covers/krunker.jpg` |
| Need for Speed: Underground 2 (Web) | https://nfsu2.xyz/ | PC Recompilation / WebGPU | `public/games/assets/covers/nfs-underground-2-web.png` |
| Burnout 3: Takedown (Web Preview) | https://burnout3.online/ | PS2 Web Recomp / WebAssembly / WebGPU | `public/games/assets/covers/burnout-3-web.png` |
| Midnight Club 3: DUB Edition (Web) | https://midnighhtclub3.online/ | PSP Web Recomp / WebAssembly / WebGL | `public/games/assets/covers/midnight-club-3-web.png` |
| Resident Evil Outbreak & File #2 (Web) | https://outbreakweb.com/ | WebAssembly / WebGPU Browser Client | `public/games/assets/covers/resident-evil-outbreak-web.jpg` |
| StarCraft: Brood War (OpenBW Web) | https://playscbw.com/ | OpenBW / WebAssembly | `public/games/assets/covers/starcraft-brood-war-web.jpg` |
| Azeroth Survivors (World of Warcraft Survivors) | https://wow.aethus.pl/ | WebGPU / Rust + Bevy WASM | `public/games/assets/covers/azeroth-survivors.png` |
| Diablo Survivors (3D Multiplayer) | https://www.spawn.co/@izkimar/diablo-survivors | WebGL / Spawn Engine | `public/games/assets/covers/diablo-survivors-spawn.png` |
| PokéBonk (3D Pokémon Survivors) | https://pokebonk.com/ | WebGL / 3D Megabonk-style | `public/games/assets/covers/pokebonk.jpg` |
| PokéSurvivor (966 Pokémon) | https://pokesurvivor.com/ | HTML5 Canvas / WebGL | `public/games/assets/covers/pokesurvivor.jpg` |
| Pokémon Survivors (Bullet Heaven) | https://www.pokemonsurvivors.com/en/ | HTML5 / Canvas | `public/games/assets/covers/pokemon-survivors.png` |
| Bacon Survivor (Pork Survivors-like) | https://poki.com/en/g/bacon-survivor | HTML5 / Canvas | `public/games/assets/covers/bacon-survivor.png` |
| Doom (Wasm Doom) | https://silentspacemarine.com/ | Chocolate Doom WASM / WebSockets | `public/games/assets/covers/wasm-doom.jpg` |
| Crash Bash Online | https://crashbash.app/ | WebGL / Server-side Game Logic | `public/games/assets/covers/crash-bash-online.png` |
| Tomb Raider (OpenLara) | http://xproger.info/projects/OpenLara/ | WebGL / WebAssembly Engine Rewrite | `public/games/assets/covers/openlara.jpg` |
| OpenTTD Online (Transport Tycoon) | https://openttdonline.com/play/ | WebAssembly / OpenGFX | `public/games/assets/covers/openttd-online.jpg` |
| Road Rash (Three.js Port) | https://roadrash.pages.dev/ | Three.js / WebGL | `public/games/assets/covers/road-rash.png` |
| WipEout (wipeout-rewrite) | https://phoboslab.org/wipegame/ | WebAssembly / WebGL | `public/games/assets/covers/wipeout.jpg` |
| LEGO Island (isle.pizza) | https://isle.pizza/ | WebAssembly / Decompilation | `public/games/assets/covers/lego-island.webp` |
| Lugaru (Lugaru-Web) | https://loganwalkerdev.github.io/lugaru-web/ | WebAssembly / OSS Lugaru | `public/games/assets/covers/lugaru-web.jpg` |
| Alley Cat (alleycat.exe) | https://petarov.github.io/alleycat.exe/ | Static Recompilation / WASM | `public/games/assets/covers/alley-cat.jpg` |
| SimCity Classic (micropolisJS) | https://www.graememcc.co.uk/micropolisJS/ | JavaScript / HTML5 Canvas | `public/games/assets/covers/simcity-classic.jpg` |
| Cricket 07 (Browser Recompilation) | https://cricket07.dhaiwat.com/ | WebAssembly / WebGPU Recompilation | `public/games/assets/covers/cricket-07.png` |
| Counter-Strike Surf (Surfd.net) | https://surfd.net/ | WebGL / Source Physics Engine | `public/games/assets/covers/cssurf.jpg` |
| Halo: Combat Evolved (Combat Lab) | https://mitchellhynes.com/combat-lab/ | WebGL / WebAssembly Engine | `public/games/assets/covers/haloce.jpg` |
| Skate 3 (Web Fan Project) | https://skate.aaddpp.lol/ | WebGL / Canvas Physics | `public/games/assets/covers/skate3.jpg` |
| Pro Evolution Soccer 6 (PES 6 Web) | https://pes6.optijuegos.net/ | PPSSPP WebAssembly Emulation | `public/games/assets/covers/pes6.jpg` |
| Grand Theft Auto: Vice City (reVC WASM) | https://joncodeofficial.github.io/gta-vice-city-wasm/ | reVC WebAssembly / WebGL | `public/games/assets/covers/gtavc.webp` |
| Grand Theft Auto III (re3 WASM) | https://wasmarcade.com/gta3 | re3 WebAssembly / WebGL | `public/games/assets/covers/gta3.webp` |
| The Simpsons: Hit & Run (SHAR WASM) | http://shar-wasm.cjoseph.workers.dev/?skipmovie | WebAssembly / Cloudflare Workers | `public/games/assets/covers/simpsons.webp` |
| Minecraft Java 1.8.8 (Eaglercraft WASM) | https://wasmarcade.com/minecraft | TeaVM / WebAssembly Java | `public/games/assets/covers/minecraft.webp` |
| Quake (QuakeWorld Online) | https://q1.pieter.com/ | WebQuake / WebGL / WebSockets | `public/games/assets/covers/q1.jpg` |
| Quake II (JSQuake II) | https://q2.pieter.com/ | WebGL / WebAssembly Netcode | `public/games/assets/covers/q2.jpg` |
| Quake III Arena (ioquake3 Web) | https://q3.pieter.com/ | ioquake3 WebAssembly / WebGL | `public/games/assets/covers/q3.jpg` |
| Return to Castle Wolfenstein (iortcw Web) | https://rtcw.pieter.com/ | iortcw WebAssembly / WebGL | `public/games/assets/covers/rtcw.jpg` |
| Urban Terror (ut.pieter.com) | https://ut.pieter.com/ | ioquake3 WebAssembly | `public/games/assets/covers/urban-terror.jpg` |
| Half-Life (Pixelsuft WebXash) | https://pixelsuft.github.io/hl/ | Xash3D FWGS WebAssembly | `public/games/assets/covers/hl1.jpg` |
| Diablo 1 (DiabloWeb / DevilutionX) | https://johnimril.github.io/diablo_web/ | DevilutionX WebAssembly | `public/games/assets/covers/diablo.png` |
| Lethal Company (Web Port) | https://wasm.rip/ | Unity WebAssembly / WebGL | `public/games//games/assets/brand/banner.svg` |
| Stardew Valley (Web Edition) | https://wasm.rip/ | MonoGame / WebAssembly | `public/games//games/assets/brand/banner.svg` |
| Cuphead: Don't Deal with the Devil (Web Port) | https://wasm.rip/ | Unity / WebAssembly / WebGL | `public/games//games/assets/brand/banner.svg` |
| Command & Conquer: Red Alert (ChronoDivide) | https://chronodivide.com/ | TypeScript / WebAssembly / WebGL | `public/games//games/assets/covers/chrono-divide.jpg` |
| ClusterTruck (Web Edition) | https://wasm.rip/ | Unity / WebGL / WebAssembly | `public/games//games/assets/brand/banner.svg` |
| Inscryption (Web Port) | https://wasm.rip/ | Unity / WebAssembly | `public/games//games/assets/brand/banner.svg` |
| Among Us (Community Web Edition) | https://wasm.rip/ | Unity / IL2CPP / WebAssembly | `public/games//games/assets/brand/banner.svg` |
| Prince of Persia (HTML5) | https://princejs.com/ | HTML5 Canvas / JavaScript (princejs) | `public/games//games/assets/brand/banner.svg` |
| Wolfenstein 3D (HTML5 / Wasm) | https://wolf3d.cx/ | Raycasting Engine / WebAssembly | `public/games//games/assets/brand/banner.svg` |
| Dune II: The Building of a Dynasty | https://epicport.com/en/dune2 | OpenDUNE / WebAssembly | `public/games//games/assets/brand/banner.svg` |
| Kerbal Space Program (Web Port) | https://wasm.rip/ | Unity / WebAssembly / WebGL | `public/games//games/assets/brand/banner.svg` |
| Slow Roads (Endless Driving Simulator) | https://slowroads.io/ | Three.js / WebGL / Web Audio | `public/games//games/assets/brand/banner.svg` |
| Poly Track (3D Time-Trial Racer) | https://polytrack.io/ | WebGL / Three.js | `public/games//games/assets/brand/banner.svg` |
| 1v1.LOL (3D Battle Royale & Builder) | https://1v1.lol/ | Unity WebGL / WebAssembly | `public/games//games/assets/brand/banner.svg` |
| Drift Hunters (3D Tuning & Stunts) | https://drift-hunters.io/ | Unity WebGL | `public/games//games/assets/brand/banner.svg` |
| TETR.IO (Uncapped Competitive Tetris) | https://tetr.io/ | HTML5 Canvas / WebGL / WebSockets | `public/games//games/assets/brand/banner.svg` |
| Sonic Robo Blast 2 (SRB2 WebAssembly) | https://karl-police.itch.io/srb2-web | Modified Doom Engine / WebAssembly | `public/games//games/assets/brand/banner.svg` |
| Vampire Survivors (Original Web Edition) | https://poncle.itch.io/vampire-survivors | Phaser / HTML5 Canvas | `public/games//games/assets/brand/banner.svg` |
| Cookie Clicker (Original Web Edition) | https://orteil.dashnet.org/cookieclicker/ | JavaScript / HTML5 Canvas | `public/games//games/assets/brand/banner.svg` |
| GeoFS (Global 3D Flight Simulator) | https://www.geo-fs.com/geofs.php | CesiumJS / WebGL | `public/games//games/assets/brand/banner.svg` |
| Ev.io (Cyberpunk Arena FPS) | https://ev.io/ | Three.js / WebGL / WebSockets | `public/games//games/assets/brand/banner.svg` |
| Spelunky Classic (HTML5) | https://tinysubversions.com/spelunky/ | HTML5 Canvas / JavaScript | `public/games//games/assets/brand/banner.svg` |
| A Dark Room (Atmospheric Survival RPG) | https://adarkroom.doublespeakgames.com/ | JavaScript / Web Audio | `public/games//games/assets/brand/banner.svg` |
| Super Smash Flash 2 (Web Edition) | https://www.supersmashflash.com/ | WebAssembly / WebGL / MGN Engine | `public/games//games/assets/brand/banner.svg` |
| Subway Surfers (Web Edition) | https://poki.com/en/g/subway-surfers | Unity WebGL | `public/games//games/assets/brand/banner.svg` |

## Contradictions requiring correction before promotion

- `GameShowcase.tsx` comments say screenshot list is empty and `links.play` null. The JSON actually contains five `assets/screenshot-*.webp` paths and a Pages `play` URL. Those relative image paths resolve against the current document, whereas copies are at `public/assets/`; do not assume the gallery works. `hasRoblox` controls public Roblox availability. The component is not mounted by the current App.
- The Slime manifest says “In development / not yet published” while tagline/body say “production-ready” and “all hard parts done”. A Studio template release cannot establish published-game readiness.
- `PixelPokeArena` README explicitly identifies an unofficial Web3-game wrapper; current catalogue blurb loses that essential attribution/context.
- AeroFlap and Tap & Slap URL fetch failures are **unavailable for verification**, not confirmed dead links.
- Pixel Heist public briefing has 2026-07-28 text on 2026-11-25. Investigate whether daily content is hardcoded or a static snapshot; not proof of a broken engine.
- The historical LIN4CRE curation reports conflict: 4 November explicitly avoids fabricated scores; 5 November supplies precise quality scores/“verified” claims without reproducible new test artifacts in this audit. Treat both as historical statements, not inherited independent certification.
