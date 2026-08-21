(() => {
  "use strict";

  const SP = ["#d4a05a", "#6ed6c2", "#8faf6a", "#d46a58", "#7ea0b8", "#c48ad4", "#e0c56e", "#5ea8a0", "#d0896a", "#9aa87a", "#b86b6b", "#c4a574"];
  const $ = (id) => document.getElementById(id);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const canvas = $("stage");
  const ctx = canvas.getContext("2d", { alpha: false });
  const tip = $("tip");

  const cam = { yaw: 0.4, pitch: 0.18, dist: 720, cx: 0, cy: 0, drag: false, lx: 0, ly: 0 };
  const vis = new Map();
  const sparks = [];
  const dust = [];
  const shock = { t: 0 };

  let universe = null;
  let remote = false;
  let snap = null;
  let selected = null;
  let hover = null;
  let lastTick = 0;
  let raf = 0;
  let soundOn = false;
  let audio = null;
  let drawerOpen = false;
  let width = 0, height = 0, dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth || window.innerWidth;
    height = canvas.clientHeight || window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cam.cx = width * 0.5;
    cam.cy = height * 0.48;
  }

  function seedDust() {
    dust.length = 0;
    const n = reduced ? 24 : 90;
    for (let i = 0; i < n; i++) {
      dust.push({
        x: (Math.random() - 0.5) * 900,
        y: (Math.random() - 0.5) * 700,
        z: (Math.random() - 0.5) * 900,
        s: 0.4 + Math.random() * 1.4,
        a: 0.08 + Math.random() * 0.18,
      });
    }
  }

  function project(x, y, z) {
    const cy = Math.cos(cam.yaw), sy = Math.sin(cam.yaw);
    const cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
    const x1 = x * cy - z * sy;
    const z1 = x * sy + z * cy;
    const y1 = y * cp - z1 * sp;
    const z2 = y * sp + z1 * cp;
    const f = 520 / (cam.dist + z2);
    return { x: cam.cx + x1 * f, y: cam.cy + y1 * f, s: f, z: z2, a: f };
  }

  function slot(org) {
    const h = Helix.hash32(org.id);
    const a = ((org.sp * 2.399) + (h % 1000) / 1000 * Math.PI * 2);
    const elev = ((h >>> 10) % 1000) / 1000 - 0.5;
    const r = 200 + (1 - Math.min(1, org.fit || 0)) * 150;
    return {
      x: Math.cos(a) * r,
      y: elev * 170 + (org.fit - 0.45) * 50,
      z: Math.sin(a) * r,
    };
  }

  function ensureVis(orgs, births) {
    const seen = new Set();
    const from = Object.fromEntries((births || []).map((b) => [b.id, b.from]));
    for (const org of orgs) {
      seen.add(org.id);
      let v = vis.get(org.id);
      const t = slot(org);
      if (!v) {
        const parent = from[org.id] && vis.get(from[org.id]);
        v = {
          x: parent ? parent.x : t.x,
          y: parent ? parent.y : t.y,
          z: parent ? parent.z : t.z,
          tx: t.x, ty: t.y, tz: t.z,
          glow: parent ? 1 : 0.3,
          color: SP[(org.sp || 0) % SP.length],
        };
        vis.set(org.id, v);
        if (parent) {
          sparks.push({
            x: parent.x, y: parent.y, z: parent.z,
            tx: t.x, ty: t.y, tz: t.z, life: 1, color: v.color,
          });
        }
      } else {
        v.tx = t.x; v.ty = t.y; v.tz = t.z;
        v.color = SP[(org.sp || 0) % SP.length];
      }
      v.org = org;
    }
    for (const id of vis.keys()) if (!seen.has(id)) vis.delete(id);
  }

  function stepVis() {
    const k = reduced ? 0.18 : 0.08;
    for (const v of vis.values()) {
      v.x += (v.tx - v.x) * k;
      v.y += (v.ty - v.y) * k;
      v.z += (v.tz - v.z) * k;
      v.glow *= 0.96;
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += (s.tx - s.x) * 0.12;
      s.y += (s.ty - s.y) * 0.12;
      s.z += (s.tz - s.z) * 0.12;
      s.life -= 0.02;
      if (s.life <= 0) sparks.splice(i, 1);
    }
    if (shock.t > 0) shock.t -= 0.012;
  }

  function drawBackground(t) {
    const g = ctx.createRadialGradient(cam.cx, cam.cy, 20, cam.cx, cam.cy, Math.max(width, height) * 0.75);
    g.addColorStop(0, "#10161c");
    g.addColorStop(0.45, "#080b10");
    g.addColorStop(1, "#05070a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    if (!reduced) {
      const blobs = [
        [cam.cx + Math.sin(t * 0.07) * 80, cam.cy - 40, "#1a2a28", 280],
        [cam.cx - 120, cam.cy + Math.cos(t * 0.05) * 60, "#241c14", 240],
        [cam.cx + 90, cam.cy + 80, "#16101c", 200],
      ];
      ctx.globalCompositeOperation = "lighter";
      for (const [x, y, c, r] of blobs) {
        const ng = ctx.createRadialGradient(x, y, 0, x, y, r);
        ng.addColorStop(0, c);
        ng.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = ng;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    }
  }

  function drawDust(t) {
    ctx.fillStyle = "rgba(232,226,214,0.35)";
    for (const d of dust) {
      const p = project(d.x, d.y + Math.sin(t * 0.15 + d.x) * 8, d.z);
      if (p.z < -400) continue;
      ctx.globalAlpha = d.a;
      ctx.fillRect(p.x, p.y, d.s * p.s * 8, d.s * p.s * 8);
    }
    ctx.globalAlpha = 1;
  }

  function drawHelix(champ, t) {
    const genes = champ ? (champ.genes || "").split("|").filter(Boolean) : [];
    const turns = 2.4;
    const steps = 56;
    const h = 290;
    const rad = 46 + (champ ? champ.fit * 10 : 0);
    const rot = t * (reduced ? 0.15 : 0.35);
    const pulse = 1 + Math.sin(t * 1.4) * 0.03;
    const ptsA = [];
    const ptsB = [];
    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      const ang = u * Math.PI * 2 * turns + rot;
      const y = (u - 0.5) * h;
      ptsA.push(project(Math.cos(ang) * rad * pulse, y, Math.sin(ang) * rad * pulse));
      ptsB.push(project(Math.cos(ang + Math.PI) * rad * pulse, y, Math.sin(ang + Math.PI) * rad * pulse));
    }
    function strokeStrand(pts, color) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.1;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    strokeStrand(ptsA, "#d4a05a");
    strokeStrand(ptsB, "#6ed6c2");

    const rungN = Math.max(genes.length, 8);
    for (let i = 0; i < rungN; i++) {
      const u = (i + 0.5) / rungN;
      const idx = Math.min(steps, (u * steps) | 0);
      const a = ptsA[idx], b = ptsB[idx];
      const active = genes.length && ((Math.floor(t * 3) + i) % genes.length === i % genes.length);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = active ? "rgba(232,226,214,0.55)" : "rgba(142,168,140,0.22)";
      ctx.lineWidth = active ? 1.6 : 1;
      ctx.stroke();
    }
  }

  function drawLinks(orgs) {
    ctx.lineWidth = 0.7;
    for (const org of orgs) {
      const v = vis.get(org.id);
      if (!v || !org.parents) continue;
      for (const pid of org.parents) {
        const p = vis.get(pid);
        if (!p) continue;
        const a = project(v.x, v.y, v.z);
        const b = project(p.x, p.y, p.z);
        ctx.strokeStyle = "rgba(232,226,214,0.07)";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo((a.x + b.x) / 2, (a.y + b.y) / 2 - 24, b.x, b.y);
        ctx.stroke();
      }
    }
  }

  function drawOrbs(orgs, t) {
    const items = [];
    for (const org of orgs) {
      const v = vis.get(org.id);
      if (!v) continue;
      const p = project(v.x, v.y, v.z);
      items.push({ org, v, p });
    }
    items.sort((a, b) => a.p.z - b.p.z);

    hover = null;
    for (const item of items) {
      const { org, v, p } = item;
      const r = (5.5 + org.fit * 10 + (org.elite ? 2 : 0)) * p.s * 18;
      const glow = 14 + org.fit * 22 + v.glow * 28;
      const col = v.color;
      ctx.globalCompositeOperation = "lighter";
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3.2);
      g.addColorStop(0, col);
      g.addColorStop(0.18, col);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalAlpha = 0.22 + org.fit * 0.28;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 3.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 0.95;
      ctx.shadowColor = col;
      ctx.shadowBlur = glow;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = "source-over";

      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.beginPath();
      ctx.arc(p.x - r * 0.28, p.y - r * 0.28, r * 0.28, 0, Math.PI * 2);
      ctx.fill();

      if (org.elite) {
        ctx.strokeStyle = "#e8c97a";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r + 4, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (selected === org.id) {
        ctx.strokeStyle = "#e8e2d6";
        ctx.lineWidth = 1.4;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r + 8 + Math.sin(t * 3) * 1.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      item.r = r;
    }
    ctx.globalAlpha = 1;
    return items;
  }

  function drawSparks() {
    ctx.globalCompositeOperation = "lighter";
    for (const s of sparks) {
      const p = project(s.x, s.y, s.z);
      ctx.globalAlpha = s.life;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.4 * p.s * 16, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  function drawShock() {
    if (shock.t <= 0) return;
    const p = project(0, 0, 0);
    ctx.strokeStyle = `rgba(232,226,214,${shock.t * 0.55})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, (1 - shock.t) * Math.min(width, height) * 0.48, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = `rgba(232,226,214,${shock.t * 0.08})`;
    ctx.fillRect(0, 0, width, height);
  }

  function render(ts) {
    const t = ts * 0.001;
    if (!reduced && !cam.drag) cam.yaw += 0.00115;
    drawBackground(t);
    drawDust(t);
    stepVis();
    if (snap) {
      drawHelix(snap.champion, t);
      drawLinks(snap.organisms || []);
      const items = drawOrbs(snap.organisms || [], t);
      drawSparks();
      drawShock();
      pickHover(items);
    }
    raf = requestAnimationFrame(render);
  }

  function pickHover(items) {
    if (cam.drag) return;
    /* hover updated from last pointer */
    window.__items = items;
  }

  function nearest(mx, my) {
    const items = window.__items || [];
    let best = null, bd = 28;
    for (const it of items) {
      const dx = it.p.x - mx, dy = it.p.y - my;
      const d = Math.hypot(dx, dy);
      if (d < Math.max(bd, it.r + 8)) { bd = d; best = it; }
    }
    return best;
  }

  function fmt(n, d = 3) {
    return n == null || Number.isNaN(n) ? "—" : Number(n).toFixed(d);
  }
  function pad(n) { return String(n ?? 0).padStart(5, "0"); }

  function apply(s) {
    snap = s;
    ensureVis(s.organisms || [], s.births || []);
    if (s.bang > 0.4) shock.t = Math.max(shock.t, s.bang);
    $("s-epoch").textContent = pad(s.epoch);
    const st = $("s-status");
    st.className = "v pill " + (s.status || "running");
    st.innerHTML = `<i></i>${s.status === "paused" ? "paused" : "live"}`;
    $("s-best").textContent = fmt(s.metrics && s.metrics.best);
    $("s-sp").textContent = String(s.species ?? 0);
    $("s-div").textContent = fmt(s.metrics && s.metrics.diversity);
    $("b-toggle").textContent = s.status === "paused" ? "Resume" : "Pause";
    if (s.interval) {
      const ms = Math.round(s.interval * 1000);
      $("speed").value = String(ms);
      $("speed-label").textContent = ms + "ms";
    }
    if (drawerOpen) fillDrawer(selectedOrg() || s.champion);
    $("live").textContent = "Epoch " + s.epoch + ", best " + fmt(s.metrics && s.metrics.best);
  }

  function selectedOrg() {
    if (!snap) return null;
    return (snap.organisms || []).find((o) => o.id === selected) || null;
  }

  function fillDrawer(org) {
    const title = $("ins-title");
    const kv = $("ins-kv");
    const genes = $("ins-genes");
    if (!org) {
      title.textContent = "Inspector";
      kv.innerHTML = "";
      genes.innerHTML = "";
    } else {
      title.textContent = org.elite ? "Elite " + org.id : org.id;
      kv.innerHTML = [
        ["fitness", fmt(org.fit)],
        ["novelty", fmt(org.nov)],
        ["efficiency", fmt(org.eff)],
        ["structure", fmt(org.str)],
        ["species", org.sp],
        ["generation", org.gen],
        ["parents", (org.parents || []).join(" × ") || "genesis"],
        ["artifact", org.art || "—"],
      ].map(([k, v]) => `<span>${k}</span><div>${v}</div>`).join("");
      genes.innerHTML = "";
      (org.genes || "").split("|").filter(Boolean).forEach((tok) => {
        const [op, p] = tok.split(":");
        const el = document.createElement("span");
        el.className = "gene";
        el.textContent = (op || "?") + " " + (p || "");
        genes.appendChild(el);
      });
    }
    $("events").innerHTML = (snap.events || []).slice().reverse().map((ev) =>
      `<li><div class="meta">E${pad(ev.epoch)} · <span class="kind ${ev.kind}">${ev.kind}</span></div><div>${ev.message}</div></li>`
    ).join("");
    $("hall").innerHTML = (snap.hall || []).map((h) =>
      `<li data-id="${h.id}"><div class="meta">fit ${fmt(h.fit)} · e${h.saved_epoch ?? "—"}</div><div>${h.id}</div></li>`
    ).join("");
    $("hall").querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", () => {
        selected = li.dataset.id;
        const found = (snap.organisms || []).find((o) => o.id === selected) ||
          (snap.hall || []).find((o) => o.id === selected);
        if (found) fillDrawer(found);
      });
    });
  }

  function setDrawer(open) {
    drawerOpen = open;
    $("drawer").hidden = false;
    $("drawer").classList.toggle("open", open);
    $("b-details").setAttribute("aria-pressed", String(open));
    if (open) fillDrawer(selectedOrg() || (snap && snap.champion));
  }

  /* ---------- audio (optional, quiet) ---------- */
  function ensureAudio() {
    if (audio) return audio;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    const ctxA = new AC();
    const master = ctxA.createGain();
    master.gain.value = 0.04;
    master.connect(ctxA.destination);
    const osc = ctxA.createOscillator();
    const g = ctxA.createGain();
    osc.type = "sine";
    osc.frequency.value = 72;
    g.gain.value = 0.35;
    osc.connect(g); g.connect(master);
    osc.start();
    audio = { ctx: ctxA, master, osc };
    return audio;
  }
  function blip(freq, dur) {
    if (!soundOn || !audio) return;
    const o = audio.ctx.createOscillator();
    const g = audio.ctx.createGain();
    o.type = "triangle";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, audio.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.18, audio.ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, audio.ctx.currentTime + dur);
    o.connect(g); g.connect(audio.master);
    o.start(); o.stop(audio.ctx.currentTime + dur + 0.02);
  }

  /* ---------- control ---------- */
  async function control(action, extra) {
    if (remote) {
      try {
        const res = await fetch("/api/control", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.assign({ action }, extra || {})),
        });
        const data = await res.json();
        if (data.state) apply(data.state);
      } catch (_) { /* stay */ }
      return;
    }
    if (!universe) return;
    if (action === "toggle") universe.paused = !universe.paused;
    if (action === "pause") universe.paused = true;
    if (action === "resume") universe.paused = false;
    if (action === "bang") { universe.bigBang(); shock.t = 1; blip(90, 0.45); }
    if (action === "reset") { universe.ignite(); vis.clear(); shock.t = 0.7; }
    if (action === "speed" && extra && extra.interval) universe.interval = extra.interval * 1000;
    apply(universe.snapshot());
  }

  function tickLocal(now) {
    if (!universe || remote) return;
    if (now - lastTick >= universe.interval) {
      lastTick = now;
      const before = universe.epoch;
      universe.tick();
      if (universe.epoch !== before) {
        blip(180 + universe.metrics.best * 220, 0.05);
        if (universe.epoch % 12 === 0) universe.persist();
      }
      apply(universe.snapshot());
    }
  }

  async function tryRemote() {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 350);
    try {
      const res = await fetch("/api/health", { signal: ctrl.signal });
      clearTimeout(t);
      if (!res.ok) return false;
      remote = true;
      const wsProto = location.protocol === "https:" ? "wss" : "ws";
      const ws = new WebSocket(wsProto + "://" + location.host + "/ws");
      ws.onmessage = (ev) => { try { apply(JSON.parse(ev.data)); } catch (_) {} };
      ws.onclose = () => { remote = false; };
      const st = await fetch("/api/state");
      apply(await st.json());
      return true;
    } catch (_) {
      clearTimeout(t);
      return false;
    }
  }

  function startLocal() {
    universe = new Helix.Universe();
    if (!universe.restore()) universe.ignite();
    apply(universe.snapshot());
  }

  /* ---------- pointer ---------- */
  canvas.addEventListener("pointerdown", (e) => {
    cam.drag = true;
    canvas.classList.add("grabbing");
    cam.lx = e.clientX; cam.ly = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointerup", (e) => {
    const moved = Math.hypot(e.clientX - cam.lx, e.clientY - cam.ly);
    cam.drag = false;
    canvas.classList.remove("grabbing");
    if (moved < 6) {
      const hit = nearest(e.clientX, e.clientY);
      if (hit) {
        selected = hit.org.id;
        setDrawer(true);
        fillDrawer(hit.org);
      }
    }
  });
  canvas.addEventListener("pointermove", (e) => {
    if (cam.drag) {
      cam.yaw += (e.clientX - cam.lx) * 0.005;
      cam.pitch = Math.max(-0.9, Math.min(0.9, cam.pitch + (e.clientY - cam.ly) * 0.004));
      cam.lx = e.clientX; cam.ly = e.clientY;
      return;
    }
    const hit = nearest(e.clientX, e.clientY);
    if (hit) {
      tip.hidden = false;
      tip.style.left = e.clientX + "px";
      tip.style.top = e.clientY + "px";
      tip.textContent = hit.org.id + " · " + fmt(hit.org.fit);
    } else tip.hidden = true;
  });
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    cam.dist = Math.max(380, Math.min(1400, cam.dist + e.deltaY * 0.6));
  }, { passive: false });

  $("b-toggle").addEventListener("click", () => control("toggle"));
  $("b-bang").addEventListener("click", () => control("bang"));
  $("b-new").addEventListener("click", () => {
    if (confirm("Start a new universe? The living population will be replaced.")) control("reset");
  });
  $("b-details").addEventListener("click", () => setDrawer(!drawerOpen));
  $("b-sound").addEventListener("click", () => {
    soundOn = !soundOn;
    $("b-sound").setAttribute("aria-pressed", String(soundOn));
    if (soundOn) {
      const a = ensureAudio();
      if (a && a.ctx.state === "suspended") a.ctx.resume();
    }
  });
  $("b-help").addEventListener("click", () => { $("welcome").hidden = false; });
  $("b-enter").addEventListener("click", () => {
    $("welcome").hidden = true;
    try { localStorage.setItem("helix-seen", "1"); } catch (_) {}
  });
  $("speed").addEventListener("input", (e) => {
    const ms = Number(e.target.value);
    $("speed-label").textContent = ms + "ms";
    control("speed", { interval: ms / 1000 });
  });

  window.addEventListener("keydown", (e) => {
    if (e.target.matches("input,textarea")) return;
    if (e.code === "Space") { e.preventDefault(); control("toggle"); }
    if (e.key === "b") control("bang");
    if (e.key === "d") setDrawer(!drawerOpen);
    if (e.key === "?" || e.key === "h") $("welcome").hidden = false;
    if (e.key === "Escape") { $("welcome").hidden = true; setDrawer(false); }
  });

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && universe) universe.paused = true;
  });

  resize();
  seedDust();
  try { if (localStorage.getItem("helix-seen")) $("welcome").hidden = true; } catch (_) {}

  (async function boot() {
    const ok = await tryRemote();
    if (!ok) startLocal();
    lastTick = performance.now();
    function loop(now) {
      tickLocal(now);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    raf = requestAnimationFrame(render);
  })();
})();
