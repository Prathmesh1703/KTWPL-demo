import React from 'react';
import { liveMarketTicker } from '../../data/mockData';

export const LiveTicker: React.FC = () => {
  return (
    <div className="w-full bg-surface border-b border-subtle py-1 px-4 overflow-hidden relative select-none shrink-0 transition-colors">
      <div className="flex items-center text-[11px]">
        {/* Subtle Static Label */}
        <div className="flex items-center gap-1.5 text-ink-muted mr-4 shrink-0 font-mono text-[10px] uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>INSTITUTIONAL TICK</span>
        </div>

        {/* Ticker marquee */}
        <div className="flex whitespace-nowrap overflow-hidden relative w-full">
          <div className="flex animate-ticker gap-7 items-center">
            {[...liveMarketTicker, ...liveMarketTicker].map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-ink-secondary">
                <span className="text-ink-muted text-[10px] font-sans">{item.symbol}</span>
                <span className="font-mono text-ink-primary font-medium">{item.value}</span>
                <span
                  className={`font-mono text-[10px] ${item.isPositive ? 'text-emerald-500' : 'text-ruby-500'
                    }`}
                >
                  {item.change}
                </span>
                <span className="text-ink-muted/30 ml-2">/</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
