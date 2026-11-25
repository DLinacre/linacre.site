import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type {
  GameContent,
  ProjectContent,
  StudioContent,
  PortfolioCategory,
} from '../../src/content/schemas/content.schema';
import { validateContent } from '../../src/content/validation/validate-content';
export interface PublishInput {
  type: 'game' | 'project';
  name: string;
  slug: string;
  description: string;
  source?: string;
  genre?: string[];
  category?: ProjectContent['category'];
  technologyStack?: string[];
  status?: GameContent['status'];
  repository: string;
  liveUrl?: string;
  screenshots?: string[];
  publicConfirmed: boolean;
  replace?: boolean;
  portfolioCategory?: PortfolioCategory;
  sourceReview?: { sha: string; confirmed: boolean };
}
export interface PublishPlan {
  record: StudioContent;
  recordsFile: string;
  nextRecords: StudioContent[];
  destination: string;
  copies: { from: string; relative: string }[];
  replacing: boolean;
  root: string;
}
const maxSize = 25 * 1024 * 1024;
const allowed = new Set([
  '.html',
  '.htm',
  '.css',
  '.js',
  '.mjs',
  '.json',
  '.wasm',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.svg',
  '.ico',
  '.woff',
  '.woff2',
  '.ttf',
  '.otf',
  '.mp3',
  '.ogg',
  '.wav',
  '.mp4',
  '.webm',
  '.txt',
  '.map',
]);
const blocked =
  /(^|\/)(?:\.env(?:\..*)?|\.git|\.ssh|node_modules|credentials(?:\..*)?|.*\.(?:pem|key|pfx|p12|kdbx|exe|apk|aab|bat|cmd|ps1))$/i;
