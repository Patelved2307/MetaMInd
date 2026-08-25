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
    <div className="max-w-3xl mx-auto space-y-8 relative selection:bg-blue-100 text-slate-800">
      {/* Light Radial Ambient Glow */}
      <div
        className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-20 z-0"
        style={{ background: theme.glow }}
      />

      {/* HEADER */}
      <div className="space-y-2 relative z-10">
        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1 shadow-xs">
            <Target className="w-3.5 h-3.5 text-emerald-600" />
            Targeted Reassessment
          </Badge>
          <span className="text-xs text-slate-500 font-mono">Topic: {topicName}</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Let's check how much clearer this is now.
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-sans">
          Targeted practice specifically designed around your weak concepts and recent insights.
        </p>
      </div>

      {practiceStep === 'practice' ? (
        /* PRACTICE QUESTION CONTAINER */
        <div className="rounded-3xl p-6 sm:p-10 bg-white border border-slate-200/80 shadow-md space-y-6 relative z-10">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Target Concept: {practiceQuestion.conceptName}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed pt-3 font-display">
              {practiceQuestion.question}
            </h2>
          </div>

          <div className="space-y-3 pt-2">
            {practiceQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              let style = 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-100';

              if (isSelected) {
                style = 'bg-blue-50/80 border-2 border-blue-500 text-blue-900 font-semibold shadow-sm';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAnswer(option)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${style}`}
                >
                  <span className="text-sm font-sans">{option}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button
              variant="primary"
              onClick={handlePracticeSubmit}
              disabled={!selectedAnswer}
              isLoading={loading}
              className="font-bold cursor-pointer border-none shadow-md hover:scale-105 text-white"
              style={{ backgroundColor: theme.primary }}
              rightIcon={<Check className="w-4 h-4" />}
            >
              Submit Practice Answer
            </Button>
          </div>
        </div>
      ) : (
        /* MASTERY IMPROVEMENT RESULTS BANNER */
        <div className="rounded-3xl p-8 sm:p-12 bg-white border border-emerald-200 shadow-md space-y-8 relative z-10 text-center">
          <div className="space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <Trophy className="w-8 h-8 text-emerald-600" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
              Great progress! You've strengthened your understanding of LEFT JOIN.
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              Your targeted practice demonstrates key clarity in unmatched row preservation and NULL field handling.
            </p>
          </div>

          {/* MASTERY SCORE PROMOTION CARD */}
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-left font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-slate-500">Concept Mastery Update</span>
              <span className="text-emerald-700 font-bold">STATUS PROMOTED</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-900 font-sans font-bold">LEFT JOIN</span>
              <span className="text-emerald-700 font-bold">35% → 72%</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Mastery Level</span>
                <span className="text-emerald-700 font-bold">COMPETENT</span>
              </div>
              <Progress value={72} variant="success" size="sm" />
            </div>

            <div className="pt-2 flex items-center gap-1.5 text-slate-600 text-[11px]">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>Streak Updated (+50 XP Earned)</span>
            </div>
          </div>

          {/* RETURN TO DASHBOARD CTA */}
          <div className="pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleReturnToDashboard}
              className="font-bold cursor-pointer shadow-md px-8 py-3.5 border-none hover:scale-105 text-white"
              style={{ backgroundColor: theme.primary }}
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
