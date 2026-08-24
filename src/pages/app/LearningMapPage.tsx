import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '@/features/learning';
import { useAuth } from '@/features/auth';
import { getAvatarPresetByUrl, generateAvatarUrl } from '@/lib/avatarGenerator';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Play,
  AlertCircle,
  HelpCircle,
  Layers,
  ArrowDown,
  BookOpen,
} from 'lucide-react';

export const LearningMapPage: React.FC = () => {
  const { activeSession, startAssessment, loading } = useLearning();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const avatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset.theme;

  const topicName = activeSession?.topic || 'SQL JOINs';
  const subjectName = activeSession?.subject || 'Database Management Systems';
  const concepts = activeSession?.analysis?.concepts || [
    { name: 'Tables', type: 'prerequisite', status: 'MASTERED', description: 'Database tables storing records' },
    { name: 'Primary Keys', type: 'prerequisite', status: 'MASTERED', description: 'Unique identifiers for table rows' },
    { name: 'Foreign Keys', type: 'prerequisite', status: 'IMPROVING', description: 'Reference keys linking tables' },
    { name: 'SQL JOINs', type: 'core', status: 'IN_PROGRESS', description: 'Combining data across tables' },
    { name: 'INNER JOIN', type: 'core', status: 'IN_PROGRESS', description: 'Matching rows in both tables' },
    { name: 'LEFT JOIN', type: 'core', status: 'NOT_STARTED', description: 'All left rows + matching right' },
    { name: 'Advanced JOIN Concepts', type: 'advanced', status: 'LOCKED', description: 'Outer and cartesian joins' },
  ];

  const handleStartCheck = async () => {
    try {
      await startAssessment();
      navigate('/app/assessment');
    } catch {
      // Handled in context
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'MASTERED':
        return <Badge variant="success" className="gap-1"><CheckCircle2 className="w-3 h-3" /> Mastered</Badge>;
      case 'IMPROVING':
        return <Badge variant="warning" className="gap-1"><Sparkles className="w-3 h-3" /> Improving</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="accent" className="gap-1"><Play className="w-3 h-3" /> In Progress</Badge>;
      case 'WEAK':
        return <Badge variant="error" className="gap-1"><AlertCircle className="w-3 h-3" /> Soft Red (Weak)</Badge>;
      case 'LOCKED':
        return <Badge variant="glass" className="gap-1 text-white/40"><Lock className="w-3 h-3" /> Locked</Badge>;
      default:
        return <Badge variant="glass" className="gap-1 text-white/60"><HelpCircle className="w-3 h-3" /> Not Started</Badge>;
    }
  };

  return (
    <div className="space-y-8 relative selection:bg-white/20">
      {/* Background Sheen */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-all opacity-50 z-0"
        style={{ background: theme.glow }}
      />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest font-mono font-semibold" style={{ color: theme.badgeText }}>
              YOUR LEARNING JOURNEY
            </span>
            <span className="text-xs text-white/40">•</span>
            <span className="text-xs text-white/60 font-mono">{subjectName}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-white tracking-tight">
            {topicName}
          </h1>
          <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-xl">
            {activeSession?.analysis?.description || 'Personalized concept graph mapping prerequisites to core topic mastery.'}
          </p>
        </div>

        <div className="shrink-0 space-y-2 text-right">
          <Button
            variant="primary"
            size="lg"
            onClick={handleStartCheck}
            isLoading={loading}
            className="font-semibold cursor-pointer shadow-lg border-none hover:scale-105"
            style={{ backgroundColor: theme.primary, color: '#05070A' }}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Check My Understanding
          </Button>
          <p className="text-[11px] text-white/50">3 to 4 quick diagnostic questions</p>
        </div>
      </div>

      {/* BEFORE WE START BANNER */}
      <div className="liquid-glass rounded-2xl p-6 border border-white/15 bg-gradient-to-r from-white/[0.03] via-white/[0.06] to-white/[0.03] flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl border" style={{ backgroundColor: theme.badgeBg, borderColor: theme.border }}>
            <Layers className="w-5 h-5" style={{ color: theme.badgeText }} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Before we start, let's understand what you already know.</h3>
            <p className="text-xs text-white/60">We'll ask a few diagnostic questions to pinpoint your current mastery and prerequisite understanding.</p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleStartCheck}
          isLoading={loading}
          className="shrink-0 text-xs liquid-glass text-white hover:bg-white/10 cursor-pointer"
        >
          Check My Understanding →
        </Button>
      </div>

      {/* VISUAL KNOWLEDGE MAP JOURNEY */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6 relative z-10">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" style={{ color: theme.primary }} />
            <h2 className="text-xl font-serif text-white">Visual Knowledge Map</h2>
          </div>
          <span className="text-xs font-mono text-white/50">{concepts.length} Concept Nodes</span>
        </div>

        {/* Vertical Node Sequence Flow */}
        <div className="max-w-xl mx-auto space-y-4 py-4 relative">
          {concepts.map((concept, index) => {
            return (
              <React.Fragment key={concept.name}>
                <div className="liquid-glass rounded-2xl p-5 border border-white/15 hover:border-white/40 transition-all flex items-start justify-between gap-4 group hover:scale-[1.02]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-white/40 font-bold">0{index + 1}.</span>
                      <h3 className="text-base font-semibold text-white group-hover:text-[#8DD3FF] transition-colors">
                        {concept.name}
                      </h3>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-white/50">
                        {concept.type}
                      </span>
                    </div>
                    {concept.description && (
                      <p className="text-xs text-white/60 pl-6 leading-relaxed">
                        {concept.description}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 pt-0.5">
                    {getStatusBadge(concept.status)}
                  </div>
                </div>

                {index < concepts.length - 1 && (
                  <div className="flex justify-center my-1 text-white/30">
                    <ArrowDown className="w-5 h-5 animate-pulse" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div className="text-center pt-4 relative z-10">
        <Button
          variant="primary"
          size="lg"
          onClick={handleStartCheck}
          isLoading={loading}
          className="font-semibold cursor-pointer shadow-xl px-8 py-3.5 border-none hover:scale-105"
          style={{ backgroundColor: theme.primary, color: '#05070A' }}
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          Check My Understanding
        </Button>
      </div>
    </div>
  );
};
