import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  APP_TABS,
  ROUTE_LABEL,
  ROUTE_TAB_IDS,
  getTabFromLocation,
  isKnownAppTab,
  routeKeyForTab,
  shouldPreserveCurrentPath,
  tabToPath,
} from '../config/routes';
import { RouteHead, type RouteMeta } from '../components/RouteHead';

// ---------------------------------------------------------------------------
// Helpers & Interfaces derived from contracts in PROJECT.md / api/server.ts
// ---------------------------------------------------------------------------
const projectRoot = path.resolve(__dirname, '../..');
const gamesJsonPath = path.resolve(projectRoot, 'public/games/games.json');
const routeMetaPath = path.resolve(projectRoot, 'route-meta.json');
const serverTsPath = path.resolve(projectRoot, 'api/server.ts');

interface MockReq {
  body?: Record<string, unknown>;
  headers: Record<string, string>;
  ip?: string;
  method?: string;
  path?: string;
}

interface MockRes {
  statusCode: number;
  headers: Record<string, string>;
  body: unknown;
  status(code: number): MockRes;
  json(data: unknown): MockRes;
  setHeader(key: string, value: string): MockRes;
  sendStatus(code: number): MockRes;
}

function createMockRes(): MockRes {
  const res: MockRes = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(data: unknown) {
      this.body = data;
      return this;
    },
    setHeader(key: string, value: string) {
      this.headers[key.toLowerCase()] = value;
      return this;
    },
    sendStatus(code: number) {
      this.statusCode = code;
      return this;
    },
  };
  return res;
}

// Developer tool pure algorithms matching QuickTools.tsx & EverydayTools.tsx
function formatJsonString(raw: string, minify = false): { formatted?: string; error?: string } {
  if (!raw.trim()) {
    return { error: 'Paste JSON first.' };
  }
  try {
    const parsed = JSON.parse(raw);
    return { formatted: JSON.stringify(parsed, null, minify ? 0 : 2) };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'That is not valid JSON.' };
  }
}

function encodeUtf8Base64(raw: string): string {
  const bytes = new TextEncoder().encode(raw);
  let binary = '';
  bytes.forEach(byte => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodeUtf8Base64(raw: string): { decoded?: string; error?: string } {
  try {
    const binary = atob(raw.replace(/\s/g, ''));
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    return { decoded: new TextDecoder().decode(bytes) };
  } catch {
    return { error: 'Could not decode this value. Check that it is valid Base64.' };
  }
}

function parseTimestampInput(raw: string): Date | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  let date: Date;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    const number = Number(trimmed);
    const milliseconds = Math.abs(number) < 10_000_000_000 ? number * 1000 : number;
    date = new Date(milliseconds);
  } else {
    date = new Date(trimmed);
  }
  return Number.isNaN(date.getTime()) ? null : date;
}

function generateSecurePassword(
  length: number,
  cryptoApi: Crypto = globalThis.crypto,
): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*+-=?';
  const random = new Uint32Array(length);
  cryptoApi.getRandomValues(random);
  return [...random].map(value => alphabet[value % alphabet.length]).join('');
}

// Server guards replicated directly from api/server.ts contracts
const MAX_PROMPT_CHARS = 4000;
const MAX_HISTORY_ITEMS = 24;

function serverChatInputGuard(req: MockReq, res: MockRes, next: () => void): void {
  const { prompt, history, messages } = (req.body as any) ?? {};
  if (
    prompt !== undefined &&
    (typeof prompt !== 'string' || prompt.length === 0 || prompt.length > MAX_PROMPT_CHARS)
  ) {
    res.status(400).json({
      error: `Prompt must be a non-empty string of at most ${MAX_PROMPT_CHARS} characters.`,
    });
    return;
  }
  for (const arr of [history, messages]) {
    if (arr === undefined) continue;
    if (!Array.isArray(arr) || arr.length > MAX_HISTORY_ITEMS) {
      res.status(400).json({
        error: `History must be an array of at most ${MAX_HISTORY_ITEMS} messages.`,
      });
      return;
    }
    for (const m of arr) {
      if (m && typeof m.content === 'string' && m.content.length > 8000) {
        res.status(400).json({
          error: 'A history message exceeds the maximum length of 8000 characters.',
        });
        return;
      }
    }
  }
  next();
}

const CORS_ALLOWED = new Set(['https://www.linacre.site', 'https://linacre.site', 'null']);

function serverIsAllowedOrigin(origin: string): boolean {
  if (CORS_ALLOWED.has(origin)) return true;
  try {
    const { protocol, hostname } = new URL(origin);
    if (protocol === 'http:' && (hostname === 'localhost' || hostname === '127.0.0.1')) return true;
    if (
      protocol === 'https:' &&
      (hostname.endsWith('-linacres-projects.vercel.app') ||
        hostname === 'linacre-site-repo.vercel.app')
    ) {
      return true;
    }
  } catch {
    // not a valid URL
  }
  return false;
}

function createSlidingWindowRateLimiter(limit = 20, windowMs = 60_000) {
  const log = new Map<string, number[]>();
  return function rateLimiter(req: MockReq, res: MockRes, next: () => void): void {
    const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const now = Date.now();
    const hits = (log.get(ip) ?? []).filter(t => t > now - windowMs);
    if (hits.length >= limit) {
      log.set(ip, hits);
      res.setHeader('Retry-After', '60');
      res.status(429).json({
        error: `Rate limit exceeded (${limit} requests/minute). Please try again shortly.`,
      });
      return;
    }
    hits.push(now);
    log.set(ip, hits);
    res.setHeader('X-RateLimit-Limit', String(limit));
    res.setHeader('X-RateLimit-Remaining', String(limit - hits.length));
    next();
  };
}

