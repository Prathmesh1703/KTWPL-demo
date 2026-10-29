import React, { useState } from 'react';
import { MakerCheckerQueue } from './MakerCheckerQueue';
import { LiquidityForecast } from './LiquidityForecast';
import { FundOnboardingModal } from './FundOnboardingModal';
import { AdminMeetingsView } from './AdminMeetingsView';
import { InflowProposal, WithdrawalRequest, MeetingRequest } from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';
import { GlassCard } from '../common/GlassCard';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  UserPlus, 
  ShieldCheck, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Users, 
  TrendingUp,
  Search,
  CheckCircle2,
  Clock,
  Activity,
  Lock,
  BarChart3,
  Calendar
} from 'lucide-react';

interface AdminDashboardProps {
  inflows: InflowProposal[];
  withdrawals: WithdrawalRequest[];
  meetings?: MeetingRequest[];
  onApproveInflow: (id: string, stage: 'MAKER' | 'CHECKER') => void;
  onRejectInflow: (id: string) => void;
  onApproveWithdrawal: (id: string, stage: 'MAKER' | 'CHECKER') => void;
  onRejectWithdrawal: (id: string) => void;
  onAddInflow: (inflow: InflowProposal) => void;
  onAcceptMeeting?: (id: string, meetingLink?: string, feedback?: string) => void;
  onRejectMeeting?: (id: string, reason?: string) => void;
  onRescheduleMeeting?: (id: string, newDate: string, newTimeSlot: string, note?: string) => void;
  onUpdateMeetingNotes?: (id: string, notes: string) => void;
  activeSubTab?: string;
  setActiveTab?: (tab: string) => void;
}

