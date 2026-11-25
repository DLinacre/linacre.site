import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import fs from 'node:fs';
import { projects } from '../content';
import {
  filterPortfolio,
  portfolioProjects,
  projectLinks,
  ProjectDetail,
  ProjectImage,
  ProjectsLanding,
} from './ProjectsExperience';
import StudioHome from './StudioHome';
afterEach(cleanup);
describe('evidence-based software portfolio', () => {
  it('only includes explicitly source-reviewed work and preserves other records', () => {
    expect(portfolioProjects.length).toBeGreaterThanOrEqual(14);
    expect(portfolioProjects.length).toBeLessThan(projects.length);
    for (const p of portfolioProjects) {
      expect(p.sourceRepository).toMatch(/^https:\/\/github\.com\/(?:DLinacre|LIN4CRE)\//);
      expect(p.portfolio?.sourceSha).toMatch(/^[a-f0-9]{40}$/);
    }
  });
  it('uses exact release assets with correct labels instead of invented installers', () => {
    const uninstaller = projects.find(p => p.id === 'linacre-uninstaller')!;
    expect(projectLinks(uninstaller).find(a => a.label === 'Download APK')?.href).toMatch(
      /releases\/download\/.+\.apk$/,
    );
    expect(projectLinks(uninstaller).some(a => a.label === 'Download Windows')).toBe(false);
    expect(
      projectLinks(projects.find(p => p.id === 'fire-tv-setup-kit')!).some(a =>
        a.label.startsWith('Download'),
      ),
    ).toBe(false);
  });
  it('never turns an unverified deployment into Launch Web App', () => {
    for (const p of portfolioProjects.filter(p => p.status !== 'Live'))
      expect(projectLinks(p).some(a => a.label === 'Launch Web App')).toBe(false);
  });
  it('combines text, category, platform and status filters', () => {
    const p = projects.find(p => p.id === 'dual-audio-synchronizer')!;
    expect(
      filterPortfolio(portfolioProjects, 'dual', 'Windows Software', 'Windows', 'Released').map(
        p => p.id,
      ),
    ).toEqual([p.id]);
    expect(
      filterPortfolio(portfolioProjects, 'dual', 'AI & Machine Learning', 'All', 'All'),
    ).toEqual([]);
  });
  it('supports search, empty/reset state and grid/list controls', () => {
    render(<ProjectsLanding />);
    fireEvent.click(screen.getByRole('button', { name: 'List view' }));
    expect(screen.getByRole('button', { name: 'List view' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'no-match-xyz' } });
    expect(screen.getByRole('status')).toHaveTextContent('0 projects');
    fireEvent.click(screen.getAllByRole('button', { name: 'Clear filters' })[0]);
    expect(screen.getByRole('searchbox')).toHaveValue('');
    fireEvent.change(screen.getByRole('combobox', { name: 'Category' }), {
      target: { value: 'Windows Software' },
    });
    expect(screen.getByRole('status')).toHaveTextContent('1 project');
  });
  it.each(portfolioProjects.map(p => [p.name, p] as const))(
    'gives %s an honest case study and real actions',
    (_name, p) => {
      render(<ProjectDetail project={p} />);
      expect(screen.getByRole('heading', { level: 1, name: p.name })).toBeInTheDocument();
      for (const heading of [
        'What it does',
        'The problem it addresses',
        'Why it was built',
        'Key features',
        'How it works',
        'Inside the application',
        'Releases & development',
      ])
        expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
      const aside = screen.getByRole('complementary', { name: 'Project availability' });
      expect(within(aside).getByRole('link', { name: 'View GitHub' })).toHaveAttribute(
        'href',
        p.sourceRepository,
      );
      for (const shot of p.screenshots || []) expect(fs.existsSync('public' + shot.src)).toBe(true);
    },
  );
  it('provides an honest broken-image state', () => {
    const p = projects.find(p => p.id === 'cubelab')!;
    render(<ProjectImage project={p} />);
    fireEvent.error(screen.getByRole('img'));
    expect(screen.getByText('Image unavailable')).toBeInTheDocument();
  });
  it('connects a studio homepage to both collections with verified game launch actions', () => {
    render(<StudioHome />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Independent software.Original games.Built with purpose.',
    );
    expect(screen.getByRole('link', { name: 'Explore Games' })).toHaveAttribute('href', '/games');
    expect(screen.getByRole('link', { name: 'Explore Projects' })).toHaveAttribute(
      'href',
      '/projects',
    );
    expect(screen.getAllByRole('link', { name: 'Play Now' })).toHaveLength(2);
    expect(screen.queryByText(/SYSTEM OPTIMAL/)).not.toBeInTheDocument();
  });
});
