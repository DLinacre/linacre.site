# LIN4CRE rebuild plan — approval required

**Prepared:** 2026-11-25 UTC  
**Status:** proposal only. Audit finished; redevelopment has not begun.  
**Evidence:** [WEBSITE_AUDIT.md](WEBSITE_AUDIT.md), [GAME_INVENTORY.md](GAME_INVENTORY.md), [PROJECT_INVENTORY.md](PROJECT_INVENTORY.md).

## 1. Product direction

Make LIN4CRE a professional independent **software and game studio** whose website demonstrates its actual work.

Two equal, first-class destinations:

1. **Games** — original games, clearly distinguished as browser-playable, downloadable, playable prototype, in development or source/template.
2. **Projects** — applications, Windows programs, Android apps, useful tools, AI systems and experiments, with honest platform and maturity information.

The site should not become a general technology/game directory or a personal desktop dashboard. A small homepage selection is appropriate; arbitrarily hiding all Android/Windows work because it is not instant-play is not. Originality, usefulness and demonstrated quality matter more than repository count or technology buzzwords.

## 2. Decisions required before implementation

### A. Authoritative source and deployment relationship

Observed:

- Current workspace/DLinacre main: `d9b98a0…`, personal portal.
- LIN4CRE main: `c92645c…`, later editorial/hardening work.
- Production: LIN4CRE `434be2a…`, old 25-project/77-game presentation.
- Latest preview: LIN4CRE `5ab2438…`, protected older feature-branch build.

**Recommendation:** treat current LIN4CRE main as an important later reference, not as a proven ready-to-ship replacement. Review its security/curation work against this checkout and deliberately reconcile on the current working branch after approval. Do not overwrite this checkout or switch branches as part of the audit. Do not blindly deploy either version. Confirm which repository will own ongoing production, its configured main/production branch, Git integration and release permissions; inspect currently deployed function contents privately for the P0 risks.

Deliverable gate: an owner-approved authority map containing repository, default branch, Vercel project/team, production ref and domain aliases. Verify actual settings rather than relying only on old deployment metadata. No DNS changes are presently justified: both domains are correctly assigned and DNS checks pass.

### B. Public catalogue policy

Approve a single catalogue with separate public selection and development visibility flags. Every discovered repo remains in the audit inventory, but not every repo becomes a public card. Distinguish original products, integrations/wrappers, templates, directories and experiments.

### C. Product status clarification

Owner confirmation needed for active development priorities, abandoned/renamed projects, exact creation dates, supported platforms, canonical repo/fork relationships, genuine screenshots and third-party asset rights. This is especially important for newer games without README/build URLs and for private/inaccessible catalogue entries.

### D. Downloads and testing access

Decide how test builds are labelled, signing/checksum requirements and acceptable Windows/Android test devices. Provide authorised preview access without exposing credentials or globally disabling protection. Do not use a protected deployment's login page as evidence that the app works.

## 3. Prioritised work sequence

### Stage 0 — security and deployment containment (release blocker)

This can be an independently scoped security task before the visual rebuild, **but requires explicit approval**.

- Review `api/server.ts` hard-coded master authentication, fallback signing material, unverified Google-session issuance, environment/Host bypass and paid provider/local-proxy endpoints.
- Reuse only reviewed parts of LIN4CRE's November hardening work. Fail closed when auth configuration is absent; verify identity tokens server-side or disable the unused provider flow.
- Rotate previously public/default authentication material and relevant sessions; review provider usage/budgets. Never copy secrets into Git, reports or chat.
- Require owner auth and distributed limits for owner-funded APIs; add login throttling, provider quotas and robust request validation.
- Make contact success depend on real provider acceptance/durable delivery; show truthful failure states. Define retention and privacy requirements.
- Triage root and MCP lockfile advisories by runtime exposure; make reviewed, tested dependency updates, not an unexamined bulk `audit fix`.
- Confirm production security state through authorised inspection, not exploit testing. Latest production predates documented hardening, but exact deployed function behaviour was not tested in the audit.

**Exit gate:** authentication regression tests, failure-mode tests, no public default credentials, reviewed SVG/HTML rendering boundaries, verified deployment SHA, cost controls, and an explicit security reviewer sign-off. Do not hold a known exposed API open waiting for a complete redesign if authorised containment can be shipped safely first.

### Stage 1 — evidence-backed content registry

Replace overlapping active data models with one typed and validated registry. Preserve old manifests/catalogues in history/source until migration is accepted.

