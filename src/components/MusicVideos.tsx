import {
  ArrowUpRight,
  AudioLines,
  Captions,
  Check,
  Clapperboard,
  Copy,
  ExternalLink,
  Play,
  Radio,
  Shuffle,
  SkipBack,
  SkipForward,
  Video,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  DEFAULT_MUSIC_VIDEO_TRACK,
  MUSIC_VIDEO_PLAYER_URL,
  MUSIC_VIDEO_TRACKS,
  type MusicVideoTrack,
} from '../data/musicVideos';

type GenreFilter = 'all' | 'rap' | 'folk' | 'comedy';

function matchesGenreFilter(track: MusicVideoTrack, filter: GenreFilter): boolean {
  if (filter === 'all') return true;
  const g = track.genre.toLowerCase();
  if (filter === 'rap') return g.includes('rap') || g.includes('grime') || g.includes('boom-bap');
  if (filter === 'folk') return g.includes('folk') || g.includes('acoustic') || g.includes('indie');
  if (filter === 'comedy') return g.includes('comedy') || g.includes('pub') || g.includes('garage');
  return true;
}

function trackFromHash(): string {
  if (typeof window === 'undefined') return DEFAULT_MUSIC_VIDEO_TRACK;
  let hash = window.location.hash.replace(/^#/, '').trim();
  try {
    hash = decodeURIComponent(hash);
  } catch {
    // An invalid percent escape should simply fall back to the first track.
  }
  return MUSIC_VIDEO_TRACKS.some(track => track.id === hash) ? hash : DEFAULT_MUSIC_VIDEO_TRACK;
}

function directPlayerUrl(trackId: string): string {
  return `${MUSIC_VIDEO_PLAYER_URL}#${trackId}`;
}

export default function MusicVideos() {
  const [activeTrackId, setActiveTrackId] = useState(trackFromHash);
  const [frameVersion, setFrameVersion] = useState(0);
  const [genreFilter, setGenreFilter] = useState<GenreFilter>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const currentTrackRef = useRef(activeTrackId);
  const playerRef = useRef<HTMLElement>(null);

  const activeIndex = Math.max(
    0,
    MUSIC_VIDEO_TRACKS.findIndex(track => track.id === activeTrackId),
  );
  const activeTrack = MUSIC_VIDEO_TRACKS[activeIndex] ?? MUSIC_VIDEO_TRACKS[0];
  const visibleTracks = MUSIC_VIDEO_TRACKS.filter(t => matchesGenreFilter(t, genreFilter));

  useEffect(() => {
    const restoreTrack = () => {
      const nextTrackId = trackFromHash();
      if (nextTrackId === currentTrackRef.current) return;
      currentTrackRef.current = nextTrackId;
      setActiveTrackId(nextTrackId);
      setFrameVersion(version => version + 1);
    };
    window.addEventListener('popstate', restoreTrack);
    window.addEventListener('hashchange', restoreTrack);
    return () => {
      window.removeEventListener('popstate', restoreTrack);
      window.removeEventListener('hashchange', restoreTrack);
    };
  }, []);

  const selectTrack = (trackId: string) => {
    if (!MUSIC_VIDEO_TRACKS.some(track => track.id === trackId)) return;
    const target = `${window.location.pathname}${window.location.search}#${trackId}`;
    window.history.pushState({ musicTrack: trackId }, '', target);
    currentTrackRef.current = trackId;
    setActiveTrackId(trackId);
    setFrameVersion(version => version + 1);
    const scrollPlayer = () => {
      const player = playerRef.current;
      if (player && typeof player.scrollIntoView === 'function') {
        player.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    if (typeof window.requestAnimationFrame === 'function')
      window.requestAnimationFrame(scrollPlayer);
    else scrollPlayer();
  };

  const stepTrack = (delta: number) => {
    const nextIndex = (activeIndex + delta + MUSIC_VIDEO_TRACKS.length) % MUSIC_VIDEO_TRACKS.length;
    selectTrack(MUSIC_VIDEO_TRACKS[nextIndex].id);
  };

  const shuffleTrack = () => {
    if (MUSIC_VIDEO_TRACKS.length <= 1) return;
    let nextIndex = activeIndex;
    while (nextIndex === activeIndex) {
      nextIndex = Math.floor(Math.random() * MUSIC_VIDEO_TRACKS.length);
    }
    selectTrack(MUSIC_VIDEO_TRACKS[nextIndex].id);
  };

  const copyShareUrl = async () => {
    try {
      const shareUrl = `${window.location.origin}/music-videos#${activeTrack.id}`;
      await navigator.clipboard?.writeText(shareUrl);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Clipboard API unavailable
    }
  };

  return (
    <section className="music-videos-page" aria-labelledby="music-videos-title">
      <header className="music-videos-hero">
        <div className="music-videos-hero__copy">
          <p className="music-videos-eyebrow">
            <Clapperboard aria-hidden="true" /> LINACRE <span aria-hidden="true">//</span> PROPER
            MAD COLLECTION
          </p>
          <h1 id="music-videos-title">Music Videos</h1>
          <p className="music-videos-hero__lead">
            The official Proper Mad cinema: ten original lyric-video masters, with the original
            interactive lyrics, artwork and playback controls intact.
          </p>
          <div className="music-videos-stats" aria-label="Player features">
            <span>
              <Video aria-hidden="true" /> 10 master videos
            </span>
            <span>
              <Captions aria-hidden="true" /> Timed lyrics
            </span>
            <span>
              <AudioLines aria-hidden="true" /> Studio EQ profiles
            </span>
          </div>
          <div className="music-videos-hero__actions">
            <a
              href={directPlayerUrl(activeTrack.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="music-videos-open-link"
            >
              <Play aria-hidden="true" /> Open full cinema <ArrowUpRight aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={shuffleTrack}
              className="music-videos-source-link cursor-pointer"
            >
              <Shuffle aria-hidden="true" /> Surprise track
            </button>
            <a
              href="https://github.com/LIN4CRE/linacre-music-videos"
              target="_blank"
              rel="noopener noreferrer"
              className="music-videos-source-link"
            >
              Project source <ExternalLink aria-hidden="true" />
            </a>
          </div>
        </div>

        <figure className="music-videos-featured-art">
          <img
            src={activeTrack.cover}
            alt={`Cover artwork for ${activeTrack.title}`}
            fetchPriority="high"
          />
          <figcaption>
            <span>
              <Radio aria-hidden="true" /> NOW SELECTED · TRACK{' '}
              {String(activeIndex + 1).padStart(2, '0')}/10
            </span>
            <strong>{activeTrack.title}</strong>
            <small>
              {activeTrack.genre.split('/')[0].trim()} · {activeTrack.bpm} · {activeTrack.duration}
            </small>
          </figcaption>
        </figure>
      </header>

      <section className="music-videos-track-section" aria-labelledby="music-track-list-title">
        <div className="music-videos-section-heading">
          <div>
            <p className="music-videos-section-kicker">THE MASTER COLLECTION</p>
            <h2 id="music-track-list-title">Choose a track</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                ['all', `All (${MUSIC_VIDEO_TRACKS.length})`],
                ['rap', 'Rap & Grime'],
                ['folk', 'Folk & Acoustic'],
                ['comedy', 'Comedy & Northern'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={genreFilter === id}
                onClick={() => setGenreFilter(id)}
                className={`rounded-full border px-3 py-1 font-mono text-xs transition cursor-pointer ${
                  genreFilter === id
                    ? 'border-[#8fd6ff]/50 bg-[#8fd6ff]/15 text-white'
                    : 'border-white/10 bg-white/[0.03] text-[#9aa3b2] hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <nav className="music-videos-track-rail" aria-label="Choose a music video">
          {visibleTracks.map(track => {
            const index = MUSIC_VIDEO_TRACKS.findIndex(item => item.id === track.id);
            return (
              <a
                key={track.id}
                href={`/music-videos#${track.id}`}
                className={`music-videos-track${activeTrack.id === track.id ? ' is-active' : ''}`}
                aria-current={activeTrack.id === track.id ? 'true' : undefined}
                onClick={event => {
                  if (
                    event.button !== 0 ||
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey
                  )
                    return;
                  event.preventDefault();
                  selectTrack(track.id);
                }}
              >
                <span className="music-videos-track__art">
                  <img src={track.cover} alt="" loading="lazy" decoding="async" />
                  <span className="music-videos-track__play" aria-hidden="true">
                    <Play />
                  </span>
                </span>
                <span className="music-videos-track__meta">
                  <span className="music-videos-track__number">
                    {String(index + 1).padStart(2, '0')} / {track.duration}
                  </span>
                  <strong>{track.title}</strong>
                  <small>
                    {track.bpm} · {track.genre.split('/')[0].trim()}
                  </small>
                </span>
              </a>
            );
          })}
        </nav>
        <p className="music-videos-track-hint">
          Selecting a track updates this page’s deep link and loads it in the original player below.
        </p>
      </section>

      <section
        className="music-videos-player-section"
        aria-labelledby="music-player-title"
        ref={playerRef}
      >
        <div className="music-videos-section-heading music-videos-player-heading">
          <div>
            <p className="music-videos-section-kicker">
              OFFICIAL CINEMA PLAYER · TRACK {String(activeIndex + 1).padStart(2, '0')} OF{' '}
              {MUSIC_VIDEO_TRACKS.length}
            </p>
            <h2 id="music-player-title">{activeTrack.title}</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => stepTrack(-1)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white hover:border-[#8fd6ff]/40 transition cursor-pointer"
              aria-label="Prev, previous music video"
            >
              <SkipBack className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Prev</span>
            </button>
            <button
              type="button"
              onClick={() => stepTrack(1)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white hover:border-[#8fd6ff]/40 transition cursor-pointer"
              aria-label="Next music video"
            >
              <span>Next</span>
              <SkipForward className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={copyShareUrl}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-[#9aa3b2] hover:text-white transition cursor-pointer"
              aria-label={copiedLink ? 'Copied link to this track' : 'Copy link to this track'}
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                  <span className="text-emerald-300">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Copy link</span>
                </>
              )}
            </button>
            <a
              href={directPlayerUrl(activeTrack.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="music-videos-open-link music-videos-open-link--compact"
            >
              Open in new tab <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="music-videos-frame-shell">
          <iframe
            key={`${activeTrack.id}-${frameVersion}`}
            title={`Official Linacre music video player — ${activeTrack.title}`}
            src={directPlayerUrl(activeTrack.id)}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="autoplay; clipboard-write; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="music-videos-player-note">
          <p>
            The original player is hosted by GitHub Pages and streams the master media from its
            source project. Its synchronized lyrics, playlist search, shuffle/repeat, playback
            speed, theater mode, keyboard shortcuts, MediaSession controls and Web Audio profiles
            remain part of the experience.
          </p>
          <p>
            If your browser blocks a cross-site embedded player or its storage,{' '}
            <a href={directPlayerUrl(activeTrack.id)} target="_blank" rel="noopener noreferrer">
              open the cinema directly <ArrowUpRight aria-hidden="true" />
            </a>
            . The original player stores playback preferences on its own origin; linacre.site cannot
            read that storage.
          </p>
        </div>
      </section>

      <p className="music-videos-credit">
        Original project by Linacre · 1080p video masters and artwork remain in the{' '}
        <a
          href="https://github.com/LIN4CRE/linacre-music-videos"
          target="_blank"
          rel="noopener noreferrer"
        >
          official music-videos repository <ExternalLink aria-hidden="true" />
        </a>
        .
      </p>
    </section>
  );
}
