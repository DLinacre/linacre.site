import { useState, useEffect, useRef, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ExternalLink, HelpCircle, Sparkles, Check, Terminal, Copy, Bot } from 'lucide-react';
import { TOOLS } from '../data';
import { Tool, ToolCategory } from '../types';

// Tools exposed by the Linacre Tool Box MCP server (mcp/ in this repo).
const MCP_TOOLS = [
  'json_format', 'base64', 'jwt_decode', 'regex_test', 'hash', 'uuid_generate',
  'password_generate', 'uk_vat', 'url_clean', 'timestamp_convert', 'text_tools',
];

// Small copy-to-clipboard button used by the MCP install snippets.
function CopyButton({ text, label = 'command' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch (e) {
          console.error('Clipboard write failed', e);
        }
      }}
      className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-cyan hover:bg-muted/60 transition-colors focus:outline-none focus:ring-1 focus:ring-cyan/40"
      title={`Copy ${label}`}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-color" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

interface ToolkitProps {
  onToolSelect?: (tool: Tool) => void;
  openPalette?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: ToolCategory | 'all';
  setActiveCategory: (category: ToolCategory | 'all') => void;
}

export default function Toolkit({ onToolSelect: _onToolSelect, openPalette: _openPalette, searchQuery, setSearchQuery, activeCategory, setActiveCategory }: ToolkitProps) {
  const [bookmarkedTools, setBookmarkedTools] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load bookmarks and URL query parameters (?q=)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('linacre_stack_v1');
      if (saved) {
        setBookmarkedTools(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load stack bookmarks', e);
    }

    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      if (q && !searchQuery) {
        setSearchQuery(q);
      }
    } catch (e) {
      console.error('Failed to parse URL query param', e);
    }
  }, []);

  // Update URL search params when searchQuery changes
  useEffect(() => {
    try {
      if (window.location.pathname === '/toolkit') {
        const url = new URL(window.location.href);
        if (searchQuery.trim()) {
          url.searchParams.set('q', searchQuery.trim());
        } else {
          url.searchParams.delete('q');
        }
        window.history.replaceState(null, '', url.toString());
      }
    } catch (e) {
      console.error('Failed to update URL search params', e);
    }
  }, [searchQuery]);

  // Save bookmarks to localStorage
  const saveBookmarks = (newBookmarks: string[]) => {
    setBookmarkedTools(newBookmarks);
    try {
      localStorage.setItem('linacre_stack_v1', JSON.stringify(newBookmarks));
    } catch (e) {
      console.error('Failed to save stack bookmarks', e);
    }
  };

  const toggleBookmark = (id: string, e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let updated: string[];
    if (bookmarkedTools.includes(id)) {
      updated = bookmarkedTools.filter((item) => item !== id);
    } else {
      updated = [...bookmarkedTools, id];
    }
    saveBookmarks(updated);
  };

  // Focus search input on "/"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter tools based on search and category
  const filteredTools = TOOLS.filter((tool) => {
    const matchesSearch =
      !searchQuery ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.searchKeywords.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.host.toLowerCase().includes(searchQuery.toLowerCase());

    const isStackActive = activeCategory === 'stack';
    const matchesCategory =
      activeCategory === 'all' ||
      (isStackActive ? bookmarkedTools.includes(tool.id) : tool.category === activeCategory);

    return matchesSearch && matchesCategory;
  });

  const categories: { id: ToolCategory | 'all'; label: string; title: string }[] = [
    { id: 'all', label: 'all loadout', title: 'Show full developer loadout' },
    { id: 'start', label: 'start', title: 'IDE, Version Control, Project management' },
    { id: 'build', label: 'build', title: 'Frameworks, languages, local-first DBs' },
    { id: 'deploy', label: 'deploy', title: 'Cloud hosting, edge networks, DNS' },
    { id: 'stack', label: '★ my stack', title: 'Your bookmarked tools' },
  ];

  const getLeftBorderColor = (cat: string) => {
    switch (cat) {
      case 'start':
        return 'border-l-amber-color';
      case 'build':
        return 'border-l-cyan';
      case 'deploy':
        return 'border-l-emerald-color';
      case 'design':
        return 'border-l-purple-color';
      case 'email':
        return 'border-l-rose-400';
      default:
        return 'border-l-border-color';
    }
  };

  return (
    <div className="space-y-12">
      {/* Search and Filters Section */}
      <section className="space-y-6" id="toolkit-head">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Label and search */}
          <div className="relative flex-1 max-w-md w-full">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground font-mono text-sm">
              $ grep
            </div>
            <input
              ref={searchInputRef}
              type="search"
              placeholder="search the toolkit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/40 dark:bg-[#0B1220]/60 border border-amber-color/15 rounded-2xl py-2.5 pl-20 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-amber-color/50 focus:border-amber-color text-foreground placeholder:text-muted-foreground/60 transition-all font-mono"
              id="search-input"
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
              <span className="hidden sm:inline-block font-mono text-[10px] text-muted-foreground bg-muted border border-border-color px-1.5 py-0.5 rounded shadow-sm">
                / to search
              </span>
            </div>
          </div>

          {/* Counts */}
          <div className="font-mono text-xs text-muted-foreground flex items-center gap-1.5 self-end md:self-center bg-muted/30 dark:bg-[#0B1220]/40 border border-amber-color/10 px-3 py-1.5 rounded-xl">
            <Sparkles className="w-3.5 h-3.5 text-amber-color animate-pulse" />
            <span>
              // showing {filteredTools.length} of {TOOLS.length} tools
              {activeCategory !== 'all' && (
                <span> in <span className="text-amber-color">{activeCategory === 'stack' ? 'my stack' : activeCategory}</span></span>
              )}
            </span>
          </div>
        </div>

        {/* Categories Grid/Chips */}
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category" id="category-chips">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 font-mono text-xs rounded-md border transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan/40 ${
                  isSelected
                    ? cat.id === 'stack'
                      ? 'bg-amber-color/10 border-amber-color text-amber-color font-medium shadow-[0_0_12px_rgba(255,180,84,0.15)]'
                      : 'bg-cyan/10 border-cyan text-cyan font-medium'
                    : 'bg-muted/40 dark:bg-[#081c28]/20 border-border-color text-muted-foreground hover:text-foreground hover:border-muted-foreground/40'
                }`}
                title={cat.title}
                aria-pressed={isSelected}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid of Cards */}
      <section className="space-y-4" id="toolkit-grid-section">
        <AnimatePresence mode="popLayout">
          {filteredTools.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              id="toolkit-grid"
            >
              {filteredTools.map((tool) => {
                const isBookmarked = bookmarkedTools.includes(tool.id);
                return (
                  <motion.a
                    key={tool.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative flex flex-col justify-between bg-muted/20 dark:bg-[#0B1220]/80 border border-amber-color/12 rounded-2xl p-5 hover:bg-muted/35 dark:hover:bg-[#111827] hover:border-amber-color/30 hover:-translate-y-1 transition-all border-l-[3px] ${getLeftBorderColor(
                      tool.category
                    )}`}
                    style={{ transitionDuration: 'var(--linacre-duration-base)', boxShadow: 'var(--linacre-card-shadow)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--linacre-glow-soft)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--linacre-card-shadow)'; }}
                    id={`tool-card-${tool.id}`}
                  >
                    <div>
                      {/* Top bar inside card */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="font-mono text-sm font-semibold text-foreground group-hover:text-amber-color transition-colors">
                          {tool.name}
                        </h3>

                        <div className="flex items-center gap-1.5">
                          {/* Bookmark button */}
                          <button
                            onClick={(e) => toggleBookmark(tool.id, e)}
                            className="p-1 rounded-md text-muted-foreground hover:text-amber-color hover:bg-muted/60 transition-colors cursor-pointer"
                            title={isBookmarked ? 'Remove from stack' : 'Add to stack'}
                            aria-label={isBookmarked ? 'Remove from stack' : 'Add to stack'}
                          >
                            <Star
                              className={`w-3.5 h-3.5 transition-transform ${
                                isBookmarked
                                  ? 'fill-amber-color text-amber-color scale-110 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          </button>

                          <span
                            className={`font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              tool.tag === 'Free'
                                ? 'text-emerald-color bg-emerald-color/10'
                                : 'text-amber-color bg-amber-color/10'
                            }`}
                          >
                            {tool.tag}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
                        {tool.description}
                      </p>
                    </div>

                    {/* Bottom host */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground/70 border-t border-border-color/40 pt-3 mt-1">
                      <span>{tool.host}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan" />
                    </div>
                  </motion.a>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 border border-dashed border-border-color rounded-xl bg-muted/10 font-mono text-xs text-muted-foreground"
              id="no-results-panel"
            >
              <HelpCircle className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
              <p>// no matches — try another keyword or clear the filter.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Linacre Tool Box — MCP server for AI clients */}
      <section className="space-y-4" id="toolkit-mcp" aria-labelledby="mcp-heading">
        <div
          className="rounded-2xl border border-cyan/20 bg-gradient-to-b from-cyan/[0.06] to-transparent p-6 sm:p-8"
          style={{ boxShadow: 'var(--linacre-card-shadow)' }}
        >
          <div className="flex items-start gap-3 mb-5">
            <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-cyan/10 border border-cyan/30">
              <Bot className="w-4 h-4 text-cyan" />
            </div>
            <div>
              <h2 id="mcp-heading" className="font-mono text-base sm:text-lg font-semibold text-foreground flex items-center gap-2 flex-wrap">
                Use these tools in your AI
                <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded text-cyan bg-cyan/10 border border-cyan/20">
                  MCP
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1 max-w-2xl">
                The Linacre Tool Box also runs as a{' '}
                <span className="text-foreground">Model Context Protocol</span> server — the same private,
                offline utilities, callable by Claude, Cursor or any MCP client. Nothing you pass in ever
                leaves your machine.
              </p>
            </div>
          </div>

          {/* Tool chips */}
          <div className="flex flex-wrap gap-1.5 mb-6" aria-label="Tools available over MCP">
            {MCP_TOOLS.map((t) => (
              <span
                key={t}
                className="font-mono text-[10px] px-2 py-1 rounded-md bg-muted/40 dark:bg-[#0B1220]/60 border border-amber-color/12 text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Install snippets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 1 — build once */}
            <div className="rounded-xl border border-amber-color/12 bg-muted/20 dark:bg-[#0B1220]/60 p-4">
              <div className="flex items-center gap-2 mb-2 font-mono text-xs font-semibold text-foreground">
                <Terminal className="w-3.5 h-3.5 text-amber-color" /> 1 · Build once
              </div>
              <div className="flex items-center gap-2 bg-[#061923] border border-border-color/60 rounded-lg px-3 py-2">
                <code className="font-mono text-[11px] text-cyan overflow-x-auto whitespace-nowrap flex-1">
                  cd mcp &amp;&amp; npm install &amp;&amp; npm run build
                </code>
                <CopyButton text="cd mcp && npm install && npm run build" />
              </div>
              <p className="text-[10px] text-muted-foreground/70 mt-2 leading-relaxed">
                Builds <code className="text-muted-foreground">mcp/dist/server.js</code> — pure Node, no keys.
              </p>
            </div>

            {/* Step 2 — add to Claude */}
            <div className="rounded-xl border border-amber-color/12 bg-muted/20 dark:bg-[#0B1220]/60 p-4">
              <div className="flex items-center gap-2 mb-2 font-mono text-xs font-semibold text-foreground">
                <Terminal className="w-3.5 h-3.5 text-emerald-color" /> 2 · Add to Claude
              </div>
              <div className="flex items-center gap-2 bg-[#061923] border border-border-color/60 rounded-lg px-3 py-2">
                <code className="font-mono text-[11px] text-emerald-color overflow-x-auto whitespace-nowrap flex-1">
                  claude mcp add linacre-toolbox -- node ./mcp/dist/server.js
                </code>
                <CopyButton text="claude mcp add linacre-toolbox -- node ./mcp/dist/server.js" />
              </div>
              <p className="text-[10px] text-muted-foreground/70 mt-2 leading-relaxed">
                Or point Claude Desktop's <code className="text-muted-foreground">mcpServers</code> at that file.
                All 11 tools appear instantly.
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 font-mono text-[11px]">
            <a href="/.well-known/mcp.json" target="_blank" rel="noopener" className="text-muted-foreground hover:text-cyan transition-colors inline-flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> manifest
            </a>
            <a href="/skills.txt" target="_blank" rel="noopener" className="text-muted-foreground hover:text-cyan transition-colors inline-flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> skills.txt
            </a>
            <a href="https://github.com/LIN4CRE/linacre.site" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-cyan transition-colors inline-flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> source · mcp/
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
