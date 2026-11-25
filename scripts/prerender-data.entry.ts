import { content } from '../src/content';
/**
 * Build-time data bridge for scripts/prerender.mjs.
 * Bundled with esbuild so the prerenderer consumes the same typed site data
 * as the app (project catalogue, tools) — no duplicated content.
 */
import { SITE_PROJECTS } from '../src/content/adapters/siteProjects';
import { TOOLS } from '../src/content/adapters/legacyData';
import { projectActions } from '../src/lib/projectLibrary';

export const data = {
  records: content,
  projects: SITE_PROJECTS.map(p => ({
    name: p.name,
    kind: p.kind,
    blurb: p.blurb,
    url: p.url || p.downloadUrl || p.repo || null,
    playUrl: p.kind === 'Game' ? p.url : null,
    actions: projectActions(p),
    statusLabel: p.statusLabel,
    repo: p.repo || null,
    tags: p.tags ?? [],
    emoji: p.emoji ?? null,
    private: !!p.private,
    artwork: p.artwork ?? null,
    featured: !!p.featured,
    tech: p.tech ?? [],
    year: p.year ?? null,
  })),
  tools: TOOLS.map(t => ({
    name: t.name,
    category: t.category ?? '',
    description: t.description ?? '',
    url: t.url ?? null,
  })),
};
