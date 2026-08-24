import { aiClient } from './aiClient';
import type { AssessmentQuestion, AnswerAnalysisResult, KnowledgeAnalysis } from './ai.types';

export async function analyzeUserAnswer(
  question: AssessmentQuestion,
  answer: string
): Promise<AnswerAnalysisResult> {
  return await aiClient.analyzeAnswer(question, answer);
}

export async function analyzeOverallKnowledge(
  topic: string,
  scorePercent: number
): Promise<KnowledgeAnalysis> {
  return await aiClient.generateKnowledgeAnalysis(topic, scorePercent);
}
