(() => {
  "use strict";

  const SIZE = 4;
  const STORE_KEY = "linacre.tiles.v2";

  // ---------- persistence ----------
  let memory = { best: 0, muted: true };
  const store = {
    read() { try { return { ...memory, ...JSON.parse(localStorage.getItem(STORE_KEY) || "{}") }; } catch { return memory; } },
    write(d) { memory = d; try { localStorage.setItem(STORE_KEY, JSON.stringify(d)); } catch {} }
  };

  // ---------- audio ----------
  let audio = null, muted = true;
  function tone(freq, dur = 0.05, type = "square", vol = 0.04) {
    if (muted) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
      const t = audio.currentTime;
      const osc = audio.createOscillator(), gain = audio.createGain();
      osc.type = type; osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain).connect(audio.destination);
      osc.start(t); osc.stop(t + dur + 0.02);
    } catch {}
  }

  // ---------- tile colours ----------
  const COLOURS = {
    2:    { bg: "#2A3040", fg: "#CCCAC2" },
    4:    { bg: "#2D3440", fg: "#CCCAC2" },
    8:    { bg: "#7A5B2E", fg: "#FFF" },
    16:   { bg: "#8A5A34", fg: "#FFF" },
    32:   { bg: "#A85B3B", fg: "#FFF" },
    64:   { bg: "#B23A3A", fg: "#FFF" },
    128:  { bg: "#C8A13C", fg: "#1F2430" },
    256:  { bg: "#C8A13C", fg: "#1F2430" },
    512:  { bg: "#D9B441", fg: "#1F2430" },
    1024: { bg: "#E8C74F", fg: "#1F2430" },
    2048: { bg: "#FFCC66", fg: "#1F2430" },
    super:{ bg: "#FFD98A", fg: "#1F2430" }
  };
  const colour = v => COLOURS[v] || COLOURS.super;

  const el = {
    board: document.getElementById("board"),
    score: document.getElementById("s-score"),
    best: document.getElementById("s-best"),
    status: document.getElementById("status"),
    live: document.getElementById("live"),
    overlay: document.getElementById("overlay"),
    card: document.getElementById("card"),
    ovTitle: document.getElementById("ov-title"),
    ovSub: document.getElementById("ov-sub"),
    ovContinue: document.getElementById("ov-continue"),
    ovNew: document.getElementById("ov-new"),
    sound: document.getElementById("b-sound"),
    newGame: document.getElementById("b-new")
  };

  let grid = [];            // 4x4 of values (0 = empty)
  let tiles = [];           // {id, value, r, c, merged, pop}
  let nextId = 1;
  let score = 0, best = 0;
  let over = false, won = false, keepPlaying = false;

  // geometry for absolutely-positioned tiles
  let cellPx = 0, gapPx = 0, padPx = 0;

  function measure() {
    const rect = el.board.getBoundingClientRect();
    const style = getComputedStyle(el.board);
    padPx = parseFloat(style.paddingLeft);
    gapPx = parseFloat(style.columnGap);
    cellPx = (rect.width - padPx * 2 - gapPx * (SIZE - 1)) / SIZE;
  }

  function emptyCells() {
    const out = [];
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (grid[r][c] === 0) out.push([r, c]);
    return out;
  }

  function spawn() {
    const empty = emptyCells();
    if (!empty.length) return;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    grid[r][c] = value;
    tiles.push({ id: nextId++, value, r, c, merged: false, pop: true });
  }

  function posOf(r, c) {
    return {
      x: padPx + c * (cellPx + gapPx),
      y: padPx + r * (cellPx + gapPx)
    };
  }

  function render() {
    // remove finished tiles, then draw
    tiles = tiles.filter(t => grid[t.r] && grid[t.r][t.c] === t.value);
    el.board.querySelectorAll(".tile").forEach(n => n.remove());
    tiles.forEach(t => {
      const d = document.createElement("div");
      d.className = "tile" + (t.pop ? " pop" : "") + (t.merged ? " merged" : "");
      d.textContent = t.value;
      d.style.width = cellPx + "px";
      d.style.height = cellPx + "px";
      const p = posOf(t.r, t.c);
      d.style.transform = "translate(" + p.x + "px," + p.y + "px)";
      const c = colour(t.value);
      d.style.background = c.bg;
      d.style.color = c.fg;
      el.board.appendChild(d);
      // one-shot animation classes
      setTimeout(() => { t.pop = false; t.merged = false; }, 200);
    });
  }

  function move(dir) {
    if (over) return;
    measure();
    let moved = false;
    const scoreBefore = score;
    // dir: 0 up, 1 right, 2 down, 3 left
    const vectors = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    const [dr, dc] = vectors[dir];
    const orderR = dr === 1 ? [SIZE - 1, SIZE - 2, SIZE - 3, 0] : [0, 1, 2, 3];
    const orderC = dc === 1 ? [SIZE - 1, SIZE - 2, SIZE - 3, 0] : [0, 1, 2, 3];

    // reset merge flags
    tiles.forEach(t => { t.merged = false; });

    // build traversal order
    const cells = [];
    for (const r of orderR) for (const c of orderC) cells.push([r, c]);

    // track whether a cell already merged this move
    const mergedAt = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));

    for (const [r, c] of cells) {
      const v = grid[r][c];
      if (v === 0) continue;
      let cr = r, cc = c;
      // slide as far as possible
      while (true) {
        const nr = cr + dr, nc = cc + dc;
        if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) break;
        if (grid[nr][nc] !== 0) break;
        cr = nr; cc = nc;
      }
      // try merge
      const nr = cr + dr, nc = cc + dc;
      if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && grid[nr][nc] === v && !mergedAt[nr][nc]) {
        grid[nr][nc] = v * 2;
        grid[r][c] = 0;
        score += v * 2;
        mergedAt[nr][nc] = true;
        // move tile
        const t = tiles.find(t => t.r === r && t.c === c && t.value === v);
        if (t) { t.r = nr; t.c = nc; t.value = v * 2; t.merged = true; }
        // remove the merged-into tile
        tiles = tiles.filter(t => !(t.r === nr && t.c === nc && t.value === v));
        moved = true;
        if (v * 2 === 2048 && !won && !keepPlaying) { won = true; }
      } else if (cr !== r || cc !== c) {
        grid[cr][cc] = v;
        grid[r][c] = 0;
        const t = tiles.find(t => t.r === r && t.c === c && t.value === v);
        if (t) { t.r = cr; t.c = cc; }
        moved = true;
      }
    }

    if (moved) {
      if (score > scoreBefore) tone(300 + Math.min(score / 64, 8) * 40, 0.06, "square");
      else tone(180, 0.04, "square");
      spawn();
      render();
      updateScore();
      checkState();
    }
  }

  function updateScore() {
    el.score.textContent = score;
    if (score > best) {
      best = score;
      store.write({ best, muted });
    }
    el.best.textContent = best;
  }

  function checkState() {
    if (won && !keepPlaying) {
      showWin();
      return;
    }
    // any empty or any mergeable pair
    const empty = emptyCells();
    if (empty.length) return;
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
      if (c + 1 < SIZE && grid[r][c] === grid[r][c + 1]) return;
      if (r + 1 < SIZE && grid[r][c] === grid[r + 1][c]) return;
    }
    // game over
    over = true;
    tone(220, 0.15, "sawtooth"); setTimeout(() => tone(160, 0.2, "sawtooth"), 120);
    el.status.textContent = "GAME OVER — NO MOVES LEFT";
    el.live.textContent = "Game over. Score " + score + ".";
  }

  function showWin() {
    el.ovTitle.textContent = "2048!";
    el.ovSub.textContent = "You reached 2048 with a score of " + score + ". Keep going for a higher score, or start fresh.";
    el.overlay.classList.add("show");
    tone(523, 0.1); setTimeout(() => tone(659, 0.1), 110); setTimeout(() => tone(784, 0.16), 220);
  }

  function newGame() {
    grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    tiles = [];
    score = 0; over = false; won = false; keepPlaying = false;
    el.overlay.classList.remove("show");
    el.score.textContent = "0";
    el.best.textContent = best;
    el.status.textContent = "SWIPE OR USE ARROW KEYS TO SLIDE THE TILES";
    measure();
    spawn(); spawn();
    render();
  }

  // ---------- input ----------
  function keyToDir(k) {
    if (k === "arrowup" || k === "w") return 0;
    if (k === "arrowright" || k === "d") return 1;
    if (k === "arrowdown" || k === "s") return 2;
    if (k === "arrowleft" || k === "a") return 3;
    return -1;
  }

  window.addEventListener("keydown", e => {
    const d = keyToDir(e.key.toLowerCase());
    if (d >= 0) { e.preventDefault(); move(d); }
  });

  let touchStart = null;
  el.board.addEventListener("touchstart", e => {
    const t = e.changedTouches[0];
    touchStart = { x: t.clientX, y: t.clientY };
  }, { passive: true });
  el.board.addEventListener("touchend", e => {
    if (!touchStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.x, dy = t.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
    if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 1 : 3);
    else move(dy > 0 ? 2 : 0);
  });

  el.sound.addEventListener("click", () => {
    muted = !muted;
    el.sound.setAttribute("aria-pressed", String(!muted));
    store.write({ best, muted });
    if (!muted) tone(660, 0.06);
  });
  el.newGame.addEventListener("click", newGame);
  el.ovContinue.addEventListener("click", () => {
    keepPlaying = true;
    el.overlay.classList.remove("show");
    el.status.textContent = "KEEP GOING — REACH A HIGHER TILE";
  });
  el.ovNew.addEventListener("click", newGame);

  window.addEventListener("resize", () => { measure(); render(); });

  // ---------- boot ----------
  ({ best, muted } = store.read());
  el.sound.setAttribute("aria-pressed", String(!muted));
  newGame();
})();
