import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { formatINR } from '../../utils/formatters';
import { TrendingUp, ArrowUpRight, Calculator } from 'lucide-react';

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
  onOpenSimulator,
  onOpenWithdrawal,
}) => {
  // Payout cycle calculation (Day 26 of 30)
  const cycleProgress = 86;
  const strokeDashoffset = 176 - (176 * cycleProgress) / 100;

  return (
    <GlassCard className="p-6 sm:p-7">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Column: Sections A, B, and C */}
        <div className="flex-1 space-y-6">
          {/* Section A — Portfolio identity */}
          <div className="flex items-center gap-3 text-xs">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              Tier-1 Institutional Escrow
            </span>
            <span className="text-ink-muted font-mono">•</span>
            <span className="font-mono text-ink-muted text-[11px]">
              Mandate #KTW-HNI-8812
            </span>
          </div>

          {/* Section B — Primary financial metric */}
          <div>
            <div className="text-xs text-ink-secondary font-normal mb-1">
              Total Active Capital Deployed
            </div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl sm:text-4xl font-semibold text-ink-primary font-mono tracking-tight tabular-nums">
                {formatINR(totalCapital)}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-500 font-mono">
                <TrendingUp className="w-3.5 h-3.5" />
                +{blendedYield.toFixed(2)}% p.a.
              </span>
            </div>
          </div>

          {/* Section C — Supporting metrics in clean horizontal row with subtle dividers */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-5 border-t border-subtle">
            <div>
              <div className="text-[11px] text-ink-muted">Interest Accrued</div>
              <div className="text-base font-semibold text-ink-primary font-mono mt-0.5 tabular-nums">
                {formatINR(totalAccruedInterest)}
              </div>
            </div>

            <div className="sm:border-l sm:border-subtle sm:pl-4">
              <div className="text-[11px] text-ink-muted">Blended Yield</div>
              <div className="text-base font-semibold text-emerald-500 font-mono mt-0.5 tabular-nums">
                {blendedYield.toFixed(2)}%
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 sm:border-l sm:border-subtle sm:pl-4">
              <div className="text-[11px] text-ink-muted">Next Scheduled Payout</div>
              <div className="text-base font-semibold text-ink-primary font-mono mt-0.5 tabular-nums">
                {formatINR(nextPayoutAmount)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Compact Payout Countdown & Minimal Working Actions */}
        <div className="w-full lg:w-64 flex flex-col sm:flex-row lg:flex-col items-center justify-between gap-5 p-4 rounded-xl bg-surface border border-subtle shrink-0">
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
                <span className="text-xs font-mono font-semibold text-ink-primary">4d</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-ink-primary">Next Cycle Due</div>
              <div className="text-[11px] text-ink-muted mt-0.5 font-mono">01 Nov 2026 (T+0)</div>
            </div>
          </div>

          {/* Minimal Action Pair */}
          <div className="flex gap-2 w-full pt-2 sm:pt-0 lg:pt-3 border-t sm:border-t-0 lg:border-t border-subtle">
            <button
              onClick={onOpenSimulator}
              className="flex-1 py-2 px-3 rounded-lg bg-gold-500 hover:bg-gold-600 text-[#080B12] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Simulate</span>
            </button>

            <button
              onClick={onOpenWithdrawal}
              className="flex-1 py-2 px-3 rounded-lg bg-elevated hover:brightness-105 text-ink-primary text-xs font-medium transition-colors flex items-center justify-center gap-1 border border-subtle"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-ink-secondary" />
              <span>Redeem</span>
            </button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
