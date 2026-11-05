# Hardening audit — 4 November 2026

Scope: React/Vite site, Express API, build and GitHub workflows, and the separate
stdio MCP package. Baseline: clean checkout; `npm run verify` passed 186 tests
and lint with 176 warnings; production build passed. MCP built and its harness
passed after dependency installation; its baseline audit reported 9 vulnerabilities
(including one critical in a transitive HTTP dependency). This is a targeted
review, not a penetration test or proof of WCAG conformance.

| Priority | Finding and location | Action and verification |
| --- | --- | --- |
| P0 | `api/server.ts`: unauthenticated Google endpoint issued privileged sessions, hard-coded password was accepted, and development Host header could bypass auth. | Disable unverified Google sign-in, remove defaults/bypass, require configured password hash and signing secret. API integration tests cover refusal, authentication, forged cookies. Rotate previously used credentials; production remains vulnerable until a fixed deployment is promoted. |
| P0 | Identity and playground rendered uploaded/generated SVG as HTML; Lab renders generated message HTML. | Sanitize SVG and rich HTML at render boundaries; tests check scripts, handlers and foreign content. CSS in SVG is stripped, which can change some imported designs. |
| P1 | Contact reported success even if file write failed; no configured email delivery despite documentation. | Send via Resend only when configured and confirm provider acceptance, return error otherwise; API tests exercise unconfigured, accepted and failed delivery. No live mail was sent. Existing contact files require secure handling. |
| P1 | Paid server-key fallbacks and local EV-Bot proxy lacked owner checks; direct requests could spoof forwarded IPs. | Gate paid fallbacks and proxy, trust Vercel's forwarded header only on Vercel. Login uses shared AI limiter. In-memory/contact limiting remains per instance; provider quotas and shared rate limiting are still necessary. |
| P1 | MCP lockfile had critical/high advisories. | Update SDK/transitives and Zod; audit, build and stdio harness pass. Test compatibility with actual MCP clients before publishing. |
| P2 | No API regression tests or MCP CI; Actions mutable and broad default permissions. | Add API tests and MCP CI; pin Actions by commit, add npm Dependabot and explicit permissions. GitHub-hosted CI has not been run on this branch. |
| P2 | Service worker could delete unrelated origin caches and save error pages. | Restrict cleanup to site caches, avoid caching failed navigations, correct offline fallback. Browser/offline testing remains outstanding. |
| P2 | README stated stale, unsupported performance/accessibility/test measurements and omitted essential configuration. | Remove unsupported claims and document configuration, limitations and recovery. |
| P3 | Existing lint warnings and formatting drift. | Retained rather than making unrelated bulk changes; `format:check` remains advisory and fails. |

## Remaining release gates

- Configure and independently verify contact delivery, shared limits and provider
  spending controls; do not assume paid APIs are free. Dashboard hash uses
  unsalted SHA-256 for existing-configuration compatibility: use a long random
  password and migrate to a memory-hard password hash and robust distributed
  login throttling before exposing it broadly.
- Browser E2E, accessibility, offline, mobile, real external integrations,
  production security scan and rollback exercise were not performed here.
- GitHub Pages is static-only, and `scripts/build-games.mjs` mutates tracked
  input files during builds. Review both deployment routes and eliminate
  destructive source mutation before relying on a dirty working tree.
- Review GitHub branch protection, secret scanning and security alerts in the
  repository settings. Existing historical secrets/passwords should be treated
  as compromised and rotated; history was intentionally not rewritten.

References: [Vercel request headers](https://vercel.com/docs/headers/request-headers),
[Resend verified sender requirements](https://resend.com/docs/knowledge-base/how-do-I-create-an-email-address-or-sender-in-resend),
[DOMPurify threat model](https://github.com/cure53/DOMPurify/wiki/Security-Goals-%26-Threat-Model),
and `npm audit` from the npm registry as of the audit date.
