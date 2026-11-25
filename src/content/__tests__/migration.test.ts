import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { content, games, projects, contentById, contentStatusLabel } from '..';
import { SITE_PROJECTS } from '../adapters/siteProjects';
import { PROJECTS, TOOLS } from '../adapters/legacyData';
import { dashboardProjects } from '../adapters/dashboard';
import externalGames from '../archive/external-games.json';
import local from '../archive/siteProjects.dlinacre.json';
import upstream from '../archive/siteProjects.lin4cre.json';
import curated from '../archive/curatedWork.lin4cre.json';
import manual from '../archive/manual-projects.json';

const repoKey = (url: string) =>
  url.toLowerCase().replace('github.com/lin4cre/', 'github.com/dlinacre/').replace(/\/$/, '');
describe('content migration and derived views', () => {
  it('preserves the old inputs as explicitly non-runtime snapshots', () => {
    expect(local).toHaveLength(69);
    expect(upstream).toHaveLength(25);
    expect(manual).toHaveLength(32);
    expect(externalGames.games).toHaveLength(77);
  });
  it('accounts for every public legacy repository without preserving duplicate products', () => {
    for (const record of [...local, ...upstream]) {
      if (('private' in record && record.private) || record.kind === 'Private') continue;
      if (!('repo' in record) || !record.repo) continue;
      expect(
        content.some(
          item => item.sourceRepository && repoKey(item.sourceRepository) === repoKey(record.repo!),
        ),
        record.name,
      ).toBe(true);
    }
    expect(content.filter(item => item.name === 'CubeLab')).toHaveLength(1);
    expect(content.filter(item => item.id === 'kushcloud')).toHaveLength(1);
  });
  it('migrates all selected work and games into the same canonical records', () => {
    for (const selected of [...curated.selectedWork, ...curated.selectedGames]) {
      expect(contentById.has(selected.id), selected.name).toBe(true);
      expect(contentById.get(selected.id)?.fullDescription).toBeTruthy();
    }
  });
  it('preserves useful case-study and development information', () => {
    expect(projects.find(item => item.id === 'bonny-bats')?.problemSolved).toBeTruthy();
    expect(contentById.get('kushcloud')?.implementation).toBeTruthy();
    expect(
      games.find(item => item.id === 'slime-factory-tycoon')?.development?.changelog?.length,
    ).toBeGreaterThan(0);
  });
  it('derives library, dashboard and tool views from canonical IDs', () => {
    expect(SITE_PROJECTS).toHaveLength(content.length);
    expect(PROJECTS).toHaveLength(content.length);
    for (const card of dashboardProjects) {
      expect(contentById.get(card.id)?.name).toBe(card.title);
      expect(card.badge).toBe(contentStatusLabel(contentById.get(card.id)!));
    }
    expect(dashboardProjects.find(card => card.id === 'omniroute-llm-engine')?.links.github).toBe(
      'https://github.com/DLinacre/OmniRoute-LLM',
    );
    expect(TOOLS.find(tool => tool.id === 'aeroflap')?.tag).toBe('Status not verified');
  });
  it('does not publish private placeholders or third-party games as original work', () => {
    expect(content.some(item => item.id === 'knowledge-vault')).toBe(false);
    expect(projects.find(item => item.id === 'pixelpoke-arena')?.relationship).toBe('wrapper');
    expect(games.some(item => item.id === 'pixelpoke-arena')).toBe(false);
    const externalIds = new Set(externalGames.games.map(item => item.id));
    expect(games.some(item => externalIds.has(item.id))).toBe(false);
    expect(projects.find(item => item.id === 'tabulous-games')?.relationship).toBe('directory');
  });
  it('treats boot/retrieval evidence as scoped verification rather than Live status', () => {
    for (const item of content.filter(item =>
      ['boot', 'page-retrieval'].includes(item.verification?.method ?? ''),
    ))
      expect(item.status).not.toBe('Live');
    expect(contentStatusLabel({})).toBe('Status not verified');
  });
  it('does not import historical snapshots into runtime code', () => {
    const walk = (dir: string): string[] =>
      fs
        .readdirSync(dir, { withFileTypes: true })
        .flatMap(entry =>
          entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)],
        );
    for (const file of [...walk('src'), ...walk('scripts')].filter(
      file => /\.(ts|tsx|mjs)$/.test(file) && !file.includes('__tests__'),
    )) {
      expect(fs.readFileSync(file, 'utf8'), file).not.toMatch(
        /(?:from\s*|import\s*\()["'][^"']*\/archive\//,
      );
    }
    expect(fs.readFileSync('src/App.tsx', 'utf8')).not.toContain('linacre_site_projects');
    expect(fs.existsSync('src/config/projects.json')).toBe(false);
    expect(fs.existsSync('src/data/slime-factory-tycoon.json')).toBe(false);
  });
});
