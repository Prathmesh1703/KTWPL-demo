import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { InflowProposal, WithdrawalRequest } from '../../types';
import { formatINR } from '../../utils/formatters';
import { 
  Layers, 
  CheckCircle2, 
  X, 
  ArrowUpRight, 
  ArrowDownLeft, 
  UserCheck,
  ShieldCheck 
} from 'lucide-react';

interface MakerCheckerQueueProps {
  inflows: InflowProposal[];
  withdrawals: WithdrawalRequest[];
  onApproveInflow: (id: string, stage: 'MAKER' | 'CHECKER') => void;
  onRejectInflow: (id: string) => void;
  onApproveWithdrawal: (id: string, stage: 'MAKER' | 'CHECKER') => void;
  onRejectWithdrawal: (id: string) => void;
}

export const MakerCheckerQueue: React.FC<MakerCheckerQueueProps> = ({
  inflows,
  withdrawals,
  onApproveInflow,
  onRejectInflow,
  onApproveWithdrawal,
  onRejectWithdrawal,
}) => {
  const [activeQueueTab, setActiveQueueTab] = useState<'INFLOWS' | 'WITHDRAWALS'>('INFLOWS');

  const pendingInflows = inflows.filter(i => i.status !== 'APPROVED' && i.status !== 'REJECTED');
  const pendingWithdrawals = withdrawals.filter(w => w.status !== 'DISBURSED' && w.status !== 'REJECTED');

  return (
    <GlassCard className="p-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-subtle">
        <div>
          <h3 className="text-base font-semibold text-ink-primary tracking-tight flex items-center gap-2">
            <Layers className="w-4 h-4 text-gold-500" />
            Maker-Checker Dual Authorization Queues
          </h3>
          <p className="text-xs text-ink-secondary mt-0.5">
            Strict institutional separation of duties under SEBI capital deployment directives.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-surface border border-subtle">
          <button
            onClick={() => setActiveQueueTab('INFLOWS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors ${
              activeQueueTab === 'INFLOWS'
                ? 'bg-elevated text-ink-primary font-medium border border-subtle'
                : 'text-ink-muted hover:text-ink-secondary'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-gold-500" />
            <span>Capital Inflows</span>
            {pendingInflows.length > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-gold-500/10 text-gold-500 border border-gold-500/20 font-medium">
                {pendingInflows.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveQueueTab('WITHDRAWALS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors ${
              activeQueueTab === 'WITHDRAWALS'
                ? 'bg-elevated text-ink-primary font-medium border border-subtle'
                : 'text-ink-muted hover:text-ink-secondary'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-ruby-500" />
            <span>Redemption Claims</span>
            {pendingWithdrawals.length > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-ruby-500/10 text-ruby-500 border border-ruby-500/20 font-medium">
                {pendingWithdrawals.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Queue Content */}
      <div className="pt-5">
        {activeQueueTab === 'INFLOWS' ? (
          <div className="space-y-3">
            {inflows.map(inflow => {
              const isMakerPending = inflow.status === 'PENDING_MAKER';
              const isCheckerPending = inflow.status === 'PENDING_CHECKER';
              const isApproved = inflow.status === 'APPROVED';

              return (
                <div
                  key={inflow.id}
                  className="p-4 rounded-lg bg-surface border border-subtle flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1 flex-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-ink-primary">
                        {inflow.inflowNo}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isMakerPending
                            ? 'bg-gold-500/10 text-gold-500 border-gold-500/20'
                            : isCheckerPending
                            ? 'bg-elevated text-ink-secondary border-subtle'
                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        }`}
                      >
                        {inflow.status.replace('_', ' ')}
                      </span>
                      <span className="text-ink-muted font-mono text-[11px]">
                        UTR: {inflow.utrNumber}
                      </span>
                    </div>

                    <div className="text-sm font-medium text-ink-primary flex items-center gap-2">
                      <span>{inflow.clientName}</span>
                      <span className="text-xs text-ink-muted font-mono">({inflow.clientPan})</span>
                    </div>

                    <div className="text-ink-secondary font-mono flex flex-wrap gap-4 pt-0.5">
                      <span>Amount: <strong className="text-ink-primary font-normal">{formatINR(inflow.principalAmount)}</strong></span>
                      <span>Tenor: <strong className="text-ink-primary font-normal">{inflow.tenorMonths}m</strong></span>
                      <span>Yield: <strong className="text-emerald-500 font-normal">{inflow.interestRateAnnual}%</strong></span>
                      <span>Bank: <strong className="text-ink-secondary font-normal">{inflow.bankSource}</strong></span>
                    </div>

                    {inflow.makerReviewer && (
                      <div className="text-[11px] text-ink-muted font-mono mt-0.5">
                        ✓ {inflow.makerReviewer}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 w-full lg:w-auto justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-subtle">
                    {isMakerPending && (
                      <button
                        onClick={() => onApproveInflow(inflow.id, 'MAKER')}
                        className="px-3 py-1.5 rounded-md bg-elevated hover:brightness-105 border border-subtle text-gold-500 text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Maker Verify</span>
                      </button>
                    )}

                    {isCheckerPending && (
                      <button
                        onClick={() => onApproveInflow(inflow.id, 'CHECKER')}
                        className="px-3 py-1.5 rounded-md bg-gold-500 hover:bg-gold-600 text-[#080B12] font-semibold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Checker Authorize</span>
                      </button>
                    )}

                    {isApproved && (
                      <span className="text-xs text-emerald-500 font-mono font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Mandate Active
                      </span>
                    )}

                    {!isApproved && (
                      <button
                        onClick={() => onRejectInflow(inflow.id)}
                        className="p-1.5 rounded-md text-ink-muted hover:text-ruby-500 transition-colors"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {withdrawals.map(wr => {
              const isMakerPending = wr.status === 'PENDING_MAKER';
              const isCheckerPending = wr.status === 'PENDING_CHECKER';
              const isDisbursed = wr.status === 'DISBURSED';

              return (
                <div
                  key={wr.id}
                  className="p-4 rounded-lg bg-surface border border-subtle flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1 flex-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-ruby-500">
                        {wr.requestNo} <span className="text-ink-muted">({wr.agreementNo})</span>
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isMakerPending
                            ? 'bg-gold-500/10 text-gold-500 border-gold-500/20'
                            : isCheckerPending
                            ? 'bg-elevated text-ink-secondary border-subtle'
                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        }`}
                      >
                        {wr.status.replace('_', ' ')}
                      </span>
                      <span className="text-ink-muted font-mono text-[11px]">
                        {wr.requestType}
                      </span>
                    </div>

                    <div className="text-sm font-medium text-ink-primary flex items-center gap-2">
                      <span>{wr.clientName}</span>
                      <span className="text-xs text-ink-muted font-mono">({wr.clientPan})</span>
                    </div>

                    <div className="text-ink-secondary font-mono flex flex-wrap gap-4 pt-0.5">
                      <span>Claim: <strong className="text-ink-primary font-normal">{formatINR(wr.amount)}</strong></span>
                      <span>Target: <strong className="text-ink-secondary font-normal">{wr.payoutBank}</strong></span>
                    </div>

                    <div className="text-[11px] text-ink-muted italic">
                      "{wr.reason}"
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 w-full lg:w-auto justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-subtle">
                    {isMakerPending && (
                      <button
                        onClick={() => onApproveWithdrawal(wr.id, 'MAKER')}
                        className="px-3 py-1.5 rounded-md bg-elevated hover:brightness-105 border border-subtle text-gold-500 text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Maker Verify</span>
                      </button>
                    )}

                    {isCheckerPending && (
                      <button
                        onClick={() => onApproveWithdrawal(wr.id, 'CHECKER')}
                        className="px-3 py-1.5 rounded-md bg-gold-500 hover:bg-gold-600 text-[#080B12] font-semibold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Authorize RTGS</span>
                      </button>
                    )}

                    {isDisbursed && (
                      <span className="text-xs text-emerald-500 font-mono font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Disbursed
                      </span>
                    )}

                    {!isDisbursed && (
                      <button
                        onClick={() => onRejectWithdrawal(wr.id)}
                        className="p-1.5 rounded-md text-ink-muted hover:text-ruby-500 transition-colors"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </GlassCard>
  );
};
