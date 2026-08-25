import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '@/features/learning';
import { useAuth } from '@/features/auth';
import { examService, type ExamDifficulty, type ExamQuestion } from '@/features/exam';
import { getAvatarPresetByUrl, generateAvatarUrl } from '@/lib/avatarGenerator';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import {
  FileCheck,
  Heart,
  Clock,
  Trophy,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ExamPage: React.FC = () => {
  const { activeSession } = useLearning();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const avatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset.theme;
  const studentName = profile?.full_name || user?.user_metadata?.full_name || 'Vipin';

  const topicName = activeSession?.topic || 'SQL JOINs & Database Logic';
  const subjectName = activeSession?.subject || 'Database Management Systems';

  const [difficulty, setDifficulty] = useState<ExamDifficulty>('easy');
  const [examStarted, setExamStarted] = useState(false);

  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [lives, setLives] = useState(3); // 3 Hearts ❤️❤️❤️
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [correctCount, setCorrectCount] = useState(0);

  const [timeLeft, setTimeLeft] = useState(300); // seconds
  const [examFinished, setExamFinished] = useState(false);
  const [isPassed, setIsPassed] = useState(false);
  const [issuedCode, setIssuedCode] = useState<string | null>(null);
  const [speedBonusBanner, setSpeedBonusBanner] = useState<string | null>(null);

  // Difficulty setup
  const handleStartExam = (selectedDiff: ExamDifficulty) => {
    setDifficulty(selectedDiff);
    const qList = examService.getExamQuestions(topicName, selectedDiff);
    setQuestions(qList);

    const seconds = selectedDiff === 'easy' ? 300 : selectedDiff === 'medium' ? 600 : 900;
    setTimeLeft(seconds);

    setLives(3);
    setCurrentIndex(0);
    setUserAnswers({});
    setCorrectCount(0);
    setExamFinished(false);
    setIsPassed(false);
    setIssuedCode(null);
    setSpeedBonusBanner(null);
    setExamStarted(true);
  };

  // Timer Countdown Effect
  useEffect(() => {
    if (!examStarted || examFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishExam(correctCount, lives);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, examFinished, correctCount, lives]);

  const handleSelectAnswer = (question: ExamQuestion, option: string) => {
    if (userAnswers[question.id] || examFinished) return;

    const isCorrect = option === question.correctAnswer;
    const updatedAnswers = { ...userAnswers, [question.id]: option };
    setUserAnswers(updatedAnswers);

    let newLives = lives;
    let newCorrect = correctCount;

    if (isCorrect) {
      newCorrect += 1;
      setCorrectCount(newCorrect);

      // SPEED BONUS: +10 Seconds time refill & Heart refill!
      setTimeLeft((prev) => prev + 10);
      newLives = Math.min(3, lives + 1);
      setLives(newLives);

      setSpeedBonusBanner('⚡ Fast Correct Answer! +10s Time Bonus & ❤️ Heart Refilled!');
      setTimeout(() => setSpeedBonusBanner(null), 2500);
    } else {
      newLives = Math.max(0, lives - 1);
      setLives(newLives);
    }

    // Advance or finish
    setTimeout(() => {
      if (newLives <= 0 || currentIndex + 1 >= questions.length) {
        finishExam(newCorrect, newLives);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 900);
  };

  const finishExam = (finalCorrect: number, finalLives: number) => {
    setExamFinished(true);

    const total = questions.length || 5;
    const scorePercent = Math.round((finalCorrect / total) * 100);

    // PASSING CRITERIA: SCORE >= 60%
    const passed = finalLives > 0 && scorePercent >= 60;
    setIsPassed(passed);

    if (passed) {
      const cert = examService.issueCertificate(
        user?.id || 'demo_user',
        studentName,
        topicName,
        subjectName,
        difficulty,
        scorePercent,
        theme.themeName
      );
      if (cert) {
        setIssuedCode(cert.verificationCode);
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative selection:bg-blue-100 text-slate-800">
      {/* Light Radial Ambient Sheen */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-20 z-0"
        style={{ background: theme.glow }}
      />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold font-mono border border-blue-200 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5" /> Verified Certificate Exam
            </span>
            <span className="text-xs text-slate-500 font-mono">{subjectName}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Official Exam: {topicName}
          </h1>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/app/certificates')}
          className="text-xs bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shrink-0 cursor-pointer shadow-sm"
          leftIcon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
        >
          View My Certificates
        </Button>
      </div>

      {!examStarted ? (
        /* STEP 1: EXAM SETUP & DIFFICULTY SELECTION */
        <div className="rounded-3xl p-6 sm:p-10 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md space-y-8 relative z-10">
          <div className="space-y-3 text-center max-w-xl mx-auto">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-sm text-white"
              style={{ backgroundColor: theme.primary }}
            >
              <FileCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">Select Exam Difficulty</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Test your knowledge under gamified timed conditions. Score <span className="text-emerald-600 font-bold">60% or higher</span> to earn your verified certificate with a unique ID!
            </p>
          </div>

          {/* RULES BANNER */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-1">
              <div className="flex items-center justify-center gap-1 text-rose-600 font-bold text-sm">
                <Heart className="w-4 h-4 fill-current" />
                <span>3 Heart Lives ❤️</span>
              </div>
              <p className="text-[11px] text-rose-700">Mistakes reduce 1 life! Correct answers refill hearts.</p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-1">
              <div className="flex items-center justify-center gap-1 text-blue-600 font-bold text-sm">
                <Clock className="w-4 h-4" />
                <span>Speed +10s Refill</span>
              </div>
              <p className="text-[11px] text-blue-700">Fast correct answers add +10s to countdown timer!</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
              <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold text-sm">
                <Trophy className="w-4 h-4" />
                <span>&ge; 60% To Pass</span>
              </div>
              <p className="text-[11px] text-emerald-700">Generates unique ID certificate on pass.</p>
            </div>
          </div>

          {/* DIFFICULTY BUTTON CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <button
              type="button"
              onClick={() => handleStartExam('easy')}
              className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/80 transition-all text-left space-y-2 cursor-pointer group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-emerald-700">EASY</span>
                <Zap className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs text-slate-800 font-medium">5 Minutes • 5 Questions</p>
              <p className="text-[11px] text-slate-500">Fundamental concepts & syntax checks.</p>
            </button>

            <button
              type="button"
              onClick={() => handleStartExam('medium')}
              className="p-5 rounded-2xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/80 transition-all text-left space-y-2 cursor-pointer group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-amber-700">MEDIUM</span>
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-xs text-slate-800 font-medium">10 Minutes • 5 Questions</p>
              <p className="text-[11px] text-slate-500">Relational logic & null handling scenarios.</p>
            </button>

            <button
              type="button"
              onClick={() => handleStartExam('hard')}
              className="p-5 rounded-2xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100/80 transition-all text-left space-y-2 cursor-pointer group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-rose-700">HARD</span>
                <Trophy className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-xs text-slate-800 font-medium">15 Minutes • 5 Questions</p>
              <p className="text-[11px] text-slate-500">Cartesian products & query optimization.</p>
            </button>
          </div>
        </div>
      ) : !examFinished ? (
        /* STEP 2: LIVE TIMED EXAM INTERFACE */
        <div className="rounded-3xl p-6 sm:p-10 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md space-y-6 relative z-10">
          {/* SPEED BONUS POPUP NOTIFICATION */}
          <AnimatePresence>
            {speedBonusBanner && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3 rounded-2xl bg-emerald-500 text-white font-bold text-xs text-center shadow-lg flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 animate-bounce" />
                <span>{speedBonusBanner}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* LIVE TIMER & HEARTS HEADER */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
            {/* Countdown Timer */}
            <div className="flex items-center gap-2 text-sm font-mono font-bold text-slate-900">
              <Clock className="w-4 h-4 text-blue-600 animate-pulse" />
              <span>Time Left: {formatTime(timeLeft)}</span>
            </div>

            {/* Lives Counter ❤️❤️❤️ */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((heartNum) => (
                <Heart
                  key={heartNum}
                  className={`w-5 h-5 transition-all ${
                    heartNum <= lives
                      ? 'text-rose-500 fill-rose-500 scale-110'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>

            {/* Progress Counter */}
            <span className="text-xs font-mono text-slate-500">
              Q{currentIndex + 1} of {questions.length}
            </span>
          </div>

          <Progress value={((currentIndex + 1) / questions.length) * 100} variant="accent" size="sm" />

          {/* QUESTION CARD */}
          {currentQuestion && (
            <div className="space-y-6 pt-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed font-display">
                {currentQuestion.question}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = userAnswers[currentQuestion.id] === option;
                  const isCorrect = option === currentQuestion.correctAnswer;

                  let style = 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50';

                  if (userAnswers[currentQuestion.id]) {
                    if (isCorrect) style = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                    else if (isSelected) style = 'bg-rose-50 border-rose-500 text-rose-950';
                    else style = 'bg-slate-50 border-slate-200 text-slate-400';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={!!userAnswers[currentQuestion.id]}
                      onClick={() => handleSelectAnswer(currentQuestion, option)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer shadow-sm ${style}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-mono font-bold text-slate-600">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-sm">{option}</span>
                      </div>

                      {userAnswers[currentQuestion.id] && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      {userAnswers[currentQuestion.id] && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* STEP 3: EXAM RESULTS SCREEN */
        <div className="rounded-3xl p-8 sm:p-12 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md space-y-8 relative z-10 text-center">
          {isPassed ? (
            /* PASSED CELEBRATION (Score >= 60%) */
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center mx-auto shadow-md animate-bounce">
                <Trophy className="w-10 h-10 text-emerald-600" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-600">
                  EXAM PASSED (PASSED &ge; 60%)
                </span>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
                  Congratulations, {studentName}!
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed font-sans">
                  You scored <span className="text-emerald-600 font-bold">{Math.round((correctCount / questions.length) * 100)}%</span> on the {difficulty.toUpperCase()} exam! Your verified certificate has been issued.
                </p>
              </div>

              {/* CERTIFICATE VERIFICATION CARD */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-emerald-200 space-y-3 text-left">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Unique Verification ID:</span>
                  <span className="text-emerald-700 font-bold">{issuedCode || 'CERT-2026-META-884920'}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Certified Topic:</span>
                  <span className="text-slate-900 font-semibold">{topicName}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/app/certificates')}
                  className="w-full sm:w-auto font-bold cursor-pointer shadow-md px-8 py-3.5 border-none hover:scale-105"
                  style={{ backgroundColor: theme.primary, color: '#FFFFFF' }}
                  rightIcon={<ShieldCheck className="w-5 h-5" />}
                >
                  View & Download Certificate
                </Button>
              </div>
            </div>
          ) : (
            /* FAILED SCREEN (< 60% or 0 Lives) */
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-rose-100 border-2 border-rose-500 flex items-center justify-center mx-auto shadow-md">
                <XCircle className="w-10 h-10 text-rose-600" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-600">
                  NO CERTIFICATE ISSUED (SCORE &lt; 60%)
                </span>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
                  Keep Practicing, {studentName}!
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed font-sans">
                  {lives <= 0
                    ? 'You ran out of Heart Lives (3 mistakes).'
                    : `You scored ${Math.round((correctCount / questions.length) * 100)}%. A minimum score of 60% is required to earn a verified certificate.`}
                </p>
              </div>

              <div className="flex justify-center pt-2">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => handleStartExam(difficulty)}
                  className="font-bold cursor-pointer bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200"
                  leftIcon={<RotateCcw className="w-5 h-5 text-blue-600" />}
                >
                  Retry Exam Now
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
