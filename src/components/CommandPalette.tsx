import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Compass, Cpu, BookOpen, Terminal, Hash, CornerDownLeft, Sparkles, Sliders, Bot, Activity, FileText, FolderCode, House, Gamepad2 } from 'lucide-react';
import { TOOLS } from '../data';
import Fuse from 'fuse.js';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: any) => void;
}

export default function CommandPalette({ isOpen, onClose, setActiveTab, setSearchQuery, setActiveCategory }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset indices on query or open change
  useEffect(() => {
    setActiveIndex(0);
  }, [query, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  interface CommandItem {
    id: string;
    label: string;
    icon?: any;
    action: () => void;
    meta?: string;
    keywords?: string;
  }

  // Command lists
  const navCommands: CommandItem[] = [
    { id: 'nav-home', label: 'Go to Useful Start Page', icon: House, action: () => { setActiveTab('home'); onClose(); }, meta: 'Quick browser tools and free products' },
    { id: 'nav-projects', label: 'Go to Projects Portfolio', icon: FolderCode, action: () => { setActiveTab('projects'); onClose(); }, meta: 'Manage, build, and showcase workspace applications' },
    { id: 'nav-games', label: 'Go to Playable Browser Games', icon: Gamepad2, action: () => { setActiveTab('games'); onClose(); }, meta: 'Play KushCloud flyer and built-in interactive Snake' },
    { id: 'nav-toolkit', label: 'Go to Toolkit Directory', icon: Compass, action: () => { setActiveTab('toolkit'); onClose(); }, meta: 'View David\'s curated developer loadout' },
    { id: 'nav-agents', label: 'Go to AI Autonomous Agents Hub', icon: Bot, action: () => { setActiveTab('agents'); onClose(); }, meta: 'Create, coordinate, and delegate jobs to simulated bot agents' },
    { id: 'nav-blog', label: 'Go to Technical Case Studies & Blog', icon: FileText, action: () => { setActiveTab('blog'); onClose(); }, meta: 'Deep dives on concurrency, styling and caching architectures' },
    { id: 'nav-status', label: 'Go to Systems Status Console', icon: Activity, action: () => { setActiveTab('status'); onClose(); }, meta: 'Check live latency, operational checks and simulated loads' },
    { id: 'nav-learn', label: 'Go to Curriculum & Learn', icon: BookOpen, action: () => { setActiveTab('learn'); onClose(); }, meta: 'Free roadmaps and learning paths' },
    { id: 'nav-lab', label: 'Go to AI Dev Assistant Lab', icon: Cpu, action: () => { setActiveTab('lab'); onClose(); }, meta: 'Interactive multi-provider AI terminal' },
    { id: 'nav-playground', label: 'Go to Developer Playground', icon: Sliders, action: () => { setActiveTab('playground'); onClose(); }, meta: 'JWT decoder, Glassmorphism builder, RegEx tester, and generators' },
    { id: 'nav-dashboard', label: 'Go to David\'s Private Dashboard', icon: Terminal, action: () => { setActiveTab('dashboard'); onClose(); }, meta: 'MCP server configurations and private console' },
    { id: 'nav-identity', label: 'Go to Identity & Brand Hub', icon: Sparkles, action: () => { setActiveTab('identity'); onClose(); }, meta: 'Sleek custom SVG emblems, social banners and embeddable badges' },
  ];

  const catCommands: CommandItem[] = [
    { id: 'cat-start', label: 'Filter toolkit: start', action: () => { setActiveTab('toolkit'); setActiveCategory('start'); setSearchQuery(''); onClose(); }, meta: 'Explore workspace editors, Git VCS, and planners' },
    { id: 'cat-build', label: 'Filter toolkit: build', action: () => { setActiveTab('toolkit'); setActiveCategory('build'); setSearchQuery(''); onClose(); }, meta: 'Explore frameworks, databases, auth, and billing' },
    { id: 'cat-deploy', label: 'Filter toolkit: deploy', action: () => { setActiveTab('toolkit'); setActiveCategory('deploy'); setSearchQuery(''); onClose(); }, meta: 'Explore cloud hosting platforms and edge servers' },
    { id: 'cat-design', label: 'Filter toolkit: design', action: () => { setActiveTab('toolkit'); setActiveCategory('design'); setSearchQuery(''); onClose(); }, meta: 'Explore assets, prototypes, and icons' },
  ];

  const allSearchableItems: CommandItem[] = [
    ...navCommands,
    ...catCommands,
    ...TOOLS.map((tool) => ({
      id: `tool-${tool.id}`,
      label: `Open ${tool.name} (${tool.host})`,
      icon: Compass,
      action: () => {
        window.open(tool.url, '_blank', 'noopener');
        onClose();
      },
      meta: tool.description,
      keywords: tool.searchKeywords
    }))
  ];

  const fuseRef = useRef<Fuse<CommandItem> | null>(null);
  if (!fuseRef.current) {
    fuseRef.current = new Fuse(allSearchableItems, {
      keys: ['label', 'meta', 'keywords'],
      threshold: 0.35,
      distance: 100
    });
  }

  const allItems = query
    ? fuseRef.current.search(query).map((res) => res.item).slice(0, 10)
    : [...navCommands, ...catCommands];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (allItems.length > 0 ? (prev + 1) % allItems.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (allItems.length > 0 ? (prev - 1 + allItems.length) % allItems.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (allItems[activeIndex]) {
          allItems[activeIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, allItems]);

  // Adjust scroll position automatically
  useEffect(() => {
    if (allItems.length === 0) return;
    const activeEl = scrollContainerRef.current?.children[activeIndex] as HTMLElement;
    if (activeEl && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const elTop = activeEl.offsetTop;
      const elHeight = activeEl.offsetHeight;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      if (elTop < containerScrollTop) {
        container.scrollTop = elTop;
      } else if (elTop + elHeight > containerScrollTop + containerHeight) {
        container.scrollTop = elTop + elHeight - containerHeight;
      }
    }
  }, [activeIndex, allItems.length]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" id="command-palette-root">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#030c14]/75 backdrop-blur-sm transition-opacity"
          />

          {/* Dialog Window */}
          <div className="flex min-h-[100dvh] items-start justify-center p-4 sm:p-6 md:p-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-xl overflow-hidden rounded-xl bg-muted/95 dark:bg-[#081c28]/95 border border-border-color shadow-2xl flex flex-col"
            >
              {/* Search input line */}
              <div className="relative border-b border-border-color p-4">
                <Search className="absolute left-4 top-4.5 w-5 h-5 text-muted-foreground/60" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="type a command or search a tool..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent pl-10 pr-4 text-sm font-mono text-foreground placeholder:text-muted-foreground/65 focus:outline-none border-none outline-none"
                  id="palette-search-input"
                />
              </div>

              {/* List container */}
              <div
                ref={scrollContainerRef}
                className="max-h-80 overflow-y-auto p-2 space-y-0.5 select-none scrollbar-thin"
                id="palette-items-list"
              >
                {allItems.map((item, idx) => {
                  const isHighlighted = idx === activeIndex;
                  const Icon = item.icon || Hash;

                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`w-full flex items-start gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                        isHighlighted
                          ? 'bg-amber-color/10 border border-amber-color/20 text-amber-color'
                          : 'bg-transparent border border-transparent text-muted-foreground'
                      }`}
                      id={`palette-item-${item.id}`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isHighlighted ? 'text-amber-color' : 'text-muted-foreground/50'}`} />
                      <div className="flex-1 font-mono text-xs">
                        <span className="font-semibold">{item.label}</span>
                        {item.meta && (
                          <p className="text-[10px] text-muted-foreground/60 leading-normal mt-0.5 line-clamp-1">
                            {item.meta}
                          </p>
                        )}
                      </div>

                      {isHighlighted && (
                        <div className="flex items-center gap-1 text-[9px] font-mono text-amber-color/60 bg-amber-color/5 px-1 rounded border border-amber-color/15 self-center">
                          <span>select</span>
                          <CornerDownLeft className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  );
                })}

                {allItems.length === 0 && (
                  <div className="text-center py-8 font-mono text-xs text-muted-foreground">
                    No results found for "{query}"
                  </div>
                )}
              </div>

              {/* Footer status guide */}
              <div className="border-t border-border-color bg-muted/40 dark:bg-[#161b26]/40 px-4 py-2 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>
                    <kbd className="bg-background px-1.5 py-0.5 rounded border border-border-color">↑↓</kbd> to navigate
                  </span>
                  <span>
                    <kbd className="bg-background px-1.5 py-0.5 rounded border border-border-color">Enter</kbd> to select
                  </span>
                </div>
                <span>
                  <kbd className="bg-background px-1.5 py-0.5 rounded border border-border-color">Esc</kbd> to close
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
