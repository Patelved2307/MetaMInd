import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe } from 'lucide-react';
import { AboutSection } from '@/components/landing/AboutSection';
import { FeaturedVideoSection } from '@/components/landing/FeaturedVideoSection';
import { PhilosophySection } from '@/components/landing/PhilosophySection';
import { ServicesSection } from '@/components/landing/ServicesSection';
import { Footer } from '@/components/landing/Footer';

export const LandingPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [doubtInput, setDoubtInput] = useState('');

  // Vanilla JS Video fade logic via refs & requestAnimationFrame
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animId: number;
    let isFadingOut = false;

    video.style.opacity = '0';

    const fade = (startOpacity: number, targetOpacity: number, duration: number, callback?: () => void) => {
      const startTime = performance.now();
      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentOpacity = startOpacity + (targetOpacity - startOpacity) * progress;
        if (video) {
          video.style.opacity = currentOpacity.toString();
        }
        if (progress < 1) {
          animId = requestAnimationFrame(step);
        } else if (callback) {
          callback();
        }
      };
      animId = requestAnimationFrame(step);
    };

    const handleCanPlay = () => {
      video.play().catch(() => {});
      fade(0, 1, 500);
    };

    const handleTimeUpdate = () => {
      if (video.duration && video.duration - video.currentTime <= 0.55 && !isFadingOut) {
        isFadingOut = true;
        const currentOpacity = parseFloat(video.style.opacity || '1');
        fade(currentOpacity, 0, 500);
      }
    };

    const handleEnded = () => {
      if (video) {
        video.style.opacity = '0';
        setTimeout(() => {
          video.currentTime = 0;
          isFadingOut = false;
          video.play().catch(() => {});
          fade(0, 1, 500);
        }, 100);
      }
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    if (video.readyState >= 3) {
      handleCanPlay();
    }

    return () => {
      cancelAnimationFrame(animId);
      if (video) {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  const handleStartDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirects to sign-up / onboarding with initial doubt context
    window.location.href = `/sign-up?doubt=${encodeURIComponent(doubtInput || "I don't understand SQL JOINs")}`;
  };

  return (
    <div className="bg-black text-white min-h-screen selection:bg-white/20 selection:text-white">
      {/* SECTION 1 -- HERO */}
      <section className="min-h-screen overflow-hidden relative flex flex-col justify-between">
        {/* Background Video with Vanilla JS Fade Logic */}
        <video
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4"
          muted
          autoPlay
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none"
        />

        {/* Video Overlay Gradient for Crisp Unobstructed View */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

        {/* Navbar */}
        <header className="relative z-20 px-6 py-6 w-full">
          <div className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between shadow-2xl">
            {/* Left Brand + Nav */}
            <div className="flex items-center gap-2.5">
              <img src="/assets/brand/metamind_logo_white.png" alt="MetaMind" className="h-10 w-auto object-contain" />

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-8 ml-8">
                <a href="#about" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                  The Problem
                </a>
                <a href="#features" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                  Adaptive Loop
                </a>
                <a href="#pricing" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                  Modules
                </a>
              </nav>
            </div>

            {/* Right Buttons */}
            <div className="flex items-center gap-4">
              <Link to="/sign-up" className="text-white text-sm font-medium hover:text-white/80 transition-colors cursor-pointer">
                Sign Up
              </Link>
              <Link
                to="/sign-in"
                className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
              >
                Login
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Main Content (Unobstructed BG Hero Visibility) */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-8 text-center space-y-6 max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tight whitespace-nowrap font-serif drop-shadow-lg">
            Know it then <em className="italic">all</em>.
          </h1>

          {/* Input Form */}
          <form onSubmit={handleStartDoubt} className="max-w-xl w-full">
            <div className="liquid-glass rounded-full pl-6 pr-2 py-2.5 flex items-center gap-3 shadow-2xl border border-white/20 focus-within:border-[#8DD3FF]/60 transition-colors">
              <input
                type="text"
                value={doubtInput}
                onChange={(e) => setDoubtInput(e.target.value)}
                placeholder="Ask any doubt... e.g. 'I don't understand SQL JOINs'"
                className="w-full bg-transparent text-white placeholder:text-white/50 text-sm outline-none border-none"
              />
              <button
                type="submit"
                className="bg-[#8DD3FF] text-[#05070A] font-semibold rounded-full px-5 py-2.5 hover:bg-[#a6deff] active:scale-95 transition-all flex items-center gap-1.5 shrink-0 text-xs cursor-pointer shadow-md"
              >
                <span>Start Loop</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Subtitle */}
          <p className="text-white/90 text-xs sm:text-sm leading-relaxed max-w-lg px-4 drop-shadow-sm font-sans">
            Don't just get an answer. Understand what you need to learn next. MetaMind transforms questions into adaptive concept maps and gap analysis.
          </p>
        </div>

        {/* Social Icons Footer */}
        <div className="relative z-10 flex justify-center gap-4 pb-8">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="liquid-glass rounded-full p-3.5 text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>

          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="liquid-glass rounded-full p-3.5 text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          <a
            href="#"
            className="liquid-glass rounded-full p-3.5 text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
          >
            <Globe className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* SECTION 2 -- ABOUT SECTION */}
      <AboutSection />

      {/* SECTION 3 -- FEATURED VIDEO */}
      <FeaturedVideoSection />

      {/* SECTION 4 -- PHILOSOPHY / INNOVATION x VISION */}
      <PhilosophySection />

      {/* SECTION 5 -- SERVICES / WHAT WE DO */}
      <ServicesSection />

      {/* FOOTER */}
      <Footer />
    </div>
  );
};
