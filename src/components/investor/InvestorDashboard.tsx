import React, { useState } from 'react';
import { HeroPortfolioCard } from './HeroPortfolioCard';
import { WealthSimulator } from './WealthSimulator';
import { ActiveFundsList } from './ActiveFundsList';
import { GeneralLedgerTable } from './GeneralLedgerTable';
import { AgreementVaultModal } from './AgreementVaultModal';
import { WithdrawalModal } from './WithdrawalModal';
import { MeetingsView } from './MeetingsView';
import { RequestMeetingModal } from './RequestMeetingModal';
import { InvestmentMeetingNotesModal } from './InvestmentMeetingNotesModal';
import { Agreement, LedgerEntry, WithdrawalRequest, MeetingRequest } from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';
import { GlassCard } from '../common/GlassCard';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import {
  ArrowUpRight,
  FileText,
  PieChart as PieChartIcon,
  ReceiptText,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Percent,
  Activity,
  Layers,
  Calendar,
  Lock,
  ExternalLink
} from 'lucide-react';

interface InvestorDashboardProps {
  agreements: Agreement[];
  ledgerEntries: LedgerEntry[];
  withdrawalRequests: WithdrawalRequest[];
  meetings?: MeetingRequest[];
  onAddWithdrawalRequest: (req: Partial<WithdrawalRequest>) => void;
  onRequestMeeting?: (req: Partial<MeetingRequest>) => void;
  onSimulatorParamChange?: (principal: number, tenor: number) => void;
  activeSubTab?: string;
  onOpenCopilotWithPrompt?: (prompt: string) => void;
  setActiveTab?: (tab: string) => void;
}

// 10-Month Institutional Cash Flow Dataset (Historical Disbursed + Scheduled Forward)
const CASH_FLOW_DATA = [
  { month: 'Jun 26', gross: 90625, tds: 9062, net: 81563, type: 'settled', status: 'Settled • RTGS #HDFC882910' },
  { month: 'Jul 26', gross: 90625, tds: 9062, net: 81563, type: 'settled', status: 'Settled • RTGS #HDFC891024' },
  { month: 'Aug 26', gross: 90625, tds: 9062, net: 81563, type: 'settled', status: 'Settled • RTGS #HDFC902831' },
  { month: 'Sep 26', gross: 90625, tds: 9062, net: 81563, type: 'settled', status: 'Settled • RTGS #HDFC913942' },
  { month: 'Oct 26', gross: 90625, tds: 9062, net: 81563, type: 'settled', status: 'Settled • RTGS #HDFC924853' },
  { month: 'Nov 26', gross: 90625, tds: 9062, net: 81563, type: 'scheduled', status: 'Scheduled • 01 Nov 2026' },
  { month: 'Dec 26', gross: 90625, tds: 9062, net: 81563, type: 'scheduled', status: 'Scheduled • 01 Dec 2026' },
  { month: 'Jan 27', gross: 147917, tds: 14792, net: 133125, type: 'scheduled', status: 'Scheduled • Includes Note AG-7840' },
  { month: 'Feb 27', gross: 90625, tds: 9062, net: 81563, type: 'scheduled', status: 'Scheduled • 01 Feb 2027' },
  { month: 'Mar 27', gross: 90625, tds: 9062, net: 81563, type: 'scheduled', status: 'Scheduled • FY26-27 Close' },
];

