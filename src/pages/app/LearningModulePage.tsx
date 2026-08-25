import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '@/features/learning';
import { useAuth } from '@/features/auth';
import { getAvatarPresetByUrl, generateAvatarUrl } from '@/lib/avatarGenerator';
import { downloadStudyGuide } from '@/lib/guideExporter';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Code,
  Lightbulb,
  Download,
  Brain,
  FileCheck,
  Puzzle,
  FileText,
  Upload,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LearningModulePage: React.FC = () => {
  const { activeModule, startAssessment, loading } = useLearning();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const avatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset.theme;

  const studentName = profile?.full_name || user?.user_metadata?.full_name || 'Vipin';

  const [tryItSelected, setTryItSelected] = useState<string>('');
  const [tryItAnswered, setTryItAnswered] = useState<boolean>(false);
  const [activePreference] = useState<string>('Step-by-Step');

  // Interactive Concept Puzzle State
  const [puzzleSteps, setPuzzleSteps] = useState([
    { id: 's2', text: 'Match ON key predicates between Left & Right tables', order: 2 },
    { id: 's1', text: 'Evaluate FROM clause & load Left Master Table', order: 1 },
    { id: 's3', text: 'Preserve unmatched Left rows & fill Right columns with NULL', order: 3 },
  ]);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);

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

  const handleSolvePuzzle = () => {
    // Sort steps correctly by order
    const sorted = [...puzzleSteps].sort((a, b) => a.order - b.order);
    setPuzzleSteps(sorted);
    setPuzzleSolved(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative selection:bg-blue-100 text-slate-800">
      {/* Light Ambient Sheen */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-20 z-0"
        style={{ background: theme.glow }}
      />

      {/* HEADER WITH DOWNLOAD & EXAM ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold font-mono border border-blue-200 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Course Module
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Level: <span style={{ color: theme.primary }} className="font-bold">{moduleData.explanationLevel}</span>
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {moduleData.title}
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownloadGuide}
            className="text-xs bg-white text-slate-700 border-slate-200 hover:bg-slate-50 cursor-pointer shadow-sm"
            leftIcon={<Download className="w-4 h-4 text-blue-600" />}
          >
            Download Topic Guide
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/app/exam')}
            className="font-bold cursor-pointer shadow-md hover:scale-105"
            style={{ backgroundColor: theme.primary, color: '#FFFFFF' }}
            rightIcon={<FileCheck className="w-4 h-4" />}
          >
            Take Exam & Get Certified
          </Button>
        </div>
      </div>

      {/* INTUITIVE EXPLANATION CARD */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold" style={{ color: theme.primary }}>
            <Sparkles className="w-4 h-4" />
            <span>Intuitive Explanation ({activePreference})</span>
          </div>
          <span className="text-xs font-mono text-slate-400">Simplified Format</span>
        </div>
        <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-sans font-medium">
          {moduleData.explanation}
        </p>
      </div>

      {/* NEW! INTERACTIVE CONCEPT PUZZLE SOLVING ENGINE */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md space-y-5 relative z-10">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Puzzle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Interactive Concept Puzzle Challenge
              </h3>
              <p className="text-xs text-slate-500">Arrange steps in correct logical sequence</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-bold text-xs font-mono border border-amber-200">
            +50 XP Reward
          </span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          How does the database engine process a <span className="font-bold text-blue-600">LEFT JOIN</span> query under the hood? Click submit to test your step sequence:
        </p>

        <div className="space-y-2.5 pt-1">
          {puzzleSteps.map((step, index) => (
            <motion.div
              key={step.id}
              layout
              className={`p-4 rounded-2xl border text-xs font-medium flex items-center justify-between transition-all ${
                puzzleSolved
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-mono font-bold text-slate-600 shadow-xs">
                  Step {index + 1}
                </span>
                <span>{step.text}</span>
              </div>
              {puzzleSolved && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
            </motion.div>
          ))}
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleSolvePuzzle}
          disabled={puzzleSolved}
          className="w-full font-bold text-xs cursor-pointer shadow-md"
          style={{ backgroundColor: theme.primary, color: '#FFFFFF' }}
        >
          {puzzleSolved ? '✅ Concept Puzzle Solved (+50 XP Earned!)' : 'Solve & Validate Sequence →'}
        </Button>
      </div>

      {/* WORKED EXAMPLE */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md space-y-4 relative z-10">
        <div className="flex items-center gap-2 text-sm font-bold text-blue-600">
          <Code className="w-4 h-4" />
          <span>{moduleData.example.title}</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          {moduleData.example.scenario}
        </p>

        {moduleData.example.codeOrDiagram && (
          <pre className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-blue-300 overflow-x-auto shadow-inner">
            {moduleData.example.codeOrDiagram}
          </pre>
        )}

        <p className="text-xs text-slate-600 italic border-l-2 border-blue-500 pl-3 py-1 font-medium">
          {moduleData.example.explanation}
        </p>
      </div>

      {/* EMBEDDED COURSE ASSIGNMENT CARD */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md space-y-4 relative z-10">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4.5 h-4.5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Module Practice Assignment</h3>
          </div>
          <span className="text-xs font-mono text-emerald-600 font-bold">
            {assignmentSubmitted ? 'Submitted ✓' : 'Due: End of Module'}
          </span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          Write a SQL query that retrieves all students and their assigned dorm rooms, ensuring students without assigned dorms are still displayed in the report.
        </p>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <textarea
            placeholder="Type your SQL query solution or assignment notes here..."
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 min-h-[90px]"
            disabled={assignmentSubmitted}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={() => setAssignmentSubmitted(true)}
            disabled={assignmentSubmitted}
            className="font-bold text-xs cursor-pointer shadow-sm"
            style={{ backgroundColor: theme.primary, color: '#FFFFFF' }}
            rightIcon={<Upload className="w-3.5 h-3.5" />}
          >
            {assignmentSubmitted ? 'Assignment Submitted Successfully' : 'Submit Assignment'}
          </Button>
        </div>
      </div>

      {/* KEY IDEA TAKEAWAWAY */}
      <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 space-y-2 relative z-10">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>Key Idea Takeaway</span>
        </div>
        <p className="text-base font-bold text-slate-900">
          "{moduleData.keyIdea}"
        </p>
      </div>

      {/* TRY IT CHECK */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md space-y-4 relative z-10">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-mono text-emerald-600 uppercase font-bold">Try It Self-Check</span>
          <span className="text-xs text-slate-500 font-medium">Quick clarity check</span>
        </div>

        <h3 className="text-base font-bold text-slate-900">
          {moduleData.tryItQuestion.question}
        </h3>

        <div className="space-y-2.5 pt-1">
          {moduleData.tryItQuestion.options?.map((option, idx) => {
            const isSelected = tryItSelected === option;
            const isCorrect = option === moduleData.tryItQuestion.answer;

            let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:border-slate-300';
            if (tryItAnswered) {
              if (isCorrect) btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
              else if (isSelected) btnStyle = 'bg-rose-50 border-rose-500 text-rose-950';
              else btnStyle = 'bg-slate-50 border-slate-200 text-slate-400';
            } else if (isSelected) {
              btnStyle = 'bg-blue-50 border-blue-500 text-blue-900 font-bold';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (!tryItAnswered) setTryItSelected(option);
                }}
                className={`w-full p-3.5 rounded-2xl border text-left text-xs flex items-center justify-between transition-all cursor-pointer shadow-sm ${btnStyle}`}
              >
                <span>{option}</span>
                {tryItAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
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
            className="text-xs bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200 cursor-pointer"
          >
            Check Answer
          </Button>
        ) : (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
            {moduleData.tryItQuestion.explanation}
          </div>
        )}
      </div>

      {/* UNCLEAR PROMPT FOR KNOWLEDGE ASSESSMENT */}
      <div className="rounded-3xl p-6 sm:p-8 border border-amber-200 bg-amber-50/80 space-y-4 relative z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-700">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Still feel unclear or confused?</h3>
            <p className="text-xs text-slate-600">
              Take a quick 4–5 Question Knowledge Assessment so our AI can pinpoint your exact misconceptions!
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-amber-200">
          <span className="text-xs text-amber-800 font-mono font-bold">
            4–5 Adaptive Diagnostic Questions • Personalizes Detailed Explanation
          </span>

          <Button
            variant="primary"
            size="md"
            onClick={handleStartDiagnosticAssessment}
            isLoading={loading}
            className="w-full sm:w-auto font-bold cursor-pointer border-none transition-all hover:scale-105 text-white"
            style={{ backgroundColor: theme.primary }}
            rightIcon={<Brain className="w-4 h-4" />}
          >
            Take 4–5 Question Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};
