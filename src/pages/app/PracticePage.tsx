import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '@/features/learning';
import { useAuth } from '@/features/auth';
import { getAvatarPresetByUrl, generateAvatarUrl } from '@/lib/avatarGenerator';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import {
  ArrowRight,
  Trophy,
  Target,
  Check,
  Flame,
} from 'lucide-react';

export const PracticePage: React.FC = () => {
  const { activeSession, completePracticeReassessment, loading } = useLearning();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const avatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset.theme;

  const topicName = activeSession?.topic || 'SQL JOINs';

  const [practiceStep, setPracticeStep] = useState<'practice' | 'results'>('practice');
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  const practiceQuestion = {
    conceptName: 'LEFT JOIN',
    question:
      'A database query runs a LEFT JOIN between `Customers` and `Orders`. If Customer #104 has placed NO orders, what will appear in the order details column?',
    options: [
      'Customer #104 is completely omitted from query output',
      'The order columns display NULL values',
      'The query throws a Syntax Error',
      'It creates dummy order records automatically',
    ],
    correctAnswer: 'The order columns display NULL values',
    explanation:
      'Spot on! LEFT JOIN preserves Customer #104 and outputs NULL for all missing order fields.',
  };

  const handlePracticeSubmit = async () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === practiceQuestion.correctAnswer;
    const updatedScore = isCorrect ? 72 : 50;

    try {
      await completePracticeReassessment('LEFT JOIN', updatedScore);
      setPracticeStep('results');
    } catch {
      // error handled
    }
  };

  const handleReturnToDashboard = () => {
    navigate('/app/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 relative selection:bg-white/20">
      {/* Background Sheen */}
      <div
        className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-all opacity-40 z-0"
        style={{ background: theme.glow }}
      />

      {/* HEADER */}
      <div className="space-y-2 relative z-10">
        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1">
            <Target className="w-3.5 h-3.5" />
            Targeted Reassessment
          </Badge>
          <span className="text-xs text-white/50 font-mono">Topic: {topicName}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-white tracking-tight">
          Let's check how much clearer this is now.
        </h1>
        <p className="text-xs sm:text-sm text-white/70">
          Targeted practice specifically designed around your weak concepts and recent insights.
        </p>
      </div>

      {practiceStep === 'practice' ? (
        /* PRACTICE QUESTION CONTAINER */
        <div className="liquid-glass rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6 relative z-10">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded bg-white/5 text-[#8DD3FF]">
              Target Concept: {practiceQuestion.conceptName}
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-white leading-relaxed pt-2">
              {practiceQuestion.question}
            </h2>
          </div>

          <div className="space-y-3 pt-2">
            {practiceQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              let style = 'bg-[#05070A] border-white/10 text-white/80 hover:border-white/25 hover:bg-white/[0.03]';

              if (isSelected) {
                style = 'liquid-glass border-2 text-white font-medium shadow-lg';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAnswer(option)}
                  style={{ borderColor: isSelected ? theme.primary : undefined }}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${style}`}
                >
                  <span className="text-sm">{option}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10">
            <Button
              variant="primary"
              onClick={handlePracticeSubmit}
              disabled={!selectedAnswer}
              isLoading={loading}
              className="font-semibold cursor-pointer border-none"
              style={{ backgroundColor: theme.primary, color: '#05070A' }}
              rightIcon={<Check className="w-4 h-4" />}
            >
              Submit Practice Answer
            </Button>
          </div>
        </div>
      ) : (
        /* MASTERY IMPROVEMENT RESULTS BANNER */
        <div className="liquid-glass rounded-3xl p-8 sm:p-12 border border-[#7ED6A5]/40 bg-gradient-to-r from-[#0B1A10] via-[#122B1B] to-[#060D08] space-y-8 relative z-10 text-center">
          <div className="space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#7ED6A5]/20 border border-[#7ED6A5]/40 flex items-center justify-center mx-auto shadow-xl">
              <Trophy className="w-8 h-8 text-[#7ED6A5]" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif text-white tracking-tight">
              Great progress! You've strengthened your understanding of LEFT JOIN.
            </h2>

            <p className="text-sm text-white/80 leading-relaxed font-sans">
              Your targeted practice demonstrates key clarity in unmatched row preservation and NULL field handling.
            </p>
          </div>

          {/* MASTERY SCORE PROMOTION CARD */}
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-[#05070A] border border-white/10 space-y-4 text-left font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-white/60">Concept Mastery Update</span>
              <span className="text-[#7ED6A5] font-bold">STATUS PROMOTED</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-white font-sans font-semibold">LEFT JOIN</span>
              <span className="text-[#7ED6A5] font-bold">35% → 72%</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-white/50">
                <span>Mastery Level</span>
                <span className="text-[#7ED6A5]">COMPETENT</span>
              </div>
              <Progress value={72} variant="success" size="sm" />
            </div>

            <div className="pt-2 flex items-center gap-1.5 text-white/60 text-[11px]">
              <Flame className="w-3.5 h-3.5 text-[#FF8B8B]" />
              <span>Streak Updated (+50 XP Earned)</span>
            </div>
          </div>

          {/* RETURN TO DASHBOARD CTA */}
          <div className="pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleReturnToDashboard}
              className="font-semibold cursor-pointer shadow-xl px-8 py-3.5 border-none hover:scale-105"
              style={{ backgroundColor: theme.primary, color: '#05070A' }}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
