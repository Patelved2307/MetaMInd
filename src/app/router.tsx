import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { AppLayout } from './layouts/AppLayout';
import { ProtectedRoute, OnboardingRoute } from '@/features/auth/ProtectedRoute';

// Public pages
import { LandingPage } from '@/pages/public/LandingPage';
import { SignInPage } from '@/pages/public/SignInPage';
import { SignUpPage } from '@/pages/public/SignUpPage';

// Onboarding page
import { OnboardingPage } from '@/pages/app/OnboardingPage';

// Authenticated app pages
import { DashboardPage } from '@/pages/app/DashboardPage';
import { LearnPage } from '@/pages/app/LearnPage';
import { LearningMapPage } from '@/pages/app/LearningMapPage';
import { AssessmentPage } from '@/pages/app/AssessmentPage';
import { AnalysisPage } from '@/pages/app/AnalysisPage';
import { LearningModulePage } from '@/pages/app/LearningModulePage';
import { PracticePage } from '@/pages/app/PracticePage';
import { ExamPage } from '@/pages/app/ExamPage';
import { LibraryPage } from '@/pages/app/LibraryPage';
import { AchievementsPage } from '@/pages/app/AchievementsPage';
import { CertificatesPage } from '@/pages/app/CertificatesPage';
import { ProfilePage } from '@/pages/app/ProfilePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'sign-in', element: <SignInPage /> },
      { path: 'sign-up', element: <SignUpPage /> },
    ],
  },
  {
    path: '/onboarding',
    element: <OnboardingRoute />,
    children: [
      { index: true, element: <OnboardingPage /> },
    ],
  },
  {
    path: '/app',
    element: <ProtectedRoute requireOnboardingCompleted={false} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/app/dashboard" replace /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'learn', element: <LearnPage /> },
          { path: 'learning-map', element: <LearningMapPage /> },
          { path: 'assessment', element: <AssessmentPage /> },
          { path: 'analysis', element: <AnalysisPage /> },
          { path: 'module', element: <LearningModulePage /> },
          { path: 'practice', element: <PracticePage /> },
          { path: 'exam', element: <ExamPage /> },
          { path: 'library', element: <LibraryPage /> },
          { path: 'achievements', element: <AchievementsPage /> },
          { path: 'certificates', element: <CertificatesPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
