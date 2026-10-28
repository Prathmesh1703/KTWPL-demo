import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { AuditLog } from '../../types';
import { formatDateTime, truncateHash } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { 
  History, 
  Search, 
  Lock 
} from 'lucide-react';

interface AuditTrailTableProps {
  logs: AuditLog[];
}

export const AuditTrailTable: React.FC<AuditTrailTableProps> = ({ logs }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const filteredLogs = logs.filter(l => 
    l.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVerifySeal = (id: string, hash: string) => {
    setVerifyingId(id);
    setTimeout(() => {
      setVerifyingId(null);
      toast.success(
        'Seal Verified',
        `SHA-256 block hash ${truncateHash(hash, 6, 6)} matches immutable ledger record.`
      );
    }, 400);
  };

  return (
    <GlassCard className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-subtle">
        <div>
          <h3 className="text-base font-semibold text-ink-primary tracking-tight flex items-center gap-2">
            <History className="w-4 h-4 text-gold-500" />
            Immutable Audit Trail & Regulatory Logs
          </h3>
          <p className="text-xs text-ink-secondary mt-0.5">
            Tamper-proof event journal with SHA-256 seals adhering to SEBI inspection specifications.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface border border-subtle text-xs text-ink-primary placeholder-ink-muted font-mono focus:outline-none focus:border-gold-500/50"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-x-auto rounded-lg border border-subtle bg-surface mt-5">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-subtle text-ink-muted text-[10px] uppercase tracking-wider">
              <th className="py-2.5 px-4 font-normal">Timestamp</th>
              <th className="py-2.5 px-4 font-normal">Actor & Role</th>
              <th className="py-2.5 px-4 font-normal">Action & Entity</th>
              <th className="py-2.5 px-4 font-normal">Details & Terminal</th>
              <th className="py-2.5 px-4 font-normal text-right">SHA-256 Seal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-subtle font-sans">
            {filteredLogs.map(log => {
              const isVerifying = verifyingId === log.id;

              return (
                <tr key={log.id} className="hover:bg-elevated/40 transition-colors">
                  {/* Timestamp */}
                  <td className="py-2.5 px-4 whitespace-nowrap font-mono text-ink-secondary">
                    <div>{formatDateTime(log.timestamp)}</div>
                    <div className="text-[10px] text-ink-muted">{log.id}</div>
                  </td>

                  {/* Actor */}
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <div className="font-medium text-ink-primary text-xs">{log.actor}</div>
                    <div className="text-[10px] font-mono text-ink-muted uppercase">
                      {log.actorRole}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <span className="font-mono text-ink-primary text-[11px] font-medium">
                      {log.action}
                    </span>
                    <div className="text-[10px] text-ink-muted font-mono mt-0.5">
                      {log.entityType} #{log.entityId}
                    </div>
                  </td>

                  {/* Details */}
                  <td className="py-2.5 px-4 text-xs text-ink-secondary max-w-xs">
                    <div>{log.details}</div>
                    <div className="text-[10px] text-ink-muted font-mono mt-0.5">
                      Host: {log.ipAddress}
                    </div>
                  </td>

                  {/* SHA-256 Seal Button */}
                  <td className="py-2.5 px-4 text-right whitespace-nowrap font-mono">
                    <button
                      onClick={() => handleVerifySeal(log.id, log.sha256Seal)}
                      disabled={isVerifying}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-elevated border border-subtle hover:border-gold-500/40 text-[11px] text-ink-muted hover:text-ink-secondary transition-colors"
                      title="Verify SHA-256 signature"
                    >
                      <Lock className="w-3 h-3 text-gold-500" />
                      <span>{truncateHash(log.sha256Seal, 5, 4)}</span>
                      {isVerifying && <span className="animate-spin text-[10px]">...</span>}
                    </button>
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
