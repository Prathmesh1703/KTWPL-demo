import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  PieChart, 
  Calculator, 
  FileText, 
  ReceiptText, 
  ArrowUpRight, 
  Layers, 
  UserPlus, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  History, 
  FileLock, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  pendingApprovalsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  pendingApprovalsCount = 0,
}) => {
  const { role } = useAuth();

  const investorNav = [
    { id: 'overview', label: 'Portfolio Overview', icon: PieChart },
    { id: 'simulator', label: 'Wealth Simulator', icon: Calculator },
    { id: 'agreements', label: 'Active Vault & Notes', icon: FileText },
    { id: 'ledger', label: 'General Ledger', icon: ReceiptText },
    { id: 'withdrawals', label: 'Redemptions', icon: ArrowUpRight },
  ];

  const adminNav = [
    { id: 'maker-checker', label: 'Authorization Queue', icon: Layers, count: pendingApprovalsCount },
    { id: 'onboarding', label: 'Inflow Intake', icon: UserPlus },
    { id: 'liquidity', label: 'Liquidity Forecast (90D)', icon: TrendingUp },
    { id: 'clients', label: 'Client Mandates', icon: Users },
  ];

  const complianceNav = [
    { id: 'kyc-matrix', label: 'SEBI / KYC Matrix', icon: ShieldCheck },
    { id: 'audit-trail', label: 'Immutable Audit Trail', icon: History },
    { id: 'regulatory', label: 'Regulatory Directives', icon: FileLock },
  ];

  const currentNav = role === 'investor' 
    ? investorNav 
    : role === 'admin' 
    ? adminNav 
    : complianceNav;

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-subtle bg-surface transition-all duration-200 z-30 shrink-0 select-none ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Navigation Links */}
      <div className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-wider text-ink-muted">
            {role === 'investor' ? 'Client Mandate' : role === 'admin' ? 'Operations Desk' : 'Risk & Governance'}
          </div>
        )}

        {currentNav.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors text-left group ${
                isActive
                  ? 'bg-elevated text-gold-500 font-semibold shadow-sm'
                  : 'text-ink-secondary hover:text-ink-primary hover:bg-elevated/60 font-normal'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-gold-500' : 'text-ink-muted group-hover:text-ink-secondary'
                }`}
              />

              {!collapsed && (
                <span className="truncate tracking-normal flex-1">
                  {item.label}
                </span>
              )}

              {!collapsed && (item as any).count !== undefined && (item as any).count > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-ruby-500/10 text-ruby-500 border border-ruby-500/20">
                  {(item as any).count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Divider & Collapse Button */}
      <div className="p-2.5 border-t border-subtle flex items-center justify-between text-ink-muted">
        {!collapsed && (
          <span className="text-[10px] font-mono">
            KTWPL v2.4
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:text-ink-primary hover:bg-elevated transition-colors mx-auto"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>
    </aside>
  );
};