export const InvestorDashboard: React.FC<InvestorDashboardProps> = ({
  agreements,
  ledgerEntries,
  withdrawalRequests,
  meetings = [],
  onAddWithdrawalRequest,
  onRequestMeeting,
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
  const [cashFlowTimeframe, setCashFlowTimeframe] = useState<'6M' | '10M' | 'ALL'>('10M');
  const [hoveredSlice, setHoveredSlice] = useState<any | null>(null);

  // Meeting Modals State
  const [isRequestMeetingOpen, setIsRequestMeetingOpen] = useState(false);
  const [meetingModalPreselectedNote, setMeetingModalPreselectedNote] = useState<string | undefined>(undefined);
  const [isMeetingNotesOpen, setIsMeetingNotesOpen] = useState(false);
  const [selectedAgreementForNotes, setSelectedAgreementForNotes] = useState<Agreement | null>(null);

  const handleOpenMeetingNotes = (ag: Agreement) => {
    setSelectedAgreementForNotes(ag);
    setIsMeetingNotesOpen(true);
  };

  const handleOpenRequestMeetingForAgreement = (agreementNo?: string) => {
    setMeetingModalPreselectedNote(agreementNo);
    setIsRequestMeetingOpen(true);
  };

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

  const PIE_COLORS = ['#C6A45C', '#10B981', '#38BDF8'];

  // Pie chart data for allocation
  const allocationData = agreements.map((ag, i) => ({
    name: ag.agreementNo,
    label: ag.periodicity === 'MONTHLY' ? 'Senior Monthly' : ag.periodicity === 'QUARTERLY' ? 'Compounding Vault' : 'Capital Fixed',
    value: ag.principalAmount,
    rate: `${ag.interestRateAnnual}% p.a.`,
    periodicity: ag.periodicity,
    agreement: ag,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  // Filtered cash flow by timeframe
  const displayedCashFlow = cashFlowTimeframe === '6M'
    ? CASH_FLOW_DATA.slice(2, 8)
    : CASH_FLOW_DATA;

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

  // High-Contrast Liquid Glass Tooltip for Cash Flow Chart
  const CustomCashFlowTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isSettled = data.type === 'settled';
      return (
        <div className="liquid-glass-tooltip p-3 text-xs min-w-[220px] font-sans shadow-2xl pointer-events-none">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-subtle">
            <span className="font-bold text-ink-primary text-xs tracking-tight">{data.month}</span>
            <span className={`text-[10px] font-semibold font-mono px-2 py-0.5 rounded border ${isSettled
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
              : 'bg-gold-500/10 text-gold-500 border-gold-500/20'
              }`}>
              {isSettled ? 'Settled RTGS' : 'Scheduled Escrow'}
            </span>
          </div>

          <div className="space-y-1 font-sans">
            <div className="flex justify-between items-center text-ink-secondary text-xs">
              <span className="font-medium">Gross Distribution:</span>
              <span className="font-bold text-ink-primary font-mono tabular-nums">{formatINR(data.gross)}</span>
            </div>
            <div className="flex justify-between items-center text-ink-muted text-[11px]">
              <span>TDS u/s 194A (10%):</span>
              <span className="text-ruby-500 font-mono font-medium tabular-nums">-{formatINR(data.tds)}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-subtle text-xs font-semibold">
              <span className={isSettled ? 'text-emerald-500' : 'text-gold-500'}>Net Bank Credit:</span>
              <span className={`${isSettled ? 'text-emerald-500' : 'text-gold-500'} font-bold font-mono tabular-nums`}>
                {formatINR(data.net)}
              </span>
            </div>
            <div className="text-[10px] text-ink-muted font-mono pt-0.5 truncate">
              {data.status}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // High-Contrast Liquid Glass Tooltip for Capital Allocation Chart (Matches Graph Hover)
  const CustomCapitalAllocationTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const share = ((data.value / totalCapital) * 100).toFixed(1);
      return (
        <div className="liquid-glass-tooltip p-3 text-xs min-w-[220px] font-sans shadow-2xl pointer-events-none z-50">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-subtle">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: data.color || '#C6A45C' }} />
              <span className="font-bold text-ink-primary text-xs tracking-tight">{data.name}</span>
            </div>
            <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded bg-gold-500/10 text-gold-500 border border-gold-500/20">
              {data.rate}
            </span>
          </div>

          <div className="space-y-1 font-sans">
            <div className="flex justify-between items-center text-ink-secondary text-xs">
              <span className="font-medium">Mandate Category:</span>
              <span className="font-semibold text-ink-primary">{data.label}</span>
            </div>
            <div className="flex justify-between items-center text-ink-secondary text-xs">
              <span className="font-medium">Allocated Principal:</span>
              <span className="font-bold text-ink-primary font-mono tabular-nums">{formatINR(data.value)}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-subtle text-xs font-semibold">
              <span className="text-emerald-500">Portfolio Share:</span>
              <span className="text-emerald-500 font-mono font-bold">
                {share}% of Total Capital
              </span>
            </div>
            <div className="text-[10px] text-ink-muted font-mono pt-0.5 truncate flex items-center justify-between">
              <span>Custody: HDFC Escrow</span>
              <span className="text-emerald-500">T+0 Clearing</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // 1. DEDICATED WEALTH AND PAYOUT VIEW
  if (activeSubTab === 'simulator') {
    return (
      <div className="space-y-6 pb-16">
        <div className="pb-2 border-b border-subtle">
          <h2 className="text-xl font-semibold text-ink-primary tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gold-500" />
            Wealth and Payout
          </h2>
          <p className="text-xs text-ink-secondary">
            Simulate institutional yield projections, compounding horizons, and periodic liquidity payouts.
          </p>
        </div>
        <WealthSimulator onNotifyCopilot={onSimulatorParamChange} />
      </div>
    );
  }

  // 2. DEDICATED INVESTMENTS / VAULT VIEW
  if (activeSubTab === 'agreements') {
    return (
      <div className="space-y-6 pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-subtle">
          <div>
            <h2 className="text-xl font-semibold text-ink-primary tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-gold-500" />
              Investments
            </h2>
            <p className="text-xs text-ink-secondary">
              Your active investment plans and scheduled payouts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-ink-muted" />
            <select
              value={agreementFilter}
              onChange={e => setAgreementFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-surface border border-subtle text-xs text-ink-secondary focus:outline-none"
            >
              <option value="ALL">All Notes ({agreements.length})</option>
              <option value="MONTHLY">Monthly Payout</option>
              <option value="QUARTERLY">Quarterly Compounding</option>
              <option value="CUMULATIVE">Cumulative</option>
            </select>
          </div>
        </div>

        <ActiveFundsList
          agreements={filteredAgreements}
          onSelectAgreement={handleOpenAgreementVault}
          meetings={meetings}
          onOpenMeetingNotes={handleOpenMeetingNotes}
        />

        <AgreementVaultModal
          isOpen={isVaultOpen}
          onClose={() => setIsVaultOpen(false)}
          agreement={selectedAgreement}
          meetings={meetings}
          onOpenRequestMeeting={handleOpenRequestMeetingForAgreement}
        />

        <InvestmentMeetingNotesModal
          isOpen={isMeetingNotesOpen}
          onClose={() => setIsMeetingNotesOpen(false)}
          agreement={selectedAgreementForNotes}
          meetings={meetings}
          onOpenRequestMeeting={handleOpenRequestMeetingForAgreement}
        />

        <RequestMeetingModal
          isOpen={isRequestMeetingOpen}
          onClose={() => setIsRequestMeetingOpen(false)}
          agreements={agreements}
          onRequestMeeting={onRequestMeeting || (() => {})}
          preselectedAgreementNo={meetingModalPreselectedNote}
        />
      </div>
    );
  }

  // 3. DEDICATED GENERAL LEDGER VIEW
  if (activeSubTab === 'ledger') {
    return (
      <div className="space-y-6 pb-16">
        <div className="pb-2 border-b border-subtle">
          <h2 className="text-xl font-semibold text-ink-primary tracking-tight flex items-center gap-2">
            <ReceiptText className="w-5 h-5 text-gold-500" />
            Institutional General Ledger
          </h2>
          <p className="text-xs text-ink-secondary">
            Verified double-entry credits, debits, statutory TDS Section 194A deductions, and settlement proofs.
          </p>
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
              <GlassCard key={req.id} variant="liquid" enableTilt={true} className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-medium text-ink-primary">
                    {req.requestNo} <span className="text-ink-muted">({req.agreementNo})</span>
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${isDisbursed
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

  // 5. DEDICATED MEETINGS VIEW
  if (activeSubTab === 'meetings') {
    return (
      <div className="space-y-6 pb-16">
        <MeetingsView
          meetings={meetings}
          agreements={agreements}
          onRequestMeetingClick={() => handleOpenRequestMeetingForAgreement(undefined)}
          onSelectAgreement={handleOpenAgreementVault}
        />

        <RequestMeetingModal
          isOpen={isRequestMeetingOpen}
          onClose={() => setIsRequestMeetingOpen(false)}
          agreements={agreements}
          onRequestMeeting={onRequestMeeting || (() => {})}
          preselectedAgreementNo={meetingModalPreselectedNote}
        />

        <AgreementVaultModal
          isOpen={isVaultOpen}
          onClose={() => setIsVaultOpen(false)}
          agreement={selectedAgreement}
          meetings={meetings}
          onOpenRequestMeeting={handleOpenRequestMeetingForAgreement}
        />

        <InvestmentMeetingNotesModal
          isOpen={isMeetingNotesOpen}
          onClose={() => setIsMeetingNotesOpen(false)}
          agreement={selectedAgreementForNotes}
          meetings={meetings}
          onOpenRequestMeeting={handleOpenRequestMeetingForAgreement}
        />
      </div>
    );
  }

  // DEFAULT: PORTFOLIO OVERVIEW VIEW (EDGE-TO-EDGE, MINIMAL, GLASSMORPHISM & 3D)
  return (
    <div className="space-y-6 sm:space-y-7 pb-16">
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

      {/* 2. Four 3D Liquid Glass Performance KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1: Realized Net Payouts */}
        <GlassCard variant="liquid" enableTilt={true} className="p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-ink-secondary font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Realized Net Payouts (YTD)
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                100% On-Time
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-ink-primary font-mono tracking-tight tabular-nums">
              ₹12,75,000
            </div>
            <div className="text-[11px] text-ink-secondary font-mono mt-1 flex items-center gap-1">
              <span>+₹90,625 scheduled Nov 01</span>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-subtle flex items-center justify-between text-[11px] text-ink-muted font-mono">
            <span>Cycle Discipline</span>
            <span className="text-emerald-500 font-medium">12 Consecutive Settled</span>
          </div>
        </GlassCard>

        {/* KPI 2: Net Post-TDS Yield */}
        <GlassCard variant="liquid" enableTilt={true} className="p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-ink-secondary font-medium flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-gold-500" />
                Net Post-TDS Yield
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gold-500/10 text-gold-500 border border-gold-500/20">
                Sec 194A
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-ink-primary font-mono tracking-tight tabular-nums">
              13.37% <span className="text-xs font-normal text-ink-muted">p.a.</span>
            </div>
            <div className="text-[11px] text-ink-secondary font-mono mt-1">
              14.85% Gross Blended Coupon
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-subtle flex items-center justify-between text-[11px] text-ink-muted font-mono">
            <span>Statutory Compliance</span>
            <span className="text-ink-primary font-medium">Form 16A Auto-Issued</span>
          </div>
        </GlassCard>

        {/* KPI 3: Escrow Collateral & Safety */}
        <GlassCard variant="liquid" enableTilt={true} className="p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-ink-secondary font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Escrow Collateral Ratio
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                CRISIL A1+
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-ink-primary font-mono tracking-tight tabular-nums">
              100.0%
            </div>
            <div className="text-[11px] text-ink-secondary font-mono mt-1">
              HDFC Bank Tier-1 Custody
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-subtle flex items-center justify-between text-[11px] text-ink-muted font-mono">
            <span>Segregated Ledger</span>
            <span className="text-emerald-500 font-medium">SEBI & MCA Ring-Fenced</span>
          </div>
        </GlassCard>

        {/* KPI 4: Weighted Maturity Horizon */}
        <GlassCard variant="liquid" enableTilt={true} className="p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-ink-secondary font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gold-500" />
                Weighted Maturity
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-subtle text-ink-secondary">
                3 Notes
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-ink-primary font-mono tracking-tight tabular-nums">
              18.4 <span className="text-xs font-normal text-ink-muted">Months</span>
            </div>
            <div className="text-[11px] text-ink-secondary font-mono mt-1">
              Earliest Liquidity: 01 Nov 2026
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-subtle flex items-center justify-between text-[11px] text-ink-muted font-mono">
            <span>Early Exit Terms</span>
            <span className="text-gold-500 font-medium">0% Penalty Post Lock-in</span>
          </div>
        </GlassCard>
      </div>

      {/* 3. Two Minimal Edge-to-Edge Institutional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Chart 1: Monthly Interest Cash Flow Trajectory */}
        <GlassCard variant="liquid" enableTilt={false} className="lg:col-span-7 xl:col-span-8 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-subtle">
              <div>
                <h3 className="text-sm font-semibold text-ink-primary flex items-center gap-2">
                  <Activity className="w-4 h-4 text-gold-500" />
                  Monthly Interest Cash Flow Trajectory
                </h3>
                <p className="text-xs text-ink-secondary mt-0.5">
                  Historical settled RTGS disbursements vs scheduled forward distributions.
                </p>
              </div>

              {/* Timeframe & Legend Controls */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="flex items-center rounded-lg bg-surface p-0.5 border border-subtle text-[11px] font-mono">
                  {(['6M', '10M', 'ALL'] as const).map(tf => (
                    <button
                      key={tf}
                      onClick={() => setCashFlowTimeframe(tf)}
                      className={`px-2.5 py-1 rounded transition-colors ${cashFlowTimeframe === tf
                        ? 'bg-gold-500 text-[#080B12] font-semibold'
                        : 'text-ink-secondary hover:text-ink-primary'
                        }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Status Legend */}
            <div className="flex items-center gap-5 mt-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-ink-secondary">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Realized Payouts (Jun – Oct 2026)</span>
              </span>
              <span className="flex items-center gap-1.5 text-ink-secondary">
                <span className="w-2.5 h-2.5 rounded-full bg-gold-500" />
                <span>Scheduled Escrow (Nov 2026 – Mar 2027)</span>
              </span>
            </div>

            {/* Bar Chart Container */}
            <div className="h-64 sm:h-72 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayedCashFlow} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'monospace' }}
                    axisLine={{ stroke: 'var(--border-subtle)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'monospace' }}
                    tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip
                    position={{ y: 0 }}
                    content={<CustomCashFlowTooltip />}
                    cursor={{ fill: 'var(--border-subtle)', opacity: 0.35 }}
                  />
                  <Bar
                    dataKey="gross"
                    radius={[4, 4, 0, 0]}
                  >
                    {displayedCashFlow.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.type === 'settled' ? '#10B981' : '#C6A45C'}
                        fillOpacity={entry.type === 'settled' ? 0.9 : 0.85}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Footer Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 mt-3 border-t border-subtle text-xs font-mono">
            <div>
              <span className="text-ink-muted text-[10px] block font-sans">Average Monthly Credit</span>
              <span className="text-ink-primary font-semibold tabular-nums">₹90,625 / mo</span>
            </div>
            <div>
              <span className="text-ink-muted text-[10px] block font-sans">Projected FY26-27 Inflow</span>
              <span className="text-gold-500 font-semibold tabular-nums">₹10,87,500</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-ink-muted text-[10px] block font-sans">Next RTGS Credit</span>
              <span className="text-emerald-500 font-semibold tabular-nums">01 Nov 2026 (T+0)</span>
            </div>
          </div>
        </GlassCard>

        {/* Chart 2: Capital Allocation & Liquidity Profile */}
        <GlassCard variant="liquid" enableTilt={false} className="lg:col-span-5 xl:col-span-4 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-subtle">
              <div>
                <h3 className="text-sm font-semibold text-ink-primary flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-gold-500" />
                  Capital Allocation
                </h3>
                <p className="text-xs text-ink-secondary mt-0.5">
                  Capital allocation & duration diversification.
                </p>
              </div>
              <button
                onClick={() => setActiveTab ? setActiveTab('agreements') : null}
                className="text-xs text-gold-500 hover:underline font-mono flex items-center gap-1 cursor-pointer"
              >
                <span>View Vault</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Donut Chart - Clean, No Hover Overlay */}
            <div className="h-56 w-full relative flex items-center justify-center my-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy={132}
                    innerRadius={48}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                    onMouseEnter={(entry, idx) => setHoveredSlice({
                      ...entry,
                      color: PIE_COLORS[idx % PIE_COLORS.length]
                    })}
                    onMouseLeave={() => setHoveredSlice(null)}
                  >
                    {allocationData.map((entry, index) => {
                      const isHovered = hoveredSlice?.name === entry.name;
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                          opacity={hoveredSlice ? (isHovered ? 1 : 0.4) : 0.9}
                          stroke={isHovered ? 'var(--gold-accent)' : 'var(--border-subtle)'}
                          strokeWidth={isHovered ? 2.5 : 1}
                          className="cursor-pointer transition-all duration-200"
                        />
                      );
                    })}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Clean Donut Center Total - Centered in Donut Hole */}
              <div
                className="absolute flex flex-col items-center justify-center pointer-events-none transition-opacity duration-200"
                style={{ top: '132px', left: '50%', transform: 'translate(-50%, -50%)' }}
              >
                <span className="text-[10px] font-mono text-ink-muted uppercase tracking-wider block font-medium">Total Capital</span>
                <span className="text-base font-bold text-ink-primary font-mono tabular-nums block">₹2.50 Cr</span>
                <span className="text-[10px] text-ink-muted font-mono block">3 Notes</span>
              </div>
            </div>

            {/* Interactive Instrument Breakdown Cards */}
            <div className="space-y-2 mt-2">
              {agreements.map((ag, i) => {
                const isHovered = hoveredSlice?.name === ag.agreementNo;
                return (
                  <div
                    key={ag.id}
                    onClick={() => handleOpenAgreementVault(ag)}
                    onMouseEnter={() => setHoveredSlice({
                      name: ag.agreementNo,
                      label: ag.periodicity === 'MONTHLY' ? 'Senior Monthly' : ag.periodicity === 'QUARTERLY' ? 'Compounding Vault' : 'Capital Fixed',
                      value: ag.principalAmount,
                      rate: `${ag.interestRateAnnual}% p.a.`,
                      color: PIE_COLORS[i % PIE_COLORS.length]
                    })}
                    onMouseLeave={() => setHoveredSlice(null)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between group ${isHovered
                      ? 'bg-surface/95 border-gold-500/70 shadow-lg shadow-gold-500/10'
                      : 'bg-surface/90 hover:bg-surface border-subtle hover:border-gold-500/50'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm transition-transform group-hover:scale-125"
                        style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                      />
                      <div>
                        <div className="text-xs font-semibold text-ink-primary group-hover:text-gold-500 transition-colors flex items-center gap-1.5">
                          <span>{ag.agreementNo}</span>
                          <span className="text-[10px] text-ink-muted font-normal">
                            ({ag.periodicity === 'MONTHLY' ? 'Monthly' : ag.periodicity === 'QUARTERLY' ? 'Quarterly' : 'Cumulative'})
                          </span>
                        </div>
                        <div className="text-[11px] text-ink-secondary font-mono">
                          {ag.interestRateAnnual}% p.a. • {ag.tenorMonths} Mos
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-ink-primary font-mono tabular-nums">
                        {formatINR(ag.principalAmount)}
                      </div>
                      <div className="text-[10px] text-emerald-500 font-mono flex items-center justify-end gap-1">
                        <span>{((ag.principalAmount / totalCapital) * 100).toFixed(0)}% Share</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-subtle flex items-center justify-between text-[11px] text-ink-secondary font-mono">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-500" />
              <span>Direct Commercial Escrow: HDFC Bank</span>
            </span>
            <span className="text-emerald-400 font-medium">T+0 Clearing</span>
          </div>
        </GlassCard>
      </div>

      {/* Modals */}
      <AgreementVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        agreement={selectedAgreement}
        meetings={meetings}
        onOpenRequestMeeting={handleOpenRequestMeetingForAgreement}
      />

      <WithdrawalModal
        isOpen={isWithdrawalOpen}
        onClose={() => setIsWithdrawalOpen(false)}
        agreements={agreements}
        onSubmitRequest={onAddWithdrawalRequest}
      />

      <InvestmentMeetingNotesModal
        isOpen={isMeetingNotesOpen}
        onClose={() => setIsMeetingNotesOpen(false)}
        agreement={selectedAgreementForNotes}
        meetings={meetings}
        onOpenRequestMeeting={handleOpenRequestMeetingForAgreement}
      />

      <RequestMeetingModal
        isOpen={isRequestMeetingOpen}
        onClose={() => setIsRequestMeetingOpen(false)}
        agreements={agreements}
        onRequestMeeting={onRequestMeeting || (() => {})}
        preselectedAgreementNo={meetingModalPreselectedNote}
      />
    </div>
  );
};
