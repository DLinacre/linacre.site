import { useState } from 'react';
import { Braces, Compass, Layers, Wand2 } from 'lucide-react';
import QuickTools from './QuickTools';
import EverydayTools from './EverydayTools';
import DevPlayground from './DevPlayground';
import Toolkit from './Toolkit';
import { ToolCategory } from '../types';

type ToolSection = 'quick' | 'everyday' | 'playground' | 'directory';

const SECTIONS: Array<{ id: ToolSection; label: string; icon: typeof Braces; blurb: string }> = [
  { id: 'quick', label: 'Quick tools', icon: Wand2, blurb: 'JSON, Base64, timestamps, secure generators' },
  { id: 'everyday', label: 'Everyday', icon: Layers, blurb: 'VAT, text cleaning, SHA-256, URL cleaner' },
  { id: 'playground', label: 'Playground', icon: Braces, blurb: 'JWT decode, regex, JSON→TS, cron, more' },
  { id: 'directory', label: 'Directory', icon: Compass, blurb: 'Curated free tools for build, deploy & design' },
];

interface ToolsProps {
  theme?: 'dark' | 'light';
}

/**
 * Tools — everything that does something, on one page:
 * quick browser utilities, everyday helpers, the developer playground and the
 * curated external-tool directory. Section tabs keep each view focused.
 */
export default function Tools({ theme = 'dark' }: ToolsProps) {
  const [section, setSection] = useState<ToolSection>('quick');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-border-color bg-[var(--linacre-panel)] p-6 sm:p-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan/10 blur-3xl pointer-events-none" />
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-color">
          Free · private · no sign-up
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Tools that actually do the job
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          Browser utilities that run entirely on your device, plus a curated directory of the
          external tools David uses daily. Nothing here tracks you, and nothing you paste leaves
          your machine.
        </p>

        <div className="mt-6 flex flex-wrap gap-1.5" role="tablist" aria-label="Tool sections">
          {SECTIONS.map(s => {
            const Icon = s.icon;
            const active = section === s.id;
            return (
              <button
                key={s.id}
                role="tab"
                aria-selected={active}
                onClick={() => setSection(s.id)}
                className={`flex items-center gap-2 rounded-full border px-3.5 py-2 font-mono text-[11px] font-semibold transition-colors cursor-pointer ${
                  active
                    ? 'border-amber-color/50 bg-amber-color/10 text-amber-color'
                    : 'border-border-color bg-muted/20 text-muted-foreground hover:text-foreground hover:border-amber-color/30'
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 font-mono text-[11px] text-muted-foreground">
          {SECTIONS.find(s => s.id === section)?.blurb}
        </p>
      </section>

      {section === 'quick' && <QuickTools />}
      {section === 'everyday' && <EverydayTools />}
      {section === 'playground' && <DevPlayground theme={theme} />}
      {section === 'directory' && (
        <Toolkit
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      )}
    </div>
  );
}
