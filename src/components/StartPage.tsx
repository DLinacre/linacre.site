import { useEffect, useMemo, useState } from 'react';
import { Github, Search, X } from 'lucide-react';
import ProjectGrid from './ProjectGrid';
import FeaturedSpotlight from './FeaturedSpotlight';
import { SITE_PROJECT_COUNT } from '../data/siteProjects';

interface StartPageProps {
  navigate: (tab: string) => void;
}

/**
 * StartPage — the launchpad: a search bar over a complete, compact display
 * of every project, ordered by usefulness. Search filters name, blurb,
 * tags and type live; the grid below doubles as the site's project index.
 */
export default function StartPage({ navigate }: StartPageProps) {
  const [now, setNow] = useState(() => new Date());
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const greeting = useMemo(() => {
    const hour = now.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, [now]);

  const dateLine = now.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="space-y-10">
      {/* Hero + search */}
      <section className="relative pt-2 sm:pt-8" aria-labelledby="start-heading">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan/10 blur-3xl pointer-events-none" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-5 flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] text-muted-foreground">
            <span className="rounded-full border border-amber-color/20 bg-amber-color/5 px-3 py-1 text-amber-color">
              {greeting}
            </span>
            <span>{dateLine}</span>
          </div>

          <h1
            id="start-heading"
            className="font-display text-4xl font-bold tracking-[-0.045em] text-foreground sm:text-5xl lg:text-6xl text-balance"
          >
            Everything I build, <span className="text-amber-color">one search away</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {SITE_PROJECT_COUNT} live apps, tools, AI products and games — ordered by how useful
            they are. Search below, or jump in with the dock.
          </p>

          <div className="mx-auto mt-8 max-w-3xl" role="search">
            <label htmlFor="start-search" className="sr-only">
              Search all projects, tools and games
            </label>
            <div className="group relative rounded-2xl border border-amber-color/25 bg-[var(--linacre-panel)] p-2 shadow-[0_20px_70px_rgba(0,0,0,0.25)] transition-all focus-within:border-amber-color/60 focus-within:shadow-[0_0_40px_rgba(34,211,238,0.12)]">
              <Search
                className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-amber-color"
                aria-hidden="true"
              />
              <input
                id="start-search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                className="h-12 w-full bg-transparent pl-12 pr-12 font-mono text-sm text-foreground placeholder:text-muted-foreground/65 focus:outline-none"
                placeholder="Search projects, tools and games… try “AI”, “Roblox” or “SIM”"
                autoComplete="off"
                spellCheck={false}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg border border-border-color p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick destinations */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2" aria-label="Quick destinations">
            {[
              ['Play games', 'games'],
              ['Open tools', 'tools'],
              ['AI Lab', 'lab'],
              ['About', 'about'],
            ].map(([label, tab]) => (
              <button
                key={tab}
                onClick={() => navigate(tab)}
                className="rounded-full border border-border-color bg-muted/25 px-3.5 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-amber-color/35 hover:text-foreground cursor-pointer"
              >
                {label}
              </button>
            ))}
            <a
              href="https://github.com/DLinacre"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-amber-color/25 bg-amber-color/5 px-3.5 py-1.5 font-mono text-[11px] text-amber-color transition-colors hover:bg-amber-color/10 hover:border-amber-color/45"
            >
              <Github className="h-3.5 w-3.5" /> Source on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Featured flagship projects */}
      <FeaturedSpotlight />

      {/* Complete compact project display */}
      <ProjectGrid query={query} setQuery={setQuery} />
    </div>
  );
}
