import { ArrowUpRight, Download, Code2 } from 'lucide-react';
import type { SiteProject } from '../data/siteProjects';
import { projectActions, projectCategory } from '../lib/projectLibrary';

export default function ProjectActions({ project }: { project: SiteProject }) {
  const actions = projectActions(project);
  if (!actions.length) {
    return <p className="text-sm text-muted-foreground">{projectCategory(project) === 'Private' ? 'Private — no public access' : 'No public link recorded'}</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map(action => {
        const external = action.href.startsWith('http');
        const Icon = action.kind === 'download' ? Download : action.kind === 'source' ? Code2 : ArrowUpRight;
        return (
          <a key={`${action.kind}-${action.href}`} href={action.href}
            target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}
            aria-label={`${action.label}: ${project.name}${external ? ' (new tab)' : ''}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border-color px-3 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground">
            <Icon className="h-4 w-4" aria-hidden="true" />{action.label}
          </a>
        );
      })}
    </div>
  );
}
