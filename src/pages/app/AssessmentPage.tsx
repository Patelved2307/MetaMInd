import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useLearning } from '@/features/learning';
import { useAuth } from '@/features/auth';
import { getAvatarPresetByUrl, generateAvatarUrl } from '@/lib/avatarGenerator';
import { Button } from '@/components/ui/Button';
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Check,
  Target,
  Zap,
  Award,
  Lightbulb,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import LoaderGrid from '@/components/ui/loader-grid';

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
    if (assessmentQuestions.length === 0) {
      startAssessment().catch((e) => console.error('Assessment load err:', e));
    }
  }, [assessmentQuestions.length]);

  const currentQuestion = assessmentQuestions[currentIndex];
  const totalQuestions = assessmentQuestions.length || 4;

  const cleanTopic = (activeSession?.topic || 'Core Subject Principles')
    .replace(/[\.\s]+$/, '')
    .trim();

  const cleanQuestionText = currentQuestion?.question
    ? currentQuestion.question.replace(/\.{2,}\?$/, '?')
    : '';

  const handleOptionSelect = (option: string) => {
    if (submittedAnalysis) return;
    setSelectedOption(option);

    // Tactile 3D Flip-Slide Option Selection
    requestAnimationFrame(() => {
      const activeEl = document.querySelector(`[data-option-val="${encodeURIComponent(option)}"]`);
      if (activeEl) {
        const letterEl = activeEl.querySelector('.option-letter-badge');
        if (letterEl) {
          gsap.fromTo(
            letterEl,
            { rotateY: 180, scale: 0.8 },
            { rotateY: 0, scale: 1, duration: 0.4, ease: 'back.out(1.6)' }
          );
        }
        gsap.fromTo(
          activeEl,
          { x: 10, scale: 1.01 },
          { x: 0, scale: 1, duration: 0.35, ease: 'back.out(1.4)' }
        );
      }
    });
  };

  // 3D Card Flip Reveal on submit
  useEffect(() => {
    if (submittedAnalysis) {
      requestAnimationFrame(() => {
        gsap.fromTo(
          '.option-card-row',
          { rotateX: 22, opacity: 0.85 },
          { rotateX: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.3)', stagger: 0.06 }
        );
      });
    }
  }, [submittedAnalysis]);

  const handleAnswerSubmit = async () => {
    if (!currentQuestion || !selectedOption) return;

    try {
      const result = await submitAnswer(currentQuestion.id, selectedOption);
      setSubmittedAnalysis(result);

      if (result.isCorrect) {
        confetti({
          particleCount: 45,
          spread: 55,
          origin: { y: 0.7 },
        });
      }
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-6">
        <LoaderGrid size="1.2em" />
        <p className="text-sm font-medium text-slate-700 animate-pulse">
          {loadingMessage || 'Generating diagnostic questions...'}
        </p>
      </div>
    );
  }

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            Beginner (Foundational)
          </span>
        );
      case 'intermediate':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Zap className="w-3 h-3 text-blue-500" />
            Intermediate (Applied)
          </span>
        );
      case 'advanced':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Award className="w-3 h-3 text-purple-500" />
            Advanced (Edge Cases)
          </span>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 relative selection:bg-indigo-100 text-slate-800 pb-16 pt-2">
      {/* Dynamic Ambient Background Aura */}
      <div
        className="fixed top-12 right-10 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-25 z-0"
        style={{ background: theme.glow }}
      />
      <div className="fixed -bottom-10 left-10 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-15 bg-indigo-500 z-0" />

      {/* GAMIFIED HEADER & STEPPER */}
      <div className="space-y-4 relative z-10 bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-2xs">
              <img
                src="/assets/brand/metamind_icon.png"
                alt="MetaMind"
                className="w-4 h-4 object-contain"
              />
              <span>Diagnostic Assessment</span>
            </div>
            <span className="text-xs text-slate-500 font-medium truncate max-w-xs sm:max-w-sm">
              Topic: <strong className="text-slate-800 font-bold">{cleanTopic}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
              Q{currentIndex + 1} / {totalQuestions}
            </span>
          </div>
        </div>

        {/* Interactive Step Node Track */}
        <div className="flex items-center gap-2 pt-1">
          {Array.from({ length: totalQuestions }).map((_, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <div key={idx} className="flex-1 flex items-center gap-2">
                <div
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      : isCurrent
                      ? 'bg-gradient-to-r from-indigo-500 to-blue-500 ring-2 ring-indigo-200 animate-pulse'
                      : 'bg-slate-200'
                  }`}
                />
                {idx === totalQuestions - 1 && (
                  <Target className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* QUESTION CONTAINER */}
      <AnimatePresence mode="wait">
        {currentQuestion ? (
          <motion.div
            key={currentQuestion.id || currentIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl p-6 sm:p-9 bg-white border border-slate-200/90 shadow-lg shadow-slate-100/80 space-y-6 relative z-10"
          >
            {/* Meta Tags Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  Concept: {currentQuestion.conceptName}
                </span>
              </div>
              <div>{getDifficultyBadge(currentQuestion.difficulty)}</div>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug font-display">
                {cleanQuestionText}
              </h2>
            </div>

            {/* Interactive Options Grid */}
            <div className="space-y-3 pt-1">
              {currentQuestion.options?.map((option, idx) => {
                const isSelected = selectedOption === option;
                const letterKey = String.fromCharCode(65 + idx);

                let cardClasses =
                  'bg-white border-slate-200/90 text-slate-800 hover:border-indigo-300 hover:bg-slate-50/80 hover:shadow-xs';
                let letterClasses =
                  'bg-slate-100 text-slate-600 border-slate-200 group-hover:bg-indigo-50 group-hover:text-indigo-600';

                if (submittedAnalysis) {
                  if (option === currentQuestion.correctAnswer) {
                    cardClasses =
                      'bg-emerald-50/90 border-emerald-500 text-emerald-950 font-semibold shadow-xs ring-1 ring-emerald-400/50';
                    letterClasses = 'bg-emerald-500 text-white border-emerald-600';
                  } else if (isSelected && !submittedAnalysis.isCorrect) {
                    cardClasses =
                      'bg-rose-50/80 border-rose-400 text-rose-950 font-medium ring-1 ring-rose-300/40';
                    letterClasses = 'bg-rose-500 text-white border-rose-600';
                  } else {
                    cardClasses = 'bg-slate-50/50 border-slate-200/60 text-slate-400 opacity-60';
                    letterClasses = 'bg-slate-100 text-slate-400 border-slate-200';
                  }
                } else if (isSelected) {
                  cardClasses =
                    'bg-indigo-50/80 border-indigo-500 text-indigo-950 font-semibold shadow-sm ring-2 ring-indigo-500/20';
                  letterClasses = 'bg-indigo-600 text-white border-indigo-600 shadow-xs';
                }

                return (
                  <motion.button
                    key={idx}
                    type="button"
                    data-option-val={encodeURIComponent(option)}
                    whileHover={{ scale: submittedAnalysis ? 1 : 1.01 }}
                    whileTap={{ scale: submittedAnalysis ? 1 : 0.99 }}
                    onClick={() => handleOptionSelect(option)}
                    disabled={!!submittedAnalysis}
                    className={`option-card-row w-full p-4 sm:p-4.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer group ${cardClasses}`}
                  >
                    <div className="flex items-center gap-3.5 pr-2">
                      <span
                        className={`option-letter-badge w-7 h-7 rounded-xl border flex items-center justify-center text-xs font-mono font-bold transition-colors shrink-0 ${letterClasses}`}
                      >
                        {letterKey}
                      </span>
                      <span className="text-xs sm:text-sm font-medium leading-relaxed font-sans">
                        {option}
                      </span>
                    </div>

                    {/* Status Icons */}
                    <div className="shrink-0 pl-2">
                      {submittedAnalysis && option === currentQuestion.correctAnswer && (
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                      )}
                      {submittedAnalysis && isSelected && !submittedAnalysis.isCorrect && (
                        <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center">
                          <XCircle className="w-4 h-4 text-rose-600" />
                        </div>
                      )}
                      {!submittedAnalysis && isSelected && (
                        <div className="w-2 h-2 rounded-full bg-indigo-600 ring-4 ring-indigo-200" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* CONCEPT INSIGHT & ANALYSIS BREAKDOWN */}
            <AnimatePresence>
              {submittedAnalysis && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-5 rounded-2xl border space-y-2.5 text-xs transition-all ${
                    submittedAnalysis.isCorrect
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50/80 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span className="flex items-center gap-1.5">
                      {submittedAnalysis.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Demonstrated Concept Mastery</span>
                        </>
                      ) : (
                        <>
                          <Lightbulb className="w-4 h-4 text-amber-600" />
                          <span>Diagnostic Misconception Identified</span>
                        </>
                      )}
                    </span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-white/80 border border-slate-200/60 text-slate-700">
                      Confidence: {submittedAnalysis.confidence}
                    </span>
                  </div>

                  <p className="text-slate-700 leading-relaxed font-sans font-medium text-xs sm:text-sm">
                    {currentQuestion.explanation}
                  </p>

                  {submittedAnalysis.misconception && (
                    <div className="p-3 bg-white/70 rounded-xl border border-rose-200/80 text-rose-800 text-xs font-medium space-y-0.5">
                      <span className="font-bold block text-[11px] uppercase tracking-wider text-rose-700">
                        Targeted Concept Gap:
                      </span>
                      <p>{submittedAnalysis.misconception}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ACTION FOOTER */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-mono">
                {!submittedAnalysis
                  ? 'Select an option and submit to verify comprehension'
                  : 'Diagnostic evaluation recorded'}
              </span>

              <div>
                {!submittedAnalysis ? (
                  <Button
                    variant="primary"
                    onClick={handleAnswerSubmit}
                    disabled={!selectedOption}
                    className="font-bold cursor-pointer border-none shadow-md hover:shadow-lg transition-all text-white px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                    rightIcon={<Check className="w-4 h-4" />}
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleNextQuestion}
                    isLoading={loading}
                    className="font-bold cursor-pointer border-none shadow-md hover:shadow-lg transition-all text-white px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    {currentIndex + 1 < totalQuestions ? 'Next Question' : 'Complete & View Analysis'}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="p-10 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-medium text-slate-700">Preparing diagnostic assessment...</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

