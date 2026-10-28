import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Agreement, WithdrawalRequest } from '../../types';
import { formatINR } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { 
  Building2, 
  CheckCircle2, 
  Send
} from 'lucide-react';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  agreements: Agreement[];
  onSubmitRequest: (newReq: Partial<WithdrawalRequest>) => void;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  agreements,
  onSubmitRequest,
}) => {
  const { toast } = useToast();

  const [selectedAgreementId, setSelectedAgreementId] = useState<string>(agreements[0]?.id || '');
  const [requestType, setRequestType] = useState<'PARTIAL' | 'FULL_REDEMPTION'>('PARTIAL');
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(1000000);
  const [reason, setReason] = useState<string>('Capital reallocation in alternative asset tranche');
  const [bankOption, setBankOption] = useState<string>('HDFC Bank - Nariman Point Branch (••••8492)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedAgreement = agreements.find(a => a.id === selectedAgreementId) || agreements[0];

  const handleMaxAmount = () => {
    if (selectedAgreement) {
      setWithdrawalAmount(selectedAgreement.principalAmount);
      setRequestType('FULL_REDEMPTION');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgreement) return;

    if (withdrawalAmount > selectedAgreement.principalAmount) {
      toast.error('Invalid Amount', 'Requested withdrawal cannot exceed active principal sum.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const newRequest: Partial<WithdrawalRequest> = {
        agreementNo: selectedAgreement.agreementNo,
        clientName: selectedAgreement.clientName,
        clientPan: selectedAgreement.clientPan,
        amount: withdrawalAmount,
        requestType,
        reason,
        payoutBank: bankOption,
        accountEnding: '8492',
        tdsApplicable: 0,
        netPayout: withdrawalAmount,
        status: 'PENDING_MAKER',
      };

      onSubmitRequest(newRequest);
      toast.success(
        'Redemption Request Initiated',
        `Request for ${formatINR(withdrawalAmount)} routed to Back-Office Maker queue.`
      );
      onClose();
    }, 500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Capital Redemption / Payout Request"
      subtitle="Standard T+2 settlement into registered SEBI-verified client bank escrow"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Select Active Agreement */}
        <div>
          <label className="block text-xs text-ink-secondary font-medium mb-1.5">
            Select Active Mandate Agreement
          </label>
          <select
            value={selectedAgreementId}
            onChange={e => {
              setSelectedAgreementId(e.target.value);
              const ag = agreements.find(a => a.id === e.target.value);
              if (ag && withdrawalAmount > ag.principalAmount) {
                setWithdrawalAmount(ag.principalAmount / 2);
              }
            }}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-subtle text-ink-primary text-xs font-mono focus:outline-none focus:border-gold-500/50"
          >
            {agreements.map(ag => (
              <option key={ag.id} value={ag.id}>
                {ag.agreementNo} — {formatINR(ag.principalAmount)} ({ag.interestRateAnnual}% p.a. {ag.periodicity})
              </option>
            ))}
          </select>
        </div>

        {/* Redemption Type: Partial vs Full */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRequestType('PARTIAL')}
            className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
              requestType === 'PARTIAL'
                ? 'bg-elevated border-gold-500/40 text-ink-primary font-medium'
                : 'bg-surface border-subtle text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <div className="text-xs font-medium">Partial Redemption</div>
            <div className="text-[10px] text-ink-muted">Retain active principal balance</div>
          </button>

          <button
            type="button"
            onClick={handleMaxAmount}
            className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
              requestType === 'FULL_REDEMPTION'
                ? 'bg-elevated border-gold-500/40 text-ink-primary font-medium'
                : 'bg-surface border-subtle text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <div className="text-xs font-medium">Full Liquidation</div>
            <div className="text-[10px] text-ink-muted">Redeem complete note balance</div>
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-ink-secondary font-medium">
              Redemption Amount
            </label>
            <span className="text-xs text-ink-muted font-mono">
              Available: <strong className="text-ink-primary font-normal">{formatINR(selectedAgreement?.principalAmount || 0)}</strong>
            </span>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-2 text-ink-muted font-mono">₹</span>
            <input
              type="number"
              min="100000"
              max={selectedAgreement?.principalAmount || 50000000}
              step="50000"
              value={withdrawalAmount}
              onChange={e => setWithdrawalAmount(Number(e.target.value))}
              className="w-full pl-7 pr-16 py-1.5 rounded-lg bg-surface border border-subtle text-ink-primary font-mono text-sm font-medium focus:outline-none focus:border-gold-500/50 tabular-nums"
              required
            />
            <button
              type="button"
              onClick={handleMaxAmount}
              className="absolute right-1.5 top-1 px-2 py-1 rounded bg-elevated hover:brightness-110 text-[10px] font-mono text-ink-secondary font-medium border border-subtle"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Destination Bank Account */}
        <div>
          <label className="block text-xs text-ink-secondary font-medium mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-gold-500" />
            <span>Destination Verified Bank Account</span>
          </label>
          <div className="p-2.5 rounded-lg bg-surface border border-subtle flex items-center justify-between text-xs">
            <div>
              <div className="font-medium text-ink-primary">{bankOption}</div>
              <div className="text-[10px] text-ink-muted mt-0.5 font-mono">
                IFSC: HDFC0000060 • NPCI Penny-Drop Verified
              </div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-xs text-ink-secondary font-medium mb-1.5">
            Purpose / Strategic Reason
          </label>
          <input
            type="text"
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-surface border border-subtle text-xs text-ink-primary placeholder-ink-muted focus:outline-none focus:border-gold-500/50"
            required
          />
        </div>

        {/* Lock-in Verification Alert */}
        <div className="p-3 rounded-lg bg-surface border border-subtle text-xs text-ink-secondary">
          <span className="font-medium text-ink-primary block mb-0.5">Seasoning Requirement Cleared:</span>
          Mandate #{selectedAgreement?.agreementNo} has seasoned past the 6-month statutory lock-in. No premature exit penalty applies.
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-subtle">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md text-xs text-ink-secondary hover:text-ink-primary"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-1.5 rounded-md bg-gold-500 hover:bg-gold-600 text-[#080B12] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60"
          >
            {isSubmitting ? (
              <div className="w-3.5 h-3.5 border-2 border-[#080B12] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit to Queue</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
