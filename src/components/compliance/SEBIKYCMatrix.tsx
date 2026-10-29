import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { KYCRecord } from '../../types';
import { formatDate } from '../../utils/formatters';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Search 
} from 'lucide-react';

interface SEBIKYCMatrixProps {
  records: KYCRecord[];
}

export const SEBIKYCMatrix: React.FC<SEBIKYCMatrixProps> = ({ records }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');

  const filteredRecords = records.filter(r => {
    const matchesSearch = 
      r.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.clientPan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.ckycNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = riskFilter === 'ALL' || r.riskCategory === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <GlassCard variant="liquid" enableTilt={false} className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-subtle">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 font-sans">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            CKYC & Verification Matrix
          </h3>
          <p className="text-xs text-slate-300 mt-0.5 font-sans">
            Automated verification against Central KYC registry, UIDAI PAN-Aadhaar links, and NPCI penny-drop.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-44">
            <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter investor..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface border border-subtle text-xs text-ink-primary placeholder-ink-muted font-mono focus:outline-none focus:border-gold-500/50"
            />
          </div>

          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-surface border border-subtle text-xs text-ink-secondary focus:outline-none focus:border-gold-500/50"
          >
            <option value="ALL">All Risk Tiers</option>
            <option value="LOW_RISK">Low Risk</option>
            <option value="MEDIUM_RISK">Medium Risk</option>
            <option value="HIGH_RISK_PEP">High Risk PEP</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-subtle bg-surface mt-5">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-subtle text-ink-muted text-[10px] uppercase tracking-wider">
              <th className="py-2.5 px-4 font-normal">Client Name & PAN</th>
              <th className="py-2.5 px-4 font-normal">CKYC Identifier</th>
              <th className="py-2.5 px-4 font-normal text-center">PAN-Aadhaar</th>
              <th className="py-2.5 px-4 font-normal text-center">Penny-Drop Status</th>
              <th className="py-2.5 px-4 font-normal text-center">Risk Tier</th>
              <th className="py-2.5 px-4 font-normal text-right">Compliance Flag</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-subtle font-sans">
            {filteredRecords.map(rec => {
              const isClear = rec.complianceFlag === 'CLEAR';

              return (
                <tr key={rec.id} className="hover:bg-elevated/40 transition-colors">
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <div className="font-medium text-ink-primary text-xs">{rec.clientName}</div>
                    <div className="text-[10px] text-ink-muted font-mono">{rec.clientPan}</div>
                  </td>

                  <td className="py-2.5 px-4 whitespace-nowrap font-mono text-ink-secondary">
                    <div>{rec.ckycNumber}</div>
                    <div className="text-[10px] text-ink-muted">{formatDate(rec.lastVerifiedAt)}</div>
                  </td>

                  <td className="py-2.5 px-4 text-center whitespace-nowrap">
                    {rec.panAadhaarLinked ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Linked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-ruby-500 font-mono">
                        <X className="w-3.5 h-3.5" />
                        Unlinked
                      </span>
                    )}
                  </td>

                  <td className="py-2.5 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${
                        rec.pennyDropStatus === 'SUCCESS'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : 'bg-gold-500/10 text-gold-500 border-gold-500/20'
                      }`}
                    >
                      {rec.pennyDropStatus === 'SUCCESS' ? '₹1 NPCI MATCH' : 'PENDING'}
                    </span>
                  </td>

                  <td className="py-2.5 px-4 text-center whitespace-nowrap">
                    <span className="text-[10px] font-mono text-ink-secondary">
                      {rec.riskCategory.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-2.5 px-4 text-right whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-mono ${
                        isClear ? 'text-emerald-500' : 'text-gold-500'
                      }`}
                    >
                      {isClear ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>CLEAR</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>UNDER REVIEW</span>
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};
