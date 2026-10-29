import React, { useState, useRef, useCallback } from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  enableTilt?: boolean;
  variant?: 'default' | 'liquid';
  glow?: 'gold' | 'emerald' | 'none';
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  enableTilt = true,
  variant = 'default',
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [glarePos, setGlarePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Subtle 3D tilt: max 5 degrees to remain institutional & stable
    const maxTilt = 5;
    const tiltX = (0.5 - y) * maxTilt;
    const tiltY = (x - 0.5) * maxTilt;

    setTilt({ x: tiltX, y: tiltY });
    setGlarePos({ x: x * 100, y: y * 100 });
  }, [enableTilt]);

  const handleMouseEnter = useCallback(() => {
    if (enableTilt) setIsHovered(true);
  }, [enableTilt]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  const cardBaseClass = variant === 'liquid' ? 'liquid-glass' : 'institutional-card';

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered && enableTilt
          ? `perspective(1000px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) translateY(-2px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.2s ease, box-shadow 0.25s ease',
      }}
      className={`${cardBaseClass} interactive-3d-card relative ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Specular Liquid Glare Layer placed behind text content for zero text washout */}
      {enableTilt && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-300 z-0"
          style={{
            opacity: isHovered ? 0.75 : 0,
            background: `radial-gradient(circle 320px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.12), transparent 65%)`,
          }}
        />
      )}

      {/* Card Content with High-Clarity Typography */}
      <div className="relative z-10 w-full h-full text-ink-primary font-sans antialiased">
        {children}
      </div>
    </div>
  );
};
