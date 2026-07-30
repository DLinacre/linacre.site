import { describe, expect, it } from 'vitest';
import manifest from '../../data/slime-factory-tycoon.json';

/**
 * Contract tests for the game manifest.
 *
 * The manifest is copied verbatim from the game repository by
 * tools/sync_site.py. These tests are the site's half of that contract: if a
 * sync ever brings across malformed or dishonest data, CI fails here rather
 * than the site quietly rendering something wrong.
 */
describe('game manifest', () => {
  it('has the fields the showcase depends on', () => {
    for (const key of ['name', 'tagline', 'description', 'status', 'platform'] as const) {
      expect(typeof manifest[key]).toBe('string');
      expect(manifest[key].length).toBeGreaterThan(0);
    }
    expect(Array.isArray(manifest.genre)).toBe(true);
    expect(Array.isArray(manifest.features)).toBe(true);
    expect(Array.isArray(manifest.changelog)).toBe(true);
  });

  it('keeps unpublished metrics null rather than guessed', () => {
    expect(manifest.stats.players).toBeNull();
    expect(manifest.stats.visits).toBeNull();
    expect(manifest.stats.rating).toBeNull();
  });

  it('reports code metrics as positive integers', () => {
    for (const key of ['luauModules', 'linesOfLuau', 'achievements', 'cosmetics'] as const) {
      const v = manifest.stats[key];
      expect(Number.isInteger(v)).toBe(true);
      expect(v as number).toBeGreaterThan(0);
    }
  });

  it('orders the changelog newest-first with ISO dates', () => {
    const dates = manifest.changelog.map(e => e.date);
    for (const d of dates) expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const sorted = [...dates].sort().reverse();
    expect(dates).toEqual(sorted);
  });

  it('uses semver for every changelog entry', () => {
    for (const e of manifest.changelog) {
      expect(e.version).toMatch(/^\d+\.\d+\.\d+$/);
      expect(e.changes.length).toBeGreaterThan(0);
    }
  });

  it('only ever exposes https links', () => {
    for (const url of Object.values(manifest.links)) {
      if (url) expect(url).toMatch(/^https:\/\//);
    }
  });

  it('declares brand colours as valid hex', () => {
    for (const c of Object.values(manifest.brand.colours)) {
      expect(c).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('never ships an empty feature or system description', () => {
    for (const f of manifest.features) {
      expect(f.title.trim().length).toBeGreaterThan(0);
      expect(f.desc.trim().length).toBeGreaterThan(10);
    }
    for (const s of manifest.systems) expect(s.trim().length).toBeGreaterThan(0);
  });
});
