# Performance lab report — 2026-11-25

Lighthouse 13.6.0 against the local production Vite preview, default mobile simulation, single run, Chromium in the sandbox:

| Category/metric | Result |
|---|---:|
| Performance | 79 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| First contentful paint | 0.9 s |
| Largest contentful paint | 5.7 s |
| Total blocking time | 80 ms |
| Cumulative layout shift | 0 |

**Lab results only, not field Core Web Vitals.** No CrUX/user-traffic measurements were obtained. A single run is noisy and local preview lacks production CDN behavior.

Lighthouse identified the homepage Afterglow screenshot as the LCP element, lazy-loaded after client rendering; the PNG is about 460 KB. Prioritize early discovery, eager/high-priority loading for the first visible card and appropriately sized modern-format captures. Preserve genuine artwork and source attribution. Do not regard the category scores as a release performance pass. Full raw report: ignored `.cache/qa/lighthouse-home.json`.
