import React, { useState, useEffect } from 'react';
import type { ChatSession } from '@/features/chat/chat.types';
import { chatService } from '@/features/chat/chat.service';
import {
  X,
  Share2,
  Copy,
  Check,
  Globe,
  MessageSquare,
  Send,
  Mail,
  ExternalLink,
  Users,
} from 'lucide-react';

interface ShareChatModalProps {
  session: ChatSession | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareChatModal: React.FC<ShareChatModalProps> = ({
  session,
  isOpen,
  onClose,
}) => {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (session && isOpen) {
      const { shareUrl: generatedUrl } = chatService.saveSharedChat(session);
      setShareUrl(generatedUrl);
      setCopied(false);
    }
  }, [session, isOpen]);

  if (!isOpen || !session) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out this academic study discussion on MetaMind: "${session.title}"\n${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      `Studying "${session.title}" with MetaMind AI Cognitive Tutor:\n${shareUrl}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Study Discussion: ${session.title}`);
    const body = encodeURIComponent(
      `Hi,\n\nI wanted to share this study discussion with you on MetaMind:\n"${session.title}"\n\nYou can view the full discussion and continue asking questions here:\n${shareUrl}\n\nHappy studying!`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shadow-2xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Share Discussion with Friends</span>
              </h3>
              <p className="text-xs text-slate-500">
                Generate a link so classmates can view and continue this discussion.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Discussion Preview Pill */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="min-w-0 pr-3">
              <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                Discussion Title
              </div>
              <div className="text-xs font-bold text-slate-800 truncate">
                {session.title || 'Academic Discussion'}
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg shrink-0">
              <MessageSquare className="w-3 h-3" />
              <span>{session.messages.length} messages</span>
            </div>
          </div>

          {/* Share Link Input + Copy Button */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Permanent Shareable Link</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 outline-none select-all"
              />
              <button
                type="button"
                onClick={handleCopy}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Social Quick Share Grid */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-500">
              Direct Sharing Options
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs hover:border-slate-300"
              >
                <Send className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleShareTwitter}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs hover:border-slate-300"
              >
                <ExternalLink className="w-3.5 h-3.5 text-sky-500" />
                <span>Twitter / X</span>
              </button>

              <button
                type="button"
                onClick={handleShareEmail}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs hover:border-slate-300"
              >
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>Email</span>
              </button>
            </div>
          </div>

          {/* Collaborative Continuation Guarantee */}
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
            <Users className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              <strong>Full Continuation Enabled</strong>: Anyone who opens this link can read the entire discussion and click <em>"Continue this Discussion"</em> to fork it into their own workspace and continue asking questions!
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
