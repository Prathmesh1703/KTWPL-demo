import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { CheckCircle2, FileLock } from 'lucide-react';

export const RegulatoryChecklist: React.FC = () => {
  const regulations = [
    {
      title: 'SEBI Segregated Escrow Mandate',
      circular: 'CIR/HO/MIRSD/DOP/CIR/P/2023/141',
      description: '100% of client principal and unallocated funds maintained in segregated commercial escrow accounts.',
      status: 'COMPLIANT',
      lastAudited: 'Today, 09:30 IST',
    },
    {
      title: 'Daily Upstreaming to Clearing Corporation',
      circular: 'SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2023/84',
      description: 'End-of-day bank balance reporting and automated clearing corporation upstreaming protocol.',
      status: 'COMPLIANT',
      lastAudited: 'Yesterday, 18:00 IST',
    },
    {
      title: 'TDS Section 194A Quarterly Filing',
      circular: 'CBDT Form 26Q & 16A TRACES',
      description: 'Quarterly withholding statements filed with Income Tax Department; Form 16A published in vault.',
      status: 'UP TO DATE',
      lastAudited: 'Q2 Filed (Oct 15)',
    },
    {
      title: 'Broker Cyber Security & Resiliency Framework',
      circular: 'SEBI/HO/ITD/ITD_VAPS/P/CIR/2023/187',
      description: 'Hardware Security Modules (HSM) deployment and SOC-2 Type II vulnerability assessment.',
      status: 'VERIFIED',
      lastAudited: 'Oct 2026 Audit A+',
    },
  ];

  return (
    <GlassCard className="p-6">
      <div className="pb-4 mb-4 border-b border-subtle">
        <h3 className="text-base font-semibold text-ink-primary tracking-tight flex items-center gap-2">
          <FileLock className="w-4 h-4 text-emerald-500" />
          Regulatory Compliance Status & SEBI Circular Checklist
        </h3>
        <p className="text-xs text-ink-secondary mt-0.5">
          Real-time statutory adherence monitoring across depository and broking frameworks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {regulations.map((reg, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-lg bg-surface border border-subtle space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-ink-primary">{reg.title}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {reg.status}
              </span>
            </div>

            <div className="text-[10px] font-mono text-gold-500">
              Ref: {reg.circular}
            </div>

            <p className="text-xs text-ink-secondary leading-relaxed font-sans">
              {reg.description}
            </p>

            <div className="pt-2 border-t border-subtle flex items-center justify-between text-[10px] text-ink-muted font-mono">
              <span>Audit: {reg.lastAudited}</span>
              <span className="text-emerald-500">Zero Non-Compliances</span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
