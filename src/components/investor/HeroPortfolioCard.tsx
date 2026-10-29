import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { formatINR } from '../../utils/formatters';
import { TrendingUp, ShieldCheck } from 'lucide-react';

interface HeroPortfolioCardProps {
  totalCapital: number;
  totalAccruedInterest: number;
  blendedYield: number;
  nextPayoutDate: string;
  nextPayoutAmount: number;
  onOpenSimulator: () => void;
  onOpenWithdrawal: () => void;
  onOpenVault: () => void;
}

export const HeroPortfolioCard: React.FC<HeroPortfolioCardProps> = ({
  totalCapital,
  totalAccruedInterest,
  blendedYield,
  nextPayoutDate,
  nextPayoutAmount,
}) => {
  // Payout cycle calculation (Day 26 of 30)
  const cycleProgress = 86;
  const strokeDashoffset = 176 - (176 * cycleProgress) / 100;

  return (
    <GlassCard variant="liquid" enableTilt={true} className="p-6 sm:p-7">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Column: Sections A, B, and C */}
        <div className="flex-1 space-y-6">
          {/* Section A — Portfolio identity */}
          <div className="flex items-center gap-3 text-xs">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              Tier-1 Institutional Escrow
            </span>
            <span className="text-ink-muted font-mono">•</span>
            <span className="font-mono text-ink-secondary text-[11px]">
              Mandate #KTW-HNI-8812
            </span>
          </div>

          {/* Section B — Primary financial metric */}
          <div>
            <div className="text-xs text-ink-secondary font-medium font-sans mb-1">
              Total Active Investment
            </div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl sm:text-4xl font-bold text-ink-primary font-mono tracking-tight tabular-nums">
                {formatINR(totalCapital)}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500 font-mono">
                <TrendingUp className="w-3.5 h-3.5" />
                +{blendedYield.toFixed(2)}% p.a.
              </span>
            </div>
          </div>

          {/* Section C — Supporting metrics in clean horizontal row with subtle dividers */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-5 border-t border-subtle">
            <div>
              <div className="text-[11px] text-ink-muted font-sans">Interest Accrued</div>
              <div className="text-base font-bold text-ink-primary font-mono mt-0.5 tabular-nums">
                {formatINR(totalAccruedInterest)}
              </div>
            </div>

            <div className="sm:border-l sm:border-subtle sm:pl-4">
              <div className="text-[11px] text-ink-muted font-sans">Blended Yield</div>
              <div className="text-base font-bold text-emerald-500 font-mono mt-0.5 tabular-nums">
                {blendedYield.toFixed(2)}%
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 sm:border-l sm:border-subtle sm:pl-4">
              <div className="text-[11px] text-ink-muted font-sans">Next Scheduled Payout</div>
              <div className="text-base font-bold text-ink-primary font-mono mt-0.5 tabular-nums">
                {formatINR(nextPayoutAmount)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Compact Payout Countdown & Minimal Settlement Guarantee */}
        <div className="w-full lg:w-64 flex flex-col sm:flex-row lg:flex-col items-center justify-between gap-5 p-4 rounded-xl bg-surface/80 backdrop-blur-md border border-subtle shrink-0">
          {/* Circular Countdown Ring */}
          <div className="flex items-center gap-4 w-full">
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-13 h-13 -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  className="text-subtle"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  className="text-gold-500 transition-all duration-500 ease-out"
                  strokeWidth="4"
                  strokeDasharray="176"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xs font-mono font-bold text-ink-primary">4d</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-ink-primary font-sans">Upcoming Due</div>
              <div className="text-[11px] text-gold-500 mt-0.5 font-mono">{nextPayoutDate} (T+0)</div>
            </div>
          </div>

          {/* Minimal & Meaningful Institutional Live Settlement Guarantee */}
          <div className="w-full pt-3 border-t border-subtle flex flex-col gap-1 font-mono text-xs">
            <div className="flex items-center justify-between text-ink-secondary">
              <span className="text-[11px] font-sans flex items-center gap-1.5 text-ink-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Auto-Settlement
              </span>
              <span className="text-emerald-500 font-semibold text-[11px] font-mono">T+0 RTGS</span>
            </div>
            <div className="text-[10px] text-ink-muted font-sans truncate">
              Direct to HDFC Bank (••••8492)
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
