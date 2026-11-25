# Games rebuild verification

Checked 2026-11-25 UTC. This is a scoped test record, not a production deployment or complete-game certification. Original baseline findings remain in `GAME_INVENTORY.md`.

## Result

- 21 canonical Games: eight locally functional browser builds, five other prior game records with unverified external gameplay, Slime Factory Tycoon as an unpublished Studio template, and seven genuine source prototypes.
- Only the eight functionally checked self-hosted games receive Play Now and dedicated launch pages. Live here means this working-tree website can launch the tested browser build, not that this update has been deployed.
- No third-party directory entry was added to Games. The 77-entry historical dataset and a clearly attributed, noindex static archive are at `/legacy-games`.

## Repository research

Read `GAME_INVENTORY.md`, then refreshed metadata, current HEAD, recursive tree and release metadata and shallow-cloned the following 15 public repositories read-only. Actual files were inspected as described. Remote source repositories were not modified.

| Repository / inspected HEAD                                                                                                                                                | Actual implementation and limits                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [DLinacre/afterglow](https://github.com/DLinacre/afterglow/tree/2de56d12d51516533cbc6828180f2b820d427000) `2de56d12d51516533cbc6828180f2b820d427000`                       | index.html: canvas painting, mouse/touch handlers, undo/redo and photo controls. MIT source imported unchanged; actual local gameplay verified.                                                                                                                       |
| [DLinacre/KushCloud](https://github.com/DLinacre/KushCloud/tree/e56b99ac2976a48ceaec9e5987c8f98d7c70a303) `e56b99ac2976a48ceaec9e5987c8f98d7c70a303`                       | src/components/GameCanvas.tsx and src/game/engine.ts: real game render loop/state and canvas input. Public gameplay unavailable for this sandbox; no new certification.                                                                                               |
| [LIN4CRE/AeroFlap](https://github.com/LIN4CRE/AeroFlap/tree/1ddfd6a3e8fa208250e60d8898f4721157b096b3) `1ddfd6a3e8fa208250e60d8898f4721157b096b3`                           | src/game/physics.ts and renderer.ts: bird state, gravity, obstacles and rendering. Public gameplay unverified.                                                                                                                                                        |
| [DLinacre/pixel-heist](https://github.com/DLinacre/pixel-heist/tree/b34aa2782b04dc01c2f1481a3728c7b3fd6cdf34) `b34aa2782b04dc01c2f1481a3728c7b3fd6cdf34`                   | src/game/scenes/MainScene.ts: Phaser scene, guard patrol state, loot and missions. Recorded static Pages URL may differ from the current Next.js/backend source; not certified.                                                                                       |
| [DLinacre/dragon-rush-heroes](https://github.com/DLinacre/dragon-rush-heroes/tree/60417c23eb0e7c4b0a8742e4dd42043ce621587b) `60417c23eb0e7c4b0a8742e4dd42043ce621587b`     | server/domain/combat.js: battle state and seeded combat actions; server/core/crypto.js. Server operation, fairness, account sync and third-party asset rights not verified.                                                                                           |
| [DLinacre/tap-and-slap](https://github.com/DLinacre/tap-and-slap/tree/736d96319f2146fa782a2a6a267a57b86fdb55ec) `736d96319f2146fa782a2a6a267a57b86fdb55ec`                 | src/game/core/InputController.ts, BeatClock.ts, Judgement.ts, createGame.ts: Phaser lane input and rhythm timing. Not functionally certified.                                                                                                                         |
| [DLinacre/slime-factory-tycoon](https://github.com/DLinacre/slime-factory-tycoon/tree/67dae480587a2960554e822cdb547716736f4a9b) `67dae480587a2960554e822cdb547716736f4a9b` | default.project.json, src/server/Services/EconomyService.luau, DataManager.luau, src/client/ClientMain.client.luau, LAUNCH.md. Real Roblox Studio systems; release checklist remains unchecked. Roblox Studio not available here; no published-place URL established. |
| [LIN4CRE/Frostpine](https://github.com/LIN4CRE/Frostpine/tree/a8806dd07110d291bcba5948625c738f59e2d141) `a8806dd07110d291bcba5948625c738f59e2d141`                         | src/App.tsx and src/game/rules.ts: snow/vehicle/cabin state, vehicle update loop, weather and input. No complete browser build or devices verified.                                                                                                                   |
| [LIN4CRE/Gyroll](https://github.com/LIN4CRE/Gyroll/tree/eac0b135572109f7f487d96948c6db7928dfaa72) `eac0b135572109f7f487d96948c6db7928dfaa72`                               | src/game/physics.ts, input.ts and tracks.ts: integration, collision and input systems. Ran all src/game/*.test.ts with tsx: 24/24 passed; no browser/device-motion certification.                                                                                     |
| [LIN4CRE/MmoSnake](https://github.com/LIN4CRE/MmoSnake/tree/fd0677410d60e0616ce040f2e6c60218e981d76a) `fd0677410d60e0616ce040f2e6c60218e981d76a`                           | src/components/GameScene.tsx, src/store/gameStore.ts and server.ts: React Three Fiber scene/state and server source. Multiplayer and deployed operation not tested.                                                                                                   |
| [LIN4CRE/PulseRider](https://github.com/LIN4CRE/PulseRider/tree/97b0e9c2181d67de22f19df0791c0b046e79691b) `97b0e9c2181d67de22f19df0791c0b046e79691b`                       | src/components/SoloGame.tsx and LocalDuelGame.tsx: target, score and game-loop source. Server/PWA/browser build unverified.                                                                                                                                           |
| [LIN4CRE/LineRider](https://github.com/LIN4CRE/LineRider/tree/e877a7ac79ac70232fd4d4f5fe1cfe7b289a750c) `e877a7ac79ac70232fd4d4f5fe1cfe7b289a750c`                         | app/src/main/java/com/example/physics/PhysicsEngine.kt and data/TrackRepository.kt: Verlet physics, collisions and track persistence. No Android SDK/device install verification.                                                                                     |
| [LIN4CRE/Daves-Dash-](https://github.com/LIN4CRE/Daves-Dash-/tree/7c332f40614f5708329405445d131e717ef256a6) `7c332f40614f5708329405445d131e717ef256a6`                     | src/game/physics.ts, levels.ts and components/GameCanvas.tsx: platforming state, collisions and levels. Ran physics.test.ts with tsx: 8/8 passed. No full browser build certification.                                                                                |
| [LIN4CRE/digipoke](https://github.com/LIN4CRE/digipoke/tree/d9279c5020627ce03832f98a6a4d9a27a496f386) `d9279c5020627ce03832f98a6a4d9a27a496f386`                           | apps/web/src/domain/battle.js and apps/web/src/ui/screens/battle.js: creature battle implementation. Prior audit retrieved public onboarding, not battle; current external gameplay unavailable.                                                                      |
| [DLinacre/kush-flap](https://github.com/DLinacre/kush-flap/tree/907267f81202fc1dc673e442be0d1a55e719439c) `907267f81202fc1dc673e442be0d1a55e719439c`                       | index.html and README.md: separate single-file arcade-flyer source and recorded Pages demo. Not added as a separately released product: relationship to KushCloud and public playability need owner confirmation.                                                     |

## Local game checks

`npm run test:games` executes genuine Chromium input and state assertions, not just HTTP checks. `GAME_LAUNCH_CHECKS=1` additionally exercises every local launch view, fullscreen enter/exit, detail navigation and responsive catalogue/detail assets. A system Chromium path can be supplied with `CHROMIUM_PATH`; otherwise use Playwright’s installed Chromium.

| Game      | Desktop interaction asserted                                   | Touch-emulation interaction asserted                           |
| --------- | -------------------------------------------------------------- | -------------------------------------------------------------- |
| Circuit   | Enter rotates tile; move counter changes; Undo restores it     | Tap rotates and Undo restores it                               |
| Decrypt   | 1–4 fills slots, Enter submits and feedback appears            | On-screen symbols and Submit update feedback                   |
| Gridlock  | Focused edge + Enter draws edge; second edge accepted          | Taps draw distinct edges in two-player mode                    |
| Mines     | Enter reveals safe start; F flags a closed cell                | Tap reveals; Flag mode taps flag without revealing             |
| Pulse     | Observe first signal, number key repeats it and receives CLEAN | Observe first signal, tap repeats it and receives CLEAN        |
| Tiles     | Arrow-key sequence spawns/merges tiles                         | Synthetic TouchEvents exercise swipe handlers and change board |
| Trigger   | Wait for NOW, A awards a reaction point                        | Wait for NOW, tap side awards a reaction point                 |
| Afterglow | Free Studio drag changes actual paint canvas; Z/X exercised    | Synthetic TouchEvents paint onto actual canvas                 |

All eight: standalone HTML loads with HTTP 200, no page-script errors or failed HTTP assets, no horizontal document overflow in desktop 1280×800 or touch-emulated 390×844 checks. Launcher has minimal 48–52px controls and gives the remaining viewport to the game. Direct launch navigation and refresh, fullscreen enter/exit, game exits, and catalogue/detail layouts at 320/390/768/1440 widths were checked. Mobile checks use Chromium emulation, not physical iOS/Android hardware. Synthetic swipe/paint events are explicitly scoped as handler tests. Completion, every mode, save restoration, offline behaviour and audio fidelity have not been certified.

### Real defects fixed

- Mines previously revealed a cell in its own click handler before delegated Flag mode ran. A single per-cell action now chooses flag or reveal, with a long-press compatibility-click guard.
- Circuit’s decorative pseudo-element extended beyond its board stage and expanded the document width. Clip is applied only to the decorative stage.
- Shared challenge links in Decrypt/Pulse/Trigger and Circuit now use the standalone HTML route, avoiding a detail-page collision.

### Captures and provenance

The eight `public/gameplay/*.png` files are unedited screenshots of real local games following asserted gameplay input, captured by `CAPTURE_GAMEPLAY=1 npm run test:games`. They are not generated imagery. Canonical screenshot `sourceSha` records the Git blob hash of the exact HTML used; external game-script blob hashes are recorded below. These are file hashes, not claims that this working tree has been committed.

| Game      | HTML blob                                  | JS blob                                    |
| --------- | ------------------------------------------ | ------------------------------------------ |
| circuit   | `6ca94e813bbb8fa3fd24dda3b82b6ff006625887` | `d72ac958a4c0312760eec45989e0247cf5952d35` |
| decrypt   | `aa162d28064d1b6d5e7913952f1f46096a750cea` | `2972929fbb6cfd9664353d8d95b38bd45ab760ae` |
| gridlock  | `837f38b26609aaecfc08a1bb031b27be4ffbbff8` | `82ad2e39e6377f84c06eea05fe5015df104f7d07` |
| mines     | `675fbd2929c73097fad3d7690170ae39b04f7d3f` | `a0452510d7a6efb8b19e58d002c723b1a1ef8bfe` |
| pulse     | `fa8944a53cc66ffe85cc23da271f94a7d2a6d0a1` | `add93dc98661a6350f39e1b783f043b8a76127db` |
| tiles     | `3cbac931f9c5d3ce0ade377505e1a3e042cfaf12` | `3a2385fd111a87ffa3d0cfce85608e8354df39b5` |
| trigger   | `d224dbb78d09eee5129e72ba6f9108f1297f7ed2` | `918d55095b055c972f77291a03efcc054d2b49cc` |
| afterglow | `61f1a8dd6c1ffad7c657a4796f5354902d23d5b3` | `Inline in HTML`                           |

Afterglow is the upstream MIT-licensed self-contained `index.html`, byte-for-byte copied to `public/games/afterglow.html`. Its license is preserved as `afterglow.LICENSE.txt`. No application dependency bundle, remote tracking script or generated game implementation was substituted.

## Public-host limits

Browser retrievals of Afterglow, KushCloud, AeroFlap, Pixel Heist, Dragon Rush Heroes, Tap & Slap and DigiPoke external launch hosts all returned network connection errors from this sandbox, whose outbound hosts are restricted. This is **inconclusive**, not evidence the sites are dead. The earlier inventory’s page-retrieval evidence is preserved. Unverified recorded sites remain labelled secondary links on their detail pages; no new Play Now buttons or mobile-support claims were inferred.

## Hosting integration

- Vercel cleanUrls is disabled deliberately: automatically stripping `.html` would send a Play iframe back to its own detail page. Explicit clean studio rewrites remain in place.
- Studio pages retain frame denial. Only the eight known standalone HTML games permit SAMEORIGIN embedding with `frame-ancestors self`. Afterglow’s inline script uses its exact SHA-256 CSP allowlist hash rather than enabling arbitrary inline JavaScript.
- `/games/:slug/play` has a generated static HTML shell and explicit rewrite. Player loading verifies actual game DOM, times out, offers retry/standalone fallback, and exposes explicit Exit controls. Its fullscreen action reports unsupported/denied fullscreen instead of silently doing nothing.
- Existing screenshot-free games retain honest empty states. Source prototypes have no invented download or device support; no screenshots were promoted from unverified repository filenames.

## Remaining release gates

Physically test phones/tablets, especially iOS fullscreen/touch; validate complete game loops, saves and audio; confirm external deployments and backend alignment; run Roblox Studio installation and published-place tests; confirm prototype ownership/release state and franchise/asset rights before advertising releases. This working branch has not been deployed.

## Final automated checks

- `npm run typecheck`: passed.
- `npm test`: 149 tests passed across 16 files, including every canonical game detail and publication-gating tests.
- `npm run build`: passed; 103 generated route documents (79 detail pages and eight noindex launch shells included).
- `npm run content:validate`: 79 records, zero errors; 36 optional-artwork warnings (mostly Projects and source prototypes).
- `npm run lint`: zero errors; 160 warnings across the repository.
- Production browser run: all eight standalone games on desktop/touch emulation, all eight launch views with refresh/fullscreen/exit, and every Games detail at 320/390/768/1440 widths passed. Configured Vercel headers were applied to responses by Playwright to exercise same-origin framing and the exact Afterglow CSP hash in Chromium, not merely inspect strings. No deployment was used to perform this test.
- Additional read-only repository tests: Gyroll 24 pure-logic tests and Dave’s Dash 8 physics tests passed; neither result was promoted into a public release claim.
