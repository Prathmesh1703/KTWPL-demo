import React from 'react';
import { Modal } from '../common/Modal';
import { Agreement, MeetingRequest } from '../../types';
import { formatDate, formatINR } from '../../utils/formatters';
import { 
  FileText, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  MessageSquare, 
  AlertCircle,
  ExternalLink,
  Plus
} from 'lucide-react';

interface InvestmentMeetingNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  agreement: Agreement | null;
  meetings: MeetingRequest[];
  onOpenRequestMeeting: (agreementNo: string) => void;
}

export const InvestmentMeetingNotesModal: React.FC<InvestmentMeetingNotesModalProps> = ({
  isOpen,
  onClose,
  agreement,
  meetings,
  onOpenRequestMeeting,
}) => {
  if (!isOpen || !agreement) return null;

  // Filter meetings linked to this agreement
  const linkedMeetings = meetings.filter(m => m.agreementNo === agreement.agreementNo);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Meeting Notes — #${agreement.agreementNo}`}
      subtitle={`Official minutes, consultations, and review notes recorded for Mandate #${agreement.agreementNo}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Mandate Summary Header Strip */}
        <div className="p-3.5 rounded-xl bg-surface border border-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gold-500 shrink-0" />
            <div>
              <span className="font-semibold text-ink-primary font-mono block">
                {agreement.agreementNo} • {agreement.periodicity === 'MONTHLY' ? 'Senior Monthly' : agreement.periodicity === 'QUARTERLY' ? 'Compounding Vault' : 'Fixed Mandate'}
              </span>
              <span className="text-ink-secondary text-[11px] block mt-0.5">
                Principal: <strong className="text-white font-mono">{formatINR(agreement.principalAmount)}</strong> at {agreement.interestRateAnnual}% p.a.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenRequestMeeting(agreement.agreementNo);
            }}
            className="px-3 py-1.5 rounded-lg bg-gold-500/15 hover:bg-gold-500/25 border border-gold-500/30 text-gold-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Request Meeting for this Note</span>
          </button>
        </div>

        {/* Meeting Records List */}
        <div className="space-y-3">
          {linkedMeetings.length > 0 ? (
            linkedMeetings.map(mtg => {
              const isCompleted = mtg.status === 'COMPLETED';
              const isConfirmed = mtg.status === 'CONFIRMED';
              const isPending = mtg.status === 'PENDING_ADMIN';
              const isRescheduled = mtg.status === 'RESCHEDULED';

              return (
                <div
                  key={mtg.id}
                  className="p-4 rounded-xl bg-surface/90 border border-subtle transition-all space-y-3"
                >
                  {/* Top Row: Title, Date, Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-subtle">
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-2">
                        <span>{mtg.title}</span>
                        <span className="text-[10px] text-ink-muted font-mono">#{mtg.meetingNo}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-1 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gold-500" />
                          <span>{formatDate(mtg.requestedDate)}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gold-500" />
                          <span>{mtg.timeSlot}</span>
                        </span>
                      </div>
                    </div>

                    <div>
                      {isCompleted && (
                        <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Completed & Minuted</span>
                        </span>
                      )}
                      {isConfirmed && (
                        <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Confirmed • Scheduled</span>
                        </span>
                      )}
                      {isPending && (
                        <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Pending Admin Review</span>
                        </span>
                      )}
                      {isRescheduled && (
                        <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>Rescheduled Proposed</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Attending Admin */}
                  {mtg.adminName && (
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <User className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      <span>
                        Relationship Manager: <strong className="text-white">{mtg.adminName}</strong>
                      </span>
                    </div>
                  )}

                  {/* Meeting Notes / Minutes of Meeting */}
                  {mtg.meetingNotes ? (
                    <div className="p-3 rounded-lg bg-surface/60 border border-white/10 space-y-1.5">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-gold-400 flex items-center gap-1.5 font-semibold">
                        <MessageSquare className="w-3 h-3" />
                        <span>Recorded Discussion Minutes & Outcomes</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-sans">
                        {mtg.meetingNotes}
                      </p>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-surface/40 border border-subtle text-[11px] text-slate-400 italic">
                      {isPending ? 'Discussion points will be logged upon session completion.' : 'Scheduled session. Official meeting notes will be published post-consultation.'}
                    </div>
                  )}

                  {/* Meeting Link if confirmed */}
                  {mtg.meetingLink && (
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-400 text-[11px]">Secure Meeting Room:</span>
                      <a
                        href={mtg.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-gold-400 hover:text-gold-300 flex items-center gap-1.5 font-mono"
                      >
                        <span>Join Video Room</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 rounded-xl bg-surface/50 border border-subtle text-center space-y-2">
              <Calendar className="w-8 h-8 text-gold-500/50 mx-auto" />
              <div className="text-xs font-semibold text-ink-primary">No Recorded Meetings for this Investment Yet</div>
              <p className="text-xs text-ink-muted max-w-sm mx-auto">
                Schedule a consultation to discuss yield, compounding horizon, or liquidity options for Note #{agreement.agreementNo}.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRequestMeeting(agreement.agreementNo);
                }}
                className="mt-2 px-3.5 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-[#080B12] font-semibold text-xs inline-flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Request First Meeting</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-subtle">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-surface border border-subtle hover:bg-elevated text-ink-primary text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

