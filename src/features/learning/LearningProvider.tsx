import React, { createContext, useState, useEffect } from 'react';
import type { LearningSessionData, ConceptMasteryRecord } from './learning.types';
import type {
  AssessmentQuestion,
  AnswerAnalysisResult,
  KnowledgeAnalysis,
  LearningModuleContent,
  MasteryLevel,
} from '@/services/ai/ai.types';
import { analyzeTopicQuery } from '@/services/ai/topicAnalyzer';
import { generateDiagnosticAssessment } from '@/services/ai/assessmentGenerator';
import { analyzeUserAnswer, analyzeOverallKnowledge } from '@/services/ai/answerAnalyzer';
import { generatePersonalizedModule } from '@/services/ai/learningModuleGenerator';
import { learningService } from './learning.service';
import { useAuth } from '@/features/auth';

interface LearningContextType {
  activeSession: LearningSessionData | null;
  sessions: LearningSessionData[];
  loading: boolean;
  loadingMessage: string | null;
  error: string | null;
  assessmentQuestions: AssessmentQuestion[];
  userAnswers: Record<string, string>;
  answerAnalyses: Record<string, AnswerAnalysisResult>;
  knowledgeAnalysis: KnowledgeAnalysis | null;
  activeModule: LearningModuleContent | null;
  masteryMap: Record<string, ConceptMasteryRecord>;
  startLearningJourney: (query: string) => Promise<LearningSessionData>;
  startAssessment: () => Promise<AssessmentQuestion[]>;
  submitAnswer: (questionId: string, answer: string) => Promise<AnswerAnalysisResult>;
  completeAssessment: () => Promise<KnowledgeAnalysis>;
  loadPersonalizedModule: (conceptName?: string) => Promise<LearningModuleContent>;
  completePracticeReassessment: (conceptName: string, score: number) => Promise<void>;
  selectSession: (sessionId: string) => void;
  clearError: () => void;
}

