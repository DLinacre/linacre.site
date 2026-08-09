import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import FeaturedSpotlight from '../FeaturedSpotlight';
import { SITE_PROJECTS } from '../../data/siteProjects';

describe('FeaturedSpotlight', () => {
  it('renders the featured projects', () => {
    render(<FeaturedSpotlight />);
    const featured = SITE_PROJECTS.filter(p => p.featured && !p.private);
    expect(featured.length).toBeGreaterThan(0);
    for (const f of featured) {
      expect(screen.getAllByText(f.name).length).toBeGreaterThan(0);
    }
  });

  it('links each featured project to its live destination', () => {
    render(<FeaturedSpotlight />);
    const featured = SITE_PROJECTS.filter(p => p.featured && !p.private && p.url);
    for (const f of featured) {
      const link = screen.getByRole('link', { name: new RegExp(f.name) });
      expect(link.getAttribute('href')).toBe(f.url || f.repo);
    }
  });
});
