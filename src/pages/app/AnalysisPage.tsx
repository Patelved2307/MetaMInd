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
    <div className="max-w-4xl mx-auto space-y-8 relative selection:bg-white/20 pb-12">
      {/* Background Sheen */}
      <div
        className="fixed top-0 right-0 w-[650px] h-[650px] rounded-full blur-[150px] pointer-events-none transition-all opacity-40 z-0"
        style={{ background: theme.glow }}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" className="gap-1 shadow-sm">
              <TrendingUp className="w-3.5 h-3.5" />
              AI Learning Analysis
            </Badge>
            <span className="text-xs text-white/50 font-mono font-bold">Completed Assessment</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-white tracking-tight">
            Learning Analysis: {topicName}
          </h1>
          <p className="text-xs sm:text-sm text-white/75 mt-1 font-sans">
            Here is your diagnostic breakdown. We've identified your strengths and mapped a tailored path forward.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleStartPersonalizedModule}
          isLoading={loading}
          className="font-bold cursor-pointer shadow-2xl border-none funky-button shrink-0"
          style={{ backgroundColor: theme.primary, color: '#05070A' }}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Start Personalized Learning
        </Button>
      </div>

      {/* MAIN KNOWLEDGE GAP ENCOURAGING BANNER */}
      <div className="funky-card rounded-3xl p-6 sm:p-8 border border-white/15 bg-gradient-to-r from-white/[0.03] via-white/[0.06] to-white/[0.03] space-y-3 relative z-10">
        <div className="flex items-center gap-2 text-sm font-bold" style={{ color: theme.badgeText }}>
          <Lightbulb className="w-4 h-4" />
          <span>Main Knowledge Opportunity</span>
        </div>
        <p className="text-base sm:text-lg text-white font-semibold leading-relaxed font-sans">
          "{mainGap}"
        </p>
        <p className="text-xs text-white/65">
          Encouraging Note: You are very close to full mastery! Strengthening this core gap will unlock complex queries effortlessly.
        </p>
      </div>

      {/* STRENGTHS & IMPROVEMENT AREAS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* STRONG CONCEPTS */}
        <div className="funky-card rounded-3xl p-6 border border-[#7ED6A5]/30 space-y-4">
          <div className="flex items-center gap-2 text-[#7ED6A5] font-bold text-base">
            <CheckCircle2 className="w-5 h-5" />
            <span>Strong Concepts</span>
          </div>
          <p className="text-xs text-white/60">Concepts where you demonstrated clear accuracy and confidence:</p>

          <ul className="space-y-2.5 pt-1">
            {strongConcepts.map((item) => (
              <li key={item} className="flex items-center gap-3 p-3 rounded-2xl bg-[#7ED6A5]/10 border border-[#7ED6A5]/20 text-xs font-semibold text-white">
                <Check className="w-4 h-4 text-[#7ED6A5] shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* NEEDS IMPROVEMENT */}
        <div className="funky-card rounded-3xl p-6 border border-[#F4C56A]/30 space-y-4">
          <div className="flex items-center gap-2 text-[#F4C56A] font-bold text-base">
            <AlertCircle className="w-5 h-5" />
            <span>Concepts to Strengthen</span>
          </div>
          <p className="text-xs text-white/60">Target areas we will focus on in your personalized module:</p>

          <ul className="space-y-2.5 pt-1">
            {needsImprovement.map((item) => (
              <li key={item} className="flex items-center gap-3 p-3 rounded-2xl bg-[#F4C56A]/10 border border-[#F4C56A]/20 text-xs font-semibold text-white">
                <Sparkles className="w-4 h-4 text-[#F4C56A] shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* RECOMMENDED LEARNING PATH */}
      <div className="funky-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 relative z-10">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" style={{ color: theme.primary }} />
          <h2 className="text-xl font-serif text-white">Recommended Learning Path</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {recommendedPath.map((step, idx) => (
            <div key={step} className="p-4 rounded-2xl bg-[#05070A] border border-white/10 space-y-1 text-xs">
              <span className="text-[10px] font-mono font-bold uppercase" style={{ color: theme.badgeText }}>
                Step 0{idx + 1}
              </span>
              <p className="font-semibold text-white">{step}</p>
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
          className="font-bold cursor-pointer shadow-2xl px-8 py-4 border-none funky-button"
          style={{ backgroundColor: theme.primary, color: '#05070A' }}
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          Start Personalized Learning
        </Button>
      </div>
    </div>
  );
};
