# Studio content — authoritative authoring location

Games and projects are authored **only** in:

- `games/records.json` — 21 game/template records.
- `projects/records.json` — 58 software, integration, wrapper, directory and project records.

These 79 records are not 79 finished releases. Unverified status is intentionally omitted. Do not copy product text, URLs, status or features into components, `src/data.ts`, dashboard configuration, or the prerenderer.

## Architecture

```
records.json → content/index.ts
              ├─ canonical Games / Projects consumers
              ├─ adapters/siteProjects.ts → legacy library, search, actions, Ops HUD
              ├─ adapters/dashboard.ts → current App / ProjectRadar / terminal
              ├─ adapters/legacyData.ts → old PROJECTS / TOOLS exports
              └─ prerender-data.entry.ts → HTML, structured data, llms-full.txt
```

`dashboard-selection.json` contains IDs only. `tool-selection.json` contains content IDs and the utility-view category only. These are selections, not parallel product catalogues. Their references are validated. The dashboard's visual categories/colours live in optional canonical presentation metadata. Old `localStorage.linacre_site_projects` data is ignored, not deleted; visitor card editing is no longer mounted. The public registry cannot be silently replaced with stale browser data.

`src/data/siteProjects.ts` and `src/data.ts` are compatibility re-exports only. They hold no authored product records. `curatedWork.ts` did not exist in the checked-out DLinacre baseline: its audited LIN4CRE data was migrated into the same records and retained as an archival snapshot. No independent curated runtime catalogue was introduced.

`external-tools.json` is a separate third-party developer-resource directory (12 links), not studio work. The legacy 77-game directory is **archive only**, not imported by Games or any runtime adapter. Directory software such as Tabulous and APKHub can be recorded under Projects with `relationship: "directory"`; this never makes the games/apps they link to LIN4CRE creations. PixelPokeArena is a wrapper Project, not an original Game. Slime Factory Tycoon is a development/template Game with a Studio download, not a published Roblox experience.

## Record contract

See `schemas/content.schema.ts`.

Required: `id`, `slug`, `type`, `name`, `shortDescription`, `featured`, `relationship`; Projects additionally require `category`.

Optional: full description, problem solved, implementation/role, features, technology stack, platforms, genre, input methods, controls/modes, artwork, screenshots, source, documentation, play/live/download URL, related IDs and verification evidence. Missing facts stay absent. No dummy URLs, guessed screenshots, dates, device support, ratings, install counts or users.

The schema supports screenshot `src`, descriptive `alt`, optional capture date and source SHA. A cover/illustration is `artwork`, never automatically a screenshot. Unauthenticated historical screenshot/showcase paths remain in the archive, not in the public screenshot gallery. Existing source files/assets are preserved.

### Status and verification are different

Allowed values, case-sensitive:

- `Live`
- `Released`
- `In Development`
- `Prototype`
- `Archived`

**Omitted status → “Status not verified”.** A repository, landing page or successful boot does not establish a functional live application. `Live` requires a real play/application URL, dated functional/device evidence and a limitations note. `Released` requires a recorded download/release URL, dated evidence and a note; it does not certify a binary safe or tested. A release page is not automatically a binary: confirm assets before assigning that status.

Migration assignments use the audit: Deasy, Linacre Uninstaller and Dual Audio Synchronizer have release-asset evidence. Slime is explicitly In Development. Other statuses remain unverified instead of promoting old `live: true`, `PRODUCTION`, `STABLE`, “NEW”, or “Game · Live” claims. The 2026-11-25 verification dates record the completed audit, not new end-to-end testing. Each verification describes its actual scope (`source`, `page-retrieval`, `boot`, `functional`, `device-install`).

UI fallbacks: “Status not verified”, “No screenshots available”, and “Not yet published” for the unpublished Studio template. Missing artwork yields a fallback and validation warning rather than an invented image.

## Validation and tests

```sh
npm run content:validate
npm run typecheck
npm test
npm run build
```

Validation runs before **every build** and via `npm run verify`; CI already runs these commands. Validation errors return nonzero. Missing optional artwork produces actionable warnings; a reference to a nonexistent image is an error.

Checks include:

