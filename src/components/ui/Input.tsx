import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-[#8B94A3]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[#8B94A3] pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full bg-[#0B0F14] text-[#F4F5F7] placeholder-[#8B94A3]/50 border border-white/10 rounded-lg text-sm px-3.5 py-2.5 outline-none transition-all duration-200 focus:border-[#8DD3FF]/50 focus:ring-1 focus:ring-[#8DD3FF]/30 disabled:opacity-50 disabled:cursor-not-allowed',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-[#FF8B8B] focus:border-[#FF8B8B] focus:ring-[#FF8B8B]/30',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-[#8B94A3] flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-[#FF8B8B]">{error}</p>
        ) : hint ? (
          <p className="text-xs text-[#8B94A3]/70">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
