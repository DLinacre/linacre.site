# Add a game on Windows 11

## Before you start

1. Install **Node.js 22 LTS (22.12 or newer)**. Open PowerShell in this website folder.
2. Run `npm ci` once. Keep your original game in a different folder.
3. Export a production browser build. For Vite games use `npm run build -- --base=./` in the **game's** folder. The publisher selects `dist` when it exists.
4. Check the game in a browser yourself. The publisher can validate files, not decide whether arbitrary software has real gameplay.

## Preview first

```powershell
.\publish-game.ps1 -Source "D:\Projects\MyGame" -DryRun
```

If PowerShell blocks a local script, inspect it first. You may allow the inspected scripts **for this PowerShell window only** with `Set-ExecutionPolicy -Scope Process RemoteSigned`. Do not change the machine-wide execution policy or run downloaded scripts blindly.

The prompts ask for a name, lowercase slug, description, genres, stack, public GitHub repository, development status and optional real screenshots. Type `PUBLIC` only after checking every selected file can be public. Use `|` to separate screenshot paths. The dry run prints the proposed manifest and **every file it would copy**; it writes nothing.

## Apply locally

Run the command again without `-DryRun`. Review the file list and type `PUBLISH your-slug` exactly. The publisher:

- Requires `index.html`, local browser JavaScript and resolvable relative references.
- Rejects TypeScript source entrypoints, broken local references, path escapes and root-absolute asset paths.
- Rejects symlinks/junctions, environment files, private-key files, installers, APKs, unsupported extensions and common embedded secret patterns.
- Limits builds to 25 MB / 500 files; screenshots to 5 MB each, with image-signature checks.
- Copies only the selected browser build to `public/published/games/<slug>/build`.
- Updates **one canonical JSON manifest** and derives the catalogue/detail page from it.
- Runs catalogue validation, the automated tests and a production build.
- Restores the previous manifest/assets if checks fail. The original source folder is never deleted.

A source scan cannot prove there are no secrets or private assets. Your explicit review is mandatory. Never supply a private repository's files or copyrighted third-party game files you do not have the right to publish.

## Status is not guessed

New entries default to **Prototype**. The publisher deliberately refuses Live/Released: passing structural checks is not proof of gameplay or a public release. The game appears in development with a recorded build link. After actual input/device tests, update its canonical JSON evidence (`verification`, `lastVerifiedDate`, `statusNote`, real screenshots) and status. No React or TypeScript changes are needed. `GAME_VERIFICATION.md` gives examples of scoped evidence; do not copy another game's test claims.

The website recognises published build paths automatically. Once functionally verified Live, a local build receives `/games/<slug>/play` with fullscreen/exit controls. Hosting permits external local scripts, **not arbitrary inline executable scripts**. Move inline game code into a `.js` file before importing. Fetching external services is not automatically allowed by CSP.

## Updating an existing game

Use `-Replace`, then explicitly type `REPLACE your-slug`. Only the exact matching ID/slug/type is replaced. A cross-type collision is rejected. Backups are stored in ignored `.publishing-backups/<timestamp>/`; do not commit those backups. New replacement content invalidates old verification claims and needs retesting.

## Repeatable metadata input

You can supply a JSON metadata file with `-Metadata "D:\Projects\game-publication.json"` instead of prompts. Fields: `type` (`game`), `name`, `slug`, `description`, `source`, `genre` (array), `technologyStack` (array), `status`, `repository`, `screenshots` (array), `publicConfirmed` (boolean). It is subject to the same checks and still requires an interactive final confirmation; it is not an unattended commit mechanism.

## Final review

Run `git diff`, start `npx vite --host 0.0.0.0`, inspect the game and detail page, and run `npm run test:games` for the existing verified games. Commit only when you understand the changes. **No script commits, pushes or deploys.**

Windows 11/native PowerShell execution still needs verification on a Windows runner. The shared Node publishing engine is exercised against disposable temporary fixtures on Linux; that is not claimed as a physical Windows test.
