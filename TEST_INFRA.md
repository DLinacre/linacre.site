# Test Infrastructure & Specification Guide — linacre.site

## 1. Test Philosophy: Opaque-Box & Requirement-Driven

The testing infrastructure for `linacre.site` is engineered according to an **opaque-box, requirement-driven methodology** anchored directly in the core requirements defined in `ORIGINAL_REQUEST.md`:

- **R1: Site Enhancements & Features**: Comprehensive verification of developer tools, Tabulous Games catalogue and built-in games, SPA routing, navigation contracts, and metadata integrity.
- **R2: Automated Verification & Code Standards**: Zero-tolerance for TypeScript compilation failures (`tsc --noEmit`), strict runtime assertions, and 100% pass rates across all test suites under the Vitest test runner (`npm test`).
- **R3: Build and Prerendering Integrity**: Verification of static prerendering contracts (`route-meta.json`, Schema.org JSON-LD graph generation, canonical URL consistency) and Express server guardrails (`api/server.ts`).

### Opaque-Box Principle
Tests verify **observable system behaviors, public interface contracts, and functional requirements** rather than ephemeral private implementation details. Tests interact with:
1. Public routing and navigation state resolvers (`getTabFromLocation`, `tabToPath`, `ROUTE_TAB_IDS`).
2. Production data manifests and asset contracts (`games.json`, built-in game asset presence, `route-meta.json`).
3. Pure algorithmic business logic of developer utilities (UTF-8 Base64 roundtrip, JSON formatting/minification, Unix/ISO timestamp conversions, RFC 4122 UUID v4 and cryptographically secure password generators).
4. Server endpoint boundary contracts (HTTP status codes, error payloads, payload size limits, CORS origin allowlists, sliding-window rate limiters).
5. Dynamic DOM head synchronization via `RouteHead` and Schema.org structured data specs.

---

## 2. Feature Inventory & Test Mapping

| Feature Area | Production Artifacts | Primary Test Focus | Methodology Tier |
|---|---|---|---|
| **Navigation & Routing** | `src/config/routes.ts`, `src/App.tsx` | URL normalization, hash fallback, canonical serialization, deep-route protection | Tier 1, Tier 2, Tier 3 |
| **Tabulous Games Catalogue** | `public/games/games.json`, `scripts/build-games.mjs`, `public/games/*` | Schema validation, instant-play enforcement, built-in games indexation, asset availability | Tier 1, Tier 2, Tier 4 |
| **Developer Tools** | `src/components/QuickTools.tsx`, `src/components/EverydayTools.tsx` | JSON formatting/minifying, Base64 UTF-8 roundtrip, timestamp parsing, UUID/password entropy | Tier 1, Tier 2, Tier 4 |
| **Server Contracts & Guards** | `api/server.ts` | `chatInputGuard` limits (prompt/history bounds), CORS allowlist validation, rate limiter | Tier 1, Tier 2, Tier 3 |
| **Prerendering & Metadata** | `route-meta.json`, `scripts/prerender.mjs`, `src/components/RouteHead.tsx` | 15-route completeness, canonical URLs, robots indexing rules, Schema.org JSON-LD | Tier 1, Tier 2, Tier 3, Tier 4 |

---

## 3. Test Architecture & Execution

