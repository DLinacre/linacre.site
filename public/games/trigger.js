(() => {
  "use strict";

  const KEY = "linacre.trigger.v1";
  const BASE = "https://linacre.site/games/trigger";
  const TARGET = 5;          // rounds to win a duel
  const SOLO_ROUNDS = 5;
  const FAKE_CHANCE = 0.22;

  let memory = {};
  const store = {
    read() { try { return JSON.parse(localStorage.getItem(KEY)) || memory; } catch { return memory; } },
    write(d) { memory = d; try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* private mode */ } }
  };

  let audio = null, muted = false;
  function tone(freq, dur = 0.08, type = "square", vol = 0.04, delay = 0) {
    if (muted) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
      const t = audio.currentTime + delay;
      const o = audio.createOscillator(), g = audio.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(audio.destination);
      o.start(t); o.stop(t + dur + 0.02);
    } catch { /* no audio */ }
  }
  const buzz = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch { /* ignore */ } };

  const el = id => document.getElementById(id);
  const dom = {
    sides: [el("side0"), el("side1")],
    msgs: [el("msg0"), el("msg1")],
    pips: [el("pips0"), el("pips1")],
    score: el("score"), start: el("b-start"), mode: el("b-mode"), sound: el("b-sound"),
    overlay: el("overlay"), card: el("card"), title: el("ov-title"), big: el("ov-big"),
    sub: el("ov-sub"), rules: el("ov-rules"), btn: el("ov-btn"), share: el("ov-share"),
    close: el("ov-close"), live: el("live")
  };

  const game = {
    mode: "duel",           // duel | solo
    phase: "idle",          // idle | wait | live | between | over
    score: [0, 0],
    round: 0,
    times: [],              // solo reaction times
    signalAt: 0,
    fake: false,
    timer: null,
    gen: 0
  };

  const clearTimer = () => { if (game.timer) { clearTimeout(game.timer); game.timer = null; } };

  function setSide(i, msg, cls, sub) {
    dom.msgs[i].innerHTML = sub ? `${msg}<span class="sub">${sub}</span>` : msg;
    dom.sides[i].className = "side" + (i === 0 ? " flip" : "") + (cls ? " " + cls : "") +
      (game.mode === "solo" && i === 0 ? " dead" : "");
  }

  function bothSides(msg, cls, sub) {
    setSide(1, msg, cls, sub);
    if (game.mode === "duel") setSide(0, msg, cls, sub);
    else setSide(0, "SOLO", "", "second half is off");
  }

  function renderPips() {
    for (let i = 0; i < 2; i++) {
      dom.pips[i].replaceChildren();
      if (game.mode !== "duel") continue;
      for (let k = 0; k < TARGET; k++) {
        const p = document.createElement("span");
        p.className = "pip" + (k < game.score[i] ? " on" : "");
        dom.pips[i].appendChild(p);
      }
    }
    dom.score.textContent = game.mode === "duel"
      ? `P1 ${game.score[0]} — ${game.score[1]} P2`
      : `ROUND ${Math.min(game.round + 1, SOLO_ROUNDS)}/${SOLO_ROUNDS}`;
  }

  function arm() {
    const my = ++game.gen;
    game.phase = "wait";
    game.fake = Math.random() < FAKE_CHANCE;
    bothSides("WAIT", "", game.mode === "duel" ? "hands on your half" : "thumb ready");
    renderPips();
    const delay = 1200 + Math.random() * 3400;
    clearTimer();
    game.timer = setTimeout(() => {
      if (my !== game.gen) return;
      if (game.fake) {
        bothSides("HOLD", "fake", "not the signal");
        tone(220, .09, "sine", .03);
        game.timer = setTimeout(() => {
          if (my !== game.gen) return;
          game.fake = false;
          bothSides("WAIT", "", "still waiting");
          game.timer = setTimeout(() => {
            if (my !== game.gen) return;
            fire();
          }, 700 + Math.random() * 2600);
        }, 620);
      } else fire();
    }, delay);
  }

  function fire() {
    game.phase = "live";
    game.signalAt = performance.now();
    bothSides("NOW", "go", "");
    tone(880, .1, "square", .05);
    buzz(20);
    dom.live.textContent = "Go.";
  }

  function hit(i) {
    if (game.phase === "idle") { begin(); return; }
    if (game.phase === "between" || game.phase === "over") return;
    if (game.mode === "solo" && i === 0) return;

    if (game.phase === "wait") {                    // too soon, or fell for the fake
      game.phase = "between";
      clearTimer(); game.gen++;
      tone(150, .3, "sawtooth", .04);
      buzz([40, 60, 40]);
      if (game.mode === "duel") {
        const other = 1 - i;
        game.score[other]++;
        setSide(i, game.fake ? "FELL FOR IT" : "TOO SOON", "bad", "round lost");
        setSide(other, "THEY BLINKED", "win", "round yours");
        dom.live.textContent = `Player ${i + 1} jumped. Player ${other + 1} takes the round.`;
        renderPips();
        if (game.score[other] >= TARGET) return finish(other);
      } else {
        setSide(1, game.fake ? "FELL FOR IT" : "TOO SOON", "bad", "reset");
        dom.live.textContent = "Too soon.";
      }
      game.timer = setTimeout(arm, 1500);
      return;
    }

    // phase === "live"
    const ms = Math.round(performance.now() - game.signalAt);
    game.phase = "between";
    clearTimer(); game.gen++;
    tone(660, .09, "triangle", .04);
    buzz(15);

    if (game.mode === "duel") {
      game.score[i]++;
      setSide(i, `${ms}ms`, "win", "round yours");
      setSide(1 - i, "TOO SLOW", "", `beaten by ${ms}ms`);
      dom.live.textContent = `Player ${i + 1} in ${ms} milliseconds.`;
      renderPips();
      if (game.score[i] >= TARGET) return finish(i);
      game.timer = setTimeout(arm, 1500);
    } else {
      game.times.push(ms);
      game.round++;
      setSide(1, `${ms}ms`, "win", `${game.round}/${SOLO_ROUNDS}`);
      renderPips();
      dom.live.textContent = `${ms} milliseconds.`;
      if (game.round >= SOLO_ROUNDS) return finish(null);
      game.timer = setTimeout(arm, 1200);
    }
  }

  function finish(winner) {
    game.phase = "over";
    clearTimer(); game.gen++;
    const data = store.read();

    if (game.mode === "duel") {
      dom.title.textContent = `PLAYER ${winner + 1} WINS`;
      dom.big.hidden = true;
      dom.sub.textContent = `${game.score[winner]} — ${game.score[1 - winner]}. ${game.score[1 - winner] === 0 ? "Not even close." : "Close one."}`;
      dom.share.hidden = true;
      data.duels = (data.duels || 0) + 1;
      [523, 784].forEach((f, k) => tone(f, .18, "triangle", .04, k * .1));
    } else {
      const avg = Math.round(game.times.reduce((a, b) => a + b, 0) / game.times.length);
      const best = Math.min(...game.times);
      const prev = data.best || Infinity;
      if (best < prev) data.best = best;
      dom.title.textContent = "REFLEX LOGGED";
      dom.big.hidden = false;
      dom.big.textContent = `${avg}ms`;
      dom.sub.textContent = `Best single ${best}ms.${best < prev ? " New personal best." : ` Your record is ${data.best}ms.`} Average human sits near 250ms.`;
      dom.share.hidden = false;
      game.avg = avg; game.bestOfRun = best;
      [523, 659, 784].forEach((f, k) => tone(f, .16, "triangle", .035, k * .08));
    }
    store.write(data);
    dom.rules.hidden = true;
    dom.close.hidden = true;
    dom.btn.textContent = game.mode === "duel" ? "REMATCH" : "GO AGAIN";
    dom.btn.dataset.action = "again";
    setTimeout(() => show(true), 600);
  }

  function begin() {
    show(false);
    game.score = [0, 0];
    game.round = 0;
    game.times = [];
    dom.start.textContent = "RESTART";
    renderPips();
    arm();
  }

  function setMode(mode) {
    game.mode = mode;
    game.phase = "idle";
    game.gen++;
    clearTimer();
    game.score = [0, 0]; game.round = 0; game.times = [];
    dom.mode.textContent = mode === "duel" ? "DUEL" : "SOLO";
    dom.mode.setAttribute("aria-pressed", String(mode === "duel"));
    dom.start.textContent = "START";
    bothSides("TAP START", "", mode === "duel" ? "one phone, two thumbs" : "five signals, best average");
    renderPips();
    show(false);
  }

  function show(on) {
    dom.overlay.classList.toggle("show", on);
    if (on) setTimeout(() => dom.btn.focus(), 300);
  }

  async function copyResult() {
    const text = `TRIGGER · solo\navg ${game.avg}ms · best ${game.bestOfRun}ms over ${SOLO_ROUNDS} signals\n${BASE}`;
    try {
      await navigator.clipboard.writeText(text);
      dom.share.textContent = "COPIED";
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand && document.execCommand("copy");
      ta.remove();
      dom.share.textContent = ok ? "COPIED" : "COPY FAILED";
    }
    setTimeout(() => { dom.share.textContent = "COPY RESULT"; }, 2000);
  }

  // ---------- input ----------
  dom.sides.forEach((side, i) => {
    side.addEventListener("pointerdown", e => { e.preventDefault(); hit(i); });
    side.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); hit(i); }
    });
  });

  dom.start.addEventListener("click", begin);
  dom.mode.addEventListener("click", () => setMode(game.mode === "duel" ? "solo" : "duel"));
  dom.sound.addEventListener("click", () => {
    muted = !muted;
    dom.sound.setAttribute("aria-pressed", String(!muted));
    const d = store.read(); d.muted = muted; store.write(d);
    if (!muted) tone(660, .1);
  });

  el("b-help").addEventListener("click", () => {
    dom.title.textContent = "HOW IT WORKS";
    dom.big.hidden = true;
    dom.sub.textContent = "Wait for green. Beat the other thumb.";
    dom.rules.hidden = false;
    dom.share.hidden = true;
    dom.close.hidden = false;
    dom.btn.textContent = "BACK";
    dom.btn.dataset.action = "close";
    show(true);
  });

  dom.btn.addEventListener("click", () => {
    if (dom.btn.dataset.action === "again") begin();
    else show(false);
  });
  dom.close.addEventListener("click", () => show(false));
  dom.share.addEventListener("click", copyResult);
  dom.overlay.addEventListener("click", e => {
    if (e.target === dom.overlay && dom.btn.dataset.action === "close") show(false);
  });

  document.addEventListener("keydown", e => {
    if (dom.overlay.classList.contains("show")) {
      if (e.key === "Escape" && dom.btn.dataset.action === "close") show(false);
      return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === "a") { e.preventDefault(); hit(0); }
    else if (k === "l") { e.preventDefault(); hit(1); }
    else if (k === "enter") begin();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && (game.phase === "wait" || game.phase === "live")) {
      clearTimer(); game.gen++;
      game.phase = "idle";
      bothSides("PAUSED", "", "tap start to run it again");
    }
  });

  // ---------- boot ----------
  try {
    const saved = store.read();
    muted = saved.muted === true;
    dom.sound.setAttribute("aria-pressed", String(!muted));
    setMode("duel");
  } catch (err) {
    console.error(err);
    bothSides("SOMETHING BROKE", "bad", "reload to try again");
  }
})();
