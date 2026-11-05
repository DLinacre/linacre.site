import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import MusicVideos from '../MusicVideos';

beforeEach(() => {
  window.history.replaceState({}, '', '/music-videos');
});

describe('Music Videos route', () => {
  it('presents the original collection and a direct-open fallback', () => {
    render(<MusicVideos />);

    expect(screen.getByRole('heading', { name: 'Music Videos' })).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: 'Choose a music video' }).querySelectorAll('a'),
    ).toHaveLength(10);
    expect(screen.getByRole('link', { name: /Open full cinema/ })).toHaveAttribute(
      'href',
      'https://lin4cre.github.io/linacre-music-videos/#the-road-beyond',
    );
    expect(screen.getByTitle(/Official Linacre music video player/)).toHaveAttribute(
      'src',
      'https://lin4cre.github.io/linacre-music-videos/#the-road-beyond',
    );
  });

  it('restores a track from a direct deep link on refresh', () => {
    window.history.replaceState({}, '', '/music-videos#penny');
    render(<MusicVideos />);

    expect(screen.getByRole('heading', { name: "Penny, You're Still Here" })).toBeInTheDocument();
    expect(screen.getByTitle(/Official Linacre music video player/)).toHaveAttribute(
      'src',
      'https://lin4cre.github.io/linacre-music-videos/#penny',
    );
  });

  it('updates the route hash and embedded player when a track is selected', async () => {
    const user = userEvent.setup();
    render(<MusicVideos />);

    const trackList = screen.getByRole('navigation', { name: 'Choose a music video' });
    await user.click(within(trackList).getByRole('link', { name: /Penny, You're Still Here/ }));

    expect(window.location.pathname).toBe('/music-videos');
    expect(window.location.hash).toBe('#penny');
    expect(screen.getByTitle(/Official Linacre music video player/)).toHaveAttribute(
      'src',
      'https://lin4cre.github.io/linacre-music-videos/#penny',
    );
  });

  it('responds to browser history changes without losing the track deep link', () => {
    render(<MusicVideos />);
    act(() => {
      window.history.pushState({}, '', '/music-videos#barnsley-town');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(screen.getByRole('heading', { name: 'Barnsley Town' })).toBeInTheDocument();
    expect(screen.getByTitle(/Official Linacre music video player/)).toHaveAttribute(
      'src',
      'https://lin4cre.github.io/linacre-music-videos/#barnsley-town',
    );
  });
});
