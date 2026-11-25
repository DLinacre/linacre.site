import StudioHome from './StudioHome';
import { ProjectsLanding, ProjectDetail } from './ProjectsExperience';
import { GamesLanding, GameDetail, GamePlayer } from './GamesExperience';
import { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { content, games, projects, type StudioContent } from '../content';
import {
  ActionLink,
  Artwork,
  ArtworkCard,
  Breadcrumbs,
  CategoryFilters,
  EmptyState,
  Footer,
  PageHeader,
  SearchField,
  SiteNavigation,
  StatusBadge,
  detailHref,
} from './components';
import './studio.css';
const LegacyApp = lazy(() => import('../App'));
const Contact = lazy(() => import('../components/Contact'));
const ContactThanks = lazy(() => import('../components/ContactThanks'));

export function resolveStudioRoute(path: string) {
  const normal = path.replace(/\/+$/, '') || '/';
  const launch = normal.match(/^\/games\/([^/]+)\/play$/);
  if (launch) return { page: 'play', record: games.find(g => g.slug === launch[1]) };
  const match = normal.match(/^\/(games|projects)\/([^/]+)$/);
  if (match)
    return {
      page: 'detail',
      section: match[1],
      record: content.find(r => detailHref(r) === normal),
    };
  return {
    page: ['/', '/games', '/projects', '/about', '/contact', '/contact/thanks'].includes(normal)
      ? normal
      : 'legacy',
  };
}
export function Collection({ kind }: { kind: 'game' | 'project' }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const records: StudioContent[] = kind === 'game' ? games : projects;
  const categoryOf = (r: StudioContent) =>
    r.type === 'game' ? (r.relationship === 'template' ? 'Templates' : 'Games') : r.category;
  const options = ['All', ...new Set(records.map(categoryOf))];
  const filtered = records
    .filter(
      r =>
        (category === 'All' || categoryOf(r) === category) &&
        `${r.name} ${r.shortDescription} ${r.tags?.join(' ')} ${r.technologyStack?.join(' ')}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) => Number(!!b.artwork) - Number(!!a.artwork));
  return (
    <main id="main" className={`st-container st-collection st-${kind}`}>
      <PageHeader
        eyebrow={kind === 'game' ? 'Play / Explore / Discover' : 'Software / Tools / Experiments'}
        title={kind === 'game' ? 'A little more play.' : 'Ideas, engineered.'}
      >
        <p>
          {kind === 'game'
            ? 'Original games, small experiments and worlds in the making. Find your next distraction.'
            : 'Practical software and curious experiments. A closer look at what I build, how it works, and why it exists.'}
        </p>
      </PageHeader>
      <div className="st-collection-tools">
        <CategoryFilters options={options} selected={category} onChange={setCategory} />
        <SearchField value={query} onChange={setQuery} />
      </div>
      <div className="st-results-heading">
        <h2>{category === 'All' ? 'The collection' : category}</h2>
        <p role="status">
          {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
        </p>
      </div>
      {filtered.length ? (
        <div className="st-grid">
          {filtered.map(r => (
            <ArtworkCard key={r.id} record={r} />
          ))}
        </div>
      ) : (
        <EmptyState
          reset={() => {
            setQuery('');
            setCategory('All');
          }}
        />
      )}
      <p className="st-collection-note">
        A source repository is not a release. Availability and verification are recorded on each
        detail page.
        {kind === 'game' && ' Third-party game directories are not part of this collection.'}
      </p>
    </main>
  );
}
export function DetailPage({ record }: { record: StudioContent }) {
  const section = record.type === 'game' ? 'games' : 'projects';
  return (
    <main id="main" className="st-container st-detail">
      <Breadcrumbs section={section} name={record.name} />
      <div className="st-detail-heading">
        <PageHeader
          eyebrow={
            record.type === 'game'
              ? record.genre?.join(' / ') || 'Game / Studio collection'
              : `${record.category} / Studio collection`
          }
          title={record.name}
        >
          <p>{record.shortDescription}</p>
        </PageHeader>
        <StatusBadge record={record} />
      </div>
      <Artwork record={record} eager />
      <div className="st-detail-layout">
        <div>
          <section>
            <p className="st-eyebrow">The story</p>
            <h2>{record.type === 'game' ? 'Inside the game' : 'About the project'}</h2>
            <p>{record.fullDescription || record.shortDescription}</p>
            {record.type === 'project' && record.problemSolved && (
              <>
                <h3>The idea</h3>
                <p>{record.problemSolved}</p>
              </>
            )}
            {record.implementation && (
              <>
                <h3>How it’s built</h3>
                <p>{record.implementation}</p>
              </>
            )}
          </section>
          {!!record.features?.length && (
            <section>
              <h2>What’s inside</h2>
              <ul className="st-feature-list">
                {record.features.map(f => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </section>
          )}
          {record.type === 'game' && (record.controls || record.modes || record.development) && (
            <section>
              <h2>Playing & development</h2>
              {record.controls && <p>{record.controls}</p>}
              {record.modes && <p>{record.modes}</p>}
              {record.development?.systems && (
                <ul>
                  {record.development.systems.map(s => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              )}
              {record.development?.changelog?.map(c => (
                <div key={c.version}>
                  <h3>
                    {c.version} · {c.title}
                  </h3>
                  <ul>
                    {c.changes.map(change => (
                      <li key={change}>{change}</li>
                    ))}
                  </ul>
                </div>
              ))}
              {record.development?.roadmap && (
                <>
                  <h3>Roadmap</h3>
                  <ul>
                    {record.development.roadmap.map(item => (
                      <li key={item.item}>
                        {item.item} — {item.status}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          )}
          <section>
            <h2>Screenshots</h2>
            {record.screenshots?.length ? (
              <div className="st-screenshots">
                {record.screenshots.map(s => (
                  <figure key={s.src}>
                    <img src={s.src} alt={s.alt} loading="lazy" />
                    <figcaption>{s.alt}</figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <p className="st-muted">
                No screenshots available. Cover artwork is not a gameplay or application capture.
              </p>
            )}
          </section>
        </div>
        <aside className="st-facts" aria-label="Availability and project information">
          <p className="st-eyebrow">Explore it</p>
          <div className="st-actions">
            {record.type === 'game' && record.playUrl && (
              <ActionLink href={record.playUrl} primary>
                Play game
              </ActionLink>
            )}
            {record.type === 'project' && record.liveUrl && (
              <ActionLink href={record.liveUrl} primary>
                Open project
              </ActionLink>
            )}
            {record.downloadUrl && (
              <ActionLink href={record.downloadUrl}>
                {' '}
                {record.relationship === 'template' ? 'Download template' : 'Downloads'}
              </ActionLink>
            )}
            {record.sourceRepository && (
              <ActionLink href={record.sourceRepository}>View source</ActionLink>
            )}
            {record.documentation && (
              <ActionLink href={record.documentation}>Documentation</ActionLink>
            )}
          </div>
          {record.relationship === 'template' && <p>Development template. Not a published game.</p>}
          {record.statusNote && <p>{record.statusNote}</p>}
          <dl>
            <dt>Type</dt>
            <dd>{record.relationship}</dd>
            <dt>Platforms</dt>
            <dd>{record.platforms?.join(', ') || 'Not recorded'}</dd>
            {record.type === 'game' && (
              <>
                <dt>Input</dt>
                <dd>{record.inputMethods?.join(', ') || 'Not recorded'}</dd>
              </>
            )}
            <dt>Built with</dt>
            <dd>{record.technologyStack?.join(' · ') || 'Not recorded'}</dd>
            <dt>Last checked</dt>
            <dd>{record.lastVerifiedDate || 'Not yet verified'}</dd>
          </dl>
          {record.verification && <p className="st-verification">{record.verification.scope}</p>}
          <a className="st-text-link" href={`/${section}`}>
            Back to all {section} <ArrowRight size={15} aria-hidden="true" />
          </a>
        </aside>
      </div>
    </main>
  );
}
export default function Studio({ path = window.location.pathname }: { path?: string }) {
  const route = resolveStudioRoute(path);
  useEffect(() => {
    if (route.page !== 'legacy')
      document.title = route.record
        ? `${route.record.name} — LIN4CRE`
        : `${route.page === '/' ? 'Independent software & game studio' : route.page.slice(1).replace('/', ' / ')} — LIN4CRE`;
  }, [route.page, route.record]);
  if (route.page === 'play')
    return (
      <div className="studio">
        {route.record?.type === 'game' ? (
          <GamePlayer game={route.record} />
        ) : (
          <main className="st-container st-empty">
            <h1>Game not found</h1>
            <ActionLink href="/games">Back to games</ActionLink>
          </main>
        )}
      </div>
    );
  if (route.page === 'legacy')
    return (
      <Suspense fallback={<p>Loading…</p>}>
        <LegacyApp />
      </Suspense>
    );
  return (
    <div className="studio">
      <a className="st-skip" href="#main">
        Skip to content
      </a>
      <SiteNavigation path={path} />
      <Suspense
        fallback={
          <main id="main" className="st-container st-empty">
            Loading…
          </main>
        }
      >
        {route.page === '/' ? (
          <StudioHome />
        ) : route.page === '/games' ? (
          <GamesLanding />
        ) : route.page === '/projects' ? (
          <ProjectsLanding />
        ) : route.page === 'detail' ? (
          route.record ? (
            route.record.type === 'game' ? (
              <GameDetail game={route.record} />
            ) : (
              <ProjectDetail project={route.record} />
            )
          ) : (
            <main id="main" className="st-container st-empty">
              <h1>That page isn’t in the collection.</h1>
              <p>The link may be out of date.</p>
              <ActionLink href={`/${route.section}`}>Back to the collection</ActionLink>
            </main>
          )
        ) : route.page === '/about' ? (
          <main id="main" className="st-container st-about">
            <PageHeader eyebrow="The person behind the projects" title="Independent in spirit.">
              <p>LIN4CRE is an independent software and game studio by David Linacre.</p>
            </PageHeader>
            <div className="st-about-body">
              <h2>Useful software. Room to play.</h2>
              <p>
                My work spans practical tools, browser games and experiments in software and AI.
                This is a place to explore that work, look inside the code, and follow ideas as they
                develop.
              </p>
              <p>
                Not everything here is a finished release. Each project records what is available,
                what has been checked, and what is still taking shape.
              </p>
              <ActionLink href="/contact">Let’s talk</ActionLink>
            </div>
          </main>
        ) : (
          <main id="main" className="st-container st-contact">
            <PageHeader
              eyebrow="Start a conversation"
              title={
                route.page === '/contact/thanks'
                  ? 'Thanks for reaching out.'
                  : 'What’s on your mind?'
              }
            >
              <p>Have a question about a game, a tool or an idea? Get in touch.</p>
            </PageHeader>
            {route.page === '/contact/thanks' ? <ContactThanks /> : <Contact embedded />}
          </main>
        )}
      </Suspense>
      <Footer />
    </div>
  );
}
