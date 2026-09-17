import React from 'react';
import LoaderGrid from '@/components/ui/loader-grid';
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
  const loaderSizes = {
    sm: '0.65em',
    md: '1em',
    lg: '1.4em',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center space-y-4', className)}>
      <LoaderGrid size={loaderSizes[size]} />
      {message && <p className="text-xs font-medium text-slate-500 animate-pulse">{message}</p>}
    </div>
  );
};