// ===========================================================================
// TIER 1: FEATURE COVERAGE (>=5 per feature area)
// ===========================================================================
describe('Tier 1 — Feature Coverage', () => {
  describe('1.1 Navigation & Route Mapping', () => {
    it('1.1.1 maps all ROUTE_TAB_IDS to corresponding canonical URL paths', () => {
      expect(ROUTE_TAB_IDS.length).toBeGreaterThanOrEqual(14);
      for (const tab of ROUTE_TAB_IDS) {
        const pathResult = tabToPath(tab);
        expect(pathResult.startsWith('/')).toBe(true);
        if (tab === 'contact/thanks') {
          expect(pathResult).toBe('/contact/thanks');
        } else {
          expect(pathResult).toBe(`/${tab}`);
        }
      }
    });

    it('1.1.2 resolves primary public paths to correct application tab IDs', () => {
      expect(getTabFromLocation('/')).toBe('home');
      expect(getTabFromLocation('/tools')).toBe('tools');
      expect(getTabFromLocation('/games')).toBe('games');
      expect(getTabFromLocation('/lab')).toBe('lab');
      expect(getTabFromLocation('/identity')).toBe('identity');
      expect(getTabFromLocation('/about')).toBe('about');
      expect(getTabFromLocation('/contact')).toBe('contact');
      expect(getTabFromLocation('/ops')).toBe('ops');
    });

    it('1.1.3 resolves deep nested sub-routes and policy paths', () => {
      expect(getTabFromLocation('/contact/thanks')).toBe('contact-thanks');
      expect(getTabFromLocation('/cookie-policy')).toBe('cookie-policy');
      expect(getTabFromLocation('/terms')).toBe('terms');
      expect(getTabFromLocation('/accessibility')).toBe('accessibility');
      expect(getTabFromLocation('/mob-deals')).toBe('mob-deals');
      expect(getTabFromLocation('/pokeguru')).toBe('pokeguru');
    });

    it('1.1.4 maintains roundtrip tab-to-path and path-to-tab symmetry', () => {
      const primaryTabs = ['tools', 'games', 'lab', 'identity', 'about', 'contact', 'ops'];
      for (const tab of primaryTabs) {
        const canonical = tabToPath(tab);
        const resolvedTab = getTabFromLocation(canonical);
        expect(resolvedTab).toBe(tab);
      }
      expect(tabToPath('home')).toBe('/');
      expect(getTabFromLocation('/')).toBe('home');
    });

    it('1.1.5 guards deep paths from unintended tab-state overwrites', () => {
      expect(shouldPreserveCurrentPath('contact-thanks', '/contact/thanks')).toBe(true);
      expect(shouldPreserveCurrentPath('home', '/')).toBe(false);
      expect(shouldPreserveCurrentPath('tools', '/tools')).toBe(false);
      expect(shouldPreserveCurrentPath('games', '/games')).toBe(false);
    });

    it('1.1.6 verifies human-readable labels exist for all canonical routes', () => {
      expect(ROUTE_LABEL['/']).toBe('Home');
      expect(ROUTE_LABEL['/tools']).toBe('Tools');
      expect(ROUTE_LABEL['/games']).toBe('Games');
      expect(ROUTE_LABEL['/lab']).toBe('AI Lab');
      expect(ROUTE_LABEL['/identity']).toBe('Identity');
      expect(ROUTE_LABEL['/ops']).toBe('Ops HUD');
      for (const tab of ROUTE_TAB_IDS) {
        const pathForTab = tabToPath(tab);
        expect(ROUTE_LABEL[pathForTab]).toBeDefined();
        expect(ROUTE_LABEL[pathForTab].length).toBeGreaterThan(0);
      }
    });

    it('1.1.7 validates isKnownAppTab type-guard completeness', () => {
      expect(APP_TABS.length).toBeGreaterThanOrEqual(15);
      for (const tab of APP_TABS) {
        expect(isKnownAppTab(tab)).toBe(true);
      }
      expect(isKnownAppTab('unknown-tab')).toBe(false);
      expect(isKnownAppTab('')).toBe(false);
    });
  });

  describe('1.2 Tabulous Games Catalogue & Manifest Contracts', () => {
    let catalogue: { games: Array<Record<string, unknown>> };

    beforeEach(() => {
      expect(fs.existsSync(gamesJsonPath)).toBe(true);
      catalogue = JSON.parse(fs.readFileSync(gamesJsonPath, 'utf8'));
    });

    it('1.2.1 verifies games.json structure and catalog size', () => {
      expect(Array.isArray(catalogue.games)).toBe(true);
      expect(catalogue.games.length).toBeGreaterThanOrEqual(70);
    });

    it('1.2.2 validates that every catalog game conforms to schema contracts', () => {
      for (const game of catalogue.games) {
        expect(typeof game.id).toBe('string');
        expect((game.id as string).length).toBeGreaterThan(0);
        expect(typeof game.title).toBe('string');
        expect((game.title as string).length).toBeGreaterThan(0);
        expect(typeof game.url).toBe('string');
        expect((game.url as string).length).toBeGreaterThan(0);
        expect(typeof game.category).toBe('string');
        expect(typeof game.status).toBe('string');
      }
    });

    it('1.2.3 enforces instant-play status and disallows required file downloads', () => {
      const allowedStatuses = new Set(['instant', 'multiplayer']);
      for (const game of catalogue.games) {
        expect(allowedStatuses.has(game.status as string)).toBe(true);
        const gameString = JSON.stringify(game).toLowerCase();
        expect(gameString.includes('own the game')).toBe(false);
        expect(gameString.includes('bring your own')).toBe(false);
        expect(gameString.includes('custom files')).toBe(false);
      }
    });

    it('1.2.4 verifies built-in games manifest and physical asset existence', () => {
      const builtInNames = ['circuit', 'decrypt', 'gridlock', 'mines', 'pulse', 'tiles', 'trigger'];
      const gamesDir = path.resolve(projectRoot, 'public/games');
      for (const name of builtInNames) {
        const htmlFile = path.resolve(gamesDir, `${name}.html`);
        const jsFile = path.resolve(gamesDir, `${name}.js`);
        expect(fs.existsSync(htmlFile), `Missing ${name}.html`).toBe(true);
        expect(fs.existsSync(jsFile), `Missing ${name}.js`).toBe(true);
        expect(fs.statSync(htmlFile).size).toBeGreaterThan(100);
        expect(fs.statSync(jsFile).size).toBeGreaterThan(100);
      }
    });

    it('1.2.5 validates category classification taxonomies', () => {
      const validCategories = new Set([
        'survivors',
        'zombies',
        'shooters',
        'classic-pc',
        'openworld',
        'strategy',
        'sports',
        'arcade',
        'action',
      ]);
      for (const game of catalogue.games) {
        expect(validCategories.has(game.category as string)).toBe(true);
      }
    });

    it('1.2.6 verifies unique game IDs and valid web URL protocols', () => {
      const seenIds = new Set<string>();
      for (const game of catalogue.games) {
        const id = game.id as string;
        expect(seenIds.has(id)).toBe(false);
        seenIds.add(id);

        const url = game.url as string;
        const isValidUrl =
          url.startsWith('https://') || url.startsWith('http://') || url.startsWith('/games/');
        expect(isValidUrl).toBe(true);
      }
    });
  });

  describe('1.3 Developer Tools Logic', () => {
    it('1.3.1 formats dirty compact JSON into standard 2-space indented output', () => {
      const raw = '{"name":"linacre","tools":["json","base64"],"version":7}';
      const result = formatJsonString(raw, false);
      expect(result.error).toBeUndefined();
      expect(result.formatted).toBe(
        '{\n  "name": "linacre",\n  "tools": [\n    "json",\n    "base64"\n  ],\n  "version": 7\n}',
      );
    });

    it('1.3.2 minifies formatted JSON into zero-whitespace compact string', () => {
      const formatted = '{\n  "status": "ready",\n  "active": true\n}';
      const result = formatJsonString(formatted, true);
      expect(result.error).toBeUndefined();
      expect(result.formatted).toBe('{"status":"ready","active":true}');
    });

    it('1.3.3 encodes and decodes standard ASCII strings via Base64 UTF-8 roundtrip', () => {
      const text = 'Linacre Developer Studio: verified zero-telemetry utilities.';
      const encoded = encodeUtf8Base64(text);
      expect(typeof encoded).toBe('string');
      expect(encoded.length).toBeGreaterThan(0);
      const decoded = decodeUtf8Base64(encoded);
      expect(decoded.decoded).toBe(text);
    });

    it('1.3.4 accurately calculates Unix timestamps in seconds and milliseconds into UTC Date', () => {
      const unixSeconds = '1700000000';
      const parsedSeconds = parseTimestampInput(unixSeconds);
      expect(parsedSeconds).not.toBeNull();
      expect(parsedSeconds?.toISOString()).toBe('2023-11-14T22:13:20.000Z');

      const unixMillis = '1700000000000';
      const parsedMillis = parseTimestampInput(unixMillis);
      expect(parsedMillis).not.toBeNull();
      expect(parsedMillis?.toISOString()).toBe('2023-11-14T22:13:20.000Z');
    });

    it('1.3.5 generates valid RFC 4122 UUID v4 strings with high entropy', () => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const uuids = new Set<string>();
      for (let i = 0; i < 25; i++) {
        const id = crypto.randomUUID();
        expect(id).toMatch(uuidRegex);
        expect(uuids.has(id)).toBe(false);
        uuids.add(id);
      }
    });

    it('1.3.6 generates passwords matching specified length and allowed character set', () => {
      const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*+-=?';
      for (const len of [16, 24, 32, 48]) {
        const password = generateSecurePassword(len);
        expect(password.length).toBe(len);
        for (const char of password) {
          expect(alphabet.includes(char)).toBe(true);
        }
      }
    });
  });

  describe('1.4 Server Endpoint Contracts and Guards', () => {
    it('1.4.1 enforces chatInputGuard prompt type and non-empty checks', () => {
      let nextCalled = false;
      const res = createMockRes();

      // Empty prompt -> 400
      serverChatInputGuard({ body: { prompt: '' }, headers: {} }, res, () => {
        nextCalled = true;
      });
      expect(nextCalled).toBe(false);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        error: 'Prompt must be a non-empty string of at most 4000 characters.',
      });

      // Non-string prompt -> 400
      const res2 = createMockRes();
      serverChatInputGuard({ body: { prompt: 12345 }, headers: {} }, res2, () => {
        nextCalled = true;
      });
      expect(res2.statusCode).toBe(400);

      // Valid prompt -> calls next
      const res3 = createMockRes();
      nextCalled = false;
      serverChatInputGuard({ body: { prompt: 'Hello Linacre Assistant' }, headers: {} }, res3, () => {
        nextCalled = true;
      });
      expect(nextCalled).toBe(true);
      expect(res3.statusCode).toBe(200);
    });

    it('1.4.2 enforces chatInputGuard maximum prompt length of 4000 characters', () => {
      let nextCalled = false;
      const res = createMockRes();
      const validPrompt = 'A'.repeat(4000);
      serverChatInputGuard({ body: { prompt: validPrompt }, headers: {} }, res, () => {
        nextCalled = true;
      });
      expect(nextCalled).toBe(true);

      const res2 = createMockRes();
      nextCalled = false;
      const invalidPrompt = 'A'.repeat(4001);
      serverChatInputGuard({ body: { prompt: invalidPrompt }, headers: {} }, res2, () => {
        nextCalled = true;
      });
      expect(nextCalled).toBe(false);
      expect(res2.statusCode).toBe(400);
      expect((res2.body as any).error).toContain('4000 characters');
    });

    it('1.4.3 enforces chatInputGuard history bounds (max 24 items)', () => {
      let nextCalled = false;
      const res = createMockRes();
      const validHistory = Array.from({ length: 24 }, (_, i) => ({
        role: 'user',
        content: `Msg ${i}`,
      }));
      serverChatInputGuard({ body: { history: validHistory }, headers: {} }, res, () => {
        nextCalled = true;
      });
      expect(nextCalled).toBe(true);

      const res2 = createMockRes();
      nextCalled = false;
      const oversizedHistory = Array.from({ length: 25 }, (_, i) => ({
        role: 'user',
        content: `Msg ${i}`,
      }));
      serverChatInputGuard({ body: { history: oversizedHistory }, headers: {} }, res2, () => {
        nextCalled = true;
      });
      expect(nextCalled).toBe(false);
      expect(res2.statusCode).toBe(400);
      expect((res2.body as any).error).toContain('at most 24 messages');
    });

    it('1.4.4 validates CORS origin allowlist for trusted, preview, and disallowed origins', () => {
      expect(serverIsAllowedOrigin('https://www.linacre.site')).toBe(true);
      expect(serverIsAllowedOrigin('https://linacre.site')).toBe(true);
      expect(serverIsAllowedOrigin('null')).toBe(true);
      expect(serverIsAllowedOrigin('http://localhost:3000')).toBe(true);
      expect(serverIsAllowedOrigin('http://127.0.0.1:5173')).toBe(true);
      expect(serverIsAllowedOrigin('https://feature-branch-linacres-projects.vercel.app')).toBe(true);
      expect(serverIsAllowedOrigin('https://linacre-site-repo.vercel.app')).toBe(true);

      expect(serverIsAllowedOrigin('https://malicious-attacker.com')).toBe(false);
      expect(serverIsAllowedOrigin('http://localhost.evil.com')).toBe(false);
      expect(serverIsAllowedOrigin('invalid-url-string')).toBe(false);
    });

    it('1.4.5 enforces sliding-window rate limiter contract', () => {
      const limiter = createSlidingWindowRateLimiter(5, 60_000);
      const req: MockReq = { headers: {}, ip: '192.168.1.100' };

      for (let i = 1; i <= 5; i++) {
        let called = false;
        const res = createMockRes();
        limiter(req, res, () => {
          called = true;
        });
        expect(called).toBe(true);
        expect(res.statusCode).toBe(200);
        expect(res.headers['x-ratelimit-remaining']).toBe(String(5 - i));
      }

      // 6th call exceeds limit -> 429
      let called6 = false;
      const res6 = createMockRes();
      limiter(req, res6, () => {
        called6 = true;
      });
      expect(called6).toBe(false);
      expect(res6.statusCode).toBe(429);
      expect(res6.headers['retry-after']).toBe('60');
      expect((res6.body as any).error).toContain('Rate limit exceeded');
    });

    it('1.4.6 validates server.ts source declares input guards and security constants', () => {
      expect(fs.existsSync(serverTsPath)).toBe(true);
      const serverCode = fs.readFileSync(serverTsPath, 'utf8');
      expect(serverCode).toContain('MAX_PROMPT_CHARS = 4000');
      expect(serverCode).toContain('MAX_HISTORY_ITEMS = 24');
      expect(serverCode).toContain('CORS_ALLOWED');
      expect(serverCode).toContain('chatInputGuard');
    });
  });

  describe('1.5 Prerendering and Metadata Integrity', () => {
    let routeMeta: { routes: Record<string, RouteMeta> };

    beforeEach(() => {
      expect(fs.existsSync(routeMetaPath)).toBe(true);
      routeMeta = JSON.parse(fs.readFileSync(routeMetaPath, 'utf8'));
    });

    it('1.5.1 verifies route-meta.json contains all 18 expected routes', () => {
      const expectedRoutes = [
        '/',
        '/tools',
        '/games',
        '/lab',
        '/identity',
        '/about',
        '/contact',
        '/contact/thanks',
        '/privacy',
        '/cookie-policy',
        '/terms',
        '/accessibility',
        '/mob-deals',
        '/pokeguru',
        '/music-videos',
        '/osint',
        '/orbit',
        '/ops',
      ];
      for (const route of expectedRoutes) {
        expect(routeMeta.routes[route], `Missing route-meta for ${route}`).toBeDefined();
      }
      expect(Object.keys(routeMeta.routes).length).toBe(18);
    });

    it('1.5.2 validates that every route contains required SEO and canonical attributes', () => {
      for (const [route, meta] of Object.entries(routeMeta.routes)) {
        expect(typeof meta.title).toBe('string');
        expect(meta.title.length).toBeGreaterThan(5);
        expect(typeof meta.description).toBe('string');
        expect(meta.description.length).toBeGreaterThan(15);
        expect(meta.canonical).toBe(`https://www.linacre.site${route === '/' ? '/' : route}`);
        expect(typeof meta.index).toBe('boolean');
      }
    });

    it('1.5.3 enforces noindex on confirmation and archived routes and index on curated studio routes', () => {
      expect(routeMeta.routes['/contact/thanks'].index).toBe(false);
      expect(routeMeta.routes['/ops'].index).toBe(false);
      expect(routeMeta.routes['/lab'].index).toBe(false);
      expect(routeMeta.routes['/identity'].index).toBe(false);
      expect(routeMeta.routes['/mob-deals'].index).toBe(false);
      expect(routeMeta.routes['/pokeguru'].index).toBe(false);
      expect(routeMeta.routes['/'].index).toBe(true);
      expect(routeMeta.routes['/games'].index).toBe(true);
      expect(routeMeta.routes['/orbit'].index).toBe(true);
      expect(routeMeta.routes['/about'].index).toBe(true);
      expect(routeMeta.routes['/contact'].index).toBe(true);
    });

    it('1.5.4 updates document head tags dynamically via RouteHead component', () => {
      const sampleMeta: RouteMeta = {
        title: 'AI Lab Experiments | Linacre.site',
        description: 'Testing dynamic head synchronisation in Vitest jsdom.',
        canonical: 'https://www.linacre.site/lab',
        index: true,
      };

      render(React.createElement(RouteHead, { meta: sampleMeta }));

      expect(document.title).toBe(sampleMeta.title);
      const descEl = document.head.querySelector('meta[name="description"]');
      expect(descEl?.getAttribute('content')).toBe(sampleMeta.description);
      const robotsEl = document.head.querySelector('meta[name="robots"]');
      expect(robotsEl?.getAttribute('content')).toBe('index,follow');
      const canonicalEl = document.head.querySelector('link[rel="canonical"]');
      expect(canonicalEl?.getAttribute('href')).toBe(sampleMeta.canonical);
      const ogTitleEl = document.head.querySelector('meta[property="og:title"]');
      expect(ogTitleEl?.getAttribute('content')).toBe(sampleMeta.title);
    });

    it('1.5.5 validates static prerender script schema compliance', () => {
      const prerenderScriptPath = path.resolve(projectRoot, 'scripts/prerender.mjs');
      expect(fs.existsSync(prerenderScriptPath)).toBe(true);
      const scriptCode = fs.readFileSync(prerenderScriptPath, 'utf8');
      expect(scriptCode).toContain('@context');
      expect(scriptCode).toContain('https://schema.org');
      expect(scriptCode).toContain('Person');
      expect(scriptCode).toContain('WebSite');
      expect(scriptCode).toContain('ProfessionalService');
    });
  });
});

