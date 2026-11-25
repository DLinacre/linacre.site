import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Maximize, Minimize, Play, RefreshCw } from 'lucide-react';
import { games, contentStatusLabel, type GameContent } from '../content';
import {
  ActionLink,
  Artwork,
  Breadcrumbs,
  EmptyState,
  PageHeader,
  SearchField,
  StatusBadge,
} from './components';
import { canPlay, filterGames, gameAction, localGame } from './gameLibrary';

export function GameCard({ game }: { game: GameContent }) {
  const action = gameAction(game);
  return (
    <article className="st-card gx-card">
      <a href={`/games/${game.slug}`} className="gx-cover-link" aria-label={`Explore ${game.name}`}>
        <Artwork record={game} />
      </a>
      <div className="st-card-body">
        <div className="st-card-meta">
          <span>{game.genre?.join(' / ') || 'Genre not recorded'}</span>
          <StatusBadge record={game} />
        </div>
        <h3>
          <a href={`/games/${game.slug}`}>{game.name}</a>
        </h3>
        <p>{game.shortDescription}</p>
        <div className="gx-card-bottom">
          <span>{game.platforms?.join(' · ') || 'Devices not verified'}</span>
          <a className="gx-action" href={action.href}>
            {action.label}
            {canPlay(game) ? (
              <Play size={13} aria-hidden="true" />
            ) : (
              <ArrowUpRight size={15} aria-hidden="true" />
            )}
          </a>
        </div>
      </div>
    </article>
  );
}
function SelectFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="gx-select">
      <span>{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)}>
        <option value="All">All {label.toLowerCase()}</option>
        {options.map(o => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
export function GamesLanding() {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('All');
  const [platform, setPlatform] = useState('All');
  const [status, setStatus] = useState('All');
  const filtered = filterGames(games, query, genre, platform, status);
  const playable = filtered.filter(canPlay);
  const development = filtered.filter(g => !canPlay(g));
  const featured = games.find(g => g.id === 'afterglow')!;
  const reset = () => {
    setQuery('');
    setGenre('All');
    setPlatform('All');
    setStatus('All');
  };
  return (
    <main id="main" className="st-container gx-landing">
      <PageHeader eyebrow="LIN4CRE / Original games" title="Take a different turn.">
        <p>
          Small puzzles. Bright ideas. Worlds still taking shape. Original games made by an
          independent studio, with room to experiment.
        </p>
      </PageHeader>
      <section className="gx-featured" aria-labelledby="featured-game">
        <Artwork record={featured} eager />
        <div className="gx-featured-copy">
          <p className="st-eyebrow">In the spotlight / Light-painting</p>
          <h2 id="featured-game">AFTERGLOW</h2>
          <p>
            Turn a trail of light into something worth keeping. Paint, experiment and develop your
            own little piece of the night.
          </p>
          <StatusBadge record={featured} />
          <div className="st-inline-actions">
            <ActionLink href={gameAction(featured).href} primary>
              {gameAction(featured).label}
            </ActionLink>
            <a className="st-text-link" href="/games/afterglow">
              Explore the game <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
      <section className="gx-library" aria-labelledby="collection-heading">
        <div className="st-section-heading">
          <div>
            <p className="st-eyebrow">Choose your next distraction</p>
            <h2 id="collection-heading">The original collection.</h2>
          </div>
          <p className="gx-caption">No portals. No random third-party games.</p>
        </div>
        <div className="gx-controls">
          <SearchField value={query} onChange={setQuery} />
          <div className="gx-selects">
            <SelectFilter
              label="Genres"
              value={genre}
              onChange={setGenre}
              options={[...new Set(games.flatMap(g => g.genre || []))].sort()}
            />
            <SelectFilter
              label="Platforms"
              value={platform}
              onChange={setPlatform}
              options={[...new Set(games.flatMap(g => g.platforms || []))].sort()}
            />
            <SelectFilter
              label="Statuses"
              value={status}
              onChange={setStatus}
              options={[...new Set(games.map(contentStatusLabel))]}
            />
          </div>
        </div>
        <div className="gx-count">
          <p role="status">
            {filtered.length} {filtered.length === 1 ? 'game' : 'games'} match
          </p>
          {(query || genre !== 'All' || platform !== 'All' || status !== 'All') && (
            <button onClick={reset}>Clear filters</button>
          )}
        </div>
        {!filtered.length ? (
          <EmptyState reset={reset} />
        ) : (
          <>
            <h3 className="gx-group-title">
              Ready to play <span>Browser builds tested locally</span>
            </h3>
            {playable.length ? (
              <div className="st-grid gx-game-grid">
                {playable.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <p className="gx-caption">No verified playable builds match these filters.</p>
            )}
            <section className="gx-development" aria-labelledby="development-heading">
              <p className="st-eyebrow">On the workbench</p>
              <h2 id="development-heading">Still taking shape.</h2>
              <p className="st-lead">
                Real development, not pretend releases. Explore source, prototypes and builds
                awaiting verification.
              </p>
              {development.length ? (
                <div className="st-grid gx-game-grid">
                  {development.map(game => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              ) : (
                <p className="gx-caption">No development entries match these filters.</p>
              )}
            </section>
          </>
        )}
      </section>
      <aside className="gx-archive-note">
        <h2>Looking for the old game directory?</h2>
        <p>
          The historic 77-game third-party directory is preserved separately. Those games are not
          LIN4CRE creations.
        </p>
        <a className="st-text-link" href="/legacy-games">
          View the legacy archive <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </aside>
    </main>
  );
}
export function GameDetail({ game }: { game: GameContent }) {
  const action = gameAction(game);
  const related = games
    .filter(g => g.id !== game.id && g.genre?.some(genre => game.genre?.includes(genre)))
    .slice(0, 3);
  return (
    <main id="main" className="st-container st-detail gx-detail">
      <Breadcrumbs section="games" name={game.name} />
      <div className="st-detail-heading">
        <PageHeader eyebrow={game.genre?.join(' / ') || 'Game / Development'} title={game.name}>
          <p>{game.shortDescription}</p>
        </PageHeader>
        <StatusBadge record={game} />
      </div>
      <div className="gx-detail-art">
        <Artwork record={game} eager />
        <span>Cover artwork · gameplay captures below</span>
      </div>
      <div className="st-detail-layout">
        <div>
          <section>
            <p className="st-eyebrow">The experience</p>
            <h2>Inside {game.name}</h2>
            <p>{game.fullDescription || game.shortDescription}</p>
            {game.features?.length && (
              <ul className="st-feature-list">
                {game.features.map(f => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h2>Gameplay, not a mock-up.</h2>
            {game.screenshots?.length ? (
              <div className="gx-screenshots">
                {game.screenshots.map(s => (
                  <figure key={s.src}>
                    <a href={s.src} aria-label={`Open full-size screenshot: ${s.alt}`}>
                      <img src={s.src} alt={s.alt} loading="lazy" />
                    </a>
                    <figcaption>
                      {s.alt}
                      {s.capturedAt && ` · Captured ${s.capturedAt}`}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <p>No gameplay screenshots available. We don’t substitute cover art for evidence.</p>
            )}
          </section>
          <section>
            <h2>How to play</h2>
            <p>
              {game.controls || 'Controls have not been independently verified for this build.'}
            </p>
            {game.modes && <p>{game.modes}</p>}
            <p className="gx-caption">
              {game.inputMethods?.join(' · ') || 'Input support not verified'}
            </p>
          </section>
          <section>
            <h2>Development notes</h2>
            <p>
              {game.statusNote ||
                'Publication and current development status have not been independently verified.'}
            </p>
            {game.development?.systems && (
              <ul>
                {game.development.systems.map(s => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            )}
            {game.development?.changelog?.length ? (
              game.development.changelog.map(c => (
                <div key={c.version}>
                  <h3>
                    {c.version} · {c.title}
                  </h3>
                  <p>{c.date}</p>
                  <ul>
                    {c.changes.map(change => (
                      <li key={change}>{change}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="gx-caption">No published changelog recorded.</p>
            )}
            {game.development?.roadmap?.length && (
              <>
                <h3>Roadmap</h3>
                <ul>
                  {game.development.roadmap.map(r => (
                    <li key={r.item}>
                      {r.item} — {r.status}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </div>
        <aside className="st-facts" aria-label="Game availability">
          <p className="st-eyebrow">{canPlay(game) ? 'Your next move' : 'From the workbench'}</p>
          <div className="st-actions">
            {action.label !== 'View Development' && (
              <ActionLink href={action.href} primary>
                {action.label}
              </ActionLink>
            )}
            {game.downloadUrl && action.label !== 'Download' && (
              <ActionLink href={game.downloadUrl}>
                {game.relationship === 'template'
                  ? 'Download Studio template'
                  : 'Recorded downloads'}
              </ActionLink>
            )}
            {game.sourceRepository && (
              <ActionLink href={game.sourceRepository}>View source</ActionLink>
            )}
            {game.documentation && <ActionLink href={game.documentation}>Documentation</ActionLink>}
            {!canPlay(game) && game.playUrl && (
              <ActionLink href={game.playUrl}>Recorded site · unverified</ActionLink>
            )}
          </div>
          {game.relationship === 'template' && (
            <p>Roblox Studio template, not a published Roblox experience.</p>
          )}
          <dl>
            <dt>Status</dt>
            <dd>{contentStatusLabel(game)}</dd>
            <dt>Genre</dt>
            <dd>{game.genre?.join(', ') || 'Not recorded'}</dd>
            <dt>Devices / platform</dt>
            <dd>{game.platforms?.join(', ') || 'Not verified'}</dd>
            <dt>Input</dt>
            <dd>{game.inputMethods?.join(', ') || 'Not verified'}</dd>
            <dt>Technology</dt>
            <dd>{game.technologyStack?.join(' · ') || 'Not recorded'}</dd>
            <dt>Last checked</dt>
            <dd>{game.lastVerifiedDate || 'Not verified'}</dd>
          </dl>
          <p className="st-verification">
            {game.verification?.scope || 'No functional test recorded.'}
          </p>
        </aside>
      </div>
      {!!related.length && (
        <section className="gx-related">
          <div className="st-section-heading">
            <h2>Another way to play.</h2>
            <a className="st-text-link" href="/games">
              All games
            </a>
          </div>
          <div className="st-grid">
            {related.map(g => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
export function GamePlayer({ game }: { game: GameContent }) {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [retry, setRetry] = useState(0);
  const [full, setFull] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const timer = window.setTimeout(() => setState(s => (s === 'loading' ? 'error' : s)), 15000);
    return () => clearTimeout(timer);
  }, [retry]);
  useEffect(() => {
    const change = () => setFull(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', change);
    return () => document.removeEventListener('fullscreenchange', change);
  }, []);
  const fullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (root.current?.requestFullscreen) await root.current.requestFullscreen();
      else
        setMessage(
          'Fullscreen is not supported by this browser. The game still fills the available screen.',
        );
    } catch {
      setMessage('Fullscreen was not allowed. You can still play in this window.');
    }
  };
  if (!localGame(game))
    return (
      <main id="main" className="st-container st-empty">
        <h1>This build isn’t available to launch here.</h1>
        <ActionLink href={`/games/${game.slug}`}>Back to the game</ActionLink>
      </main>
    );
  return (
    <main id="main" ref={root} className="gx-player">
      <h1 className="st-sr-only">Play {game.name}</h1>
      <header className="gx-player-bar">
        <a href={`/games/${game.slug}`}>
          <ArrowLeft size={16} aria-hidden="true" />
          Exit game<span className="gx-player-title"> / {game.name}</span>
        </a>
        <button onClick={fullscreen}>
          {full ? (
            <Minimize size={16} aria-hidden="true" />
          ) : (
            <Maximize size={16} aria-hidden="true" />
          )}
          {full ? 'Exit fullscreen' : 'Fullscreen'}
        </button>
      </header>
      {message && (
        <p className="gx-player-message" role="status">
          {message}
        </p>
      )}
      <div className="gx-game-area">
        {state !== 'ready' && (
          <div className="gx-player-overlay" role={state === 'error' ? 'alert' : 'status'}>
            <h2>{state === 'loading' ? `Loading ${game.name}…` : 'The game couldn’t load.'}</h2>
            {state === 'error' && (
              <>
                <p>Try again, or open the standalone build.</p>
                <button
                  className="st-button"
                  onClick={() => {
                    setState('loading');
                    setRetry(retry + 1);
                  }}
                >
                  <RefreshCw size={16} aria-hidden="true" />
                  Retry
                </button>
                <a className="st-text-link" href={game.playUrl}>
                  Open standalone game
                </a>
              </>
            )}
          </div>
        )}
        <iframe
          key={retry}
          ref={frame}
          title={`${game.name} game`}
          src={game.playUrl}
          allow="fullscreen"
          allowFullScreen
          onError={() => setState('error')}
          onLoad={() => {
            const doc = frame.current?.contentDocument;
            const ready =
              !!doc?.querySelector(
                '#board .tile, #board .cell, #board .hit, #board .edge, #pads .pad, #rows .row, #side0, #paint',
              ) && !doc?.title.toLowerCase().includes('not found');
            setState(ready ? 'ready' : 'error');
            // A deliberately launched game receives keyboard input immediately.
            if (ready) frame.current?.contentWindow?.focus();
          }}
        />
      </div>
    </main>
  );
}
