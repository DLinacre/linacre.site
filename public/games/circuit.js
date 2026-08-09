(() => {
  "use strict";

  // ---------- geometry ----------
  const N = 1, E = 2, S = 4, W = 8;
  const DIRS = [
    { b: N, dx: 0, dy: -1, o: S, name: "north" },
    { b: E, dx: 1, dy: 0, o: W, name: "east" },
    { b: S, dx: 0, dy: 1, o: N, name: "south" },
    { b: W, dx: -1, dy: 0, o: E, name: "west" }
  ];
  const rotCW = m => ((m << 1) | (m >> 3)) & 15;
  const STORE_KEY = "linacre.circuit.v2";
  const MAX_SIZE = 7;
  const DAILY_SIZE = 5;
  const SHARE_URL = "linacre.site/games/circuit";

  // ---------- seeded rng ----------
  const hashStr = s => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };
  const mulberry32 = a => () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const today = () => new Date().toISOString().slice(0, 10);

  // ---------- persistence (falls back to memory when storage is blocked) ----------
  let memory = {};
  const store = {
    read() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || memory; } catch { return memory; } },
    write(data) {
      memory = data;
      try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch { /* private mode */ }
    }
  };

  // ---------- audio ----------
  let audio = null, muted = true;
  function tone(freq, dur = 0.06, type = "square", vol = 0.035, delay = 0) {
    if (muted) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
      const t = audio.currentTime + delay;
      const osc = audio.createOscillator(), gain = audio.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain).connect(audio.destination);
      osc.start(t); osc.stop(t + dur + 0.02);
    } catch { /* no audio available */ }
  }

  // ---------- dom ----------
  const el = {
    board: document.getElementById("board"),
    stage: document.querySelector(".stage"),
    modeTag: document.getElementById("mode-tag"),
    level: document.getElementById("s-level"),
    moves: document.getElementById("s-moves"),
    time: document.getElementById("s-time"),
    status: document.getElementById("status"),
    undo: document.getElementById("b-undo"),
    daily: document.getElementById("b-daily"),
    sound: document.getElementById("b-sound"),
    overlay: document.getElementById("overlay"),
    card: document.getElementById("card"),
    ovTitle: document.getElementById("ov-title"),
    ovSub: document.getElementById("ov-sub"),
    ovScores: document.getElementById("ov-scores"),
    ovRules: document.getElementById("ov-rules"),
    ovMoves: document.getElementById("ov-moves"),
    ovPar: document.getElementById("ov-par"),
    ovTime: document.getElementById("ov-time"),
    ovBtn: document.getElementById("ov-btn"),
    ovShare: document.getElementById("ov-share"),
    live: document.getElementById("live")
  };

  // ---------- state ----------
  const game = {
    mode: "campaign", level: 1, size: 3, cells: [], source: 0, par: 0,
    moves: 0, hints: 0, solved: false, undos: [],
    started: 0, elapsed: 0, ticker: null, depth: []
  };

  const sizeForLevel = lvl => Math.min(MAX_SIZE, 3 + Math.floor(lvl / 2));
  const period = m => { let r = m; for (let k = 1; k < 4; k++) { r = rotCW(r); if (r === m) return k; } return 4; };
  const maskOf = c => { let m = c.base, n = ((c.spin % 4) + 4) % 4; while (n--) m = rotCW(m); return m; };
  const fmtTime = ms => { const t = Math.floor(ms / 1000); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`; };

  // ---------- generation: random spanning tree, then scramble ----------
  function build(size, rand) {
    const total = size * size;
    const masks = new Array(total).fill(0);
    const inTree = new Array(total).fill(false);
    const source = Math.floor(rand() * total);
    const frontier = [];

    const addEdges = i => {
      const x = i % size, y = (i / size) | 0;
      for (let d = 0; d < 4; d++) {
        const nx = x + DIRS[d].dx, ny = y + DIRS[d].dy;
        if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
        const j = ny * size + nx;
        if (!inTree[j]) frontier.push([i, d, j]);
      }
    };

    inTree[source] = true;
    addEdges(source);
    while (frontier.length) {
      const k = Math.floor(rand() * frontier.length);
      const [i, d, j] = frontier.splice(k, 1)[0];
      if (inTree[j]) continue;
      inTree[j] = true;
      masks[i] |= DIRS[d].b;
      masks[j] |= DIRS[d].o;
      addEdges(j);
    }

    let par = 0;
    const cells = masks.map((base, i) => {
      const p = period(base);
      const spin = p > 1 ? 1 + Math.floor(rand() * (p - 1)) : 0;
      par += Math.min(spin % p, p - (spin % p));
      return { i, base, spin, start: spin, period: p, powered: false, src: i === source, node: null, rot: null };
    });

    return { cells, source, par, size };
  }

  // ---------- svg ----------
  function svgFor(mask, isSource) {
    let d = "";
    for (const dir of DIRS) if (mask & dir.b) d += `M50 50L${50 + dir.dx * 50} ${50 + dir.dy * 50}`;
    const bits = [1, 2, 4, 8].filter(b => mask & b).length;
    const centre = isSource
      ? '<circle class="core" cx="50" cy="50" r="17"/><circle class="core-in" cx="50" cy="50" r="8"/>'
      : bits === 1
        ? '<circle class="node" cx="50" cy="50" r="13"/>'
        : '<circle class="hub" cx="50" cy="50" r="6"/>';
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><path class="wire" d="${d}"/>${centre}</svg>`;
  }

  // ---------- power flow (breadth-first, so depth drives the surge animation) ----------
  function computePower() {
    const { cells, size, source } = game;
    for (const c of cells) c.powered = false;
    const depth = new Array(cells.length).fill(-1);
    const queue = [source];
    cells[source].powered = true;
    depth[source] = 0;
    let lit = 1;
    for (let head = 0; head < queue.length; head++) {
      const i = queue[head], x = i % size, y = (i / size) | 0, m = maskOf(cells[i]);
      for (const dir of DIRS) {
        if (!(m & dir.b)) continue;
        const nx = x + dir.dx, ny = y + dir.dy;
        if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
        const j = ny * size + nx;
        if (cells[j].powered || !(maskOf(cells[j]) & dir.o)) continue;
        cells[j].powered = true;
        depth[j] = depth[i] + 1;
        lit++;
        queue.push(j);
      }
    }
    game.depth = depth;
    return lit;
  }

  function label(c) {
    const row = ((c.i / game.size) | 0) + 1, col = (c.i % game.size) + 1;
    const m = maskOf(c);
    const open = DIRS.filter(d => m & d.b).map(d => d.name).join(", ");
    return `Row ${row} column ${col}${c.src ? ", power core" : ""}, open ${open}, ${c.powered ? "live" : "dark"}. Activate to turn.`;
  }

  function paint(animate) {
    const was = game.cells.map(c => c.powered);
    const lit = computePower();
    const fresh = game.cells.filter((c, k) => c.powered && !was[k]).map(c => game.depth[c.i]);
    const base = fresh.length ? Math.min(...fresh) : 0;
    game.cells.forEach((c, k) => {
      const gained = animate && c.powered && !was[k];
      c.node.classList.toggle("on", c.powered);
      c.rot.style.setProperty("--spin", c.spin);
      c.node.setAttribute("aria-label", label(c));
      if (gained) {
        c.node.style.setProperty("--depth", Math.max(0, game.depth[c.i] - base));
        c.node.classList.remove("surge");
        void c.node.offsetWidth;
        c.node.classList.add("surge");
      } else if (!c.powered) {
        c.node.classList.remove("surge");
      }
    });
    el.stage.style.setProperty("--charge", (lit / game.cells.length).toFixed(3));
    el.moves.textContent = `${game.moves}/${game.par}`;
    el.moves.classList.toggle("over", game.moves > game.par);
    el.undo.disabled = game.solved || game.undos.length === 0;
    return lit === game.cells.length;
  }

  function mount() {
    el.board.style.setProperty("--n", game.size);
    el.board.classList.remove("solved");
    el.stage.classList.remove("solved");
    el.board.replaceChildren();
    const frag = document.createDocumentFragment();
    for (const c of game.cells) {
      const btn = document.createElement("button");
      btn.className = "tile" + (c.src ? " src" : "");
      btn.type = "button";
      btn.dataset.i = c.i;
      const rot = document.createElement("span");
      rot.className = "rot";
      rot.style.setProperty("--spin", c.spin);
      rot.innerHTML = svgFor(c.base, c.src);
      btn.appendChild(rot);
      c.node = btn; c.rot = rot;
      frag.appendChild(btn);
    }
    el.board.appendChild(frag);
    paint(false);
  }

  // ---------- clock ----------
  function startClock() {
    if (game.ticker || game.solved) return;
    game.started = Date.now() - game.elapsed;
    game.ticker = setInterval(() => {
      game.elapsed = Date.now() - game.started;
      el.time.textContent = fmtTime(game.elapsed);
    }, 500);
  }
  function stopClock() {
    if (game.ticker) { clearInterval(game.ticker); game.ticker = null; }
    if (game.started) game.elapsed = Date.now() - game.started;
    el.time.textContent = fmtTime(game.elapsed);
  }

  // ---------- actions ----------
  function turn(i, dir, isUndo) {
    if (game.solved) return;
    const c = game.cells[i];
    if (!c) return;
    if (c.period === 1) {
      el.status.textContent = "A CROSS CONNECTS ALL FOUR SIDES · TURNING IT CHANGES NOTHING";
      tone(180, 0.04, "sine", 0.02);
      return;
    }
    startClock();
    c.spin += dir;
    if (isUndo) {
      game.moves = Math.max(0, game.moves - 1);
    } else {
      game.moves++;
      game.undos.push([i, dir]);
    }
    const wasLive = c.powered;
    const done = paint(true);
    tone(wasLive || c.powered ? 520 : 300, 0.05, "square", 0.03);
    if (done) win();
  }

  function undo() {
    if (game.solved || !game.undos.length) return;
    const [i, dir] = game.undos.pop();
    turn(i, -dir, true);
    el.status.textContent = game.undos.length ? "TURN UNDONE" : "BACK TO THE STARTING STATE";
  }

  function resultText() {
    const tag = game.mode === "daily" ? `DAILY ${today()}` : `LEVEL ${game.level}`;
    const eff = game.moves <= game.par ? " · PAR" : ` · +${game.moves - game.par}`;
    return `CIRCUIT · ${tag}\n${game.size}×${game.size} · ${game.moves} turns (par ${game.par})${eff} · ${fmtTime(game.elapsed)}\n${SHARE_URL}`;
  }

  async function copyResult() {
    const text = resultText();
    try {
      await navigator.clipboard.writeText(text);
      el.ovShare.textContent = "COPIED";
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand && document.execCommand("copy");
      ta.remove();
      el.ovShare.textContent = ok ? "COPIED" : "COPY FAILED — SELECT MANUALLY";
    }
    setTimeout(() => { el.ovShare.textContent = "COPY RESULT"; }, 2200);
  }

  function win() {
    game.solved = true;
    stopClock();
    el.board.classList.add("solved");
    el.stage.classList.add("solved");
    el.stage.style.setProperty("--charge", "1");
    el.undo.disabled = true;
    [523, 659, 784, 1047].forEach((f, k) => tone(f, 0.16, "triangle", 0.03, k * 0.07));

    const data = store.read();
    let beat = false;

    if (game.mode === "daily") {
      const daily = data.daily || (data.daily = {});
      const prev = daily[today()];
      beat = !prev || game.moves < prev.moves || (game.moves === prev.moves && game.elapsed < prev.time);
      if (beat) daily[today()] = { moves: game.moves, time: game.elapsed, par: game.par };
    } else {
      const best = data.best || (data.best = {});
      const key = String(game.size);
      const prev = best[key];
      beat = !prev || game.moves < prev.moves || (game.moves === prev.moves && game.elapsed < prev.time);
      if (beat) best[key] = { moves: game.moves, time: game.elapsed };
      data.level = game.level + 1;
    }
    store.write(data);

    el.ovMoves.textContent = game.moves;
    el.ovPar.textContent = game.par;
    el.ovTime.textContent = fmtTime(game.elapsed);
    el.ovMoves.classList.toggle("best", beat);
    el.card.classList.remove("fail");
    el.ovTitle.textContent = game.moves <= game.par ? "PERFECT ROUTE" : "GRID POWERED";

    const bits = [];
    if (game.moves <= game.par) bits.push("Solved at par.");
    else bits.push(`${game.moves - game.par} turns over par.`);
    if (beat) bits.push(game.mode === "daily" ? "Best run today." : `Best ${game.size}×${game.size} yet.`);
    if (game.hints) bits.push(`${game.hints} hint${game.hints > 1 ? "s" : ""} used.`);
    el.ovSub.textContent = bits.join(" ");

    el.ovScores.hidden = false;
    el.ovRules.hidden = true;
    el.ovShare.hidden = false;
    el.ovBtn.textContent = game.mode === "daily" ? "BACK TO CAMPAIGN" : "NEXT GRID";
    el.ovBtn.dataset.action = game.mode === "daily" ? "campaign" : "next";
    el.live.textContent = `Grid powered in ${game.moves} turns, par ${game.par}.`;
    showOverlay(true);
  }

  function showOverlay(on) {
    el.overlay.classList.toggle("show", on);
    if (on) setTimeout(() => el.ovBtn.focus(), 320);
  }

  function load(opts) {
    const mode = opts.mode || "campaign";
    const daily = mode === "daily";
    const size = daily ? DAILY_SIZE : sizeForLevel(opts.level);
    const rand = daily ? mulberry32(hashStr("circuit-" + today())) : Math.random;

    Object.assign(game, build(size, rand), {
      mode,
      level: daily ? 0 : opts.level,
      moves: 0, hints: 0, solved: false, undos: [],
      elapsed: 0, started: 0
    });
    stopClock();
    game.started = 0; game.elapsed = 0;
    el.time.textContent = "0:00";

    el.modeTag.textContent = daily ? "DAILY" : "CAMPAIGN";
    el.daily.setAttribute("aria-pressed", String(daily));
    el.level.textContent = daily ? `${today().slice(5)} · ${size}×${size}` : `${opts.level} · ${size}×${size}`;

    const data = store.read();
    const best = daily ? (data.daily || {})[today()] : (data.best || {})[String(size)];
    el.status.textContent = best
      ? `BEST ${size}×${size}: ${best.moves} TURNS IN ${fmtTime(best.time)}`
      : "TAP TO TURN · HOLD OR RIGHT-CLICK TO TURN BACK";

    mount();
    showOverlay(false);
    el.live.textContent = daily
      ? `Daily grid for ${today()}, ${size} by ${size}, par ${game.par}.`
      : `Level ${opts.level}, ${size} by ${size} grid, par ${game.par}.`;
  }

  function reset() {
    if (!game.cells.length) return;
    for (const c of game.cells) c.spin = c.start;
    game.moves = 0; game.solved = false; game.undos = [];
    game.started = 0; game.elapsed = 0;
    stopClock();
    el.time.textContent = "0:00";
    el.board.classList.remove("solved");
    el.stage.classList.remove("solved");
    paint(false);
    el.status.textContent = "GRID RESTORED TO ITS STARTING STATE";
  }

  function hint() {
    if (game.solved) return;
    const wrong = game.cells.filter(c => c.period > 1 && (((c.spin % c.period) + c.period) % c.period) !== 0);
    if (!wrong.length) { el.status.textContent = "EVERY TILE IS ALREADY IN A SOLVED POSITION"; return; }
    const pick = wrong[Math.floor(Math.random() * wrong.length)];
    pick.node.classList.remove("hint");
    void pick.node.offsetWidth;
    pick.node.classList.add("hint");
    pick.node.focus({ preventScroll: true });
    game.hints++;
    el.status.textContent = `THIS TILE IS TURNED WRONG · ${game.hints} HINT${game.hints > 1 ? "S" : ""} USED`;
    tone(880, 0.08, "sine", 0.025);
  }

  // ---------- input ----------
  let holdTimer = null, held = false;

  el.board.addEventListener("pointerdown", e => {
    const tile = e.target.closest(".tile");
    if (!tile) return;
    held = false;
    clearTimeout(holdTimer);
    holdTimer = setTimeout(() => { held = true; turn(+tile.dataset.i, -1); }, 420);
  });
  ["pointerup", "pointerleave", "pointercancel"].forEach(ev =>
    el.board.addEventListener(ev, () => clearTimeout(holdTimer))
  );
  el.board.addEventListener("click", e => {
    const tile = e.target.closest(".tile");
    if (!tile) return;
    if (held) { held = false; return; }
    turn(+tile.dataset.i, e.shiftKey ? -1 : 1);
  });
  el.board.addEventListener("contextmenu", e => {
    const tile = e.target.closest(".tile");
    if (!tile) return;
    e.preventDefault();
    if (held) { held = false; return; }
    turn(+tile.dataset.i, -1);
  });

  el.board.addEventListener("keydown", e => {
    const tile = e.target.closest(".tile");
    if (!tile) return;
    const i = +tile.dataset.i, x = i % game.size, y = (i / game.size) | 0;
    const step = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key];
    if (step) {
      e.preventDefault();
      const nx = Math.min(game.size - 1, Math.max(0, x + step[0]));
      const ny = Math.min(game.size - 1, Math.max(0, y + step[1]));
      game.cells[ny * game.size + nx].node.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      turn(i, e.shiftKey ? -1 : 1);
    }
  });

  el.daily.addEventListener("click", () => {
    if (game.mode === "daily") load({ mode: "campaign", level: game.level || store.read().level || 1 });
    else load({ mode: "daily" });
  });
  document.getElementById("b-new").addEventListener("click", () => {
    if (game.mode === "daily") { el.status.textContent = "THE DAILY GRID IS FIXED · RESET IT OR SWITCH TO CAMPAIGN"; return; }
    load({ mode: "campaign", level: game.level });
  });
  el.undo.addEventListener("click", undo);
  document.getElementById("b-reset").addEventListener("click", reset);
  document.getElementById("b-hint").addEventListener("click", hint);

  el.sound.addEventListener("click", () => {
    muted = !muted;
    el.sound.setAttribute("aria-pressed", String(!muted));
    const data = store.read(); data.muted = muted; store.write(data);
    if (!muted) tone(660, 0.07, "triangle", 0.03);
  });

  document.getElementById("b-help").addEventListener("click", () => {
    el.ovTitle.textContent = "HOW IT WORKS";
    el.ovSub.textContent = "Rotate every wire until the current reaches the whole grid.";
    el.ovScores.hidden = true;
    el.ovRules.hidden = false;
    el.ovShare.hidden = true;
    el.card.classList.remove("fail");
    el.ovBtn.textContent = "BACK TO THE GRID";
    el.ovBtn.dataset.action = "close";
    showOverlay(true);
  });

  el.ovBtn.addEventListener("click", () => {
    const action = el.ovBtn.dataset.action;
    if (action === "next") load({ mode: "campaign", level: game.level + 1 });
    else if (action === "campaign") load({ mode: "campaign", level: store.read().level || 1 });
    else if (action === "reload") location.reload();
    else showOverlay(false);
  });
  el.ovShare.addEventListener("click", copyResult);

  el.overlay.addEventListener("click", e => {
    if (e.target === el.overlay && el.ovBtn.dataset.action === "close") showOverlay(false);
  });

  document.addEventListener("keydown", e => {
    const open = el.overlay.classList.contains("show");
    if (e.key === "Escape" && open && el.ovBtn.dataset.action === "close") { showOverlay(false); return; }
    if (open || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === "n" && game.mode === "campaign") load({ mode: "campaign", level: game.level });
    else if (k === "r") reset();
    else if (k === "h") hint();
    else if (k === "z") undo();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopClock();
    else if (!game.solved && game.moves > 0) startClock();
  });

  // ---------- boot ----------
  try {
    const saved = store.read();
    muted = saved.muted !== false;
    el.sound.setAttribute("aria-pressed", String(!muted));
    const wantDaily = /[?&]daily\b/.test(location.search) || location.hash === "#daily";
    load(wantDaily ? { mode: "daily" } : { mode: "campaign", level: Math.max(1, Math.min(999, saved.level || 1)) });
    game.cells[game.source].node.focus({ preventScroll: true });
  } catch (err) {
    console.error(err);
    el.board.replaceChildren();
    el.status.textContent = "THE GRID FAILED TO BUILD. RELOAD TO TRY AGAIN.";
    el.card.classList.add("fail");
    el.ovTitle.textContent = "NO SIGNAL";
    el.ovSub.textContent = "Something broke while building the grid.";
    el.ovScores.hidden = true;
    el.ovRules.hidden = true;
    el.ovShare.hidden = true;
    el.ovBtn.textContent = "RELOAD";
    el.ovBtn.dataset.action = "reload";
    showOverlay(true);
  }
})();
