/** Real-browser game smoke checks. Run against npm run dev or a built website.
 * GAME_BASE_URL, CHROMIUM_PATH and LD_LIBRARY_PATH may be set in constrained CI.
 * CAPTURE_GAMEPLAY=1 writes genuine gameplay captures (not artwork).
 */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base = process.env.GAME_BASE_URL || 'http://localhost:5173';
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
  args: ['--no-sandbox'],
});
const slugs = ['circuit', 'decrypt', 'gridlock', 'mines', 'pulse', 'tiles', 'trigger', 'afterglow'];
const results = [];
async function applyHostingHeaders(context) {
  if (process.env.GAME_HOST_HEADERS !== '1') return;
  const config = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  await context.route('**/*', async route => {
    const response = await route.fetch();
    const headers = { ...response.headers() };
    const pathname = new URL(route.request().url()).pathname;
    for (const rule of config.headers) {
      if (new RegExp('^' + rule.source + '$').test(pathname)) {
        for (const header of rule.headers) headers[header.key.toLowerCase()] = header.value;
      }
    }
    await route.fulfill({ response, headers });
  });
}

try {
  for (const mobile of [false, true]) {
    const context = await browser.newContext({
      viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 800 },
      hasTouch: mobile,
      isMobile: mobile,
      serviceWorkers: 'block',
    });
    await applyHostingHeaders(context);
    for (const slug of slugs) {
      const p = await context.newPage();
      const errors = [];
      const broken = [];
      p.on('pageerror', e => errors.push(e.message));
      p.on('response', r => {
        if (r.status() >= 400) broken.push(`${r.status()} ${r.url()}`);
      });
      const response = await p.goto(`${base}/games/${slug}.html`);
      assert.equal(response.status(), 200);
      const activate = async locator => (mobile ? locator.tap() : locator.click());
      if (slug === 'circuit') {
        const before = await p.locator('#s-moves').innerText();
        if (mobile) await p.locator('#board .tile').first().tap();
        else {
          await p.locator('#board .tile').first().focus();
          await p.keyboard.press('Enter');
        }
        assert.notEqual(await p.locator('#s-moves').innerText(), before);
        await activate(p.locator('#b-undo'));
        assert.equal(await p.locator('#s-moves').innerText(), before);
        await activate(p.locator('#board .tile').nth(2));
      } else if (slug === 'decrypt') {
        if (mobile) for (let i = 0; i < 4; i++) await p.locator('#pad button').nth(i).tap();
        else await p.keyboard.type('1234');
        assert.equal(await p.locator('#b-go').isEnabled(), true);
        if (mobile) await p.locator('#b-go').tap();
        else await p.keyboard.press('Enter');
        assert.ok((await p.locator('#live').innerText()).includes('exact'));
      } else if (slug === 'gridlock') {
        await activate(p.locator('#b-mode'));
        const hit = p.locator('.hit').first();
        if (mobile) await hit.tap();
        else {
          await hit.focus();
          await p.keyboard.press('Enter');
        }
        assert.equal(await p.locator('.edge.on').count(), 1);
        await activate(p.locator('.hit').nth(2));
        assert.equal(await p.locator('.edge.on').count(), 2);
      } else if (slug === 'mines') {
        const cell = p.locator('#board .cell').first();
        if (mobile) await cell.tap();
        else {
          await cell.focus();
          await p.keyboard.press('Enter');
        }
        assert.ok((await p.locator('.cell.open').count()) > 0);
        const closed = p.locator('.cell:not(.open)').first();
        if (await closed.count()) {
          if (mobile) {
            await p.locator('#b-flag').tap();
            await closed.tap();
          } else {
            await closed.focus();
            await p.keyboard.press('f');
          }
          assert.ok((await p.locator('.flagged').count()) > 0);
        }
      } else if (slug === 'tiles') {
        if (mobile) {
          const box = await p.locator('#board').boundingBox();
          for (let n = 0; n < 6; n++) {
            const x = box.x + box.width / 2,
              y = box.y + box.height / 2;
            await p.locator('#board').dispatchEvent('touchstart', {
              changedTouches: [{ identifier: 1, clientX: x, clientY: y }],
            });
            await p.locator('#board').dispatchEvent('touchend', {
              changedTouches: [
                {
                  identifier: 1,
                  clientX: x + (n % 2 ? 100 : -100),
                  clientY: y + (n % 2 ? 100 : 0),
                },
              ],
            });
          }
        } else
          for (let n = 0; n < 8; n++)
            for (const key of ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp'])
              await p.keyboard.press(key);
        assert.ok(
          (await p.locator('.tile').count()) > 2 || +(await p.locator('#s-score').innerText()) > 0,
        );
      } else if (slug === 'pulse') {
        await activate(p.locator('#b-start'));
        await p.waitForSelector('.pad.lit');
        const index = +(await p.locator('.pad.lit').first().getAttribute('data-i'));
        await p.waitForFunction(
          () => document.querySelector('#prompt').textContent === 'YOUR TURN',
        );
        if (mobile) await p.locator(`.pad[data-i="${index}"]`).tap();
        else await p.keyboard.press(String(index + 1));
        assert.equal(await p.locator('#prompt').innerText(), 'CLEAN');
      } else if (slug === 'trigger') {
        await activate(p.locator('#b-start'));
        await p.waitForFunction(
          () => document.querySelector('#msg0').textContent === 'NOW',
          {},
          { timeout: 12000 },
        );
        if (mobile) await p.locator('#side0').tap();
        else await p.keyboard.press('a');
        assert.notEqual(await p.locator('#score').innerText(), 'P1 0 — 0 P2');
      } else if (slug === 'afterglow') {
        await activate(p.locator('#btnFree'));
        const before = await p.locator('#paint').evaluate(c => c.toDataURL());
        if (mobile) {
          const box = await p.locator('#fx').boundingBox();
          await p.locator('#fx').dispatchEvent('touchstart', {
            changedTouches: [
              { identifier: 1, clientX: box.width * 0.3, clientY: box.height * 0.5 },
            ],
            touches: [{ identifier: 1, clientX: box.width * 0.3, clientY: box.height * 0.5 }],
          });
          await p.waitForTimeout(150);
          await p.locator('#fx').dispatchEvent('touchmove', {
            touches: [{ identifier: 1, clientX: box.width * 0.7, clientY: box.height * 0.6 }],
            changedTouches: [
              { identifier: 1, clientX: box.width * 0.7, clientY: box.height * 0.6 },
            ],
          });
          await p.waitForTimeout(200);
          await p.locator('#fx').dispatchEvent('touchend', { changedTouches: [], touches: [] });
        } else {
          await p.mouse.move(300, 350);
          await p.mouse.down();
          for (let n = 0; n < 35; n++) {
            await p.mouse.move(300 + n * 17, 350 + Math.sin(n * 0.25) * 90);
            await p.waitForTimeout(16);
          }
          await p.mouse.up();
        }
        assert.notEqual(await p.locator('#paint').evaluate(c => c.toDataURL()), before);
        if (!mobile) {
          await p.keyboard.press('z');
          await p.keyboard.press('x');
        }
      }
      assert.equal(
        await p.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        false,
        slug + ' horizontal overflow',
      );
      assert.deepEqual(errors, [], slug + ' script errors');
      assert.deepEqual(broken, [], slug + ' broken assets');
      if (process.env.CAPTURE_GAMEPLAY === '1' && !mobile) {
        fs.mkdirSync('public/gameplay', { recursive: true });
        await p.screenshot({ path: `public/gameplay/${slug}.png` });
      }
      results.push({
        slug,
        device: mobile ? 'Chromium touch emulation 390x844' : 'Chromium keyboard/mouse 1280x800',
        result: 'passed',
        scope:
          slug === 'tiles' && mobile
            ? 'Synthetic touch swipe handler exercised'
            : 'Core input changed real game state; no completion certification',
      });
      console.log('PASS', slug, mobile ? 'touch' : 'desktop');
      await p.close();
    }
    await context.close();
  }
  fs.mkdirSync('.cache', { recursive: true });
  fs.writeFileSync('.cache/game-smoke-results.json', JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}

if (process.env.GAME_LAUNCH_CHECKS === '1') {
  const b = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
    args: ['--no-sandbox'],
  });
  try {
    for (const mobile of [false, true]) {
      const context = await b.newContext({
        viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 800 },
        hasTouch: mobile,
        isMobile: mobile,
        serviceWorkers: 'block',
      });
      await applyHostingHeaders(context);
      for (const slug of slugs) {
        const p = await context.newPage();
        const errors = [];
        p.on('pageerror', e => errors.push(e.message));
        await p.goto(`${base}/games/${slug}/play`);
        await p.waitForFunction(
          () => !document.querySelector('.gx-player-overlay'),
          {},
          { timeout: 18000 },
        );
        await p.reload();
        await p.waitForFunction(
          () => !document.querySelector('.gx-player-overlay'),
          {},
          { timeout: 18000 },
        );
        assert.equal(await p.locator('iframe').count(), 1);
        assert.ok(
          await p
            .locator('iframe')
            .evaluate(e => e.getBoundingClientRect().height > innerHeight * 0.8),
        );
        await p.getByRole('button', { name: 'Fullscreen', exact: true }).click();
        if (!mobile) {
          await p.waitForFunction(() => !!document.fullscreenElement);
          await p.getByRole('button', { name: 'Exit fullscreen', exact: true }).click();
          await p.waitForFunction(() => !document.fullscreenElement);
        } else if (await p.evaluate(() => !!document.fullscreenElement)) {
          await p.getByRole('button', { name: 'Exit fullscreen', exact: true }).click();
        }
        await p.getByRole('link', { name: /Exit game/ }).click();
        await p.getByRole('heading', { level: 1 }).waitFor();
        assert.ok(new URL(p.url()).pathname.replace(/\/$/, '').endsWith('/games/' + slug));
        assert.deepEqual(errors, [], slug + ' launch/exit errors');
        console.log('PASS launch/fullscreen/exit', slug, mobile ? 'touch' : 'desktop');
        await p.close();
      }
      for (const width of mobile ? [320, 390] : [768, 1440]) {
        const p = await context.newPage();
        await p.setViewportSize({ width, height: 900 });
        for (const route of [
          '/games',
          ...JSON.parse(fs.readFileSync('src/content/games/records.json', 'utf8')).map(
            g => `/games/${g.slug}`,
          ),
        ]) {
          const broken = [];
          p.on('response', r => {
            if (r.status() >= 400) broken.push(r.url());
          });
          const response = await p.goto(base + route);
          assert.equal(response.status(), 200);
          await p.getByRole('heading', { level: 1 }).waitFor();
          await p.evaluate(() => {
            for (const img of document.images) img.loading = 'eager';
          });
          await p.evaluate(() =>
            Promise.all(
              [...document.images].map(img =>
                img.complete
                  ? Promise.resolve()
                  : new Promise(resolve => {
                      img.onload = resolve;
                      img.onerror = resolve;
                    }),
              ),
            ),
          );
          assert.deepEqual(broken, [], route + ' missing assets');
          assert.equal(
            await p.evaluate(() =>
              [...document.images].some(img => img.complete && img.naturalWidth === 0),
            ),
            false,
            route + ' broken artwork',
          );
          assert.equal(
            await p.evaluate(() => document.documentElement.scrollWidth > innerWidth),
            false,
            route + ' overflow ' + width,
          );
        }
        console.log('PASS all catalogue/details', width);
        await p.close();
      }
      await context.close();
    }
  } finally {
    await b.close();
  }
}