function hasControlCharacters(value: string): boolean {
  return Array.from(value).some(character => character.charCodeAt(0) < 32);
}
function fail(message: string): never {
  throw new Error(message);
}
export function safePath(input: string): string {
  if (!input || hasControlCharacters(input)) fail('A valid path is required.');
  const resolved = path.resolve(input);
  let current = path.parse(resolved).root;
  for (const part of resolved.slice(current.length).split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    try {
      if (fs.lstatSync(current).isSymbolicLink())
        fail('Symbolic links/junctions are not accepted: ' + current);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
  }
  if (!fs.existsSync(resolved)) fail('Path does not exist: ' + resolved);
  return resolved;
}
function inside(parent: string, child: string) {
  const r = path.relative(parent, child);
  return r === '' || (!r.startsWith('..' + path.sep) && r !== '..' && !path.isAbsolute(r));
}
function publicUrl(value: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    fail('Expected an HTTPS URL.');
  }
  if (
    parsed!.protocol !== 'https:' ||
    parsed!.username ||
    parsed!.password ||
    /\s/.test(value) ||
    hasControlCharacters(value)
  )
    fail('Use an HTTPS URL without credentials.');
  return parsed!;
}
export function repositoryParts(value: string) {
  const url = publicUrl(value);
  const match = url.pathname.match(/^\/(DLinacre|LIN4CRE)\/([a-z0-9_.-]+)\/?$/i);
  if (url.hostname !== 'github.com' || !match || url.search || url.hash)
    fail('Use a repository URL owned by DLinacre or LIN4CRE.');
  return { owner: match![1], repo: match![2] };
}
function inspectBuild(source: string): {
  base: string;
  files: { from: string; relative: string }[];
} {
  let base = safePath(source);
  if (!fs.statSync(base).isDirectory()) fail('Source must be a build folder, not a file.');
  if (fs.existsSync(path.join(base, 'dist', 'index.html')))
    base = safePath(path.join(base, 'dist'));
  if (!fs.existsSync(path.join(base, 'index.html')))
    fail('No index.html found. Choose an exported browser build or its dist folder.');
  const files: { from: string; relative: string }[] = [];
  let total = 0;
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const from = path.join(dir, entry.name);
      const relative = path.relative(base, from).split(path.sep).join('/');
      if (entry.isSymbolicLink()) fail('Build contains a symbolic link: ' + relative);
      if (hasControlCharacters(relative) || blocked.test(relative))
        fail('Private, secret or executable file rejected: ' + relative);
      if (entry.isDirectory()) {
        walk(from);
        continue;
      }
      if (!entry.isFile() || !allowed.has(path.extname(entry.name).toLowerCase()))
        fail('Unsupported build file: ' + relative);
      total += fs.statSync(from).size;
      if (total > maxSize || files.length >= 500)
        fail(
          'Build exceeds the 25 MB / 500 file limit. Do not publish installers or source trees.',
        );
      files.push({ from, relative });
    }
  };
  walk(base);
  const names = new Set(files.map(f => f.relative));
  for (const f of files.filter(f => /\.(?:html?|css|m?js|json)$/i.test(f.relative))) {
    const text = fs.readFileSync(f.from, 'utf8');
    if (
      /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|(?:sk-(?:proj-)?[a-zA-Z0-9_-]{20,}|gh[pousr]_[a-zA-Z0-9]{20,})|(?:api[_-]?key|password|secret|access[_-]?token)\s*[:=]\s*["'][^"']{12,}["']/i.test(
        text,
      )
    )
      fail(
        'Possible embedded secret in ' + f.relative + '. Review and remove it before publishing.',
      );
    if (/\.tsx?["']/.test(text) && /\.html?$/.test(f.relative))
      fail('HTML references TypeScript source. Export a production build first.');
    if (
      /\.html?$/.test(f.relative) &&
      /<script\b(?![^>]*\bsrc=)(?![^>]*type=["']application\/(?:ld\+)?json["'])[^>]*>\s*\S/i.test(
        text,
      )
    )
      fail(
        'Inline executable scripts are not accepted by the hosting CSP. Move game JavaScript into a local .js file.',
      );
    const refs = [
      ...text.matchAll(
        /(?:\b(?:src|href)\s*=\s*["']([^"']+)|url\(\s*["']?([^)'"\s]+)|\b(?:from\s*|import\s*\(\s*)["'](\.[^"']+))/g,
      ),
    ].map(m => m[1] || m[2] || m[3]);
    for (const ref of refs) {
      if (/^(?:https?:|data:|blob:|mailto:|tel:|#)/i.test(ref)) continue;
      if (ref.startsWith('/') || ref.startsWith('\\') || /^(?:javascript|file):/i.test(ref))
        fail('Use relative build assets, not root-absolute or executable references: ' + ref);
      const withoutQuery = ref.split(/[?#]/)[0];
      if (!withoutQuery) continue;
      let decoded: string;
      try {
        decoded = decodeURIComponent(withoutQuery);
      } catch {
        fail('Invalid encoded asset path: ' + ref);
      }
      const resolved = path.resolve(base, path.dirname(f.relative), decoded!);
      if (
        !inside(base, resolved) ||
        !names.has(path.relative(base, resolved).split(path.sep).join('/'))
      )
        fail('Missing or escaping local asset in ' + f.relative + ': ' + ref);
    }
  }
  const html = fs.readFileSync(path.join(base, 'index.html'), 'utf8');
  if (!/<html\b/i.test(html) || !/<script\b[^>]*\bsrc=/i.test(html))
    fail(
      'Expected an HTML browser build with a local game script. Structural validation does not certify gameplay.',
    );
  return { base, files };
}
export function createPublishPlan(rootInput: string, input: PublishInput): PublishPlan {
  const root = safePath(rootInput);
  if (!input.publicConfirmed)
    fail('Confirm that you own this work and that every supplied file may be public.');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug) || input.slug.length > 70)
    fail('Slug must be lowercase words separated by hyphens (max 70 characters).');
  if (!input.name?.trim() || !input.description?.trim()) fail('Name and description are required.');
  repositoryParts(input.repository);
  if (input.liveUrl) publicUrl(input.liveUrl);
  safePath(path.join(root, 'src/content/games/records.json'));
  safePath(path.join(root, 'src/content/projects/records.json'));
  let ancestor = path.join(root, 'public', 'published');
  while (!fs.existsSync(ancestor)) ancestor = path.dirname(ancestor);
  safePath(ancestor);
  const games = JSON.parse(
    fs.readFileSync(path.join(root, 'src/content/games/records.json'), 'utf8'),
  ) as StudioContent[];
  const projects = JSON.parse(
    fs.readFileSync(path.join(root, 'src/content/projects/records.json'), 'utf8'),
  ) as StudioContent[];
  const collection = input.type === 'game' ? games : projects;
  const existing = [...games, ...projects].find(r => r.slug === input.slug || r.id === input.slug);
  if (
    existing &&
    (!input.replace ||
      existing.type !== input.type ||
      existing.slug !== input.slug ||
      existing.id !== input.slug)
  )
    fail('Duplicate slug/ID. Use a different slug, or explicitly replace the matching entry.');
  if (input.status === 'Live' || input.status === 'Released')
    fail(
      'Publishing never infers a release from files or a URL. Use Prototype/In Development, then record independent functional or official-release evidence before promoting status.',
    );
  const destination = path.join(
    root,
    'public',
    'published',
    input.type === 'game' ? 'games' : 'projects',
    input.slug,
  );
  const copies: { from: string; relative: string }[] = [];
  if (input.type === 'game') {
    if (!input.source) fail('A game build source folder is required.');
    const build = inspectBuild(input.source!);
    if (inside(build.base, root) || inside(root, build.base) || inside(build.base, destination))
      fail('Use a separate exported build folder outside this website repository.');
    copies.push(...build.files.map(f => ({ ...f, relative: 'build/' + f.relative })));
  }
  const shots = [];
  for (const [index, source] of (input.screenshots || []).entries()) {
    const from = safePath(source);
    if (!fs.statSync(from).isFile() || !/^\.(?:png|jpe?g|webp)$/i.test(path.extname(from)))
      fail('Screenshots must be actual PNG, JPEG or WebP files.');
    if (fs.statSync(from).size > 5 * 1024 * 1024)
      fail('Screenshot exceeds 5 MB. Export an optimised image.');
    const bytes = fs.readFileSync(from);
    const ext = path.extname(from).toLowerCase();
    if (!(
      bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ||
      bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255])) ||
      (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP')
    ))
      fail('Screenshot extension does not match image bytes.');
    const relative = `screenshots/${index + 1}${ext}`;
    copies.push({ from, relative });
    shots.push({
      src: `/published/${input.type === 'game' ? 'games' : 'projects'}/${input.slug}/${relative}`,
      alt: `${input.name} — screenshot supplied by the publisher`,
    });
  }
  if (copies.length > 0 && fs.existsSync(destination) && !input.replace)
    fail('Destination already exists; explicit replacement is required.');
  const record = {
    ...(existing || {}),
    id: input.slug,
    slug: input.slug,
    type: input.type,
    name: input.name.trim(),
    shortDescription: input.description.trim(),
    featured: existing?.featured || false,
    relationship: existing?.relationship || 'original',
    sourceRepository: input.repository,
    status: input.status || 'Prototype',
    technologyStack: input.technologyStack || [],
    ...(shots.length ? { screenshots: shots } : {}),
    ...(input.type === 'game'
      ? { genre: input.genre || [], playUrl: `/published/games/${input.slug}/build/index.html` }
      : {
          category: input.category || 'App',
          ...(input.liveUrl ? { liveUrl: input.liveUrl } : {}),
        }),
  } as StudioContent;
  // Replacement changes invalidate old release/functionality claims; evidence must be renewed.
  delete record.verification;
  delete record.lastVerifiedDate;
  delete record.statusNote;
  if (record.type === 'project') {
    delete record.portfolio;
    delete record.downloads;
    delete record.releases;
    delete record.downloadUrl;
    if (input.sourceReview?.confirmed && input.portfolioCategory) {
      record.portfolio = {
        category: input.portfolioCategory,
        sourceSha: input.sourceReview.sha,
        sourceVerifiedAt: new Date().toISOString().slice(0, 10),
        reviewNote:
          'Publisher explicitly confirmed inspecting the public implementation. This is not deployment or functional verification.',
      };
      record.lastVerifiedDate = record.portfolio.sourceVerifiedAt;
      record.verification = { method: 'source', scope: record.portfolio.reviewNote };
    }
  }
  const nextRecords = existing
    ? collection.map(r => (r.id === existing.id ? record : r))
    : [...collection, record];
  const all = input.type === 'game' ? [...projects, ...nextRecords] : [...games, ...nextRecords];
  const errors = validateContent(all).filter(issue => issue.level === 'error');
  if (errors.length) fail(errors.map(e => e.path + ': ' + e.message).join('\n'));
  return {
    record,
    recordsFile: path.join(
      root,
      'src/content',
      input.type === 'game' ? 'games' : 'projects',
      'records.json',
    ),
    nextRecords,
    destination,
    copies,
    replacing: !!existing,
    root,
  };
}
export async function applyPublishPlan(plan: PublishPlan, verify: () => Promise<void>) {
  const backupRoot = path.join(
    plan.root,
    '.publishing-backups',
    new Date().toISOString().replace(/[:.]/g, '-') + '-' + crypto.randomBytes(3).toString('hex'),
  );
  fs.mkdirSync(backupRoot, { recursive: true });
  fs.copyFileSync(plan.recordsFile, path.join(backupRoot, 'records.json'));
  const hadDestination = fs.existsSync(plan.destination);
  if (hadDestination) {
    safePath(plan.destination);
    if (!plan.replacing) fail('Destination exists; not replacing.');
    fs.renameSync(plan.destination, path.join(backupRoot, 'assets'));
  }
  try {
    for (const file of plan.copies) {
      safePath(file.from);
      const to = path.join(plan.destination, file.relative);
      if (!inside(plan.destination, to)) fail('Unsafe output path.');
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.copyFileSync(file.from, to, fs.constants.COPYFILE_EXCL);
    }
    const temporary = plan.recordsFile + '.publish-tmp';
    fs.writeFileSync(temporary, JSON.stringify(plan.nextRecords, null, 2) + '\n');
    fs.renameSync(temporary, plan.recordsFile);
    await verify();
    return backupRoot;
  } catch (error) {
    fs.copyFileSync(path.join(backupRoot, 'records.json'), plan.recordsFile);
    // Only remove the generated destination, never source input or repository root.
    if (fs.existsSync(plan.destination))
      fs.rmSync(plan.destination, { recursive: true, force: true });
    if (hadDestination) fs.renameSync(path.join(backupRoot, 'assets'), plan.destination);
    throw error;
  }
}
