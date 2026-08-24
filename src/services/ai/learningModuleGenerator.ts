import { aiClient } from './aiClient';
import type { LearningModuleContent, MasteryLevel } from './ai.types';

export async function generatePersonalizedModule(
  conceptName: string,
  level: MasteryLevel
): Promise<LearningModuleContent> {
  return await aiClient.generateModule(conceptName, level);
}
