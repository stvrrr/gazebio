'use client';

import React, { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-glass-light mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && <div className="absolute left-3 top-2.5">{icon}</div>}
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-2.5 rounded-lg bg-glass-dark border border-glass-light/20 text-white placeholder-glass-light/50 focus:outline-none focus:border-glow-purple/50 focus:ring-2 focus:ring-glow-purple/20 transition-all duration-300',
              icon && 'pl-10',
              error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-glass-light/50 text-xs mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, helperText, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-glass-light mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg bg-glass-dark border border-glass-light/20 text-white placeholder-glass-light/50 focus:outline-none focus:border-glow-purple/50 focus:ring-2 focus:ring-glow-purple/20 transition-all duration-300 resize-none',
            error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        />
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-glass-light/50 text-xs mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
