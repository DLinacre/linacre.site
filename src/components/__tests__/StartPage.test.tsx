import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import StartPage from '../StartPage';

function renderStartPage() {
  const props = {
    navigate: vi.fn(),
    query: '',
    setQuery: vi.fn(),
    searchRef: createRef<HTMLInputElement>(),
  };
  return { ...render(<StartPage {...props} />), props };
}

describe('StartPage', () => {
  it('introduces the catalogue and presents the decorative 3D brand object', () => {
    renderStartPage();

    expect(
      screen.getByRole('heading', { level: 1, name: /Independent software,.*made to be useful/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Explore projects/i })).toHaveAttribute(
      'href',
      '#project-library',
    );
    expect(document.querySelector('.hero-art__cube')).toBeInTheDocument();
    expect(document.querySelector('.hero-art__astrolabe')).toBeInTheDocument();
    expect(document.querySelector('.hero-art')).toHaveAttribute('aria-hidden', 'true');
    expect(
      screen.getByRole('heading', { name: /Built-in Studios, Hubs & Live Observatories/i }),
    ).toBeInTheDocument();
  });

  it('passes project searches through to the shared catalogue filter', () => {
    const { props } = renderStartPage();
    const search = screen.getByRole('searchbox', { name: 'Find a project' });

    fireEvent.change(search, { target: { value: 'Android' } });
    expect(props.setQuery).toHaveBeenCalledWith('Android');
  });

  it('routes visitors to the browser tools from the hero', async () => {
    const user = userEvent.setup();
    const { props } = renderStartPage();

    await user.click(screen.getByRole('button', { name: /Browser tools/i }));
    expect(props.navigate).toHaveBeenCalledWith('tools');
  });
});
