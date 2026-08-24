import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'accent' | 'secondary-accent' | 'success' | 'warning' | 'error' | 'outline' | 'glass';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-white/10 text-[#F4F5F7] border border-white/10',
      accent: 'bg-[#8DD3FF]/15 text-[#8DD3FF] border border-[#8DD3FF]/30',
      'secondary-accent': 'bg-[#B9A7FF]/15 text-[#B9A7FF] border border-[#B9A7FF]/30',
      success: 'bg-[#7ED6A5]/15 text-[#7ED6A5] border border-[#7ED6A5]/30',
      warning: 'bg-[#F4C56A]/15 text-[#F4C56A] border border-[#F4C56A]/30',
      error: 'bg-[#FF8B8B]/15 text-[#FF8B8B] border border-[#FF8B8B]/30',
      outline: 'bg-transparent text-[#8B94A3] border border-white/15',
      glass: 'liquid-glass text-[#F4F5F7] px-2.5 py-0.5',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors select-none',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Badge.displayName = 'Badge';
