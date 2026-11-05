#!/usr/bin/env node
/**
 * Real-Chromium smoke suite against the built dist/ served by Vite preview.
 * Run via: npm run test:e2e (after npm run build).
 */
const { spawn } = require('node:child_process');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const PORT = Number(process.env.SMOKE_PORT || 4173);
const BASE = `http://127.0.0.1:${PORT}`;

function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      http
        .get(url, res => {
          res.resume();
          resolve();
        })
        .on('error', err => {
          if (Date.now() - start > timeoutMs) reject(err);
          else setTimeout(tick, 200);
        });
    };
    tick();
  });
}

(async () => {
  const preview = spawn(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['vite', 'preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'],
    { stdio: 'pipe' },
  );

  let browser;
  try {
    await waitForServer(BASE);
    browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();

    const errors = [];
    page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
    page.on('console', m => {
      if (m.type() === 'error') errors.push(`console.error: ${m.text()}`);
    });

    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await page.locator('h1').first().waitFor({ timeout: 5000 });
    assert.match(await page.title(), /LIN4CRE/i);
    for (const projectName of [
      'Dual Audio Synchronizer',
      'CubeLab',
      'HELIX',
      'Orbit & Earth Observatory',
      'SpeedRead',
    ]) {
      await page.getByRole('heading', { name: projectName }).first().waitFor({ timeout: 5000 });
    }

    await page.goto(`${BASE}/games`, { waitUntil: 'networkidle' });
    for (const gameName of ['Afterglow', 'Circuit', 'Decrypt', 'Gridlock']) {
      await page.getByRole('heading', { name: gameName }).first().waitFor({ timeout: 5000 });
    }

    await page.goto(`${BASE}/about`, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: /Independent software from South Yorkshire/i }).waitFor({
      timeout: 5000,
    });

    await page.goto(`${BASE}/contact`, { waitUntil: 'networkidle' });
    await page.locator('input[placeholder="Jane Doe"]').waitFor({ timeout: 5000 });

    await page.goto(`${BASE}/orbit`, { waitUntil: 'domcontentloaded' });
    await page.locator('svg[aria-label*="Interactive world map"]').waitFor({ timeout: 5000 });

    await page.goto(`${BASE}/helix/`, { waitUntil: 'domcontentloaded' });
    await page.locator('#world-canvas').waitFor({ timeout: 5000 });

    assert.deepEqual(errors, [], `Browser reported errors:\n${errors.join('\n')}`);
    console.log('✓ browser smoke passed (/, /games, /about, /contact, /orbit, /helix/)');
  } finally {
    if (browser) await browser.close();
    preview.kill('SIGTERM');
  }
})().catch(err => {
  console.error('✗ browser smoke failed:', err);
  process.exit(1);
});
