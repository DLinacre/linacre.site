/** Compatibility view only. Author content in content/{games,projects}/records.json. */
import {
  content,
  contentStatusLabel,
  type ContentStatus,
  type ProjectKind,
  type StudioContent,
} from '..';
export type { ProjectKind } from '../schemas/content.schema';
export interface SiteProject {
  id?: string;
  name: string;
  kind: ProjectKind;
  blurb: string;
  url?: string;
  repo?: string;
  tags: string[];
  emoji?: string;
  private?: boolean;
  badge?: 'NEW';
  artwork?: string;
  highlights?: string[];
  tech?: string[];
  year?: number;
  featured?: boolean;
  pinned?: boolean;
  downloadUrl?: string;
  status?: ContentStatus;
  statusLabel?: string;
}
export function toSiteProject(record: StudioContent): SiteProject {
  return {
    id: record.id,
    name: record.name,
    kind:
      record.type === 'game'
        ? record.relationship === 'template'
          ? 'Source'
          : 'Game'
        : record.category,
    blurb: record.shortDescription,
    url: record.type === 'game' ? record.playUrl : record.liveUrl,
    repo: record.sourceRepository,
    tags: record.tags ?? [],
    emoji: record.presentation?.emoji,
    artwork: record.artwork,
    highlights: record.features,
    tech: record.technologyStack,
    featured: record.featured,
    pinned: record.presentation?.pinned,
    downloadUrl: record.downloadUrl,
    status: record.status,
    statusLabel: contentStatusLabel(record),
  };
}
export const SITE_PROJECTS = content.map(toSiteProject);
export const SITE_PROJECT_COUNT = SITE_PROJECTS.length;
