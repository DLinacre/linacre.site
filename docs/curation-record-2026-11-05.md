# LIN4CRE Portfolio & Game Curation Record (2026-11-05)

## Purpose & Scope

This internal curation record documents the full repository, live-deployment, source-code, and gameplay audit conducted across the `LIN4CRE` and `DLinacre` GitHub organisations and `linacre.site` routes on **5 November 2026**.

Per studio policy:
- **No repositories, releases, deployments, game files, or user data were deleted.** Every removed project and game remains intact in its original repository and/or direct static asset path.
- Public presentation on `linacre.site` has been curated strictly to finished, verified, original software and games that represent LIN4CRE's strongest engineering and design work without overlap, mock data, broken links, or third-party IP ambiguity.
- No public "archive" or secondary directory page is exposed, preventing the clutter problem from recurring elsewhere on the site.

---

## Evaluation Rubric (Internal Decision Aid)

Every candidate project and game was inspected against its live URL, git tree, source code, release artifacts, and visual presentation, then scored from `0–10` per criterion using the following weights:

| Criterion | Weight |
| :--- | ---: |
| Overall quality & completeness | 25% |
| Originality & uniqueness | 20% |
| Actual functionality | 20% |
| Visual quality & presentation | 15% |
| Technical achievement | 10% |
| Potential interest to site visitors | 10% |

Weighted total (`0–100`): `2.5×Q + 2.0×O + 2.0×F + 1.5×V + 1.0×T + 1.0×I`.

---

## Retained Public Showcase — Selected Work (5 Projects)

Chosen for verified completeness, technical depth, visual clarity, and clean domain variety across native systems audio, 3D algorithmic web software, bytecode simulation, live planetary telemetry, and document reading tools.

| # | Project | Category | Q | O | F | V | T | I | Total | Verified Stack & Evidence |
| :- | :--- | :--- | :-: | :-: | :-: | :-: | :-: | :-: | ---: | :--- |
| 01 | **Dual Audio Synchronizer** (`LIN4CRE/dual-audio-synchronizer`) | Systems & Audio DSP | 9.4 | 9.5 | 9.3 | 8.8 | 9.6 | 9.2 | **93.0** | 153 KB native C# Windows WASAPI loopback & multi-speaker phase-lock engine (`±1 ms` 4-pt Cubic Hermite drift control, 2.8 kHz Biquad Vocal Clarity EQ, L/R channel split, standalone ~360 KB v2.0 `.exe` release + live docs). |
| 02 | **HELIX** (`DLinacre/helix`, `/helix`) | Simulation & Bytecode VM | 9.1 | 9.7 | 9.4 | 9.0 | 9.4 | 9.0 | **92.9** | Zero-dependency artificial-life observatory (`engine.js` 23 KB + `app.js` 34 KB). Runs 64 organisms on a custom 20-opcode register VM with Shannon entropy fitness penalties, sexual crossover, extinction/rebirth epochs, and live genome disassembler. |
| 03 | **CubeLab** (`LIN4CRE/cubelab`) | 3D Interactive Web | 9.4 | 8.6 | 9.6 | 9.1 | 9.3 | 9.4 | **92.3** | 94-file TypeScript + Three.js + Web Worker (`min2phase` Kociemba two-phase solver `≤21` moves) Rubik's Cube solver, 7-stage beginner guide, unit-verified OLL/PLL algorithms, timer, and offline PWA (`dlinacre.github.io/cubelab/`). |
| 04 | **Orbit & Earth Observatory** (`LIN4CRE/linacre.site`, `/orbit`) | Planetary Telemetry | 9.0 | 8.8 | 9.3 | 9.2 | 8.9 | 9.1 | **90.5** | React 19 + TypeScript live telemetry desk plotting ISS position & 90-minute ground track, solar day/night terminator, USGS M4.5+ seismic feed, Launch Library 2 rocket manifest, and Barnsley sky conditions across equirectangular and 3D orthographic vector projections. |
| 05 | **SpeedRead** (`LIN4CRE/SpeedRead`) | Reading & Document Engine | 8.9 | 8.3 | 9.2 | 8.8 | 8.6 | 9.0 | **88.1** | 118-file TypeScript RSVP speed-reading PWA with Optimal Recognition Point reticles, punctuation-aware cadence, 19 public-domain books, and client-side PDF/EPUB parsing via `pdf.worker` + `jszip` (`lin4cre.github.io/SpeedRead/`). |

