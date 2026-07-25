import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Settings, ChevronDown, ChevronUp, Send, RefreshCw, Key, Sparkles, AlertCircle, CheckCircle, Info, Lock, Download, Trash2, StopCircle, Plus, MessageSquare, Folder, File, FolderPlus, FilePlus, Upload, Paperclip, ChevronRight, Eye, Save, FileText, Terminal, X, Play, Database, Coins, DollarSign, CreditCard } from 'lucide-react';
import { ChatMessage } from '../types';

export type LabProvider = 'gemini' | 'openai' | 'ollama' | 'litellm' | 'claude';

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  provider: LabProvider;
  timestamp: string;
}

interface LabProps {
  theme?: 'dark' | 'light';
}

interface WorkspaceItem {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  content?: string;
}

const DEFAULT_WORKSPACE: WorkspaceItem[] = [
  {
    id: 'ws-readme',
    name: 'README.md',
    path: 'README.md',
    type: 'file',
    content: `# David Linacre AI Lab - Workspace\n\nWelcome to your sandbox environment! Here you can upload, edit, and manage virtual files and folders.\n\n### 🚀 Features:\n1. **Create Files & Folders**: Organize your ideas directly in the file tree.\n2. **Import Files & Folders**: Drag & drop or use the Upload buttons to load local code files or entire directories!\n3. **Export Workspace**: Save your whole layout as a clean JSON backup file.\n4. **Attach to Chat**: Click the Paperclip icon next to any file to automatically include its source code in your chat prompts! This lets you ask the AI to debug, refactor, or explain your code with ease.\n\nTry opening \`src/App.tsx\` to see an example component, or upload your own files to get started!`
  },
  {
    id: 'ws-src-folder',
    name: 'src',
    path: 'src',
    type: 'folder'
  },
  {
    id: 'ws-src-app',
    name: 'App.tsx',
    path: 'src/App.tsx',
    type: 'file',
    content: `import React, { useState } from 'react';\n\nexport default function App() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div className="p-8 max-w-md mx-auto bg-slate-900 text-white rounded-xl shadow-md">\n      <h1 className="text-xl font-bold font-mono">Hello React in the Lab!</h1>\n      <p className="mt-2 text-slate-400 font-mono">Count: {count}</p>\n      <button \n        onClick={() => setCount(count + 1)}\n        className="mt-4 px-4 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition-colors"\n      >\n        Increment\n      </button>\n    </div>\n  );\n}`
  },
  {
    id: 'ws-src-css',
    name: 'index.css',
    path: 'src/index.css',
    type: 'file',
    content: `@import "tailwindcss";\n\nbody {\n  font-family: 'Inter', sans-serif;\n  background-color: #0b0f19;\n  color: #f3f4f6;\n}`
  },
  {
    id: 'ws-db-folder',
    name: 'db',
    path: 'db',
    type: 'folder'
  },
  {
    id: 'ws-db-schema',
    name: 'schema.sql',
    path: 'db/schema.sql',
    type: 'file',
    content: `-- PostgreSQL schema for David Linacre's Dashboard\n\nCREATE TABLE IF NOT EXISTS projects (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(100) UNIQUE NOT NULL,\n  category VARCHAR(50) NOT NULL,\n  description TEXT,\n  url VARCHAR(255),\n  host VARCHAR(100),\n  tag VARCHAR(50) DEFAULT 'Live',\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n-- Seed initial projects\nINSERT INTO projects (name, category, description, url, host, tag)\nVALUES \n  ('linacre.site', 'build', 'Useful start page and browser tools', 'https://www.linacre.site', 'linacre.site', 'Live'),\n  ('DKMA Monster', 'build', 'Android background-app survival toolkit', 'https://lin4cre.github.io/dkma-monster/', 'GitHub Pages', 'Open Source');`
  }
];

const MOCK_USERS = [
  { id: 1, name: 'David Linacre', role: 'Lead Architect', email: 'delinacre@gmail.com', status: 'Active', created_at: '2026-01-15' },
  { id: 2, name: 'AI Assistant', role: 'Senior Agent', email: 'gemini@assistant.local', status: 'Active', created_at: '2026-02-10' },
  { id: 3, name: 'Sarah Jenkins', role: 'QA Lead', email: 'sarah.j@linacre.site', status: 'Inactive', created_at: '2026-03-24' },
  { id: 4, name: 'Marcus Vance', role: 'DevOps Specialist', email: 'marcus@infra.net', status: 'Active', created_at: '2026-04-12' },
  { id: 5, name: 'Elena Rostova', role: 'Backend Engineer', email: 'elena@code.org', status: 'Active', created_at: '2026-05-01' }
];

const MOCK_API_LOGS = [
  { id: 1001, timestamp: '15:42:01', endpoint: '/api/chat', method: 'POST', latency_ms: 245, status: 200, bytes_sent: 1024 },
  { id: 1002, timestamp: '15:43:12', endpoint: '/api/health', method: 'GET', latency_ms: 12, status: 200, bytes_sent: 128 },
  { id: 1003, timestamp: '15:45:50', endpoint: '/api/scan', method: 'GET', latency_ms: 410, status: 200, bytes_sent: 2048 },
  { id: 1004, timestamp: '15:51:24', endpoint: '/api/chat', method: 'POST', latency_ms: 895, status: 500, bytes_sent: 512 },
  { id: 1005, timestamp: '15:52:10', endpoint: '/api/keys', method: 'GET', latency_ms: 22, status: 200, bytes_sent: 256 },
  { id: 1006, timestamp: '15:53:01', endpoint: '/api/chat', method: 'POST', latency_ms: 310, status: 200, bytes_sent: 890 }
];

import McpToolboxCallout from './McpToolboxCallout';

