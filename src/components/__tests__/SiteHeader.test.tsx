import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SiteHeader from '../SiteHeader';

function renderHeader() {
  const props = {
    activeTab: 'home',
    onNavigate: vi.fn(),
    onOpenSearch: vi.fn(),
    soundOn: false,
    onToggleSound: vi.fn(),
    theme: 'dark' as const,
    onThemeChange: vi.fn(),
  };
  return { ...render(<SiteHeader {...props} />), props };
}

describe('SiteHeader', () => {
  it('exposes the main routes and a real search action', async () => {
    const user = userEvent.setup();
    const { props } = renderHeader();

    const navigation = screen.getByRole('navigation', { name: 'Primary navigation' });
    expect(within(navigation).getByRole('link', { name: 'Projects' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(within(navigation).getByRole('link', { name: 'Tools' })).toHaveAttribute(
      'href',
      '/tools',
    );
    const gamesLink = within(navigation).getByRole('link', { name: 'Games' });
    expect(gamesLink).toHaveAttribute('href', '/games');
    expect(gamesLink.querySelector('svg')).toBeInTheDocument();
    const musicLink = within(navigation).getByRole('link', { name: 'Music Videos' });
    expect(musicLink).toHaveAttribute('href', '/music-videos');
    expect(musicLink.querySelector('svg')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Search projects and pages' }));
    expect(props.onOpenSearch).toHaveBeenCalledOnce();
  });

  it('preserves modified clicks for native open-in-new-tab behavior', () => {
    const { props } = renderHeader();
    const navigation = screen.getByRole('navigation', { name: 'Primary navigation' });
    const toolsLink = within(navigation).getByRole('link', { name: 'Tools' });
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true });
    fireEvent(toolsLink, event);
    expect(event.defaultPrevented).toBe(false);
    expect(props.onNavigate).not.toHaveBeenCalled();
  });

  it('opens the More menu and navigates to secondary destinations', async () => {
    const user = userEvent.setup();
    const { props } = renderHeader();

    await user.click(screen.getByText('More'));
    const labLink = screen.getByRole('link', { name: /AI Lab/ });
    expect(labLink).toHaveAttribute('href', '/lab');

    await user.click(labLink);
    expect(props.onNavigate).toHaveBeenCalledWith('lab');

    await user.click(screen.getByText('More'));
    const osintLink = screen.getByRole('link', { name: /OSINT HUD/ });
    expect(osintLink).toHaveAttribute('href', '/osint');
    await user.click(osintLink);
    expect(props.onNavigate).toHaveBeenCalledWith('osint');
  });

  it('opens and dismisses the mobile menu with Escape', async () => {
    const user = userEvent.setup();
    renderHeader();

    const menuToggle = screen.getByRole('button', { name: 'Open navigation menu' });
    await user.click(menuToggle);
    expect(menuToggle).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Open navigation menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByRole('button', { name: 'Open navigation menu' })).toHaveFocus();
  });

  it('keeps sound and theme controls connected to application state', async () => {
    const user = userEvent.setup();
    const { props } = renderHeader();

    await user.click(screen.getByRole('button', { name: 'Enable interface sounds' }));
    await user.click(screen.getByRole('button', { name: 'Switch to light theme' }));

    expect(props.onToggleSound).toHaveBeenCalledOnce();
    expect(props.onThemeChange).toHaveBeenCalledWith('light');
  });
});
