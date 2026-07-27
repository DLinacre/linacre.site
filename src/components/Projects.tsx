import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  ExternalLink,
  Github,
  Globe2,
  Layers3,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
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

const FEATURED_ORDER = ["PokéFlip AI 🎴", "Nic's Food Decider 🍕", 'APKHub 📱', 'Linacre Uninstaller', 'OmniRoute LLM Engine', 'Fleatment 🐱', 'Personal OP Agent', 'Arena Audit Prompt Builder', 'PokeGuru', 'Apex POS', 'Mob Deals'];

function projectRank(project: Project) {
  const featured = FEATURED_ORDER.indexOf(project.name);
  if (featured >= 0) return featured;
  if (project.liveUrl) return 10;
  return 20;
}

export default function Projects() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [liveOnly, setLiveOnly] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);

  const categories = useMemo(() => [
    { id: 'all', label: 'All selected work' },
    ...Array.from(new Set(PROJECTS.map((project) => project.category))).map((id) => ({
      id,
      label: CATEGORY_META[id]?.label || id,
    })),
  ], []);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return PROJECTS
      .filter((project) => category === 'all' || project.category === category)
      .filter((project) => !liveOnly || project.live === true)
      .filter((project) => {
        if (!needle) return true;
        return [
          project.name,
          project.description,
          project.role,
          project.challenges,
          project.solution,
          project.tag,
          ...(project.tech || []),
        ].filter(Boolean).join(' ').toLowerCase().includes(needle);
      })
      .sort((a, b) => projectRank(a) - projectRank(b) || a.name.localeCompare(b.name));
  }, [category, query, liveOnly]);

  const featured = FEATURED_ORDER
    .map((name) => PROJECTS.find((project) => project.name === name))
    .filter((project): project is Project => Boolean(project));

  const runnableCount = PROJECTS.filter((project) => project.liveUrl).length;
  const technologyCount = new Set(PROJECTS.flatMap((project) => project.tech || [])).size;

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
              No empty experiments, fake case studies, or inflated claims. This is a smaller portfolio of working products, downloadable releases, and inspectable engineering systems with a clear reason to exist.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#selected-work" className="inline-flex items-center gap-2 rounded-xl bg-amber-color px-4 py-3 font-mono text-xs font-bold text-[#031018] hover:bg-amber-glow">
                Explore selected work <ArrowRight className="h-4 w-4" />
              </a>
              <a href="https://github.com/LIN4CRE" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-border-color bg-muted/20 px-4 py-3 font-mono text-xs font-bold text-foreground hover:border-amber-color/50">
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
              <div key={label} className="rounded-2xl border border-border-color bg-background/45 p-4">
                <strong className="block font-display text-2xl font-bold text-foreground sm:text-3xl">{value}</strong>
                <span className="mt-1 block font-mono text-[9px] uppercase tracking-wider text-muted-foreground sm:text-[10px]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-5" aria-labelledby="featured-work-title">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-color">Best of the stack</span>
            <h2 id="featured-work-title" className="mt-1 font-display text-2xl font-bold text-foreground sm:text-3xl">The projects actually running right now</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">Useful now, easy to inspect, and strong enough to explain in one sentence.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {featured.map((project, index) => (
            <motion.article
              key={project.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.06 }}
              className="group flex flex-col rounded-2xl border border-border-color bg-[var(--linacre-panel)] p-5 transition-all hover:-translate-y-1 hover:border-amber-color/40 hover:shadow-[var(--linacre-glow-soft)]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-amber-color/20 bg-amber-color/10 text-amber-color"><Star className="h-4 w-4" /></span>
                <span className="rounded-full border border-emerald-color/20 bg-emerald-color/10 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-color">Featured</span>
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-foreground group-hover:text-amber-color">{project.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{project.description}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {(project.tech || []).slice(0, 4).map((tech) => <span key={tech} className="rounded-full border border-border-color bg-background/40 px-2 py-1 font-mono text-[9px] text-muted-foreground">{tech}</span>)}
              </div>
              <div className="mt-5 flex gap-2 border-t border-border-color pt-4">
                {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-amber-color px-3 py-2 font-mono text-[10px] font-bold text-[#031018]">Open live <ExternalLink className="h-3.5 w-3.5" /></a>}
                <button onClick={() => setSelected(project)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border-color px-3 py-2 font-mono text-[10px] font-bold text-foreground hover:border-amber-color/50">Case study <ArrowRight className="h-3.5 w-3.5" /></button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="selected-work" className="scroll-mt-28 space-y-5" aria-labelledby="all-projects-title">
        <div className="rounded-2xl border border-border-color bg-muted/10 p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 id="all-projects-title" className="font-display text-xl font-bold text-foreground">Selected work</h2>
              <p className="mt-1 text-xs text-muted-foreground">Search by product, platform, or technology.</p>
            </div>
            <label className="relative block w-full lg:max-w-sm">
              <span className="sr-only">Search selected projects</span>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search projects…" className="h-11 w-full rounded-xl border border-border-color bg-background/45 pl-10 pr-4 font-mono text-xs text-foreground focus:border-amber-color focus:outline-none" />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 border-t border-border-color pt-4">
            <button
              onClick={() => { setLiveOnly((v) => !v); setCategory('all'); }}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 font-mono text-[10px] font-bold transition-colors ${
                liveOnly
                  ? 'border-emerald-color bg-emerald-color/15 text-emerald-color'
                  : 'border-border-color bg-background/30 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Zap className="h-3 w-3" />
              Live now
            </button>
            {categories.map((option) => (
              <button
                key={option.id}
                onClick={() => { setCategory(option.id); setLiveOnly(false); }}
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
          <span>{visible.length} project{visible.length === 1 ? '' : 's'}{liveOnly ? ' · live only' : ''}</span>
          <span>Public portfolio · reviewed July 2026</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((project) => {
            const meta = CATEGORY_META[project.category] || CATEGORY_META.build;
            return (
              <article key={project.name} className="group flex flex-col overflow-hidden rounded-2xl border border-border-color bg-[var(--linacre-panel)] transition-all hover:border-border-hi hover:shadow-[var(--linacre-glow-soft)]">
                <div className="h-1" style={{ background: `linear-gradient(90deg, ${meta.colour}, #34D399)` }} />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em]" style={{ color: meta.colour }}>{meta.label}</span>
                      <h3 className="mt-1 font-display text-lg font-bold text-foreground">{project.name}</h3>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      {project.live && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-color/10 px-2 py-0.5 font-mono text-[8px] font-bold text-emerald-color">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-color animate-pulse" />
                          Live
                        </span>
                      )}
                      <span className="max-w-[9rem] truncate rounded-full border border-border-color bg-muted/20 px-2 py-1 font-mono text-[8px] uppercase tracking-wider text-muted-foreground">{project.tag}</span>
                    </div>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">{(project.tech || []).slice(0, 5).map((tech) => <span key={tech} className="rounded-full border border-border-color bg-background/40 px-2 py-1 font-mono text-[9px] text-muted-foreground">{tech}</span>)}</div>
                  <div className="mt-5 flex items-center justify-between gap-2 border-t border-border-color pt-4">
                    <span className="flex min-w-0 items-center gap-1.5 truncate font-mono text-[9px] text-muted-foreground"><Globe2 className="h-3 w-3 shrink-0" />{project.host}</span>
                    <div className="flex items-center gap-2.5">
                      {(project.liveUrl || project.url) && (
                        <a href={project.liveUrl || project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-color hover:underline">
                          Open live <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      <button onClick={() => setSelected(project)} className="inline-flex shrink-0 items-center gap-1 font-mono text-[10px] font-bold text-amber-color hover:text-amber-glow">
                        Case study <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {visible.length === 0 && <div className="rounded-2xl border border-dashed border-border-color p-12 text-center font-mono text-xs text-muted-foreground">No selected projects match that search.</div>}
      </section>

      <section className="rounded-2xl border border-amber-color/20 bg-amber-color/[0.05] p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-color">The rest stays on GitHub</span>
            <h2 className="mt-2 font-display text-2xl font-bold text-foreground">A portfolio should be edited, not mirrored.</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Older experiments and work-in-progress repositories are intentionally excluded here until they have a clear user, reliable documentation, and something real to try or inspect.</p>
          </div>
          <a href="https://github.com/LIN4CRE?tab=repositories" target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-border-color bg-background/30 px-4 py-3 font-mono text-xs font-bold text-foreground hover:border-amber-color/50"><Layers3 className="h-4 w-4" /> All repositories</a>
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] grid place-items-center bg-[#020a11]/85 p-4 backdrop-blur-md" onClick={() => setSelected(null)}>
            <motion.div initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }} role="dialog" aria-modal="true" aria-labelledby="project-dialog-title" onClick={(event) => event.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border-color bg-[#061520] shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border-color bg-[#061520]/95 px-5 py-4 backdrop-blur-xl">
                <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-color"><Sparkles className="h-4 w-4" /> Selected case study</div>
                <button onClick={() => setSelected(null)} className="grid h-9 w-9 place-items-center rounded-lg border border-border-color text-muted-foreground hover:text-foreground" aria-label="Close project details"><X className="h-4 w-4" /></button>
              </div>
              <div className="space-y-6 p-5 sm:p-7">
                <div>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-amber-color">{selected.tag}</span>
                  <h2 id="project-dialog-title" className="mt-2 font-display text-3xl font-bold text-foreground">{selected.name}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{selected.description}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border-color bg-background/25 p-4"><span className="font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-color">The problem</span><p className="mt-2 text-xs leading-6 text-muted-foreground">{selected.challenges}</p></div>
                  <div className="rounded-xl border border-border-color bg-background/25 p-4"><span className="font-mono text-[9px] font-bold uppercase tracking-wider text-amber-color">The response</span><p className="mt-2 text-xs leading-6 text-muted-foreground">{selected.solution}</p></div>
                </div>

                <div>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Role</span>
                  <p className="mt-1 text-sm text-foreground">{selected.role}</p>
                </div>

                <div className="flex flex-wrap gap-2">{(selected.tech || []).map((tech) => <span key={tech} className="rounded-full border border-border-color bg-background/30 px-2.5 py-1.5 font-mono text-[9px] text-muted-foreground">{tech}</span>)}</div>

                <div className="flex flex-col gap-2 border-t border-border-color pt-5 sm:flex-row">
                  {selected.liveUrl && <a href={selected.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-color px-4 py-3 font-mono text-xs font-bold text-[#031018]">Open live / download <ExternalLink className="h-4 w-4" /></a>}
                  {selected.repoUrl && <a href={selected.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border-color px-4 py-3 font-mono text-xs font-bold text-foreground hover:border-amber-color/50"><Github className="h-4 w-4" /> View source</a>}
                  <a href="/contact" onClick={() => setSelected(null)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-amber-color/30 bg-amber-color/10 px-4 py-3 font-mono text-xs font-bold text-amber-color hover:bg-amber-color/20">Get in touch →</a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
