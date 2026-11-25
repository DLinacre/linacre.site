import { describe, it, expect } from 'vitest';
import { validateContent } from '../validation/validate-content';
import { content, CONTENT_STATUSES } from '..';
import { filesystemOptions } from '../validation/filesystem';
import dashboard from '../dashboard-selection.json';
import tools from '../tool-selection.json';

const base = {
  id: 'example',
  slug: 'example',
  name: 'Example',
  type: 'project',
  category: 'App',
  shortDescription: 'A useful application.',
  relationship: 'original',
  featured: false,
};
const errors = (input: unknown, options = {}) =>
  validateContent(input, options).filter(issue => issue.level === 'error');

describe('canonical content validation', () => {
  it('validates the entire migrated catalogue, filesystem links and view references', () => {
    expect(
      errors(content, {
        ...filesystemOptions(process.cwd()),
        referenceIds: [...dashboard, ...tools.map(ref => ref.contentId)],
      }),
    ).toEqual([]);
  });
  it('accepts honest incomplete records and reports missing artwork as a warning', () => {
    const result = validateContent([base]);
    expect(result).toEqual([
      { level: 'warning', path: '[0].artwork', message: 'No artwork available' },
    ]);
  });
  it.each([
    'id',
    'slug',
    'name',
    'shortDescription',
    'type',
    'category',
    'relationship',
    'featured',
  ])('rejects a missing %s', field => {
    const row: Record<string, unknown> = { ...base };
    delete row[field];
    expect(errors([row]).length).toBeGreaterThan(0);
  });
  it.each([null, {}, 'records'])('rejects malformed root %j', root =>
    expect(errors(root).length).toBeGreaterThan(0),
  );
  it('rejects non-object records', () => expect(errors([null, []])).toHaveLength(2));
  it.each(['Bad Slug', 'UPPER', '../game', 'game_', '-game', 'game--name', 'game/one'])(
    'rejects slug %s',
    slug => {
      expect(errors([{ ...base, slug }]).some(issue => issue.path.endsWith('.slug'))).toBe(true);
    },
  );
  it('rejects duplicate IDs, slugs and names across both sections', () => {
    const second = { ...base, type: 'game' };
    const result = errors([base, second]);
    expect(result.some(issue => issue.message.includes('Duplicate id'))).toBe(true);
    expect(result.some(issue => issue.message.includes('Duplicate slug'))).toBe(true);
    expect(result.some(issue => issue.message.includes('Duplicate game/project name'))).toBe(true);
  });
  it('detects duplicate repository aliases but permits standalone site subprojects', () => {
    const first = { ...base, sourceRepository: 'https://github.com/DLinacre/tool' };
    const second = {
      ...base,
      id: 'other',
      slug: 'other',
      name: 'Other',
      sourceRepository: 'https://github.com/LIN4CRE/tool/',
    };
    expect(
      errors([first, second]).some(issue => issue.message.includes('Duplicate repository')),
    ).toBe(true);
    expect(
      errors(
        [first, second].map(row => ({
          ...row,
          sourceRepository: 'https://github.com/DLinacre/linacre.site',
        })),
      ),
    ).toEqual([]);
  });
  it('only accepts the five explicit status values; missing status remains unknown', () => {
    expect(CONTENT_STATUSES).toEqual([
      'Live',
      'Released',
      'In Development',
      'Prototype',
      'Archived',
    ]);
    expect(
      errors([{ ...base, status: 'production-ready' }]).some(issue =>
        issue.path.endsWith('.status'),
      ),
    ).toBe(true);
    expect(errors([{ ...base, status: {} }]).some(issue => issue.path.endsWith('.status'))).toBe(
      true,
    );
    for (const status of ['Prototype', 'In Development', 'Archived'])
      expect(errors([{ ...base, status }])).toEqual([]);
  });
  it('does not certify Live from a repository or reachable page alone', () => {
    expect(
      errors([{ ...base, status: 'Live', sourceRepository: 'https://github.com/user/app' }]).length,
    ).toBeGreaterThan(0);
    const live = {
      ...base,
      status: 'Live',
      liveUrl: 'https://example.com',
      statusNote: 'Core flow tested',
      lastVerifiedDate: '2026-11-25',
      verification: { method: 'page-retrieval', scope: 'Retrieved UI only' },
    };
    expect(errors([live]).some(issue => issue.path.endsWith('.verification'))).toBe(true);
    expect(
      errors([{ ...live, verification: { method: 'functional', scope: 'Core flow exercised' } }]),
    ).toEqual([]);
  });
  it('requires dated release evidence and an actual recorded release destination', () => {
    expect(errors([{ ...base, status: 'Released' }]).length).toBeGreaterThan(0);
    expect(
      errors([
        {
          ...base,
          status: 'Released',
          downloadUrl: 'https://github.com/user/app/releases',
          statusNote: 'Asset listed; not installed',
          lastVerifiedDate: '2026-11-25',
          verification: { method: 'source', scope: 'Release metadata' },
        },
      ]),
    ).toEqual([]);
  });
  it.each([
    'javascript:alert(1)',
    'data:text/html,hello',
    'ftp://example.com',
    'not a URL',
    'https://user:pass@example.com',
  ])('rejects unsafe URL %s', liveUrl =>
    expect(errors([{ ...base, liveUrl }]).length).toBeGreaterThan(0),
  );
  it.each([
    '//evil.com',
    '/../secret',
    '/tools/../../secret',
    '/tools/%2e%2e/secret',
    '/tools\\bad',
  ])('rejects unsafe local path %s', liveUrl =>
    expect(errors([{ ...base, liveUrl }]).length).toBeGreaterThan(0),
  );
  it('validates local and same-domain absolute routes, independent of generic SPA fallbacks', () => {
    const options = { routeExists: (route: string) => route === '/games/circuit' };
    expect(errors([{ ...base, liveUrl: '/games/circuit?mode=daily' }], options)).toEqual([]);
    for (const liveUrl of ['/missing', 'https://www.linacre.site/missing'])
      expect(
        errors([{ ...base, liveUrl }], options).some(
          issue => issue.message === 'Unknown local route',
        ),
      ).toBe(true);
  });
  it('rejects missing referenced artwork/screenshots but accepts absent optional media', () => {
    const result = errors(
      [
        {
          ...base,
          artwork: '/missing.webp',
          screenshots: [{ src: '/missing-shot.webp', alt: 'App interface' }],
        },
      ],
      { assetExists: () => false },
    );
    expect(result).toHaveLength(2);
    expect(
      errors([{ ...base, screenshots: [{ src: '/exists.webp' }] }], {
        assetExists: () => true,
      }).some(issue => issue.path.endsWith('.alt')),
    ).toBe(true);
  });
  it.each(['2026-02-30', '2026-13-01', 'yesterday', '2026-1-1'])(
    'rejects invalid verified date %s',
    lastVerifiedDate => expect(errors([{ ...base, lastVerifiedDate }]).length).toBeGreaterThan(0),
  );
  it('rejects malformed optional lists and verification fields', () => {
    expect(
      errors([
        {
          ...base,
          platforms: 'Web',
          features: [3],
          technologyStack: [''],
          verification: { method: 'guess', scope: '' },
        },
      ]).length,
    ).toBeGreaterThanOrEqual(4);
  });
  it('checks broken related IDs and dashboard/tool selections', () => {
    expect(
      errors([{ ...base, relatedIds: ['absent'] }], { referenceIds: ['absent'] }),
    ).toHaveLength(2);
    expect(errors([{ ...base, relatedIds: ['example'] }], { referenceIds: ['example'] })).toEqual(
      [],
    );
  });
  it('keeps third-party wrappers and directories out of original Games', () => {
    expect(
      errors([{ ...base, type: 'game', relationship: 'wrapper' }]).some(issue =>
        issue.path.endsWith('.relationship'),
      ),
    ).toBe(true);
  });
  it('checks game development details, not just top-level fields', () => {
    expect(
      errors([
        {
          ...base,
          type: 'game',
          development: { changelog: [{ date: 'invalid' }], roadmap: [null], systems: [3] },
        },
      ]),
    ).toHaveLength(3);
  });
});
