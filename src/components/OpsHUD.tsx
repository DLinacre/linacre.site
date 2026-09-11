import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Bot, Check, Copy, GitBranch, Layers, Maximize2, Minimize2, Radio, RefreshCw, Search, Workflow, Zap } from 'lucide-react';
import { SITE_PROJECTS } from '../data/siteProjects';
import { OPERATIONS_AGENTS, OPERATIONS_FLOWS, OPERATIONS_PROJECT, FLOW_GUIDE, TRIGGER_GUIDE, parseBuildReceipt, type BuildReceipt } from '../config/operations';

const panel = 'rounded-2xl border border-border-color bg-[var(--linacre-panel)]';
const button = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border-color px-3 text-sm transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground';
const tabs = ['Overview', 'Agents', 'Flows & triggers', 'Projects'] as const;

function Portrait({ color, number }: { color: string; number: string }) {
  return (
    <svg viewBox="0 0 160 140" aria-hidden="true" className="h-28 w-full" style={{ color }}>
      <path d="M20 109 80 132l60-23V40L80 8 20 40z" fill="currentColor" opacity=".06" />
      <path d="M20 109 80 132l60-23V40L80 8 20 40z" stroke="currentColor" fill="none" opacity=".3" />
      <path d="m53 43 27-12 27 12 7 43-34 20-34-20z" fill="var(--background)" stroke="currentColor" strokeWidth="2" />
      <path d="M54 64h52l-5 17H59z" fill="currentColor" opacity=".25" />
      <path d="M61 69h13m12 0h13M70 91h20M80 33v15" stroke="currentColor" strokeWidth="3" />
      <path d="m44 96-15 18m87-18 15 18M34 29l8 8m84-8-8 8" stroke="currentColor" opacity=".6" />
      <text x="12" y="128" fill="currentColor" fontFamily="monospace" fontSize="12">{number}</text>
    </svg>
  );
}