### Test Runner & Environment
- **Runner**: [Vitest](https://vitest.dev/) v4.1.10
- **Environment**: `jsdom` (providing DOM APIs including `window`, `document`, `localStorage`, `history`, `navigator.clipboard`)
- **Setup Fixtures**: `src/test/setup.ts` configuring:
  - `@testing-library/jest-dom/vitest` matchers
  - Automatic test cleanup via `@testing-library/react`
  - Global stubs for `matchMedia`, `IntersectionObserver`, and `ResizeObserver`
  - Global `crypto` and `TextEncoder` / `TextDecoder` support

### Assertion Patterns & Invariants
- **Deterministic Assertions**: Exact string and structure comparisons (`toBe`, `toEqual`, `toMatch`).
- **Cryptographic Invariants**: Regex validation for RFC 4122 UUID v4 (`/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i`), entropy checks for password alphabet membership.
- **Fail-Fast Error Handling**: Boundary tests verify expected error messages and HTTP status codes (e.g. 400 Bad Request, 429 Too Many Requests) without unhandled exceptions.

### Mocking & Fixture Strategy
- **No Mocking of Business Logic**: Core algorithms (Base64 encoding/decoding, JSON transformations, timestamp calculations, password generation, route resolution) run in their real, unmodified implementations.
- **Minimal Isolation Mocks**: Express request/response mocks (`req`, `res`, `next`) isolate server middleware for unit verification without binding network ports or running external daemon processes.

---

## 4. 4-Tier Systematic Test Methodology

The automated test suite in `src/test/e2e-requirements.test.ts` follows a 4-tier systematic verification model:

```
┌────────────────────────────────────────────────────────┐
│  Tier 4: Real-World Application Scenarios              │
│  - Multi-step Developer Workflows                      │
│  - Gamer Catalog Search & Launch Journeys              │
│  - Search Engine Crawler Schema.org Audits             │
└───────────────────────────▲────────────────────────────┘
                            │
┌───────────────────────────┴────────────────────────────┐
│  Tier 3: Cross-Feature Combinations                    │
│  - SPA Navigation + Document Head Synchronization      │
│  - Developer Tool State Retention Across Switches     │
│  - Unified Audio Preference Synchronization            │
└───────────────────────────▲────────────────────────────┘
                            │
┌───────────────────────────┴────────────────────────────┐
│  Tier 2: Boundary & Corner Cases (>=5 per area)        │
│  - Multi-slash / Malformed Route Fallbacks             │
│  - Multibyte Unicode & ZWJ Emoji Base64 Encoding      │
│  - Zero / Negative Epoch & Leap Year Timestamps        │
│  - Corrupted JSON Syntax Exception Handling            │
│  - Chat Guard Edge Boundaries (4000 vs 4001 chars)    │
└───────────────────────────▲────────────────────────────┘
                            │
┌───────────────────────────┴────────────────────────────┐
│  Tier 1: Feature Coverage (>=5 per core area)          │
│  - Navigation & Route Mapping Contracts                │
│  - Tabulous Games Catalogue & Manifest Standards       │
│  - Developer Tools Logic & Transformations             │
│  - Server Endpoint Contracts & Guardrails              │
│  - Static Prerender & Route-Meta Completeness          │
└────────────────────────────────────────────────────────┘
```

### Tier 1: Feature Coverage (>=5 tests per core area)
Verifies the happy-path behavior, functional contracts, and API guarantees for each primary domain of `linacre.site`.

### Tier 2: Boundary & Corner Cases (>=5 tests per core area)
Stresses the system under boundary conditions, extreme sizes, malformed data, and edge cases to ensure resilience and zero unhandled crashes.

### Tier 3: Cross-Feature Combinations
Validates emergent behavior across module boundaries (e.g., routing interacting with dynamic DOM meta tags, developer tool tabs preserving user state, game audio toggles synchronizing across the site).

### Tier 4: Real-World Application Scenarios
Simulates realistic, multi-step end-to-end user workflows:
1. **Developer Workflow**: Unformatted JSON formatting -> Base64 encoding -> Unix timestamp parsing -> Password generation.
2. **Gamer Workflow**: Catalog exploration -> Category filtering -> Instant-play verification -> Built-in game launch.
3. **Search Engine Crawler Workflow**: `route-meta.json` sitemap compliance -> Schema.org graph integrity -> Robots directive verification.

---

## 5. Verification Command Reference

```bash
# Run full Vitest automated test suite
npm test

# Run Vitest in watch mode for development
npm run test:watch

# Run Vitest with V8 code coverage report
npm run test:coverage

# TypeScript compile & type diagnostics verification
npm run typecheck

# Full production build, games compilation, and static HTML prerender
npm run build
```
