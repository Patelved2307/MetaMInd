import type { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  education_level: string | null;
  field_of_study: string | null;
  institution: string | null;
  learning_goal: string | null;
  preferred_explanation_style: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface OnboardingData {
  fullName: string;
  username?: string;
  educationLevel: string;
  fieldOfStudy?: string;
  institution?: string;
  learningGoals: string[];
  preferredExplanationStyle: string;
}

export interface ProfileUpdateData {
  full_name?: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  education_level?: string;
  field_of_study?: string;
  institution?: string;
  learning_goal?: string;
  preferred_explanation_style?: string;
}
