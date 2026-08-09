import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Github, Lock, CalendarDays, Layers, Play } from 'lucide-react';
import type { SiteProject } from '../data/siteProjects';
import { KIND_META } from './projectMeta';

interface Props {
  project: SiteProject | null;
  onClose: () => void;
}

function hostOf(url?: string): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

/**
 * ProjectDetailModal — an accessible detail panel for a project.
 * Focus is moved into the dialog, trapped, restored on close; Escape and
 * backdrop click dismiss it; body scroll is locked while open.
 */
export default function ProjectDetailModal({ project, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!project) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 60);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = 'unset';
      previouslyFocused.current?.focus();
    };
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [project, onClose]);

  // Basic focus trap: keep Tab cycling within the panel.
  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !panelRef.current) return;
    const focusables = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter(el => !el.hasAttribute('disabled'));
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const meta = project ? KIND_META[project.kind] : null;
  const isPrivate = project?.kind === 'Private' || project?.private;
  const href = project?.url || project?.repo;
  const isExternal = href?.startsWith('http');
  const host = project ? hostOf(project.url || project.repo) : null;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="detail-overlay"
          className="fixed inset-0 z-50 overflow-y-auto bg-background/80 backdrop-blur-md p-4"
          role="presentation"
          onClick={e => {
            if (e.target === e.currentTarget) onClose();
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${project.name} details`}
            onKeyDown={onPanelKeyDown}
            className="relative mx-auto mt-[5vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-border-color bg-[var(--linacre-panel)] shadow-[var(--linacre-glow-strong)]"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {/* Banner / artwork header */}
            <div className="relative h-40 w-full bg-muted/30">
              {project.artwork ? (
                <img src={project.artwork} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="grid h-full w-full place-items-center text-6xl" aria-hidden="true">
                  {project.emoji ?? '📦'}
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--linacre-panel)] to-transparent" />
              <button
                ref={closeBtnRef}
                onClick={onClose}
                aria-label="Close project details"
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-lg border border-border-color bg-[#030c14]/70 text-foreground backdrop-blur transition-colors hover:text-amber-color"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-5">
              {/* Title + kind */}
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
                  {project.name}
                </h2>
                {project.badge === 'NEW' && (
                  <span className="rounded bg-amber-color/15 px-1.5 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider text-amber-color">
                    New
                  </span>
                )}
                {meta && (
                  <span className={`rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${meta.chip}`}>
                    {meta.label}
                  </span>
                )}
                {isPrivate && (
                  <span className="flex items-center gap-1 rounded border border-border-color px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                    <Lock className="h-3 w-3" /> Private
                  </span>
                )}
              </div>

              {/* Blurb */}
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{project.blurb}</p>

              {/* Highlights */}
              {project.highlights && project.highlights.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-color">
                    Why it stands out
                  </h3>
                  <ul className="mt-2 space-y-1.5">
                    {project.highlights.map(h => (
                      <li key={h} className="flex gap-2 text-xs leading-5 text-foreground/90">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-color" aria-hidden="true" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Meta grid */}
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {project.tech && project.tech.length > 0 && (
                  <div className="rounded-lg border border-border-color bg-muted/15 p-2.5">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <Layers className="h-3 w-3" /> Stack
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {project.tech.map(t => (
                        <span key={t} className="rounded bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="rounded-lg border border-border-color bg-muted/15 p-2.5">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <CalendarDays className="h-3 w-3" /> Year
                  </div>
                  <div className="mt-1.5 font-mono text-xs text-foreground/90">
                    {project.year ?? '—'}
                  </div>
                  {host && (
                    <div className="mt-1 font-mono text-[10px] text-muted-foreground/70">via {host}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 border-t border-border-color/60 p-4">
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-border-color px-3 py-2 font-mono text-xs font-bold text-foreground transition-colors hover:border-amber-color/40 hover:bg-muted/30"
                >
                  <Github className="h-3.5 w-3.5" /> Source
                </a>
              )}
              {href && !isPrivate && (
                <a
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-color px-3 py-2 font-mono text-xs font-bold text-[#030c14] transition-colors hover:bg-amber-glow"
                >
                  {project.url?.startsWith('/games/') ? (
                    <Play className="h-3.5 w-3.5 fill-current" />
                  ) : (
                    <ExternalLink className="h-3.5 w-3.5" />
                  )}
                  {isPrivate ? 'Private' : project.url ? 'Open project' : 'View source'}
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
