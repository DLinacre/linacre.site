import { describe, expect, it } from 'vitest';
import { filterProjects, PROJECT_CATEGORIES, projectActions, projectCategory } from '../projectLibrary';
import { SITE_PROJECTS, type SiteProject } from '../../data/siteProjects';

const sample: SiteProject = { name: 'Example', kind: 'App', blurb: 'Meal planning', tags: ['food'] };

describe('project library', () => {
  it('has a category for every recorded project', () => {
    for (const project of SITE_PROJECTS) {
      expect(PROJECT_CATEGORIES.some(category => category.id === projectCategory(project))).toBe(true);
    }
  });
  it('distinguishes browser apps, releases and source-only repositories', () => {
    expect(projectActions({ ...sample, url: '/tools/example.html' })[0].kind).toBe('use');
    expect(projectActions({ ...sample, url: 'https://github.com/user/app/releases/latest' })[0].kind).toBe('download');
    expect(projectActions({ ...sample, url: 'https://github.com/user/app', repo: 'https://github.com/user/app' })).toEqual([
      { kind: 'source', label: 'Source', href: 'https://github.com/user/app' },
    ]);
    expect(projectActions({ ...sample, url: 'https://example.com/app.apk?version=2' })[0].kind).toBe('download');
  });
  it('never invents a download or exposes links for private projects', () => {
    expect(projectActions({ ...sample, repo: 'https://github.com/user/app' }).map(action => action.kind)).toEqual(['source']);
    expect(projectActions({ ...sample, private: true, url: 'https://example.com' })).toEqual([]);
    expect(projectActions({ ...sample, url: 'javascript:alert(1)' })).toEqual([]);
  });
  it('combines query, category and access filters', () => {
    const projects = [{ ...sample, url: '/app' }, { ...sample, name: 'Other', kind: 'Tool' as const, repo: 'https://github.com/user/tool' }];
    expect(filterProjects(projects, ' FOOD meal ', 'App', 'use')).toEqual([projects[0]]);
    expect(filterProjects(projects, '', 'all', 'download')).toEqual([]);
    expect(filterProjects(projects, '', 'Tool', 'source')).toEqual([projects[1]]);
  });
  it('keeps Tycoon source-only and prioritises KushCloud', () => {
    const tycoon = SITE_PROJECTS.find(project => project.name === 'Slime Factory Tycoon')!;
    expect(projectCategory(tycoon)).toBe('Source');
    expect(projectActions(tycoon).map(action => action.kind)).toEqual(['source']);
    expect(SITE_PROJECTS.find(project => project.name === 'KushCloud')?.pinned).toBe(true);
  });
});
