import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/features/auth';
import { getAvatarPresetByUrl, generateAvatarUrl } from '@/lib/avatarGenerator';

export const AppLayout: React.FC = () => {
  const { user, profile } = useAuth();

  const avatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset.theme;

  return (
    <div className="h-screen w-full bg-[#05070A] text-[#F4F5F7] flex flex-col lg:flex-row overflow-hidden relative selection:bg-white/20">
      {/* Global Dynamic Radial Ambient Sheen matching Selected Avatar Theme */}
      <div
        className="fixed top-0 right-0 w-[700px] h-[700px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 opacity-40 z-0"
        style={{ background: theme.glow }}
      />
      <div
        className="fixed bottom-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-all duration-700 opacity-25 z-0"
        style={{ background: theme.glow }}
      />

      {/* Sticky Sidebar Menu (Fixed Position) */}
      <Sidebar />

      {/* Main Page Content Area (Independently Scrollable) */}
      <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto relative z-10">
        <Outlet />
      </main>
    </div>
  );
};
