import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  ExternalLink,
  Globe2,
  Keyboard,
  Radar,
  Search,
  ShieldCheck,
  Shuffle,
  Star,
  X,
} from 'lucide-react';
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import {
  createOsintSearchIndex,
  flattenOsintTools,
  getOsintCounts,
  isOsintPayload,
  OSINT_STORAGE_KEYS,
  parseOsintHash,
  serializeOsintHash,
  type OsintPayload,
  type OsintTool,
  type OsintView,
} from '../lib/osintHud';

type Accent = 'cyan' | 'violet' | 'amber' | 'rose';

const SUGGESTIONS = ['username', 'breach', 'flight', 'github', 'vin', 'webcam', 'domain'];
const ACCENTS: Array<{ id: Accent; label: string }> = [
  { id: 'cyan', label: 'Cyan accent' },
  { id: 'violet', label: 'Violet accent' },
  { id: 'amber', label: 'Amber accent' },
  { id: 'rose', label: 'Rose accent' },
];
const VIEW_OPTIONS: Array<{ id: OsintView; label: string }> = [
  { id: 'all', label: 'All tools' },
  { id: 'curated', label: 'Curated' },
  { id: 'stars', label: 'My stars' },
  { id: 'recent', label: 'Recent' },
];

function readStoredList(key: string): string[] {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const value: unknown = JSON.parse(stored);
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
}

function readStoredPreference<T extends string>(
  key: string,
  allowed: readonly T[],
  fallback: T,
): T {
  try {
    const value = localStorage.getItem(key);
    return value && allowed.includes(value as T) ? (value as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveStoredValue(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The HUD remains usable when private browsing or browser policy blocks storage.
  }
}

function isEditableTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
      target.closest('[contenteditable="true"]') !== null)
  );
}

function hostInitial(host: string): string {
  return (
    host
      .trim()
      .replace(/^www\./i, '')
      .slice(0, 1)
      .toUpperCase() || '↗'
  );
}

function createToolFromPrime(
  entry: OsintPayload['prime'][number],
  index: number,
  toolsByUrl: Map<string, OsintTool>,
): OsintTool {
  const [title, host, url, category, description] = entry;
  return (
    toolsByUrl.get(url) ?? {
      id: `priority:${index}`,
      title,
      host,
      url,
      category: description,
      categoryId: `priority:${index}`,
      sectorId: 'priority',
      sectorName: category,
    }
  );
}

