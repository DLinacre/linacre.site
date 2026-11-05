import { ArrowUpRight, Download, Code2 } from 'lucide-react';
import type { SiteProject } from '../data/siteProjects';
import { projectActions, projectCategory } from '../lib/projectLibrary';

export default function ProjectActions({ project }: { project: SiteProject }) {
  const actions = projectActions(project);
  if (!actions.length) {
    return (
      <p className="text-xs text-[#6b7482]">
        {projectCategory(project) === 'Private' ? 'Private — no public access' : 'No public link recorded'}
      </p>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map(action => {
        const external = action.href.startsWith('http');
        const Icon = action.kind === 'download' ? Download : action.kind === 'source' ? Code2 : ArrowUpRight;
        const isPrimary = action.kind === 'use';
        return (
          <a
            key={`${action.kind}-${action.href}`}
            href={action.href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            aria-label={`${action.label}: ${project.name}${external ? ' (new tab)' : ''}`}
            className={`inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
              isPrimary
                ? 'bg-[#8fd6ff] text-[#07080b] hover:brightness-110 shadow-sm'
                : 'border border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/25 hover:text-white'
            }`}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{action.label}</span>
          </a>
        );
      })}
    </div>
  );
}
