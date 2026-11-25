import { CONTENT_STATUSES, PORTFOLIO_CATEGORIES } from '../schemas/content.schema';

export interface ValidationIssue {
  level: 'error' | 'warning';
  path: string;
  message: string;
}
export interface ValidationOptions {
  assetExists?: (path: string) => boolean;
  routeExists?: (path: string) => boolean;
  referenceIds?: string[];
}
const statuses = new Set<string>(CONTENT_STATUSES);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const text = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const validDate = (v: unknown): boolean =>
  text(v) &&
  /^\d{4}-\d{2}-\d{2}$/.test(v) &&
  Number.isFinite(Date.parse(v)) &&
  new Date(v).toISOString().slice(0, 10) === v;

/** Pure validator shared by tests and CLI; never performs network requests or changes files. */
export function validateContent(
  input: unknown,
  options: ValidationOptions = {},
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const add = (path: string, message: string, level: ValidationIssue['level'] = 'error') =>
    issues.push({ level, path, message });
  if (!Array.isArray(input))
    return [{ level: 'error', path: 'content', message: 'Expected an array' }];
  const ids = new Set<string>();
  const slugs = new Set<string>();
  const names = new Set<string>();
  const repositories = new Map<string, string>();
  function url(value: unknown, path: string, asset = false, externalOnly = false) {
    if (!text(value)) {
      add(path, 'Expected a nonempty URL/path');
      return;
    }
    if (value.startsWith('/') && !externalOnly) {
      if (
        value.startsWith('//') ||
        /[\\\s]/.test(value) ||
        /(?:%2e|%2f|%5c)/i.test(value) ||
        value.split(/[?#]/)[0].split('/').includes('..')
      ) {
        add(path, 'Unsafe local path');
        return;
      }
      const parsed = new URL(value, 'https://www.linacre.site');
      if (asset && options.assetExists && !options.assetExists(parsed.pathname))
        add(path, 'Referenced artwork/screenshot does not exist');
      if (!asset && options.routeExists && !options.routeExists(parsed.pathname))
        add(path, 'Unknown local route');
      return;
    }
    try {
      const parsed = new URL(value);
      if (
        !['https:', 'http:'].includes(parsed.protocol) ||
        !parsed.hostname ||
        parsed.username ||
        parsed.password ||
        /\s/.test(value)
      )
        add(path, 'Expected a public HTTP(S) URL without credentials');
      if (['www.linacre.site', 'linacre.site'].includes(parsed.hostname)) {
        if (asset && options.assetExists && !options.assetExists(parsed.pathname))
          add(path, 'Referenced artwork/screenshot does not exist');
        if (!asset && options.routeExists && !options.routeExists(parsed.pathname))
          add(path, 'Unknown local route');
      }
    } catch {
      add(path, 'Invalid URL format');
    }
  }
  input.forEach((record: unknown, index: number) => {
    const at = `[${index}]`;
    if (!object(record)) {
      add(at, 'Expected a content object');
      return;
    }
    for (const field of ['id', 'slug', 'name', 'shortDescription'])
      if (!text(record[field])) add(`${at}.${field}`, 'Required nonempty field');
    for (const field of ['id', 'slug']) {
      const value = record[field];
      if (text(value)) {
        if (!slugPattern.test(value)) add(`${at}.${field}`, 'Expected lowercase kebab-case');
        const seen = field === 'id' ? ids : slugs;
        if (seen.has(value)) add(`${at}.${field}`, `Duplicate ${field}: ${value}`);
        seen.add(value);
      }
    }
    if (text(record.name)) {
      const name = record.name.normalize('NFKC').trim().toLowerCase().replace(/\s+/g, ' ');
      if (names.has(name)) add(`${at}.name`, 'Duplicate game/project name');
      names.add(name);
    }
    if (!['game', 'project'].includes(String(record.type)))
      add(`${at}.type`, 'Expected game or project');
    if (
      record.type === 'project' &&
      !['App', 'Tool', 'AI', 'DevOps', 'Source'].includes(String(record.category))
    )
      add(`${at}.category`, 'Invalid project category');
    if (
      !['original', 'wrapper', 'template', 'directory', 'integration'].includes(
        String(record.relationship),
      )
    )
      add(`${at}.relationship`, 'Invalid ownership/relationship');
    if (
      record.type === 'game' &&
      record.relationship !== 'original' &&
      record.relationship !== 'template'
    )
      add(
        `${at}.relationship`,
        'Wrappers/directories/third-party integrations belong in Projects, not original Games',
      );
    if (typeof record.featured !== 'boolean') add(`${at}.featured`, 'Expected boolean');
    if (
      record.status !== undefined &&
      (typeof record.status !== 'string' || !statuses.has(record.status))
    )
      add(`${at}.status`, 'Invalid status');
    if (record.status === 'Live' && !(record.playUrl || record.liveUrl))
      add(`${at}.status`, 'Live requires an application/play URL');
    if (record.status === 'Released' && !record.downloadUrl)
      add(`${at}.status`, 'Released requires a download/release URL');
    if (['Live', 'Released'].includes(String(record.status)) && !text(record.statusNote))
      add(`${at}.statusNote`, 'Published status requires an evidence/limitations note');
    for (const field of [
      'fullDescription',
      'problemSolved',
      'statusNote',
      'controls',
      'modes',
      'role',
      'implementation',
    ])
      if (record[field] !== undefined && !text(record[field]))
        add(`${at}.${field}`, 'Expected nonempty text when supplied');
    for (const field of [
      'genre',
      'platforms',
      'inputMethods',
      'features',
      'technologyStack',
      'tags',
      'relatedIds',
      'provenance',
    ]) {
      const value = record[field];
      if (value !== undefined && (!Array.isArray(value) || !value.every(text)))
        add(`${at}.${field}`, 'Expected an array of nonempty strings');
    }
    for (const field of [
      'playUrl',
      'liveUrl',
      'downloadUrl',
      'sourceRepository',
      'documentation',
    ]) {
      if (record[field] !== undefined)
        url(record[field], `${at}.${field}`, false, field === 'sourceRepository');
    }
    if (text(record.sourceRepository)) {
      const repo = record.sourceRepository
        .toLowerCase()
        .replace(/\.git$/, '')
        .replace(/\/$/, '')
        .replace('github.com/lin4cre/', 'github.com/dlinacre/');
      // Multiple standalone games and site subprojects legitimately share the website repository.
      if (!repo.endsWith('/linacre.site')) {
        if (repositories.has(repo))
          add(`${at}.sourceRepository`, `Duplicate repository (also ${repositories.get(repo)})`);
        repositories.set(repo, String(record.id));
      }
    }
    if (record.artwork === undefined) add(`${at}.artwork`, 'No artwork available', 'warning');
    else url(record.artwork, `${at}.artwork`, true);
    if (record.screenshots !== undefined) {
      if (!Array.isArray(record.screenshots)) add(`${at}.screenshots`, 'Expected screenshot array');
      else
        record.screenshots.forEach((shot: unknown, i: number) => {
          const path = `${at}.screenshots[${i}]`;
          if (!object(shot)) {
            add(path, 'Expected screenshot object');
            return;
          }
          url(shot.src, `${path}.src`, true);
          if (!text(shot.alt)) add(`${path}.alt`, 'Screenshot requires descriptive alt text');
          if (shot.capturedAt !== undefined && !validDate(shot.capturedAt))
            add(`${path}.capturedAt`, 'Invalid capture date');
        });
    }
    if (record.lastVerifiedDate !== undefined && !validDate(record.lastVerifiedDate))
      add(`${at}.lastVerifiedDate`, 'Expected a real ISO calendar date');
    if (
      record.status === 'Live' &&
      (!object(record.verification) ||
        !['functional', 'device-install'].includes(String(record.verification.method)))
    )
      add(
        `${at}.verification`,
        'Live requires functional verification, not repository/page existence',
      );
    if (
      ['Live', 'Released'].includes(String(record.status)) &&
      (!record.lastVerifiedDate || !record.verification)
    )
      add(`${at}.verification`, 'Published status requires dated evidence');
    if (
      record.presentation !== undefined &&
      (!object(record.presentation) ||
        (record.presentation.pinned !== undefined &&
          typeof record.presentation.pinned !== 'boolean'))
    )
      add(`${at}.presentation`, 'Invalid presentation metadata');
    if (record.type === 'game' && record.development !== undefined) {
      if (!object(record.development))
        add(`${at}.development`, 'Expected structured development details');
      else {
        const dev = record.development;
        if (dev.systems !== undefined && (!Array.isArray(dev.systems) || !dev.systems.every(text)))
          add(`${at}.development.systems`, 'Expected nonempty system descriptions');
        if (
          dev.changelog !== undefined &&
          (!Array.isArray(dev.changelog) ||
            !dev.changelog.every(
              entry =>
                object(entry) &&
                text(entry.version) &&
                validDate(entry.date) &&
                text(entry.title) &&
                Array.isArray(entry.changes) &&
                entry.changes.every(text),
            ))
        )
          add(`${at}.development.changelog`, 'Invalid changelog');
        if (
          dev.roadmap !== undefined &&
          (!Array.isArray(dev.roadmap) ||
            !dev.roadmap.every(entry => object(entry) && text(entry.item) && text(entry.status)))
        )
          add(`${at}.development.roadmap`, 'Invalid roadmap');
      }
    }
    if (record.type === 'project') {
      if (record.whyBuilt !== undefined && !text(record.whyBuilt))
        add(`${at}.whyBuilt`, 'Expected a nonempty rationale');
      if (record.portfolio !== undefined) {
        const p = record.portfolio;
        if (
          !object(p) ||
          !PORTFOLIO_CATEGORIES.includes(p.category as never) ||
          !validDate(p.sourceVerifiedAt) ||
          !text(p.sourceSha) ||
          !/^[a-f0-9]{40}$/.test(p.sourceSha) ||
          !text(p.reviewNote) ||
          !text(record.sourceRepository)
        )
          add(`${at}.portfolio`, 'Portfolio needs source review, SHA, date and valid category');
      }
      for (const field of ['downloads', 'releases']) {
        if (record[field] === undefined) continue;
        if (!Array.isArray(record[field])) {
          add(`${at}.${field}`, 'Expected an array');
          continue;
        }
        for (const [i, item] of record[field].entries()) {
          const atItem = `${at}.${field}[${i}]`;
          if (!object(item) || !text(item.version) || !text(item.url)) {
            add(atItem, 'Expected version and URL');
            continue;
          }
          url(item.url, `${atItem}.url`, false, true);
          if (
            !/^https:\/\/github\.com\/(?:DLinacre|LIN4CRE)\/[a-z0-9_.-]+\/releases\/(?:download\/|tag\/)/i.test(
              item.url,
            )
          )
            add(`${atItem}.url`, 'Use an official versioned GitHub release URL');
          if (field === 'downloads' && !text(item.label))
            add(`${atItem}.label`, 'Expected a download label');
          if (item.publishedAt !== undefined && !validDate(item.publishedAt))
            add(`${atItem}.publishedAt`, 'Invalid release date');
        }
      }
    }
    if (record.verification !== undefined) {
      if (
        !object(record.verification) ||
        !['source', 'page-retrieval', 'boot', 'functional', 'device-install'].includes(
          String(record.verification.method),
        ) ||
        !text(record.verification.scope)
      )
        add(`${at}.verification`, 'Verification needs a valid method and scope');
      if (!record.lastVerifiedDate) add(`${at}.lastVerifiedDate`, 'Verification needs a date');
    }
    if (record.type === 'project' && record.playUrl !== undefined)
      add(`${at}.playUrl`, 'Project must use liveUrl, not playUrl');
    if (record.type === 'game' && record.liveUrl !== undefined)
      add(`${at}.liveUrl`, 'Game must use playUrl, not liveUrl');
  });
  input.forEach((record: unknown, index: number) => {
    if (!object(record) || !Array.isArray(record.relatedIds)) return;
    for (const id of record.relatedIds)
      if (!ids.has(String(id))) add(`[${index}].relatedIds`, `Unknown content reference: ${id}`);
  });
  for (const id of options.referenceIds ?? [])
    if (!ids.has(id)) add('references', `Unknown selection reference: ${id}`);
  return issues;
}
