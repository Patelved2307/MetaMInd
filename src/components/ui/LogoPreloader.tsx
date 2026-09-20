import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface LogoPreloaderProps {
  /** Optional callback fired when the animation completes and curtain lifts */
  onComplete?: () => void;
}

export const LogoPreloader: React.FC<LogoPreloaderProps> = ({ onComplete }) => {
  const [shouldRender, setShouldRender] = useState<boolean>(true);

  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!shouldRender) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      const counterObj = { value: 0 };

      // Initial state
      gsap.set(logoRef.current, { opacity: 0, y: 12 });
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(counterRef.current, { opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = originalOverflow;
          setShouldRender(false);
          onComplete?.();
        },
      });

      // 1. Subtle, refined logo entrance
      tl.to(logoRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power2.out',
      })
      .to(
        counterRef.current,
        {
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out',
        },
        '-=0.25'
      )

      // 2. High-precision minimalist progress glide
      .to(
        lineRef.current,
        {
          scaleX: 1,
          duration: 1.05,
          ease: 'power3.inOut',
        },
        '-=0.15'
      )
      .to(
        counterObj,
        {
          value: 100,
          duration: 1.05,
          ease: 'power3.inOut',
          onUpdate: () => {
            if (counterRef.current) {
              const val = Math.floor(counterObj.value);
              counterRef.current.textContent = val < 10 ? `0${val}` : `${val}`;
            }
          },
        },
        '<'
      )

      // 3. Quick, clean pause then graceful fade-up of the logo content
      .to(
        contentRef.current,
        {
          opacity: 0,
          y: -14,
          duration: 0.3,
          ease: 'power2.in',
        },
        '+=0.12'
      )

      // 4. Silky curtain slide up revealing the website
      .to(
        overlayRef.current,
        {
          yPercent: -100,
          duration: 0.7,
          ease: 'power4.inOut',
        },
        '-=0.08'
      );
    }, overlayRef);

    return () => {
      document.body.style.overflow = originalOverflow;
      ctx.revert();
    };
  }, [shouldRender, onComplete]);

  if (!shouldRender) return null;

  return (
    <div
      ref={overlayRef}
      id="metamind-preloader"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-white select-none pointer-events-auto"
      style={{ willChange: 'transform' }}
      aria-label="Loading MetaMind"
      role="status"
    >
      {/* Central Content */}
      <div
        ref={contentRef}
        className="flex flex-col items-center justify-center space-y-6 px-6"
      >
        {/* Authentic White Brand Logo */}
        <img
          ref={logoRef}
          src="/assets/brand/metamind_logo_white.png"
          alt="MetaMind"
          className="h-11 sm:h-12 w-auto object-contain drop-shadow-sm"
        />

        {/* Minimalist 1px Precision Progress Bar & Two-Digit Counter */}
        <div className="w-44 sm:w-52 space-y-2.5">
          <div className="h-[1px] w-full bg-white/10 overflow-hidden">
            <div
              ref={lineRef}
              className="h-full bg-[#8DD3FF] shadow-[0_0_8px_rgba(141,211,255,0.7)]"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-white/40 tracking-widest">
            <span className="text-[9px] uppercase tracking-widest">Loading</span>
            <span ref={counterRef} className="text-white/60 font-medium">
              00
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
