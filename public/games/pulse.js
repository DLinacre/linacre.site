(() => {
  "use strict";

  const PADS = 9;
  const KEY = "linacre.pulse.v1";
  const BASE = "https://linacre.site/games/pulse";
  const COLOURS = ["#73D0FF", "#FFCC66", "#BAE67E", "#DFBFFF", "#F28779", "#95E6CB", "#FFD580", "#A0C8F0", "#F0A6CA"];
  const NOTES = [262, 294, 330, 392, 440, 523, 587, 659, 784];

  const hashStr = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const mulberry32 = a => () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const today = () => new Date().toISOString().slice(0, 10);
  const wait = ms => new Promise(r => setTimeout(r, ms));

  let memory = {};
  const store = {
    read() { try { return JSON.parse(localStorage.getItem(KEY)) || memory; } catch { return memory; } },
    write(d) { memory = d; try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* private mode */ } }
  };

  let audio = null, muted = false;
  function tone(freq, dur = 0.18, type = "sine", vol = 0.05, delay = 0) {
    if (muted) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
      const t = audio.currentTime + delay;
      const o = audio.createOscillator(), g = audio.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(audio.destination);
      o.start(t); o.stop(t + dur + 0.02);
    } catch { /* no audio */ }
  }

  const el = id => document.getElementById(id);
  const dom = {
    pads: el("pads"), prompt: el("prompt"), start: el("b-start"), duel: el("b-duel"),
    daily: el("b-daily"), sound: el("b-sound"), modeTag: el("mode-tag"),
    kLeft: el("k-left"), sLeft: el("s-left"), kRight: el("k-right"), sRight: el("s-right"),
    overlay: el("overlay"), card: el("card"), title: el("ov-title"), big: el("ov-big"),
    sub: el("ov-sub"), rules: el("ov-rules"), btn: el("ov-btn"), share: el("ov-share"),
    close: el("ov-close"), live: el("live")
  };

  const game = {
    mode: "daily",        // daily | free | challenge | duel
    seed: "",
    seq: [],
    step: 0,              // how far through the repeat the player is
    depth: 0,             // rounds survived
    phase: "idle",        // idle | watch | repeat | add | over
    turn: 0,              // duel: 0 or 1
    gen: 0,               // cancels stale playback
    rand: null
  };

  const buttons = [];
  for (let i = 0; i < PADS; i++) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "pad";
    b.style.setProperty("--c", COLOURS[i]);
    b.dataset.i = i;
    b.setAttribute("aria-label", `Pad ${i + 1}`);
    b.addEventListener("click", () => tap(i));
    dom.pads.appendChild(b);
    buttons.push(b);
  }

  function flash(i, ms) {
    const b = buttons[i];
    b.classList.add("lit");
    tone(NOTES[i], Math.max(0.12, ms / 1000 * 0.9));
    setTimeout(() => b.classList.remove("lit"), ms);
  }

  function setPrompt(text, cls) {
    dom.prompt.textContent = text;
    dom.prompt.className = "prompt" + (cls ? " " + cls : "");
  }

  function lock(on) { dom.pads.classList.toggle("locked", on); }

  function stepDuration() {
    return Math.max(200, 540 - game.seq.length * 14);
  }

  async function playback() {
    const my = ++game.gen;
    game.phase = "watch";
    lock(true);
    setPrompt("WATCH", "watch");
    dom.live.textContent = `Signal of ${game.seq.length}. Watch.`;
    await wait(500);
    const dur = stepDuration();
    for (const i of game.seq) {
      if (my !== game.gen) return;
      flash(i, Math.round(dur * 0.62));
      await wait(dur);
    }
    if (my !== game.gen) return;
    game.step = 0;
    game.phase = "repeat";
    lock(false);
    setPrompt(game.mode === "duel" ? `${who()} — REPEAT IT` : "YOUR TURN", "turn");
    dom.live.textContent = "Your turn.";
  }

  const who = () => `PLAYER ${game.turn + 1}`;

  function nextSolo() {
    while (game.seq.length <= game.depth) game.seq.push(Math.floor(game.rand() * PADS));
    playback();
  }

  function tap(i) {
    if (game.phase === "repeat") {
      if (i === game.seq[game.step]) {
        flash(i, 220);
        game.step++;
        if (game.step === game.seq.length) {
          if (game.mode === "duel") {
            game.phase = "add";
            setPrompt(`${who()} — ADD ONE STEP`, "turn");
          } else {
            game.depth++;
            updateStats();
            setPrompt("CLEAN", "turn");
            setTimeout(nextSolo, 620);
          }
        }
      } else {
        fail(i);
      }
      return;
    }
    if (game.phase === "add") {
      game.seq.push(i);
      flash(i, 260);
      game.depth = game.seq.length;
      game.turn = 1 - game.turn;
      updateStats();
      setPrompt(`PASS TO ${who()}`, "watch");
      setTimeout(playback, 900);
      return;
    }
    if (game.phase === "idle") begin();
  }

  function fail(i) {
    game.phase = "over";
    game.gen++;
    lock(true);
    dom.pads.classList.add("wrong");
    buttons[i].classList.add("lit");
    tone(140, 0.45, "sawtooth", 0.04);
    setTimeout(() => {
      buttons[i].classList.remove("lit");
      dom.pads.classList.remove("wrong");
    }, 500);

    const data = store.read();
    let sub, title = "SIGNAL LOST", big = null;

    if (game.mode === "duel") {
      title = `${who()} SLIPPED`;
      sub = `Player ${2 - game.turn} takes it. The signal reached ${game.seq.length} steps.`;
    } else {
      big = game.depth;
      const best = data.best || 0;
      if (game.depth > best) { data.best = game.depth; sub = "New personal best."; }
      else sub = `Your best is ${best}.`;
      if (game.mode === "daily") {
        const d = data.daily || (data.daily = {});
        if (!d[today()] || game.depth > d[today()]) d[today()] = game.depth;
        sub += ` Today's signal: ${d[today()]} steps.`;
      }
      store.write(data);
    }
    updateStats();

    dom.card.classList.add("fail");
    dom.title.textContent = title;
    dom.big.hidden = big === null;
    if (big !== null) dom.big.textContent = big;
    dom.sub.textContent = sub;
    dom.rules.hidden = true;
    dom.share.hidden = game.mode === "duel";
    dom.close.hidden = true;
    dom.btn.textContent = game.mode === "duel" ? "REMATCH" : "PLAY AGAIN";
    dom.btn.dataset.action = "again";
    dom.live.textContent = `${title}. ${sub}`;
    setTimeout(() => show(true), 620);
  }

  function updateStats() {
    const data = store.read();
    if (game.mode === "duel") {
      dom.kLeft.textContent = "SIGNAL"; dom.sLeft.textContent = game.seq.length;
      dom.kRight.textContent = "TURN"; dom.sRight.textContent = `P${game.turn + 1}`;
    } else {
      dom.kLeft.textContent = "SIGNAL"; dom.sLeft.textContent = game.depth;
      dom.kRight.textContent = "BEST"; dom.sRight.textContent = data.best || 0;
    }
  }

  function begin() {
    show(false);
    game.gen++;
    game.seq = [];
    game.depth = 0;
    game.step = 0;
    game.turn = 0;
    dom.pads.classList.remove("wrong");
    game.rand = mulberry32(hashStr("pulse-" + game.seed));
    updateStats();
    dom.start.textContent = "RESTART";

    if (game.mode === "duel") {
      game.phase = "add";
      lock(false);
      setPrompt("PLAYER 1 — TAP ONE PAD TO START", "turn");
    } else {
      nextSolo();
    }
  }

  function setMode(mode, seed) {
    game.mode = mode;
    game.seed = mode === "daily" ? "d" + today() : mode === "challenge" ? seed : Math.random().toString(36).slice(2, 8);
    dom.modeTag.textContent = mode === "duel" ? "DUEL" : mode === "daily" ? "DAILY" : mode === "challenge" ? "CHALLENGE" : "FREE PLAY";
    dom.duel.setAttribute("aria-pressed", String(mode === "duel"));
    dom.daily.setAttribute("aria-pressed", String(mode === "daily"));
    game.gen++;
    game.phase = "idle";
    game.seq = []; game.depth = 0; game.turn = 0;
    lock(false);
    updateStats();
    dom.start.textContent = "START";
    setPrompt(mode === "duel"
      ? "PASS-AND-PLAY · TAP START WHEN BOTH OF YOU ARE READY"
      : mode === "challenge"
        ? "SOMEONE SENT YOU THEIR SIGNAL · TAP START"
        : "TAP START AND WATCH THE SIGNAL", "");
    show(false);
  }

  function show(on) {
    dom.overlay.classList.toggle("show", on);
    if (on) setTimeout(() => dom.btn.focus(), 300);
  }

  function resultText() {
    const head = game.mode === "daily" ? `DAILY ${today()}` : `SIGNAL ${game.seed}`;
    const link = game.mode === "daily" ? BASE : `${BASE}?c=${encodeURIComponent(game.seed)}`;
    return `PULSE · ${head}\nheld ${game.depth} steps\n${link}`;
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

  // ---------- wiring ----------
  dom.start.addEventListener("click", begin);
  dom.duel.addEventListener("click", () => setMode(game.mode === "duel" ? "daily" : "duel"));
  dom.daily.addEventListener("click", () => setMode(game.mode === "daily" ? "free" : "daily"));

  dom.sound.addEventListener("click", () => {
    muted = !muted;
    dom.sound.setAttribute("aria-pressed", String(!muted));
    const d = store.read(); d.muted = muted; store.write(d);
    if (!muted) tone(660, 0.12);
  });

  el("b-help").addEventListener("click", () => {
    dom.card.classList.remove("fail");
    dom.title.textContent = "HOW IT WORKS";
    dom.big.hidden = true;
    dom.sub.textContent = "Watch, repeat, survive one more step.";
    dom.rules.hidden = false;
    dom.share.hidden = true;
    dom.close.hidden = false;
    dom.btn.textContent = "BACK TO THE PADS";
    dom.btn.dataset.action = "close";
    show(true);
  });

  dom.btn.addEventListener("click", () => {
    if (dom.btn.dataset.action === "again") begin();
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
    if (e.key >= "1" && e.key <= "9") { e.preventDefault(); tap(+e.key - 1); }
    else if (e.key === "Enter") begin();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && (game.phase === "watch" || game.phase === "repeat")) {
      game.gen++;
      game.phase = "idle";
      lock(false);
      setPrompt("PAUSED · TAP START TO RUN THE SIGNAL AGAIN", "");
    }
  });

  // ---------- boot ----------
  try {
    const saved = store.read();
    muted = saved.muted === true;
    dom.sound.setAttribute("aria-pressed", String(!muted));
    const challenge = new URLSearchParams(location.search).get("c");
    setMode(challenge ? "challenge" : "daily", challenge ? challenge.slice(0, 24) : null);
  } catch (err) {
    console.error(err);
    setPrompt("SOMETHING BROKE. RELOAD TO TRY AGAIN.", "");
  }
})();
