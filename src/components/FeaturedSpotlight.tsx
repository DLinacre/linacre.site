import { ArrowUpRight, Code2 } from 'lucide-react';
import { motion } from 'motion/react';
import { SITE_PROJECTS } from '../data/siteProjects';

/**
 * FeaturedSpotlight — a hero banner of the featured flagship projects.
 * Shown at the top of the Start page so visitors land on the best work first.
 */
export default function FeaturedSpotlight() {
  const featured = SITE_PROJECTS.filter(p => p.featured && !p.private);

  if (featured.length === 0) return null;

  return (
    <section aria-labelledby="featured-heading" className="scroll-mt-24">
      <div className="mb-3 flex items-center gap-2">
        <h2 id="featured-heading" className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Featured work
        </h2>
        <span className="h-px flex-1 bg-border-color" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((p, i) => {
          const href = p.url || p.repo;
          const isExternal = href?.startsWith('http');
          const host = (() => {
            try {
              return new URL(href!).hostname.replace(/^www\./, '');
            } catch {
              return null;
            }
          })();
          return (
            <motion.a
              key={p.name}
              href={href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border-color bg-[var(--linacre-panel)] transition-all duration-200 hover:-translate-y-1 hover:border-amber-color/45 hover:shadow-[var(--linacre-glow-soft)]"
            >
              <div className="relative h-28 w-full overflow-hidden bg-muted/30">
                {p.artwork ? (
                  <img
                    src={p.artwork}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <span className="grid h-full w-full place-items-center text-4xl" aria-hidden="true">
                    {p.emoji ?? '📦'}
                  </span>
                )}
                <span className="absolute left-2 top-2 rounded bg-[#030c14]/70 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-amber-color backdrop-blur">
                  Featured
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-1.5 p-3.5">
                <h3 className="font-display text-sm font-bold text-foreground group-hover:text-cyan transition-colors">
                  {p.name}
                </h3>
                <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">{p.blurb}</p>
                {p.tech && p.tech.length > 0 && (
                  <div className="mt-auto flex flex-wrap gap-1 pt-1.5">
                    {p.tech.slice(0, 2).map(t => (
                      <span key={t} className="rounded bg-muted/40 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                        {t}
                      </span>
                    ))}
                    {p.repo && (
                      <span className="flex items-center gap-1 rounded bg-muted/40 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                        <Code2 className="h-2.5 w-2.5" /> Source
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-border-color/60 px-3.5 py-2">
                <span className="truncate font-mono text-[10px] text-muted-foreground/70">
                  {host ?? 'Private'}
                </span>
                <span className="flex shrink-0 items-center gap-1 font-mono text-[10px] font-bold text-amber-color">
                  Open <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}
