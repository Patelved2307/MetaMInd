import { aiClient } from './aiClient';
import type { TopicAnalysisResult } from './ai.types';

export async function analyzeTopicQuery(query: string): Promise<TopicAnalysisResult> {
  if (!query || !query.trim()) {
    throw new Error('Please enter a doubt or topic you want to understand.');
  }
  return await aiClient.analyzeTopic(query.trim());
}
