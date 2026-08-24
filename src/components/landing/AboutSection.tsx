import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export const AboutSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} id="about" className="bg-black pt-32 md:pt-44 pb-10 md:pb-14 px-6 overflow-hidden relative">
      {/* Subtle radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-white/40 text-sm tracking-widest uppercase mb-6 font-medium"
        >
          The Problem & Solution
        </motion.p>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight font-serif"
        >
          Generic answers <span className="font-sans text-[#8B94A3] font-normal">don't build</span>{' '}
          <span className="italic text-white/60">deep mastery.</span>{' '}
          <br className="hidden md:inline" />
          <span className="italic text-white/60">Aether diagnoses</span>{' '}
          <span className="font-sans text-[#8B94A3] font-normal">the hidden</span>{' '}
          <span className="italic text-white/60">prerequisites you need.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 text-sm md:text-base text-white/70 max-w-3xl leading-relaxed font-sans"
        >
          Traditional tools answer questions without diagnosing missing prerequisite knowledge or mistake patterns. Aether transforms every doubt into a structured adaptive loop: <strong className="text-white">Discover → Assess → Analyze → Personalize → Master.</strong>
        </motion.p>
      </div>
    </section>
  );
};
