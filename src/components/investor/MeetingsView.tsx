import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Agreement, MeetingRequest } from '../../types';
import { formatDate } from '../../utils/formatters';
import { 
  Calendar, 
  Clock, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Video, 
  ExternalLink, 
  User, 
  MessageSquare,
  ShieldCheck,
  Filter
} from 'lucide-react';

interface MeetingsViewProps {
  meetings: MeetingRequest[];
  agreements: Agreement[];
  onRequestMeetingClick: () => void;
  onSelectAgreement: (agreement: Agreement) => void;
}

export const MeetingsView: React.FC<MeetingsViewProps> = ({
  meetings,
  agreements,
  onRequestMeetingClick,
  onSelectAgreement,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'UPCOMING' | 'PENDING' | 'COMPLETED'>('ALL');

  const filteredMeetings = meetings.filter(m => {
    if (filter === 'UPCOMING') return m.status === 'CONFIRMED' || m.status === 'RESCHEDULED';
    if (filter === 'PENDING') return m.status === 'PENDING_ADMIN';
    if (filter === 'COMPLETED') return m.status === 'COMPLETED';
    return true;
  });

  const upcomingCount = meetings.filter(m => m.status === 'CONFIRMED' || m.status === 'RESCHEDULED').length;
  const pendingCount = meetings.filter(m => m.status === 'PENDING_ADMIN').length;
  const completedCount = meetings.filter(m => m.status === 'COMPLETED').length;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-subtle">
        <div>
          <h2 className="text-xl font-semibold text-ink-primary tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold-500" />
            <span>Institutional Meetings</span>
          </h2>
          <p className="text-xs text-ink-secondary mt-1">
            Schedule strategy consultations with KTWPL Relationship Desk and review verified discussion minutes.
          </p>
        </div>

        <button
          type="button"
          onClick={onRequestMeetingClick}
          className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-[#080B12] font-semibold text-xs flex items-center gap-2 transition-all shadow-lg shadow-gold-500/20 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Request Meeting</span>
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard variant="liquid" enableTilt={false} className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-ink-secondary font-sans block">Confirmed Upcoming</span>
            <span className="text-2xl font-bold text-ink-primary font-mono mt-1 block">{upcomingCount}</span>
            <span className="text-[10px] text-emerald-500 font-mono block mt-0.5">Encrypted video room ready</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
            <Video className="w-5 h-5" />
          </div>
        </GlassCard>

        <GlassCard variant="liquid" enableTilt={false} className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-ink-secondary font-sans block">Pending Admin Review</span>
            <span className="text-2xl font-bold text-ink-primary font-mono mt-1 block">{pendingCount}</span>
            <span className="text-[10px] text-gold-500 font-mono block mt-0.5">Response within 2 hours</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500">
            <Clock className="w-5 h-5" />
          </div>
        </GlassCard>

        <GlassCard variant="liquid" enableTilt={false} className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-ink-secondary font-sans block">Minuted Sessions</span>
            <span className="text-2xl font-bold text-ink-primary font-mono mt-1 block">{completedCount}</span>
            <span className="text-[10px] text-gold-500 font-mono block mt-0.5">Notes linked to mandates</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500">
            <FileText className="w-5 h-5" />
          </div>
        </GlassCard>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-subtle pb-2 text-xs">
        <Filter className="w-3.5 h-3.5 text-ink-muted mr-1" />
        {(['ALL', 'UPCOMING', 'PENDING', 'COMPLETED'] as const).map(tab => {
          const isActive = filter === tab;
          const label = tab === 'ALL' ? 'All Sessions' : tab === 'UPCOMING' ? 'Confirmed Upcoming' : tab === 'PENDING' ? 'Pending Review' : 'Completed';
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                isActive
                  ? 'bg-elevated text-gold-500 font-semibold border border-gold-500/30'
                  : 'text-ink-secondary hover:text-ink-primary hover:bg-elevated/40'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Meeting Cards List */}
      <div className="space-y-4">
        {filteredMeetings.length > 0 ? (
          filteredMeetings.map(mtg => {
            const isCompleted = mtg.status === 'COMPLETED';
            const isConfirmed = mtg.status === 'CONFIRMED';
            const isPending = mtg.status === 'PENDING_ADMIN';
            const isRescheduled = mtg.status === 'RESCHEDULED';
            const isRejected = mtg.status === 'REJECTED';

            const linkedAg = agreements.find(a => a.agreementNo === mtg.agreementNo);

            return (
              <GlassCard
                key={mtg.id}
                variant="liquid"
                enableTilt={false}
                className="p-5 space-y-4"
              >
                {/* Header row: Title, Ref, Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-subtle">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-semibold text-ink-primary tracking-tight">
                        {mtg.title}
                      </span>
                      <span className="text-[10px] text-ink-muted font-mono px-2 py-0.5 rounded bg-surface border border-subtle">
                        #{mtg.meetingNo}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-ink-secondary font-mono">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gold-500" />
                        <span>{formatDate(mtg.requestedDate)}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gold-500" />
                        <span>{mtg.timeSlot}</span>
                      </span>
                      {mtg.adminName && (
                        <span className="flex items-center gap-1.5 text-ink-secondary font-sans">
                          <User className="w-3.5 h-3.5 text-gold-500" />
                          <span>Host: <strong className="text-ink-primary font-medium">{mtg.adminName}</strong></span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    {isCompleted && (
                      <span className="text-[10px] font-semibold font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed & Minuted</span>
                      </span>
                    )}
                    {isConfirmed && (
                      <span className="text-[10px] font-semibold font-mono px-2.5 py-1 rounded bg-sky-500/10 text-sky-500 border border-sky-500/20 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirmed & Scheduled</span>
                      </span>
                    )}
                    {isPending && (
                      <span className="text-[10px] font-semibold font-mono px-2.5 py-1 rounded bg-gold-500/10 text-gold-500 border border-gold-500/20 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pending Admin Confirmation</span>
                      </span>
                    )}
                    {isRescheduled && (
                      <span className="text-[10px] font-semibold font-mono px-2.5 py-1 rounded bg-purple-500/10 text-purple-500 border border-purple-500/20 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Admin Proposed Alternative</span>
                      </span>
                    )}
                    {isRejected && (
                      <span className="text-[10px] font-semibold font-mono px-2.5 py-1 rounded bg-ruby-500/10 text-ruby-500 border border-ruby-500/20 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Declined</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Linked Investment Badge (if specified) */}
                {mtg.agreementNo && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface/80 border border-subtle">
                    <FileText className="w-4 h-4 text-gold-500 shrink-0" />
                    <div className="flex-1 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="text-ink-muted text-[11px] mr-1.5">Linked Investment Mandate:</span>
                        <strong className="text-ink-primary font-mono font-medium">#{mtg.agreementNo}</strong>
                        {linkedAg && (
                          <span className="text-ink-secondary ml-2">
                            ({linkedAg.periodicity === 'MONTHLY' ? 'Senior Monthly' : linkedAg.periodicity === 'QUARTERLY' ? 'Compounding Vault' : 'Fixed'} • {linkedAg.interestRateAnnual}% p.a.)
                          </span>
                        )}
                      </div>
                      {linkedAg && (
                        <button
                          type="button"
                          onClick={() => onSelectAgreement(linkedAg)}
                          className="text-xs text-gold-500 hover:underline flex items-center gap-1 font-mono cursor-pointer"
                        >
                          <span>View Agreement Dossier</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Agenda */}
                {mtg.agenda && (
                  <div className="text-xs text-ink-secondary leading-relaxed">
                    <span className="text-ink-muted text-[11px] block font-medium uppercase font-mono tracking-wider mb-0.5">Discussion Focus</span>
                    <p>{mtg.agenda}</p>
                  </div>
                )}

                {/* Admin Feedback / Reschedule note */}
                {mtg.adminFeedback && (
                  <div className="p-3 rounded-lg bg-elevated/80 border border-subtle text-xs text-ink-secondary space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gold-500 font-semibold block">
                      Admin Desk Feedback
                    </span>
                    <p>{mtg.adminFeedback}</p>
                    {mtg.rescheduledDate && mtg.rescheduledTimeSlot && (
                      <div className="pt-1 text-xs font-mono text-purple-500">
                        Proposed Time: {formatDate(mtg.rescheduledDate)} at {mtg.rescheduledTimeSlot}
                      </div>
                    )}
                  </div>
                )}

                {/* Meeting Notes / Minutes (if logged) */}
                {mtg.meetingNotes && (
                  <div className="p-3.5 rounded-xl bg-surface/90 border border-subtle space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-gold-500 font-semibold flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Meeting Minutes & Agreed Outcomes</span>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>SEBI Compliance Archive</span>
                      </span>
                    </div>
                    <p className="text-xs text-ink-primary leading-relaxed font-sans">
                      {mtg.meetingNotes}
                    </p>
                  </div>
                )}

                {/* Footer Action Links */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-[11px] text-ink-muted font-mono">
                    Requested on {formatDate(mtg.requestedAt)}
                  </span>

                  {isConfirmed && mtg.meetingLink && (
                    <a
                      href={mtg.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-500/20"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Meeting Room</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </GlassCard>
            );
          })
        ) : (
          <GlassCard variant="liquid" enableTilt={false} className="p-12 text-center space-y-3">
            <Calendar className="w-10 h-10 text-gold-500/40 mx-auto" />
            <h3 className="text-sm font-semibold text-ink-primary">No Meetings Found</h3>
            <p className="text-xs text-ink-secondary max-w-md mx-auto">
              You haven't requested any meetings under this filter. Request a meeting to discuss your portfolio yield, compounding terms, or withdrawal planning.
            </p>
            <button
              type="button"
              onClick={onRequestMeetingClick}
              className="mt-2 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-[#080B12] font-semibold text-xs inline-flex items-center gap-1.5 transition-all shadow-lg shadow-gold-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Strategic Meeting</span>
            </button>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

