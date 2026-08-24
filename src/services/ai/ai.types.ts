export type RelationshipType = 'prerequisite' | 'core' | 'related' | 'advanced';
export type ConceptStatus = 'LOCKED' | 'NOT_STARTED' | 'IN_PROGRESS' | 'IMPROVING' | 'MASTERED' | 'WEAK';
export type MasteryLevel = 'NEEDS_FOUNDATION' | 'DEVELOPING' | 'COMPETENT' | 'MASTERED';
export type QuestionDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'challenge';
export type QuestionType = 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'SCENARIO';

export interface ConceptNode {
  name: string;
  type: RelationshipType;
  description?: string;
  status?: ConceptStatus;
}

export interface TopicAnalysisResult {
  subject: string;
  topic: string;
  description: string;
  concepts: ConceptNode[];
}

export interface AssessmentQuestion {
  id: string;
  conceptName: string;
  question: string;
  questionType: QuestionType;
  options?: string[];
  correctAnswer: string;
  difficulty: QuestionDifficulty;
  explanation: string;
}

export interface AnswerAnalysisResult {
  isCorrect: boolean;
  confidence: 'low' | 'medium' | 'high';
  misconception?: string;
  affectedConcepts: string[];
  recommendedAction: string;
  newDifficultyEstimate: QuestionDifficulty;
}

export interface KnowledgeAnalysis {
  topic: string;
  strongConcepts: string[];
  needsImprovementConcepts: string[];
  mainKnowledgeGap: string;
  recommendedPath: string[];
}

export interface LearningModuleContent {
  conceptName: string;
  explanationLevel: MasteryLevel;
  title: string;
  explanation: string;
  example: {
    title: string;
    scenario: string;
    codeOrDiagram?: string;
    explanation: string;
  };
  keyIdea: string;
  tryItQuestion: {
    question: string;
    options?: string[];
    answer: string;
    explanation: string;
  };
}
