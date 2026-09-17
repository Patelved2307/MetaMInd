import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAuth } from '@/features/auth';
import { generateAvatarUrl, getAvatarPresetByUrl } from '@/lib/avatarGenerator';
import { Button } from '@/components/ui/Button';
import {
  ConnectSolverModal,
  type SolverInfo,
} from '@/components/community/ConnectSolverModal';
import {
  AskDoubtModal,
  type NewDoubtPayload,
} from '@/components/community/AskDoubtModal';
import {
  Users,
  Search,
  Sparkles,
  Coins,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  ThumbsUp,
  Bot,
  Flame,
  Award,
  Send,
  Code,
  Check,
  Zap,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Radio,
} from 'lucide-react';

interface Answer {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  authorBadge: string;
  timeAgo: string;
  content: string;
  codeSnippet?: string;
  upvotes: number;
  hasUpvoted?: boolean;
  isAccepted: boolean;
  reactions: {
    insightful: number;
    accurate: number;
    clap: number;
  };
}

interface Doubt {
  id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  codeSnippet?: string;
  bountyXp: number;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  timeAgo: string;
  upvotes: number;
  hasUpvoted?: boolean;
  isSolved: boolean;
  aiHint?: string;
  isShowingAiHint?: boolean;
  answers: Answer[];
}

const INITIAL_DOUBTS: Doubt[] = [
  {
    id: 'd-1',
    title: "How to optimize Dijkstra's algorithm for sparse graphs?",
    category: 'Algorithms',
    difficulty: 'Medium',
    bountyXp: 100,
    authorName: 'Kevin Patel',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    authorRole: 'Computer Science • 2nd Year',
    timeAgo: '45 mins ago',
    upvotes: 24,
    isSolved: true,
    description:
      'I am currently using an adjacency matrix representation with Dijkstra, but on sparse graphs with 10^5 vertices and few edges, it is exceeding the time limit. What is the standard priority queue approach in C++/Python to drop complexity?',
    codeSnippet: `// Current naive approach: O(V^2)\nfor (int i = 0; i < V; i++) {\n    int u = minDistance(dist, visited);\n    visited[u] = true;\n    for (int v = 0; v < V; v++) {\n        if (!visited[v] && graph[u][v] && dist[u] + graph[u][v] < dist[v]) {\n            dist[v] = dist[u] + graph[u][v];\n        }\n    }\n}`,
    answers: [
      {
        id: 'ans-1',
        authorName: 'Marcus Vance',
        authorRole: 'Algorithms Mentor • 3rd Year',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        authorBadge: 'Grandmaster Mentor 🎖️',
        timeAgo: '20 mins ago',
        content:
          'Switch your representation to an Adjacency List `vector<pair<int, int>> adj[V]` and use a min-heap `std::priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>>`. This reduces the complexity from O(V²) down to O((V + E) log V), which easily passes in under 0.2 seconds.',
        codeSnippet: `priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;\npq.push({0, src});\ndist[src] = 0;\n\nwhile (!pq.empty()) {\n    auto [d, u] = pq.top();\n    pq.pop();\n    if (d > dist[u]) continue;\n    for (auto& edge : adj[u]) {\n        int v = edge.first, weight = edge.second;\n        if (dist[u] + weight < dist[v]) {\n            dist[v] = dist[u] + weight;\n            pq.push({dist[v], v});\n        }\n    }\n}`,
        upvotes: 18,
        isAccepted: true,
        reactions: { insightful: 12, accurate: 15, clap: 7 },
      },
      {
        id: 'ans-2',
        authorName: 'Sarah Jenkins',
        authorRole: 'Software Systems • 3rd Year',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
        authorBadge: 'Code Wizard 🧙‍♀️',
        timeAgo: '15 mins ago',
        content:
          'Marcus is spot on! Also remember the `if (d > dist[u]) continue;` guard line. Without that line, outdated elements remaining in the priority queue cause redundant edge evaluations and can TLE.',
        upvotes: 6,
        isAccepted: false,
        reactions: { insightful: 4, accurate: 3, clap: 2 },
      },
    ],
  },
  {
    id: 'd-2',
    title: 'Why does useEffect run in an infinite loop when passing an object state?',
    category: 'Web Dev',
    difficulty: 'Easy',
    bountyXp: 50,
    authorName: 'Priya Sharma',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    authorRole: 'Frontend Dev • 1st Year',
    timeAgo: '1 hour ago',
    upvotes: 15,
    isSolved: false,
    description:
      "Every time my component renders, my useEffect triggers an API call that sets filter state, which causes another re-render. I passed `[filters]` in the dependency array. Why is it not shallow comparing?",
    codeSnippet: `const [filters, setFilters] = useState({ query: '', page: 1 });\n\nuseEffect(() => {\n  fetchData(filters);\n}, [filters]);`,
    answers: [
      {
        id: 'ans-3',
        authorName: 'Alex Chen',
        authorRole: 'Full Stack Fellow • 4th Year',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        authorBadge: 'Top Contributor 🏆',
        timeAgo: '35 mins ago',
        content:
          'In JavaScript, objects compare by reference, not by content. If you recreate the `filters` object inline during parent render or inside your handler without `useMemo`, `filters !== prevFilters` is always true! Instead, list primitive keys `[filters.query, filters.page]` or wrap creation with `useMemo`.',
        upvotes: 11,
        isAccepted: false,
        reactions: { insightful: 9, accurate: 11, clap: 5 },
      },
    ],
  },
  {
    id: 'd-3',
    title: 'Intuition behind Self-Attention vs Cross-Attention in Transformers',
    category: 'AI / ML',
    difficulty: 'Hard',
    bountyXp: 150,
    authorName: 'Devin Thorne',
    authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    authorRole: 'Data Science • 3rd Year',
    timeAgo: '2 hours ago',
    upvotes: 31,
    isSolved: false,
    description:
      'Can someone provide an intuitive, visual explanation of how Query, Key, and Value differ between Encoder Self-Attention and Decoder Cross-Attention in the original "Attention Is All You Need" paper?',
    answers: [],
  },
];

