import { ChevronRight, Terminal } from 'lucide-react';

export interface BreadcrumbPath {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbsProps {
  paths: BreadcrumbPath[];
}

export default function Breadcrumbs({ paths }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="font-mono text-[10px] sm:text-xs text-muted-foreground flex flex-wrap items-center gap-1.5 py-1.5 px-3 bg-[#0d1117]/60 border border-border-color/30 rounded-lg max-w-fit shadow-sm select-none mb-6 animate-fade-in"
    >
      <span className="text-amber-color font-semibold flex items-center gap-1">
        <Terminal className="w-3.5 h-3.5" />
        <span>linacre.site</span>
      </span>
      <ChevronRight className="w-3 h-3 text-muted-foreground/30 shrink-0" />

      {paths.map((path, idx) => {
        const isLast = idx === paths.length - 1;
        const normalizedLabel = path.label.toLowerCase();

        return (
          <div key={idx} className="flex items-center gap-1.5">
            {path.onClick && !isLast ? (
              <button
                onClick={e => {
                  e.preventDefault();
                  path.onClick?.();
                }}
                className="hover:text-amber-color cursor-pointer transition-colors focus-visible:text-amber-color focus-visible:outline-none"
              >
                {normalizedLabel}
              </button>
            ) : (
              <span
                className={
                  isLast
                    ? 'text-foreground font-semibold truncate max-w-[150px] sm:max-w-xs'
                    : 'text-muted-foreground'
                }
              >
                {normalizedLabel}
              </span>
            )}
            {!isLast && <ChevronRight className="w-3 h-3 text-muted-foreground/30 shrink-0" />}
          </div>
        );
      })}
    </nav>
  );
}
