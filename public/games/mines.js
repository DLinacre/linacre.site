(() => {
  "use strict";

  const LEVELS = {
    easy:   { cols: 9,  rows: 9,  mines: 10 },
    medium: { cols: 16, rows: 16, mines: 40 },
    hard:   { cols: 30, rows: 16, mines: 99 }
  };
  const STORE_KEY = "linacre.mines.v2";

  // ---------- persistence ----------
  let memory = {};
  const store = {
    read() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || memory; } catch { return memory; } },
    write(d) { memory = d; try { localStorage.setItem(STORE_KEY, JSON.stringify(d)); } catch {} }
  };

  // ---------- audio ----------
  let audio = null, muted = true;
  function tone(freq, dur = 0.06, type = "square", vol = 0.04, delay = 0) {
    if (muted) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
      const t = audio.currentTime + delay;
      const osc = audio.createOscillator(), gain = audio.createGain();
      osc.type = type; osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain).connect(audio.destination);
      osc.start(t); osc.stop(t + dur + 0.02);
    } catch {}
  }

  const el = {
    board: document.getElementById("board"),
    status: document.getElementById("status"),
    mines: document.getElementById("s-mines"),
    time: document.getElementById("s-time"),
    best: document.getElementById("s-best"),
    modeTag: document.getElementById("mode-tag"),
    overlay: document.getElementById("overlay"),
    card: document.getElementById("card"),
    ovTitle: document.getElementById("ov-title"),
    ovSub: document.getElementById("ov-sub"),
    ovTime: document.getElementById("ov-time"),
    ovBest: document.getElementById("ov-best"),
    ovBtn: document.getElementById("ov-btn"),
    live: document.getElementById("live"),
    sound: document.getElementById("b-sound")
  };

  const MODE_TAG = { easy: "EASY · 9×9", medium: "MEDIUM · 16×16", hard: "HARD · 30×16" };

  let mode = "easy";
  let cols, rows, nMines;
  let grid = [];          // {mine, open, flag, n}
  let started = false, over = false;
  let flags = 0, opened = 0;
  let t0 = 0, timerId = null;
  let flagMode = false;
  let focusCell = { r: 0, c: 0 };

  function saved() {
    const s = store.read();
    return { muted: s.muted !== false, best: s.best || {}, flag: !!s.flag };
  }

  function idx(r, c) { return r * cols + c; }
  function inB(r, c) { return r >= 0 && r < rows && c >= 0 && c < cols; }

  function neighbors(r, c) {
    const out = [];
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      if (dr || dc) { const nr = r + dr, nc = c + dc; if (inB(nr, nc)) out.push([nr, nc]); }
    }
    return out;
  }

  function placeMines(safeR, safeC) {
    let placed = 0, guard = 0;
    while (placed < nMines && guard < 5000) {
      guard++;
      const r = Math.floor(Math.random() * rows), c = Math.floor(Math.random() * cols);
      if (grid[idx(r, c)].mine) continue;
      if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue; // first click safe
      grid[idx(r, c)].mine = true; placed++;
    }
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      if (!grid[idx(r, c)].mine) {
        grid[idx(r, c)].n = neighbors(r, c).filter(([nr, nc]) => grid[idx(nr, nc)].mine).length;
      }
    }
  }

  function build() {
    cols = LEVELS[mode].cols; rows = LEVELS[mode].rows; nMines = LEVELS[mode].mines;
    grid = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++)
      grid.push({ mine: false, open: false, flag: false, n: 0 });
    started = false; over = false; flags = 0; opened = 0;
    stopTimer(); t0 = 0; el.time.textContent = "0";
    el.mines.textContent = nMines;
    el.modeTag.textContent = MODE_TAG[mode];
    const best = saved().best[mode];
    el.best.textContent = best ? best + "s" : "—";
    el.board.style.setProperty("--ar", cols + " / " + rows);
    el.board.style.gridTemplateColumns = "repeat(" + cols + ",1fr)";
    render();
    setStatus("TAP TO REVEAL · LONG-PRESS OR RIGHT-CLICK TO FLAG");
    hideOverlay();
  }

  function render() {
    el.board.innerHTML = "";
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const cell = grid[idx(r, c)];
      const b = document.createElement("button");
      b.className = "cell";
      b.setAttribute("role", "gridcell");
      b.setAttribute("aria-label", "row " + (r + 1) + " column " + (c + 1));
      b.dataset.r = r; b.dataset.c = c;
      b.addEventListener("click", () => reveal(r, c));
      b.addEventListener("contextmenu", e => { e.preventDefault(); toggleFlag(r, c); });
      b.addEventListener("keydown", e => {
        const k = e.key.toLowerCase();
        if (k === "enter" || k === " ") { e.preventDefault(); reveal(r, c); }
        else if (k === "f") { e.preventDefault(); toggleFlag(r, c); }
        else if (["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) { e.preventDefault(); moveFocus(k, r, c); }
      });
      let touchTimer = null;
      b.addEventListener("touchstart", () => {
        touchTimer = setTimeout(() => { toggleFlag(r, c); navigator.vibrate && navigator.vibrate(30); }, 400);
      }, { passive: true });
      b.addEventListener("touchend", () => { clearTimeout(touchTimer); });
      b.addEventListener("touchmove", () => { clearTimeout(touchTimer); }, { passive: true });
      el.board.appendChild(b);
    }
    paint();
  }

  function paint() {
    const cells = el.board.children;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const cell = grid[idx(r, c)];
      const b = cells[idx(r, c)];
      b.className = "cell";
      if (cell.flag) b.classList.add("flagged");
      if (cell.open) {
        b.classList.add("open");
        if (cell.mine) b.classList.add(cell.boom ? "boom" : "mine");
        else if (cell.n) b.classList.add("n" + cell.n), b.textContent = String(cell.n);
      } else {
        b.textContent = "";
      }
    }
    el.mines.textContent = Math.max(0, nMines - flags);
  }

  function reveal(r, c) {
    if (over) return;
    const cell = grid[idx(r, c)];
    if (cell.flag || cell.open) return;
    if (!started) { started = true; placeMines(r, c); startTimer(); }
    if (cell.mine) return lose(r, c);
    flood(r, c);
    if (opened === cols * rows - nMines) return win();
    paint();
  }

  function flood(r, c) {
    const cell = grid[idx(r, c)];
    if (cell.open || cell.flag) return;
    cell.open = true; opened++;
    if (cell.n === 0) {
      neighbors(r, c).forEach(([nr, nc]) => {
        const n = grid[idx(nr, nc)];
        if (!n.open && !n.flag) {
          if (n.mine) return;
          if (n.n === 0) flood(nr, nc);
          else { n.open = true; opened++; }
        }
      });
    }
  }

  function toggleFlag(r, c) {
    if (over) return;
    const cell = grid[idx(r, c)];
    if (cell.open) return;
    cell.flag = !cell.flag;
    flags += cell.flag ? 1 : -1;
    tone(cell.flag ? 520 : 320, 0.05, "square");
    paint();
  }

  function lose(r, c) {
    over = true; stopTimer();
    grid[idx(r, c)].boom = true;
    // reveal all mines / wrong flags
    for (let i = 0; i < grid.length; i++) {
      const cell = grid[i];
      if (cell.mine && !cell.flag) { cell.open = true; }
      if (cell.flag && !cell.mine) { /* wrong flag */ }
    }
    paint();
    showOverlay("BOOM", "You hit a mine. " + Math.max(0, opened) + " cells cleared.", true);
    setStatus("GAME OVER");
  }

  function win() {
    over = true; stopTimer();
    const t = Math.round((performance.now() - t0) / 1000);
    const s = saved();
    const best = s.best[mode];
    const isBest = !best || t < best;
    if (isBest) { s.best[mode] = t; store.write({ ...s, best: s.best }); }
    tone(660, 0.09); setTimeout(() => tone(880, 0.14), 100);
    el.ovTime.textContent = t + "s";
    el.ovBest.textContent = isBest ? t + "s ★" : best + "s";
    showOverlay("FIELD CLEARED", (isBest ? "New best time! " : "") + "All " + nMines + " mines flagged or avoided.", false);
    setStatus("FIELD CLEARED IN " + t + "s");
  }

  function startTimer() {
    t0 = performance.now();
    timerId = setInterval(() => {
      el.time.textContent = Math.round((performance.now() - t0) / 1000);
    }, 250);
  }
  function stopTimer() { clearInterval(timerId); timerId = null; }

  function moveFocus(k, r, c) {
    let nr = r, nc = c;
    if (k === "arrowup") nr--; if (k === "arrowdown") nr++;
    if (k === "arrowleft") nc--; if (k === "arrowright") nc++;
    if (inB(nr, nc)) {
      focusCell = { r: nr, c: nc };
      el.board.children[idx(nr, nc)].focus({ preventScroll: true });
    }
  }

  function setStatus(t) { el.status.textContent = t; el.live.textContent = t; }

  function showOverlay(title, sub, fail) {
    el.ovTitle.textContent = title; el.ovSub.textContent = sub;
    el.card.classList.toggle("fail", fail);
    el.overlay.classList.add("show");
  }
  function hideOverlay() { el.overlay.classList.remove("show"); }

  function setMode(m) {
    mode = m;
    el.bEasy.setAttribute("aria-pressed", String(m === "easy"));
    el.bMedium.setAttribute("aria-pressed", String(m === "medium"));
    el.bHard.setAttribute("aria-pressed", String(m === "hard"));
    build();
  }

  // ---------- wire controls ----------
  const el2 = {
    bEasy: document.getElementById("b-easy"),
    bMedium: document.getElementById("b-medium"),
    bHard: document.getElementById("b-hard"),
    bFlag: document.getElementById("b-flag"),
    bSound: el.sound,
    bNew: document.getElementById("b-new")
  };
  el2.bEasy.addEventListener("click", () => setMode("easy"));
  el2.bMedium.addEventListener("click", () => setMode("medium"));
  el2.bHard.addEventListener("click", () => setMode("hard"));
  el2.bFlag.addEventListener("click", () => {
    flagMode = !flagMode;
    el2.bFlag.setAttribute("aria-pressed", String(flagMode));
    setStatus(flagMode ? "FLAG MODE · TAP CELLS TO FLAG" : "TAP TO REVEAL · LONG-PRESS TO FLAG");
  });
  el2.bNew.addEventListener("click", build);
  el.ovBtn.addEventListener("click", build);
  el.sound.addEventListener("click", () => {
    muted = !muted;
    el.sound.setAttribute("aria-pressed", String(!muted));
    const s = saved(); store.write({ ...s, muted });
    if (!muted) tone(660, 0.06);
  });

  // flag mode overrides tap to flag
  el.board.addEventListener("click", e => {
    const b = e.target.closest(".cell");
    if (!b || !flagMode) return;
    toggleFlag(+b.dataset.r, +b.dataset.c);
  });

  // ---------- boot ----------
  muted = saved().muted;
  el.sound.setAttribute("aria-pressed", String(!muted));
  build();
  try { el.board.children[0] && el.board.children[0].focus({ preventScroll: true }); } catch {}
})();
