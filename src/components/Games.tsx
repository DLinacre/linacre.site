import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Gamepad2, Play, Heart, Code2, Sparkles, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { lazy, Suspense } from 'react';

const GameShowcase = lazy(() => import('./GameShowcase'));

interface GameItem {
  title: string;
  tagline: string;
  desc: string;
  tags: string[];
  tech: string;
  badge: 'Live' | 'Built-in' | 'In development';
  play: string;
  source: string;
}

const GAMES_DATA: GameItem[] = [
  {
    title: 'KushCloud',
    tagline: 'Chill one-tap browser arcade flyer with synthesized audio',
    desc: 'Pass through procedural obstacles, earn coins, unlock worlds and custom cosmetics. Features Web Audio sound synthesis and a global leaderboard.',
    tags: ['Arcade', 'One-tap', 'Web Audio', 'Leaderboard'],
    tech: 'React · TypeScript · Vite · Canvas 2D',
    badge: 'Live',
    play: 'https://lin4cre.github.io/KushCloud/',
    source: 'https://github.com/LIN4CRE/KushCloud',
  },
  {
    title: 'Snake',
    tagline: 'Classic arcade Snake built into the page',
    desc: 'Built in vanilla JavaScript on Canvas 2D: direction queueing, speed scaling, local high score persistence, touch swipe gestures, and Web Audio synthesised sound blips.',
    tags: ['Arcade', 'Built-in', 'Touch-friendly', 'Web Audio'],
    tech: 'Vanilla JS · Canvas 2D · Web Audio',
    badge: 'Built-in',
    play: '#snake',
    source: 'https://github.com/LIN4CRE/linacre.site',
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

      {/* Flagship project — rendered from the game's own manifest */}
      <section className="space-y-3" aria-label="Flagship game project">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl font-bold text-foreground">Flagship project</h2>
          <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-amber-color/10 text-amber-color border border-amber-color/25">
            In development
          </span>
        </div>
        <Suspense
          fallback={
            <div className="rounded-2xl border border-border-color/60 bg-muted/15 h-64 grid place-items-center">
              <span className="font-mono text-xs text-muted-foreground">Loading project…</span>
            </div>
          }
        >
          <GameShowcase />
        </Suspense>
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

          return (
            <motion.div
              key={game.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-muted/20 dark:bg-[#0B1220]/80 border border-amber-color/15 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-amber-color/40 transition-all shadow-[var(--linacre-card-shadow)]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isBuiltIn
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : 'bg-emerald-500/10 text-emerald-color border border-emerald-500/20'
                    }`}
                  >
                    {game.badge}
                  </span>

                  <button
                    onClick={() => toggleFav(game.title)}
                    className="p-1.5 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer"
                    title="Toggle favourite"
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
                      className="px-3 py-1.5 rounded-lg bg-amber-color text-[#030c14] font-mono text-xs font-bold hover:bg-amber-glow transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Now</span>
                    </button>
                  ) : (
                    <a
                      href={game.play}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-amber-color text-[#030c14] font-mono text-xs font-bold hover:bg-amber-glow transition-all flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Game</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Embedded Snake Game Modal */}
      {snakeOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-md p-4">
          <div className="bg-[#0a0f1c] border border-amber-color/30 rounded-2xl p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-display font-bold text-lg text-foreground">
                <Gamepad2 className="w-5 h-5 text-amber-color" />
                <span>
                  SNAKE <span className="font-mono text-xs text-amber-color">· BUILT-IN</span>
                </span>
              </div>
              <button
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
            />

            <p className="font-mono text-[10px] text-muted-foreground text-center">
              USE ARROW KEYS / WASD / SWIPE TO MOVE · ENTER TO RETRY · ESC TO QUIT
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
