import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useLearning } from '@/features/learning';
import { useAuth } from '@/features/auth';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import {
  Search,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  X,
  Target,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CourseChapter {
  id: string;
  number: string;
  title: string;
  studyTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  mastered?: boolean;
}

export interface PredefinedCourse {
  id: string;
  title: string;
  category: string;
  chaptersCount: number;
  studyTimeHours: number;
  masteryScore: number;
  costLabel: string;
  cardBg: string;
  accentColor: string;
  borderColor: string;
  textColor: string;
  numberColor: string;
  illustrationType: 'microscope' | 'globe' | 'ruler' | 'laptop' | 'artTools' | 'notepad';
  chapters: CourseChapter[];
}

const PREDEFINED_COURSES: PredefinedCourse[] = [
  {
    id: 'dbms',
    title: 'Science & Database Systems',
    category: 'Computer Science',
    chaptersCount: 24,
    studyTimeHours: 62,
    masteryScore: 88,
    costLabel: 'Free',
    cardBg: '#E1F5EE',
    accentColor: '#0F766E',
    borderColor: '#99F6E4',
    textColor: '#115E59',
    numberColor: '#14B8A6',
    illustrationType: 'microscope',
    chapters: [
      { id: 'db-1', number: '01', title: 'Introduction to Relational Models & Schemas', studyTime: '34 min', difficulty: 'Beginner', mastered: true },
      { id: 'db-2', number: '02', title: 'Entity Relationship (ER) Diagrams & Keys', studyTime: '42 min', difficulty: 'Beginner', mastered: true },
      { id: 'db-3', number: '03', title: 'SQL Queries, Predicates & Aggregations', studyTime: '48 min', difficulty: 'Intermediate', mastered: false },
      { id: 'db-4', number: '04', title: 'SQL Joins (INNER, LEFT, RIGHT, FULL OUTER)', studyTime: '55 min', difficulty: 'Intermediate', mastered: false },
      { id: 'db-5', number: '05', title: 'Handling Missing Rows & NULL Discrepancies', studyTime: '35 min', difficulty: 'Intermediate', mastered: false },
      { id: 'db-6', number: '06', title: 'Database Normalization (1NF, 2NF, 3NF, BCNF)', studyTime: '50 min', difficulty: 'Advanced', mastered: false },
      { id: 'db-7', number: '07', title: 'B+ Tree Indexing & Query Execution Plans', studyTime: '40 min', difficulty: 'Advanced', mastered: false },
      { id: 'db-8', number: '08', title: 'ACID Transactions & Concurrency Locks', studyTime: '38 min', difficulty: 'Advanced', mastered: false },
    ],
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    category: 'Computer Science',
    chaptersCount: 28,
    studyTimeHours: 56,
    masteryScore: 78,
    costLabel: 'Free',
    cardBg: '#FEECE2',
    accentColor: '#C2410C',
    borderColor: '#FED7AA',
    textColor: '#9A3412',
    numberColor: '#F97316',
    illustrationType: 'globe',
    chapters: [
      { id: 'dsa-1', number: '01', title: 'Asymptotic Analysis & Big-O Notation', studyTime: '30 min', difficulty: 'Beginner', mastered: true },
      { id: 'dsa-2', number: '02', title: 'Arrays, Two Pointers & Sliding Window', studyTime: '42 min', difficulty: 'Beginner', mastered: true },
      { id: 'dsa-3', number: '03', title: 'Linked Lists & Cycle Detection Methods', studyTime: '45 min', difficulty: 'Intermediate', mastered: false },
      { id: 'dsa-4', number: '04', title: 'Stacks, Queues & Monotonic Sequences', studyTime: '38 min', difficulty: 'Intermediate', mastered: false },
      { id: 'dsa-5', number: '05', title: 'Binary Search Trees & Tree Traversals', studyTime: '52 min', difficulty: 'Intermediate', mastered: false },
      { id: 'dsa-6', number: '06', title: 'Graph BFS, DFS & Topological Sort', studyTime: '60 min', difficulty: 'Advanced', mastered: false },
      { id: 'dsa-7', number: '07', title: 'Dynamic Programming & Memoization Patterns', studyTime: '65 min', difficulty: 'Advanced', mastered: false },
    ],
  },
  {
    id: 'os',
    title: 'Maths & Operating Systems',
    category: 'Systems',
    chaptersCount: 19,
    studyTimeHours: 54,
    masteryScore: 72,
    costLabel: 'Free',
    cardBg: '#FCE7E9',
    accentColor: '#BE123C',
    borderColor: '#FECDD3',
    textColor: '#9F1239',
    numberColor: '#FB7185',
    illustrationType: 'ruler',
    chapters: [
      { id: 'os-1', number: '01', title: 'CPU Architectures, Registers & Bus Logic', studyTime: '35 min', difficulty: 'Beginner', mastered: true },
      { id: 'os-2', number: '02', title: 'Process Lifecycle & Context Switching', studyTime: '40 min', difficulty: 'Beginner', mastered: true },
      { id: 'os-3', number: '03', title: 'Threads, Semaphores & Deadlock Avoidance', studyTime: '55 min', difficulty: 'Intermediate', mastered: false },
      { id: 'os-4', number: '04', title: 'CPU Scheduling (Round Robin, Multilevel)', studyTime: '44 min', difficulty: 'Intermediate', mastered: false },
      { id: 'os-5', number: '05', title: 'Virtual Memory, Paging & Page Replacement', studyTime: '50 min', difficulty: 'Advanced', mastered: false },
      { id: 'os-6', number: '06', title: 'File Systems, Inodes & Storage Controllers', studyTime: '36 min', difficulty: 'Advanced', mastered: false },
    ],
  },
  {
    id: 'ai-ml',
    title: 'Computer & AI Engineering',
    category: 'Artificial Intelligence',
    chaptersCount: 17,
    studyTimeHours: 38,
    masteryScore: 84,
    costLabel: 'Free',
    cardBg: '#E2E7F8',
    accentColor: '#3730A3',
    borderColor: '#C7D2FE',
    textColor: '#312E81',
    numberColor: '#6366F1',
    illustrationType: 'laptop',
    chapters: [
      { id: 'ai-1', number: '01', title: 'Introduction to Computer & AI Principles', studyTime: '34 min', difficulty: 'Beginner', mastered: true },
      { id: 'ai-2', number: '02', title: 'Computer Hardware & Neural Accelerators', studyTime: '34 min', difficulty: 'Beginner', mastered: true },
      { id: 'ai-3', number: '03', title: 'System Software & Machine Learning Runtimes', studyTime: '34 min', difficulty: 'Intermediate', mastered: false },
      { id: 'ai-4', number: '04', title: 'Communications Literacy & Network Protocols', studyTime: '34 min', difficulty: 'Intermediate', mastered: false },
      { id: 'ai-5', number: '05', title: 'Software Development & Model Fine-Tuning', studyTime: '34 min', difficulty: 'Advanced', mastered: false },
      { id: 'ai-6', number: '06', title: 'Networks, Security & Ethical Safeguards', studyTime: '34 min', difficulty: 'Advanced', mastered: false },
      { id: 'ai-7', number: '07', title: 'Utility Software & Diagnostic Evaluation', studyTime: '34 min', difficulty: 'Advanced', mastered: false },
    ],
  },
  {
    id: 'theory',
    title: 'Drawing & Discrete Mathematics',
    category: 'Mathematics',
    chaptersCount: 15,
    studyTimeHours: 29,
    masteryScore: 91,
    costLabel: 'Free',
    cardBg: '#ECEBE8',
    accentColor: '#57534E',
    borderColor: '#E7E5E4',
    textColor: '#44403C',
    numberColor: '#78716C',
    illustrationType: 'artTools',
    chapters: [
      { id: 'th-1', number: '01', title: 'Propositional & First-Order Predicate Logic', studyTime: '32 min', difficulty: 'Beginner', mastered: true },
      { id: 'th-2', number: '02', title: 'Set Theory, Relations & Equivalence Classes', studyTime: '36 min', difficulty: 'Beginner', mastered: true },
      { id: 'th-3', number: '03', title: 'Induction Proofs & Recurrence Relations', studyTime: '45 min', difficulty: 'Intermediate', mastered: false },
      { id: 'th-4', number: '04', title: 'Graph Theory, Planarity & Coloring Proofs', studyTime: '50 min', difficulty: 'Intermediate', mastered: false },
      { id: 'th-5', number: '05', title: 'Combinatorics, Permutations & Pigeonhole', studyTime: '38 min', difficulty: 'Advanced', mastered: false },
      { id: 'th-6', number: '06', title: 'Automata, Regular Grammars & Turing Decidability', studyTime: '55 min', difficulty: 'Advanced', mastered: false },
    ],
  },
  {
    id: 'cloud',
    title: 'English Vocabulary & Cloud Systems',
    category: 'Cloud & Distributed',
    chaptersCount: 25,
    studyTimeHours: 48,
    masteryScore: 76,
    costLabel: 'Free',
    cardBg: '#FFF4D9',
    accentColor: '#B45309',
    borderColor: '#FDE68A',
    textColor: '#92400E',
    numberColor: '#F59E0B',
    illustrationType: 'notepad',
    chapters: [
      { id: 'cl-1', number: '01', title: 'Cloud Paradigms & Academic Terminology', studyTime: '30 min', difficulty: 'Beginner', mastered: true },
      { id: 'cl-2', number: '02', title: 'Virtual Private Clouds (VPC) & Subnetting', studyTime: '40 min', difficulty: 'Beginner', mastered: true },
      { id: 'cl-3', number: '03', title: 'Docker Containers & Microservice Schemas', studyTime: '45 min', difficulty: 'Intermediate', mastered: false },
      { id: 'cl-4', number: '04', title: 'Kubernetes Pods, Services & Load Balancing', studyTime: '52 min', difficulty: 'Intermediate', mastered: false },
      { id: 'cl-5', number: '05', title: 'Distributed CAP Theorem & Event Streaming', studyTime: '48 min', difficulty: 'Advanced', mastered: false },
      { id: 'cl-6', number: '06', title: 'IAM Access Control & Zero-Trust Cloud Security', studyTime: '42 min', difficulty: 'Advanced', mastered: false },
    ],
  },
];

// Aesthetic SVG line-art illustrations matching the user's design image
const RenderCardIllustration: React.FC<{ type: string; color: string }> = ({ type, color }) => {
  switch (type) {
    case 'microscope':
      return (
        <svg viewBox="0 0 120 140" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-20 h-24 sm:w-24 sm:h-28 opacity-90">
          <ellipse cx="60" cy="120" rx="35" ry="12" />
          <path d="M60 108 L60 85" />
          <path d="M45 85 L75 85" />
          <circle cx="60" cy="55" r="14" />
          <rect x="52" y="20" width="16" height="35" rx="3" transform="rotate(-20 60 37)" />
          <path d="M40 25 L35 15" />
          <path d="M78 80 C88 70 90 50 82 35" />
          <circle cx="85" cy="115" r="3" fill={color} />
          <circle cx="35" cy="118" r="2" fill={color} />
        </svg>
      );
    case 'globe':
      return (
        <svg viewBox="0 0 120 140" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-20 h-24 sm:w-24 sm:h-28 opacity-90">
          <ellipse cx="60" cy="125" rx="25" ry="8" />
          <path d="M60 117 L60 100" />
          <circle cx="60" cy="55" r="38" />
          <path d="M22 55 Q60 75 98 55" />
          <path d="M60 17 Q85 55 60 93" />
          <path d="M60 17 Q35 55 60 93" />
          <path d="M60 100 C85 100 102 78 102 55" />
        </svg>
      );
    case 'ruler':
      return (
        <svg viewBox="0 0 120 140" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-20 h-24 sm:w-24 sm:h-28 opacity-90">
          <path d="M20 115 L100 115 L100 35 Z" />
          <path d="M38 105 L82 105 L82 60 Z" strokeWidth="2.5" />
          <line x1="28" y1="115" x2="28" y2="108" />
          <line x1="36" y1="115" x2="36" y2="105" />
          <line x1="44" y1="115" x2="44" y2="108" />
          <line x1="52" y1="115" x2="52" y2="105" />
          <line x1="60" y1="115" x2="60" y2="108" />
          <line x1="68" y1="115" x2="68" y2="105" />
          <line x1="76" y1="115" x2="76" y2="108" />
          <line x1="84" y1="115" x2="84" y2="105" />
          <line x1="92" y1="115" x2="92" y2="108" />
          <line x1="100" y1="48" x2="92" y2="48" />
          <line x1="100" y1="58" x2="90" y2="58" />
          <line x1="100" y1="68" x2="92" y2="68" />
          <line x1="100" y1="78" x2="90" y2="78" />
          <line x1="100" y1="88" x2="92" y2="88" />
        </svg>
      );
    case 'laptop':
      return (
        <svg viewBox="0 0 120 140" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-20 h-24 sm:w-24 sm:h-28 opacity-90">
          <rect x="25" y="35" width="70" height="52" rx="6" />
          <rect x="33" y="43" width="54" height="36" rx="2" strokeWidth="2" />
          <path d="M12 95 L108 95 C108 98 102 102 96 102 L24 102 C18 102 12 98 12 95 Z" />
          <line x1="52" y1="98" x2="68" y2="98" strokeWidth="2" />
          <path d="M42 55 L48 61 L42 67" strokeWidth="2" />
          <line x1="54" y1="67" x2="64" y2="67" strokeWidth="2" />
        </svg>
      );
    case 'artTools':
      return (
        <svg viewBox="0 0 120 140" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-20 h-24 sm:w-24 sm:h-28 opacity-90">
          <path d="M45 70 L40 120 L80 120 L75 70 Z" />
          <path d="M42 70 L78 70" strokeWidth="4" />
          {/* Brushes sticking out */}
          <path d="M48 68 L42 35 Q40 20 48 15 Q54 20 52 35 L50 68" />
          <path d="M58 68 L60 25 L65 20 L68 28 L64 68" />
          <path d="M70 68 L78 30 Q84 25 80 40 L72 68" />
        </svg>
      );
    case 'notepad':
    default:
      return (
        <svg viewBox="0 0 120 140" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-20 h-24 sm:w-24 sm:h-28 opacity-90">
          <rect x="35" y="25" width="60" height="85" rx="6" />
          <line x1="35" y1="35" x2="28" y2="35" strokeWidth="4" strokeLinecap="round" />
          <line x1="35" y1="48" x2="28" y2="48" strokeWidth="4" strokeLinecap="round" />
          <line x1="35" y1="61" x2="28" y2="61" strokeWidth="4" strokeLinecap="round" />
          <line x1="35" y1="74" x2="28" y2="74" strokeWidth="4" strokeLinecap="round" />
          <line x1="35" y1="87" x2="28" y2="87" strokeWidth="4" strokeLinecap="round" />
          <line x1="35" y1="100" x2="28" y2="100" strokeWidth="4" strokeLinecap="round" />
          <text x="48" y="48" fill={color} fontSize="13" fontWeight="bold" fontFamily="sans-serif" stroke="none">Notes</text>
          <text x="48" y="68" fill={color} fontSize="11" fontWeight="600" fontFamily="sans-serif" stroke="none">Aa Bb</text>
          <text x="48" y="86" fill={color} fontSize="11" fontWeight="600" fontFamily="sans-serif" stroke="none">Cc Dd</text>
        </svg>
      );
  }
};

export const LearningMapPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { startLearningJourney } = useLearning();
  const navigate = useNavigate();

  const studentFullName =
    profile?.full_name?.trim() ||
    user?.user_metadata?.full_name?.trim() ||
    'Lisha Lokwani';

  const firstName = studentFullName.split(' ')[0] || 'Learner';

  // Selected course state (Defaults to Course 1: Science & Database Systems)
  const [selectedCourseId, setSelectedCourseId] = useState<string>('dbms');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isStartingCheck, setIsStartingCheck] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  const activeCourse = PREDEFINED_COURSES.find((c) => c.id === selectedCourseId) || PREDEFINED_COURSES[0];

  // Filtering courses based on search & category
  const filteredCourses = PREDEFINED_COURSES.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.chapters.some((ch) => ch.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Computer Science', 'Systems', 'Artificial Intelligence', 'Mathematics', 'Cloud & Distributed'];

  const handleLaunchAssessment = async (courseTitle: string, chapterTitle: string) => {
    try {
      setIsStartingCheck(true);
      const combinedTopic = `${chapterTitle} (${courseTitle})`;
      await startLearningJourney(combinedTopic);
      navigate('/app/assessment');
    } catch (e) {
      console.error('Launch assessment error:', e);
      navigate('/app/assessment');
    } finally {
      setIsStartingCheck(false);
    }
  };

  const handleLaunchPractice = (courseTitle: string, chapterTitle: string) => {
    navigate(`/app/practice?topic=${encodeURIComponent(chapterTitle)}&course=${encodeURIComponent(courseTitle)}`);
  };

  // GSAP SVG Path Draw / Synapse Circuit Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const path = document.querySelector<SVGPathElement>('#synapse-circuit-line');
      if (path) {
        const length = path.getTotalLength ? path.getTotalLength() : 800;
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        const tl = gsap.timeline();
        tl.to(path, {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: 'power2.inOut',
        })
        .fromTo(
          '.synapse-node',
          { opacity: 0, y: 16, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.5, ease: 'back.out(1.4)' },
          '-=1.2'
        );

        // Continuous synaptic electrical pulse
        const pulse1 = document.querySelector('.synapse-pulse-1');
        const pulse2 = document.querySelector('.synapse-pulse-2');
        if (pulse1 && pulse2) {
          gsap.fromTo(
            pulse1,
            { cx: 80, cy: 30, opacity: 0 },
            {
              cx: 720,
              cy: 30,
              opacity: 1,
              duration: 2.6,
              repeat: -1,
              ease: 'power1.inOut',
              repeatDelay: 0.5,
            }
          );
          gsap.fromTo(
            pulse2,
            { cx: 80, cy: 30, opacity: 0 },
            {
              cx: 720,
              cy: 30,
              opacity: 1,
              duration: 2.6,
              repeat: -1,
              ease: 'power1.inOut',
              delay: 1.3,
              repeatDelay: 0.5,
            }
          );
        }
      }

      // Stagger Course Cards
      gsap.fromTo(
        '.learning-course-card',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, stagger: 0.07, duration: 0.5, ease: 'power2.out', delay: 0.15 }
      );
    });

    return () => ctx.revert();
  }, [activeCategory]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 font-sans selection:bg-teal-100">
      {/* Top Header & Search */}
      <div id="tour-learning-map-hero" className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold tracking-wide uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              MetaMind Guided Student Journey
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Hey <span className="text-shimmer-gradient">{firstName}</span>,
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-sans mt-1">
            Your structured path from beginner concepts to certified subject mastery
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search subjects, chapters, or exam topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-9 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 shadow-xs text-slate-800 placeholder:text-slate-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* GAMIFIED STUDENT MASTERY JOURNEY ROADMAP */}
      <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/3 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left stats */}
          <div className="space-y-2 max-w-sm">
            <div className="flex items-center gap-2">
              <img
                src="/assets/brand/metamind_icon.png"
                alt="MetaMind"
                className="w-6 h-6 object-contain"
              />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
                4-Stage Adaptive Cycle
              </span>
            </div>
            <h3 className="text-xl font-display font-bold text-white">
              Learn Actively, Retain Forever
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Never get stuck on boring lectures. MetaMind tests what you know first, breaks down prerequisites, and rewards your consistency.
            </p>
          </div>

          {/* 4 Interactive Journey Nodes with SVG Synapse Circuit */}
          <div className="relative flex-1">
            {/* SVG Synapse Circuit Wire running across the nodes */}
            <svg
              className="absolute top-1/2 left-0 w-full -translate-y-1/2 h-20 pointer-events-none z-0 hidden sm:block overflow-visible"
              viewBox="0 0 800 60"
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                <linearGradient id="synapseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
                  <stop offset="35%" stopColor="#818CF8" stopOpacity="0.9" />
                  <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#C084FC" stopOpacity="0.95" />
                </linearGradient>
                <filter id="synapseGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background static circuit track */}
              <path
                d="M 80 30 Q 200 12 300 30 T 500 30 T 720 30"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="4 4"
              />

              {/* Animated drawing synapse neural pathway */}
              <path
                id="synapse-circuit-line"
                className="synapse-path"
                d="M 80 30 Q 200 12 300 30 T 500 30 T 720 30"
                stroke="url(#synapseGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                filter="url(#synapseGlow)"
              />

              {/* Synapse Pulse Particles */}
              <circle className="synapse-pulse-1" r="5" fill="#38BDF8" filter="url(#synapseGlow)" />
              <circle className="synapse-pulse-2" r="5" fill="#F59E0B" filter="url(#synapseGlow)" />
            </svg>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
              {[
                { step: '01', title: 'Pick Chapter', desc: 'Syllabus roadmap', icon: '🗺️', color: 'border-blue-500/40 bg-blue-500/10' },
                { step: '02', title: 'Diagnostic', desc: 'Pinpoint exact gaps', icon: '🧪', color: 'border-emerald-500/40 bg-emerald-500/10' },
                { step: '03', title: 'MetaMind AI', desc: 'Targeted coaching', icon: '💡', color: 'border-amber-500/40 bg-amber-500/10' },
                { step: '04', title: '3D Badges', desc: 'Certified mastery', icon: '🏆', color: 'border-purple-500/40 bg-purple-500/10' },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className={`synapse-node p-3 rounded-2xl border ${s.color} backdrop-blur-xs space-y-1 transition-transform hover:-translate-y-1`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{s.icon}</span>
                    <span className="text-[10px] font-mono font-bold text-slate-400">Step {s.step}</span>
                  </div>
                  <div className="text-xs font-bold text-white">{s.title}</div>
                  <div className="text-[10px] text-slate-300 leading-tight">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: 2 Columns directly on page (Left: Courses 7/8 cols, Right: Table of Contents 5/4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* LEFT: Predefined Course Cards Grid */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {filteredCourses.map((course) => {
              const isSelected = selectedCourseId === course.id;

              return (
                <motion.div
                  key={course.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`learning-course-card relative rounded-3xl p-5 sm:p-6 transition-all duration-200 cursor-pointer flex items-center justify-between overflow-hidden shadow-xs border ${
                    isSelected
                      ? 'ring-2 ring-slate-900 ring-offset-2 shadow-md'
                      : 'hover:shadow-md'
                  }`}
                  style={{
                    backgroundColor: course.cardBg,
                    borderColor: course.borderColor,
                  }}
                >
                  {/* Left details */}
                  <div className="space-y-1 max-w-[65%] z-10">
                    <h3
                      className="text-lg sm:text-xl font-display font-bold leading-snug"
                      style={{ color: course.textColor }}
                    >
                      {course.title}
                    </h3>

                    <div className="text-xs font-medium space-y-0.5 pt-1" style={{ color: course.textColor, opacity: 0.85 }}>
                      <p>Chapter: {course.chaptersCount}</p>
                      <p>Study Time: {course.studyTimeHours}hrs</p>
                      <p>Mastery Goal: {course.masteryScore}%</p>
                    </div>
                  </div>

                  {/* Right: Themed Line-Art Illustration */}
                  <div className="shrink-0 flex items-center justify-center pointer-events-none pr-1">
                    <RenderCardIllustration
                      type={course.illustrationType}
                      color={course.accentColor}
                    />
                  </div>

                  {/* Selection Check Indicator */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Personalization Footer info */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-sans">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Personalized for <strong>{studentFullName}</strong> based on diagnostic evaluation.</span>
            </div>
            <button
              onClick={() => navigate('/app/chat')}
              className="text-teal-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Ask AI to curate a custom roadmap <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* RIGHT: Selected Course Table of Contents */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
            {/* Course Header (Clean, directly showing course name & table of contents) */}
            <div className="pb-4 border-b border-slate-100">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                {activeCourse.category}
              </span>
              <h2
                className="text-2xl font-display font-extrabold tracking-tight mt-2"
                style={{ color: activeCourse.accentColor }}
              >
                {activeCourse.title}
              </h2>
              <p className="text-xs font-semibold text-slate-400 font-sans tracking-wide mt-1">
                Table of content • {activeCourse.chaptersCount} Chapters
              </p>
            </div>

            {/* Numbered Chapters List */}
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
              {activeCourse.chapters.map((chapter) => (
                <div
                  key={chapter.id}
                  onClick={() => navigate(`/app/module?course=${activeCourse.id}&chapter=${chapter.id}`)}
                  className="group flex items-start gap-3.5 p-2.5 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100"
                >
                  {/* Big Stylized 2-Digit Number */}
                  <span
                    className="text-2xl sm:text-3xl font-display font-black leading-none shrink-0 tracking-tight transition-transform group-hover:scale-110"
                    style={{ color: activeCourse.numberColor }}
                  >
                    {chapter.number}
                  </span>

                  {/* Chapter Info */}
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-slate-900 transition-colors leading-snug">
                      {chapter.title}
                    </h5>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                      <span>Study time: {chapter.studyTime}</span>
                      {chapter.mastered && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 text-[9px] font-bold">
                          ✓ Ready
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLaunchPractice(activeCourse.title, chapter.title);
                        }}
                        className="px-2 py-0.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer border border-indigo-200/60 shadow-2xs hover:scale-105"
                      >
                        <Target className="w-2.5 h-2.5 text-indigo-600" /> Practice
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Action Card in Right Panel */}
            <div
              className="rounded-2xl p-4 border space-y-3"
              style={{
                backgroundColor: activeCourse.cardBg,
                borderColor: activeCourse.borderColor,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold" style={{ color: activeCourse.textColor }}>
                  Diagnostic Readiness
                </span>
                <span className="text-xs font-mono font-bold" style={{ color: activeCourse.textColor }}>
                  {activeCourse.masteryScore}%
                </span>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => handleLaunchAssessment(activeCourse.title, activeCourse.chapters[0]?.title || activeCourse.title)}
                isLoading={isStartingCheck}
                className="w-full font-bold shadow-xs cursor-pointer text-white"
                style={{ backgroundColor: activeCourse.accentColor }}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Start Diagnostic Check
              </Button>
            </div>
          </div>
        </div>
      </div>


      {/* HELP & GUIDELINES MODAL */}
      <AnimatePresence>
        {isHelpOpen && (
          <Dialog
            isOpen={true}
            onClose={() => setIsHelpOpen(false)}
            title="Learning Map & Predefined Courses Guide"
          >
            <div className="space-y-4 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              <p>
                MetaMind's <strong>Learning Map</strong> maps complex academic disciplines into modular chapter nodes:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Predefined Courses</strong>: Pick any core computer science or engineering subject from the catalog.</li>
                <li><strong>Table of Content</strong>: Review sequential topics with estimated study times.</li>
                <li><strong>Cognitive AI Diagnosis</strong>: Click any chapter to test your knowledge or ask the MetaMind tutor to explain concepts step-by-step.</li>
                <li><strong>Study Guide PDFs</strong>: Export revision-ready PDF sheets directly for offline review.</li>
              </ul>
              <div className="pt-2 flex justify-end">
                <Button variant="primary" size="sm" onClick={() => setIsHelpOpen(false)}>
                  Got it
                </Button>
              </div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};
