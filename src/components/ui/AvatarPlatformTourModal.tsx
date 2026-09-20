import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Compass,
  MessageSquare,
  LayoutDashboard,
  Map,
  Dumbbell,
  LineChart,
  GraduationCap,
  Users,
  Award,
  ExternalLink,
} from 'lucide-react';
import { GSAPAvatar } from './GSAPAvatar';
import { getAvatarPresetByUrl, sanitizeAvatarUrl, type AvatarPreset } from '@/lib/avatarGenerator';

export interface TourStep {
  id: string;
  title: string;
  badge: string;
  category: string;
  route: string;
  icon: React.ElementType;
  headline: string;
  speechText: string;
  keyFeatures: { title: string; desc: string; icon: string }[];
  highlightColor: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'chat',
    title: 'AI Chatbot Workspace',
    badge: 'Core Engine',
    category: 'Instant AI Tutor',
    route: '/app/chat',
    icon: MessageSquare,
    headline: 'Your 24/7 Neural Learning Tutor',
    speechText:
      "This is where your magic happens! Ask me any doubt, paste lecture notes or code, and I will explain concepts step-by-step. You can also generate complete 15-Page Study Guide PDFs with one click!",
    keyFeatures: [
      {
        title: 'Adaptive Multi-Turn Chat',
        desc: 'Explains complex topics with tailored analogies, code breakdowns, and quizzes.',
        icon: '💬',
      },
      {
        title: 'Study Guide PDF Generator',
        desc: 'Download clean, printable multi-page study guides with structured chapters.',
        icon: '📄',
      },
      {
        title: 'Document & Code Uploads',
        desc: 'Attach homework slides, textbook chapters, or code snippets for instant review.',
        icon: '📎',
      },
    ],
    highlightColor: '#2563EB',
  },
  {
    id: 'dashboard',
    title: 'Bento Dashboard',
    badge: 'Command Center',
    category: 'Mastery & Habit',
    route: '/app/dashboard',
    icon: LayoutDashboard,
    headline: 'Track Your Daily Streaks & Subject Mastery',
    speechText:
      "Your personalized home screen! Monitor your active learning streak flames, watch your subject mastery bars climb, and use the Quick Ask terminal for lightning-fast lookups.",
    keyFeatures: [
      {
        title: 'Daily Streak Counter',
        desc: 'Keeps you consistent and fires up continuous learning habits.',
        icon: '🔥',
      },
      {
        title: 'Live Subject Mastery Bars',
        desc: 'Visual percentages calculated across databases, algorithms, and web systems.',
        icon: '📊',
      },
      {
        title: 'Quick Concept Search',
        desc: 'Instantly jump straight into AI explanations directly from the search bar.',
        icon: '⚡',
      },
    ],
    highlightColor: '#059669',
  },
  {
    id: 'learning-map',
    title: 'Learn & Learning Map',
    badge: 'Curriculum Tree',
    category: 'Adaptive Roadmap',
    route: '/app/learning-map',
    icon: Map,
    headline: 'Interactive Concept Nodes & Prerequisite Trees',
    speechText:
      "Never wonder 'what should I study next?' Explore structured node maps where each concept unlocks prerequisite branches as you demonstrate understanding.",
    keyFeatures: [
      {
        title: 'Interactive Node Canvas',
        desc: 'Visual concept trees that dynamically show mastered, active, and locked topics.',
        icon: '🗺️',
      },
      {
        title: 'Prerequisite Logic',
        desc: 'Ensures you never get stuck by mastering foundational concepts first.',
        icon: '🔓',
      },
      {
        title: 'Structured Chapter Reader',
        desc: 'Bite-sized reading lessons paired with live AI comprehension checks.',
        icon: '📖',
      },
    ],
    highlightColor: '#0D9488',
  },
  {
    id: 'practice',
    title: 'Practice & Concept Drills',
    badge: 'Active Recall',
    category: 'Skill Building',
    route: '/app/practice',
    icon: Dumbbell,
    headline: 'Spaced Repetition Drills & Code Challenges',
    speechText:
      "Reading isn't enough—practice makes it permanent! Tackle adaptive drills, interactive flashcards, and live coding exercises tailored to your weak points.",
    keyFeatures: [
      {
        title: 'Spaced Repetition Algorithm',
        desc: 'Surfaces tricky concepts right before you are likely to forget them.',
        icon: '🧠',
      },
      {
        title: 'Interactive Code Sandboxes',
        desc: 'Write, debug, and test code live with automated syntax verification.',
        icon: '💻',
      },
      {
        title: 'Instant Hint Engine',
        desc: 'Get progressive Socratic hints without spoiling full solutions.',
        icon: '💡',
      },
    ],
    highlightColor: '#D97706',
  },
  {
    id: 'analysis',
    title: 'Progress & Analytics',
    badge: 'Cognitive Insights',
    category: 'Deep Metrics',
    route: '/app/analysis',
    icon: LineChart,
    headline: 'Deep Retention Curves & Learning Velocity',
    speechText:
      "See how your brain is growing! Check your knowledge retention curves, time spent per concept, and personalized AI tips on where to focus next.",
    keyFeatures: [
      {
        title: 'Retention Curves',
        desc: 'Mathematical Ebbinghaus retention forecasts to keep your memory sharp.',
        icon: '📈',
      },
      {
        title: 'Topic Strength Heatmap',
        desc: 'Color-coded visual matrix showing your rock-solid and vulnerable areas.',
        icon: '🟩',
      },
      {
        title: 'Velocity Tracking',
        desc: 'Measure how fast you absorb new topics week-over-week.',
        icon: '⏱️',
      },
    ],
    highlightColor: '#EA580C',
  },
  {
    id: 'exam',
    title: 'Exams & Mock Assessments',
    badge: 'Exam Simulation',
    category: 'Test Readiness',
    route: '/app/exam',
    icon: GraduationCap,
    headline: 'Timed Proctored Simulations & Instant Rubrics',
    speechText:
      "Prepare for actual semester finals and technical interviews! Take timed mock exams with randomized question banks and receive instant detailed grading rubrics.",
    keyFeatures: [
      {
        title: 'Timed Exam Simulation',
        desc: 'Replicates authentic exam conditions with countdown timers and flags.',
        icon: '⏱️',
      },
      {
        title: 'AI Scoring Rubrics',
        desc: 'Instant point-by-point breakdown with sample high-scoring model answers.',
        icon: '📝',
      },
      {
        title: 'Review Mode',
        desc: 'Deep dive into mistakes with tailored explanations and review notes.',
        icon: '🔍',
      },
    ],
    highlightColor: '#9333EA',
  },
  {
    id: 'committee',
    title: 'Student Committee & Solvers',
    badge: 'Peer Network',
    category: 'Community & Bounties',
    route: '/app/committee',
    icon: Users,
    headline: 'Ask Doubts, Earn XP Bounties & Connect with Solvers',
    speechText:
      "You are never alone! Post tough homework doubts with XP bounties, earn rewards by answering classmates, and connect 1-on-1 with verified peer mentors!",
    keyFeatures: [
      {
        title: 'Peer Bounty System',
        desc: 'Attach XP bounties to your doubts to receive fast, high-quality peer solutions.',
        icon: '💰',
      },
      {
        title: 'Top Solvers Leaderboard',
        desc: 'Climb the global ranks and get recognized as a subject grandmaster.',
        icon: '🥇',
      },
      {
        title: 'Collaborative Study Rooms',
        desc: 'Jump into focused group study rooms with integrated Pomodoro timers.',
        icon: '🎧',
      },
    ],
    highlightColor: '#DB2777',
  },
  {
    id: 'achievements',
    title: 'Badges, Certificates & Profile',
    badge: 'Verified Creds',
    category: 'Identity & Personas',
    route: '/app/profile',
    icon: Award,
    headline: 'Your Animated 3D Persona & Global Theme Engine',
    speechText:
      "Notice how the whole website glows with custom colors? That is because of your avatar persona! You can customize your 3D avatar in Profile anytime, and earn certified badges!",
    keyFeatures: [
      {
        title: 'Dynamic Site Theme Engine',
        desc: 'Changing your avatar persona instantly re-themes the entire platform.',
        icon: '🎨',
      },
      {
        title: 'MetaMind Certified Badges',
        desc: 'Earn verifiable digital credentials as you conquer milestones.',
        icon: '🏆',
      },
      {
        title: 'Official Certificates',
        desc: 'Export high-resolution verified completion certificates for your portfolio.',
        icon: '📜',
      },
    ],
    highlightColor: '#65A30D',
  },
];