---

## Retained Public Showcase — Selected Games (4 Games)

Chosen for immediate zero-account playability, clean visual craft, keyboard/touch support, and distinct mechanics across creative light painting, spatial puzzle design, deduction, and turn-based strategy.

| # | Game | Genre | Q | O | F | V | T | I | Total | Verified Stack & Evidence |
| :- | :--- | :--- | :-: | :-: | :-: | :-: | :-: | :-: | ---: | :--- |
| G1 | **Afterglow** (`DLinacre/afterglow`) | Generative Light Painting | 8.9 | 9.1 | 9.2 | 9.3 | 8.4 | 9.0 | **90.2** | Self-contained HTML5 Canvas + Web Audio long-exposure light photography game (`dlinacre.github.io/afterglow/`) with constellation targets, additive bloom brushes, ambient audio synthesis, and local gallery. |
| G2 | **Circuit** (`/games/circuit`) | Spatial Logic Puzzle | 9.0 | 7.8 | 9.5 | 8.8 | 8.4 | 8.9 | **87.6** | Self-hosted zero-dependency wire-rotation logic puzzle (`663` lines strict JS) with procedurally generated solvable grids (`3×3` to `7×7`), `mulberry32` daily puzzle, undo/hint controls, and Web Audio tones. |
| G3 | **Gridlock** (`/games/gridlock`) | Territory Strategy | 8.6 | 7.4 | 9.3 | 8.5 | 8.0 | 8.4 | **84.1** | Self-hosted SVG territory board game (`445` lines strict JS) supporting solo play against a chain-aware machine opponent and 2-player local pass-and-play across `3×3`, `4×4`, and `5×5` boards. |
| G4 | **Decrypt** (`/games/decrypt`) | Codebreaking Deduction | 8.5 | 7.2 | 9.4 | 8.4 | 7.7 | 8.3 | **82.9** | Self-hosted 4-slot / 6-symbol daily codebreaker (`394` lines strict JS) with exact/misplaced feedback pegs, shared daily seed, keyboard & touch keypad, and local streak persistence. |

---

## Removed from Public Showcase (Preserved in Original Repositories & Paths)

### 1. Software & Web Projects Removed from Showcase

