import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  enableTilt?: boolean;
  glow?: 'gold' | 'emerald' | 'none';
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  enableTilt = true,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`institutional-card ${enableTilt ? 'perspective-card' : ''
        } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
