export const OPERATIONS_PROJECT = 'https://gitlab.com/dlinacre/web-platforms/linacre-site';
export const FLOW_GUIDE = 'https://docs.gitlab.com/user/duo_agent_platform/flows/custom/';
export const TRIGGER_GUIDE = 'https://docs.gitlab.com/user/duo_agent_platform/triggers/';

export const OPERATIONS_AGENTS = [
  { id: 'scout', name: 'Scout', role: 'Project intelligence', badge: '01', color: '#67e8f9', task: 'Inspect the project, find useful work and separate evidence from assumptions.', tools: 'Read files · List directories · Find files', boundary: 'Read-only. No changes or deployments.' },
  { id: 'engineer', name: 'Engineer', role: 'Scoped repairs', badge: '02', color: '#c4b5fd', task: 'Repair one well-defined problem while preserving your existing architecture.', tools: 'Read · Edit · Add regression tests', boundary: 'Edits require approval. No automatic merge.' },
  { id: 'verifier', name: 'Verifier', role: 'Independent checks', badge: '03', color: '#6ee7b7', task: 'Check the repair independently and report what passed, failed or was not run.', tools: 'Read files · Approved verification commands', boundary: 'Commands require approval. No production changes.' },
  { id: 'release', name: 'Release Inspector', role: 'Release readiness', badge: '04', color: '#fcd34d', task: 'Assess the release evidence, missing checks and rollback requirements.', tools: 'Read files · Inspect build/deploy configuration', boundary: 'Recommendation only. Never merges or deploys.' },
] as const;

export const OPERATIONS_FLOWS = [
  { id: 'scout', name: 'Project reconnaissance', file: 'project-scout.yaml', agents: ['Scout'], description: 'Find the next useful piece of work without changing the project.', event: 'Mention or Assign', setup: 'Enable the flow, then create a Mention or Assign trigger for its service account.' },
  { id: 'repair', name: 'Repair → verify', file: 'repair-and-verify.yaml', agents: ['Engineer', 'Verifier'], description: 'One scoped repair, followed by an independent verification pass.', event: 'Mention', setup: 'Start manually with a scoped issue or merge request. Keep tool approvals enabled.' },
  { id: 'release', name: 'Release inspection', file: 'release-inspector.yaml', agents: ['Release Inspector'], description: 'Assess release readiness without granting automatic merge authority.', event: 'Assign reviewer', setup: 'Enable the flow and attach an Assign reviewer trigger. It reports findings, not approvals.' },
] as const;

export interface BuildReceipt {
  schemaVersion: 1;
  generatedAt: string;
  source: 'gitlab-ci' | 'github-actions' | 'vercel' | 'local';
  repository: string;
  sha: string;
  pipelineUrl: string | null;
  stage: 'build';
  status: 'completed';
}

export function parseBuildReceipt(value: unknown): BuildReceipt | null {
  if (!value || typeof value !== 'object') return null;
  const data = value as Record<string, unknown>;
  if (data.schemaVersion !== 1 || data.stage !== 'build' || data.status !== 'completed' ||
      typeof data.generatedAt !== 'string' || !Number.isFinite(Date.parse(data.generatedAt)) ||
      !['gitlab-ci', 'github-actions', 'vercel', 'local'].includes(String(data.source)) ||
      typeof data.repository !== 'string' || typeof data.sha !== 'string') return null;
  let pipelineUrl: string | null = null;
  if (typeof data.pipelineUrl === 'string') {
    try {
      const url = new URL(data.pipelineUrl);
      if (url.protocol === 'https:' && ['gitlab.com', 'github.com'].includes(url.hostname) && !url.username && !url.password) pipelineUrl = url.href;
    } catch { /* leave invalid links disconnected */ }
  }
  return { schemaVersion: 1, generatedAt: data.generatedAt, source: data.source as BuildReceipt['source'], repository: data.repository.slice(0, 200), sha: data.sha.slice(0, 64), pipelineUrl, stage: 'build', status: 'completed' };
}
