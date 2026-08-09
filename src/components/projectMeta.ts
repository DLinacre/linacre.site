import type { ProjectKind } from '../data/siteProjects';

export const KIND_META: Record<ProjectKind, { label: string; chip: string; dot: string; accent: string }> = {
  App:    { label: 'App',    chip: 'text-cyan bg-cyan/10 border-cyan/25', dot: 'bg-cyan', accent: 'border-l-cyan/70' },
  Tool:   { label: 'Tool',   chip: 'text-emerald-color bg-emerald-color/10 border-emerald-color/25', dot: 'bg-emerald-color', accent: 'border-l-emerald-color/70' },
  AI:     { label: 'AI',     chip: 'text-purple-color bg-purple-color/10 border-purple-color/25', dot: 'bg-purple-color', accent: 'border-l-purple-color/70' },
  Game:   { label: 'Game',   chip: 'text-amber-color bg-amber-color/10 border-amber-color/25', dot: 'bg-amber-color', accent: 'border-l-amber-color/70' },
  DevOps: { label: 'DevOps', chip: 'text-cyan/80 bg-cyan/5 border-cyan/20', dot: 'bg-cyan/80', accent: 'border-l-cyan/50' },
  Source: { label: 'Source', chip: 'text-muted-foreground bg-muted/40 border-border-color', dot: 'bg-muted-foreground', accent: 'border-l-border-color' },
  Private:{ label: 'Private',chip: 'text-muted-foreground bg-muted/30 border-border-color', dot: 'bg-muted-foreground', accent: 'border-l-border-color' },
};
