import { selectedGames, selectedWork, type SelectedProject } from '../data/curatedWork';

function ProjectActions({ project }: { project: SelectedProject }) {
  const { primaryAction, secondaryAction, sourceUrl } = project;
  return (
    <div className="work-card__actions">
      <a
        href={primaryAction.href}
        className="btn-primary"
        {...(primaryAction.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        <span>{primaryAction.label}</span>
        <span aria-hidden="true">{primaryAction.external ? '↗' : '→'}</span>
      </a>
      {secondaryAction && (
        <a
          href={secondaryAction.href}
          className="btn-secondary"
          {...(secondaryAction.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          <span>{secondaryAction.label}</span>
          <span aria-hidden="true">{secondaryAction.external ? '↗' : '→'}</span>
        </a>
      )}
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="link-inline"
        aria-label={`View source code for ${project.name} on GitHub`}
      >
        <span>Source</span>
        <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}

export default function StartPage() {
  const [leadProject, ...gridProjects] = selectedWork;

  return (
    <div className="studio-home">
      {/* 1. Studio Introduction */}
      <section className="hero-section" aria-labelledby="studio-hero-heading">
        <div className="studio-container hero-grid">
          <div>
            <p className="eyebrow">
              <span className="eyebrow__dot" aria-hidden="true" />
              Independent Software Studio · Barnsley, South Yorkshire
            </p>
            <h1 id="studio-hero-heading" className="hero-title">
              Focused software, built to do one thing properly.
            </h1>
            <p className="hero-lead">
              LIN4CRE is the independent software practice of David Linacre—designing and shipping
              native Windows audio utilities, interactive 3D and simulation interfaces, and
              self-contained browser games. Open source, local-first, and free of accounts or
              tracking.
            </p>
            <div className="hero-actions">
              <a href="#work" className="btn-primary">
                <span>Explore selected work</span>
                <span aria-hidden="true">↓</span>
              </a>
              <a href="/games" className="btn-secondary">
                <span>Browse games</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <dl className="hero-ledger" aria-label="Studio focus areas">
            <div className="hero-ledger__row">
              <dt>Systems &amp; Audio DSP</dt>
              <dd>Native Windows WASAPI audio routing, phase-locked drift control and dialogue EQ.</dd>
            </div>
            <div className="hero-ledger__row">
              <dt>Interactive &amp; Computational Web</dt>
              <dd>Three.js solvers, custom bytecode simulations, orbital telemetry and local document tools.</dd>
            </div>
            <div className="hero-ledger__row">
              <dt>Original Browser Games</dt>
              <dd>Quiet puzzle, strategy and generative light-painting games that launch in one click.</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* 2. Selected Work */}
      <section id="work" className="work-section" aria-labelledby="work-heading">
        <div className="studio-container">
          <div className="section-header">
            <div>
              <p className="eyebrow">Selected Work · 01 — 05</p>
              <h2 id="work-heading" className="section-title">
                Selected software &amp; interfaces.
              </h2>
            </div>
            <p className="section-note">
              Five verified builds across desktop audio engineering, 3D algorithmic web software,
              artificial-life simulation, live planetary telemetry, and focused reading.
            </p>
          </div>

          {leadProject && (
            <article className="work-lead">
              <a
                href={leadProject.primaryAction.href}
                className="media-frame"
                {...(leadProject.primaryAction.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                <img
                  src={leadProject.image}
                  alt={leadProject.imageAlt}
                  width={1280}
                  height={800}
                  fetchPriority="high"
                  decoding="async"
                />
              </a>

              <div className="work-card__body">
                <div className="work-meta-bar">
                  <span>
                    {leadProject.index} / {leadProject.category}
                  </span>
                  <span className="status-line">{leadProject.status}</span>
                </div>
                <h3 className="work-card__title">{leadProject.name}</h3>
                <p className="work-card__summary">{leadProject.summary}</p>
                <ul className="feature-points">
                  {leadProject.highlights.map(point => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <div className="work-card__footer">
                  <ul className="stack-list" aria-label={`${leadProject.name} technology stack`}>
                    {leadProject.stack.map(item => (
                      <li key={item} className="stack-tag">
                        {item}
                      </li>
                    ))}
                  </ul>
                  <ProjectActions project={leadProject} />
                </div>
              </div>
            </article>
          )}

          <div className="work-grid">
            {gridProjects.map(project => (
              <article key={project.id} className="work-card">
                <a
                  href={project.primaryAction.href}
                  className="media-frame"
                  {...(project.primaryAction.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  <img
                    src={project.image}
                    alt={project.imageAlt}
                    width={1280}
                    height={800}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
                <div className="work-card__body">
                  <div className="work-meta-bar">
                    <span>
                      {project.index} / {project.category}
                    </span>
                    <span className="status-line">{project.status}</span>
                  </div>
                  <h3 className="work-card__title">{project.name}</h3>
                  <p className="work-card__summary">{project.summary}</p>
                  <ul className="feature-points">
                    {project.highlights.map(point => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <div className="work-card__footer">
                    <ul className="stack-list" aria-label={`${project.name} technology stack`}>
                      {project.stack.map(item => (
                        <li key={item} className="stack-tag">
                          {item}
                        </li>
                      ))}
                    </ul>
                    <ProjectActions project={project} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Selected Games */}
      <section id="games" className="games-band" aria-labelledby="games-heading">
        <div className="studio-container">
          <div className="section-header">
            <div>
              <p className="eyebrow">Selected Games · Playable in Browser</p>
              <h2 id="games-heading" className="section-title">
                Small games, built from scratch.
              </h2>
            </div>
            <div>
              <p className="section-note">
                Four original browser games spanning long-exposure light painting, spatial conduit
                logic, daily codebreaking, and turn-based territory strategy.
              </p>
              <div style={{ marginTop: '0.85rem' }}>
                <a href="/games" className="link-inline">
                  <span>Full game notes &amp; controls</span>
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>

          <div className="games-grid">
            {selectedGames.map(game => (
              <article key={game.id} className="game-card">
                <a
                  href={game.playAction.href}
                  className="game-card__media"
                  {...(game.playAction.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  <img
                    src={game.image}
                    alt={game.imageAlt}
                    width={1280}
                    height={800}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
                <div className="game-card__body">
                  <div className="work-meta-bar">
                    <span>
                      {game.index} / {game.genre}
                    </span>
                    <span className="status-line">{game.status}</span>
                  </div>
                  <h3 className="game-card__title">{game.name}</h3>
                  <p className="game-card__summary">{game.summary}</p>
                  <div className="game-card__footer">
                    <div className="work-card__actions">
                      <a
                        href={game.playAction.href}
                        className="btn-secondary"
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
                        className="link-inline"
                        aria-label={`View source code for ${game.name}`}
                      >
                        <span>Source</span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                    <ul className="stack-list" aria-label={`${game.name} stack`}>
                      {game.stack.slice(0, 2).map(item => (
                        <li key={item} className="stack-tag">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Concise About Section */}
      <section className="about-home-section" aria-labelledby="about-home-heading">
        <div className="studio-container about-home-grid">
          <div>
            <p className="eyebrow">About the Studio</p>
            <h2 id="about-home-heading" className="section-title">
              Independent engineering, human scale.
            </h2>
            <p className="work-card__summary" style={{ maxWidth: '54ch', marginTop: '1.1rem' }}>
              I’m David Linacre, a self-taught software developer in Barnsley, South Yorkshire.
              Every project under LIN4CRE starts from a concrete problem—keeping living-room
              speakers in phase, visualising how evolutionary programs compete, or building a puzzle
              worth five quiet minutes.
            </p>
            <div className="hero-actions" style={{ marginTop: '1.65rem' }}>
              <a href="/about" className="btn-secondary">
                <span>About David &amp; LIN4CRE</span>
                <span aria-hidden="true">→</span>
              </a>
              <a
                href="https://github.com/LIN4CRE"
                target="_blank"
                rel="noopener noreferrer"
                className="link-inline"
              >
                <span>GitHub (@LIN4CRE)</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <ul className="principles-list" aria-label="Engineering principles">
            <li>
              <strong>Local-first by default</strong>
              <span>
                Where work can happen on the user’s machine—in a Web Worker, IndexedDB, or a
                standalone native binary—nothing is uploaded to a server.
              </span>
            </li>
            <li>
              <strong>Zero dark patterns or sign-up walls</strong>
              <span>
                Every web application and browser game opens directly into the working interface
                without accounts, pop-ups, or behavioural tracking.
              </span>
            </li>
            <li>
              <strong>Inspectable, maintainable code</strong>
              <span>
                Typed interfaces, deterministic algorithms, and public repositories with real
                releases and straightforward build scripts.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* 5. Clean Contact Section */}
      <section className="contact-home-section" aria-labelledby="contact-home-heading">
        <div className="studio-container contact-home-inner">
          <div>
            <p className="eyebrow">Contact</p>
            <h2 id="contact-home-heading" className="section-title">
              Have a project, bug report, or technical question?
            </h2>
            <p className="section-note" style={{ marginTop: '0.65rem', maxWidth: '52ch' }}>
              Reach out directly about software builds, collaboration, or feedback on any open-source
              release.
            </p>
          </div>
          <div className="work-card__actions">
            <a href="/contact" className="btn-primary">
              <span>Get in touch</span>
              <span aria-hidden="true">→</span>
            </a>
            <a href="mailto:david@linacre.site" className="btn-secondary">
              <span>david@linacre.site</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