export const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || 'demo_user';

  const [activeSession, setActiveSession] = useState<LearningSessionData | null>(null);
  const [sessions, setSessions] = useState<LearningSessionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [assessmentQuestions, setAssessmentQuestions] = useState<AssessmentQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [answerAnalyses, setAnswerAnalyses] = useState<Record<string, AnswerAnalysisResult>>({});
  const [knowledgeAnalysis, setKnowledgeAnalysis] = useState<KnowledgeAnalysis | null>(null);
  const [activeModule, setActiveModule] = useState<LearningModuleContent | null>(null);
  const [masteryMap, setMasteryMap] = useState<Record<string, ConceptMasteryRecord>>({});

  // Load existing sessions on mount
  useEffect(() => {
    const loadSessions = async () => {
      const existing = await learningService.getUserSessions(userId);
      setSessions(existing);
      if (existing.length > 0 && !activeSession) {
        setActiveSession(existing[0]);
      }
    };
    loadSessions();
  }, [userId]);

  // Step 1: Start Learning Journey (Topic Analysis)
  const startLearningJourney = async (query: string): Promise<LearningSessionData> => {
    setLoading(true);
    setError(null);
    try {
      setLoadingMessage('Understanding your question...');
      await new Promise((r) => setTimeout(r, 400));

      setLoadingMessage('Identifying subject & mapping related concepts...');
      const analysis = await analyzeTopicQuery(query);

      setLoadingMessage('Preparing your personalized learning map...');
      const newSession = await learningService.createSession(userId, query, analysis);

      setActiveSession(newSession);
      setSessions((prev) => [newSession, ...prev.filter((s) => s.id !== newSession.id)]);

      // Reset previous assessment state for clean flow
      setAssessmentQuestions([]);
      setUserAnswers({});
      setAnswerAnalyses({});
      setKnowledgeAnalysis(null);

      return newSession;
    } catch (err: any) {
      setError(err.message || 'Failed to generate learning journey. Please try again.');
      throw err;
    } finally {
      setLoading(false);
      setLoadingMessage(null);
    }
  };

  // Step 2: Start Diagnostic Assessment
  const startAssessment = async (): Promise<AssessmentQuestion[]> => {
    if (!activeSession) throw new Error('No active learning session');
    setLoading(true);
    setError(null);
    try {
      setLoadingMessage('Preparing diagnostic assessment questions...');
      const questions = await generateDiagnosticAssessment(activeSession.topic);
      setAssessmentQuestions(questions);
      return questions;
    } catch (err: any) {
      setError(err.message || 'Failed to generate diagnostic assessment.');
      throw err;
    } finally {
      setLoading(false);
      setLoadingMessage(null);
    }
  };

  // Step 3: Submit Answer & Analyze
  const submitAnswer = async (questionId: string, answer: string): Promise<AnswerAnalysisResult> => {
    const question = assessmentQuestions.find((q) => q.id === questionId);
    if (!question) throw new Error('Question not found');

    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));

    const analysis = await analyzeUserAnswer(question, answer);
    setAnswerAnalyses((prev) => ({ ...prev, [questionId]: analysis }));

    return analysis;
  };

  // Step 4: Complete Assessment & Generate Knowledge Analysis
  const completeAssessment = async (): Promise<KnowledgeAnalysis> => {
    if (!activeSession) throw new Error('No active learning session');
    setLoading(true);
    setError(null);
    try {
      setLoadingMessage('Analyzing your understanding...');
      await new Promise((r) => setTimeout(r, 500));

      setLoadingMessage('Identifying concepts to strengthen...');

      const total = assessmentQuestions.length || 1;
      const correctCount = Object.values(answerAnalyses).filter((a) => a.isCorrect).length;
      const scorePercent = Math.round((correctCount / total) * 100);

      setLoadingMessage('Creating your personalized path...');
      const analysis = await analyzeOverallKnowledge(activeSession.topic, scorePercent);
      setKnowledgeAnalysis(analysis);

      return analysis;
    } catch (err: any) {
      setError(err.message || 'Failed to analyze knowledge gap.');
      throw err;
    } finally {
      setLoading(false);
      setLoadingMessage(null);
    }
  };

  // Step 5: Load Personalized Module
  const loadPersonalizedModule = async (conceptName?: string): Promise<LearningModuleContent> => {
    setLoading(true);
    setError(null);
    try {
      const targetConcept = conceptName || knowledgeAnalysis?.recommendedPath[0] || activeSession?.topic || 'SQL JOINs';
      setLoadingMessage(`Adapting explanation for ${targetConcept}...`);

      const currentMastery = masteryMap[targetConcept]?.status || 'DEVELOPING';
      const moduleContent = await generatePersonalizedModule(targetConcept, currentMastery as MasteryLevel);

      setActiveModule(moduleContent);
      return moduleContent;
    } catch (err: any) {
      setError(err.message || 'Failed to load personalized module.');
      throw err;
    } finally {
      setLoading(false);
      setLoadingMessage(null);
    }
  };

  // Step 6: Complete Targeted Practice & Reassessment
  const completePracticeReassessment = async (conceptName: string, score: number) => {
    setLoading(true);
    try {
      setLoadingMessage('Updating concept mastery and session progress...');
      const record = await learningService.updateConceptMastery(userId, conceptName, score);

      setMasteryMap((prev) => ({ ...prev, [conceptName]: record }));

      if (activeSession) {
        const updatedSession = { ...activeSession, progressPercent: Math.min(score, 100) };
        setActiveSession(updatedSession);
        setSessions((prev) => prev.map((s) => (s.id === updatedSession.id ? updatedSession : s)));
      }
    } finally {
      setLoading(false);
      setLoadingMessage(null);
    }
  };

  const selectSession = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setActiveSession(session);
    }
  };

  const clearError = () => setError(null);

  return (
    <LearningContext.Provider
      value={{
        activeSession,
        sessions,
        loading,
        loadingMessage,
        error,
        assessmentQuestions,
        userAnswers,
        answerAnalyses,
        knowledgeAnalysis,
        activeModule,
        masteryMap,
        startLearningJourney,
        startAssessment,
        submitAnswer,
        completeAssessment,
        loadPersonalizedModule,
        completePracticeReassessment,
        selectSession,
        clearError,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};
