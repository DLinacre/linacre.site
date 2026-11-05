import Fuse from 'fuse.js';

export interface OsintLink {
  t: string;
  u: string;
  h?: string;
}

export interface OsintCategory {
  cat: string;
  links: OsintLink[];
}

export interface OsintSector {
  id: string;
  name: string;
  cats: OsintCategory[];
}

export interface OsintPrimeTool {
  title: string;
  host: string;
  url: string;
  category: string;
  description: string;
}

export interface OsintPayload {
  groups: OsintSector[];
  prime: Array<[string, string, string, string, string]>;
  starred: string[];
  zones: Array<[string, string]>;
}

export interface OsintTool {
  id: string;
  title: string;
  url: string;
  host: string;
  category: string;
  categoryId: string;
  sectorId: string;
  sectorName: string;
}

export type OsintView = 'all' | 'curated' | 'stars' | 'recent';

export interface OsintLocationState {
  query: string;
  sectorId: string;
  view: OsintView;
}

export interface OsintCounts {
  tools: number;
  categories: number;
  sectors: number;
}

export const OSINT_STORAGE_KEYS = {
  stars: 'linacre_osint_stars_v1',
  recents: 'linacre_osint_recents_v1',
  density: 'linacre_osint_density_v1',
  accent: 'linacre_osint_accent_v1',
} as const;

export const OSINT_DEFAULT_COUNTS: OsintCounts = {
  tools: 1310,
  categories: 77,
  sectors: 11,
};

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function isTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat('en', { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

export function isOsintPayload(value: unknown): value is OsintPayload {
  if (!value || typeof value !== 'object') return false;
  const payload = value as Partial<OsintPayload>;
  return (
    Array.isArray(payload.groups) &&
    Array.isArray(payload.prime) &&
    payload.prime.every(
      entry =>
        Array.isArray(entry) &&
        entry.length === 5 &&
        entry.every(item => typeof item === 'string') &&
        isHttpUrl(entry[2]),
    ) &&
    Array.isArray(payload.starred) &&
    payload.starred.every(isHttpUrl) &&
    Array.isArray(payload.zones) &&
    payload.zones.every(
      zone =>
        Array.isArray(zone) &&
        zone.length === 2 &&
        typeof zone[0] === 'string' &&
        typeof zone[1] === 'string' &&
        isTimeZone(zone[1]),
    ) &&
    payload.groups.every(
      group =>
        typeof group?.id === 'string' &&
        typeof group?.name === 'string' &&
        Array.isArray(group.cats) &&
        group.cats.every(
          category =>
            typeof category?.cat === 'string' &&
            Array.isArray(category.links) &&
            category.links.every(
              link =>
                typeof link?.t === 'string' &&
                typeof link?.u === 'string' &&
                isHttpUrl(link.u) &&
                (link.h === undefined || typeof link.h === 'string'),
            ),
        ),
    )
  );
}

export function getOsintCounts(payload: OsintPayload): OsintCounts {
  return payload.groups.reduce(
    (counts, sector) => {
      counts.sectors += 1;
      counts.categories += sector.cats.length;
      counts.tools += sector.cats.reduce((total, category) => total + category.links.length, 0);
      return counts;
    },
    { tools: 0, categories: 0, sectors: 0 },
  );
}

export function flattenOsintTools(groups: OsintSector[]): OsintTool[] {
  return groups.flatMap(sector =>
    sector.cats.flatMap((category, categoryIndex) =>
      category.links.map((link, linkIndex) => {
        let host = link.h ?? '';
        try {
          host ||= new URL(link.u).hostname.replace(/^www\./i, '');
        } catch {
          // Keep malformed source URLs visible as curated data, but never invent a host.
        }
        return {
          id: `${sector.id}:${categoryIndex}:${linkIndex}`,
          title: link.t,
          url: link.u,
          host,
          category: category.cat,
          categoryId: `${sector.id}:${categoryIndex}`,
          sectorId: sector.id,
          sectorName: sector.name,
        };
      }),
    ),
  );
}

export function createOsintSearchIndex(tools: OsintTool[]): Fuse<OsintTool> {
  return new Fuse(tools, {
    includeScore: true,
    ignoreLocation: true,
    threshold: 0.34,
    minMatchCharLength: 2,
    keys: [
      { name: 'title', weight: 0.48 },
      { name: 'host', weight: 0.34 },
      { name: 'category', weight: 0.12 },
      { name: 'sectorName', weight: 0.06 },
    ],
  });
}

export function parseOsintHash(hash: string, validSectorIds: string[] = []): OsintLocationState {
  const raw = hash.replace(/^#/, '');
  const params = new URLSearchParams(raw);
  const query = params.get('q') ?? '';
  const group = params.get('g') ?? '';
  const requestedView = params.get('view');

  // Keep compatibility with share links from the original standalone HUD.
  const view: OsintView =
    group === '__star'
      ? 'curated'
      : group === '__mine'
        ? 'stars'
        : requestedView === 'recent'
          ? 'recent'
          : 'all';
  const isSector =
    group !== '' &&
    group !== '__star' &&
    group !== '__mine' &&
    (validSectorIds.length === 0 || validSectorIds.includes(group));
  const sectorId = isSector ? group : 'all';

  return { query, sectorId, view };
}

export function serializeOsintHash(state: OsintLocationState): string {
  const params = new URLSearchParams();
  const query = state.query.trim();
  if (query) params.set('q', query);

  if (state.view === 'curated') params.set('g', '__star');
  else if (state.view === 'stars') params.set('g', '__mine');
  else if (state.view === 'recent') params.set('view', 'recent');
  else if (state.sectorId !== 'all') params.set('g', state.sectorId);

  const encoded = params.toString();
  return encoded ? `#${encoded}` : '';
}
