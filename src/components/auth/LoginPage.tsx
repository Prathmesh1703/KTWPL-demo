import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ShieldCheck, Lock, ArrowRight, UserCheck, Briefcase, ShieldAlert } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
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
    }, 400);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth / 2);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
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

    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.8,
        label: i < tickerLabels.length ? tickerLabels[i] : undefined,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(198, 164, 92, ${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(241, 243, 246, 0.5)';
        ctx.fill();

        if (p.label) {
          ctx.font = '10px JetBrains Mono, monospace';
          ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
          ctx.fillText(p.label, p.x + 6, p.y + 3);
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-canvas text-ink-primary overflow-hidden font-sans">
      {/* Left Column: Brand Hero & Subtle Network Canvas */}
      <div className="relative w-full lg:w-7/12 flex flex-col justify-between p-8 sm:p-12 lg:p-14 overflow-hidden bg-surface border-r border-subtle">
        <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-60" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-elevated border border-subtle flex items-center justify-center">
              <span className="text-xs font-bold text-gold-500 font-mono tracking-tighter">KT</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-ink-primary">
                Khosla Tradewise
              </h2>
              <p className="text-[10px] text-ink-muted uppercase font-mono tracking-wider">
                Private Limited • Capital Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-elevated border border-subtle text-ink-secondary text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>SEBI REG. INZ00029841</span>
          </div>
        </div>

        {/* Center Title & Proposition */}
        <div className="relative z-10 my-auto py-10 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-elevated border border-subtle text-xs text-ink-secondary mb-5">
            <span className="text-[10px] font-mono uppercase text-gold-500">Platform</span>
            <span>• Institutional Capital Deployment CRM</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold text-ink-primary tracking-tight leading-tight mb-4">
            Predictable Yield.
            <br />
            <span className="text-gold-500">Institutional Governance.</span>
          </h1>

          <p className="text-ink-secondary text-sm leading-relaxed mb-8">
            Empowering family offices, high-net-worth investors, and treasury desks with automated 
            monthly payouts, cryptographic digital agreements, and SEBI-grade compliance surveillance.
          </p>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-5 border-t border-subtle">
            <div>
              <div className="text-[11px] text-ink-muted">Assets Under Mandate</div>
              <div className="text-xl font-semibold text-ink-primary font-mono mt-0.5 tabular-nums">₹428.5 Cr</div>
            </div>
            <div>
              <div className="text-[11px] text-ink-muted">Weighted Coupon Yield</div>
              <div className="text-xl font-semibold text-emerald-500 font-mono mt-0.5 tabular-nums">14.85% p.a.</div>
            </div>
            <div>
              <div className="text-[11px] text-ink-muted">Settlement Speed</div>
              <div className="text-xl font-semibold text-ink-primary font-mono mt-0.5">T+0 Escrow</div>
            </div>
          </div>
        </div>

        {/* Bottom Certifications */}
        <div className="relative z-10 flex flex-wrap items-center gap-6 text-[11px] text-ink-muted pt-4 border-t border-subtle">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 2048-Bit DSC Encryption
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> CKYC & Aadhaar eSign
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Segregated Commercial Escrow
          </span>
        </div>
      </div>

      {/* Right Column: Split Screen Login with Quick Persona Switcher */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center p-8 sm:p-12 bg-canvas">
        <div className="max-w-sm w-full mx-auto space-y-6">
          {/* Quick Persona Switcher */}
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-ink-muted mb-2 flex items-center justify-between">
              <span>Demo Persona Selector</span>
              <span className="text-gold-500">Instant Switch</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-card border border-subtle">
              <button
                type="button"
                onClick={() => handleSelectPersona('investor')}
                className={`flex flex-col items-center gap-1 py-2 px-1 rounded-md text-xs transition-colors ${
                  selectedPersona === 'investor'
                    ? 'bg-elevated text-gold-500 font-medium border border-subtle'
                    : 'text-ink-muted hover:text-ink-secondary'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Investor</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPersona('admin')}
                className={`flex flex-col items-center gap-1 py-2 px-1 rounded-md text-xs transition-colors ${
                  selectedPersona === 'admin'
                    ? 'bg-elevated text-gold-500 font-medium border border-subtle'
                    : 'text-ink-muted hover:text-ink-secondary'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Operations</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPersona('compliance')}
                className={`flex flex-col items-center gap-1 py-2 px-1 rounded-md text-xs transition-colors ${
                  selectedPersona === 'compliance'
                    ? 'bg-elevated text-gold-500 font-medium border border-subtle'
                    : 'text-ink-muted hover:text-ink-secondary'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Compliance</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 rounded-xl bg-card border border-card shadow-sm">
            <h3 className="text-base font-semibold text-ink-primary mb-1">
              Institutional Single Sign-On
            </h3>
            <p className="text-xs text-ink-muted mb-5">
              Enter credentials or proceed directly with the selected role.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs text-ink-secondary font-medium mb-1">
                  Corporate / Registered Email
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-subtle text-ink-primary text-xs font-mono focus:outline-none focus:border-gold-500/50"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-ink-secondary font-medium">
                    Security Passkey / DSC
                  </label>
                  <span className="text-[11px] text-ink-muted">
                    eMudhra DSC
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-subtle text-ink-primary font-mono text-xs tracking-widest focus:outline-none focus:border-gold-500/50"
                    required
                  />
                  <Lock className="w-3.5 h-3.5 text-ink-muted absolute right-3 top-2.5" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-ink-muted pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded bg-surface border-subtle text-gold-500 focus:ring-0" />
                  <span>Remember terminal</span>
                </label>
                <span className="text-emerald-500 font-mono text-[11px]">2FA Active</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-[#080B12] font-semibold text-xs tracking-normal flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60 shadow-sm"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-[#080B12] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enter {selectedPersona === 'investor' ? 'Investor Portal' : selectedPersona === 'admin' ? 'Operations Desk' : 'Compliance Terminal'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-[10px] text-ink-muted text-center">
            Protected by Cloudflare Magic Transit & Hardware Security Modules (HSM).
          </p>
        </div>
      </div>
    </div>
  );
};
