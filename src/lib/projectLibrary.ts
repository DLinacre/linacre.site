import type { ProjectKind, SiteProject } from '../data/siteProjects';

export const PROJECT_CATEGORIES: { id: ProjectKind; label: string }[] = [
  { id: 'App', label: 'Everyday apps' },
  { id: 'Tool', label: 'Tools & utilities' },
  { id: 'AI', label: 'AI projects' },
  { id: 'DevOps', label: 'Developer & automation' },
  { id: 'Source', label: 'Source & templates' },
  { id: 'Game', label: 'Games' },
  { id: 'Private', label: 'Private projects' },
];

export type ProjectAction = { kind: 'use' | 'download' | 'source'; label: string; href: string };
export type AccessFilter = 'all' | ProjectAction['kind'];

export function projectCategory(project: SiteProject): ProjectKind {
  return project.private ? 'Private' : project.kind;
}

function validDestination(value?: string): string | undefined {
  if (!value) return undefined;
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  try {
    return ['https:', 'http:'].includes(new URL(value).protocol) ? value : undefined;
  } catch {
    return undefined;
  }
}

export function projectActions(project: SiteProject): ProjectAction[] {
  if (projectCategory(project) === 'Private') return [];
  const actions: ProjectAction[] = [];
  const url = validDestination(project.url);
  const repo = validDestination(project.repo);
  const download = validDestination(project.downloadUrl);
  let source = repo;
  if (url) {
    const parsed = new URL(url, 'https://www.linacre.site');
    const release = /\/releases(?:\/|$)/.test(parsed.pathname);
    const artifact = /\.(apk|aab|exe|msi|dmg|appimage|deb|rpm|zip|tar\.gz)$/i.test(parsed.pathname);
    const codeHost = ['github.com', 'gitlab.com'].includes(parsed.hostname);
    if (release || artifact) {
      actions.push({ kind: 'download', label: release ? 'Downloads' : 'Download', href: url });
    } else if (url === repo || codeHost) {
      source = source || url;
    } else {
      actions.push({ kind: 'use', label: project.kind === 'Game' ? 'Open game' : 'Use project', href: url });
    }
  }
  if (download && !actions.some(action => action.href === download)) {
    actions.push({ kind: 'download', label: 'Downloads', href: download });
  }
  if (source && !actions.some(action => action.href === source)) {
    actions.push({ kind: 'source', label: 'Source', href: source });
  }
  return actions;
}

export function filterProjects(
  projects: SiteProject[],
  query: string,
  category: ProjectKind | 'all',
  access: AccessFilter,
): SiteProject[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return projects.filter(project => {
    const kind = projectCategory(project);
    const label = PROJECT_CATEGORIES.find(item => item.id === kind)?.label || kind;
    const text = [project.name, project.blurb, label, ...project.tags, ...(project.tech || [])]
      .join(' ').toLowerCase();
    return (category === 'all' || kind === category) &&
      (access === 'all' || projectActions(project).some(action => action.kind === access)) &&
      terms.every(term => text.includes(term));
  });
}
