export type PluginId =
  | 'concept-explainer'
  | 'code-debugger'
  | 'exam-coach'
  | 'math-logic'
  | 'math-latex'
  | 'code-runner'
  | 'diagram-architect'
  | 'flashcard-gen'
  | 'academic-scholar'
  | 'socratic-tutor'
  | 'eli5-analogy'
  | 'mnemonic-master'
  | 'feynman-coach'
  | 'mock-interviewer'
  | 'polyglot-translator'
  | string;

export interface ChatPlugin {
  id: PluginId;
  name: string;
  icon: string;
  description: string;
  badge: string;
  category?: 'Core' | 'STEM & Math' | 'Engineering' | 'Active Recall' | 'Research' | 'Customization' | 'Custom';
  isInstalled?: boolean;
  isEnabled?: boolean;
  downloadsCount?: string;
  version?: string;
  author?: string;
  features?: string[];
  isCustom?: boolean;
  customPrompt?: string;
}

export interface ChatAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  content?: string;
}

export type QuestionScenarioType =
  | 'CONCEPTUAL_EXPLANATION'
  | 'COMPARISON_TRADEOFF'
  | 'DEBUGGING_ROOT_CAUSE'
  | 'CODE_IMPLEMENTATION'
  | 'SYSTEM_DESIGN_SCENARIO'
  | 'INTERVIEW_DRILL'
  | 'STEP_BY_STEP_WALKTHROUGH'
  | 'BEST_PRACTICES_SECURITY'
  | 'DIAGNOSTIC_QUIZ'
  | 'GENERAL_LEARNING_GUIDANCE';

export interface PredictedScenario {
  type: QuestionScenarioType;
  label: string;
  badge: string;
  icon: string;
  confidenceScore: number;
  reasoning: string;
}

export interface QuickCheckQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CognitiveDiagnostic {
  doubtSummary: string;
  weakness: string;
  strength: string;
  confidenceScore: number; // 0 to 100
  confidenceLevel: 'Low' | 'Moderate' | 'High' | 'Mastery';
  keyTakeaways: string[];
  quickCheck: QuickCheckQuestion[];
  topic: string;
  subject?: string;
  scenario?: PredictedScenario;
  followUpPrompts?: string[];
  activePluginData?: {
    pluginId: PluginId;
    title: string;
    details: string;
    items?: string[];
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  diagnostic?: CognitiveDiagnostic;
  selectedQuizAnswer?: { [questionId: string]: number };
  attachments?: ChatAttachment[];
}

export interface ChatSession {
  id: string;
  title: string;
  pluginId: PluginId;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  pinned?: boolean;
  sharedId?: string;
  sharedAt?: string;
}
