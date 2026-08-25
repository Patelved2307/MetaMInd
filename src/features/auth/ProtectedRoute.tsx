import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { LoadingState } from '@/components/ui/LoadingState';
import { Sparkles } from 'lucide-react';

interface ProtectedRouteProps {
  requireOnboardingCompleted?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requireOnboardingCompleted = true,
}) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070A] flex flex-col items-center justify-center p-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#8DD3FF]/15 border border-[#8DD3FF]/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#8DD3FF]" />
          </div>
          <span className="font-display text-2xl text-[#F4F5F7]">MetaMind</span>
        </div>
        <LoadingState message="Verifying secure authentication..." size="lg" />
      </div>
    );
  }

  // Unauthenticated user -> redirect to sign-in
  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // User hasn't completed onboarding -> redirect to /onboarding
  if (requireOnboardingCompleted && profile && !profile.onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};

export const OnboardingRoute: React.FC = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070A] flex flex-col items-center justify-center p-4">
        <LoadingState message="Loading onboarding session..." size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  // Already completed onboarding -> redirect to dashboard
  if (profile && profile.onboarding_completed) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <Outlet />;
};
