import React, { useState, useMemo } from 'react';
import { Modal } from '../common/Modal';
import { InflowProposal, Periodicity } from '../../types';
import { calculateWealthSimulation } from '../../utils/calculations';
import { formatINR } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Table
} from 'lucide-react';

interface FundOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddInflow: (inflow: InflowProposal) => void;
}

export const FundOnboardingModal: React.FC<FundOnboardingModalProps> = ({
  isOpen,
  onClose,
  onAddInflow,
}) => {
  const { toast } = useToast();

  const [step, setStep] = useState<1 | 2>(1);
  const [pan, setPan] = useState('AAACS8912P');
  const [clientName, setClientName] = useState('Arjun Singhania');
  const [phone, setPhone] = useState('+91 98201 44892');
  const [principal, setPrincipal] = useState<number>(5000000);
  const [tenorMonths, setTenorMonths] = useState<number>(24);
  const [interestRate, setInterestRate] = useState<number>(14.50);
  const [periodicity, setPeriodicity] = useState<Periodicity>('MONTHLY');
  const [utrNumber, setUtrNumber] = useState('HDFC9901827419');
  const [bankSource, setBankSource] = useState('HDFC Bank Nariman Point');

  const handlePanLookup = () => {
    if (pan.toUpperCase() === 'AAACS8912P') {
      setClientName('Arjun Singhania');
      setPhone('+91 98201 44892');
      toast.success('Client Verified', 'CKYC record matched for Arjun Singhania.');
    } else {
      setClientName('New Verified HNI Client');
      toast.info('New Record', 'New investor PAN registered.');
    }
  };

  const simulation = useMemo(() => {
    return calculateWealthSimulation(principal, tenorMonths, periodicity, interestRate);
  }, [principal, tenorMonths, periodicity, interestRate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProposal: InflowProposal = {
      id: `inf-${Date.now()}`,
      inflowNo: `INF-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName,
      clientPan: pan.toUpperCase(),
      clientPhone: phone,
      principalAmount: principal,
      tenorMonths,
      interestRateAnnual: interestRate,
      periodicity,
      utrNumber,
      bankSource,
      submittedAt: new Date().toISOString(),
      status: 'PENDING_MAKER',
    };

    onAddInflow(newProposal);
    toast.success(
      'Inflow Logged',
      `Proposal ${newProposal.inflowNo} of ${formatINR(principal)} routed to Maker desk.`
    );
    setStep(1);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Client Fund Intake Wizard"
      subtitle="Institutional intake for senior floating & fixed yield notes"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Step indicator */}
        <div className="flex items-center gap-3 border-b border-white/[0.08] pb-2.5 text-xs">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex items-center gap-2 pb-1 transition-colors ${
              step === 1 ? 'text-gold-500 border-b border-gold-500 font-medium' : 'text-ink-muted'
            }`}
          >
            <span className="w-4 h-4 rounded bg-[#121925] border border-white/[0.08] text-ink-primary flex items-center justify-center text-[10px]">1</span>
            <span>Mandate Parameters & PAN</span>
          </button>

          <span className="text-white/[0.1]">•</span>

          <button
            type="button"
            onClick={() => setStep(2)}
            className={`flex items-center gap-2 pb-1 transition-colors ${
              step === 2 ? 'text-gold-500 border-b border-gold-500 font-medium' : 'text-ink-muted'
            }`}
          >
            <span className="w-4 h-4 rounded bg-[#121925] border border-white/[0.08] text-ink-primary flex items-center justify-center text-[10px]">2</span>
            <span>Repayment Schedule Preview</span>
          </button>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            {/* PAN Lookup */}
            <div>
              <label className="block text-xs text-ink-secondary font-medium mb-1.5">
                Client Permanent Account Number (PAN)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pan}
                  onChange={e => setPan(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-[#0A0D14] border border-white/[0.08] text-ink-primary font-mono text-xs uppercase focus:outline-none focus:border-white/[0.2]"
                  required
                />
                <button
                  type="button"
                  onClick={handlePanLookup}
                  className="px-3 py-1.5 rounded-lg bg-[#121925] hover:bg-[#172030] border border-white/[0.08] text-xs font-medium text-ink-secondary hover:text-ink-primary flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Verify CKYC</span>
                </button>
              </div>
            </div>

            {/* Legal Name & Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-ink-secondary font-medium mb-1.5">
                  Investor Legal Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0A0D14] border border-white/[0.08] text-ink-primary text-xs focus:outline-none focus:border-white/[0.2]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-ink-secondary font-medium mb-1.5">
                  Registered Mobile
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0A0D14] border border-white/[0.08] text-ink-primary text-xs font-mono focus:outline-none focus:border-white/[0.2]"
                  required
                />
              </div>
            </div>

            {/* Principal & Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-ink-secondary font-medium mb-1.5">
                  Principal Amount (₹)
                </label>
                <input
                  type="number"
                  min="500000"
                  step="100000"
                  value={principal}
                  onChange={e => setPrincipal(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0A0D14] border border-white/[0.08] text-ink-primary font-mono text-xs focus:outline-none focus:border-white/[0.2] tabular-nums"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-ink-secondary font-medium mb-1.5">
                  Tenor Mandate
                </label>
                <select
                  value={tenorMonths}
                  onChange={e => setTenorMonths(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0A0D14] border border-white/[0.08] text-ink-primary text-xs focus:outline-none focus:border-white/[0.2]"
                >
                  <option value={6}>6 Months</option>
                  <option value={12}>12 Months</option>
                  <option value={24}>24 Months</option>
                  <option value={36}>36 Months</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-ink-secondary font-medium mb-1.5">
                  Interest Rate (% p.a.)
                </label>
                <input
                  type="number"
                  step="0.25"
                  value={interestRate}
                  onChange={e => setInterestRate(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0A0D14] border border-white/[0.08] text-ink-primary font-mono text-xs focus:outline-none focus:border-white/[0.2]"
                  required
                />
              </div>
            </div>

            {/* Frequency & UTR */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-ink-secondary font-medium mb-1.5">
                  Payout Frequency
                </label>
                <select
                  value={periodicity}
                  onChange={e => setPeriodicity(e.target.value as Periodicity)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0A0D14] border border-white/[0.08] text-ink-primary text-xs focus:outline-none focus:border-white/[0.2]"
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="QUARTERLY">Quarterly</option>
                  <option value="MATURITY_COMPOUND">At Maturity</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-ink-secondary font-medium mb-1.5">
                  Banking UTR Reference
                </label>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={e => setUtrNumber(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0A0D14] border border-white/[0.08] text-ink-primary font-mono text-xs focus:outline-none focus:border-white/[0.2]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-ink-secondary font-medium mb-1.5">
                  Remitting Bank Source
                </label>
                <input
                  type="text"
                  value={bankSource}
                  onChange={e => setBankSource(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0A0D14] border border-white/[0.08] text-ink-primary text-xs focus:outline-none focus:border-white/[0.2]"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-1.5 rounded-md bg-[#121925] hover:bg-[#172030] border border-white/[0.08] text-ink-primary text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <span>Schedule Preview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Schedule Preview Table */}
            <div className="p-3.5 rounded-lg bg-[#0A0D14] border border-white/[0.06] space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-ink-primary flex items-center gap-1.5">
                  <Table className="w-3.5 h-3.5 text-gold-500" />
                  Repayment Schedule Preview
                </span>
                <span className="font-mono text-ink-muted text-[11px]">
                  Gross Yield: <strong className="text-emerald-500 font-normal">{formatINR(simulation.grossInterestTotal)}</strong>
                </span>
              </div>

              <div className="max-h-48 overflow-y-auto border border-white/[0.04] rounded text-xs font-mono">
                <table className="w-full text-left">
                  <thead className="bg-[#121925] text-ink-muted text-[10px] uppercase sticky top-0">
                    <tr>
                      <th className="py-2 px-3">Month</th>
                      <th className="py-2 px-3 text-right">Interest</th>
                      <th className="py-2 px-3 text-right">Payout</th>
                      <th className="py-2 px-3 text-right">Cumulative Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {simulation.schedule.slice(0, 12).map(row => (
                      <tr key={row.month} className="hover:bg-white/[0.02]">
                        <td className="py-1.5 px-3 text-ink-secondary">{row.monthLabel}</td>
                        <td className="py-1.5 px-3 text-right text-emerald-500">+{formatINR(row.interestEarned)}</td>
                        <td className="py-1.5 px-3 text-right text-ink-primary">
                          {row.payoutDisbursed > 0 ? formatINR(row.payoutDisbursed) : '-'}
                        </td>
                        <td className="py-1.5 px-3 text-right text-ink-primary font-medium">{formatINR(row.cumulativeWealth)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-[#121925] border border-white/[0.06] text-xs font-mono">
              <div>
                <span className="text-[10px] text-ink-muted uppercase block font-sans">Principal</span>
                <span className="font-medium text-ink-primary mt-0.5 block tabular-nums">{formatINR(principal)}</span>
              </div>
              <div>
                <span className="text-[10px] text-ink-muted uppercase block font-sans">TDS (10%)</span>
                <span className="font-medium text-ruby-500 mt-0.5 block tabular-nums">-{formatINR(simulation.tdsTotal)}</span>
              </div>
              <div>
                <span className="text-[10px] text-ink-muted uppercase block font-sans">Net Yield</span>
                <span className="font-medium text-emerald-500 mt-0.5 block tabular-nums">{formatINR(simulation.netInterestTotal)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-ink-muted hover:text-ink-secondary"
              >
                ← Back
              </button>

              <button
                type="submit"
                className="px-4 py-1.5 rounded-md bg-gold-500 hover:bg-gold-600 text-[#080B12] font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Submit to Maker Desk</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};
