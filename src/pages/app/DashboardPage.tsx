import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { useLearning } from '@/features/learning';
import { getAvatarPresetByUrl, generateAvatarUrl, sanitizeAvatarUrl } from '@/lib/avatarGenerator';
import { AvatarSelectorModal } from '@/components/ui/AvatarSelectorModal';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Calendar,
  Bell,
  Clock,
  Check,
  Award,
  Bot,
  Plus,
  MoreHorizontal,
  FileCheck,
  Pencil,
  Trash2,
} from 'lucide-react';
import { BadgeCelebrationModal } from '@/components/ui/BadgeCelebrationModal';
import LoaderGrid from '@/components/ui/loader-grid';

export interface DailyTask {
  id: string;
  title: string;
  subtitle: string;
  colorBorder: string;
  tagColor: string;
  tag: string;
  completed: boolean;
}

export interface UpcomingMilestone {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  barColor: string;
}

const DEFAULT_TASKS: DailyTask[] = [
  {
    id: 'task-1',
    title: 'Review SQL JOINs & Foreign Keys',
    subtitle: 'Diagnose missing row edge cases in LEFT JOIN',
    colorBorder: 'border-l-amber-500',
    tagColor: 'text-amber-700 bg-amber-50',
    tag: 'Database',
    completed: true,
  },
  {
    id: 'task-2',
    title: 'Binary Search Trees & Rebalancing',
    subtitle: 'Complete 5-question AI diagnostic test',
    colorBorder: 'border-l-indigo-600',
    tagColor: 'text-indigo-700 bg-indigo-50',
    tag: 'Algorithms',
    completed: false,
  },
  {
    id: 'task-3',
    title: 'Download Neural Networks PDF Guide',
    subtitle: 'Offline exam study guide ready to export',
    colorBorder: 'border-l-emerald-500',
    tagColor: 'text-emerald-700 bg-emerald-50',
    tag: 'Deep Learning',
    completed: false,
  },
];

const DEFAULT_MILESTONES: UpcomingMilestone[] = [
  {
    id: 'mile-1',
    time: '10:00',
    title: 'AI Doubt Diagnostic Review',
    subtitle: 'Database Table Indexing & Missing Rows',
    barColor: 'bg-blue-500',
  },
  {
    id: 'mile-2',
    time: '13:20',
    title: 'Adaptive Practice Quiz',
    subtitle: 'Tree Rebalancing & Big-O Notation',
    barColor: 'bg-amber-500',
  },
  {
    id: 'mile-3',
    time: '16:00',
    title: 'Timed Verification Exam',
    subtitle: 'Earn Verified MetaMind Certificate',
    barColor: 'bg-emerald-500',
  },
];

const TASK_CATEGORIES: Record<string, { tagColor: string; colorBorder: string }> = {
  Database: { tagColor: 'text-amber-700 bg-amber-50', colorBorder: 'border-l-amber-500' },
  Algorithms: { tagColor: 'text-indigo-700 bg-indigo-50', colorBorder: 'border-l-indigo-600' },
  'Deep Learning': { tagColor: 'text-emerald-700 bg-emerald-50', colorBorder: 'border-l-emerald-500' },
  Systems: { tagColor: 'text-rose-700 bg-rose-50', colorBorder: 'border-l-rose-500' },
  Networks: { tagColor: 'text-blue-700 bg-blue-50', colorBorder: 'border-l-blue-500' },
  Mathematics: { tagColor: 'text-purple-700 bg-purple-50', colorBorder: 'border-l-purple-500' },
  General: { tagColor: 'text-slate-700 bg-slate-100', colorBorder: 'border-l-slate-500' },
};

const MILESTONE_BAR_COLORS = [
  { label: 'Blue', value: 'bg-blue-500' },
  { label: 'Indigo', value: 'bg-indigo-500' },
  { label: 'Amber', value: 'bg-amber-500' },
  { label: 'Emerald', value: 'bg-emerald-500' },
  { label: 'Rose', value: 'bg-rose-500' },
];

