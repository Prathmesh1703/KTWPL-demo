import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Sun, 
  Moon, 
  LogOut 
} from 'lucide-react';

interface NavbarProps {
  onOpenCopilot: () => void;
  onRefreshData?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCopilot }) => {
  const { role, user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();

  return (
    <header className="w-full bg-surface/85 backdrop-blur-xl border-b border-subtle px-4 sm:px-6 lg:px-8 py-3 transition-colors shrink-0 sticky top-0 z-30">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Brand Area */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 rounded-lg bg-elevated border border-subtle flex items-center justify-center shadow-sm shrink-0">
            <span className="text-xs font-bold text-gold-500 font-mono tracking-tighter">KT</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
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

        {/* Right Side: Theme Toggle & User Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-ink-secondary hover:text-ink-primary bg-elevated hover:brightness-105 border border-subtle transition-colors cursor-pointer"
            aria-label="Toggle Theme"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-gold-500" />
            ) : (
              <Moon className="w-4 h-4 text-ink-primary" />
            )}
          </button>

          {/* Profile & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-subtle">
            <div className="w-8 h-8 rounded-lg bg-surface border border-subtle flex items-center justify-center text-xs font-bold text-gold-500 font-mono shadow-sm shrink-0">
              {user.name.replace(/[^a-zA-Z\s]/g, '').trim().split(/\s+/).slice(0, 2).map(n => n[0]).join('').toUpperCase() || 'KT'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-ink-primary leading-tight">
                {user.name.split('(')[0].trim()}
              </div>
              <div className="text-[10px] text-ink-muted font-mono leading-tight">
                {role === 'compliance' ? 'Compliance Head' : role === 'admin' ? 'Operations Lead' : user.clientCode}
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-ink-muted hover:text-ruby-400 transition-colors ml-0.5 rounded-md hover:bg-elevated cursor-pointer"
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
