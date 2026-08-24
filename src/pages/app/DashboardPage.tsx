import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { useLearning } from '@/features/learning';
import { getAvatarPresetByUrl, generateAvatarUrl } from '@/lib/avatarGenerator';
import { AvatarSelectorModal } from '@/components/ui/AvatarSelectorModal';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Target,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Play,
  Trophy,
  Award,
  FileCheck,
  Compass,
  UserCheck,
  Search,
  Zap,
} from 'lucide-react';

const EXAMPLE_DOUBTS = [
  "I don't understand SQL JOINs",
  'Explain recursion to me',
  'Help me understand photosynthesis',
  'Teach me machine learning from basics',
];

export const DashboardPage: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const {
    sessions,
    startLearningJourney,
    selectSession,
    loading,
    loadingMessage,
    error,
    clearError,
  } = useLearning();

  const navigate = useNavigate();
  const [queryInput, setQueryInput] = useState('');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const username = profile?.username || 'learner';
  const avatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');

  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset.theme;

  const handleStartJourney = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryToUse = customQuery || queryInput;
    if (!queryToUse.trim()) return;

    try {
      await startLearningJourney(queryToUse);
      navigate('/app/learning-map');
    } catch {
      // Error handled in context
    }
  };

  const handleContinueSession = (sessionId: string) => {
    selectSession(sessionId);
    navigate('/app/learning-map');
  };

  const handleSelectAvatar = async (newUrl: string) => {
    try {
      await updateProfile({ avatar_url: newUrl });
    } catch (err) {
      console.error('Failed to update avatar:', err);
    }
  };

  return (
    <div className="space-y-10 relative selection:bg-white/20 pb-12 max-w-6xl mx-auto">
      {/* Dynamic Ambient Background Glow */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 opacity-40 z-0"
        style={{ background: theme.glow }}
      />

      {/* HERO SECTION — PRIMARY AI COMMAND CENTER */}
      <section className="relative z-10">
        <div
          className={`focus-card rounded-3xl p-8 sm:p-10 border relative overflow-hidden bg-gradient-to-r ${theme.heroGradient}`}
          style={{ borderColor: theme.border }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Side: Topic / Doubt Search */}
            <div className="lg:col-span-7 space-y-6">
              {/* Persona Tag & XP Level */}
              <div className="flex flex-wrap items-center gap-3">
                <div
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border cursor-pointer hover:scale-105 transition-all shadow-sm"
                  style={{ borderColor: theme.border }}
                >
                  <UserCheck className="w-4 h-4" style={{ color: theme.badgeText }} />
                  <span className="text-xs font-semibold" style={{ color: theme.badgeText }}>
                    {activePreset.name} • @{username}
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/90">
                  <Trophy className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Level 4 Scholar • 1,450 XP</span>
                </div>
              </div>

              {/* Main Heading */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight leading-tight">
                  What topic would you like to master today?
                </h1>
                <p className="text-sm sm:text-base text-white/70 font-sans leading-relaxed">
                  Enter any doubt or topic. Our AI transforms it into an interactive concept map and diagnostic assessment.
                </p>
              </div>

              {/* High-Contrast Search Input Bar */}
              <form onSubmit={(e) => handleStartJourney(e)} className="pt-1">
                <div
                  className="focus-card rounded-2xl p-2 flex flex-col sm:flex-row items-center gap-3 border transition-all focus-within:border-2"
                  style={{ borderColor: theme.primary }}
                >
                  <div className="flex items-center gap-2 pl-3 w-full sm:w-auto flex-1">
                    <Search className="w-5 h-5 text-white/40 shrink-0" />
                    <input
                      type="text"
                      value={queryInput}
                      onChange={(e) => {
                        setQueryInput(e.target.value);
                        if (error) clearError();
                      }}
                      placeholder="Ask anything... e.g. 'I don't understand SQL JOINs'"
                      className="w-full bg-transparent text-white placeholder:text-white/40 text-sm sm:text-base py-3 outline-none border-none"
                      disabled={loading}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={loading}
                    className="w-full sm:w-auto font-semibold shrink-0 cursor-pointer px-6 py-3.5 border-none focus-button shadow-xl"
                    style={{ backgroundColor: theme.primary, color: '#05070A' }}
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Start Journey
                  </Button>
                </div>
              </form>

              {/* Error Notice */}
              {error && (
                <div className="p-3.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444] flex items-center justify-between">
                  <span>{error}</span>
                  <button onClick={clearError} className="text-xs underline font-medium cursor-pointer">Dismiss</button>
                </div>
              )}

              {/* AI Loading State */}
              {loading && (
                <div className="p-4 rounded-xl focus-card border flex items-center justify-center gap-3 text-sm text-white" style={{ borderColor: theme.border }}>
                  <Sparkles className="w-5 h-5 animate-spin" style={{ color: theme.primary }} />
                  <span className="font-medium animate-pulse">{loadingMessage || 'Analyzing topic & building concept graph...'}</span>
                </div>
              )}

              {/* Shortcut Doubts */}
              <div className="pt-1">
                <p className="text-[11px] text-white/50 uppercase tracking-widest font-semibold mb-2">
                  Popular topics:
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {EXAMPLE_DOUBTS.map((doubt) => (
                    <button
                      key={doubt}
                      type="button"
                      onClick={() => {
                        setQueryInput(doubt);
                        handleStartJourney(undefined, doubt);
                      }}
                      className="px-3 py-1.5 rounded-full bg-white/5 text-xs text-white/80 hover:text-white border border-white/10 hover:border-white/30 focus-button cursor-pointer"
                    >
                      "{doubt}"
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side: Clean 3D Persona Display */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative pt-4 lg:pt-0">
              <div
                onClick={() => setIsAvatarModalOpen(true)}
                className="group relative flex flex-col items-center justify-center cursor-pointer transition-all duration-300 w-full max-w-sm"
              >
                {/* Glow Backdrop Disk */}
                <div
                  className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full blur-[75px] opacity-50 transition-all pointer-events-none"
                  style={{ backgroundColor: theme.primary }}
                />

                <div
                  className="absolute bottom-6 w-48 h-10 sm:w-56 sm:h-12 rounded-[100%] blur-md pointer-events-none opacity-80"
                  style={{ backgroundColor: theme.primary }}
                />

                {/* 3D PERSONA CHARACTER */}
                <div className="relative z-10 w-60 h-72 sm:w-72 sm:h-80 overflow-hidden flex items-end justify-center">
                  <img
                    src={avatarUrl}
                    alt="3D Character Persona"
                    className="w-full h-full object-contain pointer-events-none filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-300 [mask-image:linear-gradient(to_bottom,black_70%,transparent_96%)]"
                  />
                </div>

                {/* Persona Badge Pill */}
                <div
                  className="relative z-20 -mt-2 px-4 py-2 rounded-2xl bg-[#0D1117]/90 border border-white/15 shadow-xl flex items-center gap-2 text-xs font-semibold text-white group-hover:scale-105 transition-all"
                  style={{ borderColor: theme.border }}
                >
                  <Sparkles className="w-4 h-4" style={{ color: theme.badgeText }} />
                  <span>{activePreset.name}</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}>
                    3D Persona
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GAMIFIED DAILY QUEST CARD */}
      <section className="relative z-10">
        <div className="focus-card rounded-2xl p-5 border border-white/10 bg-gradient-to-r from-white/[0.02] via-white/[0.05] to-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl border" style={{ backgroundColor: theme.badgeBg, borderColor: theme.border }}>
              <Zap className="w-5 h-5" style={{ color: theme.badgeText }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-white/60">Daily Learning Quest</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] font-bold">+150 XP</span>
              </div>
              <p className="text-sm font-semibold text-white">Complete 1 Diagnostic Assessment & Practice Session today</p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleStartJourney(undefined, "SQL JOINs")}
            className="shrink-0 text-xs bg-white/5 text-white border-white/15 hover:bg-white/10 focus-button cursor-pointer"
          >
            Start Daily Quest →
          </Button>
        </div>
      </section>

      {/* ACTIVE LEARNING JOURNEY (CONTINUE LEARNING) */}
      <section className="space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-white">Continue Learning</h2>
            <p className="text-xs text-white/60">Resume your in-progress topics right where you left off</p>
          </div>
        </div>

        {sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="focus-card rounded-2xl p-5 border border-white/10 space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/70">
                      {session.subject}
                    </span>
                    <span className="text-xs font-semibold" style={{ color: theme.badgeText }}>
                      {session.progressPercent}%
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#38BDF8] transition-colors">
                    {session.topic}
                  </h3>
                  <p className="text-xs text-white/60 line-clamp-2">
                    Query: "{session.originalQuery}"
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <Progress value={session.progressPercent} variant="accent" size="sm" />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleContinueSession(session.id)}
                    className="w-full flex items-center justify-center gap-2 text-xs bg-white/5 text-white hover:bg-white/10 focus-button cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>Continue Learning</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl focus-card border border-white/10 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-white/40 mx-auto" />
            <p className="text-sm font-medium text-white">No active learning sessions yet</p>
            <p className="text-xs text-white/50">Enter a question or topic above to start your first adaptive learning loop!</p>
          </div>
        )}
      </section>

      {/* QUICK LEARNING TOOLS DOCK */}
      <section className="space-y-4 relative z-10">
        <h2 className="text-2xl font-display font-bold text-white">Learning Tools & Exams</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => navigate('/app/exam')}
            className="p-5 rounded-2xl focus-card border border-white/10 text-left flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E]">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white group-hover:text-[#22C55E] transition-colors">Timed Exam (3 Lives)</p>
                <p className="text-xs text-white/50">Score &ge; 80% to earn certificates</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/app/certificates')}
            className="p-5 rounded-2xl focus-card border border-white/10 text-left flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white group-hover:text-[#38BDF8] transition-colors">My Certificates</p>
                <p className="text-xs text-white/50">View & download verified PDFs</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/app/learning-map')}
            className="p-5 rounded-2xl focus-card border border-white/10 text-left flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[#F59E0B]">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white group-hover:text-[#F59E0B] transition-colors">Visual Concept Map</p>
                <p className="text-xs text-white/50">Explore prerequisites & topic nodes</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
          </button>
        </div>
      </section>

      {/* MASTERY METRICS & INSIGHTS */}
      <section className="space-y-4 relative z-10">
        <h2 className="text-2xl font-display font-bold text-white">Learning Insights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="focus-card rounded-2xl p-5 border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60 uppercase font-semibold">Active Concepts</span>
              <BookOpen className="w-4 h-4" style={{ color: theme.primary }} />
            </div>
            <p className="text-3xl font-bold text-white font-display">5</p>
            <p className="text-xs text-white/60">Active in concept graph</p>
          </div>

          <div className="focus-card rounded-2xl p-5 border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60 uppercase font-semibold">Mastered Concepts</span>
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            </div>
            <p className="text-3xl font-bold text-white font-display">3</p>
            <p className="text-xs text-[#22C55E]">Above 85% mastery score</p>
          </div>

          <div className="focus-card rounded-2xl p-5 border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60 uppercase font-semibold">Strengthening</span>
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <p className="text-3xl font-bold text-white font-display">2</p>
            <p className="text-xs text-[#F59E0B]">LEFT JOIN & Foreign Keys</p>
          </div>

          <div className="focus-card rounded-2xl p-5 border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60 uppercase font-semibold">Study Streak</span>
              <Flame className="w-4 h-4 text-[#EF4444]" />
            </div>
            <p className="text-3xl font-bold text-white font-display">3 Days</p>
            <p className="text-xs text-[#EF4444]">Active Streak 🔥</p>
          </div>
        </div>
      </section>

      {/* RECOMMENDED NEXT STEPS */}
      <section className="space-y-4 relative z-10">
        <h2 className="text-2xl font-display font-bold text-white">Recommended Next Steps</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => handleStartJourney(undefined, "Continue improving LEFT JOIN")}
            className="focus-card rounded-2xl p-5 border border-white/10 hover:border-white/30 transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: theme.primary }} />
              <span className="text-xs font-bold text-white group-hover:text-[#38BDF8]">Recommendation</span>
            </div>
            <p className="text-sm font-semibold text-white">"Continue improving LEFT JOIN"</p>
            <p className="text-xs text-white/60">Strengthen unmatched row behavior with real-world scenarios.</p>
          </div>

          <div
            onClick={() => handleStartJourney(undefined, "Practice recursion base cases")}
            className="focus-card rounded-2xl p-5 border border-white/10 hover:border-white/30 transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-[#A855F7]" />
              <span className="text-xs font-bold text-white group-hover:text-[#A855F7]">Recommendation</span>
            </div>
            <p className="text-sm font-semibold text-white">"Practice recursion base cases"</p>
            <p className="text-xs text-white/60">Prevent stack overflow with base condition logic.</p>
          </div>

          <div
            onClick={() => handleStartJourney(undefined, "Review foreign key relationships")}
            className="focus-card rounded-2xl p-5 border border-white/10 hover:border-white/30 transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#22C55E]" />
              <span className="text-xs font-bold text-white group-hover:text-[#22C55E]">Recommendation</span>
            </div>
            <p className="text-sm font-semibold text-white">"Review foreign key relationships"</p>
            <p className="text-xs text-white/60">Solidify database primary key to foreign key links.</p>
          </div>
        </div>
      </section>

      {/* AVATAR SELECTOR MODAL */}
      <AvatarSelectorModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatarUrl={avatarUrl}
        onSelectAvatar={handleSelectAvatar}
      />
    </div>
  );
};
