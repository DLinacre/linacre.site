import { selectedGames } from '../data/curatedWork';

export default function Games() {
  return (
    <section aria-labelledby="games-page-title">
      <header className="page-hero">
        <p className="eyebrow">
          <span className="eyebrow__dot" aria-hidden="true" />
          LIN4CRE · Original Browser Games
        </p>
        <h1 id="games-page-title" className="page-title">
          Focused browser games, ready in one click.
        </h1>
        <p className="page-lead">
          Four self-contained games designed and coded from scratch—from long-exposure generative
          light photography to spatial logic, deduction, and territory strategy. No accounts, ads,
          or downloads required.
        </p>
      </header>

      <div className="games-editorial-list">
        {selectedGames.map((game, index) => (
          <article key={game.id} className="games-page__item">
            <a
              href={game.playAction.href}
              className="media-frame"
              {...(game.playAction.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              <img
                src={game.image}
                alt={game.imageAlt}
                width={1280}
                height={800}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : undefined}
                decoding="async"
              />
            </a>

            <div>
              <div className="work-meta-bar">
                <span>
                  {game.index} / {game.genre}
                </span>
                <span className="status-line">{game.status}</span>
              </div>
              <h2 className="work-card__title">{game.name}</h2>
              <p className="work-card__summary">{game.summary}</p>

              <dl className="game-specs">
                <div className="game-specs__row">
                  <dt>Modes</dt>
                  <dd>{game.modes}</dd>
                </div>
                <div className="game-specs__row">
                  <dt>Controls</dt>
                  <dd>{game.controls}</dd>
                </div>
                <div className="game-specs__row">
                  <dt>Stack</dt>
                  <dd>{game.stack.join(' · ')}</dd>
                </div>
              </dl>

              <div className="work-card__actions">
                <a
                  href={game.playAction.href}
                  className="btn-primary"
                  {...(game.playAction.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  <span>{game.playAction.label}</span>
                  <span aria-hidden="true">{game.playAction.external ? '↗' : '→'}</span>
                </a>
                <a
                  href={game.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  aria-label={`View source code for ${game.name}`}
                >
                  <span>Source</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
