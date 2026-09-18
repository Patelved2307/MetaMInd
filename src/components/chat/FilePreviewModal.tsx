import React from 'react';
import type { ChatAttachment } from '@/features/chat/chat.types';
import { X, FileText, Image as ImageIcon, Trash2, HardDrive } from 'lucide-react';

interface FilePreviewModalProps {
  attachment: ChatAttachment | null;
  onClose: () => void;
  onRemove?: (id: string) => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  attachment,
  onClose,
  onRemove,
}) => {
  if (!attachment) return null;

  const isImage = attachment.type.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg)$/i.test(attachment.name);
  const formattedSize = (attachment.size / 1024).toFixed(1) + ' KB';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
              {isImage ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-800 truncate">{attachment.name}</h3>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                <span>{formattedSize}</span>
                <span>•</span>
                <span>{attachment.type || 'Document'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRemove && (
              <button
                type="button"
                onClick={() => {
                  onRemove(attachment.id);
                  onClose();
                }}
                className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                title="Remove attachment"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Close preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 flex items-center justify-center bg-slate-900/5">
          {isImage && attachment.previewUrl ? (
            <div className="relative max-h-[60vh] max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
              <img
                src={attachment.previewUrl}
                alt={attachment.name}
                className="max-h-[55vh] w-auto object-contain rounded-lg mx-auto"
              />
            </div>
          ) : (
            <div className="w-full text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
                <FileText className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="text-sm font-bold text-slate-800">{attachment.name}</h4>
                <p className="text-xs text-slate-500">
                  Document attached to conversation. The AI cognitive engine automatically extracts key
                  coursework objectives, formulas, and syllabus requirements from this file.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono text-slate-600">
                <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                <span>Ready for AI Context Analysis</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
          <span className="text-slate-400">Attached in this discussion</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
