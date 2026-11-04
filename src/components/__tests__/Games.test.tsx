import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Games from '../Games';

describe('curated games', () => {
  it('links directly to the three self-hosted games', () => {
    render(<Games />);
    expect(screen.getByRole('link', { name: /play circuit/i })).toHaveAttribute('href', '/games/circuit');
    expect(screen.getByRole('link', { name: /play decrypt/i })).toHaveAttribute('href', '/games/decrypt');
    expect(screen.getByRole('link', { name: /play gridlock/i })).toHaveAttribute('href', '/games/gridlock');
  });
});
