import { useState, useEffect, useRef } from 'react';
import { ProjectCard } from '../types/project';
import { X, Maximize2, Minimize2 } from 'lucide-react';

interface CyberTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: ProjectCard[];
  onOpenCardManager: () => void;
  cycleTheme: () => void;
  playKeyTick: () => void;
}

interface TermLine {
  id: string;
  type: 'welcome' | 'cmd' | 'output' | 'error' | 'success' | 'info';
  text: string;
  isHtml?: boolean;
}

export default function CyberTerminal({
  isOpen,
  onClose,
  cards,
  onOpenCardManager,
  cycleTheme,
  playKeyTick,
}: CyberTerminalProps) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [isMaximized, setIsMaximized] = useState(false);
  const [lines, setLines] = useState<TermLine[]>([
    {
      id: '1',
      type: 'welcome',
      text: '=== LINACRE CYBER MISSION CONTROL // WEB TERMINAL v4.0 ===',
    },
    {
      id: '2',
      type: 'info',
      text: 'Connected to linacre.site platform. Type "help" for available commands.',
    },
  ]);

  const outputRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  if (!isOpen) return null;

  const addLine = (text: string, type: TermLine['type'] = 'output', isHtml = false) => {
    setLines(prev => [...prev, { id: Math.random().toString(), text, type, isHtml }]);
  };

  const handleCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    setHistory(prev => [...prev, trimmed]);
    setHistoryIdx(-1);
    setInputVal('');

    addLine(`david@linacre.site:~$ ${trimmed}`, 'cmd');

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case 'help':
        addLine('AVAILABLE TERMINAL COMMANDS:');
        addLine('  projects   — List all active software engineering projects');
        addLine('  search <q> — Filter projects matching keyword');
        addLine('  add        — Open the Project Card Manager modal');
        addLine('  specs      — Workstation & hardware engineering specifications');
        addLine('  skills     — Core engineering proficiencies & technology stacks');
        addLine('  contact    — Communication links & GitHub profile');
        addLine('  theme      — Cycle neon color accents (Cyan, Purple, Sakura, Emerald)');
        addLine('  clear      — Clear terminal viewport');
        addLine('  exit       — Close terminal console');
        break;

      case 'search':
      case 'find':
        if (!args.length) {
          addLine('Usage: search <keyword> (e.g. search llm, search python)', 'error');
        } else {
          const q = args.join(' ').toLowerCase();
          const matches = cards.filter(
            c =>
              c.title.toLowerCase().includes(q) ||
              c.category.toLowerCase().includes(q) ||
              c.description.toLowerCase().includes(q) ||
              c.tags?.some(t => t.toLowerCase().includes(q))
          );
          addLine(`Found ${matches.length} matching project(s) for "${q}":`, 'success');
          matches.forEach(m => addLine(`• [${m.category}] ${m.title} — ${m.description}`, 'info'));
        }
        break;

      case 'projects':
        addLine(`=== REGISTERED PROJECTS (${cards.length}) ===`);
        cards.forEach((c, idx) => {
          addLine(`${idx + 1}. [${c.category}] ${c.title} — ${c.subtitle || c.description}`, 'info');
        });
        addLine('Type "add" to add or edit cards.');
        break;

      case 'add':
      case 'manage':
      case 'edit':
        addLine('Opening Project Card Manager...', 'success');
        onOpenCardManager();
        break;

      case 'specs':
        addLine('=== WORKSTATION & INFRASTRUCTURE SPECS ===', 'info');
        addLine('  CPU:     Intel Core i7-11700K (16 Threads @ 4.82 GHz boost)');
        addLine('  GPU:     NVIDIA GeForce RTX 3070 Ti (8GB GDDR6X, CUDA, TensorRT)');
        addLine('  RAM:     64 GB DDR4-3200 Dual-Channel');
        addLine('  Storage: 1.4 TB High-Speed NVMe + Encrypted Vault');
        addLine('  Mobile:  Poco F7 (Root / Magisk / ADB Telemetry)');
        addLine('  OS:      Windows 11 Pro + WSL2 Ubuntu + Docker Engine');
        break;

      case 'skills':
        addLine('=== TECHNICAL PROFICIENCIES ===', 'info');
        addLine('  Languages:   TypeScript, JavaScript, Python, PowerShell, Bash, Rust');
        addLine('  Frontend:    React 19, Vite, Three.js, Vanilla CSS, Web Audio, PWA');
        addLine('  Backend:     FastAPI, Node.js, Express, Docker, Redis');
        addLine('  AI & LLM:    Ollama, Gemini API, PyTorch, ComfyUI, Prompt Engineering');
        addLine('  DevOps:      GitHub Actions, Vercel, Netlify, Tailscale, Cloudflare');
        break;

      case 'contact':
        addLine('=== CONTACT & LINKS ===', 'info');
        addLine('  GitHub:   https://github.com/DLinacre');
        addLine('  Website:  https://www.linacre.site');
        addLine('  Location: Barnsley, South Yorkshire, UK');
        break;

      case 'theme':
        cycleTheme();
        addLine('Cycled neon theme accent.', 'success');
        break;

      case 'clear':
      case 'cls':
        setLines([]);
        break;

      case 'exit':
      case 'quit':
        onClose();
        break;

      default:
        addLine(`Command not found: "${cmd}". Type "help" for a list of commands.`, 'error');
        break;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIdx < history.length - 1) {
        const next = historyIdx + 1;
        setHistoryIdx(next);
        setInputVal(history[history.length - 1 - next]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const next = historyIdx - 1;
        setHistoryIdx(next);
        setInputVal(history[history.length - 1 - next]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal('');
      }
    }
  };

  return (
    <div
      className={`fixed z-50 transition-all duration-200 ${
        isMaximized
          ? 'inset-4 sm:inset-10'
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[620px] h-[480px]'
      }`}
    >
      <div className="flex h-full w-full flex-col rounded-2xl border border-white/15 bg-[#090d1a]/95 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl overflow-hidden">
        
        {/* Titlebar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />
            <span className="h-3 w-3 rounded-full bg-amber-500 shadow-[0_0_6px_#f59e0b]" />
            <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
            <span className="ml-2 font-mono text-xs font-bold text-slate-300">
              PC ACTIVITY MONITOR // TERMINAL
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMaximized(prev => !prev)}
              className="rounded p-1 text-slate-400 hover:text-white transition-colors"
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="rounded p-1 text-slate-400 hover:text-white transition-colors"
              title="Close terminal"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Command Chips */}
        <div className="flex items-center gap-1.5 border-b border-white/5 bg-black/20 px-3 py-2 overflow-x-auto text-[0.70rem]">
          {['help', 'projects', 'add', 'specs', 'skills', 'theme', 'clear'].map(c => (
            <button
              key={c}
              onClick={() => handleCommand(c)}
              className="rounded border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 font-mono text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/20 transition-all whitespace-nowrap"
            >
              {c}
            </button>
          ))}
        </div>

        {/* Output Viewport */}
        <div
          ref={outputRef}
          className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed space-y-1.5"
        >
          {lines.map(line => (
            <div
              key={line.id}
              className={`break-words ${
                line.type === 'welcome'
                  ? 'font-bold text-purple-300'
                  : line.type === 'cmd'
                  ? 'font-bold text-white'
                  : line.type === 'info'
                  ? 'text-cyan-300'
                  : line.type === 'success'
                  ? 'text-emerald-400'
                  : line.type === 'error'
                  ? 'text-red-400'
                  : 'text-slate-300'
              }`}
            >
              {line.text}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 border-t border-white/10 bg-black/50 px-4 py-2.5">
          <span className="font-mono text-sm font-bold text-purple-400">λ</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={e => {
              setInputVal(e.target.value);
              playKeyTick();
            }}
            onKeyDown={onKeyDown}
            placeholder="type a command (e.g. 'projects', 'add', 'help')..."
            className="flex-1 bg-transparent font-mono text-xs text-white placeholder-slate-600 focus:outline-none"
          />
          <button
            onClick={() => handleCommand(inputVal)}
            className="rounded bg-purple-500 px-3 py-1 font-mono text-[0.70rem] font-bold text-black hover:bg-purple-400 transition-colors"
          >
            RUN
          </button>
        </div>

      </div>
    </div>
  );
}
