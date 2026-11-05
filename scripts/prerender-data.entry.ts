/**
 * Build-time data bridge for scripts/prerender.mjs.
 * Bundled with esbuild so the prerenderer consumes the same typed site data
 * as the app (curated work, games, and legacy route snapshots).
 */
import { selectedWork, selectedGames } from '../src/data/curatedWork';
import { TOOLS } from '../src/data';
import { MUSIC_VIDEO_TRACKS } from '../src/data/musicVideos';

export const data = {
  selectedWork,
  selectedGames,
  musicVideos: MUSIC_VIDEO_TRACKS,
  tools: TOOLS.map(t => ({
    name: t.name,
    category: (t as { category?: string }).category ?? '',
    description: (t as { description?: string }).description ?? '',
    url: (t as { url?: string | null }).url ?? null,
  })),
};
