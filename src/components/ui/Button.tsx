import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8DD3FF]/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none rounded-lg';

    const variants = {
      primary: 'bg-[#8DD3FF] text-[#05070A] hover:bg-[#a6deff] active:bg-[#7bc8ff] font-semibold shadow-sm shadow-[#8DD3FF]/10',
      secondary: 'bg-[#111722] text-[#F4F5F7] border border-white/10 hover:bg-[#18202f] hover:border-white/20 active:bg-[#0c111a]',
      outline: 'bg-transparent text-[#F4F5F7] border border-white/15 hover:bg-white/5 active:bg-white/10',
      ghost: 'bg-transparent text-[#8B94A3] hover:text-[#F4F5F7] hover:bg-white/5 active:bg-white/10',
      glass: 'liquid-glass text-[#F4F5F7] hover:bg-white/[0.04] transition-colors',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-5 py-2.5 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
