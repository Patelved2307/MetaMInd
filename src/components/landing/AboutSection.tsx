import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface WordItem {
  text: string;
  isAccent?: boolean;
  isItalic?: boolean;
}

const PHRASE_WORDS: WordItem[] = [
  { text: 'Most', isAccent: false },
  { text: 'tools', isAccent: false },
  { text: 'just', isAccent: false },
  { text: 'answer', isAccent: false, isItalic: true },
  { text: 'questions.', isAccent: false },
  { text: 'MetaMind', isAccent: true, isItalic: true },
  { text: 'diagnoses', isAccent: false },
  { text: 'the', isAccent: false },
  { text: 'hidden', isAccent: false },
  { text: 'prerequisites', isAccent: false },
  { text: 'you', isAccent: false },
  { text: 'need,', isAccent: false },
  { text: 'adapting', isAccent: false },
  { text: 'every', isAccent: false },
  { text: 'concept', isAccent: false },
  { text: 'to', isAccent: false },
  { text: 'build', isAccent: false },
  { text: 'deep,', isAccent: true, isItalic: true },
  { text: 'lasting', isAccent: true, isItalic: true },
  { text: 'mastery.', isAccent: true, isItalic: true },
];

const MILESTONES = [
  { num: '01', title: 'Diagnose', desc: 'Pinpoint conceptual gaps beneath the surface.' },
  { num: '02', title: 'Adapt', desc: 'Calibrate every explanation to your true comprehension.' },
  { num: '03', title: 'Master', desc: 'Retain complex topics with structured cognitive maps.' },
];

export const AboutSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLHeadingElement>(null);
  const milestonesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const textContainer = textContainerRef.current;
    if (!container || !textContainer) return;

    const ctx = gsap.context(() => {
      const words = textContainer.querySelectorAll<HTMLSpanElement>('.reveal-word');

      // Initial state: dim, lighter than regular text
      gsap.set(words, {
        opacity: 0.2,
        color: 'rgba(255, 255, 255, 0.2)',
      });
      gsap.set(milestonesRef.current, {
        opacity: 0.35,
        y: 20,
      });

      // Natural flow scroll trigger: words highlight as user scrolls down without freezing the page
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: textContainer,
          start: 'top 75%',
          end: 'bottom 35%',
          scrub: 0.6,
        },
      });

      // Word-by-word progressive illumination synced with natural scroll
      words.forEach((word) => {
        const isAccent = word.getAttribute('data-accent') === 'true';

        tl.to(
          word,
          {
            opacity: 1,
            color: isAccent ? '#8DD3FF' : '#FFFFFF',
            textShadow: isAccent
              ? '0 0 20px rgba(141, 211, 255, 0.45)'
              : '0 0 12px rgba(255, 255, 255, 0.2)',
            duration: 0.25,
            ease: 'power1.out',
          },
          '>-0.08'
        );
      });

      // Milestones gently illuminate as the scroll reaches them
      if (milestonesRef.current) {
        gsap.to(milestonesRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: milestonesRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative bg-black text-white selection:bg-white/20 selection:text-white py-24 md:py-36 px-6 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto w-full relative z-10 space-y-16 md:space-y-24">
        {/* Subtle Ambient Radial Highlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.015] rounded-full blur-[140px] pointer-events-none" />

        {/* Small Tag Header */}
        <div>
          <p className="text-white/40 text-xs tracking-widest uppercase font-mono">
            01 / The Core Shift
          </p>
        </div>

        {/* Central Editorial Heading with Responsive Readable Scale */}
        <div className="py-4">
          <h2
            ref={textContainerRef}
            className="text-3xl sm:text-5xl md:text-6xl font-serif tracking-tight leading-[1.22] text-white select-none max-w-4xl"
          >
            {PHRASE_WORDS.map((item, idx) => (
              <React.Fragment key={idx}>
                <span
                  className={`reveal-word inline-block will-change-[color,opacity] ${
                    item.isItalic ? 'italic' : ''
                  }`}
                  data-accent={item.isAccent ? 'true' : 'false'}
                >
                  {item.text}
                </span>{' '}
              </React.Fragment>
            ))}
          </h2>
        </div>

        {/* Bottom Minimalist 3-Step Milestones */}
        <div
          ref={milestonesRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pt-10 border-t border-white/10 will-change-transform"
        >
          {MILESTONES.map((m) => (
            <div key={m.num} className="space-y-2">
              <span className="text-xs font-mono text-white/40 tracking-wider">
                {m.num}
              </span>
              <h4 className="text-base sm:text-lg font-bold text-white tracking-tight font-sans">
                {m.title}
              </h4>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-sans">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
