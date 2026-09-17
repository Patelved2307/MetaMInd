-- ==============================================================================
-- METAMIND — EXTENDED PLATFORM SCHEMA MIGRATION
-- Covers: AI Chat History, Gamified Badges, Certificates, Peer Study Rooms,
-- User Tasks, Study Streaks, and Bookmarks.
-- ==============================================================================

-- 1. AI CHAT SESSIONS
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Discussion',
  plugin_id TEXT NOT NULL DEFAULT 'concept-explainer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AI CHAT MESSAGES & COGNITIVE DIAGNOSTICS
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant')),
  content TEXT NOT NULL,
  diagnostic_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MASTER BADGES CATALOG
CREATE TABLE IF NOT EXISTS public.badges (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  banner_text TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Mastery', 'Streak', 'Exam', 'Squad', 'Special')),
  tier TEXT NOT NULL CHECK (tier IN ('Diamond', 'Gold', 'Royal Purple', 'Emerald')),
  description TEXT NOT NULL,
  xp_reward INT DEFAULT 100,
  icon_name TEXT NOT NULL,
  icon_bg TEXT NOT NULL,
  banner_bg TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USER UNLOCKED BADGES
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  xp_awarded INT DEFAULT 100,
  UNIQUE(user_id, badge_id)
);

-- 5. VERIFIED CERTIFICATES
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  topic TEXT NOT NULL,
  subject TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  score_percent NUMERIC NOT NULL,
  verification_code TEXT NOT NULL UNIQUE,
  avatar_theme_name TEXT DEFAULT 'Cyber Skeleton',
  template_style TEXT DEFAULT 'classic' CHECK (template_style IN ('classic', 'geometric', 'modern', 'minimal')),
  metadata JSONB,
  issued_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PEER GROUP STUDY ROOMS
CREATE TABLE IF NOT EXISTS public.study_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  host_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  room_code TEXT NOT NULL UNIQUE,
  pomodoro_duration_mins INT DEFAULT 25,
  break_duration_mins INT DEFAULT 5,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. STUDY ROOM PARTICIPANTS
CREATE TABLE IF NOT EXISTS public.room_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.study_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('host', 'member')),
  status TEXT DEFAULT 'focusing' CHECK (status IN ('focusing', 'break', 'asking')),
  current_streak INT DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- 8. STUDY ROOM DOUBTS & SCRATCHPAD
CREATE TABLE IF NOT EXISTS public.room_doubts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.study_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  doubt_text TEXT NOT NULL,
  is_solved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. USER DASHBOARD TASKS
CREATE TABLE IF NOT EXISTS public.user_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  tag TEXT DEFAULT 'General',
  is_completed BOOLEAN DEFAULT FALSE,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. USER STUDY STREAKS & FOCUS METRICS
CREATE TABLE IF NOT EXISTS public.study_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_streak INT DEFAULT 1,
  longest_streak INT DEFAULT 1,
  total_focus_minutes INT DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. USER BOOKMARKS & SAVED NOTES
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('concept', 'question', 'doubt', 'study_guide')),
  item_id TEXT NOT NULL,
  title TEXT NOT NULL,
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON public.certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_code ON public.certificates(verification_code);
CREATE INDEX IF NOT EXISTS idx_study_rooms_code ON public.study_rooms(room_code);
CREATE INDEX IF NOT EXISTS idx_room_participants_room ON public.room_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_room_doubts_room ON public.room_doubts(room_id);
CREATE INDEX IF NOT EXISTS idx_user_tasks_user ON public.user_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_doubts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- 1. Chat Policies
CREATE POLICY "Users can manage own chat sessions" ON public.chat_sessions
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own chat messages" ON public.chat_messages
  USING (auth.uid() = user_id);

-- 2. Badges Policies (Public Read, User Badges private to owner)
CREATE POLICY "Anyone can view master badges catalog" ON public.badges
  FOR SELECT USING (true);

CREATE POLICY "Users can view and manage own badges" ON public.user_badges
  USING (auth.uid() = user_id);

-- 3. Certificates Policies (Public read via verification_code, owner can insert/update)
CREATE POLICY "Public can view verified certificates" ON public.certificates
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own certificates" ON public.certificates
  FOR ALL USING (auth.uid() = user_id);

-- 4. Study Rooms Policies
CREATE POLICY "Authenticated users can view active study rooms" ON public.study_rooms
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Room hosts can manage own rooms" ON public.study_rooms
  FOR ALL USING (auth.uid() = host_user_id);

CREATE POLICY "Room participants can view and join rooms" ON public.room_participants
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Room members can view and post room doubts" ON public.room_doubts
  FOR ALL USING (auth.role() = 'authenticated');

-- 5. User Tasks & Streaks Policies
CREATE POLICY "Users can manage own tasks" ON public.user_tasks
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view and update own study streak" ON public.study_streaks
  USING (auth.uid() = user_id);

-- 6. Bookmarks Policies
CREATE POLICY "Users can manage own bookmarks" ON public.bookmarks
  USING (auth.uid() = user_id);

-- ==============================================================================
-- INITIAL SEED DATA: MASTER BADGES CATALOG
-- ==============================================================================
INSERT INTO public.badges (id, title, banner_text, category, tier, description, xp_reward, icon_name, icon_bg, banner_bg)
VALUES
  ('badge-1', 'GoodMates Apex', 'SQUAD LEADER', 'Squad', 'Royal Purple', 'Hosted a 25m Pomodoro group study session with 4+ active classmates.', 300, 'Crown', 'from-amber-400 to-amber-600', 'bg-amber-500'),
  ('badge-2', 'Verified Writer', 'VERIFIED WRITER', 'Mastery', 'Diamond', 'Submitted 5 detailed module practice assignments with 100% accuracy.', 250, 'PenTool', 'from-blue-500 to-cyan-500', 'bg-blue-600'),
  ('badge-3', 'Good Skill & Speed', 'SPEED REFILL', 'Exam', 'Emerald', 'Completed a 15-minute Timed Exam with zero lost lives and >90% score.', 200, 'Zap', 'from-emerald-400 to-teal-600', 'bg-emerald-500'),
  ('badge-4', 'Study Flame Titan', 'STREAK MASTER', 'Streak', 'Gold', 'Maintained a consecutive 7-day study streak with >60 minutes focused each day.', 350, 'Flame', 'from-rose-500 to-orange-500', 'bg-rose-500'),
  ('badge-5', 'Bug Bounty Hunter', 'ROOT CAUSE PRO', 'Mastery', 'Diamond', 'Resolved 10 complex debugging scenarios in the AI Diagnostic Workspace.', 280, 'ShieldCheck', 'from-indigo-500 to-purple-600', 'bg-indigo-600'),
  ('badge-6', 'System Architect', 'SCALING MASTER', 'Special', 'Royal Purple', 'Mastered all Distributed System Design modules and CAP Theorem tradeoffs.', 400, 'Trophy', 'from-purple-500 to-pink-600', 'bg-purple-600')
ON CONFLICT (id) DO NOTHING;
