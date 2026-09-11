import { useState } from 'react';
import { SITE_PROJECTS } from '../data/siteProjects';
import ProjectGrid from './ProjectGrid';

const games = SITE_PROJECTS.filter(project => project.kind === 'Game' && !project.private);

export default function Games() {
  const [query, setQuery] = useState('');
  return (
    <div className="space-y-8">
      <section aria-labelledby="games-heading" className="space-y-4">
        <h1 id="games-heading" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Games, without the takeover</h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">KushCloud is pinned first. Other games remain discoverable for testing, not advertised as verified releases. Games open only when you follow a link — no embedded players or automatic audio.</p>
        <a href="/" className="inline-flex min-h-11 items-center rounded-lg underline underline-offset-4">Back to all projects</a>
      </section>
      <div role="search">
        <label htmlFor="game-search" className="mb-2 block text-sm font-semibold">Find a game</label>
        <input id="game-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search games by name or genre" className="min-h-12 w-full rounded-xl border border-border-color bg-background px-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground" />
      </div>
      <ProjectGrid query={query} setQuery={setQuery} projects={games} heading="Games library" />
    </div>
  );
}
