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
  AlertCircle,
  Lightbulb,
  BookOpen,
  Check,
  TrendingUp,
} from 'lucide-react';

export const AnalysisPage: React.FC = () => {
  const { activeSession, knowledgeAnalysis, loadPersonalizedModule, loading } = useLearning();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const avatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset.theme;

  const topicName = activeSession?.topic || 'SQL JOINs';

  const strongConcepts = knowledgeAnalysis?.strongConcepts || ['Database Tables', 'Primary Keys', 'INNER JOIN'];
  const needsImprovement = knowledgeAnalysis?.needsImprovementConcepts || ['Difference between INNER JOIN & LEFT JOIN', 'Handling Missing Rows'];
  const mainGap = knowledgeAnalysis?.mainKnowledgeGap || 'You understand that tables store data, but you need to strengthen your understanding of how related rows behave when data is missing.';
  const recommendedPath = knowledgeAnalysis?.recommendedPath || [
    'Table Relationships & Foreign Keys',
    'INNER JOIN Mechanism',
    'LEFT JOIN with Real-world Examples',
    'Targeted Practice',
  ];

  const handleStartPersonalizedModule = async () => {
    try {
      const firstConcept = recommendedPath[0] || 'LEFT JOIN';
      await loadPersonalizedModule(firstConcept);
      navigate('/app/module');
    } catch {
      // error handled
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative selection:bg-blue-100 text-slate-800 pb-12">
      {/* Light Radial Ambient Glow */}
      <div
        className="fixed top-0 right-0 w-[650px] h-[650px] rounded-full blur-[140px] pointer-events-none opacity-20 z-0"
        style={{ background: theme.glow }}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" className="gap-1 shadow-xs">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              AI Learning Analysis
            </Badge>
            <span className="text-xs text-slate-500 font-mono font-bold">Completed Assessment</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Learning Analysis: {topicName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-sans">
            Here is your diagnostic breakdown. We've identified your strengths and mapped a tailored path forward.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleStartPersonalizedModule}
          isLoading={loading}
          className="font-bold cursor-pointer shadow-md border-none hover:scale-105 shrink-0 text-white"
          style={{ backgroundColor: theme.primary }}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Start Personalized Learning
        </Button>
      </div>

      {/* MAIN KNOWLEDGE GAP ENCOURAGING BANNER */}
      <div className="rounded-3xl p-6 sm:p-8 border border-slate-200/80 bg-white shadow-sm space-y-3 relative z-10">
        <div className="flex items-center gap-2 text-sm font-bold text-amber-700">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Main Knowledge Opportunity</span>
        </div>
        <p className="text-base sm:text-lg text-slate-900 font-bold leading-relaxed font-display">
          "{mainGap}"
        </p>
        <p className="text-xs text-slate-600 font-sans">
          Encouraging Note: You are very close to full mastery! Strengthening this core gap will unlock complex queries effortlessly.
        </p>
      </div>

      {/* STRENGTHS & IMPROVEMENT AREAS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* STRONG CONCEPTS */}
        <div className="rounded-3xl p-6 bg-white border border-emerald-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-base font-display">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Strong Concepts</span>
          </div>
          <p className="text-xs text-slate-600 font-sans">Concepts where you demonstrated clear accuracy and confidence:</p>

          <ul className="space-y-2.5 pt-1">
            {strongConcepts.map((item) => (
              <li key={item} className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* NEEDS IMPROVEMENT */}
        <div className="rounded-3xl p-6 bg-white border border-amber-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-base font-display">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span>Concepts to Strengthen</span>
          </div>
          <p className="text-xs text-slate-600 font-sans">Target areas we will focus on in your personalized module:</p>

          <ul className="space-y-2.5 pt-1">
            {needsImprovement.map((item) => (
              <li key={item} className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* RECOMMENDED LEARNING PATH */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white border border-slate-200/80 shadow-sm space-y-4 relative z-10">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" style={{ color: theme.primary }} />
          <h2 className="text-xl font-display font-bold text-slate-900">Recommended Learning Path</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {recommendedPath.map((step, idx) => (
            <div key={step} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
              <span className="text-[10px] font-mono font-bold uppercase text-blue-600">
                Step 0{idx + 1}
              </span>
              <p className="font-bold text-slate-900 font-sans">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PRIMARY CTA */}
      <div className="text-center pt-4 relative z-10">
        <Button
          variant="primary"
          size="lg"
          onClick={handleStartPersonalizedModule}
          isLoading={loading}
          className="font-bold cursor-pointer shadow-md px-8 py-4 border-none hover:scale-105 transition-transform text-white"
          style={{ backgroundColor: theme.primary }}
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          Start Personalized Learning
        </Button>
      </div>
    </div>
  );
};