Suggested fields (proposal, not implemented):

```ts
type WorkStatus =
  | 'released'
  | 'playable-prototype'
  | 'in-development'
  | 'source-only'
  | 'archived';

type Verification = {
  checkedAt: string;
  sourceSha?: string;
  deploymentUrl?: string;
  method: 'source' | 'page-retrieval' | 'boot' | 'functional' | 'device-install';
  outcome: 'passed' | 'failed' | 'blocked' | 'not-tested';
  scope: string; // e.g. boot only, no cloud save test
};

type StudioWork = {
  id: string;
  name: string;
  section: 'game' | 'project';
  relationship: 'original' | 'integration' | 'wrapper' | 'template' | 'directory';
  summary: string;
  status: WorkStatus;
  platforms: string[];
  repositoryUrl?: string;
  demoUrl?: string;
  playUrl?: string;
  downloads: {
    url: string;
    version: string;
    platform: string;
    kind: 'application' | 'test-build' | 'source' | 'studio-template';
    checksumUrl?: string;
    signingNotes?: string;
  }[];
  media: {
    src: string;
    alt: string;
    kind: 'screenshot' | 'video' | 'concept-art' | 'cover';
    capturedAt?: string;
    sourceSha?: string;
    platform?: string;
  }[];
  docsUrl?: string;
  verification: Verification[];
  featured: boolean;
  public: boolean;
};
```

Validation rules:

- Stable unique IDs, no duplicate canonical entries; fork/canonical relationship explicit.
- No Play button without a current actual game build. A repository URL is Source; a documentation page is Docs; a release listing is not automatically an installable download.
- Released status requires version/build evidence and suitable functional verification. Keep verification scope separate from maturity: an untested release is not automatically unreleased.
- No invented metrics, player counts, usage, development dates, “production” badges or inherited quality scores.
- Browser, Windows and Android are equally legitimate platforms. Debug APK, WebView wrapper and Roblox Studio template get unmistakable labels.
- Screenshot filenames cannot establish authenticity. Require build/capture provenance or mark cover/concept art honestly.
- Public content/rendered routes, static metadata, sitemap and structured data consume the same registry.

**Exit gate:** all public records reconciled against inventory; owner approves canonical repository and status; no broken asset paths, duplicate CubeLab or OmniRoute/Benchmarks mismatch.

### Stage 2 — verify candidate products before designing around them

#### Games shortlist (not a declaration of finished status)

| Candidate | Existing evidence | Required before a confident public Play claim |
|---|---|---|
| Circuit, Decrypt, Gridlock | Local boot checks pass; public UI retrieved; included in later selected-games data | Complete a round; new/reset/mode controls; keyboard/touch; audio opt-in; save/streak/time-zone behaviour; genuine capture |
| Tiles, Mines, Pulse, Trigger | Local HTML/JS boot checks pass | Same core tests; reaction/memory/two-player mechanics on actual phones; accessibility and restart states |
| AFTERGLOW, KushCloud | Public UI retrieved and source available | Play loop, progression/save/export, touch/keyboard, account/leaderboard/offline claims and asset review |
| Pixel Heist | Public briefing and source | Enter gameplay, complete/fail/restart, validate controls and investigate stale daily date |
| AeroFlap, Tap & Slap | Source/README exist; listed live URLs failed retrieval | Recover/confirm canonical deployment; then gameplay and device checks |
| DigiPoke | Public onboarding and source | Finish onboarding through battle/save/reload; optional sync/privacy; asset/IP review |
| Dragon Rush Heroes | Landing UI and source | Core battle, persistence, signup handling, marketing claims and third-party asset/IP review |
| Slime Factory Tycoon | Real `.rbxlx` asset and development manifest | Template card now only if accurate; consumer game only after published Roblox URL and real gameplay/device testing |
| Frostpine, Gyroll, Daves-Dash-, MmoSnake, PulseRider, LineRider | Game-related source exists; no verified release endpoint | Build/setup documentation and demonstrable prototype; do not advertise download/play before that |

Do not include Android-all-stars as installable: its README explicitly says Android packaging cannot build yet. PixelPokeArena may qualify as a wrapper project, not an original game release. Third-party ports and the 77-game directory should not count as LIN4CRE originals.

#### Projects shortlist

