// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Games from '../Games';
import { selectedGames } from '../../data/curatedWork';

describe('Games curated showcase', () => {
  it('renders all four original browser games with gameplay screenshots, specs, and play links', () => {
    render(<Games />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Focused browser games, ready in one click/i,
      }),
    ).toBeDefined();

    expect(selectedGames).toHaveLength(4);
    for (const game of selectedGames) {
      expect(screen.getByRole('heading', { level: 2, name: game.name })).toBeDefined();
      expect(screen.getByAltText(game.imageAlt).getAttribute('src')).toBe(game.image);
      const playLink = screen.getByRole('link', { name: new RegExp(game.playAction.label, 'i') });
      expect(playLink.getAttribute('href')).toBe(game.playAction.href);
    }
  });
});
