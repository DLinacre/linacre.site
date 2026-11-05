# Master Project Improvement Roadmap — linacre.site

> **2026-11-04 status note:** The following is historical planning, not a verified
> current inventory, delivery commitment, playability guarantee, or instruction
> to push directly to `main`. Revalidate links, project status and ownership
> before presenting them as facts. See [AUDIT.md](AUDIT.md) and [README.md](README.md)
> for current verification, build and deployment guidance.

> **Authoritative Catalogue & Portfolio Upgrade Matrix**
> Covers all 24 projects curated in [`src/data/siteProjects.ts`](file:///C:/Users/David/.gemini/antigravity/scratch/linacre.site/src/data/siteProjects.ts).
> Operational goal: Elevate each project sequentially with **at least 10 distinct, production-grade improvements**, 100% passing test suites, green production builds, direct `main` branch sync, 0 open pull requests, and real-time metadata updates on `linacre.site`.

---

## Portfolio Execution & Upgrade Framework

### Standards for Every Project Upgrade
1. **At least 10 distinct, high-impact improvements** spanning:
   - Performance & optimization
   - New capabilities / essential tools
   - UI/UX polish & dark glass cyber aesthetics
   - Accessibility & WCAG compliance
   - Mobile responsiveness & cross-device ergonomics
   - Error resilience & edge-case recovery
   - Robust automated testing & static validation
2. **100% Passing Test Suites** (zero test skips, zero regressions, zero warnings where feasible).
3. **Green Production Builds** with zero bundle or lint failures.
4. **Clean Git State** (synced directly to `main`, 0 uncommitted changes, 0 open PRs).
5. **Portfolio Metadata Synchronization** in `siteProjects.ts` (highlights, tech tags, blurbs).

---

## Master Priority Ranking & Execution Sequence

| # | Project Name | Kind | Workspace / Repository | Status | Key Focus |
|---|--------------|------|------------------------|--------|-----------|
| **1** | **Fire TV Setup Kit** | `Tool` | `scratch/firetv-setup-kit` (`LIN4CRE/firetv-kit`) | ✅ **Elevated (10/10 Shipped, 46/46 Tests Passing)** | Multi-subnet scanning, ABI resolution, DNS benchmarks, diagnostics, rollback |
| **2** | **Tabulous Games** | `Game` | `scratch/tabulous-games` (`LIN4CRE/tabulous-games`) | 🎯 **Next in Queue** | WebAssembly memory tuning, offline cache, CRT shaders, gamepad haptics |
| **3** | **APKHub** | `App` | `scratch/apkhub` (`LIN4CRE/APKHub`) | ⏳ Scheduled | ABI validation, manifest security audit, batch extractor, signature check |
| **4** | **PokéFlip AI** | `AI` | `scratch/pokeflip-ai` (`LIN4CRE/Pok-Flip-AI`) | ⏳ Scheduled | Gemini 2.0 Flash migration, image centering grading, card price graphing |
| **5** | **Retro Arcade Vault** | `Game` | `scratch/retro-arcade-vault` (`LIN4CRE/retro-arcade-vault`) | ⏳ Scheduled | Touch overlays, save state cloud export, scanlines, netplay hooks |
| **6** | **Dual Audio Synchronizer** | `Tool` | `scratch/DualAudioSync` (`LIN4CRE/dual-audio-synchronizer`) | ⏳ Scheduled | Sub-ms buffer jitter control, WASAPI exclusive mode, system tray UI |
| **7** | **Karaoke Pulse** | `App` | `scratch/youtube-karaoke` (`LIN4CRE/karaoke-pulse`) | ⏳ Scheduled | Web Audio stem mixing, pitch scoring algorithm, romanized lyrics parser |
| **8** | **KushCloud** | `Game` | Remote clone (`DLinacre/KushCloud`) | ⏳ Scheduled | 120 FPS canvas physics, Web Audio synthesizer presets, touch responsiveness |
| **9** | **Afterglow** | `Game` | Remote clone (`DLinacre/afterglow`) | ⏳ Scheduled | Particle phosphor bloom, stylus pressure curves, ambient audio harmonic tuner |
| **10** | **Easy Audiobook Player** | `App` | `scratch/easy-audiobook-player` (`LIN4CRE/easy-audiobook-player`) | ⏳ Scheduled | M4B chapter parsing, IndexedDB persistence, keyboard shortcuts, sleep timer |
| **11** | **Linacre Uninstaller** | `Tool` | `scratch/linacre-uninstaller` (`LIN4CRE/LinacreUninstaller`) | ⏳ Scheduled | Safety classification tiers, wireless ADB pairing, restore rollback snapshots |
| **12** | **SpeedRead** | `Tool` | `scratch/SpeedRead` (`LIN4CRE/SpeedRead`) | ⏳ Scheduled | ORP fixation highlighting, EPUB reader parser, WPM ramp-up pacing engine |
| **13** | **Whole-Home AdBlocker** | `DevOps` | `scratch/whole-home-adblocker` (`LIN4CRE/whole-home-adblocker`) | ⏳ Scheduled | Docker compose orchestration, upstream DoT/DoH benchmarker, live DNS HUD |
| **14** | **Linacre System Monitor Wallpaper** | `Tool` | `scratch/linacre-wallpaper` (`LIN4CRE/linacre-wallpaper`) | ⏳ Scheduled | Sub-1% CPU canvas loop, dual-monitor responsive layout, Lively Wallpaper API |
| **15** | **CubeLab** | `App` | `scratch/cubelab` (`LIN4CRE/cubelab`) | ⏳ Scheduled | Three.js WebGL solver, Kociemba 20-move engine, WCA timer inspection |
| **16** | **1Files Repository** | `Source` | `scratch/1files` (`LIN4CRE/1files`) | ⏳ Scheduled | Single-file zero-dependency bundle builder, offline service worker, search |
| **17** | **Bonny Bats** | `Tool` | `scratch/bonny-bats` (`LIN4CRE/bonny-bats`) | ⏳ Scheduled | UK Wildlife Act compliance decision tree, roost checklist, high-contrast UI |
| **18** | **Bonny Bakes** | `App` | `scratch/bonny-bakes` (`LIN4CRE/bonny-bakes`) | ⏳ Scheduled | Dynamic baker's percentage scaler, ingredient categorization, PWA offline cache |
| **19** | **Linacre OSINT HUD** | `Tool` | `scratch/linacre-osint-hud` (`LIN4CRE/linacre-osint-hud`) | ⏳ Scheduled | 1,300+ tool directory fuzzy search, custom bookmarks, offline JSON cache |
| **20** | **Linacre Global Monitor** | `App` | `scratch/linacre-global-monitor` (`LIN4CRE/linacre-global-monitor`) | ⏳ Scheduled | USGS seismic live stream, NASA FIRMS active fire feed, dark Leaflet GIS map |
| **21** | **Smart Email** | `AI` | Remote clone (`DLinacre/smart-mail`) | ⏳ Scheduled | Gemini AI email prioritization, one-click newsletter cleanup, React 19 polish |
| **22** | **PokeGuru** | `App` | Remote clone (`DLinacre/PokeGuru`) | ⏳ Scheduled | UK GBP real-time valuation, 15,000+ card set query optimization, IndexedDB |
| **23** | **Life Hacks** | `Tool` | Remote clone (`DLinacre/life-hacks`) | ⏳ Scheduled | Offline DIY stylus guide, interactive step tracker, high-contrast dark theme |
| **24** | **Nic's Food Decider** | `App` | Remote clone (`DLinacre/nic-food-decider`) | ⏳ Scheduled | Cook vs Takeaway weighted algorithm, dietary restriction filters, history log |

---

## Detailed 10-Improvement Action Plans per Project

### Project 1: Fire TV Setup Kit (`firetv-kit`)
- [x] **1.1. Multi-Adapter & Multi-Subnet Discovery Engine**: Autodetect multiple network adapters (Ethernet, Wi-Fi, virtual adapters) with subnet CIDR parsing.
- [x] **1.2. Parallel Task-Accelerated Port 5555 Scanner**: Asynchronous port scanner probing all 254 addresses concurrently with 350ms bounded timeout, reducing scan duration from >1s to ~350ms.
- [x] **1.3. 2026 TV Hardware Fingerprinting**: Added model maps for Fire TV Stick 4K Max Gen 2 (`AFTKRT`), Fire TV Omni QLED (`AFTOQ`), Fire TV 2-Series/4-Series (`AFTBSS`), Google TV Streamer 4K, Chromecast HD/4K, Onn 4K Pro, and Nvidia Shield Pro.
- [x] **1.4. Smart CPU ABI Architecture Resolution**: Autodetects 32-bit (`armeabi-v7a`) vs 64-bit (`arm64-v8a`) device CPU architecture before choosing and pulling package binaries.
- [x] **1.5. Multi-Tier Debloating with Snapshot & 1-Click Rollback**: Safety tiers (Telemetry/Ads, Background Bloat, Aggressive) with automatic state backup (`debloat-state-<ip>.json`) and `-Restore` rollback capability.
- [x] **1.6. Selectable Private DNS Profiles with Latency Benchmark**: Select from AdGuard Default, AdGuard Family, Cloudflare Security, Quad9, or NextDNS with latency verification.
- [x] **1.7. Deep TV Hardware & Telemetry Diagnostics**: Added `Test-FireTVDiagnostics` measuring display mode, refresh rate, HDR/Dolby Vision support, RAM usage, storage space, and thermal state.
- [x] **1.8. Cross-Platform Parity in `setup.sh`**: Brought Linux/macOS bash script up to speed with subnet detection, interactive menu, and DNS options.
- [x] **1.9. Profile Export/Import (`Export-FireTVProfile` / `Import-FireTVProfile`)**: Snapshot device settings to JSON to clone identical configurations across multiple TVs in one household.
- [x] **1.10. Test Suite Expansion in `Run-Tests.ps1`**: Expanded to 46 automated tests across 12 groups, including dynamic AST extraction, whitelist safety audits, storage & RAM parser unit tests, snapshot roundtrip, and live device verification.

---

### Project 2: Tabulous Games (`tabulous-games`)
- [ ] **2.1. WebAssembly Memory Allocator Tuning**: Optimize Emscripten heap initializations and growth limits for low-RAM mobile browsers.
- [ ] **2.2. Offline Progressive Web App (PWA) Service Worker**: Enable instant game play offline with pre-cached assets.
- [ ] **2.3. Authentic CRT Shader Pipeline**: WebGL fragment shaders for scanlines, aperture grille, and phosphor glow.
- [ ] **2.4. Gamepad API Haptic Feedback**: Dual-rumble support for Xbox, PlayStation, and generic Bluetooth controllers.
- [ ] **2.5. Touch Virtual Gamepad HUD**: Transparent touch control overlay with customizable button positioning for tablet/phone.
- [ ] **2.6. Local Save State Cloud Sync & JSON Export**: Export/import save files directly from IndexedDB.
- [ ] **2.7. Search, Tagging & Filter Performance**: Sub-millisecond fuzzy search across all 77 verified games.
- [ ] **2.8. Keyboard Shortcut Remapping Engine**: In-game modal allowing arbitrary key-binding overrides.
- [ ] **2.9. Fullscreen Auto-Scaling & Aspect Ratio Lock**: 4:3 and 16:9 pixel-perfect integer scaling with letterboxing.
- [ ] **2.10. Automated Game Availability & Link Health Test Suite**: Headless Playwright script verifying all 77 game launch points.

---

### Project 3: APKHub (`APKHub`)
- [ ] **3.1. Architecture ABI Inspection**: Automated manifest extraction displaying `armeabi-v7a`, `arm64-v8a`, `x86_64` compatibility.
- [ ] **3.2. Permission Security Boundary Audit**: Visual flag of sensitive permissions (SMS, camera, overlay, full storage).
- [ ] **3.3. APK Signature & Certificate Verification**: V1, V2, V3 signature scheme check and SHA-256 fingerprint matching.
- [ ] **3.4. Version Comparison & Changelog Diff Engine**: Side-by-side diff between successive APK releases.
- [ ] **3.5. Batch Drag-and-Drop Inspector**: Drag multiple APKs at once with parallel manifest parsing via WebAssembly.
- [ ] **3.6. VirusTotal & Hash Telemetry Integration**: Check hashes against known threat registries.
- [ ] **3.7. Android TV Leanback Banner Inspector**: Checks for presence of `banner.png` and TV leanback launcher category.
- [ ] **3.8. Dark Mode Cyberpunk UI Polish**: Streamlined cards, glow badges, and high-density tables.
- [ ] **3.9. Local Cache & History with IndexedDB**: Fast reload of previously analyzed packages.
- [ ] **3.10. Automated Vitest & Playwright Test Suite**: 100% test coverage of manifest parsing and validation rules.

---

*(Roadmap continues systematically for all 24 projects)*
