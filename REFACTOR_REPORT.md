# Linacre.site Refactor & Modernization Report

Date: 2026-07-27
Mode: Refactor & Modernize
Stack: TypeScript + React 19 + Tailwind v4 + Vite

## Scope completed

This pass focused on the application shell, where the highest-impact technical debt was concentrated in `src/App.tsx`.

## Changes made

### 1. Clean modular architecture

Extracted responsibilities out of the monolithic `App.tsx` into focused modules:

- `src/app/types.ts` — shared app, route, theme, breadcrumb, and brand interfaces.
- `src/config/routes.ts` — canonical route labels, public-path ⇄ internal-tab mapping, preservation rules for deep routes.
- `src/config/brand.ts` — brand colour/font schemes, defaults, and typed resolution helpers.
- `src/hooks/useOnlineStatus.ts` — online/offline event subscription with cleanup.
- `src/hooks/useKonamiUnlock.ts` — isolated Konami sequence listener with cleanup.
- `src/hooks/useThemePreference.ts` — typed theme preference loading and DOM class application.
- `src/hooks/useIdleFlag.ts` — idle-time feature activation for deferred chunks.
- `src/hooks/useCommandPaletteShortcut.ts` — keyboard shortcut handling with text-entry guards.
- `src/hooks/useIdentityPreferences.ts` — localStorage/query-param identity synchronisation.

### 2. Bugs and stability fixes

- Fixed a TypeScript build blocker in `src/App.tsx`:
  - `setIsPaletteOpen` was undefined in `MobileBottomNav.openMore`.
  - Replaced with the existing command-palette opener contract.
- Fixed breadcrumb closure capture risk:
  - Intermediate breadcrumb click handlers now capture their own `targetPath`, not the mutable loop variable.
- Added explicit `locationPath` state:
  - Route metadata and breadcrumbs now update predictably during back/forward navigation, including blog deep routes.
- Hardened browser API usage:
  - Online status now safely defaults when `navigator` is unavailable.
  - Idle callback uses native DOM typing and clears timers/callbacks.
- Preserved existing public behaviour:
  - Existing public routes, hash fallback, `/contact/thanks`, `/cookie-policy`, `/terms`, and blog deep routes remain compatible.

### 3. Type safety and contracts

- Introduced typed app contracts for:
  - `ThemeMode`
  - `AppTab`
  - `BreadcrumbPath`
  - `BrandColorScheme`
  - `BrandFontScheme`
  - `IdentityPreferences`
- Centralised route and brand resolution logic so future changes can be tested without rendering React.

### 4. Test coverage added

Added Vitest and contract tests:

- `src/config/routes.test.ts`
  - Validates URL path to internal tab mapping.
  - Validates hash fallback behaviour.
  - Validates canonical tab to path serialisation.
  - Validates deep-route preservation rules.
- `src/config/brand.test.ts`
  - Validates default brand colours.
  - Validates custom colour scheme resolution.
  - Validates compatibility aliases and font fallback.

### 5. Dependency/security modernization

- Ran `npm audit fix`.
- Added `vitest` as a dev dependency.
- Added scripts:
  - `npm run test`
  - `npm run check`
- Verified `npm audit --audit-level=low` reports zero vulnerabilities.

## Verification results

All checks pass:

```bash
npm run lint
# PASS — TypeScript compile check

npm run test
# PASS — 2 test files, 7 tests

npm run build
# PASS — Vite build, prerender, server bundle

npm run check
# PASS — lint + tests + build

npm audit --audit-level=low
# PASS — found 0 vulnerabilities
```

## Build note

Vite reports a non-failing optimisation warning:

```text
src/lib/audioEngine.ts is dynamically imported by useKonamiUnlock.ts but also statically imported by Header.tsx, dynamic import will not move module into another chunk.
```

This warning existed as an architectural consequence of `Header.tsx` statically importing the audio engine. It does not break the build. A future pass can split sound preference helpers from playback synthesis to make the Konami sound lazy chunk effective.

## Suggested next refactor passes

1. Split the largest page modules:
   - `src/components/Lab.tsx` — 3101 lines
   - `src/components/DevPlayground.tsx` — 2636 lines
   - `src/components/AgentsHub.tsx` — 2154 lines
   - `src/components/IdentityHub.tsx` — 1453 lines
2. Add strict TypeScript mode incrementally using a dedicated strict tsconfig for new modules first.
3. Extract route rendering from `App.tsx` into a typed route registry to remove the long conditional render block.
4. Split `audioEngine.ts` into lightweight preference helpers and lazily loaded synthesis/playback implementation.
5. Add component-level tests for navigation, theme switching, and command palette open/close flows.
