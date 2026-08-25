import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { getAvatarPresetByUrl, generateAvatarUrl } from '@/lib/avatarGenerator';
import { Button } from '@/components/ui/Button';
import {
  Users,
  Play,
  Pause,
  RotateCcw,
  MessageSquare,
  Send,
  Zap,
  CheckCircle2,
  HelpCircle,
  Clock,
  Radio,
} from 'lucide-react';

interface SquadMember {
  id: string;
  name: string;
  avatarUrl: string;
  role: string;
  status: 'focusing' | 'break' | 'asking';
  streak: number;
}

interface SquadDoubt {
  id: string;
  author: string;
  text: string;
  time: string;
  replies: number;
  solved: boolean;
}

export const GroupStudyPage: React.FC = () => {
  const { user, profile } = useAuth();

  const studentName = profile?.full_name || user?.user_metadata?.full_name || 'Vipin';
  const avatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset.theme;

  // Timer State (25 mins = 1500s)
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  // Lo-Fi Audio state
  const [activeSound, setActiveSound] = useState<string>('Lo-Fi Beats 🎧');
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  // Active squad members
  const [members] = useState<SquadMember[]>([
    {
      id: 'm1',
      name: `${studentName} (You)`,
      avatarUrl: avatarUrl,
      role: 'Room Host',
      status: 'focusing',
      streak: 5,
    },
    {
      id: 'm2',
      name: 'Wade Warren',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      role: 'Computer Science',
      status: 'focusing',
      streak: 12,
    },
    {
      id: 'm3',
      name: 'Brooklyn Simmons',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      role: 'Data Science',
      status: 'focusing',
      streak: 8,
    },
    {
      id: 'm4',
      name: 'Jenny Wilson',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      role: 'Mathematics',
      status: 'break',
      streak: 4,
    },
  ]);

  // Squad doubt board
  const [doubts, setDoubts] = useState<SquadDoubt[]>([
    {
      id: 'd1',
      author: 'Wade Warren',
      text: 'How do index scans differ from sequential scans in SQL?',
      time: '5m ago',
      replies: 2,
      solved: true,
    },
    {
      id: 'd2',
      author: 'Brooklyn Simmons',
      text: 'Need help resolving stack overflow in recursion base case!',
      time: '12m ago',
      replies: 4,
      solved: false,
    },
  ]);

  const [newDoubtText, setNewDoubtText] = useState('');
  const [puzzleSolved, setPuzzleSolved] = useState(false);

  // Timer Countdown Logic
  useEffect(() => {
    let timer: any;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      if (mode === 'focus') {
        setMode('break');
        setTimeLeft(300); // 5 mins break
      } else {
        setMode('focus');
        setTimeLeft(1500);
      }
      setIsTimerRunning(false);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft, mode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePostDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoubtText.trim()) return;

    setDoubts((prev) => [
      {
        id: `d-${Date.now()}`,
        author: studentName,
        text: newDoubtText,
        time: 'Just now',
        replies: 0,
        solved: false,
      },
      ...prev,
    ]);
    setNewDoubtText('');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 text-slate-800 selection:bg-blue-100">
      {/* Light Radial Ambient Glow */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 opacity-25 z-0"
        style={{ background: theme.glow }}
      />

      {/* TOP HEADER */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-white shadow-sm border border-slate-200 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
                Virtual Group Study Room
              </h1>
              <p className="text-xs text-slate-500 font-sans">
                Shared Pomodoro Timer • Lo-Fi Beats • Collaborative Team Puzzles
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            4 Classmates Studying Live
          </span>
        </div>
      </header>

      {/* MAIN TWO COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* LEFT COLUMN: TIMER & TEAM PUZZLE (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* SYNCHRONIZED POMODORO TIMER CARD */}
          <div className="rounded-3xl p-8 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Shared Focus Session
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-bold text-xs font-mono">
                {mode === 'focus' ? '🎯 25m Focus Block' : '☕ 5m Refresh Break'}
              </span>
            </div>

            {/* Timer Display Circle */}
            <div className="flex flex-col items-center justify-center py-6 space-y-2">
              <div className="relative w-56 h-56 rounded-full border-8 border-slate-100 flex flex-col items-center justify-center shadow-inner bg-gradient-to-br from-slate-50 to-blue-50/30">
                <span className="text-6xl font-extrabold font-mono text-slate-900 tracking-tight">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {isTimerRunning ? 'Squad Focusing...' : 'Timer Paused'}
                </span>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-3 pt-4">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="px-6 py-3 rounded-full font-bold shadow-md cursor-pointer"
                  style={{ backgroundColor: theme.primary, color: '#FFFFFF' }}
                  leftIcon={isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                >
                  {isTimerRunning ? 'Pause Session' : 'Start Squad Timer'}
                </Button>

                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimeLeft(mode === 'focus' ? 1500 : 300);
                  }}
                  className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer transition-all"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Lo-Fi Ambient Sound Bar */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Radio className="w-4 h-4 text-purple-600 animate-pulse" />
                <div>
                  <p className="text-xs font-bold text-slate-800">Ambient Audio Soundscape</p>
                  <p className="text-[11px] text-slate-500 font-mono">{activeSound}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {(['Lo-Fi Beats 🎧', 'Rain Drops 🌧️', 'Binaural 🌊'] as const).map((snd) => (
                  <button
                    key={snd}
                    onClick={() => {
                      setActiveSound(snd);
                      setIsPlayingSound(true);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      activeSound === snd && isPlayingSound
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {snd}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* TEAM CONCEPT PUZZLE CHALLENGE CARD */}
          <div className="rounded-3xl p-6 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4.5 h-4.5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">
                  Daily Squad Puzzle Challenge
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 font-bold text-xs font-mono border border-amber-200">
                +100 Squad Team XP
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Assemble the correct execution order for a <span className="font-bold">SQL LEFT JOIN</span> operation to unlock team bonus points!
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-semibold text-slate-700">
                Puzzle Task: Drag or click to order the join execution steps:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-sm flex items-center justify-between">
                  <span>1. Evaluate FROM Clause</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-sm flex items-center justify-between">
                  <span>2. Match ON Key Predicates</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-sm flex items-center justify-between">
                  <span>3. Retain Unmatched Left Rows</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setPuzzleSolved(true)}
                disabled={puzzleSolved}
                className="w-full font-bold text-xs cursor-pointer shadow-md"
                style={{ backgroundColor: theme.primary, color: '#FFFFFF' }}
              >
                {puzzleSolved ? '✅ Puzzle Solved (+100 XP Earned!)' : 'Submit Squad Solution →'}
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE CLASSMATES & DOUBT BOARD (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* ACTIVE CLASSMATES LIST */}
          <div className="rounded-3xl p-6 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Active Squad Members ({members.length})
              </h3>
              <span className="text-xs text-slate-400 font-mono">Live Sync</span>
            </div>

            <div className="space-y-3">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={m.avatarUrl}
                      alt={m.name}
                      className="w-9 h-9 rounded-xl border border-slate-200 object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{m.name}</p>
                      <p className="text-[10px] text-slate-500">{m.role}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold font-mono border border-emerald-200">
                      🔥 {m.streak}d Streak
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SQUAD LIVE DOUBT BOARD */}
          <div className="rounded-3xl p-6 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-600" />
                Squad Doubt Board
              </h3>
              <span className="text-xs text-slate-500 font-medium">Ask & Learn</span>
            </div>

            {/* Doubt Input */}
            <form onSubmit={handlePostDoubt} className="flex items-center gap-2">
              <input
                type="text"
                value={newDoubtText}
                onChange={(e) => setNewDoubtText(e.target.value)}
                placeholder="Post a doubt for the squad..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!newDoubtText.trim()}
                className="p-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* List of Doubts */}
            <div className="space-y-3 pt-1">
              {doubts.map((d) => (
                <div key={d.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{d.author}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{d.time}</span>
                  </div>
                  <p className="text-xs text-slate-700">{d.text}</p>
                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-blue-600 font-medium flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" /> {d.replies} replies
                    </span>
                    {d.solved && (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
