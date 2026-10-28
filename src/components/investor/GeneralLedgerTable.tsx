import React, { useState, useMemo } from 'react';
import { GlassCard } from '../common/GlassCard';
import { LedgerEntry } from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { 
  ReceiptText, 
  Search, 
  Download, 
  CheckCircle2 
} from 'lucide-react';

interface GeneralLedgerTableProps {
  entries: LedgerEntry[];
}

export const GeneralLedgerTable: React.FC<GeneralLedgerTableProps> = ({ entries }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Filter & Search
  const filteredEntries = useMemo(() => {
    return entries
      .filter(item => {
        const matchesSearch = 
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.agreementNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.referenceDocId.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [entries, searchTerm, typeFilter, sortOrder]);

  const handleExportCSV = () => {
    const headers = ['Date', 'Agreement No', 'Description', 'Type', 'Debit (₹)', 'Credit (₹)', 'Balance (₹)', 'Reference Doc'];
    const rows = filteredEntries.map(e => [
      e.date,
      e.agreementNo,
      `"${e.description}"`,
      e.type,
      e.debit,
      e.credit,
      e.balance,
      e.referenceDocId,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KTWPL_General_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Ledger Exported', `${filteredEntries.length} transactions exported to CSV.`);
  };

  return (
    <GlassCard className="p-6">
      {/* Top Controls Row */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-base font-semibold text-ink-primary tracking-tight flex items-center gap-2">
            <ReceiptText className="w-4 h-4 text-gold-500" />
            General Ledger & Statutory Audit Records
          </h3>
          <p className="text-xs text-ink-secondary mt-0.5">
            Double-entry ledger with Section 194A TDS withholding tracking and clearing reconciliations.
          </p>
        </div>

        {/* Action / Search / Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search reference, note..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface border border-subtle text-xs text-ink-primary placeholder-ink-muted focus:outline-none focus:border-gold-500/50 font-mono"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-surface border border-subtle text-xs text-ink-secondary focus:outline-none focus:border-gold-500/50"
          >
            <option value="ALL">All Types</option>
            <option value="INTEREST_CREDIT">Interest Credits</option>
            <option value="TDS_DEDUCTION">TDS Deductions</option>
            <option value="CAPITAL_INFLOW">Capital Inflows</option>
            <option value="WITHDRAWAL_PAYOUT">Redemptions</option>
          </select>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-elevated hover:brightness-110 border border-subtle text-xs font-medium text-ink-secondary hover:text-ink-primary transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-gold-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto rounded-lg border border-subtle bg-surface">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-subtle text-ink-muted font-mono text-[10px] uppercase tracking-wider">
              <th className="py-2.5 px-4 font-normal">Date & Hash</th>
              <th className="py-2.5 px-4 font-normal">Note</th>
              <th className="py-2.5 px-4 font-normal">Description</th>
              <th className="py-2.5 px-4 font-normal text-right">Debit (Dr)</th>
              <th className="py-2.5 px-4 font-normal text-right">Credit (Cr)</th>
              <th className="py-2.5 px-4 font-normal text-right">Closing Balance</th>
              <th className="py-2.5 px-4 font-normal text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-subtle">
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-ink-muted">
                  No matching ledger transactions found.
                </td>
              </tr>
            ) : (
              filteredEntries.map(entry => {
                const isCredit = entry.credit > 0;
                const isDebit = entry.debit > 0;

                return (
                  <tr key={entry.id} className="hover:bg-elevated/40 transition-colors font-mono">
                    {/* Date */}
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <div className="text-ink-primary font-medium">{formatDate(entry.date)}</div>
                      <div className="text-[10px] text-ink-muted">{entry.txHash}</div>
                    </td>

                    {/* Agreement */}
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <span className="text-[11px] text-gold-500 font-medium">
                        {entry.agreementNo}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="py-2.5 px-4 font-sans text-ink-secondary min-w-[200px]">
                      <div>{entry.description}</div>
                      <div className="text-[10px] text-ink-muted font-mono">
                        Ref: {entry.referenceDocId}
                      </div>
                    </td>

                    {/* Debit */}
                    <td className="py-2.5 px-4 text-right whitespace-nowrap tabular-nums">
                      {isDebit ? (
                        <span className="font-medium text-ruby-500">
                          -{formatINR(entry.debit)}
                        </span>
                      ) : (
                        <span className="text-ink-muted">-</span>
                      )}
                    </td>

                    {/* Credit */}
                    <td className="py-2.5 px-4 text-right whitespace-nowrap tabular-nums">
                      {isCredit ? (
                        <span className="font-medium text-emerald-500">
                          +{formatINR(entry.credit)}
                        </span>
                      ) : (
                        <span className="text-ink-muted">-</span>
                      )}
                    </td>

                    {/* Balance */}
                    <td className="py-2.5 px-4 text-right whitespace-nowrap font-medium text-ink-primary tabular-nums">
                      {formatINR(entry.balance)}
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-500 font-mono">
                        <CheckCircle2 className="w-3 h-3" />
                        Settled
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};
