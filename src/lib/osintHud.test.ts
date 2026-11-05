import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  createOsintSearchIndex,
  flattenOsintTools,
  getOsintCounts,
  isOsintPayload,
  OSINT_DEFAULT_COUNTS,
  parseOsintHash,
  serializeOsintHash,
  type OsintPayload,
} from './osintHud';

const payload = JSON.parse(
  readFileSync(path.resolve(process.cwd(), 'public/data/osint-hud.json'), 'utf8'),
) as OsintPayload;

describe('OSINT HUD source data and navigation', () => {
  it('retains the source collection counts: 1,310 tools, 77 categories and 11 sectors', () => {
    expect(isOsintPayload(payload)).toBe(true);
    expect(getOsintCounts(payload)).toEqual(OSINT_DEFAULT_COUNTS);
  });

  it('flattens every source link without losing its sector and category context', () => {
    const tools = flattenOsintTools(payload.groups);
    expect(tools).toHaveLength(1310);
    expect(tools.find(tool => tool.title === 'Shodan')).toMatchObject({
      host: 'shodan.io',
      sectorId: 'infra',
      sectorName: 'INFRA & CYBER',
    });
    expect(new Set(tools.map(tool => tool.id)).size).toBe(1310);
  });

  it('contains only navigable HTTP(S) resources', () => {
    const protocols = flattenOsintTools(payload.groups).map(tool => new URL(tool.url).protocol);
    expect(protocols.every(protocol => protocol === 'https:' || protocol === 'http:')).toBe(true);

    const unsafePayload = structuredClone(payload);
    unsafePayload.groups[0].cats[0].links[0].u = 'javascript:alert(1)';
    expect(isOsintPayload(unsafePayload)).toBe(false);
  });

  it('finds resources by fuzzy title and host text', () => {
    const index = createOsintSearchIndex(flattenOsintTools(payload.groups));
    expect(index.search('shodan').some(result => result.item.title === 'Shodan')).toBe(true);
    expect(index.search('intelx.io').some(result => result.item.title === 'Intelligence X')).toBe(
      true,
    );
  });

  it('restores legacy and current shareable search fragments', () => {
    expect(parseOsintHash('#q=flight&g=geo', ['recon', 'geo'])).toEqual({
      query: 'flight',
      sectorId: 'geo',
      view: 'all',
    });
    expect(parseOsintHash('#g=__mine', ['recon'])).toMatchObject({ view: 'stars' });
    expect(parseOsintHash('#g=__star', ['recon'])).toMatchObject({ view: 'curated' });
    expect(parseOsintHash('#q=reverse+image&view=recent')).toMatchObject({
      query: 'reverse image',
      view: 'recent',
    });
  });

  it('serializes filters without putting them in the request path', () => {
    expect(serializeOsintHash({ query: 'reverse image', sectorId: 'geo', view: 'all' })).toBe(
      '#q=reverse+image&g=geo',
    );
    expect(serializeOsintHash({ query: '', sectorId: 'all', view: 'stars' })).toBe('#g=__mine');
    expect(serializeOsintHash({ query: '', sectorId: 'all', view: 'all' })).toBe('');
  });
});
