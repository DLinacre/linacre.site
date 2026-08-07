import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import GameShowcase from '../GameShowcase';
import manifest from '../../data/slime-factory-tycoon.json';

/**
 * These tests encode the project's honesty guarantees as executable
 * contracts. If someone later adds a fake screenshot or an invented player
 * count, the suite fails — the rule stops being a convention and becomes
 * something CI enforces.
 */
describe('GameShowcase', () => {
  it('renders the game identity from the manifest', () => {
    render(<GameShowcase />);
    expect(screen.getByRole('heading', { name: manifest.name })).toBeInTheDocument();
    expect(screen.getByText(manifest.tagline)).toBeInTheDocument();
  });

  it('never invents player, visit or rating figures', () => {
    render(<GameShowcase />);
    // The manifest deliberately holds null for all three.
    expect(manifest.stats.players).toBeNull();
    expect(manifest.stats.visits).toBeNull();
    expect(manifest.stats.rating).toBeNull();
    const body = document.body.textContent ?? '';
    // A fabricated metric would read like "1,234 players" or "4.8 rating".
    expect(body).not.toMatch(/[\d,.]+\s*(players|visits|downloads|installs)\b/i);
    expect(body).not.toMatch(/\b\d(\.\d)?\s*(\/\s*5|stars?|rating)\b/i);
  });

  it('shows an honest empty state when there are no screenshots', () => {
    render(<GameShowcase />);
    if (manifest.screenshots.length === 0) {
      expect(screen.getByText(/Screenshots — Coming Soon/i)).toBeInTheDocument();
    }
  });

  it('disables Play until the game is actually published', () => {
    render(<GameShowcase />);
    // The disabled state only applies when there is no Roblox link AND no
    // web play link. Once either exists, a live Play CTA renders instead.
    if (!manifest.links.roblox && !manifest.links.play) {
      const cta = screen.getByTitle(/has not been published/i);
      expect(cta).toHaveAttribute('aria-disabled', 'true');
      expect(cta).toHaveTextContent(/Not Yet Available/i);
    } else {
      // Published somewhere: a real Play link must be present.
      expect(screen.getByRole('link', { name: /Play/i })).toHaveAttribute(
        'href',
        manifest.links.roblox || manifest.links.play,
      );
    }
  });

  it('offers a working download when a release exists', () => {
    render(<GameShowcase />);
    if (manifest.links.release) {
      const link = screen.getByRole('link', { name: /Download v/i });
      expect(link).toHaveAttribute('href', manifest.links.release);
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    }
  });

  it('exposes an accessible tablist with correct ARIA wiring', () => {
    render(<GameShowcase />);
    const tablist = screen.getByRole('tablist', { name: /project details/i });
    const tabs = within(tablist).getAllByRole('tab');
    expect(tabs).toHaveLength(4);

    const selected = tabs.filter(t => t.getAttribute('aria-selected') === 'true');
    expect(selected).toHaveLength(1);

    // Roving tabindex: exactly one tab is reachable via Tab.
    expect(tabs.filter(t => t.getAttribute('tabindex') === '0')).toHaveLength(1);

    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('aria-labelledby', selected[0]!.id);
  });

  it('moves between tabs with arrow keys', async () => {
    const user = userEvent.setup();
    render(<GameShowcase />);
    const tabs = within(screen.getByRole('tablist')).getAllByRole('tab');

    tabs[0]!.focus();
    await user.keyboard('{ArrowRight}');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{ArrowLeft}');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

    // Wraps backwards from the first tab to the last.
    await user.keyboard('{ArrowLeft}');
    expect(tabs[tabs.length - 1]).toHaveAttribute('aria-selected', 'true');
  });

  it('switches panel content when a tab is clicked', async () => {
    const user = userEvent.setup();
    render(<GameShowcase />);
    await user.click(screen.getByRole('tab', { name: 'Changelog' }));
    await waitFor(() => {
      expect(screen.getByRole('tabpanel').textContent).toContain(manifest.changelog[0]!.version);
    });
    expect(screen.getByRole('tabpanel').textContent).toContain(manifest.changelog[0]!.title);
  });

  it('emits valid structured data with no fabricated fields', () => {
    const { container } = render(<GameShowcase />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();

    const parsed = JSON.parse(script!.textContent!);
    const types = parsed['@graph'].map((n: { '@type': string }) => n['@type']);
    expect(types).toContain('SoftwareSourceCode');
    expect(types).toContain('BreadcrumbList');

    // Ratings and offers would be fabricated for an unpublished game.
    expect(JSON.stringify(parsed)).not.toMatch(/aggregateRating|ratingValue|offers/i);
  });

  it('gives the LCP banner explicit dimensions and eager loading', () => {
    const { container } = render(<GameShowcase />);
    const banner = container.querySelector('img[alt*="Slime Factory Tycoon"]');
    expect(banner).toHaveAttribute('width');
    expect(banner).toHaveAttribute('height');
    expect(banner).toHaveAttribute('loading', 'eager');
  });
});
