import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { Terminal, Compass } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { NeuralTerminalModal } from '@/components/ui/NeuralTerminalModal';
import { GSAPAvatar } from '@/components/ui/GSAPAvatar';
import { AvatarPlatformTourModal } from '@/components/ui/AvatarPlatformTourModal';
import { useAuth } from '@/features/auth';
import { getAvatarPresetByUrl, generateAvatarUrl, sanitizeAvatarUrl } from '@/lib/avatarGenerator';

export const AppLayout: React.FC = () => {
  const { profile, user } = useAuth();
  const location = useLocation();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  const rawAvatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const avatarUrl = sanitizeAvatarUrl(rawAvatarUrl);
  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset.theme;

  // Floating ambient synaptic orbs
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, {
          x: 25,
          y: 20,
          scale: 1.08,
          duration: 7,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
      if (orb2Ref.current) {
        gsap.to(orb2Ref.current, {
          x: -20,
          y: -25,
          scale: 1.05,
          duration: 8.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.5,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  // GSAP Route Transition Animation upon page navigation
  useEffect(() => {
    if (pageContainerRef.current) {
      gsap.fromTo(
        pageContainerRef.current,
        { opacity: 0, y: 14, filter: 'blur(3px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.42,
          ease: 'power2.out',
          clearProps: 'filter',
        }
      );
    }
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen lg:h-screen w-full bg-[#F8FAFC] text-slate-800 flex flex-col lg:flex-row overflow-x-hidden relative selection:bg-blue-100 font-sans"
      style={
        {
          '--theme-primary': theme.primary,
          '--theme-secondary': theme.secondary,
          '--theme-glow': theme.glow,
          '--theme-border': theme.border,
          backgroundImage: theme.pageBgGradient,
        } as React.CSSProperties
      }
    >
      {/* Global Dynamic Radial Light Sheen matching Avatar Theme */}
      <div
        ref={orb1Ref}
        className="fixed top-0 right-0 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full blur-[100px] sm:blur-[140px] pointer-events-none transition-all duration-700 opacity-30 z-0"
        style={{ background: theme.glow }}
      />
      <div
        ref={orb2Ref}
        className="fixed bottom-0 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-[100px] sm:blur-[120px] pointer-events-none transition-all duration-700 opacity-15 z-0"
        style={{ background: theme.glow }}
      />

      {/* Sticky Sidebar Menu */}
      <Sidebar />

      {/* Main Page Content Area with GSAP Route Transition */}
      <main className="flex-1 w-full lg:h-full lg:overflow-y-auto p-3 sm:p-5 md:p-6 lg:p-8 max-w-7xl mx-auto relative z-10">
        <div ref={pageContainerRef} className="w-full">
          <Outlet />
        </div>
      </main>

      {/* Floating DEBLUN OS Style Terminal Launcher Button */}
      {/* Floating DEBLUN OS Style Terminal & Tour Guide Launchers */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => setIsTourOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 shadow-xl flex items-center gap-2 font-sans text-xs cursor-pointer transition-all hover:scale-105 active:scale-95 group select-none"
          title="Interactive Platform Guide"
        >
          <GSAPAvatar avatarId={avatarUrl} size={18} interactive={false} />
          <span className="font-bold text-[11px] text-slate-700 group-hover:text-indigo-600">Guide Tour</span>
          <Compass className="w-3.5 h-3.5 text-indigo-600 group-hover:rotate-45 transition-transform" />
        </button>

        {!isTerminalOpen && (
          <button
            type="button"
            onClick={() => setIsTerminalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#0B0F19] hover:bg-[#111827] text-slate-200 border border-slate-700/80 shadow-xl flex items-center gap-2 font-mono text-xs cursor-pointer transition-all hover:scale-105 active:scale-95 group select-none"
            title="Open MetaMind CLI Terminal"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Terminal className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-6 transition-transform" />
            <span className="font-bold text-[11px] text-slate-300 group-hover:text-white">CLI Terminal</span>
          </button>
        )}
      </div>

      {/* Interactive Floating Neural Terminal Window */}
      <NeuralTerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />

      {/* Platform Interactive Avatar Tour Modal */}
      <AvatarPlatformTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        avatarUrl={avatarUrl}
        userName={profile?.full_name || user?.user_metadata?.full_name || 'Learner'}
      />
    </div>
  );
};


