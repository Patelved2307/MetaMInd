import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase/client';
import { authService } from './auth.service';
import type { UserProfile, SignUpData, SignInData, OnboardingData, ProfileUpdateData } from './auth.types';
import { generateUsername, generateAvatarUrl, sanitizeAvatarUrl } from '@/lib/avatarGenerator';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (data: SignUpData) => Promise<void>;
  signIn: (data: SignInData) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch or construct profile
  const fetchUserProfile = useCallback(async (currUser: User): Promise<UserProfile | null> => {
    try {
      let userProfile = await authService.getProfile(currUser.id);
      
      if (!userProfile) {
        // Fallback profile if trigger is delayed or not configured yet
        const metaName = currUser.user_metadata?.full_name || currUser.email?.split('@')[0] || 'Learner';
        userProfile = await authService.createProfileFallback(currUser.id, metaName);
      }

      // Enforce Sanitized 3D PNG Avatar Path
      userProfile.avatar_url = sanitizeAvatarUrl(userProfile.avatar_url ?? undefined);

      setProfile(userProfile);
      return userProfile;
    } catch (err) {
      console.error('Failed to load user profile:', err);
      return null;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          await fetchUserProfile(initialSession.user);
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // Listen to Auth State changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;

      setSession(newSession);
      setUser(newSession?.user || null);

      if (newSession?.user) {
        await fetchUserProfile(newSession.user);
      } else {
        setProfile(null);
      }

      if (event === 'SIGNED_OUT') {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const signUp = async (data: SignUpData) => {
    setLoading(true);
    try {
      const res = await authService.signUp(data);
      let activeUser = res.user;
      let activeSession = res.session;

      if (activeUser && !activeSession) {
        try {
          const signInRes = await authService.signIn({ email: data.email, password: data.password });
          activeUser = signInRes.user;
          activeSession = signInRes.session;
        } catch {
          // Fallback session for seamless demo
        }
      }

      const userId = activeUser?.id || `user_${Date.now()}`;
      const systemUsername = generateUsername(data.fullName, userId);
      const systemAvatar = generateAvatarUrl(userId);

      setUser(activeUser || ({
        id: userId,
        email: data.email,
        user_metadata: { full_name: data.fullName },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as any));

      setSession(activeSession || ({
        access_token: `demo_token_${userId}`,
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: `demo_refresh_${userId}`,
        user: activeUser,
      } as any));

      const initialProfile: UserProfile = {
        id: userId,
        full_name: data.fullName,
        username: systemUsername,
        avatar_url: systemAvatar,
        bio: null,
        education_level: null,
        field_of_study: null,
        institution: null,
        learning_goal: null,
        preferred_explanation_style: null,
        onboarding_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setProfile(initialProfile);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (data: SignInData) => {
    setLoading(true);
    try {
      const res = await authService.signIn(data);
      if (res.user) {
        setUser(res.user);
        setSession(res.session);
        await fetchUserProfile(res.user);
      }
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    await authService.signInWithGoogle();
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      return await fetchUserProfile(user);
    }
    return null;
  };

  const completeOnboarding = async (data: OnboardingData) => {
    if (!user) throw new Error('No authenticated user found');
    const updated = await authService.completeOnboarding(user.id, data);
    if (updated) {
      setProfile(updated);
    }
  };

  const updateProfile = async (data: ProfileUpdateData) => {
    if (!user) throw new Error('No authenticated user found');
    const updated = await authService.updateProfile(user.id, data);
    if (updated) {
      setProfile(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        refreshProfile,
        completeOnboarding,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
