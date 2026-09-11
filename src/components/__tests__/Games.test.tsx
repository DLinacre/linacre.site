import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Games from '../Games';

describe('Games library', () => {
  it('puts KushCloud first without embedded games or the Tycoon showcase', () => {
    const { container } = render(<Games />);
    const first = screen.getAllByRole('article')[0];
    expect(within(first).getByRole('heading', { name: 'KushCloud' })).toBeInTheDocument();
    expect(within(first).getByRole('link', { name: /Open game: KushCloud/ })).toHaveAttribute('href', 'https://dlinacre.github.io/KushCloud/');
    expect(screen.queryByText('Slime Factory Tycoon')).not.toBeInTheDocument();
    expect(container.querySelector('iframe, canvas, audio')).toBeNull();
  });
});
