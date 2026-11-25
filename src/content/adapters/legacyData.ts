/** Derived compatibility shapes for older components; no independently authored products here. */
import { content, contentById, contentStatusLabel } from '..';
import toolSelection from '../tool-selection.json';
import externalTools from '../external-tools.json';
import type { Project, Tool } from '../../types';
const destination = (record: (typeof content)[number]) =>
  (record.type === 'game' ? record.playUrl : record.liveUrl) ??
  record.downloadUrl ??
  record.sourceRepository ??
  '';
const host = (url: string) => {
  try {
    return new URL(url, 'https://www.linacre.site').hostname;
  } catch {
    return '';
  }
};
export const PROJECTS: Project[] = content.map(record => ({
  name: record.name,
  category: record.type === 'game' ? 'Game' : record.category,
  description: record.shortDescription,
  url: destination(record),
  host: host(destination(record)),
  tag: contentStatusLabel(record),
  role: record.role,
  challenges: record.type === 'project' ? record.problemSolved : undefined,
  solution: record.implementation,
  tech: record.technologyStack,
  repoUrl: record.sourceRepository,
  liveUrl: record.type === 'game' ? record.playUrl : record.liveUrl,
  artwork: record.artwork,
  live: record.status === 'Live',
}));
export const TOOLS: Tool[] = [
  ...toolSelection.map(ref => {
    const record = contentById.get(ref.contentId);
    if (!record) throw new Error(`Unknown tool content reference: ${ref.contentId}`);
    const url = destination(record);
    return {
      id: record.id,
      name: record.name,
      category: ref.category as Tool['category'],
      description: record.shortDescription,
      url,
      host: host(url),
      searchKeywords: [record.name, ...(record.tags ?? [])].join(' '),
      tag: contentStatusLabel(record),
    };
  }),
  ...(externalTools as Tool[]),
];
