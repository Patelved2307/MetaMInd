import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/features/auth';
import { getAvatarPresetByUrl, generateAvatarUrl, sanitizeAvatarUrl } from '@/lib/avatarGenerator';

export const AppLayout: React.FC = () => {
  const { profile, user } = useAuth();

  const rawAvatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const avatarUrl = sanitizeAvatarUrl(rawAvatarUrl);
  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset.theme;

  return (
    <div className="min-h-screen lg:h-screen w-full bg-[#F8FAFC] text-slate-800 flex flex-col lg:flex-row overflow-x-hidden relative selection:bg-blue-100 font-sans">
      {/* Global Dynamic Radial Light Sheen matching Avatar Theme */}
      <div
        className="fixed top-0 right-0 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full blur-[100px] sm:blur-[140px] pointer-events-none transition-all duration-700 opacity-25 z-0"
        style={{ background: theme.glow }}
      />
      <div
        className="fixed bottom-0 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-[100px] sm:blur-[120px] pointer-events-none transition-all duration-700 opacity-15 z-0"
        style={{ background: theme.glow }}
      />

      {/* Sticky Sidebar Menu */}
      <Sidebar />

      {/* Main Page Content Area */}
      <main className="flex-1 w-full lg:h-full lg:overflow-y-auto p-3 sm:p-5 md:p-6 lg:p-8 max-w-7xl mx-auto relative z-10">
        <Outlet />
      </main>
    </div>
  );
};
