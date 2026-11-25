import { GameDetail } from './GamesExperience';
import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Collection, resolveStudioRoute } from './Studio';
import { SiteNavigation } from './components';
import { content, games } from '../content';
import fs from 'node:fs';

afterEach(cleanup);
describe('Studio navigation and route contracts', () => {
  it('resolves every canonical detail independently, including trailing slashes', () => {
    for (const record of content) {
      const path = `/${record.type === 'game' ? 'games' : 'projects'}/${record.slug}`;
      expect(resolveStudioRoute(path).record?.id).toBe(record.id);
      expect(resolveStudioRoute(path + '/').record?.id).toBe(record.id);
    }
    expect(resolveStudioRoute('/games/missing').record).toBeUndefined();
    expect(resolveStudioRoute('/projects').page).toBe('/projects');
  });
  it('does not redirect projects away and rewrites both detail namespaces', () => {
    const config = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    expect(config.redirects.some((r: { source: string }) => r.source.startsWith('/projects'))).toBe(
      false,
    );
    for (const section of ['games', 'projects'])
      expect(config.rewrites).toContainEqual({
        source: `/${section}/:slug`,
        destination: `/${section}/:slug/index.html`,
      });
  });
  it('keeps playable local games separate from detail routes', () => {
    for (const game of games.filter(g => g.playUrl?.startsWith('/games/'))) {
      expect(game.playUrl).toMatch(/\.html$/);
      expect(fs.existsSync('public' + game.playUrl)).toBe(true);
    }
  });
  it('exposes a keyboard-operable mobile menu with current page', () => {
    render(<SiteNavigation path="/games/circuit" />);
    const button = screen.getByRole('button', { name: 'Open navigation' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(button);
    expect(screen.getByRole('button', { name: 'Close navigation' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('link', { name: 'Games' })).toHaveAttribute('aria-current', 'page');
  });
});
describe('Studio content interactions', () => {
  it('searches canonical games and offers an accessible reset', () => {
    render(<Collection kind="game" />);
    const search = screen.getByRole('searchbox', { name: 'Search the collection' });
    fireEvent.change(search, { target: { value: 'no-such-game-987' } });
    expect(screen.getByRole('heading', { name: 'No matches this time.' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('0 entries');
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(search).toHaveValue('');
    expect(screen.getByRole('status')).toHaveTextContent(`${games.length} entries`);
    fireEvent.click(screen.getByRole('button', { name: 'Templates' }));
    expect(screen.getByRole('button', { name: 'Templates' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('heading', { name: 'Slime Factory Tycoon' })).toBeInTheDocument();
  });
  it('shows the verified game launch and actual gameplay capture', () => {
    const circuit = games.find(r => r.id === 'circuit')!;
    render(<GameDetail game={circuit} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Circuit');
    expect(screen.getAllByRole('link', { name: 'Play Now' })[0]).toHaveAttribute(
      'href',
      '/games/circuit/play',
    );
    expect(screen.getAllByText('Live').length).toBeGreaterThan(0);
    expect(screen.getByRole('img', { name: /Circuit during a real Chromium/ })).toHaveAttribute(
      'src',
      '/gameplay/circuit.png',
    );
  });
});
