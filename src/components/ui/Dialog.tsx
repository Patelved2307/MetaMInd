import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#05070A]/80 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'relative z-10 w-full max-w-lg bg-[#0B0F14] border border-white/10 rounded-xl p-6 shadow-2xl text-[#F4F5F7]',
              className
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                {title && <h2 className="text-lg font-semibold text-[#F4F5F7]">{title}</h2>}
                {description && <p className="mt-1 text-xs text-[#8B94A3]">{description}</p>}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-1.5 h-auto text-[#8B94A3] hover:text-[#F4F5F7]"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="mt-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
