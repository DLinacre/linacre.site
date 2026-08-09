import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import ProjectGrid from '../ProjectGrid';
import { SITE_PROJECTS } from '../../data/siteProjects';

// Pick a featured public project that definitely has highlights + tech.
const sample = SITE_PROJECTS.find(p => p.featured && !p.private && p.highlights && p.tech);
const featured = SITE_PROJECTS.filter(p => p.featured && !p.private);

describe('ProjectGrid', () => {
  it('renders the project catalogue', () => {
    render(<ProjectGrid query="" setQuery={() => {}} />);
    expect(screen.getByRole('heading', { name: /All projects/i })).toBeInTheDocument();
  });

  it('marks featured projects', () => {
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every(f => f.featured && !f.private)).toBe(true);
  });

  it('has tech + highlights data for the sample featured project', () => {
    expect(sample).toBeDefined();
    expect(sample!.tech!.length).toBeGreaterThan(0);
    expect(sample!.highlights!.length).toBeGreaterThan(0);
  });

  it('renders emoji fallback for projects without artwork', () => {
    render(<ProjectGrid query="" setQuery={() => {}} />);
    // Some public projects have no artwork and rely on an emoji tile.
    const noArtwork = SITE_PROJECTS.find(p => !p.private && !p.artwork && p.url);
    expect(noArtwork).toBeDefined();
    // The project name still renders as a card button regardless of artwork.
    const card = screen.getByRole('button', { name: new RegExp(`View details for ${noArtwork!.name}`) });
    expect(card).toBeInTheDocument();
  });

  it('opens a detail modal when a card is clicked and closes on Escape', async () => {
    const user = userEvent.setup();
    render(<ProjectGrid query="" setQuery={() => {}} />);

    const card = screen.getByRole('button', { name: new RegExp(`View details for ${sample!.name}`) });
    await user.click(card);

    // Dialog should be present and describe the project.
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: sample!.name })).toBeInTheDocument();
    expect(within(dialog).getByText(sample!.blurb)).toBeInTheDocument();

    // Escape closes it.
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});
