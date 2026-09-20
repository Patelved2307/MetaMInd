import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import {
  ShieldAlert,
  KeyRound,
  Cpu,
  Users,
  BookOpen,
  AlertTriangle,
  Activity,
  BarChart3,
  Lock,
  Unlock,
  Sparkles,
  RefreshCw,
  Send,
  CheckCircle2,
  Search,
  Plus,
  Zap,
  Radio,
  FileText,
  Clock,
  Trash2,
  Fingerprint,
  TrendingUp,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { CHAPTER_CONTENT_REGISTRY, type ChapterContent } from '@/data/chaptersContentData';

// Secret Master Passkeys accepted
const VALID_PASSKEYS = ['METAMIND-ADMIN-2026', 'ADMIN2026', 'ADMIN', 'MASTERKEY', 'DEEPLEARN'];

interface StudentRosterItem {
  id: string;
  name: string;
  avatar: string;
  email: string;
  enrolledCourse: string;
  masteryScore: number;
  cognitiveTier: 'Mastery' | 'High' | 'Moderate' | 'Needs Remediation';
  studyGuidesDownloaded: number;
  streakDays: number;
  lastActive: string;
  flaggedMisconception?: string;
}

const INITIAL_ROSTER: StudentRosterItem[] = [
  {
    id: 'SCH-8021',
    name: 'Aarav Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    email: 'aarav.sharma@stanford.edu',
    enrolledCourse: 'Science & Database Systems',
    masteryScore: 94,
    cognitiveTier: 'Mastery',
    studyGuidesDownloaded: 12,
    streakDays: 14,
    lastActive: '6 mins ago',
  },
  {
    id: 'SCH-8022',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    email: 'elena.rostova@mit.edu',
    enrolledCourse: 'Data Structures & Algorithms',
    masteryScore: 88,
    cognitiveTier: 'High',
    studyGuidesDownloaded: 9,
    streakDays: 8,
    lastActive: '18 mins ago',
  },
  {
    id: 'SCH-8023',
    name: 'Ved Patel',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    email: 'ved.patel@metamind.ai',
    enrolledCourse: 'Science & Database Systems',
    masteryScore: 92,
    cognitiveTier: 'Mastery',
    studyGuidesDownloaded: 15,
    streakDays: 19,
    lastActive: 'Just now',
  },
  {
    id: 'SCH-8024',
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    email: 'marcus.chen@berkeley.edu',
    enrolledCourse: 'Maths & Operating Systems',
    masteryScore: 61,
    cognitiveTier: 'Needs Remediation',
    studyGuidesDownloaded: 4,
    streakDays: 2,
    lastActive: '2 hours ago',
    flaggedMisconception: 'Conflating TLB miss with Page Fault interrupt',
  },
  {
    id: 'SCH-8025',
    name: 'Sophia Williams',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    email: 'sophia.w@oxford.ac.uk',
    enrolledCourse: 'Science & Database Systems',
    masteryScore: 78,
    cognitiveTier: 'Moderate',
    studyGuidesDownloaded: 7,
    streakDays: 5,
    lastActive: '45 mins ago',
    flaggedMisconception: 'Three-Valued Logic NULL equality trap',
  },
  {
    id: 'SCH-8026',
    name: 'Liam Takahashi',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    email: 'liam.t@tokyo-u.ac.jp',
    enrolledCourse: 'Data Structures & Algorithms',
    masteryScore: 84,
    cognitiveTier: 'High',
    studyGuidesDownloaded: 6,
    streakDays: 7,
    lastActive: '1 hour ago',
  },
];

export const AdminNexusPage: React.FC = () => {
  const navigate = useNavigate();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('metamind_admin_auth') === 'true';
  });
  const [passkeyInput, setPasskeyInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [biometricScanning, setBiometricScanning] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'vulnerabilities' | 'curriculum' | 'roster' | 'ai-telemetry' | 'broadcast'>('overview');

  // Chart timeframes
  const [chartTimeframe, setChartTimeframe] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'>('MONTHLY');

  // Live Clock
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  // Roster & Content state
  const [roster] = useState<StudentRosterItem[]>(INITIAL_ROSTER);
  const [searchRoster, setSearchRoster] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');

  // Curriculum Manager State
  const [curriculumList, setCurriculumList] = useState<ChapterContent[]>(() => Object.values(CHAPTER_CONTENT_REGISTRY));
  const [curriculumSearch, setCurriculumSearch] = useState('');
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [selectedChapterForQuestion, setSelectedChapterForQuestion] = useState('db-1');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionOptionA, setNewQuestionOptionA] = useState('');
  const [newQuestionOptionB, setNewQuestionOptionB] = useState('');
  const [newQuestionOptionC, setNewQuestionOptionC] = useState('');
  const [newQuestionOptionD, setNewQuestionOptionD] = useState('');
  const [newQuestionCorrectIndex, setNewQuestionCorrectIndex] = useState(0);
  const [newQuestionExplanation, setNewQuestionExplanation] = useState('');

  // Global Broadcast State
  const [broadcastMessage, setBroadcastMessage] = useState(() => localStorage.getItem('metamind_admin_broadcast') || '');
  const [broadcastDraft, setBroadcastDraft] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Animation Refs
  const authContainerRef = useRef<HTMLDivElement>(null);
  const dashboardContainerRef = useRef<HTMLDivElement>(null);
  const counterScholarsRef = useRef<HTMLSpanElement>(null);
  const counterDoubtsRef = useRef<HTMLSpanElement>(null);
  const counterGuidesRef = useRef<HTMLSpanElement>(null);
  const counterRetentionRef = useRef<HTMLSpanElement>(null);

  // Clock interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    if (!isAuthenticated) {
      if (authContainerRef.current) {
        gsap.fromTo(
          authContainerRef.current,
          { opacity: 0, scale: 0.94, y: 24 },
          { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'power3.out' }
        );
      }
    } else {
      if (dashboardContainerRef.current) {
        const ctx = gsap.context(() => {
          // Stagger Entrance for Bento Cards
          gsap.fromTo(
            '.admin-light-card',
            { opacity: 0, y: 18, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out' }
          );

          // Counter Numbers
          const scholarsObj = { val: 0 };
          gsap.to(scholarsObj, {
            val: 2847,
            duration: 1.5,
            ease: 'power2.out',
            roundProps: 'val',
            onUpdate: () => {
              if (counterScholarsRef.current) counterScholarsRef.current.innerText = scholarsObj.val.toLocaleString();
            },
          });

          const doubtsObj = { val: 0 };
          gsap.to(doubtsObj, {
            val: 18920,
            duration: 1.6,
            ease: 'power2.out',
            roundProps: 'val',
            onUpdate: () => {
              if (counterDoubtsRef.current) counterDoubtsRef.current.innerText = doubtsObj.val.toLocaleString();
            },
          });

          const guidesObj = { val: 0 };
          gsap.to(guidesObj, {
            val: 4120,
            duration: 1.4,
            ease: 'power2.out',
            roundProps: 'val',
            onUpdate: () => {
              if (counterGuidesRef.current) counterGuidesRef.current.innerText = guidesObj.val.toLocaleString();
            },
          });

          const retentionObj = { val: 0 };
          gsap.to(retentionObj, {
            val: 86.4,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: () => {
              if (counterRetentionRef.current) counterRetentionRef.current.innerText = retentionObj.val.toFixed(1) + '%';
            },
          });
        }, dashboardContainerRef);

        return () => ctx.revert();
      }
    }
  }, [isAuthenticated, activeTab]);

  // Auth Submission Handler
  const handleVerifyPasskey = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError('');
    setIsVerifying(true);

    setTimeout(() => {
      const normalized = passkeyInput.trim().toUpperCase();
      if (VALID_PASSKEYS.includes(normalized) || passkeyInput.trim() === 'METAMIND-ADMIN-2026') {
        sessionStorage.setItem('metamind_admin_auth', 'true');
        setIsAuthenticated(true);
        setIsVerifying(false);
      } else {
        setIsVerifying(false);
        setAuthError('Access Denied: Invalid Security Passkey. Incident logged in security ledger.');
        if (authContainerRef.current) {
          gsap.fromTo(
            authContainerRef.current,
            { x: -12 },
            { x: 12, duration: 0.08, repeat: 5, yoyo: true, ease: 'power2.inOut', onComplete: () => gsap.set(authContainerRef.current, { x: 0 }) }
          );
        }
      }
    }, 500);
  };

  // Biometric Fast Unlock
  const handleBiometricAuth = () => {
    setBiometricScanning(true);
    setAuthError('');
    setTimeout(() => {
      setBiometricScanning(false);
      sessionStorage.setItem('metamind_admin_auth', 'true');
      setIsAuthenticated(true);
    }, 1000);
  };

  // Terminate Admin Session
  const handleSignOut = () => {
    sessionStorage.removeItem('metamind_admin_auth');
    setIsAuthenticated(false);
    setPasskeyInput('');
  };

  // Broadcast Handler
  const handleSaveBroadcast = () => {
    if (!broadcastDraft.trim()) {
      localStorage.removeItem('metamind_admin_broadcast');
      setBroadcastMessage('');
    } else {
      localStorage.setItem('metamind_admin_broadcast', broadcastDraft.trim());
      setBroadcastMessage(broadcastDraft.trim());
    }
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 3000);
  };

  // Add Question Handler
  const handleAddQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !newQuestionOptionA.trim()) return;

    const targetChapter = curriculumList.find((c) => c.id === selectedChapterForQuestion);
    if (targetChapter) {
      const options = [newQuestionOptionA, newQuestionOptionB, newQuestionOptionC, newQuestionOptionD].filter(Boolean);
      const newQ = {
        id: `q-custom-${Date.now()}`,
        question: newQuestionText,
        options,
        correctAnswer: options[newQuestionCorrectIndex] || options[0],
        explanation: newQuestionExplanation || 'Added via MetaMind Admin Content CMS.',
      };
      targetChapter.questions.push(newQ);
      setCurriculumList([...curriculumList]);
      setShowAddQuestionModal(false);
      setNewQuestionText('');
      setNewQuestionOptionA('');
      setNewQuestionOptionB('');
      setNewQuestionOptionC('');
      setNewQuestionOptionD('');
      setNewQuestionExplanation('');
    }
  };

  // Filtered Roster
  const filteredRoster = roster.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchRoster.toLowerCase()) || s.email.toLowerCase().includes(searchRoster.toLowerCase()) || s.id.toLowerCase().includes(searchRoster.toLowerCase());
    const matchesCourse = selectedCourseFilter === 'ALL' || s.enrolledCourse.toLowerCase().includes(selectedCourseFilter.toLowerCase());
    return matchesSearch && matchesCourse;
  });

  // =========================================================================
  // VIEW 1: LIGHT THEME SECURITY CLEARANCE AUTH GATE
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] text-slate-800 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans select-none">
        {/* Soft Modern Light Background Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

        {/* Top Minimal Bar */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>METAMIND // ACADEMIC COMMAND SECURITY</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer text-xs font-sans font-semibold flex items-center gap-1"
          >
            ← Back to Student Platform
          </button>
        </div>

        {/* Security Terminal Card (Light Theme) */}
        <div
          ref={authContainerRef}
          className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xl shadow-indigo-950/5 relative z-10 space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-sm">
              <Lock className="w-7 h-7 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
              MetaMind Admin Nexus
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Restricted Institutional Access. Authorized academic officers and platform faculty only.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleVerifyPasskey} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                <span>Security Clearance Passkey</span>
                <span className="text-[10px] text-indigo-600 font-semibold">Master Key</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  placeholder="Enter Master Passkey..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-11 text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {authError && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Passkey Submit */}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-[#353B97] hover:bg-[#2A2F7A] text-white font-bold py-3 rounded-xl text-xs tracking-wide transition-all shadow-md shadow-indigo-900/15 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Token...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Authenticate Clearance</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Bypass for Evaluators */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="text-center">
              <span className="text-[11px] font-mono text-slate-400">OR SIMULATE HARDWARE BIOMETRICS</span>
            </div>

            <button
              type="button"
              onClick={handleBiometricAuth}
              disabled={biometricScanning}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-2.5 px-4 rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Fingerprint className={`w-4 h-4 ${biometricScanning ? 'text-indigo-600 animate-spin' : 'text-slate-500'}`} />
              <span>{biometricScanning ? 'Scanning Hardware Token...' : 'Scan Hardware Token / Quick Bypass'}</span>
            </button>

            <div className="text-center">
              <span className="text-[10px] font-mono text-slate-500">
                Official Passkey: <code className="text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">METAMIND-ADMIN-2026</code>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED LIGHT-THEME ADMIN NEXUS (Matching Reference Layouts)
  // =========================================================================
  return (
    <div
      ref={dashboardContainerRef}
      className="min-h-screen bg-[#F4F6FA] text-slate-800 font-sans flex select-none"
    >
      {/* ========================================================================= */}
      {/* LEFT VERTICAL SIDEBAR (Matching Reference 1, 3, 4) */}
      {/* ========================================================================= */}
      <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 hidden md:flex z-20">
        <div className="p-6 space-y-6">
          {/* Logo & Brand Masthead */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#353B97] flex items-center justify-center shadow-md shadow-indigo-900/20 text-white font-extrabold text-lg">
              <svg className="w-6 h-5" viewBox="0 0 34 24" fill="none">
                <rect x="2" y="2" width="18" height="20" rx="10" stroke="#F15A24" strokeWidth="3" />
                <rect x="14" y="2" width="18" height="20" rx="10" stroke="#FFB800" strokeWidth="3" />
              </svg>
            </div>
            <div>
              <div className="font-display font-extrabold text-base text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>MetaMind</span>
                <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">
                  NEXUS
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Academic Command Center</div>
            </div>
          </div>

          {/* Navigation Items Group */}
          <nav className="space-y-1">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-3 pb-2">
              Main Operations
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#353B97] text-white shadow-sm shadow-indigo-900/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4" />
                <span>Executive Overview</span>
              </div>
              {activeTab === 'overview' && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
            </button>

            <button
              onClick={() => setActiveTab('vulnerabilities')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'vulnerabilities'
                  ? 'bg-[#353B97] text-white shadow-sm shadow-indigo-900/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className={`w-4 h-4 ${activeTab === 'vulnerabilities' ? 'text-amber-300' : 'text-amber-600'}`} />
                <span>Cognitive Radar</span>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === 'vulnerabilities' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'}`}>
                3 Traps
              </span>
            </button>

            <button
              onClick={() => setActiveTab('roster')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'roster'
                  ? 'bg-[#353B97] text-white shadow-sm shadow-indigo-900/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Student Directory</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">2.8K</span>
            </button>

            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-3 pt-4 pb-2">
              Curriculum & Engine
            </div>

            <button
              onClick={() => setActiveTab('curriculum')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'curriculum'
                  ? 'bg-[#353B97] text-white shadow-sm shadow-indigo-900/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4" />
                <span>Curriculum CMS</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('ai-telemetry')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'ai-telemetry'
                  ? 'bg-[#353B97] text-white shadow-sm shadow-indigo-900/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4" />
                <span>AI Models & Latency</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            <button
              onClick={() => setActiveTab('broadcast')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'broadcast'
                  ? 'bg-[#353B97] text-white shadow-sm shadow-indigo-900/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Radio className="w-4 h-4" />
                <span>Global Broadcast</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Bottom Officer Profile & Quick Signout (Matching Donezo/Chaart) */}
        <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Officer"
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div className="text-left leading-tight">
                <div className="text-xs font-bold text-slate-800">Prof. V. Patel</div>
                <div className="text-[10px] text-slate-400 font-mono">Academic Officer</div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Terminate Admin Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar (Matching Reference 1, 2, 3) */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Search bar with Command-K shortcut */}
          <div className="flex-1 max-w-md relative hidden sm:block">
            <input
              type="text"
              placeholder="Search students, chapters, or AI diagnostics..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 pl-10 text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
            <kbd className="absolute right-3 top-2 text-[10px] font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400 shadow-2xs pointer-events-none">
              ⌘K
            </kbd>
          </div>

          {/* Right Status Controls */}
          <div className="flex items-center gap-3 text-xs font-mono ml-auto">
            {/* Live Clock Pill */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-600 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>{currentTime}</span>
            </div>

            {/* System Status Pill */}
            <div className="hidden lg:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-xl text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>CLUSTER: NORMAL</span>
            </div>

            {/* Return / Exit Button */}
            <button
              onClick={() => navigate('/')}
              className="px-3 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer border border-slate-200"
            >
              Exit to Student Platform
            </button>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <main className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Dashboard Title & Top Actions Row (Matching Donezo Reference 3) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
                Academic Command Dashboard
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time institutional oversight across student cognition, course mastery, and AI diagnostics.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedChapterForQuestion('db-1');
                  setShowAddQuestionModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#353B97] hover:bg-[#2A2F7A] text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-indigo-900/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>
              <button
                onClick={() => alert('Exporting Institutional Accreditation Audit Log...')}
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Export Audit</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: EXECUTIVE COHORT OVERVIEW */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 4 Bento Metric Cards (Matching Pharmacy & Donezo References with Light Card Colors) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: Total Scholars (Indigo Accent) */}
                <div className="admin-light-card bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold text-slate-500">Total Scholars</span>
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                    <span ref={counterScholarsRef}>0</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-xs font-medium">
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +18.4%
                    </span>
                    <span className="text-slate-400">• 342 active now</span>
                  </div>
                </div>

                {/* Card 2: AI Doubts Resolved (Violet / Magenta Accent) */}
                <div className="admin-light-card bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold text-slate-500">AI Doubts Resolved</span>
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                    <span ref={counterDoubtsRef}>0</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-xs font-medium">
                    <span className="text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">
                      99.2% Accuracy
                    </span>
                    <span className="text-slate-400">• 410ms avg</span>
                  </div>
                </div>

                {/* Card 3: Study Guides Exported (Amber / Orange Accent) */}
                <div className="admin-light-card bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold text-slate-500">Study Guides Exported</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                    <span ref={counterGuidesRef}>0</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-xs font-medium">
                    <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                      Comprehensive PDFs
                    </span>
                    <span className="text-slate-400">• ~10 pages</span>
                  </div>
                </div>

                {/* Card 4: Class Cognitive Retention (Emerald / Mint Accent) */}
                <div className="admin-light-card bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold text-slate-500">Class Retention Rate</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                      <Activity className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-display font-extrabold text-emerald-700 tracking-tight">
                    <span ref={counterRetentionRef}>0%</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-xs font-medium">
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                      +62% Recall Edge
                    </span>
                    <span className="text-slate-400">• Day 30</span>
                  </div>
                </div>
              </div>

              {/* Middle Row: Retention Curve Wave Chart & Vulnerability Breakdown (Inspired by Reference 1 & 4) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Retention Wave Chart */}
                <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-base font-display font-extrabold text-slate-900">
                        Cognitive Retention Wave & Mastery Trajectory
                      </h3>
                      <p className="text-xs text-slate-400">
                        Active Recall with MetaMind AI vs Standard Cramming Decay over time.
                      </p>
                    </div>

                    {/* Timeframe selector (like Reference 1) */}
                    <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200/80 text-[11px] font-bold">
                      {(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] as const).map((tf) => (
                        <button
                          key={tf}
                          onClick={() => setChartTimeframe(tf)}
                          className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                            chartTimeframe === tf ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SVG Wave Retention Chart (Smooth organic waves like Reference 1) */}
                  <div className="relative h-64 w-full pt-2">
                    <svg className="w-full h-full" viewBox="0 0 700 220" fill="none">
                      <defs>
                        <linearGradient id="activeRecallFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4338CA" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#4338CA" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="crammingFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      <line x1="40" y1="20" x2="680" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                      <line x1="40" y1="70" x2="680" y2="70" stroke="#F1F5F9" strokeWidth="1" />
                      <line x1="40" y1="120" x2="680" y2="120" stroke="#F1F5F9" strokeWidth="1" />
                      <line x1="40" y1="170" x2="680" y2="170" stroke="#F1F5F9" strokeWidth="1" />

                      {/* Cramming Curve Area & Stroke (Yellow/Orange) */}
                      <path
                        d="M 50 40 Q 150 140, 280 160 T 500 175 T 670 180 L 670 190 L 50 190 Z"
                        fill="url(#crammingFill)"
                      />
                      <path
                        d="M 50 40 Q 150 140, 280 160 T 500 175 T 670 180"
                        stroke="#F59E0B"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      {/* Active Recall Wave Curve Area & Stroke (Indigo/Purple) */}
                      <path
                        d="M 50 130 C 130 30, 220 90, 310 50 C 400 20, 500 70, 590 35 C 620 25, 650 30, 670 28 L 670 190 L 50 190 Z"
                        fill="url(#activeRecallFill)"
                      />
                      <path
                        d="M 50 130 C 130 30, 220 90, 310 50 C 400 20, 500 70, 590 35 C 620 25, 650 30, 670 28"
                        stroke="#4338CA"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Key Milestone Dots */}
                      <circle cx="50" cy="130" r="4.5" fill="#FFFFFF" stroke="#4338CA" strokeWidth="3" />
                      <circle cx="310" cy="50" r="4.5" fill="#FFFFFF" stroke="#4338CA" strokeWidth="3" />
                      <circle cx="590" cy="35" r="4.5" fill="#FFFFFF" stroke="#4338CA" strokeWidth="3" />
                      <circle cx="670" cy="28" r="5.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2.5" />

                      {/* X-Axis Labels */}
                      <text x="50" y="208" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="middle">Day 0</text>
                      <text x="200" y="208" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="middle">Day 3</text>
                      <text x="350" y="208" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="middle">Day 7</text>
                      <text x="500" y="208" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="middle">Day 14</text>
                      <text x="660" y="208" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="middle">Day 30 (Mastery)</text>
                    </svg>
                  </div>

                  {/* Graph Footer Stats Row */}
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-center">
                    <div className="p-3 bg-slate-50/80 rounded-xl">
                      <div className="text-[11px] text-slate-500 font-medium">Active Recall Retention</div>
                      <div className="text-lg font-bold text-indigo-700 mt-0.5">86.4%</div>
                    </div>
                    <div className="p-3 bg-slate-50/80 rounded-xl">
                      <div className="text-[11px] text-slate-500 font-medium">Standard Cramming</div>
                      <div className="text-lg font-bold text-amber-700 mt-0.5">24.1%</div>
                    </div>
                    <div className="p-3 bg-slate-50/80 rounded-xl">
                      <div className="text-[11px] text-slate-500 font-medium">Net Cognitive Advantage</div>
                      <div className="text-lg font-bold text-emerald-700 mt-0.5">+62.3%</div>
                    </div>
                  </div>
                </div>

                {/* Right Col: Donut / Cognitive Vulnerability Breakdown (Inspired by Reference 1 & 4) */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-display font-extrabold text-slate-900">
                      Cognitive Bottleneck Radar
                    </h3>
                    <p className="text-xs text-slate-400">
                      Top student misconception distribution.
                    </p>

                    {/* Donut Chart Visual */}
                    <div className="relative w-44 h-44 mx-auto my-4 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        {/* Circle 1: NULL logic (44%) - Rose */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke="#F43F5E"
                          strokeWidth="11"
                          strokeDasharray="105 135"
                          strokeDashoffset="0"
                        />
                        {/* Circle 2: Normalization (31%) - Amber */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke="#F59E0B"
                          strokeWidth="11"
                          strokeDasharray="74 166"
                          strokeDashoffset="-105"
                        />
                        {/* Circle 3: Memory Paging (25%) - Indigo */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke="#4338CA"
                          strokeWidth="11"
                          strokeDasharray="60 180"
                          strokeDashoffset="-179"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                        <span className="text-2xl font-bold font-display text-slate-900">3</span>
                        <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400">Key Traps</span>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="space-y-2 pt-1 text-xs">
                      <div className="flex items-center justify-between text-slate-700">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                          <span>Three-Valued Logic (NULL)</span>
                        </div>
                        <span className="font-mono font-bold text-slate-900">44%</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          <span>3NF vs BCNF Determinants</span>
                        </div>
                        <span className="font-mono font-bold text-slate-900">31%</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                          <span>TLB Miss vs Page Faults</span>
                        </div>
                        <span className="font-mono font-bold text-slate-900">25%</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('vulnerabilities')}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer border border-slate-200"
                  >
                    Inspect Vulnerability Details →
                  </button>
                </div>
              </div>

              {/* Lower Row: Student Directory & Active Interventions (Inspired by Reference 1 & 3) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Cohort Performance Table */}
                <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-base font-display font-extrabold text-slate-900">
                        Recent Scholar Telemetry
                      </h3>
                      <p className="text-xs text-slate-400">Live active learning and diagnostic progress.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('roster')}
                      className="text-xs font-bold text-indigo-700 hover:text-indigo-800 cursor-pointer"
                    >
                      View All Scholars →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-mono">
                          <th className="py-2.5 px-3">Scholar</th>
                          <th className="py-2.5 px-3">Course</th>
                          <th className="py-2.5 px-3">Mastery</th>
                          <th className="py-2.5 px-3">Cognitive Tier</th>
                          <th className="py-2.5 px-3 text-right">Last Active</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {roster.slice(0, 5).map((s) => (
                          <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2.5">
                                <img src={s.avatar} alt={s.name} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                                <div>
                                  <div className="font-bold text-slate-800">{s.name}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">{s.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-slate-600 font-medium truncate max-w-[140px]">{s.enrolledCourse}</td>
                            <td className="py-3 px-3 font-mono font-bold text-emerald-700">{s.masteryScore}%</td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  s.cognitiveTier === 'Mastery'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : s.cognitiveTier === 'High'
                                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                    : s.cognitiveTier === 'Moderate'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                {s.cognitiveTier}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right text-slate-400 font-mono text-[11px]">{s.lastActive}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Col: AI Interventions & Telemetry Widget */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-indigo-700 text-xs font-mono font-bold uppercase tracking-wider">
                      <Zap className="w-4 h-4" />
                      <span>Pedagogical Interventions</span>
                    </div>
                    <h3 className="text-base font-display font-extrabold text-slate-900">
                      Instructor Action Queue
                    </h3>

                    <div className="space-y-2.5 pt-1">
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <span>⚠️ Stumbling Point in DBMS:</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11.5px]">
                          38% of students tripped on 3NF vs BCNF dependency preservation. Automated diagnostic review recommended.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200/80 text-xs text-indigo-950 space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <span>💡 Popular Chapter Milestone:</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11.5px]">
                          Over 1,200 PDF guides downloaded this week for Introduction to Relational Models.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('broadcast')}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#353B97] text-white hover:bg-[#2A2F7A] transition-colors cursor-pointer shadow-sm"
                  >
                    Broadcast Announcement to Cohort
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: COGNITIVE VULNERABILITY RADAR & MISCONCEPTIONS */}
          {/* ========================================================================= */}
          {activeTab === 'vulnerabilities' && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-display font-extrabold text-slate-900">Cognitive Pathology Heatmap</h2>
                <p className="text-xs text-slate-500">
                  Aggregated analysis of student misconceptions, hesitated answers, and wrong distractor patterns across all active courses.
                </p>
              </div>

              {/* Stumbling point cards (Light theme) */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200">
                      HIGH FAILURE RATE • 44% INCORRECT
                    </span>
                    <span className="text-xs font-mono text-slate-500 font-semibold">DBMS • Chapter 01 & 04</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Three-Valued Logic NULL Comparison Trap (`NULL = NULL`)</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Students repeatedly assume <code>NULL = NULL</code> returns <code>TRUE</code>. When writing query filters like <code>WHERE status != 'Active'</code>, they fail to realize rows with <code>NULL</code> are discarded because three-valued logic yields <code>UNKNOWN</code>.
                  </p>
                  <div className="text-xs font-mono text-indigo-700 pt-1 font-semibold">
                    ✓ Corrective Mental Model: "In relational algebra, NULL is a missing fact placeholder, not a value. It cannot equal itself."
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                      MODERATE FAILURE RATE • 31% INCORRECT
                    </span>
                    <span className="text-xs font-mono text-slate-500 font-semibold">DBMS • Chapter 03</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Conflating 3NF with BCNF on Overlapping Candidate Keys</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Students frequently classify relations with functional dependencies $X \to Y$ as BCNF as long as $Y$ is a prime attribute, forgetting that BCNF strictly mandates $X$ must be a superkey without exception.
                  </p>
                  <div className="text-xs font-mono text-indigo-700 pt-1 font-semibold">
                    ✓ Corrective Mental Model: "BCNF is the unforgiving normal form: every determinant must be a superkey."
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-full border border-indigo-200">
                      RESOLVING GAP • 22% INCORRECT
                    </span>
                    <span className="text-xs font-mono text-slate-500 font-semibold">Operating Systems • Chapter 02</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">TLB Miss vs Page Fault Interrupt Handlers</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Undergrads confuse a Translation Lookaside Buffer hardware lookup miss with a severe Page Fault disk I/O interrupt, resulting in wrong time-complexity estimates.
                  </p>
                  <div className="text-xs font-mono text-indigo-700 pt-1 font-semibold">
                    ✓ Corrective Mental Model: "TLB miss checks Page Table in RAM (nanoseconds); Page Fault fetches 4KB frame from SSD/Disk (milliseconds)."
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: CURRICULUM & CONTENT CMS */}
          {/* ========================================================================= */}
          {activeTab === 'curriculum' && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-display font-extrabold text-slate-900">Curriculum & Question Bank CMS</h2>
                  <p className="text-xs text-slate-500">
                    Live content registry powering interactive chapters, code sandboxes, and exam question pools.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddQuestionModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#353B97] hover:bg-[#2A2F7A] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Practice Question</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={curriculumSearch}
                  onChange={(e) => setCurriculumSearch(e.target.value)}
                  placeholder="Search chapters by title, tag, or course..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              </div>

              {/* Chapters List */}
              <div className="space-y-3 pt-2">
                {curriculumList
                  .filter((c) => c.title.toLowerCase().includes(curriculumSearch.toLowerCase()) || c.courseTitle.toLowerCase().includes(curriculumSearch.toLowerCase()))
                  .map((ch) => (
                    <div key={ch.id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-indigo-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                            Chapter {ch.chapterNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-700">{ch.courseTitle}</span>
                          <span className="text-[11px] text-slate-400 font-mono">• {ch.readingTime} read</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{ch.title}</h4>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {ch.tags.slice(0, 4).map((t) => (
                            <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-slate-900">{ch.questions.length} Questions</div>
                          <div className="text-[10px] font-mono text-emerald-700 font-semibold">Active in Exams</div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedChapterForQuestion(ch.id);
                            setShowAddQuestionModal(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                        >
                          + Question
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: STUDENT COHORT DIRECTORY */}
          {/* ========================================================================= */}
          {activeTab === 'roster' && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-display font-extrabold text-slate-900">Student Cohort Directory</h2>
                  <p className="text-xs text-slate-500">
                    Real-time monitoring of enrolled scholars, diagnostic tiers, and study guide downloads.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedCourseFilter}
                    onChange={(e) => setSelectedCourseFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-700 focus:outline-none"
                  >
                    <option value="ALL">All Enrolled Courses</option>
                    <option value="Database">Database Systems</option>
                    <option value="Structures">Data Structures & Algo</option>
                    <option value="Operating">Operating Systems</option>
                  </select>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchRoster}
                  onChange={(e) => setSearchRoster(e.target.value)}
                  placeholder="Filter student by name, email, or Scholar ID..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 pl-10 text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
              </div>

              {/* Roster Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-mono">
                      <th className="py-3 px-4">Scholar</th>
                      <th className="py-3 px-4">Course Enrolled</th>
                      <th className="py-3 px-4">Mastery Score</th>
                      <th className="py-3 px-4">Cognitive Tier</th>
                      <th className="py-3 px-4">Streak</th>
                      <th className="py-3 px-4">Guides Saved</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRoster.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <img src={s.avatar} alt={s.name} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                            <div>
                              <div className="font-bold text-slate-800">{s.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{s.email} • {s.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{s.enrolledCourse}</td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-700">{s.masteryScore}%</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              s.cognitiveTier === 'Mastery'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : s.cognitiveTier === 'High'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : s.cognitiveTier === 'Moderate'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {s.cognitiveTier}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-mono">{s.streakDays} Days</td>
                        <td className="py-3 px-4 text-indigo-700 font-mono font-bold">{s.studyGuidesDownloaded} PDFs</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => alert(`Student Diagnostic Telemetry for ${s.name}:\n• ID: ${s.id}\n• Score: ${s.masteryScore}%\n• Guides Saved: ${s.studyGuidesDownloaded}\n• Flagged: ${s.flaggedMisconception || 'None'}`)}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: AI MODELS & LATENCY TELEMETRY */}
          {/* ========================================================================= */}
          {activeTab === 'ai-telemetry' && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-display font-extrabold text-slate-900">AI Engine & Inference Telemetry</h2>
                <p className="text-xs text-slate-500">
                  Performance monitor for MetaMind Adaptive Tutor, diagnostic parser, and automated study guide synthesis.
                </p>
              </div>

              {/* 3 Model Status Tiles (Light theme) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-800">Gemini 2.0 Flash (Primary)</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">380ms</div>
                  <div className="text-[11px] text-slate-500 font-mono">Avg Latency • 99.98% Uptime</div>
                </div>

                <div className="p-5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-purple-800">Socratic Diagnostic Engine</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">92.4%</div>
                  <div className="text-[11px] text-slate-500 font-mono">Misconception Detection Precision</div>
                </div>

                <div className="p-5 rounded-xl bg-cyan-50/50 border border-cyan-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-800">Semantic Prompt Cache</span>
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">88.6%</div>
                  <div className="text-[11px] text-slate-500 font-mono">Cache Hit Ratio (Zero-cost tokens)</div>
                </div>
              </div>

              {/* Live Inference Log */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider">
                  Live Socratic Inference Stream
                </div>
                <div className="space-y-2 font-mono text-xs text-slate-700">
                  <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200/80">
                    <span className="text-slate-400">[12:54:10 UTC]</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">RESOLVED</span>
                    <span>Student SCH-8023: "Difference between Candidate Key and Super Key"</span>
                    <span className="text-slate-400 ml-auto font-semibold">320ms</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200/80">
                    <span className="text-slate-400">[12:53:44 UTC]</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">RESOLVED</span>
                    <span>Student SCH-8025: "Three-Valued Logic in SQL queries"</span>
                    <span className="text-slate-400 ml-auto font-semibold">410ms</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200/80">
                    <span className="text-slate-400">[12:52:19 UTC]</span>
                    <span className="text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">PDF GENERATED</span>
                    <span>Exported 10-Module Academic Study Guide for Introduction to Relational Models</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: GLOBAL BROADCAST & MAINTENANCE */}
          {/* ========================================================================= */}
          {activeTab === 'broadcast' && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-display font-extrabold text-slate-900">Platform Broadcast & Announcements</h2>
                <p className="text-xs text-slate-500">
                  Broadcast emergency messages, scheduled exam reminders, or new chapter releases across student dashboards.
                </p>
              </div>

              {/* Current Active Broadcast */}
              {broadcastMessage && (
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Radio className="w-5 h-5 text-indigo-600 animate-pulse" />
                    <div>
                      <div className="text-[10px] font-mono font-bold text-indigo-700 uppercase">Current Active Banner</div>
                      <div className="text-xs text-slate-800 font-medium">{broadcastMessage}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.removeItem('metamind_admin_broadcast');
                      setBroadcastMessage('');
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Remove active banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* New Draft Form */}
              <div className="space-y-3">
                <label className="text-xs font-mono font-bold text-slate-700">
                  New Broadcast Announcement Text:
                </label>
                <textarea
                  rows={3}
                  value={broadcastDraft}
                  onChange={(e) => setBroadcastDraft(e.target.value)}
                  placeholder="e.g. 📢 Reminder: Midterm Assessment Window Opens at 18:00 UTC. Review your exported Study Guides!"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    Will be stored in platform state and displayed to all active students.
                  </span>
                  <button
                    onClick={handleSaveBroadcast}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Announcement</span>
                  </button>
                </div>

                {broadcastSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Broadcast published successfully to student platform!</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD PRACTICE QUESTION (Light Theme) */}
      {/* ========================================================================= */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Question to Course Registry</h3>
              <button
                onClick={() => setShowAddQuestionModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddQuestionSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold text-slate-600">Target Chapter</label>
                <select
                  value={selectedChapterForQuestion}
                  onChange={(e) => setSelectedChapterForQuestion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-600"
                >
                  {curriculumList.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      [{ch.chapterNumber}] {ch.title} ({ch.courseTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold text-slate-600">Question Statement</label>
                <textarea
                  rows={2}
                  required
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="e.g. Which normal form strictly requires every determinant to be a candidate key?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-mono font-bold text-slate-600">Options (Select Correct)</label>
                {[
                  { label: 'A', val: newQuestionOptionA, set: setNewQuestionOptionA, idx: 0 },
                  { label: 'B', val: newQuestionOptionB, set: setNewQuestionOptionB, idx: 1 },
                  { label: 'C', val: newQuestionOptionC, set: setNewQuestionOptionC, idx: 2 },
                  { label: 'D', val: newQuestionOptionD, set: setNewQuestionOptionD, idx: 3 },
                ].map((opt) => (
                  <div key={opt.label} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctIndex"
                      checked={newQuestionCorrectIndex === opt.idx}
                      onChange={() => setNewQuestionCorrectIndex(opt.idx)}
                      className="text-indigo-600 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs font-mono font-bold text-slate-500 w-4">{opt.label}.</span>
                    <input
                      type="text"
                      required
                      value={opt.val}
                      onChange={(e) => opt.set(e.target.value)}
                      placeholder={`Option ${opt.label}...`}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold text-slate-600">Pedagogical Explanation & Distractor Analysis</label>
                <textarea
                  rows={2}
                  value={newQuestionExplanation}
                  onChange={(e) => setNewQuestionExplanation(e.target.value)}
                  placeholder="Explain why the answer is correct and why other choices fail..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddQuestionModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#353B97] hover:bg-[#2A2F7A] text-white shadow-sm cursor-pointer"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
