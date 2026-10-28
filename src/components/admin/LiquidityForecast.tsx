import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { liquidityForecastData } from '../../data/mockData';
import { formatINR } from '../../utils/formatters';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { TrendingUp, ShieldCheck } from 'lucide-react';

export const LiquidityForecast: React.FC = () => {
  const total90DayOutflow = liquidityForecastData.reduce((sum, item) => sum + item.totalOutflow, 0);
  const escrowReserves = 84200000; // ₹8.42 Crores
  const coverageRatio = ((escrowReserves / total90DayOutflow) * 100).toFixed(0);

  const CustomForecastTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-lg bg-card border border-subtle shadow-dropdown text-xs font-mono space-y-1">
          <p className="font-semibold text-ink-primary mb-1">{label}</p>
          <div className="space-y-0.5">
            <p className="text-gold-500">
              Monthly Payouts: <span className="text-ink-primary">{formatINR(payload[0]?.value || 0)}</span>
            </p>
            <p className="text-sky-400">
              Quarterly Compounded: <span className="text-ink-primary">{formatINR(payload[1]?.value || 0)}</span>
            </p>
            <p className="text-ruby-500">
              Redemptions: <span className="text-ink-primary">{formatINR(payload[2]?.value || 0)}</span>
            </p>
            <div className="pt-1 border-t border-subtle text-emerald-500 font-semibold">
              Weekly Cash Call: {formatINR(payload[3]?.value || 0)}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <GlassCard className="p-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-subtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-gold-500" />
            <h3 className="text-base font-semibold text-ink-primary tracking-tight">
              90-Day Rolling Liquidity & Payout Forecast
            </h3>
          </div>
          <p className="text-xs text-ink-secondary">
            Model upcoming interest distribution obligations and redemption claims against segregated bank escrow.
          </p>
        </div>

        {/* Coverage ratio indicator */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-ink-muted">Escrow Buffer:</span>
          <span className="font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
            {coverageRatio}% Liquidity Coverage
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5">
        <div className="p-3.5 rounded-lg bg-surface border border-subtle font-mono">
          <div className="text-[11px] text-ink-muted font-sans">Segregated Escrow Reserves</div>
          <div className="text-lg font-semibold text-ink-primary mt-0.5 tabular-nums">{formatINR(escrowReserves)}</div>
          <div className="text-[10px] text-ink-muted mt-0.5 font-sans">HDFC Bank Corporate Escrow</div>
        </div>

        <div className="p-3.5 rounded-lg bg-surface border border-subtle font-mono">
          <div className="text-[11px] text-ink-muted font-sans">90-Day Projected Outflows</div>
          <div className="text-lg font-semibold text-ink-primary mt-0.5 tabular-nums">{formatINR(total90DayOutflow)}</div>
          <div className="text-[10px] text-ink-muted mt-0.5 font-sans">Across 12-week rolling horizon</div>
        </div>

        <div className="p-3.5 rounded-lg bg-surface border border-subtle font-mono">
          <div className="text-[11px] text-ink-muted font-sans">Next 7-Day Net Cash Call</div>
          <div className="text-lg font-semibold text-ruby-500 mt-0.5 tabular-nums">₹19.85 Lakhs</div>
          <div className="text-[10px] text-emerald-500 mt-0.5 font-sans">Pre-funded & verified</div>
        </div>
      </div>

      {/* Recharts Composed Chart */}
      <div className="p-3 rounded-lg bg-surface border border-subtle">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={liquidityForecastData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis
                dataKey="week"
                tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }}
                stroke="rgba(148, 163, 184, 0.2)"
              />
              <YAxis
                tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`}
                tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }}
                stroke="rgba(148, 163, 184, 0.2)"
                width={45}
              />
              <Tooltip content={<CustomForecastTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', fontFamily: 'sans-serif', paddingTop: '8px' }}
              />
              <Bar dataKey="monthlyInterest" name="Monthly Payouts" stackId="a" fill="#C6A45C" radius={[0, 0, 0, 0]} />
              <Bar dataKey="quarterlyInterest" name="Quarterly Compounded" stackId="a" fill="#38BDF8" radius={[0, 0, 0, 0]} />
              <Bar dataKey="withdrawals" name="Redemptions" stackId="a" fill="#EF4444" radius={[2, 2, 0, 0]} />
              <Line
                type="monotone"
                dataKey="totalOutflow"
                name="Total Cash Requirement"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 3, fill: '#10B981' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </GlassCard>
  );
};