const TOP_SOLVERS: SolverInfo[] = [
  {
    id: 's-1',
    name: 'Marcus Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    role: 'Algorithms & Data Structures Lead',
    badge: 'Grandmaster Mentor 🎖️',
    solvedCount: 52,
    rating: '99.4%',
    discordTag: 'marcus_vance#7819',
  },
  {
    id: 's-2',
    name: 'Sarah Jenkins',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    role: 'Computer Systems & Web Specialist',
    badge: 'Code Wizard 🧙‍♀️',
    solvedCount: 44,
    rating: '98.8%',
    discordTag: 'sarah_j#2026',
  },
  {
    id: 's-3',
    name: 'Alex Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    role: 'Full Stack & AI Engineer',
    badge: 'Top Contributor 🏆',
    solvedCount: 38,
    rating: '98.1%',
    discordTag: 'alexchen_dev#3310',
  },
];

export const StudentCommitteePage: React.FC = () => {
  const { user, profile } = useAuth();
  const studentName = profile?.full_name || user?.user_metadata?.full_name || 'Vipin';
  const avatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset.theme;

  // Main state
  const [doubts, setDoubts] = useState<Doubt[]>(INITIAL_DOUBTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [feedTab, setFeedTab] = useState<'trending' | 'open' | 'solved' | 'mine'>('trending');

  // Expanded discussion cards
  const [expandedDoubts, setExpandedDoubts] = useState<Record<string, boolean>>({
    'd-1': true,
    'd-2': true,
  });

  // Inline answer input states
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({});

  // Modals state
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [activeConnectSolver, setActiveConnectSolver] = useState<SolverInfo | null>(null);

  // Daily Quiz Poll state
  const [pollVoted, setPollVoted] = useState(false);
  const [selectedPollOption, setSelectedPollOption] = useState<number | null>(null);
  const [pollVotes, setPollVotes] = useState([18, 29, 142]); // O(n), O(n log n), O(n^2)

  // Trigger celebration confetti
  const triggerAcceptConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#10B981', '#3B82F6', '#F59E0B', '#6366F1', '#EC4899'],
    });
  };

  // Toggle discussion expansion
  const toggleExpand = (doubtId: string) => {
    setExpandedDoubts((prev) => ({ ...prev, [doubtId]: !prev[doubtId] }));
  };

  // Mark answer as Accepted / Correct
  const handleMarkAccepted = (doubtId: string, answerId: string) => {
    triggerAcceptConfetti();
    setDoubts((prev) =>
      prev.map((d) => {
        if (d.id !== doubtId) return d;
        return {
          ...d,
          isSolved: true,
          answers: d.answers.map((a) => ({
            ...a,
            isAccepted: a.id === answerId,
          })),
        };
      })
    );
  };

  // Upvote Question
  const handleUpvoteDoubt = (doubtId: string) => {
    setDoubts((prev) =>
      prev.map((d) => {
        if (d.id !== doubtId) return d;
        const hasUpvoted = d.hasUpvoted;
        return {
          ...d,
          upvotes: hasUpvoted ? d.upvotes - 1 : d.upvotes + 1,
          hasUpvoted: !hasUpvoted,
        };
      })
    );
  };

  // Upvote Answer
  const handleUpvoteAnswer = (doubtId: string, answerId: string) => {
    setDoubts((prev) =>
      prev.map((d) => {
        if (d.id !== doubtId) return d;
        return {
          ...d,
          answers: d.answers.map((a) => {
            if (a.id !== answerId) return a;
            const hasUpvoted = a.hasUpvoted;
            return {
              ...a,
              upvotes: hasUpvoted ? a.upvotes - 1 : a.upvotes + 1,
              hasUpvoted: !hasUpvoted,
            };
          }),
        };
      })
    );
  };

  // Add Reaction
  const handleReact = (
    doubtId: string,
    answerId: string,
    type: 'insightful' | 'accurate' | 'clap'
  ) => {
    setDoubts((prev) =>
      prev.map((d) => {
        if (d.id !== doubtId) return d;
        return {
          ...d,
          answers: d.answers.map((a) => {
            if (a.id !== answerId) return a;
            return {
              ...a,
              reactions: {
                ...a.reactions,
                [type]: a.reactions[type] + 1,
              },
            };
          }),
        };
      })
    );
  };

  // AI Hint Generation
  const handleToggleAiHint = (doubtId: string) => {
    setDoubts((prev) =>
      prev.map((d) => {
        if (d.id !== doubtId) return d;
        return {
          ...d,
          isShowingAiHint: !d.isShowingAiHint,
          aiHint:
            d.aiHint ||
            `💡 MetaMind AI Hint: Notice how the graph density affects edge traversal. For sparse graphs where E << V², priority queues avoid examining all V vertices iteratively. Consider examining priority queue operators and lazy deletion.`,
        };
      })
    );
  };

  // Submit Answer
  const handlePostAnswer = (doubtId: string) => {
    const text = answerDrafts[doubtId]?.trim();
    if (!text) return;

    const newAns: Answer = {
      id: `ans-${Date.now()}`,
      authorName: `${studentName} (You)`,
      authorRole: 'Active Learner',
      authorAvatar: avatarUrl,
      authorBadge: 'Rising Solver ⭐',
      timeAgo: 'Just now',
      content: text,
      upvotes: 0,
      isAccepted: false,
      reactions: { insightful: 0, accurate: 0, clap: 0 },
    };

    setDoubts((prev) =>
      prev.map((d) => {
        if (d.id !== doubtId) return d;
        return {
          ...d,
          answers: [...d.answers, newAns],
        };
      })
    );

    setAnswerDrafts((prev) => ({ ...prev, [doubtId]: '' }));
    setExpandedDoubts((prev) => ({ ...prev, [doubtId]: true }));
  };

  // Post New Doubt from Modal
  const handleCreateDoubt = (payload: NewDoubtPayload) => {
    const newDoubtItem: Doubt = {
      id: `d-${Date.now()}`,
      title: payload.title,
      category: payload.category,
      difficulty: payload.difficulty,
      description: payload.description,
      codeSnippet: payload.codeSnippet,
      bountyXp: payload.bountyXp,
      authorName: `${studentName} (You)`,
      authorAvatar: avatarUrl,
      authorRole: 'Active Scholar',
      timeAgo: 'Just now',
      upvotes: 1,
      hasUpvoted: true,
      isSolved: false,
      answers: [],
    };

    setDoubts([newDoubtItem, ...doubts]);
    setExpandedDoubts((prev) => ({ ...prev, [newDoubtItem.id]: true }));
  };

  // Poll Vote Handler
  const handleVotePoll = (index: number) => {
    if (pollVoted) return;
    const newVotes = [...pollVotes];
    newVotes[index] += 1;
    setPollVotes(newVotes);
    setSelectedPollOption(index);
    setPollVoted(true);
    triggerAcceptConfetti();
  };

  const totalPollVotes = pollVotes.reduce((a, b) => a + b, 0);

  // Filter Doubts
  const filteredDoubts = doubts.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || d.category.toLowerCase() === selectedCategory.toLowerCase();

    let matchesTab = true;
    if (feedTab === 'open') matchesTab = !d.isSolved;
    if (feedTab === 'solved') matchesTab = d.isSolved;
    if (feedTab === 'mine') matchesTab = d.authorName.includes('(You)');

    return matchesSearch && matchesCategory && matchesTab;
  });

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* 1. Live Community Marquee Ticker */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-4 py-2 rounded-2xl shadow-sm flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-semibold shrink-0">
          <span className="flex h-2 w-2 rounded-full bg-emerald-300 animate-ping" />
          <Radio className="w-3.5 h-3.5 text-blue-200" />
          <span>Live Pulse:</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-blue-100 font-medium truncate ml-3">
          <span className="flex items-center gap-1.5">
            ⚡ <strong className="text-white font-semibold">Alex Chen</strong> answered Dijkstra query (+100 XP Bounty)
          </span>
          <span className="hidden sm:inline text-blue-300">•</span>
          <span className="hidden sm:flex items-center gap-1.5">
            🎯 <strong className="text-white font-semibold">Sarah Jenkins</strong> gained Verified Mentor badge
          </span>
          <span className="hidden md:inline text-blue-300">•</span>
          <span className="hidden md:flex items-center gap-1.5">
            👥 <strong className="text-white font-semibold">48 Students</strong> active in Committee
          </span>
        </div>

        <span className="text-[11px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full shrink-0 ml-2 hidden lg:inline">
          Campus Committee
        </span>
      </div>

      {/* 2. Hero Header Banner */}
      <div className="relative overflow-hidden bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        {/* Dynamic theme accent background */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: theme.primary }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                Student Knowledge Committee
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Peer Verified
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Ask Doubts, Earn Bounties & Connect with Top Solvers
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Post academic queries, collaborate with fellow students who solve them accurately, and
              jump into live study sessions together.
            </p>
          </div>

          {/* Action & Student Stats pill */}
          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
            <Button
              onClick={() => setIsAskModalOpen(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-md hover:shadow-indigo-200 flex items-center justify-center gap-2 text-sm"
            >
              <HelpCircle className="w-4 h-4" />
              + Post a Doubt / Bounty
            </Button>

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-2xl text-xs font-medium text-slate-700">
              <div className="flex items-center gap-1 text-amber-600 font-bold">
                <Coins className="w-4 h-4" />
                <span>420 XP Karma</span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1 text-indigo-600 font-semibold">
                <Award className="w-3.5 h-3.5" />
                <span>Code Wizard 🧙‍♂️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mini stats counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 text-slate-700 text-xs">
          <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Doubts Solved</span>
            <span className="text-lg font-bold text-slate-900">342 Verified</span>
          </div>
          <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Active Solvers</span>
            <span className="text-lg font-bold text-indigo-600">89 Mentors</span>
          </div>
          <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Total XP Awarded</span>
            <span className="text-lg font-bold text-amber-600">24,500 XP</span>
          </div>
          <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Avg. Answer Time</span>
            <span className="text-lg font-bold text-emerald-600">~14 Mins</span>
          </div>
        </div>
      </div>

      {/* 3. Search & Topic Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions by topic, keyword, or problem (e.g., Dijkstra, React, AI)..."
            className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-sm transition"
          />
        </div>

        {/* Topic Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Algorithms', 'Web Dev', 'AI / ML', 'Mathematics', 'Exam Prep'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / CENTER: Question Feed (8 Columns on LG) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Feed Filter Navigation Tabs */}
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-1 text-xs">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFeedTab('trending')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                  feedTab === 'trending'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Trending
              </button>

              <button
                onClick={() => setFeedTab('open')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                  feedTab === 'open'
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                Open Bounties
              </button>

              <button
                onClick={() => setFeedTab('solved')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                  feedTab === 'solved'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Solved & Verified
              </button>
            </div>

            <button
              onClick={() => setFeedTab('mine')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                feedTab === 'mine'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Doubts
            </button>
          </div>

          {/* Doubts List */}
          {filteredDoubts.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 text-slate-500 space-y-3">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
              <h3 className="text-sm font-bold text-slate-800">No questions found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Be the first scholar to ask a question in this topic or adjust your filter!
              </p>
              <Button
                onClick={() => setIsAskModalOpen(true)}
                size="sm"
                className="bg-indigo-600 text-white text-xs rounded-xl"
              >
                + Post a Doubt Now
              </Button>
            </div>
          ) : (
            filteredDoubts.map((doubt) => {
              const isExpanded = !!expandedDoubts[doubt.id];
              const acceptedAnswer = doubt.answers.find((a) => a.isAccepted);

              return (
                <div
                  key={doubt.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6 space-y-4"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={doubt.authorAvatar}
                        alt={doubt.authorName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-900">
                            {doubt.authorName}
                          </span>
                          <span className="text-[11px] text-slate-400">• {doubt.timeAgo}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">{doubt.authorRole}</p>
                      </div>
                    </div>

                    {/* Status & Bounty Pills */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80">
                        <Coins className="w-3 h-3 text-amber-500" />
                        +{doubt.bountyXp} XP
                      </span>

                      {doubt.isSolved ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Solved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          <HelpCircle className="w-3 h-3" />
                          Needs Help
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Content */}
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {doubt.category}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          doubt.difficulty === 'Easy'
                            ? 'bg-emerald-50 text-emerald-700'
                            : doubt.difficulty === 'Medium'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {doubt.difficulty}
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                      {doubt.title}
                    </h2>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {doubt.description}
                    </p>
                  </div>

                  {/* Code Snippet (if available) */}
                  {doubt.codeSnippet && (
                    <div className="rounded-2xl bg-slate-900 text-slate-100 p-3.5 font-mono text-xs overflow-x-auto border border-slate-800">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 mb-2 border-b border-slate-800">
                        <span className="flex items-center gap-1">
                          <Code className="w-3 h-3 text-indigo-400" />
                          Code Snippet / Attempt
                        </span>
                        <button
                          onClick={() => navigator.clipboard.writeText(doubt.codeSnippet || '')}
                          className="hover:text-white transition"
                        >
                          Copy
                        </button>
                      </div>
                      <pre className="text-emerald-400 text-xs leading-5">
                        <code>{doubt.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {/* AI Hint Module (Interactive Delighter) */}
                  <AnimatePresence>
                    {doubt.isShowingAiHint && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-2xl p-3.5 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 text-xs text-purple-950 space-y-1"
                      >
                        <div className="flex items-center gap-1.5 font-bold text-purple-900">
                          <Bot className="w-4 h-4 text-purple-600" />
                          MetaMind AI Instant Hint
                        </div>
                        <p className="text-purple-800 leading-relaxed">{doubt.aiHint}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-600 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpvoteDoubt(doubt.id)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border transition ${
                          doubt.hasUpvoted
                            ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{doubt.upvotes}</span>
                      </button>

                      <button
                        onClick={() => toggleExpand(doubt.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{doubt.answers.length} Solutions</span>
                      </button>

                      <button
                        onClick={() => handleToggleAiHint(doubt.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 font-medium transition"
                      >
                        <Bot className="w-3.5 h-3.5 text-purple-600" />
                        <span>AI Hint</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {acceptedAnswer && (
                        <Button
                          onClick={() => {
                            setActiveConnectSolver({
                              id: acceptedAnswer.id,
                              name: acceptedAnswer.authorName,
                              avatarUrl: acceptedAnswer.authorAvatar,
                              role: acceptedAnswer.authorRole,
                              badge: acceptedAnswer.authorBadge,
                              solvedCount: 42,
                              rating: '99%',
                              doubtTitle: doubt.title,
                            });
                          }}
                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs px-3.5 py-1.5 rounded-xl font-bold shadow-sm flex items-center gap-1.5 animate-pulse"
                        >
                          <Users className="w-3.5 h-3.5" />
                          🤝 Connect with Solver
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* 5. Expanded Discussion / Solutions Thread */}
                  {isExpanded && (
                    <div className="pt-3 space-y-3 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Student Answers & Explanations ({doubt.answers.length})
                      </h4>

                      {doubt.answers.map((ans) => (
                        <div
                          key={ans.id}
                          className={`rounded-2xl p-4 transition-all ${
                            ans.isAccepted
                              ? 'bg-emerald-50/50 border-2 border-emerald-400 shadow-sm ring-2 ring-emerald-200/50'
                              : 'bg-slate-50/70 border border-slate-200/80'
                          }`}
                        >
                          {/* Answer Author Header */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={ans.authorAvatar}
                                alt={ans.authorName}
                                className="w-8 h-8 rounded-xl object-cover border border-slate-200"
                              />
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-bold text-slate-900">
                                    {ans.authorName}
                                  </span>
                                  <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                                    {ans.authorBadge}
                                  </span>
                                </div>
                                <span className="text-[11px] text-slate-400">
                                  {ans.authorRole} • {ans.timeAgo}
                                </span>
                              </div>
                            </div>

                            {/* Accepted Badge OR "Mark as Correct" Button */}
                            {ans.isAccepted ? (
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-600 text-white shadow-sm">
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  Accepted Solution
                                </span>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkAccepted(doubt.id, ans.id)}
                                className="text-xs px-2.5 py-1 rounded-xl text-emerald-700 hover:bg-emerald-50 border-emerald-300 font-semibold"
                              >
                                Mark as Correct 🎯
                              </Button>
                            )}
                          </div>

                          {/* Answer Body */}
                          <p className="text-xs text-slate-700 mt-2.5 leading-relaxed">
                            {ans.content}
                          </p>

                          {/* Answer Code Snippet */}
                          {ans.codeSnippet && (
                            <div className="mt-2.5 rounded-xl bg-slate-900 text-slate-100 p-3 font-mono text-xs overflow-x-auto border border-slate-800">
                              <pre className="text-emerald-400 text-xs">
                                <code>{ans.codeSnippet}</code>
                              </pre>
                            </div>
                          )}

                          {/* Answer Reactions & Connect Trigger */}
                          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200/60 flex-wrap gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUpvoteAnswer(doubt.id, ans.id)}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold ${
                                  ans.hasUpvoted
                                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                <ThumbsUp className="w-3 h-3" />
                                {ans.upvotes}
                              </button>

                              {/* Emoji Reactions */}
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleReact(doubt.id, ans.id, 'insightful')}
                                  className="px-2 py-0.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 text-xs flex items-center gap-1"
                                >
                                  💡 {ans.reactions.insightful}
                                </button>
                                <button
                                  onClick={() => handleReact(doubt.id, ans.id, 'accurate')}
                                  className="px-2 py-0.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 text-xs flex items-center gap-1"
                                >
                                  🎯 {ans.reactions.accurate}
                                </button>
                                <button
                                  onClick={() => handleReact(doubt.id, ans.id, 'clap')}
                                  className="px-2 py-0.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 text-xs flex items-center gap-1"
                                >
                                  👏 {ans.reactions.clap}
                                </button>
                              </div>
                            </div>

                            {/* Direct Connect to this specific solver */}
                            <button
                              onClick={() => {
                                setActiveConnectSolver({
                                  id: ans.id,
                                  name: ans.authorName,
                                  avatarUrl: ans.authorAvatar,
                                  role: ans.authorRole,
                                  badge: ans.authorBadge,
                                  solvedCount: 38,
                                  rating: '98.7%',
                                  doubtTitle: doubt.title,
                                });
                              }}
                              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                            >
                              🤝 Connect with {ans.authorName.split(' ')[0]}
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Inline Post Answer Form */}
                      <div className="pt-2">
                        <div className="relative">
                          <textarea
                            rows={2}
                            value={answerDrafts[doubt.id] || ''}
                            onChange={(e) =>
                              setAnswerDrafts((prev) => ({
                                ...prev,
                                [doubt.id]: e.target.value,
                              }))
                            }
                            placeholder="Write your explanation or code solution to earn the bounty..."
                            className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl p-3 pr-24 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 resize-none"
                          />
                          <Button
                            size="sm"
                            onClick={() => handlePostAnswer(doubt.id)}
                            className="absolute right-2.5 bottom-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-3 py-1.5 flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            Submit
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT: High-Impact Sidebar Widgets (4 Columns on LG) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Widget 1: Daily Brain Teaser / Instant Quiz */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                Daily Brain Teaser
              </span>
              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                +25 XP
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-800">
              What is the worst-case time complexity of standard QuickSort?
            </p>

            {/* Options */}
            <div className="space-y-2 pt-1 text-xs">
              {[
                { label: 'O(N)', pct: Math.round((pollVotes[0] / totalPollVotes) * 100) },
                { label: 'O(N log N)', pct: Math.round((pollVotes[1] / totalPollVotes) * 100) },
                {
                  label: 'O(N²) (When already sorted)',
                  pct: Math.round((pollVotes[2] / totalPollVotes) * 100),
                  isCorrect: true,
                },
              ].map((opt, i) => (
                <button
                  key={i}
                  disabled={pollVoted}
                  onClick={() => handleVotePoll(i)}
                  className={`w-full text-left p-2.5 rounded-xl border transition relative overflow-hidden ${
                    selectedPollOption === i
                      ? opt.isCorrect
                        ? 'border-emerald-400 bg-emerald-50/80 font-bold text-emerald-900'
                        : 'border-rose-400 bg-rose-50/80 font-bold text-rose-900'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {pollVoted && (
                    <div
                      className={`absolute left-0 top-0 bottom-0 opacity-20 ${
                        opt.isCorrect ? 'bg-emerald-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${opt.pct}%` }}
                    />
                  )}
                  <div className="relative z-10 flex items-center justify-between">
                    <span>{opt.label}</span>
                    {pollVoted && (
                      <span className="text-[11px] font-bold text-slate-500">
                        {opt.pct}% {opt.isCorrect && '✅'}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="text-[11px] text-slate-400 text-center pt-1">
              {totalPollVotes} campus students voted today
            </div>
          </div>

          {/* Widget 2: Weekly Top Solvers Podium */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Top Student Solvers this Week
              </h3>
              <span className="text-[10px] font-bold text-slate-400">Podium</span>
            </div>

            <div className="space-y-3 pt-1">
              {TOP_SOLVERS.map((solver, idx) => (
                <div
                  key={solver.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-extrabold text-slate-400 w-4 text-center">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                    </span>
                    <img
                      src={solver.avatarUrl}
                      alt={solver.name}
                      className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{solver.name}</h4>
                      <p className="text-[10px] text-slate-500">
                        {solver.solvedCount} Solved • {solver.rating}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveConnectSolver(solver)}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-xl"
                  >
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 3: High Bounty Doubts */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500" />
                High XP Bounty Doubts
              </h3>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                Fast XP
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-indigo-50/50 transition cursor-pointer">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mb-1">
                  <span>AI / ML</span>
                  <span className="text-amber-600 font-bold">+150 XP</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                  Attention vs Cross-Attention in Transformers
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-indigo-50/50 transition cursor-pointer">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mb-1">
                  <span>Algorithms</span>
                  <span className="text-amber-600 font-bold">+100 XP</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                  Red-Black Tree left-rotate edge case
                </p>
              </div>
            </div>
          </div>

          {/* Widget 4: Committee Honor Code */}
          <div className="bg-gradient-to-br from-indigo-50/70 to-blue-50/70 rounded-3xl p-5 border border-indigo-100 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-indigo-950">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Committee Honor Code
            </div>
            <p className="text-[11px] text-indigo-900/80 leading-relaxed">
              • Share steps, intuition, and reasons — not just copy-paste solutions.
              <br />
              • Respect all learners regardless of skill level.
              <br />• Mark accepted answers promptly so peers earn their rightful bounties!
            </p>
          </div>
        </div>
      </div>

      {/* Connect Solver Modal */}
      <ConnectSolverModal
        isOpen={!!activeConnectSolver}
        onClose={() => setActiveConnectSolver(null)}
        solver={activeConnectSolver}
      />

      {/* Ask Doubt Modal */}
      <AskDoubtModal
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
        onSubmit={handleCreateDoubt}
      />
    </div>
  );
};