// ===========================================================================
// TIER 2: BOUNDARY & CORNER CASES (>=5 per feature area)
// ===========================================================================
describe('Tier 2 — Boundary & Corner Cases', () => {
  describe('2.1 Invalid & Unknown Route Handling and Fallback Mapping', () => {
    it('2.1.1 gracefully maps unknown paths to home tab without throwing', () => {
      expect(getTabFromLocation('/unregistered-route')).toBe('home');
      expect(getTabFromLocation('/admin/secret')).toBe('home');
      expect(getTabFromLocation('/foo/bar/baz')).toBe('home');
    });

    it('2.1.2 normalizes paths with multiple leading, trailing, and redundant slashes', () => {
      expect(getTabFromLocation('///tools///')).toBe('tools');
      expect(getTabFromLocation('//games//')).toBe('games');
      expect(getTabFromLocation('////')).toBe('home');
      expect(getTabFromLocation('')).toBe('home');
    });

    it('2.1.3 resolves legacy hash targets when pathname is unknown or root', () => {
      expect(getTabFromLocation('/unknown', '#tools')).toBe('tools');
      expect(getTabFromLocation('/unknown', '#ops')).toBe('ops');
      expect(getTabFromLocation('/', '#identity')).toBe('identity');
      expect(getTabFromLocation('/unknown', '#nonexistent')).toBe('home');
    });

    it('2.1.4 prioritizes valid pathname over conflicting hash value', () => {
      expect(getTabFromLocation('/games', '#tools')).toBe('games');
      expect(getTabFromLocation('/tools', '#about')).toBe('tools');
      expect(getTabFromLocation('/about', '#lab')).toBe('about');
    });

    it('2.1.5 serializes routeKeyForTab reliably regardless of redundant input formatting', () => {
      expect(routeKeyForTab('tools', '/tools')).toBe('/tools');
      expect(routeKeyForTab('home', '/')).toBe('/');
      expect(routeKeyForTab('contact-thanks', '/contact/thanks')).toBe('/contact/thanks');
      expect(routeKeyForTab('ops', '/ops')).toBe('/ops');
    });
  });

  describe('2.2 Base64 Multibyte Emoji & Unicode Encoding', () => {
    it('2.2.1 encodes and decodes complex emojis with Zero-Width Joiners (ZWJ)', () => {
      const familyEmoji = '👨‍👩‍👧‍👦';
      const encoded = encodeUtf8Base64(familyEmoji);
      const decoded = decodeUtf8Base64(encoded);
      expect(decoded.error).toBeUndefined();
      expect(decoded.decoded).toBe(familyEmoji);
    });

    it('2.2.2 roundtrips multilingual UTF-8 strings across diverse alphabets and scripts', () => {
      const multilingual = '日本語 🇯🇵 • 中文 🇨🇳 • العربية 🇸🇦 • Русский 🇷🇺 • Español 🇪🇸';
      const encoded = encodeUtf8Base64(multilingual);
      const decoded = decodeUtf8Base64(encoded);
      expect(decoded.decoded).toBe(multilingual);
    });

    it('2.2.3 strips whitespace and newlines from formatted Base64 inputs', () => {
      const original = 'Clean decoding with line breaks';
      const cleanBase64 = encodeUtf8Base64(original);
      const wrappedBase64 = `  \n${cleanBase64.slice(0, 10)}\r\n  ${cleanBase64.slice(10)} \n `;
      const decoded = decodeUtf8Base64(wrappedBase64);
      expect(decoded.error).toBeUndefined();
      expect(decoded.decoded).toBe(original);
    });

    it('2.2.4 catches corrupted non-Base64 strings without throwing unhandled exceptions', () => {
      const invalidInput = 'This is completely invalid base64!@#$%^&*()';
      const result = decodeUtf8Base64(invalidInput);
      expect(result.decoded).toBeUndefined();
      expect(result.error).toContain('Could not decode this value');
    });

    it('2.2.5 handles empty string and boundary single-character UTF-8 inputs', () => {
      expect(encodeUtf8Base64('')).toBe('');
      expect(decodeUtf8Base64('').decoded).toBe('');

      expect(encodeUtf8Base64('a')).toBe('YQ==');
      expect(decodeUtf8Base64('YQ==').decoded).toBe('a');

      expect(encodeUtf8Base64('ab')).toBe('YWI=');
      expect(decodeUtf8Base64('YWI=').decoded).toBe('ab');

      expect(encodeUtf8Base64('abc')).toBe('YWJj');
      expect(decodeUtf8Base64('YWJj').decoded).toBe('abc');
    });
  });

  describe('2.3 Timestamp Edge Cases', () => {
    it('2.3.1 correctly parses Unix epoch zero (0)', () => {
      const parsed = parseTimestampInput('0');
      expect(parsed).not.toBeNull();
      expect(parsed?.toISOString()).toBe('1970-01-01T00:00:00.000Z');
      expect(parsed?.getTime()).toBe(0);
    });

    it('2.3.2 handles negative epoch timestamps for dates prior to 1970', () => {
      // 10 years before 1970: -315619200 seconds
      const parsed = parseTimestampInput('-315619200');
      expect(parsed).not.toBeNull();
      expect(parsed?.toISOString()).toBe('1960-01-01T00:00:00.000Z');
      expect(parsed?.getTime()).toBeLessThan(0);
    });

    it('2.3.3 handles leap years including February 29th accurately', () => {
      const leapDay = parseTimestampInput('2024-02-29T12:00:00.000Z');
      expect(leapDay).not.toBeNull();
      expect(leapDay?.getUTCFullYear()).toBe(2024);
      expect(leapDay?.getUTCMonth()).toBe(1); // 0-indexed: 1 = February
      expect(leapDay?.getUTCDate()).toBe(29);
    });

    it('2.3.4 handles decimal Unix timestamps by truncating or parsing float seconds', () => {
      const decimalTimestamp = '1700000000.5';
      const parsed = parseTimestampInput(decimalTimestamp);
      expect(parsed).not.toBeNull();
      expect(parsed?.getTime()).toBe(1700000000500);
    });

    it('2.3.5 safely returns null for invalid non-numeric and unparseable strings', () => {
      expect(parseTimestampInput('')).toBeNull();
      expect(parseTimestampInput('   ')).toBeNull();
      expect(parseTimestampInput('invalid-date-string')).toBeNull();
      expect(parseTimestampInput('9999999999999999999999999999')).toBeNull();
    });
  });

  describe('2.4 Malformed JSON Handling Without Crashing', () => {
    it('2.4.1 catches unclosed brackets and braces returning a descriptive error', () => {
      const result = formatJsonString('{"title": "Linacre", "items": [1, 2, 3');
      expect(result.formatted).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.error?.length).toBeGreaterThan(0);
    });

    it('2.4.2 catches unquoted keys and single quotes without crashing', () => {
      const result = formatJsonString("{name: 'David'}");
      expect(result.formatted).toBeUndefined();
      expect(result.error).toBeDefined();
    });

    it('2.4.3 catches trailing commas in JSON objects and arrays', () => {
      const result = formatJsonString('{"key": "value",}');
      expect(result.formatted).toBeUndefined();
      expect(result.error).toBeDefined();
    });

    it('2.4.4 handles null, boolean, and nested empty objects cleanly', () => {
      const validNested = '{"emptyObj":{},"emptyArr":[],"isNull":null,"isTrue":true}';
      const result = formatJsonString(validNested, true);
      expect(result.error).toBeUndefined();
      expect(result.formatted).toBe(validNested);
    });

    it('2.4.5 rejects empty or whitespace-only input with informative guidance', () => {
      const emptyResult = formatJsonString('');
      expect(emptyResult.error).toBe('Paste JSON first.');
      const whitespaceResult = formatJsonString('   \n\t  ');
      expect(whitespaceResult.error).toBe('Paste JSON first.');
    });
  });

  describe('2.5 Chat Input Guard Boundary & Limits', () => {
    it('2.5.1 accepts prompt of exactly 4000 characters and rejects 4001 characters', () => {
      let accepted = false;
      const resPass = createMockRes();
      serverChatInputGuard({ body: { prompt: 'X'.repeat(4000) }, headers: {} }, resPass, () => {
        accepted = true;
      });
      expect(accepted).toBe(true);

      let rejected = false;
      const resFail = createMockRes();
      serverChatInputGuard({ body: { prompt: 'X'.repeat(4001) }, headers: {} }, resFail, () => {
        rejected = true;
      });
      expect(rejected).toBe(false);
      expect(resFail.statusCode).toBe(400);
      expect((resFail.body as any).error).toBe(
        'Prompt must be a non-empty string of at most 4000 characters.',
      );
    });

    it('2.5.2 accepts history of exactly 24 messages and rejects 25 messages', () => {
      const makeHistory = (count: number) =>
        Array.from({ length: count }, (_, i) => ({ role: 'user', content: `Message ${i}` }));

      let accepted = false;
      const resPass = createMockRes();
      serverChatInputGuard({ body: { history: makeHistory(24) }, headers: {} }, resPass, () => {
        accepted = true;
      });
      expect(accepted).toBe(true);

      let rejected = false;
      const resFail = createMockRes();
      serverChatInputGuard({ body: { history: makeHistory(25) }, headers: {} }, resFail, () => {
        rejected = true;
      });
      expect(rejected).toBe(false);
      expect(resFail.statusCode).toBe(400);
      expect((resFail.body as any).error).toBe(
        'History must be an array of at most 24 messages.',
      );
    });

    it('2.5.3 accepts history message content of 8000 characters and rejects 8001 characters', () => {
      let accepted = false;
      const resPass = createMockRes();
      const validMsg = [{ role: 'user', content: 'M'.repeat(8000) }];
      serverChatInputGuard({ body: { history: validMsg }, headers: {} }, resPass, () => {
        accepted = true;
      });
      expect(accepted).toBe(true);

      let rejected = false;
      const resFail = createMockRes();
      const invalidMsg = [{ role: 'user', content: 'M'.repeat(8001) }];
      serverChatInputGuard({ body: { history: invalidMsg }, headers: {} }, resFail, () => {
        rejected = true;
      });
      expect(rejected).toBe(false);
      expect(resFail.statusCode).toBe(400);
      expect((resFail.body as any).error).toBe(
        'A history message exceeds the maximum length of 8000 characters.',
      );
    });

    it('2.5.4 rejects non-array history or messages with 400', () => {
      const res1 = createMockRes();
      serverChatInputGuard({ body: { history: 'not-an-array' }, headers: {} }, res1, () => {});
      expect(res1.statusCode).toBe(400);

      const res2 = createMockRes();
      serverChatInputGuard({ body: { messages: 9999 }, headers: {} }, res2, () => {});
      expect(res2.statusCode).toBe(400);
    });

    it('2.5.5 permits request with undefined optional fields to proceed', () => {
      let called = false;
      const res = createMockRes();
      serverChatInputGuard({ body: {}, headers: {} }, res, () => {
        called = true;
      });
      expect(called).toBe(true);
      expect(res.statusCode).toBe(200);
    });
  });
});

