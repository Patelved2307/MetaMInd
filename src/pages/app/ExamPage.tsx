import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '@/features/learning';
import { useAuth } from '@/features/auth';
import { examService, type ExamDifficulty, type ExamQuestion } from '@/features/exam';
import { getAvatarPresetByUrl, generateAvatarUrl } from '@/lib/avatarGenerator';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
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

export const ExamPage: React.FC = () => {
  const { activeSession } = useLearning();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const avatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset.theme;
  const studentName = profile?.full_name || user?.user_metadata?.full_name || 'Learner';

  const topicName = activeSession?.topic || 'SQL JOINs';
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

  // Difficulty time setup
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
    setExamStarted(true);
  };

  // Countdown timer effect
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
    }, 800);
  };

  const finishExam = (finalCorrect: number, finalLives: number) => {
    setExamFinished(true);

    const total = questions.length || 5;
    const scorePercent = Math.round((finalCorrect / total) * 100);

    const passed = finalLives > 0 && scorePercent >= 80;
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
    <div className="max-w-4xl mx-auto space-y-8 relative selection:bg-white/20">
      {/* Background Sheen */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-all opacity-40 z-0"
        style={{ background: theme.glow }}
      />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" className="gap-1">
              <FileCheck className="w-3.5 h-3.5" />
              Verified Certificate Exam
            </Badge>
            <span className="text-xs text-white/50 font-mono">{subjectName}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-white tracking-tight">
            Official Exam: {topicName}
          </h1>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/app/certificates')}
          className="text-xs liquid-glass text-white border-white/20 shrink-0 cursor-pointer"
          leftIcon={<ShieldCheck className="w-4 h-4 text-[#7ED6A5]" />}
        >
          View My Certificates
        </Button>
      </div>

      {!examStarted ? (
        /* STEP 1: EXAM SETUP & DIFFICULTY SELECTION */
        <div className="liquid-glass rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8 relative z-10">
          <div className="space-y-3 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto shadow-xl">
              <FileCheck className="w-8 h-8" style={{ color: theme.primary }} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-white">Select Exam Difficulty</h2>
            <p className="text-xs sm:text-sm text-white/70">
              Test your topic mastery under timed conditions. Score <span className="text-[#7ED6A5] font-bold">80% or higher</span> to earn your verified certificate!
            </p>
          </div>

          {/* RULES BANNER */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#05070A] border border-white/10 text-center space-y-1">
              <div className="flex items-center justify-center gap-1 text-[#FF8B8B] font-bold text-sm">
                <Heart className="w-4 h-4 fill-current" />
                <span>3 Heart Lives</span>
              </div>
              <p className="text-[11px] text-white/60">1 mistake loses a life! 0 lives = Fail.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#05070A] border border-white/10 text-center space-y-1">
              <div className="flex items-center justify-center gap-1 text-[#8DD3FF] font-bold text-sm">
                <Clock className="w-4 h-4" />
                <span>Countdown Timer</span>
              </div>
              <p className="text-[11px] text-white/60">5m (Easy) • 10m (Med) • 15m (Hard)</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#05070A] border border-white/10 text-center space-y-1">
              <div className="flex items-center justify-center gap-1 text-[#7ED6A5] font-bold text-sm">
                <Trophy className="w-4 h-4" />
                <span>&ge; 80% To Pass</span>
              </div>
              <p className="text-[11px] text-white/60">Earn verified certificate on pass.</p>
            </div>
          </div>

          {/* DIFFICULTY BUTTON CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <button
              type="button"
              onClick={() => handleStartExam('easy')}
              className="p-5 rounded-2xl border border-[#7ED6A5]/30 bg-[#7ED6A5]/10 hover:border-[#7ED6A5] transition-all text-left space-y-2 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#7ED6A5]">EASY</span>
                <Zap className="w-4 h-4 text-[#7ED6A5]" />
              </div>
              <p className="text-xs text-white/80 font-medium">5 Minutes • 5 Questions</p>
              <p className="text-[11px] text-white/60">Fundamental concepts & syntax checks.</p>
            </button>

            <button
              type="button"
              onClick={() => handleStartExam('medium')}
              className="p-5 rounded-2xl border border-[#F4C56A]/30 bg-[#F4C56A]/10 hover:border-[#F4C56A] transition-all text-left space-y-2 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#F4C56A]">MEDIUM</span>
                <Sparkles className="w-4 h-4 text-[#F4C56A]" />
              </div>
              <p className="text-xs text-white/80 font-medium">10 Minutes • 5 Questions</p>
              <p className="text-[11px] text-white/60">Relational logic & null handling scenarios.</p>
            </button>

            <button
              type="button"
              onClick={() => handleStartExam('hard')}
              className="p-5 rounded-2xl border border-[#FF8B8B]/30 bg-[#FF8B8B]/10 hover:border-[#FF8B8B] transition-all text-left space-y-2 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#FF8B8B]">HARD</span>
                <Trophy className="w-4 h-4 text-[#FF8B8B]" />
              </div>
              <p className="text-xs text-white/80 font-medium">15 Minutes • 5 Questions</p>
              <p className="text-[11px] text-white/60">Cartesian products, anti-joins & indexing optimization.</p>
            </button>
          </div>
        </div>
      ) : !examFinished ? (
        /* STEP 2: LIVE TIMED EXAM INTERFACE */
        <div className="liquid-glass rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6 relative z-10">
          {/* LIVE TIMER & HEARTS HEADER */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#05070A] border border-white/10">
            {/* Countdown Timer */}
            <div className="flex items-center gap-2 text-sm font-mono font-bold text-white">
              <Clock className="w-4 h-4 text-[#8DD3FF] animate-pulse" />
              <span>Time Left: {formatTime(timeLeft)}</span>
            </div>

            {/* Lives Counter ❤️❤️❤️ */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((heartNum) => (
                <Heart
                  key={heartNum}
                  className={`w-5 h-5 transition-all ${
                    heartNum <= lives
                      ? 'text-[#FF8B8B] fill-[#FF8B8B] scale-110 drop-shadow-[0_0_8px_rgba(255,139,139,0.5)]'
                      : 'text-white/20'
                  }`}
                />
              ))}
            </div>

            {/* Progress counter */}
            <span className="text-xs font-mono text-white/60">
              Q{currentIndex + 1} of {questions.length}
            </span>
          </div>

          <Progress value={((currentIndex + 1) / questions.length) * 100} variant="accent" size="sm" />

          {/* QUESTION CARD */}
          {currentQuestion && (
            <div className="space-y-6 pt-2">
              <h2 className="text-xl sm:text-2xl font-semibold text-white leading-relaxed">
                {currentQuestion.question}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = userAnswers[currentQuestion.id] === option;
                  const isCorrect = option === currentQuestion.correctAnswer;

                  let style = 'bg-[#05070A] border-white/10 text-white/80 hover:border-white/25 hover:bg-white/[0.03]';

                  if (userAnswers[currentQuestion.id]) {
                    if (isCorrect) style = 'bg-[#7ED6A5]/20 border-[#7ED6A5] text-white font-semibold';
                    else if (isSelected) style = 'bg-[#FF8B8B]/20 border-[#FF8B8B] text-white';
                    else style = 'bg-[#05070A] border-white/5 text-white/40';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={!!userAnswers[currentQuestion.id]}
                      onClick={() => handleSelectAnswer(currentQuestion, option)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${style}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono text-white/60">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-sm">{option}</span>
                      </div>

                      {userAnswers[currentQuestion.id] && isCorrect && <CheckCircle2 className="w-5 h-5 text-[#7ED6A5]" />}
                      {userAnswers[currentQuestion.id] && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-[#FF8B8B]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* STEP 3: EXAM RESULTS SCREEN */
        <div className="liquid-glass rounded-3xl p-8 sm:p-12 border border-white/15 space-y-8 relative z-10 text-center">
          {isPassed ? (
            /* PASSED CELEBRATION (Score >= 80%) */
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-[#7ED6A5]/20 border-2 border-[#7ED6A5] flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                <Trophy className="w-10 h-10 text-[#7ED6A5]" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#7ED6A5]">
                  EXAM PASSED (80%+ ACHIEVED)
                </span>
                <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
                  Congratulations, {studentName}!
                </h2>
                <p className="text-sm text-white/80 leading-relaxed font-sans">
                  You scored <span className="text-[#7ED6A5] font-bold">{Math.round((correctCount / questions.length) * 100)}%</span> on the {difficulty.toUpperCase()} exam! Your verified certificate has been issued.
                </p>
              </div>

              {/* CERTIFICATE VERIFICATION CARD */}
              <div className="p-6 rounded-2xl bg-[#05070A] border border-[#7ED6A5]/30 space-y-3 text-left">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white/60">Verification Code:</span>
                  <span className="text-[#7ED6A5] font-bold">{issuedCode || 'ATH-884920'}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white/60">Certified Topic:</span>
                  <span className="text-white font-semibold">{topicName}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/app/certificates')}
                  className="w-full sm:w-auto font-semibold cursor-pointer shadow-xl px-8 py-3.5 border-none hover:scale-105"
                  style={{ backgroundColor: theme.primary, color: '#05070A' }}
                  rightIcon={<ShieldCheck className="w-5 h-5" />}
                >
                  View & Download Certificate
                </Button>
              </div>
            </div>
          ) : (
            /* FAILED / LIVES LOST SCREEN (< 80% or 0 Lives) */
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-[#FF8B8B]/20 border-2 border-[#FF8B8B] flex items-center justify-center mx-auto shadow-2xl">
                <XCircle className="w-10 h-10 text-[#FF8B8B]" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF8B8B]">
                  NO CERTIFICATE ISSUED (SCORE &lt; 80%)
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif text-white tracking-tight">
                  Keep Practicing, {studentName}!
                </h2>
                <p className="text-sm text-white/80 leading-relaxed font-sans">
                  {lives <= 0
                    ? 'You ran out of Heart Lives (3 mistakes).'
                    : `You scored ${Math.round((correctCount / questions.length) * 100)}%. A minimum of 80% is required to earn a certificate.`}
                </p>
              </div>

              <div className="flex justify-center pt-2">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => handleStartExam(difficulty)}
                  className="font-semibold cursor-pointer liquid-glass text-white border-white/20 hover:bg-white/10"
                  leftIcon={<RotateCcw className="w-5 h-5 text-[#8DD3FF]" />}
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
