import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Plus, Bot, Coffee, Database, LayoutGrid, Award, Server, Pause, Play, Trash2, AlertTriangle, Info, Cpu, Activity, Zap, Layers, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: 'Dev' | 'DevOps' | 'Security' | 'Librarian';
  spriteName: string; // Pokémon Showdown gif name
  personality: 'focused' | 'caffeinated' | 'chaotic' | 'pragmatic';
  color: string;
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  status: string;
  task: string;
  taskQueue: string[]; // Sequential task queuing
  isPaused: boolean;
  roboticTraits: string;
  cpu: number;
  ram: number;
}

interface LogMessage {
  id: string;
  timestamp: string;
  agentName: string;
  message: string;
  type: 'info' | 'success' | 'warning';
}

interface WalkingParticle {
  id: string;
  x: number;
  y: number;
}

interface AgentSuggestion {
  name: string;
  role: 'Dev' | 'DevOps' | 'Security' | 'Librarian';
  spriteName: string;
  personality: 'focused' | 'caffeinated' | 'chaotic' | 'pragmatic';
  concept: string;
  detailedPrompt: string;
  steps: string[];
}


// Pokémon Showdown Sprite Database URL
const SPRITE_BASE_URL = 'https://play.pokemonshowdown.com/sprites/ani/';

const AVAILABLE_POKEMON = [
  { name: 'Rotom-Wash', file: 'rotom-wash', description: 'Plasma mechanical appliance robot. Fits DevOps/Networking.' },
  { name: 'Magnezone', file: 'magnezone', description: 'Triple magnetic eye robot drone. Ideal for Security scans.' },
  { name: 'Porygon2', file: 'porygon2', description: 'Fully virtual digital construct robot. Best for Code Development.' },
  { name: 'Slowking', file: 'slowking', description: 'Shellder-crowned royal writer. Great for library documentation.' },
  { name: 'Metagross', file: 'metagross', description: 'Four-legged steel supercomputer mech. Heavy data compute.' },
  { name: 'Aegislash', file: 'aegislash-blade', description: 'Steel floating shield and sword construct. Perimeter defenses.' },
  { name: 'Genesect', file: 'genesect', description: 'Ancient insectoid cyborg with back-mounted cannon. Speed builds.' },
  { name: 'Pikachu', file: 'pikachu', description: 'Electric rodent dynamo. Ideal for powering grids.' },
  { name: 'Mewtwo', file: 'mewtwo', description: 'Genetically modified ultimate cybernetic psychic.' },
  { name: 'Scizor', file: 'scizor', description: 'Metallic scissor-claw developer. Fast compiler.' }
];

const WORKSTATIONS = [
  { name: 'Mainframe Node', x: 1, y: 1, icon: Server, color: 'text-amber-color border-amber-color/30 bg-[#061923]/80 shadow-[0_0_10px_rgba(34,211,238,0.15)]', rgb: '34, 211, 238' },
  { name: 'Git Repository', x: 1, y: 8, icon: LayoutGrid, color: 'text-cyan border-cyan/30 bg-[#0d161a]/80 shadow-[0_0_10px_rgba(92,207,230,0.15)]', rgb: '92, 207, 230' },
  { name: 'Database Cluster', x: 8, y: 1, icon: Database, color: 'text-purple-color border-purple-color/30 bg-[#140f1a]/80 shadow-[0_0_10px_rgba(168,85,247,0.15)]', rgb: '168, 85, 247' },
  { name: 'Edge Server', x: 8, y: 8, icon: Award, color: 'text-emerald-color border-emerald-color/30 bg-[#0d1a12]/80 shadow-[0_0_10px_rgba(127,216,143,0.15)]', rgb: '127, 216, 143' },
  { name: 'Game Corner Cafe', x: 5, y: 5, icon: Coffee, color: 'text-rose-400 border-rose-400/30 bg-[#1a0f12]/80 shadow-[0_0_10px_rgba(248,113,113,0.15)]', rgb: '248, 113, 113' }
];

const isPathTile = (x: number, y: number): boolean => {
  if (x === 1 && y >= 1 && y <= 8) return true;
  if (x === 8 && y >= 1 && y <= 8) return true;
  if (y === 5 && x >= 1 && x <= 8) return true;
  return false;
};

// Web Audio API Retro Sound Synthesizer
const playSynthSound = (type: 'click' | 'success' | 'error', isMuted: boolean) => {
  if (isMuted) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'success') {
      // RPG Chiptune Level-Up fanfare arpeggio
      osc.type = 'triangle';
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.4);

      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5 -> E5 -> G5 -> C6
      osc.start(now);
      freqs.forEach((freq, idx) => {
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      });
      osc.stop(now + 0.4);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.005, ctx.currentTime + 0.22);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    }
  } catch (e) {
    // Audio Context blocked by browser autoplay settings
  }
};

const DevOpsRobotSVG = ({ color }: { color: string }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <line x1="50" y1="20" x2="50" y2="5" stroke={color} strokeWidth="3" />
    <circle cx="50" cy="5" r="4" fill={color} />
    <path d="M 15 50 Q 5 40 10 30" fill="none" stroke={color} strokeWidth="4.5" />
    <path d="M 85 50 Q 95 40 90 30" fill="none" stroke={color} strokeWidth="4.5" />
    <rect x="25" y="35" width="50" height="45" rx="10" fill="#0d1117" stroke={color} strokeWidth="4" />
    <rect x="33" y="43" width="34" height="22" rx="4" fill="#1f2937" stroke={color} strokeWidth="2" />
    <circle cx="43" cy="54" r="3" fill={color} />
    <circle cx="57" cy="54" r="3" fill={color} />
    <rect x="20" y="80" width="60" height="12" rx="6" fill="#111827" stroke={color} strokeWidth="3.5" />
  </svg>
);

const SecurityRobotSVG = ({ color }: { color: string }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <line x1="35" y1="20" x2="25" y2="8" stroke={color} strokeWidth="3" />
    <line x1="65" y1="20" x2="75" y2="8" stroke={color} strokeWidth="3" />
    <circle cx="25" cy="8" r="3.5" fill={color} />
    <circle cx="75" cy="8" r="3.5" fill={color} />
    <path d="M 12 45 L 8 65 L 20 75 L 24 55 Z" fill="#1f2937" stroke={color} strokeWidth="3" />
    <circle cx="50" cy="48" r="28" fill="#0d1117" stroke={color} strokeWidth="4.5" />
    <rect x="35" y="40" width="30" height="8" rx="2" fill="#ef4444" className="animate-pulse" />
    <path d="M 38 74 L 32 92 L 24 92" fill="none" stroke={color} strokeWidth="4" />
    <path d="M 62 74 L 68 92 L 76 92" fill="none" stroke={color} strokeWidth="4" />
  </svg>
);

const DeveloperRobotSVG = ({ color }: { color: string }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect x="38" y="10" width="24" height="20" rx="6" fill="#0d1117" stroke={color} strokeWidth="3.5" />
    <circle cx="50" cy="20" r="4" fill="#3b82f6" className="animate-ping" />
    <line x1="50" y1="30" x2="50" y2="38" stroke={color} strokeWidth="4" />
    <rect x="22" y="38" width="56" height="42" rx="4" fill="#0d1117" stroke={color} strokeWidth="4" />
    <circle cx="34" cy="50" r="2.5" fill="#10b981" />
    <circle cx="34" cy="60" r="2.5" fill="#22D3EE" />
    <circle cx="34" cy="70" r="2.5" fill="#ef4444" />
    <path d="M 22 45 L 8 45 L 8 65" fill="none" stroke={color} strokeWidth="3.5" />
    <path d="M 78 45 L 92 45 L 92 65" fill="none" stroke={color} strokeWidth="3.5" />
    <circle cx="35" cy="88" r="8" fill="#111827" stroke={color} strokeWidth="3" />
    <circle cx="65" cy="88" r="8" fill="#111827" stroke={color} strokeWidth="3" />
  </svg>
);

const WriterRobotSVG = ({ color }: { color: string }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <ellipse cx="50" cy="85" rx="25" ry="8" fill="none" stroke={color} strokeWidth="3" strokeDasharray="6 4" />
    <path d="M 50 72 L 46 82 L 54 82 Z" fill="#38bdf8" opacity="0.8" className="animate-pulse" />
    <rect x="30" y="25" width="40" height="45" rx="12" fill="#0d1117" stroke={color} strokeWidth="4" />
    <path d="M 36 38 Q 50 32 64 38" fill="none" stroke={color} strokeWidth="3.5" />
    <path d="M 30 55 C 15 55 18 40 10 42" fill="none" stroke={color} strokeWidth="3.5" />
    <path d="M 70 55 C 85 55 82 40 90 42" fill="none" stroke={color} strokeWidth="3.5" />
  </svg>
);



const STORAGE_KEY_AGENTS = 'linacre_agents_state_v2';
const STORAGE_KEY_LOGS = 'linacre_agents_logs_v2';

