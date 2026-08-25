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
        <p className="text-sm font-medium text-slate-700 animate-pulse">
          {loadingMessage || 'Generating diagnostic questions...'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 relative selection:bg-blue-100 text-slate-800 pb-12">
      {/* Light Radial Ambient Glow */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-20 z-0"
        style={{ background: theme.glow }}
      />

      {/* Header & Progress */}
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="accent" className="gap-1 shadow-xs">
              <Brain className="w-3.5 h-3.5 text-blue-600" />
              Diagnostic Assessment
            </Badge>
            <span className="text-xs text-slate-500 font-mono">
              Topic: {activeSession?.topic || 'SQL JOINs'}
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700">
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
        <div className="rounded-[2.5rem] p-6 sm:p-10 bg-white border border-slate-200/80 shadow-md space-y-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                Concept: {currentQuestion.conceptName}
              </span>
              <span className="text-xs font-mono font-bold capitalize text-blue-600">
                Difficulty: {currentQuestion.difficulty}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed font-display">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options Grid */}
          <div className="space-y-3 pt-2">
            {currentQuestion.options?.map((option, idx) => {
              const isSelected = selectedOption === option;
              let optionStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-100';

              if (submittedAnalysis) {
                if (option === currentQuestion.correctAnswer) {
                  optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-sm';
                } else if (isSelected && !submittedAnalysis.isCorrect) {
                  optionStyle = 'bg-rose-50 border-rose-400 text-rose-900';
                } else {
                  optionStyle = 'bg-slate-50 border-slate-200 text-slate-400';
                }
              } else if (isSelected) {
                optionStyle = 'bg-blue-50/80 border-2 border-blue-500 text-blue-900 font-bold shadow-sm';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleOptionSelect(option)}
                  disabled={!!submittedAnalysis}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-mono font-bold text-slate-600 shadow-xs">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm font-medium font-sans">{option}</span>
                  </div>

                  {submittedAnalysis && option === currentQuestion.correctAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {submittedAnalysis && isSelected && !submittedAnalysis.isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
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
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-sm">
                <span>{submittedAnalysis.isCorrect ? '✓ Correct Answer!' : '💡 Concept Insight'}</span>
                <span className="font-mono text-[11px]">Confidence: {submittedAnalysis.confidence}</span>
              </div>
              <p className="text-slate-700 leading-relaxed font-sans font-medium">
                {currentQuestion.explanation}
              </p>
              {submittedAnalysis.misconception && (
                <p className="text-rose-600 font-bold pt-1">
                  Insight: {submittedAnalysis.misconception}
                </p>
              )}
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            {!submittedAnalysis ? (
              <Button
                variant="primary"
                onClick={handleAnswerSubmit}
                disabled={!selectedOption}
                className="font-bold cursor-pointer border-none shadow-md hover:scale-105 text-white"
                style={{ backgroundColor: theme.primary }}
                rightIcon={<Check className="w-4 h-4" />}
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleNextQuestion}
                isLoading={loading}
                className="font-bold cursor-pointer border-none shadow-md hover:scale-105 text-white"
                style={{ backgroundColor: theme.primary }}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {currentIndex + 1 < totalQuestions ? 'Next Question' : 'Complete & View Analysis'}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
          <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-medium text-slate-700">Preparing diagnostic assessment...</p>
        </div>
      )}
    </div>
  );
};
