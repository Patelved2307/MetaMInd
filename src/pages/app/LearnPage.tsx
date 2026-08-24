import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '@/features/learning';
import { useAuth } from '@/features/auth';
import { getAvatarPresetByUrl, generateAvatarUrl } from '@/lib/avatarGenerator';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  BookOpen,
  Database,
  Brain,
  Dna,
  Cpu,
  Play,
  FileCheck,
} from 'lucide-react';

const SUBJECT_LIBRARIES = [
  {
    id: 'dbms',
    subject: 'Database Management Systems',
    icon: Database,
    color: '#8DD3FF',
    topics: [
      { name: 'SQL JOINs & Table Relationships', query: 'I don\'t understand SQL JOINs', level: 'Core', count: '7 Concepts' },
      { name: 'Normalization & 3NF Forms', query: 'Explain database normalization 1NF 2NF 3NF', level: 'Intermediate', count: '5 Concepts' },
      { name: 'Indexes & Query Optimization', query: 'How do database indexes speed up queries?', level: 'Advanced', count: '6 Concepts' },
    ],
  },
  {
    id: 'algo',
    subject: 'Computer Science & Algorithms',
    icon: Brain,
    color: '#B9A7FF',
    topics: [
      { name: 'Recursion & Call Stack Memory', query: 'Explain recursion to me', level: 'Core', count: '5 Concepts' },
      { name: 'Binary Search Trees & Traversal', query: 'How does binary search tree work?', level: 'Intermediate', count: '6 Concepts' },
      { name: 'Dynamic Programming Foundations', query: 'Teach me dynamic programming basics', level: 'Advanced', count: '8 Concepts' },
    ],
  },
  {
    id: 'bio',
    subject: 'Biological Sciences & Physiology',
    icon: Dna,
    color: '#7ED6A5',
    topics: [
      { name: 'Photosynthesis & Cellular Energy', query: 'Help me understand photosynthesis', level: 'Core', count: '4 Concepts' },
      { name: 'Cellular Respiration & ATP', query: 'Explain cellular respiration and ATP', level: 'Intermediate', count: '5 Concepts' },
      { name: 'DNA Replication & Protein Synthesis', query: 'How does DNA replication work step by step', level: 'Advanced', count: '7 Concepts' },
    ],
  },
  {
    id: 'ai',
    subject: 'Artificial Intelligence & ML',
    icon: Cpu,
    color: '#F4C56A',
    topics: [
      { name: 'Machine Learning Foundations', query: 'Teach me machine learning from basics', level: 'Core', count: '4 Concepts' },
      { name: 'Gradient Descent & Loss Functions', query: 'How does gradient descent optimize models?', level: 'Intermediate', count: '6 Concepts' },
      { name: 'Neural Networks & Deep Learning', query: 'Explain neural networks architecture', level: 'Advanced', count: '8 Concepts' },
    ],
  },
];

export const LearnPage: React.FC = () => {
  const { startLearningJourney, loading } = useLearning();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const avatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset.theme;

  const [searchQuery, setSearchQuery] = useState('');

  const handleLaunchTopic = async (query: string) => {
    try {
      await startLearningJourney(query);
      navigate('/app/learning-map');
    } catch {
      // error handled
    }
  };

  return (
    <div className="space-y-8 relative selection:bg-white/20">
      {/* Background Sheen */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-all opacity-40 z-0"
        style={{ background: theme.glow }}
      />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" className="gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              Adaptive Subject Library
            </Badge>
            <span className="text-xs text-white/50 font-mono">Curated Learning Paths</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-white tracking-tight">
            Learn Hub & Topic Catalog
          </h1>
          <p className="text-xs sm:text-sm text-white/70 mt-1">
            Select any topic to generate a personalized AI learning map, diagnostic assessment, and interactive module.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/app/exam')}
          className="font-semibold cursor-pointer shadow-lg border-none shrink-0"
          style={{ backgroundColor: theme.primary, color: '#05070A' }}
          rightIcon={<FileCheck className="w-4 h-4" />}
        >
          Take Timed Exam
        </Button>
      </div>

      {/* SEARCH BAR */}
      <div className="liquid-glass rounded-2xl p-3 border border-white/10 flex items-center gap-3 shadow-xl relative z-10">
        <Sparkles className="w-5 h-5 ml-3 shrink-0" style={{ color: theme.primary }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search any subject or topic to generate a learning journey..."
          className="w-full bg-transparent text-white placeholder:text-white/40 text-sm outline-none border-none py-1"
        />
        {searchQuery && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleLaunchTopic(searchQuery)}
            isLoading={loading}
            className="shrink-0 font-semibold cursor-pointer border-none"
            style={{ backgroundColor: theme.primary, color: '#05070A' }}
          >
            Start
          </Button>
        )}
      </div>

      {/* SUBJECT LIBRARIES GRID */}
      <div className="space-y-8 relative z-10">
        {SUBJECT_LIBRARIES.map((lib) => {
          const Icon = lib.icon;
          const filteredTopics = lib.topics.filter(
            (t) =>
              t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              lib.subject.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (searchQuery && filteredTopics.length === 0) return null;

          return (
            <div key={lib.id} className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <Icon className="w-6 h-6" style={{ color: lib.color }} />
                </div>
                <div>
                  <h2 className="text-xl font-serif text-white">{lib.subject}</h2>
                  <p className="text-xs text-white/50">{lib.topics.length} Adaptive Learning Modules</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredTopics.map((topic) => (
                  <div
                    key={topic.name}
                    className="p-5 rounded-2xl bg-[#05070A] border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white/5 text-white/60">
                          {topic.level}
                        </span>
                        <span className="text-[11px] font-mono text-white/40">{topic.count}</span>
                      </div>
                      <h3 className="text-base font-semibold text-white group-hover:text-[#8DD3FF] transition-colors">
                        {topic.name}
                      </h3>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleLaunchTopic(topic.query)}
                      isLoading={loading}
                      className="w-full flex items-center justify-center gap-2 text-xs liquid-glass text-white hover:bg-white/10 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" style={{ color: lib.color }} />
                      <span>Start Learning Journey</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