- **Dual Audio Synchronizer:** actual Windows EXE and product documentation. Install on clean supported Windows; verify device enumeration, playback, stop/recovery and claimed drift/DSP behaviour before publishing quantitative guarantees.
- **CubeLab:** public solver UI. Exercise invalid/valid painted cubes, scramble/solution, worker failure and offline installation; review canonical fork versus deployed source.
- **HELIX:** public static UI and source. Verify actual VM controls/performance, pause/reset and intentional simulation behaviour; support with genuine captures.
- **SpeedRead:** public reader UI. Test PDF/EPUB parsing, worker/offline behaviour, privacy and failure modes; confirm book licensing.
- **Orbit:** later site source and advertised production route. Test live/fallback/stale telemetry labelling and API failure behaviour; do not imply orbital estimates are live feeds.
- **Windows/Android candidates:** Deasy, LIN4CRE-SENTINEL, DBSTEAM, Linacre Uninstaller, Smart Mail and Azaroth Installer have release evidence. Decide inclusion on product quality, safety and device testing, not broad framework claims. Resolve version mismatches/debug labels/signing and asset rights.
- **Other browser/AI work:** assess useful standalone applications from the inventory individually; a sizeable backend or README is not proof of functioning AI integration.

**Exit gate:** each featured product has a dated verification record, source/build identity, actual screenshot, accurate action and platform/status. If no candidate passes, show fewer products honestly rather than fill space with external directories.

### Stage 3 — studio information architecture and visual design

Proposed primary routes:

| Route | Purpose |
|---|---|
| `/` | Studio introduction; a few verified games/projects; clear Games and Projects actions |
| `/games` | Original games with platform/status filters; playable/downloadable distinction |
| `/games/:slug` | Game description, actual media, controls, requirements, version, status, Play/Download/Source |
| `/projects` | Software/apps/tools/AI/experiments catalogue, not a homepage redirect |
| `/projects/:slug` | Problem, what was built, screenshots, platform, limitations, source, demo/download |
| `/about` | Studio identity, real experience, approach and ownership |
| `/contact` | Reliable contact path; honest delivery/error states |
| Legal/accessibility paths | Accurate policies reflecting the implemented site |

Preserve existing standalone game URLs and static script paths. Choose carefully how detail routes coexist with `/games/circuit` already launching a game: keep that public action working or explicitly approve a compatibility map; do not silently replace gameplay with an unrelated listing. Keep development work in a clearly labelled subsection only if useful. Search/filtering should use real categories, not lead with technology tags.

Visual principles:

- Retain distinctive restrained dark/colour identity where useful, but product media and content should lead, not a clock, anime backdrop or status console.
- One clear studio identity and concise value statement; do not invent team size, clients, awards or success metrics.
- Generous readable type, strong focus states, clear text actions and obvious platform/status. Avoid tiny icon-only primary actions and clipped essential descriptions.
- Screenshots from running software; cover art may accompany but never masquerade as a screenshot.
- No automatic audio, canvas takeover or autoplay game on the studio homepage. Respect reduced motion and provide sound controls in game/player contexts.
- Isolate music, generic utility directories, brand tools, rig controls and internal labs from primary studio navigation; keep useful direct links/compatibility where safe.

**Exit gate:** owner approves desktop/mobile content-first designs and representative game/project pages before widespread implementation.

### Stage 4 — implementation and migration

Choose routing/rendering strategy only after scope agreement. React/Vite can serve this site; there is no evidence-based requirement for an immediate framework rewrite.

- Ensure a single route definition drives rendering and metadata. Do not emit route-specific static content that client JavaScript replaces with a different page.
- Restore true navigation/back-forward/deep links and useful not-found pages. Remove `/projects → /` only as part of an explicit migration, including old detail URLs.
- Replace ProjectRadar's visitor-editable localStorage catalogue with published registry data. If a private personal portal is retained, separate it from the public studio app and authenticate privileged actions server-side.
- Lazy-load heavy simulations/games/media only in appropriate contexts. Hidden CSS panels must not probe localhost or initialize unrelated services.
- Make a deliberate API decision: retain only needed public features, with secure boundaries; static portfolio pages should not need provider credentials.
- Scope service-worker caches, validate response status, version assets and test updates/offline recovery. Remove confusing duplicate root/public manifests where possible after compatibility review.
- Generate metadata, sitemap, accessible fallback HTML and structured data from real content. Do not describe wrappers/templates as complete VideoGame releases. Use appropriate SoftwareApplication/SoftwareSourceCode semantics.
- Optimise images and media; isolate large audio/video from initial route loading, with responsive images and accessible media controls. Keep historical assets intact until references/rights are reviewed.
- Refresh README/AGENTS/build documentation to describe the actual architecture and reproducible checks; preserve old audits as dated history.