| Entry | Score | Reason for Removal from Public Showcase | Future Reconsideration Criteria |
| :--- | ---: | :--- | :--- |
| **PokeGuru** (`DLinacre/PokeGuru`, `/pokeguru`) | 77.5 | Working UK Pokémon TCG GBP lookup & 126-set wiki, but depends on third-party Pokémon IP and niche collector data outside core studio positioning. | Keep independent on `dlinacre.github.io/PokeGuru/`; reconsider only if LIN4CRE adds a dedicated consumer-data vertical. |
| **Slime Factory Tycoon** (`DLinacre/slime-factory-tycoon`) | 76.0 | Strong server-authoritative Luau/Rojo codebase and Python balance simulator, but cannot run in the browser (requires downloading `.rbxlx` into Roblox Studio). | Could return if published as an instant-join public Roblox experience with verified live gameplay video/link. |
| **Linacre Uninstaller** (`LIN4CRE/LinacreUninstaller`) | 73.5 | Functional Android OEM package safety directory + Kotlin ADB wrapper, but narrow platform scope compared to retained flagships. | Could return if shipped as a signed cross-platform desktop ADB GUI release with verified device screenshots. |
| **OSINT HUD** (`/osint`, `LIN4CRE/linacre-osint-hud`) | 73.1 | Clean client-side search & bookmarking over 1,310 links, but fundamentally a curated external link directory rather than original software engineering. Route `/osint` remains live for existing users. | Keep live at `/osint`; do not feature on main studio showcase. |
| **Easy Audiobook Player** (`LIN4CRE/easy-audiobook-player`) | 72.4 | Working single-file LibriVox/local audio player, but modest scope and overlaps the reading vertical already represented more strongly by **SpeedRead**. | Could merge chapters/audio features into a larger reading suite in future. |
| **APKHub** (`LIN4CRE/APKHub`) | 71.0 | Clean static directory of 155 FOSS Android GitHub releases, but a curated link catalogue rather than original software; prior `siteProjects.ts` also misstated its stack as Next.js. | Keep independent on GitHub Pages; not needed in primary studio showcase. |
| **Linacre Global Monitor** (`LIN4CRE/linacre-global-monitor`) | 70.5 | Working single-file Leaflet seismic/EONET map, directly superseded by the richer native **Orbit & Earth Observatory** (`/orbit`). | Superseded by `/orbit`. |
| **Browser Developer Tools** (`/tools`) | 69.8 | Functional local JSON/Base64/UUID/timestamp utilities, but generic multi-tool utilities dilute studio originality and mix in external tool directory links. Route `/tools` remains live so existing bookmarks work. | Keep live at `/tools`; exclude from primary curated showcase. |
| **Music Videos — Proper Mad** (`/music-videos`) | 68.5 | Creative 10-track lyric-video collection relying on external video playback; off-focus for a software engineering portfolio. Route `/music-videos` remains live. | Keep live at `/music-videos` as a direct link only. |
| **Whole-Home AdBlocker** (`LIN4CRE/whole-home-adblocker`) | 64.0 | Batch wrapper around Docker + AdGuard Home; live landing page renders a simulated fake DNS traffic feed (`Living Room Samsung 4K TV`), conflicting with strict no-mock-data standards. | Remove simulated live ticker from landing page and ship a genuine local diagnostics tool before reconsidering. |
| **Fire TV Kit** (`LIN4CRE/firetv-kit`) | 62.0 | Well-tested PowerShell ADB script, but bundles third-party streaming APKs (`Stremio`, `SmartTube`, `TiviMate`) and Downloader shortcodes. | Do not include in studio showcase due to third-party APK bundling. |
| **Identity Studio** (`/identity`), **AI Lab** (`/lab`), **Ops HUD** (`/ops`) | 54.0–61.0 | Internal meta-dashboards, brand asset generators, and provider sandboxes that add navigation sprawl without standalone product focus. Routes remain reachable with `noindex`. | Keep internal (`noindex`); do not expose in primary navigation. |
| **Linacre Wallpaper** (`LIN4CRE/linacre-wallpaper`) | 52.0 | Personal workstation Lively Wallpaper pointing to `localhost` ports (`8188`, `11434`) and `file:///D:/Projects`, unusable by public visitors. | Could return only if refactored into a configurable general-purpose Lively Wallpaper release. |
| **Apex POS** (`DLinacre/Apex-POS`) | 48.0 | Demo loads pre-seeded mock shop figures (`£537.69`), stock imagery, and an empty category chart. | Requires real offline IndexedDB POS workflow without mock retail figures. |
| **Life Hacks** (`DLinacre/life-hacks`) | 46.0 | Small 9-article household tips microsite unrelated to software engineering. | Out of scope for LIN4CRE studio showcase. |
| **Karaoke Pulse** (`LIN4CRE/karaoke-pulse`) | 44.0 | Static GitHub Pages frontend cannot perform YouTube download or vocal stem separation without a local Node/Docker backend; prior tech-stack description was inaccurate. | Could return only if rebuilt with client-side WebAssembly/WebGPU audio stem separation that genuinely runs in the browser. |
| **Mob Deals** (`/mob-deals`), **Arena Audit**, **DKMA GUI**, **EV Bot**, **OpAgent** | 38.0–45.0 | Early single-page static prototypes and calculators with limited depth or static datasets. | Superseded by higher-craft studio projects. |
| **1files** (`DLinacre/1files`) | 41.0 | Live root serves `SIM://ROOT — Hacker's Guide to Free Living`, clashing with studio tone and focus. | Out of scope. |
| **Bonny Bats** (`DLinacre/bonny-bats`) | 34.0 | Wildlife brochure microsite with broken hero counters (`0 UK bat species`, `0+`, `0%`). | Fix counters in repo if maintained separately; out of scope for software studio. |
| **PokéFlip AI** (`LIN4CRE/Pok-Flip-AI`) | 32.0 | Live site titled `My Google AI Studio App` backed by `mockPokemonData.ts` (`32 KB` hardcoded mock listings) rather than real marketplace feeds or computer vision. | Would require genuine live API ingestion, verified CV pipeline, and removal of all mock data. |
| **Bonny Bakes** (`DLinacre/bonny-bakes`) | 29.0 | Recipe cards visibly render literal placeholder captions (`Add your photo to images/hero.jpg`, `images/flapjacks.jpg`). | Out of scope; requires real photography in its own repo. |
| **LLM Hub / Benchmarks** (`DLinacre/Linacre-LLM-Benchmarks`) | 26.0 | Displays fictional model names (`Metamuse Spark 1.1`, `Claude Fable 5`) and hardcoded fake GitHub star metrics. | Do not showcase unverified benchmark data. |
| **Deasy** (`DLinacre/Deasy`) | 22.0 | Live Pages endpoint returns `HTTP 500`. | Fix deployment and verify real functionality before any future review. |
| **Smart Email Assistant** (`LIN4CRE/smart-mail`) | 18.0 | Live Vercel deployment (`smart-mail-gamma.vercel.app`) returns `404 DEPLOYMENT_NOT_FOUND`. | Redeploy with working sandbox demo before reconsidering. |
| **Nic's Food Decider** (`DLinacre/nic-food-decider`) | 18.0 | Live Vercel deployment (`nic-food-decider.vercel.app`) returns `404 DEPLOYMENT_NOT_FOUND`. | Out of scope / broken deployment. |