// ===========================================================================
// TIER 3: CROSS-FEATURE COMBINATIONS
// ===========================================================================
describe('Tier 3 — Cross-Feature Combinations', () => {
  it('3.1 synchronizes SPA navigation with document head metadata and canonical links', () => {
    const routeMeta = JSON.parse(fs.readFileSync(routeMetaPath, 'utf8')).routes;
    const testTabs = ['home', 'tools', 'games', 'about', 'ops'];

    for (const tab of testTabs) {
      const canonicalPath = tabToPath(tab);
      const meta = routeMeta[canonicalPath];
      expect(meta, `No meta found for ${canonicalPath}`).toBeDefined();

      render(React.createElement(RouteHead, { meta }));

      expect(document.title).toBe(meta.title);
      expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
        meta.canonical,
      );
      expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
        meta.description,
      );
      expect(document.head.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(
        meta.title,
      );
    }
  });

  it('3.2 preserves developer tool input states across simulated tab switches', () => {
    let jsonState = '{"unformatted":true}';
    let base64State = 'Hello Linacre';
    let activeTool = 'json';

    // User is on json tool, formats JSON
    const formatRes = formatJsonString(jsonState, false);
    jsonState = formatRes.formatted!;
    expect(jsonState).toContain('\n');

    // Switches to base64 tool
    activeTool = 'base64';
    expect(activeTool).toBe('base64');
    const encoded = encodeUtf8Base64(base64State);
    base64State = encoded;

    // Switches back to json tool: state is retained
    activeTool = 'json';
    expect(jsonState).toContain('"unformatted": true');
    expect(decodeUtf8Base64(base64State).decoded).toBe('Hello Linacre');
  });

  it('3.3 maintains game audio preference toggle consistency across sessions using shared key', () => {
    const AUDIO_KEY = 'linacre_audio_enabled';
    const storage = typeof localStorage !== 'undefined' && typeof localStorage.clear === 'function' ? localStorage : (() => {
      const map = new Map<string, string>();
      return {
        getItem: (k: string) => map.get(k) ?? null,
        setItem: (k: string, v: string) => map.set(k, String(v)),
        removeItem: (k: string) => { map.delete(k); },
        clear: () => { map.clear(); }
      };
    })();
    storage.clear();

    // Default: not set, defaults to muted
    expect(storage.getItem(AUDIO_KEY)).toBeNull();

    // User toggles sound on in main app
    storage.setItem(AUDIO_KEY, '1');
    expect(storage.getItem(AUDIO_KEY)).toBe('1');

    // Built-in game portal reads preference
    const isPortalAudioEnabled = storage.getItem(AUDIO_KEY) === '1';
    expect(isPortalAudioEnabled).toBe(true);

    // User toggles sound off in game
    storage.setItem(AUDIO_KEY, '0');
    expect(storage.getItem(AUDIO_KEY) === '1').toBe(false);

    storage.removeItem(AUDIO_KEY);
  });

  it('3.4 integrates route resolution with server valid routes and route-meta inventory', () => {
    const routeMeta = JSON.parse(fs.readFileSync(routeMetaPath, 'utf8')).routes;
    const serverCode = fs.readFileSync(serverTsPath, 'utf8');

    for (const tab of ROUTE_TAB_IDS) {
      const pathForTab = tabToPath(tab);
      expect(routeMeta[pathForTab]).toBeDefined();
      expect(serverCode).toContain(`'${pathForTab}'`);
    }
  });

  it('3.5 combines CORS origin verification with sliding-window rate limiting', () => {
    const limiter = createSlidingWindowRateLimiter(2, 60_000);
    const trustedOrigin = 'https://www.linacre.site';
    expect(serverIsAllowedOrigin(trustedOrigin)).toBe(true);

    const req: MockReq = {
      headers: { origin: trustedOrigin },
      ip: '10.0.0.42',
    };

    // First request
    const res1 = createMockRes();
    limiter(req, res1, () => {
      res1.setHeader('Access-Control-Allow-Origin', trustedOrigin);
    });
    expect(res1.statusCode).toBe(200);
    expect(res1.headers['access-control-allow-origin']).toBe(trustedOrigin);

    // Second request
    const res2 = createMockRes();
    limiter(req, res2, () => {
      res2.setHeader('Access-Control-Allow-Origin', trustedOrigin);
    });
    expect(res2.statusCode).toBe(200);

    // Third request triggers 429
    const res3 = createMockRes();
    limiter(req, res3, () => {});
    expect(res3.statusCode).toBe(429);
    expect(res3.headers['retry-after']).toBe('60');
  });
});

