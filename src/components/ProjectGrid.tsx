import { useMemo, useState } from 'react';
import { ArrowUpRight, ExternalLink, Github, Lock, Search, X, ArrowDownAZ, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { SITE_PROJECTS, ProjectKind, type SiteProject } from '../data/siteProjects';

const KIND_META: Record<ProjectKind, { label: string; chip: string; dot: string; accent: string }> = {
  App:    { label: 'App',    chip: 'text-cyan bg-cyan/10 border-cyan/25', dot: 'bg-cyan', accent: 'border-l-cyan/70' },
  Tool:   { label: 'Tool',   chip: 'text-emerald-color bg-emerald-color/10 border-emerald-color/25', dot: 'bg-emerald-color', accent: 'border-l-emerald-color/70' },
  AI:     { label: 'AI',     chip: 'text-purple-color bg-purple-color/10 border-purple-color/25', dot: 'bg-purple-color', accent: 'border-l-purple-color/70' },
  Game:   { label: 'Game',   chip: 'text-amber-color bg-amber-color/10 border-amber-color/25', dot: 'bg-amber-color', accent: 'border-l-amber-color/70' },
  DevOps: { label: 'DevOps', chip: 'text-cyan/80 bg-cyan/5 border-cyan/20', dot: 'bg-cyan/80', accent: 'border-l-cyan/50' },
  Source: { label: 'Source', chip: 'text-muted-foreground bg-muted/40 border-border-color', dot: 'bg-muted-foreground', accent: 'border-l-border-color' },
  Private:{ label: 'Private',chip: 'text-muted-foreground bg-muted/30 border-border-color', dot: 'bg-muted-foreground', accent: 'border-l-border-color' },
};

const FILTERS: Array<{ id: ProjectKind | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'App', label: 'Apps' },
  { id: 'Tool', label: 'Tools' },
  { id: 'AI', label: 'AI' },
  { id: 'Game', label: 'Games' },
  { id: 'DevOps', label: 'DevOps' },
];

type SortMode = 'useful' | 'az';

function hostOf(url?: string): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

function ProjectCard({ project, index }: { project: SiteProject; index: number }) {
  const meta = KIND_META[project.kind];
  const href = project.url || project.repo;
  const isPrivate = project.kind === 'Private' || project.private;
  const host = isPrivate ? null : hostOf(project.url || project.repo);

  const card = (
    <article
      className={`group relative flex h-full flex-col rounded-xl border border-border-color border-l-2 bg-[var(--linacre-panel)] p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan/40 hover:shadow-[var(--linacre-glow-soft)] ${meta.accent}`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-color bg-muted/30 text-base">
          {project.emoji ?? '📦'}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="truncate font-display text-sm font-bold text-foreground group-hover:text-cyan transition-colors">
              {project.name}
            </h3>
            {project.badge === 'NEW' && (
              <span className="shrink-0 rounded bg-amber-color/15 px-1.5 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider text-amber-color">
                New
              </span>
            )}
            <span className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${meta.chip}`}>
              {meta.label}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
            {project.blurb}
          </p>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-border-color/60 pt-2">
        <span className="flex min-w-0 items-center gap-1.5 font-mono text-[10px] text-muted-foreground/70">
          {isPrivate ? (
            <>
              <Lock className="h-3 w-3 shrink-0" />
              <span className="truncate">Private repo</span>
            </>
          ) : host ? (
            <>
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${meta.dot}`} />
              <span className="truncate">{host}</span>
            </>
          ) : null}
        </span>
        {!isPrivate && href && (
          <span className="flex shrink-0 items-center gap-1 font-mono text-[10px] font-bold text-amber-color opacity-0 transition-opacity group-hover:opacity-100">
            Open <ArrowUpRight className="h-3 w-3" />
          </span>
        )}
      </div>
    </article>
  );

  if (isPrivate || !href) {
    return card;
  }
  const isExternal = href.startsWith('http');
  return (
    <motion.a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.3) }}
      className="block h-full"
    >
      {card}
    </motion.a>
  );
}