### 2. Games & Game Directories Removed from Showcase

| Entry | Score | Reason for Removal from Public Showcase | Future Reconsideration Criteria |
| :--- | ---: | :--- | :--- |
| **Pixel Heist** (`DLinacre/pixel-heist`) | 81.5 | Solid Phaser 3 + Next.js stealth prototype, held just outside the top 4 to keep the games selection tight, fast-loading, and balanced; also carries heavier Next.js HUD chrome on mobile. | Strongest candidate to join `/games` next after mobile HUD polish. |
| **KushCloud** (`DLinacre/KushCloud`) | 76.5 | Functional React/Canvas arcade flyer, omitted due to cannabis-themed branding that clashes with a calm studio portfolio. | Keep standalone in its own repository. |
| **DigiPoke** (`LIN4CRE/digipoke`) | 75.0 | Original SVG creatures and offline architecture, but `Press Start` immediately gates casual visitors behind a mandatory passphrase setup screen. | Could return if refactored to drop players straight into gameplay with optional later sync/passphrase setup. |
| **Dragon Rush Heroes** (`DLinacre/dragon-rush-heroes`) | 63.0 | Uses third-party Dragon Ball franchise terminology (`Chrono Crystals`, `Legends Pass`, 464 fighters). | Do not include third-party IP derivatives in studio showcase. |
| **Pulse** (`/games/pulse`), **Trigger** (`/games/trigger`), **Mines** (`/games/mines`), **Tiles** (`/games/tiles`) | 60.0–68.0 | Working self-hosted mini-games, but familiar genre clones (`Simon`, reaction timer, `Minesweeper`, `2048`) that dilute originality alongside **Afterglow**, **Circuit**, **Gridlock**, and **Decrypt**. Static files remain intact at `/games/*.html`. | Preserved at direct URLs; excluded from curated `/games` showcase. |
| **Tabulous Games** (`public/games/games.json`, 77 links) & **Retro Arcade Vault** | 30.0 | External link directories aggregating third-party browser ports and fan remakes rather than original LIN4CRE games. | Excluded permanently from LIN4CRE studio showcase; `games.json` retained untouched on disk for legacy compatibility. |
| **Tap & Slap** (`DLinacre/tap-and-slap`) | 24.0 | Live GitHub Pages URL serves only an auto-generated placeholder stub (`This lightweight page was added so the project has a working GitHub Pages URL instead of a 404`). | Requires an actual deployed playable build before review. |
