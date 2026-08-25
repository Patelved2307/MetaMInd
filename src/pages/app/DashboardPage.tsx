import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { useLearning } from '@/features/learning';
import { getAvatarPresetByUrl, generateAvatarUrl, sanitizeAvatarUrl } from '@/lib/avatarGenerator';
import { AvatarSelectorModal } from '@/components/ui/AvatarSelectorModal';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Search,
  Crown,
  Play,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
  Zap,
  FileCheck,
  Award,
  Compass,
  TrendingUp,
  Users,
  Activity,
  UserCheck,
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'D' | 'W' | 'M'>('D');
  const [carouselStep, setCarouselStep] = useState(2);

  const studentName = profile?.full_name || user?.user_metadata?.full_name || 'Vipin';
  const username = profile?.username || 'learner';
  const rawAvatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const avatarUrl = sanitizeAvatarUrl(rawAvatarUrl);

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
    <div className="space-y-8 max-w-7xl mx-auto pb-16 text-slate-800 selection:bg-blue-100">
      {/* Dynamic Radial Ambient Light Glow tied to Auto-Assigned Avatar Theme */}
      <div
        className="fixed top-0 right-0 w-[650px] h-[650px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 opacity-20 z-0"
        style={{ background: theme.glow }}
      />

      {/* TOP HEADER BAR */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3.5">
          <div
            onClick={() => setIsAvatarModalOpen(true)}
            className="relative cursor-pointer group"
          >
            <img
              src={avatarUrl}
              alt="Assigned 3D Persona"
              className="w-13 h-13 rounded-2xl border-2 object-cover transition-transform group-hover:scale-105 shadow-md bg-white"
              style={{ borderColor: theme.primary }}
            />
            <span
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold"
              style={{ backgroundColor: theme.primary }}
            >
              ✓
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
                Hello, {studentName}
              </h1>
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono border font-bold"
                style={{ backgroundColor: theme.badgeBg, color: theme.badgeText, borderColor: theme.border }}
              >
                {theme.themeName}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-sans font-medium">
              Avatar-Driven Color Theme • @{username}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Global Search Bar */}
          <div className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={queryInput}
              onChange={(e) => {
                setQueryInput(e.target.value);
                if (error) clearError();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleStartJourney(e);
              }}
              placeholder="Search topics, modules or doubts..."
              className="w-full bg-white border border-slate-200/90 rounded-full pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 shadow-sm transition-all"
            />
          </div>

          {/* Upgrade / Scholar Pro Badge */}
          <button
            onClick={() => setIsAvatarModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-300 text-xs font-bold text-amber-700 hover:scale-105 transition-all shrink-0 cursor-pointer shadow-sm"
          >
            <Crown className="w-4 h-4 text-amber-500" />
            <span>Scholar Pro</span>
          </button>
        </div>
      </header>

      {/* Error Notice */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-between z-10 relative">
          <span>{error}</span>
          <button onClick={clearError} className="text-xs underline font-medium cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* AI Search Banner loading state */}
      {loading && (
        <div className="p-4 rounded-2xl bg-white border border-blue-200 flex items-center justify-center gap-3 text-sm text-slate-800 shadow-sm relative z-10">
          <Sparkles className="w-5 h-5 animate-spin text-blue-600" />
          <span className="font-medium animate-pulse">{loadingMessage || 'Generating custom learning session concept graph...'}</span>
        </div>
      )}

      {/* MAIN LAYOUT GRID (LEFT HERO & METRICS + RIGHT SQUAD PANEL) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* LEFT COLUMN: HERO & ACTIVITY (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* HERO BANNER CARD (VIBRANT ACCENT GRADIENT) */}
          <div
            className={`rounded-3xl p-8 bg-gradient-to-r ${theme.heroGradient} text-slate-900 relative overflow-hidden flex flex-col justify-between min-h-[300px] shadow-sm border border-slate-200/80 group`}
          >
            <div className="space-y-3 max-w-md relative z-10">
              <span className="px-3 py-1 rounded-full bg-white/80 border border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-800 shadow-sm">
                ⚡ Adaptive Learning Workspace
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight leading-tight text-slate-900">
                Let's study & master concepts today!
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
                Your assigned persona <span className="font-bold text-slate-900">"{activePreset.name}"</span> is active. Turn doubts into interactive concept maps.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-900/10 relative z-10 mt-6">
              <div className="flex items-center gap-3">
                <div
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="w-12 h-12 rounded-2xl border-2 overflow-hidden bg-white cursor-pointer hover:scale-105 transition-transform shadow-sm"
                  style={{ borderColor: theme.primary }}
                >
                  <img src={avatarUrl} alt="Persona" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{activePreset.name}</p>
                  <p className="text-[10px] font-mono font-semibold" style={{ color: theme.primary }}>
                    Auto-selected • Light Theme
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleStartJourney(undefined, queryInput || "Computer Science Fundamentals")}
                className="px-6 py-3 rounded-full text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer hover:scale-105"
                style={{ backgroundColor: theme.primary }}
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* YOUR ACTIVITIES ROW (Inspired by Reference Mockups: +35, +72, -05 with sparklines) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                Your Learning Activities
              </h3>
              <span className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer font-medium">See all</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Activity Card 1 */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                <div>
                  <p className="text-[11px] font-mono text-slate-500">Math Mastery</p>
                  <p className="text-2xl font-extrabold text-emerald-600 font-display mt-0.5">+35 XP</p>
                </div>
                <div className="w-16 h-10">
                  <svg className="w-full h-full" viewBox="0 0 60 30">
                    <path d="M0 25 Q 15 5, 30 20 T 60 5" fill="none" stroke="#059669" strokeWidth="2.5" />
                  </svg>
                </div>
              </div>

              {/* Activity Card 2 */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                <div>
                  <p className="text-[11px] font-mono text-slate-500">Coding Accuracy</p>
                  <p className="text-2xl font-extrabold text-blue-600 font-display mt-0.5">+72 %</p>
                </div>
                <div className="w-16 h-10">
                  <svg className="w-full h-full" viewBox="0 0 60 30">
                    <path d="M0 20 Q 15 28, 30 10 T 60 2" fill="none" stroke="#2563EB" strokeWidth="2.5" />
                  </svg>
                </div>
              </div>

              {/* Activity Card 3 */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                <div>
                  <p className="text-[11px] font-mono text-slate-500">Physics Review</p>
                  <p className="text-2xl font-extrabold text-rose-500 font-display mt-0.5">-05 Mins</p>
                </div>
                <div className="w-16 h-10">
                  <svg className="w-full h-full" viewBox="0 0 60 30">
                    <path d="M0 5 Q 15 25, 30 10 T 60 28" fill="none" stroke="#F43F5E" strokeWidth="2.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STUDY FOCUS & CLASSMATES PANEL (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* STUDY FOCUS STATUS WIDGET */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white space-y-5 shadow-md border border-blue-500">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold font-display">Study Focus Status</h3>
                <p className="text-xs text-blue-100">Daily Target: 2.50 Hours</p>
              </div>
              <div className="flex gap-1 p-1 rounded-full bg-white/20 text-[10px] font-bold">
                {(['D', 'W', 'M'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      activeTab === t ? 'bg-white text-blue-700 font-bold' : 'text-blue-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-emerald-300 text-emerald-950 font-bold text-xs flex items-center gap-1 shadow-sm">
                Well Done <ThumbsUp className="w-3 h-3" />
              </span>
              <div className="grid grid-cols-5 gap-1">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className={`w-3 h-5 rounded-t-sm ${i < 7 ? 'bg-white' : 'bg-white/30'}`} />
                ))}
              </div>
            </div>

            <div className="border-t border-white/20 pt-3 flex justify-between items-end">
              <div>
                <span className="text-3xl font-extrabold font-display">2.50h</span>
                <span className="text-[10px] font-mono text-blue-100 block">Focus Completed</span>
              </div>
              <span className="text-xs font-mono bg-white/20 px-2.5 py-1 rounded-full font-bold">🔥 5 Days</span>
            </div>
          </div>

          {/* YOUR FRIENDS & CLASSMATES PANEL (Inspired by Reference Mockups) */}
          <div className="rounded-3xl p-5 bg-white border border-slate-200/80 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Study Squad</h3>
              </div>
              <button
                onClick={() => navigate('/app/study-room')}
                className="text-xs text-blue-600 hover:underline font-bold"
              >
                Join Room →
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-[10px] uppercase font-mono tracking-widest text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online Classmates
              </div>

              {/* Classmate 1 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Classmate"
                    className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Wade Warren</p>
                    <p className="text-[10px] text-slate-500">Computer Science</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                  Studying
                </span>
              </div>

              {/* Classmate 2 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                    alt="Classmate"
                    className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Brooklyn Simmons</p>
                    <p className="text-[10px] text-slate-500">Data Structures</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  In Exam
                </span>
              </div>

              <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold pt-1">
                Offline
              </div>

              {/* Classmate 3 */}
              <div className="flex items-center justify-between opacity-70">
                <div className="flex items-center gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                    alt="Classmate"
                    className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Jenny Wilson</p>
                    <p className="text-[10px] text-slate-500">Mathematics</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">2h ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: THREE METRICS CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {/* CARD 1: DEEP FOCUS & ACTIVE RECALL TIP */}
        <div className="rounded-3xl p-6 bg-white border border-slate-200/80 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-all">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-800">Active Recall Protocol</span>
            </div>

            <h3 className="text-xl font-bold font-display text-slate-900 leading-snug">
              Experience the Goodness of Deep Focus
            </h3>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                <span>🌙 Deep Focus Mode</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Discover techniques for active recall and distraction-free study sessions. Master concepts faster with scheduled breaks.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
            <span className="font-mono text-slate-500">{carouselStep} / 5</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCarouselStep((prev) => Math.max(1, prev - 1))}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCarouselStep((prev) => Math.min(5, prev + 1))}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* CARD 2: DAILY STUDY MINUTES & SUBJECT BREAKDOWN */}
        <div className="rounded-3xl p-6 bg-white border border-slate-200/80 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-900">Study Energy</span>
              </div>
              <span className="text-xs font-mono text-slate-500">Daily Goal</span>
            </div>

            <p className="text-xs text-slate-500">Lack of study focus slows concept mastery</p>

            <div>
              <span className="text-4xl font-extrabold font-display text-slate-900">2.040</span>
              <span className="text-xs font-mono text-slate-500 ml-1">/ Mins</span>
            </div>

            <div className="pt-2 space-y-1">
              <div className="flex items-end justify-between gap-1 h-14">
                {[40, 65, 80, 50, 90, 75, 100, 85, 60, 95, 70, 80, 85, 90, 60, 75, 80, 95].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="flex-1 bg-emerald-500 rounded-t-sm opacity-90 hover:opacity-100 transition-all"
                  />
                ))}
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0</span>
                <span>2.350</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
            <div>
              <p className="text-sm font-bold text-slate-900 font-mono">269 Mins</p>
              <p className="text-[10px] text-slate-500">Computer Science</p>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 font-mono">164 Mins</p>
              <p className="text-[10px] text-slate-500">Mathematics</p>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 font-mono">110 Mins</p>
              <p className="text-[10px] text-slate-500">Physics</p>
            </div>
          </div>
        </div>

        {/* CARD 3: MASTERY TRAJECTORY */}
        <div className="rounded-3xl p-6 bg-white border border-slate-200/80 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-900">Mastery Score</span>
              </div>
              <span className="text-xs font-mono text-slate-500">Target 85% - 95%</span>
            </div>

            <p className="text-xs text-slate-500">Healthy score benchmark achieved</p>

            <div className="h-20 w-full relative py-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 200 60" preserveAspectRatio="none">
                <path d="M0 40 Q 50 10, 100 35 T 200 20" fill="none" stroke="#2563EB" strokeWidth="3" />
                <path d="M0 25 Q 50 50, 100 15 T 200 40" fill="none" stroke="#059669" strokeWidth="3" strokeDasharray="4 2" />
              </svg>
            </div>

            <div>
              <span className="text-5xl font-extrabold font-display text-slate-900">82%</span>
              <span className="text-xs font-mono text-slate-500 ml-2">Accuracy Rate</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="text-xs text-slate-500">Of the weekly plan completed</p>
              <p className="text-xs font-bold text-emerald-600">Keep it up!</p>
            </div>
            <button
              onClick={() => navigate('/app/analysis')}
              className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
            >
              Detailed Analytics →
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3: ACTIVE LEARNING SESSIONS */}
      <section className="space-y-4 relative z-10 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-900">Continue Learning</h2>
            <p className="text-xs text-slate-500">Resume your in-progress topics right where you left off</p>
          </div>
        </div>

        {sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="rounded-3xl p-5 bg-white border border-slate-200/80 space-y-4 flex flex-col justify-between group hover:shadow-md transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                      {session.subject}
                    </span>
                    <span className="text-xs font-bold text-blue-600">
                      {session.progressPercent}%
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {session.topic}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 font-mono">
                    "{session.originalQuery}"
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <Progress value={session.progressPercent} variant="accent" size="sm" />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleContinueSession(session.id)}
                    className="w-full flex items-center justify-center gap-2 text-xs bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-blue-600" />
                    <span>Resume Session</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 text-center space-y-3 shadow-sm">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-800">No active learning sessions yet</p>
            <p className="text-xs text-slate-500">
              Enter any question or topic in the search bar above to create your first adaptive learning node!
            </p>
          </div>
        )}
      </section>

      {/* SECTION 4: QUICK TOOLS DOCK */}
      <section className="space-y-4 relative z-10 pt-2">
        <h2 className="text-2xl font-display font-bold text-slate-900">Quick Tools & Practice</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => navigate('/app/exam')}
            className="p-5 rounded-3xl bg-white border border-slate-200/80 text-left flex items-center justify-between group hover:border-emerald-300 transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Timed Exam (3 Hearts)</p>
                <p className="text-xs text-slate-500">Score &ge; 60% for verified certificate</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/app/certificates')}
            className="p-5 rounded-3xl bg-white border border-slate-200/80 text-left flex items-center justify-between group hover:border-blue-300 transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">My Certificates</p>
                <p className="text-xs text-slate-500">Unique ID verified credentials</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/app/learning-map')}
            className="p-5 rounded-3xl bg-white border border-slate-200/80 text-left flex items-center justify-between group hover:border-amber-300 transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">Visual Concept Map</p>
                <p className="text-xs text-slate-500">Explore prerequisite graph nodes</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </button>
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
