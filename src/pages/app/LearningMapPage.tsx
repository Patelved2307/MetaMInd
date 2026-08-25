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
  Network,
} from 'lucide-react';

export const LearningMapPage: React.FC = () => {
  const { activeSession, startAssessment, loading } = useLearning();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const avatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset.theme;

  const topicName = activeSession?.topic || 'SQL JOINs & Table Relationships';
  const subjectName = activeSession?.subject || 'Database Management Systems';
  const concepts = activeSession?.analysis?.concepts || [
    { name: 'Database Tables & Normalization', type: 'prerequisite', status: 'MASTERED', description: 'Structured schema organizing entities into discrete tables' },
    { name: 'Primary Keys (PK)', type: 'prerequisite', status: 'MASTERED', description: 'Unique, non-null identifier for individual table rows' },
    { name: 'Foreign Keys (FK)', type: 'prerequisite', status: 'IMPROVING', description: 'Referential integrity link connecting child rows to parent tables' },
    { name: 'SQL JOIN Clause', type: 'core', status: 'IN_PROGRESS', description: 'Query logic combining attributes from two or more tables' },
    { name: 'INNER JOIN Syntax', type: 'core', status: 'IN_PROGRESS', description: 'Returns matching records present in both tables' },
    { name: 'LEFT OUTER JOIN', type: 'core', status: 'NOT_STARTED', description: 'Returns all left table rows + matching right table attributes' },
    { name: 'Advanced Cartesian Joins', type: 'advanced', status: 'LOCKED', description: 'CROSS JOIN and self-referential tree queries' },
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
        return <Badge variant="success" className="gap-1 shadow-xs"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Mastered</Badge>;
      case 'IMPROVING':
        return <Badge variant="warning" className="gap-1 shadow-xs"><Sparkles className="w-3 h-3 text-amber-600" /> Improving</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="accent" className="gap-1 shadow-xs"><Play className="w-3 h-3 text-blue-600" /> In Progress</Badge>;
      case 'WEAK':
        return <Badge variant="error" className="gap-1 shadow-xs"><AlertCircle className="w-3 h-3 text-rose-600" /> Needs Work</Badge>;
      case 'LOCKED':
        return <Badge variant="glass" className="gap-1 text-slate-400 border-slate-200"><Lock className="w-3 h-3" /> Locked</Badge>;
      default:
        return <Badge variant="glass" className="gap-1 text-slate-500 border-slate-200"><HelpCircle className="w-3 h-3" /> Not Started</Badge>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 relative selection:bg-blue-100 text-slate-800 pb-12">
      {/* Light Radial Ambient Glow */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-20 z-0"
        style={{ background: theme.glow }}
      />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest font-mono font-bold text-blue-600">
              YOUR LEARNING JOURNEY
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-mono">{subjectName}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {topicName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl font-sans">
            {activeSession?.analysis?.description || 'Personalized concept graph mapping prerequisites to core topic mastery.'}
          </p>
        </div>

        <div className="shrink-0 space-y-1.5 text-right">
          <Button
            variant="primary"
            size="lg"
            onClick={handleStartCheck}
            isLoading={loading}
            className="font-bold cursor-pointer shadow-md border-none hover:scale-105 transition-transform text-white"
            style={{ backgroundColor: theme.primary }}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Check My Understanding
          </Button>
          <p className="text-[11px] text-slate-400 font-mono">3 to 4 quick diagnostic questions</p>
        </div>
      </div>

      {/* BEFORE WE START BANNER */}
      <div className="rounded-3xl p-6 sm:p-8 border border-slate-200/80 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3.5">
          <div
            className="p-3.5 rounded-2xl border shrink-0"
            style={{ backgroundColor: theme.badgeBg, borderColor: theme.border }}
          >
            <Layers className="w-6 h-6" style={{ color: theme.primary }} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">Before we start, let's understand what you already know.</h3>
            <p className="text-xs text-slate-600 font-sans mt-0.5">We'll ask a few diagnostic questions to pinpoint your current mastery and prerequisite understanding.</p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleStartCheck}
          isLoading={loading}
          className="shrink-0 text-xs bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200 cursor-pointer shadow-xs font-semibold"
        >
          Check My Understanding →
        </Button>
      </div>

      {/* VISUAL KNOWLEDGE MAP JOURNEY */}
      <div className="rounded-[2.5rem] p-6 sm:p-10 bg-white border border-slate-200/80 shadow-md space-y-6 relative z-10">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <Network className="w-5 h-5" style={{ color: theme.primary }} />
            <h2 className="text-xl font-display font-bold text-slate-900">Visual Knowledge Map</h2>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">{concepts.length} Concept Nodes</span>
        </div>

        {/* Vertical Node Sequence Flow */}
        <div className="max-w-xl mx-auto space-y-4 py-2 relative">
          {concepts.map((concept, index) => {
            return (
              <React.Fragment key={concept.name}>
                <div className="rounded-2xl p-5 bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-all flex items-start justify-between gap-4 group hover:shadow-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400 font-bold">0{index + 1}.</span>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors font-display">
                        {concept.name}
                      </h3>
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-200/70 text-slate-600">
                        {concept.type}
                      </span>
                    </div>
                    {concept.description && (
                      <p className="text-xs text-slate-600 pl-6 leading-relaxed font-sans">
                        {concept.description}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 pt-0.5">
                    {getStatusBadge(concept.status)}
                  </div>
                </div>

                {index < concepts.length - 1 && (
                  <div className="flex justify-center my-1 text-slate-300">
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
          className="font-bold cursor-pointer shadow-md px-8 py-4 border-none hover:scale-105 transition-transform text-white"
          style={{ backgroundColor: theme.primary }}
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          Check My Understanding
        </Button>
      </div>
    </div>
  );
};
