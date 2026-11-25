# Accessibility checks — 2026-11-25

Axe-core Playwright checks using WCAG 2 A/AA, WCAG 2.1 AA and WCAG 2.2 AA tags reported **zero automated violations** on `/` and `/projects` at all five requested viewport sizes. Browser filtering, zero-results reset and list-view controls passed; React tests cover labelled filters, project headings, availability actions and broken-image fallback. Fifteen curated project routes passed browser heading/direct-entry/refresh checks.

This is **not WCAG 2.2 AA certification**. Full keyboard traversal, screen-reader reading order, visible-focus contrast, zoom/reflow, motion preferences, touch target assessment, every detail route and embedded games still require complete manual assessment. Screenshots were captured at 390 and 1440 widths; their existence is not a claim of completed human visual review. Raw automated results: ignored `.cache/qa/portfolio-browser.json`.
