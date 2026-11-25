# Add a software project on Windows 11

1. Install Node.js 22 LTS (22.12+) and run `npm ci` in the website folder.
2. Inspect your public implementation, README and releases. Decide what is actually verified. Source alone is not a working application.
3. In PowerShell run:

```powershell
.\publish-project.ps1 -DryRun
```

Supply the name, unique lowercase slug, description, legacy content type (usually App), stack, development status, owned public GitHub repository, optional recorded deployment and actual screenshot paths (`|` separated). The script checks the repository via GitHub's public API and attempts a bounded HEAD request to the supplied deployment. A failed or successful HTTP check never creates a Live claim.

Choose a portfolio category from the displayed names. Type `SOURCE REVIEWED` only when you have actually inspected your public implementation. The publisher records the current source commit and your explicit confirmation; this is **your review**, not an automated code-quality certification. Without it, the entry remains a preserved draft/historical detail and is not added to the curated public portfolio. A deployment URL is optional.

Review every proposed file and the generated record. Run again without `-DryRun` and type `PUBLISH your-slug` to apply locally. For an update, use `-Replace` and type `REPLACE your-slug`. Backup/rollback behaviour is the same as the game publisher; see `ADDING_NEW_GAMES.md`.

## What is copied

Only your selected PNG/JPEG/WebP screenshots, after path and image-signature checks. The publisher does **not** copy application source folders, environment files, APKs or installers into the website. Keep large software downloads on your official GitHub Releases.

## Downloads and release status

The interactive publisher deliberately creates development records, not release claims. After reviewing an actual versioned GitHub release, add its exact asset URL to the canonical project's `downloads` array (label, URL, version, honest limitations note), and release metadata to `releases`. Then add dated verification/status evidence. The validator accepts only official versioned release URLs in those fields; it never invents URLs. An `.exe` is not automatically safe, and a source ZIP is not an application installer. No TypeScript files need editing.

Never label an Android APK as a Windows download, promote a debug build as a signed release, or infer Live from repository existence. Use explicit empty/unknown fields instead of guesses.

## Repeatable input

`-Metadata "D:\Projects\project-publication.json"` accepts the same shared fields as the game publisher, with `type: "project"`, an optional `liveUrl`, optional `portfolioCategory`, and optional `sourceReview: {"sha": "<actual 40-character commit>", "confirmed": true}`. A metadata file is a claim by its author: only supply a real inspected commit. It still requires interactive application confirmation. No unattended commit or deployment is performed.

## Review

The publisher runs validation, automated tests and the production build. Inspect `/projects` and `/projects/your-slug` in a browser, check links and screenshot provenance, then inspect `git diff` before deciding whether to commit. Native Windows/PowerShell testing is a remaining release gate; the shared engine's temporary-fixture tests do not certify Windows behaviour.
