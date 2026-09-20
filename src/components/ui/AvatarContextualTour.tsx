import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import {
  X,
  Sparkles,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { GSAPAvatar } from './GSAPAvatar';
import { getAvatarPresetByUrl, sanitizeAvatarUrl, type AvatarPreset } from '@/lib/avatarGenerator';

export interface TourStepConfig {
  id: string;
  targetSelector: string; // DOM selector to point at
  pageRoute?: string;     // Route where this element exists
  title: string;
  badge: string;
  speechText: string;
  preferredPosition: 'bottom' | 'top' | 'left' | 'right';
  actionLabel?: string;
  onActionClick?: () => void;
}

const TOUR_STEPS: TourStepConfig[] = [
  {
    id: 'dashboard-btn',
    targetSelector: '#tour-dashboard-btn',
    pageRoute: '/app/chat',
    title: 'Your Learning Dashboard',
    badge: 'Step 1 • Command Center',
    speechText:
      "Click here anytime to view your full Dashboard! That's where you track your daily streaks, subject mastery bars, and quick goals.",
    preferredPosition: 'bottom',
    actionLabel: 'Go to Dashboard →',
  },
  {
    id: 'chat-prompt',
    targetSelector: '#tour-chat-prompt',
    pageRoute: '/app/chat',
    title: 'AI Neural Workspace',
    badge: 'Step 2 • Ask Anything',
    speechText:
      "Type any conceptual question here or paste lecture notes! I will break down complex ideas step-by-step with analogies and code.",
    preferredPosition: 'top',
  },
  {
    id: 'study-guide-pdf',
    targetSelector: '#tour-pdf-btn',
    pageRoute: '/app/chat',
    title: 'Instant Study Guide PDFs',
    badge: 'Step 3 • 1-Click Export',
    speechText:
      "Need revision notes? Click this to download a full-length 15-page printable study guide complete with key concepts and practice questions!",
    preferredPosition: 'bottom',
  },
  {
    id: 'nav-map',
    targetSelector: '#tour-nav-learning-map',
    title: 'Interactive Learning Map',
    badge: 'Step 4 • Visual Roadmap',
    speechText:
      "Explore your visual curriculum tree! Each concept node connects with prerequisite branches, so you always know what to master next.",
    preferredPosition: 'right',
  },
  {
    id: 'nav-practice',
    targetSelector: '#tour-nav-practice',
    title: 'Practice & Concept Drills',
    badge: 'Step 5 • Spaced Repetition',
    speechText:
      "Reinforce your knowledge with active recall drills, interactive flashcards, and live coding exercises calibrated to your pace.",
    preferredPosition: 'right',
  },
  {
    id: 'nav-analysis',
    targetSelector: '#tour-nav-analysis',
    title: 'Progress & Retention Analytics',
    badge: 'Step 6 • Memory Forecasts',
    speechText:
      "Track your cognitive retention curves, study heatmaps, and learning velocity to ensure long-term mastery.",
    preferredPosition: 'right',
  },
  {
    id: 'nav-committee',
    targetSelector: '#tour-nav-committee',
    title: 'Student Committee & Bounties',
    badge: 'Step 7 • Peer Network',
    speechText:
      "Post homework doubts with XP bounties, climb the solver leaderboard by answering peers, or jump into live collaborative study rooms!",
    preferredPosition: 'right',
  },
  {
    id: 'nav-profile',
    targetSelector: '#tour-nav-profile',
    title: 'Your 3D Persona & Theme Engine',
    badge: 'Step 8 • Dynamic Aesthetics',
    speechText:
      "That's me! Notice how the whole site glows with matching colors? In Profile, you can customize your animated avatar and transform the theme anytime!",
    preferredPosition: 'right',
  },
];

interface AvatarContextualTourProps {
  isOpen: boolean;
  onClose: () => void;
  avatarUrl?: string;
  userName?: string;
}

export const AvatarContextualTour: React.FC<AvatarContextualTourProps> = ({
  isOpen,
  onClose,
  avatarUrl = 'green_yeo',
  userName = 'Learner',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [cardPos, setCardPos] = useState({ top: 120, left: 100 });

  const avatarContainerRef = useRef<HTMLDivElement>(null);

  const cleanAvatarId = sanitizeAvatarUrl(avatarUrl);
  const preset: AvatarPreset = getAvatarPresetByUrl(cleanAvatarId);
  const theme = preset.theme;

  const currentStep = TOUR_STEPS[currentStepIndex];

  // Track global mouse position so avatar's eyes follow user cursor anywhere on screen
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (avatarContainerRef.current) {
        const rect = avatarContainerRef.current.getBoundingClientRect();
        const avatarCenterX = rect.left + rect.width / 2;
        const avatarCenterY = rect.top + rect.height / 2;

        const deltaX = e.clientX - avatarCenterX;
        const deltaY = e.clientY - avatarCenterY;
        const dist = Math.hypot(deltaX, deltaY);

        // Clamp eye shift between -3.5px and +3.5px
        const maxShift = 3.5;
        const shiftX = Math.max(-maxShift, Math.min(maxShift, (deltaX / Math.max(dist, 100)) * maxShift));
        const shiftY = Math.max(-maxShift, Math.min(maxShift, (deltaY / Math.max(dist, 100)) * maxShift));

        const pupils = avatarContainerRef.current.querySelectorAll('g[ref="pupilsRef"], g:has(> circle[fill*="iris"])');
        pupils.forEach((p) => {
          gsap.to(p, {
            x: shiftX,
            y: shiftY,
            duration: 0.2,
            ease: 'power1.out',
            overwrite: 'auto',
          });
        });

        // Subtle head tilt toward mouse cursor
        const head = avatarContainerRef.current.querySelector('g[ref="headRef"]');
        if (head) {
          const rotation = Math.max(-4, Math.min(4, (deltaX / window.innerWidth) * 8));
          gsap.to(head, {
            rotation,
            duration: 0.3,
            ease: 'power1.out',
            overwrite: 'auto',
          });
        }
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  // Update target element location dynamically
  const updateTargetPosition = useCallback(() => {
    if (!isOpen || !currentStep) return;

    let targetEl = document.querySelector(currentStep.targetSelector) as HTMLElement | null;

    // Fallback search if selector is slightly different or not yet rendered
    if (!targetEl) {
      if (currentStep.id === 'dashboard-btn') {
        targetEl = document.querySelector('button:has(svg.lucide-layout-dashboard), button:has(svg.lucide-compass)');
      } else if (currentStep.id === 'chat-prompt') {
        targetEl = document.querySelector('textarea, input[placeholder*="Ask"], input[placeholder*="Search"]');
      }
    }

    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      setTargetRect(rect);

      // Calculate contextual tooltip card position (card width ~340px, height ~200px)
      const cardWidth = 340;
      const cardHeight = 220;
      const margin = 16;

      let top = rect.bottom + margin;
      let left = rect.left + rect.width / 2 - cardWidth / 2;

      if (currentStep.preferredPosition === 'bottom') {
        top = rect.bottom + margin;
        left = Math.max(margin, Math.min(window.innerWidth - cardWidth - margin, rect.left + rect.width / 2 - cardWidth / 2));
      } else if (currentStep.preferredPosition === 'top') {
        top = Math.max(margin, rect.top - cardHeight - margin);
        left = Math.max(margin, Math.min(window.innerWidth - cardWidth - margin, rect.left + rect.width / 2 - cardWidth / 2));
      } else if (currentStep.preferredPosition === 'right') {
        left = rect.right + margin;
        top = Math.max(margin, Math.min(window.innerHeight - cardHeight - margin, rect.top + rect.height / 2 - cardHeight / 2));
      } else if (currentStep.preferredPosition === 'left') {
        left = Math.max(margin, rect.left - cardWidth - margin);
        top = Math.max(margin, Math.min(window.innerHeight - cardHeight - margin, rect.top + rect.height / 2 - cardHeight / 2));
      }

      // Keep inside screen viewport
      top = Math.max(margin, Math.min(window.innerHeight - cardHeight - margin, top));
      left = Math.max(margin, Math.min(window.innerWidth - cardWidth - margin, left));

      setCardPos({ top, left });
    } else {
      // Fallback center position
      setTargetRect(null);
      setCardPos({
        top: Math.max(20, window.innerHeight / 2 - 120),
        left: Math.max(20, window.innerWidth / 2 - 170),
      });
    }
  }, [isOpen, currentStep]);

  // Recalculate on resize, route change, or step change
  useEffect(() => {
    updateTargetPosition();
    const handleResize = () => updateTargetPosition();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);

    const timer = setTimeout(updateTargetPosition, 150);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
      clearTimeout(timer);
    };
  }, [updateTargetPosition, currentStepIndex, location.pathname]);

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      const nextStep = TOUR_STEPS[currentStepIndex + 1];
      if (nextStep.pageRoute && nextStep.pageRoute !== location.pathname) {
        navigate(nextStep.pageRoute);
      }
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('metamind_platform_tour_seen', 'true');
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.7 },
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden select-none">
      {/* 1. Target Element Highlight Spotlight */}
      {targetRect && (
        <motion.div
          layoutId="tour-spotlight"
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="absolute rounded-2xl pointer-events-none transition-all duration-300"
          style={{
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
            border: `2px dashed ${theme.primary}`,
            boxShadow: `0 0 0 9999px rgba(15, 23, 42, 0.45), 0 0 25px ${theme.glow}`,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          }}
        />
      )}

      {/* 2. Dotted Curved Connector Line from Target to Tutorial Box */}
      {targetRect && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <marker
              id="tour-arrowhead"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#F59E0B" />
            </marker>
          </defs>
          <path
            d={`M ${targetRect.left + targetRect.width / 2} ${
              cardPos.top > targetRect.bottom ? targetRect.bottom + 6 : targetRect.top - 6
            } Q ${targetRect.left + targetRect.width / 2} ${
              (targetRect.top + cardPos.top) / 2
            } ${cardPos.left + 80} ${cardPos.top}`}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeDasharray="5,4"
            markerEnd="url(#tour-arrowhead)"
          />
        </svg>
      )}

      {/* 3. The Yellow Rectangle Tutorial Box (Matches User Sketch) with bottom Avatar */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="absolute pointer-events-auto z-20 w-[350px] sm:w-[380px]"
        style={{
          top: cardPos.top,
          left: cardPos.left,
        }}
      >
        {/* Main Tutorial Box with warm yellow tint, themes & glass highlights */}
        <div
          className="relative rounded-3xl p-5 shadow-2xl transition-all duration-300 backdrop-blur-md overflow-visible"
          style={{
            backgroundColor: '#FEF9C3', // Warm yellow container as sketched
            border: '2.5px solid #F59E0B', // Crisp golden amber border
            boxShadow: `0 20px 40px -10px rgba(245, 158, 11, 0.35), 0 0 20px ${theme.glow}`,
          }}
        >
          {/* Top Bar inside Tutorial Box */}
          <div className="flex items-center justify-between pb-2 border-b border-amber-300/80 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[11px] font-bold font-mono tracking-wider text-amber-900 uppercase">
                {currentStep.badge} • {userName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-200/80 px-2 py-0.5 rounded-full">
                {currentStepIndex + 1} / {TOUR_STEPS.length}
              </span>
              <button
                type="button"
                onClick={handleComplete}
                className="text-amber-800 hover:text-amber-950 p-1 hover:bg-amber-200/60 rounded-full transition-colors cursor-pointer"
                title="Skip Tutorial"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tutorial Headline & Content */}
          <div className="space-y-1.5 pr-2">
            <h3 className="text-base font-extrabold text-amber-950 font-display flex items-center gap-1.5 tracking-tight">
              <span>{currentStep.title}</span>
              <Sparkles className="w-4 h-4 text-amber-600" />
            </h3>
            <p className="text-xs text-amber-900 leading-relaxed font-sans font-medium">
              "{currentStep.speechText}"
            </p>
          </div>

          {/* Action or Direct Jump Button if applicable */}
          {currentStep.actionLabel && (
            <button
              type="button"
              onClick={() => {
                navigate('/app/dashboard');
                handleNext();
              }}
              className="mt-3 w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <span>{currentStep.actionLabel}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Bottom Controls Row: Skip, Back, Next */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-amber-300/80">
            <button
              type="button"
              onClick={handleComplete}
              className="text-[11px] font-bold text-amber-800/80 hover:text-amber-950 hover:underline transition-all cursor-pointer"
            >
              Skip for now
            </button>

            <div className="flex items-center gap-2">
              {currentStepIndex > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-3 py-1.5 rounded-xl border border-amber-400 bg-white/90 hover:bg-white text-amber-950 text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Back</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-black active:scale-95 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span>
                  {currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish 🚀' : 'Next →'}
                </span>
              </button>
            </div>
          </div>

          {/* 4. The Live Generated Avatar Appearing at Bottom of the Tutorial Box */}
          <div
            ref={avatarContainerRef}
            className="absolute -bottom-7 -left-5 flex items-center gap-2 pointer-events-auto group cursor-pointer"
            title={`${preset.name} is watching your cursor!`}
          >
            <div
              className="p-1 rounded-full bg-white border-2 border-amber-500 shadow-xl transition-transform duration-300 group-hover:scale-110"
              style={{
                boxShadow: `0 10px 25px -5px ${theme.primary}`,
              }}
            >
              <GSAPAvatar
                avatarId={cleanAvatarId}
                size={54}
                interactive={true}
                showAura={true}
              />
            </div>

            {/* Little Thought Pill from Avatar */}
            <div className="bg-white/95 px-2.5 py-1 rounded-full border border-amber-300 shadow-md text-[10px] font-bold text-slate-800 whitespace-nowrap flex items-center gap-1 animate-bounce">
              <span>👀</span>
              <span>I follow your cursor!</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