- Required fields and field shapes, IDs, lowercase kebab-case slugs.
- Global duplicate IDs/slugs/names and duplicate repositories, including account-fork aliases. The website repo may legitimately host multiple standalone subprojects. `BloxCapital` and `Blox-Capital` remain separate actual repositories, not deduplicated by stripping punctuation.
- Status values and evidence requirements, real ISO dates, structured development history.
- HTTP(S) link format without embedded credentials; local path traversal/protocol-relative paths rejected.
- Local routes against declared metadata, literal Vercel rewrites and actual public files. A generic SPA fallback does **not** make every path valid. Same-domain absolute links are also checked. This is structural validation, not a claim that App routing is repaired or deployed.
- Existing artwork/screenshots on disk, screenshot alt text, related-content IDs and dashboard/tool references.
- Directories/wrappers cannot be original Games.
- Migration regression checks, compatibility views and no runtime archive imports.

No network probing takes place at build time. URL-format validation cannot certify external uptime, download integrity, gameplay, platform support or rights. Those still require scoped human/device verification.

## Migration ledger and preservation

Immutable research snapshots are in `archive/`; do not import them into application/build code:

| Snapshot                             | Origin / reason                                                                                                            |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `siteProjects.dlinacre.json`         | All 69 local legacy entries, including duplicate CubeLab and private placeholders                                          |
| `siteProjects.lin4cre.json`          | All 25 entries from audited LIN4CRE main                                                                                   |
| `curatedWork.lin4cre.json`           | Five selected projects and four selected games from audited LIN4CRE main                                                   |
| `dashboard-projects.json`            | Eight former active dashboard cards; unverified version/performance/production claims retained only here                   |
| `manual-projects.json`               | 32 additional records formerly authored in src/data.ts, including repeated KushCloud; case-study text migrated             |
| `tools.json`                         | Original mixed 28-entry tools list; 16 studio references now derived, 12 external resources separate                       |
| `slime-factory-tycoon.manifest.json` | Complete original manifest including unverified metrics/media; useful systems/history/roadmap migrated, no live-game claim |
| `external-games.json`                | 77 third-party games, never published as original games                                                                    |
| `private-placeholders.json`          | Nonpublic placeholders excluded from public records                                                                        |
| `local-ecosystem.json`               | Unused local workstation scan formerly src/data/ecosystem.json; not a public product registry                              |

Upstream snapshots came from read-only audit research of `LIN4CRE/linacre.site` main `c92645cdc3e2e16b69731fa53c1ff095d111727a`; local baseline was `DLinacre/linacre.site` `d9b98a0084eff3a11a750f604cb658e54b95aaeb`. No branch switch, production deployment, or remote source overwrite occurred.

Useful descriptions, features, source URLs, case studies, controls, modes, stack, system details, changelog and roadmap were merged. Duplicate aliases were collapsed. Unsupported historic badges/metrics/release years were not re-promoted. The OmniRoute dashboard now points at the actual OmniRoute repository, not LLM Benchmarks. Relative Slime screenshots were not re-published as authenticated captures. Missing upstream-only artwork and nonexistent local `/orbit`/`/music-videos` app routes are not silently blessed: Orbit retains source/documentation and a limitation note; Music Videos uses its recorded canonical external player URL. Source snapshots preserve all prior destinations.

The older data may contain contradictions and marketing claims. Archive preservation does **not** certify them. Future content editors must update canonical records, not regenerate them from those snapshots.

## Scope boundary

This is a content architecture migration, not a redesign or production security fix. The audit's broader App routing, API authentication, contact delivery and deployment-source divergence findings remain outstanding. Nothing was pushed to main or deployed. The session continues on its assigned DLinacre working branch; merging into or retargeting the LIN4CRE fork requires a separate deliberate GitHub step.

## Games verification follow-up

The Games rebuild added seven genuine source prototypes, promoted eight locally functionally tested browser builds with scoped evidence, and imported the unmodified MIT Afterglow standalone build. The public catalogue now contains 21 Games and 58 Projects; only eight games receive Play Now. See `GAME_VERIFICATION.md` for source SHAs, actual tested controls, screenshot provenance, the local/production distinction and remaining release gates. Historical migration assertions above describe their original point in time, not current testing coverage. The 77-game third-party data is also preserved in an explicitly labelled static `/legacy-games` archive; neither directory data file is consumed by the original Games catalogue.
