import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Compass,
  Cpu,
  CornerDownLeft,
  Sparkles,
  House,
  Gamepad2,
  Wrench,
  User,
  Mail,
  Sun,
  Moon,
  Globe2,
} from 'lucide-react';
import { TOOLS } from '../data';
import Fuse from 'fuse.js';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: string) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  setActiveTab,
  theme,
  setTheme,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, isOpen]);

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

  const go = (tab: string) => {
    setActiveTab(tab);
    onClose();
  };

  const navCommands: CommandItem[] = [
    {
      id: 'nav-home',
      label: 'Go to Start — all projects',
      icon: House,
      action: () => go('home'),
      meta: 'Search bar and the complete project index',
    },
    {
      id: 'nav-tools',
      label: 'Go to Tools',
      icon: Wrench,
      action: () => go('tools'),
      meta: 'Quick utilities, everyday tools, playground and directory',
    },
    {
      id: 'nav-games',
      label: 'Go to Games',
      icon: Gamepad2,
      action: () => go('games'),
      meta: 'Playable browser games and Roblox projects',
    },
    {
      id: 'nav-lab',
      label: 'Go to AI Lab',
      icon: Cpu,
      action: () => go('lab'),
      meta: 'Interactive multi-provider AI terminal',
    },
    {
      id: 'nav-identity',
      label: 'Go to Identity Studio',
      icon: Sparkles,
      action: () => go('identity'),
      meta: 'Custom SVG emblems, social banners and badges',
    },
    {
      id: 'nav-about',
      label: 'Go to About',
      icon: User,
      action: () => go('about'),
      meta: 'Career, skills, timeline and changelog',
    },
    {
      id: 'nav-contact',
      label: 'Go to Contact',
      icon: Mail,
      action: () => go('contact'),
      meta: 'Start a project or ask a question',
    },
    {
      id: 'nav-mob-deals',
      label: 'Open Mob Deals',
      icon: Globe2,
      action: () => go('mob-deals'),
      meta: 'Compare UK SIM-only deals',
    },
    {
      id: 'nav-pokeguru',
      label: 'Open PokeGuru',
      icon: Globe2,
      action: () => go('pokeguru'),
      meta: 'Search Pokémon TCG sets and prices',
    },
  ];

  const actionCommands: CommandItem[] = [
    {
      id: 'act-theme',
      label: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
      icon: theme === 'dark' ? Sun : Moon,
      action: () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(next);
        localStorage.setItem('linacre_theme', next);
        onClose();
      },
      meta: 'Toggle the visual theme',
      keywords: 'theme dark light colour color',
    },
  ];

  const allSearchableItems: CommandItem[] = [
    ...navCommands,
    ...actionCommands,
    ...TOOLS.map(tool => ({
      id: `tool-${tool.id}`,
      label: `Open ${tool.name} (${tool.host})`,
      icon: Compass,
      action: () => {
        window.open(tool.url, '_blank', 'noopener');
        onClose();
      },
      meta: tool.description,
      keywords: tool.searchKeywords,
    })),
  ];

  const fuseRef = useRef<Fuse<CommandItem> | null>(null);
  if (!fuseRef.current) {
    fuseRef.current = new Fuse(allSearchableItems, {
      keys: ['label', 'meta', 'keywords'],
      threshold: 0.35,
      distance: 100,
    });
  }

  const allItems = query
    ? fuseRef.current
        .search(query)
        .map(res => res.item)
        .slice(0, 10)
    : [...navCommands, ...actionCommands];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (allItems.length > 0 ? (prev + 1) % allItems.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev =>
          allItems.length > 0 ? (prev - 1 + allItems.length) % allItems.length : 0,
        );
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#030c14]/75 backdrop-blur-sm transition-opacity"
          />
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className="relative mx-auto mt-20 w-full max-w-xl rounded-2xl border border-amber-color/15 bg-[#08121c] shadow-[0_30px_90px_rgba(0,0,0,0.55)] overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            {/* Search field */}
            <div className="flex items-center gap-3 border-b border-amber-color/10 px-4">
              <Search className="h-4 w-4 shrink-0 text-amber-color" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Jump to a page, tool or action…"
                className="h-14 w-full bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                autoComplete="off"
                spellCheck={false}
                aria-label="Search commands"
              />
              <kbd className="shrink-0 rounded border border-border-color bg-muted/30 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                esc
              </kbd>
            </div>

            {/* Results */}
            <div
              ref={scrollContainerRef}
              className="max-h-80 overflow-y-auto p-2"
              role="listbox"
            >
              {allItems.length === 0 && (
                <p className="px-3 py-6 text-center font-mono text-xs text-muted-foreground">
                  Nothing matches “{query}”.
                </p>
              )}
              {allItems.map((item, index) => {
                const Icon = item.icon;
                const active = index === activeIndex;
                return (
                  <button
                    key={item.id}
                    role="option"
                    aria-selected={active}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={item.action}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      active ? 'bg-amber-color/10 text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                        active
                          ? 'border-amber-color/40 bg-amber-color/10 text-amber-color'
                          : 'border-border-color bg-muted/20'
                      }`}
                    >
                      {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-mono text-xs font-semibold text-foreground">
                        {item.label}
                      </span>
                      {item.meta && (
                        <span className="mt-0.5 block truncate text-[10px] text-muted-foreground">
                          {item.meta}
                        </span>
                      )}
                    </span>
                    {active && (
                      <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-amber-color" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
