import { ArrowUpRight, Code2 } from 'lucide-react';
import { SITE_PROJECTS } from '../data/siteProjects';
import Card3DTilt from './Card3DTilt';

/**
 * FeaturedSpotlight — a hero banner of the featured flagship projects.
 * Enhanced with 3D physical card tilt and holographic glare.
 */
export default function FeaturedSpotlight() {
  const featured = SITE_PROJECTS.filter(p => p.featured && !p.private);

  if (featured.length === 0) return null;

  return (
    <section aria-labelledby="featured-heading" className="scroll-mt-24">
      <div className="mb-3 flex items-center gap-2">
        <h2
          id="featured-heading"
          className="feature-section__title font-display text-xs font-bold uppercase tracking-wider text-[#9aa3b2]"
        >
          Flagship work
        </h2>
        <span className="h-px flex-1 bg-white/[0.08]" />
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
            <Card3DTilt key={p.name} className="flex flex-col h-full">
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                style={{ animationDelay: `${i * 40}ms` }}
                className="featured-spotlight__card group relative flex flex-1 flex-col justify-between overflow-hidden rounded-xl border border-white/[0.08] bg-[#0e1016] transition-all duration-200 hover:border-[#8fd6ff]/50 hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-[#05060a]">
                  {p.artwork ? (
                    <>
                      <img
                        src={p.artwork}
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
                        {p.emoji ?? '📦'}
                      </span>
                    </>
                  ) : (
                    <span
                      className="grid h-full w-full place-items-center text-3xl"
                      aria-hidden="true"
                    >
                      {p.emoji ?? '📦'}
                    </span>
                  )}
                  <span className="absolute left-2 top-2 rounded-full border border-amber-400/30 bg-black/75 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-amber-300 backdrop-blur">
                    Featured
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-1.5 p-3">
                  <h3 className="font-display text-sm font-bold text-white group-hover:text-[#8fd6ff] transition-colors">
                    {p.name}
                  </h3>
                  <p className="line-clamp-2 text-xs leading-relaxed text-[#9aa3b2]">{p.blurb}</p>
                  {p.tech && p.tech.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-1 pt-1">
                      {p.tech.slice(0, 2).map(t => (
                        <span
                          key={t}
                          className="rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[9px] text-[#a2adbc]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.06] px-3 py-2 font-mono text-[10px] text-[#a2adbc]">
                  <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                    {host ? (
                      <>
                        <ArrowUpRight className="h-3 w-3" />
                        <span>{host}</span>
                      </>
                    ) : (
                      <>
                        <Code2 className="h-3 w-3" />
                        <span>Source only</span>
                      </>
                    )}
                  </span>
                  <span className="text-[#8fd6ff] opacity-0 transition-opacity group-hover:opacity-100">
                    Open →
                  </span>
                </div>
              </a>
            </Card3DTilt>
          );
        })}
      </div>
    </section>
  );
}
