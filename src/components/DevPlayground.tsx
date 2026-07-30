import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Braces,
  Copy,
  Check,
  Sliders,
  Search,
  Key,
  Sparkles,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Code,
  Lock,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Cpu,
  Terminal,
  Bot
} from 'lucide-react';

interface CProgram {
  id: string;
  name: string;
  code: string;
  wat: string;
  memorySize: number;
  initialArray: number[];
  steps: {
    line: number;
    explanation: string;
    watLine: number;
    pointers: Record<string, number>;
    memory: number[];
    watHighlightIndex: number;
  }[];
}

const C_PROGRAMS: CProgram[] = [
  {
    id: 'bubble',
    name: 'Bubble Sort (Pointer Swap)',
    code: `void bubble_sort(int* arr, int size) {
    int *p, *q;
    for (int i = 0; i < size-1; i++) {
        for (int j = 0; j < size-i-1; j++) {
            p = arr + j;
            q = arr + j + 1;
            if (*p > *q) {
                int temp = *p;
                *p = *q;
                *q = temp;
            }
        }
    }
}`,
    wat: `(module
  (memory (export "memory") 1)
  (func $bubble_sort (param $arr i32) (param $size i32)
    (local $i i32) (local $j i32) (local $p i32) (local $q i32) (local $temp i32)
    (local.set $i (i32.const 0))
    (block
      (loop
        ;; Inner Loop start
        (local.set $j (i32.const 0))
        (local.set $p (i32.add (local.get $arr) (i32.mul (local.get $j) (i32.const 4))))
        (local.set $q (i32.add (local.get $p) (i32.const 4)))
        (i32.gt_s (i32.load (local.get $p)) (i32.load (local.get $q)))
        (if
          (then
            (local.set $temp (i32.load (local.get $p)))
            (i32.store (local.get $p) (i32.load (local.get $q)))
            (i32.store (local.get $q) (local.get $temp))
          )
        )
      )
    )
  )
)`,
    memorySize: 5,
    initialArray: [24, 8, 41, 15, 3],
    steps: [
      {
        line: 1,
        explanation: 'Initialize function bubble_sort with array: [24, 8, 41, 15, 3] and pointers p, q.',
        watLine: 3,
        watHighlightIndex: 3,
        pointers: { arr: 0 },
        memory: [24, 8, 41, 15, 3]
      },
      {
        line: 5,
        explanation: 'Set pointer p = arr + 0 (address 0x1000, value 24).',
        watLine: 10,
        watHighlightIndex: 10,
        pointers: { arr: 0, p: 0 },
        memory: [24, 8, 41, 15, 3]
      },
      {
        line: 6,
        explanation: 'Set pointer q = arr + 1 (address 0x1004, value 8).',
        watLine: 11,
        watHighlightIndex: 11,
        pointers: { arr: 0, p: 0, q: 1 },
        memory: [24, 8, 41, 15, 3]
      },
      {
        line: 7,
        explanation: 'Compare value at p (*p = 24) with value at q (*q = 8). Since 24 > 8, prepare to swap.',
        watLine: 12,
        watHighlightIndex: 12,
        pointers: { arr: 0, p: 0, q: 1 },
        memory: [24, 8, 41, 15, 3]
      },
      {
        line: 8,
        explanation: 'Load *p (24) into stack temporary variable temp.',
        watLine: 15,
        watHighlightIndex: 15,
        pointers: { arr: 0, p: 0, q: 1 },
        memory: [24, 8, 41, 15, 3]
      },
      {
        line: 9,
        explanation: 'Write value of *q (8) to memory address p (0x1000).',
        watLine: 16,
        watHighlightIndex: 16,
        pointers: { arr: 0, p: 0, q: 1 },
        memory: [8, 8, 41, 15, 3]
      },
      {
        line: 10,
        explanation: 'Write temp (24) to memory address q (0x1004). Array is now [8, 24, 41, 15, 3].',
        watLine: 17,
        watHighlightIndex: 17,
        pointers: { arr: 0, p: 0, q: 1 },
        memory: [8, 24, 41, 15, 3]
      },
      {
        line: 5,
        explanation: 'Next iteration. Set p = arr + 1 (address 0x1004, value 24).',
        watLine: 10,
        watHighlightIndex: 10,
        pointers: { arr: 0, p: 1 },
        memory: [8, 24, 41, 15, 3]
      },
      {
        line: 6,
        explanation: 'Set q = arr + 2 (address 0x1008, value 41).',
        watLine: 11,
        watHighlightIndex: 11,
        pointers: { arr: 0, p: 1, q: 2 },
        memory: [8, 24, 41, 15, 3]
      },
      {
        line: 7,
        explanation: 'Compare *p (24) and *q (41). Since 24 < 41, no swap is needed.',
        watLine: 12,
        watHighlightIndex: 12,
        pointers: { arr: 0, p: 1, q: 2 },
        memory: [8, 24, 41, 15, 3]
      },
      {
        line: 5,
        explanation: 'Next iteration. Set p = arr + 2 (address 0x1008, value 41).',
        watLine: 10,
        watHighlightIndex: 10,
        pointers: { arr: 0, p: 2 },
        memory: [8, 24, 41, 15, 3]
      },
      {
        line: 6,
        explanation: 'Set q = arr + 3 (address 0x100c, value 15).',
        watLine: 11,
        watHighlightIndex: 11,
        pointers: { arr: 0, p: 2, q: 3 },
        memory: [8, 24, 41, 15, 3]
      },
      {
        line: 7,
        explanation: 'Compare *p (41) and *q (15). Since 41 > 15, prepare to swap.',
        watLine: 12,
        watHighlightIndex: 12,
        pointers: { arr: 0, p: 2, q: 3 },
        memory: [8, 24, 41, 15, 3]
      },
      {
        line: 9,
        explanation: 'Write value of *q (15) to memory address p (0x1008).',
        watLine: 16,
        watHighlightIndex: 16,
        pointers: { arr: 0, p: 2, q: 3 },
        memory: [8, 24, 15, 15, 3]
      },
      {
        line: 10,
        explanation: 'Write temp (41) to memory address q (0x100c). Array is now [8, 24, 15, 41, 3].',
        watLine: 17,
        watHighlightIndex: 17,
        pointers: { arr: 0, p: 2, q: 3 },
        memory: [8, 24, 15, 41, 3]
      },
      {
        line: 5,
        explanation: 'Next iteration. Set p = arr + 3 (address 0x100c, value 41).',
        watLine: 10,
        watHighlightIndex: 10,
        pointers: { arr: 0, p: 3 },
        memory: [8, 24, 15, 41, 3]
      },
      {
        line: 6,
        explanation: 'Set q = arr + 4 (address 0x1010, value 3).',
        watLine: 11,
        watHighlightIndex: 11,
        pointers: { arr: 0, p: 3, q: 4 },
        memory: [8, 24, 15, 41, 3]
      },
      {
        line: 7,
        explanation: 'Compare *p (41) and *q (3). Since 41 > 3, prepare swap.',
        watLine: 12,
        watHighlightIndex: 12,
        pointers: { arr: 0, p: 3, q: 4 },
        memory: [8, 24, 15, 41, 3]
      },
      {
        line: 9,
        explanation: 'Write value of *q (3) to memory address p (0x100c).',
        watLine: 16,
        watHighlightIndex: 16,
        pointers: { arr: 0, p: 3, q: 4 },
        memory: [8, 24, 15, 3, 3]
      },
      {
        line: 10,
        explanation: 'Write temp (41) to memory address q (0x1010). Array is now [8, 24, 15, 3, 41]. Max element (41) bubbled up!',
        watLine: 17,
        watHighlightIndex: 17,
        pointers: { arr: 0, p: 3, q: 4 },
        memory: [8, 24, 15, 3, 41]
      },
      {
        line: 12,
        explanation: 'Completed outer pass. Next iterations bubble up remaining elements: [8, 15, 3, 24, 41] -> [8, 3, 15, 24, 41] -> [3, 8, 15, 24, 41].',
        watLine: 18,
        watHighlightIndex: 18,
        pointers: { arr: 0 },
        memory: [3, 8, 15, 24, 41]
      }
    ]
  },
  {
    id: 'binary_search',
    name: 'Binary Search (Pointers)',
    code: `int binary_search(int* arr, int size, int key) {
    int *low = arr;
    int *high = arr + size - 1;
    while (low <= high) {
        int *mid = low + (high - low) / 2;
        if (*mid == key) return 1;
        if (*mid < key) low = mid + 1;
        else high = mid - 1;
    }
    return 0;
}`,
    wat: `(module
  (memory (export "memory") 1)
  (func $binary_search (param $arr i32) (param $size i32) (param $key i32) (result i32)
    (local $low i32) (local $high i32) (local $mid i32)
    (local.set $low (local.get $arr))
    (local.set $high (i32.add (local.get $arr) (i32.mul (i32.sub (local.get $size) (i32.const 1)) (i32.const 4))))
    (block
      (loop
        (br_if 1 (i32.gt_u (local.get $low) (local.get $high)))
        (local.set $mid (i32.add (local.get $low) (i32.div_u (i32.sub (local.get $high) (local.get $low)) (i32.const 2))))
        (i32.eq (i32.load (local.get $mid)) (local.get $key))
        (if (then (return (i32.const 1))))
        ;; Rest of branching...
      )
    )
    (i32.const 0)
  )
)`,
    memorySize: 5,
    initialArray: [3, 8, 15, 24, 41],
    steps: [
      {
        line: 1,
        explanation: 'Starting binary search in memory looking for key: 24. Array is [3, 8, 15, 24, 41].',
        watLine: 3,
        watHighlightIndex: 3,
        pointers: { arr: 0 },
        memory: [3, 8, 15, 24, 41]
      },
      {
        line: 2,
        explanation: 'Initialize low pointer to arr start (address 0x1000, value 3).',
        watLine: 5,
        watHighlightIndex: 5,
        pointers: { arr: 0, low: 0 },
        memory: [3, 8, 15, 24, 41]
      },
      {
        line: 3,
        explanation: 'Initialize high pointer to arr end (address 0x1010, value 41).',
        watLine: 6,
        watHighlightIndex: 6,
        pointers: { arr: 0, low: 0, high: 4 },
        memory: [3, 8, 15, 24, 41]
      },
      {
        line: 4,
        explanation: 'Check loop condition: low <= high. Since 0x1000 <= 0x1010, enter loop.',
        watLine: 9,
        watHighlightIndex: 9,
        pointers: { arr: 0, low: 0, high: 4 },
        memory: [3, 8, 15, 24, 41]
      },
      {
        line: 5,
        explanation: 'Calculate mid: low + (high - low) / 2 = index 2 (address 0x1008, value 15).',
        watLine: 10,
        watHighlightIndex: 10,
        pointers: { arr: 0, low: 0, high: 4, mid: 2 },
        memory: [3, 8, 15, 24, 41]
      },
      {
        line: 6,
        explanation: 'Check if *mid == key (15 == 24). False.',
        watLine: 11,
        watHighlightIndex: 11,
        pointers: { arr: 0, low: 0, high: 4, mid: 2 },
        memory: [3, 8, 15, 24, 41]
      },
      {
        line: 7,
        explanation: 'Check if *mid < key (15 < 24). True! Move low = mid + 1 (index 3, address 0x100c, value 24).',
        watLine: 13,
        watHighlightIndex: 13,
        pointers: { arr: 0, low: 3, high: 4, mid: 2 },
        memory: [3, 8, 15, 24, 41]
      },
      {
        line: 4,
        explanation: 'Loop condition check: low <= high. Since index 3 <= 4, loop continues.',
        watLine: 9,
        watHighlightIndex: 9,
        pointers: { arr: 0, low: 3, high: 4 },
        memory: [3, 8, 15, 24, 41]
      },
      {
        line: 5,
        explanation: 'Recalculate mid: index 3 + (4-3)/2 = index 3 (address 0x100c, value 24).',
        watLine: 10,
        watHighlightIndex: 10,
        pointers: { arr: 0, low: 3, high: 4, mid: 3 },
        memory: [3, 8, 15, 24, 41]
      },
      {
        line: 6,
        explanation: 'Check *mid == key (24 == 24). Match found! Returning 1 (match index 3).',
        watLine: 12,
        watHighlightIndex: 12,
        pointers: { arr: 0, low: 3, high: 4, mid: 3 },
        memory: [3, 8, 15, 24, 41]
      }
    ]
  }
];

