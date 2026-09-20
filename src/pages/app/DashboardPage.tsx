import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '@/features/auth';
import {
  Search,
  Bell,
  ChevronDown,
  Database,
  Code2,
  Network,
  Wifi,
  Check,
  CheckCircle2,
  Lightbulb,
  MessageSquare,
  TrendingUp,
  Flame,
  ArrowRight,
  Shield,
  BookOpen,
  Zap,
  Target,
  Send,
  Sparkles,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [askInput, setAskInput] = useState('');

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Student';
  const initial = displayName.charAt(0).toUpperCase() || 'S';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/app/chat', { state: { initialPrompt: searchQuery } });
    }
  };

  const handleQuickAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (askInput.trim()) {
      navigate('/app/chat', { state: { initialPrompt: askInput } });
    }
  };

  const subjectProgress = [
    {
      id: 'db',
      title: 'Database Management',
      icon: Database,
      iconBg: 'bg-blue-50 text-blue-600',
      percentage: 72,
      progressColor: 'bg-gradient-to-r from-blue-500 to-teal-400',
      mastery: '5/7 concepts mastered',
      topic: 'SQL JOINs',
    },
    {
      id: 'web',
      title: 'Web Development',
      icon: Code2,
      iconBg: 'bg-sky-50 text-sky-600',
      percentage: 48,
      progressColor: 'bg-gradient-to-r from-sky-400 to-blue-500',
      mastery: '3/6 concepts mastered',
      topic: 'React State & Hooks',
    },
    {
      id: 'dsa',
      title: 'Data Structures & Algorithms',
      icon: Network,
      iconBg: 'bg-purple-50 text-purple-600',
      percentage: 35,
      progressColor: 'bg-gradient-to-r from-purple-500 to-indigo-500',
      mastery: '2/6 concepts mastered',
      topic: 'Binary Search Trees',
    },
    {
      id: 'net',
      title: 'Computer Networks',
      icon: Wifi,
      iconBg: 'bg-violet-50 text-violet-600',
      percentage: 20,
      progressColor: 'bg-gradient-to-r from-violet-400 to-fuchsia-400',
      mastery: '1/5 concepts mastered',
      topic: 'TCP/IP Handshake',
    },
  ];

  const recentActivities = [
    {
      id: '1',
      title: 'Completed practice set: INNER JOIN',
      meta: 'Database Management • 8 Aug, 10:24 AM',
      xp: '+20 XP',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: '2',
      title: 'Learned concept: Primary Keys',
      meta: 'Database Management • 7 Aug, 04:12 PM',
      xp: '+10 XP',
      icon: Lightbulb,
      iconBg: 'bg-amber-50 text-amber-600',
    },
    {
      id: '3',
      title: 'Asked a question: "What is a foreign key?"',
      meta: 'Database Management • 7 Aug, 02:45 PM',
      xp: '+10 XP',
      icon: MessageSquare,
      iconBg: 'bg-blue-50 text-blue-600',
    },
  ];

  const achievements = [
    { name: 'First Concept Mastered', icon: Shield, color: 'bg-indigo-100 text-indigo-600' },
    { name: 'Learning Streak', icon: Flame, color: 'bg-amber-100 text-amber-600' },
    { name: 'Concept Builder', icon: Sparkles, color: 'bg-blue-100 text-blue-600' },
    { name: 'Weakness Breaker', icon: Target, color: 'bg-emerald-100 text-emerald-600' },
    { name: 'Subject Explorer', icon: BookOpen, color: 'bg-purple-100 text-purple-600' },
    { name: 'Fast Learner', icon: Zap, color: 'bg-orange-100 text-orange-600' },
  ];

  // GSAP Bento Grid Stagger, Hero Text Animation & RoundProps Counters
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Text Reveal & Mascot Speech Bubble Pop
      gsap.fromTo(
        '.dashboard-hero-title',
        { opacity: 0, y: 16, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out' }
      );
      gsap.fromTo(
        '.dashboard-mascot-quote',
        { opacity: 0, scale: 0.92, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: 'back.out(1.4)', delay: 0.15 }
      );

      // 2. Bento Card Stagger Entrance
      gsap.fromTo(
        '.dashboard-bento-card',
        { opacity: 0, y: 22, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.05, duration: 0.55, ease: 'back.out(1.1)', delay: 0.1 }
      );

      // 3. Continuous Breathing Pulse for Streak Flame
      gsap.to('.streak-flame-icon', {
        scale: 1.15,
        rotate: 4,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: 'sine.inOut',
      });

      // 4. RoundProps Numerical Counter for Streak (0 -> 5 Days)
      const streakTarget = { val: 0 };
      const streakEl = document.getElementById('dashboard-streak-count');
      if (streakEl) {
        gsap.to(streakTarget, {
          val: 5,
          duration: 1.3,
          ease: 'power2.out',
          roundProps: 'val',
          onUpdate: () => {
            streakEl.innerText = `${streakTarget.val} Days`;
          },
        });
      }

      // 5. RoundProps for Subject Mastery Percentages & Width Tweens
      subjectProgress.forEach((sub) => {
        const pctTarget = { val: 0 };
        const pctEl = document.getElementById(`sub-pct-${sub.id}`);
        const barEl = document.getElementById(`sub-bar-${sub.id}`);
        if (pctEl) {
          gsap.to(pctTarget, {
            val: sub.percentage,
            duration: 1.4,
            ease: 'power2.out',
            roundProps: 'val',
            onUpdate: () => {
              pctEl.innerText = `${pctTarget.val}%`;
            },
          });
        }
        if (barEl) {
          gsap.fromTo(
            barEl,
            { width: '0%' },
            { width: `${sub.percentage}%`, duration: 1.4, ease: 'power2.out', delay: 0.15 }
          );
        }
      });

      // 6. Learning Journey Mini-Chart Elastic Bounce
      gsap.fromTo(
        '.learning-bar-item',
        { scaleY: 0, transformOrigin: 'bottom' },
        { scaleY: 1, stagger: 0.08, duration: 0.85, ease: 'back.out(1.8)', delay: 0.25 }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="space-y-6 max-w-[1340px] mx-auto pb-12 font-sans selection:bg-blue-100">
      {/* TOP HEADER BAR MATCHING SHARED IMAGE */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search a topic, concept or ask a question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all shadow-xs"
          />
        </form>

        {/* Top Right Controls */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Notification Bell with red dot */}
          <button
            type="button"
            className="relative p-2.5 bg-white border border-slate-200/80 rounded-2xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>

          {/* User Profile Pill */}
          <button
            type="button"
            onClick={() => navigate('/app/profile')}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 bg-white border border-slate-200/80 rounded-2xl hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
          >
            <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {initial}
            </div>
            <span className="text-xs font-semibold text-slate-800">{displayName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT / MAIN CONTENT AREA (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* WELCOME BANNER WITH ROBOT QUOTE */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-1">
            <div className="space-y-1">
              <h1 className="dashboard-hero-title text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
                Good Morning, <span className="inline-block">☀️</span>
                <span className="block mt-0.5 text-shimmer-gradient">{displayName}!</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-normal">
                Keep going! You're doing great. Here's what's next in your learning journey.
              </p>
            </div>

            {/* Mascot Speech Bubble Quote Card */}
            <div className="dashboard-mascot-quote flex items-center gap-3 p-3.5 sm:px-4 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white border border-blue-100/80 rounded-2xl shadow-xs max-w-sm">
              <div className="w-10 h-10 rounded-2xl bg-blue-100/80 flex items-center justify-center shrink-0 shadow-xs text-xl">
                🤖
              </div>
              <div className="text-xs">
                <p className="text-slate-700 italic font-medium leading-relaxed">
                  "Every question brings you closer to your goals."
                </p>
                <span className="text-[10px] font-bold text-indigo-600 block mt-0.5 font-mono">
                  — MetaMind
                </span>
              </div>
            </div>
          </div>

          {/* YOUR SUBJECT PROGRESS SECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-slate-900">Your Subject Progress</h2>
              <button
                type="button"
                onClick={() => navigate('/app/learning-map')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
              {subjectProgress.map((sub) => {
                const Icon = sub.icon;
                return (
                  <div
                    key={sub.id}
                    onClick={() => navigate('/app/chat', { state: { initialPrompt: `Let's study ${sub.title}` } })}
                    className="dashboard-bento-card p-4 bg-white border border-slate-200/70 rounded-2xl shadow-xs hover:shadow-md hover:border-indigo-200 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${sub.iconBg} group-hover:scale-105 transition-transform`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span id={`sub-pct-${sub.id}`} className="text-xs font-bold text-slate-800 font-mono">{sub.percentage}%</span>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {sub.title}
                      </h3>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                        <div
                          id={`sub-bar-${sub.id}`}
                          className={`h-full rounded-full transition-all duration-500 ${sub.progressColor}`}
                          style={{ width: `${sub.percentage}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium mt-1.5">{sub.mastery}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CONTINUE LEARNING HERO BANNER */}
          <div className="dashboard-bento-card bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-7 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Laptop Illustration */}
              <div className="md:col-span-3 flex flex-col items-center justify-center p-3 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 rounded-2xl border border-blue-100/60">
                <div className="w-20 h-16 bg-white rounded-xl shadow-xs border border-slate-200/80 flex flex-col items-center justify-center p-2 text-center">
                  <span className="text-[9px] font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                    SQL JOINs
                  </span>
                  <div className="mt-1 flex gap-1 items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  </div>
                </div>
                <div className="text-xs text-slate-500 font-medium mt-2 flex items-center gap-1">
                  <span>🪴</span>
                  <span className="text-[10px]">Active Concept</span>
                </div>
              </div>

              {/* Middle Description & Button */}
              <div className="md:col-span-5 space-y-2.5">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Continue Learning
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight font-display">
                    SQL JOINs
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1 text-indigo-600 font-semibold">
                    <Shield className="w-3.5 h-3.5" />
                    Database Management
                  </span>
                  <span>•</span>
                  <span>⏱️ 12 min</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Learn how to combine data from multiple tables using different types of JOINs with interactive examples.
                </p>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => navigate('/app/practice')}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer group"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Right Checklist Tracker */}
              <div className="md:col-span-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center font-mono">
                      3/5
                    </div>
                    <span className="text-xs font-semibold text-slate-700">Concepts completed</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-emerald-600 font-medium py-0.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Introduction</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 font-medium py-0.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>INNER JOIN</span>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 text-blue-700 font-bold px-2 py-1 rounded-lg border border-blue-100">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    <span>LEFT JOIN</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 font-medium py-0.5 px-2">
                    <div className="w-2 h-2 rounded-full border border-slate-300" />
                    <span>RIGHT JOIN</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 font-medium py-0.5 px-2">
                    <div className="w-2 h-2 rounded-full border border-slate-300" />
                    <span>FULL JOIN</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RECENT ACTIVITY & LEARNING JOURNEY GRID */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Recent Activity (7 Cols) */}
            <div className="dashboard-bento-card md:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-slate-500" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">Recent Activity</h3>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/app/learning-map')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>View all</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2.5">
                {recentActivities.map((act) => {
                  const Icon = act.icon;
                  return (
                    <div
                      key={act.id}
                      className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors border border-slate-100 group cursor-pointer"
                      onClick={() => navigate('/app/chat')}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${act.iconBg}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                            {act.title}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">{act.meta}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0 ml-2">
                        {act.xp}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Your Learning Journey (5 Cols) */}
            <div className="dashboard-bento-card md:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-600">
                  <TrendingUp className="w-4 h-4" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">Your Learning Journey</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  You're making steady progress! Keep going to reach your goals.
                </p>
              </div>

              {/* Graphic Bar Chart Visualization matching image */}
              <div className="flex items-end justify-between gap-2 h-20 px-2 py-1 bg-slate-50/70 rounded-2xl border border-slate-100">
                <div className="learning-bar-item w-full bg-indigo-200 h-[35%] rounded-md transition-all hover:bg-indigo-500" />
                <div className="learning-bar-item w-full bg-indigo-300 h-[50%] rounded-md transition-all hover:bg-indigo-500" />
                <div className="learning-bar-item w-full bg-indigo-400 h-[45%] rounded-md transition-all hover:bg-indigo-500" />
                <div className="learning-bar-item w-full bg-indigo-500 h-[70%] rounded-md transition-all hover:bg-indigo-600" />
                <div className="learning-bar-item w-full bg-indigo-600 h-[90%] rounded-md transition-all hover:bg-indigo-700 shadow-xs" />
              </div>

              <button
                type="button"
                onClick={() => navigate('/app/learning-map')}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View Progress</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR WIDGETS COLUMN (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* LEARNING STREAK CARD */}
          <div className="dashboard-bento-card p-5 bg-gradient-to-br from-amber-50/70 to-orange-50/40 border border-amber-200/70 rounded-3xl shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="streak-flame-icon w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl shadow-xs select-none">
                🔥
              </div>
              <div>
                <span className="text-[11px] font-semibold text-amber-800">Learning Streak</span>
                <h4 id="dashboard-streak-count" className="text-xl font-extrabold text-slate-900 tracking-tight font-display">
                  5 Days
                </h4>
                <p className="text-[11px] text-amber-700 font-medium">Keep it up! You're on fire!</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/app/achievements')}
              className="p-2 bg-white rounded-xl border border-amber-200 text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer shadow-xs"
              title="Streak Details"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* ACHIEVEMENTS WIDGET (2x3 Grid) */}
          <div className="dashboard-bento-card bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Achievements</h3>
              <button
                type="button"
                onClick={() => navigate('/app/achievements')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {achievements.map((ach, idx) => {
                const Icon = ach.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => navigate('/app/achievements')}
                    className="flex flex-col items-center text-center p-2.5 rounded-2xl hover:bg-slate-50 transition-all border border-slate-100 cursor-pointer group"
                  >
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${ach.color} shadow-xs group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-700 mt-1.5 line-clamp-2 leading-tight">
                      {ach.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TODAY'S FOCUS WIDGET */}
          <div className="dashboard-bento-card bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Today's Focus</h3>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Complete 2 practice questions in <strong className="text-indigo-600">Database Management</strong>
            </p>

            <div className="space-y-1">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full w-1/2 transition-all duration-300" />
              </div>
              <div className="flex justify-end text-[10px] font-mono text-slate-400 font-semibold">
                1/2
              </div>
            </div>
          </div>

          {/* NEED HELP? METAMIND ASSISTANT WIDGET */}
          <div className="dashboard-bento-card bg-gradient-to-br from-blue-50/70 via-indigo-50/30 to-white border border-blue-100/80 rounded-3xl p-5 shadow-xs space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-xs border border-blue-100 flex items-center justify-center text-xl shrink-0">
                🤖
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Need help?</h4>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Ask MetaMind anything about your learning journey.
                </p>
              </div>
            </div>

            <form onSubmit={handleQuickAsk} className="relative">
              <input
                type="text"
                placeholder="Type your question..."
                value={askInput}
                onChange={(e) => setAskInput(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all shadow-xs"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                title="Send Question"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 1118 0z" />
  </svg>
);
