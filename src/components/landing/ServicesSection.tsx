import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    tag: 'AI Learn & Concept Discovery',
    title: 'Doubt to Concept Path',
    description: 'Submit any question or topic. MetaMind automatically extracts the subject, main topic, prerequisite concepts, and underlying dependencies.',
    videoUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4',
    link: '/sign-up',
  },
  {
    tag: 'Adaptive Assessment & Analysis',
    title: 'Diagnostic Gap Detection',
    description: 'Answer dynamic questions that adjust in real-time to your reasoning. Receive granular breakdown reports of strong vs. weak concept nodes.',
    videoUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4',
    link: '/sign-up',
  },
];

export const ServicesSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} id="pricing" className="bg-black py-28 md:py-40 px-6 overflow-hidden relative">
      {/* Radial Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
          className="flex items-center justify-between mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl text-white tracking-tight font-semibold">
            Platform Capabilities
          </h2>
          <span className="text-white/40 text-sm hidden md:inline font-medium">
            Core Learning Modules
          </span>
        </motion.div>

        {/* Two-card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="liquid-glass rounded-3xl overflow-hidden group cursor-pointer border border-white/10"
            >
              <Link to={service.link}>
                {/* Card Video Container */}
                <div className="relative aspect-video overflow-hidden">
                  <video
                    src={service.videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Card Body */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="uppercase tracking-widest text-white/40 text-xs font-semibold">
                      {service.tag}
                    </span>
                    <div className="liquid-glass rounded-full p-2 text-white/80 group-hover:text-white transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-white text-xl md:text-2xl mb-3 tracking-tight font-medium">
                    {service.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
