import React, { useState, useEffect } from 'react';
import { WifiOff, X } from 'lucide-react';

export const PWAStatusBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        setShowInstall(false);
      }
      setDeferredPrompt(null);
    });
  };

  if (!isOnline) {
    return (
      <div className="bg-surface border-b border-ruby-500/30 text-ruby-500 text-xs py-1.5 px-4 text-center font-normal flex items-center justify-center gap-2">
        <WifiOff className="w-3.5 h-3.5" />
        <span>Offline Terminal Mode — Cached balances and agreement mandates active.</span>
      </div>
    );
  }

  if (showInstall) {
    return (
      <div className="bg-surface border-b border-subtle text-ink-secondary text-xs py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
          <span>Install KTWPL Capital Terminal PWA for desktop-class performance.</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="px-2.5 py-1 rounded bg-elevated hover:brightness-105 text-gold-500 border border-subtle font-medium text-xs transition-colors"
          >
            Install
          </button>
          <button
            onClick={() => setShowInstall(false)}
            className="p-1 text-ink-muted hover:text-ink-primary"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};
