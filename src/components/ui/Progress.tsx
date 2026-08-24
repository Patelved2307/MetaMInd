import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // 0 to 100
  max?: number;
  variant?: 'accent' | 'purple' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      variant = 'accent',
      showPercentage = false,
      size = 'md',
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

    const variantStyles = {
      accent: 'bg-[#8DD3FF]',
      purple: 'bg-[#B9A7FF]',
      success: 'bg-[#7ED6A5]',
      warning: 'bg-[#F4C56A]',
      error: 'bg-[#FF8B8B]',
    };

    const heights = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    };

    return (
      <div className="w-full space-y-1">
        {showPercentage && (
          <div className="flex justify-between text-xs text-[#8B94A3]">
            <span>Progress</span>
            <span className="font-medium text-[#F4F5F7]">{Math.round(percentage)}%</span>
          </div>
        )}
        <div
          ref={ref}
          className={cn('w-full bg-[#111722] rounded-full overflow-hidden border border-white/5', heights[size], className)}
          {...props}
        >
          <div
            className={cn('h-full transition-all duration-300 ease-out rounded-full', variantStyles[variant])}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);
Progress.displayName = 'Progress';
