import { useState } from 'react';
import { ArrowRight, ArrowUpRight, LayoutGrid, List, Search } from 'lucide-react';
import { contentStatusLabel, projects, type ProjectContent } from '../content';
import {
  ActionLink,
  Artwork,
  Breadcrumbs,
  EmptyState,
  PageHeader,
  SearchField,
  StatusBadge,
} from './components';

export const portfolioProjects = projects.filter(project => !!project.portfolio);
export function projectLinks(project: ProjectContent) {
  const links: { href: string; label: string; primary?: boolean }[] = [];
  if (
    project.liveUrl &&
    project.status === 'Live' &&
    ['functional', 'device-install'].includes(project.verification?.method || '')
  )
    links.push({ href: project.liveUrl, label: 'Launch Web App', primary: true });
  for (const asset of project.downloads || [])
    links.push({ href: asset.url, label: asset.label, primary: links.length === 0 });
  if (project.sourceRepository)
    links.push({
      href: project.sourceRepository,
      label: 'View GitHub',
      primary: links.length === 0,
    });
  if (project.documentation)
    links.push({ href: project.documentation, label: 'Read Documentation' });
  return links;
}
export function ProjectImage({
  project,
  eager = false,
}: {
  project: ProjectContent;
  eager?: boolean;
}) {
  const shot = project.screenshots?.[0];
  const [failed, setFailed] = useState(false);
  return (
    <div className="px-image-frame">
      {shot && !failed ? (
        <>
          <div className="px-frame-bar" aria-hidden="true">
            <span />
            <span />
            <span />
            <span className="px-frame-label">{project.name} / interface</span>
          </div>
          <img
            src={shot.src}
            alt={shot.alt}
            loading={eager ? 'eager' : 'lazy'}
            width="1440"
            height="900"
            onError={() => setFailed(true)}
          />
        </>
      ) : failed ? (
        <div className="px-image-missing">
          <Search size={24} aria-hidden="true" />
          <span>Image unavailable</span>
        </div>
      ) : (
        <Artwork record={project} eager={eager} />
      )}
    </div>
  );
}
export function ProjectCard({ project }: { project: ProjectContent }) {
  return (
    <article className="st-card px-card">
      <a href={`/projects/${project.slug}`} aria-label={`Explore ${project.name}`}>
        <ProjectImage project={project} />
      </a>
      <div className="st-card-body">
        <div className="st-card-meta">
          <span>{project.portfolio?.category || project.category}</span>
          <StatusBadge record={project} />
        </div>
        <h3>
          <a href={`/projects/${project.slug}`}>{project.name}</a>
        </h3>
        <p>{project.shortDescription}</p>
        <div className="px-card-footer">
          <span>{project.platforms?.join(' · ') || 'Platform not verified'}</span>
          <a className="st-text-link" href={`/projects/${project.slug}`}>
            Explore project <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
export function filterPortfolio(
  records: ProjectContent[],
  query: string,
  category: string,
  platform: string,
  status: string,
) {
  return records.filter(
    p =>
      (category === 'All' || p.portfolio?.category === category) &&
      (platform === 'All' || p.platforms?.includes(platform)) &&
      (status === 'All' || contentStatusLabel(p) === status) &&
      `${p.name} ${p.shortDescription} ${p.technologyStack?.join(' ')} ${p.tags?.join(' ')}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
}
export function ProjectsLanding() {
  const [query, setQuery] = useState(''),
    [category, setCategory] = useState('All'),
    [platform, setPlatform] = useState('All'),
    [status, setStatus] = useState('All'),
    [view, setView] = useState<'grid' | 'list'>('grid');
  const filtered = filterPortfolio(portfolioProjects, query, category, platform, status);
  const reset = () => {
    setQuery('');
    setCategory('All');
    setPlatform('All');
    setStatus('All');
  };
  const featured = portfolioProjects.filter(p => p.featured).slice(0, 3);
  return (
    <main id="main" className="st-container px-landing">
      <PageHeader eyebrow="LIN4CRE / Software & applications" title="Useful ideas. Real software.">
        <p>
          Tools for everyday problems, experiments in AI and applications built to explore an idea.
          Look inside the work, not just the cover.
        </p>
      </PageHeader>
      <section aria-labelledby="featured-projects" className="px-featured">
        <div className="st-section-heading">
          <div>
            <p className="st-eyebrow">A closer look</p>
            <h2 id="featured-projects">From the studio.</h2>
          </div>
          <p className="gx-caption">Source-reviewed. Availability recorded separately.</p>
        </div>
        <div className="st-grid">
          {featured.map(p => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>
      <section aria-labelledby="portfolio-heading" className="px-catalogue">
        <div className="st-section-heading">
          <h2 id="portfolio-heading">Explore the work.</h2>
          <div className="px-view" role="group" aria-label="Catalogue view">
            <button
              aria-label="Grid view"
              aria-pressed={view === 'grid'}
              onClick={() => setView('grid')}
            >
              <LayoutGrid size={17} />
            </button>
            <button
              aria-label="List view"
              aria-pressed={view === 'list'}
              onClick={() => setView('list')}
            >
              <List size={19} />
            </button>
          </div>
        </div>
        <div className="gx-controls">
          <SearchField value={query} onChange={setQuery} />
          <div className="gx-selects">
            {[
              [
                'Category',
                category,
                setCategory,
                [...new Set(portfolioProjects.map(p => p.portfolio!.category))],
              ],
              [
                'Platform',
                platform,
                setPlatform,
                [...new Set(portfolioProjects.flatMap(p => p.platforms || []))],
              ],
              [
                'Status',
                status,
                setStatus,
                [...new Set(portfolioProjects.map(contentStatusLabel))],
              ],
            ].map(([label, value, change, options]) => (
              <label className="gx-select" key={label as string}>
                <span>{label as string}</span>
                <select
                  value={value as string}
                  onChange={e => (change as (v: string) => void)(e.target.value)}
                >
                  <option value="All">All {(label as string).toLowerCase()}</option>
                  {(options as string[]).map(option => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>
        <div className="gx-count">
          <p role="status">
            {filtered.length} {filtered.length === 1 ? 'project' : 'projects'} match
          </p>
          {(query || category !== 'All' || platform !== 'All' || status !== 'All') && (
            <button onClick={reset}>Clear filters</button>
          )}
        </div>
        {filtered.length ? (
          <div className={view === 'grid' ? 'st-grid px-grid' : 'px-list'}>
            {filtered.map(p => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <EmptyState reset={reset} />
        )}
        <p className="st-collection-note">
          These projects have inspected public implementation source. That does not establish that
          every feature, deployment or supported device works. Unreviewed historical records are
          retained, not used to inflate this portfolio.
        </p>
      </section>
    </main>
  );
}
export function ProjectDetail({ project }: { project: ProjectContent }) {
  const actions = projectLinks(project);
  return (
    <main id="main" className="st-container st-detail px-detail">
      <Breadcrumbs section="projects" name={project.name} />
      <div className="st-detail-heading">
        <PageHeader
          eyebrow={project.portfolio?.category || `${project.category} / Historical record`}
          title={project.name}
        >
          <p>{project.shortDescription}</p>
        </PageHeader>
        <StatusBadge record={project} />
      </div>
      <ProjectImage project={project} eager />
      <p className="px-evidence-caption">
        {project.screenshots?.length
          ? 'Actual application interface. Capture provenance is recorded with each screenshot below.'
          : 'Project artwork, not an application screenshot. No authenticated screenshot is available.'}
      </p>
      <div className="st-detail-layout">
        <div>
          <section>
            <p className="st-eyebrow">The project</p>
            <h2>What it does</h2>
            <p>{project.fullDescription || project.shortDescription}</p>
            <h3>The problem it addresses</h3>
            <p>{project.problemSolved || 'A detailed problem statement has not been recorded.'}</p>
            <h3>Why it was built</h3>
            <p>
              {project.whyBuilt ||
                'A first-person development rationale has not yet been recorded. The project context above describes the purpose without inventing a personal motivation.'}
            </p>
          </section>
          <section>
            <h2>Key features</h2>
            {project.features?.length ? (
              <ul>
                {project.features.map(f => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            ) : (
              <p>A feature list has not been independently documented.</p>
            )}
            <h3>How it works</h3>
            <p>
              {project.implementation ||
                (project.portfolio
                  ? `Implementation source is available in the linked repository. ${project.technologyStack?.length ? `The recorded stack is ${project.technologyStack.join(', ')}.` : 'A detailed technical walkthrough is not yet available.'}`
                  : 'This historical record has not yet received a current implementation review.')}
            </p>
          </section>
          <section>
            <h2>Inside the application</h2>
            {project.screenshots?.length ? (
              <div className="gx-screenshots">
                {project.screenshots.map(s => (
                  <figure key={s.src}>
                    <a href={s.src} aria-label={`Open full-size screenshot: ${s.alt}`}>
                      <img src={s.src} alt={s.alt} loading="lazy" width="1440" height="900" />
                    </a>
                    <figcaption>
                      {s.alt}
                      {s.capturedAt && ` · Captured ${s.capturedAt}`}
                      {s.sourceSha && ` · Source ${s.sourceSha.slice(0, 8)}`}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <p>
                No verified application screenshots available. Cover artwork is not presented as a
                screenshot.
              </p>
            )}
          </section>
          <section>
            <h2>Releases & development</h2>
            <p>
              {project.statusNote ||
                'Current publication and development status have not been verified.'}
            </p>
            {project.releases?.length ? (
              <ol className="px-releases">
                {project.releases.map(r => (
                  <li key={r.url}>
                    <h3>
                      <a href={r.url}>
                        {r.version} <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    </h3>
                    {r.publishedAt && <time dateTime={r.publishedAt}>{r.publishedAt}</time>}
                    <p>{r.notes || 'Release notes are available in the repository.'}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="gx-caption">
                No verified release history recorded. A repository is not a published application.
              </p>
            )}
          </section>
        </div>
        <aside className="st-facts" aria-label="Project availability">
          <p className="st-eyebrow">Explore the project</p>
          <div className="st-actions">
            {actions.map(a => (
              <ActionLink key={a.href} href={a.href} primary={a.primary}>
                {a.label}
              </ActionLink>
            ))}
          </div>
          {project.downloads?.map(d => (
            <p key={d.url}>
              {d.version}: {d.note}
            </p>
          ))}
          {project.liveUrl && !actions.some(a => a.href === project.liveUrl) && (
            <p>
              <a className="st-text-link" href={project.liveUrl}>
                Recorded deployment <ArrowUpRight size={13} aria-hidden="true" />
              </a>
              <br />
              Reachability and functionality are unverified; this is not a certified demo.
            </p>
          )}
          <dl>
            <dt>Status</dt>
            <dd>{contentStatusLabel(project)}</dd>
            <dt>Type</dt>
            <dd>{project.relationship}</dd>
            <dt>Recorded target platforms</dt>
            <dd>{project.platforms?.join(', ') || 'Not verified'}</dd>
            <dt>Technology</dt>
            <dd>{project.technologyStack?.join(' · ') || 'Not recorded'}</dd>
            <dt>Last reviewed</dt>
            <dd>
              {project.portfolio?.sourceVerifiedAt || project.lastVerifiedDate || 'Not verified'}
            </dd>
          </dl>
          <p className="st-verification">
            {project.verification?.scope || 'No current verification evidence recorded.'}
          </p>
          <a className="st-text-link" href="/projects">
            All projects <ArrowRight size={15} aria-hidden="true" />
          </a>
        </aside>
      </div>
    </main>
  );
}