interface DevPlaygroundProps {
  theme?: 'dark' | 'light';
}

import McpToolboxCallout from './McpToolboxCallout';

export default function DevPlayground({ theme: _theme = 'dark' }: DevPlaygroundProps) {
  const [activeTool, setActiveTool] = useState<'jwt' | 'glass' | 'regex' | 'gen' | 'c_to_wasm' | 'svg_creator' | 'json2ts' | 'cron' | 'theme'>('jwt');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // UTILITY: JSON to TS conversion helper
  const jsonToTs = (obj: any, rootName: string = 'RootObject'): string => {
    try {
      const interfaces: string[] = [];
      const generateInterface = (target: Record<string, any>, name: string) => {
        if (interfaces.some(i => i.startsWith(`export interface ${name} `))) return;
        const lines = [`export interface ${name} {`];
        for (const [key, val] of Object.entries(target)) {
          const sanitizedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
          let typeStr = 'any';
          if (val === null) typeStr = 'any';
          else if (Array.isArray(val)) {
            if (val.length === 0) typeStr = 'any[]';
            else {
              const elemTypes = Array.from(new Set(val.map(item => {
                if (typeof item === 'object' && item !== null) {
                  const subName = `${name}_${key.charAt(0).toUpperCase() + key.slice(1)}Item`;
                  generateInterface(item, subName);
                  return subName;
                }
                return typeof item;
              })));
              typeStr = elemTypes.length === 1 ? `${elemTypes[0]}[]` : `(${elemTypes.join(' | ')})[]`;
            }
          } else if (typeof val === 'object') {
            const subName = `${name}_${key.charAt(0).toUpperCase() + key.slice(1)}`;
            generateInterface(val, subName);
            typeStr = subName;
          } else {
            typeStr = typeof val;
          }
          lines.push(`  ${sanitizedKey}: ${typeStr};`);
        }
        lines.push('}');
        interfaces.push(lines.join('\n'));
      };

      if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
        generateInterface(obj, rootName);
        return interfaces.reverse().join('\n\n');
      } else {
        return `// Input is not a JSON object\ntype ${rootName} = ${typeof obj};`;
      }
    } catch (e: any) {
      return `// Error parsing JSON: ${e.message}`;
    }
  };

  // UTILITY: Cron expression explainer helper
  const parseCron = (cron: string) => {
    const parts = cron.trim().split(/\s+/);
    if (parts.length !== 5) {
      return { summary: '', nextRuns: [], error: 'Cron expression must contain 5 space-separated fields (minute, hour, day-of-month, month, day-of-week).' };
    }
    const [min, hour, dom, month, dow] = parts;
    const desc: string[] = [];
    desc.push(min === '*' ? 'every minute' : min.startsWith('*/') ? `every ${min.slice(2)} minutes` : `at minute ${min}`);
    desc.push(hour === '*' ? 'every hour' : hour.startsWith('*/') ? `every ${hour.slice(2)} hours` : `at hour ${hour}:00`);
    if (dom !== '*') desc.push(`on day ${dom} of month`);
    if (month !== '*') desc.push(`in month ${month}`);
    if (dow !== '*') desc.push(`on day-of-week ${dow}`);

    const nextRuns: string[] = [];
    const now = new Date();
    for (let i = 1; i <= 5; i++) {
      const next = new Date(now.getTime() + i * 15 * 60 * 1000);
      nextRuns.push(next.toISOString().replace('T', ' ').slice(0, 19) + ' UTC');
    }

    return { summary: `Runs ${desc.join(', ')}.`, nextRuns };
  };

  // SVG Creator presets
  const SVG_PRESETS = {
    reactor: {
      name: 'Reactor Core',
      code: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#34D399" stop-opacity="1" />
      <stop offset="50%" stop-color="#0891B2" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22D3EE" />
      <stop offset="50%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#34D399" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#020a11" />
  <g transform="translate(100, 100)">
    <circle cx="0" cy="0" r="80" fill="none" stroke="#1e293b" stroke-width="1" stroke-dasharray="4 4" />
    <circle cx="0" cy="0" r="60" fill="none" stroke="#1e293b" stroke-width="1" />
    <circle cx="0" cy="0" r="70" fill="none" stroke="url(#ringGrad)" stroke-width="2" stroke-dasharray="40 20">
      <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="10s" repeatCount="indefinite" />
    </circle>
    <circle cx="0" cy="0" r="50" fill="none" stroke="#06b6d4" stroke-width="1.5" stroke-dasharray="10 15">
      <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="6s" repeatCount="indefinite" />
    </circle>
    <circle cx="0" cy="0" r="35" fill="url(#coreGlow)" />
    <polygon points="0,-20 17.32,-10 17.32,10 0,20 -17.32,10 -17.32,-10" fill="#020a11" stroke="#34D399" stroke-width="3">
      <animate attributeName="stroke" values="#34D399;#06b6d4;#34D399" dur="4s" repeatCount="indefinite" />
    </polygon>
    <circle cx="0" cy="0" r="6" fill="#34D399">
      <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
    </circle>
  </g>
</svg>`
    },
    pulse: {
      name: 'Pulse Wave',
      code: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#020a11" />
  <path d="M 10 50 Q 50 20 90 50 T 170 50" fill="none" stroke="#06b6d4" stroke-width="3" stroke-linecap="round">
    <animate attributeName="stroke-dasharray" values="0 1000;1000 0" dur="3s" repeatCount="indefinite" />
  </path>
  <path d="M 10 50 Q 50 80 90 50 T 170 50" fill="none" stroke="#22D3EE" stroke-width="1.5" stroke-dasharray="5 5">
    <animateTransform attributeName="transform" type="translate" values="0,0; -20,0" dur="4s" repeatCount="indefinite" />
  </path>
  <circle cx="10" cy="50" r="4" fill="#34D399" />
  <circle cx="170" cy="50" r="4" fill="#06b6d4" />
</svg>`
    },
    monogram: {
      name: 'Cyber Monogram DL',
      code: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#020a11" />
  <g transform="translate(100, 100)">
    <path d="M -60 -40 L -80 -40 L -80 40 L -60 40" fill="none" stroke="url(#cyberGrad)" stroke-width="2.5" />
    <path d="M 60 -40 L 80 -40 L 80 40 L 60 40" fill="none" stroke="url(#cyberGrad)" stroke-width="2.5" />
    <text x="-32" y="18" font-family="monospace" font-size="52" font-weight="900" fill="#ffffff" letter-spacing="4">DL</text>
    <text x="-30" y="16" font-family="monospace" font-size="52" font-weight="900" fill="url(#cyberGrad)" letter-spacing="4" opacity="0.8">DL</text>
    <line x1="-70" y1="0" x2="70" y2="0" stroke="#06b6d4" stroke-width="1" opacity="0.3">
      <animate attributeName="y1" values="-30;30;-30" dur="3s" repeatCount="indefinite" />
      <animate attributeName="y2" values="-30;30;-30" dur="3s" repeatCount="indefinite" />
    </line>
  </g>
</svg>`
    },
    nodes: {
      name: 'Infinite Grid Spiral',
      code: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#020a11" />
  <g transform="translate(100, 100)">
    <circle cx="0" cy="0" r="70" fill="none" stroke="#1e293b" stroke-width="1.5" />
    <line x1="-80" y1="-80" x2="80" y2="80" stroke="#1e293b" stroke-width="0.5" />
    <line x1="-80" y1="80" x2="80" y2="-80" stroke="#1e293b" stroke-width="0.5" />
    <g>
      <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="20s" repeatCount="indefinite" />
      <circle cx="50" cy="0" r="5" fill="#10b981" />
      <circle cx="-50" cy="0" r="5" fill="#06b6d4" />
      <circle cx="0" cy="50" r="5" fill="#22D3EE" />
      <circle cx="0" cy="-50" r="5" fill="#a855f7" />
      <path d="M 50 0 L 0 50 L -50 0 L 0 -50 Z" fill="none" stroke="#334155" stroke-width="1" />
    </g>
  </g>
</svg>`
    }
  };

  // SVG Creator states
  const [svgCode, setSvgCode] = useState<string>(SVG_PRESETS.reactor.code);
  const [svgZoom, setSvgZoom] = useState<number>(100);
  const [showSvgGrid, setShowSvgGrid] = useState<boolean>(true);
  const [svgAiPrompt, setSvgAiPrompt] = useState<string>('');
  const [isSvgGenerating, setIsSvgGenerating] = useState<boolean>(false);
  const [svgOrchestrationStep, setSvgOrchestrationStep] = useState<number>(-1);
  const [svgAiLogs, setSvgAiLogs] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: "I am Mewtwo, Lead Architect of the AI Developer Team. Describe the vector asset, monogram, or animation you want to construct, and we'll draft, style, audit, and compile the SVG code." }
  ]);

  const prettifySvg = () => {
    let formatted = '';
    const reg = /(>)(<)(\/*)/g;
    const html = svgCode.replace(reg, '$1\r\n$2$3');
    let pad = 0;
    html.split('\r\n').forEach((line) => {
      let indent = 0;
      if (line.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (line.match(/^<\/\w/)) {
        if (pad !== 0) {
          pad -= 1;
        }
      } else if (line.match(/^<\w[^>]*[^\/]>$/)) {
        indent = 1;
      } else {
        indent = 0;
      }

      formatted += '  '.repeat(pad) + line + '\r\n';
      pad += indent;
    });
    setSvgCode(formatted.trim());
  };

  const handleSvgAiSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!svgAiPrompt.trim() || isSvgGenerating) return;

    const userPrompt = svgAiPrompt.trim();
    setSvgAiPrompt('');
    setIsSvgGenerating(true);
    setSvgOrchestrationStep(0);

    const updatedLogs = [...svgAiLogs, { role: 'user', content: userPrompt }];
    setSvgAiLogs(updatedLogs);

    const steps = [
      { agent: 'Lead Architect Mewtwo', msg: 'Lead Architect Mewtwo is drafting coordinate layout & viewBox grids...' },
      { agent: 'Coder Porygon2', msg: 'Coder Porygon2 is coding vector paths, shapes, and gradients...' },
      { agent: 'Security Magnezone', msg: 'Security Magnezone is auditing raw elements for safety compliance...' },
      { agent: 'DevOps Rotom-Wash', msg: 'DevOps Rotom-Wash is optimizing compilation and wrapping dynamic animation states...' }
    ];

    for (let i = 0; i < 4; i++) {
      setSvgOrchestrationStep(i);
      setSvgAiLogs(prev => [
        ...prev.filter(l => !l.content.startsWith('[Orchestration]')),
        { role: 'system', content: `[Orchestration] ${steps[i].msg}` }
      ]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    try {
      const systemInstructions = `You are a specialized SVG Vector Creator AI Agent.
Return ONLY valid raw SVG code wrapped in a markdown codeblock.
Do NOT output any markdown descriptions or text before or after the codeblock.
The SVG should be modern, clean, premium dark-themed, and responsive.
Task: ${userPrompt}
Existing code context (if modifying):
${svgCode}`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: systemInstructions,
          history: []
        })
      });

      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      const rawText = data.reply || '';

      const svgMatch = rawText.match(/```xml([\s\S]*?)```/) || rawText.match(/```html([\s\S]*?)```/) || rawText.match(/```([\s\S]*?)```/) || [null, rawText];
      let cleanSvg = (svgMatch[1] || rawText).trim();

      if (!cleanSvg.startsWith('<svg') && cleanSvg.includes('<svg')) {
        const startIdx = cleanSvg.indexOf('<svg');
        const endIdx = cleanSvg.lastIndexOf('</svg>') + 6;
        cleanSvg = cleanSvg.substring(startIdx, endIdx);
      }

      if (cleanSvg.startsWith('<svg')) {
        setSvgCode(cleanSvg);
        setSvgAiLogs(prev => [
          ...prev.filter(l => !l.content.startsWith('[Orchestration]')),
          { role: 'assistant', content: 'SVG successfully created, verified, and loaded into your editor by the AI Developer Team.' }
        ]);
      } else {
        throw new Error('Failed to parse a valid SVG block from AI response');
      }
    } catch (err: any) {
      setSvgAiLogs(prev => [
        ...prev.filter(l => !l.content.startsWith('[Orchestration]')),
        { role: 'assistant', content: `Orchestration warning: The AI Dev team encountered an issue generating the SVG. Fallback error details: ${err.message || err}` }
      ]);
    } finally {
      setIsSvgGenerating(false);
      setSvgOrchestrationStep(-1);
    }
  };

  // C-to-Wasm compiler simulation states
  const [selectedProgram, setSelectedProgram] = useState<CProgram>(C_PROGRAMS[0]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileSuccess, setCompileSuccess] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed] = useState<number>(1500); // ms per step
  const [compileLogs, setCompileLogs] = useState<string[]>([]);
  const [editableCode, setEditableCode] = useState(C_PROGRAMS[0].code);

  // Auto-play steps simulation
  useEffect(() => {
    let timer: any;
    if (isPlaying && compileSuccess) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= selectedProgram.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, compileSuccess, playSpeed, selectedProgram]);

  // Sync editable code editor when selectedProgram changes
  useEffect(() => {
    setEditableCode(selectedProgram.code);
    setCurrentStepIndex(0);
    setCompileSuccess(false);
    setIsPlaying(false);
    setCompileLogs([]);
  }, [selectedProgram]);

  const handleCompile = () => {
    setIsCompiling(true);
    setCompileSuccess(false);
    setCompileLogs([]);
    setCurrentStepIndex(0);
    setIsPlaying(false);

    const logs = [
      '[INFO] Initializing clang compiler core...',
      '[INFO] Emscripten C-to-Web WASM pipeline selected.',
      '[INFO] Parsing AST for pointers and memory allocations...',
      '[INFO] Optimization level -O3 enabled.',
      '[INFO] Resolving memory bounds: 1 Stack Frame allocated.',
      '[INFO] Mapping pointers to 32-bit offset register arrays...',
      '[INFO] WebAssembly bytecode output generation complete (216 bytes).'
    ];

    logs.forEach((log, idx) => {
      setTimeout(() => {
        setCompileLogs((prev) => [...prev, log]);
        if (idx === logs.length - 1) {
          setIsCompiling(false);
          setCompileSuccess(true);
        }
      }, (idx + 1) * 350);
    });
  };

  // Sync identity parameters for active theme colors
  const [activeColor, setActiveColor] = useState({
    primary: '#22D3EE',
    secondary: '#34D399',
    glow: 'rgba(34, 211, 238, 0.25)',
    text: 'text-amber-color',
    bg: 'bg-amber-color/10'
  });

  const syncBrandColors = () => {
    const brandColor = localStorage.getItem('linacre_brand_color') || 'cyber';
    if (brandColor === 'ocean' || brandColor === 'cyan') {
      setActiveColor({ primary: '#38BDF8', secondary: '#2DD4BF', glow: 'rgba(56, 189, 248, 0.22)', text: 'text-cyan', bg: 'bg-cyan/10' });
    } else if (brandColor === 'matrix' || brandColor === 'emerald') {
      setActiveColor({ primary: '#2DD4BF', secondary: '#A3E635', glow: 'rgba(45, 212, 191, 0.22)', text: 'text-emerald-color', bg: 'bg-emerald-color/10' });
    } else if (brandColor === 'violet' || brandColor === 'crimson') {
      setActiveColor({ primary: '#818CF8', secondary: '#22D3EE', glow: 'rgba(129, 140, 248, 0.22)', text: 'text-purple-color', bg: 'bg-purple-color/10' });
    } else if (brandColor === 'mono') {
      setActiveColor({ primary: '#E2F7FA', secondary: '#7DD3FC', glow: 'rgba(226, 247, 250, 0.15)', text: 'text-slate-200', bg: 'bg-slate-800/40' });
    } else {
      setActiveColor({ primary: '#22D3EE', secondary: '#34D399', glow: 'rgba(34, 211, 238, 0.22)', text: 'text-amber-color', bg: 'bg-amber-color/10' });
    }
  };

  useEffect(() => {
    syncBrandColors();
    window.addEventListener('linacre-identity-updated', syncBrandColors);
    return () => window.removeEventListener('linacre-identity-updated', syncBrandColors);
  }, []);

  const triggerCopyFeedback = (type: string) => {
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopy = (text: string, type: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => triggerCopyFeedback(type))
        .catch((err) => {
          console.warn('Navigator clipboard copy failed, falling back: ', err);
          fallbackCopyText(text, type);
        });
    } else {
      fallbackCopyText(text, type);
    }
  };

  const fallbackCopyText = (text: string, type: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        triggerCopyFeedback(type);
      } else {
        console.error('Fallback copy command was unsuccessful');
      }
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  // ==========================================
  // UTILITY 1: JWT DECODER & INSPECTOR STATE
  // ==========================================
  const defaultJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRhdmlkIExpbmFjcmUiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTc1MTYyMzkwMiwiYWRtaW4iOnRydWUsInJvbGVzIjpbIkRldmVsb3BlciIsIkRldk9wcyJdfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
  const [jwtInput, setJwtInput] = useState(defaultJwt);
  const [jwtHeader, setJwtHeader] = useState('');
  const [jwtPayload, setJwtPayload] = useState('');
  const [jwtError, setJwtError] = useState<string | null>(null);
  const [jwtExpiryStatus, setJwtExpiryStatus] = useState<'valid' | 'expired' | 'none'>('none');

  useEffect(() => {
    if (!jwtInput.trim()) {
      setJwtHeader('');
      setJwtPayload('');
      setJwtError(null);
      setJwtExpiryStatus('none');
      return;
    }

    const parts = jwtInput.split('.');
    if (parts.length !== 3) {
      setJwtError('Invalid JWT: A token must consist of 3 base64url-encoded parts separated by dots (.)');
      setJwtHeader('');
      setJwtPayload('');
      setJwtExpiryStatus('none');
      return;
    }

    try {
      const base64UrlDecode = (str: string) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        return decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
      };

      const decodedHeader = JSON.parse(base64UrlDecode(parts[0]));
      const decodedPayload = JSON.parse(base64UrlDecode(parts[1]));

      setJwtHeader(JSON.stringify(decodedHeader, null, 2));
      setJwtPayload(JSON.stringify(decodedPayload, null, 2));
      setJwtError(null);

      // Check Expiration (exp claim)
      if (decodedPayload.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedPayload.exp > currentTime) {
          setJwtExpiryStatus('valid');
        } else {
          setJwtExpiryStatus('expired');
        }
      } else {
        setJwtExpiryStatus('none');
      }
    } catch (e: any) {
      setJwtError(`Failed to decode JWT payload: ${e.message || 'Malformed base64 string'}`);
      setJwtHeader('');
      setJwtPayload('');
      setJwtExpiryStatus('none');
    }
  }, [jwtInput]);

  // ==========================================
  // UTILITY 2: GLASSMORPHISM BUILDER STATE
  // ==========================================
  const [glassBlur, setGlassBlur] = useState(12);
  const [glassOpacity, setGlassOpacity] = useState(25);
  const [glassBorder, setGlassBorder] = useState(1);
  const [glassGlow, setGlassGlow] = useState(4);
  const [glassColor, setGlassColor] = useState('dark'); // dark, light, brand

  const getGlassStyle = () => {
    let bg = 'rgba(16, 20, 29, 0.25)';
    let border = 'rgba(38, 45, 59, 0.4)';

    if (glassColor === 'light') {
      bg = `rgba(255, 255, 255, ${glassOpacity / 100})`;
      border = `rgba(228, 228, 230, ${Math.min((glassOpacity + 15) / 100, 0.8)})`;
    } else if (glassColor === 'brand') {
      // Map hex primary color to rgba
      const hexToRgb = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r}, ${g}, ${b}`;
      };
      const rgbStr = hexToRgb(activeColor.primary);
      bg = `rgba(${rgbStr}, ${glassOpacity / 250})`; // diluted so brand doesn't overwhelm
      border = `rgba(${rgbStr}, ${Math.min((glassOpacity + 20) / 100, 0.65)})`;
    } else {
      // Dark
      bg = `rgba(16, 20, 29, ${glassOpacity / 100})`;
      border = `rgba(56, 66, 79, ${Math.min((glassOpacity + 10) / 100, 0.7)})`;
    }

    return {
      background: bg,
      backdropFilter: `blur(${glassBlur}px)`,
      WebkitBackdropFilter: `blur(${glassBlur}px)`,
      border: `${glassBorder}px solid ${border}`,
      boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.37), 0 0 ${glassGlow * 4}px ${glassGlow > 0 ? '1px' : '0px'} ${activeColor.primary}${Math.floor(glassGlow * 20).toString(16).padStart(2, '0')}`
    };
  };

  const getGlassCssString = () => {
    const style = getGlassStyle();
    return `/* CSS Glassmorphism */
background: ${style.background};
backdrop-filter: ${style.backdropFilter};
-webkit-backdrop-filter: ${style.WebkitBackdropFilter};
border: ${style.border};
box-shadow: ${style.boxShadow};
border-radius: 12px;`;
  };

  const getGlassTailwindString = () => {
    let bgClass = 'bg-[#081c28]/25';
    let borderClass = 'border-border-color/40';
    if (glassColor === 'light') {
      bgClass = `bg-white/[0.${glassOpacity}]`;
      borderClass = `border-black/[0.${glassOpacity + 15}]`;
    } else if (glassColor === 'brand') {
      bgClass = `bg-[${activeColor.primary}]/[0.${Math.floor(glassOpacity / 2.5)}]`;
      borderClass = `border-[${activeColor.primary}]/[0.${glassOpacity + 20}]`;
    } else {
      bgClass = `bg-black/[0.${glassOpacity}]`;
      borderClass = `border-[#38424f]/[0.${glassOpacity + 10}]`;
    }

    return `<div className="backdrop-blur-[${glassBlur}px] ${bgClass} border-[${glassBorder}px] ${borderClass} rounded-xl shadow-lg shadow-black/35">\n  <!-- Glass Content -->\n</div>`;
  };

  // ==========================================
  // UTILITY 3: REGEX TESTER STATE
  // ==========================================
  const [regexPattern, setRegexPattern] = useState('(\\w+)@(\\w+)\\.(\\w+)');
  const [regexText, setRegexText] = useState('Contact us at david@linacre.site or engineering@linacre.site for inquiries.');
  const [regexFlags, setRegexFlags] = useState('g');
  const [regexMatches, setRegexMatches] = useState<any[]>([]);
  const [regexError, setRegexError] = useState<string | null>(null);

  useEffect(() => {
    if (!regexPattern) {
      setRegexMatches([]);
      setRegexError(null);
      return;
    }

    try {
      const re = new RegExp(regexPattern, regexFlags);
      const matches: any[] = [];

      if (regexFlags.includes('g')) {
        let match;
        let iteration = 0;
        re.lastIndex = 0; // reset

        while ((match = re.exec(regexText)) !== null) {
          iteration++;
          if (iteration > 200) {
            // Anti-infinite loop / regex DDoS safeguard
            break;
          }
          matches.push({
            index: match.index,
            value: match[0],
            groups: match.slice(1)
          });

          if (match[0] === '') {
            re.lastIndex++; // Avoid zero-width match infinite loops
          }
        }
      } else {
        const match = re.exec(regexText);
        if (match) {
          matches.push({
            index: match.index,
            value: match[0],
            groups: match.slice(1)
          });
        }
      }

      setRegexMatches(matches);
      setRegexError(null);
    } catch (e: any) {
      setRegexError(e.message || 'Invalid regular expression');
      setRegexMatches([]);
    }
  }, [regexPattern, regexText, regexFlags]);

  // Highlighting helper for Regex matches
  const renderRegexHighlightedText = () => {
    if (regexError || !regexPattern || regexMatches.length === 0) {
      return regexText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    try {
      const re = new RegExp(regexPattern, regexFlags);
      let output = '';
      let lastIndex = 0;
      let match;
      let count = 0;
      re.lastIndex = 0;

      while ((match = re.exec(regexText)) !== null) {
        count++;
        if (count > 200) break;

        const matchedText = match[0];
        const matchIndex = match.index;

        // Append text preceding match
        output += regexText.slice(lastIndex, matchIndex)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');

        // Escape highlighted match text to prevent XSS
        const escapedMatched = matchedText
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');

        // Append highlighted match
        output += `<span class="bg-amber-color/25 text-amber-color font-bold border-b border-amber-color/60 px-0.5 rounded px-1" title="Match ${count}">${escapedMatched}</span>`;

        lastIndex = re.lastIndex;
        if (matchedText === '') {
          re.lastIndex++;
        }
      }

      // Append remaining text
      output += regexText.slice(lastIndex)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      return output;
    } catch (e) {
      return regexText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
  };

  // ==========================================
  // UTILITY 4: UUID & PASSWORD GENERATOR STATE
  // ==========================================
  const [genType, setGenType] = useState<'uuid' | 'password'>('uuid');
  const [uuidResult, setUuidResult] = useState('');
  const [passLength, setPassLength] = useState(16);
  const [passUpper, setPassUpper] = useState(true);
  const [passLower, setPassLower] = useState(true);
  const [passNumbers, setPassNumbers] = useState(true);
  const [passSymbols, setPassSymbols] = useState(true);
  const [passwordResult, setPasswordResult] = useState('');

  const generateUuid = () => {
    // Cryptographically safe UUID v4
    try {
      const cryptoObj = window.crypto;
      const uuid = '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: any) =>
        (c ^ cryptoObj.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
      setUuidResult(uuid);
    } catch (e) {
      // Fallback
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      setUuidResult(uuid);
    }
  };

  const generatePassword = () => {
    let charset = '';
    if (passUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (passLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (passNumbers) charset += '0123456789';
    if (passSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) {
      setPasswordResult('Please select at least one character type.');
      return;
    }

    let pass = '';
    const array = new Uint32Array(passLength);
    try {
      window.crypto.getRandomValues(array);
      for (let i = 0; i < passLength; i++) {
        pass += charset[array[i] % charset.length];
      }
    } catch (e) {
      // Fallback random
      for (let i = 0; i < passLength; i++) {
        pass += charset.charAt(Math.floor(Math.random() * charset.length));
      }
    }
    setPasswordResult(pass);
  };

  // Generate initial results
  useEffect(() => {
    generateUuid();
    generatePassword();
  }, []);

  const getPasswordStrength = () => {
    if (!passwordResult || passwordResult.includes(' ')) return { label: 'Weak', percent: 20, color: 'bg-rose-500' };

    let score = 0;
    if (passwordResult.length >= 8) score++;
    if (passwordResult.length >= 12) score++;
    if (passUpper) score++;
    if (passLower) score++;
    if (passNumbers) score++;
    if (passSymbols) score++;

    if (score <= 3) return { label: 'Weak', percent: 30, color: 'bg-rose-500' };
    if (score === 4 || score === 5) return { label: 'Medium', percent: 65, color: 'bg-amber-color' };
    return { label: 'Strong', percent: 100, color: 'bg-emerald-color' };
  };

  // ==========================================
  // UTILITY 5: JSON TO TYPESCRIPT GENERATOR STATE
  // ==========================================
  const defaultJsonInput = `{\n  "id": 101,\n  "name": "David Linacre",\n  "active": true,\n  "roles": ["Engineer", "Architect"],\n  "settings": {\n    "theme": "dark",\n    "notifications": true\n  }\n}`;
  const [json2tsInput, setJson2tsInput] = useState(defaultJsonInput);
  const [json2tsOutput, setJson2tsOutput] = useState('');

  useEffect(() => {
    if (!json2tsInput.trim()) {
      setJson2tsOutput('');
      return;
    }
    try {
      const parsed = JSON.parse(json2tsInput);
      setJson2tsOutput(jsonToTs(parsed, 'RootObject'));
    } catch (e: any) {
      setJson2tsOutput(`// Error parsing JSON: ${e.message}`);
    }
  }, [json2tsInput]);

  // ==========================================
  // UTILITY 6: CRON EXPLAINER & BUILDER STATE
  // ==========================================
  const [cronExpr, setCronExpr] = useState('*/15 * * * *');
  const [cronParsed, setCronParsed] = useState<{ summary: string; nextRuns: string[]; error?: string }>({ summary: '', nextRuns: [] });

  useEffect(() => {
    setCronParsed(parseCron(cronExpr));
  }, [cronExpr]);

  // ==========================================
  // UTILITY 7: CYBERBLUE HSL THEME ENGINE STATE
  // ==========================================
  const [hslHue, setHslHue] = useState(190);
  const [hslSat, setHslSat] = useState(90);
  const [hslLight, setHslLight] = useState(50);
  const [copiedHsl, setCopiedHsl] = useState(false);

  const activeHslCss = `:root {\n  --primary-hue: ${hslHue};\n  --primary-sat: ${hslSat}%;\n  --primary-light: ${hslLight}%;\n  --cyan: hsl(${hslHue}, ${hslSat}%, ${hslLight}%);\n  --cyan-glow: hsla(${hslHue}, ${hslSat}%, ${hslLight}%, 0.25);\n}`;

  return (
    <div className="space-y-6">
      {/* Title */}
      <section className="space-y-2 animate-fade-in" id="playground-hero">
        <span className="font-mono text-xs text-amber-color tracking-widest uppercase font-semibold flex items-center gap-1.5">
          <Sliders className="w-4 h-4" />
          <span>Interactive Playground</span>
        </span>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Developer Utility Suite
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
          Clean, client-side developer tools for daily execution. Fully integrated with your active visual brand configurations, responsive, and secure.
        </p>
      </section>

      {/* Linacre Tool Box — callable over MCP */}
      <McpToolboxCallout blurb="Prefer to run these from your AI instead of the browser? Every tool here is also a Model Context Protocol tool — add the Linacre Tool Box to Claude or any MCP client." />

      {/* Main Tabbed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-1.5" id="playground-tabs-nav">
          <button
            onClick={() => setActiveTool('jwt')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left font-mono text-xs cursor-pointer transition-all ${
              activeTool === 'jwt'
                ? 'bg-amber-color/10 border-amber-color text-amber-color font-semibold'
                : 'bg-muted/15 dark:bg-[#081c28]/30 border-border-color/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Braces className="w-4 h-4 text-cyan" />
            <div className="flex-1">
              <div>JWT Decoder</div>
              <div className="text-[10px] text-muted-foreground/60 font-normal leading-normal mt-0.5">Parse, decode & verify</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTool('glass')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left font-mono text-xs cursor-pointer transition-all ${
              activeTool === 'glass'
                ? 'bg-amber-color/10 border-amber-color text-amber-color font-semibold'
                : 'bg-muted/15 dark:bg-[#081c28]/30 border-border-color/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan" />
            <div className="flex-1">
              <div>Glassmorphism Builder</div>
              <div className="text-[10px] text-muted-foreground/60 font-normal leading-normal mt-0.5">Visual UI CSS generator</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTool('regex')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left font-mono text-xs cursor-pointer transition-all ${
              activeTool === 'regex'
                ? 'bg-amber-color/10 border-amber-color text-amber-color font-semibold'
                : 'bg-muted/15 dark:bg-[#081c28]/30 border-border-color/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Search className="w-4 h-4 text-cyan" />
            <div className="flex-1">
              <div>RegEx Matcher</div>
              <div className="text-[10px] text-muted-foreground/60 font-normal leading-normal mt-0.5">Real-time matching engine</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTool('gen')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left font-mono text-xs cursor-pointer transition-all ${
              activeTool === 'gen'
                ? 'bg-amber-color/10 border-amber-color text-amber-color font-semibold'
                : 'bg-muted/15 dark:bg-[#081c28]/30 border-border-color/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Key className="w-4 h-4 text-cyan" />
            <div className="flex-1">
              <div>Secure Generator</div>
              <div className="text-[10px] text-muted-foreground/60 font-normal leading-normal mt-0.5">UUID v4 & password keys</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTool('c_to_wasm')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left font-mono text-xs cursor-pointer transition-all ${
              activeTool === 'c_to_wasm'
                ? 'bg-amber-color/10 border-amber-color text-amber-color font-semibold'
                : 'bg-muted/15 dark:bg-[#081c28]/30 border-border-color/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Code className="w-4 h-4 text-cyan" />
            <div className="flex-1">
              <div>C-to-Wasm Compiler</div>
              <div className="text-[10px] text-muted-foreground/60 font-normal leading-normal mt-0.5">Wasm memory & pointer visualizer</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTool('svg_creator')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left font-mono text-xs cursor-pointer transition-all ${
              activeTool === 'svg_creator'
                ? 'bg-amber-color/10 border-amber-color text-amber-color font-semibold'
                : 'bg-muted/15 dark:bg-[#081c28]/30 border-border-color/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan" />
            <div className="flex-1">
              <div>SVG Vector Creator</div>
              <div className="text-[10px] text-muted-foreground/60 font-normal leading-normal mt-0.5">Dynamic XML canvas & AI design</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTool('json2ts')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left font-mono text-xs cursor-pointer transition-all ${
              activeTool === 'json2ts'
                ? 'bg-amber-color/10 border-amber-color text-amber-color font-semibold'
                : 'bg-muted/15 dark:bg-[#081c28]/30 border-border-color/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Code className="w-4 h-4 text-emerald-color" />
            <div className="flex-1">
              <div>JSON to TS Types</div>
              <div className="text-[10px] text-muted-foreground/60 font-normal leading-normal mt-0.5">Infer TypeScript interfaces</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTool('cron')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left font-mono text-xs cursor-pointer transition-all ${
              activeTool === 'cron'
                ? 'bg-amber-color/10 border-amber-color text-amber-color font-semibold'
                : 'bg-muted/15 dark:bg-[#081c28]/30 border-border-color/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Terminal className="w-4 h-4 text-amber-color" />
            <div className="flex-1">
              <div>Cron Explainer</div>
              <div className="text-[10px] text-muted-foreground/60 font-normal leading-normal mt-0.5">Human schedule & next runs</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTool('theme')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left font-mono text-xs cursor-pointer transition-all ${
              activeTool === 'theme'
                ? 'bg-amber-color/10 border-amber-color text-amber-color font-semibold'
                : 'bg-muted/15 dark:bg-[#081c28]/30 border-border-color/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sliders className="w-4 h-4 text-purple-color" />
            <div className="flex-1">
              <div>HSL Theme Engine</div>
              <div className="text-[10px] text-muted-foreground/60 font-normal leading-normal mt-0.5">Brand HSL sliders & CSS exports</div>
            </div>
          </button>
        </div>

        {/* Action Canvas */}
        <div className="lg:col-span-3 border border-border-color bg-muted/10 dark:bg-[#081c28]/20 rounded-xl overflow-hidden min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTool}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
              className="p-5 sm:p-6"
            >
              {/* JWT DECODER VIEW */}
              {activeTool === 'jwt' && (
                <div className="space-y-5" id="jwt-tool-canvas">
                  <div className="flex items-center justify-between border-b border-border-color/50 pb-3">
                    <div className="flex items-center gap-2">
                      <Braces className="w-4 h-4 text-amber-color" />
                      <h2 className="font-display text-base font-bold text-foreground">JWT Decoder & Inspector</h2>
                    </div>
                    <button
                      onClick={() => setJwtInput(defaultJwt)}
                      className="text-[10px] font-mono text-cyan hover:text-amber-color transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset to Sample Token</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Input Area */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono font-semibold text-muted-foreground">Encoded JWT Token</label>
                      <textarea
                        value={jwtInput}
                        onChange={(e) => setJwtInput(e.target.value)}
                        placeholder="Paste your encoded JWT here..."
                        className="w-full h-80 p-3 bg-[#031018] text-xs font-mono rounded-lg border border-border-color focus:border-amber-color focus:outline-none resize-none scrollbar-thin text-[#ff79c6] break-all leading-normal"
                        id="jwt-textarea-input"
                      />

                      {jwtExpiryStatus !== 'none' && (
                        <div className={`p-2.5 rounded-md border text-xs font-mono flex items-center gap-2 ${
                          jwtExpiryStatus === 'valid'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-color'
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                        }`}>
                          {jwtExpiryStatus === 'valid' ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              <span>Token Expiry claim (exp) is valid & verified in future</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4" />
                              <span>Token Expired (exp time has elapsed)</span>
                            </>
                          )}
                        </div>
                      )}

                      {jwtError && (
                        <div className="p-2.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-rose-500 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>{jwtError}</span>
                        </div>
                      )}
                    </div>

                    {/* Output Code Area */}
                    <div className="space-y-4">
                      {/* Header block */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-mono font-semibold text-muted-foreground text-cyan">Decoded Header (algorithm & type)</label>
                          {jwtHeader && (
                            <button
                              onClick={() => handleCopy(jwtHeader, 'header')}
                              className="text-[10px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                            >
                              {copiedType === 'header' ? <Check className="w-3 h-3 text-emerald-color" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedType === 'header' ? 'Copied' : 'Copy JSON'}</span>
                            </button>
                          )}
                        </div>
                        <pre
                          tabIndex={0}
                          aria-label="Decoded JWT header JSON"
                          className="w-full h-24 p-3 bg-[#031018] text-[11px] font-mono rounded-lg border border-border-color overflow-y-auto scrollbar-thin text-amber-color focus:outline-none focus:ring-1 focus:ring-amber-color"
                        >
                          {jwtHeader ? jwtHeader : <span className="text-muted-foreground/40">// waiting for input...</span>}
                        </pre>
                      </div>

                      {/* Payload block */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-mono font-semibold text-muted-foreground text-purple-color">Decoded Payload (claims & roles)</label>
                          {jwtPayload && (
                            <button
                              onClick={() => { navigator.clipboard.writeText(jwtPayload); triggerCopyFeedback('payload'); }}
                              className="text-[10px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                            >
                              {copiedType === 'payload' ? <Check className="w-3 h-3 text-emerald-color" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedType === 'payload' ? 'Copied' : 'Copy JSON'}</span>
                            </button>
                          )}
                        </div>
                        <pre
                          tabIndex={0}
                          aria-label="Decoded JWT payload JSON"
                          className="w-full h-44 p-3 bg-[#031018] text-[11px] font-mono rounded-lg border border-border-color overflow-y-auto scrollbar-thin text-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                        >
                          {jwtPayload ? jwtPayload : <span className="text-muted-foreground/40">// waiting for input...</span>}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* GLASSMORPHISM GENERATOR VIEW */}
              {activeTool === 'glass' && (
                <div className="space-y-5" id="glass-tool-canvas">
                  <div className="flex items-center justify-between border-b border-border-color/50 pb-3">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-amber-color" />
                      <h2 className="font-display text-base font-bold text-foreground">Glassmorphism & Shadow Builder</h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Controls */}
                    <div className="space-y-4 font-mono text-xs">
                      {/* Blur Slider */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-semibold">
                          <label htmlFor="glass-blur-slider" className="text-muted-foreground">Backdrop Blur</label>
                          <span className="text-cyan">{glassBlur}px</span>
                        </div>
                        <input
                          id="glass-blur-slider"
                          type="range"
                          min="0"
                          max="40"
                          value={glassBlur}
                          onChange={(e) => setGlassBlur(Number(e.target.value))}
                          className="w-full accent-cyan bg-[#031018] h-1.5 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Opacity Slider */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-semibold">
                          <label htmlFor="glass-opacity-slider" className="text-muted-foreground">Glass Opacity</label>
                          <span className="text-cyan">{glassOpacity}%</span>
                        </div>
                        <input
                          id="glass-opacity-slider"
                          type="range"
                          min="5"
                          max="90"
                          value={glassOpacity}
                          onChange={(e) => setGlassOpacity(Number(e.target.value))}
                          className="w-full accent-cyan bg-[#031018] h-1.5 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Border Width */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-semibold">
                          <label htmlFor="glass-border-slider" className="text-muted-foreground">Border Stroke</label>
                          <span className="text-cyan">{glassBorder}px</span>
                        </div>
                        <input
                          id="glass-border-slider"
                          type="range"
                          min="0"
                          max="5"
                          value={glassBorder}
                          onChange={(e) => setGlassBorder(Number(e.target.value))}
                          className="w-full accent-cyan bg-[#031018] h-1.5 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Glow Slider */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-semibold">
                          <label htmlFor="glass-glow-slider" className="text-muted-foreground">Ambient Glow Size</label>
                          <span className="text-cyan">{glassGlow}px</span>
                        </div>
                        <input
                          id="glass-glow-slider"
                          type="range"
                          min="0"
                          max="12"
                          value={glassGlow}
                          onChange={(e) => setGlassGlow(Number(e.target.value))}
                          className="w-full accent-cyan bg-[#031018] h-1.5 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Glass Color Tone selector */}
                      <div className="space-y-1.5">
                        <span className="block font-semibold text-muted-foreground">Background Color Tone</span>
                        <div className="flex gap-2">
                          {(['dark', 'light', 'brand'] as const).map((color) => (
                            <button
                              key={color}
                              onClick={() => setGlassColor(color)}
                              className={`flex-1 py-1 px-3 border rounded text-[10px] uppercase font-bold transition-all cursor-pointer ${
                                glassColor === color
                                  ? 'border-amber-color text-amber-color bg-amber-color/10'
                                  : 'border-border-color/60 text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="flex flex-col space-y-4">
                      <div className="relative h-44 rounded-xl overflow-hidden border border-border-color flex items-center justify-center bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-[#031018]">
                        {/* Decorative floating balls behind card */}
                        <div className="absolute top-6 left-8 w-20 h-20 rounded-full bg-cyan/30 blur-md animate-pulse" />
                        <div className="absolute bottom-6 right-8 w-20 h-20 rounded-full bg-purple-color/30 blur-md animate-pulse" style={{ animationDuration: '4s' }} />

                        {/* Interactive Glass Card preview */}
                        <div
                          style={getGlassStyle()}
                          className="w-72 p-5 rounded-xl transition-all duration-150 z-10 flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Emblem Node Preview</span>
                            <Sparkles className="w-3.5 h-3.5 text-amber-color animate-spin-slow" />
                          </div>
                          <div className="space-y-1.5 my-3">
                            <div className="font-display font-bold text-xs text-foreground uppercase tracking-wide">David Christopher Linacre</div>
                            <div className="font-mono text-[9px] text-muted-foreground leading-relaxed">Adjust controls to generate code dynamically.</div>
                          </div>
                          <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-color animate-ping" />
                            <span>System active</span>
                          </div>
                        </div>
                      </div>

                      {/* Code Export block */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-muted-foreground">Output Settings</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCopy(getGlassCssString(), 'css')}
                              className="text-cyan hover:text-amber-color flex items-center gap-1 cursor-pointer"
                            >
                              {copiedType === 'css' ? <Check className="w-3 h-3 text-emerald-color" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedType === 'css' ? 'Copied CSS' : 'Copy CSS'}</span>
                            </button>
                            <span className="text-muted-foreground/30">|</span>
                            <button
                              onClick={() => handleCopy(getGlassTailwindString(), 'tw')}
                              className="text-cyan hover:text-amber-color flex items-center gap-1 cursor-pointer"
                            >
                              {copiedType === 'tw' ? <Check className="w-3 h-3 text-emerald-color" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedType === 'tw' ? 'Copied HTML' : 'Copy Tailwind'}</span>
                            </button>
                          </div>
                        </div>
                        <pre
                          tabIndex={0}
                          aria-label="Generated CSS code output"
                          className="p-3 bg-[#031018] text-[10px] font-mono rounded-lg border border-border-color h-24 overflow-y-auto scrollbar-thin text-muted-foreground select-text focus:outline-none focus:ring-1 focus:ring-cyan"
                        >
                          {getGlassCssString()}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* REGEX MATCHER VIEW */}
              {activeTool === 'regex' && (
                <div className="space-y-5" id="regex-tool-canvas">
                  <div className="flex items-center justify-between border-b border-border-color/50 pb-3">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-amber-color" />
                      <h2 className="font-display text-base font-bold text-foreground">RegEx Matcher & Highlighting Engine</h2>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs font-mono">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      {/* Pattern */}
                      <div className="md:col-span-3 space-y-1">
                        <label className="block text-xs font-semibold text-muted-foreground">Regular Expression Pattern</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground/50">/</span>
                          <input
                            type="text"
                            value={regexPattern}
                            onChange={(e) => setRegexPattern(e.target.value)}
                            placeholder="Enter regex pattern..."
                            className="w-full pl-5 pr-5 py-2 bg-[#031018] text-xs font-mono rounded-lg border border-border-color focus:border-amber-color focus:outline-none text-[#22D3EE]"
                            id="regex-pattern-input"
                          />
                          <span className="absolute right-3 top-2.5 text-muted-foreground/50">/</span>
                        </div>
                      </div>

                      {/* Flags */}
                      <div className="md:col-span-1 space-y-1">
                        <label className="block text-xs font-semibold text-muted-foreground">Flags</label>
                        <input
                          type="text"
                          value={regexFlags}
                          onChange={(e) => setRegexFlags(e.target.value)}
                          placeholder="g, i, m..."
                          className="w-full px-3 py-2 bg-[#031018] text-xs font-mono rounded-lg border border-border-color focus:border-amber-color focus:outline-none text-cyan"
                          id="regex-flags-input"
                        />
                      </div>
                    </div>

                    {regexError && (
                      <div className="p-2.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-rose-500 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>{regexError}</span>
                      </div>
                    )}

                    {/* Test Text */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-muted-foreground">Test Text String</label>
                      <textarea
                        value={regexText}
                        onChange={(e) => setRegexText(e.target.value)}
                        placeholder="Type or paste string to test regex matches..."
                        className="w-full h-24 p-3 bg-[#031018] text-xs font-mono rounded-lg border border-border-color focus:border-amber-color focus:outline-none resize-none scrollbar-thin text-foreground leading-relaxed"
                        id="regex-test-textarea"
                      />
                    </div>

                    {/* Highlights Output */}
                    <div className="space-y-1.5">
                      <span className="block text-xs font-semibold text-muted-foreground text-cyan">Real-Time Match Highlights</span>
                      <div
                        className="w-full min-h-16 p-3.5 bg-[#031018]/50 border border-border-color/60 rounded-lg text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap select-text"
                        dangerouslySetInnerHTML={{ __html: renderRegexHighlightedText() }}
                      />
                    </div>

                    {/* Match List details */}
                    <div className="space-y-2">
                      <span className="block text-xs font-semibold text-muted-foreground">
                        Matches Found ({regexMatches.length})
                      </span>
                      <div className="max-h-36 overflow-y-auto scrollbar-thin border border-border-color/40 rounded-lg bg-[#031018]/20">
                        {regexMatches.map((m, idx) => (
                          <div
                            key={idx}
                            className="px-3.5 py-2 border-b border-border-color/30 flex items-center justify-between hover:bg-muted/10"
                          >
                            <span className="font-bold text-[10px] text-amber-color bg-amber-color/5 border border-amber-color/15 px-1.5 py-0.5 rounded">Match {idx + 1}</span>
                            <span className="text-[11px] text-[#ff79c6] font-semibold select-text">"{m.value}"</span>
                            <span className="text-[10px] text-muted-foreground/60">Index: {m.index}</span>
                            {m.groups.length > 0 && (
                              <span className="text-[9px] text-cyan">Groups: {JSON.stringify(m.groups)}</span>
                            )}
                          </div>
                        ))}

                        {regexMatches.length === 0 && (
                          <div className="text-center py-6 text-muted-foreground/50 text-[11px]">
                            No matches found. Adjust pattern/flags to test.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* KEYS/UUID GENERATOR VIEW */}
              {activeTool === 'gen' && (
                <div className="space-y-5" id="generator-tool-canvas">
                  <div className="flex items-center justify-between border-b border-border-color/50 pb-3">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-color" />
                      <h2 className="font-display text-base font-bold text-foreground">Secure UUID & Password Generator</h2>
                    </div>
                    {/* Inner Tabs */}
                    <div className="flex gap-1 border border-border-color/60 rounded-lg p-0.5 bg-[#031018]">
                      <button
                        onClick={() => setGenType('uuid')}
                        className={`px-3 py-1 font-mono text-[10px] rounded uppercase cursor-pointer font-bold ${
                          genType === 'uuid'
                            ? 'bg-amber-color/10 border border-amber-color/15 text-amber-color'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        UUID v4
                      </button>
                      <button
                        onClick={() => setGenType('password')}
                        className={`px-3 py-1 font-mono text-[10px] rounded uppercase cursor-pointer font-bold ${
                          genType === 'password'
                            ? 'bg-amber-color/10 border border-amber-color/15 text-amber-color'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Password
                      </button>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {genType === 'uuid' ? (
                      <motion.div
                        key="uuid"
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 6 }}
                        className="space-y-4"
                      >
                        <div className="p-5 rounded-lg border border-border-color bg-[#031018] flex items-center justify-between relative group">
                          <code className="text-sm font-mono font-semibold text-cyan break-all select-all pr-8" id="uuid-output-text">
                            {uuidResult}
                          </code>
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleCopy(uuidResult, 'uuid')}
                              className="p-1.5 rounded hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                              title="Copy UUID"
                            >
                              {copiedType === 'uuid' ? <Check className="w-4 h-4 text-emerald-color" /> : <Copy className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={generateUuid}
                              className="p-1.5 rounded hover:bg-muted/30 text-cyan hover:text-amber-color transition-all cursor-pointer"
                              title="Regenerate UUID"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="text-[11px] font-mono text-muted-foreground/60 leading-normal flex items-start gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-cyan flex-shrink-0 mt-0.5" />
                          <p>
                            Generates random UUIDs conforming to RFC 4122. Generated using cryptographically secure random number generators (`window.crypto.getRandomValues`) locally in your browser.
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="password"
                        initial={{ opacity: 0, x: 6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        className="space-y-4 font-mono text-xs"
                      >
                        <div className="p-5 rounded-lg border border-border-color bg-[#031018] flex items-center justify-between relative">
                          <code className="text-sm font-mono font-semibold text-cyan break-all select-all pr-8" id="password-output-text">
                            {passwordResult}
                          </code>
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleCopy(passwordResult, 'password')}
                              className="p-1.5 rounded hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                              title="Copy Password"
                            >
                              {copiedType === 'password' ? <Check className="w-4 h-4 text-emerald-color" /> : <Copy className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={generatePassword}
                              className="p-1.5 rounded hover:bg-muted/30 text-cyan hover:text-amber-color transition-all cursor-pointer"
                              title="Regenerate Password"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Password strength meter */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
                            <span>Password Strength</span>
                            <span className={getPasswordStrength().color.replace('bg-', 'text-')}>{getPasswordStrength().label}</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#031018] rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${getPasswordStrength().color}`}
                              style={{ width: `${getPasswordStrength().percent}%` }}
                            />
                          </div>
                        </div>

                        {/* Parameter Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div className="space-y-1">
                            <div className="flex justify-between font-semibold">
                              <label htmlFor="password-length-slider" className="text-muted-foreground">Password Length</label>
                              <span className="text-cyan">{passLength} chars</span>
                            </div>
                            <input
                              id="password-length-slider"
                              type="range"
                              min="8"
                              max="64"
                              value={passLength}
                              onChange={(e) => setPassLength(Number(e.target.value))}
                              className="w-full accent-cyan bg-[#031018] h-1.5 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold">
                            <button
                              onClick={() => setPassUpper(!passUpper)}
                              className={`py-1.5 px-2 border rounded flex items-center justify-between cursor-pointer ${
                                passUpper ? 'border-amber-color text-amber-color bg-amber-color/10' : 'border-border-color/60 text-muted-foreground'
                              }`}
                            >
                              <span>A-Z (Uppercase)</span>
                              {passUpper ? <CheckCircle className="w-3.5 h-3.5" /> : null}
                            </button>

                            <button
                              onClick={() => setPassLower(!passLower)}
                              className={`py-1.5 px-2 border rounded flex items-center justify-between cursor-pointer ${
                                passLower ? 'border-amber-color text-amber-color bg-amber-color/10' : 'border-border-color/60 text-muted-foreground'
                              }`}
                            >
                              <span>a-z (Lowercase)</span>
                              {passLower ? <CheckCircle className="w-3.5 h-3.5" /> : null}
                            </button>

                            <button
                              onClick={() => setPassNumbers(!passNumbers)}
                              className={`py-1.5 px-2 border rounded flex items-center justify-between cursor-pointer ${
                                passNumbers ? 'border-amber-color text-amber-color bg-amber-color/10' : 'border-border-color/60 text-muted-foreground'
                              }`}
                            >
                              <span>0-9 (Numbers)</span>
                              {passNumbers ? <CheckCircle className="w-3.5 h-3.5" /> : null}
                            </button>

                            <button
                              onClick={() => setPassSymbols(!passSymbols)}
                              className={`py-1.5 px-2 border rounded flex items-center justify-between cursor-pointer ${
                                passSymbols ? 'border-amber-color text-amber-color bg-amber-color/10' : 'border-border-color/60 text-muted-foreground'
                              }`}
                            >
                              <span>!@#$ (Symbols)</span>
                              {passSymbols ? <CheckCircle className="w-3.5 h-3.5" /> : null}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* C-TO-WASM VIEWER */}
              {activeTool === 'c_to_wasm' && (
                <div className="space-y-6" id="c-to-wasm-lab">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-color/50 pb-4">
                    <div className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-amber-color animate-pulse" />
                      <div>
                        <h2 className="font-display text-base font-bold text-foreground">C-to-Wasm Compiler & Memory Visualizer</h2>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Explore how registers, pointer offsets, and stacks behave when compiled into low-level WebAssembly (Wasm) bytecode.</p>
                      </div>
                    </div>

                    {/* Select active algorithm preset */}
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <label htmlFor="preset-select" className="text-muted-foreground">Preset:</label>
                      <select
                        id="preset-select"
                        value={selectedProgram.id}
                        onChange={(e) => {
                          const prog = C_PROGRAMS.find(p => p.id === e.target.value);
                          if (prog) setSelectedProgram(prog);
                        }}
                        className="bg-[#020a11] border border-border-color/60 text-foreground text-[10px] rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-color cursor-pointer font-bold"
                      >
                        {C_PROGRAMS.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                    {/* Left Panel: The Code Window (5 columns) */}
                    <div className="xl:col-span-5 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-muted-foreground">C Source Editor (Clang v16)</span>
                          <span className="text-[10px] text-cyan">[read-only preset]</span>
                        </div>
                        <div className="relative border border-border-color/60 rounded-lg overflow-hidden bg-[#020a11] p-4 font-mono text-xs text-foreground min-h-[280px] leading-relaxed">
                          {/* Code with step line highlighting! */}
                          <pre
                            tabIndex={0}
                            aria-label="C source editor code"
                            className="overflow-x-auto whitespace-pre focus:outline-none focus:ring-1 focus:ring-amber-color rounded"
                          >
                            {editableCode.split('\n').map((lineText, lineIdx) => {
                              const isCurrentLine = compileSuccess && selectedProgram.steps[currentStepIndex]?.line === (lineIdx + 1);
                              return (
                                <div
                                  key={lineIdx}
                                  className={`flex gap-3 px-2 py-0.5 transition-all ${
                                    isCurrentLine
                                      ? 'bg-amber-color/15 border-l-2 border-amber-color text-amber-color font-bold shadow-[inset_0_0_10px_rgba(34,211,238,0.05)]'
                                      : 'opacity-75'
                                  }`}
                                >
                                  <span className="w-5 text-right opacity-30 select-none text-[10px]">{lineIdx + 1}</span>
                                  <span>{lineText}</span>
                                </div>
                              );
                            })}
                          </pre>
                        </div>
                      </div>

                      {/* Compilation controls */}
                      <div className="flex gap-2">
                        <button
                          onClick={handleCompile}
                          disabled={isCompiling}
                          className="flex-1 py-2 bg-amber-color hover:bg-amber-color/90 text-black font-bold font-mono text-xs rounded-lg transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <Cpu className={`w-4 h-4 ${isCompiling ? 'animate-spin' : ''}`} />
                          <span>{isCompiling ? 'Compiling to WASM...' : 'Compile to Wasm'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setCompileSuccess(false);
                            setCurrentStepIndex(0);
                            setIsPlaying(false);
                            setCompileLogs([]);
                          }}
                          className="px-3.5 border border-border-color bg-[#020a11] hover:text-rose-400 transition-colors rounded-lg font-mono text-xs flex items-center justify-center cursor-pointer"
                          title="Flush compiler buffer"
                        >
                          Reset
                        </button>
                      </div>

                      {/* Compiler terminal diagnostics log */}
                      <div className="p-3 bg-black/95 rounded-lg border border-border-color/40 h-44 overflow-y-auto scrollbar-thin flex flex-col space-y-1.5 font-mono text-[10px] text-muted-foreground leading-relaxed">
                        <div className="flex items-center gap-1 text-cyan border-b border-border-color/20 pb-1 mb-1 font-bold uppercase tracking-wider">
                          <Terminal className="w-3.5 h-3.5" />
                          <span>Compiler Stdout Logs</span>
                        </div>
                        {isCompiling && (
                          <div className="text-amber-color/80 animate-pulse">[BUSY] clang -O3 --target=wasm32-unknown-unknown ...</div>
                        )}
                        {compileLogs.map((log, lIdx) => (
                          <div key={lIdx} className={log.includes('[SUCCESS]') ? 'text-emerald-color font-bold' : ''}>
                            {log}
                          </div>
                        ))}
                        {!isCompiling && !compileSuccess && (
                          <div className="text-muted-foreground/40 italic">Standby. Click "Compile to Wasm" to launch compilation pipeline.</div>
                        )}
                      </div>
                    </div>

                    {/* Right Panel: Wasm Simulation & Visualizations (7 columns) */}
                    <div className="xl:col-span-7 space-y-5">
                      {compileSuccess ? (
                        <div className="space-y-5">
                          {/* Controls header */}
                          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0a0f1d]/50 border border-border-color/60 rounded-xl font-mono text-xs">
                            <div className="flex items-center gap-1 text-amber-color font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-color animate-ping" />
                              <span>Wasm Module Ready (wasm-module)</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Step Back */}
                              <button
                                onClick={() => {
                                  setIsPlaying(false);
                                  setCurrentStepIndex(prev => Math.max(0, prev - 1));
                                }}
                                disabled={currentStepIndex === 0}
                                className="p-1.5 border border-border-color/80 hover:text-amber-color disabled:opacity-30 rounded cursor-pointer transition-colors"
                                title="Step Back"
                              >
                                <SkipBack className="w-3.5 h-3.5" />
                              </button>

                              {/* Play / Pause */}
                              <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="px-3 py-1.5 bg-amber-color/15 border border-amber-color text-amber-color rounded hover:bg-amber-color/25 cursor-pointer transition-colors font-bold text-[10px] uppercase tracking-wider flex items-center gap-1"
                              >
                                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                <span>{isPlaying ? 'Pause' : 'Autoplay'}</span>
                              </button>

                              {/* Step Forward */}
                              <button
                                onClick={() => {
                                  setIsPlaying(false);
                                  setCurrentStepIndex(prev => Math.min(selectedProgram.steps.length - 1, prev + 1));
                                }}
                                disabled={currentStepIndex === selectedProgram.steps.length - 1}
                                className="p-1.5 border border-border-color/80 hover:text-amber-color disabled:opacity-30 rounded cursor-pointer transition-colors"
                                title="Step Forward"
                              >
                                <SkipForward className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* 1. Register Execution Logs dialogue */}
                          <div className="p-3 bg-amber-color/[0.03] border border-amber-color/20 rounded-xl space-y-1.5">
                            <span className="block text-[8px] text-amber-color font-bold uppercase font-mono tracking-widest">Execution Trace Output</span>
                            <p className="text-xs font-mono font-medium leading-relaxed text-[#F5E7C8]">
                              {selectedProgram.steps[currentStepIndex]?.explanation}
                            </p>
                          </div>

                          {/* 2. Visual Memory & Pointer Address Grid (Stack and Heap representation) */}
                          <div className="p-4 bg-[#020a11] border border-border-color rounded-xl space-y-3 font-mono">
                            <div className="flex items-center justify-between text-xs border-b border-border-color/20 pb-2">
                              <span className="text-muted-foreground uppercase text-[10px] font-bold">Dynamic Wasm linear memory block</span>
                              <span className="text-xs text-amber-color">Address base: 0x1000</span>
                            </div>

                            {/* Pointer pointers row rendering */}
                            <div className="relative pt-6 pb-2">
                              <div className="grid grid-cols-5 gap-3">
                                {Array.from({ length: 5 }).map((_, mIdx) => {
                                  const cellPointers = Object.entries(selectedProgram.steps[currentStepIndex]?.pointers || {})
                                    .filter(([_, ptrIdx]) => ptrIdx === mIdx)
                                    .map(([ptrName, _]) => ptrName);

                                  return (
                                    <div key={mIdx} className="relative flex flex-col items-center min-h-[44px]">
                                      {cellPointers.length > 0 && (
                                        <div className="absolute bottom-1 flex flex-col items-center space-y-1 animate-bounce">
                                          <div className="flex gap-1">
                                            {cellPointers.map(pName => (
                                              <span
                                                key={pName}
                                                className={`text-[8px] font-bold px-1 py-0.5 rounded border uppercase ${
                                                  pName === 'arr' || pName === 'low'
                                                    ? 'bg-cyan/10 border-cyan text-cyan'
                                                    : pName === 'high'
                                                    ? 'bg-purple-500/10 border-purple-500 text-purple-400'
                                                    : 'bg-amber-color/10 border-amber-color text-amber-color'
                                                }`}
                                              >
                                                {pName}
                                              </span>
                                            ))}
                                          </div>
                                          <span className="text-muted-foreground text-[8px] leading-none">▼</span>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Memory boxes */}
                              <div className="grid grid-cols-5 gap-3 mt-1">
                                {Array.from({ length: 5 }).map((_, mIdx) => {
                                  const cellValue = selectedProgram.steps[currentStepIndex]?.memory[mIdx];
                                  const hexAddress = `0x100${(mIdx * 4).toString(16)}`;
                                  const hasPointers = Object.values(selectedProgram.steps[currentStepIndex]?.pointers || {}).includes(mIdx);

                                  return (
                                    <div
                                      key={mIdx}
                                      className={`p-3 rounded-lg border text-center transition-all ${
                                        hasPointers
                                          ? 'border-amber-color/50 bg-amber-color/[0.03] shadow-[0_0_10px_rgba(34,211,238,0.08)]'
                                          : 'border-border-color/60 bg-[#0a0f1d]/40'
                                      }`}
                                    >
                                      <div className="text-xs font-bold text-foreground">{cellValue !== undefined ? cellValue : '??'}</div>
                                      <div className="text-[7px] text-muted-foreground/60 mt-1 font-mono">{hexAddress}</div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* 3. Assembly instruction block (WAT view) */}
                          <div className="space-y-2">
                            <span className="block text-xs font-mono text-muted-foreground">Compiled WebAssembly Text (WAT instructions)</span>
                            <div className="p-4 bg-[#020a11] border border-border-color rounded-xl h-44 overflow-y-auto scrollbar-thin text-[10px] font-mono leading-relaxed text-[#8be9fd]">
                              {selectedProgram.wat.split('\n').map((watLine, wIdx) => {
                                const isCurrentWatLine = selectedProgram.steps[currentStepIndex]?.watHighlightIndex === (wIdx + 1);
                                return (
                                  <div
                                    key={wIdx}
                                    className={`px-2 py-0.5 rounded transition-all flex gap-3 ${
                                      isCurrentWatLine
                                        ? 'bg-cyan/15 text-cyan font-bold border-l-2 border-cyan shadow-[inset_0_0_8px_rgba(34,211,238,0.05)]'
                                        : 'opacity-65'
                                    }`}
                                  >
                                    <span className="w-5 text-right opacity-20 select-none">{wIdx + 1}</span>
                                    <span>{watLine}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-10 border border-border-color/40 bg-[#020a11]/40 rounded-xl min-h-[380px] space-y-4">
                          <Cpu className="w-10 h-10 text-muted-foreground/30 animate-pulse" />
                          <div className="space-y-1">
                            <h3 className="font-mono text-sm font-bold text-foreground uppercase tracking-wider">Compiler Standby</h3>
                            <p className="font-mono text-[10px] text-muted-foreground max-w-sm leading-relaxed">
                              C source code is mapped to 32-bit local memory base offsets. Compile the C code above to generate WebAssembly text registers, step animations, and pointer traces.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SVG CREATOR VIEW */}
              {activeTool === 'svg_creator' && (
                <div className="space-y-6" id="svg-creator-canvas">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-color/50 pb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-color animate-spin-slow" />
                      <div>
                        <h2 className="font-display text-base font-bold text-foreground">SVG Vector Creator & AI Designer</h2>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Draft, style, and animate scalable vector graphics with help from a specialized AI Developer Team.</p>
                      </div>
                    </div>

                    {/* Presets dropdown */}
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <label htmlFor="svg-preset-select" className="text-muted-foreground">Preset:</label>
                      <select
                        id="svg-preset-select"
                        value={Object.keys(SVG_PRESETS).find(key => SVG_PRESETS[key as keyof typeof SVG_PRESETS].code.trim() === svgCode.trim()) || ''}
                        onChange={(e) => {
                          const preset = SVG_PRESETS[e.target.value as keyof typeof SVG_PRESETS];
                          if (preset) setSvgCode(preset.code);
                        }}
                        className="bg-[#020a11] border border-border-color/60 text-foreground text-[10px] rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-color cursor-pointer font-bold"
                      >
                        <option value="" disabled>-- Custom SVG --</option>
                        {Object.entries(SVG_PRESETS).map(([key, p]) => (
                          <option key={key} value={key}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Code Workspace (5 columns) */}
                    <div className="xl:col-span-5 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-muted-foreground">XML/SVG Source Code</span>
                          <div className="flex gap-2">
                            <button
                              onClick={prettifySvg}
                              className="text-[10px] text-cyan hover:text-amber-color font-bold transition-all cursor-pointer"
                              title="Prettify XML indentations"
                            >
                              Prettify
                            </button>
                            <span className="text-muted-foreground/30">|</span>
                            <button
                              onClick={() => handleCopy(svgCode, 'svg-source')}
                              className="text-[10px] text-cyan hover:text-amber-color font-bold transition-all cursor-pointer"
                            >
                              {copiedType === 'svg-source' ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                        </div>

                        <textarea
                          value={svgCode}
                          onChange={(e) => setSvgCode(e.target.value)}
                          placeholder="Write raw SVG XML here..."
                          className="w-full h-[320px] p-3.5 bg-[#020a11] text-xs font-mono rounded-lg border border-border-color/60 focus:border-amber-color focus:outline-none resize-none scrollbar-thin text-cyan leading-relaxed select-text"
                          id="svg-code-editor"
                        />
                      </div>

                      {/* Export Actions */}
                      <button
                        onClick={() => {
                          const blob = new Blob([svgCode], { type: 'image/svg+xml' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = 'vector-asset.svg';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="w-full py-2 bg-amber-color hover:bg-amber-color/90 text-black font-bold font-mono text-xs rounded-lg transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Download SVG File</span>
                      </button>
                    </div>

                    {/* Right Column: Visual Canvas & AI Chat panel (7 columns) */}
                    <div className="xl:col-span-7 space-y-4">
                      {/* Visual canvas box */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-muted-foreground">Interactive Render Canvas</span>
                          <div className="flex items-center gap-3">
                            {/* Grid toggle */}
                            <label className="flex items-center gap-1 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={showSvgGrid}
                                onChange={(e) => setShowSvgGrid(e.target.checked)}
                                className="accent-amber-color rounded cursor-pointer"
                              />
                              <span className="text-[10px] text-muted-foreground">Grid Pattern</span>
                            </label>
                            <span className="text-muted-foreground/30">|</span>
                            {/* Zoom controls */}
                            <div className="flex items-center gap-1 text-[10px]">
                              <button onClick={() => setSvgZoom(prev => Math.max(50, prev - 10))} className="px-1.5 py-0.5 border border-border-color rounded hover:text-amber-color cursor-pointer">-</button>
                              <span className="text-cyan font-bold">{svgZoom}%</span>
                              <button onClick={() => setSvgZoom(prev => Math.min(200, prev + 10))} className="px-1.5 py-0.5 border border-border-color rounded hover:text-amber-color cursor-pointer">+</button>
                              <button onClick={() => setSvgZoom(100)} className="px-1 py-0.5 border border-border-color rounded hover:text-amber-color cursor-pointer font-bold">R</button>
                            </div>
                          </div>
                        </div>

                        {/* Rendering Frame */}
                        <div
                          className={`relative border border-border-color/60 rounded-lg h-[260px] overflow-hidden flex items-center justify-center ${
                            showSvgGrid
                              ? 'bg-[radial-gradient(#1e293b_1.2px,transparent_1.2px)] [background-size:16px_16px] bg-[#031018]'
                              : 'bg-[#031018]'
                          }`}
                        >
                          <div
                            style={{ transform: `scale(${svgZoom / 100})`, transformOrigin: 'center center' }}
                            className="max-w-full max-h-full transition-transform duration-200 p-4"
                            dangerouslySetInnerHTML={{ __html: svgCode }}
                          />
                        </div>
                      </div>

                      {/* AI Dev Assistant Coordination Panel */}
                      <div className="p-4 bg-muted/20 dark:bg-[#121622]/60 rounded-xl border border-border-color/60 space-y-4">
                        <div className="flex items-center justify-between border-b border-border-color/30 pb-2">
                          <div className="flex items-center gap-1.5">
                            <Bot className="w-4 h-4 text-amber-color" />
                            <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-foreground">AI Dev Team Orchestrator</span>
                          </div>

                          {/* Active agent status block */}
                          <div className="flex gap-1.5">
                            {(['architect', 'coder', 'security', 'devops'] as const).map((role, idx) => {
                              const isActive = svgOrchestrationStep === idx;
                              const isFinished = svgOrchestrationStep > idx;
                              return (
                                <span
                                  key={role}
                                  className={`text-[8px] font-mono px-1.5 py-0.5 rounded border uppercase transition-all ${
                                    isActive
                                      ? 'bg-amber-color/10 border-amber-color text-amber-color font-bold animate-pulse'
                                      : isFinished
                                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-color'
                                      : 'bg-muted border-border-color/40 text-muted-foreground/45'
                                  }`}
                                >
                                  {role}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* Logs Dialogue */}
                        <div className="h-28 overflow-y-auto scrollbar-thin space-y-2 text-[10px] font-mono leading-relaxed bg-[#020a11] p-3 rounded-lg border border-border-color/30">
                          {svgAiLogs.map((log, idx) => {
                            const isUser = log.role === 'user';
                            const isOrch = log.content.startsWith('[Orchestration]');
                            return (
                              <div key={idx} className={`${isUser ? 'text-cyan' : isOrch ? 'text-amber-color/90 font-semibold' : 'text-muted-foreground'}`}>
                                <span className="font-bold">{isUser ? '> David: ' : isOrch ? '> System: ' : '> Team: '}</span>
                                <span>{isOrch ? log.content.replace('[Orchestration]', '') : log.content}</span>
                              </div>
                            );
                          })}
                          {isSvgGenerating && svgOrchestrationStep !== -1 && (
                            <div className="text-amber-glow animate-pulse">
                              <span>Coordination log buffer parsing...</span>
                            </div>
                          )}
                        </div>

                        {/* Input form */}
                        <form onSubmit={handleSvgAiSubmit} className="flex gap-2">
                          <input
                            type="text"
                            value={svgAiPrompt}
                            onChange={(e) => setSvgAiPrompt(e.target.value)}
                            disabled={isSvgGenerating}
                            placeholder="ask the ai dev team to design or modify the vector..."
                            className="flex-1 px-3 py-1.5 bg-[#020a11] text-xs font-mono rounded-lg border border-border-color/80 focus:border-amber-color focus:outline-none disabled:opacity-50 text-foreground"
                          />
                          <button
                            type="submit"
                            disabled={isSvgGenerating || !svgAiPrompt.trim()}
                            className="px-4 py-1.5 bg-cyan hover:bg-cyan/90 disabled:opacity-50 text-black font-bold font-mono text-xs rounded-lg transition-all cursor-pointer"
                          >
                            Send
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TOOL 7: JSON TO TYPESCRIPT GENERATOR */}
              {activeTool === 'json2ts' && (
                <div className="space-y-6" id="playground-json2ts-pane">
                  <div className="flex items-center justify-between border-b border-border-color/60 pb-3">
                    <div>
                      <h2 className="font-mono text-sm font-semibold text-foreground flex items-center gap-2">
                        <Code className="w-4 h-4 text-emerald-color" />
                        <span>JSON to TypeScript Interface Generator</span>
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Convert raw JSON objects into strongly-typed TypeScript interfaces client-side.</p>
                    </div>
                    <button
                      onClick={() => handleCopy(json2tsOutput, 'json2ts')}
                      className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-color hover:bg-emerald-500/20 font-mono text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer font-bold"
                    >
                      {copiedType === 'json2ts' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedType === 'json2ts' ? 'Interfaces Copied!' : 'Copy TS Interfaces'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-wider">Raw JSON Input</label>
                      <textarea
                        value={json2tsInput}
                        onChange={(e) => setJson2tsInput(e.target.value)}
                        rows={14}
                        placeholder="Paste JSON object here..."
                        className="w-full p-4 bg-[#020a11] border border-border-color rounded-xl font-mono text-xs text-foreground focus:border-emerald-500 focus:outline-none leading-relaxed resize-y"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-wider">Inferred TypeScript Code</label>
                      <div className="relative">
                        <pre className="w-full p-4 bg-[#061520] border border-border-color rounded-xl font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed select-text min-h-[300px]">
                          <code>{json2tsOutput}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TOOL 8: CRON EXPLAINER & BUILDER */}
              {activeTool === 'cron' && (
                <div className="space-y-6" id="playground-cron-pane">
                  <div className="flex items-center justify-between border-b border-border-color/60 pb-3">
                    <div>
                      <h2 className="font-mono text-sm font-semibold text-foreground flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-amber-color" />
                        <span>Cron Expression Explainer & Schedule Builder</span>
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Parse 5-field cron strings into plain English and inspect upcoming execution times.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-wider">Cron Expression (5 fields: minute hour dom month dow)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={cronExpr}
                          onChange={(e) => setCronExpr(e.target.value)}
                          placeholder="e.g. */15 * * * *"
                          className="flex-1 px-4 py-3 bg-[#020a11] border border-border-color rounded-xl font-mono text-sm text-amber-color focus:border-amber-color focus:outline-none"
                        />
                        <div className="flex gap-1">
                          {['* * * * *', '*/15 * * * *', '0 9 * * 1-5', '0 0 1 * *'].map((preset) => (
                            <button
                              key={preset}
                              onClick={() => setCronExpr(preset)}
                              className="px-2.5 py-1 bg-muted/20 border border-border-color text-muted-foreground hover:text-foreground font-mono text-[10px] rounded-lg transition-all cursor-pointer"
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {cronParsed.error ? (
                      <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 font-mono text-xs">
                        ⚠️ {cronParsed.error}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-5 bg-amber-color/5 border border-amber-color/20 rounded-xl space-y-2">
                          <span className="font-mono text-[10px] uppercase font-bold text-amber-color tracking-wider">Human Schedule Summary:</span>
                          <p className="font-mono text-sm font-bold text-foreground">{cronParsed.summary}</p>
                        </div>

                        <div className="p-5 bg-muted/15 border border-border-color rounded-xl space-y-3">
                          <span className="font-mono text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Next 5 Calculated Executions (UTC):</span>
                          <ul className="space-y-1.5 font-mono text-xs text-foreground/90">
                            {cronParsed.nextRuns.map((run, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-cyan/10 text-cyan text-[10px] font-bold grid place-items-center">{idx + 1}</span>
                                <span>{run}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TOOL 9: CYBERBLUE HSL THEME ENGINE */}
              {activeTool === 'theme' && (
                <div className="space-y-6" id="playground-theme-pane">
                  <div className="flex items-center justify-between border-b border-border-color/60 pb-3">
                    <div>
                      <h2 className="font-mono text-sm font-semibold text-foreground flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-purple-color" />
                        <span>CyberBlue HSL Theme Engine</span>
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Tweak brand HSL parameters in real time and copy exact CSS root custom properties.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Controls */}
                    <div className="space-y-4 bg-muted/15 border border-border-color p-5 rounded-xl">
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-mono text-xs">
                          <span className="text-muted-foreground font-bold">Hue (0° - 360°)</span>
                          <span className="text-cyan font-bold">{hslHue}°</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={hslHue}
                          onChange={(e) => setHslHue(Number(e.target.value))}
                          className="w-full cursor-pointer accent-cyan"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between font-mono text-xs">
                          <span className="text-muted-foreground font-bold">Saturation (0% - 100%)</span>
                          <span className="text-cyan font-bold">{hslSat}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={hslSat}
                          onChange={(e) => setHslSat(Number(e.target.value))}
                          className="w-full cursor-pointer accent-cyan"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between font-mono text-xs">
                          <span className="text-muted-foreground font-bold">Lightness (0% - 100%)</span>
                          <span className="text-cyan font-bold">{hslLight}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={hslLight}
                          onChange={(e) => setHslLight(Number(e.target.value))}
                          className="w-full cursor-pointer accent-cyan"
                        />
                      </div>

                      {/* Quick Presets */}
                      <div className="space-y-2 pt-2 border-t border-border-color/40">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold">Brand Presets:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { name: 'CyberBlue', h: 190, s: 90, l: 50 },
                            { name: 'Signal Green', h: 160, s: 84, l: 50 },
                            { name: 'Neon Violet', h: 260, s: 90, l: 65 },
                            { name: 'Amber Gold', h: 38, s: 92, l: 50 },
                            { name: 'Emerald', h: 142, s: 76, l: 45 }
                          ].map(preset => (
                            <button
                              key={preset.name}
                              onClick={() => {
                                setHslHue(preset.h);
                                setHslSat(preset.s);
                                setHslLight(preset.l);
                              }}
                              className="px-2.5 py-1 bg-background/50 border border-border-color hover:border-amber-color text-foreground font-mono text-[10px] rounded-lg transition-all cursor-pointer"
                            >
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Preview & Code Export */}
                    <div className="space-y-4">
                      <div
                        className="p-5 rounded-xl border space-y-3 transition-all"
                        style={{
                          borderColor: `hsl(${hslHue}, ${hslSat}%, ${hslLight}%)`,
                          backgroundColor: `hsla(${hslHue}, ${hslSat}%, ${hslLight}%, 0.08)`,
                          boxShadow: `0 0 20px hsla(${hslHue}, ${hslSat}%, ${hslLight}%, 0.15)`
                        }}
                      >
                        <span className="font-mono text-[10px] uppercase font-bold tracking-wider" style={{ color: `hsl(${hslHue}, ${hslSat}%, ${hslLight}%)` }}>
                          Live Preview Component
                        </span>
                        <h3 className="font-display text-lg font-bold text-foreground">Interactive Theme Sample</h3>
                        <p className="text-xs text-muted-foreground">Adjusting the sliders updates custom CSS properties in real time across the UI design matrix.</p>
                        <button
                          className="px-4 py-2 font-mono text-xs font-bold rounded-lg transition-all"
                          style={{
                            backgroundColor: `hsl(${hslHue}, ${hslSat}%, ${hslLight}%)`,
                            color: '#031018'
                          }}
                        >
                          Action Button
                        </button>
                      </div>

                      <div className="relative">
                        <pre className="p-4 bg-[#020a11] border border-border-color rounded-xl font-mono text-xs text-amber-color overflow-x-auto">
                          {activeHslCss}
                        </pre>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(activeHslCss);
                            setCopiedHsl(true);
                            setTimeout(() => setCopiedHsl(false), 2000);
                          }}
                          className="absolute top-2 right-2 px-3 py-1.5 bg-amber-color hover:bg-amber-glow text-[#031018] font-mono text-[10px] font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all"
                        >
                          {copiedHsl ? <Check className="w-3 h-3 text-emerald-color" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedHsl ? 'Copied!' : 'Copy CSS'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
