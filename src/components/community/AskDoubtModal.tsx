import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Code, HelpCircle, Coins, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface NewDoubtPayload {
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  codeSnippet?: string;
  bountyXp: number;
}

interface AskDoubtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (doubt: NewDoubtPayload) => void;
}

export const AskDoubtModal: React.FC<AskDoubtModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Algorithms');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [description, setDescription] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState('');
  const [bountyXp, setBountyXp] = useState(50);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onSubmit({
      title: title.trim(),
      category,
      difficulty,
      description: description.trim(),
      codeSnippet: showCode && codeSnippet.trim() ? codeSnippet.trim() : undefined,
      bountyXp,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setCodeSnippet('');
    setShowCode(false);
    setBountyXp(50);
    onClose();
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

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200/90 text-slate-800 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Post a Student Doubt</h3>
                <p className="text-xs text-slate-500">Ask the student committee and award solver XP bounties</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Question Summary / Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How to optimize Dijkstra's algorithm for sparse graphs?"
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
              />
            </div>

            {/* Category & Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject / Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                >
                  <option value="Algorithms">💻 Algorithms & DSA</option>
                  <option value="Web Dev">⚛️ Web & Frontend</option>
                  <option value="AI / ML">🤖 AI & Machine Learning</option>
                  <option value="Mathematics">📐 Mathematics & Stats</option>
                  <option value="Exam Prep">📝 Exam & Test Prep</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty Level</label>
                <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                  {(['Easy', 'Medium', 'Hard'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      className={`py-2 text-center rounded-xl border font-medium transition ${
                        difficulty === lvl
                          ? lvl === 'Easy'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                            : lvl === 'Medium'
                            ? 'bg-amber-50 border-amber-300 text-amber-700'
                            : 'bg-rose-50 border-rose-300 text-rose-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Problem & What You Tried <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what concept you're stuck on, the expected output vs current error, and where you need clarification..."
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 resize-none transition"
              />
            </div>

            {/* Code Block Toggle & Input */}
            <div>
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold hover:text-indigo-800"
              >
                <Code className="w-3.5 h-3.5" />
                {showCode ? 'Remove Code Snippet' : '+ Attach Code Snippet (Optional)'}
              </button>

              {showCode && (
                <div className="mt-2">
                  <textarea
                    rows={4}
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    placeholder="// Paste your code or error logs here..."
                    className="w-full font-mono text-xs text-slate-800 bg-slate-900 text-emerald-400 border border-slate-800 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                  />
                </div>
              )}
            </div>

            {/* Bounty Award Picker */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 font-bold text-amber-950">
                  <Coins className="w-4 h-4 text-amber-600" />
                  Attach Solver Bounty (XP)
                </span>
                <span className="text-xs font-bold text-amber-800 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-300">
                  +{bountyXp} XP Reward
                </span>
              </div>
              <p className="text-[11px] text-amber-700/90 mb-2.5">
                Bounties motivate top campus students to solve your doubt quickly and thoroughly!
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 100, 150].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setBountyXp(amount)}
                    className={`py-1.5 text-xs rounded-xl font-bold transition ${
                      bountyXp === amount
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-100/70'
                    }`}
                  >
                    +{amount} XP
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="text-xs px-4 py-2 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-xs px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-md flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Publish to Committee
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