function WorldClock({ zones }: { zones: OsintPayload['zones'] }) {
  const [now, setNow] = useState(() => new Date());
  const localZone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);
  const localFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
    [],
  );
  const zoneFormatters = useMemo(
    () =>
      new Map(
        zones.map(([, timeZone]) => [
          timeZone,
          new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone,
          }),
        ]),
      ),
    [zones],
  );

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="osint-world" aria-label="World clocks" aria-live="off">
      <div className="osint-world__local">
        <Clock3 aria-hidden="true" />
        <span>LOCAL</span>
        <strong>{localFormatter.format(now)}</strong>
      </div>
      <div className="osint-world__zones">
        {zones.map(([code, timeZone]) => {
          const time = zoneFormatters.get(timeZone)?.format(now) ?? '--:--:--';
          const isLocal = timeZone === localZone;
          return (
            <div
              key={timeZone}
              className={`osint-zone${isLocal ? ' is-local' : ''}`}
              title={`${timeZone}${isLocal ? ' · your local time zone' : ''}`}
            >
              <span>{code}</span>
              <strong>{time}</strong>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function OsintHud() {
  const [payload, setPayload] = useState<OsintPayload | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [query, setQuery] = useState(() =>
    typeof window === 'undefined' ? '' : parseOsintHash(window.location.hash).query,
  );
  const [activeSectorId, setActiveSectorId] = useState(() =>
    typeof window === 'undefined' ? 'all' : parseOsintHash(window.location.hash).sectorId,
  );
  const [activeView, setActiveView] = useState<OsintView>(() =>
    typeof window === 'undefined' ? 'all' : parseOsintHash(window.location.hash).view,
  );
  const [favorites, setFavorites] = useState(
    () => new Set(readStoredList(OSINT_STORAGE_KEYS.stars)),
  );
  const [recentUrls, setRecentUrls] = useState(() => readStoredList(OSINT_STORAGE_KEYS.recents));
  const [accent, setAccent] = useState<Accent>(() =>
    readStoredPreference(OSINT_STORAGE_KEYS.accent, ['cyan', 'violet', 'amber', 'rose'], 'cyan'),
  );
  const [compact, setCompact] = useState(
    () =>
      readStoredPreference(OSINT_STORAGE_KEYS.density, ['cozy', 'compact'], 'cozy') === 'compact',
  );
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => new Set());
  const [expandedResultsFor, setExpandedResultsFor] = useState<{
    key: string;
    limit: number;
  } | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [toast, setToast] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const deferredQuery = useDeferredValue(query.trim());
  const requestedSector = payload?.groups.find(group => group.id === activeSectorId);
  const selectedSectorId =
    payload && activeSectorId !== 'all' && !requestedSector ? 'all' : activeSectorId;
  const activeSector = selectedSectorId === 'all' ? undefined : requestedSector;
  const allCategoriesExpanded = Boolean(
    activeSector &&
    activeSector.cats.length > 0 &&
    activeSector.cats.every((_, index) => expandedCategories.has(`${activeSector.id}:${index}`)),
  );

  useEffect(() => {
    const controller = new AbortController();
    fetch('/data/osint-hud.json', { signal: controller.signal, cache: 'force-cache' })
      .then(async response => {
        if (!response.ok) throw new Error(`OSINT data request failed (${response.status})`);
        const value: unknown = await response.json();
        if (!isOsintPayload(value)) throw new Error('The OSINT data file is invalid.');
        setPayload(value);
      })
      .catch(error => {
        if (!controller.signal.aborted) {
          console.error('[OSINT HUD] Could not load the local tool directory.', error);
          setLoadError(true);
        }
      });
    return () => controller.abort();
  }, []);

  useEffect(
    () => () => {
      if (toastTimer.current !== undefined) window.clearTimeout(toastTimer.current);
    },
    [],
  );

  useEffect(() => {
    saveStoredValue(OSINT_STORAGE_KEYS.stars, [...favorites]);
  }, [favorites]);
  useEffect(() => saveStoredValue(OSINT_STORAGE_KEYS.recents, recentUrls), [recentUrls]);
  useEffect(() => saveStoredValue(OSINT_STORAGE_KEYS.accent, accent), [accent]);
  useEffect(
    () => saveStoredValue(OSINT_STORAGE_KEYS.density, compact ? 'compact' : 'cozy'),
    [compact],
  );

  useEffect(() => {
    const restoreLocation = () => {
      const sectors = payload?.groups.map(group => group.id) ?? [];
      const next = parseOsintHash(window.location.hash, sectors);
      setQuery(next.query);
      setActiveSectorId(next.sectorId);
      setActiveView(next.view);
    };
    window.addEventListener('popstate', restoreLocation);
    window.addEventListener('hashchange', restoreLocation);
    return () => {
      window.removeEventListener('popstate', restoreLocation);
      window.removeEventListener('hashchange', restoreLocation);
    };
  }, [payload]);

  useEffect(() => {
    const nextHash = serializeOsintHash({ query, sectorId: selectedSectorId, view: activeView });
    const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextUrl === currentUrl) return;
    const timer = window.setTimeout(() => window.history.replaceState(null, '', nextUrl), 180);
    return () => window.clearTimeout(timer);
  }, [activeSectorId, activeView, query, selectedSectorId]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showShortcuts) {
          setShowShortcuts(false);
          return;
        }
        if (document.activeElement === searchRef.current && query) {
          event.preventDefault();
          setQuery('');
          return;
        }
      }
      if (isEditableTarget(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === '/') {
        event.preventDefault();
        searchRef.current?.focus();
      } else if (event.key === '?') {
        event.preventDefault();
        setShowShortcuts(open => !open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [query, showShortcuts]);

  const tools = useMemo(() => (payload ? flattenOsintTools(payload.groups) : []), [payload]);
  const counts = useMemo(() => (payload ? getOsintCounts(payload) : null), [payload]);
  const searchIndex = useMemo(() => createOsintSearchIndex(tools), [tools]);
  const toolsByUrl = useMemo(() => new Map(tools.map(tool => [tool.url, tool])), [tools]);
  const toolsById = useMemo(() => new Map(tools.map(tool => [tool.id, tool])), [tools]);
  const countsBySector = useMemo(() => {
    const counts = new Map<string, number>();
    tools.forEach(tool => counts.set(tool.sectorId, (counts.get(tool.sectorId) ?? 0) + 1));
    return counts;
  }, [tools]);
  const curatedUrls = useMemo(() => new Set(payload?.starred ?? []), [payload]);
  const priorityTools = useMemo(
    () => payload?.prime.map((entry, index) => createToolFromPrime(entry, index, toolsByUrl)) ?? [],
    [payload, toolsByUrl],
  );

  const matchingTools = useMemo(() => {
    if (!payload || (!deferredQuery && activeView === 'all')) return [];

    let matches: OsintTool[];
    if (deferredQuery) {
      matches = searchIndex.search(deferredQuery).map(result => result.item);
    } else if (activeView === 'curated') {
      matches = tools.filter(tool => curatedUrls.has(tool.url));
    } else if (activeView === 'stars') {
      matches = tools.filter(tool => favorites.has(tool.url));
    } else {
      matches = recentUrls.flatMap(url => {
        const tool = toolsByUrl.get(url);
        return tool ? [tool] : [];
      });
    }

    if (activeView === 'curated') matches = matches.filter(tool => curatedUrls.has(tool.url));
    if (activeView === 'stars') matches = matches.filter(tool => favorites.has(tool.url));
    if (activeView === 'recent') {
      const order = new Map(recentUrls.map((url, index) => [url, index]));
      matches = matches
        .filter(tool => order.has(tool.url))
        .sort((a, b) => (order.get(a.url) ?? 0) - (order.get(b.url) ?? 0));
    }
    if (selectedSectorId !== 'all')
      matches = matches.filter(tool => tool.sectorId === selectedSectorId);
    return matches;
  }, [
    selectedSectorId,
    activeView,
    curatedUrls,
    deferredQuery,
    favorites,
    payload,
    recentUrls,
    searchIndex,
    tools,
    toolsByUrl,
  ]);

  const resultKey = `${selectedSectorId}|${activeView}|${deferredQuery}`;
  const visibleLimit = expandedResultsFor?.key === resultKey ? expandedResultsFor.limit : 72;
  const showMoreResults = visibleLimit > 72;
  const showResults = Boolean(deferredQuery) || activeView !== 'all';
  const visibleTools = matchingTools.slice(0, visibleLimit);

  const notify = (message: string) => {
    setToast(message);
    if (toastTimer.current !== undefined) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2400);
  };

  const recordRecent = (tool: OsintTool) => {
    setRecentUrls(previous => [tool.url, ...previous.filter(url => url !== tool.url)].slice(0, 14));
  };

  const openTool = (tool: OsintTool) => {
    recordRecent(tool);
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  };

  const toggleFavorite = (tool: OsintTool) => {
    setFavorites(previous => {
      const next = new Set(previous);
      if (next.has(tool.url)) {
        next.delete(tool.url);
        notify(`${tool.title} removed from My stars`);
      } else {
        next.add(tool.url);
        notify(`${tool.title} saved to My stars`);
      }
      return next;
    });
  };

  const copyText = async (value: string, message: string) => {
    try {
      await navigator.clipboard.writeText(value);
      notify(message);
    } catch {
      const input = document.createElement('textarea');
      input.value = value;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      try {
        const copied = document.execCommand('copy');
        notify(copied ? message : 'Copy is unavailable in this browser.');
      } catch {
        notify('Copy is unavailable in this browser.');
      }
      input.remove();
    }
  };

  const setView = (view: OsintView) => {
    setActiveView(view);
    setActiveSectorId('all');
  };

  const setSector = (sectorId: string) => {
    setActiveSectorId(sectorId);
    setActiveView('all');
    setExpandedCategories(new Set());
  };

  const selectSuggestion = (value: string) => {
    setQuery(value);
    setActiveView('all');
    searchRef.current?.focus();
  };

  const sectorCount = (sectorId: string) => countsBySector.get(sectorId) ?? 0;

  const categoryTool = (sector: string, categoryIndex: number, linkIndex: number) =>
    toolsById.get(`${sector}:${categoryIndex}:${linkIndex}`);

  const currentResultGroups = useMemo(() => {
    const grouped = new Map<string, { label: string; tools: OsintTool[] }>();
    visibleTools.forEach(tool => {
      const key = tool.sectorId;
      const group = grouped.get(key) ?? { label: tool.sectorName, tools: [] };
      group.tools.push(tool);
      grouped.set(key, group);
    });
    return [...grouped.entries()];
  }, [visibleTools]);

  const renderToolCard = (tool: OsintTool) => (
    <article
      key={tool.id}
      className="osint-tool-card"
      onContextMenu={event => {
        event.preventDefault();
        void copyText(tool.url, 'Tool link copied');
      }}
    >
      <span className="osint-tool-card__mark" aria-hidden="true">
        {hostInitial(tool.host)}
      </span>
      <div className="osint-tool-card__body">
        <a
          className="osint-tool-card__title"
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => recordRecent(tool)}
          aria-label={`Open ${tool.title} at ${tool.host} in a new tab`}
        >
          <span>{tool.title}</span>
          <ExternalLink aria-hidden="true" />
        </a>
        <span className="osint-tool-card__host">{tool.host}</span>
        <span className="osint-tool-card__category">
          {tool.sectorName} <span aria-hidden="true">·</span> {tool.category}
        </span>
      </div>
      <div className="osint-tool-card__actions">
        <button
          type="button"
          className={`osint-icon-button${favorites.has(tool.url) ? ' is-favorite' : ''}`}
          aria-label={
            favorites.has(tool.url)
              ? `Remove ${tool.title} from My stars`
              : `Add ${tool.title} to My stars`
          }
          aria-pressed={favorites.has(tool.url)}
          title={favorites.has(tool.url) ? 'Remove from My stars' : 'Add to My stars'}
          onClick={() => toggleFavorite(tool)}
        >
          <Star aria-hidden="true" />
        </button>
        <button
          type="button"
          className="osint-icon-button"
          aria-label={`Copy ${tool.title} link`}
          title="Copy link"
          onClick={() => void copyText(tool.url, 'Tool link copied')}
        >
          <Copy aria-hidden="true" />
        </button>
      </div>
    </article>
  );

  if (loadError) {
    return (
      <section className="osint-hud" aria-labelledby="osint-title">
        <div className="osint-error">
          <Radar aria-hidden="true" />
          <div>
            <h1 id="osint-title">OSINT HUD</h1>
            <p>The local directory could not be loaded. Check your connection and try again.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="osint-action-button"
            >
              Reload directory
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!payload || !counts) {
    return (
      <section className="osint-hud" aria-labelledby="osint-loading-title">
        <div className="osint-loading" role="status" aria-live="polite">
          <span className="osint-loading__pulse" aria-hidden="true" />
          <div>
            <h1 id="osint-loading-title">Preparing the OSINT HUD</h1>
            <p>Loading the curated directory on this device…</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`osint-hud${compact ? ' is-compact' : ''}`}
      data-accent={accent}
      aria-labelledby="osint-title"
    >
      <header className="osint-hero">
        <div className="osint-hero__grid" aria-hidden="true" />
        <div className="osint-hero__topline">
          <span className="osint-eyebrow">
            <Radar aria-hidden="true" /> LINACRE <span aria-hidden="true">//</span> OPEN-SOURCE
            INTELLIGENCE
          </span>
          <span className="osint-live">
            <i aria-hidden="true" /> CLIENT-SIDE DIRECTORY
          </span>
        </div>
        <div className="osint-hero__content">
          <div className="osint-hero__copy">
            <p className="osint-kicker">A considered map of public research tools</p>
            <h1 id="osint-title">
              Open-source intel,
              <br />
              <span>one clear view.</span>
            </h1>
            <p className="osint-hero__description">
              Find the right public resource for a question, then open it directly. Search across
              the curated OSINT4ALL directory without sending your query to a search service.
            </p>
          </div>
          <div className="osint-stats" aria-label="Directory size">
            <div>
              <strong>{counts.tools.toLocaleString('en-GB')}</strong>
              <span>TOOLS</span>
            </div>
            <div>
              <strong>{counts.categories}</strong>
              <span>CATEGORIES</span>
            </div>
            <div>
              <strong>{counts.sectors}</strong>
              <span>SECTORS</span>
            </div>
            <div>
              <strong>{favorites.size}</strong>
              <span>MY STARS</span>
            </div>
          </div>
        </div>
        <div className="osint-search-wrap">
          <Search aria-hidden="true" />
          <label className="osint-visually-hidden" htmlFor="osint-search">
            Search all {counts.tools.toLocaleString('en-GB')} OSINT resources
          </label>
          <input
            ref={searchRef}
            id="osint-search"
            type="search"
            value={query}
            onChange={event => setQuery(event.currentTarget.value)}
            placeholder="Search tools, domains, categories…"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          {query && (
            <button
              type="button"
              className="osint-search-clear"
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              <X aria-hidden="true" />
            </button>
          )}
          <kbd aria-hidden="true">/</kbd>
        </div>
        <div className="osint-suggestions" aria-label="Popular searches">
          <span>TRY</span>
          {SUGGESTIONS.map(suggestion => (
            <button key={suggestion} type="button" onClick={() => selectSuggestion(suggestion)}>
              {suggestion}
            </button>
          ))}
        </div>
      </header>

      <WorldClock zones={payload.zones} />

      <div className="osint-console-bar">
        <div className="osint-view-tabs" role="group" aria-label="Directory views">
          {VIEW_OPTIONS.map(option => {
            const count =
              option.id === 'all'
                ? counts.tools
                : option.id === 'curated'
                  ? payload.starred.length
                  : option.id === 'stars'
                    ? favorites.size
                    : recentUrls.length;
            return (
              <button
                key={option.id}
                type="button"
                className={activeView === option.id ? 'is-active' : ''}
                aria-pressed={activeView === option.id}
                onClick={() => setView(option.id)}
              >
                {option.id === 'curated' && <Star aria-hidden="true" />}
                {option.id === 'stars' && <Star aria-hidden="true" />}
                {option.id === 'recent' && <Clock3 aria-hidden="true" />}
                <span>{option.label}</span>
                <span className="osint-view-count">{count.toLocaleString('en-GB')}</span>
              </button>
            );
          })}
        </div>
        <div className="osint-console-tools" role="group" aria-label="Directory controls">
          <div className="osint-accent-controls" role="group" aria-label="HUD accent colour">
            {ACCENTS.map(option => (
              <button
                key={option.id}
                type="button"
                className={`osint-accent-swatch osint-accent-swatch--${option.id}${accent === option.id ? ' is-active' : ''}`}
                aria-label={option.label}
                aria-pressed={accent === option.id}
                title={option.label}
                onClick={() => setAccent(option.id)}
              />
            ))}
          </div>
          <button
            type="button"
            className="osint-action-button"
            onClick={() => setCompact(value => !value)}
            aria-pressed={compact}
            title={compact ? 'Switch to comfortable spacing' : 'Switch to compact spacing'}
          >
            <span aria-hidden="true">{compact ? '↕' : '▤'}</span>
            <span>{compact ? 'Compact' : 'Comfort'}</span>
          </button>
          <button
            type="button"
            className="osint-action-button"
            onClick={() => {
              const random = tools[Math.floor(Math.random() * tools.length)];
              if (random) openTool(random);
            }}
            disabled={!tools.length}
            title="Open a random tool in a new tab"
          >
            <Shuffle aria-hidden="true" /> <span>Random</span>
          </button>
          {(query || activeView !== 'all' || selectedSectorId !== 'all') && (
            <button
              type="button"
              className="osint-action-button"
              onClick={() => void copyText(window.location.href, 'Shareable view copied')}
              title="Copy a link to this view"
            >
              <Copy aria-hidden="true" /> <span>Share view</span>
            </button>
          )}
          <button
            type="button"
            className={`osint-action-button${showShortcuts ? ' is-active' : ''}`}
            onClick={() => setShowShortcuts(value => !value)}
            aria-expanded={showShortcuts}
            aria-controls="osint-shortcuts"
            title="Keyboard shortcuts (?)"
          >
            <Keyboard aria-hidden="true" /> <span>Keys</span>
          </button>
        </div>
      </div>

      {showShortcuts && (
        <aside id="osint-shortcuts" className="osint-shortcuts" aria-label="Keyboard shortcuts">
          <div>
            <kbd>/</kbd>
            <span>Focus tool search</span>
          </div>
          <div>
            <kbd>?</kbd>
            <span>Toggle keyboard help</span>
          </div>
          <div>
            <kbd>Esc</kbd>
            <span>Clear search or close help</span>
          </div>
          <button
            type="button"
            onClick={() => setShowShortcuts(false)}
            aria-label="Close keyboard help"
          >
            <X aria-hidden="true" />
          </button>
        </aside>
      )}

      <nav className="osint-sector-filter" aria-label="Filter by sector">
        <button
          type="button"
          className={selectedSectorId === 'all' ? 'is-active' : ''}
          aria-pressed={selectedSectorId === 'all'}
          onClick={() => setSector('all')}
        >
          All sectors <span>{counts.tools.toLocaleString('en-GB')}</span>
        </button>
        {payload.groups.map(group => (
          <button
            key={group.id}
            type="button"
            className={selectedSectorId === group.id ? 'is-active' : ''}
            aria-pressed={selectedSectorId === group.id}
            onClick={() => setSector(group.id)}
          >
            {group.name} <span>{sectorCount(group.id)}</span>
          </button>
        ))}
      </nav>

      {showResults ? (
        <section className="osint-results" aria-labelledby="osint-results-title">
          <div className="osint-section-heading">
            <div>
              <p className="osint-section-kicker">
                {deferredQuery
                  ? 'DIRECTORY SEARCH'
                  : activeView === 'all'
                    ? 'FILTERED DIRECTORY'
                    : 'SAVED WORKSPACE'}
              </p>
              <h2 id="osint-results-title">
                {deferredQuery
                  ? `Results for “${deferredQuery}”`
                  : activeView === 'curated'
                    ? 'Curated resources'
                    : activeView === 'stars'
                      ? 'My starred tools'
                      : activeView === 'recent'
                        ? 'Recently opened'
                        : (activeSector?.name ?? 'All resources')}
              </h2>
            </div>
            <p className="osint-result-count" role="status" aria-live="polite" aria-atomic="true">
              {matchingTools.length.toLocaleString('en-GB')}{' '}
              {matchingTools.length === 1 ? 'resource' : 'resources'}
            </p>
          </div>

          {matchingTools.length ? (
            <div className="osint-result-groups">
              {currentResultGroups.map(([sectorId, group]) => (
                <section key={sectorId} className="osint-result-group" aria-label={group.label}>
                  <h3>{group.label}</h3>
                  <div className="osint-tool-grid">{group.tools.map(renderToolCard)}</div>
                </section>
              ))}
            </div>
          ) : (
            <div className="osint-empty-state">
              <Globe2 aria-hidden="true" />
              <h3>{activeView === 'stars' ? 'No starred resources yet' : 'No matches found'}</h3>
              <p>
                {activeView === 'stars'
                  ? 'Save a tool with the star button and it will be ready here next time.'
                  : activeView === 'recent'
                    ? 'Open a resource and it will appear here for quick access.'
                    : 'Try a shorter search, a domain name, or a different sector.'}
              </p>
              {(query || selectedSectorId !== 'all' || activeView !== 'all') && (
                <button
                  type="button"
                  className="osint-action-button"
                  onClick={() => {
                    setQuery('');
                    setView('all');
                    setSector('all');
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {matchingTools.length > visibleLimit && (
            <button
              type="button"
              className="osint-show-more"
              onClick={() =>
                setExpandedResultsFor({
                  key: resultKey,
                  limit: Math.min(visibleLimit + 72, matchingTools.length),
                })
              }
            >
              Show next {Math.min(72, matchingTools.length - visibleLimit)} results
              <ChevronDown aria-hidden="true" />
            </button>
          )}
          {showMoreResults && (
            <button
              type="button"
              className="osint-show-more"
              onClick={() => setExpandedResultsFor(null)}
            >
              Show first 72 results <ChevronDown aria-hidden="true" />
            </button>
          )}
        </section>
      ) : activeSector ? (
        <section className="osint-sector-directory" aria-labelledby="osint-sector-title">
          <div className="osint-section-heading">
            <div>
              <p className="osint-section-kicker">SECTOR DIRECTORY</p>
              <h2 id="osint-sector-title">{activeSector.name}</h2>
            </div>
            <span className="osint-result-count">
              {activeSector.cats.length} categories · {sectorCount(activeSector.id)} resources
            </span>
          </div>
          <div className="osint-category-list">
            {activeSector.cats.map((category, categoryIndex) => {
              const id = `${activeSector.id}:${categoryIndex}`;
              const isExpanded = expandedCategories.has(id);
              return (
                <section key={id} className={`osint-category${isExpanded ? ' is-open' : ''}`}>
                  <button
                    type="button"
                    className="osint-category__toggle"
                    aria-expanded={isExpanded}
                    aria-controls={`osint-category-${activeSector.id}-${categoryIndex}`}
                    onClick={() => {
                      const next = new Set(expandedCategories);
                      if (next.has(id)) next.delete(id);
                      else next.add(id);
                      setExpandedCategories(next);
                    }}
                  >
                    <span className="osint-category__initials" aria-hidden="true">
                      {category.cat
                        .replace(/[^a-z0-9]/gi, '')
                        .slice(0, 3)
                        .toUpperCase()}
                    </span>
                    <span className="osint-category__name">{category.cat}</span>
                    <span className="osint-category__count">{category.links.length}</span>
                    <ChevronDown aria-hidden="true" />
                  </button>
                  {isExpanded && (
                    <div
                      id={`osint-category-${activeSector.id}-${categoryIndex}`}
                      className="osint-category__content"
                    >
                      <div className="osint-tool-grid">
                        {category.links.map((_, linkIndex) => {
                          const tool = categoryTool(activeSector.id, categoryIndex, linkIndex);
                          return tool ? renderToolCard(tool) : null;
                        })}
                      </div>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
          <div className="osint-category-controls">
            <button
              type="button"
              className="osint-action-button"
              onClick={() => {
                setExpandedCategories(
                  allCategoriesExpanded
                    ? new Set()
                    : new Set(activeSector.cats.map((_, index) => `${activeSector.id}:${index}`)),
                );
              }}
              aria-pressed={allCategoriesExpanded}
              title={allCategoriesExpanded ? 'Collapse all categories' : 'Expand all categories'}
            >
              <ChevronDown
                aria-hidden="true"
                className={allCategoriesExpanded ? 'is-rotated' : ''}
              />
              <span>{allCategoriesExpanded ? 'Collapse all' : 'Expand all'}</span>
            </button>
            {recentUrls.length > 0 && (
              <button
                type="button"
                className="osint-action-button osint-clear-recents"
                onClick={() => {
                  setRecentUrls([]);
                  notify('Recent tools cleared');
                }}
              >
                Clear recent
              </button>
            )}
          </div>
        </section>
      ) : (
        <>
          <section className="osint-priority" aria-labelledby="osint-priority-title">
            <div className="osint-section-heading">
              <div>
                <p className="osint-section-kicker">A GOOD PLACE TO START</p>
                <h2 id="osint-priority-title">Priority resources</h2>
              </div>
              <span className="osint-result-count">{priorityTools.length} editor-selected</span>
            </div>
            <div className="osint-priority-grid">
              {priorityTools.map((tool, index) => (
                <article key={tool.id} className="osint-priority-card">
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => recordRecent(tool)}
                    className="osint-priority-card__link"
                  >
                    <span className="osint-priority-card__topline">
                      <span className="osint-priority-card__number">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="osint-priority-card__host">{tool.host}</span>
                      <ArrowUpRight aria-hidden="true" />
                    </span>
                    <strong>{tool.title}</strong>
                    <span className="osint-priority-card__description">
                      {payload.prime[index]?.[4] ?? tool.category}
                    </span>
                  </a>
                  <button
                    type="button"
                    className={`osint-icon-button${favorites.has(tool.url) ? ' is-favorite' : ''}`}
                    aria-label={
                      favorites.has(tool.url)
                        ? `Remove ${tool.title} from My stars`
                        : `Add ${tool.title} to My stars`
                    }
                    aria-pressed={favorites.has(tool.url)}
                    onClick={() => toggleFavorite(tool)}
                  >
                    <Star aria-hidden="true" />
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="osint-sector-overview" aria-labelledby="osint-sectors-title">
            <div className="osint-section-heading">
              <div>
                <p className="osint-section-kicker">BROWSE THE DIRECTORY</p>
                <h2 id="osint-sectors-title">11 research sectors</h2>
              </div>
              <span className="osint-result-count">{counts.categories} focused categories</span>
            </div>
            <div className="osint-sector-grid">
              {payload.groups.map((group, index) => (
                <button
                  key={group.id}
                  type="button"
                  className="osint-sector-card"
                  onClick={() => setSector(group.id)}
                >
                  <span className="osint-sector-card__index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="osint-sector-card__copy">
                    <strong>{group.name}</strong>
                    <small>{group.cats.length} categories</small>
                  </span>
                  <span className="osint-sector-card__count">{sectorCount(group.id)}</span>
                  <ArrowUpRight aria-hidden="true" />
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      <footer className="osint-footer">
        <div className="osint-footer__notice">
          <ShieldCheck aria-hidden="true" />
          <p>
            A directory of third-party resources, not an endorsement of their owners or methods. Use
            these tools lawfully, respect privacy and platform terms, and obtain appropriate
            consent.
          </p>
        </div>
        <p className="osint-footer__privacy">
          Search is performed on this device. The current search and sector are reflected in the URL
          fragment for sharing; fragments are not sent to our server, but remain visible in your
          address bar and browser history. Do not put sensitive identifiers in a shareable query.
        </p>
        <div className="osint-footer__links">
          <a
            href="https://github.com/LIN4CRE/linacre-osint-hud"
            target="_blank"
            rel="noopener noreferrer"
          >
            Original HUD source <ArrowUpRight aria-hidden="true" />
          </a>
          <a href="https://start.me/p/L1rEYQ/osint4all" target="_blank" rel="noopener noreferrer">
            OSINT4ALL collection <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </footer>

      <div className="osint-toast" role="status" aria-live="polite" aria-atomic="true">
        {toast ? (
          <>
            <Check aria-hidden="true" /> {toast}
          </>
        ) : null}
      </div>
    </section>
  );
}
