import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

export const FeaturedVideoSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-black pt-6 md:pt-10 pb-20 md:pb-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.9 }}
          className="relative rounded-3xl overflow-hidden aspect-video border border-white/10 shadow-2xl"
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

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

          {/* Overlay Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 z-10">
            {/* Approach Glass Card */}
            <div className="liquid-glass rounded-2xl p-6 md:p-8 max-w-lg">
              <p className="text-white/50 text-xs tracking-widest uppercase mb-3 font-medium">
                Our Core Learning Loop
              </p>
              <p className="text-white text-sm md:text-base leading-relaxed">
                "Don't just get an answer. Understand what you need to learn next." Aether extracts prerequisites, generates adaptive diagnostic questions, detects knowledge gaps, and tailors explanations to your demonstrated level.
              </p>
            </div>

            {/* Explore Button */}
            <Link to="/sign-up">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/10 transition-colors shadow-lg"
              >
                Start Learning Journey
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