export default function Lab({ theme = 'dark' }: LabProps) {
  const [activeProvider, setActiveProvider] = useState<LabProvider>('gemini');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [configOpen, setConfigOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Lab Collaborative Agent Team states
  const [teamMode, setTeamMode] = useState<boolean>(true);

  // Anthropic Budget & Credit States ($100 starting balance)
  const [anthropicBudget, setAnthropicBudget] = useState(() => {
    try {
      const saved = localStorage.getItem('linacre_anthropic_budget_v1');
      return saved ? parseFloat(saved) : 100.0;
    } catch {
      return 100.0;
    }
  });

  const [anthropicSpent, setAnthropicSpent] = useState(() => {
    try {
      const saved = localStorage.getItem('linacre_anthropic_spent_v1');
      return saved ? parseFloat(saved) : 0.0;
    } catch {
      return 0.0;
    }
  });

  const [lastUsage, setLastUsage] = useState<{ input: number; output: number; cost: number } | null>(null);

  const recordAnthropicUsage = (inputTokens: number, outputTokens: number) => {
    const isHaiku = String(claudeModel).toLowerCase().includes('haiku');
    const inputRate = isHaiku ? 0.0000008 : 0.000003;
    const outputRate = isHaiku ? 0.000004 : 0.000015;
    const cost = (inputTokens * inputRate) + (outputTokens * outputRate);

    setAnthropicSpent(prev => {
      const next = prev + cost;
      try { localStorage.setItem('linacre_anthropic_spent_v1', next.toString()); } catch {}
      return next;
    });

    setLastUsage({ input: inputTokens, output: outputTokens, cost });
  };

  // prefers-reduced-motion hook (TASK-002)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const getAgentInfo = (agentKey: string) => {
    const spriteExt = prefersReducedMotion ? 'png' : 'gif';
    const folder = prefersReducedMotion ? 'gen5' : 'ani';
    switch (agentKey.toLowerCase()) {
      case 'architect':
        return {
          name: 'Lead Architect Mewtwo',
          role: 'Strategic Plan',
          gifUrl: `https://play.pokemonshowdown.com/sprites/${folder}/mewtwo.${spriteExt}`,
          bgColor: 'bg-[#c084fc]/5',
          borderColor: 'border-[#c084fc]/20',
          tagColor: 'bg-[#c084fc]/10 border-[#c084fc]/25 text-[#c084fc]'
        };
      case 'coder':
        return {
          name: 'Developer Porygon2',
          role: 'Implementation',
          gifUrl: `https://play.pokemonshowdown.com/sprites/${folder}/porygon2.${spriteExt}`,
          bgColor: 'bg-cyan/5',
          borderColor: 'border-cyan/20',
          tagColor: 'bg-cyan/10 border-cyan/25 text-cyan'
        };
      case 'security':
        return {
          name: 'Security Auditor Magnezone',
          role: 'Safety Audit',
          gifUrl: `https://play.pokemonshowdown.com/sprites/${folder}/magnezone.${spriteExt}`,
          bgColor: 'bg-[#34D399]/5',
          borderColor: 'border-[#34D399]/20',
          tagColor: 'bg-[#34D399]/10 border-[#34D399]/25 text-amber-color'
        };
      case 'devops':
        return {
          name: 'DevOps Rotom-Wash',
          role: 'Deployment & Wasm',
          gifUrl: `https://play.pokemonshowdown.com/sprites/${folder}/rotom-wash.${spriteExt}`,
          bgColor: 'bg-[#f87171]/5',
          borderColor: 'border-[#f87171]/20',
          tagColor: 'bg-[#f87171]/10 border-[#f87171]/25 text-rose-400'
        };
      default:
        return {
          name: 'Lead Orchestrator Mewtwo',
          role: 'Orchestration',
          gifUrl: `https://play.pokemonshowdown.com/sprites/${folder}/mewtwo.${spriteExt}`,
          bgColor: 'bg-[#0b0f19]/30 dark:bg-[#161b26]/30',
          borderColor: 'border-border-color/85',
          tagColor: 'bg-[#0f172a] border-border-color text-muted-foreground'
        };
    }
  };

  const parseAgentDialogue = (content: string) => {
    const regex = /\[(ARCHITECT|CODER|SECURITY|DEVOPS)\]/g;
    const parts = content.split(regex);
    if (parts.length <= 1) {
      return [{ agent: 'assistant', text: content }];
    }

    const dialogue: { agent: string; text: string }[] = [];
    let currentAgent = 'orchestrator';
    let currentText = parts[0];

    if (currentText.trim()) {
      dialogue.push({ agent: currentAgent, text: currentText });
    }

    for (let i = 1; i < parts.length; i += 2) {
      const agentName = parts[i].toLowerCase();
      const agentText = parts[i + 1] || '';
      dialogue.push({ agent: agentName, text: agentText });
    }

    return dialogue;
  };

  // Tab control for Sidebar: 'chats' or 'files'
  const [sidebarTab, setSidebarTab] = useState<'chats' | 'files'>('chats');

  // Main Column Tab: 'chat' | 'sql' | 'editor'
  const [mainTab, setMainTab] = useState<'chat' | 'sql' | 'editor'>('chat');

  // Hyperparameters
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topP, setTopP] = useState<number>(0.95);
  const [maxTokens, setMaxTokens] = useState<number>(2048);

  // SQL Sandbox States
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM projects;');
  const [sqlResult, setSqlResult] = useState<any[] | null>(null);
  const [sqlColumns, setSqlColumns] = useState<string[]>([]);
  const [sqlLatency, setSqlLatency] = useState<number | null>(null);
  const [sqlErr, setSqlErr] = useState<string | null>(null);
  const [sqlAffectedRows, setSqlAffectedRows] = useState<number | null>(null);

  // Virtual Filesystem States
  const [workspace, setWorkspace] = useState<WorkspaceItem[]>(() => {
    try {
      const saved = localStorage.getItem('linacre_lab_workspace_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load workspace', e);
    }
    return DEFAULT_WORKSPACE;
  });

  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [collapsedFolders, setCollapsedFolders] = useState<string[]>([]);
  const [editorSaveNotification, setEditorSaveNotification] = useState(false);

  // Creation States
  const [isCreateOpen, setIsCreateOpen] = useState<'file' | 'folder' | null>(null);
  const [createPathInput, setCreatePathInput] = useState('');
  const [createParentFolder, setCreateParentFolder] = useState('');

  // Save workspace to localStorage
  const saveWorkspace = (newWorkspace: WorkspaceItem[]) => {
    setWorkspace(newWorkspace);
    try {
      localStorage.setItem('linacre_lab_workspace_v1', JSON.stringify(newWorkspace));
    } catch (e) {
      console.error('Failed to save workspace', e);
    }
  };

  // Folder toggle open/close
  const handleToggleFolder = (folderPath: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (collapsedFolders.includes(folderPath)) {
      setCollapsedFolders(collapsedFolders.filter(p => p !== folderPath));
    } else {
      setCollapsedFolders([...collapsedFolders, folderPath]);
    }
  };

  const handleOpenFile = (file: WorkspaceItem) => {
    setActiveFileId(file.id);
    setEditorContent(file.content || '');
    setMainTab('editor');
  };

  const handleSaveFileContent = () => {
    if (!activeFileId) return;
    const updated = workspace.map(item =>
      item.id === activeFileId ? { ...item, content: editorContent } : item
    );
    saveWorkspace(updated);
    setEditorSaveNotification(true);
    setTimeout(() => setEditorSaveNotification(false), 2000);
  };

  const handleExecuteSQL = (queryText: string) => {
    setSqlErr(null);
    setSqlResult(null);
    setSqlColumns([]);
    setSqlLatency(null);
    setSqlAffectedRows(null);

    const startTime = performance.now();
    const cleanQuery = queryText.trim().replace(/;$/, '');

    try {
      if (!cleanQuery) {
        throw new Error('Query string is empty.');
      }

      // Check for INSERT INTO projects
      if (cleanQuery.toUpperCase().startsWith('INSERT INTO PROJECTS')) {
        const match = cleanQuery.match(/INSERT\s+INTO\s+projects\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
        if (!match) {
          throw new Error("Unsupported INSERT syntax. Use: INSERT INTO projects (name, category, description, url, host, tag) VALUES ('My Project', 'build', 'Tested from database console', 'https://github.com', 'github.com', 'Live');");
        }

        const cols = match[1].split(',').map(s => s.trim().toLowerCase());
        const rawVals = match[2].match(/'[^']*'|[^,]+/g) || [];
        const vals = rawVals.map(v => {
          const s = v.trim();
          if (s.startsWith("'") && s.endsWith("'")) {
            return s.slice(1, -1);
          }
          return s;
        });

        if (cols.length !== vals.length) {
          throw new Error(`Column count (${cols.length}) does not match value count (${vals.length}).`);
        }

        const newProject: any = {
          name: 'SQL Inserted Project',
          category: 'build',
          description: '',
          url: 'https://github.com',
          host: 'github.com',
          tag: 'Live'
        };

        cols.forEach((col, idx) => {
          newProject[col] = vals[idx];
        });

        let currentProjects = [];
        try {
          const saved = localStorage.getItem('linacre_custom_projects');
          if (saved) {
            currentProjects = JSON.parse(saved);
          } else {
            currentProjects = [
              { name: 'linacre.site', category: 'deploy', description: 'Terminal-styled toolkit + AI Lab', url: 'https://www.linacre.site', host: 'linacre.site', tag: 'Live' },
              { name: 'DKMA Monster', category: 'build', description: 'Android background-app survival toolkit', url: 'https://lin4cre.github.io/dkma-monster/', host: 'GitHub Pages', tag: 'Open Source' }
            ];
          }
        } catch {
          // ignore
        }

        if (currentProjects.some((p: any) => p.name.toLowerCase() === newProject.name.toLowerCase())) {
          throw new Error(`Duplicate key violation: Project "${newProject.name}" already exists.`);
        }

        const updated = [...currentProjects, newProject];
        localStorage.setItem('linacre_custom_projects', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));

        const latency = Math.round(performance.now() - startTime + Math.random() * 5);
        setSqlLatency(latency);
        setSqlAffectedRows(1);
        setSqlResult([{ status: "success", message: `INSERT 0 1: Project "${newProject.name}" added successfully. Check your Toolkit portfolio!` }]);
        setSqlColumns(["status", "message"]);
        return;
      }

      // Check for DELETE FROM projects
      if (cleanQuery.toUpperCase().startsWith('DELETE FROM PROJECTS')) {
        const whereMatch = cleanQuery.match(/WHERE\s+(\w+)\s*=\s*'([^']+)'/i);
        if (!whereMatch) {
          throw new Error("Unsupported DELETE syntax. Use: DELETE FROM projects WHERE name = 'ProjectName';");
        }

        const field = whereMatch[1].toLowerCase();
        const value = whereMatch[2];

        let currentProjects = [];
        try {
          const saved = localStorage.getItem('linacre_custom_projects');
          if (saved) {
            currentProjects = JSON.parse(saved);
          } else {
            currentProjects = [
              { name: 'linacre.site', category: 'deploy', description: 'Terminal-styled toolkit + AI Lab', url: 'https://www.linacre.site', host: 'linacre.site', tag: 'Live' },
              { name: 'DKMA Monster', category: 'build', description: 'Android background-app survival toolkit', url: 'https://lin4cre.github.io/dkma-monster/', host: 'GitHub Pages', tag: 'Open Source' }
            ];
          }
        } catch {
          // ignore
        }

        const initialLength = currentProjects.length;
        const updated = currentProjects.filter((p: any) => p[field]?.toLowerCase() !== value.toLowerCase());
        const deletedCount = initialLength - updated.length;

        localStorage.setItem('linacre_custom_projects', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));

        const latency = Math.round(performance.now() - startTime + Math.random() * 5);
        setSqlLatency(latency);
        setSqlAffectedRows(deletedCount);
        setSqlResult([{ status: "success", deleted_rows: deletedCount }]);
        setSqlColumns(["status", "deleted_rows"]);
        return;
      }

      // SELECT queries
      if (!cleanQuery.toUpperCase().startsWith('SELECT')) {
        throw new Error('Only SELECT, INSERT INTO projects, and DELETE FROM projects statement formats are simulated in this sandbox.');
      }

      let tableName = '';
      if (/from\s+projects/i.test(cleanQuery)) {
        tableName = 'projects';
      } else if (/from\s+users/i.test(cleanQuery)) {
        tableName = 'users';
      } else if (/from\s+api_logs/i.test(cleanQuery)) {
        tableName = 'api_logs';
      } else {
        throw new Error('Table not found. Supported playground tables are: projects, users, api_logs');
      }

      let rows: any[] = [];
      if (tableName === 'users') {
        rows = JSON.parse(JSON.stringify(MOCK_USERS));
      } else if (tableName === 'api_logs') {
        rows = JSON.parse(JSON.stringify(MOCK_API_LOGS));
      } else if (tableName === 'projects') {
        try {
          const saved = localStorage.getItem('linacre_custom_projects');
          if (saved) {
            rows = JSON.parse(saved);
          } else {
            rows = [
              { name: 'linacre.site', category: 'deploy', description: 'Terminal-styled toolkit + AI Lab', url: 'https://www.linacre.site', host: 'linacre.site', tag: 'Live' },
              { name: 'DKMA Monster', category: 'build', description: 'Android background-app survival toolkit', url: 'https://lin4cre.github.io/dkma-monster/', host: 'GitHub Pages', tag: 'Open Source' }
            ];
          }
        } catch {
          rows = [];
        }
      }

      // WHERE clause support
      const whereClause = cleanQuery.match(/where\s+([^order|limit|;]+)/i);
      if (whereClause) {
        const expression = whereClause[1].trim();
        const parts = expression.match(/(\w+)\s*(=|>|<|like)\s*(['"]?.*?['"]?)$/i) || expression.match(/(\w+)\s*(=|>|<|like)\s*(['"]?[^ ]+['"]?)/i);
        if (parts) {
          const col = parts[1].trim().toLowerCase();
          const op = parts[2].trim().toLowerCase();
          let val = parts[3].trim();
          if (val.startsWith("'") && val.endsWith("'")) {
            val = val.slice(1, -1);
          } else if (val.startsWith('"') && val.endsWith('"')) {
            val = val.slice(1, -1);
          }

          rows = rows.filter(row => {
            const rowVal = String(row[col] || '').toLowerCase();
            const targetVal = val.toLowerCase();
            if (op === '=') {
              return rowVal === targetVal;
            } else if (op === 'like') {
              return rowVal.includes(targetVal.replace(/%/g, ''));
            } else if (op === '>') {
              return parseFloat(rowVal) > parseFloat(targetVal);
            } else if (op === '<') {
              return parseFloat(rowVal) < parseFloat(targetVal);
            }
            return true;
          });
        }
      }

      // Projection
      let projection = '*';
      const selectMatch = cleanQuery.match(/select\s+(.*?)\s+from/i);
      if (selectMatch) {
        projection = selectMatch[1].trim();
      }

      let finalCols: string[] = [];
      let finalRows: any[] = [];

      if (projection === '*' || projection === 'all') {
        if (rows.length > 0) {
          finalCols = Object.keys(rows[0]);
          finalRows = rows;
        } else {
          if (tableName === 'users') finalCols = ['id', 'name', 'role', 'email', 'status', 'created_at'];
          else if (tableName === 'api_logs') finalCols = ['id', 'timestamp', 'endpoint', 'method', 'latency_ms', 'status', 'bytes_sent'];
          else finalCols = ['name', 'category', 'description', 'url', 'host', 'tag'];
          finalRows = [];
        }
      } else if (projection.toLowerCase() === 'count(*)' || projection.toLowerCase() === 'count(1)') {
        finalCols = ['count'];
        finalRows = [{ count: rows.length }];
      } else {
        const colsToProject = projection.split(',').map(s => s.trim().toLowerCase());
        finalCols = colsToProject;
        finalRows = rows.map(r => {
          const projected: any = {};
          colsToProject.forEach(col => {
            projected[col] = r[col] !== undefined ? r[col] : null;
          });
          return projected;
        });
      }

      // ORDER BY
      const orderByMatch = cleanQuery.match(/order\s+by\s+(\w+)(?:\s+(asc|desc))?/i);
      if (orderByMatch) {
        const col = orderByMatch[1].toLowerCase();
        const dir = (orderByMatch[2] || 'asc').toLowerCase();

        finalRows.sort((a, b) => {
          const aVal = a[col];
          const bVal = b[col];
          if (typeof aVal === 'number' && typeof bVal === 'number') {
            return dir === 'asc' ? aVal - bVal : bVal - aVal;
          }
          const aStr = String(aVal || '');
          const bStr = String(bVal || '');
          return dir === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
        });
      }

      // LIMIT
      const limitMatch = cleanQuery.match(/limit\s+(\d+)/i);
      if (limitMatch) {
        const lim = parseInt(limitMatch[1]);
        finalRows = finalRows.slice(0, lim);
      }

      const latency = Math.round(performance.now() - startTime + Math.random() * 5);
      setSqlLatency(latency);
      setSqlResult(finalRows);
      setSqlColumns(finalCols);
    } catch (err: any) {
      setSqlErr(err.message || 'Database query syntax error.');
    }
  };

  const handleDownloadCSV = () => {
    if (!sqlResult || sqlResult.length === 0) return;
    try {
      const headers = sqlColumns.join(',');
      const rows = sqlResult.map(row =>
        sqlColumns.map(col => {
          const val = row[col];
          const str = val === null || val === undefined ? '' : String(val);
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        }).join(',')
      );
      const csvContent = [headers, ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `sql_query_result_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Failed to export CSV', e);
    }
  };

  const handleDeleteItem = (item: WorkspaceItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const confirmMsg = item.type === 'folder'
      ? `Are you sure you want to delete folder "${item.name}" and all its contents?`
      : `Are you sure you want to delete file "${item.name}"?`;

    if (confirm(confirmMsg)) {
      let updated: WorkspaceItem[];
      if (item.type === 'folder') {
        updated = workspace.filter(i => i.path !== item.path && !i.path.startsWith(item.path + '/'));
      } else {
        updated = workspace.filter(i => i.id !== item.id);
      }
      saveWorkspace(updated);
      if (activeFileId === item.id) {
        setActiveFileId(null);
      }
    }
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createPathInput.trim()) return;

    let relativePath = createPathInput.trim();
    if (createParentFolder) {
      relativePath = `${createParentFolder}/${relativePath}`;
    }

    if (workspace.some(i => i.path.toLowerCase() === relativePath.toLowerCase())) {
      alert('An item with this path already exists.');
      return;
    }

    const name = relativePath.split('/').pop() || relativePath;

    if (isCreateOpen === 'file') {
      const newFile: WorkspaceItem = {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        path: relativePath,
        type: 'file',
        content: `// New file: ${name}\n\n`
      };

      const pathParts = relativePath.split('/');
      const newFolders: WorkspaceItem[] = [];
      let currentPath = '';
      for (let i = 0; i < pathParts.length - 1; i++) {
        currentPath = currentPath ? `${currentPath}/${pathParts[i]}` : pathParts[i];
        if (!workspace.some(item => item.path === currentPath)) {
          newFolders.push({
            id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: pathParts[i],
            path: currentPath,
            type: 'folder'
          });
        }
      }

      saveWorkspace([...workspace, ...newFolders, newFile]);
    } else {
      const newFolder: WorkspaceItem = {
        id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        path: relativePath,
        type: 'folder'
      };

      const pathParts = relativePath.split('/');
      const newFolders: WorkspaceItem[] = [];
      let currentPath = '';
      for (let i = 0; i < pathParts.length - 1; i++) {
        currentPath = currentPath ? `${currentPath}/${pathParts[i]}` : pathParts[i];
        if (!workspace.some(item => item.path === currentPath)) {
          newFolders.push({
            id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: pathParts[i],
            path: currentPath,
            type: 'folder'
          });
        }
      }

      saveWorkspace([...workspace, ...newFolders, newFolder]);
    }

    setCreatePathInput('');
    setIsCreateOpen(null);
    setCreateParentFolder('');
  };

  const handleAttachToPrompt = (item: WorkspaceItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const fileExt = item.name.split('.').pop() || 'text';
    const attachment = `\n\n### Attached File: \`${item.path}\`\n\`\`\`${fileExt}\n${item.content || ''}\n\`\`\`\n`;
    setInputPrompt(prev => prev + attachment);
    setSidebarTab('chats');
  };

  const handleDownloadFile = (item: WorkspaceItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const blob = new Blob([item.content || ''], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = item.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportWorkspace = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      workspace
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `linacre-lab-workspace-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportWorkspace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data && Array.isArray(data.workspace)) {
          saveWorkspace(data.workspace);
          alert('Workspace imported successfully!');
        } else if (Array.isArray(data)) {
          saveWorkspace(data);
          alert('Workspace imported successfully!');
        } else {
          alert('Invalid backup file format. Must contain workspace items.');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to parse backup file. Please ensure it is valid JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImportSingleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: WorkspaceItem[] = [];
    let processed = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (event) => {
        const text = event.target?.result as string;
        let filePath = file.name;
        if ((file as any).webkitRelativePath) {
          filePath = (file as any).webkitRelativePath;
        } else if (createParentFolder) {
          filePath = `${createParentFolder}/${file.name}`;
        }

        const name = file.name;

        const pathParts = filePath.split('/');
        let currentPath = '';
        for (let j = 0; j < pathParts.length - 1; j++) {
          currentPath = currentPath ? `${currentPath}/${pathParts[j]}` : pathParts[j];
          if (!workspace.some(item => item.path === currentPath) && !newItems.some(item => item.path === currentPath)) {
            newItems.push({
              id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: pathParts[j],
              path: currentPath,
              type: 'folder'
            });
          }
        }

        newItems.push({
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name,
          path: filePath,
          type: 'file',
          content: text || ''
        });

        processed++;
        if (processed === files.length) {
          const merged = [...workspace];
          newItems.forEach(item => {
            if (!merged.some(m => m.path === item.path)) {
              merged.push(item);
            }
          });
          saveWorkspace(merged);
          alert(`Imported ${files.length} file(s) successfully!`);
        }
      };

      reader.readAsText(file);
    }
    e.target.value = '';
  };

  // Configuration States (saved in localStorage)
  const [openaiKey, setOpenaiKey] = useState('');
  const [ollamaEndpoint, setOllamaEndpoint] = useState('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState('llama3.2');
  const [litellmEndpoint, setLiteLLMEndpoint] = useState('');
  const [litellmModel, setLiteLLMModel] = useState('');
  const [litellmKey, setLiteLLMKey] = useState('');
  const [claudeEndpoint, setClaudeEndpoint] = useState('');
  const [claudeModel, setClaudeModel] = useState('');
  const [claudeKey, setClaudeKey] = useState('');

  // Server-side environment key detection and local LLM scanner states
  const [serverKeys, setServerKeys] = useState<{
    gemini: boolean;
    openai: boolean;
    claude: boolean;
    litellm: boolean;
  }>({
    gemini: false,
    openai: false,
    claude: false,
    litellm: false
  });
  const [ollamaStatus, setOllamaStatus] = useState<'idle' | 'scanning' | 'online' | 'offline'>('idle');
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);
  const [litellmStatus, setLiteLLMStatus] = useState<'idle' | 'scanning' | 'online' | 'offline'>('idle');

  const fetchServerKeys = async () => {
    try {
      const res = await fetch('/api/keys/status');
      if (res.ok) {
        const data = await res.json();
        setServerKeys(data);
      }
    } catch (e) {
      console.error('Failed to fetch server keys status', e);
    }
  };

  const scanLocalServers = async (currentOllamaEndpoint = ollamaEndpoint, currentLiteLLMEndpoint = litellmEndpoint) => {
    setOllamaStatus('scanning');
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 1200);

      const res = await fetch(`${currentOllamaEndpoint || 'http://localhost:11434'}/api/tags`, {
        signal: controller.signal
      });
      clearTimeout(id);

      if (res.ok) {
        const data = await res.json();
        setOllamaStatus('online');
        if (data.models && Array.isArray(data.models)) {
          const names = data.models.map((m: any) => m.name);
          setOllamaModels(names);
          // Auto select first local model if not yet set
          if (names.length > 0 && (!ollamaModel || !names.includes(ollamaModel))) {
            setOllamaModel(names[0]);
            localStorage.setItem('linacre_ollama_model', names[0]);
          }
        }
      } else {
        setOllamaStatus('offline');
      }
    } catch (e) {
      setOllamaStatus('offline');
    }

    setLiteLLMStatus('scanning');
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 1200);

      const res = await fetch(currentLiteLLMEndpoint || 'http://localhost:4000/api/health', {
        signal: controller.signal
      });
      clearTimeout(id);

      if (res.ok) {
        setLiteLLMStatus('online');
      } else {
        setLiteLLMStatus('offline');
      }
    } catch (e) {
      setLiteLLMStatus('offline');
    }
  };

  // Status updates
  useEffect(() => {
    try {
      // SEC-01: Purge any legacy provider secrets left in Web Storage from
      // the pre-v4.6 build. Never re-read them into memory.
      const legacyKeyNames = ['linacre_openai_key', 'linacre_claude_key', 'linacre_litellm_key'];
      let purgedAny = false;
      for (const k of legacyKeyNames) {
        if (localStorage.getItem(k) !== null) { purgedAny = true; localStorage.removeItem(k); }
        if (sessionStorage.getItem(k) !== null) { purgedAny = true; sessionStorage.removeItem(k); }
      }
      if (purgedAny) {
        // Non-blocking notice — the UI will show inputs cleared, which is intentional.
        console.info('[linacre.site] Purged legacy provider API keys from browser storage. Please paste them again per tab (they are no longer persisted).');
      }

      const storedOllamaEnd = localStorage.getItem('linacre_ollama_endpoint') || 'http://localhost:11434';
      const storedOllamaMod = localStorage.getItem('linacre_ollama_model') || 'llama3.2';
      const storedLiteLLMEnd = localStorage.getItem('linacre_litellm_endpoint') || '';
      const storedLiteLLMMod = localStorage.getItem('linacre_litellm_model') || '';
      const storedClaudeEnd = localStorage.getItem('linacre_claude_endpoint') || '';
      const storedClaudeMod = localStorage.getItem('linacre_claude_model') || '';

      // Secrets: keep in React state only, never re-hydrate from storage.
      setOpenaiKey('');
      setOllamaEndpoint(storedOllamaEnd);
      setOllamaModel(storedOllamaMod);
      setLiteLLMEndpoint(storedLiteLLMEnd);
      setLiteLLMModel(storedLiteLLMMod);
      setLiteLLMKey('');
      setClaudeEndpoint(storedClaudeEnd);
      setClaudeModel(storedClaudeMod);
      setClaudeKey('');

      // Load sessions
      const storedSessions = localStorage.getItem('linacre_lab_sessions_v1');
      let parsedSessions: ChatSession[] = [];
      let activeId = '';

      if (storedSessions) {
        parsedSessions = JSON.parse(storedSessions);
        activeId = localStorage.getItem('linacre_lab_active_session_v1') || '';
        if (!activeId || !parsedSessions.some(s => s.id === activeId)) {
          activeId = parsedSessions[0]?.id || '';
        }
      }

      if (parsedSessions.length === 0) {
        const defaultSession: ChatSession = {
          id: 'session-default',
          title: 'Welcome Session',
          provider: 'gemini',
          timestamp: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
          messages: [
            {
              id: 'welcome',
              role: 'assistant',
              content: "Welcome to the Lab! I'm your **AI Dev Assistant**. \n\nBy default, I am powered by a secure server-side connection to **Gemini 3.5 Flash**—meaning you can chat with me immediately, zero API keys required from your side!\n\nIf you prefer to connect to OpenAI, a local Docker Ollama instance, a LiteLLM proxy, or a direct Claude proxy, open the configuration panel above to input your keys. Let's build something awesome!",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
        parsedSessions = [defaultSession];
        activeId = 'session-default';
        localStorage.setItem('linacre_lab_sessions_v1', JSON.stringify(parsedSessions));
        localStorage.setItem('linacre_lab_active_session_v1', activeId);
      }

      setSessions(parsedSessions);
      setActiveSessionId(activeId);

      const activeSess = parsedSessions.find(s => s.id === activeId);
      if (activeSess) {
        setMessages(activeSess.messages);
        setActiveProvider(activeSess.provider);
      }

      // Initial scanning
      fetchServerKeys();
      scanLocalServers(storedOllamaEnd, storedLiteLLMEnd);
    } catch (e) {
      console.error('Failed to load Lab configs', e);
    }
  }, []);

  // Save history to localStorage
  const saveSessionMessages = (sessionId: string, newMessages: ChatMessage[], newProvider?: LabProvider) => {
    setSessions(prev => {
      const updated = prev.map(s => {
        if (s.id === sessionId) {
          let title = s.title;
          if (title === 'New Chat' || title === 'Welcome Session') {
            const firstUserMsg = newMessages.find(m => m.role === 'user');
            if (firstUserMsg) {
              title = firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '');
            }
          }
          return {
            ...s,
            messages: newMessages,
            provider: newProvider || s.provider,
            title
          };
        }
        return s;
      });
      try {
        localStorage.setItem('linacre_lab_sessions_v1', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save Lab sessions', e);
      }
      return updated;
    });
    setMessages(newMessages);
  };

  const handleNewSession = () => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: 'New Chat',
      provider: activeProvider,
      timestamp: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
      messages: [
        {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          content: `This is a new **${activeProvider.toUpperCase()}** chat session. Let me know what you want to build or debug!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    setSessions(prev => {
      const updated = [...prev, newSession];
      localStorage.setItem('linacre_lab_sessions_v1', JSON.stringify(updated));
      return updated;
    });
    setActiveSessionId(newId);
    setMessages(newSession.messages);
    localStorage.setItem('linacre_lab_active_session_v1', newId);
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    localStorage.setItem('linacre_lab_active_session_v1', id);
    const sess = sessions.find(s => s.id === id);
    if (sess) {
      setMessages(sess.messages);
      setActiveProvider(sess.provider);
    }
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => {
      let updated = prev.filter(s => s.id !== id);
      if (updated.length === 0) {
        const defaultSession: ChatSession = {
          id: 'session-default',
          title: 'Welcome Session',
          provider: 'gemini',
          timestamp: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
          messages: [
            {
              id: 'welcome',
              role: 'assistant',
              content: "Welcome to the Lab! I'm your **AI Dev Assistant**...",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
        updated = [defaultSession];
      }
      localStorage.setItem('linacre_lab_sessions_v1', JSON.stringify(updated));

      if (activeSessionId === id) {
        const nextActive = updated[0].id;
        setActiveSessionId(nextActive);
        setMessages(updated[0].messages);
        setActiveProvider(updated[0].provider);
        localStorage.setItem('linacre_lab_active_session_v1', nextActive);
      }

      return updated;
    });
  };

  const handleSelectProvider = (prov: LabProvider) => {
    setActiveProvider(prov);
    setSessions(prev => {
      const updated = prev.map(s => {
        if (s.id === activeSessionId) {
          return { ...s, provider: prov };
        }
        return s;
      });
      localStorage.setItem('linacre_lab_sessions_v1', JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    const defaultMsg: ChatMessage[] = [
      {
        id: `clear-${Date.now()}`,
        role: 'assistant',
        content: "History cleared! Let me know if you want to write some code or optimize a PostgreSQL schema.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    saveSessionMessages(activeSessionId, defaultMsg);
  };

  // Scroll to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Save configuration handlers
  // SEC-01 (audit 11 Jul 2026): Never persist provider secrets. Any key
  // whose name looks like a credential is held in React state only. All
  // other config (endpoints, model names) can safely persist.
  const SENSITIVE_KEY_NAMES = new Set([
    'linacre_openai_key',
    'linacre_claude_key',
    'linacre_litellm_key',
  ]);
  const saveConfig = (key: string, value: string) => {
    if (SENSITIVE_KEY_NAMES.has(key)) return; // in-memory only
    try {
      localStorage.setItem(key, value);
    } catch (_) { /* private-mode / quota */ }
  };

  // Safe inline and block markdown formatter with code highlight block container (Fix S1: Whitelist https?:// only to avoid javascript: links)
  const formatMessageContent = (text: string) => {
    if (!text) return '';

    // Extract triple-backtick code blocks first to protect code contents from markup processors
    const codeBlocks: string[] = [];
    let processed = text;

    processed = processed.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      const idx = codeBlocks.length;
      const displayLang = lang || 'code';

      // Escape HTML inside code blocks
      const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      const isDark = theme === 'dark';
      const containerBg = isDark ? 'bg-black/35' : 'bg-[#f4f4f5] dark:bg-black/35';
      const headerBg = isDark ? 'bg-muted/40 dark:bg-[#161b26]' : 'bg-[#e4e4e7] dark:bg-[#161b26]';
      const textClass = isDark ? 'text-foreground/90' : 'text-[#171717] dark:text-foreground/90';

      const codeHtml = `
        <div class="my-3 border border-border-color rounded-lg overflow-hidden ${containerBg} font-mono text-xs select-text">
          <div class="flex items-center justify-between px-3.5 py-1.5 ${headerBg} border-b border-border-color text-[10px] text-muted-foreground select-none">
            <span class="font-bold uppercase tracking-wider text-amber-color/95">${displayLang}</span>
            <span>// code snippet</span>
          </div>
          <pre class="p-3.5 overflow-x-auto leading-relaxed ${textClass} select-text font-mono"><code class="font-mono select-text">${escapedCode.trim()}</code></pre>
        </div>
      `;
      codeBlocks.push(codeHtml);
      return `___CODE_BLOCK_${idx}___`;
    });

    // Escape standard HTML for non-code block elements to secure against injection vectors
    processed = processed
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    // Bold tags
    processed = processed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic tags
    processed = processed.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Inline Code snippets
    processed = processed.replace(/`([^`]+)`/g, '<code class="font-mono bg-muted/70 text-cyan px-1.5 py-0.5 rounded text-[11px] font-medium">$1</code>');

    // Anchor tags with Strict Whitelist for http/https (Fix S1)
    processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, linkText, url) => {
      const trimmedUrl = url.trim();
      if (/^https?:\/\//i.test(trimmedUrl)) {
        return `<a href="${trimmedUrl}" target="_blank" rel="noopener noreferrer" class="text-cyan underline hover:text-amber-color transition-colors font-medium">${linkText}</a>`;
      }
      return linkText;
    });

    // Reinsert code blocks
    codeBlocks.forEach((blockHtml, idx) => {
      processed = processed.replace(`___CODE_BLOCK_${idx}___`, blockHtml);
    });

    // Bullet points conversion
    processed = processed.split('\n').map(line => {
      if (line.trim().startsWith('- ')) {
        return `<li class="ml-4 list-disc my-1 text-xs sm:text-sm text-foreground/85">${line.trim().slice(2)}</li>`;
      }
      return line;
    }).join('\n');

    // Join lines by breaking them
    return processed.split('\n').join('<br />');
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
  };

  const handleExportChat = () => {
    if (messages.length === 0) return;

    let mdContent = `# David Linacre AI Lab - Chat Export\n`;
    mdContent += `*Exported on: ${new Date().toLocaleString()}*\n`;
    mdContent += `*Provider: ${activeProvider}*\n\n---\n\n`;

    messages.forEach((msg) => {
      const roleName = msg.role === 'user' ? 'User (David)' : 'AI Dev Assistant';
      mdContent += `### **${roleName}** *[${msg.timestamp}]*\n\n${msg.content}\n\n---\n\n`;
    });

    try {
      const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `linacre-ai-chat-${Date.now()}.md`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Failed to export chat', e);
    }
  };

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim() || isGenerating) return;

    setErrorText(null);
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    saveSessionMessages(activeSessionId, updatedMessages);
    setInputPrompt('');
    setIsGenerating(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const finalPromptText = teamMode
      ? `You are a collaborative team of specialized AI agents. You must answer the following request by coordinating with each other:
"${promptText}"

Please present the answer as a structured dialogue between these agents, using the exact delimiters below:
[ARCHITECT] for the Lead Architect Mewtwo (plans and outlines the response)
[CODER] for the Developer Porygon2 (writes the code, markup, or detailed implementation)
[SECURITY] for the Security Auditor Magnezone (audits variables, script tags, dependencies, and performance)
[DEVOPS] for the DevOps Specialist Rotom-Wash (finalizes environment, compilation, and deploy steps)

You do not need to use all agents if the task is simple, but at least two should collaborate. Output their dialogue sequentially using the bracketed delimiters.`
      : promptText;

    const payloadMessages = updatedMessages.map((m, idx) => {
      if (idx === updatedMessages.length - 1) {
        return { role: m.role, content: finalPromptText };
      }
      return { role: m.role, content: m.content };
    });

    // Placeholder assistant message
    const assistantMsgId = `msg-${Date.now()}-assistant`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...updatedMessages, initialAssistantMsg]);

    let assistantContent = '';

    try {
      if (activeProvider === 'gemini') {
        const response = await fetch('/api/chat/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: finalPromptText, history: updatedMessages.slice(0, -1) }),
          signal: controller.signal
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Server returned error status ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("Stream is not readable.");

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          let boundary = buffer.indexOf('\n\n');
          while (boundary !== -1) {
            const block = buffer.slice(0, boundary);
            buffer = buffer.slice(boundary + 2);

            const lines = block.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.slice(6).trim();
                if (dataStr === '[DONE]') {
                  break;
                }
                let parsed;
                try {
                  parsed = JSON.parse(dataStr);
                } catch (e) {
                  // Partial JSON, await next buffers
                  continue;
                }
                if (parsed.error) {
                  throw new Error(parsed.error);
                }
                if (parsed.text) {
                  assistantContent += parsed.text;
                  setMessages(prev =>
                    prev.map(m => m.id === assistantMsgId ? { ...m, content: assistantContent } : m)
                  );
                }
              }
            }
            boundary = buffer.indexOf('\n\n');
          }
        }

      } else if (activeProvider === 'openai') {
        if (!openaiKey && !serverKeys.openai) {
          throw new Error('OpenAI API key is missing. Please expand the configuration panel and provide a key, or define OPENAI_API_KEY in your server environment.');
        }

        const response = await fetch('/api/chat/openai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: finalPromptText,
            history: updatedMessages.slice(0, -1),
            apiKey: openaiKey
          }),
          signal: controller.signal
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `OpenAI proxy returned status ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("Stream is not readable.");

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          let boundary = buffer.indexOf('\n\n');
          while (boundary !== -1) {
            const block = buffer.slice(0, boundary);
            buffer = buffer.slice(boundary + 2);

            const lines = block.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.slice(6).trim();
                if (dataStr === '[DONE]') break;

                let parsed;
                try {
                  parsed = JSON.parse(dataStr);
                } catch (e) {
                  // Partial JSON, await next buffers
                  continue;
                }
                if (parsed.error) {
                  throw new Error(parsed.error);
                }
                const text = parsed.choices?.[0]?.delta?.content;
                if (text) {
                  assistantContent += text;
                  setMessages(prev =>
                    prev.map(m => m.id === assistantMsgId ? { ...m, content: assistantContent } : m)
                  );
                }
              }
            }
            boundary = buffer.indexOf('\n\n');
          }
        }

      } else if (activeProvider === 'claude' && !claudeEndpoint) {
        if (!claudeKey && !serverKeys.claude) {
          throw new Error('Claude API key is missing. Please expand the configuration panel and provide a key, or define ANTHROPIC_API_KEY in your server environment.');
        }

        const response = await fetch('/api/chat/claude', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: finalPromptText,
            history: updatedMessages.slice(0, -1),
            apiKey: claudeKey
          }),
          signal: controller.signal
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Claude proxy returned status ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("Stream is not readable.");

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          let boundary = buffer.indexOf('\n\n');
          while (boundary !== -1) {
            const block = buffer.slice(0, boundary);
            buffer = buffer.slice(boundary + 2);

            const lines = block.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.slice(6).trim();
                if (dataStr === '[DONE]') break;

                let parsed;
                try {
                  parsed = JSON.parse(dataStr);
                } catch (e) {
                  // Partial JSON, await next buffers
                  continue;
                }
                if (parsed.error) {
                  throw new Error(parsed.error);
                }
                const text = parsed.choices?.[0]?.delta?.content;
                if (text) {
                  assistantContent += text;
                  setMessages(prev =>
                    prev.map(m => m.id === assistantMsgId ? { ...m, content: assistantContent } : m)
                  );
                }
              }
            }
            boundary = buffer.indexOf('\n\n');
          }
        }

      } else {
        // Ollama, LiteLLM, or Claude proxy calls
        let endpoint = '';
        let model = '';
        let key = '';

        if (activeProvider === 'ollama') {
          endpoint = ollamaEndpoint;
          model = ollamaModel;
        } else if (activeProvider === 'litellm') {
          endpoint = litellmEndpoint;
          model = litellmModel;
          key = litellmKey;
        } else if (activeProvider === 'claude') {
          endpoint = claudeEndpoint;
          model = claudeModel;
          key = claudeKey;
        }

        if (!endpoint) {
          throw new Error(`${activeProvider.toUpperCase()} endpoint URL is missing. Please configure it above.`);
        }

        const isOllama = activeProvider === 'ollama';
        const url = isOllama ? `${endpoint}/api/chat` : `${endpoint}/v1/chat/completions`;

        const requestBody = isOllama
          ? {
              model,
              messages: payloadMessages,
              stream: true
            }
          : {
              model,
              messages: payloadMessages,
              stream: true
            };

        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (key) headers['Authorization'] = `Bearer ${key}`;

        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`${activeProvider.toUpperCase()} server returned error status ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("Stream is not readable.");

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          if (isOllama) {
            // Ollama splits by single newline
            let boundary = buffer.indexOf('\n');
            while (boundary !== -1) {
              const line = buffer.slice(0, boundary).trim();
              buffer = buffer.slice(boundary + 1);

              if (line) {
                let parsed;
                try {
                  parsed = JSON.parse(line);
                } catch (e) {
                  // Partial JSON, await next buffers
                  continue;
                }
                if (parsed.error) {
                  throw new Error(parsed.error);
                }
                const text = parsed.message?.content || parsed.response;
                if (text) {
                  assistantContent += text;
                  setMessages(prev =>
                    prev.map(m => m.id === assistantMsgId ? { ...m, content: assistantContent } : m)
                  );
                }
              }
              boundary = buffer.indexOf('\n');
            }
          } else {
            // OpenAI/LiteLLM standard SSE
            let boundary = buffer.indexOf('\n\n');
            while (boundary !== -1) {
              const block = buffer.slice(0, boundary);
              buffer = buffer.slice(boundary + 2);

              const lines = block.split('\n');
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const dataStr = line.slice(6).trim();
                  if (dataStr === '[DONE]') break;

                  let parsed;
                  try {
                    parsed = JSON.parse(dataStr);
                  } catch (e) {
                    // Partial JSON, await next buffers
                    continue;
                  }
                  if (parsed.error) {
                    throw new Error(parsed.error);
                  }
                  const text = parsed.choices?.[0]?.delta?.content;
                  if (text) {
                    assistantContent += text;
                    setMessages(prev =>
                      prev.map(m => m.id === assistantMsgId ? { ...m, content: assistantContent } : m)
                    );
                  }
                }
              }
              boundary = buffer.indexOf('\n\n');
            }
          }
        }
      }

      // Final save
      const finalContent = assistantContent || "Sorry, I received an empty response from the provider.";
      const finalMsgList = [...updatedMessages, {
        id: assistantMsgId,
        role: 'assistant' as const,
        content: finalContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }];
      saveSessionMessages(activeSessionId, finalMsgList);

    } catch (err: any) {
      if (err.name === 'AbortError') {
        const finalMsgList = [...updatedMessages, {
          id: assistantMsgId,
          role: 'assistant' as const,
          content: assistantContent + "\n\n*[Generation stopped by user]*",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }];
        saveSessionMessages(activeSessionId, finalMsgList);
      } else {
        console.error(err);
        setErrorText(err.message || 'Connection failed. Please verify your endpoints and keys.');
        // Remove empty bubble on real error and save
        saveSessionMessages(activeSessionId, updatedMessages);
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const quickPrompts = [
    '⚡ Audit this TypeScript code for security vulnerabilities, memory leaks, and speed optimizations',
    '🗄️ Design a production PostgreSQL schema for a multi-tenant SaaS app with foreign keys and indexes',
    '🔍 Build a RegEx to validate ISO timestamps, UUID v4, and email domains with explanation',
    '📜 Generate an OpenAPI 3.0 YAML specification for a REST API authentication server',
    'Explain Docker Compose in simple terms',
    'Explain the benefits of Tailwind CSS v4'
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <section className="space-y-2" id="lab-hero">
        <span className="font-mono text-xs text-amber-color tracking-widest uppercase font-semibold flex items-center gap-1.5">
          <Cpu className="w-4 h-4 animate-pulse" />
          <span>Lab / Interactive Sandbox</span>
        </span>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          AI Dev Assistant
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
          Connect your choice of AI: Chat with <strong className="text-amber-color">Gemini</strong> securely out of the box, or input keys for OpenAI, a local Docker <strong className="text-foreground">Ollama</strong> instance, LiteLLM, or Claude.
        </p>
      </section>

      {/* Linacre Tool Box — callable over MCP */}
      <McpToolboxCallout blurb="Chatting with a model here? The same private utilities are callable directly by your AI over MCP — add the Linacre Tool Box to Claude, Cursor or any MCP client." />

      {/* Config Toggle Pane */}
      <div className="border border-border-color rounded-xl overflow-hidden bg-muted/15 dark:bg-[#081c28]/40 transition-all duration-300">
        <div className="w-full flex items-center justify-between px-5 py-3 text-sm font-mono border-b border-border-color/40 bg-muted/10">
          <button
            onClick={() => setConfigOpen(!configOpen)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all focus:outline-none text-left"
          >
            <Settings className="w-4 h-4 text-cyan" />
            <span>AI Provider Configurations</span>
            {configOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                fetchServerKeys();
                scanLocalServers();
              }}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-cyan/15 hover:bg-cyan/25 text-cyan text-[10px] uppercase tracking-wider font-semibold border border-cyan/30 cursor-pointer select-none transition-all"
              title="Force Scan Live Servers & Environment Keys"
            >
              <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
              <span>Scan & Sync</span>
            </button>
            <span className="text-xs text-muted-foreground/60 hidden sm:inline-block">
              {activeProvider === 'gemini' ? 'gemini · Server Route active' : `${activeProvider} · config active`}
            </span>
          </div>
        </div>

        <AnimatePresence>
          {configOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-5 space-y-4"
              id="lab-config-panel"
            >
              {/* Provider Selection Tabs with dynamic pulsing live badges */}
              <div className="flex flex-wrap gap-1.5 border-b border-border-color/50 pb-4">
                {(['gemini', 'openai', 'ollama', 'litellm', 'claude'] as const).map((prov) => {
                  let badge = null;
                  if (prov === 'gemini') {
                    badge = <span className="inline-block w-2 h-2 rounded-full bg-emerald-color animate-pulse" title="Server Connection Ready" />;
                  } else if (prov === 'openai' && serverKeys.openai) {
                    badge = <span className="inline-block w-2 h-2 rounded-full bg-emerald-color animate-pulse" title="Seamless Environment Key Detected" />;
                  } else if (prov === 'claude' && serverKeys.claude) {
                    badge = <span className="inline-block w-2 h-2 rounded-full bg-emerald-color animate-pulse" title="Seamless Environment Key Detected" />;
                  } else if (prov === 'ollama') {
                    if (ollamaStatus === 'online') {
                      badge = <span className="inline-block w-2 h-2 rounded-full bg-emerald-color animate-pulse" title="Local Server Live & Connected" />;
                    } else if (ollamaStatus === 'scanning') {
                      badge = <span className="inline-block w-2 h-2 rounded-full bg-amber-color animate-pulse" title="Scanning localhost:11434..." />;
                    } else {
                      badge = <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground/30" title="Offline" />;
                    }
                  } else if (prov === 'litellm') {
                    if (litellmStatus === 'online') {
                      badge = <span className="inline-block w-2 h-2 rounded-full bg-emerald-color animate-pulse" title="Local Server Live & Connected" />;
                    } else if (litellmStatus === 'scanning') {
                      badge = <span className="inline-block w-2 h-2 rounded-full bg-amber-color animate-pulse" title="Scanning localhost:4000..." />;
                    } else {
                      badge = <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground/30" title="Offline" />;
                    }
                  }

                  return (
                    <button
                      key={prov}
                      onClick={() => handleSelectProvider(prov)}
                      className={`px-3 py-1.5 font-mono text-xs rounded-md border transition-all cursor-pointer flex items-center gap-2 ${
                        activeProvider === prov
                          ? 'bg-cyan/10 border-cyan text-cyan font-medium'
                          : 'bg-background/40 border-border-color/60 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span>{prov === 'gemini' ? 'Gemini (Free Server)' : prov.toUpperCase()}</span>
                      {badge}
                    </button>
                  );
                })}
              </div>

              {/* Sub Panels */}
              <div className="space-y-4 text-sm font-mono" id="provider-config-details">
                {activeProvider === 'gemini' && (
                  <div className="text-xs text-muted-foreground space-y-2 bg-muted/20 dark:bg-muted/10 p-4 rounded-lg border border-border-color/40">
                    <div className="flex items-center gap-1.5 text-emerald-color font-medium">
                      <CheckCircle className="w-4 h-4 animate-pulse" />
                      <span>Server-Side Gemini Ready!</span>
                    </div>
                    <p>
                      Your calls are proxied securely through the local backend. No key inputs or configuration is needed from the client! This is fully secure, private, and fast.
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                      <Lock className="w-3 h-3 text-cyan" />
                      <span>API secrets stay server-side inside process.env.GEMINI_API_KEY</span>
                    </div>
                  </div>
                )}

                {activeProvider === 'openai' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-muted-foreground">OpenAI Secret Key</label>
                      {serverKeys.openai ? (
                        <span className="text-[10px] text-emerald-color font-bold px-2 py-0.5 rounded bg-emerald-color/10 border border-emerald-color/20 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-color animate-ping" />
                          <span>Seamless Environment Key Active</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground/60">Using Client Key</span>
                      )}
                    </div>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <input
                        type="password"
                        placeholder={serverKeys.openai ? "•••••••••••••••• (Using Server Key)" : "sk-..."}
                        value={openaiKey}
                        onChange={(e) => {
                          setOpenaiKey(e.target.value);
                          saveConfig('linacre_openai_key', e.target.value);
                        }}
                        className="w-full bg-background border border-border-color rounded-lg py-2 pl-10 pr-4 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-cyan"
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
                      <Info className="w-3 h-3 text-cyan" />
                      {serverKeys.openai
                        ? "Since an OPENAI_API_KEY was found in your server environment, you can leave this field blank and it will work seamlessly!"
                        : "Keys stay in memory for this tab only — never written to browser storage, never sent to linacre.site servers. Paste again if you refresh."
                      }
                    </span>
                  </div>
                )}

                {activeProvider === 'ollama' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-semibold text-muted-foreground">Ollama Endpoint</label>
                          {ollamaStatus === 'online' ? (
                            <span className="text-[9px] text-emerald-color font-bold uppercase tracking-wider flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-color animate-ping" />
                              <span>Live</span>
                            </span>
                          ) : ollamaStatus === 'scanning' ? (
                            <span className="text-[9px] text-amber-color font-bold uppercase tracking-wider animate-pulse">
                              Scanning...
                            </span>
                          ) : (
                            <span className="text-[9px] text-red/60 font-bold uppercase tracking-wider">
                              Offline
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="http://localhost:11434"
                          value={ollamaEndpoint}
                          onChange={(e) => {
                            setOllamaEndpoint(e.target.value);
                            saveConfig('linacre_ollama_endpoint', e.target.value);
                            scanLocalServers(e.target.value, litellmEndpoint);
                          }}
                          className="w-full bg-background border border-border-color rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-cyan"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-muted-foreground flex justify-between items-center">
                          <span>Model Name</span>
                          {ollamaStatus === 'online' && ollamaModels.length > 0 && (
                            <span className="text-[9px] text-emerald-color font-bold uppercase tracking-wider">
                              {ollamaModels.length} detected
                            </span>
                          )}
                        </label>
                        {ollamaStatus === 'online' && ollamaModels.length > 0 ? (
                          <select
                            value={ollamaModel}
                            onChange={(e) => {
                              setOllamaModel(e.target.value);
                              saveConfig('linacre_ollama_model', e.target.value);
                            }}
                            className="w-full bg-background border border-border-color rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-cyan cursor-pointer"
                          >
                            {ollamaModels.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            placeholder="llama3.2"
                            value={ollamaModel}
                            onChange={(e) => {
                              setOllamaModel(e.target.value);
                              saveConfig('linacre_ollama_model', e.target.value);
                            }}
                            className="w-full bg-background border border-border-color rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-cyan"
                          />
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-cyan" />
                      <span>
                        {ollamaStatus === 'online'
                          ? "Success! Connected to local Ollama. We've automatically fetched your active models."
                          : "Make sure Ollama is running locally on your computer with 'ollama serve' and CORS headers are allowed."
                        }
                      </span>
                    </span>
                  </div>
                )}

                {activeProvider === 'litellm' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-semibold text-muted-foreground">LiteLLM Endpoint URL</label>
                          {litellmStatus === 'online' ? (
                            <span className="text-[9px] text-emerald-color font-bold uppercase tracking-wider flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-color animate-ping" />
                              <span>Connected</span>
                            </span>
                          ) : (
                            <span className="text-[9px] text-muted-foreground/60">Offline</span>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="http://localhost:4000"
                          value={litellmEndpoint}
                          onChange={(e) => {
                            setLiteLLMEndpoint(e.target.value);
                            saveConfig('linacre_litellm_endpoint', e.target.value);
                            scanLocalServers(ollamaEndpoint, e.target.value);
                          }}
                          className="w-full bg-background border border-border-color rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-cyan"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-muted-foreground">LiteLLM Model Name</label>
                        <input
                          type="text"
                          placeholder="gpt-3.5-turbo"
                          value={litellmModel}
                          onChange={(e) => {
                            setLiteLLMModel(e.target.value);
                            saveConfig('linacre_litellm_model', e.target.value);
                          }}
                          className="w-full bg-background border border-border-color rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-cyan"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-muted-foreground">LiteLLM API Key (Optional)</label>
                      <input
                        type="password"
                        placeholder="Enter custom proxy key"
                        value={litellmKey}
                        onChange={(e) => {
                          setLiteLLMKey(e.target.value);
                          saveConfig('linacre_litellm_key', e.target.value);
                        }}
                        className="w-full bg-background border border-border-color rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-cyan"
                      />
                    </div>
                  </div>
                )}

                {activeProvider === 'claude' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-muted-foreground">Claude Proxy Endpoint</label>
                        <input
                          type="text"
                          placeholder="Optional (falls back to server proxy)"
                          value={claudeEndpoint}
                          onChange={(e) => {
                            setClaudeEndpoint(e.target.value);
                            saveConfig('linacre_claude_endpoint', e.target.value);
                          }}
                          className="w-full bg-background border border-border-color rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-cyan"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-muted-foreground">Claude Model Name</label>
                        <input
                          type="text"
                          placeholder="claude-3-5-sonnet-latest"
                          value={claudeModel}
                          onChange={(e) => {
                            setClaudeModel(e.target.value);
                            saveConfig('linacre_claude_model', e.target.value);
                          }}
                          className="w-full bg-background border border-border-color rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-cyan"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold text-muted-foreground">Claude API Key</label>
                        {serverKeys.claude ? (
                          <span className="text-[10px] text-emerald-color font-bold px-2 py-0.5 rounded bg-emerald-color/10 border border-emerald-color/20 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-color animate-ping" />
                            <span>Seamless Environment Key Active</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/60">Using Client Key</span>
                        )}
                      </div>
                      <input
                        type="password"
                        placeholder={serverKeys.claude ? "•••••••••••••••• (Using Server Key)" : "sk-ant-..."}
                        value={claudeKey}
                        onChange={(e) => {
                          setClaudeKey(e.target.value);
                          saveConfig('linacre_claude_key', e.target.value);
                        }}
                        className="w-full bg-background border border-border-color rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-cyan"
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-cyan" />
                      <span>
                        {serverKeys.claude
                          ? 'Anthropic Fable 5 & Claude 3.5 Sonnet server keys active and ready.'
                          : 'Enter your custom Anthropic API key to enable live Claude 3.5 Sonnet / Fable 5.'}
                      </span>
                    </span>

                    {/* LIVE ANTHROPIC $100 CREDIT GAUGE */}
                    <div className="p-3 bg-[#031018] rounded-xl border border-amber-color/30 space-y-2 mt-2">
                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className="text-amber-color font-bold flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Anthropic $100 Live Credit Gauge</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground">Real-Time USD Precision</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center font-mono py-1">
                        <div className="bg-muted/20 p-2 rounded-lg border border-border-color/40">
                          <div className="text-[9px] text-muted-foreground uppercase">Starting Budget</div>
                          <div className="text-xs font-bold text-foreground">${anthropicBudget.toFixed(2)}</div>
                        </div>
                        <div className="bg-muted/20 p-2 rounded-lg border border-border-color/40">
                          <div className="text-[9px] text-muted-foreground uppercase">Total USD Spent</div>
                          <div className="text-xs font-bold text-rose-400">${anthropicSpent.toFixed(5)}</div>
                        </div>
                        <div className="bg-muted/20 p-2 rounded-lg border border-border-color/40">
                          <div className="text-[9px] text-muted-foreground uppercase">Remaining Credit</div>
                          <div className="text-xs font-bold text-emerald-color">${Math.max(0, anthropicBudget - anthropicSpent).toFixed(5)}</div>
                        </div>
                      </div>

                      {/* Visual Credit Bar */}
                      <div className="w-full bg-muted/40 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-color h-full transition-all duration-300"
                          style={{ width: `${Math.max(0, Math.min(100, ((anthropicBudget - anthropicSpent) / anthropicBudget) * 100))}%` }}
                        />
                      </div>

                      {lastUsage ? (
                        <div className="text-[10px] text-cyan font-mono flex items-center justify-between border-t border-border-color/30 pt-1.5">
                          <span>Last Query: {lastUsage.input} in / {lastUsage.output} out</span>
                          <span className="font-bold text-amber-color">+${lastUsage.cost.toFixed(5)}</span>
                        </div>
                      ) : (
                        <div className="text-[9px] text-muted-foreground/60 text-center font-mono pt-1">
                          No Claude requests sent in current session yet
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* Model Hyperparameters Adjustment Sliders */}
                <div className="pt-4 border-t border-border-color/40 grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
                  <div className="space-y-1.5 bg-background/50 p-3 rounded-lg border border-border-color/40">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-color shrink-0" />
                        <span>Temperature</span>
                      </span>
                      <span className="text-amber-color font-bold text-xs">{temperature.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-muted/40 rounded-lg appearance-none cursor-pointer accent-amber-color"
                    />
                    <div className="flex justify-between text-[9px] text-muted-foreground/60">
                      <span>0.0 (Precise)</span>
                      <span>1.0 (Creative)</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-background/50 p-3 rounded-lg border border-border-color/40">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                        <Settings className="w-3.5 h-3.5 text-cyan shrink-0" />
                        <span>Top P Sampling</span>
                      </span>
                      <span className="text-cyan font-bold text-xs">{topP.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={topP}
                      onChange={(e) => setTopP(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-muted/40 rounded-lg appearance-none cursor-pointer accent-cyan"
                    />
                    <div className="flex justify-between text-[9px] text-muted-foreground/60">
                      <span>0.0 (Focused)</span>
                      <span>1.0 (Diverse)</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-background/50 p-3 rounded-lg border border-border-color/40">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-emerald-color shrink-0" />
                        <span>Max Tokens</span>
                      </span>
                      <span className="text-emerald-color font-bold text-xs">{maxTokens}</span>
                    </div>
                    <input
                      type="range"
                      min="256"
                      max="8192"
                      step="256"
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-muted/40 rounded-lg appearance-none cursor-pointer accent-emerald-color"
                    />
                    <div className="flex justify-between text-[9px] text-muted-foreground/60">
                      <span>256 (Short)</span>
                      <span>8192 (Long)</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Split layout: Sidebar for conversations + Main Terminal Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" id="lab-terminal-split">
        {/* Left column: Sessions list sidebar */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <div className="border border-border-color bg-muted/5 dark:bg-[#081c28]/40 rounded-xl p-4 flex flex-col h-full">
            {/* Tab switchers */}
            <div className="flex border-b border-border-color/40 pb-2.5 mb-3 shrink-0">
              <button
                onClick={() => setSidebarTab('chats')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                  sidebarTab === 'chats'
                    ? 'bg-amber-color/10 border border-amber-color/30 text-amber-color shadow-sm'
                    : 'border border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chats</span>
              </button>
              <button
                onClick={() => setSidebarTab('files')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                  sidebarTab === 'files'
                    ? 'bg-cyan/10 border border-cyan/30 text-cyan shadow-sm'
                    : 'border border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Workspace</span>
              </button>
            </div>

            {sidebarTab === 'chats' ? (
              <div className="flex flex-col space-y-4 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan" />
                    <span>Conversations</span>
                  </span>
                  <button
                    onClick={handleNewSession}
                    className="p-1 rounded hover:bg-amber-color/10 text-amber-color hover:text-amber-color/90 transition-colors border border-amber-color/20 bg-amber-color/5 flex items-center justify-center cursor-pointer"
                    title="Start a new chat thread"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* List of sessions */}
                <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 lg:gap-0 lg:space-y-2 pb-2 lg:pb-0 scrollbar-thin lg:max-h-[360px] lg:overflow-y-auto">
                  {sessions.map((sess) => {
                    const isActive = sess.id === activeSessionId;
                    return (
                      <div
                        key={sess.id}
                        onClick={() => handleSelectSession(sess.id)}
                        className={`w-40 lg:w-full shrink-0 text-left px-3 py-2 rounded-lg border text-xs font-mono transition-all flex items-center justify-between group cursor-pointer select-none ${
                          isActive
                            ? 'bg-amber-color/10 border-amber-color/30 text-foreground shadow-sm'
                            : 'bg-background/40 border-border-color/60 text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                        }`}
                      >
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-bold truncate pr-1">{sess.title}</span>
                          <span className="text-[9px] opacity-60 mt-0.5">{sess.provider.toUpperCase()} · {sess.timestamp}</span>
                        </div>

                        <button
                          onClick={(e) => handleDeleteSession(sess.id, e)}
                          className="p-1 hover:text-rose-400 rounded text-muted-foreground/30 hover:bg-rose-500/10 cursor-pointer select-none transition-colors ml-1"
                          title="Delete Session"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 flex-1 min-h-0 select-none">
                {/* Action buttons */}
                <div className="flex items-center justify-between gap-1 border-b border-border-color/30 pb-2 shrink-0">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    Virtual Files
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setCreateParentFolder('');
                        setIsCreateOpen('file');
                      }}
                      className="p-1 rounded border border-border-color bg-muted/20 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      title="Create File"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setCreateParentFolder('');
                        setIsCreateOpen('folder');
                      }}
                      className="p-1 rounded border border-border-color bg-muted/20 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      title="Create Folder"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                    </button>

                    <div className="w-px h-4 bg-border-color/60 mx-1" />

                    {/* Import / Upload drop buttons */}
                    <label className="p-1 rounded border border-border-color bg-muted/20 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title="Upload Files">
                      <Upload className="w-3.5 h-3.5 text-cyan" />
                      <input
                        type="file"
                        multiple
                        onChange={handleImportSingleFiles}
                        className="hidden"
                      />
                    </label>

                    <label className="p-1 rounded border border-border-color bg-muted/20 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title="Upload Folder Structure">
                      <Folder className="w-3.5 h-3.5 text-amber-color" />
                      <input
                        type="file"
                        multiple
                        onChange={handleImportSingleFiles}
                        className="hidden"
                        {...{ webkitdirectory: "", directory: "" }}
                      />
                    </label>

                    <label className="p-1 rounded border border-border-color bg-muted/20 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title="Import Workspace JSON Backup">
                      <Key className="w-3.5 h-3.5 text-rose-400" />
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportWorkspace}
                        className="hidden"
                      />
                    </label>

                    <button
                      onClick={handleExportWorkspace}
                      className="p-1 rounded border border-border-color bg-muted/20 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      title="Export Full Workspace JSON"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-color" />
                    </button>
                  </div>
                </div>

                {/* Inline item creation form */}
                {isCreateOpen && (
                  <form onSubmit={handleCreateItem} className="bg-muted/30 border border-border-color/60 rounded p-2.5 space-y-2 font-mono text-xs shrink-0">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-bold uppercase">
                      <span>New {isCreateOpen}</span>
                      <button type="button" onClick={() => setIsCreateOpen(null)} className="text-rose-400">Cancel</button>
                    </div>
                    {createParentFolder && (
                      <div className="text-[10px] text-cyan truncate bg-cyan/5 px-1 py-0.5 rounded border border-cyan/10">
                        In: {createParentFolder}/
                      </div>
                    )}
                    <input
                      type="text"
                      autoFocus
                      required
                      placeholder={isCreateOpen === 'file' ? 'e.g. index.js' : 'e.g. components'}
                      value={createPathInput}
                      onChange={(e) => setCreatePathInput(e.target.value)}
                      className="w-full bg-background border border-border-color rounded px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-cyan"
                    />
                    <button type="submit" className="w-full py-1 bg-cyan/20 hover:bg-cyan/30 text-cyan border border-cyan/40 rounded text-center text-[10px] font-bold uppercase transition-colors cursor-pointer">
                      Create
                    </button>
                  </form>
                )}

                {/* Render Workspace Tree view */}
                <div
                  className="flex-1 flex flex-col gap-0.5 max-h-[380px] overflow-y-auto scrollbar-thin pr-1 border border-border-color/20 rounded p-2 bg-[#0c0f17]/40 min-h-[160px]"
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = e.dataTransfer.files;
                    if (files && files.length > 0) {
                      const fakeEvent = { target: { files } } as any;
                      handleImportSingleFiles(fakeEvent);
                    }
                  }}
                >
                  {workspace.length === 0 ? (
                    <div className="text-center py-10 text-[11px] text-muted-foreground font-mono leading-relaxed">
                      // drag & drop files here<br />or click buttons to import
                    </div>
                  ) : (
                    (() => {
                      const sorted = [...workspace].sort((a, b) => {
                        const aParts = a.path.split('/');
                        const bParts = b.path.split('/');
                        const minLen = Math.min(aParts.length, bParts.length);
                        for (let i = 0; i < minLen; i++) {
                          if (aParts[i] !== bParts[i]) {
                            const aIsLast = i === aParts.length - 1;
                            const bIsLast = i === bParts.length - 1;
                            const aType = (aIsLast && a.type === 'file') ? 'file' : 'folder';
                            const bType = (bIsLast && b.type === 'file') ? 'file' : 'folder';
                            if (aType !== bType) {
                              return aType === 'folder' ? -1 : 1;
                            }
                            return aParts[i].localeCompare(bParts[i]);
                          }
                        }
                        return a.path.length - b.path.length;
                      });

                      return sorted.map((item) => {
                        const depth = item.path.split('/').length - 1;
                        const isCollapsed = collapsedFolders.some(f => item.path.startsWith(f + '/'));
                        if (isCollapsed) return null;

                        const isItemCollapsed = collapsedFolders.includes(item.path);

                        return (
                          <div
                            key={item.id}
                            style={{ paddingLeft: `${depth * 10 + 6}px` }}
                            className={`group flex items-center justify-between py-1 px-1.5 rounded text-xs font-mono cursor-pointer select-none transition-all ${
                              item.type === 'folder'
                                ? 'text-foreground hover:bg-muted/15 font-semibold'
                                : activeFileId === item.id
                                ? 'bg-cyan/10 text-cyan font-bold border-r border-cyan'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/10'
                            }`}
                            onClick={() => {
                              if (item.type === 'folder') {
                                handleToggleFolder(item.path, {} as any);
                              } else {
                                handleOpenFile(item);
                              }
                            }}
                          >
                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                              {item.type === 'folder' ? (
                                <>
                                  <ChevronRight className={`w-3 h-3 text-muted-foreground/60 transition-transform shrink-0 ${isItemCollapsed ? '' : 'rotate-90'}`} />
                                  <Folder className="w-3.5 h-3.5 text-amber-color shrink-0" />
                                </>
                              ) : (
                                <File className="w-3.5 h-3.5 text-cyan shrink-0" />
                              )}
                              <span className="truncate pr-2">{item.name}</span>
                            </div>

                            {/* Actions on hover */}
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              {item.type === 'folder' ? (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setCreateParentFolder(item.path);
                                      setIsCreateOpen('file');
                                    }}
                                    className="p-0.5 hover:text-cyan rounded transition-colors"
                                    title="Add file inside folder"
                                  >
                                    <Plus className="w-3 h-3 text-cyan" />
                                  </button>
                                  <button
                                    onClick={(e) => handleDeleteItem(item, e)}
                                    className="p-0.5 hover:text-rose-400 rounded transition-colors"
                                    title="Delete folder"
                                  >
                                    <Trash2 className="w-3 h-3 text-rose-400" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={(e) => handleAttachToPrompt(item, e)}
                                    className="p-0.5 hover:text-cyan rounded transition-colors text-cyan/70"
                                    title="Attach Code to Prompt"
                                  >
                                    <Paperclip className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={(e) => handleDownloadFile(item, e)}
                                    className="p-0.5 hover:text-emerald-color rounded transition-colors text-emerald-color/70"
                                    title="Download File"
                                  >
                                    <Download className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={(e) => handleDeleteItem(item, e)}
                                    className="p-0.5 hover:text-rose-400 rounded transition-colors text-rose-400/70"
                                    title="Delete file"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      });
                    })()
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Active Chat Thread Console */}
        <div className="lg:col-span-9 flex flex-col">
          {/* Lab Control Tabs */}
          <div className="flex border border-border-color border-b-0 bg-muted/10 dark:bg-[#081c28]/50 rounded-t-xl overflow-hidden shrink-0">
            <button
              onClick={() => setMainTab('chat')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 text-xs font-mono font-bold transition-all border-r border-border-color/60 cursor-pointer ${
                mainTab === 'chat'
                  ? 'bg-amber-color/10 text-amber-color border-b-2 border-b-amber-color'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/10'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>💬 AI DEVELOPER CHAT</span>
            </button>
            <button
              onClick={() => {
                setMainTab('sql');
                if (!sqlResult && !sqlErr) {
                  handleExecuteSQL(sqlQuery);
                }
              }}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 text-xs font-mono font-bold transition-all border-r border-border-color/60 cursor-pointer ${
                mainTab === 'sql'
                  ? 'bg-cyan/10 text-cyan border-b-2 border-b-cyan animate-pulse-subtle'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/10'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>🗄️ SQL PLAYGROUND (POSTGRES)</span>
            </button>
            {activeFileId && (
              <button
                onClick={() => setMainTab('editor')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 text-xs font-mono font-bold transition-all border-r border-border-color/60 cursor-pointer ${
                  mainTab === 'editor'
                    ? 'bg-emerald-color/10 text-emerald-color border-b-2 border-b-emerald-color shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/10'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="truncate max-w-[180px]">📝 {workspace.find(i => i.id === activeFileId)?.name || 'FILE EDITOR'}</span>
              </button>
            )}
          </div>

          <div className="border border-border-color bg-muted/5 dark:bg-[#081c28]/60 rounded-b-xl overflow-hidden flex flex-col h-full min-h-[460px] shadow-lg select-text" id="lab-terminal-shell">
            {mainTab === 'chat' ? (
              <>
                {/* Status bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 dark:bg-[#161b26]/50 border-b border-border-color font-mono text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-color animate-pulse" />
                    <span className="font-semibold text-foreground">{activeProvider}</span>
                    <span>·</span>
                    <span className="text-muted-foreground/80">
                      {activeProvider === 'gemini'
                        ? 'gemini-3.5-flash'
                        : activeProvider === 'openai'
                        ? 'gpt-4o-mini'
                        : activeProvider === 'ollama'
                        ? ollamaModel
                        : activeProvider === 'litellm'
                        ? litellmModel || 'litellm-proxy'
                        : claudeModel || 'claude-3.5-sonnet'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTeamMode(!teamMode)}
                      className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-all border font-mono ${
                        teamMode
                          ? 'bg-amber-color/10 border-amber-color/30 text-amber-color font-bold shadow-[0_0_8px_rgba(34,211,238,0.25)] animate-pulse-subtle'
                          : 'border-border-color/60 text-muted-foreground/60 hover:text-foreground'
                      }`}
                      title="Toggle Multi-Agent Developer Team Orchestration"
                    >
                      {teamMode ? '👥 Team Orchestration' : '👤 Single Model'}
                    </button>
                    <span className="hidden sm:inline">
                      {activeProvider === 'gemini'
                        ? 'Active Server Route'
                        : activeProvider === 'openai'
                        ? openaiKey
                          ? 'Key Configured ✓'
                          : 'Key Needed ⚠'
                        : 'Connection active'}
                    </span>
                    <div className="hidden sm:block h-3 w-px bg-border-color/60 mx-1" />
                    <button
                      onClick={handleExportChat}
                      disabled={messages.length === 0}
                      className="hover:text-cyan text-muted-foreground/60 transition-colors border border-border-color/50 px-2 py-0.5 rounded text-[10px] cursor-pointer flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none bg-[#0c0f17]/30"
                      title="Export Chat as Markdown"
                    >
                      <Download className="w-3 h-3" />
                      <span>export</span>
                    </button>
                    <button
                      onClick={clearHistory}
                      disabled={messages.length === 0}
                      className="hover:text-amber-color text-muted-foreground/60 transition-colors border border-border-color/50 px-2 py-0.5 rounded text-[10px] cursor-pointer flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none bg-[#0c0f17]/30"
                      title="Clear Logs"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>clear</span>
                    </button>
                  </div>
                </div>

                {/* Chat Message Window */}
                <div className="flex-1 p-5 overflow-y-auto max-h-[400px] min-h-[300px] space-y-4" id="lab-message-window">
                  {messages.map((msg) => {
                    const isUser = msg.role === 'user';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[85%] ${isUser ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                      >
                        {/* Meta details */}
                        <div className="text-[10px] font-mono text-muted-foreground/60 mb-1 px-1 flex items-center gap-1">
                          <span>{isUser ? 'david@local' : `${activeProvider}-assistant`}</span>
                          <span>·</span>
                          <span>{msg.timestamp}</span>
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={`rounded-xl transition-colors ${
                            isUser
                              ? 'bg-amber-color/10 border border-amber-color/30 text-foreground p-4 text-sm leading-relaxed'
                              : 'w-full space-y-3.5'
                          }`}
                        >
                          {isUser ? (
                            <div
                              className="prose prose-invert max-w-none text-xs sm:text-sm prose-p:my-1 prose-pre:bg-black/40"
                              dangerouslySetInnerHTML={{ __html: formatMessageContent(msg.content) }}
                            />
                          ) : (
                            parseAgentDialogue(msg.content).map((part, pIdx) => {
                              const agentInfo = getAgentInfo(part.agent);
                              return (
                                <div
                                  key={pIdx}
                                  className={`rounded-xl border p-4 space-y-2.5 transition-all text-sm leading-relaxed ${agentInfo.bgColor} ${agentInfo.borderColor}`}
                                >
                                  <div className="flex items-center justify-between border-b border-border-color/20 pb-2">
                                    <div className="flex items-center gap-2 select-none">
                                      <img
                                        src={agentInfo.gifUrl}
                                        alt={agentInfo.name}
                                        className="w-5 h-5 object-contain"
                                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                                      />
                                      <span className="font-display font-bold text-xs uppercase tracking-wide text-foreground">{agentInfo.name}</span>
                                    </div>
                                    <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${agentInfo.tagColor}`}>
                                      {agentInfo.role}
                                    </span>
                                  </div>
                                  <div
                                    className="prose prose-invert max-w-none text-xs sm:text-sm prose-p:my-1 prose-pre:bg-black/40 text-muted-foreground/90 font-mono"
                                    dangerouslySetInnerHTML={{ __html: formatMessageContent(part.text) }}
                                  />
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {isGenerating && messages[messages.length - 1]?.content === '' && (
                    <div className="flex flex-col items-start mr-auto max-w-[85%]">
                      <div className="text-[10px] font-mono text-muted-foreground/60 mb-1 px-1">
                        {activeProvider}-assistant · processing...
                      </div>
                      <div className="rounded-xl p-4 bg-muted/30 dark:bg-[#161b26] border border-border-color flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-cyan animate-spin" />
                        <span className="font-mono text-xs text-muted-foreground animate-pulse">Assistant is thinking...</span>
                      </div>
                    </div>
                  )}

                  {errorText && (
                    <div className="border border-red-500/20 bg-red-500/5 text-red-400 p-4 rounded-xl flex gap-3 text-xs sm:text-sm max-w-2xl mx-auto">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                      <div className="space-y-1">
                        <span className="font-semibold font-mono text-xs uppercase block">Assistant Error</span>
                        <p>{errorText}</p>
                      </div>
                    </div>
                  )}

                  <div ref={chatBottomRef} />
                </div>

                {/* Quick prompts chips */}
                {messages.length <= 1 && (
                  <div className="px-5 py-2.5 bg-muted/10 border-t border-border-color/30 flex flex-wrap gap-2" id="quick-prompts-bar">
                    {quickPrompts.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendPrompt(p)}
                        className="px-3 py-1 bg-background/50 hover:bg-muted border border-border-color/60 text-muted-foreground hover:text-foreground rounded-full text-xs font-mono transition-colors text-left cursor-pointer"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}

                {/* User Input prompt row */}
                <div className="p-4 bg-muted/20 dark:bg-[#161b26]/30 border-t border-border-color flex items-center gap-3">
                  <span className="font-mono text-md text-amber-color font-bold select-none pl-1">$</span>
                  <input
                    type="text"
                    placeholder="ask the dev assistant..."
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendPrompt(inputPrompt);
                    }}
                    disabled={isGenerating}
                    className="flex-1 bg-transparent border-none text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/60 font-mono disabled:opacity-50"
                    id="prompt-input"
                  />
                  {isGenerating ? (
                    <button
                      onClick={handleStopGeneration}
                      className="p-2 py-1.5 sm:px-3 sm:py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-foreground rounded-lg transition-all focus:outline-none cursor-pointer flex items-center justify-center gap-1.5 font-mono text-xs font-bold"
                      title="Stop Streaming"
                      id="btn-prompt-stop"
                    >
                      <StopCircle className="w-3.5 h-3.5 text-red-500" />
                      <span className="hidden sm:inline">STOP</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSendPrompt(inputPrompt)}
                      disabled={!inputPrompt.trim()}
                      className="p-2.5 bg-cyan/10 hover:bg-cyan/20 border border-cyan text-cyan hover:text-foreground rounded-lg transition-all focus:outline-none disabled:opacity-30 cursor-pointer flex items-center justify-center"
                      title="Send Message"
                      id="btn-prompt-send"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </>
            ) : mainTab === 'sql' ? (
              /* SQL Playground Panel */
              <div className="flex flex-col flex-1 font-mono text-xs h-full bg-[#0a0c14]/40" id="sql-playground-panel">
                {/* Top status header */}
                <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border-color/60 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-cyan" />
                    <span className="font-bold text-foreground">PostgreSQL 16.3 (Virtual Sandbox)</span>
                    <span>·</span>
                    <span className="text-[9px] bg-cyan/10 text-cyan px-1.5 py-0.5 rounded border border-cyan/20">CONNECTED</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px]">Schema: public</span>
                    <span>·</span>
                    <span className="text-emerald-color flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-color" />
                      AUTO-PERSIST ACTIVE
                    </span>
                  </div>
                </div>

                {/* Split workspace area: Query + Schema */}
                <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-border-color">
                  {/* SQL input area (75%) */}
                  <div className="lg:col-span-3 p-4 flex flex-col gap-3 border-r border-border-color/40">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase font-bold tracking-wide">
                      <span>SQL QUERY TERMINAL</span>
                      <span className="text-cyan lowercase">type your query or insert records</span>
                    </div>

                    <div className="relative border border-border-color bg-[#07090f] rounded-lg overflow-hidden flex flex-col">
                      <textarea
                        value={sqlQuery}
                        onChange={(e) => setSqlQuery(e.target.value)}
                        className="w-full h-24 p-3 bg-transparent text-xs text-foreground/90 font-mono focus:outline-none resize-none leading-relaxed"
                        placeholder="SELECT * FROM projects;"
                        spellCheck={false}
                      />
                      {/* Action trigger absolute */}
                      <div className="flex items-center justify-between px-3 py-1.5 bg-[#0e111b] border-t border-border-color/50">
                        <span className="text-[9px] text-muted-foreground/60 select-none">
                          F5 or click Run to evaluate
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSqlQuery('')}
                            className="px-2 py-0.5 text-[10px] border border-border-color bg-background hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
                          >
                            Reset
                          </button>
                          <button
                            onClick={() => handleExecuteSQL(sqlQuery)}
                            className="flex items-center gap-1 px-3 py-0.5 bg-cyan hover:bg-cyan/90 text-black font-bold text-[10px] rounded transition-colors cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Run (F5)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sandbox Schema Browser (25%) */}
                  <div className="lg:col-span-1 p-4 bg-[#0d101a]/30 flex flex-col gap-2">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wide border-b border-border-color/40 pb-1.5">
                      Schema Explorer
                    </div>

                    <div className="space-y-3 overflow-y-auto max-h-[120px] scrollbar-thin text-[10px] leading-relaxed pr-1">
                      {/* Table projects */}
                      <div className="space-y-1">
                        <span className="text-amber-color font-bold flex items-center gap-1 font-mono">
                          <Database className="w-2.5 h-2.5 text-amber-color" />
                          <span>projects</span>
                        </span>
                        <div className="pl-3.5 text-muted-foreground/80 space-y-0.5">
                          <div>id <span className="opacity-60 font-normal">SERIAL (PK)</span></div>
                          <div>name <span className="opacity-60 font-normal">VARCHAR</span></div>
                          <div>category <span className="opacity-60 font-normal">VARCHAR</span></div>
                          <div>description <span className="opacity-60 font-normal">TEXT</span></div>
                          <div>tag <span className="opacity-60 font-normal">VARCHAR</span></div>
                        </div>
                      </div>

                      {/* Table users */}
                      <div className="space-y-1">
                        <span className="text-cyan font-bold flex items-center gap-1 font-mono">
                          <Database className="w-2.5 h-2.5 text-cyan" />
                          <span>users</span>
                        </span>
                        <div className="pl-3.5 text-muted-foreground/80 space-y-0.5">
                          <div>id <span className="opacity-60 font-normal">INT (PK)</span></div>
                          <div>name <span className="opacity-60 font-normal">VARCHAR</span></div>
                          <div>role <span className="opacity-60 font-normal">VARCHAR</span></div>
                          <div>email <span className="opacity-60 font-normal">VARCHAR</span></div>
                          <div>status <span className="opacity-60 font-normal">VARCHAR</span></div>
                        </div>
                      </div>

                      {/* Table api_logs */}
                      <div className="space-y-1">
                        <span className="text-rose-400 font-bold flex items-center gap-1 font-mono">
                          <Database className="w-2.5 h-2.5 text-rose-400" />
                          <span>api_logs</span>
                        </span>
                        <div className="pl-3.5 text-muted-foreground/80 space-y-0.5">
                          <div>id <span className="opacity-60 font-normal">INT (PK)</span></div>
                          <div>endpoint <span className="opacity-60 font-normal">VARCHAR</span></div>
                          <div>method <span className="opacity-60 font-normal">VARCHAR</span></div>
                          <div>latency_ms <span className="opacity-60 font-normal">INT</span></div>
                          <div>status <span className="opacity-60 font-normal">INT</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preset SQL Pills row */}
                <div className="px-4 py-2 bg-muted/20 border-b border-border-color/50 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold mr-1">Quick Presets:</span>
                  {[
                    { label: 'Select Projects', query: 'SELECT * FROM projects ORDER BY name ASC;' },
                    { label: 'Select Active Users', query: 'SELECT * FROM users WHERE status = \'Active\';' },
                    { label: 'Sort Slow Logs', query: 'SELECT * FROM api_logs ORDER BY latency_ms DESC LIMIT 3;' },
                    { label: 'Count Projects', query: 'SELECT count(*) FROM projects;' },
                    { label: 'Insert Project (writes to UI!)', query: "INSERT INTO projects (name, category, description, url, host, tag) VALUES ('CyberGuard', 'build', 'Go security shield built in sandbox', 'https://github.com', 'github.com', 'SQL New');" }
                  ].map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSqlQuery(preset.query);
                        handleExecuteSQL(preset.query);
                      }}
                      className="px-2 py-0.5 bg-[#0d101a] hover:bg-muted border border-border-color/55 text-muted-foreground hover:text-foreground text-[9px] rounded transition-all cursor-pointer truncate max-w-[200px]"
                      title={preset.query}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Output Console Section */}
                <div className="flex-1 p-4 bg-[#06080e]/95 flex flex-col gap-3 overflow-hidden min-h-[220px]">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground shrink-0">
                    <span className="uppercase font-bold tracking-wider">QUERY OUTPUT TERMINAL</span>
                    {sqlLatency !== null && (
                      <span className="text-cyan text-[9px] font-mono">
                        Success · {sqlResult ? sqlResult.length : 0} rows retrieved ({sqlLatency} ms)
                      </span>
                    )}
                  </div>

                  {sqlErr ? (
                    /* Error state layout */
                    <div className="flex-1 border border-red-500/25 bg-red-500/5 text-red-400 p-4 rounded-lg font-mono text-[11px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
                      <div className="flex items-center gap-1.5 font-bold uppercase text-xs text-red-500 mb-1">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span>Database Exception Traceback</span>
                      </div>
                      <div className="font-bold">Error: {sqlErr}</div>
                      <div className="text-[10px] text-red-400/60 mt-2 font-mono leading-relaxed">
                        at VirtualPGPool.query (postgresql/client.ts:84:11)<br />
                        at SandboxSession.execute (postgresql/sandbox.ts:139:41)<br />
                        at handleExecuteSQL (Lab.tsx:182:12)
                      </div>
                    </div>
                  ) : sqlResult ? (
                    /* Success state: Table viewer */
                    <div className="flex-1 flex flex-col overflow-hidden border border-border-color bg-[#07090e] rounded-lg">
                      <div className="flex-1 overflow-auto max-h-[160px] scrollbar-thin">
                        <table className="w-full text-left border-collapse font-mono text-[10px]">
                          <thead>
                            <tr className="bg-[#101421] text-muted-foreground border-b border-border-color sticky top-0">
                              {sqlColumns.map((col, idx) => (
                                <th key={idx} className="p-2 border-r border-border-color last:border-0 uppercase font-bold text-[9px] tracking-wide select-none">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sqlResult.length === 0 ? (
                              <tr>
                                <td colSpan={sqlColumns.length || 1} className="p-4 text-center text-muted-foreground/50 italic">
                                  {/* 0 records returned. */}
                                </td>
                              </tr>
                            ) : (
                              sqlResult.map((row, rowIdx) => (
                                <tr key={rowIdx} className="hover:bg-muted/10 border-b border-border-color last:border-0 transition-colors">
                                  {sqlColumns.map((col, colIdx) => {
                                    const cellVal = row[col];
                                    const cellText = cellVal === null || cellVal === undefined ? 'NULL' : String(cellVal);
                                    const isNull = cellVal === null || cellVal === undefined;
                                    return (
                                      <td key={colIdx} className={`p-2 border-r border-border-color last:border-0 truncate max-w-xs ${isNull ? 'text-muted-foreground/35 italic' : 'text-foreground/90'}`}>
                                        {cellText}
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Export controller */}
                      <div className="flex items-center justify-between px-3 py-1.5 border-t border-border-color bg-[#101421]/50 text-[10px] text-muted-foreground shrink-0 select-none">
                        <span className="flex items-center gap-1 text-[9px]">
                          <Info className="w-3 h-3 text-cyan" />
                          <span>INSERT / DELETE statements will dynamically update the live portfolio Projects tab!</span>
                        </span>
                        <button
                          onClick={handleDownloadCSV}
                          disabled={sqlResult.length === 0}
                          className="flex items-center gap-1.5 px-2 py-0.5 border border-border-color hover:border-cyan text-muted-foreground hover:text-cyan rounded transition-all cursor-pointer bg-[#080b12] disabled:opacity-30 disabled:pointer-events-none text-[9px] font-bold uppercase tracking-wider"
                          title="Export query results to CSV"
                        >
                          <Download className="w-3 h-3" />
                          <span>Export CSV</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Initial execution guidance */
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-border-color/60 bg-[#07090f]/40 rounded-lg text-muted-foreground select-none">
                      <Terminal className="w-8 h-8 text-cyan/30 mb-2 animate-pulse" />
                      <div className="text-[11px] font-bold text-foreground">Sandbox ready for evaluation</div>
                      <p className="max-w-md text-[10px] text-muted-foreground/70 mt-1 leading-relaxed">
                        Enter a valid query or click one of the quick preset query templates above to test your virtual database!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : mainTab === 'editor' ? (
              <div className="flex-1 flex flex-col bg-[#07090e] font-mono text-xs overflow-hidden select-text min-h-[460px]">
                {/* Editor Header Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 dark:bg-[#161b26]/70 border-b border-border-color shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-emerald-color shrink-0" />
                    <span className="font-bold text-foreground truncate text-xs">
                      {workspace.find(i => i.id === activeFileId)?.path || 'Untitled File'}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan/10 text-cyan border border-cyan/20 uppercase font-bold">
                      {workspace.find(i => i.id === activeFileId)?.name.split('.').pop() || 'text'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {editorSaveNotification && (
                      <span className="text-[10px] text-emerald-color font-bold flex items-center gap-1 animate-pulse">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Saved!</span>
                      </span>
                    )}
                    <button
                      onClick={() => {
                        const item = workspace.find(i => i.id === activeFileId);
                        if (item) handleAttachToPrompt(item, {} as any);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan/15 hover:bg-cyan/25 text-cyan border border-cyan/30 text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer"
                      title="Attach Code to Chat Prompt"
                    >
                      <Paperclip className="w-3 h-3" />
                      <span>Attach to Chat</span>
                    </button>
                    <button
                      onClick={() => {
                        const item = workspace.find(i => i.id === activeFileId);
                        if (item) handleDownloadFile(item, {} as any);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-muted/30 hover:bg-muted/50 border border-border-color text-muted-foreground hover:text-foreground text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer"
                      title="Download File"
                    >
                      <Download className="w-3 h-3 text-emerald-color" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={handleSaveFileContent}
                      className="flex items-center gap-1.5 px-3 py-1 bg-amber-color hover:bg-amber-color/90 text-black font-bold rounded text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={() => setMainTab('chat')}
                      className="p-1 hover:bg-muted/30 rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      title="Close File"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Textarea Code Editor Area */}
                <div className="flex-1 p-4 bg-[#0a0d14] relative flex">
                  <textarea
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    className="w-full h-full min-h-[360px] bg-transparent text-xs text-foreground/90 font-mono leading-relaxed focus:outline-none resize-none border-none p-2 overflow-y-auto selection:bg-cyan/30"
                    placeholder="// Write code here..."
                    spellCheck={false}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

        {/* Inline Code Editor Modal */}
        <AnimatePresence>
          {activeFileId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-mono select-text"
              onClick={() => setActiveFileId(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                className="bg-[#081c28] border border-border-color rounded-xl w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-border-color bg-[#161b26]">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan" />
                    <span className="text-xs font-bold text-foreground truncate max-w-sm">
                      {workspace.find(i => i.id === activeFileId)?.path}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveFileId(null)}
                    className="p-1 hover:bg-muted/20 text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Editor Area */}
                <div className="flex-1 p-4 bg-[#0a0d14] relative">
                  <textarea
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    className="w-full h-full bg-transparent text-xs text-foreground/90 font-mono leading-relaxed focus:outline-none resize-none border-none p-1 overflow-y-auto selection:bg-cyan/30"
                    placeholder="// write some code..."
                    spellCheck={false}
                  />
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-border-color bg-[#161b26] text-xs">
                  <span className="text-[10px] text-muted-foreground">
                    Click "Save Changes" to apply edits
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveFileId(null)}
                      className="px-3 py-1.5 border border-border-color rounded-lg text-xs font-mono hover:bg-muted/20 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveFileContent}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-cyan hover:bg-cyan/95 text-black font-bold rounded-lg text-xs font-mono transition-all cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
}
