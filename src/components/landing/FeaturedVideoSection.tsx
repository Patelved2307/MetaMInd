import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FeaturedVideoSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const videoWrapper = videoWrapperRef.current;
    if (!section || !videoWrapper) return;

    const ctx = gsap.context(() => {
      // Cinematic Full-Bleed Scroll Expansion
      gsap.fromTo(
        videoWrapper,
        {
          scale: 0.9,
          borderRadius: '40px',
        },
        {
          scale: 1,
          borderRadius: '24px',
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'center center',
            scrub: 0.8,
          },
        }
      );

      // Subtle float on the minimal caption
      if (captionRef.current) {
        gsap.fromTo(
          captionRef.current,
          { opacity: 0.6, y: 20 },
          {
            opacity: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 65%',
              end: 'center center',
              scrub: 0.8,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-black py-16 md:py-24 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div
          ref={videoWrapperRef}
          className="relative rounded-3xl overflow-hidden aspect-video border border-white/10 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.9)] will-change-transform"
        >
          {/* Background Video */}
          <video
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          />

          {/* Clean Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

          {/* Minimal Floating Caption Bar */}
          <div
            ref={captionRef}
            className="absolute bottom-0 inset-x-0 p-6 md:p-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 z-10 will-change-transform"
          >
            <div className="space-y-1">
              <p className="text-white/40 text-[11px] font-mono uppercase tracking-widest">
                Adaptive Feedback Engine
              </p>
              <h3 className="text-lg sm:text-2xl font-serif text-white tracking-tight">
                See your thinking evolve in real time.
              </h3>
            </div>

            <Link
              to="/sign-up"
              className="liquid-glass rounded-full px-6 py-2.5 text-white text-xs font-semibold hover:bg-white/15 transition-all flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer shrink-0 border border-white/20"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#8DD3FF]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