**Exit gate:** reviewed implementation on the current tracked branch, approved public selection, accurate routes/actions/media, compatibility map and passing quality gates below.

### Stage 5 — deployment and launch

- Resolve failed LIN4CRE main CI/deploy runs; establish root cause from authorised diagnostics. Empty job-step metadata alone does not identify billing, secrets or source errors.
- Use one clear production pipeline or documented Git integration; require CI success before promotion and record commit SHA. Do not let a skipped deploy masquerade as production success.
- Keep preview access controlled but testable. Confirm allowlists, CSP/frame behaviour and external API origins in the real preview environment. Do not globally weaken production headers for the convenience of an embedded preview.
- Deploy a reviewed preview from the approved source, validate app routes and standalone games with/without JS, then promote only with explicit production approval.
- Verify both domains, apex redirect, cache invalidation, service-worker update, contact delivery, download redirects/content types and deployed SHA.
- Retain rollback target and run a documented rollback rehearsal. A build receipt is not a runtime health check.
- If GitHub Pages remains, explicitly document static-only limitations/base paths and test it independently; otherwise avoid competing public destinations that appear equivalent but lack APIs.

**Exit gate:** recorded production deployment ID/SHA, evidence of functional smoke checks, owner sign-off and rollback instructions.

## 4. Quality gates to add

| Area | Required evidence |
|---|---|
| Routes | Each canonical path renders correct identity with JS on/off; reload/back/forward; unknown routes genuinely not found; compatibility redirects intentional |
| Catalogue | Unique IDs; valid actions; required release/status/platform fields; no private placeholders in public output; source/HTML/metadata agree |
| Games | Boot plus real play/win-or-loss/restart; controls; touch/keyboard; persistence; audio opt-in; performance on representative devices |
| Downloads | Real artifact, correct version/platform, signature/checksum notes, clean install/run/uninstall or honest test-build label |
| Security | Auth/token validation/fail-closed configuration, protected funding paths, distributed abuse controls, sanitisation and dependency review |
| Contact | Accepted delivery tested with permission; error path truthful; retention/privacy documented; no false success |
| Accessibility | Automated axe plus manual keyboard/focus, screen-reader labels, contrast, zoom, reduced motion, modal and media checks; no “WCAG compliant” claim from a narrow scan |
| Performance | Fresh mobile/desktop measurements, transfer budgets by route, no unrequested full media payloads; do not recycle README numbers |
| PWA | Clean install/update/unregister/offline; cached errors not treated as content; no unrelated origin cache deletion |
| Deployment | CI actually ran for the exact SHA; preview accessible to authorised testers; production domains target approved build; rollback rehearsed |

Retain existing useful 72 unit/component tests and MCP harness, but add App/router integration and browser tests. Tests of unmounted legacy components are not release coverage for the current portal. Format drift should become a controlled migration task, not a giant unrelated rewrite.

## 5. Preservation and removal policy

**No deletions happened in this audit.** During implementation, distinguish:

- **Remove from public navigation/featured selection:** personal rig controls, unsupported status claims, visitor card editing, generic directory promotions, unverified launch buttons and third-party games counted as studio work.
- **Preserve as source/history:** old catalogues, third-party game JSON, scripts, game directories, historical docs, existing releases and repositories.
- **Keep public with accurate labels when valuable:** source-only tools, development prototypes, wrappers/integrations and Studio templates, subject to quality/rights review. Not being a browser app is not grounds for automatic exclusion.
- **Delete only after separate approval:** assets/code with confirmed no references, security-sensitive material requiring removal, obsolete public endpoints and unwanted historical content. Preserve inbound-link compatibility where safe.

## 6. Definition of done

The rebuild is complete only when a new visitor can answer, without reading source code:

1. What LIN4CRE is and what it has actually made.
2. Which games can be played now and on which devices.
3. Which applications can be used/downloaded, versus which are prototypes/templates/source.
4. Where to see actual screenshots, documentation, limitations and the source.
5. How to contact the studio reliably.

And the owner can show the exact approved source SHA deployed to both domains, reproduce the quality checks and roll it back safely.

**Next action:** review these reports and approve source authority, content policy and scope. Do not start redevelopment or deployment merely because this plan exists.
