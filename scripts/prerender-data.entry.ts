/**
 * Build-time data bridge for scripts/prerender.mjs.
 * Bundled with esbuild so the prerenderer consumes the same typed site data
 * as the app (project catalogue, tools) — no duplicated content.
 */
import { selectedWork } from '../src/data/curatedWork';
import { TOOLS } from '../src/data';
import { MUSIC_VIDEO_TRACKS } from '../src/data/musicVideos';

export const data = {
  musicVideos: MUSIC_VIDEO_TRACKS,
  projects: selectedWork.map(p => ({
    name: p.name, kind: 'Project', blurb: p.description, url: p.url,
    repo: p.source, artwork: p.image, featured: true, tech: [p.details],
    tags: [], private: false, year: null,
  })),
  tools: TOOLS.map(t => ({
    name: t.name,
    category: (t as any).category ?? '',
    description: (t as any).description ?? '',
    url: (t as any).url ?? null,
  })),
};
