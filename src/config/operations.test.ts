import { describe, expect, it } from 'vitest';
import { parseBuildReceipt, OPERATIONS_AGENTS, OPERATIONS_FLOWS } from './operations';

const receipt = { schemaVersion: 1, generatedAt: '2026-09-11T12:00:00Z', source: 'gitlab-ci', repository: 'group/project', sha: 'abc123', pipelineUrl: 'https://gitlab.com/group/project/-/pipelines/1', stage: 'build', status: 'completed' };

describe('operations metadata', () => {
  it('accepts a build receipt without claiming overall pipeline success', () => {
    expect(parseBuildReceipt(receipt)?.status).toBe('completed');
    expect(parseBuildReceipt({ ...receipt, stage: 'deployment' })).toBeNull();
  });
  it('rejects invalid receipts and unsafe pipeline links', () => {
    expect(parseBuildReceipt(null)).toBeNull();
    expect(parseBuildReceipt({ ...receipt, generatedAt: 'invalid' })).toBeNull();
    expect(parseBuildReceipt({ ...receipt, pipelineUrl: 'javascript:alert(1)' })?.pipelineUrl).toBeNull();
    expect(parseBuildReceipt({ ...receipt, pipelineUrl: 'https://gitlab.com.example.test/run' })?.pipelineUrl).toBeNull();
  });
  it('defines unique agents and routes every flow to known roles', () => {
    expect(new Set(OPERATIONS_AGENTS.map(agent => agent.id)).size).toBe(OPERATIONS_AGENTS.length);
    for (const flow of OPERATIONS_FLOWS) {
      expect(flow.file.endsWith('.yaml')).toBe(true);
      for (const name of flow.agents) expect(OPERATIONS_AGENTS.some(agent => agent.name === name)).toBe(true);
    }
  });
});
