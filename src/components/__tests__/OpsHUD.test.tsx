import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import OpsHUD from '../OpsHUD';

const receipt = { schemaVersion: 1, generatedAt: '2026-09-11T12:00:00Z', source: 'gitlab-ci', repository: 'group/project', sha: 'abc123', pipelineUrl: 'https://gitlab.com/group/project/-/pipelines/1', stage: 'build', status: 'completed' };

afterEach(() => vi.unstubAllGlobals());

describe('Mission Control', () => {
  it('shows real receipt data and keeps runtime connections disconnected', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, text: async () => JSON.stringify(receipt) }));
    render(<OpsHUD />);
    expect(await screen.findByText('abc123')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Inspect build run' })).toHaveAttribute('href', receipt.pipelineUrl);
    expect(screen.getAllByText('Not connected').length).toBeGreaterThan(0);
    expect(screen.queryByText('100% PASS')).not.toBeInTheDocument();
  });
  it('reports unavailable telemetry and exposes flow setup without a fake run button', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    const user = userEvent.setup();
    render(<OpsHUD />);
    expect(await screen.findAllByText(/Build feed unavailable/)).not.toHaveLength(0);
    await user.click(screen.getByRole('button', { name: 'Agents', exact: true }));
    await user.click(screen.getByRole('button', { name: /Engineer Scoped repairs/ }));
    expect(screen.getByText('Edits require approval. No automatic merge.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Flows & triggers', exact: true }));
    expect(screen.getAllByText('Not activated here')).toHaveLength(3);
    expect(screen.getByRole('link', { name: 'View Repair → verify YAML' })).toBeInTheDocument();
  });
});
