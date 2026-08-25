import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { getAvatarPresetByUrl, generateAvatarUrl, sanitizeAvatarUrl } from '@/lib/avatarGenerator';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  BookOpen,
  ExternalLink,
  Video,
  Globe,
  LayoutDashboard,
  ArrowRight,
  Bot,
  Brain,
  Zap,
  CheckCircle2,
  Paperclip,
  Mic,
  Lightbulb,
  Code,
  Send,
} from 'lucide-react';

interface RecentSession {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  topic: string;
}

export const LearnPage: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const rawAvatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const avatarUrl = sanitizeAvatarUrl(rawAvatarUrl);
  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset.theme;

  const [inputQuery, setInputQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [explanationDepth, setExplanationDepth] = useState<'easier' | 'medium' | 'indepth'>('medium');
  const [selectedConfidence, setSelectedConfidence] = useState<'beginner' | 'moderate' | 'advanced'>('moderate');

  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([
    {
      id: 's1',
      title: 'SQL JOINs & Table Relationships',
      subtitle: 'Relational databases & foreign key maps',
      time: '10m ago',
      topic: 'SQL JOINs & Table Relationships',
    },
    {
      id: 's2',
      title: 'Recursion Base Case Logic',
      subtitle: 'Call stack frames & memory limits',
      time: '1h ago',
      topic: 'Recursion Base Case Logic',
    },
    {
      id: 's3',
      title: 'Photosynthesis Light Reactions',
      subtitle: 'ATP & NADPH chloroplast electron transport',
      time: '1d ago',
      topic: 'Photosynthesis Light Reactions',
    },
    {
      id: 's4',
      title: 'Binary Search Tree Traversal',
      subtitle: 'In-order, Pre-order & Post-order algorithms',
      time: '2d ago',
      topic: 'Binary Search Tree Traversal',
    },
  ]);

  const handleStartSearch = (topicToSearch: string) => {
    if (!topicToSearch.trim()) return;
    setActiveTopic(topicToSearch.trim());

    if (!recentSessions.some((s) => s.topic.toLowerCase() === topicToSearch.toLowerCase())) {
      setRecentSessions((prev) => [
        {
          id: `s-${Date.now()}`,
          title: topicToSearch,
          subtitle: 'Custom doubt exploration session',
          time: 'Just now',
          topic: topicToSearch,
        },
        ...prev,
      ]);
    }
    setInputQuery('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleStartSearch(inputQuery);
  };

  return (
    <div className="h-full w-full flex flex-col lg:flex-row gap-4 overflow-hidden relative text-slate-800 selection:bg-blue-100 font-sans">
      {/* Light Radial Background Sheen matching Avatar Theme */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-20 z-0 transition-all duration-700"
        style={{ background: theme.glow }}
      />

      {/* CENTER MAIN AI CHAT WORKSPACE (Matching Reference 2 + Reference 1) */}
      <main className="flex-1 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-4 sm:p-6 flex flex-col justify-between shadow-md overflow-hidden z-10">
        {/* TOP HEADER BAR */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-2xl text-white shadow-sm shrink-0"
              style={{ backgroundColor: theme.primary }}
            >
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold font-display text-slate-900 flex items-center gap-2">
                MetaMind AI Workspace
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-bold hidden sm:inline">
                  Adaptive Engine
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-sans">Ask doubts, explore concepts, or jump to dashboard</p>
            </div>
          </div>

          {/* Top-Right Tools & Depth Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Explanation Depth Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-mono text-slate-500 font-bold px-2">Depth:</span>
              {(['easier', 'medium', 'indepth'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setExplanationDepth(d)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    explanationDepth === d
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  style={explanationDepth === d ? { backgroundColor: theme.primary } : {}}
                >
                  {d === 'easier' ? 'Easier' : d === 'medium' ? 'Medium' : 'In-Depth'}
                </button>
              ))}
            </div>

            <button
              onClick={() => navigate('/app/dashboard')}
              className="px-4 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          </div>
        </header>

        {/* MAIN BODY AREA: STATE A (WELCOME HERO) OR STATE B (ACTIVE DOUBT RESOLUTION) */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          {!activeTopic ? (
            /* STATE A: WELCOME HERO & 4 ACTION TILES (Matching Reference 2) */
            <div className="max-w-2xl mx-auto text-center py-8 space-y-8">
              {/* Hero Title & Intro */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Welcome to MetaMind AI Chat</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
                  Welcome to MetaMind
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Get started by asking any doubt, topic, or concept and MetaMind AI will do the rest. Not sure where to start?
                </p>
              </div>

              {/* 4 ACTION GRID TILES (Matching Reference 2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
                {/* Tile 1: Ask doubt */}
                <button
                  onClick={() => handleStartSearch('SQL JOINs & Table Relationships')}
                  className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 hover:border-amber-300 transition-all flex items-center justify-between group cursor-pointer shadow-2xs hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 font-bold">
                      <BookOpen className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-amber-700">
                        Ask doubt & concept map
                      </h4>
                      <p className="text-[11px] text-slate-500">Break down complex topics</p>
                    </div>
                  </div>
                  <span className="text-slate-400 group-hover:text-amber-700 font-bold">+</span>
                </button>

                {/* Tile 2: Generate quiz */}
                <button
                  onClick={() => handleStartSearch('Diagnostic Practice Questions')}
                  className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200/90 hover:border-sky-300 transition-all flex items-center justify-between group cursor-pointer shadow-2xs hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700 font-bold">
                      <Sparkles className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-sky-700">
                        Generate practice quiz
                      </h4>
                      <p className="text-[11px] text-slate-500">Test baseline confidence</p>
                    </div>
                  </div>
                  <span className="text-slate-400 group-hover:text-sky-700 font-bold">+</span>
                </button>

                {/* Tile 3: Real-world analogy */}
                <button
                  onClick={() => handleStartSearch('Recursion Base Case Analogy')}
                  className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 hover:border-emerald-300 transition-all flex items-center justify-between group cursor-pointer shadow-2xs hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 font-bold">
                      <Lightbulb className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-700">
                        Real-world analogy
                      </h4>
                      <p className="text-[11px] text-slate-500">Understand via examples</p>
                    </div>
                  </div>
                  <span className="text-slate-400 group-hover:text-emerald-700 font-bold">+</span>
                </button>

                {/* Tile 4: Write code */}
                <button
                  onClick={() => handleStartSearch('Binary Tree Traversal Code')}
                  className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200/90 hover:border-purple-300 transition-all flex items-center justify-between group cursor-pointer shadow-2xs hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700 font-bold">
                      <Code className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-purple-700">
                        Write code & algorithm
                      </h4>
                      <p className="text-[11px] text-slate-500">Python & SQL syntax</p>
                    </div>
                  </div>
                  <span className="text-slate-400 group-hover:text-purple-700 font-bold">+</span>
                </button>
              </div>
            </div>
          ) : (
            /* STATE B: ACTIVE DOUBT RESOLUTION & RESEARCH HUB (Matching Reference 1) */
            <div className="space-y-5">
              {/* CARD 1: DIAGNOSTIC KNOWLEDGE CHECK */}
              <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200/90 space-y-3 shadow-2xs">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-xs">
                  <Brain className="w-4.5 h-4.5 text-blue-600" />
                  <span>AI Diagnostic Knowledge Check</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  Before exploring <span className="font-bold text-slate-900">"{activeTopic}"</span>, how familiar are you with this concept? Select your baseline confidence:
                </p>

                <div className="flex flex-wrap gap-2.5 pt-1">
                  {[
                    { id: 'beginner', label: 'Beginner (Explain from scratch)' },
                    { id: 'moderate', label: 'Moderate (Understand basics)' },
                    { id: 'advanced', label: 'Advanced (Deep optimization)' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedConfidence(opt.id as any)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedConfidence === opt.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                      style={selectedConfidence === opt.id ? { backgroundColor: theme.primary, borderColor: theme.primary } : {}}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* CARD 2: ADAPTIVE AI EXPLANATION RESPONSE */}
              <div className="p-6 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                    Adaptive AI Response ({explanationDepth.toUpperCase()} MODE)
                  </span>
                  <span className="text-[11px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Verified Explanation
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-3 font-sans">
                  <p>
                    Understanding <span className="font-bold text-blue-600 font-mono">{activeTopic}</span> involves identifying the core input parameters and tracking execution steps.
                  </p>

                  <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs">
                    <span className="font-bold text-amber-950">Real-World Analogy:</span> Imagine a organized library catalog. Even if a book is checked out, its reference entry remains logged in the master directory.
                  </div>
                </div>
              </div>

              {/* CARD 3: VERIFIED ONLINE SOURCES & VIDEO RECOMMENDATIONS */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  Verified Online Sources & Video Recommendations
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="https://w3schools.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                        <Globe className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600">{activeTopic} Reference Guide</p>
                        <p className="text-[10px] text-slate-400 font-mono">w3schools.com / documentation</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </a>

                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-rose-300 transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                        <Video className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-rose-600">Visual Explanation (10m)</p>
                        <p className="text-[10px] text-slate-400 font-mono">youtube.com / Computerphile</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
                  </a>
                </div>
              </div>

              {/* CARD 4: DASHBOARD & COURSE REDIRECT CTA */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-300" />
                    Ready to track progress on Student Dashboard?
                  </h3>
                  <p className="text-xs text-blue-100 mt-0.5 leading-relaxed">
                    View your adaptive mastery graph, focus time streaks, and verified certificates.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/app/dashboard')}
                    className="bg-white text-blue-700 hover:bg-slate-100 font-bold text-xs cursor-pointer shadow-md"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Go to Student Dashboard →
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FLOATING BOTTOM DOCK INPUT BAR (Matching Reference 2) */}
        <div className="pt-3 border-t border-slate-100 shrink-0">
          <form onSubmit={handleFormSubmit} className="space-y-2">
            <div className="relative rounded-3xl bg-slate-50/90 border border-slate-200/90 focus-within:border-blue-500 focus-within:bg-white transition-all shadow-2xs p-3 space-y-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask any doubt or topic... e.g. 'How does recursion work?'"
                className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none border-none px-2"
              />

              {/* Controls bar inside input dock */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                <div className="flex items-center gap-3 text-slate-500">
                  <button
                    type="button"
                    onClick={() => alert('File attachment feature ready')}
                    className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-medium"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Attach</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('Voice doubt recording active')}
                    className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-medium"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Voice Doubt</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartSearch('SQL JOINs & Table Relationships')}
                    className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-medium"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span className="hidden sm:inline">Browse Prompts</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-400">
                    {inputQuery.length} / 3,000
                  </span>
                  <button
                    type="submit"
                    disabled={!inputQuery.trim()}
                    className="p-2 rounded-2xl text-white font-bold cursor-pointer disabled:opacity-40 shadow-sm shrink-0 hover:scale-105 transition-all"
                    style={{ backgroundColor: theme.primary }}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* RIGHT SIDEBAR: RECENT DOUBT SESSIONS LIST (Matching Reference 2) */}
      <aside className="w-full lg:w-72 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-4 flex flex-col justify-between shrink-0 shadow-md z-10 hidden xl:flex">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-mono">
              Recent Doubts ({recentSessions.length})
            </h3>
            <button
              onClick={() => setActiveTopic(null)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-all cursor-pointer"
            >
              + New
            </button>
          </div>

          {/* Session Cards List */}
          <div className="space-y-2 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1">
            {recentSessions.map((session) => {
              const isActive = activeTopic === session.topic;
              return (
                <div
                  key={session.id}
                  onClick={() => setActiveTopic(session.topic)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                    isActive
                      ? 'bg-blue-50/90 border-blue-200 shadow-2xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 truncate pr-2">{session.title}</h4>
                    <span className="text-[9px] font-mono text-slate-400 shrink-0">{session.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{session.subtitle}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Model: MetaMind AI v1.3</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </aside>
    </div>
  );
};
