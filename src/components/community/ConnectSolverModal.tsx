import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Users,
  MessageSquare,
  Sparkles,
  Copy,
  Check,
  Send,
  Coffee,
  ShieldCheck,
  Award,
  ArrowRight,
} from 'lucide-react';
import { GSAPAvatar } from '@/components/ui/GSAPAvatar';
import { Button } from '@/components/ui/Button';

export interface SolverInfo {
  id: string;
  name: string;
  avatarUrl: string;
  role: string;
  badge: string;
  solvedCount: number;
  rating: string;
  discordTag?: string;
  doubtTitle?: string;
}

interface ConnectSolverModalProps {
  isOpen: boolean;
  onClose: () => void;
  solver: SolverInfo | null;
}

export const ConnectSolverModal: React.FC<ConnectSolverModalProps> = ({
  isOpen,
  onClose,
  solver,
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [kudosGiven, setKudosGiven] = useState(false);

  if (!isOpen || !solver) return null;

  const defaultMsg = `Hey ${solver.name.split(' ')[0]}! Thanks for the awesome solution on "${solver.doubtTitle || 'my question'}". Would love to connect and study together!`;

  const handleCopyTag = () => {
    navigator.clipboard.writeText(solver.discordTag || `${solver.name.toLowerCase().replace(/\s+/g, '_')}#4021`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      onClose();
    }, 1800);
  };

  const handleJumpToStudyRoom = () => {
    onClose();
    navigate('/app/study-room');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200/90 text-slate-800 overflow-hidden"
        >
          {/* Top Decorative Ambient Sheen */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-indigo-500/20 via-blue-500/20 to-teal-400/20 rounded-full blur-2xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header & Solver Identity */}
          <div className="flex items-start gap-4 pr-8">
            <div className="relative">
              <GSAPAvatar
                avatarId={solver.avatarUrl}
                size="lg"
                interactive={true}
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full text-xs shadow">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold text-slate-900">{solver.name}</h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Award className="w-3 h-3" />
                  {solver.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{solver.role}</p>

              <div className="flex items-center gap-3 mt-2 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  {solver.solvedCount} Doubts Solved
                </span>
                <span>•</span>
                <span className="text-indigo-600 font-semibold">{solver.rating} Helpful Rating</span>
              </div>
            </div>
          </div>

          <div className="my-5 border-t border-slate-100" />

          {/* Action Pathways */}
          <div className="space-y-4">
            {/* Quick Action 1: Jump to Group Study Room */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-100 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-indigo-950 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-600" />
                  Start Live Group Study Session
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Jump into a focused co-working room with Lo-Fi beats and shared timer.
                </p>
              </div>
              <Button
                onClick={handleJumpToStudyRoom}
                className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3.5 py-2 rounded-xl shadow-sm flex items-center gap-1"
              >
                Join Room
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Quick Action 2: Kudos Award */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-200/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Coffee className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-900">Award Kudos (+25 Solver XP)</p>
                  <p className="text-[11px] text-amber-700">Applaud this solver for their clear breakdown!</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={kudosGiven}
                onClick={() => setKudosGiven(true)}
                className={`text-xs rounded-xl ${kudosGiven ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-white hover:bg-amber-100 text-amber-800 border-amber-300'}`}
              >
                {kudosGiven ? (
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> +25 Sent!
                  </span>
                ) : (
                  'Give Kudos ☕'
                )}
              </Button>
            </div>

            {/* Quick Action 3: Direct Message Form */}
            <form onSubmit={handleSendMessage} className="space-y-2.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                  Send Instant Study Note
                </span>
                <button
                  type="button"
                  onClick={handleCopyTag}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                >
                  {copied ? (
                    <span className="text-emerald-600 flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Copied Tag!
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5">
                      <Copy className="w-3 h-3" /> Copy Campus Tag
                    </span>
                  )}
                </button>
              </label>

              <textarea
                rows={3}
                value={message !== '' ? message : defaultMsg}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a message to your solver..."
                className="w-full text-xs text-slate-800 bg-slate-50/80 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 resize-none transition"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">
                  Connecting helps build campus study squads.
                </span>
                <Button
                  type="submit"
                  disabled={messageSent}
                  className={`text-xs px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 ${
                    messageSent
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                  }`}
                >
                  {messageSent ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send Note
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
