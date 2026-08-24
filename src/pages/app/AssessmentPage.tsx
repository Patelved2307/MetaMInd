import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '@/features/learning';
import { useAuth } from '@/features/auth';
import { getAvatarPresetByUrl, generateAvatarUrl } from '@/lib/avatarGenerator';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Brain,
  Check,
} from 'lucide-react';

export const AssessmentPage: React.FC = () => {
  const {
    activeSession,
    assessmentQuestions,
    startAssessment,
    submitAnswer,
    completeAssessment,
    loading,
    loadingMessage,
  } = useLearning();

  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const avatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset.theme;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [submittedAnalysis, setSubmittedAnalysis] = useState<any>(null);

  // Initialize questions if missing
  useEffect(() => {
    if (assessmentQuestions.length === 0 && activeSession) {
      startAssessment();
    }
  }, [assessmentQuestions, activeSession, startAssessment]);

  const currentQuestion = assessmentQuestions[currentIndex];
  const totalQuestions = assessmentQuestions.length || 4;

  const handleOptionSelect = (option: string) => {
    if (submittedAnalysis) return;
    setSelectedOption(option);
  };

  const handleAnswerSubmit = async () => {
    if (!currentQuestion || !selectedOption) return;

    try {
      const result = await submitAnswer(currentQuestion.id, selectedOption);
      setSubmittedAnalysis(result);
    } catch {
      // error handled
    }
  };

  const handleNextQuestion = async () => {
    setSubmittedAnalysis(null);
    setSelectedOption('');

    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Finish assessment
      try {
        await completeAssessment();
        navigate('/app/analysis');
      } catch {
        // error handled
      }
    }
  };

  if (loading && assessmentQuestions.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4">
        <Sparkles className="w-8 h-8 animate-spin" style={{ color: theme.primary }} />
        <p className="text-sm font-medium text-white animate-pulse">
          {loadingMessage || 'Generating diagnostic questions...'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 relative selection:bg-white/20">
      {/* Background Sheen */}
      <div
        className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-all opacity-40 z-0"
        style={{ background: theme.glow }}
      />

      {/* Header & Progress */}
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="accent" className="gap-1">
              <Brain className="w-3.5 h-3.5" />
              Diagnostic Assessment
            </Badge>
            <span className="text-xs text-white/50 font-mono">
              Topic: {activeSession?.topic || 'SQL JOINs'}
            </span>
          </div>
          <span className="text-xs font-mono font-medium text-white/70">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>

        <Progress
          value={((currentIndex + 1) / totalQuestions) * 100}
          variant="accent"
          size="sm"
        />
      </div>

      {/* QUESTION CONTAINER */}
      {currentQuestion ? (
        <div className="liquid-glass rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded bg-white/5 text-white/60">
                Concept: {currentQuestion.conceptName}
              </span>
              <span className="text-xs font-mono capitalize text-[#8DD3FF]">
                Difficulty: {currentQuestion.difficulty}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold text-white leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options Grid */}
          <div className="space-y-3 pt-2">
            {currentQuestion.options?.map((option, idx) => {
              const isSelected = selectedOption === option;
              let optionStyle = 'bg-[#05070A] border-white/10 text-white/80 hover:border-white/25 hover:bg-white/[0.03]';

              if (submittedAnalysis) {
                if (option === currentQuestion.correctAnswer) {
                  optionStyle = 'bg-[#7ED6A5]/15 border-[#7ED6A5] text-white font-medium';
                } else if (isSelected && !submittedAnalysis.isCorrect) {
                  optionStyle = 'bg-[#FF8B8B]/15 border-[#FF8B8B] text-white';
                } else {
                  optionStyle = 'bg-[#05070A] border-white/5 text-white/40';
                }
              } else if (isSelected) {
                optionStyle = 'liquid-glass border-2 text-white font-medium shadow-lg';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleOptionSelect(option)}
                  disabled={!!submittedAnalysis}
                  style={{
                    borderColor: isSelected && !submittedAnalysis ? theme.primary : undefined,
                  }}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono text-white/60">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm">{option}</span>
                  </div>

                  {submittedAnalysis && option === currentQuestion.correctAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-[#7ED6A5] shrink-0" />
                  )}
                  {submittedAnalysis && isSelected && !submittedAnalysis.isCorrect && (
                    <XCircle className="w-5 h-5 text-[#FF8B8B] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* ANSWER ANALYSIS BREAKDOWN */}
          {submittedAnalysis && (
            <div
              className={`p-5 rounded-2xl border space-y-2 text-xs transition-all ${
                submittedAnalysis.isCorrect
                  ? 'bg-[#7ED6A5]/10 border-[#7ED6A5]/30 text-[#7ED6A5]'
                  : 'bg-[#F4C56A]/10 border-[#F4C56A]/30 text-[#F4C56A]'
              }`}
            >
              <div className="flex items-center justify-between font-semibold text-sm">
                <span>{submittedAnalysis.isCorrect ? '✓ Correct Answer!' : '💡 Concept Insight'}</span>
                <span className="font-mono text-[11px]">Confidence: {submittedAnalysis.confidence}</span>
              </div>
              <p className="text-white/80 leading-relaxed font-sans">
                {currentQuestion.explanation}
              </p>
              {submittedAnalysis.misconception && (
                <p className="text-[#FF8B8B] font-medium pt-1">
                  Insight: {submittedAnalysis.misconception}
                </p>
              )}
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="flex justify-end pt-4 border-t border-white/10">
            {!submittedAnalysis ? (
              <Button
                variant="primary"
                onClick={handleAnswerSubmit}
                disabled={!selectedOption}
                className="font-semibold cursor-pointer border-none"
                style={{ backgroundColor: theme.primary, color: '#05070A' }}
                rightIcon={<Check className="w-4 h-4" />}
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleNextQuestion}
                isLoading={loading}
                className="font-semibold cursor-pointer border-none"
                style={{ backgroundColor: theme.primary, color: '#05070A' }}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {currentIndex + 1 < totalQuestions ? 'Next Question' : 'Complete & View Analysis'}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl liquid-glass border border-white/10 text-center space-y-4">
          <HelpCircle className="w-8 h-8 text-white/40 mx-auto" />
          <p className="text-sm font-medium text-white">Preparing diagnostic assessment...</p>
        </div>
      )}
    </div>
  );
};
