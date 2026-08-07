import { useMemo, useState } from 'react';
import { ArrowUpRight, ExternalLink, Github, Lock, Search, X } from 'lucide-react';
import { motion } from 'motion/react';
import { SITE_PROJECTS, ProjectKind, type SiteProject } from '../data/siteProjects';

const KIND_META: Record<ProjectKind, { label: string; className: string; dot: string }> = {
  App:    { label: 'App',    className: 'text-cyan bg-cyan/10 border-cyan/25', dot: 'bg-cyan' },
  Tool:   { label: 'Tool',   className: 'text-emerald-color bg-emerald-color/10 border-emerald-color/25', dot: 'bg-emerald-color' },
  AI:     { label: 'AI',     className: 'text-purple-color bg-purple-color/10 border-purple-color/25', dot: 'bg-purple-color' },
  Game:   { label: 'Game',   className: 'text-amber-color bg-amber-color/10 border-amber-color/25', dot: 'bg-amber-color' },
  DevOps: { label: 'DevOps', className: 'text-cyan/80 bg-cyan/5 border-cyan/20', dot: 'bg-cyan/80' },
  Source: { label: 'Source', className: 'text-muted-foreground bg-muted/40 border-border-color', dot: 'bg-muted-foreground' },
  Private:{ label: 'Private',className: 'text-muted-foreground bg-muted/30 border-border-color', dot: 'bg-muted-foreground' },
};

const FILTERS: Array<{ id: ProjectKind | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'App', label: 'Apps' },
  { id: 'Tool', label: 'Tools' },
  { id: 'AI', label: 'AI' },
  { id: 'Game', label: 'Games' },
  { id: 'DevOps', label: 'DevOps' },
];

interface ProjectGridProps {
  query: string;
  setQuery: (q: string) => void;
}

function ProjectCard({ project, index }: { project: SiteProject; index: number }) {
  const meta = KIND_META[project.kind];
  const href = project.url || project.repo;
  const isPrivate = project.kind === 'Private' || project.private;

  const card = (
    <article
      className="group relative flex h-full flex-col rounded-xl border border-border-color bg-[var(--linacre-panel)] p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan/40 hover:shadow-[var(--linacre-glow-soft)]"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-color bg-muted/30 text-base">
          {project.emoji ?? '📦'}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-display text-sm font-bold text-foreground group-hover:text-cyan transition-colors">
              {project.name}
            </h3>
            <span className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${meta.className}`}>
              {meta.label}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
            {project.blurb}
          </p>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5 font-mono text-[10px] text-muted-foreground/70">
          {isPrivate ? (
            <>
              <Lock className="h-3 w-3 shrink-0" />
              <span className="truncate">Private repo</span>
            </>
          ) : href ? (
            <>
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${meta.dot}`} />
              <span className="truncate">{project.url ? 'Live' : 'Open source'}</span>
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

export default function ProjectGrid({ query, setQuery }: ProjectGridProps) {
  const [filter, setFilter] = useStateSafe<ProjectKind | 'all'>('all');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SITE_PROJECTS.filter(p => {
      if (filter !== 'all' && p.kind !== filter) return false;
      if (!q) return true;
      const haystack = [p.name, p.blurb, p.kind, ...p.tags].join(' ').toLowerCase();
      return q.split(/\s+/).every(term => haystack.includes(term));
    });
  }, [query, filter]);

  return (
    <section aria-labelledby="all-projects-heading" className="scroll-mt-24">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="all-projects-heading" className="font-display text-xl font-bold tracking-tight text-foreground">
          All projects
          <span className="ml-2 align-middle font-mono text-[11px] font-semibold text-muted-foreground">
            {SITE_PROJECTS.length} · {visible.length} shown
          </span>
        </h2>
        {query && (
          <button
            onClick={() => setQuery('')}
            className="flex items-center gap-1.5 rounded-lg border border-border-color px-2.5 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:border-amber-color/40 hover:text-foreground"
          >
            <X className="h-3 w-3" /> Clear search
          </button>
        )}
      </div>

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
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border-color py-14 text-center">
          <Search className="h-6 w-6 text-muted-foreground/50" aria-hidden="true" />
          <p className="font-mono text-xs text-muted-foreground">
            No projects match “{query}”.
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

/** Tiny state helper so the grid keeps filter state across parent re-renders. */
function useStateSafe<T>(initial: T): [T, (v: T) => void] {
  return useState<T>(initial);
}
