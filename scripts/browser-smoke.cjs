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
  const open = async path => {
    const response = await page.goto((process.env.BROWSER_URL || 'http://127.0.0.1:3000') + path, {
      waitUntil: 'networkidle',
    });
    assert.equal(response.status(), 200, path);
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
      `${path}: horizontal overflow`,
    );
  };
  await open('/');
  assert.equal(await page.locator('#work article').count(), 3);
  assert.equal(await page.locator('.games-preview .game-row').count(), 3);
  await page
    .getByRole('link', { name: /selected work/i })
    .first()
    .click();
  assert.equal(await page.evaluate(() => location.hash), '#work');
  console.log('PASS home: curated work, game links, navigation');
  await open('/tools');
  const json = page.locator('#utility-panel-json textarea');
  await json.fill('{"ok":true}');
  await page.getByRole('button', { name: 'Format', exact: true }).click();
  assert.match(await json.inputValue(), /\n  "ok": true/);
  console.log('PASS tools: JSON formatting');
  await open('/osint');
  await page.locator('#osint-search').fill('shodan');
  await page
    .getByRole('link', { name: /Open Shodan/i })
    .first()
    .waitFor({ state: 'visible' });
  console.log('PASS OSINT: search');
  await open('/music-videos');
  await page.locator('.music-videos-track').nth(1).click();
  assert.notEqual(await page.evaluate(() => location.hash), '');
  console.log('PASS music: track selection (external playback not tested)');
  await open('/games');
  assert.equal(await page.locator('.games-page__item').count(), 3);
  await page.getByRole('link', { name: 'Play Circuit' }).click();
  await page.locator('#board .tile').first().click();
  assert.match(await page.locator('#s-moves').innerText(), /1/);
  await open('/games/decrypt');
  for (let i = 0; i < 4; i++) await page.locator('#pad button').nth(i).click();
  await page.locator('#b-go').click();
  assert.match(await page.locator('#s-try').innerText(), /2\/8|1\/8/);
  await open('/games/gridlock');
  await page.locator('#board .hit').first().click();
  assert.notEqual(await page.locator('#board .edge').first().getAttribute('class'), 'edge');
  console.log('PASS games: Circuit rotation, Decrypt submission, Gridlock move');
  await open('/contact');
  await page.getByPlaceholder('Jane Doe').fill('Test');
  assert.equal((await page.locator('form').count()) > 0, true);
  console.log('PASS contact: form present (no email sent)');
  assert.deepEqual(errors, []);
  await browser.close();
})().catch(e => {
  console.error(e);
  process.exit(1);
});
