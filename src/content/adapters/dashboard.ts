import { contentById, contentStatusLabel } from '..';
import selection from '../dashboard-selection.json';
import type { ProjectCard } from '../../types/project';

/** Presentation selection, not a second product catalogue. */
export const dashboardProjects: ProjectCard[] = selection.map(id => {
  const record = contentById.get(id);
  if (!record) throw new Error(`Unknown dashboard content ID: ${id}`);
  return {
    id: record.id,
    title: record.name,
    subtitle: record.type === 'game' ? 'Game' : record.category,
    category: record.presentation?.dashboardCategory ?? 'Web & Tools',
    badge: contentStatusLabel(record),
    color: record.presentation?.color ?? 'cyan',
    description: record.fullDescription ?? record.shortDescription,
    tags: record.technologyStack ?? [],
    stats: record.statusNote ?? 'Status not verified',
    links: {
      github: record.sourceRepository,
      live: record.type === 'game' ? record.playUrl : record.liveUrl,
      download: record.downloadUrl,
    },
    featured: record.featured,
  };
});
