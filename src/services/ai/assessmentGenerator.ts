import { aiClient } from './aiClient';
import type { AssessmentQuestion } from './ai.types';

export async function generateDiagnosticAssessment(topic: string, count = 4): Promise<AssessmentQuestion[]> {
  return await aiClient.generateAssessment(topic, count);
}