const INITIAL_DEFAULT_AGENTS: Agent[] = [
  {
    id: 'agent-architect',
    name: 'Agent Architect',
    role: 'Dev',
    spriteName: 'mewtwo',
    personality: 'focused',
    color: '#c084fc',
    x: 5,
    y: 5,
    startX: 5,
    startY: 5,
    targetX: 5,
    targetY: 5,
    status: 'Generating ideas...',
    task: 'Idle',
    taskQueue: [],
    isPaused: false,
    roboticTraits: 'Equipped with cognitive neural synapses, deep model synthesis logic, and auto-spawner subassemblies.',
    cpu: 12,
    ram: 256
  },
  {
    id: 'agent-devops',
    name: 'DevOps Rotom',
    role: 'DevOps',
    spriteName: 'rotom-wash',
    personality: 'focused',
    color: '#5ccfe6',
    x: 1,
    y: 8,
    startX: 1,
    startY: 8,
    targetX: 1,
    targetY: 8,
    status: 'Awaiting tasks',
    task: 'Idle',
    taskQueue: [],
    isPaused: false,
    roboticTraits: 'Forged from plasma coils, hydraulic washers, and dual high-frequency wifi antennas. Specialized in container pipelines.',
    cpu: 18,
    ram: 242
  },
  {
    id: 'agent-security',
    name: 'SecMagnezone',
    role: 'Security',
    spriteName: 'magnezone',
    personality: 'pragmatic',
    color: '#34D399',
    x: 1,
    y: 1,
    startX: 1,
    startY: 1,
    targetX: 1,
    targetY: 1,
    status: 'Monitoring registry integrity',
    task: 'Ecosystem guard duty',
    taskQueue: [],
    isPaused: false,
    roboticTraits: 'Equipped with heavy magnetic shielding plating, triple-lens focal visors, and high-entropy security scanners.',
    cpu: 32,
    ram: 512
  }
];

import McpToolboxCallout from './McpToolboxCallout';

