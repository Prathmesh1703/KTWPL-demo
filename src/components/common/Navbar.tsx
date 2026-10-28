import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { UserRole } from '../../types';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  ChevronDown, 
  LogOut, 
  UserCheck, 
  ShieldAlert, 
  Briefcase 
} from 'lucide-react';

interface NavbarProps {
  onOpenCopilot: () => void;
  onRefreshData?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCopilot }) => {
  const { role, user, switchRole, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roleLabels: Record<UserRole, { label: string; badge: string }> = {
    investor: {
      label: 'Investor Portal',
      badge: 'Client',
    },
    admin: {
      label: 'Back-Office Admin',
      badge: 'Operations',
    },
    compliance: {
      label: 'Compliance Desk',
      badge: 'Surveillance',
    },
  };

  return (
    <header className="w-full bg-surface border-b border-subtle px-5 lg:px-8 py-3 transition-colors shrink-0">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Brand Area */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-elevated border border-subtle flex items-center justify-center shadow-sm">
            <span className="text-xs font-bold text-gold-500 font-mono tracking-tighter">KT</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-ink-primary text-sm sm:text-base">
                KTWPL
              </span>
              <span className="text-ink-muted text-xs font-mono">•</span>
              <span className="text-xs text-ink-secondary font-normal">
                Capital CRM
              </span>
            </div>
            <p className="text-[10px] text-ink-muted hidden sm:block tracking-wide">
              Khosla Tradewise Pvt Ltd • SEBI Reg. INZ00029841
            </p>
          </div>
        </div>

        {/* Center: Understated Settlement Status */}
        <div className="hidden md:flex items-center gap-2 text-xs text-ink-secondary">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[11px] text-ink-muted font-sans">Settlement Escrow:</span>
          <span className="text-[11px] font-mono text-ink-primary font-medium">T+0 Clearing</span>
        </div>

        {/* Right Side: Persona Switcher, Assistant, Theme Toggle, Profile */}
        <div className="flex items-center gap-2.5">
          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs bg-elevated hover:brightness-105 border border-subtle text-ink-secondary hover:text-ink-primary transition-all"
            >
              <span className="text-[10px] font-mono uppercase text-gold-500 font-medium">
                {roleLabels[role].badge}
              </span>
              <span className="font-medium hidden sm:inline text-ink-primary text-xs">
                {roleLabels[role].label}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-ink-muted" />
            </button>

            {roleDropdownOpen && (
              <div 
                className="absolute right-0 mt-1.5 w-60 rounded-xl bg-card border border-subtle shadow-dropdown p-1.5 z-50 animate-in fade-in zoom-in-95"
                onClick={() => setRoleDropdownOpen(false)}
              >
                <div className="px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-ink-muted font-semibold">
                  Switch Active Persona
                </div>

                <button
                  onClick={() => switchRole('investor')}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors text-left ${
                    role === 'investor' ? 'bg-elevated text-gold-500 font-medium' : 'text-ink-secondary hover:text-ink-primary hover:bg-elevated'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-gold-500" />
                  <div>
                    <div className="text-xs">Investor View</div>
                    <div className="text-[10px] text-ink-muted">Arjun Singhania (HNI Client)</div>
                  </div>
                </button>

                <button
                  onClick={() => switchRole('admin')}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors text-left ${
                    role === 'admin' ? 'bg-elevated text-gold-500 font-medium' : 'text-ink-secondary hover:text-ink-primary hover:bg-elevated'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-gold-500" />
                  <div>
                    <div className="text-xs">Back-Office Admin</div>
                    <div className="text-[10px] text-ink-muted">Maker-Checker & Inflows</div>
                  </div>
                </button>

                <button
                  onClick={() => switchRole('compliance')}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors text-left ${
                    role === 'compliance' ? 'bg-elevated text-gold-500 font-medium' : 'text-ink-secondary hover:text-ink-primary hover:bg-elevated'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-gold-500" />
                  <div>
                    <div className="text-xs">Compliance & Risk</div>
                    <div className="text-[10px] text-ink-muted">SEBI Audits & Immutable Logs</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-ink-secondary hover:text-ink-primary bg-elevated hover:brightness-105 border border-subtle transition-colors"
            aria-label="Toggle Theme"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-gold-500" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Profile & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-subtle">
            <div className="w-7 h-7 rounded-lg bg-elevated border border-subtle flex items-center justify-center text-[11px] font-medium text-ink-primary font-mono">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-medium text-ink-primary leading-tight">{user.name}</div>
              <div className="text-[10px] text-ink-muted font-mono leading-tight">{user.clientCode}</div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-ink-muted hover:text-ruby-500 transition-colors ml-0.5 rounded-md hover:bg-elevated"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
