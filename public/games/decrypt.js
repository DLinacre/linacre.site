(() => {
  "use strict";

  const SLOTS = 4, SYMS = 6, TRIES = 8;
  const KEY = "linacre.decrypt.v1";
  const LETTERS = ["A", "B", "C", "D", "E", "F"];
  const BASE = "https://linacre.site/games/decrypt";

  const hashStr = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const mulberry32 = a => () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const today = () => new Date().toISOString().slice(0, 10);

  let memory = {};
  const store = {
    read() { try { return JSON.parse(localStorage.getItem(KEY)) || memory; } catch { return memory; } },
    write(d) { memory = d; try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* private mode */ } }
  };

  let audio = null, muted = false;
  function tone(freq, dur = 0.06, type = "square", vol = 0.03, delay = 0) {
    if (muted) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
      const t = audio.currentTime + delay;
      const o = audio.createOscillator(), g = audio.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(audio.destination);
      o.start(t); o.stop(t + dur + 0.02);
    } catch { /* no audio */ }
  }

  const el = id => document.getElementById(id);
  const dom = {
    rows: el("rows"), pad: el("pad"), go: el("b-go"), clear: el("b-clear"),
    status: el("status"), tryCount: el("s-try"), streak: el("s-streak"), modeTag: el("mode-tag"),
    overlay: el("overlay"), card: el("card"), title: el("ov-title"), sub: el("ov-sub"),
    reveal: el("ov-reveal"), rules: el("ov-rules"), btn: el("ov-btn"), share: el("ov-share"),
    close: el("ov-close"), live: el("live")
  };

  const game = { mode: "daily", seed: "", code: [], guess: [], history: [], over: false, won: false };

  function symButton(s, cls) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "sym" + (cls ? " " + cls : "");
    if (s === null || s === undefined) { b.classList.add("empty"); b.textContent = ""; }
    else { b.dataset.s = s; b.textContent = LETTERS[s]; }
    return b;
  }

  function makeCode(seed) {
    const rand = mulberry32(hashStr(seed));
    return Array.from({ length: SLOTS }, () => Math.floor(rand() * SYMS));
  }

  function score(guess, code) {
    let exact = 0;
    const cc = new Array(SYMS).fill(0), gc = new Array(SYMS).fill(0);
    for (let i = 0; i < SLOTS; i++) {
      if (guess[i] === code[i]) exact++;
      else { cc[code[i]]++; gc[guess[i]]++; }
    }
    let near = 0;
    for (let s = 0; s < SYMS; s++) near += Math.min(cc[s], gc[s]);
    return { exact, near };
  }

  function renderHistory() {
    dom.rows.replaceChildren();
    game.history.forEach((h, n) => {
      const row = document.createElement("div");
      row.className = "row";
      const no = document.createElement("span");
      no.className = "no"; no.textContent = n + 1;
      const slots = document.createElement("div");
      slots.className = "slots";
      h.guess.forEach(s => slots.appendChild(symButton(s)));
      slots.querySelectorAll(".sym").forEach(b => { b.disabled = true; b.tabIndex = -1; });
      const pegs = document.createElement("div");
      pegs.className = "pegs";
      pegs.setAttribute("aria-label", `${h.exact} exact, ${h.near} misplaced`);
      for (let i = 0; i < SLOTS; i++) {
        const p = document.createElement("span");
        p.className = "peg" + (i < h.exact ? " exact" : i < h.exact + h.near ? " near" : "");
        pegs.appendChild(p);
      }
      row.append(no, slots, pegs);
      dom.rows.appendChild(row);
    });

    if (!game.over) {
      const row = document.createElement("div");
      row.className = "row active";
      const no = document.createElement("span");
      no.className = "no"; no.textContent = game.history.length + 1;
      const slots = document.createElement("div");
      slots.className = "slots";
      for (let i = 0; i < SLOTS; i++) {
        const b = symButton(game.guess[i] ?? null);
        b.setAttribute("aria-label", game.guess[i] == null ? `Slot ${i + 1}, empty` : `Slot ${i + 1}, ${LETTERS[game.guess[i]]}. Tap to clear.`);
        b.addEventListener("click", () => { if (game.guess[i] != null) { game.guess[i] = null; tone(240, .04); refresh(); } });
        slots.appendChild(b);
      }
      const pegs = document.createElement("div");
      pegs.className = "pegs";
      row.append(no, slots, pegs);
      dom.rows.appendChild(row);
    }
    dom.rows.scrollTop = dom.rows.scrollHeight;
  }

  function refresh() {
    renderHistory();
    const filled = game.guess.filter(v => v != null).length;
    dom.go.disabled = game.over || filled !== SLOTS;
    dom.clear.disabled = game.over || filled === 0;
    dom.tryCount.textContent = `${Math.min(game.history.length + 1, TRIES)}/${TRIES}`;
  }

  function place(s) {
    if (game.over) return;
    const i = game.guess.findIndex(v => v == null);
    if (i === -1) { dom.status.textContent = "ALL FOUR SLOTS ARE FULL · TAP ONE TO TAKE IT BACK"; return; }
    game.guess[i] = s;
    tone(380 + s * 60, .05);
    refresh();
  }

  function submit() {
    if (game.over || game.guess.some(v => v == null)) return;
    const guess = game.guess.slice();
    const { exact, near } = score(guess, game.code);
    game.history.push({ guess, exact, near });
    game.guess = new Array(SLOTS).fill(null);
    dom.live.textContent = `${exact} exact, ${near} misplaced.`;
    dom.status.textContent = exact === SLOTS ? "" : `${exact} IN PLACE · ${near} MISPLACED`;
    if (exact === SLOTS) finish(true);
    else if (game.history.length >= TRIES) finish(false);
    else { tone(exact ? 520 : 300, .06); refresh(); }
  }

  function finish(won) {
    game.over = true; game.won = won;
    refresh();
    const data = store.read();
    data.solved = (data.solved || 0) + (won ? 1 : 0);
    if (game.mode === "daily") {
      const prev = data.lastDaily;
      if (prev !== today()) {
        const yst = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
        data.streak = won ? (prev === yst ? (data.streak || 0) + 1 : 1) : 0;
        data.lastDaily = today();
        data.dailyTries = game.history.length;
        data.dailyWon = won;
      }
    }
    store.write(data);
    dom.streak.textContent = data.streak || 0;

    dom.reveal.replaceChildren(...game.code.map(s => symButton(s)));
    dom.reveal.querySelectorAll(".sym").forEach(b => { b.disabled = true; b.tabIndex = -1; });
    dom.card.classList.toggle("fail", !won);
    dom.title.textContent = won ? "DECRYPTED" : "LOCKED OUT";
    dom.sub.textContent = won
      ? `Cracked in ${game.history.length} ${game.history.length === 1 ? "guess" : "guesses"}.${game.history.length <= 4 ? " Sharp." : ""}`
      : "Eight guesses gone. That was the code.";
    dom.rules.hidden = true;
    dom.reveal.hidden = false;
    dom.share.hidden = false;
    dom.close.hidden = true;
    dom.btn.textContent = game.mode === "daily" ? "PLAY A RANDOM CODE" : "NEW CODE";
    dom.btn.dataset.action = "next";
    if (won) [523, 659, 784, 1047].forEach((f, k) => tone(f, .16, "triangle", .03, k * .07));
    else tone(180, .3, "sawtooth", .03);
    show(true);
  }

  function show(on) {
    dom.overlay.classList.toggle("show", on);
    if (on) setTimeout(() => dom.btn.focus(), 300);
  }

  function resultText() {
    const head = game.mode === "daily" ? `DAILY ${today()}` : `CODE ${game.seed}`;
    const line = game.won ? `cracked in ${game.history.length}/${TRIES}` : `failed ${TRIES}/${TRIES}`;
    const trail = game.history.map(h => `${h.exact}·${h.near}`).join("  ");
    const link = game.mode === "daily" ? BASE : `${BASE}?c=${encodeURIComponent(game.seed)}`;
    return `DECRYPT · ${head}\n${line}\n${trail}\n${link}`;
  }

  async function copy(text, btn, label) {
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = "COPIED";
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand && document.execCommand("copy");
      ta.remove();
      btn.textContent = ok ? "COPIED" : "COPY FAILED";
    }
    setTimeout(() => { btn.textContent = label; }, 2000);
  }

  function load(mode, seed) {
    game.mode = mode;
    game.seed = mode === "daily" ? "d" + today() : (seed || Math.random().toString(36).slice(2, 8));
    game.code = makeCode(game.seed);
    game.guess = new Array(SLOTS).fill(null);
    game.history = [];
    game.over = false; game.won = false;
    dom.modeTag.textContent = mode === "daily" ? "DAILY" : mode === "challenge" ? "CHALLENGE" : "FREE PLAY";
    const data = store.read();
    dom.streak.textContent = data.streak || 0;
    dom.status.textContent = mode === "challenge"
      ? `SOMEONE SENT YOU CODE ${game.seed.toUpperCase()} · CRACK IT`
      : "TAP A SYMBOL TO PLACE IT · TAP A SLOT TO TAKE IT BACK";
    show(false);
    refresh();
    dom.live.textContent = `${mode} code ready. Four symbols, eight guesses.`;
  }

  // ---------- wiring ----------
  for (let s = 0; s < SYMS; s++) {
    const b = symButton(s);
    b.setAttribute("aria-label", `Place symbol ${LETTERS[s]}`);
    b.addEventListener("click", () => place(s));
    dom.pad.appendChild(b);
  }

  dom.go.addEventListener("click", submit);
  dom.clear.addEventListener("click", () => { game.guess = new Array(SLOTS).fill(null); tone(240, .04); refresh(); });

  el("b-help").addEventListener("click", () => {
    dom.card.classList.remove("fail");
    dom.title.textContent = "HOW IT WORKS";
    dom.sub.textContent = "Four symbols. Eight guesses. Every guess narrows it down.";
    dom.reveal.hidden = true;
    dom.rules.hidden = false;
    dom.share.hidden = true;
    dom.close.hidden = false;
    dom.btn.textContent = "BACK TO THE CODE";
    dom.btn.dataset.action = "close";
    show(true);
  });

  dom.btn.addEventListener("click", () => {
    if (dom.btn.dataset.action === "next") load("free");
    else show(false);
  });
  dom.close.addEventListener("click", () => show(false));
  dom.share.addEventListener("click", () => copy(resultText(), dom.share, "COPY RESULT"));

  dom.overlay.addEventListener("click", e => {
    if (e.target === dom.overlay && dom.btn.dataset.action === "close") show(false);
  });

  document.addEventListener("keydown", e => {
    if (dom.overlay.classList.contains("show")) {
      if (e.key === "Escape" && dom.btn.dataset.action === "close") show(false);
      return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key >= "1" && e.key <= String(SYMS)) place(+e.key - 1);
    else if (/^[a-fA-F]$/.test(e.key)) place(LETTERS.indexOf(e.key.toUpperCase()));
    else if (e.key === "Backspace") {
      e.preventDefault();
      for (let i = SLOTS - 1; i >= 0; i--) if (game.guess[i] != null) { game.guess[i] = null; break; }
      refresh();
    } else if (e.key === "Enter") submit();
  });

  // ---------- boot ----------
  try {
    const params = new URLSearchParams(location.search);
    const challenge = params.get("c");
    load(challenge ? "challenge" : "daily", challenge ? challenge.slice(0, 24) : null);
  } catch (err) {
    console.error(err);
    dom.status.textContent = "SOMETHING BROKE. RELOAD TO TRY AGAIN.";
  }
})();
