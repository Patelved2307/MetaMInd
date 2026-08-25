import { supabase } from '@/services/supabase/client';
import type { LearningSessionData, ConceptMasteryRecord } from './learning.types';
import type { TopicAnalysisResult, MasteryLevel } from '@/services/ai/ai.types';

const SESSIONS_STORAGE_KEY = 'metamind_learning_sessions_v1';
const MASTERY_STORAGE_KEY = 'metamind_concept_mastery_v1';

export const learningService = {
  // Get active sessions for user
  async getUserSessions(userId: string): Promise<LearningSessionData[]> {
    try {
      const { data, error } = await supabase
        .from('learning_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) throw error;
      return data.map((s: any) => ({
        id: s.id,
        userId: s.user_id,
        title: s.title,
        subject: s.subject,
        topic: s.topic,
        originalQuery: s.original_query,
        status: s.status,
        progressPercent: s.status === 'COMPLETED' ? 100 : 45,
        createdAt: s.created_at,
        analysis: s.metadata?.analysis || {
          subject: s.subject,
          topic: s.topic,
          description: s.title,
          concepts: [],
        },
      }));
    } catch {
      // LocalStorage Fallback
      const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore
        }
      }
      return [];
    }
  },

  // Create new learning session
  async createSession(
    userId: string,
    query: string,
    analysis: TopicAnalysisResult
  ): Promise<LearningSessionData> {
    const newSession: LearningSessionData = {
      id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      title: `Understanding ${analysis.topic}`,
      subject: analysis.subject,
      topic: analysis.topic,
      originalQuery: query,
      status: 'IN_PROGRESS',
      progressPercent: 35,
      createdAt: new Date().toISOString(),
      analysis,
    };

    try {
      await supabase.from('learning_sessions').insert({
        id: newSession.id.startsWith('sess_') ? undefined : newSession.id,
        user_id: userId,
        title: newSession.title,
        subject: newSession.subject,
        topic: newSession.topic,
        original_query: query,
        status: 'IN_PROGRESS',
      });
    } catch {
      console.warn('Session database sync fallback active.');
    }

    // Persist in local storage
    const existing = await this.getUserSessions(userId);
    const updated = [newSession, ...existing.filter((s) => s.id !== newSession.id)];
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated));

    return newSession;
  },

  // Save concept mastery update
  async updateConceptMastery(
    userId: string,
    conceptName: string,
    newScore: number
  ): Promise<ConceptMasteryRecord> {
    let status: MasteryLevel = 'NEEDS_FOUNDATION';
    if (newScore >= 85) status = 'MASTERED';
    else if (newScore >= 70) status = 'COMPETENT';
    else if (newScore >= 40) status = 'DEVELOPING';

    const record: ConceptMasteryRecord = {
      conceptName,
      score: newScore,
      evidenceCount: 1,
      status,
      lastAssessedAt: new Date().toISOString(),
    };

    try {
      await supabase.from('concept_mastery').upsert({
        user_id: userId,
        concept_name: conceptName,
        mastery_score: newScore,
        status,
        updated_at: new Date().toISOString(),
      });
    } catch {
      // LocalStorage fallback
    }

    const storedMastery = localStorage.getItem(MASTERY_STORAGE_KEY);
    let masteryMap: Record<string, ConceptMasteryRecord> = {};
    if (storedMastery) {
      try {
        masteryMap = JSON.parse(storedMastery);
      } catch {
        // ignore
      }
    }
    masteryMap[conceptName] = record;
    localStorage.setItem(MASTERY_STORAGE_KEY, JSON.stringify(masteryMap));

    return record;
  },
};
