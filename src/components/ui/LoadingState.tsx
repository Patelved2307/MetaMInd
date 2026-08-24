import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading content...',
  className,
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center space-y-3', className)}>
      <Loader2 className={cn('animate-spin text-[#8DD3FF]', iconSizes[size])} />
      {message && <p className="text-xs font-medium text-[#8B94A3] animate-pulse">{message}</p>}
    </div>
  );
};
