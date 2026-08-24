import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '@/features/learning';
import { useAuth } from '@/features/auth';
import { getAvatarPresetByUrl, generateAvatarUrl } from '@/lib/avatarGenerator';
import { downloadStudyGuide } from '@/lib/guideExporter';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code,
  Lightbulb,
  Download,
  Brain,
  FileCheck,
} from 'lucide-react';

export const LearningModulePage: React.FC = () => {
  const { activeModule, loadPersonalizedModule, startAssessment, loading } = useLearning();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const avatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset.theme;

  const studentName = profile?.full_name || user?.user_metadata?.full_name || 'Learner';

  const [tryItSelected, setTryItSelected] = useState<string>('');
  const [tryItAnswered, setTryItAnswered] = useState<boolean>(false);
  const [activePreference, setActivePreference] = useState<string>('Step-by-Step');

  const moduleData = activeModule || {
    conceptName: 'LEFT JOIN',
    explanationLevel: 'DEVELOPING',
    title: 'Understanding SQL LEFT JOIN Step-by-Step',
    explanation:
      'In simple terms, a LEFT JOIN combines two tables while making sure NO rows from the left table are lost. Think of it like taking a master attendance list of students: everyone on the list is kept, and if someone hasn\'t registered for a course, their course details are simply left blank (NULL).',
    example: {
      title: 'Students & Course Enrolments Real-World Example',
      scenario:
        'Imagine a `Students` table (Left) and an `Enrolments` table (Right). Alex is enrolled in SQL 101, Maya is enrolled in Web Dev, and Jordan has NOT enrolled in any course yet.',
      codeOrDiagram: `SELECT 
  Students.name, 
  Enrolments.course_name
FROM Students
LEFT JOIN Enrolments 
  ON Students.id = Enrolments.student_id;

-- QUERY OUTPUT:
-- Alex   | SQL 101
-- Maya   | Web Dev
-- Jordan | NULL   <-- Jordan is preserved with a NULL course!`,
      explanation:
        'An INNER JOIN would have completely excluded Jordan. LEFT JOIN guarantees Jordan stays in your report.',
    },
    keyIdea:
      'LEFT JOIN NEVER drops rows from the left table. Unmatched right columns simply become NULL.',
    tryItQuestion: {
      question:
        'What happens to a student record with no enrolled courses when executing a LEFT JOIN between Students and Courses?',
      options: [
        'The student is removed from the query results',
        'The student is displayed with NULL for course details',
        'The database throws an error',
        'The query hangs indefinitely',
      ],
      answer: 'The student is displayed with NULL for course details',
      explanation:
        'Exactly! LEFT JOIN preserves all left-table rows and fills missing right-side data with NULL.',
    },
  };

  const handleExplainDifferently = async (pref: string) => {
    setActivePreference(pref);
    try {
      await loadPersonalizedModule(moduleData.conceptName);
    } catch {
      // handled
    }
  };

  const handleStartDiagnosticAssessment = async () => {
    try {
      await startAssessment();
      navigate('/app/assessment');
    } catch {
      // handled
    }
  };

  const handleDownloadGuide = () => {
    downloadStudyGuide(moduleData, studentName);
  };

  const handleGoToExam = () => {
    navigate('/app/exam');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative selection:bg-white/20">
      {/* Background Sheen */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-all opacity-40 z-0"
        style={{ background: theme.glow }}
      />

      {/* HEADER WITH DOWNLOAD STUDY GUIDE ACTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" className="gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              Personalized Learning Module
            </Badge>
            <span className="text-xs text-white/50 font-mono">
              Level: <span style={{ color: theme.badgeText }}>{moduleData.explanationLevel}</span>
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-white tracking-tight">
            {moduleData.title}
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="secondary"
            size="md"
            onClick={handleDownloadGuide}
            className="text-xs liquid-glass text-white border-white/20 hover:bg-white/10 cursor-pointer"
            leftIcon={<Download className="w-4 h-4 text-[#8DD3FF]" />}
          >
            Download Topic Guide
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleGoToExam}
            className="font-semibold cursor-pointer shadow-lg border-none hover:scale-105"
            style={{ backgroundColor: theme.primary, color: '#05070A' }}
            rightIcon={<FileCheck className="w-4 h-4" />}
          >
            Take Exam & Get Certified
          </Button>
        </div>
      </div>

      {/* EASY INTUITIVE EXPLANATION CARD */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: theme.badgeText }}>
            <Sparkles className="w-4 h-4" />
            <span>Intuitive Explanation ({activePreference})</span>
          </div>
          <span className="text-xs font-mono text-white/50">Simplified Format</span>
        </div>
        <p className="text-base sm:text-lg text-white/90 leading-relaxed font-sans">
          {moduleData.explanation}
        </p>
      </div>

      {/* WORKED EXAMPLE */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 relative z-10">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#8DD3FF]">
          <Code className="w-4 h-4" />
          <span>{moduleData.example.title}</span>
        </div>

        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
          {moduleData.example.scenario}
        </p>

        {moduleData.example.codeOrDiagram && (
          <pre className="p-4 rounded-2xl bg-[#05070A] border border-white/10 text-xs font-mono text-[#8DD3FF] overflow-x-auto">
            {moduleData.example.codeOrDiagram}
          </pre>
        )}

        <p className="text-xs text-white/70 italic border-l-2 border-[#8DD3FF] pl-3 py-1">
          {moduleData.example.explanation}
        </p>
      </div>

      {/* KEY IDEA HIGHLIGHT */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-white/[0.05] via-white/[0.08] to-white/[0.05] border border-white/15 space-y-2 relative z-10">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F4C56A]">
          <Lightbulb className="w-4 h-4" />
          <span>Key Idea Takeaway</span>
        </div>
        <p className="text-base font-medium text-white">
          "{moduleData.keyIdea}"
        </p>
      </div>

      {/* TRY IT CHECK */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 relative z-10">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-xs font-mono text-[#7ED6A5] uppercase font-bold">Try It Self-Check</span>
          <span className="text-xs text-white/50">Quick clarity check</span>
        </div>

        <h3 className="text-base font-semibold text-white">
          {moduleData.tryItQuestion.question}
        </h3>

        <div className="space-y-2.5 pt-1">
          {moduleData.tryItQuestion.options?.map((option, idx) => {
            const isSelected = tryItSelected === option;
            const isCorrect = option === moduleData.tryItQuestion.answer;

            let btnStyle = 'bg-[#05070A] border-white/10 text-white/80 hover:border-white/20';
            if (tryItAnswered) {
              if (isCorrect) btnStyle = 'bg-[#7ED6A5]/15 border-[#7ED6A5] text-white';
              else if (isSelected) btnStyle = 'bg-[#FF8B8B]/15 border-[#FF8B8B] text-white';
              else btnStyle = 'bg-[#05070A] border-white/5 text-white/40';
            } else if (isSelected) {
              btnStyle = 'liquid-glass border-2 text-white font-medium';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (!tryItAnswered) setTryItSelected(option);
                }}
                className={`w-full p-3.5 rounded-xl border text-left text-xs flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
              >
                <span>{option}</span>
                {tryItAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-[#7ED6A5]" />}
              </button>
            );
          })}
        </div>

        {!tryItAnswered ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setTryItAnswered(true)}
            disabled={!tryItSelected}
            className="text-xs liquid-glass text-white hover:bg-white/10 cursor-pointer"
          >
            Check Answer
          </Button>
        ) : (
          <div className="p-3.5 rounded-xl bg-[#7ED6A5]/10 border border-[#7ED6A5]/30 text-xs text-[#7ED6A5]">
            {moduleData.tryItQuestion.explanation}
          </div>
        )}
      </div>

      {/* STILL UNCLEAR PROMPT FOR 4-5 QUESTION KNOWLEDGE ASSESSMENT */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-[#F4C56A]/30 bg-gradient-to-r from-[#1A1408] via-[#2D220E] to-[#120D04] space-y-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#F4C56A]/15 border border-[#F4C56A]/30 text-[#F4C56A]">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Still feel unclear or confused?</h3>
            <p className="text-xs text-white/70">
              Take a quick 4–5 Question Knowledge Assessment so our AI can pinpoint your exact misconceptions and generate a deeply detailed breakdown!
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10">
          <span className="text-xs text-[#F4C56A] font-mono">
            4–5 Adaptive Diagnostic Questions • Personalizes Detailed Explanation
          </span>

          <Button
            variant="primary"
            size="md"
            onClick={handleStartDiagnosticAssessment}
            isLoading={loading}
            className="w-full sm:w-auto font-semibold cursor-pointer border-none transition-all hover:scale-105"
            style={{ backgroundColor: '#F4C56A', color: '#05070A' }}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Take 4–5 Question Assessment
          </Button>
        </div>
      </div>

      {/* EXPLAIN DIFFERENTLY CONTROLS */}
      <div className="liquid-glass rounded-3xl p-6 border border-white/10 space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white/80">Need another perspective?</span>
          <span className="text-xs text-white/50 font-mono">Custom Format</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {['Explain Simply', 'Give Me an Example', 'Step-by-Step', 'Explain in Detail', 'Real-World Example'].map(
            (pref) => (
              <button
                key={pref}
                type="button"
                onClick={() => handleExplainDifferently(pref)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                  activePreference === pref
                    ? 'liquid-glass text-white border-2 font-semibold shadow-md'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border-white/10'
                }`}
                style={{ borderColor: activePreference === pref ? theme.primary : undefined }}
              >
                {pref}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
