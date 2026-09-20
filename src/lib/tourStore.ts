import { useState, useEffect } from 'react';

export interface TourStepConfig {
  id: string;
  pageRoute: string;
  targetSelector: string;
  title: string;
  badge: string;
  speechText: string;
  preferredPosition: 'bottom' | 'top' | 'left' | 'right';
}

export const TOUR_STEPS: TourStepConfig[] = [
  {
    id: 'dashboard',
    pageRoute: '/app/dashboard',
    targetSelector: '#tour-dashboard-streak',
    title: 'Your Learning Dashboard',
    badge: 'Step 1 of 8 • Dashboard',
    speechText:
      'Welcome to your main command center! Track your daily study streak, view active goals, and monitor progress across all your enrolled subjects.',
    preferredPosition: 'bottom',
  },
  {
    id: 'learn-chat',
    pageRoute: '/app/chat',
    targetSelector: '#tour-chat-prompt',
    title: 'AI Concept Tutor',
    badge: 'Step 2 of 8 • Learn',
    speechText:
      'Ask any academic question or paste lecture notes here. Your AI companion explains concepts step-by-step with analogies and code snippets.',
    preferredPosition: 'top',
  },
  {
    id: 'practice',
    pageRoute: '/app/practice',
    targetSelector: '#tour-practice-hero',
    title: 'Interactive Practice Drills',
    badge: 'Step 3 of 8 • Practice',
    speechText:
      'Reinforce your learning with active recall drills, quiz question banks, and coding challenges calibrated to your pace.',
    preferredPosition: 'bottom',
  },
  {
    id: 'progress',
    pageRoute: '/app/learning-map',
    targetSelector: '#tour-learning-map-hero',
    title: 'Visual Learning Roadmap',
    badge: 'Step 4 of 8 • Progress',
    speechText:
      'Explore your visual curriculum roadmap! Easily check prerequisite branches to see which topics are mastered and what to learn next.',
    preferredPosition: 'bottom',
  },
  {
    id: 'badges',
    pageRoute: '/app/achievements',
    targetSelector: '#tour-achievements-hero',
    title: 'Badges & Rank Medals',
    badge: 'Step 5 of 8 • Badges',
    speechText:
      'Earn XP and collect high-status 3D medals as you maintain study streaks, solve concept puzzles, and score high on tests.',
    preferredPosition: 'bottom',
  },
  {
    id: 'committee',
    pageRoute: '/app/committee',
    targetSelector: '#tour-committee-hero',
    title: 'Student Community & Doubts',
    badge: 'Step 6 of 8 • Committee',
    speechText:
      'Post tricky homework doubts with XP bounties, help answer peer questions, and join live collaborative study rooms.',
    preferredPosition: 'bottom',
  },
  {
    id: 'exam',
    pageRoute: '/app/exam',
    targetSelector: '#tour-exam-hero',
    title: 'Timed Exam Simulator',
    badge: 'Step 7 of 8 • Exams',
    speechText:
      'Test your readiness under real exam time limits to build speed and accuracy, and earn verifiable course certificates.',
    preferredPosition: 'bottom',
  },
  {
    id: 'profile',
    pageRoute: '/app/profile',
    targetSelector: '#tour-profile-hero',
    title: 'Your Avatar & Theme Engine',
    badge: 'Step 8 of 8 • Profile',
    speechText:
      'This is your animated vector companion! You can customize your avatar anytime, and your entire platform theme will update to match.',
    preferredPosition: 'bottom',
  },
];

type TourListener = () => void;

class TourStore {
  private isOpen: boolean = false;
  private currentStepIndex: number = 0;
  private isAutoTourEnabled: boolean = true;
  private listeners: Set<TourListener> = new Set();

  constructor() {
    // Check if auto tour is explicitly disabled by user in settings
    const savedAutoTour = localStorage.getItem('metamind_auto_tour_enabled');
    if (savedAutoTour !== null) {
      this.isAutoTourEnabled = savedAutoTour === 'true';
    } else {
      this.isAutoTourEnabled = true;
    }

    // Check if user was in the middle of a tour across page refresh or navigation
    const savedOpen = sessionStorage.getItem('metamind_tour_active');
    const savedStep = sessionStorage.getItem('metamind_tour_step');
    if (savedOpen === 'true' && savedStep !== null) {
      this.isOpen = true;
      this.currentStepIndex = parseInt(savedStep, 10) || 0;
    }
  }

