import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const capabilities = [
  {
    tag: 'Concept Mapping',
    title: 'Doubt to Concept Path',
    description: 'Transform any raw question into an interactive concept tree and prerequisite roadmap.',
    videoUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4',
    link: '/sign-up',
  },
  {
    tag: 'Diagnostic Testing',
    title: 'Adaptive Gap Detection',
    description: 'Dynamic challenge questions that adjust in real-time to pinpoint hidden weaknesses.',
    videoUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4',
    link: '/sign-up',
  },
];

export const ServicesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;
    if (!section || !cards) return;

    const ctx = gsap.context(() => {
      const cardElements = cards.querySelectorAll('.service-card');

      gsap.fromTo(
        cardElements,
        {
          y: 45,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cards,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="pricing" className="bg-black py-24 md:py-36 px-6 overflow-hidden relative">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl text-white tracking-tight font-serif">
            Platform Capabilities
          </h2>
          <span className="text-white/40 text-xs font-mono uppercase tracking-widest hidden md:inline">
            02 / Core Modules
          </span>
        </div>

        {/* Two-card Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {capabilities.map((item) => (
            <div
              key={item.title}
              className="service-card liquid-glass rounded-3xl overflow-hidden group cursor-pointer border border-white/10 hover:border-white/20 transition-all duration-500 shadow-2xl"
            >
              <Link to={item.link}>
                {/* Card Video Container */}
                <div className="relative aspect-video overflow-hidden">
                  <video
                    src={item.videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Card Text Content */}
                <div className="p-6 md:p-8 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8DD3FF] font-mono text-xs tracking-widest uppercase">
                      {item.tag}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 group-hover:text-white group-hover:bg-white/15 transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-white/60 text-sm leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
