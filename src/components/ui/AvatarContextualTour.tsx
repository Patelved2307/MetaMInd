import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Check,
  Volume2,
  VolumeX,
  Compass,
} from 'lucide-react';
import { GSAPAvatar } from './GSAPAvatar';
import { getAvatarPresetByUrl, sanitizeAvatarUrl, type AvatarPreset } from '@/lib/avatarGenerator';
import { useTour, TOUR_STEPS } from '@/lib/tourStore';

// Web Audio API subtle companion sound effect
function playCompanionChime(isMuted: boolean) {
  if (isMuted || typeof window === 'undefined') return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.025, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  } catch {
    // Ignore audio restrictions gracefully
  }
}

interface AvatarContextualTourProps {
  avatarUrl?: string;
  userName?: string;
  showFloatingLauncher?: boolean;
}

export const AvatarContextualTour: React.FC<AvatarContextualTourProps> = ({
  avatarUrl = 'green_yeo',
  userName = 'Student',
  showFloatingLauncher = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    isOpen,
    currentStepIndex,
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    startPageTour,
    closeTour,
  } = useTour();

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [cardPos, setCardPos] = useState({ top: 100, left: 100 });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const avatarContainerRef = useRef<HTMLDivElement>(null);

  const cleanAvatarId = sanitizeAvatarUrl(avatarUrl);
  const preset: AvatarPreset = getAvatarPresetByUrl(cleanAvatarId);
  const theme = preset.theme;

  // Track user mouse gaze naturally
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!avatarContainerRef.current) return;
      const rect = avatarContainerRef.current.getBoundingClientRect();
      const avatarCenterX = rect.left + rect.width / 2;
      const avatarCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - avatarCenterX;
      const deltaY = e.clientY - avatarCenterY;
      const dist = Math.hypot(deltaX, deltaY);

      const maxShift = 2.5;
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

      const head = avatarContainerRef.current.querySelector('g[ref="headRef"]');
      if (head) {
        const rotation = Math.max(-3, Math.min(3, (deltaX / window.innerWidth) * 6));
        gsap.to(head, {
          rotation,
          duration: 0.25,
          ease: 'power1.out',
          overwrite: 'auto',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Calculate target position and position the dialogue card neatly
  const updateTargetPosition = useCallback(() => {
    if (!isOpen || !currentStep) return;

    let targetEl = document.querySelector(currentStep.targetSelector) as HTMLElement | null;

    if (!targetEl) {
      if (currentStep.id.includes('prompt') || currentStep.id === 'learn-chat') {
        targetEl = document.querySelector('#tour-chat-prompt, textarea, input[placeholder*="Ask"]');
      } else if (currentStep.id.includes('attach')) {
        targetEl = document.querySelector('#tour-chat-attach, button[title*="Attach"]');
      } else if (currentStep.id.includes('plugin')) {
        targetEl = document.querySelector('#tour-chat-plugins, button[title*="plugin"]');
      } else if (currentStep.id.includes('starter')) {
        targetEl = document.querySelector('#tour-chat-starter-cards, .welcome-starter-card');
      } else if (currentStep.id.includes('sidebar')) {
        targetEl = document.querySelector('#tour-chat-sidebar, aside');
      } else if (currentStep.id.includes('dashboard-btn')) {
        targetEl = document.querySelector('#tour-dashboard-btn');
      } else if (currentStep.id === 'dashboard') {
        targetEl = document.querySelector('#tour-dashboard-streak, #dashboard-streak-count, .dashboard-bento-card');
      } else if (currentStep.id === 'practice') {
        targetEl = document.querySelector('#tour-practice-hero, #tour-nav-practice');
      } else if (currentStep.id === 'progress') {
        targetEl = document.querySelector('#tour-learning-map-hero, #tour-nav-learning-map');
      } else if (currentStep.id === 'badges') {
        targetEl = document.querySelector('#tour-achievements-hero, #tour-nav-badges');
      } else if (currentStep.id === 'committee') {
        targetEl = document.querySelector('#tour-committee-hero, #tour-nav-committee');
      } else if (currentStep.id === 'exam') {
        targetEl = document.querySelector('#tour-exam-hero, #tour-nav-exam');
      } else if (currentStep.id === 'profile') {
        targetEl = document.querySelector('#tour-profile-avatar, #tour-profile-hero, #tour-nav-profile');
      }
    }

    const AVATAR_WIDTH = 84;
    const GAP = 12;
    const BUBBLE_WIDTH = 330;
    const TOTAL_WIDTH = AVATAR_WIDTH + GAP + BUBBLE_WIDTH; // ~426px
    const CARD_HEIGHT = 175;

    const MARGIN_LEFT = 20;
    const MARGIN_RIGHT = 36; // Generous buffer against right-dock sidebars (Edge, etc.)
    const MARGIN_TOP = 20;
    const MARGIN_BOTTOM = 24;

    if (targetEl) {
      try {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      } catch {
        // Fallback safely
      }

      const rect = targetEl.getBoundingClientRect();
      setTargetRect(rect);

      const targetCenterX = rect.left + rect.width / 2;
      // Horizontally center the speech dialogue bubble directly under the target element
      const bubbleCenterOffset = AVATAR_WIDTH + GAP + BUBBLE_WIDTH / 2;
      const idealLeft = targetCenterX - bubbleCenterOffset;
      const maxLeft = Math.max(MARGIN_LEFT, window.innerWidth - TOTAL_WIDTH - MARGIN_RIGHT);
      let left = Math.max(MARGIN_LEFT, Math.min(maxLeft, idealLeft));

      let top = rect.bottom + 14;

      if (currentStep.preferredPosition === 'top') {
        top = rect.top - CARD_HEIGHT - 14;
      } else if (currentStep.preferredPosition === 'right') {
        left = Math.min(maxLeft, rect.right + 14);
        top = rect.top + rect.height / 2 - CARD_HEIGHT / 2;
      } else if (currentStep.preferredPosition === 'left') {
        left = Math.max(MARGIN_LEFT, rect.left - TOTAL_WIDTH - 14);
        top = rect.top + rect.height / 2 - CARD_HEIGHT / 2;
      } else {
        // Default 'bottom'
        top = rect.bottom + 14;
      }

      // Vertical viewport boundary collision & intelligent flipping
      if (top + CARD_HEIGHT > window.innerHeight - MARGIN_BOTTOM) {
        const roomAbove = rect.top - MARGIN_TOP;
        const roomBelow = window.innerHeight - rect.bottom - MARGIN_BOTTOM;
        if (roomAbove >= CARD_HEIGHT + 14 || roomAbove > roomBelow) {
          top = rect.top - CARD_HEIGHT - 14;
        } else {
          top = window.innerHeight - CARD_HEIGHT - MARGIN_BOTTOM;
        }
      }

      if (top < MARGIN_TOP) {
        if (window.innerHeight - rect.bottom >= CARD_HEIGHT + 14) {
          top = rect.bottom + 14;
        } else {
          top = MARGIN_TOP;
        }
      }

      top = Math.max(MARGIN_TOP, Math.min(window.innerHeight - CARD_HEIGHT - MARGIN_BOTTOM, top));

      setCardPos({ top, left });
    } else {
      setTargetRect(null);
      setCardPos({
        top: Math.max(MARGIN_TOP, window.innerHeight / 2 - CARD_HEIGHT / 2),
        left: Math.max(MARGIN_LEFT, window.innerWidth / 2 - TOTAL_WIDTH / 2),
      });
    }
  }, [isOpen, currentStep]);

  // Recalculate position on resize, scroll, or step change across multi-pass intervals
  useEffect(() => {
    updateTargetPosition();

    const handleResize = () => updateTargetPosition();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);

    const timeouts = [40, 120, 260, 450, 750, 1100].map((delay) =>
      setTimeout(updateTargetPosition, delay)
    );

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [updateTargetPosition, currentStepIndex, location.pathname]);

  // Speech timing & audio chime
  useEffect(() => {
    if (!isOpen) {
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    playCompanionChime(isMuted);

    const timer = setTimeout(() => {
      setIsSpeaking(false);
    }, 3200);

    return () => clearTimeout(timer);
  }, [isOpen, currentStepIndex, isMuted]);

  const handleNextClick = () => {
    if (currentStepIndex === TOUR_STEPS.length - 1) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.65 },
        colors: [theme.primary, '#3B82F6', '#10B981', '#F59E0B'],
      });
      closeTour();
    } else {
      nextStep(navigate);
    }
  };

  const handlePrevClick = () => {
    prevStep(navigate);
  };

  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  // Extract clean category from badge string
  const categoryLabel = currentStep
    ? currentStep.badge.split('•')[0].trim()
    : 'GUIDE';

  return (
    <>
      {/* 1. CLEAN FLOATING LAUNCHER DOCK (Bottom Right) */}
      {!isOpen && showFloatingLauncher && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center select-none">
          <motion.button
            type="button"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => startPageTour()}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white text-slate-800 border border-slate-200/90 shadow-lg shadow-slate-900/5 hover:shadow-xl hover:border-slate-300 transition-all cursor-pointer group"
            title="Start guided tour"
          >
            <div className="relative">
              <div
                className="rounded-full p-0.5 border"
                style={{ borderColor: `${theme.primary}50` }}
              >
                <GSAPAvatar avatarId={cleanAvatarId} size={26} interactive={false} />
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white"
                style={{ backgroundColor: theme.primary }}
              />
            </div>

            <div className="flex flex-col text-left leading-none">
              <span className="text-[10px] font-medium text-slate-400">Tutorial</span>
              <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-900 mt-0.5 flex items-center gap-1">
                Tour Guide
                <Compass className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </span>
            </div>
          </motion.button>
        </div>
      )}

      {/* 2. BESPOKE HUMAN-CRAFTED COMPANION TOUR MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden select-none">
          {/* Subtle Scrim & High-Precision Spotlight */}
          <AnimatePresence>
            {targetRect ? (
              <motion.div
                key={`spotlight-${currentStepIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="absolute rounded-xl pointer-events-none transition-all duration-300"
                style={{
                  top: targetRect.top - 5,
                  left: targetRect.left - 5,
                  width: targetRect.width + 10,
                  height: targetRect.height + 10,
                  boxShadow: `0 0 0 9999px rgba(15, 23, 42, 0.42), 0 0 0 2px ${theme.primary}`,
                  borderRadius: 14,
                }}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/40 pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Dialogue Card Container with Smooth Physical Glide */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 6 }}
            transition={{
              type: 'spring',
              stiffness: 340,
              damping: 28,
            }}
            style={{
              position: 'fixed',
              top: cardPos.top,
              left: cardPos.left,
              transition:
                'top 0.4s cubic-bezier(0.25, 1, 0.5, 1), left 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
            className="pointer-events-auto z-20 flex items-center gap-2 sm:gap-3 select-none"
          >
            {/* 1. THE PERSON STANDING (No Background, Completely Transparent Cutout) */}
            <div
              ref={avatarContainerRef}
              className="flex flex-col items-center shrink-0 cursor-pointer group pb-1"
              onClick={() => setIsSpeaking(!isSpeaking)}
              title={`${preset.name} - Companion for ${userName} (Click to speak)`}
            >
              {/* Illustrated Character standing with transparent background */}
              <div className="relative w-20 sm:w-22 h-24 sm:h-28 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <GSAPAvatar
                  avatarId={cleanAvatarId}
                  transparentBg={true}
                  size="full"
                  className="w-full h-full"
                  interactive={true}
                  isSpeaking={isSpeaking}
                  showAura={false}
                />
              </div>

              {/* Natural Ground Contact Shadow under the standing person */}
              <div className="w-14 sm:w-16 h-1.5 bg-slate-900/15 rounded-full blur-[1.5px] -mt-0.5" />
            </div>

            {/* 2. THE CLEAN SPEECH DIALOGUE BUBBLE */}
            <div className="relative w-[300px] sm:w-[330px] bg-white rounded-2xl border border-slate-200/90 shadow-[0_20px_45px_-10px_rgba(15,23,42,0.18)] p-3.5 sm:p-4 space-y-2.5">
              {/* Speech pointer tail pointing towards the standing person's face */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[8px] border-r-white drop-shadow-xs pointer-events-none" />

              {/* Header Row: Category Tag, Step Counter, Mute, Close */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${theme.primary}12`,
                      color: theme.primary,
                    }}
                  >
                    {categoryLabel}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {currentStepIndex + 1} of {TOUR_STEPS.length}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {/* Audio Mute Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors cursor-pointer"
                    title={isMuted ? 'Unmute sound' : 'Mute sound'}
                  >
                    {isMuted ? (
                      <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </button>

                  {/* Close Tour */}
                  <button
                    type="button"
                    onClick={() => closeTour()}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
                    title="Close tour"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Step Title */}
              <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-snug">
                {currentStep ? currentStep.title : 'Overview'}
              </h3>

              {/* Step Description */}
              <p className="text-xs text-slate-600 leading-relaxed font-normal min-h-[36px]">
                {currentStep ? currentStep.speechText : ''}
              </p>

              {/* Bottom Actions Row */}
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                {/* Progress Dots */}
                <div className="flex items-center gap-1">
                  {TOUR_STEPS.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => goToStep(idx, navigate)}
                      aria-label={`Step ${idx + 1}`}
                      className={`h-1 rounded-full transition-all cursor-pointer ${
                        idx === currentStepIndex
                          ? 'w-4 bg-slate-900'
                          : 'w-1 bg-slate-200 hover:bg-slate-300'
                      }`}
                      style={
                        idx === currentStepIndex
                          ? { backgroundColor: theme.primary }
                          : undefined
                      }
                    />
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => closeTour(false)}
                    className="text-[11px] font-medium text-slate-400 hover:text-slate-600 px-1.5 py-1 transition-colors cursor-pointer"
                  >
                    Skip
                  </button>

                  {currentStepIndex > 0 && (
                    <button
                      type="button"
                      onClick={handlePrevClick}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Back</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleNextClick}
                    className="px-3.5 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all hover:opacity-95 active:scale-97 cursor-pointer"
                    style={{ backgroundColor: theme.primary }}
                  >
                    <span>{isLastStep ? 'Done' : 'Next'}</span>
                    {isLastStep ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};
