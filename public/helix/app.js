(() => {
  "use strict";

  const SP = [
    [212, 160, 90], [94, 214, 194], [143, 175, 106], [212, 106, 88],
    [126, 160, 184], [196, 138, 212], [224, 197, 110], [94, 168, 160],
    [208, 137, 106], [154, 168, 122], [184, 107, 107], [196, 165, 116],
  ];
  const $ = (id) => document.getElementById(id);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const canvas = $("stage");
  const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
  const tip = $("tip");

  const cam = {
    yaw: 0.55, pitch: 0.18, dist: 700,
    cx: 0, cy: 0,
    drag: false, lx: 0, ly: 0,
    user: 0,
    autoYaw: 0.55,
  };
  const vis = new Map();
  const sparks = [];
  const spores = [];
  const dust = [];
  const stars = [];
  const ghosts = [];
  const shock = { t: 0, rings: 0 };
  const fx = { wash: 0, pull: 0, mood: 0.08 };

  let universe = null;
  let remote = false;
  let snap = null;
  let selected = null;
  let lastTick = 0;
  let soundOn = false;
  let audio = null;
  let drawerOpen = false;
  let width = 0, height = 0, dpr = 1;
  let idleAt = performance.now();
  let theatre = false;
  let lastFrame = 0;
  let itemsCache = [];
  let lastBangEpoch = -1;

  function rgba(c, a) { return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")"; }
  function mix(a, b, t) {
    return [
      (a[0] + (b[0] - a[0]) * t) | 0,
      (a[1] + (b[1] - a[1]) * t) | 0,
      (a[2] + (b[2] - a[2]) * t) | 0,
    ];
  }
  function hash01(n) { return (n >>> 0) / 4294967296; }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth || window.innerWidth;
    height = canvas.clientHeight || window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cam.cx = width * 0.5;
    cam.cy = height * 0.5;
  }

  function seedField() {
    dust.length = 0;
    stars.length = 0;
    const dn = reduced ? 30 : 140;
    for (let i = 0; i < dn; i++) {
      dust.push({
        x: (Math.random() - 0.5) * 1100,
        y: (Math.random() - 0.5) * 860,
        z: (Math.random() - 0.5) * 1100,
        s: 0.35 + Math.random() * 1.6,
        a: 0.05 + Math.random() * 0.16,
        w: 0.04 + Math.random() * 0.12,
        p: Math.random() * 6.28,
      });
    }
    const sn = reduced ? 40 : 160;
    for (let i = 0; i < sn; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 2400,
        y: (Math.random() - 0.5) * 1600,
        z: (Math.random() - 0.5) * 2400,
        a: 0.15 + Math.random() * 0.55,
        tw: Math.random() * 6.28,
        layer: Math.random() < 0.4 ? 0.35 : Math.random() < 0.7 ? 0.65 : 1,
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
    const f = 540 / (cam.dist + z2);
    return { x: cam.cx + x1 * f, y: cam.cy + y1 * f, s: f, z: z2 };
  }

  function persona(id) {
    const h = Helix.hash32(id);
    return {
      h,
      phase: hash01(h) * Math.PI * 2,
      speed: 0.11 + hash01(h ^ 0x9e3779b9) * 0.22,
      wobble: 16 + hash01(h ^ 0x85ebca6b) * 34,
      bob: 18 + hash01(h ^ 0xc2b2ae35) * 28,
      spin: 0.4 + hash01(h ^ 0x27d4eb2f) * 1.4,
      elev: hash01(h ^ 0x165667b1) - 0.5,
      seedA: hash01(h ^ 0xd3a2646c) * Math.PI * 2,
    };
  }

  function livePos(org, t, pull) {
    const p = vis.get(org.id);
    if (!p) return { x: 0, y: 0, z: 0 };
    const fit = Math.min(1, org.fit || 0);
    const homeR = (175 + (1 - fit) * 175) * (1 - pull * 0.92);
    const homeA = (org.sp || 0) * 2.399963 + p.per.seedA;
    const ang = homeA + t * p.per.speed + Math.sin(t * 0.31 + p.per.phase) * 0.55;
    const r = homeR + Math.sin(t * 0.67 + p.per.phase * 2) * p.per.wobble * (1 - pull);
    const y =
      p.per.elev * 155 +
      (fit - 0.45) * 42 +
      Math.sin(t * 0.43 + p.per.phase) * p.per.bob * (1 - pull) +
      Math.cos(t * 0.19 + p.per.phase * 1.7) * 14 * (1 - pull);
    return { x: Math.cos(ang) * r, y, z: Math.sin(ang) * r };
  }

  function ensureVis(orgs, births) {
    const seen = new Set();
    const from = Object.fromEntries((births || []).map((b) => [b.id, b.from]));
    for (const org of orgs) {
      seen.add(org.id);
      let v = vis.get(org.id);
      const col = SP[(org.sp || 0) % SP.length];
      if (!v) {
        const parent = from[org.id] && vis.get(from[org.id]);
        const per = persona(org.id);
        v = {
          x: parent ? parent.x : 0,
          y: parent ? parent.y : 0,
          z: parent ? parent.z : 0,
          glow: parent ? 1.4 : 0.45,
          color: col,
          per,
          pulse: Math.random(),
          born: 1,
        };
        vis.set(org.id, v);
        if (parent) {
          sparks.push({
            x: parent.x, y: parent.y, z: parent.z,
            tx: v.x, ty: v.y, tz: v.z,
            life: 1, color: col,
          });
          burst(parent.x, parent.y, parent.z, col, 7);
        }
      } else {
        v.color = col;
      }
      v.org = org;
    }
    for (const [id, v] of vis) {
      if (!seen.has(id)) {
        ghosts.push({
          x: v.x, y: v.y, z: v.z, color: v.color, life: 1,
        });
        vis.delete(id);
      }
    }
    if (snap && snap.hall) {
      /* keep a few hall ghosts as distant memory */
    }
  }

  function burst(x, y, z, color, n) {
    if (reduced) return;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const e = Math.random() * Math.PI - 0.5;
      const sp = 18 + Math.random() * 46;
      spores.push({
        x, y, z,
        vx: Math.cos(a) * Math.cos(e) * sp,
        vy: Math.sin(e) * sp,
        vz: Math.sin(a) * Math.cos(e) * sp,
        life: 0.7 + Math.random() * 0.7,
        color,
        s: 1 + Math.random() * 1.8,
      });
    }
  }

  function stepWorld(dt, t) {
    const pull = fx.pull;
    if (snap) {
      for (const org of snap.organisms || []) {
        const v = vis.get(org.id);
        if (!v) continue;
        const dest = livePos(org, t, pull);
        const k = 1 - Math.pow(0.018, dt);
        v.x += (dest.x - v.x) * k;
        v.y += (dest.y - v.y) * k;
        v.z += (dest.z - v.z) * k;
        v.pulse += dt * (0.7 + (org.fit || 0) * 1.4);
        v.glow *= Math.pow(0.25, dt);
        v.born *= Math.pow(0.55, dt);
        if (!reduced && Math.sin(v.pulse * 2.2) > 0.992) {
          const dir = Math.atan2(v.z, v.x);
          spores.push({
            x: v.x, y: v.y, z: v.z,
            vx: Math.cos(dir) * 22, vy: (Math.random() - 0.4) * 16, vz: Math.sin(dir) * 22,
            life: 1.1, color: v.color, s: 1.2,
          });
          v.glow = Math.max(v.glow, 0.55);
        }
      }
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += (s.tx - s.x) * (1 - Math.pow(0.08, dt));
      s.y += (s.ty - s.y) * (1 - Math.pow(0.08, dt));
      s.z += (s.tz - s.z) * (1 - Math.pow(0.08, dt));
      s.life -= dt * 0.55;
      if (s.life <= 0) sparks.splice(i, 1);
    }
    for (let i = spores.length - 1; i >= 0; i--) {
      const s = spores[i];
      s.x += s.vx * dt; s.y += s.vy * dt; s.z += s.vz * dt;
      s.vx *= 0.97; s.vy *= 0.97; s.vz *= 0.97;
      s.life -= dt * 0.38;
      if (s.life <= 0) spores.splice(i, 1);
    }
    if (spores.length > 220) spores.splice(0, spores.length - 220);
    for (let i = ghosts.length - 1; i >= 0; i--) {
      ghosts[i].life -= dt * 0.35;
      ghosts[i].y += dt * 8;
      if (ghosts[i].life <= 0) ghosts.splice(i, 1);
    }
    if (shock.t > 0) shock.t = Math.max(0, shock.t - dt * 0.38);
    fx.wash = Math.max(0, fx.wash - dt * 0.55);
    if (fx.pull > 0) {
      fx.pull = Math.max(0, fx.pull - dt * 0.42);
    }
    if (cam.user > 0 && !cam.drag) cam.user = Math.max(0, cam.user - dt * 0.22);
  }

  function stepCamera(t, dt) {
    if (cam.drag || cam.user > 0) return;
    if (reduced) {
      cam.yaw += dt * 0.04;
      return;
    }
    const bang = shock.t;
    cam.autoYaw += dt * (0.055 + Math.sin(t * 0.07) * 0.012);
    const targetYaw = cam.autoYaw + Math.sin(t * 0.033) * 0.18;
    const targetPitch = 0.17 + Math.sin(t * 0.041) * 0.09 + bang * 0.12;
    const targetDist = 660 + Math.sin(t * 0.027) * 70 - bang * 90 - fx.pull * 80;
    const k = 1 - Math.pow(0.08, dt);
    cam.yaw += (targetYaw - cam.yaw) * k;
    cam.pitch += (targetPitch - cam.pitch) * k;
    cam.dist += (targetDist - cam.dist) * k;
  }

  function fadeCanvas(t) {
    const fade = reduced ? 0.35 : 0.085 + fx.pull * 0.12;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(4,6,9," + fade + ")";
    ctx.fillRect(0, 0, width, height);

    /* slow mood wash in the void */
    const mood = 0.5 + 0.5 * Math.sin(t * 0.015 + fx.mood);
    const nebA = mix([18, 28, 32], [36, 22, 16], mood);
    const nebB = mix([14, 16, 28], [22, 30, 24], 1 - mood);
    ctx.globalCompositeOperation = "lighter";
    const g1 = ctx.createRadialGradient(
      cam.cx + Math.sin(t * 0.05) * 90,
      cam.cy - 30,
      10,
      cam.cx, cam.cy, Math.max(width, height) * 0.55
    );
    g1.addColorStop(0, rgba(nebA, 0.11));
    g1.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, width, height);
    const g2 = ctx.createRadialGradient(
      cam.cx - 140 + Math.cos(t * 0.04) * 50,
      cam.cy + 80,
      10,
      cam.cx, cam.cy + 40, Math.max(width, height) * 0.5
    );
    g2.addColorStop(0, rgba(nebB, 0.09));
    g2.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "source-over";
  }

  function drawStars(t) {
    ctx.globalCompositeOperation = "lighter";
    for (const s of stars) {
      const p = project(s.x * s.layer, s.y * s.layer, s.z * s.layer);
      if (p.z < -800) continue;
      const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 1.3 + s.tw));
      ctx.globalAlpha = s.a * tw * 0.55;
      ctx.fillStyle = "#e8e2d6";
      const sz = (s.layer > 0.8 ? 1.3 : 0.7) * p.s * 10;
      ctx.fillRect(p.x, p.y, sz, sz);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  function drawAurora(t) {
    if (reduced) return;
    ctx.globalCompositeOperation = "lighter";
    for (let b = 0; b < 3; b++) {
      ctx.beginPath();
      const col = b === 1 ? [94, 214, 194] : b === 0 ? [212, 160, 90] : [126, 140, 196];
      ctx.strokeStyle = rgba(col, 0.045);
      ctx.lineWidth = 18 - b * 4;
      for (let x = 0; x <= width; x += 10) {
        const y =
          cam.cy - 40 + b * 36 +
          Math.sin(x * 0.006 + t * 0.18 + b) * 28 +
          Math.sin(x * 0.013 - t * 0.11 + b * 2) * 14;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  function drawDust(t) {
    ctx.globalCompositeOperation = "lighter";
    for (const d of dust) {
      const y = d.y + Math.sin(t * d.w + d.p) * 14;
      const p = project(d.x, y, d.z);
      if (p.z < -500) continue;
      ctx.globalAlpha = d.a;
      ctx.fillStyle = "#d8d2c4";
      const s = d.s * p.s * 9;
      ctx.fillRect(p.x, p.y, s, s);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  function helixPoint(u, rot, rad, h, strand) {
    const turns = 2.55;
    const ang = u * Math.PI * 2 * turns + rot + strand * Math.PI;
    const y = (u - 0.5) * h;
    const pulse = 1 + Math.sin(u * Math.PI * 2 * 3 + rot * 2) * 0.04;
    return {
      x: Math.cos(ang) * rad * pulse,
      y,
      z: Math.sin(ang) * rad * pulse,
    };
  }

  function drawHelix(champ, t) {
    const genes = champ ? (champ.genes || "").split("|").filter(Boolean) : [];
    const steps = reduced ? 40 : 72;
    const h = 310;
    const fit = champ ? Math.min(1, champ.fit || 0) : 0.4;
    const rad = (48 + fit * 14) * (1 - fx.pull * 0.75);
    const rot = t * (reduced ? 0.12 : 0.28);
    const copper = [212, 160, 90];
    const teal = [110, 214, 196];
    const segs = [];

    let prevA = null, prevB = null;
    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      const a = helixPoint(u, rot, rad, h, 0);
      const b = helixPoint(u, rot, rad, h, 1);
      const pa = project(a.x, a.y, a.z);
      const pb = project(b.x, b.y, b.z);
      if (prevA) {
        segs.push({ a: prevA, b: pa, z: (prevA.z + pa.z) * 0.5, c: copper, w: 2.4 });
        segs.push({ a: prevB, b: pb, z: (prevB.z + pb.z) * 0.5, c: teal, w: 2.4 });
      }
      prevA = pa; prevB = pb;
    }

    const rungN = Math.max(genes.length, 10);
    for (let i = 0; i < rungN; i++) {
      const u = (i + 0.5) / rungN;
      const A = helixPoint(u, rot, rad, h, 0);
      const B = helixPoint(u, rot, rad, h, 1);
      const pa = project(A.x, A.y, A.z);
      const pb = project(B.x, B.y, B.z);
      const active = genes.length && ((Math.floor(t * 2.6) + i) % genes.length === i % Math.max(1, genes.length));
      segs.push({
        a: pa, b: pb, z: (pa.z + pb.z) * 0.5,
        c: active ? [232, 226, 214] : [130, 150, 140],
        w: active ? 1.7 : 0.8,
        dim: active ? 0.7 : 0.18,
      });
    }

    /* energy beads climbing the strands */
    const beads = reduced ? 4 : 8;
    for (let i = 0; i < beads; i++) {
      const u = (t * 0.07 + i / beads) % 1;
      const A = helixPoint(u, rot, rad, h, i % 2);
      const p = project(A.x, A.y, A.z);
      segs.push({ bead: true, p, z: p.z, c: i % 2 ? teal : copper, r: 3.2 });
    }

    segs.sort((a, b) => a.z - b.z);
    ctx.globalCompositeOperation = "lighter";
    for (const s of segs) {
      if (s.bead) {
        const g = ctx.createRadialGradient(s.p.x, s.p.y, 0, s.p.x, s.p.y, 14 * s.p.s * 16);
        g.addColorStop(0, rgba(s.c, 0.95));
        g.addColorStop(0.25, rgba(s.c, 0.35));
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s.p.x, s.p.y, 14 * s.p.s * 16, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }
      const depth = 0.35 + Math.max(0, Math.min(1, (s.z + 200) / 600)) * 0.65;
      const alpha = (s.dim != null ? s.dim : 0.75) * depth;
      ctx.strokeStyle = rgba(s.c, alpha);
      ctx.lineWidth = s.w * (0.7 + depth * 1.1);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(s.a.x, s.a.y);
      ctx.lineTo(s.b.x, s.b.y);
      ctx.stroke();
    }

    /* core glow */
    const core = project(0, 0, 0);
    const cg = ctx.createRadialGradient(core.x, core.y, 0, core.x, core.y, 90);
    cg.addColorStop(0, "rgba(232,226,214," + (0.07 + fit * 0.06 + fx.pull * 0.2) + ")");
    cg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.arc(core.x, core.y, 90, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }

  function drawLinks(orgs, t) {
    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = 0.8;
    for (const org of orgs) {
      const v = vis.get(org.id);
      if (!v || !org.parents) continue;
      for (const pid of org.parents) {
        const p = vis.get(pid);
        if (!p) continue;
        const a = project(v.x, v.y, v.z);
        const b = project(p.x, p.y, p.z);
        const mx = (a.x + b.x) / 2 + Math.sin(t * 0.6 + a.x * 0.01) * 10;
        const my = (a.y + b.y) / 2 - 22;
        ctx.strokeStyle = rgba(v.color, 0.07);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(mx, my, b.x, b.y);
        ctx.stroke();
        const u = (t * 0.25 + Helix.hash32(org.id) / 4294967296) % 1;
        const ox = (1 - u) * (1 - u) * a.x + 2 * (1 - u) * u * mx + u * u * b.x;
        const oy = (1 - u) * (1 - u) * a.y + 2 * (1 - u) * u * my + u * u * b.y;
        ctx.fillStyle = rgba(v.color, 0.35);
        ctx.beginPath();
        ctx.arc(ox, oy, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalCompositeOperation = "source-over";
  }

  function glowDot(x, y, r, color, alpha) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rgba(color, alpha));
    g.addColorStop(0.22, rgba(color, alpha * 0.45));
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawOrbs(orgs, t) {
    const items = [];
    for (const org of orgs) {
      const v = vis.get(org.id);
      if (!v) continue;
      items.push({ org, v, p: project(v.x, v.y, v.z) });
    }
    for (const g of ghosts) {
      items.push({ ghost: true, v: g, p: project(g.x, g.y, g.z) });
    }
    items.sort((a, b) => a.p.z - b.p.z);

    ctx.globalCompositeOperation = "lighter";
    for (const item of items) {
      const { p, v } = item;
      if (item.ghost) {
        glowDot(p.x, p.y, 22 * p.s * 14, v.color, 0.12 * v.life);
        continue;
      }
      const org = item.org;
      const beat = 0.5 + 0.5 * Math.sin(v.pulse);
      const r = (4.8 + org.fit * 9.5 + (org.elite ? 2.2 : 0) + v.born * 6) * p.s * 17 * (0.88 + beat * 0.14);
      const alpha = 0.38 + org.fit * 0.4 + v.glow * 0.45;
      glowDot(p.x, p.y, r * 3.6, v.color, alpha * 0.55);
      glowDot(p.x, p.y, r * 1.15, [255, 250, 240], 0.55 + beat * 0.2);

      if (org.elite && !reduced) {
        const ring = r + 6 + Math.sin(t * 2 + v.per.phase) * 1.4;
        ctx.strokeStyle = rgba([232, 201, 122], 0.45);
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, ring, 0, Math.PI * 2);
        ctx.stroke();
        for (let m = 0; m < 4; m++) {
          const ang = t * v.per.spin + m * 1.57;
          glowDot(p.x + Math.cos(ang) * ring, p.y + Math.sin(ang) * ring * 0.55, 4, v.color, 0.5);
        }
      }
      if (selected === org.id) {
        ctx.strokeStyle = "rgba(232,226,214,0.7)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r + 9 + Math.sin(t * 2.4) * 1.5, 0, Math.PI * 2);
        ctx.stroke();
      }
      item.r = r;
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    return items.filter((i) => !i.ghost);
  }

  function drawSparksAndSpores() {
    ctx.globalCompositeOperation = "lighter";
    for (const s of sparks) {
      const p = project(s.x, s.y, s.z);
      glowDot(p.x, p.y, 10 * p.s * 16, s.color, s.life);
    }
    for (const s of spores) {
      const p = project(s.x, s.y, s.z);
      glowDot(p.x, p.y, (2.2 + s.s) * p.s * 12, s.color, s.life * 0.7);
    }
    ctx.globalCompositeOperation = "source-over";
  }

  function drawShock() {
    if (shock.t <= 0) return;
    const p = project(0, 0, 0);
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 3; i++) {
      const u = Math.max(0, 1 - shock.t - i * 0.12);
      if (u <= 0 || u >= 1) continue;
      ctx.strokeStyle = "rgba(232,226,214," + (1 - u) * 0.35 + ")";
      ctx.lineWidth = 2 - i * 0.4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, u * Math.min(width, height) * 0.62, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(232,226,214," + shock.t * 0.07 + ")";
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "source-over";
  }

  function setTheatre(on) {
    if (theatre === on) return;
    theatre = on;
    document.body.classList.toggle("theatre", on);
  }

  function render(ts) {
    const t = ts * 0.001;
    const dt = Math.min(0.05, (ts - lastFrame) / 1000 || 0.016);
    lastFrame = ts;

    if (!reduced && performance.now() - idleAt > 3800 && !drawerOpen && $("welcome").hidden) {
      setTheatre(true);
    }

    stepWorld(dt, t);
    stepCamera(t, dt);
    fadeCanvas(t);
    drawStars(t);
    drawAurora(t);
    drawDust(t);

    if (snap) {
      drawHelix(snap.champion, t);
      drawLinks(snap.organisms || [], t);
      itemsCache = drawOrbs(snap.organisms || [], t);
      drawSparksAndSpores();
      drawShock();
    }
    requestAnimationFrame(render);
  }

  function nearest(mx, my) {
    let best = null, bd = 30;
    for (const it of itemsCache) {
      const d = Math.hypot(it.p.x - mx, it.p.y - my);
      if (d < Math.max(bd, it.r + 10)) { bd = d; best = it; }
    }
    return best;
  }

  function fmt(n, d = 3) {
    return n == null || Number.isNaN(n) ? "—" : Number(n).toFixed(d);
  }
  function pad(n) { return String(n ?? 0).padStart(5, "0"); }

  function apply(s) {
    const prevEpoch = snap && snap.epoch;
    snap = s;
    ensureVis(s.organisms || [], s.births || []);
    if (s.bang > 0.35 && s.epoch !== lastBangEpoch) triggerBang(s.epoch);
    if (s.events && s.events.length) {
      const last = s.events[s.events.length - 1];
      if (last && last.kind === "big_bang" && last.epoch !== lastBangEpoch) triggerBang(last.epoch);
    }
    $("s-epoch").textContent = pad(s.epoch);
    $("ghost-epoch").textContent = pad(s.epoch);
    const st = $("s-status");
    st.className = "v pill " + (s.status || "running");
    st.innerHTML = "<i></i>" + (s.status === "paused" ? "paused" : "live");
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
    if (prevEpoch != null && s.epoch !== prevEpoch) toneEpoch(s);
  }

  function triggerBang(epoch) {
    if (epoch != null) lastBangEpoch = epoch;
    shock.t = 1;
    fx.wash = 1;
    fx.pull = 1;
    if (snap) {
      for (const org of snap.organisms || []) {
        const v = vis.get(org.id);
        if (v) burst(v.x, v.y, v.z, v.color, 5);
      }
    }
    boom();
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
      ].map(([k, v]) => "<span>" + k + "</span><div>" + v + "</div>").join("");
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
      "<li><div class=\"meta\">E" + pad(ev.epoch) + " · <span class=\"kind " + ev.kind + "\">" + ev.kind + "</span></div><div>" + ev.message + "</div></li>"
    ).join("");
    $("hall").innerHTML = (snap.hall || []).map((h) =>
      "<li data-id=\"" + h.id + "\"><div class=\"meta\">fit " + fmt(h.fit) + " · e" + (h.saved_epoch ?? "—") + "</div><div>" + h.id + "</div></li>"
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
    if (open) {
      setTheatre(false);
      fillDrawer(selectedOrg() || (snap && snap.champion));
    }
  }

  function ensureAudio() {
    if (audio) return audio;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    const actx = new AC();
    const master = actx.createGain();
    master.gain.value = 0.0;
    master.connect(actx.destination);

    const filter = actx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 240;
    filter.Q.value = 0.7;
    filter.connect(master);

    function pad(freq, type, gain) {
      const o = actx.createOscillator();
      const g = actx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.value = gain;
      o.connect(g); g.connect(filter);
      o.start();
      return { o, g };
    }
    const a = pad(55, "sine", 0.22);
    const b = pad(82.5, "sine", 0.14);
    const c = pad(110.2, "triangle", 0.05);

    const lfo = actx.createOscillator();
    const lfoG = actx.createGain();
    lfo.frequency.value = 0.05;
    lfoG.gain.value = 40;
    lfo.connect(lfoG);
    lfoG.connect(filter.frequency);
    lfo.start();

    master.gain.linearRampToValueAtTime(0.045, actx.currentTime + 2.4);
    audio = { ctx: actx, master, filter, a, b, c };
    return audio;
  }

  function boom() {
    if (!soundOn || !audio) return;
    const actx = audio.ctx;
    const o = actx.createOscillator();
    const g = actx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(90, actx.currentTime);
    o.frequency.exponentialRampToValueAtTime(32, actx.currentTime + 1.4);
    g.gain.setValueAtTime(0.0001, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.5, actx.currentTime + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + 1.6);
    o.connect(g); g.connect(audio.master);
    o.start(); o.stop(actx.currentTime + 1.7);
  }

  function toneEpoch(s) {
    if (!soundOn || !audio) return;
    /* rare, soft glass — not every tick */
    if ((s.epoch || 0) % 8 !== 0) return;
    const actx = audio.ctx;
    const o = actx.createOscillator();
    const g = actx.createGain();
    o.type = "sine";
    o.frequency.value = 220 + (s.metrics && s.metrics.best ? s.metrics.best * 180 : 80);
    g.gain.setValueAtTime(0.0001, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.045, actx.currentTime + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + 0.9);
    o.connect(g); g.connect(audio.master);
    o.start(); o.stop(actx.currentTime + 1);
  }

  function touch() {
    idleAt = performance.now();
    setTheatre(false);
  }

  async function control(action, extra) {
    touch();
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
    if (action === "bang") { universe.bigBang(); triggerBang(); }
    if (action === "reset") { universe.ignite(); vis.clear(); spores.length = 0; triggerBang(); }
    if (action === "speed" && extra && extra.interval) universe.interval = extra.interval * 1000;
    apply(universe.snapshot());
  }

  function tickLocal(now) {
    if (!universe || remote) return;
    if (now - lastTick >= universe.interval) {
      lastTick = now;
      universe.tick();
      if (universe.epoch % 12 === 0) universe.persist();
      apply(universe.snapshot());
    }
  }

  async function tryRemote() {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 350);
    try {
      const res = await fetch("/api/health", { signal: ctrl.signal });
      clearTimeout(timer);
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
      clearTimeout(timer);
      return false;
    }
  }

  function startLocal() {
    universe = new Helix.Universe();
    if (!universe.restore()) universe.ignite();
    apply(universe.snapshot());
  }

  canvas.addEventListener("pointerdown", (e) => {
    cam.drag = true;
    cam.user = 1;
    canvas.classList.add("grabbing");
    cam.lx = e.clientX; cam.ly = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    touch();
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
      cam.pitch = Math.max(-0.95, Math.min(0.95, cam.pitch + (e.clientY - cam.ly) * 0.004));
      cam.lx = e.clientX; cam.ly = e.clientY;
      cam.autoYaw = cam.yaw;
      return;
    }
    const hit = nearest(e.clientX, e.clientY);
    if (hit) {
      tip.hidden = false;
      tip.style.left = e.clientX + "px";
      tip.style.top = e.clientY + "px";
      tip.textContent = hit.org.id + "  ·  " + fmt(hit.org.fit);
    } else tip.hidden = true;
  });
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    cam.dist = Math.max(360, Math.min(1500, cam.dist + e.deltaY * 0.55));
    cam.user = 1;
    touch();
  }, { passive: false });

  window.addEventListener("pointermove", () => { if (theatre) touch(); }, { passive: true });

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
      if (a) a.master.gain.linearRampToValueAtTime(0.045, a.ctx.currentTime + 1.4);
    } else if (audio) {
      audio.master.gain.linearRampToValueAtTime(0.0001, audio.ctx.currentTime + 0.6);
    }
  });
  $("b-help").addEventListener("click", () => { $("welcome").hidden = false; setTheatre(false); });
  $("b-enter").addEventListener("click", () => {
    $("welcome").hidden = true;
    idleAt = performance.now();
    try { localStorage.setItem("helix-seen", "1"); } catch (_) {}
  });
  $("speed").addEventListener("input", (e) => {
    const ms = Number(e.target.value);
    $("speed-label").textContent = ms + "ms";
    control("speed", { interval: ms / 1000 });
  });

  window.addEventListener("keydown", (e) => {
    if (e.target.matches("input,textarea")) return;
    touch();
    if (e.code === "Space") { e.preventDefault(); control("toggle"); }
    if (e.key === "b") control("bang");
    if (e.key === "d") setDrawer(!drawerOpen);
    if (e.key === "?" || e.key === "h") $("welcome").hidden = false;
    if (e.key === "Escape") { $("welcome").hidden = true; setDrawer(false); }
    if (e.key === "f") setTheatre(!theatre);
  });

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && universe) universe.paused = true;
  });

  resize();
  seedField();
  try { if (localStorage.getItem("helix-seen")) $("welcome").hidden = true; } catch (_) {}

  (async function boot() {
    const ok = await tryRemote();
    if (!ok) startLocal();
    lastTick = performance.now();
    lastFrame = lastTick;
    function loop(now) {
      tickLocal(now);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    requestAnimationFrame(render);
  })();
})();