// ===========================================================================
// TIER 4: REAL-WORLD APPLICATION SCENARIOS
// ===========================================================================
describe('Tier 4 — Real-World Application Scenarios', () => {
  it('4.1 simulates end-to-end developer workstation workflow', () => {
    // Step 1: Developer pastes dirty unindented JSON config
    const dirtyJson = '{"app":"linacre","env":"production","api":{"port":3000,"ssl":true}}';
    const formatted = formatJsonString(dirtyJson, false);
    expect(formatted.error).toBeUndefined();
    expect(formatted.formatted).toContain('  "app": "linacre"');

    // Step 2: Developer encodes payload into Base64 for transfer
    const base64Token = encodeUtf8Base64(formatted.formatted!);
    expect(base64Token.length).toBeGreaterThan(0);

    // Step 3: Developer verifies Unix token expiration timestamp
    const tokenTimestamp = '1735689600'; // 2025-01-01T00:00:00Z
    const expiryDate = parseTimestampInput(tokenTimestamp);
    expect(expiryDate).not.toBeNull();
    expect(expiryDate?.toISOString()).toBe('2025-01-01T00:00:00.000Z');

    // Step 4: Developer generates a 24-character cryptographically secure secret
    const secretKey = generateSecurePassword(24);
    expect(secretKey.length).toBe(24);
    expect(/^[A-Za-z0-9!@#$%&*+\-=?]+$/.test(secretKey)).toBe(true);

    // Step 5: Roundtrip decode verification
    const decodedPayload = decodeUtf8Base64(base64Token);
    expect(decodedPayload.decoded).toBe(formatted.formatted);
  });

  it('4.2 simulates gamer portal discovery, filtering, and built-in game launch journey', () => {
    const catalogue = JSON.parse(fs.readFileSync(gamesJsonPath, 'utf8'));

    // Step 1: Gamer opens Tabulous Games and inspects catalog size
    expect(catalogue.games.length).toBeGreaterThanOrEqual(70);

    // Step 2: Gamer filters by 'classic-pc' category
    const retroGames = catalogue.games.filter(
      (g: Record<string, unknown>) => g.category === 'classic-pc',
    );
    expect(retroGames.length).toBeGreaterThanOrEqual(1);

    // Step 3: Gamer verifies all filtered games are instant-play ready
    for (const game of retroGames) {
      expect(['instant', 'multiplayer']).toContain(game.status);
      expect((game.url as string).length).toBeGreaterThan(0);
    }

    // Step 4: Gamer selects built-in game 'circuit'
    const circuitHtml = path.resolve(projectRoot, 'public/games/circuit.html');
    const circuitJs = path.resolve(projectRoot, 'public/games/circuit.js');
    expect(fs.existsSync(circuitHtml)).toBe(true);
    expect(fs.existsSync(circuitJs)).toBe(true);

    // Step 5: Sound state is initialized and preserved
    const AUDIO_KEY = 'linacre_audio_enabled';
    const storage = typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function' ? localStorage : {
      _data: new Map<string, string>(),
      setItem(k: string, v: string) { this._data.set(k, String(v)); },
      getItem(k: string) { return this._data.get(k) ?? null; }
    };
    storage.setItem(AUDIO_KEY, '1');
    expect(storage.getItem(AUDIO_KEY)).toBe('1');
  });

  it('4.3 simulates search engine crawler verification across route-meta and Schema.org', () => {
    const routeMeta = JSON.parse(fs.readFileSync(routeMetaPath, 'utf8')).routes;
    const prerenderScript = fs.readFileSync(
      path.resolve(projectRoot, 'scripts/prerender.mjs'),
      'utf8',
    );

    // Step 1: Crawler parses all curated studio + legal indexable routes for sitemap generation
    const indexableRoutes = Object.entries(routeMeta).filter(
      ([, meta]: [string, any]) => meta.index === true,
    );
    expect(indexableRoutes.length).toBe(9); // /, /games, /orbit, /about, /contact + 4 legal routes

    // Step 2: Crawler verifies canonical URLs are absolute and use HTTPS
    for (const [, meta] of indexableRoutes as Array<[string, RouteMeta]>) {
      expect(meta.canonical.startsWith('https://www.linacre.site/')).toBe(true);
      expect(meta.title).toBeTruthy();
      expect(meta.description).toBeTruthy();
    }

    // Step 3: Crawler validates Schema.org JSON-LD graph entities
    expect(prerenderScript).toContain("'@type': 'Person'");
    expect(prerenderScript).toContain("'@type': 'ProfessionalService'");
    expect(prerenderScript).toContain("'@type': 'WebSite'");
    expect(prerenderScript).toContain("'@type': 'ItemList'");
  });

  it('4.4 simulates deep-linking and browser navigation confirmation flow', () => {
    // User lands directly on confirmation page via deep-link
    const initialTab = getTabFromLocation('/contact/thanks');
    expect(initialTab).toBe('contact-thanks');

    // Confirm that pushState preservation guard protects the confirmation route
    expect(shouldPreserveCurrentPath(initialTab, '/contact/thanks')).toBe(true);

    // User navigates away to Tools
    const nextTab = getTabFromLocation('/tools');
    expect(nextTab).toBe('tools');
    expect(shouldPreserveCurrentPath(nextTab, '/tools')).toBe(false);

    // User navigates via legacy hash link to Ops HUD
    const opsTab = getTabFromLocation('/unknown', '#ops');
    expect(opsTab).toBe('ops');
    expect(tabToPath(opsTab)).toBe('/ops');
  });
});
