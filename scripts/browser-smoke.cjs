const { chromium } = require('playwright');
const assert = require('assert').strict;
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: JSON.parse(process.env.CHROMIUM_ARGS || '[]'),
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  async function open(path) {
    const r = await page.goto((process.env.BROWSER_URL || 'http://127.0.0.1:3000') + path, {
      waitUntil: 'networkidle',
    });
    assert.equal(r.status(), 200);
  }
  await open('/');
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  assert.equal(
    await page.getByRole('button', { name: 'Close navigation menu' }).getAttribute('aria-expanded'),
    'true',
  );
  await page.keyboard.press('Escape');
  const search = page.getByRole('searchbox', { name: 'Find a project' });
  await search.fill('no such project xqz');
  assert.equal(await page.getByRole('button', { name: 'Surprise me' }).isDisabled(), true);
  await search.fill('');
  await page
    .getByRole('button', { name: /View details for/ })
    .first()
    .click();
  await page.getByRole('dialog').waitFor({ state: 'visible' });
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
  console.log('PASS home: mobile menu, empty search, detail dialog');
  await open('/tools');
  const json = page.locator('#utility-panel-json textarea');
  await json.fill('{"ok":true}');
  await page.getByRole('button', { name: 'Format', exact: true }).click();
  assert.match(await json.inputValue(), /\n  "ok": true/);
  await page.getByRole('tab', { name: /Base64/ }).click();
  const b = page.locator('#utility-panel-base64 textarea');
  await b.fill('hello');
  await page.getByRole('button', { name: 'Encode', exact: true }).click();
  assert.equal(await b.inputValue(), 'aGVsbG8=');
  console.log('PASS tools: JSON formatting, Base64 encoding');
  await open('/games');
  await page.locator('.chip').first().click();
  assert.notEqual(await page.locator('#searchInput').inputValue(), '');
  const info = page.locator('.game-card:visible .btn-info').first();
  await info.click();
  assert.equal(await info.getAttribute('aria-expanded'), 'true');
  await info.click();
  assert.equal(await info.getAttribute('aria-expanded'), 'false');
  await page.locator('#searchInput').fill('no-game-xqz');
  await page.locator('#resetFilters').click();
  assert.equal(await page.locator('#searchInput').inputValue(), '');
  console.log('PASS games: featured search, Info toggle, reset');
  await open('/contact');
  await page.getByPlaceholder('Jane Doe').fill('Test');
  await page.getByPlaceholder('you@company.com').fill('test@example.com');
  assert.equal((await page.locator('form').count()) > 0, true);
  console.log('PASS contact: form fields present (no message sent)');
  assert.deepEqual(errors, []);
  console.log('PASS page errors: none');
  await browser.close();
})().catch(e => {
  console.error(e);
  process.exit(1);
});
