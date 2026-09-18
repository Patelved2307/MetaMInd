import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star } from 'lucide-react';

interface AuthVisualSideProps {
  videoSrc: string;
  quote: string;
  authorName: string;
  authorRole: string;
  avatarSrc: string;
  headline?: string;
  subheadline?: string;
}

export const AuthVisualSide: React.FC<AuthVisualSideProps> = ({
  videoSrc,
  quote,
  authorName,
  authorRole,
  avatarSrc,
  headline = 'Learn deeper. Study smarter.',
  subheadline = 'Your personalized adaptive study space, designed for focused learners.',
}) => {
  return (
    <div className="relative w-full lg:w-1/2 min-h-[460px] lg:min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10 bg-black">
      {/* Background Video - Fully visible, vivid & crisp */}
      <video
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-opacity duration-700"
      />

      {/* Gentle Vignette Gradient (top subtle scrim for logo, bottom gradient for reading quote) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/40 pointer-events-none" />

      {/* Top Header: Brand & Back Navigation */}
      <div className="relative z-10 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <img
            src="/assets/brand/metamind_logo_white.png"
            alt="MetaMind"
            className="h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-xs font-medium text-white/90 hover:text-white transition-all duration-200 backdrop-blur-md cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-indigo-300 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Bottom Area: Clean Human-Crafted Editorial & Student Testimonial */}
      <div className="relative z-10 max-w-lg space-y-6 pt-24 lg:pt-0">
        {/* Simple, Human Headline */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15] font-display">
            {headline}
          </h1>
          <p className="text-sm sm:text-base text-white/80 font-normal leading-relaxed max-w-md">
            {subheadline}
          </p>
        </div>

        {/* Sleek Human Testimonial Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-5 rounded-2xl bg-black/45 border border-white/15 backdrop-blur-xl shadow-2xl space-y-3.5"
        >
          {/* Star Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-2 text-xs font-semibold text-white/90">5.0</span>
          </div>

          {/* Quote */}
          <p className="text-sm text-white/95 leading-relaxed font-sans italic">
            "{quote}"
          </p>

          {/* Human Author with Real Avatar */}
          <div className="flex items-center gap-3 pt-1 border-t border-white/10">
            <img
              src={avatarSrc}
              alt={authorName}
              className="w-9 h-9 rounded-full object-cover ring-1 ring-white/30"
            />
            <div>
              <div className="text-xs font-bold text-white tracking-wide">
                {authorName}
              </div>
              <div className="text-[11px] text-white/60 font-medium">
                {authorRole}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
