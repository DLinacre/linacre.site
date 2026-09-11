import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  Server,
  HardDrive,
  GitBranch,
  Search,
  ExternalLink,
  Copy,
  Check,
  Cpu,
  Layers,
  Smartphone,
  Globe,
  Bot,
  Wrench,
  Archive,
} from 'lucide-react';
import { SITE_PROJECTS } from '../data/siteProjects';

interface SubgroupMeta {
  id: string;
  name: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const SUBGROUPS: SubgroupMeta[] = [
  { id: 'all', name: 'All Repositories', count: 60, icon: Layers, color: 'text-cyan' },
  { id: 'web', name: 'Web Platforms', count: 22, icon: Globe, color: 'text-sky-400' },
  { id: 'ai', name: 'AI Intelligence', count: 13, icon: Bot, color: 'text-purple-400' },
  { id: 'mobile', name: 'Mobile & OS', count: 14, icon: Smartphone, color: 'text-emerald-400' },
  { id: 'devops', name: 'Platform & DevOps', count: 10, icon: Wrench, color: 'text-amber-400' },
  { id: 'archive', name: 'Archive & Mirrors', count: 1, icon: Archive, color: 'text-slate-400' },
];

export default function OpsHUD() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubgroup, setSelectedSubgroup] = useState('all');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const filteredProjects = useMemo(() => {
    return SITE_PROJECTS.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.blurb.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (p.tech && p.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

      if (!matchesSearch) return false;

      if (selectedSubgroup === 'all') return true;
      if (selectedSubgroup === 'web')
        return p.kind === 'App' || p.kind === 'Tool' || p.tags.includes('web') || p.tags.includes('portfolio');
      if (selectedSubgroup === 'ai')
        return p.kind === 'AI' || p.tags.includes('ai') || p.tags.includes('llm');
      if (selectedSubgroup === 'mobile')
        return p.kind === 'Game' || p.tags.includes('android') || p.tags.includes('apk') || p.tags.includes('mobile');
      if (selectedSubgroup === 'devops')
        return p.kind === 'DevOps' || p.kind === 'Source' || p.tags.includes('devops') || p.tags.includes('windows');
      if (selectedSubgroup === 'archive')
        return p.name.includes('archive') || p.tags.includes('archive');

      return true;
    });
  }, [searchQuery, selectedSubgroup]);

  return (
    <div className="min-h-screen pb-24 text-foreground">
      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-border/40 bg-card/30 backdrop-blur-md px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Ecosystem Live & Synced
                </span>
                <span className="rounded-full bg-cyan/10 px-3 py-1 text-xs font-semibold text-cyan ring-1 ring-cyan/20">
                  GitLab Ultimate + Duo AI
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Unified Ecosystem Operations HUD
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Live command center for David Linacre's 60-repository platform, 24/7 background runners, and automated backup engines.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleCopy('lin status')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/80 px-3 py-1.5 text-xs font-mono font-medium hover:bg-muted/80 transition-colors"
                title="Copy lin status command"
              >
                {copiedText === 'lin status' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                lin status
              </button>
              <button
                onClick={() => handleCopy('lin sync')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/80 px-3 py-1.5 text-xs font-mono font-medium hover:bg-muted/80 transition-colors"
                title="Copy lin sync command"
              >
                {copiedText === 'lin sync' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                lin sync
              </button>
              <button
                onClick={() => handleCopy('lin backup')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/80 px-3 py-1.5 text-xs font-mono font-medium hover:bg-muted/80 transition-colors"
                title="Copy lin backup command"
              >
                {copiedText === 'lin backup' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                lin backup
              </button>
            </div>
          </div>

          {/* Real-Time Telemetry Cards */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border/50 bg-background/60 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">GitLab Local Runner</span>
                <Server className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xl font-bold">ONLINE</span>
                <span className="text-xs text-emerald-400 font-mono">ID: 56201256</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">24/7 dedicated Windows compute daemon</p>
            </div>

            <div className="rounded-xl border border-border/50 bg-background/60 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">24/7 Healer Engine</span>
                <Activity className="h-4 w-4 text-cyan" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xl font-bold">READY</span>
                <span className="text-xs text-cyan font-mono">Hourly Loop</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">Self-healing route & secret synchronizer</p>
            </div>

            <div className="rounded-xl border border-border/50 bg-background/60 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Nightly Backup Vault</span>
                <HardDrive className="h-4 w-4 text-purple-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xl font-bold">ACTIVE</span>
                <span className="text-xs text-purple-400 font-mono">Daily 03:00</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">14-day rotating encrypted snapshots</p>
            </div>

            <div className="rounded-xl border border-border/50 bg-background/60 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Platform Toolchains</span>
                <Cpu className="h-4 w-4 text-amber-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xl font-bold">16 / 16</span>
                <span className="text-xs text-emerald-400 font-semibold">100% PASS</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">Git, Delta, Node, Python, Rust, Java, ADB</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Repository Explorer */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Controls: Search and Subgroups */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Subgroup Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            {SUBGROUPS.map(sub => {
              const Icon = sub.icon;
              const isSelected = selectedSubgroup === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubgroup(sub.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-foreground text-background shadow-sm'
                      : 'border border-border/60 bg-card/40 text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-background' : sub.color}`} />
                  <span>{sub.name}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects, tags, stacks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border/60 bg-card/50 py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
            />
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map(project => (
              <motion.div
                key={project.name}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="group relative flex flex-col justify-between rounded-xl border border-border/50 bg-card/40 p-4 backdrop-blur-sm transition-all hover:border-cyan/40 hover:bg-card/70 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl" role="img" aria-label={project.name}>
                        {project.emoji || '📦'}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold tracking-tight text-foreground group-hover:text-cyan transition-colors">
                          {project.name}
                        </h3>
                        <span className="inline-block text-[10px] font-medium text-muted-foreground">
                          {project.kind}
                        </span>
                      </div>
                    </div>
                    {project.badge && (
                      <span className="rounded-full bg-cyan/15 px-2 py-0.5 text-[9px] font-bold text-cyan ring-1 ring-cyan/30">
                        {project.badge}
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {project.blurb}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/30">
                  {/* Tech stack */}
                  {project.tech && project.tech.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {project.tech.slice(0, 3).map(t => (
                        <span
                          key={t}
                          className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions / Links */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-medium text-cyan hover:underline"
                        >
                          Launch
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {project.repo && (
                        <a
                          href={project.repo}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <GitBranch className="h-3 w-3" />
                          GitHub
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => handleCopy(`git clone https://github.com/DLinacre/${project.name}.git`)}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1"
                      title="Copy git clone command"
                    >
                      {copiedText?.includes(project.name) ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProjects.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">No repositories found matching your query.</p>
          </div>
        )}
      </main>
    </div>
  );
}