export default function ProjectGrid({ query, setQuery }: { query: string; setQuery: (q: string) => void }) {
  const [filter, setFilter] = useState<ProjectKind | 'all'>('all');
  const [sort, setSort] = useState<SortMode>('useful');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = SITE_PROJECTS.filter(p => {
      if (filter !== 'all' && p.kind !== filter) return false;
      if (!q) return true;
      const haystack = [p.name, p.blurb, p.kind, ...p.tags].join(' ').toLowerCase();
      return q.split(/\s+/).every(term => haystack.includes(term));
    });
    if (sort === 'az') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
    }
    return list;
  }, [query, filter, sort]);

  const stats = useMemo(() => {
    const live = SITE_PROJECTS.filter(p => p.url && !p.private).length;
    const openSource = SITE_PROJECTS.filter(p => p.repo && !p.private).length;
    const games = SITE_PROJECTS.filter(p => p.kind === 'Game').length;
    const ai = SITE_PROJECTS.filter(p => p.kind === 'AI').length;
    return { live, openSource, games, ai };
  }, []);

  return (
    <section aria-labelledby="all-projects-heading" className="scroll-mt-24">
      {/* Stats strip */}
      <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 font-mono text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan" /> {stats.live} live apps
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-color" /> {stats.openSource} open source
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-color" /> {stats.games} games
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-color" /> {stats.ai} AI products
        </span>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="all-projects-heading" className="font-display text-xl font-bold tracking-tight text-foreground">
          All projects
          <span className="ml-2 align-middle font-mono text-[11px] font-semibold text-muted-foreground">
            {SITE_PROJECTS.length} total
          </span>
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          {/* Sort control */}
          <div className="flex rounded-lg border border-border-color bg-muted/15 p-0.5" role="group" aria-label="Sort projects">
            <button
              onClick={() => setSort('useful')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors cursor-pointer ${
                sort === 'useful' ? 'bg-amber-color/15 text-amber-color' : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-pressed={sort === 'useful'}
            >
              <Star className="h-3 w-3" /> Useful
            </button>
            <button
              onClick={() => setSort('az')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors cursor-pointer ${
                sort === 'az' ? 'bg-amber-color/15 text-amber-color' : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-pressed={sort === 'az'}
            >
              <ArrowDownAZ className="h-3 w-3" /> A–Z
            </button>
          </div>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="flex items-center gap-1.5 rounded-lg border border-border-color px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-amber-color/40 hover:text-foreground"
            >
              <X className="h-3 w-3" /> Clear search
            </button>
          )}
        </div>
      </div>

      {/* Live region announcing result counts for screen readers */}
      <p aria-live="polite" className="sr-only">
        {visible.length} of {SITE_PROJECTS.length} projects shown.
      </p>

      {/* Kind filter chips */}
      <div className="mb-5 flex flex-wrap gap-1.5" role="group" aria-label="Filter projects by type">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full border px-3 py-1 font-mono text-[11px] font-semibold transition-colors cursor-pointer ${
              filter === f.id
                ? 'border-amber-color/50 bg-amber-color/10 text-amber-color'
                : 'border-border-color bg-muted/20 text-muted-foreground hover:text-foreground hover:border-amber-color/30'
            }`}
            aria-pressed={filter === f.id}
          >
            {f.label}
            <span className="ml-1 opacity-60">
              {f.id === 'all'
                ? SITE_PROJECTS.length
                : SITE_PROJECTS.filter(p => p.kind === f.id).length}
            </span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border-color py-14 text-center">
          <Search className="h-6 w-6 text-muted-foreground/50" aria-hidden="true" />
          <p className="font-mono text-xs text-muted-foreground">
            No projects match “{query}” {filter !== 'all' ? `in ${filter}` : ''}.
          </p>
          <button
            onClick={() => { setQuery(''); setFilter('all'); }}
            className="rounded-lg bg-amber-color px-3 py-1.5 font-mono text-xs font-bold text-[#030c14] hover:bg-amber-glow"
          >
            Reset
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p, i) => (
            <ProjectCard key={p.name} project={p} index={i} />
          ))}
        </div>
      )}

      <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] text-muted-foreground/70">
        <span className="inline-flex items-center gap-1"><Github className="h-3 w-3" /> Source on github.com/DLinacre</span>
        <span className="inline-flex items-center gap-1"><ExternalLink className="h-3 w-3" /> Live apps open in a new tab</span>
        <span className="inline-flex items-center gap-1"><Lock className="h-3 w-3" /> Private work stays private</span>
      </p>
    </section>
  );
}
