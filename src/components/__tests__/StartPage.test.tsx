// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StartPage from '../StartPage';
import StudioHeader from '../StudioHeader';
import { selectedGames, selectedWork } from '../../data/curatedWork';

describe('StartPage & StudioHeader curated showcase', () => {
  it('renders the studio introduction and all 5 curated Selected Work projects', () => {
    render(<StartPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Focused software, built to do one thing properly/i,
      }),
    ).toBeDefined();

    expect(selectedWork).toHaveLength(5);
    for (const project of selectedWork) {
      expect(screen.getByRole('heading', { level: 3, name: project.name })).toBeDefined();
      expect(screen.getByAltText(project.imageAlt).getAttribute('src')).toBe(project.image);
    }
  });

  it('renders all 4 curated Selected Games and excludes retired or off-brand entries', () => {
    const { container } = render(<StartPage />);

    expect(selectedGames).toHaveLength(4);
    for (const game of selectedGames) {
      expect(screen.getByRole('heading', { level: 3, name: game.name })).toBeDefined();
      expect(screen.getByAltText(game.imageAlt).getAttribute('src')).toBe(game.image);
    }

    const html = container.innerHTML;
    expect(html).not.toContain('Linacre-LLM-Benchmarks');
    expect(html).not.toContain('PokéFlip');
    expect(html).not.toContain('Bonny Bakes');
    expect(html).not.toContain('KushCloud');
    expect(html).not.toContain('77 games');
  });

  it('renders accessible primary and mobile navigation in StudioHeader', () => {
    render(<StudioHeader activeTab="home" />);

    const primaryNav = screen.getByRole('navigation', { name: /Primary navigation/i });
    expect(primaryNav.textContent).toContain('Home');
    expect(primaryNav.textContent).toContain('Selected Work');
    expect(primaryNav.textContent).toContain('Games');
    expect(primaryNav.textContent).toContain('About');
    expect(primaryNav.textContent).toContain('Contact');

    const toggle = screen.getByRole('button', { name: /Open navigation menu/i });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
  });
});
