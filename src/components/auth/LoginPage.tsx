import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { UserRole } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  UserCheck, 
  Briefcase, 
  ShieldAlert,
  Sparkles,
  Layers,
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [selectedPersona, setSelectedPersona] = useState<UserRole>('investor');
  const [emailInput, setEmailInput] = useState('arjun.singhania@apexholding.in');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleSelectPersona = (role: UserRole) => {
    setSelectedPersona(role);
    if (role === 'investor') {
      setEmailInput('arjun.singhania@apexholding.in');
      setPasswordInput('••••••••••••');
    } else if (role === 'admin') {
      setEmailInput('p.sen@ktwpl.com');
      setPasswordInput('••••••••••••');
    } else {
      setEmailInput('compliance@ktwpl.com');
      setPasswordInput('••••••••••••');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(selectedPersona);
    }, 350);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      label?: string;
    }> = [];

    const tickerLabels = ['NIFTY +0.58%', 'SENSEX +0.51%', 'KTWPL 14.85%', 'T-BILL 6.51%', 'INR 84.06', 'ESCROW T+0'];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.6 + 0.8,
        label: i < tickerLabels.length ? tickerLabels[i] : undefined,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint constellation links
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(198, 164, 92, ${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.65;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particle nodes
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();

        if (p.label) {
          ctx.font = '10px monospace';
          ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
          ctx.fillText(p.label, p.x + 8, p.y + 3);
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-canvas text-ink-primary font-sans relative overflow-hidden select-none">
      {/* Background 3D Constellation Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-70" />

      {/* Ambient 3D Glass Orbs */}
      <div className="fixed top-1/4 -left-32 w-96 h-96 rounded-full bg-gold-500/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 -right-32 w-96 h-96 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* Centered Minimal Liquid Glass Terminal Container */}
      <div className="relative z-10 w-full max-w-xl mx-auto space-y-5 animate-fadeIn">
        {/* Top Minimal Brand Bar */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-surface border border-subtle flex items-center justify-center shadow-md">
              <span className="text-xs font-bold text-gold-500 font-mono tracking-tighter">KT</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink-primary tracking-tight">KTWPL Capital</h2>
              <p className="text-[10px] text-ink-muted font-mono">Private Wealth Terminal</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-surface border border-subtle text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-gold-500" /> : <Moon className="w-3.5 h-3.5 text-ink-primary" />}
            </button>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface border border-subtle text-[11px] font-mono text-ink-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>SEBI INZ00029841</span>
            </div>
          </div>
        </div>

        {/* Central Liquid Glass Login Card */}
        <GlassCard variant="liquid" enableTilt={true} className="p-7 sm:p-9 shadow-2xl">
          <div className="text-center max-w-md mx-auto mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight leading-tight">
              Predictable Yield. <span className="text-gold-500">Institutional Safety.</span>
            </h1>
            <p className="text-xs text-ink-secondary mt-1.5 leading-relaxed">
              Institutional capital management with T+0 bank escrow and continuous SEBI surveillance.
            </p>
          </div>

          {/* Quick Demo Persona Switcher (Segmented Liquid Glass Control) */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-ink-muted mb-2 px-1">
              <span>Select Access Persona</span>
              <span className="text-gold-500">Instant One-Click</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-surface/90 border border-subtle backdrop-blur-md">
              <button
                type="button"
                onClick={() => handleSelectPersona('investor')}
                className={`flex items-center justify-center gap-2 py-2 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedPersona === 'investor'
                    ? 'bg-gold-500 text-[#080B12] font-semibold shadow-md'
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-elevated'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Investor</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPersona('admin')}
                className={`flex items-center justify-center gap-2 py-2 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedPersona === 'admin'
                    ? 'bg-gold-500 text-[#080B12] font-semibold shadow-md'
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-elevated'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Operations</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPersona('compliance')}
                className={`flex items-center justify-center gap-2 py-2 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedPersona === 'compliance'
                    ? 'bg-gold-500 text-[#080B12] font-semibold shadow-md'
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-elevated'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Compliance</span>
              </button>
            </div>
          </div>

          {/* Credential Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-ink-secondary font-medium mb-1.5 px-0.5">
                Corporate / Registered Email
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-subtle text-ink-primary text-xs font-mono focus:outline-none focus:border-gold-500 focus:bg-elevated transition-all"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 px-0.5">
                <label className="text-xs text-ink-secondary font-medium">
                  Security Passkey / DSC Seal
                </label>
                <span className="text-[10px] text-emerald-500 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  eMudhra Class 3
                </span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-subtle text-ink-primary font-mono text-xs tracking-widest focus:outline-none focus:border-gold-500 focus:bg-elevated transition-all"
                  required
                />
                <Lock className="w-3.5 h-3.5 text-ink-muted absolute right-3.5 top-3" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-ink-secondary pt-1 px-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  defaultChecked 
                  className="rounded bg-surface border-subtle text-gold-500 focus:ring-0" 
                />
                <span className="text-[11px]">Remember authorized terminal</span>
              </label>
              <span className="text-emerald-500 font-mono text-[11px]">2FA Active</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-[#080B12] font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-all disabled:opacity-60 shadow-lg shadow-gold-500/20 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-[#080B12] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    Enter {selectedPersona === 'investor' ? 'Investor Portal' : selectedPersona === 'admin' ? 'Operations Desk' : 'Compliance Terminal'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};
