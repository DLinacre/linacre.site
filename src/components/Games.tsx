import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Gamepad2, Play, Heart, Code2, Sparkles, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface GameItem {
  title: string;
  tagline: string;
  desc: string;
  tags: string[];
  tech: string;
  badge: 'Live' | 'Built-in' | 'In development';
  play: string;
  source: string;
  thumb?: string; // 16:9 banner artwork, rendered as the card thumbnail
}

const GAMES_DATA: GameItem[] = [
  {
    title: 'Slime Factory Tycoon',
    tagline: 'Production-ready open-source Roblox idle tycoon & interactive web demo',
    desc: 'Complete server-authoritative Roblox idle tycoon template featuring session-locked DataStores, pets engine, offline earnings, hatch odds display, balance simulator, and automated verification.',
    tags: ['Roblox', 'Tycoon', 'Idle', 'Simulation', 'Luau'],
    tech: 'Roblox Luau · Python Sim · TypeScript · HTML5',
    badge: 'In development',
    thumb: '/banners/slime-factory-tycoon.webp',
    play: 'https://dlinacre.github.io/slime-factory-tycoon/',
    source: 'https://github.com/DLinacre/slime-factory-tycoon',
  },
  {
    title: 'KushCloud',
    tagline: 'Chill one-tap browser arcade flyer with synthesized audio',
    desc: 'Pass through procedural obstacles, earn coins, unlock worlds and custom cosmetics. Features Web Audio sound synthesis and a global leaderboard.',
    tags: ['Arcade', 'One-tap', 'Web Audio', 'Leaderboard'],
    tech: 'React · TypeScript · Vite · Canvas 2D',
    badge: 'Live',
    thumb: '/banners/kushcloud.webp',
    play: 'https://dlinacre.github.io/KushCloud/',
    source: 'https://github.com/DLinacre/KushCloud',
  },
  {
    title: 'Tap & Slap',
    tagline: "Dance-mat beat 'em up — tap to kill enemies ON the beat",
    desc: "Four neon lanes, one rule: every enemy dies on the downbeat. Tap a pad or hammer the arrows — PERFECT hits build an 8× combo, misses cost health. Original procedural synthwave fight music, daily challenges and leaderboards.",
    tags: ['Rhythm', "Beat 'em up", 'Dance-mat', 'Synthwave', 'Web Audio'],
    tech: 'Next.js 15 · Phaser 3 · TypeScript · Prisma',
    badge: 'Live',
    thumb: '/banners/tap-and-slap.webp',
    play: 'https://tap-and-slap.vercel.app',
    source: 'https://github.com/DLinacre/tap-and-slap',
  },
  {
    title: 'AFTERGLOW',
    tagline: 'Paint with long-exposure light — an original endless light-painting game',
    desc: 'Swing your light trail through the dark and chase the glow. A relaxed, original arcade experience with procedural palettes and unlockable trails.',
    tags: ['Arcade', 'Light-painting', 'Casual', 'Canvas 2D'],
    tech: 'Vanilla JS · Canvas 2D · Web Audio',
    badge: 'Live',
    thumb: '/projects/afterglow.webp',
    play: 'https://dlinacre.github.io/afterglow/',
    source: 'https://github.com/DLinacre/afterglow',
  },
  {
    title: 'Pixel Heist',
    tagline: 'Cyberpunk stealth-heist arcade — hack terminals, dodge lasers, escape with loot',
    desc: 'Procedural neon vault levels with security lasers and hack terminals. Sneak, hack and sprint your way out — leaderboards included.',
    tags: ['Stealth', 'Cyberpunk', 'Arcade', 'Leaderboard'],
    tech: 'Next.js 15 · Phaser 3 · React 19 · TypeScript',
    badge: 'Live',
    thumb: '/banners/pixel-heist.webp',
    play: 'https://dlinacre.github.io/pixel-heist/',
    source: 'https://github.com/DLinacre/pixel-heist',
  },
  {
    title: 'Dragon Rush Heroes',
    tagline: 'Anime action-RPG card battler — 464 fighters, real-time Arts combat',
    desc: 'Provably-fair gacha summons, Web Audio soundtracks and an offline save. Assemble your roster and battle through the rush.',
    tags: ['Card battler', 'Action RPG', 'Anime', 'Web Audio'],
    tech: 'Vanilla JS · Canvas 2D · Web Audio',
    badge: 'Live',
    thumb: '/banners/dragon-rush-heroes.webp',
    play: 'https://dlinacre.github.io/dragon-rush-heroes/',
    source: 'https://github.com/DLinacre/dragon-rush-heroes',
  },
  {
    title: 'Circuit',
    tagline: 'Rotate every wire until the whole grid lights up',
    desc: 'Procedurally generated spanning-tree puzzles that are always solvable and never start solved. Par is the true minimum turn count, so there is a reason to replay a board. New daily grid shared by everyone.',
    tags: ['Puzzle', 'Daily', 'Touch-friendly', 'Offline'],
    tech: 'Vanilla JS · SVG · Web Audio',
    badge: 'Live',
    play: '/games/circuit',
    source: 'https://github.com/DLinacre/linacre.site',
  },
  {
    title: 'Decrypt',
    tagline: 'Crack a four-symbol code in eight guesses',
    desc: 'Pure deduction — filled pegs mean right symbol, right slot; hollow pegs mean right symbol, wrong slot. Daily code with a streak counter, plus challenge links that put a friend on your exact code.',
    tags: ['Logic', 'Daily', 'Challenge links'],
    tech: 'Vanilla JS · Seeded RNG · Web Audio',
    badge: 'Live',
    play: '/games/decrypt',
    source: 'https://github.com/DLinacre/linacre.site',
  },
  {
    title: 'Pulse',
    tagline: 'Repeat the signal, one step longer each round',
    desc: 'Nine pads, each with its own note. The daily signal is identical for everyone, so scores compare directly. Duel mode is pass-and-play: repeat what is there, then add a step of your own.',
    tags: ['Memory', 'Duel', 'Daily', 'Web Audio'],
    tech: 'Vanilla JS · Seeded RNG · Web Audio',
    badge: 'Live',
    play: '/games/pulse',
    source: 'https://github.com/DLinacre/linacre.site',
  },
  {
    title: 'Trigger',
    tagline: 'One phone flat on the table, two thumbs',
    desc: 'A half each, the top half deliberately upside down. Green means go, first thumb down takes the round, first to five takes the match. Amber signals are traps that punish itchy thumbs. Solo mode times your reaction over five signals.',
    tags: ['2 player', 'Reflex', 'One device'],
    tech: 'Vanilla JS · performance.now() · Vibration API',
    badge: 'Live',
    play: '/games/trigger',
    source: 'https://github.com/DLinacre/linacre.site',
  },
  {
    title: 'Gridlock',
    tagline: 'Draw a line, close a square, go again',
    desc: 'Territory duel on a 3×3 to 5×5 board. Pass the phone, or take on an AI that grabs free squares, refuses to hand you a third side, and gives away the shortest chain it can when forced.',
    tags: ['2 player', 'Strategy', 'Vs AI'],
    tech: 'Vanilla JS · SVG · Chain-aware AI',
    badge: 'Live',
    play: '/games/gridlock',
    source: 'https://github.com/DLinacre/linacre.site',
  },
  {
    title: 'Snake',
    tagline: 'Classic arcade Snake built into the page',
    desc: 'Built in vanilla JavaScript on Canvas 2D: direction queueing, speed scaling, local high score persistence, touch swipe gestures, and Web Audio synthesised sound blips.',
    tags: ['Arcade', 'Built-in', 'Touch-friendly', 'Web Audio'],
    tech: 'Vanilla JS · Canvas 2D · Web Audio',
    badge: 'Built-in',
    play: '#snake',
    source: 'https://github.com/DLinacre/linacre.site',
  },
];