export default function OpsHUD() {
  const root = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<(typeof tabs)[number]>('Overview');
  const [agentId, setAgentId] = useState<string>('scout');
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const [receipt, setReceipt] = useState<BuildReceipt | null>(null);
  const [feed, setFeed] = useState('Loading build receipt…');
  const [refresh, setRefresh] = useState(0);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);
  const [online, setOnline] = useState(navigator.onLine);
  const [fullscreen, setFullscreen] = useState(false);
  const [notice, setNotice] = useState('');
  const [copied, setCopied] = useState('');
  const agent = OPERATIONS_AGENTS.find(item => item.id === agentId) || OPERATIONS_AGENTS[0];

  useEffect(() => {
    const connected = () => setOnline(navigator.onLine);
    const resized = () => setFullscreen(document.fullscreenElement === root.current);
    window.addEventListener('online', connected);
    window.addEventListener('offline', connected);
    document.addEventListener('fullscreenchange', resized);
    return () => {
      window.removeEventListener('online', connected);
      window.removeEventListener('offline', connected);
      document.removeEventListener('fullscreenchange', resized);
    };
  }, []);

  useEffect(() => {
    let active = true;
    let controller: AbortController | undefined;
    const load = async () => {
      controller?.abort();
      const request = new AbortController();
      controller = request;
      try {
        const response = await fetch('/ops-status.json', { cache: 'no-store', signal: request.signal });
        if (!response.ok) throw new Error('Build receipt unavailable');
        const text = await response.text();
        if (text.length > 16000) throw new Error('Invalid build receipt');
        const parsed = parseBuildReceipt(JSON.parse(text));
        if (!parsed) throw new Error('Invalid build receipt');
        if (!active || request.signal.aborted) return;
        setReceipt(parsed);
        setFeed('Build receipt loaded');
        setCheckedAt(new Date().toISOString());
      } catch {
        if (!active || request.signal.aborted) return;
        setFeed('Build feed unavailable — last receipt may be stale');
        setCheckedAt(new Date().toISOString());
      }
    };
    void load();
    const interval = window.setInterval(() => { if (!document.hidden) void load(); }, 60000);
    return () => { active = false; controller?.abort(); window.clearInterval(interval); };
  }, [refresh]);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (root.current?.requestFullscreen) await root.current.requestFullscreen();
      else setNotice('Fullscreen is not supported in this browser.');
    } catch { setNotice('Fullscreen could not be opened.'); }
  };
  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(text); setNotice('Configuration path copied.'); }
    catch { setNotice('Clipboard unavailable. Select and copy the displayed path instead.'); }
  };
  const projects = SITE_PROJECTS.filter(project => (kind === 'all' || project.kind === kind) &&
    [project.name, project.blurb, ...project.tags].join(' ').toLowerCase().includes(query.trim().toLowerCase()));
  const shownAt = receipt ? new Date(receipt.generatedAt).toLocaleString() : 'No build receipt yet';

  return (
    <div ref={root} className="space-y-6 rounded-3xl bg-background text-foreground fullscreen:overflow-y-auto fullscreen:p-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div><p className="font-mono text-xs uppercase tracking-[.22em] text-muted-foreground">Linacre / operations deck</p><h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">Mission Control</h1></div>
        <div className="flex gap-2"><button type="button" className={button} onClick={() => setRefresh(value => value + 1)}><RefreshCw className="h-4 w-4" aria-hidden="true" />Refresh feed</button><button type="button" className={button} onClick={toggleFullscreen} aria-label={fullscreen ? 'Exit fullscreen' : 'Open fullscreen'}>{fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}</button></div>
      </header>
      <section className="relative isolate overflow-hidden rounded-3xl border border-border-color bg-[#061224] text-white" aria-label="Command deck artwork">
        <img src="/ops-observatory.svg" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover object-right" />
        <div className="bg-gradient-to-r from-[#061224] via-[#061224]/90 to-transparent p-6 sm:p-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 font-mono text-xs"><Radio className="h-3 w-3" aria-hidden="true" />{online ? 'Browser network available' : 'Browser offline'}</span>
          <h2 className="mt-6 max-w-sm font-display text-3xl font-bold sm:text-4xl">Your projects.<br />A clearer view.</h2>
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">A command deck for the tools you use, the work you plan and the evidence behind each release.</p>
          <p className="mt-6 max-w-sm text-xs leading-6 text-slate-300">Live agent sessions and cross-repository telemetry are not connected. No simulated jobs or invented health scores.</p>
        </div>
      </section>
      <div role="status" className="text-sm text-muted-foreground">{notice || feed}</div>
      <nav aria-label="Operations views" className="flex flex-wrap gap-2">
        {tabs.map(item => <button key={item} type="button" aria-pressed={tab === item} onClick={() => setTab(item)} className={`${button} ${tab === item ? 'bg-muted font-bold' : ''}`}>{item}</button>)}
      </nav>

      {tab === 'Overview' && <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[{ name: 'Catalogue entries', value: SITE_PROJECTS.length, note: 'Recorded locally, not account inventory', icon: Layers }, { name: 'Agent definitions', value: OPERATIONS_AGENTS.length, note: 'Roles defined in flow YAML', icon: Bot }, { name: 'Flow definitions', value: OPERATIONS_FLOWS.length, note: 'Activation not verified', icon: Workflow }, { name: 'Runtime connections', value: 'Not connected', note: 'No agent session feed configured', icon: Radio }].map(card => <article key={card.name} className={`${panel} p-5`}><card.icon className="mb-4 h-5 w-5 text-muted-foreground" aria-hidden="true" /><h2 className="text-sm text-muted-foreground">{card.name}</h2><p className="mt-2 font-display text-2xl font-bold">{card.value}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{card.note}</p></article>)}
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <section className={`${panel} p-6`} aria-labelledby="receipt-title"><div className="flex items-center gap-3"><GitBranch className="h-5 w-5" aria-hidden="true" /><h2 id="receipt-title" className="font-display text-xl font-bold">Latest published build receipt</h2></div><p className="mt-4 text-sm font-semibold">{feed}</p><dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2"><div><dt className="text-muted-foreground">Build time</dt><dd className="mt-1">{shownAt}</dd></div><div><dt className="text-muted-foreground">Source</dt><dd className="mt-1">{receipt?.source || 'Unknown'}</dd></div><div><dt className="text-muted-foreground">Commit</dt><dd className="mt-1 font-mono">{receipt?.sha.slice(0, 12) || 'Unknown'}</dd></div><div><dt className="text-muted-foreground">Last feed check</dt><dd className="mt-1">{checkedAt ? new Date(checkedAt).toLocaleTimeString() : 'Not checked'}</dd></div></dl><p className="mt-5 text-sm leading-6 text-muted-foreground">This receipt is written after the build command finishes. It does not certify pipeline success, application uptime, backups or a successful production deployment. Refreshes every minute while visible.</p>{receipt?.pipelineUrl && <a href={receipt.pipelineUrl} target="_blank" rel="noopener noreferrer" className={`${button} mt-4`}>Inspect build run<ArrowUpRight className="h-4 w-4" /></a>}</section>
          <section className={`${panel} p-6`}><h2 className="font-display text-xl font-bold">Connection checklist</h2><ul className="mt-5 space-y-4 text-sm">{['GitLab agent sessions', 'GitHub workflow activity', 'Cross-repository inventory', 'Backup and runner health'].map(label => <li key={label} className="flex justify-between gap-4 border-b border-border-color pb-3"><span>{label}</span><span className="text-muted-foreground">Not connected</span></li>)}</ul><a href={OPERATIONS_PROJECT} target="_blank" rel="noopener noreferrer" className={`${button} mt-5`}>Open GitLab project<ArrowUpRight className="h-4 w-4" /></a></section>
        </div>
      </div>}

      {tab === 'Agents' && <section className="space-y-5" aria-label="Agent squad">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{OPERATIONS_AGENTS.map(item => <button key={item.id} type="button" aria-pressed={agentId === item.id} onClick={() => setAgentId(item.id)} className={`${panel} p-4 text-left transition-transform hover:-translate-y-1 motion-reduce:transform-none ${agentId === item.id ? 'ring-2 ring-foreground' : ''}`}><Portrait color={item.color} number={item.badge} /><h2 className="mt-2 font-display text-lg font-bold">{item.name}</h2><p className="mt-1 text-xs text-muted-foreground">{item.role}</p></button>)}</div>
        <article className={`${panel} p-6`}><p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Agent dossier / {agent.badge}</p><h2 className="mt-3 font-display text-2xl font-bold">{agent.name}</h2><p className