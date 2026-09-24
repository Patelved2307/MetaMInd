import { mockAiProvider } from './mockAiProvider';
import type {
  TopicAnalysisResult,
  AssessmentQuestion,
  AnswerAnalysisResult,
  KnowledgeAnalysis,
  LearningModuleContent,
  MasteryLevel,
} from './ai.types';

const BACKEND_URL = 'http://localhost:3001/api/ai';

// In-memory cache for questions generated during diagnose step
const assessmentCache = new Map<string, AssessmentQuestion[]>();

/**
 * Modular AI Client Abstraction.
 * Connects directly to the local Llama 3.1 inference bridge (port 3001),
 * with automatic fallback to mockAiProvider if the bridge is offline.
 */
export const aiClient = {
  /** Check if the local Llama bridge is running */
  async isBridgeOnline(): Promise<boolean> {
    try {
      const res = await fetch('http://localhost:3001/api/health', { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  },

  async analyzeTopic(query: string): Promise<TopicAnalysisResult> {
    try {
      const res = await fetch(`${BACKEND_URL}/diagnose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (res.ok) {
        const data = await res.json();
        const topic = data.topic || query;
        const subject = data.subject || 'Academic Science & Technology';
        const prerequisite = data.prerequisite || 'Prerequisite Foundations';

        // Cache questions for subsequent generateAssessment call
        if (Array.isArray(data.questions) && data.questions.length > 0) {
          const mappedQuestions: AssessmentQuestion[] = data.questions.map((q: any, idx: number) => ({
            id: q.id || `q_${Date.now()}_${idx}`,
            conceptName: q.conceptName || topic,
            question: q.question,
            questionType: 'MULTIPLE_CHOICE',
            options: q.options || [],
            correctAnswer: q.correctAnswer || (q.options ? q.options[0] : ''),
            difficulty: idx === 0 ? 'beginner' : 'intermediate',
            explanation: q.explanation || 'Diagnostic concept probe',
          }));
          assessmentCache.set(topic.toLowerCase(), mappedQuestions);
          assessmentCache.set(query.toLowerCase(), mappedQuestions);
        }

        return {
          subject,
          topic,
          description: `Diagnosing core concept "${topic}" with prerequisite "${prerequisite}".`,
          concepts: [
            {
              name: prerequisite,
              type: 'prerequisite',
              description: `Baseline foundational concept necessary to master ${topic}.`,
              status: 'IN_PROGRESS',
            },
            {
              name: topic,
              type: 'core',
              description: `The primary concept under diagnosis.`,
              status: 'IN_PROGRESS',
            },
          ],
        };
      }
    } catch (err) {
      console.warn('Local Llama bridge unavailable, falling back to mock provider:', err);
    }

    return await mockAiProvider.analyzeTopic(query);
  },

  async generateAssessment(topic: string, count?: number): Promise<AssessmentQuestion[]> {
    // Check if questions were cached from the diagnose step
    const cached = assessmentCache.get(topic.toLowerCase());
    if (cached && cached.length > 0) {
      return cached;
    }

    // Otherwise attempt to generate fresh via diagnose endpoint
    try {
      const res = await fetch(`${BACKEND_URL}/diagnose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: topic }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.questions) && data.questions.length > 0) {
          return data.questions.map((q: any, idx: number) => ({
            id: q.id || `q_${Date.now()}_${idx}`,
            conceptName: q.conceptName || topic,
            question: q.question,
            questionType: 'MULTIPLE_CHOICE',
            options: q.options || [],
            correctAnswer: q.correctAnswer || (q.options ? q.options[0] : ''),
            difficulty: idx === 0 ? 'beginner' : 'intermediate',
            explanation: q.explanation || 'Diagnostic concept probe',
          }));
        }
      }
    } catch (err) {
      console.warn('Assessment generation via bridge failed, using mock:', err);
    }

    return await mockAiProvider.generateAssessment(topic, count);
  },

  async analyzeAnswer(
    question: AssessmentQuestion,
    userAnswer: string,
    confidence: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<AnswerAnalysisResult> {
    try {
      const res = await fetch(`${BACKEND_URL}/evaluate-and-explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: question.conceptName,
          question,
          userAnswer,
          confidence,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          isCorrect: !!data.isCorrect,
          confidence,
          misconception: data.misconception || undefined,
          affectedConcepts: [question.conceptName],
          recommendedAction:
            data.tailoredExplanation ||
            (data.isCorrect
              ? 'Advance to higher-difficulty application scenarios.'
              : 'Review prerequisite concepts.'),
          newDifficultyEstimate: data.isCorrect ? 'advanced' : 'beginner',
        };
      }
    } catch (err) {
      console.warn('Answer analysis via bridge failed, using mock:', err);
    }

    return await mockAiProvider.analyzeAnswer(question, userAnswer);
  },

  async generateKnowledgeAnalysis(topic: string, scorePercent: number): Promise<KnowledgeAnalysis> {
    return await mockAiProvider.generateKnowledgeAnalysis(topic, scorePercent);
  },

  async generateModule(conceptName: string, level: MasteryLevel): Promise<LearningModuleContent> {
    return await mockAiProvider.generateModule(conceptName, level);
  },
};
