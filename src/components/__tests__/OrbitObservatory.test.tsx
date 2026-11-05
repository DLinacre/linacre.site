import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import OrbitObservatory from '../OrbitObservatory';

describe('OrbitObservatory', () => {
  it('renders the observatory heading, world map, layer toggles, seismic feed and launches', () => {
    render(<OrbitObservatory />);

    expect(
      screen.getByRole('heading', { name: /Orbit & Earth Observatory/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole('img', { name: /World map showing ISS/i })).toBeInTheDocument();

    const dayNightBtn = screen.getByRole('button', { name: /Day \/ Night/i });
    expect(dayNightBtn).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(dayNightBtn);
    expect(dayNightBtn).toHaveAttribute('aria-pressed', 'false');

    expect(
      screen.getByRole('heading', { name: /Global M4.5\+ Seismic Feed/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Upcoming Orbital Launches/i }),
    ).toBeInTheDocument();
  });
});
