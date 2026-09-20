import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const PhilosophySection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const videoColRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Heading Reveal
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Smooth Dual-Column Parallax Scrub
      if (videoColRef.current && textColRef.current) {
        gsap.fromTo(
          videoColRef.current,
          { y: 30 },
          {
            y: -30,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );

        gsap.fromTo(
          textColRef.current,
          { y: -20 },
          {
            y: 20,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="features" className="bg-black py-24 md:py-36 px-6 overflow-hidden relative">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Heading */}
        <h2
          ref={headingRef}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight mb-16 md:mb-24 will-change-transform font-serif"
        >
          Adaptive Intelligence{' '}
          <span className="italic text-white/40 font-normal">x</span>{' '}
          Mastery
        </h2>

        {/* Two-column Layout with Minimalist Breathing Room */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left Column: Visual Video */}
          <div
            ref={videoColRef}
            className="rounded-3xl overflow-hidden aspect-[4/3] border border-white/10 shadow-2xl relative group will-change-transform"
          >
            <video
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Right Column: 2 Crisp, Impactful Statements */}
          <div ref={textColRef} className="space-y-12 will-change-transform">
            {/* Block 1 */}
            <div className="space-y-3">
              <span className="text-[#8DD3FF] font-mono text-xs tracking-widest uppercase">
                01 / Calibrated To You
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
                Never too simple. Never overwhelming.
              </h3>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed font-sans">
                Every explanation dynamically shifts to match your demonstrated comprehension — meeting you exactly where your understanding currently lives.
              </p>
            </div>

            <div className="w-full h-px bg-white/10" />

            {/* Block 2 */}
            <div className="space-y-3">
              <span className="text-white/40 font-mono text-xs tracking-widest uppercase">
                02 / Zero Guesswork
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
                Progress you can see and measure.
              </h3>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed font-sans">
                Watch your concept mastery graph evolve in real-time, diagnose latent blindspots, and earn verified skill certificates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
