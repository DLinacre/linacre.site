import { describe, expect, it } from 'vitest';
import { games } from '../../content';

describe('migrated game manifest', () => {
  const game = games.find(record => record.id === 'slime-factory-tycoon')!;
  it('retains template history without claiming a published Roblox game', () => {
    expect(game.status).toBe('In Development');
    expect(game.relationship).toBe('template');
    expect(game.playUrl).toBeUndefined();
    expect(game.downloadUrl).toMatch(/\.rbxlx$/);
    expect(game.development?.changelog?.length).toBeGreaterThan(0);
    expect(game.development?.systems?.length).toBeGreaterThan(0);
    expect(game.development?.roadmap?.length).toBeGreaterThan(0);
  });
  it('has no fabricated metrics or authenticated screenshots', () => {
    expect(game).not.toHaveProperty('stats');
    expect(game.screenshots ?? []).toEqual([]);
  });
});
