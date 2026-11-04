import { lazy, Suspense, useState } from 'react';
import { LayoutGrid, List, Shuffle } from 'lucide-react';
import { SITE_PROJECTS, type ProjectKind, type SiteProject } from '../data/siteProjects';
import {
  filterProjects,
  PROJECT_CATEGORIES,
  projectActions,
  projectCategory,
  type AccessFilter,
} from '../lib/projectLibrary';
import ProjectActions from './ProjectActions';
import Card3DTilt from './Card3DTilt';

const ProjectDetailModal = lazy(() => import('./ProjectDetailModal'));

interface Props {
  query: string;
  setQuery: (query: string) => void;
  projects?: SiteProject[];
  heading?: string;
}

export default function ProjectGrid({
  query,
  setQuery,
  projects = SITE_PROJECTS,
  heading = 'All projects',
}: Props) {
  const [category, setCategory] = useState<ProjectKind | 'all'>('all');
  const [access, setAccess] = useState<AccessFilter>('all');
  const [selected, setSelected] = useState<SiteProject | null>(null);
  const [sort, setSort] = useState('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  const openRandomProject = () => {
    if (visible.length === 0) return;
    const pick = visible[Math.floor(Math.random() * visible.length)];
    setSelected(pick);
  };

  const visible = filterProjects(projects, query, category, access).sort(
    (a, b) =>
      (sort === 'recommended' ? Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) : 0) ||
      a.name.localeCompare(b.name),
  );

  const groups = PROJECT_CATEGORIES.map(item => ({
    ...item,
    projects: visible.filter(project => projectCategory(project) === item.id),
  })).filter(group => group.projects.length);

  const reset = () => {
    setQuery('');
    setCategory('all');
    setAccess('all');
  };
  const categories = PROJECT_CATEGORIES.filter(item =>
    projects.some(project => projectCategory(project) === item.id),
  );

  return (
    <section id="project-library" aria-label={heading} className="project-library space-y-6">
      {/* Header & Controls Bar */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <h2 className="project-library__title font-display text-2xl font-bold text-white">
            {heading}
          </h2>
          <p
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="project-library__count mt-1 text-xs text-[#9aa3b2]"
          >
            {visible.length} of {projects.length} listed projects
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="project-library__controls-label flex items-center text-xs text-[#9aa3b2] gap-1.5">
            <span>Sort:</span>
            <select
              aria-label="Sort projects"
              value={sort}
              onChange={event => setSort(event.target.value)}
              className="rounded-lg border border-white/[0.1] bg-[#0e1016] px-2.5 py-1 text-xs text-white"
            >
              <option value="recommended">Pinned first</option>
              <option value="az">A–Z</option>
            </select>
          </label>
          <label className="project-library__controls-label flex items-center text-xs text-[#9aa3b2] gap-1.5">
            <span>Access:</span>
            <select
              aria-label="Filter by access"
              value={access}
              onChange={event => setAccess(event.target.value as AccessFilter)}
              className="rounded-lg border border-white/[0.1] bg-[#0e1016] px-2.5 py-1 text-xs text-white"
            >
              <option value="all">All access types</option>
              <option value="use">Use in browser</option>
              <option value="download">Downloads</option>
              <option value="source">Source available</option>
            </select>
          </label>
          <button
            type="button"
            onClick={openRandomProject}
            disabled={visible.length === 0}
            className="inline-flex items-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-50 rounded-lg border border-white/10 bg-[#0e1016] px-2.5 py-1 text-xs text-[#8fd6ff] hover:border-[#8fd6ff]/40 transition cursor-pointer"
          >
            <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Surprise me</span>
          </button>
          <div className="inline-flex rounded-lg border border-white/10 bg-[#0e1016] p-0.5" role="group" aria-label="View layout">
            <button
              type="button"
              aria-pressed={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
              className={`rounded-md px-2 py-0.5 text-xs transition cursor-pointer ${
                viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-[#9aa3b2] hover:text-white'
              }`}
              title="Artwork grid view"
              aria-label="Artwork grid view"
            >
              <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-pressed={viewMode === 'compact'}
              onClick={() => setViewMode('compact')}
              className={`rounded-md px-2 py-0.5 text-xs transition cursor-pointer ${
                viewMode === 'compact' ? 'bg-white/10 text-white' : 'text-[#9aa3b2] hover:text-white'
              }`}
              title="Compact index view"
              aria-label="Compact index view"
            >
              <List className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
          {(query || category !== 'all' || access !== 'all') && (
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-white/10 px-2.5 py-1 text-xs text-[#8fd6ff] hover:bg-white/5"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Tabulous Filter Pills */}
      <div role="group" aria-label="Project categories" className="flex flex-wrap gap-2">
        {[{ id: 'all' as const, label: 'All categories' }, ...categories].map(item => (
          <button
            key={item.id}
            type="button"
            aria-pressed={category === item.id}
            onClick={() => setCategory(item.id)}
            className={`tabulous-pill ${category === item.id ? 'active' : ''}`}
          >
            <span>{item.label}</span>
            <span className="text-[11px] opacity-60">
              (
              {item.id === 'all'
                ? projects.length
                : projects.filter(project => projectCategory(project) === item.id).length}
              )
            </span>
          </button>
        ))}
      </div>

      {/* Project Group Sections & Dark Chrome Cards */}
      {groups.map(group => (
        <section key={group.id} aria-label={group.label} className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <h3 className="project-library__group-title font-display text-sm font-bold uppercase tracking-wider text-[#9aa3b2]">
              {group.label}
            </h3>
            <span className="h-px flex-1 bg-white/[0.08]" />
          </div>
          <div
            className={
              viewMode === 'compact'
                ? 'grid grid-cols-1 md:grid-cols-2 gap-2.5'
                : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'
            }
          >
            {group.projects.map(project => (
              <Card3DTilt key={project.name} className="flex flex-col h-full">
                <article
                  aria-label={project.name}
                  className="tabulous-card group flex flex-1 min-w-0 flex-col justify-between p-3"
                >
                  <div>
                    {/* Card Artwork Thumbnail Banner (16:9 Aspect Ratio) */}
                    <div
                      className={`relative aspect-video -mx-3 -mt-3 mb-2.5 overflow-hidden rounded-t-xl bg-[#05060a] border-b border-white/[0.06] ${
                        viewMode === 'compact' ? 'hidden' : ''
                      }`}
                    >
                      {project.artwork ? (
                        <>
                          <img
                            src={project.artwork}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            onError={e => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling;
                              if (fallback) fallback.classList.remove('hidden');
                            }}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <span
                            className="hidden grid h-full w-full place-items-center text-3xl bg-gradient-to-br from-[#12151e] to-[#07080b]"
                            aria-hidden="true"
                          >
                            {project.emoji || '📦'}
                          </span>
                        </>
                      ) : (
                        <span
                          className="grid h-full w-full place-items-center text-3xl"
                          aria-hidden="true"
                        >
                          {project.emoji || '📦'}
                        </span>
                      )}

                      {/* Kind / Category Badge */}
                      <span className="absolute left-2 top-2 rounded-full border border-white/10 bg-black/75 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#8fd6ff] backdrop-blur">
                        {project.kind}
                      </span>

                      {/* Pinned or New Badge */}
                      {project.pinned && (
                        <span className="absolute right-2 top-2 rounded-full border border-amber-400/40 bg-black/75 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-300 backdrop-blur">
                          Pinned
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 min-w-0">
                      <span aria-hidden="true" className="text-sm shrink-0">
                        {project.emoji || '📦'}
                      </span>
                      <h4 className="min-w-0 truncate font-display text-sm font-bold text-white group-hover:text-[#8fd6ff] transition-colors">
                        {project.name}
                      </h4>
                    </div>

                    <p className="mt-1 text-xs text-[#9aa3b2] leading-snug line-clamp-2">
                      {project.blurb}
                    </p>

                    {project.tech && project.tech.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {project.tech.slice(0, 3).map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setQuery(t)}
                            title={`Filter projects by ${t}`}
                            className="rounded bg-white/[0.03] px-1.5 py-0.5 font-mono text-[9px] text-[#9aa3b2] hover:text-[#8fd6ff] hover:border-[#8fd6ff]/40 border border-white/[0.06] transition cursor-pointer"
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between gap-1.5">
                    <ProjectActions project={project} />
                    {projectActions(project).length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelected(project)}
                        aria-label={`View details for ${project.name}`}
                        className="inline-flex min-h-7 items-center rounded-lg border border-white/10 px-2 py-0.5 text-xs text-[#9aa3b2] hover:text-white hover:border-white/25 transition-all"
                      >
                        Details
                      </button>
                    )}
                  </div>
                </article>
              </Card3DTilt>
            ))}
          </div>
        </section>
      ))}

      {!visible.length && (
        <div className="rounded-xl border border-dashed border-white/15 p-8 text-center text-[#9aa3b2]">
          <p className="text-sm">No projects match these filters.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-3 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/5"
          >
            Reset filters
          </button>
        </div>
      )}

      {selected && (
        <Suspense fallback={null}>
          <ProjectDetailModal project={selected} onClose={() => setSelected(null)} />
        </Suspense>
      )}
    </section>
  );
}
