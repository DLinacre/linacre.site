import { useState } from 'react';
import { SITE_PROJECTS, type ProjectKind, type SiteProject } from '../data/siteProjects';
import { filterProjects, PROJECT_CATEGORIES, projectActions, projectCategory, type AccessFilter } from '../lib/projectLibrary';
import ProjectActions from './ProjectActions';
import ProjectDetailModal from './ProjectDetailModal';

interface Props {
  query: string;
  setQuery: (query: string) => void;
  projects?: SiteProject[];
  heading?: string;
}

export default function ProjectGrid({ query, setQuery, projects = SITE_PROJECTS, heading = 'All projects' }: Props) {
  const [category, setCategory] = useState<ProjectKind | 'all'>('all');
  const [access, setAccess] = useState<AccessFilter>('all');
  const [selected, setSelected] = useState<SiteProject | null>(null);
  const [sort, setSort] = useState('recommended');
  const visible = filterProjects(projects, query, category, access).sort((a, b) =>
    (sort === 'recommended' ? Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) : 0) ||
    a.name.localeCompare(b.name),
  );
  const groups = PROJECT_CATEGORIES.map(item => ({
    ...item,
    projects: visible.filter(project => projectCategory(project) === item.id),
  })).filter(group => group.projects.length);
  const reset = () => { setQuery(''); setCategory('all'); setAccess('all'); };
  const categories = PROJECT_CATEGORIES.filter(item => projects.some(project => projectCategory(project) === item.id));

  return (
    <section aria-label={heading} className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold">{heading}</h2>
          <p role="status" className="mt-2 text-sm text-muted-foreground">{visible.length} of {projects.length} listed projects</p>
        </div>
        <label className="text-sm">Sort
          <select aria-label="Sort projects" value={sort} onChange={event => setSort(event.target.value)} className="ml-2 min-h-11 rounded-lg border border-border-color bg-background px-3">
            <option value="recommended">Pinned first</option><option value="az">A–Z</option>
          </select>
        </label>
      </div>
      <div role="group" aria-label="Project categories" className="flex flex-wrap gap-2">
        {[{ id: 'all' as const, label: 'All categories' }, ...categories].map(item => (
          <button key={item.id} type="button" aria-pressed={category === item.id} onClick={() => setCategory(item.id)}
            className={`min-h-11 rounded-xl border px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${category === item.id ? 'border-foreground bg-muted font-semibold' : 'border-border-color hover:bg-muted'}`}>
            {item.label} <span className="text-muted-foreground">({item.id === 'all' ? projects.length : projects.filter(project => projectCategory(project) === item.id).length})</span>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm">Access
          <select aria-label="Filter by access" value={access} onChange={event => setAccess(event.target.value as AccessFilter)} className="ml-2 min-h-11 rounded-lg border border-border-color bg-background px-3">
            <option value="all">All access types</option><option value="use">Use in browser</option>
            <option value="download">Downloads</option><option value="source">Source available</option>
          </select>
        </label>
        {(query || category !== 'all' || access !== 'all') && <button type="button" onClick={reset} className="min-h-11 rounded-lg px-3 text-sm underline underline-offset-4">Clear all filters</button>}
      </div>
      <p className="text-sm leading-6 text-muted-foreground">App links are not uptime checks. Downloads appear only where a download or release link is recorded; source-only projects may need building or setup.</p>
      {groups.map(group => (
        <section key={group.id} aria-label={group.label} className="space-y-4">
          <h3 className="font-display text-xl font-semibold">{group.label}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.projects.map(project => (
              <article key={project.name} aria-label={project.name} className="flex min-w-0 flex-col rounded-2xl border border-border-color bg-[var(--linacre-panel)] p-5">
                <div className="flex items-start gap-3">
                  <span aria-hidden="true" className="text-2xl">{project.emoji || '📦'}</span>
                  <h4 className="min-w-0 break-words font-display text-lg font-bold">{project.name}</h4>
                </div>
                {project.pinned && <p className="mt-2 text-xs font-semibold text-muted-foreground">Pinned</p>}
                <p className="mb-5 mt-3 flex-1 text-sm leading-6 text-muted-foreground">{project.blurb}</p>
                {projectCategory(project) !== 'Private' && projectActions(project).every(action => action.kind === 'source') && <p className="mb-3 text-xs text-muted-foreground">Source only — no app or download recorded</p>}
                {project.kind === 'Game' && !project.pinned && <p className="mb-3 text-xs text-muted-foreground">Needs playtesting — not recommended yet</p>}
                <ProjectActions project={project} />
                {projectActions(project).length > 0 && <button type="button" onClick={() => setSelected(project)} aria-label={`View details for ${project.name}`} className="mt-3 min-h-11 self-start rounded-lg text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground">Details</button>}
              </article>
            ))}
          </div>
        </section>
      ))}
      {!visible.length && <div className="rounded-2xl border border-dashed border-border-color p-8 text-center"><p>No projects match these filters.</p><button type="button" onClick={reset} className="mt-3 min-h-11 rounded-lg px-3 font-semibold underline">Reset filters</button></div>}
      <ProjectDetailModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
