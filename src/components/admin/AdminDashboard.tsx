import React, { useState } from 'react';
import { MakerCheckerQueue } from './MakerCheckerQueue';
import { LiquidityForecast } from './LiquidityForecast';
import { FundOnboardingModal } from './FundOnboardingModal';
import { InflowProposal, WithdrawalRequest } from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';
import { GlassCard } from '../common/GlassCard';
import { 
  UserPlus, 
  ShieldCheck, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Users, 
  Layers, 
  TrendingUp,
  FileText,
  Search,
  CheckCircle2
} from 'lucide-react';

interface AdminDashboardProps {
  inflows: InflowProposal[];
  withdrawals: WithdrawalRequest[];
  onApproveInflow: (id: string, stage: 'MAKER' | 'CHECKER') => void;
  onRejectInflow: (id: string) => void;
  onApproveWithdrawal: (id: string, stage: 'MAKER' | 'CHECKER') => void;
  onRejectWithdrawal: (id: string) => void;
  onAddInflow: (inflow: InflowProposal) => void;
  activeSubTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  inflows,
  withdrawals,
  onApproveInflow,
  onRejectInflow,
  onApproveWithdrawal,
  onRejectWithdrawal,
  onAddInflow,
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

  // 1. DEDICATED INFLOW INTAKE VIEW
  if (activeSubTab === 'onboarding') {
    return (
      <div className="space-y-6 pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-subtle">
          <div>
            <h2 className="text-xl font-semibold text-ink-primary tracking-tight flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-gold-500" />
              Capital Inflow Intake & Schedule Generator
            </h2>
            <p className="text-xs text-ink-secondary">
              Onboard incoming capital deposits, verify banking UTRs, and generate pre-settlement schedule previews.
            </p>
          </div>

          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-[#080B12] font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ New Intake Wizard</span>
          </button>
        </div>

        {/* Proposals Table */}
        <GlassCard className="p-6">
          <h3 className="text-sm font-semibold text-ink-primary mb-3">Recent Capital Intake Proposals</h3>
          <div className="overflow-x-auto rounded-lg border border-subtle bg-surface">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-subtle text-ink-muted text-[10px] uppercase tracking-wider">
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
                    <td className="py-3 px-4 font-mono font-medium text-gold-500">{inf.inflowNo}</td>
                    <td className="py-3 px-4 font-mono">
                      <div className="font-medium text-ink-primary font-sans">{inf.clientName}</div>
                      <div className="text-[10px] text-ink-muted">{inf.clientPan}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-ink-primary tabular-nums">
                      {formatINR(inf.principalAmount)}
                    </td>
                    <td className="py-3 px-4 font-mono text-ink-secondary">
                      <div>{inf.tenorMonths}m @ {inf.interestRateAnnual}%</div>
                      <div className="text-[10px] text-ink-muted">{inf.periodicity}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-ink-secondary">
                      <div>{inf.utrNumber}</div>
                      <div className="text-[10px] text-ink-muted">{inf.bankSource}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-elevated border border-subtle text-ink-primary">
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
            <h2 className="text-xl font-semibold text-ink-primary tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold-500" />
              90-Day Rolling Liquidity & Payout Runway
            </h2>
            <p className="text-xs text-ink-secondary">
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
            <h2 className="text-xl font-semibold text-ink-primary tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-gold-500" />
              HNI Client Mandates Directory
            </h2>
            <p className="text-xs text-ink-secondary">
              Directory of accredited investors, active capital mandates, and verified banking escrow destinations.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search investor or PAN..."
              value={clientSearch}
              onChange={e => setClientSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface border border-subtle text-xs text-ink-primary placeholder-ink-muted focus:outline-none"
            />
          </div>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClients.map(client => (
            <GlassCard key={client.id} className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-ink-primary text-sm">{client.name}</h3>
                  <div className="text-[11px] font-mono text-ink-muted">{client.pan} • {client.phone}</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {client.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-surface border border-subtle my-3 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-ink-muted font-sans block">Total Active Capital</span>
                  <span className="font-semibold text-ink-primary mt-0.5 block tabular-nums">
                    {formatINR(client.totalCapital)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted font-sans block">Active Mandates</span>
                  <span className="font-semibold text-gold-500 mt-0.5 block">
                    {client.mandatesCount} Notes
                  </span>
                </div>
              </div>

              <div className="text-xs text-ink-muted font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{client.bank}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  // DEFAULT: MAKER-CHECKER AUTHORIZATION QUEUE
  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <GlassCard className="p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Staff Desk #402
              </span>
              <span className="text-ink-muted font-mono">•</span>
              <span className="font-mono text-ink-muted text-[11px]">
                Maker-Checker Operations
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-ink-primary tracking-tight">
              Back-Office Command & Treasury Desk
            </h2>
            <p className="text-xs text-ink-secondary max-w-2xl">
              Verify capital inflows against banking UTRs, enforce seasoning lock-in checks for redemptions, 
              and schedule T+0 escrow settlements under dual-officer control.
            </p>
          </div>

          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-[#080B12] font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Onboard Fund Inflow</span>
          </button>
        </div>

        {/* 4 Stat Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-5 mt-5 border-t border-subtle">
          <div className="p-3 rounded-lg bg-surface border border-subtle font-mono">
            <div className="text-[10px] text-ink-muted font-sans uppercase">Pending Inflow Reviews</div>
            <div className="text-base font-semibold text-gold-500 mt-0.5 flex items-center gap-1.5 tabular-nums">
              <ArrowDownLeft className="w-3.5 h-3.5" />
              {pendingInflowsCount} Mandates
            </div>
          </div>

          <div className="p-3 rounded-lg bg-surface border border-subtle font-mono">
            <div className="text-[10px] text-ink-muted font-sans uppercase">Pending Redemptions</div>
            <div className="text-base font-semibold text-ruby-500 mt-0.5 flex items-center gap-1.5 tabular-nums">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {pendingWithdrawalsCount} Demands
            </div>
          </div>

          <div className="p-3 rounded-lg bg-surface border border-subtle font-mono">
            <div className="text-[10px] text-ink-muted font-sans uppercase">Pipeline Inflow Volume</div>
            <div className="text-base font-semibold text-ink-primary mt-0.5 tabular-nums">
              {formatINR(totalInflowsVolume)}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-surface border border-subtle font-mono">
            <div className="text-[10px] text-ink-muted font-sans uppercase">Escrow Buffer Coverage</div>
            <div className="text-base font-semibold text-emerald-500 mt-0.5 flex items-center gap-1.5 tabular-nums">
              <ShieldCheck className="w-3.5 h-3.5" />
              424% Healthy
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Maker-Checker Queues */}
      <MakerCheckerQueue
        inflows={inflows}
        withdrawals={withdrawals}
        onApproveInflow={onApproveInflow}
        onRejectInflow={onRejectInflow}
        onApproveWithdrawal={onApproveWithdrawal}
        onRejectWithdrawal={onRejectWithdrawal}
      />

      {/* 90-Day Liquidity Forecast */}
      <LiquidityForecast />

      {/* Onboarding Wizard Modal */}
      <FundOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onAddInflow={onAddInflow}
      />
    </div>
  );
};
