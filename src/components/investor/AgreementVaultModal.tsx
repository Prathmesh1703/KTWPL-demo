import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Agreement } from '../../types';
import { formatINR, formatPercent, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { 
  ShieldCheck, 
  Download, 
  Copy, 
  Check, 
  BadgeCheck,
  Scale
} from 'lucide-react';

interface AgreementVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  agreement: Agreement | null;
}

export const AgreementVaultModal: React.FC<AgreementVaultModalProps> = ({
  isOpen,
  onClose,
  agreement,
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!agreement) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(agreement.cryptoHash);
    setCopied(true);
    toast.info('Hash Copied', 'Cryptographic SHA-256 seal copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      setIsGeneratingPdf(false);
      window.print();
      toast.success(
        'Contract Document Prepared',
        `Contract ${agreement.agreementNo} has been prepared with institutional digital seals.`
      );
    }, 500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Digitized Note Mandate #${agreement.agreementNo}`}
      subtitle="Cryptographically sealed capital deployment contract under Indian Stamp Act 1899"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Verification Status */}
        <div className="p-3.5 rounded-lg bg-[#121925] border border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BadgeCheck className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-ink-primary flex items-center gap-2">
                <span>Digitally Executed & Verified</span>
                <span className="text-[10px] text-ink-muted font-mono">
                  {agreement.digitalSignature.certSerial}
                </span>
              </div>
              <div className="text-[11px] text-ink-secondary mt-0.5">
                Signed by: {agreement.digitalSignature.signedBy} on {formatDate(agreement.digitalSignature.signedAt)}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-500 font-medium">ENFORCEABLE</span>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-lg bg-[#0A0D14] border border-white/[0.06] text-xs font-mono">
          <div>
            <span className="text-[10px] text-ink-muted font-sans block">Client PAN</span>
            <span className="font-medium text-ink-primary mt-0.5 block">{agreement.clientPan}</span>
          </div>
          <div>
            <span className="text-[10px] text-ink-muted font-sans block">Principal Sum</span>
            <span className="font-medium text-ink-primary mt-0.5 block tabular-nums">{formatINR(agreement.principalAmount)}</span>
          </div>
          <div>
            <span className="text-[10px] text-ink-muted font-sans block">Coupon Yield</span>
            <span className="font-medium text-emerald-500 mt-0.5 block">{formatPercent(agreement.interestRateAnnual)} p.a.</span>
          </div>
          <div>
            <span className="text-[10px] text-ink-muted font-sans block">Tenor Mandate</span>
            <span className="font-medium text-ink-secondary mt-0.5 block">{agreement.tenorMonths} Months</span>
          </div>
        </div>

        {/* Clauses */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-medium uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-gold-500" />
            Statutory Covenants & Operating Clauses
          </h4>

          <div className="space-y-2 text-xs text-ink-secondary leading-relaxed font-sans">
            <div className="p-3 rounded-lg bg-[#0A0D14] border border-white/[0.04]">
              <strong className="text-ink-primary block mb-0.5">
                Clause 4.2 — Interest Accrual & Escrow Mandate:
              </strong>
              Interest on the principal deployment of {formatINR(agreement.principalAmount)} shall accrue at 
              the agreed annual rate of {formatPercent(agreement.interestRateAnnual)} and be remitted on a {agreement.periodicity.toLowerCase()} cycle directly to the investor's verified bank escrow mandate.
            </div>

            <div className="p-3 rounded-lg bg-[#0A0D14] border border-white/[0.04]">
              <strong className="text-ink-primary block mb-0.5">
                Clause 7.1 — Seasoning Lock-in:
              </strong>
              A mandatory seasoning lock-in period of {agreement.clauses.lockInPeriodMonths} months applies from 
              commencement ({formatDate(agreement.startDate)}). Any early redemption requested thereafter shall incur an exit administrative fee of {formatPercent(agreement.clauses.earlyWithdrawalPenaltyPercent)}.
            </div>

            <div className="p-3 rounded-lg bg-[#0A0D14] border border-white/[0.04]">
              <strong className="text-ink-primary block mb-0.5">
                Clause 9.1 — Tax Withholding (TDS):
              </strong>
              In accordance with Section 194A of the Income Tax Act 1961, TDS shall be withheld at {formatPercent(agreement.clauses.tdsRatePercent)} 
              on all credited yield. Form 16A certificates shall be auto-published quarterly in the digital vault.
            </div>
          </div>
        </div>

        {/* Cryptographic SHA-256 Seal */}
        <div className="p-3 rounded-lg bg-[#0A0D14] border border-white/[0.06]">
          <div className="flex items-center justify-between mb-1 text-xs">
            <span className="text-ink-muted font-mono text-[10px] uppercase">SHA-256 Ledger Hash</span>
            <button
              onClick={handleCopyHash}
              className="text-xs text-ink-muted hover:text-ink-primary flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="p-2 rounded bg-[#080B12] font-mono text-[11px] text-ink-muted break-all select-all">
            {agreement.cryptoHash}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md text-xs text-ink-secondary hover:text-ink-primary transition-colors"
          >
            Close
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-4 py-1.5 rounded-md bg-gold-500 hover:bg-gold-600 text-[#080B12] font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            {isGeneratingPdf ? (
              <div className="w-3.5 h-3.5 border-2 border-[#080B12] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF Contract</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
