import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  ExternalLink,
  Github,
  Layers3,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { PROJECTS } from '../data';
import { Project } from '../types';

const CATEGORY_META: Record<string, { label: string; colour: string }> = {
  build: { label: 'Apps & tools', colour: '#22D3EE' },
  deploy: { label: 'Systems & DevOps', colour: '#34D399' },
  design: { label: 'Interactive', colour: '#818CF8' },
};

const FEATURED_ORDER = [
  'KushCloud 🌿',
  'Depths of Destiny ⚔️',
  'FaceRater AI ✨',
  'PokéFlip AI 🎴',
  'Grumpy Guy AI ಠ_ಠ',
  'Smart Mail AI ✉️',
  'Dragon Rush Heroes 🐉',
  'Pixel Heist 🚨',
  'Slime Factory Tycoon 🟢',
  'GlitchArt Engine 🎨',
];

function projectRank(project: Project) {
  const featured = FEATURED_ORDER.indexOf(project.name);
  if (featured >= 0) return featured;
  if (project.liveUrl) return 10;
  return 20;
}

function ProjectCard({ project }: { project: Project }) {
  const isGame =
    project.actionType === 'play' ||
    project.badgeLabel?.includes('Game') ||
    project.category === 'design';
  const liveTargetUrl = project.liveUrl || project.url;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border-color bg-[#061520] shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]">
      {/* Banner image with overlay badges */}
      <div className="relative aspect-[2.1/1] w-full overflow-hidden bg-[#031018]">
        <img
          src={project.bannerImage || '/og.png'}
          alt={project.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#061520] via-transparent to-black/30" />

        {/* Top-left handle badge */}
        <span className="absolute left-3 top-3 rounded-md border border-cyan/40 bg-black/75 px-2.5 py-1 font-mono text-[10px] font-bold text-cyan backdrop-blur-md">
          {project.authorHandle || '@LIN4CRE'}
        </span>

        {/* Top-right category/status badge */}
        <span className="absolute right-3 top-3 rounded-md border border-cyan/40 bg-black/75 px-2.5 py-1 font-mono text-[10px] font-bold text-cyan backdrop-blur-md">
          {project.badgeLabel || project.tag}
        </span>
      </div>

      {/* Content body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-bold text-foreground group-hover:text-cyan">
          {project.name}
        </h3>
        <p className="mt-2.5 flex-1 text-sm leading-6 text-muted-foreground line-clamp-3">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[10px]">
          {(project.tech || []).slice(0, 4).map(tech => (
            <span
              key={tech}
              className="rounded-md border border-border-color bg-background/50 px-2 py-1 text-muted-foreground"
            >
              {tech}
            </span>
          ))}
          {(project.tech || []).length > 4 && (
            <span className="rounded-md border border-border-color bg-background/50 px-2 py-1 text-muted-foreground">
              +{(project.tech || []).length - 4}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex items-center gap-2 border-t border-border-color pt-4">
          {liveTargetUrl ? (
            <a
              href={liveTargetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#22D3EE] px-4 py-2.5 font-mono text-xs font-bold text-[#031018] shadow-sm transition-all hover:bg-cyan/90"
            >
              {isGame ? (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" /> Play Game
                </>
              ) : (
                <>
                  <ExternalLink className="h-3.5 w-3.5" /> Open App
                </>
              )}
            </a>
          ) : null}

          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border-color bg-background/50 px-3.5 py-2.5 font-mono text-xs font-bold text-foreground transition-colors hover:border-cyan/50"
            >
              <Github className="h-3.5 w-3.5" /> Code
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [liveOnly, setLiveOnly] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);

  const categories = useMemo(
    () => [
      { id: 'all', label: 'All selected work' },
      ...Array.from(new Set(PROJECTS.map(project => project.category))).map(id => ({
        id,
        label: CATEGORY_META[id]?.label || id,
      })),
    ],
    [],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return PROJECTS.filter(project => category === 'all' || project.category === category)
      .filter(project => !liveOnly || project.live === true)
      .filter(project => {
        if (!needle) return true;
        return [
          project.name,
          project.description,
          project.role,
          project.challenges,
          project.solution,
          project.tag,
          ...(project.tech || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(needle);
      })
      .sort((a, b) => projectRank(a) - projectRank(b) || a.name.localeCompare(b.name));
  }, [category, query, liveOnly]);

  const featured = FEATURED_ORDER.map(name =>
    PROJECTS.find(project => project.name === name),
  ).filter((project): project is Project => Boolean(project));

  const runnableCount = PROJECTS.filter(project => project.liveUrl).length;
  const technologyCount = new Set(PROJECTS.flatMap(project => project.tech || [])).size;

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-border-color bg-[var(--linacre-panel)] p-6 shadow-[var(--linacre-card-shadow)] sm:p-8 lg:p-10">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-color/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-cyan/10 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-color">
              <ShieldCheck className="h-4 w-4" /> Curated, verified, public
            </span>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl">
              Every project here <span className="text-amber-color">earns its place.</span>
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
              No empty experiments, fake case studies, or inflated claims. This is a smaller
              portfolio of working products, downloadable releases, and inspectable engineering
              systems with a clear reason to exist.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#selected-work"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-color px-4 py-3 font-mono text-xs font-bold text-[#031018] hover:bg-amber-glow"
              >
                Explore selected work <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/LIN4CRE"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border-color bg-muted/20 px-4 py-3 font-mono text-xs font-bold text-foreground hover:border-amber-color/50"
              >
                <Github className="h-4 w-4" /> GitHub profile
              </a>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-1">
            {[
              [PROJECTS.length, 'Curated projects'],
              [runnableCount, 'Live / downloadable'],
              [technologyCount, 'Technologies'],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-border-color bg-background/45 p-4"
              >
                <strong className="block font-display text-2xl font-bold text-foreground sm:text-3xl">
                  {value}
                </strong>
                <span className="mt-1 block font-mono text-[9px] uppercase tracking-wider text-muted-foreground sm:text-[10px]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-5" aria-labelledby="featured-work-title">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-color">
              Best of the stack
            </span>
            <h2
              id="featured-work-title"
              className="mt-1 font-display text-2xl font-bold text-foreground sm:text-3xl"
            >
              The projects actually running right now
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Useful now, easy to inspect, and strong enough to explain in one sentence.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
          {featured.map(project => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </section>

      <section
        id="selected-work"
        className="scroll-mt-28 space-y-5"
        aria-labelledby="all-projects-title"
      >
        <div className="rounded-2xl border border-border-color bg-muted/10 p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2
                id="all-projects-title"
                className="font-display text-xl font-bold text-foreground"
              >
                Selected work
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Search by product, platform, or technology.
              </p>
            </div>
            <label className="relative block w-full lg:max-w-sm">
              <span className="sr-only">Search selected projects</span>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                type="search"
                placeholder="Search projects…"
                className="h-11 w-full rounded-xl border border-border-color bg-background/45 pl-10 pr-4 font-mono text-xs text-foreground focus:border-amber-color focus:outline-none"
              />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 border-t border-border-color pt-4">
            <button
              onClick={() => {
                setLiveOnly(v => !v);
                setCategory('all');
              }}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 font-mono text-[10px] font-bold transition-colors ${
                liveOnly
                  ? 'border-emerald-color bg-emerald-color/15 text-emerald-color'
                  : 'border-border-color bg-background/30 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Zap className="h-3 w-3" />
              Live now
            </button>
            {categories.map(option => (
              <button
                key={option.id}
                onClick={() => {
                  setCategory(option.id);
                  setLiveOnly(false);
                }}
                className={`rounded-full border px-3 py-2 font-mono text-[10px] font-bold ${
                  !liveOnly && category === option.id
                    ? 'border-amber-color bg-amber-color text-[#031018]'
                    : 'border-border-color bg-background/30 text-muted-foreground hover:text-foreground'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>
            {visible.length} project{visible.length === 1 ? '' : 's'}
            {liveOnly ? ' · live only' : ''}
          </span>
          <span>Public portfolio · reviewed July 2026</span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 max-w-4xl mx-auto">
          {visible.map(project => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>

        {visible.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border-color p-12 text-center font-mono text-xs text-muted-foreground">
            No selected projects match that search.
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-amber-color/20 bg-amber-color/[0.05] p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-color">
              The rest stays on GitHub
            </span>
            <h2 className="mt-2 font-display text-2xl font-bold text-foreground">
              A portfolio should be edited, not mirrored.
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Older experiments and work-in-progress repositories are intentionally excluded here
              until they have a clear user, reliable documentation, and something real to try or
              inspect.
            </p>
          </div>
          <a
            href="https://github.com/LIN4CRE?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-border-color bg-background/30 px-4 py-3 font-mono text-xs font-bold text-foreground hover:border-amber-color/50"
          >
            <Layers3 className="h-4 w-4" /> All repositories
          </a>
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] grid place-items-center bg-[#020a11]/85 p-4 backdrop-blur-md"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-dialog-title"
              onClick={event => event.stopPropagation()}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border-color bg-[#061520] shadow-2xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border-color bg-[#061520]/95 px-5 py-4 backdrop-blur-xl">
                <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-color">
                  <Sparkles className="h-4 w-4" /> Selected case study
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border-color text-muted-foreground hover:text-foreground"
                  aria-label="Close project details"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-6 p-5 sm:p-7">
                <div>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-amber-color">
                    {selected.tag}
                  </span>
                  <h2
                    id="project-dialog-title"
                    className="mt-2 font-display text-3xl font-bold text-foreground"
                  >
                    {selected.name}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {selected.description}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border-color bg-background/25 p-4">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-color">
                      The problem
                    </span>
                    <p className="mt-2 text-xs leading-6 text-muted-foreground">
                      {selected.challenges}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border-color bg-background/25 p-4">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-amber-color">
                      The response
                    </span>
                    <p className="mt-2 text-xs leading-6 text-muted-foreground">
                      {selected.solution}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                    Role
                  </span>
                  <p className="mt-1 text-sm text-foreground">{selected.role}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(selected.tech || []).map(tech => (
                    <span
                      key={tech}
                      className="rounded-full border border-border-color bg-background/30 px-2.5 py-1.5 font-mono text-[9px] text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col gap-2 border-t border-border-color pt-5 sm:flex-row">
                  {selected.liveUrl && (
                    <a
                      href={selected.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-color px-4 py-3 font-mono text-xs font-bold text-[#031018]"
                    >
                      Open live / download <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  {selected.repoUrl && (
                    <a
                      href={selected.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border-color px-4 py-3 font-mono text-xs font-bold text-foreground hover:border-amber-color/50"
                    >
                      <Github className="h-4 w-4" /> View source
                    </a>
                  )}
                  <a
                    href="/contact"
                    onClick={() => setSelected(null)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-amber-color/30 bg-amber-color/10 px-4 py-3 font-mono text-xs font-bold text-amber-color hover:bg-amber-color/20"
                  >
                    Get in touch →
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
