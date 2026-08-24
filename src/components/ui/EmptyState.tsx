import React from 'react';
import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Layers className="w-8 h-8 text-[#8B94A3]" />,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-xl bg-[#0B0F14]/50 border border-white/5 border-dashed',
        className
      )}
    >
      <div className="p-3 rounded-full bg-white/5 border border-white/10 mb-3">{icon}</div>
      <h4 className="text-sm font-semibold text-[#F4F5F7]">{title}</h4>
      {description && <p className="mt-1 text-xs text-[#8B94A3] max-w-sm">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
