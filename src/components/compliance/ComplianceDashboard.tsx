import React from 'react';
import { SEBIKYCMatrix } from './SEBIKYCMatrix';
import { AuditTrailTable } from './AuditTrailTable';
import { RegulatoryChecklist } from './RegulatoryChecklist';
import { KYCRecord, AuditLog } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { 
  ShieldCheck, 
  Lock, 
  History, 
  FileLock, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck2, 
  Activity, 
  ArrowUpRight 
} from 'lucide-react';

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
  setActiveTab,
}) => {
  // 1. DEDICATED AUDIT TRAIL VIEW
  if (activeSubTab === 'audit-trail') {
    return (
      <div className="space-y-6 pb-16">
        <div className="flex items-center justify-between pb-2 border-b border-subtle">
          <div>
            <h2 className="text-xl font-bold text-ink-primary tracking-tight flex items-center gap-2 font-sans">
              <History className="w-5 h-5 text-gold-500" />
              Audit Trail
            </h2>
            <p className="text-xs text-ink-secondary font-sans">
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
            <h2 className="text-xl font-bold text-ink-primary tracking-tight flex items-center gap-2 font-sans">
              <FileLock className="w-5 h-5 text-emerald-500" />
              Regulatory Directives
            </h2>
            <p className="text-xs text-ink-secondary font-sans">
              Real-time verification of escrow account segregation, clearing upstreaming, and TDS 26Q compliance.
            </p>
          </div>
        </div>
        <RegulatoryChecklist />
      </div>
    );
  }

  // DEFAULT: KYC MATRIX & COMPLIANCE OVERVIEW (NO DUPLICATES, WITH 3D LIQUID GLASS KPIS)
  return (
    <div className="space-y-6 sm:space-y-7 pb-16">
      {/* Top Banner */}
      <GlassCard variant="liquid" enableTilt={false} className="p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Officer Desk #01
              </span>
              <span className="text-ink-muted font-mono">•</span>
              <span className="font-mono text-emerald-500 text-[11px] font-semibold">
                Continuous Surveillance Matrix Active
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-ink-primary tracking-tight font-sans">
              Compliance Desk
            </h2>
            <p className="text-xs text-ink-secondary max-w-2xl font-sans">
              Surveillance across client onboarding, PAN-Aadhaar linking status, 
              cryptographic audit seals, and regulatory escrow reconciliations.
            </p>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-surface/90 border border-subtle shrink-0 font-mono">
            <ShieldCheck className="w-9 h-9 text-emerald-500 shrink-0" />
            <div>
              <div className="text-[10px] text-ink-muted uppercase font-sans font-medium">SEBI Audit Rating</div>
              <div className="text-xl font-bold text-emerald-500 tabular-nums">99.8 / 100</div>
              <div className="text-[10px] text-emerald-500 font-sans font-medium">Zero Adverse Findings</div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* 4 3D Liquid Glass KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1: CKYC & Digilocker Verification */}
        <GlassCard variant="liquid" enableTilt={true} className="p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-ink-secondary font-medium flex items-center gap-1.5 font-sans">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                CKYC Verification
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                100% Active
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-ink-primary font-mono tracking-tight tabular-nums">
              100.0%
            </div>
            <div className="text-[11px] text-ink-secondary font-mono mt-1">
              4/4 Accredited HNIs Onboarded
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-subtle flex items-center justify-between text-[11px] text-ink-muted font-mono">
            <span>Penny-Drop Match</span>
            <span className="text-emerald-500 font-medium">99.4% Verified</span>
          </div>
        </GlassCard>

        {/* KPI 2: AML & PEP Sanction Screening */}
        <GlassCard variant="liquid" enableTilt={true} className="p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-ink-secondary font-medium flex items-center gap-1.5 font-sans">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
                AML & PEP Screening
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gold-500/10 text-gold-500 border border-gold-500/20">
                Low Risk
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-ink-primary font-mono tracking-tight tabular-nums">
              0 <span className="text-xs font-normal text-ink-muted">Critical Flags</span>
            </div>
            <div className="text-[11px] text-ink-secondary font-mono mt-1">
              1 Beneficial Ownership In Review
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-subtle flex items-center justify-between text-[11px] text-ink-muted font-mono">
            <span>Watchlist Status</span>
            <span className="text-emerald-500 font-medium">UN & FATF Clean</span>
          </div>
        </GlassCard>

        {/* KPI 3: Cryptographic Ledger Integrity */}
        <GlassCard variant="liquid" enableTilt={true} className="p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-ink-secondary font-medium flex items-center gap-1.5 font-sans">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                Audit Seal Integrity
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                SHA-256 Valid
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-ink-primary font-mono tracking-tight tabular-nums">
              100.0%
            </div>
            <div className="text-[11px] text-ink-secondary font-mono mt-1">
              148 Immutable Ledger Blocks
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-subtle flex items-center justify-between text-[11px] text-ink-muted font-mono">
            <span>DSC Serial Signatures</span>
            <span className="text-emerald-500 font-medium">eMudhra Validated</span>
          </div>
        </GlassCard>

        {/* KPI 4: Statutory TDS 194A / 26Q Status */}
        <GlassCard variant="liquid" enableTilt={true} className="p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-ink-secondary font-medium flex items-center gap-1.5 font-sans">
                <FileCheck2 className="w-3.5 h-3.5 text-gold-500" />
                Statutory TDS 26Q
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-subtle text-ink-secondary">
                NSDL Auto-Filed
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-ink-primary font-mono tracking-tight tabular-nums">
              ₹1,41,875
            </div>
            <div className="text-[11px] text-ink-secondary font-mono mt-1">
              100% Tax Withheld & Deposited
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-subtle flex items-center justify-between text-[11px] text-ink-muted font-mono">
            <span>Certificates</span>
            <span className="text-gold-500 font-medium">Form 16A Reconciled</span>
          </div>
        </GlassCard>
      </div>

      {/* Compliance Surveillance Matrix Health Bar */}
      <GlassCard variant="liquid" enableTilt={false} className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-subtle">
          <div>
            <h3 className="text-sm font-bold text-ink-primary flex items-center gap-2 font-sans">
              <Activity className="w-4 h-4 text-emerald-500" />
              Real-Time Regulatory Verification Health & SLA Trackers
            </h3>
            <p className="text-xs text-ink-secondary mt-0.5 font-sans">
              Automated surveillance scores across SEBI circulars, KYC validations, and Escrow ring-fencing.
            </p>
          </div>
          <button
            onClick={() => setActiveTab ? setActiveTab('regulatory') : null}
            className="text-xs text-gold-500 hover:underline font-mono flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View All Circulars</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 font-mono">
          <div className="p-3.5 rounded-lg bg-surface/90 border border-subtle">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-sans">SEBI Escrow Segregation</span>
              <span className="text-emerald-400 font-bold">100% PASS</span>
            </div>
            <div className="w-full bg-elevated rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-400 h-1.5 rounded-full w-full" />
            </div>
            <div className="text-[10px] text-slate-400 mt-2 font-sans">
              HDFC Bank Tier-1 Segregated Escrow Account #••••4912
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-surface/90 border border-subtle">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-sans">Bank Penny-Drop Match Speed</span>
              <span className="text-emerald-400 font-bold">1.8s (Real-Time)</span>
            </div>
            <div className="w-full bg-elevated rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-400 h-1.5 rounded-full w-[99%]" />
            </div>
            <div className="text-[10px] text-slate-400 mt-2 font-sans">
              Direct NPCI IMPS API integration with verified Aadhaar PAN
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-surface/90 border border-subtle">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-sans">Cryptographic Chain Verification</span>
              <span className="text-amber-400 font-bold">148 / 148 Blocks</span>
            </div>
            <div className="w-full bg-elevated rounded-full h-1.5 overflow-hidden">
              <div className="bg-amber-400 h-1.5 rounded-full w-full" />
            </div>
            <div className="text-[10px] text-slate-400 mt-2 font-sans">
              Zero hash collisions, eMudhra Class 3 DSC tamper seals
            </div>
          </div>
        </div>
      </GlassCard>

      {/* SEBI / KYC Status Matrix (Hero Table on this view) */}
      <SEBIKYCMatrix records={kycRecords} />
    </div>
  );
};
