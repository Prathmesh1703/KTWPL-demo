import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface Particle3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  alpha: number;
}

export const Background3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;

    // Window dimensions
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking for 3D parallax tilt
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse between -1 and 1
      mouse.targetX = (e.clientX / width - 0.5) * 2;
      mouse.targetY = (e.clientY / height - 0.5) * 2;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 3D parameters
    const focalLength = 400;
    const numParticles = 45; // lightweight & ultra-smooth 60fps
    const particles: Particle3D[] = [];

    const isDark = theme === 'dark';
    const goldColor = isDark ? 'rgba(198, 164, 92, ' : 'rgba(180, 83, 9, ';
    const slateColor = isDark ? 'rgba(148, 163, 184, ' : 'rgba(100, 116, 139, ';
    const emeraldColor = isDark ? 'rgba(16, 185, 129, ' : 'rgba(5, 150, 105, ';

    // Initialize 3D cloud
    for (let i = 0; i < numParticles; i++) {
      const spreadX = width * 0.9;
      const spreadY = height * 0.9;
      const spreadZ = 500;

      const x = (Math.random() - 0.5) * spreadX;
      const y = (Math.random() - 0.5) * spreadY;
      const z = (Math.random() - 0.5) * spreadZ;

      const colorType = Math.random();
      const color = colorType > 0.7 ? goldColor : colorType > 0.4 ? emeraldColor : slateColor;

      particles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        vz: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 2 + 1.2,
        color,
        alpha: Math.random() * 0.35 + 0.15,
      });
    }

    let rotX = 0;
    let rotY = 0;

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Smooth camera interpolation towards cursor
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      rotY = mouse.x * 0.25; // 3D yaw tilt
      rotX = -mouse.y * 0.2; // 3D pitch tilt

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const centerX = width / 2;
      const centerY = height / 2;

      // Projected points buffer for connecting lines
      const projectedPoints: { x: number; y: number; z: number; alpha: number; color: string; size: number }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Slight natural floating drift
        p.baseX += p.vx;
        p.baseY += p.vy;
        p.baseZ += p.vz;

        // Boundary bounce
        if (Math.abs(p.baseX) > width * 0.6) p.vx *= -1;
        if (Math.abs(p.baseY) > height * 0.6) p.vy *= -1;
        if (Math.abs(p.baseZ) > 300) p.vz *= -1;

        // Apply 3D rotation based on mouse parallax
        // Rotate around Y-axis
        const x1 = p.baseX * cosY - p.baseZ * sinY;
        const z1 = p.baseZ * cosY + p.baseX * sinY;

        // Rotate around X-axis
        const y2 = p.baseY * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.baseY * sinX;

        // 3D Perspective Projection
        const zOffset = z2 + 350;
        if (zOffset > 10) {
          const scale = focalLength / (focalLength + zOffset);
          const projX = centerX + x1 * scale;
          const projY = centerY + y2 * scale;

          const depthAlpha = Math.max(0.05, Math.min(0.65, p.alpha * (scale * 1.5)));

          projectedPoints.push({
            x: projX,
            y: projY,
            z: z2,
            alpha: depthAlpha,
            color: p.color,
            size: p.size * scale,
          });
        }
      }

      // Draw subtle connecting 3D constellation lines between nearby points
      for (let i = 0; i < projectedPoints.length; i++) {
        const p1 = projectedPoints[i];
        for (let j = i + 1; j < projectedPoints.length; j++) {
          const p2 = projectedPoints[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const lineAlpha = (1 - dist / 120) * 0.12 * Math.min(p1.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDark
              ? `rgba(255, 255, 255, ${lineAlpha})`
              : `rgba(100, 116, 139, ${lineAlpha * 0.8})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // Draw 3D particle nodes
      for (let i = 0; i < projectedPoints.length; i++) {
        const pt = projectedPoints[i];
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(0.8, pt.size), 0, Math.PI * 2);
        ctx.fillStyle = `${pt.color}${pt.alpha})`;
        ctx.fill();

        // Subtle soft glow around larger nodes
        if (pt.size > 2) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `${pt.color}${pt.alpha * 0.2})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [theme]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-80"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Ambient 3D Liquid Orbs (soft blur) */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gold-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-emerald-500/4 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 left-1/3 w-88 h-88 rounded-full bg-sky-500/4 blur-[110px] pointer-events-none" />
    </div>
  );
};

