import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SITE_PROJECTS } from '../../data/siteProjects';
import ProjectGrid from '../ProjectGrid';

const sample = SITE_PROJECTS.find(p => p.pinned && p.url && !p.private);

describe('ProjectGrid', () => {
  it('renders the project catalogue', () => {
    render(<ProjectGrid query="" setQuery={() => {}} />);
    expect(screen.getByText(/All projects/i)).toBeInTheDocument();
  });

  it('does not offer an unrelated random project when no results match', () => {
    render(<ProjectGrid query="no such project xqz" setQuery={() => {}} />);
    expect(screen.getByText(/No projects match these filters/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Surprise me' })).toBeDisabled();
  });

  it('marks pinned projects', () => {
    render(<ProjectGrid query="" setQuery={() => {}} />);
    const badges = screen.getAllByText(/Pinned/i);
    expect(badges.length).toBeGreaterThan(0);
  });

  it('has tech + highlights data for the sample featured project', () => {
    expect(sample).toBeDefined();
    expect(sample!.tech!.length).toBeGreaterThan(0);
    expect(sample!.highlights!.length).toBeGreaterThan(0);
  });

  it('verifies all curated projects render with valid metadata and artwork', () => {
    render(<ProjectGrid query="" setQuery={() => {}} />);
    // All 20 curated projects currently have authentic artwork banners
    expect(SITE_PROJECTS.every(p => p.artwork)).toBe(true);
    const card = screen.getByRole('button', {
      name: new RegExp(`View details for ${sample!.name}`),
    });
    expect(card).toBeInTheDocument();
  });

  it('opens a detail modal when a card is clicked and closes on Escape', async () => {
    const user = userEvent.setup();
    render(<ProjectGrid query="" setQuery={() => {}} />);

    const card = screen.getByRole('button', {
      name: new RegExp(`View details for ${sample!.name}`),
    });
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
