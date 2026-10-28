import React from 'react';
import { SEBIKYCMatrix } from './SEBIKYCMatrix';
import { AuditTrailTable } from './AuditTrailTable';
import { RegulatoryChecklist } from './RegulatoryChecklist';
import { KYCRecord, AuditLog } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { ShieldCheck, Lock, History, FileLock } from 'lucide-react';

interface ComplianceDashboardProps {
  kycRecords: KYCRecord[];
  auditLogs: AuditLog[];
  activeSubTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const ComplianceDashboard: React.FC<ComplianceDashboardProps> = ({
  kycRecords,
  auditLogs,
  activeSubTab = 'kyc-matrix',
}) => {
  // 1. DEDICATED AUDIT TRAIL VIEW
  if (activeSubTab === 'audit-trail') {
    return (
      <div className="space-y-6 pb-16">
        <div className="flex items-center justify-between pb-2 border-b border-subtle">
          <div>
            <h2 className="text-xl font-semibold text-ink-primary tracking-tight flex items-center gap-2">
              <History className="w-5 h-5 text-gold-500" />
              Immutable Audit Trail & Cryptographic Event Logs
            </h2>
            <p className="text-xs text-ink-secondary">
              Real-time SHA-256 sealed transaction ledger capturing all admin authorizations, edits, and disbursements.
            </p>
          </div>
        </div>
        <AuditTrailTable logs={auditLogs} />
      </div>
    );
  }

  // 2. DEDICATED REGULATORY DIRECTIVES VIEW
  if (activeSubTab === 'regulatory') {
    return (
      <div className="space-y-6 pb-16">
        <div className="flex items-center justify-between pb-2 border-b border-subtle">
          <div>
            <h2 className="text-xl font-semibold text-ink-primary tracking-tight flex items-center gap-2">
              <FileLock className="w-5 h-5 text-emerald-500" />
              SEBI Statutory Directives & Circular Adherence
            </h2>
            <p className="text-xs text-ink-secondary">
              Real-time verification of escrow account segregation, clearing upstreaming, and TDS 26Q compliance.
            </p>
          </div>
        </div>
        <RegulatoryChecklist />
      </div>
    );
  }

  // DEFAULT: KYC MATRIX & OVERVIEW VIEW
  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <GlassCard className="p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Officer Desk #01
              </span>
              <span className="text-ink-muted font-mono">•</span>
              <span className="font-mono text-ink-muted text-[11px]">
                Continuous Surveillance Matrix Active
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-ink-primary tracking-tight">
              Compliance & Risk Governance Terminal
            </h2>
            <p className="text-xs text-ink-secondary max-w-2xl">
              Surveillance across client onboarding, PAN-Aadhaar linking status, 
              cryptographic audit seals, and regulatory escrow reconciliations.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-lg bg-surface border border-subtle shrink-0 font-mono">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
            <div>
              <div className="text-[10px] text-ink-muted uppercase font-sans">SEBI Audit Rating</div>
              <div className="text-xl font-bold text-emerald-500 tabular-nums">99.8 / 100</div>
              <div className="text-[10px] text-emerald-500 font-sans">Zero Adverse Findings</div>
            </div>
          </div>
        </div>

        {/* 4 Stat Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-5 mt-5 border-t border-subtle">
          <div className="p-3 rounded-lg bg-surface border border-subtle font-mono">
            <div className="text-[10px] text-ink-muted font-sans uppercase">CKYC Verified Clients</div>
            <div className="text-base font-semibold text-ink-primary mt-0.5">100% Active</div>
          </div>

          <div className="p-3 rounded-lg bg-surface border border-subtle font-mono">
            <div className="text-[10px] text-ink-muted font-sans uppercase">Penny-Drop Match Rate</div>
            <div className="text-base font-semibold text-emerald-500 mt-0.5">99.4% Verified</div>
          </div>

          <div className="p-3 rounded-lg bg-surface border border-subtle font-mono">
            <div className="text-[10px] text-ink-muted font-sans uppercase">PEP / Sanction Flags</div>
            <div className="text-base font-semibold text-ink-secondary mt-0.5">1 Under Review</div>
          </div>

          <div className="p-3 rounded-lg bg-surface border border-subtle font-mono">
            <div className="text-[10px] text-ink-muted font-sans uppercase">Ledger Seal Integrity</div>
            <div className="text-base font-semibold text-gold-500 mt-0.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              SHA-256 Valid
            </div>
          </div>
        </div>
      </GlassCard>

      {/* SEBI / KYC Status Matrix */}
      <SEBIKYCMatrix records={kycRecords} />

      {/* Regulatory Circulars Checklist */}
      <RegulatoryChecklist />

      {/* Immutable Audit Trail */}
      <AuditTrailTable logs={auditLogs} />
    </div>
  );
};
