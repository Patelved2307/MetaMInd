import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Dialog } from './Dialog';
import { Button } from './Button';
import { Award, Sparkles, Trophy, ArrowRight, Share2 } from 'lucide-react';

interface BadgeCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  badgeName?: string;
  badgeDescription?: string;
  badgeIcon?: string;
  xpEarned?: number;
  userName?: string;
  onViewCertificates?: () => void;
}

export const BadgeCelebrationModal: React.FC<BadgeCelebrationModalProps> = ({
  isOpen,
  onClose,
  badgeName = 'Mastery Pioneer',
  badgeDescription = 'Demonstrated outstanding subject mastery and passed verified assessment benchmarks.',
  badgeIcon = '🏆',
  xpEarned = 150,
  userName = 'Learner',
  onViewCertificates,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    // Trigger colorful confetti burst
    const end = Date.now() + 1500;
    const colors = ['#353B97', '#F15A24', '#FFB800', '#5CE1E6', '#10B981'];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title=""
      className="max-w-md text-center p-0 overflow-hidden border border-amber-200/60 shadow-2xl"
    >
      <div className="relative p-6 sm:p-8 space-y-6 bg-gradient-to-b from-amber-50/60 via-white to-white">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Badge Icon */}
        <div className="relative mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-indigo-600 p-[3px] shadow-xl animate-bounce duration-1000">
          <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center text-4xl">
            {badgeIcon}
          </div>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-indigo-900 text-white font-mono text-[10px] font-bold tracking-wider shadow-sm uppercase">
            UNLOCKED
          </span>
        </div>

        {/* Milestone Text */}
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Achievement Unlocked!</span>
          </div>

          <h2 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
            Congratulations, {userName}!
          </h2>

          <h3 className="text-lg font-bold text-indigo-900">{badgeName}</h3>

          <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
            {badgeDescription}
          </p>
        </div>

        {/* XP & Rewards Banner */}
        <div className="flex items-center justify-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <Trophy className="w-4 h-4" />
            <span>+{xpEarned} XP</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300" />
          <div className="flex items-center gap-1.5 text-indigo-700 font-bold">
            <Award className="w-4 h-4" />
            <span>Verified Badge</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          {onViewCertificates && (
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                onClose();
                onViewCertificates();
              }}
              className="w-full font-bold shadow-md text-white cursor-pointer bg-[#353B97] hover:bg-[#2b308a]"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View Official Certificate
            </Button>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                navigator.clipboard.writeText(
                  `I just unlocked the ${badgeName} badge on MetaMind AI! 🏆 https://metamind.app`
                );
                alert('Achievement link copied to clipboard!');
              }}
              className="flex-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer"
              leftIcon={<Share2 className="w-3.5 h-3.5" />}
            >
              Share Badge
            </Button>

            <Button
              variant="ghost"
              size="md"
              onClick={onClose}
              className="flex-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