export default function AgentsHub() {
  const [agents, setAgents] = useState<Agent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AGENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_DEFAULT_AGENTS;
  });

  const [logs, setLogs] = useState<LogMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        id: 'log-initial-1',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        agentName: 'System',
        message: 'Welcome to the Autonomous Agent Grid! Dispatch a command to start.',
        type: 'info'
      }
    ];
  });

  // Automatically persist agents and logs to browser storage so navigating back never wipes state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AGENTS, JSON.stringify(agents));
    } catch (err) {
      console.warn('Failed to save agents to localStorage:', err);
    }
  }, [agents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs.slice(-50)));
    } catch (err) {
      console.warn('Failed to save logs to localStorage:', err);
    }
  }, [logs]);

  const handleResetAgents = () => {
    if (window.confirm('Reset Agent Grid back to default initial state?')) {
      localStorage.removeItem(STORAGE_KEY_AGENTS);
      localStorage.removeItem(STORAGE_KEY_LOGS);
      setAgents(INITIAL_DEFAULT_AGENTS);
      setLogs([
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          agentName: 'System',
          message: 'Agent grid restored to initial factory defaults.',
          type: 'info'
        }
      ]);
    }
  };

  const addLog = (agentName: string, message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs((prev) => [
      ...prev,
      { id: `log-${Date.now()}-${Math.random()}`, timestamp, agentName, message, type }
    ]);
    setCurrentDialogMessage(`${agentName}: ${message}`);
  };

  // Global Telemetry Metrics
  const [telemetry, setTelemetry] = useState({
    bandwidth: 12.4,
    load: 22,
    jobsCompleted: 0,
    powerDraw: 85
  });

  // Sound Engine mute/unmute state
  const [isMuted, setIsMuted] = useState(true);

  // Live Tracking state for Pixel Agents workspace integrations
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const lastStepIndexRef = useRef<number>(-1);

  // Spend/Rate limits budget slider control
  const [spendLimit, setSpendLimit] = useState(0.00);

  // Historical lists for live plotting
  const [bandwidthHistory, setBandwidthHistory] = useState<number[]>([12, 15, 10, 8, 14, 18, 11, 13, 16, 12]);
  const [loadHistory, setLoadHistory] = useState<number[]>([20, 25, 22, 18, 24, 28, 21, 23, 26, 22]);

  // Footprint / Dust particle tracking for 60fps movement trail
  const [particles, setParticles] = useState<WalkingParticle[]>([]);

  // Showdown GIF load failures tracking
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // prefers-reduced-motion hook (TASK-002)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Grid visual state
  const [gridProjection, setGridProjection] = useState<'isometric' | 'flat'>('isometric');
  const [selectedNode, setSelectedNode] = useState<typeof WORKSTATIONS[0] | null>(null);
  const [tacticalAgentId, setTacticalAgentId] = useState<string>('');
  const [tacticalAction, setTacticalAction] = useState<string>('Audit PATH registry keys');

  // Sync tacticalAgentId initially
  useEffect(() => {
    if (agents.length > 0 && !tacticalAgentId) {
      setTacticalAgentId(agents[0].id);
    }
  }, [agents, tacticalAgentId]);

  // Dialog Typing effect state
  const [typedDialogText, setTypedDialogText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const [currentDialogMessage, setCurrentDialogMessage] = useState('System: Welcome to the Autonomous Agent Grid! Dispatch a command to start.');

  // Pre-coded agent suggestions database
  const ARCHITECT_SUGGESTIONS: AgentSuggestion[] = [
    {
      name: 'Repository Janitor',
      role: 'DevOps',
      spriteName: 'rotom-wash',
      personality: 'pragmatic',
      concept: 'Git Branch & Dependency Cleaner',
      detailedPrompt: 'Automatically prunes dead remote tracking branches, deletes merged local branches, and deduplicates NPM modules to keep the workspace lightweight.',
      steps: [
        '1. Checks Git branch status.',
        '2. Prunes dead refs and merged branches.',
        '3. Runs npm dedupe to optimize node_modules.'
      ]
    },
    {
      name: 'Security Guard',
      role: 'Security',
      spriteName: 'magnezone',
      personality: 'focused',
      concept: 'Environment Scanner & NPM Audit',
      detailedPrompt: 'Scans your local .gitignore to ensure .env is safely ignored, auto-patches if missing, and runs a high-severity NPM audit to detect vulnerabilities.',
      steps: [
        '1. Audits .gitignore configuration.',
        '2. Auto-patches missing .env rules.',
        '3. Runs strict NPM vulnerability scans.'
      ]
    },
    {
      name: 'SEO Optimizer',
      role: 'Librarian',
      spriteName: 'slowking',
      personality: 'caffeinated',
      concept: 'SEO Meta, Robots & Sitemap Enforcer',
      detailedPrompt: 'Scans the public directory to ensure robots.txt allows crawling, and validates the presence of a baseline sitemap.xml.',
      steps: [
        '1. Generates missing robots.txt rules.',
        '2. Builds daily sitemap.xml stubs.',
        '3. Validates public indexing.'
      ]
    },
    {
      name: 'Code Documenter',
      role: 'Dev',
      spriteName: 'porygon2',
      personality: 'focused',
      concept: 'Automated Documentation Tracker',
      detailedPrompt: 'Analyzes recently modified TypeScript files and ensures README/JSDoc architectures remain up to date.',
      steps: [
        '1. Tracks git ls-tree modifications.',
        '2. Validates README.md presence.',
        '3. Audits inline JSDoc coverage.'
      ]
    },
    {
      name: 'Release Manager',
      role: 'Dev',
      spriteName: 'scizor',
      personality: 'pragmatic',
      concept: 'Version Bumping & Git Tagging',
      detailedPrompt: 'Safely checks the working directory status and validates version tracking against current Git tags before deployments.',
      steps: [
        '1. Assesses git working directory state.',
        '2. Validates semantic versioning tags.',
        '3. Prepares the build environment.'
      ]
    }
  ];

  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const activeSuggestion = ARCHITECT_SUGGESTIONS[currentSuggestionIndex];

  const [predefinedActions, setPredefinedActions] = useState<string[]>([
    'Audit PATH registry keys',
    'Optimize CSS styles',
    'Version local git files',
    'Prune redundant downloads',
    'Scan credentials environment',
    'Check docker container states'
  ]);

  const [newActionText, setNewActionText] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0]?.id || '');
  const [selectedAction, setSelectedAction] = useState(predefinedActions[0]);
  const [customActionText, setCustomActionText] = useState('');
  const [inspectingAgent, setInspectingAgent] = useState<Agent | null>(null);

  // Factory Form states
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentRole, setNewAgentRole] = useState<'Dev' | 'DevOps' | 'Security' | 'Librarian'>('Dev');
  const [newAgentPersonality, setNewAgentPersonality] = useState<'focused' | 'caffeinated' | 'chaotic' | 'pragmatic'>('focused');
  const [newAgentSprite, setNewAgentSprite] = useState('porygon2');

  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Dialog typewriter effect loop
  useEffect(() => {
    setTypedDialogText('');
    setTypingIndex(0);
  }, [currentDialogMessage]);

  useEffect(() => {
    if (typingIndex < currentDialogMessage.length) {
      const timeout = setTimeout(() => {
        setTypedDialogText((prev) => prev + currentDialogMessage[typingIndex]);
        setTypingIndex((prev) => prev + 1);
      }, 25);
      return () => clearTimeout(timeout);
    }
  }, [typingIndex, currentDialogMessage]);

  // Telemetry fluctuation loop to make passive watching enjoyable
  useEffect(() => {
    const interval = setInterval(() => {
      const activeMovingCount = agents.filter(a => !a.isPaused && (a.x !== a.targetX || a.y !== a.targetY)).length;

      setTelemetry((prev) => {
        const bandwidthChange = activeMovingCount > 0 ? (Math.random() * 15 + 15) : (Math.random() * 2 + 1);
        const loadChange = Math.min(95, Math.max(5, (activeMovingCount * 22) + Math.floor(Math.random() * 10)));
        const powerChange = Math.max(45, 60 + (activeMovingCount * 30) + Math.floor(Math.random() * 10));

        // Update charts history
        setBandwidthHistory((prevHist) => [...prevHist.slice(1), Number(bandwidthChange.toFixed(1))]);
        setLoadHistory((prevHist) => [...prevHist.slice(1), loadChange]);

        return {
          ...prev,
          bandwidth: Number(bandwidthChange.toFixed(1)),
          load: loadChange,
          powerDraw: powerChange
        };
      });

      // Fluctuating individual agent CPU & RAM
      setAgents((prevAgents) =>
        prevAgents.map((a) => {
          if (a.isPaused) return { ...a, cpu: 0 };
          const isWorking = a.x !== a.targetX || a.y !== a.targetY;
          const cpuLoad = isWorking ? Math.floor(Math.random() * 45 + 50) : Math.floor(Math.random() * 10 + 5);
          const ramFootprint = Math.min(1024, Math.max(128, a.ram + Math.floor(Math.random() * 20 - 10)));

          const updated = { ...a, cpu: cpuLoad, ram: ramFootprint };
          if (inspectingAgent?.id === a.id) {
            setInspectingAgent(updated);
          }
          return updated;
        })
      );

    }, 2000);

    return () => clearInterval(interval);
  }, [agents, inspectingAgent]);

  // Main Simulation Loop (moves agents every 1.5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prevAgents) =>
        prevAgents.map((agent) => {
          const { x, y, targetX, targetY, personality, name, isPaused, taskQueue } = agent;

          if (isPaused) return agent;

          // Arrived
          if (x === targetX && y === targetY) {
            if (personality === 'caffeinated' && Math.random() < 0.25 && (x !== 5 || y !== 5)) {
              addLog(name, 'Feeling low on charge. Relocating to Game Corner Cafe for quick power recharge.', 'info');
              return { ...agent, startX: x, startY: y, targetX: 5, targetY: 5, status: 'Charging at Cafe' };
            }

            if (personality === 'chaotic' && Math.random() < 0.2 && agent.task === 'Idle') {
              const nextStation = WORKSTATIONS[Math.floor(Math.random() * WORKSTATIONS.length)];
              addLog(name, `Matrix anomaly triggered. Routing chaotic sweep to: ${nextStation.name}`, 'warning');
              return { ...agent, startX: x, startY: y, targetX: nextStation.x, targetY: nextStation.y, status: `Sweeping ${nextStation.name}` };
            }

            if (agent.task !== 'Idle' && x !== 5 && y !== 5) {
              addLog(name, `Completed data cargo delivery: "${agent.task}". Status returns to ready.`, 'success');
              playSynthSound('success', isMuted);
              setTelemetry(prev => ({ ...prev, jobsCompleted: prev.jobsCompleted + 1 }));

              // Task Queue Handler
              if (taskQueue.length > 0) {
                const nextTask = taskQueue[0];
                const newQueue = taskQueue.slice(1);
                const nextStation = WORKSTATIONS[Math.floor(Math.random() * (WORKSTATIONS.length - 1))];
                addLog(name, `Dequeued next script: "${nextTask}". Routing to ${nextStation.name}...`, 'info');

                return {
                  ...agent,
                  task: nextTask,
                  taskQueue: newQueue,
                  startX: x,
                  startY: y,
                  targetX: nextStation.x,
                  targetY: nextStation.y,
                  status: `Processing queue: ${nextTask}`
                };
              }

              return { ...agent, task: 'Idle', status: 'Idling' };
            }

            return agent;
          }

          // Path routing calculations: Follows H-shaped dirt roads
          let nextX = x;
          let nextY = y;

          if (y !== 5 && x !== targetX) {
            if (y < 5) nextY = y + 1;
            else nextY = y - 1;
          } else if (y === 5 && x !== targetX) {
            if (x < targetX) nextX = x + 1;
            else nextX = x - 1;
          } else if (x === targetX && y !== targetY) {
            if (y < targetY) nextY = y + 1;
            else nextY = y - 1;
          }

          // Spawn footprint particle at current coordinate before moving
          const particleId = `part-${Date.now()}-${Math.random()}`;
          setParticles((prev) => [...prev, { id: particleId, x, y }]);
          setTimeout(() => {
            setParticles((prev) => prev.filter(p => p.id !== particleId));
          }, 1100);

          const targetStationObj = WORKSTATIONS.find(w => w.x === targetX && w.y === targetY);
          const stationLabel = targetStationObj ? targetStationObj.name : `Node (${targetX}, ${targetY})`;
          const progressPct = getPathProgress({ ...agent, x: nextX, y: nextY });

          return {
            ...agent,
            x: nextX,
            y: nextY,
            status: `En route to ${stationLabel} (${progressPct}%)`
          };
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, [isMuted]);

  // Clean up Live Agent when toggled off
  useEffect(() => {
    if (!isLiveTracking) {
      setAgents(prev => prev.filter(a => a.id !== 'antigravity-live'));
      lastStepIndexRef.current = -1;
    }
  }, [isLiveTracking]);

  // Poll active logs endpoint when Live Tracking is enabled
  useEffect(() => {
    if (!isLiveTracking) return;

    const pollLogs = async () => {
      try {
        const res = await fetch('/api/active-logs');
        if (!res.ok) return;
        const data = await res.json();

        if (data.logs && Array.isArray(data.logs) && data.logs.length > 0) {
          const latestStep = data.logs[data.logs.length - 1];
          const stepIndex = latestStep.step_index ?? -1;

          if (stepIndex > lastStepIndexRef.current) {
            lastStepIndexRef.current = stepIndex;

            let targetStation = WORKSTATIONS[4]; // Default: Game Corner Cafe (5, 5)
            let agentStatus = 'Connected to workspace';
            let agentTask = 'Idle';
            let cpuLoad = 5;

            if (latestStep.source === 'MODEL') {
              if (latestStep.tool_calls && latestStep.tool_calls.length > 0) {
                const toolCall = latestStep.tool_calls[0];
                const toolName = toolCall.name;
                agentTask = `Running tool: ${toolName}`;
                cpuLoad = 85;

                if (toolName === 'run_command') {
                  targetStation = WORKSTATIONS[0]; // Mainframe Node (1,1)
                  agentStatus = `Running command: ${toolCall.args?.CommandLine ?? ''}`;
                } else if (['replace_file_content', 'multi_replace_file_content', 'write_to_file', 'edit_file', 'multi_edit_file', 'create_file'].includes(toolName)) {
                  targetStation = WORKSTATIONS[1]; // Git Repository (1,8)
                  agentStatus = `Writing file: ${toolCall.args?.TargetFile ?? ''}`;
                } else if (['search_web', 'read_url_content'].includes(toolName)) {
                  targetStation = WORKSTATIONS[3]; // Edge Server (8,8)
                  agentStatus = `Searching: ${toolCall.args?.query ?? toolCall.args?.Url ?? ''}`;
                } else if (['view_file', 'list_dir', 'grep_search'].includes(toolName)) {
                  targetStation = WORKSTATIONS[2]; // Database Cluster (8,1)
                  agentStatus = `Inspecting: ${toolCall.args?.AbsolutePath ?? toolCall.args?.SearchPath ?? ''}`;
                } else {
                  targetStation = WORKSTATIONS[2]; // Database Cluster (8,1)
                  agentStatus = `Calling tool: ${toolName}`;
                }
              } else {
                targetStation = WORKSTATIONS[2]; // Database Cluster (8,1)
                agentStatus = 'Analyzing workspace context...';
                agentTask = 'Reasoning';
                cpuLoad = 45;
              }
            } else if (latestStep.source === 'USER_EXPLICIT' || latestStep.type === 'USER_INPUT') {
              targetStation = WORKSTATIONS[4]; // Game Corner Cafe (5,5)
              agentStatus = 'Waiting for user input...';
              agentTask = 'Enjoying coffee';
              cpuLoad = 8;
            } else {
              targetStation = WORKSTATIONS[4]; // Game Corner Cafe
              agentStatus = 'Idle';
              agentTask = 'Idling';
            }

            if (agentStatus.length > 80) {
              agentStatus = agentStatus.substring(0, 80) + '...';
            }

            setAgents((prevAgents) => {
              const hasAntigravity = prevAgents.some(a => a.id === 'antigravity-live');
              const actionMsg = latestStep.tool_calls && latestStep.tool_calls.length > 0
                ? `Tool Invoked: ${latestStep.tool_calls[0].name}`
                : latestStep.source === 'MODEL' ? 'Thinking' : 'Awaiting input';

              addLog('Antigravity', `${actionMsg} - "${agentStatus}"`, latestStep.source === 'MODEL' ? 'info' : 'success');

              if (!hasAntigravity) {
                const liveAgent: Agent = {
                  id: 'antigravity-live',
                  name: 'Antigravity (Live)',
                  role: 'Dev',
                  spriteName: 'porygon2',
                  personality: 'focused',
                  color: '#5ccfe6',
                  x: 5,
                  y: 5,
                  startX: 5,
                  startY: 5,
                  targetX: targetStation.x,
                  targetY: targetStation.y,
                  status: agentStatus,
                  task: agentTask,
                  taskQueue: [],
                  isPaused: false,
                  roboticTraits: 'Real-time developer agent mapped directly to the workspace transcript logs.',
                  cpu: cpuLoad,
                  ram: 512
                };
                return [...prevAgents, liveAgent];
              } else {
                return prevAgents.map(a => {
                  if (a.id === 'antigravity-live') {
                    return {
                      ...a,
                      startX: a.x,
                      startY: a.y,
                      targetX: targetStation.x,
                      targetY: targetStation.y,
                      status: agentStatus,
                      task: agentTask,
                      cpu: cpuLoad,
                      isPaused: false
                    };
                  }
                  return a;
                });
              }
            });
          }
        }
      } catch (err) {
        console.error('Failed to poll active logs', err);
      }
    };

    pollLogs();
    const interval = setInterval(pollLogs, 2500);
    return () => clearInterval(interval);
  }, [isLiveTracking]);

  useEffect(() => {
    if (agents.length > 0 && !agents.some(a => a.id === selectedAgentId)) {
      setSelectedAgentId(agents[0].id);
    }
  }, [agents]);

  // Periodically cycle Architect recommendations (every 16 seconds if no manual click)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuggestionIndex((prev) => (prev + 1) % ARCHITECT_SUGGESTIONS.length);
    }, 16000);
    return () => clearInterval(interval);
  }, []);

  const handleAssignAction = async (e: FormEvent) => {
    e.preventDefault();
    const finalActionText = customActionText.trim() || selectedAction;
    if (!finalActionText) return;

    const targetAgent = agents.find(a => a.id === selectedAgentId);
    if (!targetAgent) return;

    if (targetAgent.isPaused) {
      addLog('System', `Cannot dispatch task. ${targetAgent.name} is currently suspended.`, 'warning');
      playSynthSound('error', isMuted);
      return;
    }

    playSynthSound('click', isMuted);
    const targetStation = WORKSTATIONS[Math.floor(Math.random() * (WORKSTATIONS.length - 1))];

    if (targetAgent.task !== 'Idle') {
      if (targetAgent.taskQueue.length >= 3) {
        addLog('System', `Request rejected: ${targetAgent.name}'s task pipeline queue is full (max 3 queued jobs).`, 'warning');
        playSynthSound('error', isMuted);
        return;
      }
      setAgents((prev) =>
        prev.map((agent) => {
          if (agent.id === selectedAgentId) {
            const newQueue = [...agent.taskQueue, finalActionText];
            addLog(agent.name, `Task Queued: "${finalActionText}" (Position: ${newQueue.length})`, 'info');
            const updated = { ...agent, taskQueue: newQueue };
            if (inspectingAgent?.id === agent.id) {
              setInspectingAgent(updated);
            }
            return updated;
          }
          return agent;
        })
      );
      setCustomActionText('');
      return;
    }

    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === selectedAgentId) {
          addLog(agent.name, `Cargo Assigned: "${finalActionText}". Transporting packet to ${targetStation.name}...`, 'info');

          const updated = {
            ...agent,
            task: finalActionText,
            startX: agent.x,
            startY: agent.y,
            targetX: targetStation.x,
            targetY: targetStation.y,
            status: `Active load: ${finalActionText}`
          };

          if (inspectingAgent?.id === agent.id) {
            setInspectingAgent(updated);
          }
          return updated;
        }
        return agent;
      })
    );

    setCustomActionText('');

    try {
      const response = await fetch('/api/agents/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentName: targetAgent.name, task: finalActionText })
      });
      const data = await response.json();
      if (data.reply) {
        addLog(targetAgent.name, data.reply, 'success');
      } else {
        throw new Error("Invalid reply");
      }
    } catch (err) {
      setTimeout(() => {
        addLog(targetAgent.name, `[Local Simulation Fallback] Executed script task: "${finalActionText}". Completed successfully inside local workspace sandbox.`, 'success');
      }, 3000);
    }
  };

  const handleTacticalDispatch = async (agentId: string, action: string) => {
    const targetAgent = agents.find(a => a.id === agentId);
    if (!targetAgent || !selectedNode) return;

    if (targetAgent.isPaused) {
      addLog('System', `Cannot dispatch task. ${targetAgent.name} is currently suspended.`, 'warning');
      playSynthSound('error', isMuted);
      return;
    }

    playSynthSound('click', isMuted);

    // Set destination to selectedNode coordinate
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === agentId) {
          addLog(agent.name, `Coordinated Tactical Dispatch: "${action}". Routing along matrix crossbars to ${selectedNode.name} (${selectedNode.x}, ${selectedNode.y})...`, 'info');
          return {
            ...agent,
            task: action,
            startX: agent.x,
            startY: agent.y,
            targetX: selectedNode.x,
            targetY: selectedNode.y,
            status: `Moving to scan node: ${action}`
          };
        }
        return agent;
      })
    );

    // Call backend
    try {
      const response = await fetch('/api/agents/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentName: targetAgent.name, task: action })
      });
      const data = await response.json();
      if (data.reply) {
        setTimeout(() => {
          addLog(targetAgent.name, `Completed node scan: Arrived at ${selectedNode.name}. Data report: ${data.reply}`, 'success');
          playSynthSound('success', isMuted);
        }, 6000);
      } else {
        throw new Error("Invalid reply");
      }
    } catch (err) {
      setTimeout(() => {
        addLog(targetAgent.name, `[Tactical Arrival] Successfully docked at ${selectedNode.name}. Code audit completed successfully within local sandbox frame.`, 'success');
        playSynthSound('success', isMuted);
      }, 6000);
    }
  };

  const handleAddNewAction = (e: FormEvent) => {
    e.preventDefault();
    if (!newActionText.trim()) return;
    if (predefinedActions.includes(newActionText.trim())) {
      alert('Action already exists.');
      return;
    }
    playSynthSound('click', isMuted);
    setPredefinedActions((prev) => [...prev, newActionText.trim()]);
    setSelectedAction(newActionText.trim());
    addLog('System', `New pre-defined action loaded: "${newActionText.trim()}"`, 'success');
    setNewActionText('');
  };

  const handleCreateAgent = (e: FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim()) return;

    playSynthSound('click', isMuted);
    const colors = {
      Dev: '#5ccfe6',
      DevOps: '#7fd88f',
      Security: '#34D399',
      Librarian: '#f87171'
    };

    const targetSprite = AVAILABLE_POKEMON.find(p => p.file === newAgentSprite);
    const details = targetSprite ? targetSprite.description : 'Equipped with cybernetic interfaces and local micro-computational chips.';

    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: newAgentName.trim(),
      role: newAgentRole,
      spriteName: newAgentSprite,
      personality: newAgentPersonality,
      color: colors[newAgentRole],
      x: 5,
      y: 5,
      startX: 5,
      startY: 5,
      targetX: 5,
      targetY: 5,
      status: 'Initial boot success',
      task: 'Idle',
      taskQueue: [],
      isPaused: false,
      roboticTraits: details,
      cpu: 10,
      ram: 256
    };

    setAgents((prev) => [...prev, newAgent]);
    addLog('System', `Spawned autonomous agent: ${newAgent.name} [Model: ${newAgent.spriteName}]`, 'success');
    setNewAgentName('');
  };

  // Build recommendation spawner automatically
  const handleBuildArchitectSuggestion = async () => {
    if (!activeSuggestion) return;

    // Map UI suggestion name to backend API script name
    const agentMapping: Record<string, string> = {
      'Repository Janitor': 'janitor',
      'Security Guard': 'security',
      'SEO Optimizer': 'seo',
      'Code Documenter': 'doc',
      'Release Manager': 'release'
    };

    const targetAgentId = agentMapping[activeSuggestion.name];

    playSynthSound('success', isMuted);
    const colors = {
      Dev: '#5ccfe6',
      DevOps: '#7fd88f',
      Security: '#34D399',
      Librarian: '#f87171'
    };

    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: activeSuggestion.name,
      role: activeSuggestion.role,
      spriteName: activeSuggestion.spriteName,
      personality: activeSuggestion.personality,
      color: colors[activeSuggestion.role],
      x: 5,
      y: 5,
      startX: 5,
      startY: 5,
      targetX: 5,
      targetY: 5,
      status: 'Spawning active script...',
      task: 'Executing',
      taskQueue: [],
      isPaused: false,
      roboticTraits: activeSuggestion.detailedPrompt,
      cpu: 45,
      ram: 512
    };

    setAgents((prev) => [...prev, newAgent]);
    addLog('Agent Architect', `Dispatching real execution for: ${newAgent.name}...`, 'info');

    if (targetAgentId) {
      try {
        const res = await fetch(`/api/agents/spawn/${targetAgentId}`, { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          addLog('Agent Architect', data.message || `Successfully launched ${newAgent.name}!`, 'success');
        } else {
          addLog('Agent Architect', `Failed to launch ${newAgent.name}: ${data.error}`, 'warning');
        }
      } catch (err) {
        addLog('Agent Architect', `API Error launching ${newAgent.name}.`, 'warning');
      }
    }

    // Auto-advance suggestion index
    setCurrentSuggestionIndex((prev) => (prev + 1) % ARCHITECT_SUGGESTIONS.length);
  };

  const handleDecommissionAgent = (id: string) => {
    const targetAgent = agents.find(a => a.id === id);
    if (!targetAgent) return;

    if (confirm(`Are you sure you want to decommission and remove ${targetAgent.name}?`)) {
      playSynthSound('click', isMuted);
      setAgents((prev) => prev.filter((a) => a.id !== id));
      addLog('System', `Agent ${targetAgent.name} successfully removed.`, 'warning');
      if (inspectingAgent?.id === id) {
        setInspectingAgent(null);
      }
    }
  };

  const handleTogglePauseAgent = (id: string) => {
    playSynthSound('click', isMuted);
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === id) {
          const updatedState = !agent.isPaused;
          addLog(agent.name, updatedState ? 'Agent suspended.' : 'Agent resumed.', 'info');
          const updated = {
            ...agent,
            isPaused: updatedState,
            status: updatedState ? '[SUSPENDED]' : 'Ready'
          };
          if (inspectingAgent?.id === id) {
            setInspectingAgent(updated);
          }
          return updated;
        }
        return agent;
      })
    );
  };

  // Helper to generate coordinates path for line chart
  const generatePathData = (history: number[], maxVal: number) => {
    const width = 120;
    const height = 24;
    const step = width / (history.length - 1);
    return history.map((val, i) => {
      const x = i * step;
      const y = height - (val / maxVal) * height;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
  };

  const getPathProgress = (agent: Agent) => {
    const totalDist = Math.abs(agent.startX - agent.targetX) + Math.abs(agent.startY - agent.targetY);
    if (totalDist === 0) return 100;
    const currDist = Math.abs(agent.x - agent.targetX) + Math.abs(agent.y - agent.targetY);
    return Math.floor(((totalDist - currDist) / totalDist) * 100);
  };

  const renderAgentSVG = (role: 'Dev' | 'DevOps' | 'Security' | 'Librarian', color: string) => {
    if (role === 'DevOps') return <DevOpsRobotSVG color={color} />;
    if (role === 'Security') return <SecurityRobotSVG color={color} />;
    if (role === 'Dev') return <DeveloperRobotSVG color={color} />;
    return <WriterRobotSVG color={color} />;
  };

  return (
    <div className="space-y-12 animate-fade-in text-foreground">
      {/* Title Hero */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-purple-color tracking-widest uppercase font-semibold bg-purple-color/10 border border-purple-color/20 px-2.5 py-1 rounded-full">
              Autonomous Monitor
            </span>
            <span className="font-mono text-[10px] text-emerald-color bg-emerald-color/10 border border-emerald-color/20 px-2 py-0.5 rounded-full">
              ● {agents.length} Active Agents
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground mt-2">
            Agent <span className="text-purple-color">Ecosystem</span>
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Monitor real-time simulated AI agent operations, telemetry metrics, and background task executions.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setIsMuted(prev => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-card/40 hover:bg-card/80 text-xs font-mono text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            title={isMuted ? "Unmute Retro Synthesizer" : "Mute Retro Synthesizer"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-color" />}
            <span>{isMuted ? "Sound Off" : "Sound On"}</span>
          </button>

          <button
            onClick={handleResetAgents}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-mono text-rose-400 transition-all cursor-pointer"
            title="Reset Agent Grid to default initial state"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Grid</span>
          </button>
        </div>
      </div>

      {/* Linacre Tool Box — callable over MCP */}
      <McpToolboxCallout blurb="Give agents real, safe capabilities: the Linacre Tool Box exposes these utilities over MCP so any agent runtime can call them locally — no keys, nothing leaves your machine." />

      {/* NO-SPEND GUARD: Prominent Billing Alert Warning Sign */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-amber-color/30 bg-[#061923] text-amber-color font-mono text-xs shadow-md">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-pulse text-amber-color" />
          <div className="space-y-0.5">
            <div className="font-bold uppercase tracking-wider">Simulated Sandbox Guard</div>
            <p className="text-muted-foreground text-[10px] leading-relaxed">
              All agent activities are executed in local memory simulation. The sandbox prevents credit allocation and blocks external real-world cloud spend.
            </p>
          </div>
        </div>

        {/* Interactive Spend limit Budget controller */}
        <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-amber-color/20 pt-3 md:pt-0 md:pl-4">
          <div className="text-right">
            <label htmlFor="spend-limit-budget" className="block text-[9px] uppercase text-muted-foreground font-bold cursor-pointer">Anti-Overcharge Budget</label>
            <span className="font-bold text-foreground text-xs">${spendLimit.toFixed(2)} / Session</span>
          </div>
          <input
            id="spend-limit-budget"
            type="range"
            min="0"
            max="5.0"
            step="0.5"
            value={spendLimit}
            onChange={(e) => {
              playSynthSound('click', isMuted);
              setSpendLimit(parseFloat(e.target.value));
            }}
            className="w-24 accent-amber-color cursor-pointer"
          />
        </div>
      </div>

      {/* Header bar controls: Sound Toggle & Export */}
      <div className="flex justify-end gap-2 pr-1">
        <button
          onClick={() => {
            const blueprintData = {
              version: "1.0",
              exportedAt: new Date().toISOString(),
              hub: "linacre.site/agents",
              agents: agents.map(a => ({
                id: a.id,
                name: a.name,
                role: a.role,
                personality: a.personality,
                spriteName: a.spriteName,
                task: a.task,
                taskQueue: a.taskQueue,
                roboticTraits: a.roboticTraits
              }))
            };
            const jsonStr = JSON.stringify(blueprintData, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `agent_blueprints_${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-color/40 bg-purple-color/10 hover:bg-purple-color/20 text-purple-color font-mono text-xs font-bold transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Export Agent Blueprints</span>
        </button>

        <button
          onClick={() => {
            playSynthSound('click', isMuted);
            setIsLiveTracking(!isLiveTracking);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
            isLiveTracking
              ? 'border-cyan bg-cyan/10 text-cyan shadow-[0_0_8px_rgba(92,207,230,0.2)]'
              : 'border-border-color bg-muted/10 hover:bg-muted/20 text-muted-foreground hover:text-foreground'
          }`}
        >
          <Bot className={`w-4 h-4 ${isLiveTracking ? 'animate-pulse' : ''}`} />
          <span>{isLiveTracking ? 'Pixel Agent (Active)' : 'Pixel Agent Mode'}</span>
        </button>

        <button
          onClick={() => {
            setIsMuted(!isMuted);
            playSynthSound('click', !isMuted);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-color bg-muted/10 hover:bg-muted/20 text-muted-foreground hover:text-foreground text-xs font-mono transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan" />}
          <span>{isMuted ? 'Unmute SFX' : 'Mute SFX'}</span>
        </button>
      </div>

      {/* Global Telemetry Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in animate-duration-300" id="telemetry-dashboard">
        <div className="bg-muted/15 border border-border-color p-4 rounded-xl flex flex-col justify-between space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-muted-foreground text-[10px] font-mono uppercase tracking-wider">
            <span>Matrix Load</span>
            <Cpu className="w-3.5 h-3.5 text-amber-color" />
          </div>
          <div className="flex items-baseline gap-1 relative z-10">
            <span className="font-display text-2xl font-bold text-foreground">{telemetry.load}</span>
            <span className="font-mono text-xs text-muted-foreground">%</span>
          </div>

          <div className="absolute right-2 bottom-1 w-28 h-6 opacity-35">
            <svg viewBox="0 0 120 24" className="w-full h-full">
              <path
                d={generatePathData(loadHistory, 100)}
                fill="none"
                stroke="#34D399"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
          </div>
        </div>

        <div className="bg-muted/15 border border-border-color p-4 rounded-xl flex flex-col justify-between space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-muted-foreground text-[10px] font-mono uppercase tracking-wider">
            <span>Bandwidth Transfer</span>
            <Activity className="w-3.5 h-3.5 text-cyan" />
          </div>
          <div className="flex items-baseline gap-1 relative z-10">
            <span className="font-display text-2xl font-bold text-foreground">{telemetry.bandwidth}</span>
            <span className="font-mono text-xs text-muted-foreground">MB/s</span>
          </div>

          <div className="absolute right-2 bottom-1 w-28 h-6 opacity-35">
            <svg viewBox="0 0 120 24" className="w-full h-full">
              <path
                d={generatePathData(bandwidthHistory, 40)}
                fill="none"
                stroke="#5ccfe6"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
          </div>
        </div>

        <div className="bg-muted/15 border border-border-color p-4 rounded-xl flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-[10px] font-mono uppercase tracking-wider">
            <span>Active Power</span>
            <Zap className="w-3.5 h-3.5 text-emerald-color" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-bold text-foreground">{telemetry.powerDraw}</span>
            <span className="font-mono text-xs text-muted-foreground">Watts</span>
          </div>
          <div className="w-full bg-muted-foreground/10 h-1 rounded overflow-hidden">
            <div className="bg-emerald-color h-full transition-all duration-500" style={{ width: `${Math.min(100, (telemetry.powerDraw / 200) * 100)}%` }} />
          </div>
        </div>

        <div className="bg-muted/15 border border-border-color p-4 rounded-xl flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-[10px] font-mono uppercase tracking-wider">
            <span>Completed Deliveries</span>
            <Layers className="w-3.5 h-3.5 text-purple-color" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-bold text-foreground">{telemetry.jobsCompleted}</span>
            <span className="font-mono text-xs text-muted-foreground">Jobs</span>
          </div>
          <div className="w-full bg-muted-foreground/10 h-1 rounded overflow-hidden">
            <div className="bg-purple-color h-full transition-all duration-500" style={{ width: `${Math.min(100, telemetry.jobsCompleted * 10)}%` }} />
          </div>
        </div>
      </div>

      {/* SECTION: 3D Isometric Tactical Agent Grid & Radar */}
      <div className="relative p-6 rounded-2xl bg-[#0a0f1d]/65 border-2 border-amber-color/25 shadow-[0_0_20px_rgba(34,211,238,0.04)] space-y-6 overflow-hidden" id="agent-grid-tactical-radar">
        {/* Decorative scan lines / grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Glowing spotlight effect */}
        <div className="absolute -left-16 -top-16 w-32 h-32 bg-amber-color/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -right-16 -bottom-16 w-32 h-32 bg-cyan/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-color/30 pb-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-color rounded-full animate-pulse" />
              <h2 className="font-mono text-xs font-bold text-amber-color uppercase tracking-widest">
                3D Tactical Agent Radar & Grid
              </h2>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Live visualization of active units walking Manhattan paths to coordinate background processes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playSynthSound('click', isMuted);
                setGridProjection(gridProjection === 'isometric' ? 'flat' : 'isometric');
              }}
              className="px-3 py-1.5 border border-border-color rounded-lg bg-background/50 text-[10px] font-mono hover:text-amber-color transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Perspective: {gridProjection === 'isometric' ? '3D Isometric' : 'Flat 2D'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: The actual Canvas Grid rendering */}
          <div className="lg:col-span-8 flex justify-center items-center py-6 relative overflow-hidden bg-[#020a11]/80 rounded-xl border border-border-color/30 min-h-[380px]">
            {/* Grid Map View container */}
            <div className={`relative transition-all duration-700 ease-out p-6 ${
              gridProjection === 'isometric'
                ? 'scale-[0.82] [transform:rotateX(55deg)_rotateZ(-45deg)] [transform-style:preserve-3d]'
                : 'scale-[0.95]'
            }`}>

              {/* Actual 10x10 Matrix Board */}
              <div className="grid grid-cols-10 gap-1 w-[280px] sm:w-[340px] md:w-[380px] aspect-square relative z-10">
                {Array.from({ length: 100 }).map((_, idx) => {
                  const r = Math.floor(idx / 10);
                  const c = idx % 10;
                  const workstation = WORKSTATIONS.find(w => w.x === c && w.y === r);
                  const cellAgents = agents.filter(a => !a.isPaused && Math.round(a.x) === c && Math.round(a.y) === r);
                  const hasTrail = particles.some(p => p.x === c && p.y === r);
                  const isPath = isPathTile(c, r);

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        if (workstation) {
                          playSynthSound('click', isMuted);
                          setSelectedNode(workstation);
                        }
                      }}
                      className={`relative aspect-square flex items-center justify-center rounded transition-all duration-300 group ${
                        workstation
                          ? 'cursor-pointer hover:scale-110 z-20'
                          : isPath
                          ? 'bg-[#111827]/40 border border-amber-color/5'
                          : 'opacity-25 hover:opacity-50'
                      }`}
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: gridProjection === 'isometric' ? 'translateZ(2px)' : undefined
                      }}
                      title={workstation ? workstation.name : `Grid Node (${c}, ${r})`}
                    >
                      {/* Grid background coordinate/dot indicator for non-paths */}
                      {!isPath && !workstation && (
                        <span className="text-[8px] font-mono text-muted-foreground/30 select-none">+</span>
                      )}

                      {/* Path lane indicators */}
                      {isPath && !workstation && cellAgents.length === 0 && (
                        <div className="absolute inset-0.5 rounded bg-amber-color/[0.02] border border-amber-color/[0.04]" />
                      )}

                      {/* Spark / Footprint trail */}
                      {hasTrail && !workstation && cellAgents.length === 0 && (
                        <motion.div
                          initial={{ opacity: 0.8, scale: 0.5 }}
                          animate={{ opacity: 0, scale: 1.5 }}
                          transition={{ duration: 1 }}
                          className="w-2 h-2 bg-amber-color/60 rounded-full blur-[1px]"
                        />
                      )}

                      {/* Workstation render */}
                      {workstation && (
                        <div className={`relative w-full h-full flex items-center justify-center rounded-lg border-2 transition-all p-1 ${
                          workstation.color
                        } ${
                          selectedNode?.name === workstation.name
                            ? 'ring-2 ring-amber-color border-amber-color shadow-[0_0_12px_rgba(34,211,238,0.4)] scale-105'
                            : 'hover:border-amber-color hover:shadow-[0_0_8px_rgba(34,211,238,0.2)]'
                        }`}
                        style={{
                          transform: gridProjection === 'isometric' ? 'translateZ(12px)' : undefined
                        }}
                        >
                          <workstation.icon className="w-4 h-4 sm:w-5 sm:h-5" />

                          {/* Pulsing indicator under workstation */}
                          <div className="absolute -inset-0.5 bg-current rounded-lg opacity-10 animate-ping pointer-events-none" />

                          {/* Hover badge name */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-black/95 text-[8px] text-foreground font-mono px-1.5 py-0.5 rounded border border-border-color opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap mb-1 z-30 shadow-md">
                            {workstation.name}
                          </div>
                        </div>
                      )}

                      {/* Agent Avatar render */}
                      {cellAgents.length > 0 && (
                        <div
                          className="absolute flex flex-col items-center justify-center z-25 pointer-events-none"
                          style={{
                            transform: gridProjection === 'isometric' ? 'translateZ(20px)' : undefined
                          }}
                        >
                          {cellAgents.map((agent) => {
                            const hasImageError = imageErrors[agent.id];
                            return (
                              <div key={agent.id} className="relative w-8 h-8 flex items-center justify-center">
                                {/* Bottom glowing shadow ring */}
                                <div className="absolute bottom-0 w-6 h-1.5 bg-black/50 rounded-full border border-current opacity-75 blur-[1px]" style={{ color: agent.color }} />

                                {hasImageError ? (
                                  <div className="w-7 h-7">
                                    {renderAgentSVG(agent.role, agent.color)}
                                  </div>
                                ) : (
                                  <img
                                    src={prefersReducedMotion
                                      ? `https://play.pokemonshowdown.com/sprites/gen5/${agent.spriteName}.png`
                                      : `${SPRITE_BASE_URL}${agent.spriteName}.gif`
                                    }
                                    alt={agent.name}
                                    className={`w-8 h-8 object-contain drop-shadow-[0_-2px_6px_rgba(255,255,255,0.4)] relative z-10 ${
                                      prefersReducedMotion ? '' : 'animate-bounce'
                                    }`}
                                    onError={() => setImageErrors(prev => ({ ...prev, [agent.id]: true }))}
                                    referrerPolicy="no-referrer"
                                  />
                                )}

                                {/* Little bubble showing their status */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-black/90 text-[7px] text-foreground font-mono px-1 rounded border border-border-color opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-0.5 z-30 shadow">
                                  {agent.name} ({agent.task !== 'Idle' ? agent.task : 'Ready'})
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 3D Grid shadow backdrop */}
              {gridProjection === 'isometric' && (
                <div className="absolute inset-4 bg-amber-color/3 border border-amber-color/10 rounded-xl filter blur-sm -z-10 [transform:translateZ(-10px)]" />
              )}
            </div>
          </div>

          {/* Right Column: Interaction Trigger Control Room */}
          <div className="lg:col-span-4 flex flex-col justify-center h-full min-h-[300px] border-t lg:border-t-0 lg:border-l border-border-color/30 pt-6 lg:pt-0 lg:pl-6 space-y-4 relative z-10">
            {selectedNode ? (
              <div className="space-y-4 font-mono text-xs animate-fade-in">
                <div className="p-3 bg-muted/10 border border-amber-color/20 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-color font-bold uppercase tracking-wider text-[10px]">
                    <selectedNode.icon className="w-4 h-4 text-amber-color" />
                    <span>Selected: {selectedNode.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] text-muted-foreground">
                    <div><strong>Coordinate:</strong> ({selectedNode.x}, {selectedNode.y})</div>
                    <div><strong>Bus Node:</strong> H-System</div>
                  </div>
                </div>

                {/* Dispatch Trigger Form */}
                <div className="space-y-3 p-3 bg-background/40 border border-border-color/40 rounded-xl">
                  <h4 className="text-[10px] text-foreground font-bold uppercase tracking-wider">Dispatch Tactical Unit</h4>

                  <div className="space-y-1">
                    <label htmlFor="select-tactical-agent" className="block text-[8px] text-muted-foreground uppercase font-bold">Select Agent</label>
                    <select
                      id="select-tactical-agent"
                      aria-label="Select tactical agent"
                      value={tacticalAgentId}
                      onChange={(e) => setTacticalAgentId(e.target.value)}
                      className="w-full bg-[#020a11] border border-border-color rounded px-2 py-1 text-[10px] font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-amber-color"
                    >
                      {agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name} {agent.isPaused ? '[PAUSED]' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="select-tactical-action" className="block text-[8px] text-muted-foreground uppercase font-bold">Audit Command Script</label>
                    <select
                      id="select-tactical-action"
                      aria-label="Select tactical command script"
                      value={tacticalAction}
                      onChange={(e) => setTacticalAction(e.target.value)}
                      className="w-full bg-[#020a11] border border-border-color rounded px-2 py-1 text-[10px] font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-amber-color"
                    >
                      {predefinedActions.map((action, idx) => (
                        <option key={idx} value={action}>
                          {action}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => handleTacticalDispatch(tacticalAgentId, tacticalAction)}
                    className="w-full py-1.5 bg-amber-color hover:bg-amber-color/90 text-black font-bold rounded text-[10px] tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Launch Audit Dispatch</span>
                  </button>
                </div>

                <p className="text-[9px] text-muted-foreground leading-normal italic text-center">
                  * Clicking dispatch launches physical pathing. The bot will slide along grid roads to complete scan.
                </p>
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-3 font-mono text-xs text-muted-foreground">
                <Bot className="w-8 h-8 text-muted-foreground/30 animate-pulse" />
                <div className="space-y-1">
                  <div className="font-bold text-foreground text-[11px] uppercase tracking-wider">Tactical Node Radar Standby</div>
                  <p className="text-[10px] leading-relaxed max-w-[220px] mx-auto">
                    Click any highlighted **Workstation Node** on the grid map (e.g. Git, DB, Cafe) to set target destination and dispatch an autonomous agent task force.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Agent Command Center - Pixel Art Party Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Side: Agent Party Roster Cards */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative p-6 rounded-2xl bg-muted/10 dark:bg-[#081c28]/30 border-2 border-amber-color/20 shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

            {/* Corner ornaments */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-color/40" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-color/40" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-color/40" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-color/40" />

            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 bg-amber-color rounded-full animate-pulse" />
              <h2 className="font-mono text-xs font-bold text-amber-color uppercase tracking-widest">
                Agent Party Roster
              </h2>
              <span className="font-mono text-[10px] text-muted-foreground ml-auto">
                {agents.filter(a => !a.isPaused).length}/{agents.length} Active
              </span>
            </div>

            {/* Agent Cards Grid */}
            {agents.length === 0 ? (
              <div className="text-center py-12 font-mono text-xs text-muted-foreground">
                <Bot className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p>No agents deployed. Spawn one from the factory panel.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {agents.map((agent) => {
                  const isMoving = !agent.isPaused && (agent.x !== agent.targetX || agent.y !== agent.targetY);
                  const isCarrying = agent.task !== 'Idle';
                  const progress = getPathProgress(agent);
                  const hasImageError = imageErrors[agent.id];

                  return (
                    <motion.div
                      key={agent.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => {
                        playSynthSound('click', isMuted);
                        setInspectingAgent(agent);
                      }}
                      className={`relative bg-[#0a0f1d]/90 border-2 rounded-xl p-4 font-mono cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        agent.isPaused
                          ? 'border-red-900/40 opacity-55'
                          : isMoving
                          ? 'border-cyan/40 hover:border-cyan/60 shadow-[0_0_12px_rgba(92,207,230,0.08)]'
                          : 'border-border-color hover:border-amber-color/40'
                      }`}
                    >
                      {/* Corner decorations */}
                      <div className={`absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 ${agent.isPaused ? 'border-red-900/40' : 'border-amber-color/30'}`} />
                      <div className={`absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 ${agent.isPaused ? 'border-red-900/40' : 'border-amber-color/30'}`} />
                      <div className={`absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 ${agent.isPaused ? 'border-red-900/40' : 'border-amber-color/30'}`} />
                      <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 ${agent.isPaused ? 'border-red-900/40' : 'border-amber-color/30'}`} />

                      <div className="flex gap-4">
                        {/* Avatar */}
                        <div className="w-16 h-16 flex-shrink-0 relative">
                          <div className={`w-full h-full p-1 rounded-lg bg-background/50 border ${agent.isPaused ? 'border-red-900/30' : 'border-border-color/60'}`}>
                            {hasImageError ? (
                              renderAgentSVG(agent.role, agent.color)
                            ) : (
                              <img
                                src={prefersReducedMotion
                                  ? `https://play.pokemonshowdown.com/sprites/gen5/${agent.spriteName}.png`
                                  : `${SPRITE_BASE_URL}${agent.spriteName}.gif`
                                }
                                alt={agent.name}
                                className="w-full h-full object-contain drop-shadow-[0_0_3px_rgba(255,255,255,0.15)]"
                                onError={() => setImageErrors(prev => ({ ...prev, [agent.id]: true }))}
                              />
                            )}
                          </div>
                          {isMoving && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-color rounded-full animate-ping" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 space-y-1.5">
                          {/* Name + Role */}
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-sm text-foreground truncate">{agent.name}</span>
                            <span className={`flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              agent.role === 'Dev' ? 'bg-cyan/10 text-cyan' :
                              agent.role === 'DevOps' ? 'bg-emerald-color/10 text-emerald-color' :
                              agent.role === 'Security' ? 'bg-amber-color/10 text-amber-color' :
                              'bg-purple-color/10 text-purple-color'
                            }`}>
                              {agent.role}
                            </span>
                          </div>

                          {/* Task */}
                          <div className="flex items-center gap-1 text-[10px]">
                            {isCarrying && !agent.isPaused ? (
                              <>
                                <span className="text-cyan">▶</span>
                                <span className="text-muted-foreground truncate">{agent.task}</span>
                              </>
                            ) : agent.isPaused ? (
                              <>
                                <span className="text-red-400">⏸</span>
                                <span className="text-red-400/70 text-[9px]">SUSPENDED</span>
                              </>
                            ) : (
                              <>
                                <span className="text-emerald-color">●</span>
                                <span className="text-muted-foreground text-[9px]">Standing by</span>
                              </>
                            )}
                          </div>

                          {/* HP Bar */}
                          <div className="space-y-0.5">
                            <div className="flex justify-between text-[7px] text-muted-foreground uppercase tracking-wider">
                              <span>HP</span>
                              <span>100%</span>
                            </div>
                            <div className="w-full bg-slate-800/80 h-1.5 rounded-sm overflow-hidden">
                              <div className="bg-emerald-color h-full rounded-sm transition-all duration-500" style={{ width: `${agent.isPaused ? 30 : 100}%` }} />
                            </div>
                          </div>

                          {/* EXP Bar when working */}
                          {isCarrying && !agent.isPaused && (
                            <div className="space-y-0.5">
                              <div className="flex justify-between text-[7px] text-muted-foreground uppercase tracking-wider">
                                <span>EXP</span>
                                <span>{progress}%</span>
                              </div>
                              <div className="w-full bg-slate-800/80 h-1.5 rounded-sm overflow-hidden">
                                <div className="bg-cyan h-full rounded-sm transition-all duration-500" style={{ width: `${progress}%` }} />
                              </div>
                            </div>
                          )}

                          {/* Status + Queue */}
                          <div className="flex items-center justify-between text-[8px] text-muted-foreground">
                            <span className="truncate max-w-[70%]">{agent.status}</span>
                            {agent.taskQueue.length > 0 && (
                              <span className="text-amber-color font-bold flex-shrink-0">+{agent.taskQueue.length}Q</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Paused overlay indicator */}
                      {agent.isPaused && (
                        <div className="absolute inset-0 rounded-xl bg-black/20 pointer-events-none flex items-center justify-center">
                          <span className="text-[8px] text-red-400/60 font-bold uppercase tracking-widest bg-black/60 px-2 py-0.5 rounded">Suspended</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Control Panels & Inspector */}
        <div className="lg:col-span-5 space-y-6">

          {/* Panel 1: AI Agent Architect Suggestions Card */}
          <div className="p-5 rounded-2xl bg-purple-color/5 border-2 border-purple-color/40 shadow-[0_0_15px_rgba(168,85,247,0.15)] space-y-4 animate-fade-in relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-20 h-20 bg-purple-color/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-purple-color/30" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-purple-color/30" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-purple-color/30" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-purple-color/30" />

            <h3 className="font-mono text-xs font-bold text-purple-color uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-color animate-pulse" />
              <span>🧠 Agent Architect Recommendations</span>
            </h3>

            {activeSuggestion ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-purple-color/20 text-purple-color rounded text-[10px] font-bold">
                    Concept Suggestion
                  </span>
                  <span className="font-bold text-foreground">{activeSuggestion.concept}</span>
                </div>

                <div className="p-3 rounded-lg bg-background/50 border border-purple-color/20 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <strong>Recommended Name:</strong> <span className="text-foreground font-bold">{activeSuggestion.name}</span>
                    <strong className="ml-2">Sprite:</strong> <span className="text-foreground capitalize">{activeSuggestion.spriteName}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    <span className="text-purple-color font-bold">Prompt Function: </span>
                    {activeSuggestion.detailedPrompt}
                  </p>
                </div>

                {/* Step by step guide */}
                <div className="space-y-1 p-2.5 rounded bg-[#090d14]/70 border border-border-color/40 text-[9px] text-muted-foreground leading-relaxed">
                  <span className="text-foreground font-bold uppercase block mb-1">Step-by-Step Deployment:</span>
                  {activeSuggestion.steps.map((step, idx) => (
                    <div key={idx}>{step}</div>
                  ))}
                </div>

                {/* Auto build click button */}
                <button
                  onClick={handleBuildArchitectSuggestion}
                  className="w-full py-2 bg-purple-color hover:bg-purple-color/90 text-[#030c14] font-bold rounded-lg transition-colors cursor-pointer text-center text-xs flex items-center justify-center gap-1.5 shadow"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Accept Concept & Build Agent</span>
                </button>
              </div>
            ) : (
              <div className="text-center text-xs font-mono text-muted-foreground py-4">
                No active concepts in memory.
              </div>
            )}
          </div>

          {/* Panel 2: Agent Inspector */}
          <AnimatePresence>
            {inspectingAgent ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-5 rounded-2xl bg-muted/15 border-2 border-amber-color/20 shadow-lg space-y-4 relative"
              >
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-color/25" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-color/25" />
                <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-color/25" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-color/25" />
                <div className="flex items-center justify-between border-b border-border-color/40 pb-2 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground uppercase tracking-wider">
                      🔧 Inspector: {inspectingAgent.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      playSynthSound('click', isMuted);
                      setInspectingAgent(null);
                    }}
                    className="text-muted-foreground hover:text-foreground text-[10px]"
                  >
                    [Close]
                  </button>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div className="space-y-3 p-3 rounded-lg bg-background/40 border border-border-color/30">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] uppercase tracking-wider text-muted-foreground">
                        <span>CPU Usage</span>
                        <span className="font-bold text-foreground">{inspectingAgent.cpu}%</span>
                      </div>
                      <div className="w-full bg-muted-foreground/10 h-1.5 rounded overflow-hidden">
                        <div className="bg-amber-color h-full transition-all duration-300" style={{ width: `${inspectingAgent.cpu}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] uppercase tracking-wider text-muted-foreground">
                        <span>RAM Footprint</span>
                        <span className="font-bold text-foreground">{inspectingAgent.ram} MB</span>
                      </div>
                      <div className="w-full bg-muted-foreground/10 h-1.5 rounded overflow-hidden">
                        <div className="bg-cyan h-full transition-all duration-300" style={{ width: `${(inspectingAgent.ram / 1024) * 100}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-background/30 border border-border-color/20 text-[10px] text-muted-foreground leading-relaxed">
                    <span className="text-foreground font-bold uppercase block mb-1">Robotic Hardware Details:</span>
                    {inspectingAgent.roboticTraits}
                  </div>

                  {inspectingAgent.taskQueue.length > 0 && (
                    <div className="p-2.5 rounded bg-[#0f172a] border border-cyan/20 text-[10px] text-cyan leading-relaxed">
                      <span className="text-foreground font-bold uppercase block mb-1">Pending Task Queue:</span>
                      {inspectingAgent.taskQueue.map((t, idx) => (
                        <div key={idx}>- [{idx + 1}] {t}</div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground border-t border-border-color/20 pt-2.5">
                    <div><strong>Role:</strong> {inspectingAgent.role}</div>
                    <div><strong>Personality:</strong> {inspectingAgent.personality}</div>
                    <div><strong>Coordinate:</strong> ({inspectingAgent.x}, {inspectingAgent.y})</div>
                    <div><strong>Destination:</strong> ({inspectingAgent.targetX}, {inspectingAgent.targetY})</div>
                    <div className="col-span-2 text-amber-color font-bold"><strong>Current Task:</strong> {inspectingAgent.task}</div>
                    <div className="col-span-2"><strong>Status:</strong> {inspectingAgent.status}</div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2.5 border-t border-border-color/30">
                    <button
                      onClick={() => handleTogglePauseAgent(inspectingAgent.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-colors cursor-pointer ${
                        inspectingAgent.isPaused
                          ? 'bg-emerald-color/10 hover:bg-emerald-color/20 text-emerald-color border-emerald-color/30'
                          : 'bg-amber-color/10 hover:bg-amber-color/20 text-amber-color border-amber-color/30'
                      }`}
                    >
                      {inspectingAgent.isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                      <span>{inspectingAgent.isPaused ? 'Resume Bot' : 'Pause Bot'}</span>
                    </button>

                    <button
                      onClick={() => handleDecommissionAgent(inspectingAgent.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Decommission</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="p-5 rounded-2xl bg-muted/5 border border-dashed border-border-color/40 text-center text-xs font-mono text-muted-foreground py-8">
                <Info className="w-6 h-6 mx-auto mb-2 text-muted-foreground/40" />
                <span>Click on an agent card to inspect real-time CPU/RAM telemetry, robotic build details, and toggle pause/decommission states.</span>
              </div>
            )}
          </AnimatePresence>

          {/* Panel 3: Task Dispatcher & Predefined Actions */}
          <div className="p-5 rounded-2xl bg-muted/15 border-2 border-cyan/20 space-y-4 relative">
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan/25" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan/25" />
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan/25" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan/25" />
            <h3 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-cyan" />
              <span>Coordinated Task Assigner</span>
            </h3>

            <form onSubmit={handleAssignAction} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="select-active-agent" className="block font-mono text-[10px] text-muted-foreground uppercase font-bold">Select Active Agent</label>
                <select
                  id="select-active-agent"
                  aria-label="Select active agent to configure"
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full bg-background border border-border-color rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-amber-color"
                >
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} {agent.isPaused ? '[PAUSED]' : ''} {agent.taskQueue.length > 0 ? `(${agent.taskQueue.length} queued)` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* add actions - Predefined database dropdown */}
              <div className="space-y-1">
                <label htmlFor="select-predefined-action" className="block font-mono text-[10px] text-muted-foreground uppercase font-bold">Predefined Actions Database</label>
                <select
                  id="select-predefined-action"
                  aria-label="Select predefined database action"
                  value={selectedAction}
                  onChange={(e) => {
                    setSelectedAction(e.target.value);
                    setCustomActionText('');
                  }}
                  className="w-full bg-background border border-border-color rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-amber-color"
                >
                  {predefinedActions.map((action, idx) => (
                    <option key={idx} value={action}>
                      {action}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="input-custom-task" className="block font-mono text-[10px] text-muted-foreground uppercase font-bold">Or Dispatch Custom Task</label>
                <div className="relative">
                  <input
                    id="input-custom-task"
                    type="text"
                    placeholder="Write a custom script task..."
                    value={customActionText}
                    onChange={(e) => setCustomActionText(e.target.value)}
                    className="w-full bg-background/50 border border-border-color rounded-lg pl-3 pr-10 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-amber-color"
                  />
                  <button
                    type="submit"
                    aria-label="Dispatch custom task"
                    className="absolute right-1 top-1 p-1 bg-amber-color text-black rounded-md hover:bg-amber-color/90 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Panel 4: Add Predefined Actions Form */}
          <div className="p-5 rounded-2xl bg-muted/15 border-2 border-purple-color/20 space-y-4 relative">
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-purple-color/25" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-purple-color/25" />
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-purple-color/25" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-purple-color/25" />
            <h3 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-purple-color" />
              <span>Create New Action Script</span>
            </h3>

            <form onSubmit={handleAddNewAction} className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label htmlFor="new-action-text-input" className="block text-[10px] text-muted-foreground uppercase font-bold">Action Name / Task Description</label>
                <div className="relative">
                  <input
                    id="new-action-text-input"
                    type="text"
                    required
                    placeholder="e.g., Flush Postgres cache"
                    value={newActionText}
                    onChange={(e) => setNewActionText(e.target.value)}
                    className="w-full bg-background border border-border-color rounded-lg pl-3 pr-10 py-1.5 text-xs text-foreground focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 p-1 bg-purple-color text-[#030c14] rounded hover:bg-purple-color/90 transition-colors"
                    aria-label="Add new action script"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Panel 5: Agent Spawner Factory */}
          <div className="p-5 rounded-2xl bg-muted/15 border-2 border-emerald-color/20 space-y-4 relative">
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-color/25" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-color/25" />
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-color/25" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-color/25" />
            <h3 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-color" />
              <span>Spawn New Agent</span>
            </h3>

            <form onSubmit={handleCreateAgent} className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label htmlFor="spawn-agent-name" className="block text-[10px] text-muted-foreground uppercase font-bold">Agent Name</label>
                <input
                  id="spawn-agent-name"
                  type="text"
                  required
                  placeholder="e.g. DocBot, CleanMonkey"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  className="w-full bg-background border border-border-color rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="spawn-agent-role" className="block text-[10px] text-muted-foreground uppercase font-bold">Role & Type</label>
                  <select
                    id="spawn-agent-role"
                    aria-label="Select role and type for spawned agent"
                    value={newAgentRole}
                    onChange={(e: any) => setNewAgentRole(e.target.value)}
                    className="w-full bg-background border border-border-color rounded-lg px-2 py-1.5 text-xs text-foreground"
                  >
                    <option value="Dev">Developer Unit</option>
                    <option value="DevOps">DevOps Unit</option>
                    <option value="Security">Security Guard Unit</option>
                    <option value="Librarian">Librarian Unit</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="spawn-agent-personality" className="block text-[10px] text-muted-foreground uppercase font-bold">Personality</label>
                  <select
                    id="spawn-agent-personality"
                    aria-label="Select personality behavior"
                    value={newAgentPersonality}
                    onChange={(e: any) => setNewAgentPersonality(e.target.value)}
                    className="w-full bg-background border border-border-color rounded-lg px-2 py-1.5 text-xs text-foreground"
                  >
                    <option value="focused">focused (direct path)</option>
                    <option value="caffeinated">caffeinated (cafe break)</option>
                    <option value="chaotic">chaotic (roams grid)</option>
                    <option value="pragmatic">pragmatic (stable pace)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="spawn-agent-sprite" className="block text-[10px] text-muted-foreground uppercase font-bold">Select Avatar Sprite</label>
                <select
                  id="spawn-agent-sprite"
                  aria-label="Select pokemon sprite style"
                  value={newAgentSprite}
                  onChange={(e) => setNewAgentSprite(e.target.value)}
                  className="w-full bg-background border border-border-color rounded-lg px-2 py-1.5 text-xs text-foreground"
                >
                  {AVAILABLE_POKEMON.map((pokemon, idx) => (
                    <option key={idx} value={pokemon.file}>
                      {pokemon.name} - {pokemon.description.split('.')[0]}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-color hover:bg-emerald-color/90 text-black font-bold rounded-lg transition-colors cursor-pointer text-center text-xs mt-2"
              >
                Spawn Agent
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Retro RPG Dialogue Box */}
      <div className="p-5 rounded-2xl bg-[#080d16] border-4 border-amber-color shadow-[0_0_15px_rgba(34,211,238,0.2)] space-y-2 relative font-mono text-xs text-foreground selection:bg-amber-color/30 animate-fade-in">

        <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-color/50" />
        <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-color/50" />
        <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-color/50" />
        <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-color/50" />

        <div className="flex items-center gap-1.5 border-b border-border-color/30 pb-1.5 text-[10px] text-amber-color font-bold tracking-widest uppercase">
          <span>Active RPG Dialog Log</span>
        </div>

        <div className="h-20 flex flex-col justify-between py-1 leading-relaxed selection:bg-amber-color/20 text-foreground/90 font-semibold select-text">
          <div>
            {typedDialogText}
            {typingIndex < currentDialogMessage.length && (
              <span className="w-1.5 h-3 bg-foreground inline-block ml-0.5 animate-pulse" />
            )}
          </div>

          {typingIndex >= currentDialogMessage.length && (
            <div className="flex justify-end animate-bounce">
              <span className="text-[10px] text-amber-color font-bold">▼</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
