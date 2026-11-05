import { readFileSync } from 'node:fs';
import path from 'node:path';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { OsintPayload } from '../../lib/osintHud';
import OsintHud from '../OsintHud';

const payload = JSON.parse(
  readFileSync(path.resolve(process.cwd(), 'public/data/osint-hud.json'), 'utf8'),
) as OsintPayload;
const originalFetch = globalThis.fetch;

beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState({}, '', '/osint');
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => payload,
    }),
  );
});

afterEach(() => {
  Object.defineProperty(globalThis, 'fetch', {
    configurable: true,
    writable: true,
    value: originalFetch,
  });
});

describe('OSINT HUD route', () => {
  it('loads the local directory with the correct sector and resource counts', async () => {
    render(<OsintHud />);

    expect(await screen.findByRole('heading', { name: 'Priority resources' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '11 research sectors' })).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: 'Filter by sector' }).querySelectorAll('button'),
    ).toHaveLength(12);
    expect(fetch).toHaveBeenCalledWith(
      '/data/osint-hud.json',
      expect.objectContaining({ cache: 'force-cache' }),
    );
  });

  it('searches by tool name, allows local starring, and restores saved tools', async () => {
    const user = userEvent.setup();
    render(<OsintHud />);

    const search = await screen.findByRole('searchbox', {
      name: 'Search all 1,310 OSINT resources',
    });
    await user.type(search, 'shodan');
    const shodan = await screen.findByRole('link', {
      name: 'Open Shodan at shodan.io in a new tab',
    });
    expect(shodan).toHaveAttribute('href', 'https://shodan.io');

    await user.click(screen.getByRole('button', { name: 'Add Shodan to My stars' }));
    const views = screen.getByRole('group', { name: 'Directory views' });
    await user.click(within(views).getByRole('button', { name: /My stars/ }));

    expect(
      await screen.findByRole('link', { name: 'Open Shodan at shodan.io in a new tab' }),
    ).toBeInTheDocument();
    expect(window.localStorage.getItem('linacre_osint_stars_v1')).toContain('https://shodan.io');
  });

  it('opens a sector and lazily expands its category resources', async () => {
    const user = userEvent.setup();
    render(<OsintHud />);
    await screen.findByRole('heading', { name: 'Priority resources' });

    const sectorNav = screen.getByRole('navigation', { name: 'Filter by sector' });
    await user.click(within(sectorNav).getByRole('button', { name: /INFRA & CYBER/ }));
    expect(await screen.findByRole('heading', { name: 'INFRA & CYBER' })).toBeInTheDocument();

    const category = payload.groups.find(group => group.id === 'infra')!.cats[0];
    const categoryToggle = screen.getByRole('button', { name: new RegExp(category.cat) });
    expect(categoryToggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(categoryToggle);
    expect(categoryToggle).toHaveAttribute('aria-expanded', 'true');
    expect(
      screen.getByRole('link', { name: new RegExp(`Open ${category.links[0].t}`) }),
    ).toHaveAttribute('href', category.links[0].u);
  });

  it('restores a shareable search from the URL fragment', async () => {
    window.history.replaceState({}, '', '/osint#q=shodan');
    render(<OsintHud />);

    expect(
      await screen.findByRole('link', { name: 'Open Shodan at shodan.io in a new tab' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Search all 1,310 OSINT resources' })).toHaveValue(
      'shodan',
    );
  });
});
