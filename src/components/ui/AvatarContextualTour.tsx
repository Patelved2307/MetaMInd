import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { X, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { GSAPAvatar } from './GSAPAvatar';
import { getAvatarPresetByUrl, sanitizeAvatarUrl, type AvatarPreset } from '@/lib/avatarGenerator';
import { useTour, TOUR_STEPS } from '@/lib/tourStore';

interface AvatarContextualTourProps {
  avatarUrl?: string;
  userName?: string;
}

export const AvatarContextualTour: React.FC<AvatarContextualTourProps> = ({
  avatarUrl = 'green_yeo',
  userName = 'Student',
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isOpen, currentStepIndex, currentStep, nextStep, prevStep, goToStep, closeTour } =
    useTour();

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [cardPos, setCardPos] = useState({ top: 100, left: 100 });

  const avatarContainerRef = useRef<HTMLDivElement>(null);

  const cleanAvatarId = sanitizeAvatarUrl(avatarUrl);
  const preset: AvatarPreset = getAvatarPresetByUrl(cleanAvatarId);
  const theme = preset.theme;

  // Real-time GSAP pupil and head tracking to follow the user's cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!avatarContainerRef.current) return;
      const rect = avatarContainerRef.current.getBoundingClientRect();
      const avatarCenterX = rect.left + rect.width / 2;
      const avatarCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - avatarCenterX;
      const deltaY = e.clientY - avatarCenterY;
      const dist = Math.hypot(deltaX, deltaY);

      const maxShift = 3;
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
          duration: 0.3,
          ease: 'power1.out',
          overwrite: 'auto',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Update target element location dynamically
  const updateTargetPosition = useCallback(() => {
    if (!isOpen || !currentStep) return;

    let targetEl = document.querySelector(currentStep.targetSelector) as HTMLElement | null;

    // Fallback search if selector is slightly different or not yet rendered
    if (!targetEl) {
      if (currentStep.id === 'dashboard') {
        targetEl = document.querySelector('#tour-dashboard-streak, #dashboard-streak-count, .dashboard-bento-card');
      } else if (currentStep.id === 'learn-chat') {
        targetEl = document.querySelector('#tour-chat-prompt, textarea, input[placeholder*="Ask"]');
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
        targetEl = document.querySelector('#tour-profile-hero, #tour-nav-profile');
      }
    }

    const cardWidth = 360;
    const cardHeight = 220;
    const margin = 20;

    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      setTargetRect(rect);

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

      // Keep strictly within screen viewport boundaries
      top = Math.max(margin, Math.min(window.innerHeight - cardHeight - margin, top));
      left = Math.max(margin, Math.min(window.innerWidth - cardWidth - margin, left));

      setCardPos({ top, left });
    } else {
      // Graceful centered positioning if target is not on current view
      setTargetRect(null);
      setCardPos({
        top: Math.max(margin, window.innerHeight / 2 - 110),
        left: Math.max(margin, window.innerWidth / 2 - 180),
      });
    }
  }, [isOpen, currentStep]);

  // Recalculate position on resize, scroll, or step change
  useEffect(() => {
    updateTargetPosition();

    const handleResize = () => updateTargetPosition();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);

    const timer1 = setTimeout(updateTargetPosition, 100);
    const timer2 = setTimeout(updateTargetPosition, 350);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [updateTargetPosition, currentStepIndex, location.pathname]);

  const handleNextClick = () => {
    if (currentStepIndex === TOUR_STEPS.length - 1) {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.7 },
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden select-none">
      {/* 1. Backdrop Scrim & Target Element Spotlight */}
      <AnimatePresence>
        {targetRect ? (
          <motion.div
            key={`spotlight-${currentStepIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute rounded-2xl pointer-events-none transition-all duration-300"
            style={{
              top: targetRect.top - 6,
              left: targetRect.left - 6,
              width: targetRect.width + 12,
              height: targetRect.height + 12,
              border: `2px solid ${theme.primary}`,
              boxShadow: `0 0 0 9999px rgba(15, 23, 42, 0.38), 0 0 20px ${theme.glow}`,
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
            }}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/35 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* 2. Modern, Clean Tour Card (Matches App Bento Aesthetics) */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
        className="absolute pointer-events-auto z-20 w-[350px] sm:w-[370px]"
        style={{
          top: cardPos.top,
          left: cardPos.left,
        }}
      >
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden relative">
          {/* Subtle Top Accent Bar using Student's Theme Color */}
          <div
            className="h-1 w-full"
            style={{ backgroundColor: theme.primary }}
          />

          <div className="p-5 space-y-4">
            {/* Header: Avatar, Badge & Step Counter, Close Button */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {/* Live GSAP Vector Avatar */}
                <div
                  ref={avatarContainerRef}
                  className="w-10 h-10 rounded-full border-2 p-0.5 bg-white shadow-xs shrink-0 flex items-center justify-center transition-transform hover:scale-105"
                  style={{ borderColor: theme.primary }}
                  title={`${preset.name} - Your AI Companion`}
                >
                  <GSAPAvatar
                    avatarId={cleanAvatarId}
                    size={34}
                    interactive={true}
                    showAura={false}
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-bold font-mono tracking-wider px-2 py-0.5 rounded-full uppercase"
                      style={{
                        backgroundColor: `${theme.primary}15`,
                        color: theme.primary,
                      }}
                    >
                      {currentStep.badge} • {userName}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate mt-0.5">
                    {currentStep.title}
                  </h3>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={closeTour}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-xl transition-colors cursor-pointer shrink-0"
                title="Skip tour"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content: Simple, Clear Plain English */}
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {currentStep.speechText}
            </p>

            {/* Footer Navigation Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={closeTour}
                className="text-xs font-medium text-slate-400 hover:text-slate-700 hover:underline cursor-pointer transition-colors"
              >
                Skip tour
              </button>

              {/* Progress indicator dots */}
              <div className="flex items-center gap-1">
                {TOUR_STEPS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goToStep(idx, navigate)}
                    aria-label={`Go to step ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === currentStepIndex
                        ? 'w-4'
                        : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                    }`}
                    style={
                      idx === currentStepIndex
                        ? { backgroundColor: theme.primary }
                        : undefined
                    }
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                {currentStepIndex > 0 && (
                  <button
                    type="button"
                    onClick={handlePrevClick}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Back</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleNextClick}
                  className="px-3.5 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:opacity-90 active:scale-95 cursor-pointer"
                  style={{ backgroundColor: theme.primary }}
                >
                  <span>{isLastStep ? 'Got it!' : 'Next'}</span>
                  {isLastStep ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
