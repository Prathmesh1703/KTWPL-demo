import React, { useState, useEffect } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Agreement, MeetingRequest } from '../../types';
import { formatINR, truncateHash, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { 
  FileText, 
  Clock, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck,
  MessageSquare,
  Calendar
} from 'lucide-react';

interface ActiveFundsListProps {
  agreements: Agreement[];
  onSelectAgreement: (agreement: Agreement) => void;
  meetings?: MeetingRequest[];
  onOpenMeetingNotes?: (agreement: Agreement) => void;
}

export const ActiveFundsList: React.FC<ActiveFundsListProps> = ({
  agreements,
  onSelectAgreement,
  meetings = [],
  onOpenMeetingNotes,
}) => {
  const { toast } = useToast();
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Live countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 28,
    seconds: 42,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyHash = (hash: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    toast.info('Hash Copied', 'Cryptographic SHA-256 seal copied to clipboard.');
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Status Bar with Live Countdown */}
      <div className="flex items-center justify-between text-xs text-ink-secondary font-mono">
        <span className="text-xs text-ink-muted font-sans font-medium">
          Active Plans ({agreements.length})
        </span>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-gold-500" />
          <span>Next Payout:</span>
          <span className="font-semibold text-ink-primary">
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </span>
        </div>
      </div>

      {/* Grid of Agreement Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {agreements.map(ag => {
          const isMonthly = ag.periodicity === 'MONTHLY';
          const isQuarterly = ag.periodicity === 'QUARTERLY';

          return (
            <GlassCard
              key={ag.id}
              className="p-5 flex flex-col justify-between cursor-pointer group"
              onClick={() => onSelectAgreement(ag)}
            >
              <div>
                {/* Header row: Agreement No & Periodicity */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gold-500" />
                    <span className="text-xs font-semibold text-ink-primary font-mono">
                      {ag.agreementNo}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-elevated border border-subtle text-ink-secondary">
                    {isMonthly ? 'Monthly Payout' : isQuarterly ? 'Quarterly Compound' : 'Cumulative'}
                  </span>
                </div>

                {/* Principal Amount */}
                <div className="mb-4">
                  <div className="text-[11px] text-ink-muted">Investment Amount</div>
                  <div className="text-xl font-semibold text-ink-primary font-mono mt-0.5 tabular-nums">
                    {formatINR(ag.principalAmount)}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2.5 p-3 rounded-lg bg-surface border border-subtle mb-4 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-ink-muted block font-sans">Interest Rate</span>
                    <span className="font-medium text-emerald-500 mt-0.5 block tabular-nums">
                      {ag.interestRateAnnual.toFixed(2)}% p.a.
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-ink-muted block font-sans">Next Payout Date</span>
                    <span className="font-medium text-ink-secondary mt-0.5 block">
                      {formatDate(ag.nextPayoutDate)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-ink-muted block font-sans">Earned Interest</span>
                    <span className="font-medium text-ink-primary mt-0.5 block tabular-nums">
                      {formatINR(ag.accruedInterest)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-ink-muted block font-sans">Lock-in Period</span>
                    <span className="font-medium text-ink-secondary mt-0.5 block">
                      {ag.clauses.lockInPeriodMonths}m (Cleared)
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-subtle flex flex-wrap items-center justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={e => handleCopyHash(ag.cryptoHash, e)}
                  className="flex items-center gap-1.5 text-[11px] font-mono text-ink-muted hover:text-ink-secondary transition-colors"
                  title="Copy SHA-256 seal"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{truncateHash(ag.cryptoHash, 5, 4)}</span>
                  {copiedHash === ag.cryptoHash ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3 opacity-60" />
                  )}
                </button>

                <div className="flex items-center gap-3">
                  {onOpenMeetingNotes && (
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        onOpenMeetingNotes(ag);
                      }}
                      className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
                      title="View meeting notes & minutes for this investment"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>
                        Meeting Notes
                        {meetings.filter(m => m.agreementNo === ag.agreementNo).length > 0
                          ? ` (${meetings.filter(m => m.agreementNo === ag.agreementNo).length})`
                          : ''}
                      </span>
                    </button>
                  )}

                  <span className="text-xs font-medium text-gold-500 flex items-center gap-1 group-hover:underline">
                    <span>View Agreement</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
