import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { getAvatarPresetByUrl, generateAvatarUrl } from '@/lib/avatarGenerator';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import {
  Award,
  Trophy,
  Flame,
  CheckCircle2,
  Lock,
  Sparkles,
  ShieldCheck,
  Star,
  FileCheck,
} from 'lucide-react';

const ACHIEVEMENTS = [
  {
    id: 'ach_1',
    title: 'First Step Scholar',
    description: 'Created your first AI adaptive learning session.',
    xp: '+100 XP',
    icon: Star,
    unlocked: true,
    category: 'Learning',
  },
  {
    id: 'ach_2',
    title: 'Diagnostic Pioneer',
    description: 'Completed a diagnostic assessment and identified knowledge gaps.',
    xp: '+150 XP',
    icon: Sparkles,
    unlocked: true,
    category: 'Assessment',
  },
  {
    id: 'ach_3',
    title: 'Concept Master',
    description: 'Achieved > 85% concept mastery score on a core topic.',
    xp: '+250 XP',
    icon: Trophy,
    unlocked: true,
    category: 'Mastery',
  },
  {
    id: 'ach_4',
    title: 'Exam Champion (80%+ Pass)',
    description: 'Passed an official timed exam with 80% or higher accuracy.',
    xp: '+300 XP',
    icon: FileCheck,
    unlocked: true,
    category: 'Exam',
  },
  {
    id: 'ach_5',
    title: '3-Day Learning Streak',
    description: 'Maintained active daily learning sessions for 3 consecutive days.',
    xp: '+200 XP',
    icon: Flame,
    unlocked: true,
    category: 'Streak',
  },
  {
    id: 'ach_6',
    title: 'Hard Exam conqueror',
    description: 'Complete a Hard difficulty timed exam with 3 heart lives remaining.',
    xp: '+500 XP',
    icon: Lock,
    unlocked: false,
    category: 'Challenge',
  },
];

export const AchievementsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const avatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset.theme;

  return (
    <div className="max-w-5xl mx-auto space-y-8 relative selection:bg-white/20">
      {/* Background Sheen */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-all opacity-40 z-0"
        style={{ background: theme.glow }}
      />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="warning" className="gap-1">
              <Award className="w-3.5 h-3.5 text-[#F4C56A]" />
              Gamification & Ranks
            </Badge>
            <span className="text-xs text-white/50 font-mono">1,450 Total XP</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-white tracking-tight">
            Achievements & Badges
          </h1>
          <p className="text-xs sm:text-sm text-white/70 mt-1">
            Track your milestone achievements, level promotions, and earned gamification badges.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/app/certificates')}
          className="font-semibold cursor-pointer shadow-lg border-none shrink-0"
          style={{ backgroundColor: theme.primary, color: '#05070A' }}
          rightIcon={<ShieldCheck className="w-4 h-4" />}
        >
          My Certificates
        </Button>
      </div>

      {/* LEVEL & XP PROGRESS BANNER */}
      <div
        className="liquid-glass rounded-3xl p-6 sm:p-8 border space-y-5 relative z-10 shadow-2xl bg-gradient-to-r"
        style={{ borderColor: theme.border }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl border flex items-center justify-center shadow-xl shrink-0"
              style={{ backgroundColor: theme.badgeBg, borderColor: theme.border }}
            >
              <Trophy className="w-8 h-8" style={{ color: theme.badgeText }} />
            </div>
            <div>
              <span className="text-xs font-mono uppercase font-bold" style={{ color: theme.badgeText }}>
                Current Rank Level
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-white">Level 4 Scholar</h2>
              <p className="text-xs text-white/60">550 XP remaining until Level 5 Master Promotion</p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-2xl font-bold text-white">1,450</span>
            <span className="text-xs text-white/50 font-mono"> / 2,000 XP</span>
          </div>
        </div>

        <Progress value={72.5} variant="accent" size="sm" />
      </div>

      {/* ACHIEVEMENTS GRID */}
      <div className="space-y-4 relative z-10">
        <h2 className="text-2xl font-serif text-white">Unlocked Badges & Milestones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ACHIEVEMENTS.map((ach) => {
            const Icon = ach.icon;

            return (
              <div
                key={ach.id}
                className={`p-6 rounded-3xl border transition-all flex items-start justify-between gap-4 ${
                  ach.unlocked
                    ? 'liquid-glass border-white/15 bg-white/[0.03]'
                    : 'bg-[#05070A]/60 border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-2xl border shrink-0 ${
                      ach.unlocked ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${ach.unlocked ? 'text-[#F4C56A]' : 'text-white/30'}`} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-white">{ach.title}</h3>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-white/50">
                        {ach.category}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">{ach.description}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-[#F4C56A]">{ach.xp}</span>
                  {ach.unlocked && <CheckCircle2 className="w-4 h-4 text-[#7ED6A5] mt-1 ml-auto" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
