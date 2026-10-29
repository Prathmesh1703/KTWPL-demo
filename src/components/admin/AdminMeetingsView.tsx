import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Modal } from '../common/Modal';
import { MeetingRequest } from '../../types';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Video, 
  ExternalLink, 
  FileText, 
  User, 
  MessageSquare,
  Edit3,
  Filter,
  Check,
  Send
} from 'lucide-react';

interface AdminMeetingsViewProps {
  meetings: MeetingRequest[];
  onAcceptMeeting: (id: string, meetingLink?: string, feedback?: string) => void;
  onRejectMeeting: (id: string, reason?: string) => void;
  onRescheduleMeeting: (id: string, newDate: string, newTimeSlot: string, note?: string) => void;
  onUpdateMeetingNotes: (id: string, notes: string) => void;
}

const TIME_SLOTS = [
  '10:00 AM - 10:45 AM IST',
  '11:30 AM - 12:15 PM IST',
  '02:00 PM - 02:45 PM IST',
  '03:30 PM - 04:15 PM IST',
  '05:00 PM - 05:45 PM IST',
];

export const AdminMeetingsView: React.FC<AdminMeetingsViewProps> = ({
  meetings,
  onAcceptMeeting,
  onRejectMeeting,
  onRescheduleMeeting,
  onUpdateMeetingNotes,
}) => {
  const { toast } = useToast();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED'>('ALL');

  // Modal States
  const [activeRescheduleMeeting, setActiveRescheduleMeeting] = useState<MeetingRequest | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlot, setRescheduleSlot] = useState(TIME_SLOTS[0]);
  const [rescheduleNote, setRescheduleNote] = useState('');

  const [activeNotesMeeting, setActiveNotesMeeting] = useState<MeetingRequest | null>(null);
  const [editingNotes, setEditingNotes] = useState('');

  const [activeAcceptMeeting, setActiveAcceptMeeting] = useState<MeetingRequest | null>(null);
  const [meetingLink, setMeetingLink] = useState('');
  const [acceptFeedback, setAcceptFeedback] = useState('');

  const [activeRejectMeeting, setActiveRejectMeeting] = useState<MeetingRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const filteredMeetings = meetings.filter(m => {
    if (filter === 'PENDING') return m.status === 'PENDING_ADMIN';
    if (filter === 'CONFIRMED') return m.status === 'CONFIRMED' || m.status === 'RESCHEDULED';
    if (filter === 'COMPLETED') return m.status === 'COMPLETED';
    return true;
  });

  const pendingCount = meetings.filter(m => m.status === 'PENDING_ADMIN').length;
  const confirmedCount = meetings.filter(m => m.status === 'CONFIRMED' || m.status === 'RESCHEDULED').length;
  const completedCount = meetings.filter(m => m.status === 'COMPLETED').length;

  const handleOpenAccept = (m: MeetingRequest) => {
    setActiveAcceptMeeting(m);
    setMeetingLink(`https://meet.ktwpl.com/inst-${m.meetingNo.toLowerCase()}`);
    setAcceptFeedback('Session accepted by Managing Desk. Institutional video link assigned.');
  };

  const handleConfirmAccept = () => {
    if (!activeAcceptMeeting) return;
    onAcceptMeeting(activeAcceptMeeting.id, meetingLink, acceptFeedback);
    toast.success('Meeting Accepted', `Meeting #${activeAcceptMeeting.meetingNo} has been confirmed.`);
    setActiveAcceptMeeting(null);
  };

  const handleOpenReschedule = (m: MeetingRequest) => {
    setActiveRescheduleMeeting(m);
    setRescheduleDate(m.requestedDate);
    setRescheduleSlot(m.timeSlot);
    setRescheduleNote('Conflict with statutory clearing committee. Proposed next available window.');
  };

  const handleConfirmReschedule = () => {
    if (!activeRescheduleMeeting) return;
    onRescheduleMeeting(activeRescheduleMeeting.id, rescheduleDate, rescheduleSlot, rescheduleNote);
    toast.info('Meeting Rescheduled', `Proposed alternative time slot for #${activeRescheduleMeeting.meetingNo}.`);
    setActiveRescheduleMeeting(null);
  };

  const handleOpenReject = (m: MeetingRequest) => {
    setActiveRejectMeeting(m);
    setRejectReason('Scheduling conflict. Client asked to connect with relationship manager directly.');
  };

  const handleConfirmReject = () => {
    if (!activeRejectMeeting) return;
    onRejectMeeting(activeRejectMeeting.id, rejectReason);
    toast.error('Meeting Declined', `Meeting #${activeRejectMeeting.meetingNo} declined.`);
    setActiveRejectMeeting(null);
  };

  const handleOpenNotesModal = (m: MeetingRequest) => {
    setActiveNotesMeeting(m);
    setEditingNotes(m.meetingNotes || '');
  };

  const handleSaveNotes = () => {
    if (!activeNotesMeeting) return;
    onUpdateMeetingNotes(activeNotesMeeting.id, editingNotes);
    toast.success('Meeting Notes Saved', `Minutes for #${activeNotesMeeting.meetingNo} updated and published to investor portal.`);
    setActiveNotesMeeting(null);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-subtle">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold-500" />
            <span>Client Consultations & Meeting Desk</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Review incoming investor consultation requests, assign video rooms, reschedule slots, and record official meeting minutes.
          </p>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <GlassCard variant="liquid" enableTilt={false} className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-300 font-sans block">Pending Review</span>
            <span className="text-2xl font-bold text-amber-300 font-mono mt-1 block">{pendingCount}</span>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Awaiting confirmation</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300">
            <Clock className="w-5 h-5" />
          </div>
        </GlassCard>

        <GlassCard variant="liquid" enableTilt={false} className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-300 font-sans block">Confirmed Scheduled</span>
            <span className="text-2xl font-bold text-sky-400 font-mono mt-1 block">{confirmedCount}</span>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Rooms active</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Video className="w-5 h-5" />
          </div>
        </GlassCard>

        <GlassCard variant="liquid" enableTilt={false} className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-300 font-sans block">Minuted Completed</span>
            <span className="text-2xl font-bold text-emerald-400 font-mono mt-1 block">{completedCount}</span>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Notes published</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </GlassCard>

        <GlassCard variant="liquid" enableTilt={false} className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-300 font-sans block">Total Inquiries</span>
            <span className="text-2xl font-bold text-white font-mono mt-1 block">{meetings.length}</span>
            <span className="text-[10px] text-gold-400 font-mono block mt-0.5">HNI mandate pipeline</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
            <User className="w-5 h-5" />
          </div>
        </GlassCard>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-subtle pb-2 text-xs">
        <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
        {(['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED'] as const).map(tab => {
          const isActive = filter === tab;
          const label = tab === 'ALL' ? 'All Inquiries' : tab === 'PENDING' ? 'Pending Approval' : tab === 'CONFIRMED' ? 'Confirmed & Scheduled' : 'Completed with Notes';
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                isActive
                  ? 'bg-elevated text-gold-500 font-semibold border border-gold-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-elevated/40'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {filteredMeetings.length > 0 ? (
          filteredMeetings.map(mtg => {
            const isPending = mtg.status === 'PENDING_ADMIN';
            const isConfirmed = mtg.status === 'CONFIRMED';
            const isCompleted = mtg.status === 'COMPLETED';
            const isRescheduled = mtg.status === 'RESCHEDULED';
            const isRejected = mtg.status === 'REJECTED';

            return (
              <GlassCard
                key={mtg.id}
                variant="liquid"
                enableTilt={false}
                className="p-5 space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-subtle">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white tracking-tight">
                        {mtg.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded bg-surface border border-subtle">
                        #{mtg.meetingNo}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-300">
                      <span className="font-medium text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gold-500" />
                        <span>{mtg.investorName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({mtg.investorPan})</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-gold-500" />
                        <span>{formatDate(mtg.requestedDate)}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-gold-500" />
                        <span>{mtg.timeSlot}</span>
                      </span>
                    </div>
                  </div>

                  <div>
                    {isPending && (
                      <span className="text-[10px] font-semibold font-mono px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Requires Authorization</span>
                      </span>
                    )}
                    {isConfirmed && (
                      <span className="text-[10px] font-semibold font-mono px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirmed & Active</span>
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-[10px] font-semibold font-mono px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed & Minuted</span>
                      </span>
                    )}
                    {isRescheduled && (
                      <span className="text-[10px] font-semibold font-mono px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Rescheduled</span>
                      </span>
                    )}
                    {isRejected && (
                      <span className="text-[10px] font-semibold font-mono px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Declined</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Linked Investment (if selected) */}
                {mtg.agreementNo && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface/80 border border-subtle text-xs">
                    <FileText className="w-4 h-4 text-gold-500 shrink-0" />
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <span className="text-slate-400 text-[11px] mr-1.5">Associated Mandate Agreement:</span>
                        <strong className="text-white font-mono font-medium">#{mtg.agreementNo}</strong>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        Minutes auto-publish to this note's dossier
                      </span>
                    </div>
                  </div>
                )}

                {/* Agenda */}
                {mtg.agenda && (
                  <div className="text-xs text-slate-300">
                    <span className="text-[11px] text-slate-400 uppercase font-mono font-medium block mb-0.5">
                      Client Discussion Focus
                    </span>
                    <p className="leading-relaxed">{mtg.agenda}</p>
                  </div>
                )}

                {/* Meeting Link (if confirmed) */}
                {mtg.meetingLink && (
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-white/[0.02] border border-white/10 font-mono">
                    <span className="text-slate-400 text-[11px]">Assigned Encrypted Room:</span>
                    <a
                      href={mtg.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gold-400 hover:text-gold-300 flex items-center gap-1.5 font-semibold"
                    >
                      <span>{mtg.meetingLink}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* Meeting Notes / Minutes (if logged) */}
                {mtg.meetingNotes && (
                  <div className="p-3.5 rounded-xl bg-surface/90 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-gold-400 font-semibold flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Official Discussion Minutes & Agreed Covenants</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenNotesModal(mtg)}
                        className="text-xs text-gold-500 hover:underline flex items-center gap-1 font-mono cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Minutes</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      {mtg.meetingNotes}
                    </p>
                  </div>
                )}

                {/* Action Bar */}
                <div className="pt-3 border-t border-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Submitted on {formatDate(mtg.requestedAt)}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Pending actions */}
                    {isPending && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleOpenReject(mtg)}
                          className="px-3 py-1.5 rounded-lg border border-rose-500/30 hover:bg-rose-500/10 text-rose-300 text-xs font-medium transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenReschedule(mtg)}
                          className="px-3 py-1.5 rounded-lg border border-purple-500/30 hover:bg-purple-500/10 text-purple-300 text-xs font-medium transition-colors cursor-pointer"
                        >
                          Reschedule
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenAccept(mtg)}
                          className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept & Confirm</span>
                        </button>
                      </>
                    )}

                    {/* Confirmed / Completed actions */}
                    {(isConfirmed || isCompleted || isRescheduled) && (
                      <button
                        type="button"
                        onClick={() => handleOpenNotesModal(mtg)}
                        className="px-3.5 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-[#080B12] font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-gold-500/20 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{mtg.meetingNotes ? 'Update Meeting Minutes' : 'Record Discussion Minutes'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })
        ) : (
          <GlassCard variant="liquid" enableTilt={false} className="p-12 text-center space-y-2">
            <Calendar className="w-10 h-10 text-gold-500/40 mx-auto" />
            <h3 className="text-sm font-semibold text-white">No Meeting Requests Found</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              No investor requests match this filter. All consultations will appear here with instant authorization controls.
            </p>
          </GlassCard>
        )}
      </div>

      {/* Accept Modal */}
      {activeAcceptMeeting && (
        <Modal
          isOpen={!!activeAcceptMeeting}
          onClose={() => setActiveAcceptMeeting(null)}
          title={`Accept Meeting #${activeAcceptMeeting.meetingNo}`}
          subtitle={`Confirm consultation slot for ${activeAcceptMeeting.investorName}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                Assigned Video / Conference Link
              </label>
              <input
                type="text"
                value={meetingLink}
                onChange={e => setMeetingLink(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-subtle focus:border-gold-500 focus:outline-none text-ink-primary font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                Confirmation Note to Investor
              </label>
              <textarea
                rows={2}
                value={acceptFeedback}
                onChange={e => setAcceptFeedback(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-subtle focus:border-gold-500 focus:outline-none text-ink-primary resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-subtle">
              <button
                type="button"
                onClick={() => setActiveAcceptMeeting(null)}
                className="px-3 py-1.5 text-xs text-ink-secondary hover:text-ink-primary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAccept}
                className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm Meeting</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reschedule Modal */}
      {activeRescheduleMeeting && (
        <Modal
          isOpen={!!activeRescheduleMeeting}
          onClose={() => setActiveRescheduleMeeting(null)}
          title={`Reschedule Meeting #${activeRescheduleMeeting.meetingNo}`}
          subtitle={`Propose alternative consultation slot to ${activeRescheduleMeeting.investorName}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                  Proposed Date
                </label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={e => setRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-subtle focus:border-gold-500 focus:outline-none text-ink-primary font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                  Proposed Time Slot
                </label>
                <select
                  value={rescheduleSlot}
                  onChange={e => setRescheduleSlot(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-subtle focus:border-gold-500 focus:outline-none text-ink-primary font-mono"
                >
                  {TIME_SLOTS.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                Reason / Note to Client
              </label>
              <textarea
                rows={2}
                value={rescheduleNote}
                onChange={e => setRescheduleNote(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-subtle focus:border-gold-500 focus:outline-none text-ink-primary resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-subtle">
              <button
                type="button"
                onClick={() => setActiveRescheduleMeeting(null)}
                className="px-3 py-1.5 text-xs text-ink-secondary hover:text-ink-primary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReschedule}
                className="px-4 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Reschedule Proposal</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Modal */}
      {activeRejectMeeting && (
        <Modal
          isOpen={!!activeRejectMeeting}
          onClose={() => setActiveRejectMeeting(null)}
          title={`Decline Meeting #${activeRejectMeeting.meetingNo}`}
          subtitle={`State reason for declining session with ${activeRejectMeeting.investorName}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                Decline Explanation
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-subtle focus:border-gold-500 focus:outline-none text-ink-primary resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-subtle">
              <button
                type="button"
                onClick={() => setActiveRejectMeeting(null)}
                className="px-3 py-1.5 text-xs text-ink-secondary hover:text-ink-primary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Confirm Decline</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Record Minutes / Meeting Notes Modal */}
      {activeNotesMeeting && (
        <Modal
          isOpen={!!activeNotesMeeting}
          onClose={() => setActiveNotesMeeting(null)}
          title={`Meeting Minutes — #${activeNotesMeeting.meetingNo}`}
          subtitle={`Record discussion minutes and agreed covenants with ${activeNotesMeeting.investorName}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            {activeNotesMeeting.agreementNo && (
              <div className="p-2.5 rounded-lg bg-surface border border-subtle text-xs flex items-center justify-between">
                <span className="text-slate-400">Associated Mandate:</span>
                <span className="font-semibold text-white font-mono">#{activeNotesMeeting.agreementNo}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-ink-primary mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-gold-500" />
                <span>Official Discussion Minutes & Agreed Action Points</span>
              </label>
              <textarea
                rows={5}
                required
                placeholder="Log discussion points, client questions, agreed yield/tenor updates, and follow-ups. These notes will immediately become visible in the investor's portal under this session and the linked investment dossier..."
                value={editingNotes}
                onChange={e => setEditingNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-subtle focus:border-gold-500 focus:outline-none text-ink-primary placeholder:text-ink-muted leading-relaxed font-sans resize-none"
              />
            </div>

            <div className="p-3 rounded-lg bg-surface/70 border border-white/10 text-xs text-slate-300">
              <span className="text-[10px] text-emerald-400 font-mono block font-semibold mb-0.5">
                AUTOMATED SEBI RECORDING SYNC
              </span>
              <span>
                Saving these minutes marks the meeting as completed and archives the record into the client's verifiable dossier.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-subtle">
              <button
                type="button"
                onClick={() => setActiveNotesMeeting(null)}
                className="px-3 py-1.5 text-xs text-ink-secondary hover:text-ink-primary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-4 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-[#080B12] font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-gold-500/20"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save & Publish Minutes</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

