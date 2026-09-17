export type PluginId = 'concept-explainer' | 'code-debugger' | 'exam-coach' | 'math-logic';

export interface ChatPlugin {
  id: PluginId;
  name: string;
  icon: string;
  description: string;
  badge: string;
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
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  diagnostic?: CognitiveDiagnostic;
  selectedQuizAnswer?: { [questionId: string]: number };
}

export interface ChatSession {
  id: string;
  title: string;
  pluginId: PluginId;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}
