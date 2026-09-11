import { useState } from 'react';
import ProjectGrid from './ProjectGrid';

interface StartPageProps { navigate: (tab: string) => void; }

export default function StartPage({ navigate }: StartPageProps) {
  const [query, setQuery] = useState('');
  return (
    <div className="space-y-8">
      <section aria-labelledby="start-heading" className="space-y-4">
        <p className="text-sm text-muted-foreground">Linacre project library</p>
        <h1 id="start-heading" className="font-display text-3xl font-bold tracking-tight sm:text-5xl">Find it. Use it. Make it yours.</h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">Browse by category, open an app, find a download or explore the source. No game takes over this page.</p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => navigate('tools')} className="min-h-11 rounded-lg border border-border-color px-4 text-sm hover:bg-muted">Browser tools</button>
          <button type="button" onClick={() => navigate('games')} className="min-h-11 rounded-lg border border-border-color px-4 text-sm hover:bg-muted">Games — KushCloud first</button>
        </div>
      </section>
      <div role="search">
        <label htmlFor="start-search" className="mb-2 block text-sm font-semibold">Search the project library</label>
        <input id="start-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Name, task or technology — try audit, Android or recipes" autoComplete="off" className="min-h-12 w-full rounded-xl border border-border-color bg-background px-4 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground" />
      </div>
      <ProjectGrid query={query} setQuery={setQuery} />
    </div>
  );
}
