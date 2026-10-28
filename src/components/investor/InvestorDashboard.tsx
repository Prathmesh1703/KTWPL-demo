import React, { useState } from 'react';
import { HeroPortfolioCard } from './HeroPortfolioCard';
import { WealthSimulator } from './WealthSimulator';
import { ActiveFundsList } from './ActiveFundsList';
import { GeneralLedgerTable } from './GeneralLedgerTable';
import { AgreementVaultModal } from './AgreementVaultModal';
import { WithdrawalModal } from './WithdrawalModal';
import { Agreement, LedgerEntry, WithdrawalRequest } from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';
import { GlassCard } from '../common/GlassCard';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';
import { 
  ArrowUpRight, 
  FileText, 
  PieChart as PieChartIcon, 
  Calculator, 
  ReceiptText, 
  Filter,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

interface InvestorDashboardProps {
  agreements: Agreement[];
  ledgerEntries: LedgerEntry[];
  withdrawalRequests: WithdrawalRequest[];
  onAddWithdrawalRequest: (req: Partial<WithdrawalRequest>) => void;
  onSimulatorParamChange?: (principal: number, tenor: number) => void;
  activeSubTab?: string;
  onOpenCopilotWithPrompt?: (prompt: string) => void;
  setActiveTab?: (tab: string) => void;
}

export const InvestorDashboard: React.FC<InvestorDashboardProps> = ({
  agreements,
  ledgerEntries,
  withdrawalRequests,
  onAddWithdrawalRequest,
  onSimulatorParamChange,
  activeSubTab = 'overview',
  onOpenCopilotWithPrompt,
  setActiveTab,
}) => {
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [agreementFilter, setAgreementFilter] = useState<string>('ALL');
  const [redemptionFilter, setRedemptionFilter] = useState<string>('ALL');

  // Aggregated Portfolio Stats
  const totalCapital = agreements.reduce((sum, a) => sum + a.principalAmount, 0);
  const totalAccruedInterest = agreements.reduce((sum, a) => sum + a.accruedInterest + a.totalInterestPaid, 0);
  const blendedYield = 14.85;
  const nextPayoutDate = '2026-11-01';
  const nextPayoutAmount = 90625;

  const handleOpenAgreementVault = (agreement: Agreement) => {
    setSelectedAgreement(agreement);
    setIsVaultOpen(true);
  };

  // Pie chart data for allocation
  const allocationData = agreements.map(ag => ({
    name: `${ag.agreementNo} (${ag.periodicity === 'MONTHLY' ? 'Monthly' : ag.periodicity === 'QUARTERLY' ? 'Quarterly' : 'Cumulative'})`,
    value: ag.principalAmount,
    rate: `${ag.interestRateAnnual}% p.a.`,
  }));

  const PIE_COLORS = ['#C6A45C', '#10B981', '#38BDF8'];

  // Filtered agreements for dedicated vault view
  const filteredAgreements = agreements.filter(ag => {
    if (agreementFilter === 'ALL') return true;
    return ag.periodicity === agreementFilter;
  });

  // Filtered redemptions
  const filteredWithdrawals = withdrawalRequests.filter(req => {
    if (redemptionFilter === 'ALL') return true;
    return req.status === redemptionFilter;
  });

  // Custom Pie Tooltip
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2.5 rounded-lg bg-card border border-subtle shadow-dropdown text-xs font-mono">
          <p className="font-semibold text-ink-primary">{data.name}</p>
          <p className="text-gold-500 font-medium">{formatINR(data.value)} ({data.rate})</p>
        </div>
      );
    }
    return null;
  };

  // 1. DEDICATED WEALTH SIMULATOR VIEW
  if (activeSubTab === 'simulator') {
    return (
      <div className="space-y-6 pb-16">
        <div className="flex items-center justify-between pb-2 border-b border-subtle">
          <div>
            <h2 className="text-xl font-semibold text-ink-primary tracking-tight flex items-center gap-2">
              <Calculator className="w-5 h-5 text-gold-500" />
              Wealth & Payout Simulator
            </h2>
            <p className="text-xs text-ink-secondary">
              Calculate projected coupon yields, compounding schedules, and Section 194A TDS withholdings.
            </p>
          </div>
          <button
            onClick={() => onOpenCopilotWithPrompt?.('Can you calculate the post-tax return on ₹50 Lakhs for 24 months?')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-elevated hover:brightness-105 border border-subtle text-xs text-gold-500 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Copilot to Simulate</span>
          </button>
        </div>
        <WealthSimulator onNotifyCopilot={onSimulatorParamChange} />
      </div>
    );
  }

  // 2. DEDICATED ACTIVE VAULT & NOTES VIEW
  if (activeSubTab === 'agreements') {
    return (
      <div className="space-y-6 pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-subtle">
          <div>
            <h2 className="text-xl font-semibold text-ink-primary tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-gold-500" />
              Active Notes & Digitized Vault
            </h2>
            <p className="text-xs text-ink-secondary">
              Review digitized mandate contracts, cryptographic SHA-256 seals, and eMudhra Aadhaar signatures.
            </p>
          </div>

          {/* Periodicity Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-muted">Filter:</span>
            <select
              value={agreementFilter}
              onChange={e => setAgreementFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-surface border border-subtle text-xs text-ink-secondary focus:outline-none"
            >
              <option value="ALL">All Notes ({agreements.length})</option>
              <option value="MONTHLY">Monthly Disbursed</option>
              <option value="QUARTERLY">Quarterly Compounded</option>
              <option value="MATURITY_COMPOUND">Cumulative</option>
            </select>
          </div>
        </div>

        <ActiveFundsList
          agreements={filteredAgreements}
          onSelectAgreement={handleOpenAgreementVault}
        />

        <AgreementVaultModal
          isOpen={isVaultOpen}
          onClose={() => setIsVaultOpen(false)}
          agreement={selectedAgreement}
        />
      </div>
    );
  }

  // 3. DEDICATED GENERAL LEDGER VIEW
  if (activeSubTab === 'ledger') {
    return (
      <div className="space-y-6 pb-16">
        <div className="flex items-center justify-between pb-2 border-b border-subtle">
          <div>
            <h2 className="text-xl font-semibold text-ink-primary tracking-tight flex items-center gap-2">
              <ReceiptText className="w-5 h-5 text-gold-500" />
              Institutional General Ledger
            </h2>
            <p className="text-xs text-ink-secondary">
              Verified double-entry credits, debits, statutory TDS Section 194A deductions, and settlement proofs.
            </p>
          </div>
          <button
            onClick={() => onOpenCopilotWithPrompt?.('Show me the latest interest credit transaction from my ledger')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-elevated hover:brightness-105 border border-subtle text-xs text-gold-500 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Audit with Copilot</span>
          </button>
        </div>
        <GeneralLedgerTable entries={ledgerEntries} />
      </div>
    );
  }

  // 4. DEDICATED REDEMPTIONS VIEW
  if (activeSubTab === 'withdrawals') {
    return (
      <div className="space-y-6 pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-subtle">
          <div>
            <h2 className="text-xl font-semibold text-ink-primary tracking-tight flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-gold-500" />
              Capital Redemptions & Payout Claims
            </h2>
            <p className="text-xs text-ink-secondary">
              Submit and monitor full or partial capital payouts into registered NPCI-verified bank escrow accounts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={redemptionFilter}
              onChange={e => setRedemptionFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-surface border border-subtle text-xs text-ink-secondary focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING_MAKER">Pending Maker</option>
              <option value="PENDING_CHECKER">Pending Checker</option>
              <option value="DISBURSED">Settled / Disbursed</option>
            </select>

            <button
              onClick={() => setIsWithdrawalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-[#080B12] font-semibold text-xs transition-colors"
            >
              + New Redemption Request
            </button>
          </div>
        </div>

        {/* Redemptions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWithdrawals.map(req => {
            const isDisbursed = req.status === 'DISBURSED';
            const isPendingChecker = req.status === 'PENDING_CHECKER';

            return (
              <GlassCard key={req.id} className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-medium text-ink-primary">
                    {req.requestNo} <span className="text-ink-muted">({req.agreementNo})</span>
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      isDisbursed
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : isPendingChecker
                        ? 'bg-gold-500/10 text-gold-500 border-gold-500/20'
                        : 'bg-elevated text-ink-secondary border-subtle'
                    }`}
                  >
                    {req.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-2xl font-semibold text-ink-primary font-mono tabular-nums">
                  {formatINR(req.amount)}
                </div>
                <div className="text-xs text-ink-secondary mt-1">
                  Reason: "{req.reason}"
                </div>

                <div className="pt-3 mt-3 border-t border-subtle flex items-center justify-between text-xs text-ink-muted font-mono">
                  <span>Destination: {req.payoutBank}</span>
                  <span>Date: {formatDate(req.requestedAt)}</span>
                </div>
              </GlassCard>
            );
          })}
        </div>

        <WithdrawalModal
          isOpen={isWithdrawalOpen}
          onClose={() => setIsWithdrawalOpen(false)}
          agreements={agreements}
          onSubmitRequest={onAddWithdrawalRequest}
        />
      </div>
    );
  }

  // DEFAULT: PORTFOLIO OVERVIEW VIEW
  return (
    <div className="space-y-6 pb-16">
      {/* 1. Hero Portfolio Card */}
      <HeroPortfolioCard
        totalCapital={totalCapital}
        totalAccruedInterest={totalAccruedInterest}
        blendedYield={blendedYield}
        nextPayoutDate={nextPayoutDate}
        nextPayoutAmount={nextPayoutAmount}
        onOpenSimulator={() => setActiveTab ? setActiveTab('simulator') : null}
        onOpenWithdrawal={() => setIsWithdrawalOpen(true)}
        onOpenVault={() => handleOpenAgreementVault(agreements[0])}
      />

      {/* 2. Interactive Charts & Asset Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Asset Allocation Donut Chart (5 Cols) */}
        <GlassCard className="lg:col-span-5 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-subtle">
              <h3 className="text-sm font-semibold text-ink-primary flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-gold-500" />
                Mandate Capital Deployment
              </h3>
              <span className="text-xs font-mono text-ink-muted">3 Active Notes</span>
            </div>
            <p className="text-xs text-ink-secondary mt-2">
              Diversification breakdown across senior floating, quarterly compounded, and treasury notes.
            </p>
          </div>

          <div className="h-56 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <RechartsTooltip content={<CustomPieTooltip />} />
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-subtle text-xs font-mono">
            {agreements.map((ag, i) => (
              <div key={ag.id} className="flex items-center justify-between text-ink-secondary">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span>{ag.agreementNo} ({ag.interestRateAnnual}%)</span>
                </span>
                <span className="text-ink-primary font-medium tabular-nums">{formatINR(ag.principalAmount)}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Right Column: Quick Interactive Actions & Next Cycle Preview (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4">
          {/* Quick AI Prompts Card */}
          <GlassCard className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-subtle">
              <div className="flex items-center gap-2 text-xs font-semibold text-ink-primary">
                <Sparkles className="w-4 h-4 text-gold-500" />
                <span>Instant Copilot Queries (1-Click)</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                Verified RAG
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3.5">
              <button
                onClick={() => onOpenCopilotWithPrompt?.('When is my next interest payout for Agreement #AG-8912?')}
                className="p-3 rounded-lg bg-elevated hover:brightness-105 border border-subtle text-left text-xs transition-colors group cursor-pointer"
              >
                <div className="text-ink-primary font-medium group-hover:text-gold-500 transition-colors">
                  Next Payout for #AG-8912?
                </div>
                <div className="text-[11px] text-ink-muted mt-0.5">
                  Scheduled for 15 Nov 2026 • ₹45,833/mo
                </div>
              </button>

              <button
                onClick={() => onOpenCopilotWithPrompt?.('How much interest have I earned so far?')}
                className="p-3 rounded-lg bg-elevated hover:brightness-105 border border-subtle text-left text-xs transition-colors group cursor-pointer"
              >
                <div className="text-ink-primary font-medium group-hover:text-gold-500 transition-colors">
                  Interest Earned So Far?
                </div>
                <div className="text-[11px] text-ink-muted mt-0.5">
                  Total ₹2,48,500 accrued across mandates
                </div>
              </button>

              <button
                onClick={() => onOpenCopilotWithPrompt?.('What will I receive if I invest ₹10 lakh for 12 months?')}
                className="p-3 rounded-lg bg-elevated hover:brightness-105 border border-subtle text-left text-xs transition-colors group cursor-pointer"
              >
                <div className="text-ink-primary font-medium group-hover:text-gold-500 transition-colors">
                  Returns on ₹10L for 12 Months?
                </div>
                <div className="text-[11px] text-ink-muted mt-0.5">
                  Illustrative return: ₹11,00,000 maturity value
                </div>
              </button>

              <button
                onClick={() => onOpenCopilotWithPrompt?.('Can I withdraw 50% of my principal before the lock-in ends?')}
                className="p-3 rounded-lg bg-elevated hover:brightness-105 border border-subtle text-left text-xs transition-colors group cursor-pointer"
              >
                <div className="text-ink-primary font-medium group-hover:text-gold-500 transition-colors">
                  Withdraw 50% Before Lock-in?
                </div>
                <div className="text-[11px] text-ink-muted mt-0.5">
                  Clause 7.1 seasoning & lock-in terms check
                </div>
              </button>
            </div>
          </GlassCard>

          {/* Quick Active Notes Teaser */}
          <GlassCard className="p-5 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-subtle">
              <h3 className="text-sm font-semibold text-ink-primary flex items-center gap-2">
                <FileText className="w-4 h-4 text-gold-500" />
                Active Deployments Summary
              </h3>
              <button
                onClick={() => setActiveTab ? setActiveTab('agreements') : null}
                className="text-xs text-gold-500 hover:underline font-medium"
              >
                View Vault ({agreements.length}) →
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 my-3">
              {agreements.map(ag => (
                <div
                  key={ag.id}
                  onClick={() => handleOpenAgreementVault(ag)}
                  className="p-2.5 rounded-lg bg-surface border border-subtle hover:border-gold-500/40 cursor-pointer transition-colors text-xs font-mono"
                >
                  <div className="font-semibold text-ink-primary">{ag.agreementNo}</div>
                  <div className="text-emerald-500 font-medium">{ag.interestRateAnnual}%</div>
                  <div className="text-ink-muted text-[10px] mt-1 tabular-nums">{formatINR(ag.principalAmount)}</div>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-ink-muted font-mono flex items-center justify-between pt-2 border-t border-subtle">
              <span>Direct Commercial Escrow: HDFC Bank Nariman Point</span>
              <span className="text-emerald-500">T+0 Active</span>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* 3. Wealth Simulator Section */}
      <div id="wealth-simulator-section">
        <WealthSimulator onNotifyCopilot={onSimulatorParamChange} />
      </div>

      {/* 4. General Ledger Table Preview */}
      <GeneralLedgerTable entries={ledgerEntries.slice(0, 5)} />

      {/* Modals */}
      <AgreementVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        agreement={selectedAgreement}
      />

      <WithdrawalModal
        isOpen={isWithdrawalOpen}
        onClose={() => setIsWithdrawalOpen(false)}
        agreements={agreements}
        onSubmitRequest={onAddWithdrawalRequest}
      />
    </div>
  );
};
