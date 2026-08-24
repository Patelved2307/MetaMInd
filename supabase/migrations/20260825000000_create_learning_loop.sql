-- ==============================================================================
-- AETHER LEARN — PHASE 3 CORE ADAPTIVE LEARNING LOOP MIGRATION
-- ==============================================================================

-- 1. LEARNING SESSIONS
CREATE TABLE IF NOT EXISTS public.learning_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  original_query TEXT NOT NULL,
  status TEXT DEFAULT 'IN_PROGRESS',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CONCEPTS DICTIONARY
CREATE TABLE IF NOT EXISTS public.concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  subject TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SESSION CONCEPTS (Knowledge Map Nodes)
CREATE TABLE IF NOT EXISTS public.session_concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.learning_sessions(id) ON DELETE CASCADE,
  concept_id UUID REFERENCES public.concepts(id) ON DELETE SET NULL,
  concept_name TEXT NOT NULL,
  relationship_type TEXT CHECK (relationship_type IN ('prerequisite', 'core', 'related', 'advanced')),
  status TEXT DEFAULT 'NOT_STARTED' CHECK (status IN ('LOCKED', 'NOT_STARTED', 'IN_PROGRESS', 'IMPROVING', 'MASTERED', 'WEAK')),
  sequence_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DIAGNOSTIC ASSESSMENTS
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.learning_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_type TEXT DEFAULT 'DIAGNOSTIC',
  status TEXT DEFAULT 'STARTED',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 5. QUESTIONS
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  concept_id UUID REFERENCES public.concepts(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  question_type TEXT DEFAULT 'MULTIPLE_CHOICE' CHECK (question_type IN ('MULTIPLE_CHOICE', 'SHORT_ANSWER', 'SCENARIO')),
  options JSONB,
  correct_answer TEXT NOT NULL,
  difficulty TEXT DEFAULT 'intermediate' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'challenge')),
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ATTEMPTS
CREATE TABLE IF NOT EXISTS public.attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  analysis JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CONCEPT MASTERY
CREATE TABLE IF NOT EXISTS public.concept_mastery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  concept_id UUID REFERENCES public.concepts(id) ON DELETE CASCADE,
  concept_name TEXT NOT NULL,
  mastery_score INT DEFAULT 0 CHECK (mastery_score BETWEEN 0 AND 100),
  evidence_count INT DEFAULT 0,
  status TEXT DEFAULT 'NEEDS_FOUNDATION' CHECK (status IN ('NEEDS_FOUNDATION', 'DEVELOPING', 'COMPETENT', 'MASTERED')),
  last_assessed_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, concept_name)
);

-- 8. LEARNING MODULES
CREATE TABLE IF NOT EXISTS public.learning_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.learning_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  concept_id UUID REFERENCES public.concepts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  explanation_level TEXT DEFAULT 'DEVELOPING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PROGRESS EVENTS
CREATE TABLE IF NOT EXISTS public.progress_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.learning_sessions(id) ON DELETE CASCADE,
  concept_id UUID REFERENCES public.concepts(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concept_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_events ENABLE ROW LEVEL SECURITY;

-- Session & Data RLS Policies
CREATE POLICY "Users can manage own sessions" ON public.learning_sessions USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own assessments" ON public.assessments USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own attempts" ON public.attempts USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own concept mastery" ON public.concept_mastery USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own learning modules" ON public.learning_modules USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own progress events" ON public.progress_events USING (auth.uid() = user_id);
