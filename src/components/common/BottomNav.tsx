import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { PieChart, Calculator, FileText, ReceiptText, ArrowUpRight, Layers, UserPlus, TrendingUp, ShieldCheck, History, Calendar } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCopilot: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { role } = useAuth();

  const investorItems = [
    { id: 'overview', label: 'Portfolio', icon: PieChart },
    { id: 'simulator', label: 'Wealth', icon: Calculator },
    { id: 'agreements', label: 'Invest', icon: FileText },
    { id: 'ledger', label: 'Ledger', icon: ReceiptText },
    { id: 'withdrawals', label: 'Redeem', icon: ArrowUpRight },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
  ];

  const adminItems = [
    { id: 'maker-checker', label: 'Queue', icon: Layers },
    { id: 'onboarding', label: 'Inflows', icon: UserPlus },
    { id: 'liquidity', label: 'Liquidity', icon: TrendingUp },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
  ];

  const complianceItems = [
    { id: 'kyc-matrix', label: 'KYC', icon: ShieldCheck },
    { id: 'audit-trail', label: 'Audits', icon: History },
  ];

  const items = role === 'investor' ? investorItems : role === 'admin' ? adminItems : complianceItems;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-xl border-t border-subtle px-2 py-1.5 flex items-center justify-around">
      {items.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
              isActive ? 'text-gold-500 font-medium' : 'text-ink-muted hover:text-ink-secondary'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
