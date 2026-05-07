'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
  noBorder?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  children,
  onClick,
  hoverable = false,
  noBorder = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'relative rounded-2xl backdrop-blur-lg bg-glass-dark transition-all duration-300',
        !noBorder && 'border border-glass-light/20',
        hoverable && 'hover:bg-glass-darker hover:border-glass-light/40 hover:shadow-glass cursor-pointer hover:scale-105',
        className
      )}
    >
      {children}
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, change }) => {
  return (
    <Card className="p-6 animate-fade-in-up">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-glass-light/70 text-sm font-medium mb-2">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {change && (
            <p className={cn(
              'text-xs font-medium mt-2',
              change.startsWith('+') ? 'text-green-400' : 'text-red-400'
            )}>
              {change}
            </p>
          )}
        </div>
        <div className="text-glow-purple text-3xl opacity-60">{icon}</div>
      </div>
    </Card>
  );
};

interface GlassCardProps {
  className?: string;
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        'rounded-2xl backdrop-blur-xl bg-glass-dark/50 border border-glass-light/20 shadow-glass transition-all duration-300',
        className
      )}
    >
      {children}
    </div>
  );
};
