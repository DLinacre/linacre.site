import { afterEach, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  applyPublishPlan,
  createPublishPlan,
  repositoryParts,
  safePath,
  type PublishInput,
} from '../../../scripts/publishing/core';
const folders: string[] = [];
function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'linacre-publish-test-'));
  folders.push(dir);
  const root = path.join(dir, 'website'),
    build = path.join(dir, 'export');
  for (const kind of ['games', 'projects']) {
    fs.mkdirSync(path.join(root, 'src/content', kind), { recursive: true });
    fs.writeFileSync(path.join(root, 'src/content', kind, 'records.json'), '[]');
  }
  fs.mkdirSync(build);
  fs.writeFileSync(
    path.join(build, 'index.html'),
    '<!doctype html><html><body><canvas></canvas><script src="game.js"></script></body></html>',
  );
  fs.writeFileSync(path.join(build, 'game.js'), 'document.querySelector("canvas").width=320;');
  const input: PublishInput = {
    type: 'game',
    name: 'Temporary test fixture',
    slug: 'temporary-test-fixture',
    description: 'A non-public test fixture.',
    source: build,
    repository: 'https://github.com/DLinacre/linacre.site',
    publicConfirmed: true,
  };
  return { root, build, input };
}
afterEach(() => {
  for (const dir of folders.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});
describe('safe publishing plans and transactional application', () => {
  it('dry planning does not change the source or live catalogue', () => {
    const { root, build, input } = fixture();
    const before = fs.readFileSync(path.join(root, 'src/content/games/records.json'), 'utf8');
    const plan = createPublishPlan(root, input);
    expect(plan.copies).toHaveLength(2);
    expect(plan.record.status).toBe('Prototype');
    expect(fs.readFileSync(path.join(root, 'src/content/games/records.json'), 'utf8')).toBe(before);
    expect(fs.existsSync(path.join(build, 'index.html'))).toBe(true);
    expect(fs.existsSync(plan.destination)).toBe(false);
  });
  it('applies a safe temporary fixture and creates a backup', async () => {
    const { root, build, input } = fixture();
    const plan = createPublishPlan(root, input);
    const backup = await applyPublishPlan(plan, async () => {
      expect(fs.existsSync(path.join(plan.destination, 'build/game.js'))).toBe(true);
    });
    expect(fs.existsSync(path.join(backup, 'records.json'))).toBe(true);
    expect(fs.existsSync(path.join(build, 'game.js'))).toBe(true);
    expect(JSON.parse(fs.readFileSync(plan.recordsFile, 'utf8'))[0].slug).toBe(input.slug);
  });
  it('rolls back record and generated assets if validation fails', async () => {
    const { root, input } = fixture();
    const plan = createPublishPlan(root, input);
    await expect(
      applyPublishPlan(plan, async () => {
        throw Error('simulated validation failure');
      }),
    ).rejects.toThrow('simulated validation failure');
    expect(fs.readFileSync(plan.recordsFile, 'utf8')).toBe('[]');
    expect(fs.existsSync(plan.destination)).toBe(false);
  });
  it('requires explicit replacement and restores old content on failure', async () => {
    const { root, input } = fixture();
    await applyPublishPlan(createPublishPlan(root, input), async () => {});
    expect(() => createPublishPlan(root, input)).toThrow('Duplicate');
    const old = fs.readFileSync(path.join(root, 'src/content/games/records.json'), 'utf8');
    const plan = createPublishPlan(root, { ...input, replace: true, name: 'Changed fixture' });
    await expect(
      applyPublishPlan(plan, async () => {
        throw Error('reject');
      }),
    ).rejects.toThrow();
    expect(fs.readFileSync(plan.recordsFile, 'utf8')).toBe(old);
    expect(fs.existsSync(path.join(plan.destination, 'build/game.js'))).toBe(true);
  });
  it.each(['../escape', 'Bad Slug', 'a/b', 'UPPER', '-bad'])('rejects unsafe slug %s', slug => {
    const { root, input } = fixture();
    expect(() => createPublishPlan(root, { ...input, slug })).toThrow('Slug');
  });
  it.each(['.env', 'key.pem', 'installer.exe', 'app.apk'])(
    'rejects secret/executable files %s',
    file => {
      const { root, build, input } = fixture();
      fs.writeFileSync(path.join(build, file), 'not public');
      expect(() => createPublishPlan(root, input)).toThrow('rejected');
    },
  );
  it('rejects symlinks, missing local assets, source entrypoints and absolute assets', () => {
    const { root, build, input } = fixture();
    fs.symlinkSync(path.join(build, 'game.js'), path.join(build, 'linked.js'));
    expect(() => createPublishPlan(root, input)).toThrow('symbolic');
    fs.unlinkSync(path.join(build, 'linked.js'));
    fs.unlinkSync(path.join(build, 'game.js'));
    expect(() => createPublishPlan(root, input)).toThrow('Missing');
    fs.writeFileSync(path.join(build, 'game.js'), '');
    fs.writeFileSync(
      path.join(build, 'index.html'),
      '<html><script src="/src/main.tsx"></script></html>',
    );
    expect(() => createPublishPlan(root, input)).toThrow('TypeScript');
    fs.writeFileSync(
      path.join(build, 'index.html'),
      '<html><script src="/game.js"></script></html>',
    );
    expect(() => createPublishPlan(root, input)).toThrow('relative');
  });
  it('rejects embedded credentials and inline executable scripts', () => {
    const { root, build, input } = fixture();
    fs.writeFileSync(path.join(build, 'game.js'), 'const secret="not-a-real-secret-fixture";');
    expect(() => createPublishPlan(root, input)).toThrow('secret');
    fs.writeFileSync(path.join(build, 'game.js'), '');
    fs.writeFileSync(path.join(build, 'index.html'), '<html><script>alert(1)</script></html>');
    expect(() => createPublishPlan(root, input)).toThrow('Inline');
  });
  it('rejects publication status without independent evidence', () => {
    const { root, input } = fixture();
    expect(() => createPublishPlan(root, { ...input, status: 'Live' })).toThrow('never infers');
    expect(() => createPublishPlan(root, { ...input, status: 'Released' })).toThrow('never infers');
    expect(() => createPublishPlan(root, { ...input, publicConfirmed: false })).toThrow('Confirm');
  });
  it('validates repository ownership and real screenshot bytes', () => {
    expect(() => repositoryParts('https://github.com/someone-else/repo')).toThrow('owned');
    expect(() => repositoryParts('https://user:secret@github.com/DLinacre/repo')).toThrow(
      'credentials',
    );
    const { root, build, input } = fixture();
    const image = path.join(build, 'false.png');
    fs.writeFileSync(image, 'not image bytes');
    expect(() => createPublishPlan(root, { ...input, screenshots: [image] })).toThrow(
      'image bytes',
    );
  });
  it('creates source-reviewed projects without inventing a deployment', () => {
    const { root, input } = fixture();
    const plan = createPublishPlan(root, {
      ...input,
      type: 'project',
      source: undefined,
      portfolioCategory: 'Developer Tools',
      sourceReview: { sha: 'a'.repeat(40), confirmed: true },
    });
    expect(plan.record.type).toBe('project');
    if (plan.record.type === 'project') {
      expect(plan.record.portfolio?.category).toBe('Developer Tools');
      expect(plan.record.downloads).toBeUndefined();
      expect(plan.record.liveUrl).toBeUndefined();
    }
    expect(plan.record.status).toBe('Prototype');
  });
  it('rejects missing paths', () => {
    expect(() => safePath(path.join(os.tmpdir(), 'missing-linacre-source-xyz'))).toThrow(
      'does not exist',
    );
  });
});