  public subscribe(listener: TourListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    if (this.isOpen) {
      sessionStorage.setItem('metamind_tour_active', 'true');
      sessionStorage.setItem('metamind_tour_step', this.currentStepIndex.toString());
    } else {
      sessionStorage.removeItem('metamind_tour_active');
      sessionStorage.removeItem('metamind_tour_step');
    }
    this.listeners.forEach((listener) => listener());
  }

  public getState() {
    const hasSeenTour = localStorage.getItem('metamind_platform_tour_seen') === 'true';
    return {
      isOpen: this.isOpen,
      currentStepIndex: this.currentStepIndex,
      currentStep: TOUR_STEPS[this.currentStepIndex] || TOUR_STEPS[0],
      totalSteps: TOUR_STEPS.length,
      isAutoTourEnabled: this.isAutoTourEnabled,
      hasSeenTour,
    };
  }

  public setAutoTourEnabled(enabled: boolean) {
    this.isAutoTourEnabled = enabled;
    localStorage.setItem('metamind_auto_tour_enabled', enabled ? 'true' : 'false');
    this.notify();
  }

  public resetTourSeen() {
    localStorage.removeItem('metamind_platform_tour_seen');
    this.isAutoTourEnabled = true;
    localStorage.setItem('metamind_auto_tour_enabled', 'true');
    this.notify();
  }

  public startTour(stepIndex: number = 0, navigateFn?: (route: string) => void) {
    this.isOpen = true;
    this.currentStepIndex = Math.max(0, Math.min(stepIndex, TOUR_STEPS.length - 1));
    const targetStep = TOUR_STEPS[this.currentStepIndex];
    if (navigateFn && targetStep && window.location.pathname !== targetStep.pageRoute) {
      navigateFn(targetStep.pageRoute);
    }
    this.notify();
  }

  public nextStep(navigateFn?: (route: string) => void) {
    if (this.currentStepIndex < TOUR_STEPS.length - 1) {
      const nextIndex = this.currentStepIndex + 1;
      this.currentStepIndex = nextIndex;
      const targetStep = TOUR_STEPS[nextIndex];
      if (navigateFn && targetStep && window.location.pathname !== targetStep.pageRoute) {
        navigateFn(targetStep.pageRoute);
      }
      this.notify();
    } else {
      this.closeTour();
    }
  }

  public prevStep(navigateFn?: (route: string) => void) {
    if (this.currentStepIndex > 0) {
      const prevIndex = this.currentStepIndex - 1;
      this.currentStepIndex = prevIndex;
      const targetStep = TOUR_STEPS[prevIndex];
      if (navigateFn && targetStep && window.location.pathname !== targetStep.pageRoute) {
        navigateFn(targetStep.pageRoute);
      }
      this.notify();
    }
  }

  public goToStep(stepIndex: number, navigateFn?: (route: string) => void) {
    if (stepIndex >= 0 && stepIndex < TOUR_STEPS.length) {
      this.currentStepIndex = stepIndex;
      const targetStep = TOUR_STEPS[stepIndex];
      if (navigateFn && targetStep && window.location.pathname !== targetStep.pageRoute) {
        navigateFn(targetStep.pageRoute);
      }
      this.notify();
    }
  }

  public closeTour(dontShowAgain: boolean = false) {
    this.isOpen = false;
    localStorage.setItem('metamind_platform_tour_seen', 'true');
    if (dontShowAgain) {
      this.isAutoTourEnabled = false;
      localStorage.setItem('metamind_auto_tour_enabled', 'false');
    }
    this.notify();
  }
}

export const tourStore = new TourStore();

export function useTour() {
  const [state, setState] = useState(() => tourStore.getState());

  useEffect(() => {
    return tourStore.subscribe(() => {
      setState(tourStore.getState());
    });
  }, []);

  return {
    ...state,
    setAutoTourEnabled: (enabled: boolean) => tourStore.setAutoTourEnabled(enabled),
    resetTourSeen: () => tourStore.resetTourSeen(),
    startTour: (stepIndex?: number, navigateFn?: (route: string) => void) =>
      tourStore.startTour(stepIndex, navigateFn),
    nextStep: (navigateFn?: (route: string) => void) => tourStore.nextStep(navigateFn),
    prevStep: (navigateFn?: (route: string) => void) => tourStore.prevStep(navigateFn),
    goToStep: (stepIndex: number, navigateFn?: (route: string) => void) =>
      tourStore.goToStep(stepIndex, navigateFn),
    closeTour: (dontShowAgain?: boolean) => tourStore.closeTour(dontShowAgain),
  };
}
