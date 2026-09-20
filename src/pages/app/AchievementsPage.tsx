import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '@/features/auth';
import { getAvatarPresetByUrl, generateAvatarUrl } from '@/lib/avatarGenerator';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import {
  Trophy,
  Flame,
  Lock,
  Sparkles,
  ShieldCheck,
  Star,
  Zap,
  Crown,
  PenTool,
  Share2,
  Check,
} from 'lucide-react';
import { motion } from 'framer-motion';

export interface GamifiedBadge {
  id: string;
  title: string;
  bannerText: string;
  category: 'Mastery' | 'Streak' | 'Exam' | 'Squad' | 'Special';
  tier: 'Diamond' | 'Gold' | 'Royal Purple' | 'Emerald';
  description: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  iconBg: string;
  bannerBg: string;
  icon: React.ElementType;
}

const Hexagonal3DBadge: React.FC<{
  badge: GamifiedBadge;
  size?: 'sm' | 'lg';
}> = ({ badge, size = 'sm' }) => {
  const Icon = badge.icon;
  const isLarge = size === 'lg';
  const cardRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -16;
    const rotateY = ((x - centerX) / centerX) * 16;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      transformPerspective: 600,
      ease: 'power1.out',
      duration: 0.2,
    });

    if (sheenRef.current) {
      const sheenX = (x / rect.width) * 100;
      const sheenY = (y / rect.height) * 100;
      gsap.to(sheenRef.current, {
        opacity: 0.65,
        background: `radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 65%)`,
        duration: 0.15,
      });
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      ease: 'power2.out',
      duration: 0.45,
    });
    if (sheenRef.current) {
      gsap.to(sheenRef.current, {
        opacity: 0,
        duration: 0.35,
      });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative flex items-center justify-center select-none cursor-pointer ${
        isLarge ? 'w-36 h-40' : 'w-24 h-28'
      }`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* 3D Outer Hexagon Drop Shadow & Bevel */}
      <div
        className="w-full h-full relative flex items-center justify-center filter drop-shadow-md transition-transform duration-300 group-hover:scale-105"
      >
        {/* Outer Hexagon Metallic Rim */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-white via-slate-200 to-slate-400 p-[3px] shadow-inner"
          style={{
            clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
          }}
        >
          {/* Inner Hexagon Body with Gradient */}
          <div
            className={`w-full h-full bg-gradient-to-br ${badge.iconBg} relative flex items-center justify-center overflow-hidden`}
            style={{
              clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
            }}
          >
            {/* Holographic Cursor Tracking Sheen Layer */}
            <div
              ref={sheenRef}
              className="absolute inset-0 opacity-0 pointer-events-none z-10 transition-opacity duration-200"
              style={{
                clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
              }}
            />

            {/* 3D Top Facet Specular Light Sheen */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/15 to-transparent pointer-events-none"
              style={{
                clipPath: 'polygon(50% 0%, 95% 25%, 50% 50%, 5% 25%)',
              }}
            />

            {/* 3D Bottom Facet Shading */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"
              style={{
                clipPath: 'polygon(50% 100%, 95% 75%, 50% 50%, 5% 75%)',
              }}
            />

            {/* Centered Badge Icon */}
            <Icon
              className={`${
                isLarge ? 'w-16 h-16' : 'w-10 h-10'
              } text-white drop-shadow-md relative z-10 transition-transform group-hover:scale-110`}
            />
          </div>
        </div>

        {/* Top-Right Sparkle Jewel for Unlocked */}
        {badge.unlocked && (
          <div className="absolute -top-1 right-1 w-5 h-5 bg-amber-300 rounded-full flex items-center justify-center text-[10px] text-amber-950 font-bold shadow-md animate-pulse z-20 border border-white">
            ✨
          </div>
        )}

        {/* Locked Dimming Overlay */}
        {!badge.unlocked && (
          <div
            className="absolute inset-0 bg-slate-900/55 backdrop-blur-[2px] flex items-center justify-center text-white z-20"
            style={{
              clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
            }}
          >
            <Lock className={isLarge ? 'w-8 h-8' : 'w-5 h-5 text-white/90 drop-shadow'} />
          </div>
        )}
      </div>
    </div>
  );
};

const BADGES_COLLECTION: GamifiedBadge[] = [
  {
    id: 'badge-1',
    title: 'GoodMates Apex',
    bannerText: 'SQUAD LEADER',
    category: 'Squad',
    tier: 'Royal Purple',
    description: 'Hosted a 25m Pomodoro group study session with 4+ active classmates.',
    xpReward: 300,
    unlocked: true,
    unlockedAt: 'Yesterday',
    iconBg: 'from-amber-400 to-amber-600',
    bannerBg: 'bg-amber-500',
    icon: Crown,
  },
  {
    id: 'badge-2',
    title: 'Verified Writer',
    bannerText: 'VERIFIED WRITER',
    category: 'Mastery',
    tier: 'Diamond',
    description: 'Submitted 5 detailed module practice assignments with 100% accuracy.',
    xpReward: 250,
    unlocked: true,
    unlockedAt: '3 days ago',
    iconBg: 'from-blue-500 to-cyan-500',
    bannerBg: 'bg-blue-600',
    icon: PenTool,
  },
  {
    id: 'badge-3',
    title: 'Good Skill & Speed',
    bannerText: 'SPEED REFILL',
    category: 'Exam',
    tier: 'Gold',
    description: 'Triggered +10s speed time refills 3 times in a single timed exam.',
    xpReward: 350,
    unlocked: true,
    unlockedAt: '2 days ago',
    iconBg: 'from-rose-500 to-red-600',
    bannerBg: 'bg-rose-600',
    icon: Zap,
  },
  {
    id: 'badge-4',
    title: 'Concept Puzzle Solver',
    bannerText: 'PUZZLE MASTER',
    category: 'Mastery',
    tier: 'Emerald',
    description: 'Assembled the correct execution order in 5 interactive concept puzzles.',
    xpReward: 200,
    unlocked: true,
    unlockedAt: '5 days ago',
    iconBg: 'from-emerald-400 to-teal-600',
    bannerBg: 'bg-emerald-600',
    icon: Star,
  },
  {
    id: 'badge-5',
    title: 'Streak Titan (7 Days)',
    bannerText: 'STREAK BOSS',
    category: 'Streak',
    tier: 'Gold',
    description: 'Maintained a 7-day daily study streak without missing a single day.',
    xpReward: 500,
    unlocked: true,
    unlockedAt: 'Today',
    iconBg: 'from-amber-500 to-orange-600',
    bannerBg: 'bg-amber-600',
    icon: Flame,
  },
  {
    id: 'badge-6',
    title: 'Certified Scholar (100% Score)',
    bannerText: 'PERFECT ACCURACY',
    category: 'Exam',
    tier: 'Royal Purple',
    description: 'Scored a perfect 100% on a Hard difficulty timed exam with 3 hearts remaining.',
    xpReward: 750,
    unlocked: false,
    iconBg: 'from-purple-500 to-indigo-700',
    bannerBg: 'bg-purple-600',
    icon: Trophy,
  },
  {
    id: 'badge-7',
    title: 'Yearly Champion',
    bannerText: 'YEARLY LEADER',
    category: 'Special',
    tier: 'Diamond',
    description: 'Reach Level 10 Grandmaster Rank and complete 50 adaptive learning modules.',
    xpReward: 1000,
    unlocked: false,
    iconBg: 'from-cyan-400 to-blue-700',
    bannerBg: 'bg-cyan-600',
    icon: ShieldCheck,
  },
  {
    id: 'badge-8',
    title: 'Vibes & Focus Master',
    bannerText: 'LO-FI FOCUS',
    category: 'Special',
    tier: 'Emerald',
    description: 'Accumulate 10+ hours of ambient Lo-Fi study room focus time.',
    xpReward: 400,
    unlocked: false,
    iconBg: 'from-pink-500 to-rose-600',
    bannerBg: 'bg-pink-600',
    icon: Sparkles,
  },
];

export const AchievementsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const avatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset.theme;

  const [selectedBadge, setSelectedBadge] = useState<GamifiedBadge | null>(null);

  const unlockedCount = BADGES_COLLECTION.filter((b) => b.unlocked).length;
  const totalXP = BADGES_COLLECTION.reduce((acc, b) => (b.unlocked ? acc + b.xpReward : acc), 0);

  // GSAP Badge Card Stagger on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.achievements-header-title',
        { opacity: 0, y: 14, filter: 'blur(3px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out' }
      );
      gsap.fromTo(
        '.achievement-badge-card',
        { opacity: 0, y: 22, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.04, duration: 0.5, ease: 'back.out(1.2)', delay: 0.1 }
      );
    });
    return () => ctx.revert();
  }, []);

  // GSAP 3D Burst Reveal when a badge is inspected
  useEffect(() => {
    if (selectedBadge) {
      requestAnimationFrame(() => {
        gsap.fromTo(
          '.badge-modal-content',
          { scale: 0.65, opacity: 0, y: 24 },
          { scale: 1, opacity: 1, y: 0, duration: 0.55, ease: 'back.out(1.5)' }
        );
        gsap.fromTo(
          '.badge-burst-particle',
          { scale: 0, opacity: 1 },
          { scale: 1.6, opacity: 0, stagger: 0.05, duration: 0.65, ease: 'power2.out' }
        );
      });
    }
  }, [selectedBadge]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 relative selection:bg-blue-100 text-slate-800">
      {/* Light Radial Ambient Glow */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-20 z-0"
        style={{ background: theme.glow }}
      />

      {/* HEADER */}
      <div id="tour-achievements-hero" className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold font-mono flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-600" /> 3D Gamification Tiers
            </span>
            <span className="text-xs text-slate-500 font-mono">{unlockedCount} / {BADGES_COLLECTION.length} Unlocked</span>
          </div>
          <h1 className="achievements-header-title font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Gamified <span className="text-shimmer-gradient">Badges & Rank Medals</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-sans">
            Earn high-status 3D hexagonal badges and medals as you solve concept puzzles, maintain focus streaks, and pass timed exams.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/app/certificates')}
          className="font-bold cursor-pointer shadow-md hover:scale-105 shrink-0"
          style={{ backgroundColor: theme.primary, color: '#FFFFFF' }}
          rightIcon={<ShieldCheck className="w-4 h-4" />}
        >
          My Certificates
        </Button>
      </div>

      {/* LEVEL & XP PROGRESS BANNER */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md space-y-5 relative z-10 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl border-2 flex items-center justify-center shadow-md shrink-0 bg-white"
              style={{ borderColor: theme.primary }}
            >
              <Trophy className="w-8 h-8" style={{ color: theme.primary }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-600 uppercase">
                  Active Student Rank
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold border border-emerald-200">
                  Top 5% Learner
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                Level 4 Master Scholar
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {totalXP} Total Gamification XP earned across all subjects
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-3xl font-extrabold font-display text-slate-900">{totalXP}</span>
            <span className="text-xs font-mono text-slate-500"> / 2,500 XP</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200 shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${(totalXP / 2500) * 100}%`, backgroundColor: theme.primary }}
          />
        </div>
      </div>

      {/* GAMIFIED 3D BADGES GRID (INSPIRED BY REFERENCE IMAGES) */}
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            3D Hexagonal Badges & Ribbons
          </h2>
          <span className="text-xs text-slate-500 font-mono">Click any badge to inspect</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {BADGES_COLLECTION.map((badge) => {
            return (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedBadge(badge)}
                className={`achievement-badge-card relative flex flex-col items-center p-5 rounded-3xl border transition-all cursor-pointer group ${
                  badge.unlocked
                    ? 'bg-white border-slate-200/90 shadow-md hover:shadow-xl'
                    : 'bg-slate-50/80 border-slate-200/50 opacity-65 grayscale'
                }`}
              >
                {/* AUTHENTIC 3D HEXAGON BADGE WITH SPECULAR DEPTH */}
                <div className="my-2">
                  <Hexagonal3DBadge badge={badge} size="sm" />
                </div>

                {/* BOTTOM 3D RIBBON BANNER */}
                <div
                  className={`mt-3 px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-wider text-white shadow-md text-center w-full truncate ${badge.bannerBg}`}
                >
                  {badge.bannerText}
                </div>

                {/* Badge Title & XP - No ugly cutoff */}
                <div className="text-center mt-3 space-y-1 w-full px-1">
                  <p className="text-xs font-bold text-slate-900 line-clamp-2 min-h-[32px] flex items-center justify-center leading-tight">
                    {badge.title}
                  </p>
                  <p className="text-[10px] font-mono font-bold text-amber-600">
                    +{badge.xpReward} XP
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* BADGE INSPECTION DIALOG MODAL */}
      <Dialog
        isOpen={!!selectedBadge}
        onClose={() => setSelectedBadge(null)}
        title="3D Badge Inspection"
        description="View unlock criteria, rank status, and earned gamification points."
      >
        {selectedBadge && (
          <div className="badge-modal-content space-y-6 pt-3 text-center relative overflow-hidden">
            {/* Burst Particles */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="badge-burst-particle absolute w-2 h-2 rounded-full bg-amber-400"
                  style={{
                    transform: `rotate(${i * 45}deg) translate(80px)`,
                  }}
                />
              ))}
            </div>

            {/* BIG 3D HEXAGON BADGE DISPLAY */}
            <div className="py-2 flex justify-center relative z-10">
              <Hexagonal3DBadge badge={selectedBadge} size="lg" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-mono font-bold">
                  {selectedBadge.tier} Tier
                </span>
                <span className="px-3 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-mono font-bold">
                  +{selectedBadge.xpReward} XP
                </span>
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900">
                {selectedBadge.title}
              </h3>
              <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
                {selectedBadge.description}
              </p>
            </div>

            {/* UNLOCK STATUS BOX */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 flex items-center justify-between">
              <span>Unlock Status:</span>
              {selectedBadge.unlocked ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Unlocked ({selectedBadge.unlockedAt})
                </span>
              ) : (
                <span className="text-rose-600 font-bold flex items-center gap-1">
                  <Lock className="w-4 h-4" /> Locked Badge
                </span>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setSelectedBadge(null)}>
                Close
              </Button>
              {selectedBadge.unlocked && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => alert(`Badge "${selectedBadge.title}" share card copied to clipboard!`)}
                  className="font-bold text-xs cursor-pointer shadow-sm text-white"
                  style={{ backgroundColor: theme.primary }}
                  rightIcon={<Share2 className="w-4 h-4" />}
                >
                  Share Badge
                </Button>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
