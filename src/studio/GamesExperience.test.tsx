import { createHash } from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import fs from 'node:fs';
import { games } from '../content';
import { GameCard, GameDetail, GamePlayer, GamesLanding } from './GamesExperience';
import { canPlay, filterGames, gameAction, localGame } from './gameLibrary';
import { resolveStudioRoute } from './Studio';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
describe('Original game publication contracts', () => {
  it('keeps standalone game URLs and same-origin launches compatible with hosting security', () => {
    const config = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    expect(config.cleanUrls).toBe(false);
    for (const url of [
      '/games/afterglow.html',
      '/games/circuit.html',
      '/games/circuit/play',
      '/projects',
    ]) {
      const headers = new Map<string, string>();
      for (const rule of config.headers)
        if (new RegExp('^' + rule.source + '$').test(url)) {
          for (const header of rule.headers) headers.set(header.key, header.value);
        }
      if (url.endsWith('.html')) {
        expect(headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
        expect(headers.get('Content-Security-Policy')).toContain("frame-ancestors 'self'");
      } else expect(headers.get('X-Frame-Options')).toBe('DENY');
    }
  });

  it('pins Afterglow inline execution to the exact imported script and preserves its license', () => {
    const html = fs.readFileSync('public/games/afterglow.html', 'utf8');
    const script = html.match(/<script>([\s\S]*?)<\/script>/)![1];
    const hash = createHash('sha256').update(script).digest('base64');
    expect(fs.readFileSync('vercel.json', 'utf8')).toContain(`sha256-${hash}`);
    expect(fs.readFileSync('public/games/afterglow.LICENSE.txt', 'utf8')).toContain('MIT License');
  });

  it('only grants Play Now to functionally verified Live builds', () => {
    for (const game of games) {
      expect(['original', 'template']).toContain(game.relationship);
      if (gameAction(game).label === 'Play Now') {
        expect(game.status).toBe('Live');
        expect(game.verification?.method).toBe('functional');
        expect(game.screenshots?.length).toBeGreaterThan(0);
        expect(game.controls).toBeTruthy();
      } else expect(gameAction(game).label).toBe('View Development');
      expect(resolveStudioRoute(`/games/${game.slug}`).record?.id).toBe(game.id);
      for (const screenshot of game.screenshots || []) {
        expect(fs.existsSync('public' + screenshot.src)).toBe(true);
        expect(screenshot.sourceSha).toMatch(/^[a-f0-9]{40}$/);
      }
    }
    const slime = games.find(g => g.id === 'slime-factory-tycoon')!;
    expect(canPlay(slime)).toBe(false);
    expect(gameAction(slime).label).toBe('View Development');
  });
  it('keeps every verified local launch directly addressable with real files', () => {
    const local = games.filter(localGame);
    expect(local).toHaveLength(8);
    for (const game of local) {
      expect(fs.existsSync('public' + game.playUrl)).toBe(true);
      expect(resolveStudioRoute(gameAction(game).href).page).toBe('play');
    }
  });
  it('retains only a separate labelled third-party archive', () => {
    const archive = JSON.parse(fs.readFileSync('public/legacy-games/records.json', 'utf8'));
    expect(archive.games).toHaveLength(77);
    expect(games.some(g => archive.games.some((a: { id: string }) => a.id === g.id))).toBe(false);
    expect(fs.readFileSync('public/legacy-games/index.html', 'utf8')).toContain(
      'These are not LIN4CRE creations.',
    );
  });
  it('combines genre, platform, status and text search', () => {
    expect(filterGames(games, 'circuit', 'Logic', 'Web browser', 'Live').map(g => g.id)).toEqual([
      'circuit',
    ]);
    expect(filterGames(games, 'circuit', 'RPG', 'Web browser', 'Live')).toEqual([]);
  });
});
describe('Games experience', () => {
  it('renders featured game, genuine filter controls and development section', () => {
    render(<GamesLanding />);
    expect(screen.getByRole('heading', { name: 'Still taking shape.' })).toBeInTheDocument();
    fireEvent.change(screen.getByRole('combobox', { name: 'Genres' }), {
      target: { value: 'Logic' },
    });
    fireEvent.change(screen.getByRole('combobox', { name: 'Platforms' }), {
      target: { value: 'Web browser' },
    });
    fireEvent.change(screen.getByRole('combobox', { name: 'Statuses' }), {
      target: { value: 'Live' },
    });
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Circuit' } });
    expect(screen.getByRole('status')).toHaveTextContent('1 game match');
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'nonexistent-xyz' } });
    expect(screen.getByRole('heading', { name: 'No matches this time.' })).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: 'Clear filters' })[0]);
    expect(screen.getByRole('searchbox')).toHaveValue('');
  });
  it('does not offer Play Now on unpublished cards or details', () => {
    const game = games.find(g => g.id === 'slime-factory-tycoon')!;
    render(<GameCard game={game} />);
    expect(screen.queryByRole('link', { name: 'Play Now' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View Development' })).toHaveAttribute(
      'href',
      '/games/slime-factory-tycoon',
    );
    cleanup();
    render(<GameDetail game={game} />);
    expect(screen.getByRole('link', { name: 'Download Studio template' })).toHaveAttribute(
      'href',
      game.downloadUrl,
    );
    expect(screen.getByText(/No gameplay screenshots available/)).toBeInTheDocument();
  });
  it.each(games.map(g => [g.name, g] as const))(
    'gives %s a complete honest detail page',
    (_name, game) => {
      render(<GameDetail game={game} />);
      expect(screen.getByRole('heading', { level: 1, name: game.name })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'How to play' })).toBeInTheDocument();
      const availability = screen.getByRole('complementary', { name: 'Game availability' });
      expect(within(availability).getByRole('link', { name: 'View source' })).toHaveAttribute(
        'href',
        game.sourceRepository,
      );
      expect(screen.getByRole('heading', { name: 'Development notes' })).toBeInTheDocument();
      if (!canPlay(game))
        expect(
          within(availability).queryByRole('link', { name: 'Play Now' }),
        ).not.toBeInTheDocument();
    },
  );
  it('shows retry and standalone fallback when the game does not load', () => {
    vi.useFakeTimers();
    const game = games.find(g => g.id === 'circuit')!;
    render(<GamePlayer game={game} />);
    expect(screen.getByRole('link', { name: /Exit game/ })).toHaveAttribute(
      'href',
      '/games/circuit',
    );
    act(() => vi.advanceTimersByTime(15001));
    expect(screen.getByRole('alert')).toHaveTextContent('The game couldn’t load.');
    expect(screen.getByRole('link', { name: 'Open standalone game' })).toHaveAttribute(
      'href',
      game.playUrl,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(screen.getByRole('status')).toHaveTextContent('Loading Circuit');
  });
});
