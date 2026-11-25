import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const base = process.env.PORTFOLIO_BASE_URL || 'http://localhost:4174';
const projects = JSON.parse(fs.readFileSync('src/content/projects/records.json', 'utf8')).filter(
  p => p.portfolio,
);
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH,
  args: ['--no-sandbox'],
});
const report = { base, viewports: [], routes: [], accessibility: [], errors: [] };
try {
  for (const [width, height] of [
    [1440, 900],
    [1024, 768],
    [768, 1024],
    [390, 844],
    [360, 800],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      serviceWorkers: 'block',
    });
    const page = await context.newPage();
    page.on('pageerror', e => report.errors.push(e.message));
    for (const route of ['/', '/projects']) {
      assert.equal((await page.goto(base + route)).status(), 200);
      await page.locator('h1').waitFor();
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        false,
        `horizontal overflow ${width} ${route}`,
      );
      const axe = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      report.accessibility.push({
        width,
        route,
        violations: axe.violations.map(v => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map(n => n.target),
        })),
      });
      if (width === 390 || width === 1440) {
        fs.mkdirSync('.cache/qa', { recursive: true });
        await page.screenshot({
          path: `.cache/qa/${route === '/' ? 'home' : 'projects'}-${width}.png`,
          fullPage: true,
        });
      }
    }
    await page.getByRole('searchbox').fill('no-match-xyz');
    await page.getByRole('status').filter({ hasText: '0 projects' }).waitFor();
    await page.getByRole('button', { name: 'Clear filters' }).first().click();
    await page.getByRole('button', { name: 'List view' }).click();
    assert.equal(
      await page.getByRole('button', { name: 'List view' }).getAttribute('aria-pressed'),
      'true',
    );
    report.viewports.push({ width, height, overflow: false, filters: true });
    await context.close();
  }
  const page = await browser.newPage();
  for (const p of projects) {
    const route = '/projects/' + p.slug;
    assert.equal((await page.goto(base + route)).status(), 200);
    await page.getByRole('heading', { level: 1, name: p.name, exact: true }).waitFor();
    assert.equal((await page.reload()).status(), 200);
    report.routes.push(route);
  }
  assert.equal(report.errors.length, 0);
} finally {
  await browser.close();
  fs.mkdirSync('.cache/qa', { recursive: true });
  fs.writeFileSync('.cache/qa/portfolio-browser.json', JSON.stringify(report, null, 2));
}
console.log(JSON.stringify(report, null, 2));
assert.equal(
  report.accessibility.flatMap(r => r.violations).length,
  0,
  'Automated accessibility violations',
);
