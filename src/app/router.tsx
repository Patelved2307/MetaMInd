import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { AppLayout } from './layouts/AppLayout';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';

// Public pages
import { LandingPage } from '@/pages/public/LandingPage';
import { SignInPage } from '@/pages/public/SignInPage';
import { SignUpPage } from '@/pages/public/SignUpPage';
import { SharedChatPage } from '@/pages/public/SharedChatPage';

// Authenticated app pages
import { ChatbotWorkspacePage } from '@/pages/app/ChatbotWorkspacePage';
import { DashboardPage } from '@/pages/app/DashboardPage';
import { LearningMapPage } from '@/pages/app/LearningMapPage';
import { AssessmentPage } from '@/pages/app/AssessmentPage';
import { AnalysisPage } from '@/pages/app/AnalysisPage';
import { LearningModulePage } from '@/pages/app/LearningModulePage';
import { PracticePage } from '@/pages/app/PracticePage';
import { ExamPage } from '@/pages/app/ExamPage';
import { LibraryPage } from '@/pages/app/LibraryPage';
import { AchievementsPage } from '@/pages/app/AchievementsPage';
import { CertificatesPage } from '@/pages/app/CertificatesPage';
import { GroupStudyPage } from '@/pages/app/GroupStudyPage';
import { ProfilePage } from '@/pages/app/ProfilePage';
import { StudentCommitteePage } from '@/pages/app/StudentCommitteePage';

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
    path: '/shared-chat/:shareId',
    element: <SharedChatPage />,
  },
  {
    path: '/onboarding',
    element: <Navigate to="/app/chat" replace />,
  },
  {
    path: '/app',
    element: <ProtectedRoute requireOnboardingCompleted={false} />,
    children: [
      // Primary Landing for Registered Students: Standalone MetaMind AI Chatbot
      { index: true, element: <Navigate to="/app/chat" replace /> },
      { path: 'chat', element: <ChatbotWorkspacePage /> },

      // Main Analytics, Exams, and Learning Management Dashboard Layout
      {
        element: <AppLayout />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'learn', element: <Navigate to="/app/chat" replace /> },
          { path: 'committee', element: <StudentCommitteePage /> },
          { path: 'study-room', element: <GroupStudyPage /> },
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