export const DashboardPage: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const {
    startLearningJourney,
    loading,
    loadingMessage,
    error,
    clearError,
  } = useLearning();

  const navigate = useNavigate();
  const [queryInput, setQueryInput] = useState('');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [celebrationBadge, setCelebrationBadge] = useState<{
    name: string;
    desc: string;
    icon: string;
    xp: number;
  } | null>(null);

  // Daily Tasks state with local storage persistence
  const [todayTasks, setTodayTasks] = useState<DailyTask[]>(() => {
    try {
      const saved = localStorage.getItem('metamind_today_tasks');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load tasks:', e);
    }
    return DEFAULT_TASKS;
  });

  // Upcoming Milestones state with local storage persistence
  const [upcomingSchedule, setUpcomingSchedule] = useState<UpcomingMilestone[]>(() => {
    try {
      const saved = localStorage.getItem('metamind_upcoming_milestones');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load milestones:', e);
    }
    return DEFAULT_MILESTONES;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('metamind_today_tasks', JSON.stringify(todayTasks));
    } catch (e) {
      console.error('Failed to save tasks:', e);
    }
  }, [todayTasks]);

  useEffect(() => {
    try {
      localStorage.setItem('metamind_upcoming_milestones', JSON.stringify(upcomingSchedule));
    } catch (e) {
      console.error('Failed to save milestones:', e);
    }
  }, [upcomingSchedule]);

  // Task Modal Form State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubtitle, setTaskSubtitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('Database');

  // Milestone Modal Form State
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [milestoneTime, setMilestoneTime] = useState('10:00');
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneSubtitle, setMilestoneSubtitle] = useState('');
  const [milestoneBarColor, setMilestoneBarColor] = useState('bg-blue-500');

  // Task Handlers
  const toggleTask = (taskId: string) => {
    setTodayTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleOpenAddTask = () => {
    setEditingTaskId(null);
    setTaskTitle('');
    setTaskSubtitle('');
    setTaskCategory('Database');
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task: DailyTask, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTaskId(task.id);
    setTaskTitle(task.title);
    setTaskSubtitle(task.subtitle);
    setTaskCategory(task.tag);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const styleConfig = TASK_CATEGORIES[taskCategory] || TASK_CATEGORIES.General;

    if (editingTaskId) {
      setTodayTasks((prev) =>
        prev.map((t) =>
          t.id === editingTaskId
            ? {
                ...t,
                title: taskTitle.trim(),
                subtitle: taskSubtitle.trim() || 'Custom study task',
                tag: taskCategory,
                tagColor: styleConfig.tagColor,
                colorBorder: styleConfig.colorBorder,
              }
            : t
        )
      );
    } else {
      const newTask: DailyTask = {
        id: `task-${Date.now()}`,
        title: taskTitle.trim(),
        subtitle: taskSubtitle.trim() || 'Custom study task',
        tag: taskCategory,
        tagColor: styleConfig.tagColor,
        colorBorder: styleConfig.colorBorder,
        completed: false,
      };
      setTodayTasks((prev) => [newTask, ...prev]);
    }
    setIsTaskModalOpen(false);
  };

  const handleDeleteTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTodayTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Milestone Handlers
  const handleOpenAddMilestone = () => {
    setEditingMilestoneId(null);
    setMilestoneTime('10:00');
    setMilestoneTitle('');
    setMilestoneSubtitle('');
    setMilestoneBarColor('bg-blue-500');
    setIsMilestoneModalOpen(true);
  };

  const handleOpenEditMilestone = (m: UpcomingMilestone, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMilestoneId(m.id);
    setMilestoneTime(m.time);
    setMilestoneTitle(m.title);
    setMilestoneSubtitle(m.subtitle);
    setMilestoneBarColor(m.barColor);
    setIsMilestoneModalOpen(true);
  };

  const handleSaveMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneTitle.trim() || !milestoneTime.trim()) return;

    if (editingMilestoneId) {
      setUpcomingSchedule((prev) =>
        prev.map((m) =>
          m.id === editingMilestoneId
            ? {
                ...m,
                time: milestoneTime.trim(),
                title: milestoneTitle.trim(),
                subtitle: milestoneSubtitle.trim() || 'Scheduled milestone',
                barColor: milestoneBarColor,
              }
            : m
        )
      );
    } else {
      const newMilestone: UpcomingMilestone = {
        id: `mile-${Date.now()}`,
        time: milestoneTime.trim(),
        title: milestoneTitle.trim(),
        subtitle: milestoneSubtitle.trim() || 'Scheduled milestone',
        barColor: milestoneBarColor,
      };
      setUpcomingSchedule((prev) => [...prev, newMilestone]);
    }
    setIsMilestoneModalOpen(false);
  };

  const handleDeleteMilestone = (milestoneId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUpcomingSchedule((prev) => prev.filter((m) => m.id !== milestoneId));
  };

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

  const handleSelectAvatar = async (newUrl: string) => {
    try {
      await updateProfile({ avatar_url: newUrl });
    } catch (err) {
      console.error('Failed to update avatar:', err);
    }
  };

  // Popular Modules (Image 3)
  const popularModules = [
    {
      id: 'mod-1',
      title: 'UI/UX & Cognitive Systems',
      count: '30+ Concepts',
      letter: 'U',
      bgLetter: 'bg-amber-100 text-amber-800',
      link: '/app/learning-map',
    },
    {
      id: 'mod-2',
      title: 'Relational Database Architecture',
      count: '25+ Concepts',
      letter: 'M',
      bgLetter: 'bg-rose-100 text-rose-800',
      link: '/app/learning-map',
    },
    {
      id: 'mod-3',
      title: 'Algorithms & Tree Complexity',
      count: '45+ Concepts',
      letter: 'W',
      bgLetter: 'bg-teal-100 text-teal-800',
      link: '/app/learning-map',
    },
    {
      id: 'mod-4',
      title: 'Discrete Mathematics & Logic',
      count: '50+ Concepts',
      letter: 'M',
      bgLetter: 'bg-indigo-100 text-indigo-800',
      link: '/app/learning-map',
    },
  ];

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 text-slate-800 selection:bg-indigo-100">
      {/* Ambient Theme Glow */}
      <div
        className="fixed top-0 right-0 w-[650px] h-[650px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 opacity-20 z-0"
        style={{ background: theme.glow }}
      />

      {/* ========================================================= */}
      {/* 1. TOP HEADER BAR (Matching Images 2 & 3: Greeting, Search, Actions) */}
      {/* ========================================================= */}
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
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
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
              Today is {currentDateFormatted} • @{username}
            </p>
          </div>
        </div>

        {/* Global Search Bar + Add Project Action (Image 2) */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
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
              placeholder="Search for query or doubt..."
              className="w-full bg-white border border-slate-200/90 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-500 shadow-xs transition-all"
            />
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/app/chat')}
            className="font-bold shadow-md cursor-pointer transition-transform hover:scale-105 text-white gap-2 px-4 rounded-2xl shrink-0"
            style={{ backgroundColor: '#1E293B' }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New Project
          </Button>

          <button
            onClick={() => navigate('/app/achievements')}
            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Error Notice */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-between z-10 relative">
          <span>{error}</span>
          <button onClick={clearError} className="text-xs underline font-medium cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* AI Generator Loading Banner */}
      {loading && (
        <div className="p-4 rounded-2xl bg-white border border-blue-200 flex items-center justify-center gap-3 text-sm text-slate-800 shadow-sm relative z-10">
          <LoaderGrid size="0.6em" />
          <span className="font-medium animate-pulse">
            {loadingMessage || 'Generating custom learning session concept graph...'}
          </span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. ANALYTICS OVERVIEW HERO BANNER (Matching Image 3) */}
      {/* ========================================================= */}
      <div className="relative z-10 rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#1B9984] via-[#24A690] to-[#2DC4AA] text-white shadow-lg overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-xs">
              Analytics Overview
            </span>
            <span className="text-xs text-emerald-100 font-medium">Adaptive Diagnostic Active</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight leading-tight">
            Learn Effectively With MetaMind AI!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed font-sans">
            AI diagnostic loop has analyzed your learning patterns. 3 key conceptual gaps are currently targeted for rapid score improvement.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-xl backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span className="text-xs font-bold text-white">Students: 65,000+</span>
            </div>

            <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-xl backdrop-blur-xs">
              <Bot className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-xs font-bold text-white">AI Mentors: 250+</span>
            </div>

            <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-xl backdrop-blur-xs">
              <Award className="w-3.5 h-3.5 text-yellow-300" />
              <span className="text-xs font-bold text-white">Mastery Score: 88%</span>
            </div>
          </div>
        </div>

        {/* Right CTA / Action in banner */}
        <div className="flex flex-col sm:flex-row items-center gap-3 z-10 shrink-0">
          <button
            onClick={() => navigate('/app/chat')}
            className="px-5 py-3 rounded-2xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition-all shadow-md cursor-pointer flex items-center gap-2 hover:scale-105"
          >
            <Bot className="w-4 h-4 text-emerald-700" />
            <span>Launch AI Doubt Tutor</span>
          </button>

          <button
            onClick={() => navigate('/app/exam')}
            className="px-5 py-3 rounded-2xl bg-emerald-950/40 text-white font-bold text-xs hover:bg-emerald-950/60 border border-white/20 transition-all cursor-pointer flex items-center gap-2"
          >
            <FileCheck className="w-4 h-4" />
            <span>Take Test</span>
          </button>
        </div>

        {/* Subtle Decorative Circles */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 pointer-events-none blur-xl" />
        <div className="absolute left-1/2 -top-12 w-48 h-48 rounded-full bg-white/10 pointer-events-none blur-lg" />
      </div>

      {/* ========================================================= */}
      {/* 3. THREE PRIMARY TOPIC MASTERY CARDS (Matching Image 2 Top Row) */}
      {/* ========================================================= */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Active Track Progress
          </h3>
          <span
            onClick={() => navigate('/app/learning-map')}
            className="text-xs text-slate-500 hover:text-indigo-600 cursor-pointer font-medium transition-colors"
          >
            View all courses →
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Purple / Deep Violet Theme */}
          <div
            onClick={() => navigate('/app/learning-map')}
            className="p-6 rounded-3xl bg-[#52337A] text-white space-y-4 shadow-md hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              {/* Avatar Bubble stack (+7) */}
              <div className="flex items-center -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop"
                  alt="Student"
                  className="w-7 h-7 rounded-full border-2 border-[#52337A] object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"
                  alt="Student"
                  className="w-7 h-7 rounded-full border-2 border-[#52337A] object-cover"
                />
                <span className="w-7 h-7 rounded-full bg-white/25 border-2 border-[#52337A] flex items-center justify-center text-[10px] font-bold">
                  +7
                </span>
              </div>

              <button className="text-white/60 hover:text-white p-1">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold font-display tracking-tight leading-snug">
                Web & Cloud Development
              </h4>
              <p className="text-xs text-purple-200">10 tasks • 96% Mastery</p>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full rounded-full transition-all duration-700" style={{ width: '96%' }} />
              </div>
            </div>
          </div>

          {/* Card 2: Teal / Cyan Theme */}
          <div
            onClick={() => navigate('/app/learning-map')}
            className="p-6 rounded-3xl bg-[#61C2BE] text-white space-y-4 shadow-md hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              {/* Avatar Bubble stack (+9) */}
              <div className="flex items-center -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop"
                  alt="Student"
                  className="w-7 h-7 rounded-full border-2 border-[#61C2BE] object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop"
                  alt="Student"
                  className="w-7 h-7 rounded-full border-2 border-[#61C2BE] object-cover"
                />
                <span className="w-7 h-7 rounded-full bg-white/25 border-2 border-[#61C2BE] flex items-center justify-center text-[10px] font-bold">
                  +9
                </span>
              </div>

              <button className="text-white/60 hover:text-white p-1">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold font-display tracking-tight leading-snug">
                Algorithm & Data Structure
              </h4>
              <p className="text-xs text-teal-100">12 tasks • 78% Mastery</p>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full rounded-full transition-all duration-700" style={{ width: '78%' }} />
              </div>
            </div>
          </div>

          {/* Card 3: Orange / Coral Theme */}
          <div
            onClick={() => navigate('/app/learning-map')}
            className="p-6 rounded-3xl bg-[#F26E43] text-white space-y-4 shadow-md hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              {/* Avatar Bubble stack (+3) */}
              <div className="flex items-center -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&h=80&fit=crop"
                  alt="Student"
                  className="w-7 h-7 rounded-full border-2 border-[#F26E43] object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop"
                  alt="Student"
                  className="w-7 h-7 rounded-full border-2 border-[#F26E43] object-cover"
                />
                <span className="w-7 h-7 rounded-full bg-white/25 border-2 border-[#F26E43] flex items-center justify-center text-[10px] font-bold">
                  +3
                </span>
              </div>

              <button className="text-white/60 hover:text-white p-1">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold font-display tracking-tight leading-snug">
                Systems & Network Logic
              </h4>
              <p className="text-xs text-orange-100">22 tasks • 85% Mastery</p>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full rounded-full transition-all duration-700" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. MAIN 2-COLUMN GRID (TASKS & COURSES vs. STATS & SCHEDULE) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* LEFT COLUMN: TASKS FOR TODAY & POPULAR COURSES (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* TASKS FOR TODAY (Matching Image 2 Layout + Add/Edit/Delete) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Tasks for today
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-mono">
                  {todayTasks.filter((t) => t.completed).length} of {todayTasks.length} Completed
                </span>
                <button
                  onClick={handleOpenAddTask}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {todayTasks.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs space-y-2">
                  <p className="font-medium">No tasks for today.</p>
                  <button
                    onClick={handleOpenAddTask}
                    className="text-indigo-600 font-bold hover:underline cursor-pointer"
                  >
                    + Add your first study task
                  </button>
                </div>
              ) : (
                todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3 border-l-4 ${task.colorBorder} group`}
                  >
                    {/* Clickable toggle area */}
                    <div
                      onClick={() => toggleTask(task.id)}
                      className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                    >
                      {/* Completion check circle */}
                      <div
                        className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                          task.completed
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'border-slate-300 group-hover:border-slate-400 bg-white'
                        }`}
                      >
                        {task.completed && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>

                      <div className="space-y-1 truncate">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-xs sm:text-sm font-bold truncate ${
                              task.completed ? 'text-slate-400 line-through' : 'text-slate-900'
                            }`}
                          >
                            {task.title}
                          </h4>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${task.tagColor}`}>
                            {task.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">{task.subtitle}</p>
                      </div>
                    </div>

                    {/* Actions: Edit & Delete buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => handleOpenEditTask(task, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer"
                        title="Edit Task"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteTask(task.id, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* POPULAR COURSES / MODULES (Matching Image 3 Layout) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Popular Courses & Modules
              </h3>
              <span
                onClick={() => navigate('/app/learning-map')}
                className="text-xs text-slate-500 hover:text-indigo-600 cursor-pointer font-medium"
              >
                All Courses ▾
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
              {popularModules.map((mod) => (
                <div
                  key={mod.id}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
                >
                  <div className="flex items-center gap-3.5 truncate">
                    <div
                      className={`w-10 h-10 rounded-xl ${mod.bgLetter} flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs`}
                    >
                      {mod.letter}
                    </div>
                    <div className="truncate">
                      <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {mod.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{mod.count}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(mod.link)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 group-hover:border-indigo-400 group-hover:bg-indigo-50 text-[11px] font-bold text-slate-700 group-hover:text-indigo-900 transition-all cursor-pointer shrink-0 shadow-2xs"
                  >
                    View Course
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PROGRESS WAVE GRAPH, METRIC CARDS & CALENDAR (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* MONTHLY PROGRESS CURVED GRAPH (Matching Image 3 Activity Card) */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1E8E81] to-[#12665B] text-white shadow-md space-y-4 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-bold font-display">Monthly Progress Curve</h4>
                <p className="text-[11px] text-teal-100">Adaptive cognitive mastery trend</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold text-white">
                +24% Growth
              </span>
            </div>

            {/* Smooth Curved SVG Wave Line Graph */}
            <div className="h-28 w-full pt-2">
              <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area under curve */}
                <path
                  d="M0,80 Q50,90 100,60 T200,40 T300,15 L300,100 L0,100 Z"
                  fill="url(#curveGradient)"
                />
                {/* Smooth trend curve */}
                <path
                  d="M0,80 Q50,90 100,60 T200,40 T300,15"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Target glowing dot */}
                <circle cx="300" cy="15" r="5" fill="#FCD34D" stroke="#FFFFFF" strokeWidth="2" />
              </svg>
            </div>

            <div className="flex items-center justify-between text-[10px] text-teal-100 font-mono pt-1 border-t border-white/15">
              <span>Jan (65%)</span>
              <span>Feb (72%)</span>
              <span>Mar (81%)</span>
              <span className="font-bold text-yellow-300">Apr (92%)</span>
            </div>
          </div>

          {/* QUICK METRICS WIDGETS (Matching Images 2 & 3) */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* 45K+ Completed (Yellow card from Image 3) */}
            <div className="p-4 rounded-3xl bg-[#FAB832] text-slate-900 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl">🏆</span>
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">
                  ↗
                </span>
              </div>
              <div>
                <p className="text-2xl font-black font-display leading-tight">45K+</p>
                <p className="text-[11px] font-bold text-slate-800">Mastered Concepts</p>
              </div>
            </div>

            {/* 20K+ Videos (Red/Coral card from Image 3) */}
            <div className="p-4 rounded-3xl bg-[#F05A40] text-white shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl">🎬</span>
                <span className="w-6 h-6 rounded-full bg-white text-rose-600 flex items-center justify-center text-xs">
                  ▶
                </span>
              </div>
              <div>
                <p className="text-2xl font-black font-display leading-tight">20K+</p>
                <p className="text-[11px] font-bold text-rose-100">Practice Drills</p>
              </div>
            </div>

            {/* 28h Tracked Time (Image 2) */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-1">
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-4 h-4" />
                <span className="text-[10px] font-mono uppercase font-bold">Tracked Time</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 font-display">28 h</p>
              <p className="text-[10px] text-slate-500">Continuous Study</p>
            </div>

            {/* 18 Finished Tasks (Image 2) */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-1">
              <div className="flex items-center gap-2 text-slate-400">
                <Award className="w-4 h-4" />
                <span className="text-[10px] font-mono uppercase font-bold">Certificates</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 font-display">18</p>
              <p className="text-[10px] text-slate-500">Verified Badges</p>
            </div>
          </div>

          {/* CALENDAR & UPCOMING MILESTONES (Matching Image 2 Right Column) */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-slate-900 font-display uppercase tracking-wider">
                  Upcoming Milestones
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenAddMilestone}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
                <button
                  onClick={() => navigate('/app/exam')}
                  className="text-[11px] text-slate-400 hover:text-slate-700 font-medium transition-colors"
                >
                  Calendar
                </button>
              </div>
            </div>

            <div className="space-y-1">
              {upcomingSchedule.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl p-4">
                  <p className="text-xs text-slate-500 font-medium">No upcoming milestones</p>
                  <button
                    onClick={handleOpenAddMilestone}
                    className="mt-2 text-xs font-semibold text-indigo-600 hover:underline inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add milestone
                  </button>
                </div>
              ) : (
                upcomingSchedule.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/90 transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <span className="font-mono text-xs font-bold text-slate-700 w-12 shrink-0 mt-0.5">
                        {item.time}
                      </span>
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <span className={`w-1.5 h-8 rounded-full ${item.barColor} shrink-0 mt-0.5`} />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-900 truncate">{item.title}</div>
                          <div className="text-[11px] text-slate-500 truncate">{item.subtitle}</div>
                        </div>
                      </div>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 pl-2 transition-opacity shrink-0">
                      <button
                        onClick={(e) => handleOpenEditMilestone(item, e)}
                        className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit milestone"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteMilestone(item.id, e)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete milestone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TASK MODAL (Add / Edit) */}
      <Dialog
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        className="bg-white border border-slate-200/90 text-slate-900 rounded-3xl p-6 max-w-md shadow-2xl"
      >
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                {editingTaskId ? 'Edit Task' : 'Add New Task'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {editingTaskId
                  ? 'Update your daily learning checklist item'
                  : 'Track a specific topic or concept to complete today'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveTask} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Task Title *
              </label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Master B-Tree Indexing"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Sub-topic / Objective
              </label>
              <input
                type="text"
                value={taskSubtitle}
                onChange={(e) => setTaskSubtitle(e.target.value)}
                placeholder="e.g. Solve 3 practice queries & query plans"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Subject Tag
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(TASK_CATEGORIES).map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setTaskCategory(cat)}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all text-left flex items-center justify-between ${
                      taskCategory === cat
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                    }`}
                  >
                    <span>{cat}</span>
                    {taskCategory === cat && <span className="text-indigo-600 text-xs">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsTaskModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors"
              >
                {editingTaskId ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </Dialog>

      {/* UPCOMING MILESTONE MODAL (Add / Edit) */}
      <Dialog
        isOpen={isMilestoneModalOpen}
        onClose={() => setIsMilestoneModalOpen(false)}
        className="bg-white border border-slate-200/90 text-slate-900 rounded-3xl p-6 max-w-md shadow-2xl"
      >
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                {editingMilestoneId ? 'Edit Milestone' : 'Add Upcoming Milestone'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {editingMilestoneId
                  ? 'Update milestone schedule and target goals'
                  : 'Schedule an exam, live session, or key milestone'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveMilestone} className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Schedule / Time *
                </label>
                <input
                  type="text"
                  value={milestoneTime}
                  onChange={(e) => setMilestoneTime(e.target.value)}
                  placeholder="e.g. 10:30 or Tomorrow"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Accent Color
                </label>
                <div className="flex items-center gap-2 pt-2">
                  {MILESTONE_BAR_COLORS.map((c) => (
                    <button
                      type="button"
                      key={c.value}
                      onClick={() => setMilestoneBarColor(c.value)}
                      className={`w-6 h-6 rounded-full ${c.value} transition-transform ${
                        milestoneBarColor === c.value
                          ? 'ring-2 ring-offset-2 ring-indigo-600 scale-110'
                          : 'hover:scale-105 opacity-70 hover:opacity-100'
                      }`}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Milestone Title *
              </label>
              <input
                type="text"
                value={milestoneTitle}
                onChange={(e) => setMilestoneTitle(e.target.value)}
                placeholder="e.g. System Design Mock Interview"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Description / Target
              </label>
              <input
                type="text"
                value={milestoneSubtitle}
                onChange={(e) => setMilestoneSubtitle(e.target.value)}
                placeholder="e.g. 45-min live architectural review"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsMilestoneModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors"
              >
                {editingMilestoneId ? 'Save Changes' : 'Add Milestone'}
              </button>
            </div>
          </form>
        </div>
      </Dialog>

      {/* MODALS */}
      <AvatarSelectorModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatarUrl={avatarUrl}
        onSelectAvatar={handleSelectAvatar}
      />

      {celebrationBadge && (
        <BadgeCelebrationModal
          isOpen={true}
          onClose={() => setCelebrationBadge(null)}
          badgeName={celebrationBadge.name}
          badgeDescription={celebrationBadge.desc}
          badgeIcon={celebrationBadge.icon}
          xpEarned={celebrationBadge.xp}
        />
      )}
    </div>
  );
};
