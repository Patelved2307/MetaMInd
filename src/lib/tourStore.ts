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
  // 1. LEARN PAGE COMPONENT-BY-COMPONENT WALKTHROUGH
  {
    id: 'learn-prompt',
    pageRoute: '/app/chat',
    targetSelector: '#tour-chat-prompt',
    title: 'Neural Prompt Composer',
    badge: 'Learn • Component 01',
    speechText:
      'Ask any academic question, paste messy code, or drop lecture notes here. I will break down the concept step-by-step with analogies and interactive drills!',
    preferredPosition: 'bottom',
  },
  {
    id: 'learn-attach',
    pageRoute: '/app/chat',
    targetSelector: '#tour-chat-attach',
    title: 'Multi-Modal Attachments',
    badge: 'Learn • Component 02',
    speechText:
      'Drop lecture PDFs, assignment screenshots, or source code files right here. I will parse equations, debug errors, and summarize key takeaways.',
    preferredPosition: 'bottom',
  },
  {
    id: 'learn-plugins',
    pageRoute: '/app/chat',
    targetSelector: '#tour-chat-plugins',
    title: 'Cognitive AI Modes & Plugins',
    badge: 'Learn • Component 03',
    speechText:
      'Toggle specialized tutor engines: Socratic Guided Probing, Code Bug Diagnoser, or Comprehensive Exam Revision!',
    preferredPosition: 'bottom',
  },
  {
    id: 'learn-starter-cards',
    pageRoute: '/app/chat',
    targetSelector: '#tour-chat-starter-cards',
    title: 'Diagnostic Workflows',
    badge: 'Learn • Component 04',
    speechText:
      'One-tap diagnostic drills! Test your comprehension in SQL JOINs, Binary Search Trees, and Computer Networking algorithms.',
    preferredPosition: 'top',
  },
  {
    id: 'learn-sidebar',
    pageRoute: '/app/chat',
    targetSelector: '#tour-chat-sidebar',
    title: 'Study Projects & History',
    badge: 'Learn • Component 05',
    speechText:
      'All your past doubt breakdowns and explanations are safely stored here. Group conversations into custom project notebooks anytime.',
    preferredPosition: 'right',
  },
  {
    id: 'learn-dashboard-btn',
    pageRoute: '/app/chat',
    targetSelector: '#tour-dashboard-btn',
    title: 'Student Command Dashboard',
    badge: 'Learn • Component 06',
    speechText:
      'Ready to see your analytics? Jump right into your Command Dashboard to track daily streaks, XP rank, and learning roadmaps!',
    preferredPosition: 'bottom',
  },

  // 2. CORE PLATFORM HUBS
  {
    id: 'dashboard',
    pageRoute: '/app/dashboard',
    targetSelector: '#tour-dashboard-streak',
    title: 'Daily Study Streaks & XP',
    badge: 'Dashboard Hub',
    speechText:
      'Build consistent learning habits! Keep your study streak burning to unlock bonus XP multipliers and prestigious achievement medals.',
    preferredPosition: 'bottom',
  },
  {
    id: 'practice',
    pageRoute: '/app/practice',
    targetSelector: '#tour-practice-hero',
    title: 'Interactive Practice Drills',
    badge: 'Practice Hub',
    speechText:
      'Reinforce your memory with active recall quiz banks and coding exercises calibrated to your cognitive skill level.',
    preferredPosition: 'bottom',
  },
  {
    id: 'progress',
    pageRoute: '/app/learning-map',
    targetSelector: '#tour-learning-map-hero',
    title: 'Visual Learning Roadmap',
    badge: 'Roadmap Hub',
    speechText:
      'Explore your prerequisite curriculum graph to see which topics are mastered and what branch to conquer next.',
    preferredPosition: 'bottom',
  },
  {
    id: 'badges',
    pageRoute: '/app/achievements',
    targetSelector: '#tour-achievements-hero',
    title: 'Badges & Rank Medals',
    badge: 'Achievements Hub',
    speechText:
      'Earn verifiable XP and collect high-tier 3D medals as you solve tricky puzzles and ace test simulations.',
    preferredPosition: 'bottom',
  },
  {
    id: 'committee',
    pageRoute: '/app/committee',
    targetSelector: '#tour-committee-hero',
    title: 'Student Community & Doubts',
    badge: 'Committee Hub',
    speechText:
      'Post tricky homework doubts with XP bounties, help peers with solutions, and join live study rooms.',
    preferredPosition: 'bottom',
  },
  {
    id: 'exam',
    pageRoute: '/app/exam',
    targetSelector: '#tour-exam-hero',
    title: 'Timed Exam Simulator',
    badge: 'Exam Hub',
    speechText:
      'Simulate high-stakes exam conditions with strict time limits to build test speed and earn accredited course certificates.',
    preferredPosition: 'bottom',
  },
  {
    id: 'profile',
    pageRoute: '/app/profile',
    targetSelector: '#tour-profile-avatar',
    title: 'Your Companion & Themes',
    badge: 'Profile Hub',
    speechText:
      'That’s me! You can customize my vector persona and color scheme anytime, and your entire platform theme updates instantly.',
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

  public startPageTour(route?: string, navigateFn?: (route: string) => void) {
    const currentPath = route || (typeof window !== 'undefined' ? window.location.pathname : '/app/chat');
    const matchingIndex = TOUR_STEPS.findIndex((s) => s.pageRoute === currentPath);
    this.startTour(matchingIndex >= 0 ? matchingIndex : 0, navigateFn);
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
    startPageTour: (route?: string, navigateFn?: (route: string) => void) =>
      tourStore.startPageTour(route, navigateFn),
    nextStep: (navigateFn?: (route: string) => void) => tourStore.nextStep(navigateFn),
    prevStep: (navigateFn?: (route: string) => void) => tourStore.prevStep(navigateFn),
    goToStep: (stepIndex: number, navigateFn?: (route: string) => void) =>
      tourStore.goToStep(stepIndex, navigateFn),
    closeTour: (dontShowAgain?: boolean) => tourStore.closeTour(dontShowAgain),
  };
}
