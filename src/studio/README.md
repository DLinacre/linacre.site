# LIN4CRE visual system

## Direction

An independent studio, not an operations dashboard. Near-black backgrounds, navy surfaces, restrained ice-cyan actions, blue software accents and occasional lavender distinguish two collections. Self-hosted Inter supplies readable typography; no external font or image service is required. Real existing cover artwork is used without presenting it as screenshots. Records without artwork receive a named typographic/icon fallback, not invented imagery.

`studio.css` owns scoped `--st-*` colour, border and radius tokens. Existing global utility styles remain for legacy components. Shared primitives live in `components.tsx`: navigation/mobile disclosure, breadcrumbs, headers, search, category buttons, badges, artwork/cards, action links, empty states and footer. `Studio.tsx` composes home, independent collections, detail layouts, about and contact. Contact reuses the existing form and API without claiming its backend delivery issues are fixed.

## Interaction and responsive behaviour

- Standard anchors provide native browser navigation, link copying, back/forward and new-tab behaviour. Every detail URL is independently generated; there is no hidden modal-only detail state.
- Collections search canonical name, summary, tags and stack. Category buttons expose pressed state; counts announce changes. Search plus filter is composable and resettable.
- Games use a generous two-column artwork-led collection; Projects use a denser three-column catalogue. At tablet widths grids simplify; at mobile widths cards stack, filters wrap, navigation becomes an accessible disclosure and detail availability moves above the story.
- Interactive controls target at least 44px height. Focus outlines, a skip link, landmarks, semantic headings, explicit input labels and live search counts support keyboard and assistive technology use. Motion is limited to short hover transitions, removed under reduced-motion preferences.
- WCAG 2.2 AA is a target, not a claim of independently certified conformance. A full assistive-technology/manual audit, especially of retained legacy views, remains necessary.

## Routing and hosting

`src/main.tsx` mounts Studio. Canonical detail routes are `/games/:slug` and `/projects/:slug`; their paths derive from canonical records. Unknown detail slugs receive an explicit not-found view. Existing other paths retain the previous application; public HTML utilities/games still load as standalone files.

**Important collision resolved:** `/games/circuit`, `/games/decrypt`, etc. now mean studio detail pages. The actual games remain at `/games/circuit.html`, `/games/decrypt.html`, etc. Play actions were updated in canonical records. Historical URLs remain in the archive. Local tiles/mines were already explicit HTML links.

Vercel's old `/projects → /` redirects were removed. Explicit collection/detail rewrites target generated HTML files. `scripts/prerender.mjs` generates all 79 detail documents and eight noindex game-launch shells and route-specific title, description, canonical URL, sitemap entries and no-JS name/summary/actions. Vite serves SPA navigation in preview/development; Express serves generated directories in production. Existing standalone game HTML is copied unchanged. The service-worker cache version is bumped so old HTML is not held indefinitely.

## Validation

Run `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`. New tests cover all canonical route resolutions, rewrite/redirect configuration, real local playable files, mobile disclosure state/current-page semantics, search/reset/category interactions, and honest detail actions/status/media. No random/generated imagery or third-party gallery records were added.

Do not deploy as part of this design step. API authentication, contact delivery, and other outstanding audit findings are separate work; a visual refresh does not resolve them.

## Original Games extension

`GamesExperience.tsx` now owns Games landing, game details and the minimal full-viewport player. `gameLibrary.ts` is the shared publication/action gate. A recorded URL alone is never Play Now: status must be Live with functional evidence. Static self-hosted games are launched at `/games/:slug/play`; their exact `.html` files remain directly accessible. Other records show View Development, with source and clearly unverified recorded sites where available.

Use `npm run test:games` for real game input assertions; set `GAME_LAUNCH_CHECKS=1` for fullscreen/exit/responsive catalogue checks and `GAME_HOST_HEADERS=1` against the production server to enforce configured hosting headers in the browser. `CAPTURE_GAMEPLAY=1` explicitly refreshes the real gameplay captures. Detailed source and test evidence lives in `GAME_VERIFICATION.md`.

Vercel `cleanUrls` is false to preserve playable `.html` file URLs alongside clean detail URLs. Only the eight known game HTML files permit same-origin framing; the rest of the studio retains frame denial. Afterglow's unmodified inline game script is CSP-hash allowlisted.
