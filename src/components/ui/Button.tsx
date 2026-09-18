import React from 'react';
import { cn } from '@/lib/utils';
import LoaderGrid from '@/components/ui/loader-grid';

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
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none rounded-xl';

    const variants = {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 font-semibold shadow-sm hover:shadow transition-all',
      secondary: 'bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200 active:bg-slate-300 font-medium',
      outline: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100',
      ghost: 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200',
      glass: 'bg-white/80 backdrop-blur-md text-slate-800 border border-slate-200 hover:bg-white',
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
          <LoaderGrid size="0.45em" className="shrink-0 inline-block mr-1" />
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
