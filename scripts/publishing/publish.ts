import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { applyPublishPlan, createPublishPlan, repositoryParts, type PublishInput } from './core';
const args = process.argv.slice(2);
const get = (flag: string) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const kind = args.includes('--game') ? 'game' : 'project';
const root = path.resolve(import.meta.dirname, '../..');
const rl = createInterface({ input, output });
try {
  let metadata: PublishInput;
  const file = get('--metadata');
  if (file) {
    metadata = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (metadata.type !== kind) throw new Error('Metadata type does not match the publisher.');
  } else {
    output.write(`LIN4CRE ${kind} publisher — local changes only, never commit or deploy.\n`);
    const source =
      kind === 'game'
        ? get('--source') || (await rl.question('Exported browser build folder: '))
        : undefined;
    const name = await rl.question('Name: '),
      slug = await rl.question('Slug (lowercase-with-hyphens): '),
      description = await rl.question('Short description: '),
      repository = await rl.question('Public GitHub repository URL: ');
    const liveUrl =
      kind === 'project' ? await rl.question('Recorded live URL (Enter if none): ') : undefined;
    const labels = await rl.question(
      kind === 'game'
        ? 'Genres (comma separated): '
        : 'Legacy category: App, Tool, AI, DevOps or Source [App]: ',
    );
    const technologyStack = (await rl.question('Technology stack (comma separated): '))
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);
    const status = await rl.question('Status: Prototype, In Development or Archived [Prototype]: ');
    const screenshots = (
      await rl.question('Actual screenshot paths (separate with |; Enter if none): ')
    )
      .split('|')
      .map(v => v.trim())
      .filter(Boolean);
    const confirmed = await rl.question(
      'Do you own this work and confirm EVERY supplied file may be public? Type PUBLIC: ',
    );
    metadata = {
      type: kind,
      source,
      name,
      slug,
      description,
      repository,
      liveUrl: liveUrl || undefined,
      genre:
        kind === 'game'
          ? labels
              .split(',')
              .map(v => v.trim())
              .filter(Boolean)
          : undefined,
      category: kind === 'project' ? ((labels || 'App') as PublishInput['category']) : undefined,
      technologyStack,
      status: (status || 'Prototype') as PublishInput['status'],
      screenshots,
      publicConfirmed: confirmed === 'PUBLIC',
    };
  }
  metadata.replace = args.includes('--replace');
  const repo = repositoryParts(metadata.repository);
  const request = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}`, {
    headers: { Accept: 'application/vnd.github+json' },
    signal: AbortSignal.timeout(10000),
  });
  if (!request.ok)
    throw new Error(
      'Cannot verify the public repository (HTTP ' + request.status + '). Nothing was written.',
    );
  const info = await request.json();
  if (info.private !== false) throw new Error('Only explicitly public repositories are accepted.');
  if (kind === 'project' && !file) {
    const category = await rl.question(
      'Portfolio category: AI & Machine Learning | Windows Software | Web Applications | Android Applications | Developer Tools | Automation & Infrastructure | Experimental Projects [Experimental Projects]: ',
    );
    metadata.portfolioCategory = (category ||
      'Experimental Projects') as PublishInput['portfolioCategory'];
    const reviewed = await rl.question(
      'Have you inspected the actual public implementation and confirmed it is your work? Type SOURCE REVIEWED to include it in the public portfolio, or Enter to keep a draft: ',
    );
    if (reviewed === 'SOURCE REVIEWED') {
      const commits = await fetch(
        `https://api.github.com/repos/${repo.owner}/${repo.repo}/commits?per_page=1`,
        { signal: AbortSignal.timeout(10000) },
      );
      if (!commits.ok) throw new Error('Cannot verify the source commit. Nothing was written.');
      const list = await commits.json();
      metadata.sourceReview = { sha: list[0].sha, confirmed: true };
    }
  }
  if (metadata.liveUrl) {
    try {
      const res = await fetch(metadata.liveUrl, {
        method: 'HEAD',
        redirect: 'follow',
        signal: AbortSignal.timeout(8000),
      });
      output.write(`Live URL HEAD returned ${res.status}. This does not verify the application.\n`);
    } catch {
      output.write('Live URL could not be checked; no Live status will be assigned.\n');
    }
  }
  const plan = createPublishPlan(root, metadata);
  output.write('\nProposed canonical record:\n' + JSON.stringify(plan.record, null, 2) + '\n');
  for (const copy of plan.copies)
    output.write(`COPY ${copy.from} -> ${path.join(plan.destination, copy.relative)}\n`);
  if (args.includes('--dry-run')) {
    output.write('DRY RUN: no files changed.\n');
  } else {
    const phrase = await rl.question(
      `Type ${plan.replacing ? 'REPLACE' : 'PUBLISH'} ${metadata.slug} to apply these local changes: `,
    );
    if (phrase !== `${plan.replacing ? 'REPLACE' : 'PUBLISH'} ${metadata.slug}`)
      throw new Error('Cancelled. No changes written.');
    const backup = await applyPublishPlan(plan, async () => {
      for (const command of ['content:validate', 'test', 'build']) {
        output.write(`\nRunning npm run ${command}...\n`);
        const result = spawnSync(
          process.platform === 'win32' ? 'npm.cmd' : 'npm',
          ['run', command],
          { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' },
        );
        if (result.status !== 0)
          throw new Error(command + ' failed. Generated changes were rolled back.');
      }
    });
    output.write(
      `\nLocal publication complete. Backup: ${backup}\nReview git diff and the browser preview before committing. No commit, push or deployment was performed.\nPrototype status is intentional. Public portfolio inclusion and Live/Released status require a separate evidence review.\n`,
    );
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Publishing failed.');
  process.exitCode = 1;
} finally {
  rl.close();
}
