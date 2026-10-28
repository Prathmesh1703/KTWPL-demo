import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'emerald' | 'ruby' | 'blue' | 'slate' | 'amber';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const variantStyles = {
    gold: 'bg-gold-500/10 text-gold-500 border-gold-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    ruby: 'bg-ruby-500/10 text-ruby-500 border-ruby-500/20',
    blue: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    slate: 'bg-white/[0.04] text-ink-secondary border-white/[0.06]',
  }[variant];

  const dotColors = {
    gold: 'bg-gold-500',
    emerald: 'bg-emerald-500',
    ruby: 'bg-ruby-500',
    blue: 'bg-sky-400',
    amber: 'bg-amber-500',
    slate: 'bg-ink-muted',
  }[variant];

  const sizeStyles = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-normal rounded-md border ${variantStyles} ${sizeStyles} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors}`} />}
      {children}
    </span>
  );
};
