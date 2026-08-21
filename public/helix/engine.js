/* HELIX — in-browser evolution engine. No server required. */
(function (root) {
  "use strict";

  const OPCODES = [
    "SEED", "HASH", "XOR", "PERM", "FOLD", "EXPAND", "REFLECT", "BRANCH",
    "CROSS", "EMIT", "ABSORB", "SHIFT", "BLEND", "GUARD", "ECHO", "SPLIT",
    "ROT", "MIX", "CLAMP", "FUSE",
  ];
  const COSTS = {
    SEED: 2, HASH: 6, XOR: 3, PERM: 4, FOLD: 5, EXPAND: 5, REFLECT: 3, BRANCH: 2,
    CROSS: 4, EMIT: 3, ABSORB: 3, SHIFT: 2, BLEND: 4, GUARD: 1, ECHO: 2, SPLIT: 4,
    ROT: 2, MIX: 4, CLAMP: 2, FUSE: 5,
  };
  const OP_INDEX = Object.fromEntries(OPCODES.map((n, i) => [n, i]));

  const CFG = {
    pop: 32,
    genomeMin: 6,
    genomeMax: 28,
    elite: 3,
    tourney: 3,
    mutate: 0.22,
    crossover: 0.72,
    tape: 64,
    out: 32,
    energy: 100,
    archive: 64,
    bangEvery: 120,
    diversityFloor: 0.14,
    history: 180,
    hall: 12,
  };

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hash32(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function hex8(n) {
    return (n >>> 0).toString(16).padStart(8, "0");
  }

  function newId(rng) {
    return hex8((rng() * 0xffffffff) >>> 0) + hex8((rng() * 0xffff) >>> 0).slice(0, 2);
  }

  function shannon(bytes) {
    if (!bytes.length) return 0;
    const c = new Array(256).fill(0);
    for (let i = 0; i < bytes.length; i++) c[bytes[i]]++;
    let e = 0;
    const n = bytes.length;
    for (let i = 0; i < 256; i++) {
      if (!c[i]) continue;
      const p = c[i] / n;
      e -= p * Math.log2(p);
    }
    return e;
  }

  function gene(op, param) {
    return { op: op % OPCODES.length, param: param & 255 };
  }

  function encodeGenome(genes) {
    return genes.map((g) => OPCODES[g.op] + ":" + g.param.toString(16).padStart(2, "0")).join("|");
  }

  function decodeGenome(text) {
    if (!text) return [];
    return text.split("|").filter(Boolean).map((tok) => {
      const [name, hx] = tok.split(":");
      return gene(OP_INDEX[name] || 0, parseInt(hx || "0", 16) || 0);
    });
  }

  function randomGenome(rng) {
    const n = CFG.genomeMin + Math.floor(rng() * (CFG.genomeMax - CFG.genomeMin + 1));
    const genes = [];
    for (let i = 0; i < n; i++) genes.push(gene(Math.floor(rng() * OPCODES.length), Math.floor(rng() * 256)));
    return genes;
  }

  function clampGenome(genes) {
    let g = genes.slice(0, CFG.genomeMax);
    if (!g.length) g = [gene(0, 1)];
    while (g.length < CFG.genomeMin) {
      const last = g[g.length - 1];
      g.push(gene((last.op + 1) % OPCODES.length, (last.param * 17 + 31) & 255));
    }
    return g;
  }

  function copyGenes(genes) {
    return genes.map((g) => ({ op: g.op, param: g.param }));
  }

  function genomeDist(a, b) {
    const n = Math.max(a.length, b.length, 1);
    let miss = 0;
    for (let i = 0; i < n; i++) {
      if (!a[i] || !b[i] || a[i].op !== b[i].op) miss++;
    }
    return miss / n;
  }

  function mutate(genes, rng, rate) {
    const g = copyGenes(genes);
    let changes = 0;
    for (const gene_ of g) {
      if (rng() < rate) {
        if (rng() < 0.5) gene_.param = Math.floor(rng() * 256);
        else gene_.op = Math.floor(rng() * OPCODES.length);
        changes++;
      }
    }
    if (rng() < rate * 0.6 && g.length < CFG.genomeMax) {
      g.splice(Math.floor(rng() * (g.length + 1)), 0, gene(Math.floor(rng() * OPCODES.length), Math.floor(rng() * 256)));
      changes++;
    }
    if (rng() < rate * 0.4 && g.length > CFG.genomeMin) {
      g.splice(Math.floor(rng() * g.length), 1);
      changes++;
    }
    if (rng() < rate * 0.25 && g.length >= 4) {
      let i = Math.floor(rng() * g.length);
      let j = Math.floor(rng() * g.length);
      if (i > j) [i, j] = [j, i];
      const slice = g.slice(i, j).reverse();
      g.splice(i, j - i, ...slice);
      changes++;
    }
    return { genes: clampGenome(g), muts: changes };
  }

  function crossover(a, b, rng) {
    if (!a.length) return copyGenes(b);
    if (!b.length) return copyGenes(a);
    let genes;
    if (rng() < 0.55) {
      const ca = Math.floor(rng() * a.length);
      const cb = Math.floor(rng() * b.length);
      genes = copyGenes(a.slice(0, ca)).concat(copyGenes(b.slice(cb)));
    } else {
      const n = Math.max(a.length, b.length);
      genes = [];
      for (let i = 0; i < n; i++) {
        const src = rng() < 0.5 ? a : b;
        if (src[i]) genes.push({ op: src[i].op, param: src[i].param });
      }
    }
    return clampGenome(genes).slice(0, CFG.genomeMax);
  }

  function runVM(genes, env) {
    const n = CFG.tape;
    const tape = new Uint8Array(n);
    for (let i = 0; i < n; i++) tape[i] = env[i % env.length];
    const out = [];
    let energy = CFG.energy;
    let a = 0, b = 0, ip = 0, steps = 0;
    let i = 0;
    let skip = false;
    const spend = (c) => {
      if (energy < c) { energy = 0; return false; }
      energy -= c;
      return true;
    };
    const emit = (v) => { if (out.length < CFG.out) out.push(v & 255); };

    while (i < genes.length && energy > 0) {
      if (skip) { skip = false; i++; continue; }
      const g = genes[i];
      const name = OPCODES[g.op];
      const p = g.param;
      if (!spend(COSTS[name] || 3)) break;
      steps++;
      if (name === "SEED") {
        const h = hash32(String.fromCharCode(...tape.subarray(0, 16)) + p);
        for (let k = 0; k < 16; k++) tape[k % n] ^= (h >>> ((k % 4) * 8)) & 255;
        a = h & 255;
      } else if (name === "HASH") {
        const h = hash32(String.fromCharCode(...tape) + p + "," + a);
        const span = 16 + (p % 16);
        for (let k = 0; k < span; k++) tape[k % n] = (h >>> ((k % 4) * 8)) & 255;
        b = (h >>> 8) & 255;
      } else if (name === "XOR") {
        for (let k = 0; k < n; k++) tape[k] ^= (p + k * a) & 255;
      } else if (name === "PERM") {
        const step = (p % (n - 1)) + 1;
        const nxt = new Uint8Array(n);
        for (let k = 0; k < n; k++) nxt[k] = tape[(k * step) % n];
        tape.set(nxt);
      } else if (name === "FOLD") {
        const half = n >> 1;
        for (let k = 0; k < half; k++) tape[k] = (tape[k] + tape[k + half] + p) & 255;
        for (let k = half; k < n; k++) tape[k] = tape[k - half] ^ p;
      } else if (name === "EXPAND") {
        const half = Math.max(1, n >> 1);
        const src = tape.slice(0, half);
        for (let k = 0; k < n; k++) tape[k] = (src[k % src.length] + k * p) & 255;
      } else if (name === "REFLECT") {
        tape.reverse();
        for (let k = 0; k < n; k++) tape[k] ^= (p * (k + 1)) & 255;
      } else if (name === "BRANCH") {
        a = (a + p + tape[p % n]) & 255;
      } else if (name === "CROSS") {
        for (let k = 0; k < n - 1; k += 2) {
          const x = tape[k], y = tape[k + 1];
          tape[k] = (x & p) | (y & (~p & 255));
          tape[k + 1] = (y & p) | (x & (~p & 255));
        }
      } else if (name === "EMIT") {
        const idx = (a + p) % n;
        emit(tape[idx]);
        emit(tape[(idx + b) % n]);
        a = tape[idx];
      } else if (name === "ABSORB") {
        const v = env[ip % env.length];
        ip++;
        tape[p % n] ^= v;
        b = v;
      } else if (name === "SHIFT") {
        const k = (p % 7) + 1;
        for (let t = 0; t < n; t++) tape[t] = ((tape[t] << k) | (tape[t] >> (8 - k))) & 255;
      } else if (name === "BLEND") {
        const nxt = tape.slice();
        for (let t = 0; t < n; t++) tape[t] = (nxt[t] * (256 - p) + nxt[(t + 1) % n] * p) >> 8;
      } else if (name === "GUARD") {
        b = energy & 255;
      } else if (name === "ECHO") {
        if (out.length) {
          const last = out[out.length - 1];
          tape[p % n] = last;
          emit(last ^ p);
        } else emit(tape[p % n]);
      } else if (name === "SPLIT") {
        const mid = n >> 1;
        const left = tape.slice(0, mid);
        const right = tape.slice(mid);
        for (let t = 0; t < mid; t++) tape[t] = left[t] ^ right[t % right.length] ^ p;
        for (let t = mid; t < n; t++) tape[t] = (right[(t - mid) % right.length] + left[t % left.length]) & 255;
      } else if (name === "ROT") {
        const k = p % n;
        const nxt = new Uint8Array(n);
        nxt.set(tape.subarray(k), 0);
        nxt.set(tape.subarray(0, k), n - k);
        tape.set(nxt);
      } else if (name === "MIX") {
        const h = hash32(String.fromCharCode(p, a, b) + String.fromCharCode(...tape.subarray(0, 16)));
        for (let t = 0; t < n; t++) tape[t] ^= ((h >>> ((t % 4) * 8)) ^ (t * p)) & 255;
      } else if (name === "CLAMP") {
        const lo = Math.min(p, 255 - p), hi = Math.max(p, 255 - p);
        for (let t = 0; t < n; t++) {
          if (tape[t] < lo) tape[t] = lo;
          else if (tape[t] > hi) tape[t] = hi;
        }
      } else if (name === "FUSE") {
        const h = hash32(String.fromCharCode(...tape.subarray(0, 24)) + out.join(",") + p);
        for (let t = 0; t < 8; t++) tape[(a + t) % n] ^= (h >>> ((t % 4) * 8)) & 255;
        emit((h >>> 16) & 255);
        a = (h >>> 8) & 255;
      }
      if (name === "GUARD" && energy < (p / 255) * CFG.energy) skip = true;
      if (name === "BRANCH" && (a ^ p) & 1) {
        i += 1 + (p % 3);
        continue;
      }
      i++;
    }

    const output = out.length ? Uint8Array.from(out) : tape.slice(0, 16);
    const artifact = hex8(hash32(String.fromCharCode(...output) + String.fromCharCode(...tape.subarray(0, 8)))) +
      hex8(hash32("x" + String.fromCharCode(...output)));
    const used = CFG.energy - energy;
    const ent = shannon(output);
    let repeats = 0;
    for (let t = 1; t < output.length; t++) if (output[t] === output[t - 1]) repeats++;
    const structure = 1 - Math.abs((repeats / Math.max(1, output.length)) - 0.18) / 0.82;
    return {
      artifact: artifact.slice(0, 16),
      energy,
      used,
      steps,
      halted: energy > 0,
      entropy: ent,
      structure: Math.max(0, Math.min(1, structure)),
      output,
    };
  }

  function hexDist(a, b) {
    const n = Math.min(a.length, b.length);
    if (!n) return 1;
    let miss = 0;
    for (let i = 0; i < n; i++) if (a[i] !== b[i]) miss++;
    return miss / n;
  }

  function evaluate(org, env, archive) {
    const r = runVM(org.genes, env);
    org.energy = r.energy;
    org.art = r.artifact;
    org.ent = r.entropy;
    org.steps = r.steps;
    org.halted = r.halted;
    org.eff = Math.min(1, (r.entropy * Math.max(1, r.output.length)) / (r.used + 8) / 10);
    const entScore = 1 - Math.abs(r.entropy - 4.6) / 4.6;
    org.str = 0.55 * r.structure + 0.45 * Math.max(0, entScore);
    if (!archive.length) org.nov = 1;
    else {
      let nearest = 1;
      for (let i = Math.max(0, archive.length - CFG.archive); i < archive.length; i++) {
        const d = hexDist(org.art, archive[i]);
        if (d < nearest) nearest = d;
      }
      org.nov = nearest;
    }
    const clean = r.halted ? 1 : 0.35;
    const lenPref = Math.max(0.2, 1 - Math.abs(org.genes.length - 14) / 20);
    org.fit = Math.max(0, Math.min(1.5,
      0.34 * org.nov + 0.24 * org.eff + 0.22 * org.str + 0.10 * clean + 0.10 * lenPref
    ));
  }

  function assignSpecies(pop) {
    const cents = [];
    for (const org of pop) {
      let best = 1e9, assigned = -1;
      for (let i = 0; i < cents.length; i++) {
        const d = genomeDist(org.genes, cents[i]);
        if (d < 0.45 && d < best) { best = d; assigned = i; }
      }
      if (assigned < 0) {
        assigned = cents.length;
        cents.push(org.genes);
      }
      org.sp = assigned;
    }
    return cents.length;
  }

  function diversity(pop) {
    if (pop.length < 2) return 0;
    const step = Math.max(1, (pop.length / 12) | 0);
    let tot = 0, n = 0;
    for (let i = 0; i < pop.length; i += step) {
      for (let j = i + 1; j < pop.length; j += step) {
        tot += genomeDist(pop[i].genes, pop[j].genes);
        n++;
      }
    }
    return n ? tot / n : 0;
  }

  function tournament(pop, rng) {
    let best = pop[(rng() * pop.length) | 0];
    for (let k = 1; k < CFG.tourney; k++) {
      const c = pop[(rng() * pop.length) | 0];
      if (c.fit > best.fit) best = c;
    }
    return best;
  }

  function publicOrg(org) {
    return {
      id: org.id,
      gen: org.gen,
      sp: org.sp,
      fit: +org.fit.toFixed(4),
      nov: +org.nov.toFixed(4),
      eff: +org.eff.toFixed(4),
      str: +org.str.toFixed(4),
      len: org.genes.length,
      art: org.art,
      genes: encodeGenome(org.genes),
      mut: org.muts,
      parents: org.parents.slice(),
      ent: +org.ent.toFixed(3),
      halted: org.halted,
      elite: org.elite,
      birth: org.birth,
      energy: +org.energy.toFixed(2),
    };
  }

  function Universe(seed) {
    this.rng = mulberry32(seed == null ? (Math.random() * 0xffffffff) >>> 0 : seed);
    this.epoch = 0;
    this.pop = [];
    this.archive = [];
    this.lineage = [];
    this.hall = [];
    this.events = [];
    this.history = { epoch: [], best: [], mean: [], diversity: [], species: [], dna_mean: [] };
    this.species = 0;
    this.metrics = { best: 0, mean: 0, diversity: 0, dna_mean: 0, complexity: 0 };
    this.paused = false;
    this.interval = 280;
    this.started = Date.now();
    this.env = this.freshEnv();
    this.bangFlash = 0;
    this.lastBirths = [];
  }

  Universe.prototype.freshEnv = function () {
    const e = new Uint8Array(80);
    for (let i = 0; i < e.length; i++) e[i] = (this.rng() * 256) | 0;
    return e;
  };

  Universe.prototype.note = function (kind, message) {
    this.events.push({ ts: Date.now() / 1000, epoch: this.epoch, kind, message });
    if (this.events.length > 40) this.events.shift();
  };

  Universe.prototype.makeOrg = function (opts) {
    return {
      id: opts.id || newId(this.rng),
      gen: opts.gen || 0,
      sp: 0,
      parents: opts.parents || [],
      genes: clampGenome(opts.genes || randomGenome(this.rng)),
      fit: 0, nov: 0, eff: 0, str: 0, ent: 0, energy: 0, steps: 0,
      art: "",
      halted: true,
      elite: !!opts.elite,
      birth: opts.birth || 0,
      muts: opts.muts || 0,
    };
  };

  Universe.prototype.evaluateAll = function () {
    const env = new Uint8Array(this.env.length + 4);
    env.set(this.env);
    env[env.length - 1] = this.epoch & 255;
    for (const org of this.pop) {
      evaluate(org, env, this.archive);
      if (org.art) this.archive.push(org.art);
    }
    if (this.archive.length > CFG.archive) this.archive = this.archive.slice(-CFG.archive);
    this.species = assignSpecies(this.pop);
    this.recompute();
    const champ = this.champion();
    if (champ) this.updateHall(champ);
  };

  Universe.prototype.recompute = function () {
    const fits = this.pop.map((o) => o.fit);
    const dna = this.pop.map((o) => o.genes.length);
    const best = fits.length ? Math.max.apply(null, fits) : 0;
    const mean = fits.length ? fits.reduce((a, b) => a + b, 0) / fits.length : 0;
    const div = diversity(this.pop);
    const dnaMean = dna.length ? dna.reduce((a, b) => a + b, 0) / dna.length : 0;
    this.metrics = {
      best, mean, diversity: div, dna_mean: dnaMean,
      complexity: best * Math.max(1, dnaMean) * (1 + this.species / 10) * Math.log1p(this.epoch),
    };
  };

  Universe.prototype.champion = function () {
    if (!this.pop.length) return null;
    return this.pop.reduce((a, b) => (a.fit >= b.fit ? a : b));
  };

  Universe.prototype.updateHall = function (org) {
    const row = Object.assign({ saved_epoch: this.epoch }, publicOrg(org));
    this.hall.push(row);
    this.hall.sort((a, b) => b.fit - a.fit);
    const seen = new Set();
    this.hall = this.hall.filter((h) => {
      const k = h.art + h.id;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    }).slice(0, CFG.hall);
  };

  Universe.prototype.ignite = function () {
    this.pop = [];
    for (let i = 0; i < CFG.pop; i++) this.pop.push(this.makeOrg({ birth: 0 }));
    this.epoch = 0;
    this.env = this.freshEnv();
    this.note("genesis", "A cold tape. " + CFG.pop + " organisms seeded.");
    this.evaluateAll();
    this.pushHistory();
  };

  Universe.prototype.nextGen = function () {
    const ranked = this.pop.slice().sort((a, b) => b.fit - a.fit);
    const children = [];
    const births = [];
    for (let i = 0; i < CFG.elite && i < ranked.length; i++) {
      const e = ranked[i];
      children.push(this.makeOrg({
        id: e.id, gen: e.gen, genes: copyGenes(e.genes),
        parents: e.parents, elite: true, birth: e.birth, muts: e.muts,
      }));
    }
    while (children.length < CFG.pop) {
      const p1 = tournament(this.pop, this.rng);
      let genes, parents, gen;
      if (this.rng() < CFG.crossover && this.pop.length > 1) {
        const p2 = tournament(this.pop, this.rng);
        genes = crossover(p1.genes, p2.genes, this.rng);
        parents = [p1.id, p2.id];
        gen = Math.max(p1.gen, p2.gen) + 1;
      } else {
        genes = copyGenes(p1.genes);
        parents = [p1.id];
        gen = p1.gen + 1;
      }
      const m = mutate(genes, this.rng, CFG.mutate);
      const child = this.makeOrg({
        gen, genes: m.genes, parents, birth: this.epoch, muts: m.muts,
      });
      children.push(child);
      births.push({ id: child.id, from: parents[0] });
    }
    this.lastBirths = births;
    this.pop = children.slice(0, CFG.pop);
  };

  Universe.prototype.shouldBang = function () {
    if (this.epoch > 0 && this.epoch % CFG.bangEvery === 0) return true;
    return this.epoch > 25 && this.metrics.diversity < CFG.diversityFloor;
  };

  Universe.prototype.bigBang = function () {
    const champ = this.champion();
    if (champ) this.lineage.push({ genome: encodeGenome(champ.genes), fit: champ.fit, epoch: this.epoch });
    if (this.lineage.length > 16) this.lineage = this.lineage.slice(-16);
    const seeds = this.lineage.slice().sort((a, b) => b.fit - a.fit).map((l) => l.genome);
    if (!seeds.length && champ) seeds.push(encodeGenome(champ.genes));
    this.note("big_bang",
      "Collapse at diversity " + this.metrics.diversity.toFixed(3) +
      (champ ? ". Champion " + champ.id + " folded into lineage memory." : ".")
    );
    const next = [];
    for (let i = 0; i < Math.min(4, seeds.length); i++) {
      const m = mutate(decodeGenome(seeds[i]), this.rng, 0.12);
      next.push(this.makeOrg({
        genes: m.genes, parents: champ ? [champ.id] : [], birth: this.epoch, muts: m.muts,
      }));
    }
    while (next.length < CFG.pop) {
      if (this.rng() < 0.45 && seeds.length) {
        const m = mutate(decodeGenome(seeds[(this.rng() * seeds.length) | 0]), this.rng, 0.35);
        next.push(this.makeOrg({ genes: m.genes, birth: this.epoch, muts: m.muts }));
      } else {
        next.push(this.makeOrg({ birth: this.epoch }));
      }
    }
    this.pop = next;
    this.env = this.freshEnv();
    this.archive = this.archive.slice(-16);
    this.bangFlash = 1;
    this.evaluateAll();
  };

  Universe.prototype.pushHistory = function () {
    this.history.epoch.push(this.epoch);
    this.history.best.push(this.metrics.best);
    this.history.mean.push(this.metrics.mean);
    this.history.diversity.push(this.metrics.diversity);
    this.history.species.push(this.species);
    this.history.dna_mean.push(this.metrics.dna_mean);
    for (const k of Object.keys(this.history)) {
      if (this.history[k].length > CFG.history) this.history[k].shift();
    }
  };

  Universe.prototype.tick = function () {
    if (this.paused) return;
    this.epoch += 1;
    this.nextGen();
    if (this.epoch % 7 === 0) this.env = this.freshEnv();
    this.evaluateAll();
    this.pushHistory();
    if (this.shouldBang()) this.bigBang();
    if (this.bangFlash > 0) this.bangFlash *= 0.86;
  };

  Universe.prototype.snapshot = function () {
    const ranked = this.pop.slice().sort((a, b) => b.fit - a.fit);
    const champ = ranked[0] || null;
    return {
      version: "2.1.0",
      epoch: this.epoch,
      status: this.paused ? "paused" : "running",
      interval: this.interval / 1000,
      uptime: (Date.now() - this.started) / 1000,
      population: this.pop.length,
      species: this.species,
      metrics: this.metrics,
      organisms: ranked.map(publicOrg),
      champion: champ ? publicOrg(champ) : null,
      history: this.history,
      events: this.events.slice(),
      hall: this.hall.slice(),
      bang: this.bangFlash,
      births: this.lastBirths,
      home: "browser",
      source: "local",
    };
  };

  Universe.prototype.persist = function () {
    try {
      const data = {
        epoch: this.epoch,
        pop: this.pop.map((o) => ({
          id: o.id, gen: o.gen, parents: o.parents, genes: encodeGenome(o.genes),
          elite: o.elite, birth: o.birth, muts: o.muts,
        })),
        lineage: this.lineage,
        hall: this.hall,
        history: this.history,
        events: this.events.slice(-12),
      };
      localStorage.setItem("helix-universe-v2", JSON.stringify(data));
    } catch (_) { /* private mode */ }
  };

  Universe.prototype.restore = function () {
    try {
      const raw = localStorage.getItem("helix-universe-v2");
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (!data.pop || !data.pop.length) return false;
      this.epoch = data.epoch || 0;
      this.lineage = data.lineage || [];
      this.hall = data.hall || [];
      this.history = data.history || this.history;
      this.events = data.events || [];
      this.pop = data.pop.map((o) => this.makeOrg({
        id: o.id, gen: o.gen, parents: o.parents || [],
        genes: decodeGenome(o.genes), elite: o.elite, birth: o.birth, muts: o.muts,
      }));
      this.note("resume", "Resumed " + this.pop.length + " organisms at epoch " + this.epoch + ".");
      this.evaluateAll();
      return true;
    } catch (_) {
      return false;
    }
  };

  root.Helix = {
    OPCODES,
    Universe,
    encodeGenome,
    decodeGenome,
    hash32,
  };
})(typeof window !== "undefined" ? window : globalThis);
