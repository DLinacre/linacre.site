import { useEffect, useRef, useState } from 'react';

interface InteractiveGlobeProps {
  primaryColor: string;
}

export default function InteractiveGlobe({ primaryColor }: InteractiveGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const rotation = useRef({ x: 0.3, y: 0 }); // initial tilt and rotation
  const velocity = useRef({ x: 0, y: 0.006 }); // initial spin velocity
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resolution setup for high-DPI screens
    const dpr = window.devicePixelRatio || 1;
    const size = 32; // diameter in css pixels
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const radius = size * 0.44;
    const centerX = size / 2;
    const centerY = size / 2;

    // Generate coordinate dots on a spherical grid
    const points: { x: number; y: number; z: number }[] = [];
    const latBands = 10;
    const lngBands = 14;
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

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      // Draw glassmorphic atmosphere backing
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = `${primaryColor}06`;
      ctx.fill();
      ctx.strokeStyle = `${primaryColor}18`;
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

      // Rotate and project points
      const projected = points.map(p => {
        // Rotate around Y-axis (longitudinal rotation)
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;

        // Rotate around X-axis (latitudinal tilt)
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        return {
          px: centerX + x1,
          py: centerY + y2,
          pz: z2,
        };
      });

      // Render dots
      projected.forEach(p => {
        const depthRatio = (p.pz + radius) / (2 * radius); // 0.0 to 1.0 (back to front)

        if (p.pz > -2) {
          // Front hemisphere dots: colored, larger, brighter
          const pointSize = 0.55 + depthRatio * 0.75;
          const opacity = 0.2 + depthRatio * 0.8;

          ctx.beginPath();
          ctx.arc(p.px, p.py, pointSize, 0, 2 * Math.PI);
          ctx.fillStyle = primaryColor;
          ctx.globalAlpha = opacity;
          ctx.fill();
        } else {
          // Back hemisphere dots: small, dim
          const opacity = 0.06 + depthRatio * 0.14;

          ctx.beginPath();
          ctx.arc(p.px, p.py, 0.45, 0, 2 * Math.PI);
          ctx.fillStyle = primaryColor;
          ctx.globalAlpha = opacity;
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Event Handlers
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

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
  }, [primaryColor]);

  return (
    <div
      className="flex items-center justify-center select-none shrink-0"
      style={{ width: '36px', height: '36px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas
        ref={canvasRef}
        className="cursor-grab active:cursor-grabbing transition-all duration-300"
        style={{
          opacity: isHovered ? 1.0 : 0.75,
          filter: isHovered ? `drop-shadow(0 0 5px ${primaryColor})` : 'none',
        }}
        title="Drag to spin the globe"
        aria-label="Interactive 3D wireframe globe"
      />
    </div>
  );
}