const WEEKLY_TREASURY_STREAM = [
  { week: 'W1 Oct', inflows: 8500000, outflows: 2100000, buffer: 16500000 },
  { week: 'W2 Oct', inflows: 12000000, outflows: 1450000, buffer: 17200000 },
  { week: 'W3 Oct', inflows: 6500000, outflows: 950000, buffer: 17800000 },
  { week: 'W4 Oct', inflows: 15000000, outflows: 3200000, buffer: 18450000 },
  { week: 'W1 Nov', inflows: 9500000, outflows: 1800000, buffer: 18900000 },
  { week: 'W2 Nov', inflows: 14000000, outflows: 2500000, buffer: 19500000 },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  inflows,
  withdrawals,
  meetings = [],
  onApproveInflow,
  onRejectInflow,
  onApproveWithdrawal,
  onRejectWithdrawal,
  onAddInflow,
  onAcceptMeeting,
  onRejectMeeting,
  onRescheduleMeeting,
  onUpdateMeetingNotes,
  activeSubTab = 'maker-checker',
  setActiveTab,
}) => {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState('');

  const pendingInflowsCount = inflows.filter(i => i.status !== 'APPROVED' && i.status !== 'REJECTED').length;
  const pendingWithdrawalsCount = withdrawals.filter(w => w.status !== 'DISBURSED' && w.status !== 'REJECTED').length;
  const totalInflowsVolume = inflows.reduce((sum, i) => sum + i.principalAmount, 0);

  // Mock HNI Clients directory
  const clientsList = [
    {
      id: 'c-1',
      name: 'Arjun Singhania',
      pan: 'AAACS8912P',
      mandatesCount: 3,
      totalCapital: 25000000,
      phone: '+91 98201 44892',
      status: 'CKYC_VERIFIED',
      bank: 'HDFC Bank Nariman Point (••••8492)',
    },
    {
      id: 'c-2',
      name: 'Rajeshwer Rao',
      pan: 'AACPR9102K',
      mandatesCount: 1,
      totalCapital: 5000000,
      phone: '+91 98450 11982',
      status: 'CKYC_VERIFIED',
      bank: 'HDFC Bank Fort Branch (••••1184)',
    },
    {
      id: 'c-3',
      name: 'Meenakshi Sundaram',
      pan: 'BPKPS4419M',
      mandatesCount: 1,
      totalCapital: 12000000,
      phone: '+91 97410 88204',
      status: 'CKYC_VERIFIED',
      bank: 'ICICI Bank MG Road (••••9021)',
    },
    {
      id: 'c-4',
      name: 'Kabir Oberoi',
      pan: 'ADKPO7712N',
      mandatesCount: 2,
      totalCapital: 25000000,
      phone: '+91 98199 44321',
      status: 'CKYC_VERIFIED',
      bank: 'Kotak Mahindra Bank (••••4419)',
    },
  ];

  const filteredClients = clientsList.filter(c =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.pan.toLowerCase().includes(clientSearch.toLowerCase())
  );

  // High-Contrast Liquid Glass Tooltip for Treasury Stream
  const CustomTreasuryTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="liquid-glass-tooltip p-3 text-xs min-w-[210px] font-sans shadow-2xl pointer-events-none">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-subtle">
            <span className="font-bold text-ink-primary text-xs tracking-tight">{data.week}</span>
            <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Escrow Active
            </span>
          </div>

          <div className="space-y-1 font-sans">
            <div className="flex justify-between items-center text-ink-secondary text-xs">
              <span className="font-medium">Gross Inflows:</span>
              <span className="font-bold text-emerald-500 font-mono tabular-nums">{formatINR(data.inflows)}</span>
            </div>
            <div className="flex justify-between items-center text-ink-secondary text-xs">
              <span className="font-medium">Scheduled Payouts:</span>
              <span className="font-bold text-ruby-500 font-mono tabular-nums">{formatINR(data.outflows)}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-subtle text-xs font-semibold">
              <span className="text-gold-500">Escrow Liquidity:</span>
              <span className="text-gold-500 font-bold font-mono tabular-nums">
                {formatINR(data.buffer)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // 1. DEDICATED INFLOW INTAKE VIEW
  if (activeSubTab === 'onboarding') {
    return (
      <div className="space-y-6 pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-subtle">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-sans">
              <UserPlus className="w-5 h-5 text-gold-500" />
              Capital Inflow Intake & Schedule Generator
            </h2>
            <p className="text-xs text-slate-300 font-sans">
              Onboard incoming capital deposits, verify banking UTRs, and generate pre-settlement schedule previews.
            </p>
          </div>

          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-[#080B12] font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ New Intake Wizard</span>
          </button>
        </div>

        {/* Proposals Table */}
        <GlassCard variant="liquid" enableTilt={false} className="p-6">
          <h3 className="text-sm font-bold text-white mb-3 font-sans">Recent Capital Intake Proposals</h3>
          <div className="overflow-x-auto rounded-lg border border-subtle bg-surface">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-subtle text-slate-400 text-[10px] uppercase tracking-wider">
                  <th className="py-2.5 px-4">Inflow Ref</th>
                  <th className="py-2.5 px-4">Client Name & PAN</th>
                  <th className="py-2.5 px-4">Principal Sum</th>
                  <th className="py-2.5 px-4">Tenor & Yield</th>
                  <th className="py-2.5 px-4">UTR & Remitting Bank</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle font-sans">
                {inflows.map(inf => (
                  <tr key={inf.id} className="hover:bg-elevated/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-amber-400">{inf.inflowNo}</td>
                    <td className="py-3 px-4 font-mono">
                      <div className="font-semibold text-white font-sans">{inf.clientName}</div>
                      <div className="text-[10px] text-slate-400">{inf.clientPan}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white tabular-nums">
                      {formatINR(inf.principalAmount)}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      <div>{inf.tenorMonths}m @ {inf.interestRateAnnual}%</div>
                      <div className="text-[10px] text-slate-400">{inf.periodicity}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-300">
                      <div>{inf.utrNumber}</div>
                      <div className="text-[10px] text-slate-400">{inf.bankSource}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-elevated border border-subtle text-white font-medium">
                        {inf.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <FundOnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          onAddInflow={onAddInflow}
        />
      </div>
    );
  }

  // 2. DEDICATED LIQUIDITY FORECAST VIEW
  if (activeSubTab === 'liquidity') {
    return (
      <div className="space-y-6 pb-16">
        <div className="flex items-center justify-between pb-2 border-b border-subtle">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-sans">
              <TrendingUp className="w-5 h-5 text-gold-500" />
              90-Day Rolling Liquidity & Payout Runway
            </h2>
            <p className="text-xs text-slate-300 font-sans">
              Treasury risk model projecting weekly cash calls against HDFC Bank segregated corporate escrow.
            </p>
          </div>
        </div>
        <LiquidityForecast />
      </div>
    );
  }

  // 3. DEDICATED CLIENT DIRECTORY VIEW
  if (activeSubTab === 'clients') {
    return (
      <div className="space-y-6 pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-subtle">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-sans">
              <Users className="w-5 h-5 text-gold-500" />
              HNI Client Mandates Directory
            </h2>
            <p className="text-xs text-slate-300 font-sans">
              Directory of accredited investors, active capital mandates, and verified banking escrow destinations.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search investor or PAN..."
              value={clientSearch}
              onChange={e => setClientSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface border border-subtle text-xs text-white placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClients.map(client => (
            <GlassCard key={client.id} variant="liquid" enableTilt={true} className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-bold text-white text-sm font-sans">{client.name}</h3>
                  <div className="text-[11px] font-mono text-slate-400">{client.pan} • {client.phone}</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {client.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-surface/90 border border-subtle my-3 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">Total Active Capital</span>
                  <span className="font-bold text-white mt-0.5 block tabular-nums">
                    {formatINR(client.totalCapital)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">Active Mandates</span>
                  <span className="font-bold text-amber-400 mt-0.5 block">
                    {client.mandatesCount} Notes
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-300 font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{client.bank}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  // 4. DEDICATED MEETINGS DESK VIEW
  if (activeSubTab === 'meetings') {
    return (
      <AdminMeetingsView
        meetings={meetings}
        onAcceptMeeting={onAcceptMeeting || (() => {})}
        onRejectMeeting={onRejectMeeting || (() => {})}
        onRescheduleMeeting={onRescheduleMeeting || (() => {})}
        onUpdateMeetingNotes={onUpdateMeetingNotes || (() => {})}
      />
    );
  }

  // DEFAULT: MAKER-CHECKER AUTHORIZATION QUEUE (CLEAN, NO DUPLICATES, WITH 3D LIQUID GLASS KPIS)
  return (
    <div className="space-y-6 sm:space-y-7 pb-16">
      {/* Top Banner */}
      <GlassCard variant="liquid" enableTilt={false} className="p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                Staff Desk #402
              </span>
              <span className="text-slate-400 font-mono">•</span>
              <span className="font-mono text-slate-300 text-[11px]">
                Maker-Checker Operations
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
              Back-Office Command & Treasury Desk
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl font-sans">
              Verify capital inflows against banking UTRs, enforce seasoning lock-in checks for redemptions, 
              and schedule T+0 escrow settlements under dual-officer control.
            </p>
          </div>

          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-[#080B12] font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Onboard Fund Inflow</span>
          </button>
        </div>
      </GlassCard>

      {/* 4 3D Liquid Glass KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1: Dual-Control Action Queue */}
        <GlassCard variant="liquid" enableTilt={true} className="p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-ink-secondary font-medium flex items-center gap-1.5 font-sans">
                <Clock className="w-3.5 h-3.5 text-gold-500" />
                Pending Authorizations
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gold-500/10 text-gold-500 border border-gold-500/20">
                Avg 14m SLA
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-ink-primary font-mono tracking-tight tabular-nums">
              {pendingInflowsCount + pendingWithdrawalsCount} <span className="text-xs font-normal text-ink-muted">Actions</span>
            </div>
            <div className="text-[11px] text-ink-secondary font-mono mt-1">
              {pendingInflowsCount} Inflow UTRs • {pendingWithdrawalsCount} Redemptions
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-subtle flex items-center justify-between text-[11px] text-ink-muted font-mono">
            <span>Control Stage</span>
            <span className="text-gold-500 font-medium">Awaiting Checker Sign-off</span>
          </div>
        </GlassCard>

        {/* KPI 2: Pipeline Capital Velocity */}
        <GlassCard variant="liquid" enableTilt={true} className="p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-ink-secondary font-medium flex items-center gap-1.5 font-sans">
                <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500" />
                Pipeline Inflow Volume
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                +18.4% MoM
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-ink-primary font-mono tracking-tight tabular-nums">
              {formatINR(totalInflowsVolume)}
            </div>
            <div className="text-[11px] text-ink-secondary font-mono mt-1">
              4 Active Mandate Proposals
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-subtle flex items-center justify-between text-[11px] text-ink-muted font-mono">
            <span>Escrow Inflow State</span>
            <span className="text-emerald-500 font-medium">T+0 Clearing Verified</span>
          </div>
        </GlassCard>

        {/* KPI 3: Escrow Buffer Coverage */}
        <GlassCard variant="liquid" enableTilt={true} className="p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-ink-secondary font-medium flex items-center gap-1.5 font-sans">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Escrow Reserve Buffer
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                424% Healthy
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-ink-primary font-mono tracking-tight tabular-nums">
              ₹18.45 Cr
            </div>
            <div className="text-[11px] text-ink-secondary font-mono mt-1">
              HDFC Bank Segregated Escrow
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-subtle flex items-center justify-between text-[11px] text-ink-muted font-mono">
            <span>Statutory Ring-Fence</span>
            <span className="text-emerald-500 font-medium">SEBI Compliant</span>
          </div>
        </GlassCard>

        {/* KPI 4: STP Settlement Discipline */}
        <GlassCard variant="liquid" enableTilt={true} className="p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-ink-secondary font-medium flex items-center gap-1.5 font-sans">
                <Lock className="w-3.5 h-3.5 text-gold-500" />
                Settlement Discipline
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-subtle text-ink-secondary">
                0 Rejections
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-ink-primary font-mono tracking-tight tabular-nums">
              100.0% <span className="text-xs font-normal text-ink-muted">STP</span>
            </div>
            <div className="text-[11px] text-ink-secondary font-mono mt-1">
              Direct RBI RTGS Upstreaming
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-subtle flex items-center justify-between text-[11px] text-ink-muted font-mono">
            <span>Disbursement SLA</span>
            <span className="text-emerald-500 font-medium">T+0 Same Day Credit</span>
          </div>
        </GlassCard>
      </div>

      {/* Treasury Inflow & Liquidity Stream Chart (Minimal Institutional Area Chart) */}
      <GlassCard variant="liquid" enableTilt={false} className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-subtle">
          <div>
            <h3 className="text-sm font-bold text-ink-primary flex items-center gap-2 font-sans">
              <Activity className="w-4 h-4 text-gold-500" />
              Rolling Treasury Cash Flow & Escrow Buffer Runway
            </h3>
            <p className="text-xs text-ink-secondary mt-0.5 font-sans">
              Weekly verified capital inflows against projected client redemption calls.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-ink-secondary">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Inflow Velocity</span>
            </span>
            <span className="flex items-center gap-1.5 text-ink-secondary">
              <span className="w-2.5 h-2.5 rounded-full bg-gold-500" />
              <span>Escrow Buffer</span>
            </span>
          </div>
        </div>

        <div className="h-56 sm:h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={WEEKLY_TREASURY_STREAM} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="bufferGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C6A45C" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#C6A45C" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="inflowsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
              <XAxis 
                dataKey="week" 
                tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'monospace' }}
                axisLine={{ stroke: 'var(--border-subtle)' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'monospace' }}
                tickFormatter={(val) => `₹${(val / 10000000).toFixed(1)}Cr`}
                axisLine={false}
                tickLine={false}
              />
              <RechartsTooltip 
                position={{ y: 0 }} 
                content={<CustomTreasuryTooltip />} 
                cursor={{ stroke: 'var(--border-subtle)', strokeDasharray: '4 4' }} 
              />
              <Area 
                type="monotone" 
                dataKey="buffer" 
                stroke="#C6A45C" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#bufferGradient)" 
              />
              <Area 
                type="monotone" 
                dataKey="inflows" 
                stroke="#10B981" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#inflowsGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Maker-Checker Queues (Hero Action Table) */}
      <MakerCheckerQueue
        inflows={inflows}
        withdrawals={withdrawals}
        onApproveInflow={onApproveInflow}
        onRejectInflow={onRejectInflow}
        onApproveWithdrawal={onApproveWithdrawal}
        onRejectWithdrawal={onRejectWithdrawal}
      />

      {/* Onboarding Wizard Modal */}
      <FundOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onAddInflow={onAddInflow}
      />
    </div>
  );
};