export default function Games() {
  const [filter, setFilter] = useState<'all' | 'favs'>('all');
  const [favs, setFavs] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('dlg_favs') || '[]');
    } catch {
      return [];
    }
  });

  const [muted, setMuted] = useState<boolean>(() => localStorage.getItem('dlg_muted') === 'true');
  const [snakeOpen, setSnakeOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('dlg_snakeHigh') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [gameState, setGameState] = useState<'idle' | 'run' | 'over'>('idle');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const closeSnakeRef = useRef<HTMLButtonElement>(null);
  const dirRef = useRef({ x: 1, y: 0 });
  const queueRef = useRef<{ x: number; y: number }[]>([]);
  const snakeRef = useRef<{ x: number; y: number }[]>([]);
  const foodRef = useRef({ x: 5, y: 5 });
  const speedRef = useRef(120);
  const lastStepRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSynthSound = (type: 'step' | 'food' | 'over') => {
    if (muted) return;
    try {
      if (!audioCtxRef.current && typeof AudioContext !== 'undefined') {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === 'step') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'food') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(880, now + 0.06);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'over') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('dlg_favs', JSON.stringify(favs));
    } catch (e) {
      console.error(e);
    }
  }, [favs]);

  const toggleFav = (title: string) => {
    setFavs(prev => (prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]));
  };

  const toggleMute = () => {
    setMuted(m => {
      const next = !m;
      try {
        localStorage.setItem('dlg_muted', String(next));
      } catch {}
      return next;
    });
  };

  const filteredGames = GAMES_DATA.filter(g => {
    if (filter === 'favs') return favs.includes(g.title);
    return true;
  });

  // Built-in Snake game logic
  const N = 20;

  const placeFood = () => {
    let guard = 0;
    let f = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) };
    while (snakeRef.current.some(s => s.x === f.x && s.y === f.y) && guard < 400) {
      f = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) };
      guard++;
    }
    foodRef.current = f;
  };

  const startSnake = () => {
    snakeRef.current = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    dirRef.current = { x: 1, y: 0 };
    queueRef.current = [];
    speedRef.current = 120;
    setScore(0);
    setGameState('run');
    placeFood();
    lastStepRef.current = performance.now();
    playSynthSound('step');
  };

  const pushDir = (m: [number, number]) => {
    const last = queueRef.current[queueRef.current.length - 1] || dirRef.current;
    if (
      queueRef.current.length < 3 &&
      (m[0] !== last.x || m[1] !== last.y) &&
      (m[0] !== -last.x || m[1] !== -last.y)
    ) {
      queueRef.current.push({ x: m[0], y: m[1] });
    }
  };

  const stepSnake = () => {
    if (queueRef.current.length) {
      dirRef.current = queueRef.current.shift()!;
    }
    const head = {
      x: snakeRef.current[0].x + dirRef.current.x,
      y: snakeRef.current[0].y + dirRef.current.y,
    };

    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= N ||
      head.y >= N ||
      snakeRef.current.some(s => s.x === head.x && s.y === head.y)
    ) {
      setGameState('over');
      playSynthSound('over');
      setScore(s => {
        if (s > highScore) {
          setHighScore(s);
          try {
            localStorage.setItem('dlg_snakeHigh', String(s));
          } catch {}
        }
        return s;
      });
      return;
    }

    snakeRef.current.unshift(head);
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      setScore(s => s + 10);
      speedRef.current = Math.max(62, speedRef.current - 1.5);
      playSynthSound('food');
      placeFood();
    } else {
      snakeRef.current.pop();
      playSynthSound('step');
    }
  };

  const drawSnake = () => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const cell = cv.width / N;
    ctx.fillStyle = '#04060c';
    ctx.fillRect(0, 0, cv.width, cv.height);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 1; i < N; i++) {
      ctx.moveTo(i * cell, 0);
      ctx.lineTo(i * cell, cv.height);
      ctx.moveTo(0, i * cell);
      ctx.lineTo(cv.width, i * cell);
    }
    ctx.stroke();

    // Food (Signal Green)
    ctx.shadowColor = '#34d399';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#34d399';
    ctx.fillRect(foodRef.current.x * cell + 2, foodRef.current.y * cell + 2, cell - 4, cell - 4);
    ctx.shadowBlur = 0;

    // Snake Body
    snakeRef.current.forEach((s, i) => {
      if (i === 0) {
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#22d3ee';
      } else {
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(34, 211, 238, ${0.85 - (i / snakeRef.current.length) * 0.4})`;
      }
      ctx.fillRect(s.x * cell + 1, s.y * cell + 1, cell - 2, cell - 2);
    });
    ctx.shadowBlur = 0;
  };

  useEffect(() => {
    if (!snakeOpen) return;

    const loop = (t: number) => {
      if (gameState === 'run' && t - lastStepRef.current > speedRef.current) {
        lastStepRef.current = t;
        stepSnake();
      }
      drawSnake();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [snakeOpen, gameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!snakeOpen) return;
      const k = e.key.toLowerCase();
      if (k === 'escape') {
        setSnakeOpen(false);
        return;
      }
      if (k === 'enter') {
        e.preventDefault();
        if (gameState !== 'run') startSnake();
        return;
      }
      const move = {
        arrowup: [0, -1],
        w: [0, -1],
        arrowdown: [0, 1],
        s: [0, 1],
        arrowleft: [-1, 0],
        a: [-1, 0],
        arrowright: [1, 0],
        d: [1, 0],
      }[k] as [number, number] | undefined;

      if (move) {
        e.preventDefault();
        pushDir(move);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [snakeOpen, gameState]);

  // Dialog semantics: focus the close button on open, restore focus on close,
  // and pause the loop when the tab is hidden (WCAG 2.2.2 / battery).
  useEffect(() => {
    if (snakeOpen) {
      closeSnakeRef.current?.focus();
      return;
    }
    const playBtn = document.querySelector<HTMLButtonElement>('[data-play-snake]');
    playBtn?.focus();
  }, [snakeOpen]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) setGameState(s => (s === 'run' ? 'idle' : s));
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <section className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20 font-mono text-xs text-amber-color">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-color" />
          <span>DAVID LINACRE · GAMES HUB</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
          Playable browser games <span className="text-amber-color">built by me</span>
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Real, playable games made from scratch — zero filler or fake data. Play right in your
          browser or inspect the source on GitHub.
        </p>
      </section>

      {/* Filter Bar & Audio Control */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-color pb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 font-mono text-xs rounded-lg border transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-amber-color/10 border-amber-color text-amber-color font-bold shadow-[0_0_12px_rgba(251,191,36,0.15)]'
                : 'bg-muted/30 border-border-color text-muted-foreground hover:text-foreground'
            }`}
          >
            All Games
          </button>

          <button
            onClick={() => setFilter('favs')}
            className={`px-3 py-1.5 font-mono text-xs rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === 'favs'
                ? 'bg-amber-color/10 border-amber-color text-amber-color font-bold shadow-[0_0_12px_rgba(251,191,36,0.15)]'
                : 'bg-muted/30 border-border-color text-muted-foreground hover:text-foreground'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>Favourites</span>
            <span className="bg-amber-color/20 text-amber-color px-1.5 py-0.2 rounded text-[10px] font-bold">
              {favs.length}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleMute}
            className="px-3 py-1.5 rounded-lg border border-border-color bg-muted/20 font-mono text-xs text-muted-foreground hover:text-foreground hover:border-amber-color/40 flex items-center gap-1.5 cursor-pointer"
            title="Toggle Web Audio"
          >
            {muted ? (
              <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-amber-color" />
            )}
            <span>{muted ? 'Muted' : 'Audio On'}</span>
          </button>

          <div className="font-mono text-xs text-muted-foreground flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-amber-color" />
            <span>
              Showing {filteredGames.length} of {GAMES_DATA.length} games
            </span>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGames.map(game => {
          const isFav = favs.includes(game.title);
          const isBuiltIn = game.play === '#snake';
          const badgeClasses =
            game.badge === 'In development'
              ? 'bg-amber-color/10 text-amber-color border-amber-color/30'
              : isBuiltIn
                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                : 'bg-emerald-500/10 text-emerald-color border-emerald-500/20';

          return (
            <motion.div
              key={game.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-muted/20 dark:bg-[#0B1220]/80 border border-amber-color/15 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-amber-color/40 transition-all shadow-[var(--linacre-card-shadow)]"
            >
              {game.thumb && (
                <div className="relative aspect-video overflow-hidden border-b border-border-color/50 bg-muted/30">
                  <img
                    src={game.thumb}
                    alt={`${game.title} banner`}
                    width={1200}
                    height={675}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  {game.badge === 'In development' && (
                    <span className="absolute top-2.5 left-2.5 font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/60 text-amber-color border border-amber-color/40 backdrop-blur-sm">
                      Open source · in development
                    </span>
                  )}
                </div>
              )}
              <div className="p-6 flex flex-col justify-between space-y-4 flex-1">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeClasses}`}
                  >
                    {game.badge}
                  </span>

                  <button
                    onClick={() => toggleFav(game.title)}
                    aria-pressed={isFav}
                    aria-label={isFav ? `Remove ${game.title} from favourites` : `Add ${game.title} to favourites`}
                    title={isFav ? 'Remove from favourites' : 'Add to favourites'}
                    className="p-1.5 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 ${isFav ? 'text-rose-400 fill-rose-400' : 'text-muted-foreground'}`}
                    />
                  </button>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">{game.title}</h3>
                  <p className="font-mono text-xs text-amber-color mt-0.5">{game.tagline}</p>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">{game.desc}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {game.tags.map(t => (
                    <span
                      key={t}
                      className="font-mono text-[10px] bg-muted/40 px-2 py-0.5 rounded border border-border-color/50 text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border-color/50 flex items-center justify-between gap-3 font-mono text-xs">
                <span className="text-[10px] text-muted-foreground">{game.tech}</span>

                <div className="flex items-center gap-2">
                  <a
                    href={game.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg border border-border-color hover:border-amber-color/40 text-foreground text-xs font-mono font-bold hover:bg-muted/40 transition-all flex items-center gap-1"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Code</span>
                  </a>

                  {isBuiltIn ? (
                    <button
                      onClick={() => {
                        setSnakeOpen(true);
                        startSnake();
                      }}
                      data-play-snake
                      className="px-3 py-1.5 rounded-lg bg-amber-color text-[#030c14] font-mono text-xs font-bold hover:bg-amber-glow transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Now</span>
                    </button>
                  ) : (
                    <a
                      href={game.play}
                      target={game.play.startsWith('/') ? undefined : '_blank'}
                      rel={game.play.startsWith('/') ? undefined : 'noopener noreferrer'}
                      className="px-3 py-1.5 rounded-lg bg-amber-color text-[#030c14] font-mono text-xs font-bold hover:bg-amber-glow transition-all flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Game</span>
                    </a>
                  )}
                </div>
              </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Embedded Snake Game Modal */}
      {snakeOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="snake-modal-title"
          className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-md p-4"
        >
          <div className="bg-[#0a0f1c] border border-amber-color/30 rounded-2xl p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-display font-bold text-lg text-foreground">
                <Gamepad2 className="w-5 h-5 text-amber-color" />
                <span id="snake-modal-title">
                  SNAKE <span className="font-mono text-xs text-amber-color">· BUILT-IN</span>
                </span>
              </div>
              <button
                ref={closeSnakeRef}
                onClick={() => setSnakeOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer font-mono text-xs"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex items-center justify-between font-mono text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-xl">
              <span>
                SCORE: <b className="text-amber-color text-sm">{score}</b>
              </span>
              <span>
                BEST: <b className="text-amber-color text-sm">{highScore}</b>
              </span>
              <button
                onClick={startSnake}
                className="px-3 py-1 rounded-lg bg-amber-color text-[#030c14] font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restart</span>
              </button>
            </div>

            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="w-full aspect-square bg-[#04060c] rounded-xl border border-border-color"
            >
              <p className="sr-only">
                Snake game — use arrow keys or WASD to steer, Enter to restart, Escape to close.
              </p>
            </canvas>

            <p className="font-mono text-[10px] text-muted-foreground text-center">
              USE ARROW KEYS / WASD / SWIPE TO MOVE · ENTER TO RETRY · ESC TO QUIT
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
