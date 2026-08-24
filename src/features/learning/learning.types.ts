import type {
  TopicAnalysisResult,
  MasteryLevel,
  ConceptStatus,
} from '@/services/ai/ai.types';

export interface LearningSessionData {
  id: string;
  userId: string;
  title: string;
  subject: string;
  topic: string;
  originalQuery: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  progressPercent: number;
  createdAt: string;
  analysis: TopicAnalysisResult;
}

export interface SessionConceptNode {
  id: string;
  sessionId: string;
  name: string;
  type: 'prerequisite' | 'core' | 'related' | 'advanced';
  status: ConceptStatus;
  masteryScore: number;
}

export interface ConceptMasteryRecord {
  conceptName: string;
  score: number;
  evidenceCount: number;
  status: MasteryLevel;
  lastAssessedAt: string;
}
