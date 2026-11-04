import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import StartPage from '../StartPage';

describe('curated home', () => {
  it('presents selected work and original games with real links', () => {
    render(<StartPage />);
    expect(screen.getByRole('heading', { level: 1, name: /made with purpose/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /selected work/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open the tools/i })).toHaveAttribute('href', '/tools');
    expect(screen.getByRole('link', { name: /meet the games/i })).toHaveAttribute('href', '/games');
  });
});
