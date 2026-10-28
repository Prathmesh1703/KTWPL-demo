import React, { useState, useMemo } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Periodicity } from '../../types';
import { calculateWealthSimulation } from '../../utils/calculations';
import { formatINR } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid
} from 'recharts';
import { 
  TrendingUp,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WealthSimulatorProps {
  onNotifyCopilot?: (principal: number, tenor: number) => void;
}

export const WealthSimulator: React.FC<WealthSimulatorProps> = ({ onNotifyCopilot }) => {
  const { toast } = useToast();

  const [principal, setPrincipal] = useState<number>(5000000); // ₹50 Lakhs
  const [tenorMonths, setTenorMonths] = useState<number>(24); // 24 months
  const [periodicity, setPeriodicity] = useState<Periodicity>('MONTHLY');

  // Compute live calculation
  const result = useMemo(() => {
    return calculateWealthSimulation(principal, tenorMonths, periodicity);
  }, [principal, tenorMonths, periodicity]);

  const presetAmounts = [
    { label: '₹10L', value: 1000000 },
    { label: '₹25L', value: 2500000 },
    { label: '₹50L', value: 5000000 },
    { label: '₹1Cr', value: 10000000 },
    { label: '₹2.5Cr', value: 25000000 },
    { label: '₹5Cr', value: 50000000 },
  ];

  const handleAmountChange = (newVal: number) => {
    setPrincipal(newVal);
    if (onNotifyCopilot) onNotifyCopilot(newVal, tenorMonths);
  };

  const handleTenorChange = (newTenor: number) => {
    setTenorMonths(newTenor);
    if (onNotifyCopilot) onNotifyCopilot(principal, newTenor);
  };

  const handleSavePlan = () => {
    confetti({
      particleCount: 35,
      spread: 55,
      origin: { y: 0.7 },
      colors: ['#C6A45C', '#10B981'],
    });
    toast.success(
      'Investment Plan Saved',
      `Plan configured for ₹${(principal / 100000).toFixed(1)}L at ${result.rateAnnual.toFixed(2)}% p.a. for ${tenorMonths} months.`
    );
  };

  // Restrained chart tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2.5 rounded-lg bg-card border border-subtle shadow-dropdown text-xs font-mono">
          <p className="text-ink-muted text-[11px] mb-1">{label}</p>
          <div className="space-y-0.5">
            <p className="text-ink-secondary">
              Total Value: <span className="font-semibold text-ink-primary">{formatINR(payload[0]?.value || 0)}</span>
            </p>
            {payload[1] && (
              <p className="text-emerald-500">
                Interest: <span className="font-semibold">{formatINR(payload[1]?.value || 0)}</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <GlassCard className="p-6 sm:p-7">
      {/* Header: Title and Yield */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-500">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-ink-primary tracking-tight">
              Wealth and Payout
            </h2>
            <p className="text-xs text-ink-secondary">
              Calculate your expected interest earnings, payouts, and maturity returns.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-ink-secondary">
          <span>Expected Return:</span>
          <span className="font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
            {result.rateAnnual.toFixed(2)}% p.a.
          </span>
        </div>
      </div>

      {/* Main Grid: Controls vs Visual Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 pt-6">
        {/* Left Column: Interactive Inputs (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Investment Amount Slider & Flat Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-ink-secondary font-medium">
                Investment Amount
              </label>
              <span className="text-base font-mono font-semibold text-ink-primary tabular-nums">
                {formatINR(principal)}
              </span>
            </div>

            <input
              type="range"
              min="100000"
              max="50000000"
              step="100000"
              value={principal}
              onChange={e => handleAmountChange(Number(e.target.value))}
              className="w-full h-1.5 bg-elevated rounded-lg appearance-none cursor-pointer accent-[#C6A45C] focus:outline-none"
            />

            {/* Quick Presets */}
            <div className="grid grid-cols-6 gap-1.5 pt-1">
              {presetAmounts.map(preset => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handleAmountChange(preset.value)}
                  className={`text-[11px] font-mono py-1 rounded transition-colors text-center ${
                    principal === preset.value
                      ? 'bg-elevated text-gold-500 border border-gold-500/30 font-medium'
                      : 'bg-surface text-ink-muted hover:text-ink-secondary hover:bg-elevated border border-subtle'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tenor / Duration */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs text-ink-secondary font-medium">
                Duration
              </label>
              <span className="text-xs font-mono text-ink-primary font-medium">
                {tenorMonths} Months
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 p-1 rounded-lg bg-surface border border-subtle">
              {[6, 12, 24, 36].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleTenorChange(m)}
                  className={`py-1 text-xs font-mono rounded transition-colors ${
                    tenorMonths === m
                      ? 'bg-elevated text-gold-500 font-medium border border-subtle'
                      : 'text-ink-muted hover:text-ink-secondary'
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>

          {/* Payout Frequency */}
          <div className="space-y-1.5">
            <label className="text-xs text-ink-secondary font-medium">
              Payout Frequency
            </label>

            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-surface border border-subtle">
              <button
                type="button"
                onClick={() => setPeriodicity('MONTHLY')}
                className={`py-1.5 px-2 text-xs rounded transition-colors text-center ${
                  periodicity === 'MONTHLY'
                    ? 'bg-elevated text-gold-500 font-medium border border-subtle'
                    : 'text-ink-muted hover:text-ink-secondary'
                }`}
              >
                <div>Monthly</div>
              </button>

              <button
                type="button"
                onClick={() => setPeriodicity('QUARTERLY')}
                className={`py-1.5 px-2 text-xs rounded transition-colors text-center ${
                  periodicity === 'QUARTERLY'
                    ? 'bg-elevated text-gold-500 font-medium border border-subtle'
                    : 'text-ink-muted hover:text-ink-secondary'
                }`}
              >
                <div>Quarterly</div>
              </button>

              <button
                type="button"
                onClick={() => setPeriodicity('MATURITY_COMPOUND')}
                className={`py-1.5 px-2 text-xs rounded transition-colors text-center ${
                  periodicity === 'MATURITY_COMPOUND'
                    ? 'bg-elevated text-gold-500 font-medium border border-subtle'
                    : 'text-ink-muted hover:text-ink-secondary'
                }`}
              >
                <div>At Maturity</div>
              </button>
            </div>
          </div>

          {/* Save Action */}
          <button
            onClick={handleSavePlan}
            className="w-full py-2.5 px-4 rounded-lg bg-gold-500 hover:bg-gold-600 text-[#080B12] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <span>Save Investment Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Column: Visual Summary & Area Chart (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Key Output Metrics Row */}
          <div className="p-4 rounded-lg bg-surface border border-subtle">
            <div className="flex items-baseline justify-between gap-2 pb-3 border-b border-subtle">
              <div>
                <span className="text-[10px] text-ink-muted uppercase font-mono tracking-wider">
                  Projected Total Return
                </span>
                <div className="text-2xl sm:text-3xl font-semibold text-ink-primary font-mono tabular-nums mt-0.5">
                  {formatINR(result.maturityPayout + (periodicity !== 'MATURITY_COMPOUND' ? result.netInterestTotal : 0))}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-ink-muted uppercase font-mono tracking-wider">Annual Yield</span>
                <div className="text-lg font-semibold text-emerald-500 font-mono mt-0.5">
                  {result.rateAnnual.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* 3 Quick Stats */}
            <div className="grid grid-cols-3 gap-3 pt-3 text-xs font-mono">
              <div>
                <div className="text-[10px] text-ink-muted font-sans">Investment</div>
                <div className="font-medium text-ink-secondary mt-0.5 tabular-nums">
                  {formatINR(principal)}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink-muted font-sans">Total Interest</div>
                <div className="font-medium text-emerald-500 mt-0.5 tabular-nums">
                  +{formatINR(result.grossInterestTotal)}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink-muted font-sans">
                  {periodicity === 'MONTHLY' ? 'Monthly Payout' : 'Net Returns'}
                </div>
                <div className="font-medium text-ink-primary mt-0.5 tabular-nums">
                  {periodicity === 'MONTHLY'
                    ? formatINR(Math.round(result.monthlyPayoutAverage * 0.9))
                    : formatINR(result.netInterestTotal)}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Recharts Area Chart */}
          <div className="p-3 rounded-lg bg-surface border border-subtle">
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.schedule} margin={{ top: 8, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="goldSubtleGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C6A45C" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#C6A45C" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="emeraldSubtleGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" />
                  <XAxis
                    dataKey="monthLabel"
                    tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }}
                    stroke="rgba(148, 163, 184, 0.2)"
                  />
                  <YAxis
                    tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`}
                    tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }}
                    stroke="rgba(148, 163, 184, 0.2)"
                    width={45}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="cumulativeWealth"
                    name="Total Value"
                    stroke="#C6A45C"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#goldSubtleGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulativeInterest"
                    name="Interest Earned"
                    stroke="#10B981"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#emeraldSubtleGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Understated minimal 1-line note */}
          <p className="text-[10px] text-ink-muted font-sans">
            *Illustrative projections based on {result.rateAnnual.toFixed(2)}% annual yield before statutory TDS.
          </p>
        </div>
      </div>
    </GlassCard>
  );
};
