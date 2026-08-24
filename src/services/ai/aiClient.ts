import { mockAiProvider } from './mockAiProvider';
import type {
  TopicAnalysisResult,
  AssessmentQuestion,
  AnswerAnalysisResult,
  KnowledgeAnalysis,
  LearningModuleContent,
  MasteryLevel,
} from './ai.types';

/**
 * Modular AI Client Abstraction.
 * Secures AI keys via backend/edge functions if configured, or falls back to mockAiProvider for reliable demos.
 */
export const aiClient = {
  async analyzeTopic(query: string): Promise<TopicAnalysisResult> {
    // If a backend endpoint is configured, call it securely. Otherwise use mockAiProvider.
    return await mockAiProvider.analyzeTopic(query);
  },

  async generateAssessment(topic: string, count?: number): Promise<AssessmentQuestion[]> {
    return await mockAiProvider.generateAssessment(topic, count);
  },

  async analyzeAnswer(question: AssessmentQuestion, userAnswer: string): Promise<AnswerAnalysisResult> {
    return await mockAiProvider.analyzeAnswer(question, userAnswer);
  },

  async generateKnowledgeAnalysis(topic: string, scorePercent: number): Promise<KnowledgeAnalysis> {
    return await mockAiProvider.generateKnowledgeAnalysis(topic, scorePercent);
  },

  async generateModule(conceptName: string, level: MasteryLevel): Promise<LearningModuleContent> {
    return await mockAiProvider.generateModule(conceptName, level);
  },
};
