import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/features/auth';
import { getAvatarPresetByUrl, generateAvatarUrl, sanitizeAvatarUrl } from '@/lib/avatarGenerator';

export const AppLayout: React.FC = () => {
  const { profile, user } = useAuth();
  const location = useLocation();
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
    <div className="min-h-screen lg:h-screen w-full bg-[#F8FAFC] text-slate-800 flex flex-col lg:flex-row overflow-x-hidden relative selection:bg-blue-100 font-sans">
      {/* Global Dynamic Radial Light Sheen matching Avatar Theme */}
      <div
        ref={orb1Ref}
        className="fixed top-0 right-0 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full blur-[100px] sm:blur-[140px] pointer-events-none transition-all duration-700 opacity-25 z-0"
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
    </div>
  );
};