interface AvatarPlatformTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  avatarUrl?: string;
  userName?: string;
}

export const AvatarPlatformTourModal: React.FC<AvatarPlatformTourModalProps> = ({
  isOpen,
  onClose,
  avatarUrl = 'green_yeo',
  userName = 'Learner',
}) => {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const cleanAvatarId = sanitizeAvatarUrl(avatarUrl);
  const preset: AvatarPreset = getAvatarPresetByUrl(cleanAvatarId);
  const theme = preset.theme;
  const currentStep = TOUR_STEPS[currentStepIndex];

  // Confetti on final step completion
  const handleFinishTour = () => {
    localStorage.setItem('metamind_platform_tour_seen', 'true');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onClose();
  };

  const handleJumpToPage = (route: string) => {
    localStorage.setItem('metamind_platform_tour_seen', 'true');
    onClose();
    navigate(route);
  };

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleFinishTour();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Soft Ambient Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-4xl bg-white rounded-3xl sm:rounded-[32px] shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col my-auto"
          style={{
            boxShadow: `0 25px 60px -15px ${theme.glow}`,
          }}
        >
          {/* Top Decorative Ambient Sheen matching avatar theme */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ background: theme.primary }}
          />

          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between relative z-10 bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs font-bold"
                style={{ backgroundColor: theme.primary }}
              >
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Welcome to MetaMind, {userName}!</span>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold"
                    style={{
                      backgroundColor: theme.badgeBg,
                      color: theme.badgeText,
                      borderColor: theme.border,
                    }}
                  >
                    Interactive Guide
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Step {currentStepIndex + 1} of {TOUR_STEPS.length} • {currentStep.title}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
              title="Close Guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Step Pill Selector Bar */}
          <div className="px-6 py-2.5 bg-slate-50/80 border-b border-slate-100 overflow-x-auto flex items-center gap-2 no-scrollbar">
            {TOUR_STEPS.map((step, idx) => {
              const isActive = idx === currentStepIndex;
              const StepIcon = step.icon;

              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  style={{
                    backgroundColor: isActive ? currentStep.highlightColor : undefined,
                  }}
                >
                  <StepIcon className="w-3.5 h-3.5" />
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>

          {/* Main Interactive Stage */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Companion Area (Avatar & Dialogue Speech Bubble) */}
            <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4">
              {/* Dynamic Animated Avatar Presentation */}
              <div className="relative group">
                <div
                  className="p-3 rounded-full border-2 transition-all duration-500 shadow-sm"
                  style={{
                    borderColor: currentStep.highlightColor,
                    backgroundColor: `${currentStep.highlightColor}10`,
                  }}
                >
                  <GSAPAvatar
                    avatarId={cleanAvatarId}
                    size="xl"
                    interactive={true}
                    className="drop-shadow-md"
                  />
                </div>

                <div
                  className="absolute -bottom-2 inset-x-0 mx-auto w-max px-3 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs"
                  style={{ backgroundColor: currentStep.highlightColor }}
                >
                  {currentStep.category}
                </div>
              </div>

              {/* Persona Greeting & Dialogue Speech Bubble */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-200/90 text-left relative max-w-sm shadow-xs">
                <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold font-mono" style={{ color: currentStep.highlightColor }}>
                  <Sparkles className="w-3 h-3" />
                  <span>{preset.name} Speaks:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans italic">
                  "{currentStep.speechText}"
                </p>
              </div>

              {/* Direct Page Jump CTA */}
              <button
                type="button"
                onClick={() => handleJumpToPage(currentStep.route)}
                className="w-full py-2.5 px-4 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-md"
                style={{
                  backgroundColor: `${currentStep.highlightColor}12`,
                  borderColor: `${currentStep.highlightColor}40`,
                  color: currentStep.highlightColor,
                }}
              >
                <span>Visit {currentStep.title} Now</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right Detailed Feature Showcase (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <span
                  className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md"
                  style={{
                    backgroundColor: `${currentStep.highlightColor}18`,
                    color: currentStep.highlightColor,
                  }}
                >
                  {currentStep.badge}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 tracking-tight mt-1.5">
                  {currentStep.headline}
                </h2>
              </div>

              {/* Key Features Cards */}
              <div className="space-y-3 pt-1">
                {currentStep.keyFeatures.map((feat, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all flex items-start gap-3.5 group"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                      style={{
                        backgroundColor: `${currentStep.highlightColor}15`,
                      }}
                    >
                      {feat.icon}
                    </div>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {feat.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Controls & Progress */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Step Progress Dots */}
            <div className="flex items-center gap-1.5">
              {TOUR_STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStepIndex(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === currentStepIndex
                      ? 'w-6 bg-slate-800'
                      : 'w-2 bg-slate-200 hover:bg-slate-300'
                  }`}
                  style={{
                    backgroundColor: i === currentStepIndex ? currentStep.highlightColor : undefined,
                  }}
                  title={`Step ${i + 1}`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Skip Tour
              </button>

              {currentStepIndex > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: currentStep.highlightColor,
                }}
              >
                <span>
                  {currentStepIndex === TOUR_STEPS.length - 1 ? 'Start Learning 🚀' : 'Next Chapter'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
