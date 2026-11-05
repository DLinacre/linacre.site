import { useState, useRef, MouseEvent, ReactNode } from 'react';

interface Card3DTiltProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number; // max tilt angle in degrees (default 4.5 for sophisticated subtle depth)
  glare?: boolean;
}

/**
 * Card3DTilt — sophisticated, tactile 3D card tilt with precision sapphire specular sheen.
 * Calibrated for a premium, understated physical feel (Linear / Teenage Engineering standard).
 */
export default function Card3DTilt({
  children,
  className = '',
  maxTilt = 4.5,
  glare = true,
}: Card3DTiltProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transformStyle, setTransformStyle] = useState<string>('');
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(4px)`,
    );

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlarePosition({ x: glareX, y: glareY, opacity: 0.12 });
    }
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)');
    setGlarePosition(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-300 ease-out will-change-transform ${className}`}
      style={{
        transform: transformStyle || 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}

      {/* Sapphire Specular Sheen (Subtle, Sophisticated) */}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-xl transition-opacity duration-500 ease-out"
          style={{
            opacity: glarePosition.opacity,
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(143, 214, 255, 0.22) 0%, rgba(255, 255, 255, 0.05) 30%, transparent 60%)`,
            mixBlendMode: 'screen',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
