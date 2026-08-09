(() => {
  "use strict";

  const KEY = "linacre.gridlock.v1";
  const SIZES = [3, 4, 5];
  const NS = "http://www.w3.org/2000/svg";

  let memory = {};
  const store = {
    read() { try { return JSON.parse(localStorage.getItem(KEY)) || memory; } catch { return memory; } },
    write(d) { memory = d; try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* private mode */ } }
  };

  let audio = null, muted = false;
  function tone(freq, dur = 0.07, type = "square", vol = 0.035, delay = 0) {
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
    board: el("board"), prompt: el("prompt"), modeTag: el("mode-tag"),
    who: [el("w0"), el("w1")], names: [el("n0"), el("n1")], score: [el("s0"), el("s1")],
    mode: el("b-mode"), size: el("b-size"), sound: el("b-sound"),
    overlay: el("overlay"), card: el("card"), title: el("ov-title"), big: el("ov-big"),
    sub: el("ov-sub"), rules: el("ov-rules"), btn: el("ov-btn"), close: el("ov-close"),
    live: el("live")
  };

  const game = {
    n: 4, vsAI: true, turn: 0, over: false, thinking: false,
    h: [], v: [], boxes: [], score: [0, 0], nodes: { h: [], v: [], box: [] }
  };

  // edge indexing: h(r,c) with r in 0..n, c in 0..n-1 ; v(r,c) with r in 0..n-1, c in 0..n
  const hi = (r, c) => r * game.n + c;
  const vi = (r, c) => r * (game.n + 1) + c;
  const boxSides = (r, c) => [
    { a: "h", i: hi(r, c) }, { a: "h", i: hi(r + 1, c) },
    { a: "v", i: vi(r, c) }, { a: "v", i: vi(r, c + 1) }
  ];
  const sidesDrawn = (r, c) => boxSides(r, c).reduce((k, s) => k + (game[s.a][s.i] >= 0 ? 1 : 0), 0);

  /** Boxes touching an edge, as [r,c] pairs. */
  function touching(axis, i) {
    const n = game.n, out = [];
    if (axis === "h") {
      const r = Math.floor(i / n), c = i % n;
      if (r > 0) out.push([r - 1, c]);
      if (r < n) out.push([r, c]);
    } else {
      const r = Math.floor(i / (n + 1)), c = i % (n + 1);
      if (c > 0) out.push([r, c - 1]);
      if (c < n) out.push([r, c]);
    }
    return out;
  }

  function freeEdges() {
    const out = [];
    game.h.forEach((o, i) => { if (o < 0) out.push({ a: "h", i }); });
    game.v.forEach((o, i) => { if (o < 0) out.push({ a: "v", i }); });
    return out;
  }

  function build() {
    const n = game.n;
    game.h = new Array((n + 1) * n).fill(-1);
    game.v = new Array(n * (n + 1)).fill(-1);
    game.boxes = new Array(n * n).fill(-1);
    game.score = [0, 0];
    game.turn = 0;
    game.over = false;
    game.thinking = false;

    const pad = 9, span = (100 - pad * 2) / n;
    const p = i => pad + i * span;
    dom.board.replaceChildren();
    dom.board.classList.remove("locked");
    game.nodes = { h: [], v: [], box: [] };

    // boxes first (under the lines)
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const rect = document.createElementNS(NS, "rect");
      rect.setAttribute("x", p(c)); rect.setAttribute("y", p(r));
      rect.setAttribute("width", span); rect.setAttribute("height", span);
      rect.setAttribute("class", "box");
      dom.board.appendChild(rect);
      game.nodes.box[r * n + c] = rect;
    }

    const addEdge = (axis, i, x1, y1, x2, y2) => {
      const ln = document.createElementNS(NS, "line");
      ln.setAttribute("x1", x1); ln.setAttribute("y1", y1);
      ln.setAttribute("x2", x2); ln.setAttribute("y2", y2);
      ln.setAttribute("class", "edge");
      dom.board.appendChild(ln);
      game.nodes[axis][i] = ln;

      const hit = document.createElementNS(NS, "rect");
      const thick = Math.min(span * 0.55, 9);
      const horiz = y1 === y2;
      hit.setAttribute("x", (horiz ? x1 + span * 0.12 : x1 - thick / 2));
      hit.setAttribute("y", (horiz ? y1 - thick / 2 : y1 + span * 0.12));
      hit.setAttribute("width", horiz ? span * 0.76 : thick);
      hit.setAttribute("height", horiz ? thick : span * 0.76);
      hit.setAttribute("class", "hit");
      hit.setAttribute("tabindex", "0");
      hit.setAttribute("role", "button");
      hit.dataset.a = axis; hit.dataset.i = i;
      hit.addEventListener("click", () => play(axis, i, false));
      hit.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(axis, i, false); }
      });
      dom.board.appendChild(hit);
    };

    for (let r = 0; r <= n; r++) for (let c = 0; c < n; c++)
      addEdge("h", hi(r, c), p(c), p(r), p(c + 1), p(r));
    for (let r = 0; r < n; r++) for (let c = 0; c <= n; c++)
      addEdge("v", vi(r, c), p(c), p(r), p(c), p(r + 1));

    for (let r = 0; r <= n; r++) for (let c = 0; c <= n; c++) {
      const d = document.createElementNS(NS, "circle");
      d.setAttribute("cx", p(c)); d.setAttribute("cy", p(r));
      d.setAttribute("r", 1.6); d.setAttribute("class", "dot");
      dom.board.appendChild(d);
    }

    paint();
  }

  function paint() {
    const n = game.n;
    ["h", "v"].forEach(axis => game[axis].forEach((owner, i) => {
      const node = game.nodes[axis][i];
      node.setAttribute("class", "edge" + (owner >= 0 ? " on o" + owner : ""));
    }));
    game.boxes.forEach((owner, k) => {
      game.nodes.box[k].setAttribute("class", "box" + (owner >= 0 ? " o" + owner : ""));
    });
    dom.score[0].textContent = game.score[0];
    dom.score[1].textContent = game.score[1];
    dom.who[0].classList.toggle("active", !game.over && game.turn === 0);
    dom.who[1].classList.toggle("active", !game.over && game.turn === 1);
    const total = n * n;
    dom.board.classList.toggle("locked", game.over || (game.vsAI && game.turn === 1));
    if (!game.over) {
      const label = game.vsAI
        ? (game.turn === 0 ? "YOUR MOVE" : "MACHINE THINKING")
        : `PLAYER ${game.turn + 1} — YOUR MOVE`;
      dom.prompt.textContent = `${label} · ${game.score[0] + game.score[1]}/${total} SQUARES CLAIMED`;
      dom.prompt.className = "prompt p" + (game.turn + 1);
    }
  }

  function play(axis, i, byAI) {
    if (game.over || game[axis][i] >= 0) return;
    if (game.vsAI && game.turn === 1 && !byAI) return;
    if (game.thinking && !byAI) return;

    game[axis][i] = game.turn;
    let claimed = 0;
    for (const [r, c] of touching(axis, i)) {
      if (game.boxes[r * game.n + c] < 0 && sidesDrawn(r, c) === 4) {
        game.boxes[r * game.n + c] = game.turn;
        game.score[game.turn]++;
        claimed++;
      }
    }

    if (claimed) tone(560 + claimed * 90, .09, "triangle", .04);
    else tone(300, .05);

    if (!claimed) game.turn = 1 - game.turn;
    paint();

    if (game.score[0] + game.score[1] === game.n * game.n) return finish();
    if (game.vsAI && game.turn === 1) scheduleAI();
  }

  function scheduleAI() {
    game.thinking = true;
    setTimeout(() => {
      if (game.over) return;
      const move = chooseAI();
      game.thinking = false;
      if (move) play(move.a, move.i, true);
    }, 420);
  }

  /** Free box-completing move, else a safe move, else the smallest giveaway. */
  function chooseAI() {
    const free = freeEdges();
    if (!free.length) return null;

    const completing = free.filter(e =>
      touching(e.a, e.i).some(([r, c]) => sidesDrawn(r, c) === 3));
    if (completing.length) return completing[Math.floor(Math.random() * completing.length)];

    const safe = free.filter(e =>
      touching(e.a, e.i).every(([r, c]) => sidesDrawn(r, c) < 2));
    if (safe.length) return safe[Math.floor(Math.random() * safe.length)];

    // everything opens something — hand over the shortest chain
    let best = null, bestCost = Infinity;
    for (const e of free) {
      const cost = chainCost(e);
      if (cost < bestCost) { bestCost = cost; best = e; }
    }
    return best;
  }

  /** Rough size of the chain handed over by playing this edge. */
  function chainCost(edge) {
    const seen = new Set();
    let cost = 0;
    const stack = touching(edge.a, edge.i).filter(([r, c]) => sidesDrawn(r, c) === 2);
    while (stack.length) {
      const [r, c] = stack.pop();
      const k = r * game.n + c;
      if (seen.has(k) || game.boxes[k] >= 0) continue;
      seen.add(k);
      cost++;
      for (const s of boxSides(r, c)) {
        if (game[s.a][s.i] >= 0) continue;
        for (const [nr, nc] of touching(s.a, s.i)) {
          if ((nr !== r || nc !== c) && !seen.has(nr * game.n + nc) && sidesDrawn(nr, nc) >= 2) {
            stack.push([nr, nc]);
          }
        }
      }
    }
    return cost;
  }

  function finish() {
    game.over = true;
    paint();
    const [a, b] = game.score;
    const data = store.read();
    const draw = a === b;
    const youWon = a > b;

    dom.big.hidden = false;
    dom.big.textContent = `${a} — ${b}`;
    dom.rules.hidden = true;
    dom.close.hidden = true;
    dom.btn.textContent = "PLAY AGAIN";
    dom.btn.dataset.action = "again";

    if (game.vsAI) {
      data.games = (data.games || 0) + 1;
      if (youWon) data.wins = (data.wins || 0) + 1;
      dom.card.classList.toggle("fail", !youWon && !draw);
      dom.title.textContent = draw ? "DEAD HEAT" : youWon ? "BOARD CLAIMED" : "OUT-PLAYED";
      dom.sub.textContent = draw
        ? "Nothing between you."
        : youWon
          ? `You took ${a} of ${game.n * game.n} squares. ${data.wins} win${data.wins === 1 ? "" : "s"} from ${data.games}.`
          : `The machine took ${b}. ${data.wins || 0} win${(data.wins || 0) === 1 ? "" : "s"} from ${data.games}.`;
    } else {
      dom.card.classList.remove("fail");
      dom.title.textContent = draw ? "DEAD HEAT" : `PLAYER ${youWon ? 1 : 2} TAKES IT`;
      dom.sub.textContent = draw ? "Split right down the middle." : `${Math.max(a, b)} squares to ${Math.min(a, b)}.`;
    }
    store.write(data);
    dom.live.textContent = `${dom.title.textContent}. ${a} to ${b}.`;
    [523, 659, 784].forEach((f, k) => tone(f, .15, "triangle", .03, k * .07));
    setTimeout(() => show(true), 500);
  }

  function show(on) {
    dom.overlay.classList.toggle("show", on);
    if (on) setTimeout(() => dom.btn.focus(), 300);
  }

  function setMode(vsAI) {
    game.vsAI = vsAI;
    dom.mode.textContent = vsAI ? "2 PLAYER" : "VS MACHINE";
    dom.mode.setAttribute("aria-pressed", String(!vsAI));
    dom.modeTag.textContent = vsAI ? "VS MACHINE" : "PASS AND PLAY";
    dom.names[0].textContent = vsAI ? "YOU" : "PLAYER 1";
    dom.names[1].textContent = vsAI ? "MACHINE" : "PLAYER 2";
    build();
    show(false);
  }

  // ---------- wiring ----------
  el("b-new").addEventListener("click", () => { build(); show(false); });
  dom.mode.addEventListener("click", () => setMode(!game.vsAI));
  dom.size.addEventListener("click", () => {
    const next = SIZES[(SIZES.indexOf(game.n) + 1) % SIZES.length];
    game.n = next;
    dom.size.textContent = `${next}×${next}`;
    const d = store.read(); d.size = next; store.write(d);
    build(); show(false);
  });
  dom.sound.addEventListener("click", () => {
    muted = !muted;
    dom.sound.setAttribute("aria-pressed", String(!muted));
    const d = store.read(); d.muted = muted; store.write(d);
    if (!muted) tone(660, .1);
  });

  el("b-help").addEventListener("click", () => {
    dom.card.classList.remove("fail");
    dom.title.textContent = "HOW IT WORKS";
    dom.big.hidden = true;
    dom.sub.textContent = "Close squares, keep the turn, don't open the chain.";
    dom.rules.hidden = false;
    dom.close.hidden = false;
    dom.btn.textContent = "BACK TO THE BOARD";
    dom.btn.dataset.action = "close";
    show(true);
  });

  dom.btn.addEventListener("click", () => {
    if (dom.btn.dataset.action === "again") { build(); show(false); }
    else show(false);
  });
  dom.close.addEventListener("click", () => show(false));
  dom.overlay.addEventListener("click", e => {
    if (e.target === dom.overlay && dom.btn.dataset.action === "close") show(false);
  });

  document.addEventListener("keydown", e => {
    if (dom.overlay.classList.contains("show")) {
      if (e.key === "Escape" && dom.btn.dataset.action === "close") show(false);
      return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key.toLowerCase() === "n") { build(); show(false); }
  });

  // ---------- boot ----------
  try {
    const saved = store.read();
    muted = saved.muted === true;
    dom.sound.setAttribute("aria-pressed", String(!muted));
    if (SIZES.includes(saved.size)) game.n = saved.size;
    dom.size.textContent = `${game.n}×${game.n}`;
    setMode(true);
  } catch (err) {
    console.error(err);
    dom.prompt.textContent = "SOMETHING BROKE. RELOAD TO TRY AGAIN.";
  }
})();
