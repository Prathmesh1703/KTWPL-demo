import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Agreement, MeetingRequest } from '../../types';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import { Calendar, Clock, FileText, CheckCircle2 } from 'lucide-react';

interface RequestMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  agreements: Agreement[];
  onRequestMeeting: (req: Partial<MeetingRequest>) => void;
  preselectedAgreementNo?: string;
}

const TIME_SLOTS = [
  '10:00 AM - 10:45 AM IST',
  '11:30 AM - 12:15 PM IST',
  '02:00 PM - 02:45 PM IST',
  '03:30 PM - 04:15 PM IST',
  '05:00 PM - 05:45 PM IST',
];

export const RequestMeetingModal: React.FC<RequestMeetingModalProps> = ({
  isOpen,
  onClose,
  agreements,
  onRequestMeeting,
  preselectedAgreementNo,
}) => {
  const { toast } = useToast();

  // Get tomorrow's date formatted as YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().slice(0, 10);

  const [title, setTitle] = useState('');
  const [requestedDate, setRequestedDate] = useState(defaultDate);
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[1]);
  const [agreementNo, setAgreementNo] = useState(preselectedAgreementNo || '');
  const [agenda, setAgenda] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync if preselectedAgreementNo changes
  React.useEffect(() => {
    if (preselectedAgreementNo) {
      setAgreementNo(preselectedAgreementNo);
    }
  }, [preselectedAgreementNo]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Title Required', 'Please enter a purpose or subject for the meeting.');
      return;
    }

    if (!requestedDate) {
      toast.error('Date Required', 'Please select a preferred meeting date.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      onRequestMeeting({
        title: title.trim(),
        agenda: agenda.trim() || 'Institutional consultation regarding portfolio mandate and liquidity terms.',
        requestedDate,
        timeSlot,
        agreementNo: agreementNo.trim() ? agreementNo.trim() : undefined,
      });

      setIsSubmitting(false);
      onClose();
      // Reset form
      setTitle('');
      setAgenda('');
      setAgreementNo('');
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Institutional Meeting"
      subtitle="Schedule a consultation with your KTWPL Relationship Desk & Senior Partners"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Purpose / Title */}
        <div>
          <label className="block text-xs font-semibold text-ink-primary mb-1.5">
            Meeting Purpose / Subject <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Annual Mandate Review, Reinvestment Strategy, Yield Advisory"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-subtle focus:border-gold-500 focus:outline-none text-ink-primary placeholder:text-ink-muted transition-colors font-sans"
          />
        </div>

        {/* Date & Time Slot Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink-primary mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gold-500" />
              <span>Preferred Date</span> <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              required
              min={defaultDate}
              value={requestedDate}
              onChange={e => setRequestedDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-subtle focus:border-gold-500 focus:outline-none text-ink-primary transition-colors font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-primary mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gold-500" />
              <span>Preferred Time Slot</span> <span className="text-rose-400">*</span>
            </label>
            <select
              value={timeSlot}
              onChange={e => setTimeSlot(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-subtle focus:border-gold-500 focus:outline-none text-ink-primary transition-colors font-mono"
            >
              {TIME_SLOTS.map(slot => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Select Investment (Optional Field) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-ink-primary flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-gold-500" />
              <span>Associated Investment</span>
            </label>
            <span className="text-[10px] text-ink-muted uppercase font-mono tracking-wider">Optional Field</span>
          </div>
          <select
            value={agreementNo}
            onChange={e => setAgreementNo(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-subtle focus:border-gold-500 focus:outline-none text-ink-primary transition-colors font-sans"
          >
            <option value="">General Consultation (No specific investment linked)</option>
            {agreements.map(ag => (
              <option key={ag.id} value={ag.agreementNo}>
                {ag.agreementNo} — {formatINR(ag.principalAmount)} ({ag.interestRateAnnual}% p.a. • {ag.periodicity === 'MONTHLY' ? 'Monthly' : ag.periodicity === 'QUARTERLY' ? 'Compounding' : 'Fixed'})
              </option>
            ))}
          </select>
          <p className="text-[11px] text-ink-secondary mt-1">
            Selecting an investment attaches meeting minutes & discussion notes directly to that investment's dossier.
          </p>
        </div>

        {/* Agenda / Discussion Points */}
        <div>
          <label className="block text-xs font-semibold text-ink-primary mb-1.5">
            Agenda & Specific Discussion Points
          </label>
          <textarea
            rows={3}
            placeholder="Briefly describe what you would like to discuss (e.g. lock-in terms, rollover options, tax TDS certificates)..."
            value={agenda}
            onChange={e => setAgenda(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-subtle focus:border-gold-500 focus:outline-none text-ink-primary placeholder:text-ink-muted transition-colors font-sans resize-none"
          />
        </div>

        {/* Security & Confirmation Notice */}
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 text-xs text-ink-secondary">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>
            Meetings are conducted over secure end-to-end encrypted institutional rooms. KTWPL Admin will review and confirm your slot within 2 business hours.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-subtle">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-xl border border-subtle hover:bg-elevated text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-gold-500 hover:bg-gold-600 text-[#080B12] transition-colors flex items-center gap-1.5 shadow-md shadow-gold-500/20 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-3.5 h-3.5 border-2 border-[#080B12] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Calendar className="w-3.5 h-3.5" />
                <span>Submit Meeting Request</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

