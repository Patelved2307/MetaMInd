import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Play,
  Terminal,
  Copy,
  Check,
  Bot,
  Lightbulb,
  Table as TableIcon,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Target,
  FileDown,
} from 'lucide-react';
import { useAuth } from '@/features/auth';
import { downloadChapterStudyGuidePdf } from '@/features/chat/studyGuidePdf';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  type ChapterContent,
  getChapterContent,
} from '@/data/chaptersContentData';

interface ChapterStudyViewProps {
  courseId: string;
  chapterId: string;
  chapterTitle?: string;
  onNavigateChapter?: (chapterId: string) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const ChapterStudyView: React.FC<ChapterStudyViewProps> = ({
  courseId,
  chapterId,
  chapterTitle,
  onNavigateChapter,
  onClose,
  isModal = false,
}) => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const studentName =
    profile?.full_name?.trim() ||
    user?.user_metadata?.full_name?.trim() ||
    user?.email?.split('@')[0] ||
    'Scholar';

  const [content, setContent] = useState<ChapterContent>(() =>
    getChapterContent(courseId, chapterId, chapterTitle)
  );

  const handleExportStudyGuide = () => {
    downloadChapterStudyGuidePdf(content, studentName);
  };

  // Re-fetch content when chapterId changes
  useEffect(() => {
    setContent(getChapterContent(courseId, chapterId, chapterTitle));
    setSelectedAnswers({});
    setShowCodeOutput(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [courseId, chapterId, chapterTitle]);

  // Code Sandbox State
  const [showCodeOutput, setShowCodeOutput] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Active Recall Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const handleSelectOption = (questionId: string, option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(content.codeExample.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleNextChapter = () => {
    if (content.nextChapterId) {
      if (onNavigateChapter) {
        onNavigateChapter(content.nextChapterId);
      } else {
        navigate(`/app/module?course=${courseId}&chapter=${content.nextChapterId}`);
      }
    }
  };

  const handlePrevChapter = () => {
    if (content.prevChapterId) {
      if (onNavigateChapter) {
        onNavigateChapter(content.prevChapterId);
      } else {
        navigate(`/app/module?course=${courseId}&chapter=${content.prevChapterId}`);
      }
    }
  };

  const handleLaunchExam = () => {
    navigate(`/app/exam?course=${encodeURIComponent(content.courseTitle)}&topic=${encodeURIComponent(content.title)}`);
  };

  const handleLaunchPractice = () => {
    navigate(`/app/practice?course=${encodeURIComponent(content.courseTitle)}&topic=${encodeURIComponent(content.title)}`);
  };

  const handleLaunchAiChat = () => {
    navigate('/app/chat', {
      state: {
        initialPrompt: `Explain the core concepts and real-world implementation of "${content.title}" in ${content.courseTitle} step-by-step with practical examples.`,
      },
    });
  };

  return (
    <div className={`w-full ${isModal ? 'max-h-[85vh] overflow-y-auto px-1 sm:px-4' : 'max-w-5xl mx-auto space-y-10 pb-16'}`}>
      {/* ========================================================================= */}
      {/* 1. ARTICLE HEADER (GeeksforGeeks & W3Schools Clean Masthead) */}
      {/* ========================================================================= */}
      <div className="space-y-4 border-b border-slate-200/80 pb-6">
        {/* Breadcrumb & Meta */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="font-bold text-slate-800">{content.courseTitle}</span>
            <span>/</span>
            <span className="text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Chapter {content.chapterNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="accent" className="gap-1 font-mono text-[11px]">
              <Clock className="w-3 h-3" />
              {content.readingTime} read
            </Badge>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
              {content.difficulty}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportStudyGuide}
              className="gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50/80 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 shadow-sm cursor-pointer"
              title="Download comprehensive, printable revision study guide (PDF)"
            >
              <FileDown className="w-3.5 h-3.5 text-indigo-600" />
              <span>Export Guide PDF</span>
            </Button>
            {isModal && onClose && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-sm font-bold"
              >
                ✕ Close
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
          {content.title}
        </h1>

        {/* Topic Tag Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {content.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-sans font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Quick Jump Bar */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md py-2.5 border-b border-slate-200/80 -mx-1 px-1 sm:px-0 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs font-medium text-slate-600">
        <span className="text-slate-400 font-mono text-[11px] shrink-0 font-bold">Quick Jump:</span>
        <a href="#section-overview" className="px-2.5 py-1 rounded-lg hover:bg-slate-100 hover:text-slate-900 shrink-0">
          Overview
        </a>
        <a href="#section-terminology" className="px-2.5 py-1 rounded-lg hover:bg-slate-100 hover:text-slate-900 shrink-0">
          Key Terminology
        </a>
        <a href="#section-concepts" className="px-2.5 py-1 rounded-lg hover:bg-slate-100 hover:text-slate-900 shrink-0">
          Core Concepts
        </a>
        {content.schemaDiagram && (
          <a href="#section-diagram" className="px-2.5 py-1 rounded-lg hover:bg-slate-100 hover:text-slate-900 shrink-0">
            Schema Diagram
          </a>
        )}
        <a href="#section-code" className="px-2.5 py-1 rounded-lg hover:bg-slate-100 hover:text-slate-900 shrink-0">
          Try It Yourself
        </a>
        <a href="#section-quiz" className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 shrink-0">
          Active Recall Quiz
        </a>
      </div>

      {/* ========================================================================= */}
      {/* 2. OVERVIEW & BACKGROUND (GeeksforGeeks Style Intro) */}
      {/* ========================================================================= */}
      <div id="section-overview" className="space-y-4 pt-4">
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-teal-50/70 via-white to-teal-50/20 border border-teal-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Conceptual Overview & Foundations</span>
          </div>
          <p className="text-sm sm:text-base text-slate-800 font-sans leading-relaxed">
            {content.overview}
          </p>
          {content.historyOrBackground && (
            <div className="p-3.5 rounded-xl bg-white border border-teal-100 text-xs text-slate-600 space-y-1 font-sans">
              <span className="font-bold text-teal-900 block">Historical Context & Origin:</span>
              <p>{content.historyOrBackground}</p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. KEY TERMINOLOGY COMPARISON TABLE (GeeksforGeeks Signature Table) */}
      {/* ========================================================================= */}
      <div id="section-terminology" className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 flex items-center gap-2">
            <TableIcon className="w-5 h-5 text-indigo-600" />
            Key Terminology & Formal Definitions
          </h2>
          <span className="text-xs text-slate-400 font-mono">Formal Relational Algebra vs Everyday DBMS</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold font-mono">
              <tr>
                <th className="p-3 sm:p-3.5">Mathematical Term</th>
                <th className="p-3 sm:p-3.5">DBMS Term</th>
                <th className="p-3 sm:p-3.5">Everyday Equivalent</th>
                <th className="p-3 sm:p-3.5">Formal Technical Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {content.keyTerms.map((term, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3 sm:p-3.5 font-bold text-indigo-700 font-mono">{term.mathTerm}</td>
                  <td className="p-3 sm:p-3.5 font-semibold text-slate-900">{term.dbmsTerm}</td>
                  <td className="p-3 sm:p-3.5 text-slate-500 font-sans">{term.everydayTerm}</td>
                  <td className="p-3 sm:p-3.5 text-slate-700 font-sans">{term.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. CORE CONCEPTS BREAKDOWN */}
      {/* ========================================================================= */}
      <div id="section-concepts" className="space-y-6 pt-4">
        <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          Core Architectural Principles
        </h2>

        <div className="space-y-4">
          {content.coreConcepts.map((concept, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3"
            >
              <h3 className="text-base font-bold text-slate-900 font-display">
                {concept.heading}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
                {concept.content}
              </p>
              {concept.points && concept.points.length > 0 && (
                <ul className="space-y-2 pt-1">
                  {concept.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                      <div className="w-4 h-4 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span className="font-sans leading-normal">{pt}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. VISUAL SCHEMA DIAGRAM & TABULAR REPRESENTATION */}
      {/* ========================================================================= */}
      {content.schemaDiagram && (
        <div id="section-diagram" className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 flex items-center gap-2">
              <TableIcon className="w-5 h-5 text-emerald-600" />
              Visual Relational Schema & Tuple Table
            </h2>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold border border-emerald-200">
              Live Schema Preview
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-mono text-xs font-bold text-slate-700">
                {content.schemaDiagram.tableName}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Degree: {content.schemaDiagram.columns.length} columns | Cardinality: {content.schemaDiagram.rows.length} rows
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 border-b border-slate-200">
                    {content.schemaDiagram.columns.map((col, idx) => (
                      <th key={idx} className="p-2.5">
                        <div className="flex items-center gap-1">
                          <span className={col.isKey ? 'font-bold text-indigo-700 underline' : 'font-semibold'}>
                            {col.name}
                          </span>
                          {col.isKey && (
                            <span className="px-1 py-0.2 rounded bg-indigo-100 text-indigo-800 text-[9px] font-bold">
                              PK
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal block font-sans">
                          {col.type}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {content.schemaDiagram.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className={`p-2.5 ${
                            content.schemaDiagram?.columns[cIdx]?.isKey
                              ? 'font-bold text-indigo-900 bg-indigo-50/30'
                              : 'text-slate-700'
                          }`}
                        >
                          {String(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. W3SCHOOLS STYLE CODE EXAMPLE & INTERACTIVE TRY IT YOURSELF (DEBLUN OS) */}
      {/* ========================================================================= */}
      <div id="section-code" className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-londrina text-3xl sm:text-4xl text-slate-400 select-none">
              06
            </span>
            <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-600" />
              {content.codeExample.title}
            </h2>
          </div>
          <span className="text-xs font-bold font-mono text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            DEBLUN OS Sandbox
          </span>
        </div>

        {/* DEBLUN OS Window Container */}
        <div className="rounded-2xl overflow-hidden border border-slate-700/80 bg-[#0B0F19] shadow-xl text-slate-200 font-mono">
          {/* Mac OS Window Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#111827] border-b border-slate-800 text-xs select-none">
            {/* Left Traffic-Light Dots */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e] inline-block shadow-2xs" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24] inline-block shadow-2xs" />
              <span className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29] inline-block shadow-2xs" />
              <span className="text-[11px] text-slate-400 font-mono ml-2 hidden sm:inline">
                metamind-engine@v2.4.0: ~/db_schemas/query.sql
              </span>
            </div>

            {/* Center / Right Controls */}
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                [SYS.READY]
              </span>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-300 hover:text-white px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => setShowCodeOutput(!showCodeOutput)}
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-1 rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>{showCodeOutput ? 'Reset Sandbox' : 'Run SQL Query'}</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation Bar */}
          <div className="flex items-center border-b border-slate-800 bg-[#0d131f] px-3 pt-2 gap-1 text-xs select-none">
            <div className="px-3.5 py-1.5 rounded-t-lg bg-[#0B0F19] text-indigo-400 font-bold border-t-2 border-indigo-500 text-[11px] flex items-center gap-2">
              <span className="text-emerald-400 text-[10px]">●</span>
              <span>query.sql</span>
            </div>
            <div className="px-3 py-1.5 text-slate-500 text-[11px] hover:text-slate-400 transition-colors cursor-pointer">
              schema_def.sql
            </div>
            <div className="px-3 py-1.5 text-slate-500 text-[11px] hover:text-slate-400 transition-colors cursor-pointer">
              telemetry.log
            </div>
          </div>

          {/* Editor Body with Line Numbers */}
          <div className="p-4 sm:p-5 flex gap-4 text-xs sm:text-sm leading-relaxed overflow-x-auto custom-scrollbar bg-[#0B0F19]">
            {/* Line Numbers */}
            <div className="select-none text-slate-600 text-right pr-3 border-r border-slate-800/80 font-mono space-y-0.5">
              {content.codeExample.code.split('\n').map((_, lineIdx) => (
                <div key={lineIdx} className="leading-relaxed">
                  {lineIdx + 1}
                </div>
              ))}
            </div>

            {/* Code Content with Blinking Cursor */}
            <pre className="font-mono text-emerald-300 leading-relaxed overflow-x-auto flex-1">
              <code>{content.codeExample.code}</code>
              <span className="cursor-blink inline-block w-2 h-4 bg-emerald-400 align-middle ml-1" />
            </pre>
          </div>

          {/* Interactive Output Console */}
          {showCodeOutput && (
            <div className="border-t border-slate-800 bg-[#020617] p-4 sm:p-5 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-1">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold text-slate-300">Execution Stream Output:</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                  Status: [200 OK] • Elapsed: 14ms • Memory: 1.2MB
                </span>
              </div>
              <pre className="font-mono text-xs text-slate-300 whitespace-pre overflow-x-auto p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 leading-normal">
                {content.codeExample.outputPreview}
              </pre>
            </div>
          )}

          {/* Explanatory Technical Footer */}
          <div className="p-3.5 bg-[#111827] border-t border-slate-800 text-xs text-slate-400 font-sans flex items-center justify-between">
            <div>
              <strong className="text-slate-200">Engine Note: </strong>
              {content.codeExample.explanation}
            </div>
            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline shrink-0 pl-3">
              UTF-8 • SQL(ANSI)
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. INTEGRITY CONSTRAINTS & INTERVIEW TRAPS (GeeksforGeeks Pro Tips) */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-600" />
          Mandatory Integrity Rules & Common Interview Traps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.rulesAndConstraints.map((rule, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border space-y-2 ${
                rule.severity === 'critical'
                  ? 'bg-rose-50/60 border-rose-200 text-rose-950'
                  : 'bg-amber-50/60 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs">
                {rule.severity === 'critical' ? (
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                )}
                <span>{rule.name}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-sans">{rule.rule}</p>
            </div>
          ))}
        </div>

        {/* GeeksforGeeks Interview Q&A Accordion Box */}
        {content.interviewTips.length > 0 && (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>GeeksforGeeks Frequently Asked Interview Traps</span>
            </div>
            <div className="space-y-2">
              {content.interviewTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-700 font-sans leading-relaxed"
                >
                  {tip}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 8. ACTIVE RECALL QUESTION SECTION (Regarding this topic only!) */}
      {/* ========================================================================= */}
      <div id="section-quiz" className="space-y-4 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Target className="w-4 h-4 text-indigo-600" />
              </div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900">
                Active Recall: Test Your Understanding
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Verify your comprehension before proceeding to the next chapter.
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-xl">
            {Object.keys(selectedAnswers).length} / {content.questions.length} Answered
          </span>
        </div>

        <div className="space-y-5">
          {content.questions.map((q, qIdx) => {
            const chosen = selectedAnswers[q.id];
            const isAnswered = Boolean(chosen);
            const isCorrect = chosen === q.correctAnswer;

            return (
              <div
                key={q.id}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 font-sans leading-snug">
                    <span className="text-indigo-600 font-mono mr-1.5">Q{qIdx + 1}.</span>
                    {q.question}
                  </h4>
                  {isAnswered && (
                    <span
                      className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct!
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" /> Try Again
                        </>
                      )}
                    </span>
                  )}
                </div>

                {/* Question Options */}
                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => {
                    const optionLetter = String.fromCharCode(65 + oIdx);
                    const isThisSelected = chosen === opt;
                    const isThisCorrect = opt === q.correctAnswer;

                    let optionStyle =
                      'bg-slate-50 border-slate-200 hover:bg-slate-100/80 text-slate-800';

                    if (isAnswered) {
                      if (isThisCorrect) {
                        optionStyle = 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold';
                      } else if (isThisSelected && !isThisCorrect) {
                        optionStyle = 'bg-rose-50 border-rose-300 text-rose-950';
                      } else {
                        optionStyle = 'bg-slate-50/50 border-slate-100 text-slate-400';
                      }
                    }

                    return (
                      <div
                        key={oIdx}
                        onClick={() => handleSelectOption(q.id, opt)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${optionStyle}`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold font-mono flex items-center justify-center text-xs shrink-0 shadow-2xs">
                          {optionLetter}
                        </span>
                        <span className="flex-1 font-sans">{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation feedback */}
                {isAnswered && (
                  <div
                    className={`p-3 rounded-xl text-xs font-sans leading-relaxed border ${
                      isCorrect
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                        : 'bg-amber-50/60 border-amber-200 text-amber-900'
                    }`}
                  >
                    <strong className="block mb-0.5">
                      {isCorrect ? '✓ Explanation:' : '💡 Conceptual Explanation:'}
                    </strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 9. NAVIGATION & ACTION BUTTONS (Next Chapter, Exam, AI Tutor) */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-lg space-y-5 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[11px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
              Ready for Next Steps
            </span>
            <h3 className="text-lg font-bold font-display text-white">
              Continue Your Learning Journey
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLaunchPractice}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Target className="w-3.5 h-3.5 text-indigo-400" />
              <span>Practice Drills</span>
            </button>
            <button
              onClick={handleLaunchAiChat}
              className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800 px-3 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              <span>Ask MetaMind AI</span>
            </button>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          {/* Previous Chapter */}
          {content.prevChapterId ? (
            <button
              onClick={handlePrevChapter}
              className="flex items-center gap-2 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-4 py-3 rounded-2xl border border-slate-700 transition-all cursor-pointer w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block font-mono">Previous Chapter</span>
                <span className="font-bold truncate max-w-[200px] block">{content.prevChapterTitle}</span>
              </div>
            </button>
          ) : (
            <div className="hidden sm:block" />
          )}

          {/* Center: Take Exam Button & Export Guide */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="secondary"
              size="md"
              onClick={handleLaunchExam}
              className="w-full sm:w-auto font-bold bg-white text-slate-900 hover:bg-slate-100 border-none cursor-pointer shadow-md"
              leftIcon={<FileCheck className="w-4 h-4 text-indigo-600" />}
            >
              Take Chapter Exam
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={handleExportStudyGuide}
              className="w-full sm:w-auto font-bold text-indigo-200 hover:text-white bg-slate-800/90 hover:bg-slate-800 border-slate-700 cursor-pointer shadow-sm"
              leftIcon={<FileDown className="w-4 h-4 text-indigo-400" />}
            >
              Export Guide PDF
            </Button>
          </div>

          {/* Next Chapter */}
          {content.nextChapterId ? (
            <button
              onClick={handleNextChapter}
              className="flex items-center justify-between gap-3 text-xs text-white bg-indigo-600 hover:bg-indigo-500 px-5 py-3 rounded-2xl font-bold transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95 w-full sm:w-auto"
            >
              <div className="text-left">
                <span className="text-[10px] text-indigo-200 block font-mono">Next Chapter</span>
                <span className="font-bold truncate max-w-[220px] block">{content.nextChapterTitle}</span>
              </div>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={handleLaunchExam}
              className="w-full sm:w-auto font-bold cursor-pointer"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Complete Course Exam
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
