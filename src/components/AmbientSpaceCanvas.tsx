import { useEffect, useRef } from 'react';

interface Particle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  rgb: string;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

const PALETTE = [
  '143, 214, 255', // Argon cyan
  '56, 189, 248',  // Deep sky
  '192, 132, 252', // Cosmic violet
  '52, 211, 153',  // Orbital emerald
  '251, 191, 36',  // Solar gold
];

/**
 * AmbientSpaceCanvas — 3D multi-spectral starfield, cyber constellation mesh,
 * subtle atmospheric nebula glow, and orbital meteor streaks.
 */
export default function AmbientSpaceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let width = 0;
    let height = 0;
    let animId = 0;
    let mouseX = -9999;
    let mouseY = -9999;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    const count = Math.min(Math.floor(width / 20), 88);
    const radius = Math.min(width, height) * 0.52;
    const particles: Particle3D[] = [];
    const meteors: Meteor[] = [];

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = radius * Math.cbrt(Math.random());

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      particles.push({
        x,
        y,
        z,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        vz: (Math.random() - 0.5) * 0.22,
        size: 1 + Math.random() * 1.7,
        rgb: PALETTE[i % PALETTE.length],
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    const focal = 620;
    let rotY = 0;
    let rotX = 0;
    let isVisible = !document.hidden;

    const render = () => {
      animId = 0;
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = Math.min(height * 0.38, 360);

      rotY += 0.0016;
      rotX += 0.0005;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const projected: Array<{
        px: number;
        py: number;
        pz: number;
        size: number;
        alpha: number;
        rgb: string;
      }> = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (Math.abs(p.x) > radius) p.vx *= -1;
        if (Math.abs(p.y) > radius) p.vy *= -1;
        if (Math.abs(p.z) > radius) p.vz *= -1;

        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        const scale = focal / (focal + z2 + radius * 0.85);
        const px = cx + x1 * scale;
        const py = cy + y2 * scale;

        const dx = px - mouseX;
        const dy = py - mouseY;
        const dist = Math.hypot(dx, dy);
        let mxPush = 0;
        let myPush = 0;
        if (dist < 140 && dist > 0) {
          const force = (1 - dist / 140) * 18;
          mxPush = (dx / dist) * force;
          myPush = (dy / dist) * force;
        }

        const alpha = Math.max(0.14, Math.min(0.88, (z2 + radius) / (radius * 2)));
        projected.push({
          px: px + mxPush,
          py: py + myPush,
          pz: z2,
          size: p.size * scale,
          alpha,
          rgb: p.rgb,
        });
      }

      // Draw constellation filaments
      const maxDist = 102;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          const dist = Math.hypot(p1.px - p2.px, p1.py - p2.py);
          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.17 * Math.min(p1.alpha, p2.alpha);
            ctx.strokeStyle = `rgba(${p1.rgb}, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }

      // Draw multi-spectral nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        ctx.fillStyle = `rgba(${p.rgb}, ${p.alpha * 0.78})`;
        ctx.shadowColor = `rgba(${p.rgb}, 0.45)`;
        ctx.shadowBlur = 7;
        ctx.beginPath();
        ctx.arc(p.px, p.py, Math.max(0.8, p.size), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Spawn occasional orbital telemetry streak
      if (meteors.length < 2 && Math.random() < 0.008) {
        meteors.push({
          x: Math.random() * width * 0.8 + width * 0.1,
          y: Math.random() * height * 0.35,
          vx: 3.5 + Math.random() * 2.5,
          vy: 1.2 + Math.random() * 1.4,
          life: 0,
          maxLife: 48 + Math.floor(Math.random() * 28),
        });
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx;
        m.y += m.vy;
        m.life++;
        const progress = m.life / m.maxLife;
        const opacity = Math.sin(progress * Math.PI) * 0.55;
        const tailX = m.x - m.vx * 8;
        const tailY = m.y - m.vy * 8;

        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `rgba(224, 242, 254, ${opacity})`);
        grad.addColorStop(1, 'rgba(143, 214, 255, 0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        if (m.life >= m.maxLife) {
          meteors.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    const handleVisibility = () => {
      isVisible = !document.hidden;
      if (!isVisible && animId) {
        cancelAnimationFrame(animId);
        animId = 0;
      } else if (isVisible && !animId) {
        animId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-75"
      aria-hidden="true"
    />
  );
}
