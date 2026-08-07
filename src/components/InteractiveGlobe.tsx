import { useEffect, useRef, useState } from 'react';

interface InteractiveGlobeProps {
  primaryColor: string;
  secondaryColor?: string;
  /** Diameter in CSS pixels. v7.1: default raised 32 → 44 so the globe is actually usable. */
  size?: number;
}

/**
 * InteractiveGlobe — a draggable, auto-spinning wireframe Earth.
 *
 * v7.2: back to the compact 32px size (the big globe was too dominant in
 * the header) and links to the live Linacre Global Monitor SITE (not the
 * GitHub repo) — drag still spins without navigating.
 */
export default function InteractiveGlobe({
  primaryColor,
  secondaryColor,
  size = 32,
}: InteractiveGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);
  const draggedDistance = useRef(0);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const rotation = useRef({ x: 0.3, y: 0 }); // initial tilt and rotation
  const velocity = useRef({ x: 0, y: 0.006 }); // initial spin velocity
  const [isHovered, setIsHovered] = useState(false);

  // Link target: the live Linacre Global Monitor dashboard (not the repo).
  const GLOBAL_MONITOR_URL = 'https://dlinacre.github.io/linacre-global-monitor/';
  const accent = secondaryColor ?? '#22d3ee';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resolution setup for high-DPI screens
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const radius = size * 0.46;
    const centerX = size / 2;
    const centerY = size / 2;

    // Generate coordinate dots on a spherical grid
    const points: { x: number; y: number; z: number }[] = [];
    const latBands = 12;
    const lngBands = 16;
    for (let i = 1; i < latBands; i++) {
      const theta = (i * Math.PI) / latBands - Math.PI / 2; // -pi/2 to pi/2 (exclude poles for cleaner look)
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let j = 0; j < lngBands; j++) {
        const phi = (j * 2 * Math.PI) / lngBands; // 0 to 2pi
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const x = radius * cosTheta * sinPhi;
        const y = radius * sinTheta;
        const z = radius * cosTheta * cosPhi;
        points.push({ x, y, z });
      }
    }

    // Great-circle band points (longitude rings every 45° + equator/2 tropics)
    const bands: { x: number; y: number; z: number }[] = [];
    const ringLats = [-0.6, -0.3, 0, 0.3, 0.6];
    for (const lat of ringLats) {
      const theta = lat;
      for (let j = 0; j < 48; j++) {
        const phi = (j * 2 * Math.PI) / 48;
        bands.push({
          x: radius * Math.cos(theta) * Math.sin(phi),
          y: radius * Math.sin(theta),
          z: radius * Math.cos(theta) * Math.cos(phi),
        });
      }
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      // Atmosphere glow (radial gradient backing)
      const glow = ctx.createRadialGradient(centerX, centerY, radius * 0.55, centerX, centerY, radius * 1.15);
      glow.addColorStop(0, `${primaryColor}22`);
      glow.addColorStop(0.7, `${primaryColor}0d`);
      glow.addColorStop(1, `${primaryColor}00`);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.15, 0, 2 * Math.PI);
      ctx.fillStyle = glow;
      ctx.fill();

      // Glassmorphic atmosphere ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = `${primaryColor}0a`;
      ctx.fill();
      ctx.strokeStyle = `${primaryColor}2e`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Inertia & Auto-spin rotation
      if (!isDragging.current) {
        rotation.current.y += velocity.current.y;
        rotation.current.x += velocity.current.x;

        // Apply friction to user spin momentum
        velocity.current.y *= 0.95;
        velocity.current.x *= 0.95;

        // Maintain baseline auto-rotation speed
        if (Math.abs(velocity.current.y) < 0.003) {
          velocity.current.y = 0.003;
        }
      }

      const cosX = Math.cos(rotation.current.x);
      const sinX = Math.sin(rotation.current.x);
      const cosY = Math.cos(rotation.current.y);
      const sinY = Math.sin(rotation.current.y);

      const project = (p: { x: number; y: number; z: number }) => {
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;
        return { px: centerX + x1, py: centerY + y2, pz: z2 };
      };

      // Render band rings first (behind the dots)
      bands.forEach((p) => {
        const { px, py, pz } = project(p);
        const depthRatio = (pz + radius) / (2 * radius);
        if (pz > -1) {
          ctx.beginPath();
          ctx.arc(px, py, 0.7, 0, 2 * Math.PI);
          ctx.fillStyle = accent;
          ctx.globalAlpha = 0.12 + depthRatio * 0.22;
          ctx.fill();
        }
      });

      // Render dots (front hemisphere brighter & larger)
      for (const p of points) {
        const { px, py, pz } = project(p);
        const depthRatio = (pz + radius) / (2 * radius); // 0.0 to 1.0 (back to front)

        if (pz > -2) {
          // Front hemisphere dots: colored, larger, brighter
          const pointSize = 0.6 + depthRatio * 0.85;
          const opacity = 0.25 + depthRatio * 0.75;

          ctx.beginPath();
          ctx.arc(px, py, pointSize, 0, 2 * Math.PI);
          ctx.fillStyle = primaryColor;
          ctx.globalAlpha = opacity;
          ctx.fill();
        } else {
          // Back hemisphere dots: small, dim
          const opacity = 0.07 + depthRatio * 0.16;

          ctx.beginPath();
          ctx.arc(px, py, 0.5, 0, 2 * Math.PI);
          ctx.fillStyle = accent;
          ctx.globalAlpha = opacity;
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Event Handlers
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      draggedDistance.current = 0;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;
      draggedDistance.current += Math.abs(deltaX) + Math.abs(deltaY);

      rotation.current.y += deltaX * 0.01;
      rotation.current.x += deltaY * 0.01;

      // Restrict vertical rotation to prevent flipping upside down
      rotation.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotation.current.x));

      velocity.current = { x: deltaY * 0.005, y: deltaX * 0.005 };
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        draggedDistance.current = 0;
        previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.current.y;

      rotation.current.y += deltaX * 0.015;
      rotation.current.x += deltaY * 0.015;
      rotation.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotation.current.x));

      velocity.current = { x: deltaY * 0.007, y: deltaX * 0.007 };
      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleMouseUp);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleMouseUp);
    };
  }, [primaryColor, accent, size]);

  return (
    <a
      href={GLOBAL_MONITOR_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center select-none shrink-0 rounded-full transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan/50"
      style={{ width: `${size + 8}px`, height: `${size + 8}px` }}
      title="Linacre Global Monitor — live world dashboard"
      aria-label="Linacre Global Monitor — live geopolitical and environmental dashboard (opens in a new tab)"
      onClick={(e) => {
        // A drag is not a click — don't navigate after spinning the globe.
        if (draggedDistance.current > 6) e.preventDefault();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas
        ref={canvasRef}
        className="cursor-grab active:cursor-grabbing transition-all duration-300"
        style={{
          opacity: isHovered ? 1 : 0.8,
          filter: isHovered ? `drop-shadow(0 0 6px ${primaryColor})` : `drop-shadow(0 0 2px ${primaryColor}66)`,
        }}
      />
    </a>
  );
}
