import { mkdir, writeFile } from 'node:fs/promises';

// Whitelist build metadata only. Never export environment dumps or credentials.
const env = process.env;
const source = env.GITLAB_CI === 'true' ? 'gitlab-ci' : env.GITHUB_ACTIONS === 'true' ? 'github-actions' : env.VERCEL === '1' ? 'vercel' : 'local';
const receipt = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  source,
  repository: source === 'gitlab-ci' ? env.CI_PROJECT_PATH || '' : source === 'github-actions' ? env.GITHUB_REPOSITORY || '' : '',
  sha: env.CI_COMMIT_SHA || env.GITHUB_SHA || env.VERCEL_GIT_COMMIT_SHA || '',
  pipelineUrl: source === 'gitlab-ci' ? env.CI_PIPELINE_URL || null : source === 'github-actions' && env.GITHUB_REPOSITORY && env.GITHUB_RUN_ID ? `https://github.com/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}` : null,
  stage: 'build',
  status: 'completed',
};
await mkdir('dist', { recursive: true });
await writeFile('dist/ops-status.json', JSON.stringify(receipt, null, 2) + '\n');
console.log('Wrote build receipt; pipeline and deployment status are not asserted.');
