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
  Code2,
  Layers,
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
    <div className="space-y-12 relative selection:bg-white/20 pb-12">
      {/* Background Radial Glow */}
      <div
        className="fixed top-0 right-0 w-[750px] h-[750px] rounded-full blur-[160px] pointer-events-none transition-all duration-700 opacity-50 z-0"
        style={{ background: theme.glow }}
      />

      {/* SECTION 1 — FUNKY CREATIVE AI COMMAND CENTER HERO */}
      <section className="relative z-10">
        <div
          className={`funky-card rounded-[2.5rem] p-6 sm:p-10 lg:p-12 border relative overflow-hidden transition-all duration-500 bg-gradient-to-r ${theme.heroGradient}`}
          style={{ borderColor: theme.border }}
        >
          {/* Decorative Floating Geometric Line Accents */}
          <div className="absolute top-4 right-1/3 w-32 h-32 border border-white/5 rounded-full pointer-events-none animate-spin-slow" />
          <div className="absolute -bottom-10 left-1/4 w-40 h-40 border border-white/5 rotate-45 pointer-events-none" />

          {/* Floating Ambient Glow Accent */}
          <div
            className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full blur-3xl opacity-35 pointer-events-none"
            style={{ backgroundColor: theme.primary }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: Command Center Text & Input */}
            <div className="lg:col-span-7 space-y-6">
              {/* Persona Badge & XP Counter */}
              <div className="flex flex-wrap items-center gap-3">
                <div
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border cursor-pointer hover:scale-105 transition-all shadow-md funky-button"
                  style={{ borderColor: theme.border, backgroundColor: theme.badgeBg }}
                >
                  <UserCheck className="w-4 h-4" style={{ color: theme.badgeText }} />
                  <span className="text-xs font-bold tracking-wide" style={{ color: theme.badgeText }}>
                    {activePreset.name} • @{username}
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/90 shadow-sm">
                  <Trophy className="w-3.5 h-3.5 text-[#F4C56A]" />
                  <span>Level 4 Scholar • 1,450 XP</span>
                </div>
              </div>

              {/* Main Command Center Heading */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl text-white font-serif tracking-tight leading-tight">
                  What would you like to understand today?
                </h1>
                <p className="text-sm sm:text-base text-white/75 font-sans leading-relaxed max-w-xl">
                  Ask any doubt or topic. Our AI builds a visual knowledge map, diagnostic check, and personalized module around you.
                </p>
              </div>

              {/* Large Premium AI Input Bar */}
              <form onSubmit={(e) => handleStartJourney(e)} className="pt-2">
                <div
                  className="liquid-glass rounded-2xl p-2 sm:p-2.5 flex flex-col sm:flex-row items-center gap-3 shadow-2xl border transition-all focus-within:border-2 focus-within:scale-[1.01]"
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
                    className="w-full sm:w-auto font-bold shrink-0 cursor-pointer px-7 py-4 border-none funky-button shadow-2xl"
                    style={{ backgroundColor: theme.primary, color: '#05070A' }}
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Start Journey
                  </Button>
                </div>
              </form>

              {/* Error Notice */}
              {error && (
                <div className="p-3.5 rounded-xl bg-[#FF8B8B]/10 border border-[#FF8B8B]/30 text-xs text-[#FF8B8B] flex items-center justify-between">
                  <span>{error}</span>
                  <button onClick={clearError} className="text-xs underline font-medium cursor-pointer">Dismiss</button>
                </div>
              )}

              {/* Dynamic AI Analysis Loading Overlay */}
              {loading && (
                <div className="p-4 rounded-xl liquid-glass border flex items-center justify-center gap-3 text-sm text-white" style={{ borderColor: theme.border }}>
                  <Sparkles className="w-5 h-5 animate-spin" style={{ color: theme.primary }} />
                  <span className="font-medium animate-pulse">{loadingMessage || 'Analyzing your topic...'}</span>
                </div>
              )}

              {/* Popular Learning Shortcut Pills */}
              <div className="pt-1">
                <p className="text-[11px] text-white/50 uppercase tracking-widest font-bold mb-2.5">
                  Popular doubt shortcuts:
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
                      className="px-3.5 py-1.5 rounded-full liquid-glass text-xs text-white/80 hover:text-white border border-white/10 hover:border-white/30 funky-button cursor-pointer"
                    >
                      "{doubt}"
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: FUNKY BORDERLESS 3D PERSONA STAGE WITH FLOATING ICON TAGS */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative pt-4 lg:pt-0">
              <div
                onClick={() => setIsAvatarModalOpen(true)}
                className="group relative flex flex-col items-center justify-center cursor-pointer transition-all duration-500 w-full max-w-sm"
              >
                {/* Floating Decorative 3D Icon Chips */}
                <div className="absolute -top-2 -left-2 z-30 p-2.5 rounded-2xl liquid-glass border shadow-xl animate-float" style={{ borderColor: theme.border }}>
                  <Code2 className="w-4 h-4" style={{ color: theme.badgeText }} />
                </div>
                <div className="absolute top-1/3 -right-4 z-30 p-2.5 rounded-2xl liquid-glass border shadow-xl animate-float" style={{ borderColor: theme.border }}>
                  <Brain className="w-4 h-4 text-[#B9A7FF]" />
                </div>

                {/* Soft Radial Ambient Glow */}
                <div
                  className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-[85px] opacity-60 transition-all duration-700 pointer-events-none"
                  style={{ backgroundColor: theme.primary }}
                />

                {/* 3D Base Reflection Light Disk */}
                <div
                  className="absolute bottom-8 w-52 h-10 sm:w-64 sm:h-12 rounded-[100%] blur-lg pointer-events-none opacity-80 shadow-2xl"
                  style={{ backgroundColor: theme.primary }}
                />

                {/* ENLARGED 3D PERSONA IMAGE */}
                <div className="relative z-10 w-64 h-72 sm:w-80 sm:h-84 overflow-hidden flex items-end justify-center">
                  <img
                    src={avatarUrl}
                    alt="3D Character Persona"
                    className="w-full h-full object-contain pointer-events-none filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-500 [mask-image:linear-gradient(to_bottom,black_70%,transparent_96%)]"
                  />
                </div>

                {/* Interactive Persona Pill */}
                <div
                  className="relative z-20 -mt-2 px-4 py-2 rounded-2xl liquid-glass border shadow-2xl flex items-center gap-2 text-xs font-bold text-white group-hover:scale-105 transition-all funky-button"
                  style={{ borderColor: theme.border, backgroundColor: 'rgba(5, 7, 10, 0.85)' }}
                >
                  <Sparkles className="w-4 h-4 animate-spin-slow" style={{ color: theme.badgeText }} />
                  <span>{activePreset.name}</span>
                  <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full" style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}>
                    3D Persona
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GAMIFIED DAILY QUEST BANNER */}
      <section className="relative z-10">
        <div className="funky-card rounded-3xl p-5 border border-white/10 bg-gradient-to-r from-white/[0.03] via-white/[0.06] to-white/[0.03] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl border" style={{ backgroundColor: theme.badgeBg, borderColor: theme.border }}>
              <Zap className="w-5 h-5" style={{ color: theme.badgeText }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase" style={{ color: theme.badgeText }}>Daily Learning Quest</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F4C56A]/20 text-[#F4C56A] font-bold border border-[#F4C56A]/30">+150 XP</span>
              </div>
              <p className="text-sm font-semibold text-white">Complete 1 Diagnostic Assessment & Practice Session today</p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleStartJourney(undefined, "SQL JOINs")}
            className="shrink-0 text-xs liquid-glass text-white border-white/20 hover:bg-white/10 funky-button cursor-pointer"
          >
            Start Daily Quest →
          </Button>
        </div>
      </section>

      {/* QUICK ACTION DOCK */}
      <section className="space-y-4 relative z-10">
        <h2 className="text-2xl font-serif text-white flex items-center gap-2">
          <Layers className="w-5 h-5" style={{ color: theme.primary }} />
          <span>Learning Tools & Exams</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => navigate('/app/exam')}
            className="p-5 rounded-3xl funky-card border border-white/10 hover:border-white/30 transition-all text-left flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-[#7ED6A5]/15 border border-[#7ED6A5]/30 text-[#7ED6A5]">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-[#7ED6A5] transition-colors">Timed Exam (3 Lives)</p>
                <p className="text-xs text-white/50">Score &ge; 80% to earn certificates</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/app/certificates')}
            className="p-5 rounded-3xl funky-card border border-white/10 hover:border-white/30 transition-all text-left flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-[#8DD3FF]/15 border border-[#8DD3FF]/30 text-[#8DD3FF]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-[#8DD3FF] transition-colors">My Certificates</p>
                <p className="text-xs text-white/50">View & download verified PDFs</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/app/learning-map')}
            className="p-5 rounded-3xl funky-card border border-white/10 hover:border-white/30 transition-all text-left flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-[#F4C56A]/15 border border-[#F4C56A]/30 text-[#F4C56A]">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-[#F4C56A] transition-colors">Visual Concept Map</p>
                <p className="text-xs text-white/50">Explore prerequisites & topic nodes</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors shrink-0" />
          </button>
        </div>
      </section>

      {/* SECTION 2 — CONTINUE LEARNING */}
      <section className="space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif text-white">Continue Learning</h2>
            <p className="text-xs text-white/60">Pick up your active adaptive learning journeys where you left off</p>
          </div>
        </div>

        {sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="funky-card rounded-3xl p-5 border border-white/10 hover:border-white/30 transition-all space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/80">
                      {session.subject}
                    </span>
                    <span className="text-xs font-bold" style={{ color: theme.badgeText }}>
                      {session.progressPercent}%
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-[#8DD3FF] transition-colors">
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
                    className="w-full flex items-center justify-center gap-2 text-xs liquid-glass text-white hover:bg-white/10 funky-button cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-[#8DD3FF]" />
                    <span>Continue Learning</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-3xl funky-card border border-white/10 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-white/40 mx-auto" />
            <p className="text-sm font-medium text-white">No active learning sessions yet</p>
            <p className="text-xs text-white/50">Enter a question or topic above to start your first adaptive learning journey!</p>
          </div>
        )}
      </section>

      {/* SECTION 4 — LEARNING INSIGHTS & STATS */}
      <section className="space-y-4 relative z-10">
        <h2 className="text-2xl font-serif text-white">Your Learning Insights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="funky-card rounded-3xl p-5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60 uppercase font-bold">Concepts Learning</span>
              <BookOpen className="w-4 h-4" style={{ color: theme.primary }} />
            </div>
            <p className="text-3xl font-bold text-white">5</p>
            <p className="text-xs text-white/60">Active in learning graph</p>
          </div>

          <div className="funky-card rounded-3xl p-5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60 uppercase font-bold">Concepts Mastered</span>
              <CheckCircle2 className="w-4 h-4 text-[#7ED6A5]" />
            </div>
            <p className="text-3xl font-bold text-white">3</p>
            <p className="text-xs text-[#7ED6A5]">Above 85% mastery score</p>
          </div>

          <div className="funky-card rounded-3xl p-5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60 uppercase font-bold">Areas to Improve</span>
              <AlertTriangle className="w-4 h-4 text-[#F4C56A]" />
            </div>
            <p className="text-3xl font-bold text-white">2</p>
            <p className="text-xs text-[#F4C56A]">LEFT JOIN & Prerequisite Keys</p>
          </div>

          <div className="funky-card rounded-3xl p-5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60 uppercase font-bold">Learning Streak</span>
              <Flame className="w-4 h-4 text-[#FF8B8B]" />
            </div>
            <p className="text-3xl font-bold text-white">3 Days</p>
            <p className="text-xs text-[#FF8B8B]">Streak Active 🔥</p>
          </div>
        </div>
      </section>

      {/* SECTION 5 — RECOMMENDED NEXT STEPS */}
      <section className="space-y-4 relative z-10">
        <h2 className="text-2xl font-serif text-white">Recommended Next Steps</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => handleStartJourney(undefined, "Continue improving LEFT JOIN")}
            className="funky-card rounded-3xl p-5 border border-white/10 hover:border-white/30 transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: theme.primary }} />
              <span className="text-xs font-bold text-white group-hover:text-[#8DD3FF]">Recommendation</span>
            </div>
            <p className="text-sm font-semibold text-white">"Continue improving LEFT JOIN"</p>
            <p className="text-xs text-white/60">Strengthen unmatched row behavior with real-world scenarios.</p>
          </div>

          <div
            onClick={() => handleStartJourney(undefined, "Practice recursion base cases")}
            className="funky-card rounded-3xl p-5 border border-white/10 hover:border-white/30 transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-[#B9A7FF]" />
              <span className="text-xs font-bold text-white group-hover:text-[#B9A7FF]">Recommendation</span>
            </div>
            <p className="text-sm font-semibold text-white">"Practice recursion base cases"</p>
            <p className="text-xs text-white/60">Prevent stack overflow with base condition logic.</p>
          </div>

          <div
            onClick={() => handleStartJourney(undefined, "Review foreign key relationships")}
            className="funky-card rounded-3xl p-5 border border-white/10 hover:border-white/30 transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#7ED6A5]" />
              <span className="text-xs font-bold text-white group-hover:text-[#7ED6A5]">Recommendation</span>
            </div>
            <p className="text-sm font-semibold text-white">"Review foreign key relationships"</p>
            <p className="text-xs text-white/60">Solidify database primary key to foreign key links.</p>
          </div>
        </div>
      </section>

      {/* AVATAR & THEME SELECTOR MODAL */}
      <AvatarSelectorModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatarUrl={avatarUrl}
        onSelectAvatar={handleSelectAvatar}
      />
    </div>
  );
};
