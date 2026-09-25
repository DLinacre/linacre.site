import { useState, type ReactNode } from 'react';
import { ProjectCard, ProjectCategory } from '../types/project';
import { 
  Search, 
  Github, 
  ExternalLink, 
  Download, 
  SlidersHorizontal, 
  Plus, 
  Layers, 
  Cpu, 
  Smartphone, 
  Globe, 
  Gamepad2, 
  Edit3, 
  Trash2 
} from 'lucide-react';

interface ProjectRadarProps {
  cards: ProjectCard[];
  onOpenCardManager: () => void;
  onEditCard: (card: ProjectCard) => void;
  onDeleteCard: (id: string) => void;
}

const CATEGORIES: { label: ProjectCategory; icon: ReactNode }[] = [
  { label: 'All', icon: <Layers className="h-3.5 w-3.5" /> },
  { label: 'Desktop & Systems', icon: <Cpu className="h-3.5 w-3.5" /> },
  { label: 'AI & LLM', icon: <SlidersHorizontal className="h-3.5 w-3.5" /> },
  { label: 'Mobile & Android', icon: <Smartphone className="h-3.5 w-3.5" /> },
  { label: 'Web & Tools', icon: <Globe className="h-3.5 w-3.5" /> },
  { label: 'Games & Creative', icon: <Gamepad2 className="h-3.5 w-3.5" /> },
];

export default function ProjectRadar({
  cards,
  onOpenCardManager,
  onEditCard,
  onDeleteCard,
}: ProjectRadarProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCards = cards.filter(card => {
    const matchesCategory =
      selectedCategory === 'All' || card.category === selectedCategory;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesSearch =
      card.title.toLowerCase().includes(q) ||
      (card.subtitle && card.subtitle.toLowerCase().includes(q)) ||
      (card.description && card.description.toLowerCase().includes(q)) ||
      (card.tags && card.tags.some(t => t.toLowerCase().includes(q)));

    return matchesCategory && matchesSearch;
  });

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'cyan':
        return {
          border: 'hover:border-cyan-400/60',
          glow: 'hover:shadow-[0_0_25px_rgba(56,189,248,0.25)]',
          badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
          accent: 'text-cyan-400',
        };
      case 'purple':
        return {
          border: 'hover:border-purple-400/60',
          glow: 'hover:shadow-[0_0_25px_rgba(192,132,252,0.25)]',
          badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          accent: 'text-purple-400',
        };
      case 'sakura':
        return {
          border: 'hover:border-pink-400/60',
          glow: 'hover:shadow-[0_0_25px_rgba(244,114,182,0.25)]',
          badge: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
          accent: 'text-pink-400',
        };
      case 'emerald':
        return {
          border: 'hover:border-emerald-400/60',
          glow: 'hover:shadow-[0_0_25px_rgba(52,211,153,0.25)]',
          badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          accent: 'text-emerald-400',
        };
      case 'amber':
      default:
        return {
          border: 'hover:border-amber-400/60',
          glow: 'hover:shadow-[0_0_25px_rgba(251,191,36,0.25)]',
          badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          accent: 'text-amber-400',
        };
    }
  };

  return (
    <section className="space-y-6">
      
      {/* Category Pills & Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.label}
              onClick={() => setSelectedCategory(cat.label)}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === cat.label
                  ? 'bg-purple-500/25 text-white border border-purple-400/50 shadow-[0_0_12px_rgba(192,132,252,0.3)]'
                  : 'border border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Search & Manage Actions */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full rounded-xl border border-white/10 bg-black/40 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 backdrop-blur-md focus:border-purple-400 focus:outline-none"
            />
          </div>

          <button
            onClick={onOpenCardManager}
            className="flex items-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-500/15 px-3.5 py-1.5 text-xs font-bold text-purple-300 hover:bg-purple-500/25 hover:border-purple-400 transition-all shadow-[0_0_10px_rgba(192,132,252,0.2)] whitespace-nowrap"
            title="Add, edit, or remove project cards"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Manage Cards</span>
          </button>
        </div>

      </div>

      {/* Project Cards Grid */}
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredCards.map(card => {
            const colors = getColorClasses(card.color);
            return (
              <div
                key={card.id}
                className={`group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0d1222]/80 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 ${colors.border} ${colors.glow}`}
              >
                {/* Top Section */}
                <div className="space-y-3">
                  
                  {/* Category & Badge Row */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[0.70rem] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      {card.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onEditCard(card)}
                        className="opacity-0 group-hover:opacity-100 rounded p-1 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                        title="Edit project card"
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => onDeleteCard(card.id)}
                        className="opacity-0 group-hover:opacity-100 rounded p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Delete project card"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[0.65rem] font-bold font-mono tracking-wide ${colors.badge}`}
                      >
                        {card.badge}
                      </span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="font-mono text-lg font-bold tracking-tight text-white group-hover:text-purple-300 transition-colors">
                      {card.title}
                    </h3>
                    {card.subtitle && (
                      <p className="text-xs font-medium text-slate-400">
                        {card.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs leading-relaxed text-slate-300 line-clamp-3">
                    {card.description}
                  </p>

                  {/* Tags */}
                  {card.tags && card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {card.tags.map(tag => (
                        <span
                          key={tag}
                          className="rounded-md border border-white/5 bg-white/[0.04] px-2 py-0.5 text-[0.68rem] font-mono text-slate-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                </div>

                {/* Bottom Section: Stats & Links */}
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="font-mono text-[0.70rem] font-semibold text-slate-400">
                    {card.stats}
                  </span>

                  <div className="flex items-center gap-2">
                    {card.links?.github && (
                      <a
                        href={card.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="View GitHub Source"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}

                    {card.links?.live && (
                      <a
                        href={card.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg p-1.5 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                        title="Open Live Application"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}

                    {card.links?.download && (
                      <a
                        href={card.links.download}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                        title="Download Release"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
          <p className="text-sm font-semibold text-slate-400">
            No projects found matching your filter or query.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-3 text-xs font-bold text-purple-400 hover:underline"
          >
            Clear Filters
          </button>
        </div>
      )}

    </section>
  );
}
